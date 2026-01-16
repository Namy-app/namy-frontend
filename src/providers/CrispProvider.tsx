"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $crisp?: any;
    CRISP_WEBSITE_ID?: string;
  }
}

export default function CrispProvider() {
  useEffect(() => {
    const websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;
    if (!process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID) {
      return;
    }

    let existingScript: HTMLScriptElement | null;

    // Avoid loading the Crisp script multiple times (e.g., StrictMode or multiple mounts)
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      // If Crisp is already initialized with the same website ID, do nothing
      if (window.$crisp && window.CRISP_WEBSITE_ID === websiteId) {
        return;
      }
      // If the script tag is already present, assume Crisp is being loaded/has loaded
      existingScript = document.querySelector<HTMLScriptElement>(
        'script[src="https://client.crisp.chat/l.js"]'
      );
      if (existingScript) {
        // Ensure globals are set but do not re-append the script
        window.$crisp = window.$crisp || [];
        window.CRISP_WEBSITE_ID = websiteId;
        return;
      }
      window.$crisp = window.$crisp || [];
      window.CRISP_WEBSITE_ID = websiteId;

      // Hide the chat widget by default
      window.$crisp.push(["do", "chat:hide"]);

      // Listen for chat close event and hide the widget again
      window.$crisp.push([
        "on",
        "chat:closed",
        () => {
          window.$crisp.push(["do", "chat:hide"]);
        },
      ]);

      const script = document.createElement("script");
      script.src = "https://client.crisp.chat/l.js";
      script.async = true;
      document.head.appendChild(script);
    }

    return () => {
      if (existingScript?.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
      // Clean up global Crisp variables
      delete window.$crisp;
      delete window.CRISP_WEBSITE_ID;
    };
  }, []);

  return null;
}
