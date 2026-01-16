import clsx from "clsx";

export type AvailabilityStatus = "available" | "soon" | "unavailable";

export interface AvailabilityBadgeProps {
  status: AvailabilityStatus;
  className?: string;
}

export const AvailabilityStatusBadge = ({
  status,
  className,
}: AvailabilityBadgeProps) => {
  const colors = {
    available: {
      bg: "bg-green-500/10",
      border: "border-green-500/30",
      dot: "bg-green-500",
      text: "text-green-700 dark:text-green-400",
    },
    soon: {
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30",
      dot: "bg-yellow-500",
      text: "text-yellow-700 dark:text-yellow-400",
    },
    unavailable: {
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      dot: "bg-red-500",
      text: "text-red-700 dark:text-red-400",
    },
  };
  const titleText = {
    available: "Disponible ahora",
    soon: "Disponible en breve",
    unavailable: "No disponible hoy",
  };
  const title = titleText[status];

  return (
    <div
      className={clsx(
        "inline-flex items-center gap-2 px-4 py-2",
        colors[status].bg,
        " border ",
        colors[status].border,
        " rounded-full",
        className
      )}
    >
      <div
        className={clsx("w-2 h-2 shrink-0 rounded-full", colors[status].dot)}
      />
      <span
        className={clsx(
          "text-xs truncate",
          colors[status].text,
          " font-medium"
        )}
      >
        {title}
      </span>
    </div>
  );
};
