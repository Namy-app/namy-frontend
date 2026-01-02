"use client";

import { useState, useMemo } from "react";

import { RewardedVideoAd } from "@/components/RewardedVideoAd";

export default function UnlockCouponPage(): React.JSX.Element {
  const [couponUnlocked, setCouponUnlocked] = useState(false);
  const [showAd, setShowAd] = useState(false);

  // Generate coupon code using useMemo to avoid recreating it on every render
  const couponCode = useMemo(
    // eslint-disable-next-line react-hooks/purity
    () => `COUPON-${Math.random().toString(36).substring(7).toUpperCase()}`,
    []
  );

  // This would come from your actual coupon data
  const coupon = {
    name: "50% OFF at Restaurant XYZ",
    restaurant: "Tacos El Güero",
    discount: "50%",
    value: "$10",
    expiresAt: "2025-12-31",
  };

  const handleAdComplete = () => {
    setCouponUnlocked(true);
    // Here you would call your backend to mark coupon as redeemed
    // Example: await redeemCoupon(couponId);
  };

  const handleAdSkipped = () => {
    alert("Por favor mira el video completo para desbloquear tu cupón");
    setShowAd(false);
  };

  const handleAdError = (error: Error) => {
    console.error("Ad error:", error);
    alert("Error al cargar el anuncio. Por favor intenta de nuevo.");
    setShowAd(false);
  };

  if (couponUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-6">
        <div className="max-w-2xl mx-auto pt-20">
          {/* Success State */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-8 text-white text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-3xl font-bold mb-2">¡Cupón Desbloqueado!</h1>
              <p className="text-green-100">Muestra esto al cajero</p>
            </div>

            <div className="p-8">
              {/* QR Code / Barcode Placeholder */}
              <div className="bg-gray-100 rounded-lg p-8 mb-6 text-center">
                <div className="text-6xl mb-4">📱</div>
                <div className="font-mono text-2xl font-bold">{couponCode}</div>
              </div>

              {/* Coupon Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center border-b pb-3">
                  <span className="text-gray-600">Restaurante</span>
                  <span className="font-bold text-lg">{coupon.restaurant}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-3">
                  <span className="text-gray-600">Descuento</span>
                  <span className="font-bold text-2xl text-green-600">
                    {coupon.discount}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b pb-3">
                  <span className="text-gray-600">Valor</span>
                  <span className="font-bold text-lg">
                    Hasta {coupon.value}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Expira</span>
                  <span className="font-semibold">{coupon.expiresAt}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-full shadow-lg">
                  Usar Ahora
                </button>
                <button className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-4 rounded-full">
                  Guardar para Después
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showAd) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
        <div className="max-w-4xl w-full">
          <RewardedVideoAd
            onAdComplete={handleAdComplete}
            onAdSkipped={handleAdSkipped}
            onAdError={handleAdError}
            couponName={coupon.name}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 p-6">
      <div className="max-w-2xl mx-auto pt-20">
        {/* Initial State - Locked Coupon */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 text-white text-center relative">
            <div className="absolute top-4 right-4">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                🔒 Bloqueado
              </div>
            </div>
            <div className="text-6xl mb-4 opacity-50">🎟️</div>
            <h1 className="text-3xl font-bold mb-2">{coupon.name}</h1>
            <p className="text-purple-100">{coupon.restaurant}</p>
          </div>

          <div className="p-8">
            {/* Coupon Preview (Blurred) */}
            <div className="relative mb-6">
              <div className="filter blur-sm pointer-events-none">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    {coupon.discount}
                  </div>
                  <div className="text-gray-600">
                    Valor hasta {coupon.value}
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/80 text-white px-6 py-3 rounded-full font-bold text-lg">
                  🔒 Mira el Anuncio para Desbloquear
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-blue-900 mb-3 flex items-center">
                <span className="text-2xl mr-2">💡</span>
                Cómo funciona
              </h3>
              <ol className="space-y-2 text-blue-800">
                <li className="flex items-start">
                  <span className="font-bold mr-2">1.</span>
                  <span>Mira un video publicitario corto de 30 segundos</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">2.</span>
                  <span>Obtén tu código de cupón al instante</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">3.</span>
                  <span>
                    ¡Muéstralo en el restaurante y disfruta tu descuento!
                  </span>
                </li>
              </ol>
            </div>

            {/* Unlock Button */}
            <button
              onClick={() => setShowAd(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-5 rounded-full text-xl shadow-2xl transform transition hover:scale-105"
            >
              🎬 Mira el Video y Desbloquea el Cupón
            </button>

            {/* Benefits */}
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-sm text-gray-600">30 Segundos</div>
              </div>
              <div>
                <div className="text-3xl mb-2">🎁</div>
                <div className="text-sm text-gray-600">100% Gratis</div>
              </div>
              <div>
                <div className="text-3xl mb-2">💰</div>
                <div className="text-sm text-gray-600">Ahorra Dinero</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
