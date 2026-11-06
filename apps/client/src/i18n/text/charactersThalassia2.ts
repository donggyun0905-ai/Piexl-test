import type { Lang } from "../index";

// 화면 글자: 탈라시아 캐릭터 2 (웨이브·미류) 이름·설명 (charactersThalassia가 커서 나눔)
export const CHARACTER_TEXT_THALASSIA_2 = {
  wave: { ko: "웨이브", en: "Wave", ja: "ウェーブ" },
  muse: { ko: "상상의 물결과 물의 기술", en: "Imagined Tides & Water Skills", ja: "想像の波と水の技" },
  waveDesc: {
    ko: "탈라시아. 물을 상상만으로 마음대로 빚는 서핑 소녀. 누르면 뚫고 나가며 커지는 물결 초승달 · 날릴 때마다 상상력이 차고, 가득 차면 가진 물의 기술 가운데 하나가 무작위로 나감 · 전용 아이템 30개가 모두 서로 다른 기술 (물나비 · 물창 · 바다의 보석 · 꿈의 고래 · 해파리 등불 · 자유의 해일 …) · 기술을 많이 모을수록 상상력이 빨리 차고 더 다양해짐",
    en: "Thalassia. A surfer girl who shapes water with nothing but imagination. Press to throw a ripple crescent that grows as it pierces · every throw fills her imagination; when full, a random water skill she owns fires · all 30 exclusive items are different skills (water butterflies · water spear · gem of the sea · dream whale · jellyfish lanterns · tsunami of freedom …) · the more skills you gather, the faster imagination fills and the wilder the mix",
    ja: "タラシア。水を想像だけで自由に形作るサーフィン少女。押すと貫きながら大きくなるさざ波の三日月 · 投げるたびに想像力がたまり、満タンで持っている水の技から一つがランダムに出る · 専用アイテム30個はすべて違う技（水の蝶 · 水の槍 · 海の宝石 · 夢の鯨 · クラゲの灯 · 自由の津波 …）· 技を集めるほど想像力が早くたまり、多彩になる",
  },
  bfWaveSet: { ko: "물의 기술 {n}개: 공격력 +{b} · 방어력 +{b}", en: "{n} water skills: ATK +{b} · DEF +{b}", ja: "水の技{n}個：攻撃力+{b} · 防御力+{b}" },
  bfWaveSetTip: { ko: "모은 물의 기술 5개마다 공격력 +5 · 방어력 +5", en: "Every 5 water skills collected: ATK +5 · DEF +5", ja: "集めた水の技5個ごとに攻撃力+5 · 防御力+5" },
  miryu: { ko: "미류", en: "Miryu", ja: "ミリュウ" },
  flowblade: { ko: "물길을 남기는 대태도", en: "Current-Carving Odachi", ja: "水路を刻む大太刀" },
  miryuDesc: {
    ko: "탈라시아. 물의 흐름 그 자체로 싸우는 해룡 수인 검사. 누르고 있으면 대태도 3연격: 물결 가르기 → 역류 베기(반대쪽에서 휩쓺) → 해룡 일섬(앞으로 미끄러지며 길게) · 벤 자리마다 흐르는 물길이 남아 적을 실어 나르며 베고, 내 물길 위에서는 빨라짐 · 칼이 닿지 않는 먼 적은 칼날 물기운이 휘어 따라가 벰 · 벤 직후와 대시 중엔 적 탄을 흘려 물방울로 모았다가 일섬에 물칼날로 되돌림 · 해류 게이지가 차면 '천류 해방': 거대한 해룡이 맵 위 모든 물길을 따라 흐르다 폭포로 내리꽂힘",
    en: "Thalassia. A sea-dragon swordswoman who fights as the flow of water itself. Hold for a 3-cut odachi chain: Tide Cleave → Backflow Cut (sweeps back from the other side) → Dragon Flash (glides forward in a long line) · every cut leaves a flowing current that carries foes along and cuts them, and you move faster on your own currents · foes beyond the blade are chased by its bending water edge · right after a cut and while dashing, enemy shots are parried into water drops, returned as water blades by the Dragon Flash · a full Current gauge unleashes Heavenly Current: a giant sea dragon flows along every current on the map and crashes down as a waterfall",
    ja: "タラシア。水の流れそのもので戦う海竜の獣人剣士。押し続けると大太刀の3連撃：波裂き → 逆流斬り（反対側から薙ぐ）→ 海竜一閃（前へ滑りながら長く）· 斬った跡ごとに流れる水路が残り敵を運びながら斬る。自分の水路の上では速くなる · 刃が届かない遠くの敵は刃の水気がしなって追い斬る · 斬った直後とダッシュ中は敵の弾を受け流して水滴に集め、一閃で水刃として返す · 海流ゲージが満ちると「天流解放」：巨大な海竜がマップ上の全ての水路を流れ、滝となって叩きつける",
  },
} satisfies Record<string, Record<Lang, string>>;
