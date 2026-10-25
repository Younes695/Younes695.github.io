// Calls Gemini straight from the browser with the visitor's own API key, using the same
// instructions and schema as the Python extractor (github.com/Younes695/receipt-extractor).
// The key goes in a request header, never in the URL, and is not stored anywhere.

export const MODEL = "gemini-3.5-flash-lite";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

export const INSTRUCTIONS = `You read photos of shop receipts and extract their contents.

Rules:
- Report only what is printed on the receipt. Use null for anything that isn't printed. Never compute a missing value.
- Write amounts as plain numbers with no thousands separators or currency. On these receipts a dot is
  usually a thousands separator: "60.000" means 60000 and "5.455" means 5455.
- List purchased items top to bottom with the line total in "price". Skip indented modifiers or sub-items.
- "discount" is a positive number even if the receipt prints it with a minus sign.`;

const number = { type: "NUMBER", nullable: true };
export const RECEIPT_SCHEMA = {
  type: "OBJECT",
  properties: {
    items: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: { name: { type: "STRING" }, quantity: number, unit_price: number, price: number },
        required: ["name"],
      },
    },
    subtotal: number,
    tax: number,
    service_charge: number,
    discount: number,
    total: number,
    cash: number,
    change: number,
  },
  required: ["items"],
};

export function buildRequest(imageBase64, mimeType = "image/jpeg") {
  return {
    systemInstruction: { parts: [{ text: INSTRUCTIONS }] },
    contents: [{ role: "user", parts: [{ inlineData: { mimeType, data: imageBase64 } }, { text: "Extract this receipt." }] }],
    generationConfig: { temperature: 0, responseMimeType: "application/json", responseSchema: RECEIPT_SCHEMA },
  };
}

export async function extractReceipt(apiKey, imageBase64, mimeType, fetchImpl = fetch) {
  const response = await fetchImpl(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify(buildRequest(imageBase64, mimeType)),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = body?.error?.message || `HTTP ${response.status}`;
    if (response.status === 400 && /api key/i.test(message)) throw new Error("That API key isn't valid. Check it and try again.");
    if (response.status === 429) throw new Error("This key hit its rate limit. Wait a minute and try again.");
    throw new Error(message);
  }
  const text = body?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") ?? "";
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("The model's reply wasn't valid JSON. Try a clearer photo.");
  }
}

/** Downscale to at most 1600 px on the longer side and re-encode as JPEG (base64, no prefix). */
export async function prepareImage(file, maxSide = 1600) {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
  return { base64: dataUrl.split(",")[1], previewUrl: dataUrl };
}
