'use client';

import { useState } from 'react';
import Link from 'next/link';

type MenuItem = {
  label: string;
  href: string;
};

type MenuData = {
  [key: string]: MenuItem[];
};

const DEFAULT_MENU: MenuData = {
  "たたかう": [
    { label: "ドリルクエスト", href: "/practice?mode=quest" }
  ],
  "じゅもん": [
    { label: "DO_SV", href: "/practice?mode=drill&pattern=DO_SV" },
    { label: "DO_SVO", href: "/practice?mode=drill&pattern=DO_SVO" },
    { label: "BE_SBC", href: "/practice?mode=drill&pattern=BE_SVC" }
  ],
  "どうぐ": [
    { label: "じゆうトレーニング", href: "/practice?mode=free" }
  ]
};

export function MainMenu() {
  const [selectedCategory, setSelectedCategory] = useState<string>("たたかう");

  const categories = Object.keys(DEFAULT_MENU);
  const subItems = DEFAULT_MENU[selectedCategory] || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      {/* 1st Tier: Left Command Area */}
      <section className="dq-window md:col-span-1 h-fit">
        <h2 className="text-xl mb-4 border-b-2 border-white/20 pb-2 text-yellow-400">コマンド</h2>
        <nav className="flex flex-col gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`dq-menu-item text-xl w-full text-left transition-all ${
                selectedCategory === category 
                  ? "text-yellow-400 before:content-['▶'] before:text-yellow-400" 
                  : "text-white"
              }`}
            >
              <span>{category}</span>
            </button>
          ))}
        </nav>
      </section>

      {/* 2nd Tier: Right Area */}
      <section className="dq-window md:col-span-2 min-h-[240px]">
        <h2 className="text-xl mb-4 border-b-2 border-white/20 pb-2 text-yellow-400 uppercase tracking-widest">
          {selectedCategory}
        </h2>
        <div className="flex flex-col gap-2">
          {subItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="dq-menu-item text-xl text-white hover:text-yellow-400 transition-colors"
            >
              <span>{item.label}</span>
            </Link>
          ))}
          {subItems.length === 0 && (
            <p className="text-white/40 p-4">なにもない　ようだ……</p>
          )}
        </div>
      </section>
    </div>
  );
}
