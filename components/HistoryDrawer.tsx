'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getUserHistory, clearUserHistory, PromptHistory } from '@/lib/supabase';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadPrompt: (item: PromptHistory) => void;
}

export default function HistoryDrawer({ isOpen, onClose, onLoadPrompt }: HistoryDrawerProps) {
  const { data: session } = useSession();
  const [history, setHistory] = useState<PromptHistory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && session?.user?.email) {
      loadHistory();
    }
  }, [isOpen, session]);

  const loadHistory = async () => {
    if (!session?.user?.email) return;

    setLoading(true);
    const { data, error } = await getUserHistory(session.user.email);
    if (!error && data) {
      setHistory(data);
    }
    setLoading(false);
  };

  const handleClearHistory = async () => {
    if (!session?.user?.email) return;

    if (!confirm('Are you sure you want to clear all history? This cannot be undone.')) {
      return;
    }

    setLoading(true);
    const { error } = await clearUserHistory(session.user.email);

    if (error) {
      toast.error('Failed to clear history');
      console.error(error);
    } else {
      setHistory([]);
      toast.success('History cleared');
    }

    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const truncate = (str: string, length: number) => {
    return str.length > length ? str.substring(0, length) + '...' : str;
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 dark:bg-black/50 z-[90]"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#FAF8F3] dark:bg-[#1C1C1C]
                       shadow-[-4px_0_20px_rgba(0,0,0,0.15)] dark:shadow-[-4px_0_20px_rgba(0,0,0,0.5)]
                       z-[100] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-[#F5F5F5]">
                History
              </h2>
              <div className="flex items-center gap-3">
                {history.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    disabled={loading}
                    className="text-xs px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700
                               text-gray-600 dark:text-gray-400
                               hover:border-red-400/40 hover:bg-red-50 dark:hover:bg-red-950/20
                               hover:text-red-600 dark:hover:text-red-400
                               transition-all duration-200
                               disabled:opacity-50 disabled:cursor-not-allowed
                               flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3 h-3" />
                    Clear All
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200
                             transition-colors duration-200 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-gray-500 dark:text-gray-400">Loading...</div>
                </div>
              ) : history.length === 0 ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-gray-500 dark:text-gray-400 text-center">
                    No history yet.<br />Start creating prompts!
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => {
                        onLoadPrompt(item);
                        onClose();
                      }}
                      className="bg-white dark:bg-[#2A2A2A] rounded-lg p-4 cursor-pointer
                                 border border-gray-200 dark:border-gray-700
                                 hover:border-[#FF6E00] dark:hover:border-[#FF6E00]
                                 hover:shadow-[0_2px_8px_rgba(255,110,0,0.15)]
                                 transition-all duration-200"
                    >
                      {/* Meta */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-xs font-medium
                                         bg-[#FF6E00]/10 text-[#FF6E00]">
                            {item.mode}
                          </span>
                          <span className="px-2 py-0.5 rounded text-xs font-medium
                                         bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                            {item.tone}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(item.createdAt)}
                        </span>
                      </div>

                      {/* Input preview */}
                      <div className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">
                        {truncate(item.input, 100)}
                      </div>

                      {/* Output preview */}
                      <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                        {truncate(item.output, 120)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
