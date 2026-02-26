"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useCityLeaderboard } from "@/domains/gamification/hooks";
import { BasicLayout } from "@/layouts/BasicLayout";
import type { LeaderboardEntry } from "@/lib/api-types";
import { useAuthStore } from "@/store/useAuthStore";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Player {
  rank: number;
  userId: string;
  name: string;
  pts: number;
  avatarUrl?: string | null;
  city?: string;
  isCurrentUser: boolean;
}

function toPlayer(e: LeaderboardEntry): Player {
  return {
    rank: e.rank,
    userId: e.userId,
    name: e.displayName,
    pts: e.balance,
    avatarUrl: e.avatarUrl ?? null,
    city: e.city,
    isCurrentUser: e.isCurrentUser,
  };
}

// ─── Crown PNG ─────────────────────────────────────────────────────────────────

function Crown() {
  return (
    <Image
      src="/crown 1.png"
      alt="crown"
      width={28}
      height={12}
      className="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
      unoptimized
    />
  );
}

// ─── Avatar with ring ──────────────────────────────────────────────────────────

const BG_COLORS = [
  "bg-orange-200",
  "bg-rose-200",
  "bg-amber-200",
  "bg-lime-200",
  "bg-sky-200",
  "bg-violet-200",
  "bg-pink-200",
  "bg-teal-200",
];

function getInitialsFromName(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return (parts[0]?.[0] ?? "?").toUpperCase();
  }
  return (
    (parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")
  ).toUpperCase();
}

function getBgColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return BG_COLORS[Math.abs(hash) % BG_COLORS.length] ?? "bg-orange-200";
}

// box-shadow glow per podium rank
const PODIUM_GLOW: Record<string, string> = {
  first:
    "0 0 0 2.5px rgba(251,191,36,0.9), 0 0 10px 10px rgba(251,191,36,0.5), 0 0 20px 20px rgba(251,191,36,0.2), 0 0 50px 30px rgba(251,191,36,0.07)",
  second:
    "0 0 0 2px rgba(251,146,60,0.85), 0 0 14px 8px rgba(251,146,60,0.45), 0 0 32px 16px rgba(251,146,60,0.17), 0 0 50px 24px rgba(251,146,60,0.06)",
  third:
    "0 0 0 2px rgba(180,183,189,0.8), 0 0 12px 6px rgba(180,183,189,0.38), 0 0 26px 12px rgba(180,183,189,0.14), 0 0 44px 20px rgba(180,183,189,0.05)",
};

function Avatar({
  name,
  avatarUrl,
  size,
  ring,
  gradientRing,
  badge,
}: {
  name: string;
  avatarUrl?: string | null;
  size: number;
  /** hard ring for list rows */
  ring?: string;
  /** "first" | "second" | "third" — renders a fading glow border */
  gradientRing?: "first" | "second" | "third";
  badge?: number;
}) {
  const isEmojiAvatar =
    avatarUrl &&
    !avatarUrl.startsWith("data:") &&
    !avatarUrl.startsWith("http");
  const isImageAvatar = avatarUrl && !isEmojiAvatar;

  const boxShadow = gradientRing ? PODIUM_GLOW[gradientRing] : undefined;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className={`rounded-full overflow-hidden flex items-center justify-center ${getBgColor(name)} ${!gradientRing ? (ring ?? "") : ""}`}
        style={{ width: size, height: size, boxShadow }}
      >
        {isImageAvatar ? (
          <Image
            src={avatarUrl}
            alt={name}
            width={size}
            height={size}
            className="object-cover w-full h-full"
            unoptimized
          />
        ) : isEmojiAvatar ? (
          <span style={{ fontSize: size * 0.5 }}>{avatarUrl}</span>
        ) : (
          <span
            className="font-black text-white select-none"
            style={{ fontSize: size * 0.35 }}
          >
            {getInitialsFromName(name)}
          </span>
        )}
      </div>
      {badge != null && (
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gray-700 text-white text-[10px] font-black flex items-center justify-center border-2 border-white">
          {badge}
        </span>
      )}
    </div>
  );
}

// ─── Player modal ──────────────────────────────────────────────────────────────

