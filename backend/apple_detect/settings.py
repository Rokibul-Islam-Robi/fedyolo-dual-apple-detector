"""
Django settings for the FedYOLO-Dual Apple Pathology Detection API.
Backed by the thesis "FedYOLO-Dual: Privacy-Preserving Edge Intelligence for
Agro-Pathology..." (Rokibul Islam, DIU). This service exposes the trained
YOLO detector (YOLOv8n / YOLO11n / YOLO11s) behind a REST endpoint that the
React frontend calls for single-image and live (frame-by-frame) detection.
"""
import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "dev-only-insecure-secret-key-change-me")
DEBUG = os.getenv("DJANGO_DEBUG", "True") == "True"

ALLOWED_HOSTS = os.getenv("DJANGO_ALLOWED_HOSTS", "*").split(",")

INSTALLED_APPS = [
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "detection",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
]

ROOT_URLCONF = "apple_detect.urls"
TEMPLATES = []
WSGI_APPLICATION = "apple_detect.wsgi.application"

# No relational DB is needed for a stateless inference API.
DATABASES = {}

# CORS — allow the deployed Vercel frontend + local dev to call this API.
CORS_ALLOWED_ORIGINS = [
    o for o in os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:5173").split(",") if o
]
CORS_ALLOW_ALL_ORIGINS = os.getenv("CORS_ALLOW_ALL_ORIGINS", "True") == "True"

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STORAGES = {
    "staticfiles": {"BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage"},
}

REST_FRAMEWORK = {
    "DEFAULT_THROTTLE_CLASSES": ["rest_framework.throttling.AnonRateThrottle"],
    "DEFAULT_THROTTLE_RATES": {"anon": os.getenv("API_RATE_LIMIT", "120/minute")},
}

# ---------------------------------------------------------------------------
# Model configuration — see detection/model_registry.py
# ---------------------------------------------------------------------------
MODEL_WEIGHTS_PATH = os.getenv("MODEL_WEIGHTS_PATH", str(BASE_DIR / "weights" / "best.pt"))
MODEL_CONFIDENCE = float(os.getenv("MODEL_CONFIDENCE", "0.35"))
MODEL_IOU = float(os.getenv("MODEL_IOU", "0.45"))
MODEL_IMG_SIZE = int(os.getenv("MODEL_IMG_SIZE", "640"))

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
