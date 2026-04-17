import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  // Only send errors in production; disable in development to reduce noise
  enabled: process.env.NODE_ENV === "production",
  tracesSampleRate: 0.1,
  sendDefaultPii: false,
});
