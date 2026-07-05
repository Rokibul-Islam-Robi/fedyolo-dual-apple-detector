# FedYOLO-Dual — Apple Pathology Detection Web App

A full-stack demo built around the thesis **"FedYOLO-Dual: Privacy-Preserving Edge
Intelligence for Agro-Pathology via Organ-Aware Dual-Stream YOLO in Multi-Class Apple
Leaf and Fruit Disease Detection Using Federated Learning and Explainable AI"**
(Rokibul Islam, DIU, 2026).

- **Frontend**: React (Vite) + Tailwind — landing page, live camera detection, photo
  upload detection, organ-aware (leaf/fruit) results panel.
- **Backend**: Django + Django REST Framework + Ultralytics YOLO — a single
  `/api/detect/` endpoint that runs your trained model and returns organ-routed
  detections.

---

## ⚠️ Read this first: Vercel + Django

Vercel is excellent for the **React frontend**, but it is a serverless platform and is
**not a good fit for a Django + PyTorch/Ultralytics backend** — model loading and
inference need a persistent process and more memory/time than Vercel's serverless
functions allow.

The setup that actually works, and what this repo is built for:

| Piece | Where it runs |
|---|---|
| `frontend/` (React/Vite) | **Vercel** ✅ |
| `backend/` (Django/YOLO) | Render, Railway, Fly.io, or your own VPS (Docker) |

Deploy the backend first, get its public URL, then set that URL as `VITE_API_URL`
when you deploy the frontend to Vercel. Instructions for both are below.

---

## 1. Model weights — already included ✅

`backend/weights/best.pt` now contains a **real trained YOLOv8n checkpoint** whose 8 class
names match this thesis's unified taxonomy exactly (`Healthy, Black_Rot, Cedar_Apple_Rust,
Fresh_Apple, Powdery_Mildew, Rotten_Apple, Rust, Scab`). The API runs in real detection mode
out of the box — no setup needed.

### About the other files you sent
Four more checkpoints are kept in `backend/weights/alternate_models/` for reference, but
they are **not wired in by default** because they were trained on an earlier, pre-unification
11-class label set (with messy/duplicate labels like `"Apple Healthy"` vs `"Apple healthy"`,
and a separate `"light Powdery"` class) rather than the clean 8-class taxonomy described in
Chapter 3.3 of the thesis:

| File | Architecture | Classes | Notes |
|---|---|---|---|
| `federated_yolo11s_round3_11class.pt` | YOLO11s (9.4M params) | 11 (messy) | This is actually a **FedAvg round-3 checkpoint on farm_3**, not YOLO11n as reported in Table 4.1 — architecture/round mismatch vs. the thesis text |
| `yolov8n_11class.pt` | YOLOv8n | 11 (messy) | Pre-unification run |
| `yolo11n_11class.pt` | YOLO11n | 11 (messy) | Pre-unification run |
| `yolo11s_11class.pt` | YOLO11s | 11 (messy) | Pre-unification run |

If you want one of these live instead, two options:
- **Swap it in as-is**, but first update `backend/detection/classes.py::CLASS_NAMES` and the
  leaf/fruit routing sets to match its 11 labels (otherwise organ routing will be wrong).
- **Retrain/re-export** on the unified 8-class `data.yaml` so it matches `best.pt`'s taxonomy,
  then drop it in as the new `best.pt`.

To switch the active model without touching code, set `MODEL_WEIGHTS_PATH` in `backend/.env`
to point at any file in `alternate_models/` (again, only safe for the classes.py update above).

---

## 2. Run it locally

### Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py runserver 0.0.0.0:8000
```
Visit `http://localhost:8000/api/health/` — you should see `"demo_mode": true` until
you add `weights/best.pt`.

### Frontend
```bash
cd frontend
npm install
cp .env.example .env    # VITE_API_URL=http://localhost:8000
npm run dev
```
Visit `http://localhost:5173`.

---

## 3. Push to GitHub

