import { useEffect } from "react";
import { profile } from "../data.js";

/**
 * GoatCounter page-view counting: free, no cookies, no consent banner needed.
 * Loads only when a site code is set in data.js, and never on localhost.
 */
export default function Analytics() {
  useEffect(() => {
    const code = profile.goatcounter;
    if (!code || ["localhost", "127.0.0.1"].includes(window.location.hostname)) return;
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://gc.zgo.at/count.js";
    script.dataset.goatcounter = `https://${code}.goatcounter.com/count`;
    document.body.appendChild(script);
  }, []);
  return null;
}
