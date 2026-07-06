import re

from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.views.static import serve as media_serve

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
    TokenBlacklistView,
)

urlpatterns = [
    path("admin/", admin.site.urls),

    # JWT auth
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("api/token/blacklist/", TokenBlacklistView.as_view(), name="token_blacklist"),

    # App APIs
    path("api/", include("faculty.urls")),
    path("api/accounts/", include("accounts.urls")),

    # DRF browsable API login
    path("api-auth/", include("rest_framework.urls")),
]

# Serve user-uploaded media files (images, docs) in BOTH dev and production.
#
# NOTE: django.conf.urls.static.static() only registers a route when
# DEBUG=True, so on Railway (DEBUG=False) every /media/... request 404'd and
# all images disappeared. The explicit re_path below serves media regardless
# of DEBUG, using the files committed to the repo.
_media_prefix = re.escape(settings.MEDIA_URL.lstrip("/"))

urlpatterns += [
    re_path(
        rf"^{_media_prefix}(?P<path>.*)$",
        media_serve,
        {"document_root": settings.MEDIA_ROOT},
    ),
]