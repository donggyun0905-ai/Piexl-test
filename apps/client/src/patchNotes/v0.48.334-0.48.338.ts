import type { PatchNote } from "./types";

export const NOTES: PatchNote[] = [
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
];
