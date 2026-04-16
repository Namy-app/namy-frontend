"use client";

import Image from "next/image";
import Link from "next/link";

import { buildLevel } from "@/app/level/helper";
import { Emoji } from "@/components/Emoji";
import { useMyLevel } from "@/domains/user/hooks/query/useMyLevel";
import { useAuthStore } from "@/store/useAuthStore";

export function UserLevelBanner(): React.JSX.Element | null {
  const { user, isAuthenticated } = useAuthStore();
  const { data: myLevel } = useMyLevel();

  if (!isAuthenticated || !user || !myLevel) {
    return null;
  }

  const level = buildLevel(myLevel);

  return (
    <Link href="/level" className="mb-6 block min-w-0 px-4">
      <div
        className={`rounded-3xl border-2 bg-white px-4 py-3 shadow-sm ${level.borderColor}`}
      >
        {/* Top row: gem + name + points + level badge */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Gem icon */}
          <Image
            src={level.gemIcon}
            alt="level gem"
            width={40}
            height={40}
            className="object-contain shrink-0"
          />

          {/* Greeting */}
          <span className="min-w-0 flex-1 truncate text-base font-bold text-[#2D2D2D]">
            ¡Hola {user.displayName ?? "Usuario"}!
          </span>

          {/* Points */}
          <div className="flex items-center gap-1 shrink-0">
            <span className="font-black text-[#F1A151] text-base">
              {myLevel.totalUsageCount * 100}
            </span>
            <Emoji cp="1f525" label="fuego" className="inline-block w-5 h-5" />
          </div>

          {/* Level badge */}
          <div className="shrink-0 bg-[#EEF0FF] text-[#6C63FF] text-xs font-black px-3 py-1.5 rounded-full">
            Nivel {myLevel.level}
          </div>
        </div>

        {/* Progress bar */}
        {level.progress ? (
          <div className="mt-3 flex min-w-0 items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-white">
              {level.progress.from}
            </span>
            <div className="relative h-9 min-w-0 flex-1 overflow-hidden rounded-full border border-amber-200 bg-amber-50">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-700"
                style={{
                  width: `${Math.min((level.progress.current / level.progress.total) * 100, 100)}%`,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-amber-800 drop-shadow-sm">
                <Emoji
                  cp="2b50"
                  label="estrella"
                  className="inline-block w-4 h-4 align-text-bottom"
                />{" "}
                {level.progress.current}/{level.progress.total} usos
              </div>
            </div>
            <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-400 text-xs font-bold flex items-center justify-center shrink-0">
              {level.progress.to}
            </span>
          </div>
        ) : (
          <div className="mt-3 w-full py-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 flex items-center justify-center">
            <span className="text-xs font-black text-white tracking-wide">
              {level.maxLabel ?? "Nivel Máximo"}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
