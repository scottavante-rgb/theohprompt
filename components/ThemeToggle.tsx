'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 p-3 rounded-full transition-all duration-400
                 bg-white/60 dark:bg-[#2A2A2A] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]
                 hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_2px_8px_rgba(255,110,0,0.2)]
                 hover:-translate-y-[1px] active:translate-y-[1px]
                 group"
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        {theme === 'dark' ? (
          <span className="text-xl">⬤</span>
        ) : (
          <span className="text-xl">☀︎</span>
        )}
      </motion.div>
    </button>
  );
}
