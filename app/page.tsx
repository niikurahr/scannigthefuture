"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TimeframeChip } from "@/components/TimeframeChip"
import { motion } from "framer-motion"
import { Loader2 } from 'lucide-react'

const timeframes = ["1年後", "3年後", "10年後", "50年後"]

export default function Home() {
const [keyword, setKeyword] = useState<string>(""); // 型を string に
const [timeframe, setTimeframe] = useState<string>("1年後"); // 型を string に
const [results, setResults] = useState<json[]>([]); // 型を AIResult[] に変更
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, timeframe }),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }
      setResults(data)
    } catch (error) {
      console.error("Error fetching results:", error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-blue-800 to-teal-500 text-white">
      <div className="container mx-auto p-4">
        <h1 className="text-5xl font-bold mb-8 text-center pt-12">Scanning the Future</h1>
        <form onSubmit={handleSubmit} className="mb-12">
          <div className="flex flex-col items-center gap-6">
            <Input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="キーワードを入力"
              className="w-full max-w-md text-black"
            />
            <div className="flex flex-wrap justify-center gap-4">
              {timeframes.map((tf) => (
                <TimeframeChip
                  key={tf}
                  timeframe={tf}
                  isSelected={timeframe === tf}
                  onClick={() => setTimeframe(tf)}
                />
              ))}
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full max-w-md bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  生成中...
                </>
              ) : (
                "未来を探索"
              )}
            </Button>
          </div>
        </form>
        {error && (
          <div className="w-full max-w-md mx-auto mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p>{error}</p>
          </div>
        )}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {results.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-white/10 backdrop-blur-md border-none text-white hover:bg-white/20 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">{result.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{result.description}</p>
                  {result.source && (
                    <a
                      href={result.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:text-blue-100 underline transition-colors duration-200"
                    >
                      ソースを確認
                    </a>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

