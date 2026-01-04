import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function DragonVEffect() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="w-full h-full absolute flex items-center justify-center"
      >
        <svg viewBox="0 0 100 100" className="w-3/4 h-3/4 opacity-60">
          <path
            d="M20 30 L50 90 L80 30"
            stroke="orange"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M25 35 L50 85 L75 35"
            stroke="yellow"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M30 40 L50 80 L70 40"
            stroke="white"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.8"
          />
        </svg>
      </motion.div>
    </div>
  );
}
