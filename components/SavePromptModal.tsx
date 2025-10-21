'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SavePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
  defaultTitle: string;
}

export default function SavePromptModal({
  isOpen,
  onClose,
  onSave,
  defaultTitle,
}: SavePromptModalProps) {
  const [title, setTitle] = useState(defaultTitle);

  const handleSave = () => {
    onSave(title);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 dark:bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                       w-full max-w-md p-6 bg-white dark:bg-[#2A2A2A]
                       rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.4)]
                       border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#333333] dark:text-[#F5F5F5]">
                Save Prompt
              </h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-[#FAF8F3] dark:hover:bg-[#333333] rounded transition-colors"
              >
                <X className="w-5 h-5 text-[#777777] dark:text-[#999999]" />
              </button>
            </div>

            {/* Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#777777] dark:text-[#999999] mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-md
                           bg-[#FAF8F3] dark:bg-[#1C1C1C]
                           border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]
                           text-[#333333] dark:text-[#F5F5F5]
                           text-sm font-mono
                           focus:outline-none focus:ring-2 focus:ring-[#FF6E00]/40
                           transition-all duration-200"
                placeholder="Enter a title for this prompt..."
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSave();
                  } else if (e.key === 'Escape') {
                    onClose();
                  }
                }}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={onClose}
                className="text-sm border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="text-sm bg-[#FF6E00] text-white hover:bg-[#FF6E00]/90"
              >
                Save
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
