import Image from "next/image";

import { type Level, type LevelProgress } from "./types";

export const LEVELS: Level[] = [
  {
    id: 1,
    gemIcon: "/lvl1badge.svg",
    name: "Nivel 1: Novato",
    subtitle: "Usa 5 descuentos al mes para subir de nivel",
    discount: "10%",
    daysLabel: "15 Dias",
    borderColor: "border-[#FDCA50]",
    shadowColor: "shadow-amber-100",
    discountColor: "text-amber-400",
    progress: { current: 4, total: 5, from: 1, to: 2 },
    maxLabel: null,
    downgradeNote: null,
    streak: 100,
    benefitsTitle: "Beneficios Novato:",
    benefits: [
      "10% de descuento en todos los lugares",
      "Ver negocios cercanos en el mapa",
      "Aparecer en ranking mensual",
      "Dejar reseñas",
      "Participar en retos semanales",
    ],
  },
  {
    id: 2,
    gemIcon: "/lvl2badge.png",
    name: "Nivel 2: Explorador",
    subtitle: "Usa 10 descuentos al mes para subir de nivel",
    discount: "12%",
    daysLabel: "20 Dias",
    borderColor: "border-blue-400",
    shadowColor: "shadow-blue-100",
    discountColor: "text-blue-400",
    progress: { current: 8, total: 10, from: 2, to: 3 },
    maxLabel: null,
    downgradeNote: "Si no usas mínimo 1 descuento al mes bajas de nivel",
    streak: 50,
    benefitsTitle: "Beneficios Explorador:",
    benefits: [
      "12% de descuento en todos los lugares",
      "Reseñas destacadas",
      "Acceso a retos mensuales",
      "Recompensas sorpresa ocasionales",
    ],
  },
  {
    id: 3,
    gemIcon: "/lvl3badge.svg",
    name: "Nivel 3: Maestro Local",
    subtitle: "Yujuu! Has desbloqueado el nivel mas alto de Ñamy",
    discount: "15%",
    daysLabel: "5 Dias",
    borderColor: "border-red-400",
    shadowColor: "shadow-red-100",
    discountColor: "text-red-400",
    progress: null,
    maxLabel: "Nivel Maximo",
    downgradeNote: "Si no usas mínimo 2 descuentos al mes bajas de nivel",
    streak: 1100,
    benefitsTitle: "Beneficios Maestro Local:",
    benefits: [
      "15% de descuento en todos los lugares",
      "Insignia visible en reseñas y liga",
      "Promociones exclusivas",
      "Acceso anticipado a funciones nuevas",
      "Invitaciones a experiencias especiales",
    ],
  },
  {
    id: 4,
    gemIcon: "/premiumbadge.png",
    name: "Ñamy Premium",
    subtitle: "Siente el poder. Sin anuncios. Sin límites.",
    discount: "15%",
    daysLabel: "5 Dias",
    borderColor: "border-fuchsia-500",
    shadowColor: "shadow-fuchsia-100",
    discountColor: "text-fuchsia-500",
    progress: null,
    maxLabel: "Estado Premium",
    downgradeNote: "Mientras otros esperan anuncios, tú ya estas comiendo.",
    streak: 9,
    benefitsTitle: "Con Premium obtienes:",
    benefits: [
      "Descuentos instantáneos",
      "Multiplicador de puntos en liga (x1.25)",
      "Promociones exclusivas Premium",
      "Recompensas mensuales mayores",
    ],
  },
];

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
