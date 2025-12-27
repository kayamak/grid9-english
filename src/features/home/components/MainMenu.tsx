'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const MOTIVATIONAL_MESSAGES = [
  "きみなら　できる！",
  "あきらめたら　そこで　しあいしゅうりょうだよ",
  "一歩ずつの　積み重ねが　大きな力になる！",
  "伝説の　勇者は　君のことだ！",
  "英語の　呪文を　マスターしよう！",
  "こんかいの　べんきょうは　きっと　やくにたつぞ！",
  "つづけることが　さいだいの　ぶきだ！",
  "ちりもつもれば　やまとなる！",
  "キミの　なまえを　れきしに　きざめ！",
  "こころの　エンジンを　全開にしろ！",
  "まいにちの　努力が　明日を　変える！",
  "きみの　なかに　ねむる　才能を　よびおこせ！"
];

type MenuItem = {
  label: string;
  href: string;
  descriptions: string[];
};

type CategoryData = {
  descriptions: string[];
  items: MenuItem[];
};

const MENU_DATA: Record<string, CategoryData> = {
  "たたかう": {
    descriptions: [
      "きびしい　ドリルに　いどみ、おのれの　スキルを　みがきあげろ！",
      "しれんを　のりこえたさきに、あらたな　ちからが　やどるだろう。",
      "こころを　むにして、もんだいを　なぎたおせ！"
    ],
    items: [
      { 
        label: "ドリルクエスト", 
        href: "/practice?mode=quest", 
        descriptions: [
          "せまりくる　せいげんじかんないに　あまたの　もんだいを　ときあかせ！",
          "はやさと　せいかくさ。その　どちらもが　もとめられる　クエストだ。",
          "ハイスコアを　めざして、なんども　ちょうせんしよう！"
        ]
      }
    ]
  },
  "じゅもん": {
    descriptions: [
      "ぶんぽうというなの　じゅもんを　じざいに　つかいこなせ！",
      "ことばの　ならびを　あやつるものは、せかいを　あやつる。",
      "ただしい　えいごは、ひとの　こころを　うごかす　まほうだ。"
    ],
    items: [
      { 
        label: "DO_SV", 
        href: "/practice?mode=drill&pattern=DO_SV", 
        descriptions: [
          "いっぱんどうしの　きほんけい。しゅごと　どうしの　きずなを　たしかめろ！",
          "だれが　なにを　するのか。すべての　きほんは　ここにある。"
        ]
      },
      { 
        label: "DO_SVO", 
        href: "/practice?mode=drill&pattern=DO_SVO", 
        descriptions: [
          "なにかを　たいしょうにする　うごき。もくてきを　とらえる　いちげきを！",
          "「なにを」を　はっきりさせる。それが　SVOの　ごくいだ。"
        ]
      },
      { 
        label: "BE_SVC", 
        href: "/practice?mode=drill&pattern=BE_SVC", 
        descriptions: [
          "じょうたいを　しめす　じゅもん。ありのままの　すがたを　ひょうげんせよ！",
          "イコールのかんけい。きみの　じょうたいを　ことばに　のせろ。"
        ]
      }
    ]
  },
  "どうぐ": {
    descriptions: [
      "さまざまな　どうぐを　くして、じゆうに　トレーニングだ！",
      "ときには　じゆうに、ときには　しんけんに。アイテムの　つかいかたは　きみしだい。",
      "じぶんだけの　スタイルで、えいごの　たびを　つづけよう。"
    ],
    items: [
      { 
        label: "じゆうトレーニング", 
        href: "/practice?mode=free", 
        descriptions: [
          "じぶんの　ペースで　じっくりと　じつりょくを　たくわえろ。",
          "まちがいを　おそれず、なんどでも　ためしてみるのが　じょうたつへの　ちかみちだ。"
        ]
      }
    ]
  }
};

export function MainMenu() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [descIndex, setDescIndex] = useState(0);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);
  const [bottomMessage, setBottomMessage] = useState<string>("ぼうけんの　じゅんびは　いいかな？");
  const router = useRouter();

  const updateMotivation = useCallback(() => {
    const randomMsg = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
    setBottomMessage(randomMsg);
  }, []);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setDescIndex(0);
    setHoveredAction(null);
    updateMotivation();
  };

  const handleActionClick = (href: string) => {
    updateMotivation();
    router.push(href);
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setDescIndex(0);
    setHoveredAction(null);
    updateMotivation();
  };

  const cycleDescription = () => {
    setDescIndex((prev) => prev + 1);
    updateMotivation();
  };

  // Determine which descriptions to use
  let currentDescriptions: string[] = ["コマンドを　えらんでください。"];
  if (selectedCategory) {
    if (hoveredAction) {
      const catData = MENU_DATA[selectedCategory];
      const item = catData.items.find(i => i.label === hoveredAction);
      if (item) {
        currentDescriptions = item.descriptions;
      }
    } else {
      currentDescriptions = MENU_DATA[selectedCategory].descriptions;
    }
  }

  const activeDescription = currentDescriptions[descIndex % currentDescriptions.length];

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[320px]">
        {/* Tier 1 & 2: Menu Area */}
        <section className="dq-window md:col-span-1 h-fit flex flex-col">
          <div className="flex items-center justify-between border-b border-white/20 pb-2 mb-4">
            <h2 className="text-xl text-yellow-400">
              {selectedCategory ? selectedCategory : "コマンド"}
            </h2>
            {selectedCategory && (
              <button 
                onClick={handleBack}
                className="text-xs text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                [もどる]
              </button>
            )}
          </div>
          
          <nav className="flex flex-col gap-1">
            {!selectedCategory ? (
              Object.keys(MENU_DATA).map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className="dq-menu-item text-xl w-full text-left"
                >
                  {cat}
                </button>
              ))
            ) : (
              MENU_DATA[selectedCategory].items.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleActionClick(item.href)}
                  onMouseEnter={() => {
                    setHoveredAction(item.label);
                    setDescIndex(0);
                  }}
                  onMouseLeave={() => {
                    setHoveredAction(null);
                    setDescIndex(0);
                  }}
                  className="dq-menu-item text-xl w-full text-left"
                >
                  {item.label}
                </button>
              ))
            )}
          </nav>
        </section>

        {/* Description Area */}
        <section 
          className="dq-window md:col-span-2 relative overflow-hidden group cursor-pointer"
          onClick={cycleDescription}
        >
          <div className="absolute top-2 right-4 text-[10px] text-white/20 group-hover:text-white/40">
            Click to cycle
          </div>
          <div className="p-4 md:p-8 h-full flex items-center justify-center">
             <p className="text-xl md:text-2xl leading-relaxed text-center font-normal">
               {activeDescription}
             </p>
          </div>
        </section>
      </div>

      {/* Message Window */}
      <div 
        className="dq-window h-24 flex items-center px-8 border-yellow-400 cursor-pointer"
        onClick={updateMotivation}
      >
        <p className="text-xl text-white">
          <span className="inline-block animate-bounce mr-2">▼</span>
          {bottomMessage}
        </p>
      </div>
    </div>
  );
}
