from django.apps import AppConfig


class DetectionConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "detection"

    def ready(self):
        # Warm up the model once, at process start, instead of on first request.
        from . import model_registry

        model_registry.get_model()
