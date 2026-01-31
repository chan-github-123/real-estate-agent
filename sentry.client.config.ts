import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN

Sentry.init({
  dsn: SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of transactions (adjust for production)

  // Session Replay
  replaysSessionSampleRate: 0.1, // Sample 10% of sessions
  replaysOnErrorSampleRate: 1.0, // Sample 100% of sessions with errors

  // Environment
  environment: process.env.NODE_ENV || 'development',

  // Ignore specific errors
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    'chrome-extension',
    'moz-extension',
    // Network errors
    'NetworkError',
    'Network request failed',
    // Firebase quota errors (expected in free tier)
    'quota',
  ],

  // Filter out sensitive data
  beforeSend(event, hint) {
    // Don't send events if Sentry is not configured
    if (!SENTRY_DSN) {
      return null
    }

    // Filter out passwords and tokens
    if (event.request) {
      delete event.request.cookies
    }

    return event
  },
})
