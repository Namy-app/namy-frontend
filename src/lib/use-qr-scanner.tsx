"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Area } from "react-easy-crop";

import { CouponDecoder, type DecodedCouponData } from "@/lib/coupon-decoder";

import { scanQRCode, createCroppedImage } from "./qr-utils";

type UseQrScannerOpts = {
  onDecoded: (decoded: DecodedCouponData) => void;
  onError?: (err: unknown) => void;
  onToast?: (t: {
    title: string;
    description?: string;
    variant?: string;
  }) => void;
  setIsQRScanned?: (v: boolean) => void;
};

export function useQrScanner({
  onDecoded,
  onError,
  onToast,
  setIsQRScanned,
}: UseQrScannerOpts): Readonly<{
  videoRef: React.RefObject<HTMLVideoElement | null>;
  showScanner: boolean;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  showCropModal: boolean;
  uploadedImage: string | null;
  setUploadedImage: (v: string | null) => void;
  setShowCropModal: (v: boolean) => void;
  crop: { x: number; y: number };
  setCrop: (c: { x: number; y: number }) => void;
  zoom: number;
  setZoom: (z: number) => void;
  croppedAreaPixels: Area | null;
  setCroppedAreaPixels: (p: Area | null) => void;
  cropCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  onCropComplete: (a: Area, b: Area) => void;
  handleImageUpload: (f: File) => void;
  handleScanCroppedArea: () => Promise<void>;
}> {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  const [showCropModal, setShowCropModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const onCropComplete = useCallback(
    (_croppedArea: Area, pixels: Area): void => {
      setCroppedAreaPixels(pixels);
    },
    []
  );

  const stopCamera = useCallback((): void => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setShowScanner(false);
  }, []);

  const startCamera = useCallback(async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          // start scanning loop
          const scanLoop = async (): Promise<void> => {
            if (!videoRef.current || !showScanner) {
              return;
            }
            try {
              const canvas = document.createElement("canvas");
              canvas.width = videoRef.current.videoWidth;
              canvas.height = videoRef.current.videoHeight;
              const ctx = canvas.getContext("2d");
              if (!ctx) {
                return;
              }
              ctx.drawImage(
                videoRef.current,
                0,
                0,
                canvas.width,
                canvas.height
              );
              const imageData = ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
              );
              const qrData = await scanQRCode(imageData);
              if (qrData) {
                try {
                  const url = new URL(qrData);
                  const enc = url.searchParams.get("enc");
                  if (!enc) {
                    stopCamera();
                    onToast?.({
                      title: "Invalid QR format",
                      description:
                        "Expected a full URL with 'enc' query parameter.",
                      variant: "destructive",
                    });
                    return;
                  }
                  const decoded = await CouponDecoder.decodeAsync(enc);
                  onDecoded(decoded);
                  stopCamera();
                  onToast?.({
                    title: "Coupon loaded",
                    description: `${decoded.store?.name ?? "Store"} - ${decoded.discount?.title ?? "Discount"}`,
                  });
                  setIsQRScanned?.(true);
                  return;
                } catch (_) {
                  // not a URL -> try raw
                }

                if (qrData.split(".").length === 3) {
                  try {
                    const decoded = await CouponDecoder.decodeAsync(qrData);
                    onDecoded(decoded);
                    stopCamera();
                    onToast?.({
                      title: "Coupon loaded",
                      description: `${decoded.store?.name ?? "Store"} - ${decoded.discount?.title ?? "Discount"}`,
                    });
                    setIsQRScanned?.(true);
                    return;
                  } catch (decErr) {
                    stopCamera();
                    onToast?.({
                      title: "Invalid QR Code",
                      description: "Could not decrypt scanned payload.",
                      variant: "destructive",
                    });
                    onError?.(decErr);
                    return;
                  }
                }
                stopCamera();
                onToast?.({
                  title: "Invalid QR Code",
                  description: "Unsupported QR payload.",
                  variant: "destructive",
                });
                return;
              }
            } catch (_) {
              // ignore
            }
            requestAnimationFrame(() => void scanLoop());
          };
          void scanLoop();
        };
      }
      setShowScanner(true);
    } catch (err) {
      onToast?.({
        title: "Camera access denied",
        description:
          "Please enter the code manually or check camera permissions.",
        variant: "destructive",
      });
      onError?.(err);
    }
  }, [onDecoded, onError, onToast, setIsQRScanned, showScanner, stopCamera]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const handleImageUpload = useCallback((file: File): void => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target?.result as string;
      setUploadedImage(imageDataUrl);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleScanCroppedArea = useCallback(async (): Promise<void> => {
    if (!uploadedImage || !croppedAreaPixels) {
      return;
    }
    try {
      const enhancedImageData = await createCroppedImage(
        uploadedImage,
        croppedAreaPixels,
        true
      );
      if (!enhancedImageData) {
        onToast?.({
          title: "Error processing image",
          description: "Please try again.",
          variant: "destructive",
        });
        return;
      }
      let qrData = await scanQRCode(enhancedImageData);
      if (!qrData) {
        const original = await createCroppedImage(
          uploadedImage,
          croppedAreaPixels,
          false
        );
        if (original) {
          qrData = await scanQRCode(original);
        }
      }
      if (!qrData) {
        onToast?.({
          title: "No QR code found",
          description: "Please adjust the crop area or try another image.",
          variant: "destructive",
        });
        return;
      }

      try {
        const url = new URL(qrData);
        const encParam = url.searchParams.get("enc");
        const encryptedData =
          encParam ?? url.pathname.split("/").filter(Boolean).pop() ?? null;
        if (!encryptedData) {
          throw new Error("Invalid QR code format: no enc param or path token");
        }
        const decryptedData = await CouponDecoder.decodeAsync(encryptedData);
        onDecoded(decryptedData);
        setShowCropModal(false);
        setUploadedImage(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
        onToast?.({
          title: "QR Code scanned successfully",
          description: `${decryptedData.store.name} - ${decryptedData.discount.title}`,
        });
        setIsQRScanned?.(true);
        return;
      } catch (_error) {
        // fallback: try to extract raw code
        try {
          // attempt to parse JSON or extract last segment
          const parsed = JSON.parse(qrData as string);
          if (parsed && typeof parsed === "object") {
            // not exposing raw JSON — notify user
            onToast?.({
              title: "QR Code detected",
              description:
                "Could not parse QR payload. Please verify and enter store ID.",
              variant: "destructive",
            });
          }
        } catch (_) {
          onToast?.({
            title: "QR Code detected",
            description:
              "Could not parse QR payload. Please verify and enter store ID.",
            variant: "destructive",
          });
        }
        setShowCropModal(false);
        setUploadedImage(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
      }
    } catch (err) {
      onToast?.({
        title: "Error scanning QR code",
        description: "Please try again.",
        variant: "destructive",
      });
      onError?.(err);
    }
  }, [
    uploadedImage,
    croppedAreaPixels,
    onDecoded,
    onError,
    onToast,
    setIsQRScanned,
  ]);

  return {
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
    setCroppedAreaPixels,
    cropCanvasRef,
    onCropComplete,
    handleImageUpload,
    handleScanCroppedArea,
  } as const;
}
