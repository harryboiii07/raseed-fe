"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, MessageCircle, Bot, User, TrendingUp, ShoppingCart, DollarSign } from "lucide-react"
import Link from "next/link"
import { apiService } from "@/lib/api-service"
import type { ChatMessage } from "@/types"

export default function Assistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hi! I'm your AI financial assistant. I can help you understand your spending patterns, track budgets, and provide personalized insights. What would you like to know?",
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickQuestions = [
    "How much did I spend on groceries last month?",
    "What's my dining budget status?",
    "Show me my recurring subscriptions",
    "What can I cook with my recent purchases?",
    "Find ways to save money this month",
  ]

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const sendMessage = async (message: string) => {
    if (!message.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await apiService.queryAssistant(message)
      setMessages((prev) => [...prev, response])
    } catch (error) {
      console.error("Failed to get assistant response:", error)

      // Mock response for demo
      const mockResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: generateMockResponse(message),
        timestamp: new Date().toISOString(),
        data: generateMockData(message),
      }

      setTimeout(() => {
        setMessages((prev) => [...prev, mockResponse])
        setLoading(false)
      }, 1500)
      return
    }

    setLoading(false)
  }

  const generateMockResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes("grocery") || lowerQuery.includes("groceries")) {
      return "Based on your receipts, you spent $450 on groceries last month. This is within your $500 budget (90% used). Your most frequent grocery store is Walmart, and you typically spend $112 per week."
    }

    if (lowerQuery.includes("dining") || lowerQuery.includes("restaurant")) {
      return "Your dining expenses for this month are $300, which is 15% higher than last month ($260). You've visited restaurants 12 times this month. Consider reducing dining out by 2-3 times to save approximately $50."
    }

    if (lowerQuery.includes("subscription")) {
      return "I found 3 recurring subscriptions in your spending: Netflix ($15.99/month), Spotify ($9.99/month), and Adobe Creative Suite ($20.99/month). Total: $46.97/month or $563.64/year."
    }

    if (lowerQuery.includes("cook") || lowerQuery.includes("recipe")) {
      return "Based on your recent grocery purchases, you have ingredients for: Pasta with marinara sauce, Chicken stir-fry, and Banana bread. Would you like specific recipes for any of these?"
    }

    if (lowerQuery.includes("save") || lowerQuery.includes("saving")) {
      return "Here are 3 ways to save money this month: 1) Reduce dining out by $50, 2) Cancel unused subscriptions to save $20, 3) Buy generic brands for groceries to save $30. Total potential savings: $100/month."
    }

    return "I understand you're asking about your finances. Let me analyze your spending data and provide you with relevant insights. Is there a specific category or time period you'd like me to focus on?"
  }

  const generateMockData = (query: string) => {
    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes("grocery") || lowerQuery.includes("groceries")) {
      return {
        type: "spending_summary",
        category: "Groceries",
        amount: 450,
        budget: 500,
        percentage: 90,
        trend: "+5%",
      }
    }

    if (lowerQuery.includes("dining")) {
      return {
        type: "spending_comparison",
        category: "Dining",
        current: 300,
        previous: 260,
        change: "+15%",
        visits: 12,
      }
    }

    return null
  }

  const handleQuickQuestion = (question: string) => {
    sendMessage(question)
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bot className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">AI Assistant</h1>
                <p className="text-sm text-gray-500">Your personal financial advisor</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col h-full">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex space-x-3 max-w-3xl ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {message.type === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`flex-1 ${message.type === "user" ? "text-right" : ""}`}>
                    <div
                      className={`inline-block p-4 rounded-lg ${
                        message.type === "user" ? "bg-blue-600 text-white" : "bg-white border shadow-sm"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>

                      {/* Data visualization for assistant messages */}
                      {message.type === "assistant" && message.data && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          {message.data.type === "spending_summary" && (
                            <div className="bg-gray-50 p-3 rounded">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">{message.data.category}</span>
                                <Badge variant="secondary">{message.data.trend}</Badge>
                              </div>
                              <div className="text-2xl font-bold text-green-600">${message.data.amount}</div>
                              <div className="text-sm text-gray-500">
                                of ${message.data.budget} budget ({message.data.percentage}% used)
                              </div>
                            </div>
                          )}

                          {message.data.type === "spending_comparison" && (
                            <div className="bg-gray-50 p-3 rounded">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <div className="text-sm text-gray-500">This Month</div>
                                  <div className="text-xl font-bold">${message.data.current}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500">Last Month</div>
                                  <div className="text-xl font-bold">${message.data.previous}</div>
                                </div>
                              </div>
                              <div className="mt-2 flex items-center justify-between">
                                <span className="text-sm">Change: {message.data.change}</span>
                                <span className="text-sm">{message.data.visits} visits</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className={`text-xs text-gray-500 mt-1 ${message.type === "user" ? "text-right" : ""}`}>
                      {formatTimestamp(message.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex space-x-3 max-w-3xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="bg-white border shadow-sm rounded-lg p-4">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Quick Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {quickQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="text-left justify-start h-auto p-3 bg-transparent"
                      onClick={() => handleQuickQuestion(question)}
                    >
                      <div className="flex items-start space-x-2">
                        <MessageCircle className="h-4 w-4 mt-0.5 text-blue-600" />
                        <span className="text-sm">{question}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Input */}
          <div className="bg-white border rounded-lg p-4">
            <div className="flex space-x-4">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about your spending..."
                onKeyPress={(e) => e.key === "Enter" && sendMessage(input)}
                disabled={loading}
                className="flex-1"
              />
              <Button onClick={() => sendMessage(input)} disabled={loading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-3 w-3" />
                <span>Spending insights</span>
              </div>
              <div className="flex items-center space-x-1">
                <ShoppingCart className="h-3 w-3" />
                <span>Receipt analysis</span>
              </div>
              <div className="flex items-center space-x-1">
                <DollarSign className="h-3 w-3" />
                <span>Budget tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
