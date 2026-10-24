import { siFacebook, siGithub, siInstagram, siTelegram, siWhatsapp } from "simple-icons";

// Simple Icons (CC0). LinkedIn isn't in Simple Icons anymore, so its path is inline.
const LINKEDIN_PATH =
  "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z";

const PATHS = {
  github: siGithub.path,
  linkedin: LINKEDIN_PATH,
  whatsapp: siWhatsapp.path,
  telegram: siTelegram.path,
  facebook: siFacebook.path,
  instagram: siInstagram.path,
};

// Brand colors, used on hover. GitHub's own color is near-black, so it uses white here.
export const BRAND_COLORS = {
  github: "#ffffff",
  linkedin: "#0a66c2",
  whatsapp: `#${siWhatsapp.hex}`,
  telegram: `#${siTelegram.hex}`,
  facebook: `#${siFacebook.hex}`,
  instagram: `#${siInstagram.hex}`,
};

export default function BrandIcon({ id, size = 20, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" {...props}>
      <path d={PATHS[id]} />
    </svg>
  );
}
