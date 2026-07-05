"""
Loads the trained YOLO detector once per process.

If MODEL_WEIGHTS_PATH does not point at a real weights file (e.g. this repo
was cloned fresh and best.pt from your training run hasn't been added yet),
the API falls back to DEMO MODE: it still returns a valid response shape so
the frontend works end-to-end, but every response is tagged
"demo_mode": true and detections are synthetic. Drop your trained best.pt
into backend/weights/ (or point MODEL_WEIGHTS_PATH at it) to get real
detections — see README "Plugging in your trained model".
"""
import logging
import random
import threading

from django.conf import settings

from .classes import CLASS_NAMES

logger = logging.getLogger(__name__)

_lock = threading.Lock()
_model = None
_demo_mode = False


def _try_load_real_model():
    import os

    weights_path = settings.MODEL_WEIGHTS_PATH
    if not os.path.exists(weights_path):
        logger.warning(
            "No model weights found at %s — starting in DEMO MODE. "
            "Add your trained best.pt to enable real detection.",
            weights_path,
        )
        return None

    from ultralytics import YOLO

    model = YOLO(weights_path)
    logger.info("Loaded YOLO weights from %s", weights_path)
    return model


def get_model():
    global _model, _demo_mode
    with _lock:
        if _model is None and not _demo_mode:
            try:
                _model = _try_load_real_model()
            except Exception:
                logger.exception("Failed to load YOLO model, falling back to demo mode.")
                _model = None
            if _model is None:
                _demo_mode = True
    return _model


def is_demo_mode():
    get_model()
    return _demo_mode


def run_inference(pil_image):
    """
    Runs the loaded YOLO model on a PIL image and returns a list of
    detections: [{class_name, confidence, box: [x1,y1,x2,y2]}, ...] in
    pixel coordinates of the original image.
    """
    model = get_model()

    if model is None:
        return _synthetic_detections(pil_image), True

    results = model.predict(
        source=pil_image,
        conf=settings.MODEL_CONFIDENCE,
        iou=settings.MODEL_IOU,
        imgsz=settings.MODEL_IMG_SIZE,
        verbose=False,
    )
    detections = []
    if results:
        r = results[0]
        names = r.names or {i: n for i, n in enumerate(CLASS_NAMES)}
        for box in r.boxes:
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])
            x1, y1, x2, y2 = [float(v) for v in box.xyxy[0]]
            detections.append(
                {
                    "class_name": names.get(cls_id, f"class_{cls_id}"),
                    "confidence": round(conf, 4),
                    "box": [round(x1, 1), round(y1, 1), round(x2, 1), round(y2, 1)],
                }
            )
    return detections, False


def _synthetic_detections(pil_image):
    """Deterministic-ish placeholder output so the UI is fully exercisable pre-training."""
    w, h = pil_image.size
    rng = random.Random(hash(pil_image.tobytes()[:64]) if pil_image else 0)
    n = rng.randint(1, 3)
    out = []
    for _ in range(n):
        cls = rng.choice(CLASS_NAMES)
        bw, bh = w * rng.uniform(0.2, 0.4), h * rng.uniform(0.2, 0.4)
        x1 = rng.uniform(0, max(w - bw, 1))
        y1 = rng.uniform(0, max(h - bh, 1))
        out.append(
            {
                "class_name": cls,
                "confidence": round(rng.uniform(0.55, 0.95), 4),
                "box": [round(x1, 1), round(y1, 1), round(x1 + bw, 1), round(y1 + bh, 1)],
            }
        )
    return out
