"use client";

import { Clock, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

interface TimeRange {
  start: string;
  end: string;
}

interface AvailableDay {
  dayIndex: number;
  timeRanges: TimeRange[];
}

interface AvailableDaysAndTimes {
  availableDays: AvailableDay[];
}

interface Props {
  value?: AvailableDaysAndTimes;
  onChange: (restrictions: AvailableDaysAndTimes) => void;
}

const DAY_LABELS: Record<number, string> = {
  0: "Lunes",
  1: "Martes",
  2: "Miércoles",
  3: "Jueves",
  4: "Viernes",
  5: "Sábado",
  6: "Domingo",
};

export const TimeRestrictionsEditor = ({ value, onChange }: Props) => {
  const [availableDays, setAvailableDays] = useState<AvailableDay[]>(
    value?.availableDays || []
  );

  useEffect(() => {
    onChange({ availableDays });
  }, [availableDays, onChange]);

  const handleAddDay = () => {
    const existingDayIndices = availableDays.map((d) => d.dayIndex);
    const availableDayIndex = [0, 1, 2, 3, 4, 5, 6].find(
      (dayIndex) => !existingDayIndices.includes(dayIndex)
    );

    if (availableDayIndex !== undefined) {
      const newDays = [
        ...availableDays,
        {
          dayIndex: availableDayIndex,
          timeRanges: [{ start: "09:00", end: "17:00" }],
        },
      ];
      setAvailableDays(newDays);
    }
  };

  const handleRemoveDay = (dayIndex: number) => {
    const newDays = availableDays.filter((_, i) => i !== dayIndex);
    setAvailableDays(newDays);
  };

  const handleUpdateDay = (dayIndex: number, newDayIndex: number) => {
    const newDays = [...availableDays];
    const currentDay = newDays[dayIndex];
    if (!currentDay) {
      return;
    }

    newDays[dayIndex] = {
      ...currentDay,
      dayIndex: newDayIndex,
    };
    setAvailableDays(newDays);
  };

  const handleAddTimeRange = (dayIndex: number) => {
    const newDays = [...availableDays];
    const currentDay = newDays[dayIndex];
    if (!currentDay) {
      return;
    }

    newDays[dayIndex] = {
      ...currentDay,
      timeRanges: [...currentDay.timeRanges, { start: "09:00", end: "17:00" }],
    };
    setAvailableDays(newDays);
  };

  const handleRemoveTimeRange = (dayIndex: number, rangeIndex: number) => {
    const newDays = [...availableDays];
    const currentDay = newDays[dayIndex];
    if (!currentDay) {
      return;
    }

    newDays[dayIndex] = {
      ...currentDay,
      timeRanges: currentDay.timeRanges.filter((_, i) => i !== rangeIndex),
    };
    setAvailableDays(newDays);
  };

  const handleUpdateTimeRange = (
    dayIndex: number,
    rangeIndex: number,
    field: "start" | "end",
    value: string
  ) => {
    const newDays = [...availableDays];
    const currentDay = newDays[dayIndex];
    if (!currentDay) {
      return;
    }

    const newTimeRanges = [...currentDay.timeRanges];
    const currentRange = newTimeRanges[rangeIndex];
    if (!currentRange) {
      return;
    }

    newTimeRanges[rangeIndex] = {
      ...currentRange,
      [field]: value,
    };

    newDays[dayIndex] = {
      ...currentDay,
      timeRanges: newTimeRanges,
    };
    setAvailableDays(newDays);
  };

  const getAvailableDayIndices = (currentDayIndex: number) => {
    const existingDayIndices = availableDays.map((d) => d.dayIndex);
    return [0, 1, 2, 3, 4, 5, 6].filter(
      (dayIndex) =>
        dayIndex === currentDayIndex || !existingDayIndices.includes(dayIndex)
    );
  };

  const canAddMore = availableDays.length < 7;

  return (
    <div className="bg-card rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            Días y horarios disponibles
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configurar los días y horas en los que el descuento está disponible
          </p>
        </div>
        {canAddMore ? (
          <button
            type="button"
            onClick={handleAddDay}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            Añadir Día
          </button>
        ) : null}
      </div>

      {availableDays.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No hay días ni horas disponibles.</p>
          <p className="text-xs mt-1">
            Haz clic en &quot;Añadir Día&quot; para añadir horarios específicos.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {availableDays.map((dayData, dayIndex) => (
            <div
              key={dayIndex}
              className="p-4 bg-muted/50 rounded-lg border border-border"
            >
              {/* Day Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1 max-w-[200px]">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Día
                  </label>
                  <select
                    value={dayData.dayIndex}
                    onChange={(e) =>
                      handleUpdateDay(dayIndex, Number(e.target.value))
                    }
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {getAvailableDayIndices(dayData.dayIndex).map((dayIdx) => (
                      <option key={dayIdx} value={dayIdx}>
                        {DAY_LABELS[dayIdx]}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveDay(dayIndex)}
                  className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                  title="Eliminar día"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Time Ranges */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-muted-foreground">
                    Horarios Disponibles
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddTimeRange(dayIndex)}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Añadir Horario
                  </button>
                </div>

                {dayData.timeRanges.map((range, rangeIndex) => (
                  <div
                    key={rangeIndex}
                    className="flex items-center gap-3 p-3 bg-background rounded-md"
                  >
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-muted-foreground mb-1">
                        Desde
                      </label>
                      <input
                        type="time"
                        value={range.start}
                        onChange={(e) =>
                          handleUpdateTimeRange(
                            dayIndex,
                            rangeIndex,
                            "start",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-muted-foreground mb-1">
                        Hasta
                      </label>
                      <input
                        type="time"
                        value={range.end}
                        onChange={(e) =>
                          handleUpdateTimeRange(
                            dayIndex,
                            rangeIndex,
                            "end",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    {dayData.timeRanges.length > 1 ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveTimeRange(dayIndex, rangeIndex)
                        }
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors mt-5"
                        title="Eliminar horario"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {availableDays.length > 0 ? (
        <div className="mt-4 text-xs text-muted-foreground">
          <p>
            Nota: Si no configuras restricciones horarias, el descuento estará
            disponible en todos los días y horarios del período de validez.
          </p>
        </div>
      ) : null}
    </div>
  );
};
