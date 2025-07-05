import { API_CONFIG, API_ENDPOINTS } from "./api-config"
import type { Receipt, MonthlySpending, ChatMessage, WalletPass } from "@/types"

class ApiService {
  private getAuthToken(): string | null {
    // Get auth token from localStorage or cookies
    return localStorage.getItem("auth_token") || null
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`
    const authToken = this.getAuthToken()

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Receipt Management - Your backend handles Gemini OCR
  async uploadReceipt(file: File): Promise<Receipt> {
    const formData = new FormData()
    formData.append("receipt", file)

    const authToken = this.getAuthToken()

    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.UPLOAD}`, {
      method: "POST",
      headers: {
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload receipt")
    }

    return response.json()
  }

  async getReceipts(limit = 20): Promise<Receipt[]> {
    return this.request(`${API_ENDPOINTS.RECEIPTS}?limit=${limit}`)
  }

  async getReceipt(id: string): Promise<Receipt> {
    return this.request(`${API_ENDPOINTS.RECEIPTS}/${id}`)
  }

  async updateReceipt(id: string, data: Partial<Receipt>): Promise<Receipt> {
    return this.request(`${API_ENDPOINTS.RECEIPTS}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteReceipt(id: string): Promise<void> {
    return this.request(`${API_ENDPOINTS.RECEIPTS}/${id}`, {
      method: "DELETE",
    })
  }

  // AI Assistant - Your backend handles Gemini AI calls
  async queryAssistant(query: string, context?: any): Promise<ChatMessage> {
    return this.request(API_ENDPOINTS.QUERY, {
      method: "POST",
      body: JSON.stringify({
        query,
        context,
        timestamp: new Date().toISOString(),
      }),
    })
  }

  // Spending Insights - Your backend processes data with AI
  async getSpendingInsights(month?: string): Promise<MonthlySpending> {
    const params = month ? `?month=${month}` : ""
    return this.request(`${API_ENDPOINTS.INSIGHTS}${params}`)
  }

  async getSpendingTrends(period = "6months"): Promise<any> {
    return this.request(`${API_ENDPOINTS.SPENDING}/trends?period=${period}`)
  }

  async getSpendingByCategory(period?: string): Promise<any> {
    const params = period ? `?period=${period}` : ""
    return this.request(`${API_ENDPOINTS.SPENDING}/categories${params}`)
  }

  // Google Wallet Integration
  async createWalletPass(receiptId: string): Promise<WalletPass> {
    return this.request(`${API_ENDPOINTS.WALLET_PASSES}`, {
      method: "POST",
      body: JSON.stringify({ receiptId }),
    })
  }

  async getWalletPasses(): Promise<WalletPass[]> {
    return this.request(API_ENDPOINTS.WALLET_PASSES)
  }

  async updateWalletPass(passId: string, data: any): Promise<WalletPass> {
    return this.request(`${API_ENDPOINTS.WALLET_PASSES}/${passId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // User Profile & Settings
  async getUserProfile(): Promise<any> {
    return this.request(API_ENDPOINTS.USER_PROFILE)
  }

  async updateUserProfile(data: any): Promise<any> {
    return this.request(API_ENDPOINTS.USER_PROFILE, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async updateBudgets(budgets: Record<string, number>): Promise<any> {
    return this.request(`${API_ENDPOINTS.USER_PROFILE}/budgets`, {
      method: "PUT",
      body: JSON.stringify({ budgets }),
    })
  }

  async updateNotificationSettings(settings: any): Promise<any> {
    return this.request(`${API_ENDPOINTS.USER_PROFILE}/notifications`, {
      method: "PUT",
      body: JSON.stringify(settings),
    })
  }

  // Authentication
  async login(credentials: { email: string; password: string }): Promise<any> {
    return this.request(`${API_ENDPOINTS.AUTH}/login`, {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }

  async googleAuth(token: string): Promise<any> {
    return this.request(`${API_ENDPOINTS.AUTH}/google`, {
      method: "POST",
      body: JSON.stringify({ token }),
    })
  }

  async logout(): Promise<void> {
    await this.request(`${API_ENDPOINTS.AUTH}/logout`, {
      method: "POST",
    })
    localStorage.removeItem("auth_token")
  }

  async refreshToken(): Promise<any> {
    return this.request(`${API_ENDPOINTS.AUTH}/refresh`, {
      method: "POST",
    })
  }

  // Utility methods
  setAuthToken(token: string): void {
    localStorage.setItem("auth_token", token)
  }

  clearAuthToken(): void {
    localStorage.removeItem("auth_token")
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken()
  }
}

export const apiService = new ApiService()
