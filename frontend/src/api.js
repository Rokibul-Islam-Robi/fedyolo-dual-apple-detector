import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Free-tier hosts (Render/Railway) spin down when idle and can take 30-50s to
// wake up on the first request after a period of inactivity. A short timeout
// here is the #1 cause of a false "Detection failed" on a freshly deployed
// backend, so we give it real headroom instead of failing fast.
const client = axios.create({ baseURL: API_BASE_URL, timeout: 60000 });

function explainError(e) {
  if (e.code === "ECONNABORTED") {
    return `Timed out waiting for the API at ${API_BASE_URL}. If this is a free-tier host (Render/Railway), it may still be waking up from a cold start — try again in ~30s.`;
  }
  if (!e.response) {
    return `Could not reach the API at ${API_BASE_URL}. Check that VITE_API_URL is set correctly and the backend is deployed/running (CORS or network error otherwise).`;
  }
  return e?.response?.data?.error || `API returned ${e.response.status}.`;
}

export async function checkHealth() {
  try {
    const { data } = await client.get("/api/health/", { timeout: 8000 });
    return { ok: true, ...data };
  } catch (e) {
    return { ok: false, error: explainError(e) };
  }
}

export async function detectFromFile(file) {
  const form = new FormData();
  form.append("image", file);
  try {
    const { data } = await client.post("/api/detect/", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (e) {
    throw new Error(explainError(e));
  }
}

export async function detectFromBase64(base64Image) {
  try {
    const { data } = await client.post("/api/detect/", { image_base64: base64Image });
    return data;
  } catch (e) {
    throw new Error(explainError(e));
  }
}
