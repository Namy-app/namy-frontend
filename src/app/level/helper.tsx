import Image from "next/image";

import { type UserLevelInfo } from "@/domains/user/hooks/query/useMyLevel";

import { type Level, type LevelProgress } from "./types";

// ── Static per-level config (colours, icons, copy) ──────────────────────────

interface LevelConfig {
  id: number;
  gemIcon: string;
  borderColor: string;
  shadowColor: string;
  discountColor: string;
  maxLabel: string | null;
  benefitsTitle: string;
  benefits: string[];
  /** Used when usesUntilNextLevel is null (max level) */
  maxSubtitle: string;
  downgradeNote: string | null;
  /** Required uses/month to reach this level (used to build progress bar) */
  requiredUsesForLevel: number;
  /** Required uses/month to reach next level from here */
  requiredUsesForNext: number | null;
}

const LEVEL_CONFIGS: LevelConfig[] = [
  {
    id: 1,
    gemIcon: "/lvl1badge.svg",
    borderColor: "border-[#FDCA50]",
    shadowColor: "shadow-amber-100",
    discountColor: "text-amber-400",
    maxLabel: null,
    benefitsTitle: "Beneficios Novato:",
    benefits: [
      "10% de descuento en todos los lugares",
      "Ver negocios cercanos en el mapa",
      "Aparecer en ranking mensual",
      "Dejar reseñas",
      "Participar en retos semanales",
    ],
    maxSubtitle: "Usa 5 descuentos al mes para subir de nivel",
    downgradeNote: null,
    requiredUsesForLevel: 0,
    requiredUsesForNext: 5,
  },
  {
    id: 2,
    gemIcon: "/lvl2badge.png",
    borderColor: "border-blue-400",
    shadowColor: "shadow-blue-100",
    discountColor: "text-blue-400",
    maxLabel: null,
    benefitsTitle: "Beneficios Explorador:",
    benefits: [
      "12% de descuento en todos los lugares",
      "Reseñas destacadas",
      "Acceso a retos mensuales",
      "Recompensas sorpresa ocasionales",
    ],
    maxSubtitle: "Usa 10 descuentos al mes para subir de nivel",
    downgradeNote: "Si no usas mínimo 1 descuento al mes bajas de nivel",
    requiredUsesForLevel: 5,
    requiredUsesForNext: 10,
  },
  {
    id: 3,
    gemIcon: "/lvl3badge.svg",
    borderColor: "border-red-400",
    shadowColor: "shadow-red-100",
    discountColor: "text-red-400",
    maxLabel: "Nivel Maximo",
    benefitsTitle: "Beneficios Maestro Local:",
    benefits: [
      "15% de descuento en todos los lugares",
      "Insignia visible en reseñas y liga",
      "Promociones exclusivas",
      "Acceso anticipado a funciones nuevas",
      "Invitaciones a experiencias especiales",
    ],
    maxSubtitle: "¡Yujuu! Has desbloqueado el nivel más alto de Ñamy",
    downgradeNote: "Si no usas mínimo 2 descuentos al mes bajas de nivel",
    requiredUsesForLevel: 10,
    requiredUsesForNext: null,
  },
  {
    id: 4,
    gemIcon: "/premiumbadge.png",
    borderColor: "border-fuchsia-500",
    shadowColor: "shadow-fuchsia-100",
    discountColor: "text-fuchsia-500",
    maxLabel: "Estado Premium",
    benefitsTitle: "Con Premium obtienes:",
    benefits: [
      "Descuentos instantáneos",
      "Multiplicador de puntos en liga (x1.25)",
      "Promociones exclusivas Premium",
      "Recompensas mensuales mayores",
    ],
    maxSubtitle: "Siente el poder. Sin anuncios. Sin límites.",
    downgradeNote: "Mientras otros esperan anuncios, tú ya estás comiendo.",
    requiredUsesForLevel: 0,
    requiredUsesForNext: null,
  },
];

export const ALL_GEM_ICONS = LEVEL_CONFIGS.map((c) => ({
  id: c.id,
  icon: c.gemIcon,
}));

// ── Build a Level card from live API data ────────────────────────────────────

export function buildLevel(info: UserLevelInfo): Level {
  const levelId = info.level ?? 1;
  // Premium is id=4; otherwise clamp to 1-3
  const configId = levelId > 3 ? 4 : levelId;
  const cfg = LEVEL_CONFIGS[configId - 1]!;

  const discount = `${info.discountPercentage}%`;

  let progress: LevelProgress | null = null;
  if (cfg.requiredUsesForNext !== null) {
    // current = how many uses this month toward next level
    // total   = uses required to reach next level
    progress = {
      current: Math.min(info.monthlyUsageCount, cfg.requiredUsesForNext),
      total: cfg.requiredUsesForNext,
      from: configId,
      to: configId + 1,
    };
  }

  const subtitle =
    cfg.requiredUsesForNext !== null
      ? `Usa ${cfg.requiredUsesForNext} descuentos al mes para subir de nivel`
      : cfg.maxSubtitle;

  return {
    id: configId,
    gemIcon: cfg.gemIcon,
    name: info.levelName || `Nivel ${configId}`,
    subtitle,
    discount,
    daysLabel: "",
    borderColor: cfg.borderColor,
    shadowColor: cfg.shadowColor,
    discountColor: cfg.discountColor,
    progress,
    maxLabel: cfg.maxLabel,
    downgradeNote: cfg.downgradeNote,
    streak: 0, // computed separately in page.tsx
    benefitsTitle: cfg.benefitsTitle,
    benefits: cfg.benefits,
  };
}

// ── UI components ────────────────────────────────────────────────────────────

export function Gem({ icon, active }: { icon: string; active: boolean }) {
  return (
    <div
      className={`relative shrink-0 transition-all duration-300 ${
        active ? "scale-125 drop-shadow-lg" : "scale-90 opacity-40"
      }`}
    >
      <Image
        src={icon}
        alt="gem"
        width={64}
        height={72}
        className="object-contain"
      />
    </div>
  );
}

export function ProgressBar({ current, total, from, to }: LevelProgress) {
  const pct = Math.min((current / total) * 100, 100);
  return (
    <div className="flex items-center gap-2 mt-3">
      <span className="w-6 h-6 rounded-full bg-amber-400 text-white text-xs font-bold flex items-center justify-center shrink-0">
        {from}
      </span>
      <div className="flex-1 h-7 bg-amber-50 rounded-full relative overflow-hidden border border-amber-300">
        <div
          className="h-full rounded-full bg-linear-to-r from-amber-400 to-yellow-300 transition-all duration-1000"
          style={{ width: `${pct}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-amber-800">
          ⭐ {current}/{total} usos
        </div>
      </div>
      <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-400 text-xs font-bold flex items-center justify-center shrink-0">
        {to}
      </span>
    </div>
  );
}

export function MaxBadge({ label }: { label: string }) {
  return (
    <div className="mt-3 w-full py-2.5 rounded-full bg-linear-to-r from-amber-400 to-yellow-300 flex items-center justify-center">
      <span className="text-sm font-black text-white tracking-wide">
        {label}
      </span>
    </div>
  );
}
