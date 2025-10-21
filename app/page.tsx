'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Copy, Check, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import HistoryDrawer from '@/components/HistoryDrawer'
import { useTheme } from 'next-themes'

const modes = [
  { value: 'auto', label: 'Auto', color: '#FF6E00', tooltip: 'AI picks the best mode based on your input' },
  { value: 'expert', label: 'Expert', color: '#C9B4E8', tooltip: 'Advanced prompting with step-by-step reasoning' },
]

const tones = [
  { value: 'professional', label: 'Professional', description: 'Clear, direct, business-appropriate' },
  { value: 'playful', label: 'Playful', description: 'Light, witty, engaging and fun' },
  { value: 'technical', label: 'Technical', description: 'Precise, domain-rich vocabulary' },
  { value: 'poetic', label: 'Poetic', description: 'Lyrical, figurative, creative' },
  { value: 'witty', label: 'Witty', description: 'Sharp, clever, entertaining' },
  { value: 'dry', label: 'Dry', description: 'Deadpan, matter-of-fact humor' },
  { value: 'harsh', label: 'Harsh', description: 'Blunt, no-nonsense, direct' },
  { value: 'brutal', label: 'Brutal', description: 'Ruthlessly honest, unfiltered' },
]

export default function Home() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [mode, setMode] = useState('auto')
  const [tone, setTone] = useState('professional')
  const [historyOpen, setHistoryOpen] = useState(false)
  const [arcRotating, setArcRotating] = useState(false)
  const [footerTextHovered, setFooterTextHovered] = useState(false)

  const handleTransform = async () => {
    if (!input.trim()) {
      toast.error('Please enter a prompt')
      return
    }

    setLoading(true)
    setArcRotating(true)

    try {
      const response = await fetch('/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, mode, tone })
      })

      const data = await response.json()

      if (data.error) {
        toast.error(data.error)
        return
      }

      setOutput(data.transformedPrompt)
      toast.success('Prompt transformed!')
    } catch (error) {
      toast.error('Failed to transform prompt')
      console.error(error)
    } finally {
      setLoading(false)
      setArcRotating(false)
    }
  }

  const handleCopy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    toast.success('Copied ✓')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLoadFromHistory = (historyItem: any) => {
    setInput(historyItem.input)
    setOutput(historyItem.output)
    setMode(historyItem.mode || 'auto')
    setTone(historyItem.tone || 'professional')
    setHistoryOpen(false)
    toast.success('Loaded from history')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      handleTransform()
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'h') {
      e.preventDefault()
      setHistoryOpen(!historyOpen)
    }
  }

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'h') {
        e.preventDefault()
        setHistoryOpen(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [])

  const openInAI = (platform: 'chatgpt' | 'claude' | 'gemini') => {
    if (!output) return

    // URL encode the output for use in query parameters
    const encodedPrompt = encodeURIComponent(output)

    const urls = {
      // ChatGPT doesn't support URL parameters for prompt pre-filling
      chatgpt: 'https://chat.openai.com/',
      // Claude supports text parameter in the URL
      claude: `https://claude.ai/new?q=${encodedPrompt}`,
      // Gemini doesn't officially support URL parameters for prompt pre-filling
      gemini: 'https://gemini.google.com/',
    }

    // Always copy to clipboard as fallback
    navigator.clipboard.writeText(output)
    window.open(urls[platform], '_blank')

    // Update toast message based on platform
    if (platform === 'claude') {
      toast.success(`Opening Claude with your prompt!`)
    } else {
      toast.success(`Copied! Paste (⌘V) in ${platform}`)
    }
  }

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="fade-scale-in">
        <div className="max-w-[640px] mx-auto px-4 sm:px-6 pt-12 sm:pt-24 pb-6 sm:pb-8">
          {/* Centered Logo */}
          <div className="text-center mb-3">
            <h1 className="text-5xl sm:text-7xl font-bold text-[#333333] dark:text-[#F5F5F5] tracking-tight inline-block">
              <span className="relative inline-block">
                <motion.span
                  className="absolute -top-5 sm:-top-7 left-0 text-3xl sm:text-5xl text-[#FF6E00]"
                  style={{
                    filter: 'drop-shadow(0 0 12px rgba(255,110,0,0.5))'
                  }}
                  animate={arcRotating ? { rotate: 180 } : { rotate: [-10, 10, -10] }}
                  transition={arcRotating ? { duration: 0.4 } : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  ⟳
                </motion.span>
                O
              </span>
              hPrompt!
            </h1>
          </div>

          {/* Centered tagline and controls */}
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-[#4B4B4B] dark:text-[#B0B0B0] tracking-wide font-light">
              Lazy prompt? Let's fix that.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {session && (
                <button
                  onClick={() => setHistoryOpen(true)}
                  className="p-2 rounded-lg hover:bg-[#FF6E00]/10 transition-all duration-150"
                  title="History (⌘H)"
                >
                  <span className="text-[#FF6E00] text-xl">⟲</span>
                </button>
              )}

              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-[#FF6E00]/10 transition-all duration-150"
                title="Toggle theme"
              >
                <span className="text-[#FF6E00] text-xl">{theme === 'dark' ? '☀︎' : '●'}</span>
              </button>

              {session ? (
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 text-xs sm:text-sm rounded-lg bg-[#4B4B4B]/10 dark:bg-[#F5F5F5]/10 hover:bg-[#4B4B4B]/20 dark:hover:bg-[#F5F5F5]/20 transition-all duration-200 font-medium"
                >
                  Sign out
                </button>
              ) : (
                <button
                  onClick={() => signIn('google')}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg bg-white dark:bg-[#2A2A2A]
                             border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]
                             text-[#333333] dark:text-[#F5F5F5] font-medium
                             hover:bg-[#F8F8F8] dark:hover:bg-[#333333]
                             hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)]
                             transition-all duration-200
                             flex items-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="hidden sm:inline">Sign in with Google</span>
                  <span className="sm:hidden">Sign in</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[640px] mx-auto px-4 sm:px-6 pb-24 sm:pb-32">
        <div className="space-y-6 sm:space-y-8">
          {/* Mode Selector */}
          <motion.div
            className="flex flex-wrap justify-center gap-2 stagger-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {modes.map((m) => (
              <button
                key={m.value}
                onClick={() => setMode(m.value)}
                className={`pill-chip text-xs sm:text-sm ${mode === m.value ? 'pill-chip-active' : 'pill-chip-inactive'}`}
                style={mode === m.value ? { backgroundColor: m.color } : {}}
                title={m.tooltip}
              >
                {m.label}
              </button>
            ))}
          </motion.div>

          {/* Tone Selector */}
          <motion.div
            className="flex flex-col items-center gap-2 stagger-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-white/70 dark:bg-[#2A2A2A]/70
                         border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)]
                         text-xs sm:text-sm font-medium text-[#4B4B4B] dark:text-[#E0E0E0]
                         focus:outline-none transition-all duration-300
                         hover:bg-white dark:hover:bg-[#333333]
                         hover:border-[#FF6E00]/30 hover:shadow-[0_2px_8px_rgba(255,110,0,0.15)]
                         cursor-pointer backdrop-blur-sm min-w-[200px]"
              style={{
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#FF6E00'
                e.target.style.boxShadow = '0 0 0 3px rgba(255,110,0,0.15), 0 1px 3px rgba(255,110,0,0.2), 0 0 20px rgba(255,110,0,0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = ''
                e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)'
              }}
            >
              {tones.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label} — {t.description}
                </option>
              ))}
            </select>
            <p className="text-[10px] sm:text-xs text-[#999999] dark:text-[#666666] font-light tracking-wide">
              {tones.find(t => t.value === tone)?.description}
            </p>
          </motion.div>

          {/* Input Area */}
          <motion.div
            className="stagger-2-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your lazy prompt here..."
              className="w-full h-40 sm:h-48 p-4 sm:p-5 bg-white/80 dark:bg-[#2A2A2A]/80 rounded-lg
                         border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)]
                         orange-focus resize-none text-sm sm:text-[15px] leading-relaxed
                         shadow-[0_3px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_3px_8px_rgba(0,0,0,0.4)]
                         hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.5)]
                         transition-all duration-300 backdrop-blur-sm
                         placeholder:text-[#999999] dark:placeholder:text-[#666666] placeholder:italic"
              style={{
                fontFamily: 'JetBrains Mono, monospace',
              }}
            />
            <p className="text-xs text-[#999999] dark:text-[#666666] mt-2 font-light tracking-wide">
              e.g., write a tweet about AI tools for designers
            </p>
          </motion.div>

          {/* Transform Button */}
          <motion.button
            onClick={handleTransform}
            disabled={loading || !input.trim()}
            className={`mechanical-button w-full py-4 text-base font-semibold stagger-3
                       ${loading ? 'processing-pulse' : ''}
                       disabled:opacity-50 disabled:cursor-not-allowed`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <span className="flex items-center justify-center gap-2">
              <motion.span
                animate={loading ? { rotate: 360 } : {}}
                transition={loading ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
              >
                ⟳
              </motion.span>
              {loading ? 'Transforming...' : 'Make it Smart'}
            </span>
          </motion.button>

          <p className="text-xs opacity-50 text-center stagger-4">Press ⌘ + Enter to transform</p>

          {/* Output Area */}
          <AnimatePresence>
            {output && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm opacity-70">⟳ {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode Result</p>
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg hover:bg-[#FF6E00]/10 transition-all duration-150"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-[#FF6E00]" />
                    )}
                  </button>
                </div>

                <div className="p-5 sm:p-8 bg-gradient-to-br from-white to-[#FAF8F3] dark:from-[#2A2A2A] dark:to-[#252525] rounded-xl
                               border border-[rgba(255,110,0,0.1)] dark:border-[rgba(255,110,0,0.15)]
                               shadow-[0_4px_16px_rgba(0,0,0,0.08),0_1px_3px_rgba(255,110,0,0.1)]
                               dark:shadow-[0_4px_16px_rgba(0,0,0,0.4),0_1px_3px_rgba(255,110,0,0.15)]
                               backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FF6E00]/5 to-transparent rounded-full blur-2xl" />
                  <p className="whitespace-pre-wrap leading-[1.7] sm:leading-[1.8] text-sm sm:text-[15px] relative z-10"
                     style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {output}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => openInAI('chatgpt')}
                    className="px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-xs rounded-lg border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]
                               hover:bg-[#10A37F]/10 hover:border-[#10A37F] transition-all duration-150
                               flex items-center gap-1 whitespace-nowrap"
                  >
                    <span className="hidden xs:inline">→ Open in</span>
                    <span className="xs:hidden">→</span> ChatGPT
                  </button>
                  <button
                    onClick={() => openInAI('claude')}
                    className="px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-xs rounded-lg border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]
                               hover:bg-[#CC785C]/10 hover:border-[#CC785C] transition-all duration-150
                               flex items-center gap-1 whitespace-nowrap"
                  >
                    <span className="hidden xs:inline">→ Open in</span>
                    <span className="xs:hidden">→</span> Claude
                  </button>
                  <button
                    onClick={() => openInAI('gemini')}
                    className="px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-xs rounded-lg border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]
                               hover:bg-[#4285F4]/10 hover:border-[#4285F4] transition-all duration-150
                               flex items-center gap-1 whitespace-nowrap"
                  >
                    <span className="hidden xs:inline">→ Open in</span>
                    <span className="xs:hidden">→</span> Gemini
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full py-4 sm:py-6">
        <div className="max-w-[640px] mx-auto px-4 sm:px-6">
          <p
            className="text-[11px] sm:text-[13px] opacity-70 text-center transition-all duration-300"
            onMouseEnter={() => setFooterTextHovered(true)}
            onMouseLeave={() => setFooterTextHovered(false)}
          >
            Made with{' '}
            <span className="inline-block continuous-rotate text-[#FF6E00]">⟳</span>
            {' '}by {footerTextHovered ? '(mostly humans, tbh)' : 'humans and AI.'}
          </p>
        </div>
      </footer>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onLoadPrompt={handleLoadFromHistory}
      />
    </div>
  )
}