The weight files in `backend/weights/` add up to roughly 55 MB total — under GitHub's
100 MB single-file limit, so a plain push works. If you'd rather keep the repo lean, put the
`*.pt` files under [Git LFS](https://git-lfs.com) first (`git lfs track "*.pt"`) before the
commit below.

```bash
cd fedyolo-dual   # this project's root folder
git init
git add .
git commit -m "FedYOLO-Dual apple pathology detection app"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

---

## 4. Deploy the backend (Render — free/simple option shown)

1. Push this repo to GitHub (above).
2. On [render.com](https://render.com) → **New → Web Service** → connect your repo.
3. Set **Root Directory** to `backend`.
4. Render will detect `Dockerfile` and `render.yaml` automatically. Confirm:
   - Environment: Docker
   - Plan: any (Ultralytics + torch need at least 1–2 GB RAM)
5. Add your `best.pt` to the repo (or use a Render disk / mount it separately —
   for a thesis demo, committing the weight file via Git LFS is simplest).
6. Deploy. Copy the resulting URL, e.g. `https://fedyolo-dual-api.onrender.com`.
7. Once live, set `CORS_ALLOWED_ORIGINS` env var on Render to your future Vercel URL.

(Railway and Fly.io both also read the same `Dockerfile` — the steps are equivalent:
point the platform at `backend/`, deploy, grab the public URL.)

---

## 5. Deploy the frontend on Vercel

1. On [vercel.com](https://vercel.com) → **Add New → Project** → import the same repo.
2. Set **Root Directory** to `frontend`.
3. Framework preset: **Vite**.
4. Add an environment variable:
   - `VITE_API_URL` = the backend URL from step 4 (e.g. `https://fedyolo-dual-api.onrender.com`)
5. Deploy. Vercel builds `npm run build` and serves the static output — `vercel.json`
   already handles SPA routing.

---

## 6. Live detection notes

- "Live camera" mode captures a webcam frame roughly every 1.2 seconds (tunable via
  `CAPTURE_INTERVAL_MS` in `frontend/src/components/LiveDetector.jsx`) and posts it to
  `/api/detect/` as base64 JPEG. This keeps the demo working on any host without
  needing WebSockets/GPU streaming infrastructure.
- Camera access requires **HTTPS or localhost** — this is a browser security rule, not
  a bug in this app. Vercel serves HTTPS by default, so the deployed site works fine.
- Without `best.pt` loaded, both modes still work end-to-end in **demo mode**
  (`"demo_mode": true` in every response) so you can verify the full pipeline before
  the real model is wired in.

---

## Project structure

```
fedyolo-dual/
├── backend/                  # Django + DRF + Ultralytics YOLO API
│   ├── apple_detect/          # Django project (settings, urls, wsgi)
│   ├── detection/              # Inference app: model loading, routing, endpoint
│   │   ├── classes.py           # 8-class taxonomy + leaf/fruit routing rule
│   │   ├── model_registry.py    # Lazy YOLO loader + demo-mode fallback
│   │   └── views.py             # /api/health/ and /api/detect/
│   ├── weights/                # Put your trained best.pt here
│   ├── Dockerfile
│   └── render.yaml
└── frontend/                  # React (Vite) + Tailwind
    ├── src/
    │   ├── pages/               # Home, Detect, About
    │   └── components/          # Navbar, OrganSplitViz, Upload/LiveDetector, etc.
    └── vercel.json
```

## API reference

`GET /api/health/` → `{ status, demo_mode, service }`

`POST /api/detect/`
- multipart: field `image` (file), **or**
- JSON: `{ "image_base64": "data:image/jpeg;base64,..." }`

Response:
```json
{
  "demo_mode": false,
  "image_size": { "width": 640, "height": 480 },
  "inference_ms": 12.4,
  "detections": [{ "class_name": "Scab", "confidence": 0.94, "box": [x1,y1,x2,y2], "organ": "both", "color": "#9A7B2F" }],
  "leaf_stream": [...],
  "fruit_stream": [...],
  "counts": { "total": 2, "leaf": 1, "fruit": 1 }
}
```
