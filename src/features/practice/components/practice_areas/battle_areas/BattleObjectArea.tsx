import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getAssetPath } from '@/lib/assets';
import { usePracticeStore } from '../../../hooks/usePracticeStore';
import { useBattleStore } from '../../../hooks/useBattleStore';
import { usePracticeDerivedState } from '../../../hooks/usePracticeDerivedState';

interface BattleObjectAreaProps {
  attackDistance: number;
}

export function BattleObjectArea({
  attackDistance,
}: BattleObjectAreaProps) {
  const { state } = usePracticeStore();
  const { monsterState } = useBattleStore();
  const { battleImages } = usePracticeDerivedState();
  
  const { object } = state;
  const { itemImg } = battleImages;

  return (
    <div className="flex-1 flex flex-col items-center relative h-full justify-end min-w-[80px] pb-12 md:pb-16">
      {itemImg && (
        <motion.div
          key={`item-${object}`}
          initial={{ x: 20, opacity: 0 }}
          animate={{
            opacity: monsterState === 'defeated' ? [1, 1, 0.6] : 1,
            y: monsterState === 'defeated' ? [0, -10, 20] : 0,
            rotate: monsterState === 'defeated' ? [0, 0, 90] : 0,
            scale:
              monsterState === 'damaged'
                ? [1, 0.95, 1]
                : monsterState === 'defeated'
                  ? [1, 1.05, 1]
                  : 1,
            filter:
              monsterState === 'damaged'
                ? [
                    'brightness(1)',
                    'brightness(1.5) sepia(0.5) hue-rotate(-50deg)',
                    'brightness(1)',
                  ]
                : monsterState === 'defeated'
                  ? [
                      'brightness(1)',
                      'brightness(1.5)', // Hit flash
                      'grayscale(100%)',
                    ]
                  : 'none',
            x:
              monsterState === 'damaged'
                ? [0, 5, -5, 5, 0]
                : monsterState === 'attack'
                  ? [0, -attackDistance, 0]
                  : monsterState === 'defeated'
                    ? [0, 5, 0] // Slight shake
                    : 0,
          }}
          transition={{
            duration:
              monsterState === 'damaged'
                ? 0.3
                : monsterState === 'attack'
                  ? 0.3
                  : monsterState === 'defeated'
                    ? 0.6
                    : 0.5,
            times: monsterState === 'defeated' ? [0, 0.3, 1] : undefined,
          }}
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
