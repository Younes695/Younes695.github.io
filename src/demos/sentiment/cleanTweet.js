// JavaScript port of egysent.preprocess.clean_tweet (github.com/Younes695/egyptian-arabic-sentiment).
// The model was trained on text cleaned this way, so the demo must clean input identically.
// Python's \w is Unicode-aware; in JS that is [\p{L}\p{N}_] with the "u" flag.

const URL_RE = /https?:\/\/\S+|www\.\S+/gu;
const MENTION_RE = /@[\p{L}\p{N}_]+/gu;
const HASHTAG_RE = /#([\p{L}\p{N}_]+)/gu;
const DIACRITICS_RE = /[ؐ-ًؚ-ٰٟۖ-ۭ]/gu;
const ALEF_RE = /[آأإٱ]/gu; // آ أ إ ٱ -> ا
const REPEATS_RE = /(.)\1{2,}/gu; // 3+ of the same character
const SPACES_RE = /\s+/gu;

export const USER_TOKEN = "مستخدم";
export const URL_TOKEN = "رابط";

export function cleanTweet(text) {
  let t = text.normalize("NFKC");
  t = t.replace(URL_RE, ` ${URL_TOKEN} `);
  t = t.replace(MENTION_RE, ` ${USER_TOKEN} `);
  t = t.replace(HASHTAG_RE, (_, word) => ` ${word.replaceAll("_", " ")} `);
  t = t.replace(DIACRITICS_RE, "").replaceAll("ـ", "");
  t = t.replace(ALEF_RE, "ا");
  t = t.replaceAll("ى", "ي"); // ى -> ي
  t = t.replace(REPEATS_RE, "$1$1");
  return t.replace(SPACES_RE, " ").trim();
}
