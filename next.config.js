/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Required for Capacitor static export
  output: "export",
  trailingSlash: true,

  experimental: {
    optimizePackageImports: ["lucide-react", "@tanstack/react-query"], // ✅ keep
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production", // ✅ keep
  },

  images: {
    unoptimized: true, // ✅ ADD — disables image optimization server (required for static export)

    // ❌ REMOVE — these only apply when the Next.js image server is running:
    // remotePatterns, formats, minimumCacheTTL, deviceSizes, imageSizes

    // ✅ KEEP — these are still meaningful even without the optimizer
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // ❌ REMOVE entire headers() function
  // Custom headers are a server feature — they're silently ignored in static export.
  // For Capacitor, handle security headers in your native layer or backend instead.

  // NOTE: Remove /sw.js config too — service workers behave differently in
  // Capacitor's WebView. You likely don't need one at all in the mobile app.
};

export default nextConfig;
