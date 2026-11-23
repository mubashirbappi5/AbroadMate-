// Sentry Server-side Configuration for AbroadMate Web Application
// Production error monitoring & performance tracing with sensitive PII redaction

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

export function initServerSentry() {
  if (!SENTRY_DSN) return;

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Sentry = require("@sentry/nextjs");
    if (Sentry && typeof Sentry.init === "function") {
      Sentry.init({
        dsn: SENTRY_DSN,
        environment: process.env.NODE_ENV || "production",
        tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,
        beforeSend(event: any) {
          // Data scrubbing: redact sensitive environment parameters
          if (event?.request?.cookies) {
            delete event.request.cookies;
          }
          return event;
        },
      });
    }
  } catch {
    // Sentry module optional in development/test
  }
}

initServerSentry();
