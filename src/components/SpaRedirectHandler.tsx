"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Handles SPA redirects for Capacitor static export.
 *
 * When Capacitor can't find a file (e.g. /stores/<uuid>/index.html),
 * it falls back to 404.html. Our custom 404.html saves the intended
 * path to sessionStorage and redirects to /index.html.
 *
 * This component reads that saved path and navigates to it,
 * so the user lands on the correct page.
 */
export function SpaRedirectHandler(): null {
  const router = useRouter();

  useEffect(() => {
    const redirect = localStorage.getItem("spa_redirect");
    if (redirect && redirect !== "/") {
      localStorage.removeItem("spa_redirect");
      router.replace(redirect);
    }
  }, [router]);

  return null;
}
