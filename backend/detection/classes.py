"""
The unified 8-class apple pathology taxonomy from the thesis
(FedYOLO-Dual, Chapter 3.3) and the organ-aware dual-stream routing rule
from Section 3.4.5 / the notebook's DualHeadInferenceRouter.

Class order below MUST match the order the YOLO model's data.yaml was
trained with. If you retrain with a different class order, update
CLASS_NAMES accordingly (index position matters, not the label text).
"""

CLASS_NAMES = [
    "Healthy",
    "Black_Rot",
    "Cedar_Apple_Rust",
    "Fresh_Apple",
    "Powdery_Mildew",
    "Rotten_Apple",
    "Rust",
    "Scab",
]

# Organ-aware output routing (post-detection, backbone-agnostic — Section 3.4.5).
# Black Rot and Scab are fungal agents that present on both organs, so they are
# routed into both streams, exactly as in the thesis.
LEAF_PATHOLOGY_CLASSES = {"Healthy", "Black_Rot", "Cedar_Apple_Rust", "Powdery_Mildew", "Rust", "Scab"}
FRUIT_PATHOLOGY_CLASSES = {"Healthy", "Black_Rot", "Fresh_Apple", "Rotten_Apple", "Scab"}

CLASS_COLORS = {
    "Healthy": "#4C7A56",
    "Black_Rot": "#7A3B2E",
    "Cedar_Apple_Rust": "#C1443C",
    "Fresh_Apple": "#3F7D4A",
    "Powdery_Mildew": "#D6A94B",
    "Rotten_Apple": "#5B4636",
    "Rust": "#B9552C",
    "Scab": "#9A7B2F",
}


def route_organ(class_name: str) -> str:
    """Return 'leaf', 'fruit', or 'both' for a given class label."""
    in_leaf = class_name in LEAF_PATHOLOGY_CLASSES
    in_fruit = class_name in FRUIT_PATHOLOGY_CLASSES
    if in_leaf and in_fruit:
        return "both"
    if in_leaf:
        return "leaf"
    if in_fruit:
        return "fruit"
    return "unknown"
