export const MODEL_ID = "abdElrahmanWaelYounes/egyptian-arabic-sentiment";
export const MODEL_URL = `https://huggingface.co/${MODEL_ID}`;
export const CODE_URL = "https://github.com/Younes695/egyptian-arabic-sentiment";

// Order and wording shown on the page; keys are the model's labels.
export const CLASSES = [
  { label: "positive", name: "Positive", emoji: "😊", color: "#2dd4bf" },
  { label: "negative", name: "Negative", emoji: "😠", color: "#f87171" },
  { label: "mixed", name: "Mixed", emoji: "😐", color: "#fbbf24" },
  { label: "objective", name: "Objective (no opinion)", emoji: "📰", color: "#94a3b8" },
];

export const EXAMPLES = [
  "الفيلم ده تحفة بجد",
  "الخدمة زفت ومش هتعامل معاهم تاني",
  "الأكل حلو بس الأسعار غالية اوي",
  "الماتش هيبدأ الساعة تسعة",
];
