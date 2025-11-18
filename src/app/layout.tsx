import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../styles/globals.css";
// import TopBar from "@/components/TopBar";
// import BottomNav from "@/components/BottomNav";
import { Toaster } from "@/shared/components/Toaster";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Ñamy - Unlock delicious discounts",
  description:
    "Discover amazing deals and discounts on your favorite restaurants",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable}  font-sans`}>
        <ReactQueryProvider>
          {/* <TopBar /> */}
          {children}
          {/* <BottomNav /> */}
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
