'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getUserPrompts, deletePrompt, Prompt } from '@/lib/supabase';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trash2, ExternalLink } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function LibraryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
      toast.error('Please sign in to view your library');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      loadPrompts();
    }
  }, [session]);

  const loadPrompts = async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    const { data, error } = await getUserPrompts(session.user.id);

    if (error) {
      toast.error('Failed to load prompts');
      console.error(error);
    } else {
      setPrompts(data || []);
    }

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await deletePrompt(id);

    if (error) {
      toast.error('Failed to delete prompt');
      console.error(error);
    } else {
      toast.success('Deleted ✓');
      setPrompts(prompts.filter((p) => p.id !== id));
    }
  };

  const handleOpen = (content: string) => {
    // Store the prompt in localStorage to load it on the main page
    localStorage.setItem('ohprompt-load-prompt', content);
    router.push('/');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#777777] dark:text-[#999999]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-6">
      <ThemeToggle />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
            className="mb-6 text-[#777777] dark:text-[#999999] hover:text-[#FF6E00]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to OhPrompt!
          </Button>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#333333] dark:text-[#F5F5F5] mb-3">
            My Prompts Library
          </h1>
          <p className="text-base text-[#777777] dark:text-[#999999]">
            {prompts.length} saved {prompts.length === 1 ? 'prompt' : 'prompts'}
          </p>
        </div>

        {/* Empty state */}
        {prompts.length === 0 && !loading && (
          <Card className="p-12 text-center bg-white dark:bg-[#2A2A2A] border-[rgba(0,0,0,0.04)] dark:border-[rgba(255,255,255,0.1)]">
            <div className="text-6xl mb-4 opacity-20">⟳</div>
            <h3 className="text-lg font-medium text-[#333333] dark:text-[#F5F5F5] mb-2">
              No saved prompts yet
            </h3>
            <p className="text-sm text-[#777777] dark:text-[#999999] mb-6">
              Start creating and saving prompts to build your library
            </p>
            <Button
              onClick={() => router.push('/')}
              className="bg-[#FF6E00] text-white hover:bg-[#FF6E00]/90"
            >
              Create Your First Prompt
            </Button>
          </Card>
        )}

        {/* Prompts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {prompts.map((prompt, index) => (
              <motion.div
                key={prompt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, height: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="p-5 bg-white dark:bg-[#2A2A2A] border-[rgba(0,0,0,0.04)] dark:border-[rgba(255,255,255,0.1)]
                               hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_4px_12px_rgba(255,110,0,0.2)]
                               hover:-translate-y-[2px] transition-all duration-200
                               group relative">
                  {/* Mode & Tone tags */}
                  <div className="flex gap-2 mb-3">
                    <span className="text-[10px] font-medium px-2 py-1 rounded-full
                                   bg-[#FF6E00]/10 dark:bg-[#FF6E00]/20 text-[#FF6E00]
                                   uppercase tracking-wider">
                      {prompt.mode}
                    </span>
                    {prompt.tone && (
                      <span className="text-[10px] font-medium px-2 py-1 rounded-full
                                     bg-[#333333]/10 dark:bg-[#F5F5F5]/10 text-[#333333] dark:text-[#F5F5F5]
                                     uppercase tracking-wider">
                        {prompt.tone}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-semibold text-[#333333] dark:text-[#F5F5F5] mb-2 line-clamp-2">
                    {prompt.title}
                  </h3>

                  {/* Content snippet */}
                  <p className="text-xs text-[#777777] dark:text-[#999999] line-clamp-3 mb-3 font-mono">
                    {prompt.content}
                  </p>

                  {/* Date */}
                  <p className="text-[10px] text-[#999999] dark:text-[#777777] mb-4">
                    {formatDate(prompt.createdAt)}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleOpen(prompt.content)}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]
                                 hover:border-[#FF6E00]/40 hover:bg-[#FF6E00]/5"
                    >
                      <ExternalLink className="w-3 h-3 mr-1.5" />
                      Open
                    </Button>

                    <Button
                      onClick={() => handleDelete(prompt.id)}
                      variant="outline"
                      size="sm"
                      className="text-xs border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]
                                 hover:border-red-500/40 hover:bg-red-500/5 hover:text-red-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
