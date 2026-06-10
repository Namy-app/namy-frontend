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
  0: "Monday",
  1: "Tuesday",
  2: "Wednesday",
  3: "Thursday",
  4: "Friday",
  5: "Saturday",
  6: "Sunday",
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
    <div className="min-w-0 overflow-hidden rounded-lg bg-card p-4 shadow sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground sm:text-xl">
            <Clock className="h-5 w-5 shrink-0 text-muted-foreground" />
            Días y horarios disponibles
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Configurar los días y horas en los que el descuento está disponible
          </p>
        </div>
        {canAddMore ? (
          <button
            type="button"
            onClick={handleAddDay}
            className="flex w-full shrink-0 items-center justify-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
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
              className="min-w-0 rounded-lg border border-border bg-muted/50 p-3 sm:p-4"
            >
              {/* Day Header */}
              <div className="mb-4 flex items-end gap-2 sm:gap-3">
                <div className="min-w-0 flex-1">
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Día
                  </label>
                  <select
                    value={dayData.dayIndex}
                    onChange={(e) =>
                      handleUpdateDay(dayIndex, Number(e.target.value))
                    }
                    className="w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
                  className="shrink-0 rounded-md p-2 text-destructive transition-colors hover:bg-destructive/10"
                  title="Eliminar día"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Time Ranges */}
              <div className="space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <label className="text-xs font-medium text-muted-foreground">
                    Horarios Disponibles
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddTimeRange(dayIndex)}
                    className="flex w-full items-center justify-center gap-1 rounded bg-primary/10 px-2 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 sm:w-auto"
                  >
                    <Plus className="h-3 w-3" />
                    Añadir Horario
                  </button>
                </div>

                {dayData.timeRanges.map((range, rangeIndex) => (
                  <div
                    key={rangeIndex}
                    className="flex flex-col gap-3 rounded-md bg-background p-3 sm:flex-row sm:items-end"
                  >
                    <div className="min-w-0 flex-1">
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">
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
                        className="box-border w-full min-w-0 max-w-full appearance-none rounded-md border border-input bg-background px-2 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">
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
                        className="box-border w-full min-w-0 max-w-full appearance-none rounded-md border border-input bg-background px-2 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    {dayData.timeRanges.length > 1 ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveTimeRange(dayIndex, rangeIndex)
                        }
                        className="flex shrink-0 items-center justify-center self-stretch rounded-md p-2 text-destructive transition-colors hover:bg-destructive/10 sm:self-end"
                        title="Eliminar horario"
                      >
                        <Trash2 className="h-4 w-4" />
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
