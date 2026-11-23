// Sentry Edge Middleware Configuration for AbroadMate Web Application

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

export function initEdgeSentry() {
  if (!SENTRY_DSN) return;

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Sentry = require("@sentry/nextjs");
    if (Sentry && typeof Sentry.init === "function") {
      Sentry.init({
        dsn: SENTRY_DSN,
        environment: process.env.NODE_ENV || "production",
        tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,
      });
    }
  } catch {
    // Sentry module optional in development/test
  }
}

initEdgeSentry();
