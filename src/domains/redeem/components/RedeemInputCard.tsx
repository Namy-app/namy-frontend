"use client";

import Image from "next/image";
import Link from "next/link";

import CodeInput from "@/domains/redeem/components/CodeInput";
import RedeemScanOptions from "@/domains/redeem/components/RedeemScanOptions";

type Props = {
  couponCode: string;
  loading: boolean;
  setCouponCode: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onStartCamera: () => void;
  onUpload: (file: File) => void;
  onCancel?: () => void;
};

export default function RedeemInputCard({
  couponCode,
  loading,
  setCouponCode,
  onSubmit,
  onStartCamera,
  onUpload,
}: Props): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="pt-14 flex items-center justify-center p-4 min-h-screen">
        <div className="bg-white rounded-2xl shadow-card p-8 w-full max-w-md animate-slide-up">
          <div className="text-center mb-6">
            <Link
              href="/"
              className="cursor-pointer flex justify-center hover:opacity-80 transition-opacity"
            >
              <Image
                src="/namy-logo.webp"
                alt="Ñamy Logo"
                width={32}
                height={32}
                className="h-8 w-auto rounded-lg"
              />
            </Link>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Redeem Coupon
            </h1>
            <p className="text-sm text-muted-foreground">
              Scan QR code or enter coupon code manually
            </p>
          </div>

          <div className="space-y-4">
            <RedeemScanOptions
              onStartCamera={onStartCamera}
              onUpload={onUpload}
            />

            <CodeInput
              loading={loading}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              onSubmit={onSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
