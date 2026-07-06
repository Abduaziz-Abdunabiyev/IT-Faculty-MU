"""
Custom Cloudinary media storage.

``cloudinary_storage.MediaCloudinaryStorage`` uploads *every* file as an ``image``
resource. That is wrong for the documents this project stores (``.pdf`` / ``.docx``
on the various ``FileField``s): a PDF uploaded as an image cannot be delivered and
returns 401/404.

This storage picks the Cloudinary ``resource_type`` per file from its extension:
  - images (png/jpg/jfif/webp/...) -> ``image``
  - videos (mp4/mov/...)           -> ``video``
  - everything else (pdf/docx/...) -> ``raw``

Key subtlety: after upload Cloudinary strips the extension from an *image* public
id (raw files keep theirs). So a *stored* image name has no extension. When
``url()`` / ``exists()`` re-derive the resource type from that stored name we must
map "no extension" back to ``image`` — otherwise the image would be looked up as a
raw file and 404. Raw files always keep their extension, so they are unambiguous.
"""

from cloudinary_storage import app_settings
from cloudinary_storage.storage import MediaCloudinaryStorage, RESOURCE_TYPES

# NOTE on ``.jfif``: Cloudinary cannot *deliver* a URL ending in ``.jfif`` as an
# image (it is not a valid delivery format), which would 404 for the handful of
# committed ``.jfif`` files whose DB names keep that extension. So ``.jfif`` is
# intentionally left OUT of the image set and falls through to ``raw`` below —
# raw delivery returns the original bytes, which an <img> tag renders fine.
IMAGE_EXTENSIONS = set(app_settings.STATIC_IMAGES_EXTENSIONS)
VIDEO_EXTENSIONS = set(app_settings.STATIC_VIDEOS_EXTENSIONS)


class MediaAutoResourceCloudinaryStorage(MediaCloudinaryStorage):
    """Cloudinary media storage that chooses the resource type from the file name."""

    def _get_resource_type(self, name):
        parts = name.rsplit(".", 1)
        ext = parts[-1].lower() if len(parts) == 2 else None
        if ext is None:
            # A stored image (its extension was stripped on upload).
            return RESOURCE_TYPES["IMAGE"]
        if ext in IMAGE_EXTENSIONS:
            return RESOURCE_TYPES["IMAGE"]
        if ext in VIDEO_EXTENSIONS:
            return RESOURCE_TYPES["VIDEO"]
        return RESOURCE_TYPES["RAW"]
