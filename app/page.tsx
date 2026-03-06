'use client'
import { useState } from 'react'

type Result = {
  title: string
  description: string
  bullets: string[]
}

export default function Home() {
  const [productName, setProductName] = useState('')
  const [keywords, setKeywords] = useState('')
  const [platform, setPlatform] = useState('etsy')
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  async function generate() {
    if (!productName.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName, keywords, platform }),
      })
      const data = await res.json()
      setResult(data)
    } catch (e) {
      alert('Something went wrong, please try again.')
    } finally {
      setLoading(false)
    }
  }

  function copyAll() {
    if (!result) return
    const text = `${result.title}\n\n${result.description}\n\n${result.bullets.map(b => `• ${b}`).join('\n')}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ListingAI</h1>
          <p className="text-gray-500">Generate product listings in 30 seconds</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name *</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-orange-400"
              placeholder="e.g. Handmade Soy Candle"
              value={productName}
              onChange={e => setProductName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Keywords</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-orange-400"
              placeholder="e.g. lavender, relaxing, gift, eco-friendly"
              value={keywords}
              onChange={e => setKeywords(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Platform</label>
            <div className="flex gap-2">
              {['shopify', 'etsy', 'amazon'].map(p => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    platform === p
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-orange-400'
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generate}
            disabled={loading || !productName.trim()}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-all"
          >
            {loading ? 'Generating...' : '✨ Generate Listing'}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-800">Generated Listing</h2>
              <button
                onClick={copyAll}
                className="text-sm px-4 py-1.5 rounded-lg border border-gray-300 hover:border-orange-400 transition-all"
              >
                {copied ? '✓ Copied!' : 'Copy All'}
              </button>
            </div>

            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-500 mb-1">Title</p>
              <p className="text-gray-900 font-medium">{result.title}</p>
            </div>

            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-500 mb-1">Description</p>
              <p className="text-gray-700 text-sm leading-relaxed">{result.description}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-500 mb-2">Bullet Points</p>
              <ul className="space-y-1">
                {result.bullets.map((b, i) => (
                  <li key={i} className="text-sm text-gray-700 flex gap-2">
                    <span className="text-orange-400">•</span> {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}