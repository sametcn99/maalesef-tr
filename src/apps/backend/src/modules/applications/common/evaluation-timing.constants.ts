export const DEV_INITIAL_DELAY_MS = 5_000; // 5 seconds
export const PROD_INITIAL_MAX_DELAY_MS = 2 * 60 * 60 * 1000; // up to 2 hours

export const DEV_RETRY_DELAY_MS = 5_000; // 5 seconds
export const PROD_RETRY_MAX_DELAY_MS = 2 * 60 * 60 * 1000; // up to 2 hours

export const DEV_CRON_EXPRESSION = '*/5 * * * * *'; // every 5 seconds
export const PROD_CRON_EXPRESSION = '*/5 * * * *';
