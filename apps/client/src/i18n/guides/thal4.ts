// 캐릭터 설명: 탈라시아 4 (웨이브·미류) · 한·영·일 (수치는 weaponsWave·itemsWave·weaponsMiryu·itemsMiryu와 맞춤)
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_THAL4: Guide = {
  miryu: [
    "탈라시아 · 미류 · 물의 흐름 그 자체로 싸우는 해룡 수인 검사 · 체력 105 · 공격력 13 · 이동 1.4 · 행운 1",
    "대태도 3연격 (누르고 있으면): ① 물결 가르기 — 앞쪽을 크게 휩쓺 (공격력 95%) ② 역류 베기 — 반대쪽에서 되돌아 휩쓺 (105%) ③ 해룡 일섬 — 앞으로 미끄러지며 길게 그음 (160%) · 대시해도 연격이 이어짐",
    "물길: 벤 자리마다 칼이 지나간 모양 그대로 흐르는 물길이 2.5초 남음 · 닿은 적은 흐르는 쪽으로 실려 가며 0.25초마다 베임 (22%) · 물길이 겹쳐도 한 번만 · 내 물길 위에서는 이동 1.25배",
    "휘는 칼날: 벨 때 칼이 닿지 않는 앞쪽 먼 적 하나를 칼날 물기운이 휘어 따라가 벰 (55%)",
    "흘리기: 벤 직후 잠깐 칼 앞의 적 탄, 대시 중엔 몸 둘레 적 탄을 흘려 물방울로 모음 (6개까지, 가득이면 못 받음) · 해룡 일섬에 모은 물방울이 물칼날로 부채꼴로 되돌아감 (꿰뚫음, 80%)",
    "천류 해방: 벨수록·흘릴수록 해류 게이지가 차고, 가득 차면 다음 베기 대신 거대한 해룡이 나와 새 물길부터 맵 위 모든 물길을 따라 흐르며 닿는 적을 가르고 (180%) 내 둘레를 한 바퀴 돌아 앞으로 폭포로 내리꽂힘 (300% + 기절) · 그때 모든 물길이 한꺼번에 솟구쳐 터짐 (60%)",
    "대태도 10: 청람 · 수월(물길 오래·넓게) · 격류(빠름·물길 자주) · 와류(회오리 베기·둥근 물길) · 명경(물방울 10·쫓는 물칼날) · 유엽(휘는 칼날 셋) · 물마루(긴 일섬) · 빙류(느리게·얼음) · 심연(무겁게·게이지) · 무형(걸어온 길이 물길)",
    "전용 아이템 10: 잔물결 · 물길 타기 · 물줄기 걸음 · 흘려 넘기기 · 회류 · 해룡의 뿔 · 폭포 · 해룡 비늘 · 용의 숨결 · 천류 (공용 아이템도 나옴)",
  ],
  wave: [
    "탈라시아 · 웨이브 · 물을 상상만으로 빚는 서핑 소녀 · 체력 100 · 공격력 11 · 이동 1.45 · 행운 2",
    "누름: 물결 초승달 — 날아가며 커지고 닿는 적을 모두 꿰뚫음 (공격력 80%)",
    "상상력: 초승달을 날릴 때마다 30씩 (가진 기술 하나마다 +2.5) 차고, 100이 되면 가진 물의 기술 가운데 하나가 무작위로 나감 (먹은 순서와 상관없음) · 기술이 없으면 둘레 물보라",
    "물의 기술 30 (전용 아이템 하나 = 기술 하나): 물나비 · 물창 · 물의 갑옷 · 바다의 보석 · 꿈의 고래 · 거품 감옥 · 물시계 · 해파리 등불 · 물거울 · 소나기 구름 · 용오름 · 물연꽃 · 파도 타기 · 물방울 회오리 · 만조",
    "… 물고기 떼 · 물밧줄 · 물풍선 · 진주 구슬 · 물의 손 · 분수 · 물수제비 · 인어의 노래 · 물안개 · 대왕 문어 · 물의 날개 · 심해의 눈 · 밀물 썰물 · 물발자국 · 자유의 해일",
    "무기 6 (상상의 도구): 파도 서핑보드 · 소라 고둥(상상력 1.5배) · 물방울 프리즘(35% 기술 하나 더) · 만조의 왕관(기술 1.35배) · 물결 리본(초승달 셋) · 상상의 물감(다음 기술이 보이고 대시로 바꿈)",
  ],
};

