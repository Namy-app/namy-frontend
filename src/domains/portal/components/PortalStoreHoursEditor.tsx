"use client";

import { useState } from "react";

import { useUpdateStoreHours } from "@/domains/portal/hooks";
import type {
  PortalOpenDay,
  PortalOpenDays,
  PortalStore,
} from "@/domains/portal/types";
import {
  format12HourTo24,
  parseTimeTo12Hour,
  PORTAL_DAY_LABELS,
  PORTAL_WEEK_DAYS,
} from "@/domains/portal/utils";
import { useToast } from "@/hooks/use-toast";
import { extractErrorMessage } from "@/lib/utils";
import { Button } from "@/shared/components/Button";

const HOURS_12 = Array.from({ length: 12 }, (_, index) => String(index + 1));
const MINUTES = ["00", "15", "30", "45"];

interface PortalStoreHoursEditorProps {
  store: PortalStore;
}

export function PortalStoreHoursEditor({
  store,
}: PortalStoreHoursEditorProps): React.JSX.Element {
  const { toast } = useToast();
  const updateStoreHours = useUpdateStoreHours();
  const [days, setDays] = useState<PortalOpenDay[]>(() =>
    hoursFromStore(store.openDays)
  );

  const updateDay = (index: number, patch: Partial<PortalOpenDay>): void => {
    setDays((current) =>
      current.map((day, dayIndex) =>
        dayIndex === index ? { ...day, ...patch } : day
      )
    );
  };

  const handleSave = async (): Promise<void> => {
    try {
      await updateStoreHours.mutateAsync({
        storeId: store.id,
        openDays: { availableDays: days },
      });
      toast({
        title: "Horario actualizado",
        description: "Los horarios se guardaron correctamente.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al guardar",
        description:
          extractErrorMessage(error) ||
          "No se pudo actualizar el horario. Intenta de nuevo.",
      });
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-1">
        Horario de apertura
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Define los días y horarios en que tu restaurante está abierto.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[520px]">
          <thead>
            <tr className="text-left text-muted-foreground border-b border-border">
              <th className="pb-3 font-medium w-28">Día</th>
              <th className="pb-3 font-medium w-24">Estado</th>
              <th className="pb-3 font-medium">Abre</th>
              <th className="pb-3 font-medium">Cierra</th>
            </tr>
          </thead>
          <tbody>
            {days.map((dayHours, index) => {
              const start = parseTimeTo12Hour(dayHours.startTime);
              const end = parseTimeTo12Hour(dayHours.endTime);
              const isOpen = !dayHours.closed;

              return (
                <tr
                  key={dayHours.day}
                  className="border-b border-border last:border-0"
                >
                  <td className="py-3 font-medium text-foreground">
                    {PORTAL_DAY_LABELS[dayHours.day] ?? dayHours.day}
                  </td>
                  <td className="py-3">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isOpen}
                      onClick={() => updateDay(index, { closed: isOpen })}
                      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                        isOpen ? "bg-primary" : "bg-muted-foreground/30"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                          isOpen ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="py-3">
                    {isOpen ? (
                      <Time12HourSelect
                        id={`${dayHours.day}-start`}
                        label="Abre"
                        value={start}
                        extraMinute={start.minute}
                        onChange={(next) =>
                          updateDay(index, {
                            startTime: format12HourTo24(
                              next.hour,
                              next.minute,
                              next.period
                            ),
                          })
                        }
                      />
                    ) : (
                      <span className="text-muted-foreground">Cerrado</span>
                    )}
                  </td>
                  <td className="py-3">
                    {isOpen ? (
                      <Time12HourSelect
                        id={`${dayHours.day}-end`}
                        label="Cierra"
                        value={end}
                        extraMinute={end.minute}
                        onChange={(next) =>
                          updateDay(index, {
                            endTime: format12HourTo24(
                              next.hour,
                              next.minute,
                              next.period
                            ),
                          })
                        }
                      />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Button
        type="button"
        onClick={() => {
          void handleSave();
        }}
        className="mt-5 w-full sm:w-auto h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-bold shadow-glow"
        disabled={updateStoreHours.isPending}
      >
        {updateStoreHours.isPending ? "Guardando..." : "Guardar horario"}
      </Button>
    </div>
  );
}

function Time12HourSelect({
  id,
  label,
  value,
  extraMinute,
  onChange,
}: {
  id: string;
  label: string;
  value: { hour: string; minute: string; period: "AM" | "PM" };
  extraMinute: string;
  onChange: (value: {
    hour: string;
    minute: string;
    period: "AM" | "PM";
  }) => void;
}): React.JSX.Element {
  const minutes = MINUTES.includes(extraMinute)
    ? MINUTES
    : [...MINUTES, extraMinute].sort();

  return (
    <div>
      <label htmlFor={`${id}-hour`} className="sr-only">
        {label}
      </label>
      <div className="flex items-center gap-1">
        <select
          id={`${id}-hour`}
          value={value.hour}
          onChange={(event) => onChange({ ...value, hour: event.target.value })}
          className="h-10 rounded-lg border border-input bg-background px-2 text-sm"
        >
          {HOURS_12.map((hour) => (
            <option key={hour} value={hour}>
              {hour}
            </option>
          ))}
        </select>
        <span className="text-muted-foreground">:</span>
        <select
          id={`${id}-minute`}
          value={value.minute}
          onChange={(event) =>
            onChange({ ...value, minute: event.target.value })
          }
          className="h-10 rounded-lg border border-input bg-background px-2 text-sm"
        >
          {minutes.map((minute) => (
            <option key={minute} value={minute}>
              {minute}
            </option>
          ))}
        </select>
        <select
          id={`${id}-period`}
          value={value.period}
          onChange={(event) =>
            onChange({
              ...value,
              period: event.target.value as "AM" | "PM",
            })
          }
          className="h-10 rounded-lg border border-input bg-background px-2 text-sm"
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
}

function hoursFromStore(
  openDays: PortalOpenDays | null | undefined
): PortalOpenDay[] {
  const existing = parseOpenDays(openDays);
  const byDay = new Map(
    existing.map((day) => [day.day.toLowerCase(), day] as const)
  );

  return PORTAL_WEEK_DAYS.map((day) => {
    const match = byDay.get(day);
    if (match) {
      return {
        day,
        startTime: match.startTime || "09:00",
        endTime: match.endTime || "17:00",
        closed: Boolean(match.closed),
      };
    }
    return {
      day,
      startTime: "09:00",
      endTime: "17:00",
      closed: true,
    };
  });
}

function parseOpenDays(
  openDays:
    | PortalOpenDays
    | Record<string, { open?: string; close?: string }>
    | null
    | undefined
): PortalOpenDay[] {
  if (!openDays) {
    return [];
  }

  if ("availableDays" in openDays && Array.isArray(openDays.availableDays)) {
    return openDays.availableDays;
  }

  return PORTAL_WEEK_DAYS.flatMap((day) => {
    const hours = (
      openDays as Record<string, { open?: string; close?: string }>
    )[day];
    if (!hours) {
      return [];
    }
    return [
      {
        day,
        startTime: hours.open || "09:00",
        endTime: hours.close || "17:00",
        closed: false,
      },
    ];
  });
}
