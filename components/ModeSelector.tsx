'use client';

import { PromptMode } from '@/lib/openai';

interface ModeSelectorProps {
  mode: PromptMode;
  onChange: (mode: PromptMode) => void;
}

const modes = [
  { value: 'auto' as const, label: 'Auto', tooltip: 'Let OhPrompt! decide.' },
  { value: 'expert' as const, label: 'Expert', tooltip: 'Go full nerd.' },
];

export default function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      {modes.map((m) => (
        <button
          key={m.value}
          onClick={() => onChange(m.value)}
          className={`
            pill-chip group relative
            ${mode === m.value ? 'pill-chip-active' : 'pill-chip-inactive'}
          `}
          title={m.tooltip}
        >
          {m.label}

          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5
                          bg-[#333333] dark:bg-[#F5F5F5] text-[#FAF8F3] dark:text-[#1C1C1C] text-xs rounded-md opacity-0
                          group-hover:opacity-100 transition-opacity duration-150 pointer-events-none
                          whitespace-nowrap font-normal">
            {m.tooltip}
          </div>
        </button>
      ))}
    </div>
  );
}
