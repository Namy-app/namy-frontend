import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import "../styles/globals.css";
import { CapacitorSafeArea } from "@/components/CapacitorSafeArea";
import { GoogleAdsense } from "@/components/GoogleAdsense";
import { GoogleMapsProviderClient } from "@/components/GoogleMapsProviderClient";
import { SpaRedirectHandler } from "@/components/SpaRedirectHandler";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { Toaster } from "@/shared/components/Toaster";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  // weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ñamy - Unlock Restaurant Discounts",
  description:
    "Watch ads, unlock discounts, and discover amazing restaurants in Mexico. Earn rewards and climb the leaderboard!",
  authors: [{ name: "Ñamy" }],
  manifest: "/manifest.webmanifest",
  themeColor: "#8B5CF6",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ñamy",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Ñamy - Unlock Restaurant Discounts",
    description:
      "Watch ads, unlock discounts, and discover amazing restaurants in Mexico. Earn rewards and climb the leaderboard!",
    type: "website",
    images: [
      {
        url: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0bebed91-2ce6-43ba-9e0e-79847b538b06/id-preview-a3dc1a57--07b63e06-4a17-4f54-a013-9463122dcb27.lovable.app-1762586437176.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@lovable_dev",
    images: [
      "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0bebed91-2ce6-43ba-9e0e-79847b538b06/id-preview-a3dc1a57--07b63e06-4a17-4f54-a013-9463122dcb27.lovable.app-1762586437176.png",
    ],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <GoogleAdsense />
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${poppins.variable}  font-sans`}>
        <CapacitorSafeArea />
        <SpaRedirectHandler />
        <ReactQueryProvider>
          <GoogleMapsProviderClient>{children}</GoogleMapsProviderClient>
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
