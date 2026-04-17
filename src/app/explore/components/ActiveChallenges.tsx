"use client";

import { Flame, Swords } from "lucide-react";
import Link from "next/link";

import { useMyActiveChallenges } from "@/domains/gamification/hooks";
import type { UserChallenge } from "@/lib/api-types";

// ── Badge config ──────────────────────────────────────────────────────────────

const ENTITY_BADGE: Record<string, { label: string; color: string }> = {
  login_streaks: { label: "RACHA", color: "bg-green-500" },
  discounts: { label: "CUPONES", color: "bg-orange-500" },
  first_visit_coupon_redemption: { label: "EXPLORADOR", color: "bg-blue-500" },
  reviews: { label: "RESEÑAS", color: "bg-yellow-500" },
  mural_posts: { label: "MURAL", color: "bg-pink-500" },
  referrals: { label: "REFERIDOS", color: "bg-indigo-500" },
  stores: { label: "TIENDAS", color: "bg-teal-500" },
};

function getPeriodLabel(challenge: UserChallenge["challenge"]): string {
  if (!challenge) {
    return "DESAFÍO";
  }
  if (challenge.entityType === "login_streaks" && challenge.count === 1) {
    return "DIARIO";
  }
  if (challenge.count >= 3) {
    return "SEMANAL";
  }
  return "DIARIO";
}

// ── Card ──────────────────────────────────────────────────────────────────────

function ChallengeCard({ userChallenge }: { userChallenge: UserChallenge }) {
  const { challenge, count } = userChallenge;
  if (!challenge) {
    return null;
  }

  const total = challenge.count;
  const current = Math.min(count, total);
  const pct = total > 0 ? (current / total) * 100 : 0;
  const period = getPeriodLabel(challenge);
  const badge = ENTITY_BADGE[challenge.entityType] ?? {
    label: "DESAFÍO",
    color: "bg-purple-600",
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#E8E4FF]">
      {/* Period badge + points */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`text-xs font-black px-3 py-1.5 rounded-full text-white ${badge.color}`}
        >
          {period}
        </span>
        <div className="flex items-center gap-1">
          <Flame
            className="w-4 h-4 shrink-0 text-orange-500"
            strokeWidth={2.5}
            aria-hidden
          />
          <span className="text-base font-black text-gray-800">
            +{challenge.points} puntos
          </span>
        </div>
      </div>

      {/* Title + description */}
      <h3 className="text-lg font-black text-[#2D2D2D] mb-1">
        {challenge.name}
      </h3>
      <p className="text-sm text-gray-500 font-medium mb-4">
        {current >= total
          ? "¡Completado! Puntos acreditados."
          : `${current} de ${total} completados`}
      </p>

      {/* Progress bar */}
      <div className="relative h-10 bg-amber-100 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-sm font-black text-white drop-shadow">
          {current}/{total} usos
        </div>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="bg-white rounded-3xl p-5 border border-[#E8E4FF] h-44 animate-pulse"
        >
          <div className="h-5 w-20 bg-gray-200 rounded-full mb-3" />
          <div className="h-5 w-40 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-52 bg-gray-200 rounded mb-4" />
          <div className="h-10 bg-gray-200 rounded-full" />
        </div>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ActiveChallenges(): React.JSX.Element | null {
  const { data: challenges, isLoading } = useMyActiveChallenges();

  if (!isLoading && (!challenges || challenges.length === 0)) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="px-6 mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <span>Desafíos activos</span>
          <Swords
            className="w-5 h-5 shrink-0 text-[#F1A151]"
            strokeWidth={2.5}
            aria-hidden
          />
        </h2>
        <Link
          href="/league/puntos"
          className="text-sm font-semibold text-[#F1A151] hover:underline"
        >
          Ver todos
        </Link>
      </div>

      {isLoading ? (
        <div className="px-6">
          <Skeleton />
        </div>
      ) : (
        <div className="flex flex-col gap-4 px-6 sm:grid sm:grid-cols-2 lg:grid-cols-3">
          {challenges!.map((uc) => (
            <ChallengeCard key={uc.id} userChallenge={uc} />
          ))}
        </div>
      )}
    </div>
  );
}
