import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.49.50",
    date: "2026-11-06",
    items: {
      ko: [
        "웨이브 상상력은 이제 물결 초승달이 적을 맞혀야 참 (헛스윙으로는 안 참, 뚫고 더 맞힌 적은 조금씩)",
        "웨이브 전용 아이템 30개에 작은 능력치를 더함 (공격력 +1 · 체력 +8 · 공격 속도 +0.04 · 이동 +0.05 · 행운 +1 중 하나, 물의 갑옷은 체력 +10)",
        "물의 여신 → 바다의 보석: 그 자리에 떠 있는 육각 물의 보석이 서서 적이 몰린 곳에 물빛 줄기를 쏘아 물기둥을 일으킴",
        "물거울: 내 캐릭터 모습을 그대로 복사한 반투명한 물빛 분신 · 물의 날개: 위로 휘어 오른 큰 날개와 깃털 물결·흐르는 빛·떨어지는 물방울로 새로 그림",
        "웨이브 이펙트 전체 다듬기: 회색 원·막대 물보라 대신 원근 물결 고리와 포물선으로 튀는 물보라 · 맑은 물기둥 · 물빛 일렁임 · 물안개 · 만조 · 물시계 · 밀물 썰물 · 문어 다리 · 나비 크게",
      ],
      en: [
        "Wave's imagination now fills only when a ripple crescent actually hits a foe (whiffs don't count; extra pierced foes add a little)",
        "All 30 Wave exclusive items now also give a small stat (one of ATK +1 · HP +8 · attack speed +0.04 · move +0.05 · luck +1; Water Armor gives HP +10)",
        "Water Goddess → Gem of the Sea: a floating hexagonal gem of water stands in place and fires beams of light where foes gather to raise geysers",
        "Water Mirror: a translucent watery copy of your own character · Wings of Water redrawn as great sweeping wings with feathered edges, flowing light and dripping drops",
        "Polished all Wave effects: perspective ripple rings and arcing splashes instead of gray circles and stick splashes · clear geysers · shimmering water light · sea mist · high tide · water clock · ebb and flow · octopus arms · bigger butterflies",
      ],
      ja: [
        "ウェーブの想像力は、さざ波の三日月が敵に当たったときだけたまるように（空振りではたまらない、貫いた敵は少しずつ）",
        "ウェーブ専用アイテム30個に小さな能力値を追加（攻撃力+1 · 体力+8 · 攻撃速度+0.04 · 移動+0.05 · 運+1のどれか、水の鎧は体力+10）",
        "水の女神 → 海の宝石：その場に浮かぶ六角の水の宝石が立ち、敵が集まる所へ光を放って水柱を起こす",
        "水鏡：自分のキャラの姿をそのまま写した半透明の水の分身 · 水の翼：大きく反り上がる翼と羽の波・流れる光・滴る水で描き直し",
        "ウェーブのエフェクト全体を磨き直し：灰色の円や棒の水しぶきの代わりに遠近の波紋と放物線の水しぶき · 澄んだ水柱 · 水の光のゆらめき · 水霧 · 満潮 · 水時計 · 満ち潮引き潮 · タコの足 · 蝶を大きく",
      ],
    },
  },
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
