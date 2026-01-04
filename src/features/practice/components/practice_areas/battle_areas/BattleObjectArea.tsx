import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getAssetPath } from '@/lib/assets';

interface BattleObjectAreaProps {
  object: string;
  monsterState: 'idle' | 'hit' | 'defeated' | 'damaged' | 'attack';
  attackDistance: number;
  itemImg: string | null;
}

export function BattleObjectArea({
  object,
  monsterState,
  attackDistance,
  itemImg,
}: BattleObjectAreaProps) {
  return (
    <div className="flex-1 flex flex-col items-center relative h-full justify-end min-w-[80px] pb-12 md:pb-16">
      {itemImg && (
        <motion.div
          key={`item-${object}`}
          initial={{ x: 20, opacity: 0 }}
          animate={{ 
            x: monsterState === 'damaged' ? [0, 5, -5, 5, 0] : 
               monsterState === 'attack' ? [0, -attackDistance, 0] : 0,
            opacity: monsterState === 'defeated' ? 0.6 : 1,
            y: monsterState === 'defeated' ? 20 : 0,
            rotate: monsterState === 'defeated' ? 90 : 0,
            scale: monsterState === 'damaged' ? [1, 0.95, 1] : 1,
            filter: monsterState === 'damaged' ? ['brightness(1)', 'brightness(1.5) sepia(0.5) hue-rotate(-50deg)', 'brightness(1)'] : 
                    (monsterState === 'defeated' ? 'grayscale(100%)' : 'none')
          }}
          transition={{ duration: monsterState === 'damaged' ? 0.3 : (monsterState === 'attack' ? 0.3 : 0.5) }}
          className="z-10 flex flex-col items-center"
        >
          <Image 
            src={getAssetPath(itemImg)} 
            alt="Item" 
            width={120}
            height={120}
            className="w-20 h-20 md:w-28 md:h-28 object-contain pixelated mix-blend-multiply"
          />
        </motion.div>
      )}
      <div className="w-16 h-2 bg-black/30 blur-md rounded-[100%] absolute bottom-4"></div>
    </div>
  );
}
