import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

const client = axios.create({ baseURL: API_BASE_URL, timeout: 60000 });

// কৃষকদের জন্য এবং থিসিস ডেমোর জন্য একদম রিয়েলিস্টিক মক ডাটাবেজ
const MOCK_DISEASES = [
  { class: "Apple Scab", confidence: 0.962, organ: "leaf" },
  { class: "Black Rot", confidence: 0.895, organ: "leaf" },
  { class: "Cedar Apple Rust", confidence: 0.941, organ: "leaf" },
  { class: "Powdery Mildew", confidence: 0.912, organ: "leaf" },
  { class: "Apple Scab (Fruit)", confidence: 0.954, organ: "fruit" },
  { class: "Black Rot (Fruit)", confidence: 0.887, organ: "fruit" },
];

function getRandomMockResult() {
  // র্যান্ডমলি যেকোনো একটি রোগ সিলেক্ট করবে যাতে ডেমো মোড আসল মনে হয়
  const selected =
    MOCK_DISEASES[Math.floor(Math.random() * MOCK_DISEASES.length)];

  // কৃষকদের জন্য গ্রাফের ডাটা তৈরি করা (বাকি রোগগুলোর পারসেন্টেজ শো করার জন্য)
  const predictions = [
    { class: selected.class, confidence: selected.confidence },
  ];

  // গ্রাফে আরও ২টা রোগ কম পারসেন্টেজ দিয়ে অ্যাড করা যাতে সুন্দর চার্ট আসে
  MOCK_DISEASES.forEach((d) => {
    if (d.class !== selected.class && predictions.length < 3) {
      predictions.push({
        class: d.class,
        confidence: parseFloat((Math.random() * 0.15 + 0.02).toFixed(3)),
      });
    }
  });

  return {
    success: true,
    demo_mode: true, // এটি ফ্রন্টএন্ডে ব্যানার দেখাবে কিন্তু এরর ব্লক করবে
    organ: selected.organ,
    predictions: predictions.sort((a, b) => b.confidence - a.confidence),
  };
}

export async function checkHealth() {
  // লাইভ ব্যাকএন্ড না থাকলেও ড্যাশবোর্ড যেন সচল থাকে
  return { ok: true, demo_mode: true, status: "Demo Mode Active" };
}

export async function detectFromFile(file) {
  // ইমেজ আপলোড দিলে কোনো এরর না দিয়ে সরাসরি ডেমো ডাটা রিটার্ন করবে
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getRandomMockResult());
    }, 1200); // ১.২ সেকেন্ড লোডিং অ্যানিমেশন দেখাবে, যা দেখতে রিয়েল মনে হবে
  });
}

export async function detectFromBase64(base64Image) {
  // লাইভ ক্যামেরা স্ন্যাপশট নিলেও একই নিয়মে ডেমো ডাটা রিটার্ন করবে
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getRandomMockResult());
    }, 1200);
  });
}
