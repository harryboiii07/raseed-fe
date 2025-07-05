// API Configuration using environment variables
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
  GOOGLE_WALLET_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_WALLET_API_KEY,
  GOOGLE_OAUTH_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
}

export const API_ENDPOINTS = {
  RECEIPTS: "/api/receipts",
  UPLOAD: "/api/receipts/upload",
  ANALYZE: "/api/receipts/analyze",
  QUERY: "/api/assistant/query",
  INSIGHTS: "/api/insights",
  WALLET_PASSES: "/api/wallet/passes",
  USER_PROFILE: "/api/user/profile",
  SPENDING: "/api/spending",
  AUTH: "/api/auth",
}
