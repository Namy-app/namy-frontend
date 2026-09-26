"use client";

import { ChevronLeft, ChevronRight, Ticket } from "lucide-react";
import { useMemo, useState } from "react";

import { useStoreCoupons } from "@/domains/admin/hooks";

const PAGE_SIZE = 25;

function startOfDay(date: string): string {
  return `${date}T00:00:00`;
}

function endOfDay(date: string): string {
  return `${date}T23:59:59.999`;
}

function formatRedeemedAt(value?: string | null): string {
  if (!value) {
    return "—";
  }
  return new Date(value).toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminRedemptionsPage(): React.JSX.Element {
  const [fromDraft, setFromDraft] = useState("");
  const [toDraft, setToDraft] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);

  const filters = useMemo(
    () => ({
      used: true as const,
      includeExpired: true,
      ...(from ? { usedAtFrom: startOfDay(from) } : {}),
      ...(to ? { usedAtTo: endOfDay(to) } : {}),
    }),
    [from, to]
  );

  const { data, isLoading, isError, error } = useStoreCoupons(
    filters,
    { page, first: PAGE_SIZE },
    { enabled: true }
  );

  const rows = data?.data ?? [];
  const total = data?.paginationInfo.total ?? 0;
  const totalPages = data?.paginationInfo.totalPages ?? 1;
  const rangeActive = Boolean(from || to);

  const applyRange = (): void => {
    setFrom(fromDraft);
    setTo(toDraft);
    setPage(1);
  };

  const clearRange = (): void => {
    setFromDraft("");
    setToDraft("");
    setFrom("");
    setTo("");
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Ticket className="w-8 h-8 text-green-600" />
          Cupones canjeados
        </h1>
        <p className="text-muted-foreground mt-1">
          {rangeActive
            ? "Filtrados por fecha de canje"
            : "Todos los canjes hasta hoy"}
          {isLoading ? "" : ` · ${total}`}
        </p>
      </div>

      <div className="bg-card rounded-xl border border-border p-4 mb-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex flex-col gap-1 text-sm text-muted-foreground">
          Desde
          <input
            type="date"
            value={fromDraft}
            onChange={(e) => setFromDraft(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-muted-foreground">
          Hasta
          <input
            type="date"
            value={toDraft}
            onChange={(e) => setToDraft(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
          />
        </label>
        <button
          type="button"
          onClick={applyRange}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Filtrar
        </button>
        {rangeActive || fromDraft || toDraft ? (
          <button
            type="button"
            onClick={clearRange}
            className="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
          >
            Ver todos
          </button>
        ) : null}
      </div>

      {isError ? (
        <p className="text-destructive">
          {error instanceof Error
            ? error.message
            : "No se pudieron cargar los canjes."}
        </p>
      ) : isLoading ? (
        <div className="flex justify-center py-16">
          <div className="h-6 w-6 rounded-full border-2 border-green-600 border-t-transparent animate-spin" />
        </div>
      ) : rows.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-10 text-center text-muted-foreground">
          {rangeActive
            ? "No hay canjes en ese rango de fechas."
            : "Aún no hay cupones canjeados."}
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/60">
                <tr className="text-left text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 font-medium">Quién</th>
                  <th className="px-4 py-3 font-medium">Dónde</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((coupon) => (
                  <tr key={coupon.id} className="border-t border-border">
                    <td className="px-4 py-3 whitespace-nowrap text-foreground">
                      {formatRedeemedAt(coupon.usedAt)}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {coupon.user?.displayName || "—"}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {coupon.store?.name || "—"}
                      {coupon.store?.city ? (
                        <span className="text-muted-foreground">
                          {" "}
                          · {coupon.store.city}
                        </span>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm text-muted-foreground">
            <span>
              Página {page} de {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((current) => current + 1)}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 disabled:opacity-40"
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
