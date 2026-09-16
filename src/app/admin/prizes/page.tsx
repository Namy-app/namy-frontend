"use client";

import { Gift, Loader2, MessageCircle, Search, X } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

import {
  useAdminUserProfileSummary,
  useCreatePrize,
  usePrizes,
  useStores,
} from "@/domains/admin/hooks";
import type { Prize, PrizeStatus, PrizeType } from "@/domains/admin/types";
import { useCityLeaderboard } from "@/domains/gamification/hooks";
import { useToast } from "@/hooks/use-toast";
import type { LeaderboardEntry } from "@/lib/api-types";

function currentMonthValue(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function monthLabel(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  if (!y || !m) {return ym;}
  return new Date(y, m - 1, 1).toLocaleDateString("es-MX", {
    month: "long",
    year: "numeric",
  });
}

const STATUS_STYLES: Record<PrizeStatus, string> = {
  PENDING: "bg-orange-100 text-orange-700",
  CLAIMED: "bg-green-100 text-green-700",
  EXPIRED: "bg-gray-100 text-gray-600",
};

const STATUS_LABELS: Record<PrizeStatus, string> = {
  PENDING: "Pendiente",
  CLAIMED: "Canjeado",
  EXPIRED: "Expirado",
};

const RANK_BADGES = ["🥇", "🥈", "🥉"] as const;

const DESCRIPTION_SUGGESTIONS = [
  "Corte de cabello gratis",
  "Manicure gratis",
  "Pedicure gratis",
  "Masaje gratis",
];

function buildPrizeWhatsAppUrl(
  phone: string,
  displayName: string,
  description: string
): string {
  const digits = phone.replace(/\D/g, "");
  // Use Unicode escape so the trophy isn't corrupted by file encoding,
  // and don't lead the message with the emoji (wa.me/desktop often shows �).
  const trophy = "\u{1F3C6}";
  const message = `¡Felicidades ${displayName}! ${trophy} Ganaste un premio en Ñamy: ${description}. Válido por 30 días. Abre la app para ver tu premio y el código de cupón.`;
  return `https://api.whatsapp.com/send?phone=${digits}&text=${encodeURIComponent(message)}`;
}

function WhatsAppButton({
  phone,
  displayName,
  description,
  className,
}: {
  phone: string;
  displayName: string;
  description: string;
  className?: string;
}) {
  return (
    <a
      href={buildPrizeWhatsAppUrl(phone, displayName, description)}
      target="_blank"
      rel="noopener noreferrer"
      className={
        className ??
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-green-200 bg-green-50 text-green-700 text-xs font-semibold hover:bg-green-100"
      }
    >
      <MessageCircle className="w-3.5 h-3.5" />
      WhatsApp
    </a>
  );
}

function StatusBadge({ status }: { status: PrizeStatus }) {
  return (
    <span
      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

function CreatePrizeModal({
  winner,
  onClose,
  onCreated,
}: {
  winner: LeaderboardEntry;
  onClose: () => void;
  onCreated: () => void;
}) {
  const { toast } = useToast();
  const createPrize = useCreatePrize();
  const { data: storesData } = useStores(undefined, { page: 1, first: 200 });
  const { data: profile } = useAdminUserProfileSummary(winner.userId);

  const [type, setType] = useState<PrizeType>("CUSTOM_COUPON");
  const [description, setDescription] = useState("");
  const [countForBilling, setCountForBilling] = useState(true);
  const [selectedStoreIds, setSelectedStoreIds] = useState<string[]>([]);
  const [storeSearch, setStoreSearch] = useState("");
  const [createdPrize, setCreatedPrize] = useState<{
    description: string;
  } | null>(null);

  const stores = storesData?.data ?? [];
  const filteredStores = stores.filter((s) => {
    const q = storeSearch.trim().toLowerCase();
    if (!q) {return true;}
    return (
      s.name.toLowerCase().includes(q) ||
      (s.city ?? "").toLowerCase().includes(q)
    );
  });

  const winnerName = winner.displayName || "Ganador";
  const phone = winner.phone || profile?.phone || null;

  const toggleStore = (id: string) => {
    setSelectedStoreIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast({
        title: "Descripción requerida",
        description: "Escribe qué premio recibe el ganador.",
        variant: "destructive",
      });
      return;
    }
    if (type === "CUSTOM_COUPON" && selectedStoreIds.length === 0) {
      toast({
        title: "Selecciona tiendas",
        description: "Elige al menos una tienda participante.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createPrize.mutateAsync({
        winnerId: winner.userId,
        type,
        description: description.trim(),
        storeIds: type === "CUSTOM_COUPON" ? selectedStoreIds : undefined,
        countForBilling: type === "CUSTOM_COUPON" ? countForBilling : false,
      });
      toast({
        title: "Premio creado",
        description: `Se notificó a ${winnerName}.`,
      });
      onCreated();
      setCreatedPrize({ description: description.trim() });
    } catch (err) {
      toast({
        title: "Error al crear premio",
        description: err instanceof Error ? err.message : "Intenta de nuevo",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {createdPrize ? "Premio creado" : "Crear Premio"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {RANK_BADGES[winner.rank - 1] ?? `#${winner.rank}`} {winnerName} ·{" "}
              {winner.balance} pts
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {createdPrize ? (
          <div className="px-6 py-8 space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto text-2xl">
              ✓
            </div>
            <p className="text-base font-bold text-foreground">
              ¡Premio creado y notificado!
            </p>
            <p className="text-sm text-muted-foreground">
              {createdPrize.description}
            </p>
            {phone ? (
              <WhatsAppButton
                phone={phone}
                displayName={winnerName}
                description={createdPrize.description}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-green-200 bg-green-50 text-green-700 text-sm font-bold hover:bg-green-100"
              />
            ) : (
              <p className="text-xs text-muted-foreground">
                Este ganador no tiene número de teléfono registrado.
              </p>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Tipo de premio
              </label>
              <div className="flex gap-2">
                {(
                  [
                    ["CUSTOM_COUPON", "Cupón Personalizado"],
                    ["PREMIUM", "Mes Premium"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setType(value)}
                    className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                      type === value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/40 text-foreground border-transparent hover:bg-muted"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe el premio (ej: Corte de cabello gratis)"
                className="w-full rounded-xl border border-border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {DESCRIPTION_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setDescription(s)}
                    className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground hover:bg-muted/80"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {type === "CUSTOM_COUPON" ? (
              <>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Tiendas participantes
                  </label>
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      value={storeSearch}
                      onChange={(e) => setStoreSearch(e.target.value)}
                      placeholder="Buscar tienda..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="max-h-40 overflow-y-auto rounded-xl border border-border divide-y">
                    {filteredStores.map((store) => {
                      const selected = selectedStoreIds.includes(store.id);
                      return (
                        <button
                          key={store.id}
                          type="button"
                          onClick={() => toggleStore(store.id)}
                          className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between ${
                            selected ? "bg-primary/10" : "hover:bg-muted/50"
                          }`}
                        >
                          <span>
                            <span className="font-medium">{store.name}</span>
                            {store.city ? (
                              <span className="text-muted-foreground ml-1">
                                · {store.city}
                              </span>
                            ) : null}
                          </span>
                          {selected ? (
                            <span className="text-primary text-xs font-bold">
                              ✓
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                    {filteredStores.length === 0 ? (
                      <p className="px-3 py-4 text-sm text-muted-foreground text-center">
                        No se encontraron tiendas
                      </p>
                    ) : null}
                  </div>
                  {selectedStoreIds.length > 0 ? (
                    <p className="text-xs text-muted-foreground mt-1.5">
                      {selectedStoreIds.length} seleccionada
                      {selectedStoreIds.length === 1 ? "" : "s"}
                    </p>
                  ) : null}
                </div>

                <label className="flex items-center justify-between gap-3 cursor-pointer">
                  <span className="text-sm font-semibold">
                    Contar para facturación
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={countForBilling}
                    onClick={() => setCountForBilling((v) => !v)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      countForBilling ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        countForBilling ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                </label>
              </>
            ) : null}

            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={createPrize.isPending}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {createPrize.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : null}
              Crear y Notificar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPrizesPage() {
  const [month, setMonth] = useState(currentMonthValue);
  const [createFor, setCreateFor] = useState<LeaderboardEntry | null>(null);
  const isCurrentMonth = month === currentMonthValue();

  const {
    data: prizes = [],
    isLoading: prizesLoading,
    refetch,
  } = usePrizes(month);
  const { data: leaderboard = [], isLoading: leadersLoading } =
    useCityLeaderboard(3);

  const prizesByWinner = useMemo(() => {
    const map = new Map<string, Prize>();
    for (const p of prizes) {
      if (!map.has(p.winnerId)) {
        map.set(p.winnerId, p);
      }
    }
    return map;
  }, [prizes]);

  const top3 = leaderboard.filter((e) => e.rank <= 3).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Gift className="w-8 h-8 text-amber-500" />
            Premios del Mes
          </h1>
          <p className="text-muted-foreground mt-1 capitalize">
            {monthLabel(month)}
          </p>
        </div>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="rounded-xl border border-border px-3 py-2 text-sm bg-card"
        />
      </div>

      {/* Top 3 */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-foreground mb-4">
          Top 3 del leaderboard
        </h2>
        {leadersLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : top3.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6">
            Aún no hay ranking disponible.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {top3.map((entry) => {
              const existing = prizesByWinner.get(entry.userId);
              return (
                <div
                  key={entry.userId}
                  className="bg-card rounded-2xl border border-border p-5 flex flex-col gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {RANK_BADGES[entry.rank - 1] ?? `#${entry.rank}`}
                    </span>
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted shrink-0">
                      {entry.avatarUrl ? (
                        <Image
                          src={entry.avatarUrl}
                          alt=""
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm font-bold text-muted-foreground">
                          {(entry.displayName?.[0] ?? "?").toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-foreground truncate">
                        {entry.displayName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {entry.balance.toLocaleString()} pts
                      </p>
                    </div>
                  </div>
                  {existing ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusBadge status={existing.status} />
                      {existing.winner?.phone || entry.phone ? (
                        <WhatsAppButton
                          phone={
                            (existing.winner?.phone || entry.phone) as string
                          }
                          displayName={
                            existing.winner?.displayName || entry.displayName
                          }
                          description={existing.description}
                        />
                      ) : null}
                    </div>
                  ) : isCurrentMonth ? (
                    <button
                      type="button"
                      onClick={() => setCreateFor(entry)}
                      className="mt-auto w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90"
                    >
                      Crear Premio
                    </button>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Solo se pueden crear premios del mes actual
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Tracking table */}
      <section>
        <h2 className="text-lg font-bold text-foreground mb-4">
          Premios creados
        </h2>
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/60">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Ganador
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Descripción
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Tiendas
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Fecha
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Canjeado el
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Contacto
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {prizesLoading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center">
                      <Loader2 className="w-5 h-5 animate-spin inline text-muted-foreground" />
                    </td>
                  </tr>
                ) : prizes.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-10 text-center text-muted-foreground"
                    >
                      No hay premios para este mes
                    </td>
                  </tr>
                ) : (
                  prizes.map((prize) => (
                    <tr key={prize.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">
                        {prize.winner?.displayName || "—"}
                      </td>
                      <td className="px-4 py-3">
                        {prize.type === "PREMIUM"
                          ? "Premium"
                          : "Cupón personalizado"}
                      </td>
                      <td className="px-4 py-3 max-w-xs truncate">
                        {prize.description}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {prize.stores?.map((s) => s.name).join(", ") || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={prize.status} />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {new Date(prize.createdAt).toLocaleDateString("es-MX")}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {prize.claimedAt
                          ? new Date(prize.claimedAt).toLocaleDateString(
                              "es-MX"
                            )
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {prize.winner?.phone ? (
                          <WhatsAppButton
                            phone={prize.winner.phone}
                            displayName={prize.winner.displayName || "Ganador"}
                            description={prize.description}
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {createFor ? (
        <CreatePrizeModal
          winner={createFor}
          onClose={() => setCreateFor(null)}
          onCreated={() => void refetch()}
        />
      ) : null}
    </div>
  );
}
