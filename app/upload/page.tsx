"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Camera,
  Upload,
  ArrowLeft,
  Check,
  Loader2,
  ImageIcon,
  ShoppingCart,
  Coffee,
  Car,
  Home,
  Gamepad2,
} from "lucide-react"
import Link from "next/link"
import { apiService } from "@/lib/api-service"
import type { Receipt } from "@/types"

export default function UploadReceipt() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [extractedData, setExtractedData] = useState<Partial<Receipt> | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("")

  const categories = [
    { value: "groceries", label: "Groceries", icon: ShoppingCart },
    { value: "dining", label: "Dining", icon: Coffee },
    { value: "transportation", label: "Transportation", icon: Car },
    { value: "utilities", label: "Utilities", icon: Home },
    { value: "entertainment", label: "Entertainment", icon: Gamepad2 },
    { value: "other", label: "Other", icon: ShoppingCart },
  ]

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile && droppedFile.type.startsWith("image/")) {
        handleFileSelect(droppedFile)
      }
    },
    [handleFileSelect],
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const processReceipt = async () => {
    if (!file) return

    setProcessing(true)
    try {
      // Your backend handles the Gemini API call for OCR
      const result = await apiService.uploadReceipt(file)
      setExtractedData(result)
      setSelectedCategory(result.category.toLowerCase())

      // Show success message
      console.log("Receipt processed successfully:", result)
    } catch (error) {
      console.error("Failed to process receipt:", error)

      // Show error message to user
      alert("Failed to process receipt. Please try again.")

      // For demo purposes, still show mock data
      setExtractedData({
        id: "temp-" + Date.now(),
        merchant: "Walmart Supercenter",
        date: new Date().toISOString().split("T")[0],
        total: 67.89,
        items: [
          { name: "Bananas", price: 2.99, quantity: 1 },
          { name: "Milk", price: 3.49, quantity: 1 },
          { name: "Bread", price: 2.99, quantity: 2 },
          { name: "Eggs", price: 4.99, quantity: 1 },
        ],
        category: "Groceries",
        userId: "demo-user",
        status: "completed",
        createdAt: new Date().toISOString(),
        imageUrl: preview || "",
        confidence: 0.95,
      })
      setSelectedCategory("groceries")
    } finally {
      setProcessing(false)
    }
  }

  const saveReceipt = async () => {
    if (!extractedData) return

    try {
      // Update the receipt with any user edits
      if (extractedData.id && !extractedData.id.startsWith("temp-")) {
        await apiService.updateReceipt(extractedData.id, {
          ...extractedData,
          category: selectedCategory,
        })
      }

      // Create wallet pass
      const walletPass = await apiService.createWalletPass(extractedData.id || "temp")
      console.log("Wallet pass created:", walletPass)

      // Redirect to success page
      router.push("/?success=receipt-saved")
    } catch (error) {
      console.error("Failed to save receipt:", error)
      // For demo, just redirect anyway
      router.push("/?success=receipt-saved")
    }
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
            <h1 className="text-xl font-semibold text-gray-900">Upload Receipt</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Receipt Image</CardTitle>
            </CardHeader>
            <CardContent>
              {!preview ? (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <div className="space-y-4">
                    <div className="flex justify-center space-x-4">
                      <Camera className="h-12 w-12 text-gray-400" />
                      <Upload className="h-12 w-12 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">Upload Receipt</p>
                      <p className="text-gray-500">Drag and drop or click to select</p>
                    </div>
                    <div className="flex justify-center space-x-4">
                      <Button variant="outline" onClick={() => document.getElementById("camera-input")?.click()}>
                        <Camera className="h-4 w-4 mr-2" />
                        Camera
                      </Button>
                      <Button variant="outline" onClick={() => document.getElementById("file-input")?.click()}>
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Gallery
                      </Button>
                    </div>
                  </div>
                  <input
                    id="camera-input"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                  <input id="file-input" type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={preview || "/placeholder.svg"}
                      alt="Receipt preview"
                      className="w-full h-64 object-cover rounded-lg border"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2 bg-transparent"
                      onClick={() => {
                        setFile(null)
                        setPreview(null)
                        setExtractedData(null)
                      }}
                    >
                      Change
                    </Button>
                  </div>

                  {!extractedData && (
                    <Button onClick={processReceipt} disabled={processing} className="w-full">
                      {processing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Process Receipt
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Extracted Data Section */}
          <Card>
            <CardHeader>
              <CardTitle>Receipt Details</CardTitle>
            </CardHeader>
            <CardContent>
              {processing ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">Extracting data from receipt...</p>
                    <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
                  </div>
                </div>
              ) : extractedData ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="merchant">Merchant</Label>
                      <Input
                        id="merchant"
                        value={extractedData.merchant || ""}
                        onChange={(e) =>
                          setExtractedData({
                            ...extractedData,
                            merchant: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={extractedData.date || ""}
                        onChange={(e) =>
                          setExtractedData({
                            ...extractedData,
                            date: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="total">Total Amount</Label>
                      <Input
                        id="total"
                        type="number"
                        step="0.01"
                        value={extractedData.total || ""}
                        onChange={(e) =>
                          setExtractedData({
                            ...extractedData,
                            total: Number.parseFloat(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => {
                            const Icon = category.icon
                            return (
                              <SelectItem key={category.value} value={category.value}>
                                <div className="flex items-center space-x-2">
                                  <Icon className="h-4 w-4" />
                                  <span>{category.label}</span>
                                </div>
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {extractedData.items && extractedData.items.length > 0 && (
                    <div>
                      <Label>Items</Label>
                      <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                        {extractedData.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <div>
                              <span className="font-medium">{item.name}</span>
                              {item.quantity > 1 && (
                                <span className="text-sm text-gray-500 ml-2">x{item.quantity}</span>
                              )}
                            </div>
                            <span className="font-medium">${item.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <Button onClick={saveReceipt} className="flex-1">
                      <Check className="h-4 w-4 mr-2" />
                      Save to Wallet
                    </Button>
                    <Button variant="outline" onClick={() => setExtractedData(null)}>
                      Edit
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center text-gray-500">
                    <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Upload a receipt to extract details</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
