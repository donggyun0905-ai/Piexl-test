import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.49.0",
    date: "2026-11-04",
    items: {
      ko: ["빌드 업데이트 묶음 (0.48.378~0.48.383): 패시브 꼬리표 15종 · 세트 효과 2·4·6개 · 각성 증강 8개 · 보상 편향 · 성좌 증강 꼬리표 · 대장간 — 이제부터 큰 기능 묶음마다 가운데 숫자가 올라감"],
      en: ["Build update bundle (0.48.378–0.48.383): 15 passive tags · 2/4/6 set bonuses · 8-tag awakenings · reward bias · constellation augment tags · the Forge — from now on the middle number goes up with each major feature bundle"],
      ja: ["ビルドアップデートまとめ（0.48.378〜0.48.383）：パッシブタグ15種・セット効果2・4・6個・覚醒増強8個・報酬の偏り・星座増強タグ・鍛冶場 — 今後は大きな機能のまとまりごとに真ん中の数字が上がります"],
    },
  },
  {
    version: "0.48.383",
    date: "2026-11-04",
    items: {
      ko: ["대장간: 새로 그린 드워프 대장장이가 모루에서 망치질 (들기 → 내려치기 → 불똥)"],
      en: ["Forge: a newly drawn dwarf blacksmith hammers at the anvil (raise → strike → sparks)"],
      ja: ["鍛冶場：新しく描いたドワーフの鍛冶屋が金床でハンマーを振るう（振り上げ → 打ち下ろし → 火花）"],
    },
  },
  {
    version: "0.48.382",
    date: "2026-11-04",
    items: {
      ko: [
        "새 특별한 방 '대장간': 2층부터 층마다 60%로 나옴 · 불타는 화덕과 연장이 걸린 방, 가운데 모루 옆 대장장이 앞에서 F",
        "무기 강화: +0→+1은 100%, 단계마다 10%씩 낮아져 최저 20% · 실패하면 한 단계 떨어짐 · 단계마다 무기 피해 +8% (최대 +10)",
        "꼬리표 변환: 무기·패시브 하나를 원하는 꼬리표로 (대장간마다 처음 1번 무료, 그다음은 점점 비쌈) · 무기에 붙인 꼬리표도 세트에 들어감",
        "암흑 강화: 50% · 성공하면 무기 피해 +16% · 실패하면 무기가 부서져 처음 무기로",
        "강화·꼬리표는 그 무기에만 남음 · 장비 줄 무기 이름 옆에 노란 별(강화)·보라 별(암흑 강화) 표시",
      ],
      en: [
        "New special room 'Forge': 60% per floor from floor 2 · a room with a blazing hearth and hanging tools — press F at the blacksmith beside the anvil",
        "Weapon upgrade: +0→+1 is 100%, 10% lower each level down to 20% · failure drops a level · +8% weapon damage per level (max +10)",
        "Tag reforge: set a weapon or passive to any tag (first one free at each forge, then pricier) · weapon tags count toward sets too",
        "Dark upgrade: 50% · success gives +16% weapon damage · failure shatters the weapon and you get your starting weapon",
        "Upgrades and tags stay on that weapon · yellow star (upgrade) and purple star (dark) next to the weapon name",
      ],
      ja: [
        "新しい特別な部屋「鍛冶場」：2階から各階60%で出現・燃える炉と道具が掛かった部屋、中央の金床のそばの鍛冶屋の前でF",
        "武器強化：+0→+1は100%、段階ごとに10%下がり最低20%・失敗すると1段階下がる・段階ごとに武器ダメージ+8%（最大+10）",
        "タグ変換：武器・パッシブ1つを好きなタグに（鍛冶場ごとに最初の1回無料、その後は高くなる）・武器に付けたタグもセットに入る",
        "暗黒強化：50%・成功で武器ダメージ+16%・失敗すると武器が壊れ最初の武器に",
        "強化・タグはその武器にだけ残る・装備欄の武器名の横に黄色い星（強化）・紫の星（暗黒強化）",
      ],
    },
  },
  {
    version: "0.48.381",
    date: "2026-11-04",
    items: {
      ko: [
        "각성 증강: 같은 꼬리표를 8개 모으면 그 꼬리표의 각성 기술이 저절로 나감 (15종) — 얼음 서리바람(둥근 범위에 얼음 결정이 눈처럼 내림) · 불 유성우 · 번개 뇌신의 사슬 · 독 역병 꽃 · 빛 성광 · 어둠 심연 · 죽음 사신의 낫 · 대지 지각 분쇄 · 물 해일 · 날카로움 천검 · 단단함 강철 요새 · 바람 대회오리 · 행운 황금 소나기 · 소환 정령 군단 · 피 핏빛 달",
        "빌드 세트 칸: 8개를 모으면 ✦ 표시와 '각성!' 알림 · 마우스를 올리면 각성 기술 설명",
        "끝없는 시련: 사용 아이템을 못 쓰는 동안 아이템 칸에 빨간 ✕",
        "수집가: 공격 이펙트가 거꾸로 재생되던 것을 고침 (피의 활 화살이 활에서 뻗어 나감)",
      ],
      en: [
        "Awakening: collect 8 of the same tag and that tag's awakening skill fires on its own (15 kinds) — Ice Frost Gale (ice crystals fall like snow in a circle) · Fire Meteor Rain · Lightning Thunder Chain · Poison Plague Bloom · Light Holy Radiance · Dark Abyss · Death Reaper's Scythe · Earth Crust Breaker · Water Tidal Wave · Sharp Thousand Blades · Sturdy Steel Bastion · Wind Great Cyclone · Luck Golden Shower · Summon Spirit Legion · Blood Blood Moon",
        "Build sets: 8 of a tag shows ✦ and an 'awakened!' banner · hover for the awakening skill",
        "Endless trial: a red ✕ on the item slots while use items are blocked",
        "Collector: attack effects no longer play backwards (Blood Bow arrows now shoot out from the bow)",
      ],
      ja: [
        "覚醒増強：同じタグを8個集めるとそのタグの覚醒技が自動で発動（15種）— 氷 霜風（丸い範囲に氷の結晶が雪のように降る）・火 流星雨・雷 雷神の鎖・毒 疫病の花・光 聖光・闇 深淵・死 死神の鎌・大地 地殻粉砕・水 津波・鋭さ 千剣・頑丈 鋼鉄の要塞・風 大竜巻・幸運 黄金の雨・召喚 精霊の軍団・血 血の月",
        "ビルドセット欄：8個集めると✦表示と「覚醒！」通知・カーソルを合わせると覚醒技の説明",
        "終わりなき試練：使用アイテムが使えない間はアイテム欄に赤い✕",
        "収集家：攻撃エフェクトが逆再生されていたのを修正（血の弓の矢が弓から伸びる）",
      ],
    },
  },
];
