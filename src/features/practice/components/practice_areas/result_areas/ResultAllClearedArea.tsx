'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trophy, PartyPopper, Beer } from 'lucide-react';

export function ResultAllClearedArea() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 font-dot">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {(() => {
          // Generate decoration items once to satisfy hook purity
          const decorations = Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            left: `${(i * 137) % 100}%`, // Pseudo-random stable position
            scale: 0.5 + ((i * 7) % 10) / 10,
            rotateDir: i % 2 === 0 ? 1 : -1,
            duration: 3 + ((i * 11) % 4),
            delay: (i * 3) % 5,
          }));

          return decorations.map((item) => (
            <motion.div
              key={item.id}
              initial={{
                top: -20,
                left: item.left,
                rotate: 0,
                scale: item.scale,
              }}
              animate={{
                top: '120%',
                rotate: 360 * item.rotateDir,
              }}
              transition={{
                duration: item.duration,
                repeat: Infinity,
                ease: 'linear',
                delay: item.delay,
              }}
              className="absolute"
            >
              {item.id % 3 === 0 ? (
                <PartyPopper className="text-yellow-400 w-8 h-8 opacity-40 shadow-xl" />
              ) : item.id % 3 === 1 ? (
                <Beer className="text-yellow-200 w-10 h-10 opacity-30" />
              ) : (
                <div className="w-4 h-4 bg-white opacity-40" />
              )}
            </motion.div>
          ));
        })()}
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        className="dq-window p-12 flex flex-col items-center gap-8 text-center max-w-lg w-full text-white"
      >
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{
              rotate: [0, -10, 10, -10, 10, 0],
              scale: [1, 1.1, 1, 1.1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Trophy className="w-32 h-32 text-yellow-400" />
          </motion.div>
          <motion.div
            className="absolute -top-4 -right-4 dq-window bg-black px-2 py-1 text-white font-normal"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            10
          </motion.div>
        </div>

        <div className="z-10">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-normal text-yellow-400 animate-pulse"
          >
            グランドマスター
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/60 text-lg leading-relaxed"
          >
            すべてを　せいした！
            <br />
            あなたは　しんの　えいごマスターだ。
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center gap-4 py-6 border-y-2 border-white/20 w-full"
        >
          <div className="flex items-center gap-4">
            <Beer className="w-12 h-12 text-yellow-400" />
            <span className="text-3xl font-normal tracking-widest text-yellow-200">
              かんぱーい！
            </span>
            <Beer className="w-12 h-12 text-yellow-400 scale-x-[-1]" />
          </div>
        </motion.div>

        <Link href="/" className="w-full z-10">
          <button className="dq-button w-full py-4 text-xl">
            でんせつとして　きかんする
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
