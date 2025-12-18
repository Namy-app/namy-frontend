"use client";

import { Clock, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import type { OpenDay } from "@/domains/admin/types";

interface Props {
  value?: OpenDay[];
  onChange: (hours: OpenDay[]) => void;
}

const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const DAY_LABELS: Record<string, string> = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
};

export const StoreHoursEditor = ({ value = [], onChange }: Props) => {
  const [hours, setHours] = useState<OpenDay[]>(value);

  const handleAddDay = () => {
    // Find first day not already added
    const existingDays = hours.map((h) => h.day.toLowerCase());
    const availableDay = DAYS_OF_WEEK.find((day) => !existingDays.includes(day));

    if (availableDay) {
      const newHours = [
        ...hours,
        {
          day: availableDay,
          startTime: "09:00",
          endTime: "17:00",
          closed: false,
        },
      ];
      setHours(newHours);
      onChange(newHours);
    }
  };

  const handleRemoveDay = (index: number) => {
    const newHours = hours.filter((_, i) => i !== index);
    setHours(newHours);
    onChange(newHours);
  };

  const handleUpdateDay = (
    index: number,
    field: keyof OpenDay,
    value: string | boolean
  ) => {
    const newHours = [...hours];
    const currentDay = newHours[index];
    if (!currentDay) return;

    newHours[index] = {
      day: currentDay.day,
      startTime: currentDay.startTime,
      endTime: currentDay.endTime,
      closed: currentDay.closed,
      [field]: value,
    };
    setHours(newHours);
    onChange(newHours);
  };

  // Get available days for dropdown
  const getAvailableDays = (currentDay: string) => {
    const existingDays = hours.map((h) => h.day.toLowerCase());
    return DAYS_OF_WEEK.filter(
      (day) => day === currentDay.toLowerCase() || !existingDays.includes(day)
    );
  };

  const canAddMore = hours.length < 7;

  return (
    <div className="bg-card rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Clock className="w-5 h-5 text-muted-foreground" />
          Horario de Apertura
        </h2>
        {canAddMore ? (
          <button
            type="button"
            onClick={handleAddDay}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar Día
          </button>
        ) : null}
      </div>

      {hours.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">
            No hay horarios configurados. Haz clic en &quot;Agregar Día&quot; para empezar.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {hours.map((dayHours, index) => (
            <div
              key={index}
              className="flex flex-wrap items-center gap-3 p-4 bg-muted/50 rounded-md"
            >
              {/* Day Selector */}
              <div className="flex-1 min-w-[140px]">
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Día
                </label>
                <select
                  value={dayHours.day.toLowerCase()}
                  onChange={(e) => handleUpdateDay(index, "day", e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {getAvailableDays(dayHours.day).map((day) => (
                    <option key={day} value={day}>
                      {DAY_LABELS[day]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Closed Toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`closed-${index}`}
                  checked={dayHours.closed ?? false}
                  onChange={(e) =>
                    handleUpdateDay(index, "closed", e.target.checked)
                  }
                  className="w-4 h-4 text-primary bg-background border-input rounded focus:ring-2 focus:ring-primary"
                />
                <label
                  htmlFor={`closed-${index}`}
                  className="text-sm font-medium text-foreground cursor-pointer"
                >
                  Cerrado
                </label>
              </div>

              {/* Time Inputs */}
              {!dayHours.closed ? (
                <>
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Abre
                    </label>
                    <input
                      type="time"
                      value={dayHours.startTime}
                      onChange={(e) =>
                        handleUpdateDay(index, "startTime", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Cierra
                    </label>
                    <input
                      type="time"
                      value={dayHours.endTime}
                      onChange={(e) =>
                        handleUpdateDay(index, "endTime", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </>
              ) : null}

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleRemoveDay(index)}
                className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                title="Eliminar día"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {hours.length > 0 ? (
        <div className="mt-4 text-xs text-muted-foreground">
          <p>
            Consejo: Puedes marcar días como &quot;Cerrado&quot; si tu negocio no abre ese día.
          </p>
        </div>
      ) : null}
    </div>
  );
};
