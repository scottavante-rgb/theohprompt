'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type Tone = 'professional' | 'playful' | 'technical' | 'poetic';

interface ToneSelectorProps {
  tone: Tone;
  onChange: (tone: Tone) => void;
}

const tones: { value: Tone; label: string; description: string }[] = [
  { value: 'professional', label: 'Professional', description: 'Clear, direct, structured' },
  { value: 'playful', label: 'Playful', description: 'Light, witty phrasing' },
  { value: 'technical', label: 'Technical', description: 'Precise, domain-rich' },
  { value: 'poetic', label: 'Poetic', description: 'Lyrical, figurative' },
];

export default function ToneSelector({ tone, onChange }: ToneSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedTone = tones.find((t) => t.value === tone);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#777777] dark:text-[#999999] font-medium">Tone:</span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1.5 rounded-md bg-white/60 dark:bg-[#2A2A2A]
                     border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]
                     text-sm font-medium text-[#FF6E00] hover:border-[#FF6E00]/40
                     transition-all duration-200 relative group"
        >
          {selectedTone?.label}

          {/* Orange underline animation on hover */}
          <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#FF6E00]
                           scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
        </button>
      </div>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 right-0 z-[100] min-w-[200px]
                       bg-white dark:bg-[#2A2A2A] rounded-lg
                       border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]
                       shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)]
                       overflow-hidden"
          >
            {tones.map((t) => (
              <button
                key={t.value}
                onClick={() => {
                  onChange(t.value);
                  setIsOpen(false);
                }}
                className={`
                  w-full px-4 py-3 text-left transition-colors duration-150
                  ${tone === t.value
                    ? 'bg-[#FF6E00]/10 dark:bg-[#FF6E00]/20 text-[#FF6E00]'
                    : 'hover:bg-[#FAF8F3] dark:hover:bg-[#333333] text-[#333333] dark:text-[#F5F5F5]'
                  }
                `}
              >
                <div className="font-medium text-sm">{t.label}</div>
                <div className="text-xs opacity-70 mt-0.5">{t.description}</div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
