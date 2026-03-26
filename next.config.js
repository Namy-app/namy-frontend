/** @type {import('next').NextConfig} */

const isMobileBuild = process.env.MOBILE_BUILD === "true";

const nextConfig = isMobileBuild
  ? {
      // Mobile (Capacitor) static export config
      output: "export",
      trailingSlash: true,

      experimental: {
        optimizePackageImports: ["lucide-react", "@tanstack/react-query"],
      },
      compiler: {
        removeConsole: process.env.NODE_ENV === "production",
      },
      images: {
        unoptimized: true,
        dangerouslyAllowSVG: true,
        contentDispositionType: "attachment",
        contentSecurityPolicy:
          "default-src 'self'; script-src 'none'; sandbox;",
      },
    }
  : {
      // Web config
      experimental: {
        optimizePackageImports: ["lucide-react", "@tanstack/react-query"],
      },
      compiler: {
        removeConsole: process.env.NODE_ENV === "production",
      },
      images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "images.unsplash.com",
            port: "",
            pathname: "/**",
          },
          {
            protocol: "https",
            hostname: "placehold.co",
            port: "",
            pathname: "/**",
          },
          {
            protocol: "https",
            hostname: "namy-app.s3.us-west-2.amazonaws.com",
            port: "",
            pathname: "/**",
          },
          {
            protocol: "https",
            hostname: "subtrackr-bucket.s3.eu-north-1.amazonaws.com",
            port: "",
            pathname: "/**",
          },
          {
            protocol: "https",
            hostname: "**",
          },
        ],
        formats: ["image/webp", "image/avif"],
        dangerouslyAllowSVG: true,
        contentDispositionType: "attachment",
        contentSecurityPolicy:
          "default-src 'self'; script-src 'none'; sandbox;",
        minimumCacheTTL: 60,
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      },
      async headers() {
        return [
          {
            source: "/(.*)",
            headers: [
              { key: "X-Frame-Options", value: "DENY" },
              { key: "X-Content-Type-Options", value: "nosniff" },
              {
                key: "Referrer-Policy",
                value: "strict-origin-when-cross-origin",
              },
            ],
          },
          {
            source: "/sw.js",
            headers: [
              {
                key: "Content-Type",
                value: "application/javascript; charset=utf-8",
              },
              {
                key: "Cache-Control",
                value: "no-cache, no-store, must-revalidate",
              },
              {
                key: "Content-Security-Policy",
                value:
                  "default-src 'self'; script-src 'self'; connect-src 'self' http://localhost:4000 https://maps.googleapis.com https://*.googleapis.com https://pagead2.googlesyndication.com https://ep1.adtrafficquality.google",
              },
            ],
          },
        ];
      },
    };

export default nextConfig;
