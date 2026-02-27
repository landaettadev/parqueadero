export const ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register'
  },
  USER: {
    DASHBOARD: '/dashboard',
    MAP: '/map',
    QUEUE: '/queue',
    PREDICTION: '/prediction',
    HISTORY: '/history'
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    ANALYTICS: '/admin/analytics',
    CAMERAS: '/admin/cameras',
    AI_INSIGHTS: '/admin/ai-insights'
  }
} as const;