export const GUIDE_EN_THAL4: Guide = {
  miryu: [
    "Thalassia · Miryu · a sea-dragon swordswoman who fights as the flow of water itself · HP 105 · ATK 13 · Move 1.4 · Luck 1",
    "3-cut odachi chain (hold): ① Tide Cleave — a wide frontal sweep (95% ATK) ② Backflow Cut — sweeps back from the other side (105%) ③ Dragon Flash — glides forward in a long line (160%) · dashing keeps the chain going",
    "Currents: every cut leaves a flowing current shaped like the blade's path for 2.5s · foes in it are carried along the flow and cut every 0.25s (22%) · overlapping currents only count once · you move 1.25x faster on your own currents",
    "Bending Edge: on each cut, the blade's water edge bends to chase one distant foe ahead that the blade didn't reach (55%)",
    "Parry: right after a cut, enemy shots in front of the blade — and while dashing, shots around you — are swept into water drops (up to 6; none when full) · the Dragon Flash returns them as a fan of piercing water blades (80%)",
    "Heavenly Current: cutting and parrying fill the Current gauge; when full, your next cut summons a giant sea dragon that flows along every current on the map starting from the newest, splitting foes (180%), circles you once and crashes forward as a waterfall (300% + stun) · then every current erupts at once (60%)",
    "10 odachi: Seiran · Suigetsu (long, wide currents) · Torrent (fast, frequent current cuts) · Vortex (whirl cut, ring current) · Clear Mirror (10 drops, homing blades) · Willow Leaf (3 bending edges) · Wave Crest (long flash) · Ice Stream (slow, ice) · Abyss (heavy, gauge) · Formless (your path becomes a current)",
    "10 exclusive items: Ripples · Current Riding · Stream Step · Flowing Parry · Returning Current · Sea Dragon Horn · Cascade · Sea Dragon Scale · Dragon's Breath · Heavenly Current (common items appear too)",
  ],
  wave: [
    "Thalassia · Wave · a surfer girl who shapes water with pure imagination · HP 100 · ATK 11 · Move 1.45 · Luck 2",
    "Press: Ripple Crescent — grows as it flies and pierces every foe it touches (80% ATK)",
    "Imagination: each crescent adds 30 (+2.5 per owned skill); at 100 a random water skill you own fires (pickup order doesn't matter) · with no skills, a splash around you",
    "30 water skills (one exclusive item = one skill): Water Butterflies · Water Spear · Water Armor · Gem of the Sea · Dream Whale · Bubble Prison · Water Clock · Jellyfish Lanterns · Water Mirror · Shower Cloud · Waterspout · Water Lotus · Surf Ride · Droplet Spiral · High Tide",
    "… School of Fish · Water Rope · Water Balloon · Pearl Ball · Hands of Water · Fountain · Stone Skipping · Mermaid's Song · Sea Mist · Giant Octopus · Wings of Water · Eye of the Deep · Ebb and Flow · Water Footprints · Tsunami of Freedom",
    "6 weapons (tools of imagination): Wave Surfboard · Conch Shell (1.5x imagination) · Droplet Prism (35% bonus skill) · Crown of High Tide (1.35x skills) · Ripple Ribbon (three crescents) · Paint of Imagination (see the next skill, dash to reroll)",
  ],
};

export const GUIDE_JA_THAL4: Guide = {
  miryu: [
    "タラシア · ミリュウ · 水の流れそのもので戦う海竜の獣人剣士 · 体力105 · 攻撃力13 · 移動1.4 · 運1",
    "大太刀3連撃（押し続ける）：① 波裂き — 前方を大きく薙ぐ（攻撃力95%）② 逆流斬り — 反対側から薙ぎ返す（105%）③ 海竜一閃 — 前へ滑りながら長く斬る（160%）· ダッシュしても連撃が続く",
    "水路：斬った跡ごとに刃の軌跡の形のまま流れる水路が2.5秒残る · 触れた敵は流れる方へ運ばれ0.25秒ごとに斬られる（22%）· 水路が重なっても1回だけ · 自分の水路の上では移動1.25倍",
    "しなる刃：斬るとき刃が届かない前方の遠い敵1体を、刃の水気がしなって追い斬る（55%）",
    "受け流し：斬った直後は刃の前の敵弾を、ダッシュ中は体の周りの敵弾を受け流して水滴に集める（6個まで、満タンだと受けられない）· 海竜一閃で集めた水滴が扇形の水刃として返る（貫通、80%）",
    "天流解放：斬るほど・受け流すほど海流ゲージがたまり、満タンで次の斬撃の代わりに巨大な海竜が現れ、新しい水路からマップ上の全ての水路を流れて敵を裂き（180%）、自分の周りを一周して前方へ滝となって叩きつける（300%＋気絶）· その時全ての水路が一斉に噴き上がる（60%）",
    "大太刀10：青嵐 · 水月（長く広い水路）· 激流（速い・水路の頻度）· 渦流（渦斬り・輪の水路）· 明鏡（水滴10・追う水刃）· 柳葉（しなる刃3）· 波頭（長い一閃）· 氷流（鈍足・氷）· 深淵（重い・ゲージ）· 無形（歩いた道が水路）",
    "専用アイテム10：さざ波 · 水路乗り · 水筋の歩み · 受け流し · 回流 · 海竜の角 · 滝 · 海竜の鱗 · 竜の息吹 · 天流（共通アイテムも出る）",
  ],
  wave: [
    "タラシア · ウェーブ · 水を想像だけで形作るサーフィン少女 · 体力100 · 攻撃力11 · 移動1.45 · 運2",
    "押す：さざ波の三日月 — 飛びながら大きくなり、触れた敵をすべて貫く（攻撃力80%）",
    "想像力：三日月を投げるたびに30（持っている技1つごとに+2.5）たまり、100で持っている水の技から一つがランダムに出る（取った順番は関係なし）· 技がなければ周りに水しぶき",
    "水の技30（専用アイテム1つ＝技1つ）：水の蝶 · 水の槍 · 水の鎧 · 海の宝石 · 夢の鯨 · 泡の牢獄 · 水時計 · クラゲの灯 · 水鏡 · にわか雨の雲 · 竜巻 · 水の蓮 · 波乗り · しずくの渦 · 満潮",
    "… 魚の群れ · 水の縄 · 水風船 · 真珠玉 · 水の手 · 噴水 · 水切り · 人魚の歌 · 水霧 · 大王ダコ · 水の翼 · 深海の眼 · 満ち潮引き潮 · 水の足跡 · 自由の津波",
    "武器6（想像の道具）：波のサーフボード · ほら貝（想像力1.5倍）· しずくのプリズム（35%で技がもう一つ）· 満潮の冠（技1.35倍）· さざ波のリボン（三日月3つ）· 想像の絵の具（次の技が見え、ダッシュで変更）",
  ],
};
