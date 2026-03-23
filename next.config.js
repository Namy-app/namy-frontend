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
            hostname: "**",
          },
        ],
        dangerouslyAllowSVG: true,
        contentDispositionType: "attachment",
        contentSecurityPolicy:
          "default-src 'self'; script-src 'none'; sandbox;",
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
        ];
      },
    };

export default nextConfig;
