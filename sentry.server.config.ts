import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

Sentry.init({
  dsn: SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: 1.0, // Adjust for production

  // Environment
  environment: process.env.NODE_ENV || 'development',

  // Ignore specific errors
  ignoreErrors: [
    'quota',
    'ECONNREFUSED',
  ],

  beforeSend(event) {
    // Don't send events if Sentry is not configured
    if (!SENTRY_DSN) {
      return null
    }

    return event
  },
})
