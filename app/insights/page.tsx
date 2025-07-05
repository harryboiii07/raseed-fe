"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info,
  DollarSign,
  Target,
  PieChart,
  BarChart3,
} from "lucide-react"
import Link from "next/link"

export default function Insights() {
  const [selectedPeriod, setSelectedPeriod] = useState("current")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load insights data
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const monthlyData = {
    current: {
      month: "January 2024",
      total: 1250,
      budget: 1500,
      categories: [
        { name: "Groceries", amount: 450, budget: 500, percentage: 90, trend: "+5%", color: "bg-green-500" },
        { name: "Dining", amount: 300, budget: 250, percentage: 120, trend: "+15%", color: "bg-orange-500" },
        { name: "Transportation", amount: 200, budget: 200, percentage: 100, trend: "0%", color: "bg-blue-500" },
        { name: "Utilities", amount: 150, budget: 180, percentage: 83, trend: "-8%", color: "bg-purple-500" },
        { name: "Entertainment", amount: 150, budget: 120, percentage: 125, trend: "+25%", color: "bg-pink-500" },
      ],
      insights: [
        {
          id: "1",
          type: "warning",
          title: "Dining Budget Exceeded",
          description: "You've spent 20% more on dining than budgeted this month.",
          amount: 50,
          recommendation: "Consider cooking at home 2-3 more times per week to save $50-75.",
          category: "Dining",
        },
        {
          id: "2",
          type: "success",
          title: "Utilities Savings",
          description: "Great job! You've saved 8% on utilities compared to last month.",
          amount: -15,
          recommendation: "Keep up the energy-saving habits!",
          category: "Utilities",
        },
        {
          id: "3",
          type: "info",
          title: "Subscription Review",
          description: "You have 3 recurring subscriptions totaling $46.97/month.",
          amount: 46.97,
          recommendation: "Review subscriptions and cancel unused ones to save money.",
          category: "Entertainment",
        },
      ],
      trends: [
        { period: "Dec 2023", amount: 1180 },
        { period: "Jan 2024", amount: 1250 },
        { period: "Projected Feb", amount: 1200 },
      ],
    },
  }

  const data = monthlyData.current

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <Info className="h-5 w-5 text-gray-500" />
    }
  }

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "warning":
        return "destructive"
      case "success":
        return "default"
      case "info":
        return "secondary"
      default:
        return "secondary"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your insights...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Financial Insights</h1>
                <p className="text-sm text-gray-500">{data.month}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${data.total.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">of ${data.budget.toLocaleString()} budget</p>
              <Progress value={(data.total / data.budget) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget Status</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{Math.round((data.total / data.budget) * 100)}%</div>
              <p className="text-xs text-muted-foreground">${data.budget - data.total} remaining</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Category</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Groceries</div>
              <p className="text-xs text-muted-foreground">$450 (36% of total)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Trend</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">+6%</div>
              <p className="text-xs text-muted-foreground">vs last month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="categories" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="insights">Smart Insights</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {data.categories.map((category) => (
                    <div key={category.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded ${category.color}`}></div>
                          <span className="font-medium">{category.name}</span>
                          <Badge variant={category.percentage > 100 ? "destructive" : "secondary"}>
                            {category.trend}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${category.amount}</div>
                          <div className="text-sm text-gray-500">of ${category.budget} budget</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={Math.min(category.percentage, 100)} className="flex-1" />
                        <span className="text-sm font-medium min-w-[3rem]">{category.percentage}%</span>
                      </div>
                      {category.percentage > 100 && (
                        <p className="text-sm text-red-600">Over budget by ${category.amount - category.budget}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {data.insights.map((insight) => (
                <Card key={insight.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getInsightIcon(insight.type)}
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                      </div>
                      <Badge variant={getBadgeVariant(insight.type)}>{insight.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{insight.description}</p>

                    {insight.amount && (
                      <div className="mb-4">
                        <div className={`text-2xl font-bold ${insight.amount > 0 ? "text-red-600" : "text-green-600"}`}>
                          {insight.amount > 0 ? "+" : ""}${Math.abs(insight.amount)}
                        </div>
                        <p className="text-sm text-gray-500">{insight.amount > 0 ? "Over budget" : "Saved"}</p>
                      </div>
                    )}

                    {insight.recommendation && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>💡 Recommendation:</strong> {insight.recommendation}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Potential Monthly Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-900">Reduce dining out</p>
                      <p className="text-sm text-green-700">Cook at home 2-3 more times per week</p>
                    </div>
                    <div className="text-2xl font-bold text-green-600">$50</div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-900">Cancel unused subscriptions</p>
                      <p className="text-sm text-blue-700">Review and cancel 1-2 unused services</p>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">$20</div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                    <div>
                      <p className="font-medium text-purple-900">Generic brand groceries</p>
                      <p className="text-sm text-purple-700">Switch to store brands for 30% of purchases</p>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">$30</div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold">Total Potential Savings</p>
                      <div className="text-3xl font-bold text-green-600">$100/month</div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">$1,200 per year</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Spending Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    {data.trends.map((trend, index) => (
                      <div key={trend.period} className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">{trend.period}</p>
                        <p className="text-2xl font-bold">${trend.amount}</p>
                        {index > 0 && (
                          <div className="flex items-center justify-center mt-2">
                            {trend.amount > data.trends[index - 1].amount ? (
                              <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                            )}
                            <span
                              className={`text-sm ${
                                trend.amount > data.trends[index - 1].amount ? "text-red-500" : "text-green-500"
                              }`}
                            >
                              {Math.abs(
                                ((trend.amount - data.trends[index - 1].amount) / data.trends[index - 1].amount) * 100,
                              ).toFixed(1)}
                              %
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Trend Analysis</h4>
                    <ul className="space-y-1 text-sm text-blue-800">
                      <li>• Spending increased by 6% from December to January</li>
                      <li>• Projected to decrease by 4% in February</li>
                      <li>• Dining expenses show the highest volatility</li>
                      <li>• Utilities spending has been consistently decreasing</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.categories.map((category) => (
                    <div key={category.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded ${category.color}`}></div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">${category.amount}</span>
                        <Badge variant={category.trend.startsWith("+") ? "destructive" : "default"}>
                          {category.trend}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
