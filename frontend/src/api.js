import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const client = axios.create({ baseURL: API_BASE_URL, timeout: 20000 });

export async function checkHealth() {
  const { data } = await client.get("/api/health/");
  return data;
}

export async function detectFromFile(file) {
  const form = new FormData();
  form.append("image", file);
  const { data } = await client.post("/api/detect/", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function detectFromBase64(base64Image) {
  const { data } = await client.post("/api/detect/", { image_base64: base64Image });
  return data;
}
