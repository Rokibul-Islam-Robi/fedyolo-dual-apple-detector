import base64
import io
import time

from PIL import Image
from rest_framework.decorators import api_view, throttle_classes
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle

from . import model_registry
from .classes import CLASS_COLORS, route_organ


def _load_image_from_request(request):
    if "image" in request.FILES:
        return Image.open(request.FILES["image"]).convert("RGB")

    data = request.data.get("image_base64")
    if data:
        if "," in data[:64]:
            data = data.split(",", 1)[1]
        raw = base64.b64decode(data)
        return Image.open(io.BytesIO(raw)).convert("RGB")

    return None


@api_view(["GET"])
def health(request):
    return Response(
        {
            "status": "ok",
            "demo_mode": model_registry.is_demo_mode(),
            "service": "FedYOLO-Dual Apple Pathology Detection API",
        }
    )


@api_view(["POST"])
@throttle_classes([AnonRateThrottle])
def detect(request):
    """
    Accepts either:
      - multipart/form-data with an 'image' file field (single-image upload), or
      - JSON body { "image_base64": "data:image/jpeg;base64,..." } (live webcam frames)

    Returns organ-routed detections plus per-organ summaries so the frontend
    can render the leaf-stream / fruit-stream split shown in the thesis
    (Section 3.4.5, Figure 3.6).
    """
    image = _load_image_from_request(request)
    if image is None:
        return Response({"error": "No image provided. Send 'image' or 'image_base64'."}, status=400)

    started = time.time()
    detections, demo_mode = model_registry.run_inference(image)
    elapsed_ms = round((time.time() - started) * 1000, 1)

    leaf_stream, fruit_stream = [], []
    for det in detections:
        organ = route_organ(det["class_name"])
        det["organ"] = organ
        det["color"] = CLASS_COLORS.get(det["class_name"], "#888888")
        if organ in ("leaf", "both"):
            leaf_stream.append(det)
        if organ in ("fruit", "both"):
            fruit_stream.append(det)

    return Response(
        {
            "demo_mode": demo_mode,
            "image_size": {"width": image.width, "height": image.height},
            "inference_ms": elapsed_ms,
            "detections": detections,
            "leaf_stream": leaf_stream,
            "fruit_stream": fruit_stream,
            "counts": {
                "total": len(detections),
                "leaf": len(leaf_stream),
                "fruit": len(fruit_stream),
            },
        }
    )
