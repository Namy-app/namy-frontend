"use client";

import { Download, FileSpreadsheet, Loader2 } from "lucide-react";
import { useState } from "react";

import { getCurrentMexicoMonth } from "@/domains/portal/utils";
import { useToast } from "@/hooks/use-toast";
import { downloadBlobFile } from "@/lib/download-file";
import {
  getPortalAuthToken,
  getPortalRestBaseUrl,
} from "@/lib/portalGraphqlClient";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";

interface PortalMonthlyExportCardProps {
  storeId: string;
  storeName: string;
}

export function PortalMonthlyExportCard({
  storeId,
  storeName,
}: PortalMonthlyExportCardProps): React.JSX.Element {
  const { toast } = useToast();
  const [reportMonth, setReportMonth] = useState(getCurrentMexicoMonth);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (): Promise<void> => {
    if (!reportMonth) {
      return;
    }

    const [year, month] = reportMonth.split("-");
    if (!year || !month) {
      toast({
        variant: "destructive",
        title: "Mes inválido",
        description: "Selecciona un mes válido para descargar el reporte.",
      });
      return;
    }

    const token = getPortalAuthToken();
    if (!token) {
      toast({
        variant: "destructive",
        title: "Sesión expirada",
        description: "Inicia sesión de nuevo para descargar el reporte.",
      });
      return;
    }

    setIsExporting(true);
    try {
      const params = new URLSearchParams({
        year,
        month: String(Number(month)),
        storeId,
      });
      const response = await fetch(
        `${getPortalRestBaseUrl()}/export/portal/monthly-report?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(await readExportError(response));
      }

      const blob = await response.blob();
      const safeName = storeName
        .normalize("NFKD")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .slice(0, 60);
      const filename = `report-${safeName || "restaurante"}-${year}-${month}.xlsx`;
      await downloadBlobFile(blob, filename);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "No se pudo descargar el reporte",
        description:
          error instanceof Error
            ? error.message
            : "Intenta de nuevo en unos minutos.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="p-6 bg-card border-none shadow-card mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <FileSpreadsheet className="w-6 h-6 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-foreground">
            Exportar reporte mensual
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Descarga los canjes de este restaurante en Excel para el mes que
            elijas.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <label className="sr-only" htmlFor="portal-export-month">
            Mes del reporte
          </label>
          <input
            id="portal-export-month"
            type="month"
            value={reportMonth}
            onChange={(event) => setReportMonth(event.target.value)}
            className="h-12 rounded-xl border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
          <Button
            type="button"
            className="h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-bold shadow-glow"
            disabled={!reportMonth || isExporting}
            onClick={() => {
              void handleExport();
            }}
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Descargando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Descargar reporte
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}

async function readExportError(response: Response): Promise<string> {
  try {
    const text = await response.text();
    const json = JSON.parse(text) as { message?: string | string[] };
    if (typeof json.message === "string" && json.message.trim()) {
      return json.message;
    }
    if (Array.isArray(json.message) && json.message[0]) {
      return json.message[0];
    }
  } catch {
    return "No se pudo descargar el reporte. Intenta de nuevo.";
  }
  return "No se pudo descargar el reporte. Intenta de nuevo.";
}
