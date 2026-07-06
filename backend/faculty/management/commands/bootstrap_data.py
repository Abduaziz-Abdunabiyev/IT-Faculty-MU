"""
Seed the database from the committed fixtures — but ONLY when it is still empty.

This is meant to run on every deploy (e.g. as part of a Railway pre-deploy
command, right after `migrate`). On the very first deploy the database has no
users, so the fixtures are loaded. On every deploy after that it detects existing
data and does nothing, so it never overwrites content edited through the admin.

    python manage.py migrate && python manage.py bootstrap_data
"""

import os

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.core.management.base import BaseCommand

FIXTURES = ["accounts_data.json", "faculty_data.json"]


class Command(BaseCommand):
    help = "Load initial fixtures once, only if the database is still empty."

    def add_arguments(self, parser):
        parser.add_argument(
            "--force",
            action="store_true",
            help="Load the fixtures even if data already exists.",
        )

    def handle(self, *args, **options):
        User = get_user_model()

        if User.objects.exists() and not options["force"]:
            self.stdout.write(
                "Database already has data — skipping fixture load. "
                "(use --force to load anyway)"
            )
            return

        paths = []
        for name in FIXTURES:
            path = os.path.join(settings.BASE_DIR, name)
            if not os.path.isfile(path):
                self.stderr.write(self.style.WARNING(f"Fixture not found: {path}"))
                continue
            paths.append(path)

        if not paths:
            self.stderr.write(self.style.ERROR("No fixtures found to load."))
            return

        self.stdout.write(f"Empty database — loading {len(paths)} fixture(s)...")
        call_command("loaddata", *paths)
        self.stdout.write(self.style.SUCCESS("Initial data loaded."))
