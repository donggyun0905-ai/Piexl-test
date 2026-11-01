import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.332",
    date: "2026-11-01",
    items: {
      ko: ["캐릭터 크기를 모두 파수꾼과 같게: 빛의 사도(모든 단계) · 차원의 순례자 · 거인 · 오니 · 묵인 (거인·오니·묵인 스킨 포함) · 큰 변신 모습(각성 오니·피의 학살·호랑이·각성 동물·왕관의 왕)은 그대로"],
      en: ["All characters now match the Warden's size: Apostle of Light (every stage) · Dimensional Pilgrim · Titan · Oni · Mukin (including their skins) · big transformations (awakened Oni, Blood Slaughter, tiger, awakened animals, Crowned King) stay big"],
      ja: ["キャラの大きさを全員番人と同じに: 光の使徒（全段階）· 次元の巡礼者 · 巨人 · 鬼 · 黙忍（巨人・鬼・黙忍のスキンも）· 大きな変身（覚醒鬼・血の虐殺・虎・覚醒動物・王冠の王）はそのまま"],
    },
  },
  {
    version: "0.48.331",
    date: "2026-11-01",
    items: {
      ko: ["오리 새끼 오리 새 그림 (예전과 비슷한 작은 크기, 오리 뒤에 그려짐): 걷는 쪽(앞·뒤·왼·오)을 보고, 가만히 있으면 앞을 봄 · 같이 꽥 할 때 꽥 그림"],
      en: ["New duckling art (small as before, drawn behind the duck): they face the way they walk (front, back, left, right) and face forward when idle · quack pose when they quack along"],
      ja: ["子アヒルの新しい絵（以前と同じくらい小さく、アヒルの後ろに描く）: 歩く方向（前・後・左・右）を向き、止まると前を向く · 一緒に鳴く時は鳴く絵"],
    },
  },
  {
    version: "0.48.330",
    date: "2026-11-01",
    items: {
      ko: ["새 그림: 별지기 · 서기관 · 오리 · 차원의 순례자 · 몰락한 왕 · 왕관의 왕(변신) · 빛의 사도 기본·2·3·4단계 (서기·걷기·공격·맞음·쓰러짐·대시) → 모든 캐릭터 기본 모습 새 그림 완료"],
      en: ["New art: Stargazer · Scribe · Duck · Dimensional Pilgrim · Fallen King · Crowned King (transform) · Apostle of Light base and stages 2-4 (idle, walk, attack, hit, down, dash) → every character's base look is now redrawn"],
      ja: ["新しい絵: 星読み · 書記官 · アヒル· 次元の巡礼者 · 堕ちた王 · 王冠の王（変身）· 光の使徒 基本・2・3・4段階（待機・歩き・攻撃・被弾・ダウン・ダッシュ）→ 全キャラの基本の姿が新しい絵に"],
    },
  },
  {
    version: "0.48.329",
    date: "2026-11-01",
    items: {
      ko: ["히든 상점(차원의 순례자)이 1층에는 나오지 않음 (돈이 없어 살 수 없던 것) · 2층부터 층마다 8%"],
      en: ["The hidden shop (Dimensional Pilgrim) no longer appears on floor 1 (you couldn't afford anything) · 8% per floor from floor 2"],
      ja: ["隠しショップ（次元の巡礼者）が1階には出なくなった（お金がなく買えなかった）· 2階から各階8%"],
    },
  },
  {
    version: "0.48.328",
    date: "2026-11-01",
    items: {
      ko: [
        "단련의 방: 캐릭터에게 효과가 없는 능력치는 막음 (흐리게 '효과 없음') — 거너·잔영 최대 체력(고정) · 잔영·버려진 자들·베두인 공격 속도 · 기계공학자·의사 치명타 확률·피해 · 저주받은 주사위로 체력이 고정되면 최대 체력",
        "오니는 공격력·공격 속도·사거리·무기 숙련 줄에 '최대 체력·재생력·효과 범위로 바뀌어 오름' 안내",
      ],
      en: [
        "Training Room: stats with no effect on your character are locked (greyed 'no effect') — Gunner/Remnant max HP (fixed) · Remnant/Abandoned/Bedouin attack speed · Engineer/Doctor crit chance & damage · max HP when fixed by the Cursed Die",
        "Oni's damage, attack speed, range and weapon mastery rows now note they convert into max HP, regen and effect area",
      ],
      ja: [
        "鍛錬の部屋: キャラに効果のない能力値は封印（薄く「効果なし」）— ガンナー・残影の最大体力（固定）· 残影・捨てられた者たち・ベドウィンの攻撃速度 · 機械工学者・医者のクリティカル率・ダメージ · 呪われたサイコロで体力が固定された時の最大体力",
        "鬼は攻撃力・攻撃速度・射程・武器熟練の行に「最大体力・再生力・効果範囲に変わって上がる」案内",
      ],
    },
  },
  {
    version: "0.48.327",
    date: "2026-11-01",
    items: {
      ko: ["원소술사 웨폰 마스터: 검이 불→물→번개→땅→풀 차례로 늘어남 (천지창조로 6번째부터 다시 불부터) · 날아가는 원소(불·물·번개)면 날아다니는 검이, 땅·풀이면 몸 둘레 검이 하나 늘어남 (전에는 늘어난 검이 모두 몸 둘레만 돌았음)"],
      en: ["Elementalist Blade Lord: blades now grow in order fire → water → thunder → earth → grass (Genesis adds from fire again at the 6th) · flying elements (fire, water, thunder) add a flying blade, earth and grass add a guarding blade (extra blades used to only circle the body)"],
      ja: ["元素術師ウェポンマスター: 剣が火→水→雷→土→草の順に増える（天地創造で6本目からまた火から）· 飛ぶ元素（火・水・雷）なら飛び回る剣、土・草なら体の周りの剣が1本増える（以前は増えた剣が全部体の周りを回るだけだった）"],
    },
  },
  {
    version: "0.48.326",
    date: "2026-11-01",
    items: {
      ko: [
        "단련의 방 패시브 강화: '능력치 몫 +50%' 대신 오르는 능력치마다 단계당 값과 지금 오른 값을 자세히 보여 줌 (예: 최대 체력 · 단계당 +20 · 지금 +60)",
        "단련의 방 패시브 강화가 깎는 몫(무거운 갑옷 이동 속도 − 등)까지 키우던 것 고침 → 좋은 몫만 커짐 · 좋은 몫이 없는 패시브는 공격력이 오름",
      ],
      en: [
        "Training Room passive upgrades: instead of 'stat bonus +50%', each boosted stat now shows its per-level and current amount (e.g. Max HP · per level +20 · now +60)",
        "Fixed Training Room passive upgrades also growing penalties (e.g. Heavy Plate's − move speed) → only the good parts grow · passives with no good stat raise damage",
      ],
      ja: [
        "鍛錬の部屋のパッシブ強化: 「能力値分+50%」の代わりに、上がる能力値ごとに1段階の値と現在の上昇値を詳しく表示（例: 最大体力 · 1段階+20 · 現在+60）",
        "鍛錬の部屋のパッシブ強化がマイナス分（重い鎧の移動速度−など）まで大きくしていたのを修正 → 良い分だけ増える · 良い分のないパッシブは攻撃力が上がる",
      ],
    },
  },
];
