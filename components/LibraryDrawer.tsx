'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Book, Sparkles, Target, Mail, Code, FileText } from 'lucide-react'
import { toast } from 'sonner'

interface LibraryDrawerProps {
  isOpen: boolean
  onClose: () => void
  onLoadPrompt: (prompt: { id: string; title: string; prompt: string; category: string }) => void
}

const libraryTemplates = [
  {
    id: '1',
    title: 'Professional Email',
    category: 'Business',
    icon: Mail,
    prompt: 'Write a professional email to [recipient] about [topic]. The tone should be formal and respectful, clearly stating the purpose and any action items needed.'
  },
  {
    id: '2',
    title: 'Code Review',
    category: 'Development',
    icon: Code,
    prompt: 'Review the following code and provide feedback on code quality, potential bugs, performance improvements, and best practices. Be specific and constructive in your suggestions.'
  },
  {
    id: '3',
    title: 'Creative Story',
    category: 'Creative',
    icon: Sparkles,
    prompt: 'Write a creative short story about [topic/theme] with vivid descriptions, compelling characters, and an engaging plot. The story should be approximately [length] words.'
  },
  {
    id: '4',
    title: 'Project Proposal',
    category: 'Business',
    icon: FileText,
    prompt: 'Create a comprehensive project proposal for [project name] including: executive summary, objectives, methodology, timeline, budget, and expected outcomes.'
  },
  {
    id: '5',
    title: 'Marketing Copy',
    category: 'Marketing',
    icon: Target,
    prompt: 'Write compelling marketing copy for [product/service] targeting [audience]. Focus on benefits, unique value proposition, and include a strong call-to-action.'
  },
  {
    id: '6',
    title: 'Technical Documentation',
    category: 'Development',
    icon: Book,
    prompt: 'Write clear technical documentation for [feature/function]. Include: purpose, parameters, return values, examples, and common use cases.'
  }
]

const categories = ['All', 'Business', 'Development', 'Creative', 'Marketing']

export default function LibraryDrawer({ isOpen, onClose, onLoadPrompt }: LibraryDrawerProps) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTemplates = libraryTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.prompt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-full sm:w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <Book className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Prompt Library</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Search */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Categories */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
              <div className="flex space-x-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Templates List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {filteredTemplates.length === 0 ? (
                <div className="text-center py-12">
                  <Book className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No templates found</p>
                </div>
              ) : (
                filteredTemplates.map((template) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg transition-all cursor-pointer border border-transparent hover:border-purple-300 dark:hover:border-purple-700"
                    onClick={() => {
                      onLoadPrompt(template)
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center flex-shrink-0">
                        <template.icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {template.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          {template.category}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {template.prompt}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
