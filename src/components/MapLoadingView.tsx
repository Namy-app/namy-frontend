interface MapLoadingViewProps {
  message?: string;
  className?: string;
}

export function MapLoadingView({
  message = "Loading map…",
  className = "",
}: MapLoadingViewProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex h-full min-h-[120px] w-full flex-col items-center justify-center gap-3 bg-white/85 backdrop-blur-sm ${className}`}
    >
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"
        aria-hidden
      />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
