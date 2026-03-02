"use client";

import Link from "next/link";
import { useMemo } from "react";

import { useLoginStreak } from "@/domains/gamification/hooks";
import { useMyLevel } from "@/domains/user/hooks/query/useMyLevel";
import { BasicLayout } from "@/layouts/BasicLayout";

import {
  ALL_GEM_ICONS,
  buildLevel,
  Gem,
  MaxBadge,
  ProgressBar,
} from "./helper";

export default function NamyLevel() {
  const { data: levelInfo, isLoading } = useMyLevel();
  const { data: loginStreak = 0 } = useLoginStreak();

  const level = useMemo(
    () => (levelInfo ? buildLevel(levelInfo) : null),
    [levelInfo]
  );

  const currentLevelId = levelInfo?.level ?? 1;

  return (
    <BasicLayout className="bg-gradient-hero">
      <div
        className="max-w-5xl mx-auto min-h-screen flex flex-col pt-14"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes streakPulse {
          0%, 100% { background-color: rgba(255,120,80,0.10); }
          50%       { background-color: rgba(255,120,80,0.20); }
        }
        @keyframes flame {
          0%, 100% { transform: scaleY(1) rotate(-3deg); }
          50%       { transform: scaleY(1.12) rotate(3deg); }
        }
        .fade-up-0 { animation: fadeUp 0.5s ease 0.00s both; }
        .fade-up-1 { animation: fadeUp 0.5s ease 0.07s both; }
        .fade-up-2 { animation: fadeUp 0.5s ease 0.14s both; }
        .fade-up-3 { animation: fadeUp 0.5s ease 0.21s both; }
        .fade-up-4 { animation: fadeUp 0.5s ease 0.28s both; }
        .fade-up-5 { animation: fadeUp 0.5s ease 0.35s both; }
        .streak-pulse { animation: streakPulse 2s ease infinite; }
        .flame        { animation: flame 0.8s ease infinite; display: inline-block; }
      `}</style>

        {/* Header */}
        <div className="text-center px-6 pt-4 pb-4 fade-up-0">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Tu nivel en Ñamy
          </h1>
          <p className="text-sm text-gray-400 font-semibold mt-1 leading-snug">
            Explora y usa cupones y sube de nivel
            <br />
            para mas beneficios
          </p>
        </div>

        {/* Loading skeleton */}
        {isLoading ? <div className="flex-1 px-5 py-4 flex flex-col gap-4 animate-pulse">
            <div className="flex justify-center items-end gap-3 pb-4 px-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-14 h-16 bg-gray-200 rounded-xl" />
              ))}
            </div>
            <div className="h-px bg-gray-100 mx-6" />
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 h-32" />
            <div className="h-16 bg-gray-100 rounded-full mx-4" />
            <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-5 h-40" />
          </div> : null}

        {!isLoading && level ? <>
            {/* Gems row */}
            <div className="flex justify-center items-end gap-3 pb-4 px-4 fade-up-1">
              {ALL_GEM_ICONS.map((g) => (
                <Gem
                  key={g.id}
                  icon={g.icon}
                  active={g.id === currentLevelId}
                />
              ))}
            </div>

            <div className="h-px bg-gray-100 mx-6" />

            {/* Scrollable content */}
            <div className="flex-1 px-5 py-4 flex flex-col gap-4 overflow-y-auto">
              {/* Nivel actual row */}
              <div className="flex justify-between items-center fade-up-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Nivel actual
                </span>
                <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                  🕐 {loginStreak} días
                </span>
              </div>

              {/* Level card */}
              <div
                key={level.id}
                className={`bg-white border-2 ${level.borderColor} rounded-2xl p-4 shadow-lg ${level.shadowColor} fade-up-2`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-2">
                    <h2 className="text-lg font-black text-gray-900">
                      {level.name}
                    </h2>
                    <p className="text-xs text-gray-400 font-semibold mt-0.5">
                      {level.subtitle}
                    </p>
                  </div>
                  <span
                    className={`text-2xl font-black shrink-0 ${level.discountColor}`}
                  >
                    {level.discount}
                  </span>
                </div>

                {level.progress ? (
                  <ProgressBar {...level.progress} />
                ) : (
                  <MaxBadge label={level.maxLabel ?? ""} />
                )}
              </div>

              {/* Monthly usage info */}
              <div className="flex gap-3 fade-up-2">
                <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-3 text-center shadow-sm">
                  <p className="text-2xl font-black text-gray-800">
                    {levelInfo?.monthlyUsageCount ?? 0}
                  </p>
                  <p className="text-xs text-gray-400 font-semibold mt-0.5">
                    Usos este mes
                  </p>
                </div>
                <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-3 text-center shadow-sm">
                  <p className="text-2xl font-black text-gray-800">
                    {levelInfo?.totalUsageCount ?? 0}
                  </p>
                  <p className="text-xs text-gray-400 font-semibold mt-0.5">
                    Usos totales
                  </p>
                </div>
                {levelInfo?.usesUntilNextLevel != null && (
                  <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-3 text-center shadow-sm">
                    <p className="text-2xl font-black text-amber-500">
                      {levelInfo.usesUntilNextLevel}
                    </p>
                    <p className="text-xs text-gray-400 font-semibold mt-0.5">
                      Para subir
                    </p>
                  </div>
                )}
              </div>

              {/* Downgrade note */}
              {level.downgradeNote ? (
                <p className="text-xs text-gray-400 font-semibold text-center px-2 -mt-1 fade-up-2">
                  {level.downgradeNote}
                </p>
              ) : null}

              {/* Streak */}
              <div className="mx-4 rounded-full flex items-center justify-center gap-3 py-4 streak-pulse fade-up-3">
                <span className="text-4xl font-black text-orange-500">
                  {loginStreak}
                </span>
                <span className="text-2xl flame">🔥</span>
                <span className="text-sm font-bold text-orange-700">
                  Racha diaria
                </span>
              </div>

              {/* Benefits */}
              <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-5 fade-up-4">
                <h3 className="text-base font-black text-gray-900 mb-3">
                  {level.benefitsTitle}
                </h3>
                <div className="flex flex-col gap-2">
                  {level.benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <span className="text-green-500 font-black text-base shrink-0">
                        ✓
                      </span>
                      <span className="text-sm text-gray-600 font-semibold">
                        {b}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Premium banner */}
              {currentLevelId < 4 && (
                <Link
                  href="/subscription"
                  className="rounded-2xl p-4 flex items-center gap-4 cursor-pointer fade-up-5 bg-linear-to-r from-fuchsia-500 via-pink-500 to-orange-400 shadow-lg shadow-pink-200 active:scale-95 transition-transform"
                >
                  <span className="text-4xl">🏅</span>
                  <div>
                    <p className="text-white font-black text-sm">
                      Mejores descuentos y sin anuncios
                    </p>
                    <p className="text-white/75 text-xs font-semibold mt-0.5">
                      Ver beneficios
                    </p>
                  </div>
                </Link>
              )}

              <div className="h-24" />
            </div>
          </> : null}
      </div>
    </BasicLayout>
  );
}
