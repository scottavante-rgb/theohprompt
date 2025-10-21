'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface LoopArcProps {
  isActive?: boolean;
  className?: string;
  enableGentleRotation?: boolean;
  shake?: boolean;
}

export default function LoopArc({
  isActive = false,
  className = '',
  enableGentleRotation = false,
  shake = false
}: LoopArcProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.svg
      width="24"
      height="16"
      viewBox="0 0 24 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${enableGentleRotation && !isActive ? 'gentle-rotate' : ''} ${shake ? 'arc-shake' : ''} cursor-pointer`}
      initial={{ opacity: 0.6 }}
      animate={{
        opacity: isActive ? 1 : (isHovered ? 0.8 : 0.6),
        rotate: isActive ? 180 : 0,
        scale: isHovered ? 1.1 : 1,
      }}
      transition={{
        opacity: { duration: 0.2 },
        rotate: { duration: 0.4, ease: 'easeInOut' },
        scale: { duration: 0.2 },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Semicircular arc */}
      <path
        d="M 2 14 Q 12 2, 22 14"
        stroke="#FF6E00"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        className="dark:drop-shadow-[0_0_4px_rgba(255,110,0,0.5)]"
      />
    </motion.svg>
  );
}
