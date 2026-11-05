import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.49.49",
    date: "2026-11-06",
    items: {
      ko: [
        "탈라시아 새 캐릭터 웨이브: 물을 상상만으로 마음대로 빚는 서핑 소녀 (체력 100 · 공격력 11 · 이동 1.45, 여는 조건: 이동 속도 1.9 달성)",
        "누르면 날아가며 커지고 모두 꿰뚫는 물결 초승달 · 날릴 때마다 상상력이 차고, 가득 차면 가진 물의 기술 가운데 하나가 무작위로 나감 (기술이 많을수록 빨리 참)",
        "전용 아이템 30개가 모두 서로 다른 기술: 물나비 · 물창 · 물의 갑옷 · 물의 여신 · 꿈의 고래 · 거품 감옥 · 물시계 · 해파리 등불 · 물거울 · 소나기 구름 · 용오름 · 물연꽃 · 파도 타기 · 물방울 회오리 · 만조",
        "… 물고기 떼 · 물밧줄 · 물풍선 · 진주 구슬 · 물의 손 · 분수 · 물수제비 · 인어의 노래 · 물안개 · 대왕 문어 · 물의 날개 · 심해의 눈 · 밀물 썰물 · 물발자국 · 자유의 해일",
        "상상의 도구 6 (서핑보드 · 소라 고둥 · 물방울 프리즘 · 만조의 왕관 · 물결 리본 · 상상의 물감) · 기술마다 새 물 이펙트 · 효과음 · 그림 시트 · 패왕전 스킬",
      ],
      en: [
        "New Thalassia character Wave: a surfer girl who shapes water with nothing but imagination (HP 100 · ATK 11 · Move 1.45, unlock: reach 1.9 move speed)",
        "Press to throw a ripple crescent that grows and pierces everything · each throw fills her imagination; when full, a random water skill she owns fires (more skills, faster fill)",
        "All 30 exclusive items are different skills: Water Butterflies · Water Spear · Water Armor · Water Goddess · Dream Whale · Bubble Prison · Water Clock · Jellyfish Lanterns · Water Mirror · Shower Cloud · Waterspout · Water Lotus · Surf Ride · Droplet Spiral · High Tide",
        "… School of Fish · Water Rope · Water Balloon · Pearl Ball · Hands of Water · Fountain · Stone Skipping · Mermaid's Song · Sea Mist · Giant Octopus · Wings of Water · Eye of the Deep · Ebb and Flow · Water Footprints · Tsunami of Freedom",
        "6 tools of imagination (Surfboard · Conch Shell · Droplet Prism · Crown of High Tide · Ripple Ribbon · Paint of Imagination) · new water effects for every skill · sounds · sprite sheet · Champion Clash skills",
      ],
      ja: [
        "タラシアの新キャラ ウェーブ：水を想像だけで自由に形作るサーフィン少女（体力100 · 攻撃力11 · 移動1.45、解放条件：移動速度1.9達成）",
        "押すと大きくなりながらすべてを貫くさざ波の三日月 · 投げるたびに想像力がたまり、満タンで持っている水の技から一つがランダムに出る（技が多いほど早くたまる）",
        "専用アイテム30個はすべて違う技：水の蝶 · 水の槍 · 水の鎧 · 水の女神 · 夢の鯨 · 泡の牢獄 · 水時計 · クラゲの灯 · 水鏡 · にわか雨の雲 · 竜巻 · 水の蓮 · 波乗り · しずくの渦 · 満潮",
        "… 魚の群れ · 水の縄 · 水風船 · 真珠玉 · 水の手 · 噴水 · 水切り · 人魚の歌 · 水霧 · 大王ダコ · 水の翼 · 深海の眼 · 満ち潮引き潮 · 水の足跡 · 自由の津波",
        "想像の道具6（サーフボード · ほら貝 · しずくのプリズム · 満潮の冠 · さざ波のリボン · 想像の絵の具）· 技ごとの新しい水エフェクト · 効果音 · スプライトシート · 覇王戦スキル",
      ],
    },
  },
];
