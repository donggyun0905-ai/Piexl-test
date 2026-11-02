import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.339",
    date: "2026-11-02",
    items: {
      ko: [
        "단련의 방 효과 강화 점검: 333개 패시브 모두 효과 수치가 실제로 오르는 것 확인 · 1.4배 같은 배율은 1을 넘는 몫만 키움 (10단계 1.4배 → 1.8배) · 소환술사 유대의 방패가 거꾸로 약해지던 것 고침",
        "단련한 효과가 화면(폭발·범위 원 등)과 능력치 창에도 오른 크기로 보임",
      ],
      en: [
        "Training Room effect check: all 333 passives verified to actually improve · multipliers like ×1.4 now grow only the part above 1 (×1.4 → ×1.8 at level 10) · fixed Summoner's Bond Shield getting weaker instead of stronger",
        "Upgraded effects now also show at their boosted size on screen (blast and area rings, etc.) and in the stats panel",
      ],
      ja: [
        "鍛錬の部屋の効果強化を点検: 333個のパッシブ全部で効果の数値が実際に上がるのを確認 · ×1.4のような倍率は1を超える分だけ伸びる（10段階で×1.4 → ×1.8）· 召喚術師の絆の盾が逆に弱くなっていたのを修正",
        "鍛錬した効果が画面（爆発・範囲の輪など）と能力値画面でも上がった大きさで見える",
      ],
    },
  },
  {
    version: "0.48.338",
    date: "2026-11-02",
    items: {
      ko: [
        "단련의 방 효과 패시브: 공격력 대신 그 패시브의 효과 수치가 단계마다 10%씩 좋아짐 — 범위·피해·확률·회복·개수는 커지고, 재사용 대기·간격·지연·비용·받는 피해는 작아짐 (지속 시간·최대치·조건 수치는 그대로)",
        "단련 창에 효과 수치마다 '원래 → 지금 · 단계당 %'를 보여 줌 · 올릴 효과 수치가 없는 패시브는 단련 목록에 나오지 않음",
      ],
      en: [
        "Training Room effect passives: instead of damage, the passive's own effect numbers improve 10% per level — range, damage, chance, healing and counts go up; cooldown, interval, delay, cost and damage taken go down (durations, caps and conditions stay)",
        "The training window shows each effect number as 'base → now · per level %' · passives with nothing to improve no longer appear in the list",
      ],
      ja: [
        "鍛錬の部屋の効果パッシブ: 攻撃力の代わりにそのパッシブの効果の数値が1段階ごとに10%良くなる — 範囲・ダメージ・確率・回復・数は大きく、クールタイム・間隔・遅延・コスト・被ダメージは小さく（持続・上限・条件の数値はそのまま）",
        "鍛錬の画面に効果の数値ごとに「元 → 現在 · 1段階%」を表示 · 上げられる数値がないパッシブは鍛錬リストに出ない",
      ],
    },
  },
  {
    version: "0.48.337",
    date: "2026-11-02",
    items: {
      ko: ["맞지 않는 상태의 적(검은 잔영처럼 지켜보기만 하는 보스, 땅속·하늘에 있는 보스 등)을 캐릭터 공격이 노리던 것 고침: 격투가·원소술사 검·야수·악의 사도·기계공학자 연쇄·오니·오리 새끼·거너 드론·유도 탄·동료·고양이 펫 등이 맞을 수 있는 적만 노림"],
      en: ["Fixed attacks targeting enemies that can't be hit (like the watching Black Remnant, or bosses underground or in the sky): Brawler, Elementalist blades, Beast, Apostle, Engineer chains, Oni, ducklings, Gunner drones, homing shots, allies and cat pets now only aim at hittable enemies"],
      ja: ["当たらない状態の敵（見ているだけの黒い残影、地中・空中のボスなど）をキャラの攻撃が狙っていたのを修正: 格闘家・元素術師の剣・野獣・悪の使徒・機械工学者の連鎖・鬼・子アヒル・ガンナーのドローン・誘導弾・仲間・猫ペットなどが当たる敵だけを狙う"],
    },
  },
  {
    version: "0.48.336",
    date: "2026-11-02",
    items: {
      ko: ["멸망의 용 때릴 곳 표시를 더 옅게 (그림을 덜 가림)"],
      en: ["Dragon of Ruin hit marker made fainter (covers the art less)"],
      ja: ["滅びの竜の狙う場所の表示をより薄く（絵を隠しにくく）"],
    },
  },
  {
    version: "0.48.335",
    date: "2026-11-01",
    items: {
      ko: ["멸망의 용: 맞는 범위(몸통)에 은은한 주황 빛 원과 점선 표시 — 날개·꼬리는 맞지 않으니 표시된 곳을 때리면 됨"],
      en: ["Dragon of Ruin: a soft orange glow and dashed ring now mark its hitbox (torso) — wings and tail can't be hit, so aim inside the ring"],
      ja: ["滅びの竜: 当たり判定（胴体）にほのかなオレンジの光と点線の輪 — 翼・尾には当たらないので輪の中を狙えばいい"],
    },
  },
  {
    version: "0.48.334",
    date: "2026-11-01",
    items: {
      ko: ["라스트 보스 멸망의 용 새 그림 (시험): 위에서 본 모습 → 옆모습 · 걷기 2 · 숨 들이켜기 · 불길 · 몸통이 맞는 범위 가운데에"],
      en: ["New Dragon of Ruin art (trial): top-down → side view · two walk frames · inhaling · fire breath · torso centered on its hitbox"],
      ja: ["ラストボス滅びの竜の新しい絵（試験）: 上から見た姿 → 横向き · 歩き2 · 息を吸う · 炎 · 胴体が当たり判定の中央に"],
    },
  },
  {
    version: "0.48.333",
    date: "2026-11-01",
    items: {
      ko: ["보스 무리 여왕 새 그림 (시험): 걷기 2 · 마력 구슬 모으기 · 마탄 쏘기"],
      en: ["New Brood Queen boss art (trial): two walk frames · gathering an orb · firing"],
      ja: ["ボス群れの女王の新しい絵（試験）: 歩き2 · 魔力の玉を溜める · 魔弾を撃つ"],
    },
  },
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
