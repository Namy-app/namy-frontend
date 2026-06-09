/**
 * Post-build script for Capacitor static export.
 *
 * Problem: Next.js static export only generates /stores/id/index.html (and
 * /admin/stores/id, /admin/users/id). When Capacitor navigates to
 * /stores/<real-uuid>, the file doesn't exist.
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

// Synchronous cold-start guard — must run before the JS bundle when iOS
// restores /stores/id/ (or other dynamic shells) from the last session.
const coldStartSnippet = `<script id="namy-cold-start">(function(){try{var k="namy_app_boot";if(sessionStorage.getItem(k))return;var p=location.pathname,r=localStorage.getItem("spa_redirect");if(r&&r!=="/"&&(p==="/"||p==="/index.html"||p.slice(-11)==="/index.html")){sessionStorage.setItem(k,"1");localStorage.removeItem("spa_redirect");if(r.indexOf("/stores/")===0||r.indexOf("/admin/stores/")===0||r.indexOf("/admin/users/")===0){localStorage.setItem("capacitor_dynamic_path",r);location.replace(r.indexOf("/stores/")===0?"/stores/id/":r.indexOf("/admin/stores/")===0?"/admin/stores/id/":"/admin/users/id/");return}location.replace(r);return}sessionStorage.setItem(k,"1");localStorage.removeItem("spa_redirect");localStorage.removeItem("capacitor_dynamic_path");if(p.indexOf("/stores/")===0||p.indexOf("/admin/stores/")===0||p.indexOf("/admin/users/")===0)location.replace("/explore/");}catch(e){}})();</script>`;

function injectColdStart(htmlPath) {
  if (!fs.existsSync(htmlPath)) {
    return;
  }
  let html = fs.readFileSync(htmlPath, "utf8");
  if (html.includes("namy-cold-start")) {
    return;
  }
  html = html.replace("<head>", `<head>\n    ${coldStartSnippet}`);
  fs.writeFileSync(htmlPath, html);
  console.log(`[copy-dynamic-routes] Injected cold-start into ${path.relative(OUT_DIR, htmlPath)}`);
}

for (const target of [
  path.join(OUT_DIR, "index.html"),
  path.join(OUT_DIR, "stores", "id", "index.html"),
  path.join(OUT_DIR, "admin", "stores", "id", "index.html"),
  path.join(OUT_DIR, "admin", "users", "id", "index.html"),
]) {
  injectColdStart(target);
}

console.log("[copy-dynamic-routes] Done.");
