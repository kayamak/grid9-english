'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const MOTIVATIONAL_MESSAGES = [
  "きみなら　できる！",
  "あきらめたら　そこで　しあいしゅうりょうだよ",
  "いっぽずつの　つみかさねが　おおきな　ちからに　なる！",
  "でんせつの　ゆうしゃは　きみのことだ！",
  "えいごの　れんしゅうを　マスターしよう！",
  "こんかいの　べんきょうは　きっと　やくにたつぞ！",
  "つづけることが　さいだいの　ぶきだ！",
  "ちりもつもれば　やまとなる！",
  "きみの　なまえを　れきしに　きざめ！",
  "こころの　エンジンを　ぜんかいにしろ！",
  "まいにちの　どりょくが　あしたを　かえる！",
  "きみの　なかに　ねむる　さいのうを　よびおこせ！"
];

const OPERATION_MESSAGES = [
  "マウスで　コマンドを　えらび　クリックして　けっていしよう！",
  "スマホの　ときは　がめんを　ちょくせつ　タップするのだぞ。",
  "「もどる」ボタンを　おすと　まえの　メニューに　もどれるぞ。",
  "この　ウィンドウを　クリックすると　べつの　メッセージが　きけるぞ。",
  "さあ　コマンドを　えらんで　ぼうけんを　はじめよう！"
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
      "きびしい　しれんに　いどみ、おのれの　スキルを　みがきあげろ！",
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
  "れんしゅう": {
    descriptions: [
      "ぶんぽうというなの　れんしゅうまほうを　じざいに　つかいこなせ！",
      "ことばの　ならびを　あやつるものは、せかいを　あやつる。",
      "ただしい　えいごは、ひとの　こころを　うごかす　まほうだ。"
    ],
    items: [
      { 
        label: "しゅご ＋ Doどうし", 
        href: "/practice?mode=drill&pattern=DO_SV", 
        descriptions: [
          "いっぱんどうしの　きほんけい。しゅごと　どうしの　きずなを　たしかめろ！",
          "だれが　なにを　するのか。すべての　きほんは　ここにある。"
        ]
      },
      { 
        label: "しゅご ＋ Doどうし ＋ もくてきご", 
        href: "/practice?mode=drill&pattern=DO_SVO", 
        descriptions: [
          "なにかを　たいしょうにする　うごき。もくてきを　とらえる　いちげきを！",
          "「なにを」を　はっきりさせる。それが　SVOの　ごくいだ。"
        ]
      },
      { 
        label: "しゅご ＋ Beどうし ＋ ほご", 
        href: "/practice?mode=drill&pattern=BE_SVC", 
        descriptions: [
          "じょうたいを　しめす　れんしゅう。ありのままの　すがたを　ひょうげんせよ！",
          "イコールのかんけい。きみの　じょうたいを　ことばに　のせろ。"
        ]
      }
    ]
  },
  "せつめい": {
    descriptions: [
      "さまざまな　せつめいが　えられる　じゆうトレーニングだ！",
      "ときには　じゆうに、ときには　しんけんに。せつめいの　つかいかたは　きみしだい。",
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
  const [descMessage, setDescMessage] = useState<string>("コマンドを　えらんでください。");
  const [bottomMessage, setBottomMessage] = useState<string>("ぼうけんの　じゅんびは　いいかな？");
  const [opIndex, setOpIndex] = useState(0);
  const router = useRouter();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showClearLevelMenu, setShowClearLevelMenu] = useState(false);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/(^| )playerLevel=([^;]+)/);
      if (match) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
         setCurrentLevel(parseInt(match[2]));
      }
    }
  }, []);

  const updateMotivation = useCallback(() => {
    const randomMsg = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
    setBottomMessage(randomMsg);
  }, []);

  const updateOperation = useCallback(() => {
    const msg = OPERATION_MESSAGES[opIndex % OPERATION_MESSAGES.length];
    setOpIndex(prev => prev + 1);
    return msg;
  }, [opIndex]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setDescMessage(MENU_DATA[category].descriptions[0]);
    updateMotivation();
  };

  const handleActionClick = (href: string) => {
    updateMotivation();
    router.push(href);
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setDescMessage("コマンドを　えらんでください。");
    updateMotivation();
  };

  const handleDescClick = () => {
    setDescMessage(updateOperation());
  };

  const handleBottomClick = () => {
    setBottomMessage(updateOperation());
  };

  const handleActionHover = (label: string | null) => {
    if (label && selectedCategory) {
      const item = MENU_DATA[selectedCategory].items.find(i => i.label === label);
      if (item) setDescMessage(item.descriptions[0]);
    } else if (selectedCategory) {
      setDescMessage(MENU_DATA[selectedCategory].descriptions[0]);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[320px]">
        {/* Tier 1: Level & Menu Area */}
        <div className="md:col-span-1 flex flex-col gap-4">
          {/* Level Display */}
          <section className="dq-window p-4 flex flex-col items-center justify-center border-yellow-400/50 bg-black/40">
            <span className="text-sm text-white/60 mb-1">現在のレベル</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl text-yellow-400">Lv.</span>
              <span className="text-5xl font-bold text-yellow-400 shadow-yellow-400/20 drop-shadow-lg">{currentLevel}</span>
            </div>
          </section>

          {/* Menu Area */}
          <section className="dq-window h-full flex flex-col flex-1">
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
                <>
                  {Object.keys(MENU_DATA).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className="dq-menu-item text-xl w-full text-left"
                    >
                      {cat}
                    </button>
                  ))}
                  <button
                    onClick={() => setShowClearLevelMenu(true)}
                    onMouseEnter={() => setDescMessage("レベルを　しょきか　したり　できるぞ。")}
                    className="dq-menu-item text-xl w-full text-left mt-2 border-t border-white/20 pt-2"
                  >
                    にげる
                  </button>
                </>
              ) : (
                MENU_DATA[selectedCategory].items.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleActionClick(item.href)}
                    onMouseEnter={() => handleActionHover(item.label)}
                    onMouseLeave={() => handleActionHover(null)}
                    className="dq-menu-item text-xl w-full text-left"
                  >
                    {item.label}
                  </button>
                ))
              )}
            </nav>
          </section>
        </div>

        {/* Description Area */}
        <section 
          className="dq-window md:col-span-2 relative overflow-hidden group cursor-pointer"
          onClick={handleDescClick}
        >
          <div className="absolute top-2 right-4 text-[10px] text-white/20 group-hover:text-white/40">
            Click for Help
          </div>
          <div className="p-4 md:p-8 h-full flex items-center justify-center">
             <p className="text-xl md:text-2xl leading-relaxed text-center font-normal">
               {descMessage}
             </p>
          </div>
        </section>
      </div>

      {/* Message Window */}
      <div 
        className="dq-window h-24 flex items-center px-8 border-yellow-400 cursor-pointer"
        onClick={handleBottomClick}
      >
        <p className="text-xl text-white">
          <span className="inline-block animate-bounce mr-2">▼</span>
          {bottomMessage}
        </p>
      </div>

      {/* Level Clear Menu Modal */}
      {showClearLevelMenu && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
           <div className="dq-window p-8 flex flex-col items-center gap-6 min-w-[300px] animate-in zoom-in duration-200">
              <h2 className="text-2xl text-white font-bold mb-2">メニュー</h2>
              
              <button 
                onClick={() => {
                   document.cookie = "playerLevel=1; path=/; max-age=31536000";
                   setCurrentLevel(1);
                   setShowClearLevelMenu(false);
                   setBottomMessage("レベルを　しょきか　しました。");
                }}
                className="dq-button w-full py-3 text-lg border-red-500 text-red-400 hover:text-red-300 hover:bg-red-900/20"
              >
                 レベルクリア
              </button>

              <button 
                onClick={() => setShowClearLevelMenu(false)}
                className="dq-button w-full py-2 bg-gray-800 text-white/50 border-gray-600"
              >
                 とじる
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
