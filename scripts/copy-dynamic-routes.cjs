/**
 * Post-build script for Capacitor static export.
 *
 * Problem: Next.js static export only generates /stores/placeholder/index.html.
 * When Capacitor navigates to /stores/<real-uuid>, the file doesn't exist.
 * Capacitor serves errorPath (404.html) which must redirect to the root shell
 * while preserving the intended path so SpaRedirectHandler can navigate there.
 *
 * We use localStorage (not sessionStorage) because WKWebView preserves
 * localStorage across same-origin redirects but may clear sessionStorage.
 */

const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(__dirname, "..", "out");

const indexPath = path.join(OUT_DIR, "index.html");
if (!fs.existsSync(indexPath)) {
  console.error("[copy-dynamic-routes] out/index.html not found. Run build first.");
  process.exit(1);
}

// Remove any stale stores/index.html we may have created before —
// loading it causes a Next.js hydration mismatch (placeholder vs real uuid).
const staleFiles = [
  path.join(OUT_DIR, "stores", "index.html"),
  path.join(OUT_DIR, "admin", "stores", "index.html"),
  path.join(OUT_DIR, "admin", "users", "index.html"),
];
for (const f of staleFiles) {
  if (fs.existsSync(f)) {
    fs.unlinkSync(f);
    console.log(`[copy-dynamic-routes] Removed stale ${f}`);
  }
}

// 404.html — served by Capacitor when a file is not found (errorPath).
// Saves the intended path to localStorage and redirects to the root shell.
const redirect404 = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <script>
      var dest = window.location.pathname + window.location.search + window.location.hash;
      if (dest && dest !== '/') {
        localStorage.setItem('spa_redirect', dest);
      }
      window.location.replace('/index.html');
    </script>
  </head>
  <body></body>
</html>`;

fs.writeFileSync(path.join(OUT_DIR, "404.html"), redirect404);
console.log("[copy-dynamic-routes] Wrote 404.html.");
console.log("[copy-dynamic-routes] Done.");
