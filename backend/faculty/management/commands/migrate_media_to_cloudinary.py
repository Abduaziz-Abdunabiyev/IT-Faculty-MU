"""
One-off migration: move the media files that ship in the repo onto Cloudinary
and re-point the existing database rows at them.

Why this exists
---------------
The images committed under ``backend/media/`` are referenced by rows already in
the database (e.g. a Partner row whose ``logo`` == ``partners/partner1.png``).

``django-cloudinary-storage`` uploads a file under a *new*, Cloudinary-generated
public id (e.g. ``media/partners/partner1_ab12cd``) and returns that name — which
is what must be stored on the model. So a plain re-upload is not enough: each row
has to be updated to the name Cloudinary handed back, otherwise ``obj.logo.url``
would point at a public id that does not exist and 404.

This command walks every ``FileField`` / ``ImageField`` on every model, and for
each row whose file is NOT yet on Cloudinary:
  1. reads the matching file from local disk (present in the repo / container),
  2. uploads it through the configured storage,
  3. writes the returned Cloudinary name back onto the row.

It is idempotent: rows whose file already resolves on Cloudinary are skipped, so
it is safe to run on every deploy.

Run it where BOTH the production database and the repo's ``backend/media`` files
are reachable — i.e. inside the Railway deployment (a Pre-deploy Command):

    python manage.py migrate_media_to_cloudinary            # do it
    python manage.py migrate_media_to_cloudinary --dry-run  # just report
"""

import os

from django.apps import apps
from django.conf import settings
from django.core.files import File
from django.core.management.base import BaseCommand
from django.db.models import FileField


class Command(BaseCommand):
    help = "Upload repo media to Cloudinary and re-point DB rows at the new names."

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Report what would change without uploading or touching the DB.",
        )

    def handle(self, *args, **options):
        dry_run = options["dry_run"]

        if not getattr(settings, "USE_CLOUDINARY", False):
            self.stderr.write(
                self.style.WARNING(
                    "Cloudinary credentials are not configured "
                    "(CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET). "
                    "Default storage is the local filesystem — nothing to do."
                )
            )
            return

        media_root = str(settings.MEDIA_ROOT)
        migrated = already = missing = failed = 0

        for model in apps.get_models():
            file_fields = [
                f for f in model._meta.get_fields() if isinstance(f, FileField)
            ]
            if not file_fields:
                continue

            for obj in model.objects.all().iterator():
                for field in file_fields:
                    fieldfile = getattr(obj, field.name)
                    if not fieldfile or not fieldfile.name:
                        continue

                    name = fieldfile.name
                    label = f"{model.__name__}.{field.name} (pk={obj.pk})"
                    storage = fieldfile.storage

                    # Already on Cloudinary? Then the file resolves — skip.
                    try:
                        if storage.exists(name):
                            already += 1
                            continue
                    except Exception:
                        # exists() can be flaky; fall through and try to migrate.
                        pass

                    local_path = os.path.join(media_root, name)
                    if not os.path.isfile(local_path):
                        self.stderr.write(
                            self.style.WARNING(f"MISSING on disk: {label} -> {name}")
                        )
                        missing += 1
                        continue

                    self.stdout.write(f"Migrating {label}: {name}")
                    if dry_run:
                        migrated += 1
                        continue

                    try:
                        with open(local_path, "rb") as fh:
                            # storage.save() does NOT re-apply upload_to; it
                            # uploads and returns the real Cloudinary name.
                            new_name = storage.save(name, File(fh))
                        if new_name != name:
                            setattr(obj, field.name, new_name)
                            obj.save(update_fields=[field.name])
                        migrated += 1
                    except Exception as exc:  # noqa: BLE001 - report and continue
                        self.stderr.write(self.style.ERROR(f"  FAILED {label}: {exc}"))
                        failed += 1

        style = self.style.SUCCESS if not failed else self.style.WARNING
        self.stdout.write(
            style(
                "Done. "
                f"migrated={migrated} "
                f"already_on_cloudinary={already} "
                f"missing_on_disk={missing} "
                f"failed={failed}"
                + (" (dry-run, nothing changed)" if dry_run else "")
            )
        )
