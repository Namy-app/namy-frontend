import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import "../styles/globals.css";
import { GoogleAdsense } from "@/components/GoogleAdsense";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { Toaster } from "@/shared/components/Toaster";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Ñamy - Unlock Restaurant Discounts",
  description:
    "Watch ads, unlock discounts, and discover amazing restaurants in Mexico. Earn rewards and climb the leaderboard!",
  authors: [{ name: "Ñamy" }],
  openGraph: {
    title: "675baa49-1cbe-4559-813b-6547a81e9bdf",
    description: "Lovable Generated Project",
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="en">
      <head>
        <GoogleAdsense />
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
        />
        {/* AdSense Rewarded Ads for video rewards */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adconfig.js"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${poppins.variable}  font-sans`}>
        <ReactQueryProvider>
          {children}
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
