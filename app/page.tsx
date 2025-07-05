"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Camera,
  MessageCircle,
  TrendingUp,
  Wallet,
  ShoppingCart,
  Coffee,
  Car,
  Home,
  Gamepad2,
  BarChart3,
  Bell,
} from "lucide-react"
import Link from "next/link"
import { apiService } from "@/lib/api-service"
import type { Receipt, MonthlySpending } from "@/types"

export default function Dashboard() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [spending, setSpending] = useState<MonthlySpending | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [receiptsData, spendingData] = await Promise.all([
        apiService.getReceipts(4),
        apiService.getSpendingInsights(),
      ])
      setReceipts(receiptsData)
      setSpending(spendingData)
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
      // Mock data for demo
      setReceipts([
        {
          id: "1",
          merchant: "Walmart",
          date: "2024-01-15",
          total: 67.89,
          items: [],
          category: "Groceries",
          imageUrl: "/placeholder.svg?height=100&width=100",
          createdAt: "2024-01-15T10:30:00Z",
        },
        {
          id: "2",
          merchant: "Pizza Palace",
          date: "2024-01-14",
          total: 28.5,
          items: [],
          category: "Dining",
          imageUrl: "/placeholder.svg?height=100&width=100",
          createdAt: "2024-01-14T19:45:00Z",
        },
        {
          id: "3",
          merchant: "Shell Gas",
          date: "2024-01-13",
          total: 35.0,
          items: [],
          category: "Transportation",
          imageUrl: "/placeholder.svg?height=100&width=100",
          createdAt: "2024-01-13T08:15:00Z",
        },
        {
          id: "4",
          merchant: "Starbucks",
          date: "2024-01-12",
          total: 4.5,
          items: [],
          category: "Dining",
          imageUrl: "/placeholder.svg?height=100&width=100",
          createdAt: "2024-01-12T07:30:00Z",
        },
      ])
      setSpending({
        month: "January 2024",
        total: 1250,
        categories: [
          { name: "Groceries", amount: 450, percentage: 36, color: "bg-green-500", icon: "🛒" },
          { name: "Dining", amount: 300, percentage: 24, color: "bg-orange-500", icon: "🍕" },
          { name: "Transportation", amount: 200, percentage: 16, color: "bg-blue-500", icon: "⛽" },
          { name: "Utilities", amount: 150, percentage: 12, color: "bg-purple-500", icon: "🏠" },
          { name: "Entertainment", amount: 150, percentage: 12, color: "bg-pink-500", icon: "🎮" },
        ],
        insights: [
          {
            id: "1",
            title: "Dining Increase",
            description: "Your dining spending is 15% higher than last month",
            type: "warning",
            amount: 45,
            category: "Dining",
          },
          {
            id: "2",
            title: "Budget On Track",
            description: "Grocery spending is within budget (85% used)",
            type: "success",
            category: "Groceries",
          },
        ],
      })
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      Groceries: ShoppingCart,
      Dining: Coffee,
      Transportation: Car,
      Utilities: Home,
      Entertainment: Gamepad2,
    }
    return icons[category] || ShoppingCart
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your financial insights...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Wallet className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Receipt Wallet</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">U</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link href="/upload">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-dashed border-blue-300 bg-blue-50">
              <CardContent className="flex items-center justify-center p-8">
                <div className="text-center">
                  <Camera className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Upload Receipt</h3>
                  <p className="text-blue-700">Take a photo or upload an image</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/assistant">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-dashed border-green-300 bg-green-50">
              <CardContent className="flex items-center justify-center p-8">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-900 mb-2">Ask Assistant</h3>
                  <p className="text-green-700">Get insights about your spending</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Spending</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${spending?.total.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget Status</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <Progress value={85} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">On track this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receipts</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{receipts.length}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Spending Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Spending Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {spending?.categories.map((category) => {
                  const Icon = getCategoryIcon(category.name)
                  return (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${category.color} bg-opacity-20`}>
                          <Icon className={`h-4 w-4 text-gray-700`} />
                        </div>
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-gray-500">{category.percentage}% of total</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${category.amount}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Smart Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {spending?.insights.map((insight) => (
                  <div key={insight.id} className="p-4 rounded-lg bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge variant={insight.type === "warning" ? "destructive" : "default"}>
                            {insight.title}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{insight.description}</p>
                        {insight.recommendation && (
                          <p className="text-sm text-blue-600 mt-2">💡 {insight.recommendation}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full bg-transparent">
                  <Link href="/insights" className="flex items-center space-x-2">
                    <span>View All Insights</span>
                    <TrendingUp className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Receipts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Receipts</CardTitle>
            <Link href="/receipts">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {receipts.map((receipt) => {
                const Icon = getCategoryIcon(receipt.category)
                return (
                  <div key={receipt.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Icon className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{receipt.merchant}</p>
                        <p className="text-sm text-gray-500">{receipt.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{receipt.category}</Badge>
                      <p className="font-semibold">${receipt.total}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
