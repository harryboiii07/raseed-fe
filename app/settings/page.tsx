"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, User, Bell, Wallet, Shield, Smartphone, CreditCard, Download, Trash2 } from "lucide-react"
import Link from "next/link"

export default function Settings() {
  const [notifications, setNotifications] = useState({
    spending: true,
    budget: true,
    insights: false,
    receipts: true,
  })

  const [budgets, setBudgets] = useState({
    groceries: 500,
    dining: 250,
    transportation: 200,
    utilities: 180,
    entertainment: 120,
  })

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }))
  }

  const handleBudgetChange = (category: string, value: number) => {
    setBudgets((prev) => ({ ...prev, [category]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
            <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <CardTitle>Profile</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="John" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="Doe" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="john.doe@example.com" />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select defaultValue="usd">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                  <SelectItem value="gbp">GBP (£)</SelectItem>
                  <SelectItem value="cad">CAD (C$)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Budget Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <CardTitle>Monthly Budgets</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(budgets).map(([category, amount]) => (
              <div key={category} className="flex items-center justify-between">
                <Label className="capitalize">{category}</Label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">$</span>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => handleBudgetChange(category, Number.parseInt(e.target.value))}
                    className="w-24"
                  />
                </div>
              </div>
            ))}
            <Separator />
            <div className="flex items-center justify-between font-semibold">
              <span>Total Monthly Budget</span>
              <span>${Object.values(budgets).reduce((sum, amount) => sum + amount, 0)}</span>
            </div>
            <Button>Update Budgets</Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Spending Alerts</Label>
                <p className="text-sm text-gray-500">Get notified when you exceed category budgets</p>
              </div>
              <Switch
                checked={notifications.spending}
                onCheckedChange={(value) => handleNotificationChange("spending", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Budget Reminders</Label>
                <p className="text-sm text-gray-500">Weekly budget status updates</p>
              </div>
              <Switch
                checked={notifications.budget}
                onCheckedChange={(value) => handleNotificationChange("budget", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Smart Insights</Label>
                <p className="text-sm text-gray-500">AI-powered spending insights and recommendations</p>
              </div>
              <Switch
                checked={notifications.insights}
                onCheckedChange={(value) => handleNotificationChange("insights", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Receipt Processing</Label>
                <p className="text-sm text-gray-500">Notifications when receipts are processed</p>
              </div>
              <Switch
                checked={notifications.receipts}
                onCheckedChange={(value) => handleNotificationChange("receipts", value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Google Wallet Integration */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Wallet className="h-5 w-5" />
              <CardTitle>Google Wallet Integration</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-green-900">Connected</p>
                  <p className="text-sm text-green-700">john.doe@gmail.com</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Disconnect
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Auto-create wallet passes</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Sync with Google Pay transactions</Label>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Privacy & Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Data Analytics</Label>
                <p className="text-sm text-gray-500">Help improve our service with anonymized usage data</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>AI Processing</Label>
                <p className="text-sm text-gray-500">Allow AI to analyze receipts and spending patterns</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Export My Data
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5" />
              <CardTitle>App Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="language">Language</Label>
              <Select defaultValue="en">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="theme">Theme</Label>
              <Select defaultValue="light">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Offline Mode</Label>
                <p className="text-sm text-gray-500">Cache data for offline access</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Version</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Updated</span>
              <span>January 15, 2024</span>
            </div>
            <Separator />
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start p-0">
                Privacy Policy
              </Button>
              <Button variant="ghost" className="w-full justify-start p-0">
                Terms of Service
              </Button>
              <Button variant="ghost" className="w-full justify-start p-0">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