function PlayerModal({
  player,
  onClose,
}: {
  player: Player;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Avatar
              name={player.name}
              avatarUrl={player.avatarUrl}
              size={36}
              ring="ring-2 ring-gray-200"
            />
            <span className="text-base font-black text-gray-900">
              {player.name}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        {/* Total points */}
        <div className="text-center mb-5">
          <p className="text-4xl font-black text-orange-500">
            {player.pts.toLocaleString()}
          </p>
          <p className="text-sm text-gray-400 font-semibold mt-0.5">
            Puntos Totales
          </p>
        </div>

        {/* City */}
        {player.city ? (
          <div className="text-center">
            <p className="text-sm text-gray-500 font-semibold">
              📍 {player.city}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ─── Top-3 podium card ─────────────────────────────────────────────────────────

function PodiumCard({
  player,
  isFirst,
  onClick,
}: {
  player: Player;
  isFirst: boolean;
  onClick: () => void;
}) {
  const size = isFirst ? 88 : 72;
  const gradientRing = isFirst
    ? "first"
    : player.rank === 2
      ? "second"
      : "third";

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 ${isFirst ? "-mt-4" : "mt-4"} active:scale-95 transition-transform`}
    >
      <div className="relative">
        {isFirst ? <Crown /> : null}
        <Avatar
          name={player.name}
          avatarUrl={player.avatarUrl}
          size={size}
          gradientRing={gradientRing}
          badge={!isFirst ? player.rank : undefined}
        />
      </div>
      <p className="text-xs font-bold text-gray-700 text-center max-w-20 leading-tight mt-1">
        {player.name}
      </p>
      <p className="text-sm font-black text-gray-900">{player.pts}pts</p>
    </button>
  );
}

// ─── List row ──────────────────────────────────────────────────────────────────

function LeaderRow({
  player,
  onClick,
}: {
  player: Player;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm transition-all active:scale-95 ${
        player.isCurrentUser
          ? "border-2 border-orange-400 shadow-orange-100 shadow-md"
          : "border border-gray-100"
      }`}
    >
      <span className="w-5 text-sm font-black text-gray-400 text-center shrink-0">
        {player.rank}
      </span>
      <Avatar
        name={player.name}
        avatarUrl={player.avatarUrl}
        size={40}
        ring="ring-2 ring-gray-200"
      />
      <span className="flex-1 text-sm font-bold text-gray-800 text-left">
        {player.name}
      </span>
      <span className="text-sm font-black text-gray-800">{player.pts}pts</span>
    </button>
  );
}

// ─── Skeleton loader ───────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex justify-center items-end gap-6 px-6 pt-6 pb-4">
        {[72, 88, 72].map((size, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div
              className="rounded-full bg-gray-200"
              style={{ width: size, height: size }}
            />
            <div className="h-3 w-16 bg-gray-200 rounded" />
            <div className="h-4 w-12 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
      <div className="flex-1 bg-blue-50/60 rounded-t-3xl px-4 pt-5 pb-4 flex flex-col gap-2.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-16 bg-white rounded-2xl border border-gray-100"
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function League() {
  const [selected, setSelected] = useState<Player | null>(null);
  const { user: authUser } = useAuthStore();
  const { data: entries, isLoading } = useCityLeaderboard(20);

  const players: Player[] = (entries ?? []).map(toPlayer);

  // Separate podium (top 3) from list (4+)
  // The current user may appear appended after rank 20 — keep them visible
  const top3 = players.filter((p) => p.rank <= 3);
  const rest = players.filter((p) => p.rank > 3);

  // If current user is outside top 3 and not in rest, they were appended — already in rest
  const cityLabel = authUser?.city ? ` · ${authUser.city}` : "";

  return (
    <BasicLayout className="bg-gradient-hero">
      <div
        className="max-w-5xl mx-auto min-h-screen bg-white flex flex-col pt-14"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-0 { animation: fadeUp .4s ease 0.00s both; }
        .fade-1 { animation: fadeUp .4s ease 0.06s both; }
        .fade-2 { animation: fadeUp .4s ease 0.12s both; }
        .fade-3 { animation: fadeUp .4s ease 0.18s both; }
      `}</style>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2 fade-0">
          <div className="w-8" />
          <div className="text-center">
            <h1 className="text-lg font-black text-gray-900 tracking-tight">
              Liga Ñamy
            </h1>
            {cityLabel ? (
              <p className="text-xs text-gray-400 font-semibold -mt-0.5">
                {cityLabel}
              </p>
            ) : null}
          </div>
          <Link
            href="/league/puntos"
            className="flex flex-col items-center gap-0.5"
          >
            <span className="text-xl">🎯</span>
            <span className="text-[10px] font-bold text-gray-400">Puntos</span>
          </Link>
        </div>

        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            {/* Podium top-3 */}
            {top3.length >= 1 && (
              <div className="flex justify-center items-end gap-6 px-6 pt-6 pb-4 fade-1">
                {top3[1] ? (
                  <PodiumCard
                    player={top3[1]}
                    isFirst={false}
                    onClick={() => setSelected(top3[1] ?? null)}
                  />
                ) : null}
                <PodiumCard
                  player={top3[0]!}
                  isFirst
                  onClick={() => setSelected(top3[0] ?? null)}
                />
                {top3[2] ? (
                  <PodiumCard
                    player={top3[2]}
                    isFirst={false}
                    onClick={() => setSelected(top3[2] ?? null)}
                  />
                ) : null}
              </div>
            )}

            {/* List */}
            <div className="flex-1 bg-blue-50/60 rounded-t-3xl px-4 pt-5 pb-4 flex flex-col gap-2.5 fade-2 overflow-y-auto">
              {rest.map((player) => (
                <LeaderRow
                  key={player.userId}
                  player={player}
                  onClick={() => setSelected(player)}
                />
              ))}
              {players.length === 0 && (
                <p className="text-center text-gray-400 text-sm font-semibold pt-8">
                  Aún no hay puntos en tu ciudad.
                </p>
              )}
              <div className="h-24" />
            </div>
          </>
        )}

        {/* Modal */}
        {selected ? (
          <PlayerModal player={selected} onClose={() => setSelected(null)} />
        ) : null}
      </div>
    </BasicLayout>
  );
}
