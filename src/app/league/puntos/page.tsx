"use client";

import { useMyActiveChallenges } from "@/domains/gamification/hooks";
import type { UserChallenge } from "@/lib/api-types";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface PointAction {
  id: number;
  icon: string;
  label: string;
  pts: string;
  multiplier?: boolean;
}

// ─── Static data ───────────────────────────────────────────────────────────────

const POINT_ACTIONS: PointAction[] = [
  { id: 1, icon: "🎟️", label: "Usar cupón", pts: "+100 pts" },
  { id: 2, icon: "⭐", label: "Dejar una reseña", pts: "+40 pts" },
  { id: 3, icon: "📸", label: "Subir post (1 vez por semana)", pts: "+50 pts" },
  { id: 4, icon: "🏪", label: "Usar cupón en un lugar nuevo", pts: "+25 pts" },
  { id: 5, icon: "👥", label: "Invita un amigo a Ñamy", pts: "+75 pts" },
  { id: 6, icon: "🔥", label: "Entra a Ñamy cada dia", pts: "+5 pts" },
  { id: 7, icon: "📅", label: "Entra a Ñamy 7 dias seguidos", pts: "+40 pts" },
  {
    id: 8,
    icon: "👑",
    label: "Ñamy Premium",
    pts: "x1.25 pts",
    multiplier: true,
  },
];

// Map entityType → badge label + color
const ENTITY_BADGE: Record<string, { label: string; color: string }> = {
  login_streaks: { label: "RACHA", color: "bg-green-500" },
  discounts: { label: "CUPONES", color: "bg-orange-500" },
  first_visit_coupon_redemption: { label: "EXPLORADOR", color: "bg-blue-500" },
  reviews: { label: "RESEÑAS", color: "bg-yellow-500" },
  mural_posts: { label: "MURAL", color: "bg-pink-500" },
  referrals: { label: "REFERIDOS", color: "bg-indigo-500" },
  stores: { label: "TIENDAS", color: "bg-teal-500" },
};

// ─── Sub-components ────────────────────────────────────────────────────────────

function ActionRow({ action }: { action: PointAction }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
      <span className="text-2xl w-8 text-center shrink-0">{action.icon}</span>
      <span className="flex-1 text-sm font-semibold text-gray-700">
        {action.label}
      </span>
      <span
        className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 ${
          action.multiplier
            ? "bg-amber-50 text-amber-600 border border-amber-200"
            : "bg-orange-50 text-orange-500 border border-orange-200"
        }`}
      >
        {action.pts}
      </span>
    </div>
  );
}

function ChallengeCard({ userChallenge }: { userChallenge: UserChallenge }) {
  const { challenge, count } = userChallenge;
  if (!challenge) {
    return null;
  }

  const total = challenge.count;
  const current = Math.min(count, total);
  const pct = total > 0 ? (current / total) * 100 : 0;

  const badge = ENTITY_BADGE[challenge.entityType] ?? {
    label: "DESAFÍO",
    color: "bg-purple-600",
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-purple-100">
      {/* Badge + pts */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`text-xs font-black px-3 py-1.5 rounded-full text-white ${badge.color}`}
        >
          {badge.label}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-xl">🔥</span>
          <span className="text-lg font-black text-gray-800">
            +{challenge.points} puntos
          </span>
        </div>
      </div>

      {/* Title + description */}
      <h3 className="text-xl font-black text-green-600 mb-1">
        {challenge.name}
      </h3>
      <p className="text-sm text-gray-500 font-semibold mb-4">
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
          {current}/{total}
        </div>
      </div>
    </div>
  );
}

function ChallengesSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="bg-white rounded-3xl p-5 shadow-sm border border-purple-100 h-40"
        >
          <div className="h-4 w-20 bg-gray-200 rounded-full mb-3" />
          <div className="h-6 w-40 bg-gray-200 rounded mb-2" />
          <div className="h-3 w-56 bg-gray-200 rounded mb-4" />
          <div className="h-10 bg-gray-200 rounded-full" />
        </div>
      ))}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function HowToEarnPoints() {
  const { data: challenges, isLoading } = useMyActiveChallenges();

  const onBack = () => {
    window.history.back();
  };

  return (
    <div
      className="max-w-5xl mx-auto min-h-screen bg-white flex flex-col"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-0 { animation: fadeUp .4s ease 0.00s both; }
        .fade-1 { animation: fadeUp .4s ease 0.08s both; }
        .fade-2 { animation: fadeUp .4s ease 0.16s both; }
        .fade-3 { animation: fadeUp .4s ease 0.24s both; }
        .fade-4 { animation: fadeUp .4s ease 0.32s both; }
      `}</style>

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-2 fade-0">
        <button
          onClick={onBack}
          className="text-gray-700 text-xl font-black w-8 h-8 flex items-center justify-center hover:text-gray-900 transition-colors"
        >
          ←
        </button>
        <h1 className="text-lg font-black text-gray-900">
          ¿Cómo ganar puntos?
        </h1>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 pb-8 flex flex-col gap-6">
        {/* Subtitle */}
        <p className="text-sm text-gray-400 font-semibold px-1 fade-0">
          Usa la app, completa retos y gana puntos cada mes.
        </p>

        {/* Actions card */}
        <div className="bg-white rounded-3xl px-5 py-2 shadow-md border border-gray-100 fade-1">
          {POINT_ACTIONS.map((a) => (
            <ActionRow key={a.id} action={a} />
          ))}
        </div>

        {/* Challenges header */}
        <div className="flex items-center justify-center gap-2 fade-2">
          <h2 className="text-xl font-black text-gray-900">Desafíos activos</h2>
          <span className="text-xl">🍴</span>
        </div>

        {/* Challenge cards */}
        <div className="flex flex-col gap-4 fade-3">
          {isLoading ? (
            <ChallengesSkeleton />
          ) : challenges && challenges.length > 0 ? (
            challenges.map((uc) => (
              <ChallengeCard key={uc.id} userChallenge={uc} />
            ))
          ) : (
            <p className="text-center text-gray-400 text-sm font-semibold pt-4">
              No tienes desafíos activos en este momento.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
