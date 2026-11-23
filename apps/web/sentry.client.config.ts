// Sentry Client-side Configuration for AbroadMate Web Application
// Production error monitoring & performance tracing with sensitive PII redaction

export interface SentryInitOptions {
  dsn?: string;
  environment?: string;
  tracesSampleRate?: number;
  replaysOnErrorSampleRate?: number;
  replaysSessionSampleRate?: number;
  beforeSend?: (event: any) => any;
}

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;

export function initClientSentry() {
  if (!SENTRY_DSN) return;

  try {
    // Dynamic import to avoid build-time failure when @sentry/nextjs is optional in local dev
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Sentry = require("@sentry/nextjs");
    if (Sentry && typeof Sentry.init === "function") {
      Sentry.init({
        dsn: SENTRY_DSN,
        environment: process.env.NODE_ENV || "production",
        tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,
        replaysOnErrorSampleRate: 1.0,
        replaysSessionSampleRate: 0.1,
        beforeSend(event: any) {
          // Scrub sensitive student auth credentials from error traces
          if (event?.request?.headers) {
            delete event.request.headers["authorization"];
            delete event.request.headers["cookie"];
          }
          return event;
        },
      });
    }
  } catch {
    // Sentry module optional in development/test
  }
}

initClientSentry();
