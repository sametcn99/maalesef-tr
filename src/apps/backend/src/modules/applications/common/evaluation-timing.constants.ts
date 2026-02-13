/**
 * Initial evaluation delay in development (5 seconds).
 */
export const DEV_INITIAL_DELAY_MS = 5_000;

/**
 * Maximum initial evaluation delay in production (up to 2 hours).
 */
export const PROD_INITIAL_MAX_DELAY_MS = 2 * 60 * 60 * 1000;

/**
 * Retry delay after a failed attempt in development (5 seconds).
 */
export const DEV_RETRY_DELAY_MS = 5_000;

/**
 * Maximum retry delay after a failed attempt in production (up to 2 hours).
 */
export const PROD_RETRY_MAX_DELAY_MS = 2 * 60 * 60 * 1000;

/**
 * Evaluation cron expression for development (every 5 seconds).
 */
export const DEV_CRON_EXPRESSION = '*/5 * * * * *';

/**
 * Evaluation cron expression for production (every 15 minutes).
 */
export const PROD_CRON_EXPRESSION = '*/15 * * * *';
