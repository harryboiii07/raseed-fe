export interface Receipt {
  id: string
  merchant: string
  date: string
  total: number
  items: ReceiptItem[]
  category: string
  imageUrl: string
  walletPassId?: string
  createdAt: string
  updatedAt?: string
  userId: string
  status: "processing" | "completed" | "failed"
  confidence?: number // OCR confidence score from your backend
}

export interface ReceiptItem {
  name: string
  price: number
  quantity: number
  category?: string
}

export interface SpendingInsight {
  id: string
  title: string
  description: string
  type: "warning" | "info" | "success"
  amount?: number
  category?: string
  recommendation?: string
  priority: "high" | "medium" | "low"
  createdAt: string
}

export interface SpendingCategory {
  name: string
  amount: number
  percentage: number
  color: string
  icon: string
  budget?: number
  trend?: string
}

export interface MonthlySpending {
  month: string
  total: number
  budget?: number
  categories: SpendingCategory[]
  insights: SpendingInsight[]
  previousMonth?: {
    total: number
    change: number
    changePercentage: number
  }
}

export interface ChatMessage {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: string
  data?: any
  status?: "sending" | "sent" | "failed"
}

export interface WalletPass {
  id: string
  type: "receipt" | "insight" | "reminder"
  title: string
  description: string
  amount?: number
  date: string
  category?: string
  receiptId?: string
  status: "active" | "expired" | "archived"
  googlePassId?: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  currency: string
  language: string
  timezone: string
  createdAt: string
  settings: UserSettings
}

export interface UserSettings {
  budgets: Record<string, number>
  notifications: {
    spending: boolean
    budget: boolean
    insights: boolean
    receipts: boolean
    email: boolean
    push: boolean
  }
  privacy: {
    dataAnalytics: boolean
    aiProcessing: boolean
  }
  wallet: {
    autoCreatePasses: boolean
    syncGooglePay: boolean
  }
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Error types for better error handling
export interface ApiError {
  code: string
  message: string
  details?: any
}
