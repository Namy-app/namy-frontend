"use client";

import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";

import RedeemCropModal from "@/domains/redeem/components/RedeemCropModal";
import RedeemDetail from "@/domains/redeem/components/RedeemDetail";
import RedeemInputCard from "@/domains/redeem/components/RedeemInputCard";
import RedeemScannerModal from "@/domains/redeem/components/RedeemScannerModal";
import { useToast } from "@/hooks/use-toast";
import { CouponDecoder } from "@/lib/coupon-decoder";
import type { DecodedCouponData } from "@/lib/coupon-decoder";
import { GET_COUPON_REDEEM_DETAILS_QUERY } from "@/lib/graphql-queries";
import { useQrScanner } from "@/lib/use-qr-scanner";

function StoreRedeemContent(): React.JSX.Element {
  const { toast } = useToast();
  const params = useParams();
  const searchParams = useSearchParams();

  const [couponCode, setCouponCode] = useState("");
  const [detailCoupon, setDetailCoupon] = useState<DecodedCouponData | null>(
    null
  );
  const [showDetail, setShowDetail] = useState(false);

  // Decode encrypted `enc` query param on mount (if present)
  useEffect(() => {
    const tryDecode = async (): Promise<void> => {
      try {
        const enc =
          searchParams?.get?.("enc") ??
          (params?.encodedData && !Array.isArray(params.encodedData)
            ? params.encodedData
            : null);
        if (!enc) {
          return;
        }
        const decoded = await CouponDecoder.decodeAsync(enc);
        if (decoded) {
          setDetailCoupon(decoded);
          // Prefill manual coupon input when `enc` is present in URL
          if (decoded.code) {
            setCouponCode(decoded.code);
          }
          // setShowDetail(true);
          toast({
            title: "Coupon loaded",
            description: `${decoded.store?.name ?? "Store"} - ${decoded.discount?.title ?? "Discount"}`,
          });
        }
      } catch (err) {
        console.warn("Could not decode enc param:", err);
      }
    };
    void tryDecode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.encodedData]);

  // QR scanner hook handles camera/upload/crop/scan and returns helpers + refs
  const qr = useQrScanner({
    onDecoded: (decoded): void => {
      setDetailCoupon(decoded);
      setShowDetail(true);
    },
    onToast: (t) => {
      const payload = t as {
        title: string;
        description?: string;
        variant?: "default" | "destructive" | null | undefined;
      };
      // Cast to the toast input type to satisfy TS when variant is narrow
      toast(payload as unknown as Parameters<typeof toast>[0]);
    },
  });

  const {
    videoRef,
    showScanner,
    startCamera,
    stopCamera,
    showCropModal,
    uploadedImage,
    setUploadedImage,
    setShowCropModal,
    crop,
    setCrop,
    zoom,
    setZoom,
    croppedAreaPixels,
    cropCanvasRef,
    onCropComplete,
    handleImageUpload,
    handleScanCroppedArea,
  } = qr;

  // Manual code submit — fetch coupon details and show detail view
  const handleCodeSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const code = couponCode.trim();
    if (!code) {
      return;
    }
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: GET_COUPON_REDEEM_DETAILS_QUERY,
          variables: { code },
        }),
      });
      const json = await res.json();
      if (json.errors) {
        throw new Error(json.errors[0].message);
      }
      const details = json.data?.couponRedeemDetails;
      if (!details) {
        toast({
          title: "Not found",
          description: "Coupon not found.",
          variant: "destructive",
        });
        return;
      }
      // Map server response into a lightweight view model
      const mapped = {
        code: details.code,
        expiresAt: details.expiresAt,
        createdAt: details.createdAt,
        storeId: details.store?.id ?? "",
        store: details.store,
        discount: details.discount,
      };
      setDetailCoupon(mapped as DecodedCouponData);
      setShowDetail(true);
      toast({
        title: "Coupon loaded",
        description: `${details.store?.name ?? "Store"} - ${details.discount?.title ?? "Discount"}`,
      });
    } catch (err) {
      console.error("Error fetching coupon details:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    }
  };

  // Render detail view when available
  if (showDetail && detailCoupon) {
    return (
      <div className="min-h-screen bg-gradient-hero pb-20">
        <div className="pt-14 flex items-center justify-center p-4 min-h-screen">
          <div className="w-full max-w-3xl">
            <RedeemDetail
              couponData={detailCoupon}
              onClose={() => {
                setShowDetail(false);
                setDetailCoupon(null);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Default: input card + modals
  return (
    <>
      <RedeemInputCard
        couponCode={couponCode}
        setCouponCode={setCouponCode}
        onSubmit={(e) => void handleCodeSubmit(e)}
        onStartCamera={() => void startCamera()}
        onUpload={handleImageUpload}
      />

      <RedeemScannerModal
        show={showScanner}
        videoRef={videoRef}
        onClose={stopCamera}
      />

      <RedeemCropModal
        show={showCropModal}
        uploadedImage={uploadedImage}
        onClose={() => {
          setShowCropModal(false);
          setUploadedImage(null);
          setCrop({ x: 0, y: 0 });
          setZoom(1);
        }}
        crop={crop}
        setCrop={setCrop}
        zoom={zoom}
        setZoom={setZoom}
        onCropComplete={onCropComplete}
        onScan={() => void handleScanCroppedArea()}
        cropCanvasRef={cropCanvasRef as React.RefObject<HTMLCanvasElement>}
        croppedAreaPixels={croppedAreaPixels}
      />
    </>
  );
}

export default function StoreRedeemPage(): React.JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <StoreRedeemContent />
    </Suspense>
  );
}
