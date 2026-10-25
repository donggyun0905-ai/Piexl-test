import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.48.110",
    date: "2026-10-26",
    items: {
      ko: [
        "광야의 새벽 각성 기술이 6가지에서 16가지로: 새로 검기 폭풍(꿰뚫는 큰 검기 셋) · 튕기는 마력 화살 · 거대한 마력 화살 · 대지 가르기(맵 끝까지 한 줄 베기) · 저주 안개(독·불·느려짐) · 일곱 갈래 사격 · 연쇄 번개 · 블랙홀 · 빛기둥 · 귀환 부메랑",
        "한 캐릭터의 무기끼리는 각성 기술이 겹치지 않음 (캐릭터마다 무기에 붙는 기술 순서도 다름)",
      ],
      en: [
        "Dawn of the Wilds awakening skills go from 6 to 16: new Blade Tempest (three huge piercing blade waves) · Ricochet Bolts · Arcane Lance · Horizon Cleave (a slash across the whole map) · Cursed Mist (poison, burn, slow) · Sevenfold Volley · Chain Lightning · Black Hole · Pillars of Light · Returning Boomerang",
        "A character's weapons never share the same awakening skill (and the order differs per character)",
      ],
      ja: [
        "荒野の夜明けの覚醒技が6種から16種に：新しく剣気の嵐（貫く大きな剣気3つ）· 跳ねる魔力の矢 · 巨大な魔力の矢 · 大地断ち（マップの端まで一直線）· 呪いの霧（毒・炎・鈍化）· 七筋の射撃 · 連鎖の雷 · ブラックホール · 光の柱 · 帰還ブーメラン",
        "同じキャラの武器同士では覚醒技が重ならない（キャラごとに順番も違う）",
      ],
    },
  },
  {
    version: "0.48.109",
    date: "2026-10-26",
    items: {
      ko: [
        "이터: 모든 공격 효과를 다시 그림 (보랏빛 그림자 테두리·긴 늑대 송곳니·붉게 빛나는 눈의 아가리, 뻗어 나가는 그림자 촉수, 소용돌이치는 심연의 구멍, 가시 돋친 그림자 창, 그림자 발톱 X자, 지느러미를 세우고 솟는 포식자, 빨려 드는 붉은 혼) · 왼쪽 위에 먹은 수와 재생력을 보여 주는 '포식(DEVOUR)' 스택 창",
        "묵인: 돌진하면 몸 앞에 거대한 마력 방패가 생김 (무기마다 모양·색이 다름: 쇠뿔·탑 방패·갈라진 땅·화살촉·겹 방패·사슬·성벽·가시·요새·불꽃)",
        "여름 파도 한정 스킨: 걸으면 푸른 물 발자국과 살짝 이는 물거품이 남음",
      ],
      en: [
        "Eater: every attack effect redrawn (maws with a violet shadow rim, long wolf fangs and glowing red eyes, reaching shadow tendrils, a swirling abyssal pit, a thorned shadow spear, shadow-claw X-cuts, a predator rising fin-first, red souls sucked in) · a DEVOUR stack at the top left shows foes eaten and regen",
        "Mukin: charging now raises a huge magic shield in front of him (shape and color differ by weapon: iron horn, tower shield, cracked earth, arrowhead, twin shields, chains, rampart, spikes, fortress, flames)",
        "Summer Splash limited skin: walking leaves blue wet footprints with a little sea foam",
      ],
      ja: [
        "イーター：すべての攻撃エフェクトを描き直し（紫の影の縁・長い狼の牙・赤く光る目の顎、伸びる影の触手、渦巻く深淵の穴、棘のある影の槍、影の爪のX字、背びれを立てて現れる捕食者、吸い込まれる赤い魂）· 左上に喰った数と再生力を示す「捕食（DEVOUR）」スタック",
        "黙忍：突進すると体の前に巨大な魔力の盾が現れる（武器ごとに形と色が違う：鉄の角・タワーシールド・割れた大地・矢じり・二重の盾・鎖・城壁・棘・要塞・炎）",
        "限定スキン「真夏のしぶき」：歩くと青い水の足跡と少しの泡が残る",
      ],
    },
  },
  {
    version: "0.48.108",
    date: "2026-10-26",
    items: {
      ko: [
        "학살자 다시 만듦: 자루만큼 긴 날이 머리 위를 가로지르는 거대한 대낫을 들고 있음 (그림 안에) · 한 번 누르면 아주 빠른 5연속 콤보가 몰아치고, 끝나면 보통 공격 속도만큼 쉬고 다시 처음부터 · 처음 무기 콤보: 낫 베기 3연속 → 적에게 급습하며 전면 베기 → 일직선 베기 → 강하게 베기 + 부채꼴 검기 셋 → 범위 +30%의 더욱 강한 베기 · 대낫 10개 모두 새 콤보 (X자 베기·피의 검기 폭발·끌어당겨 베기·내려찍는 강하 등)",
        "학살자: 늘 입힌 피해의 50%를 흡혈 · 기술마다 체력 5를 쓰지만 체력 20 아래로는 내려가지 않음 · 피의 학살 중에는 체력을 쓰지 않음 · 핏빛 초승달·피 튐·꽃잎이 흩날리는 화려한 공격 효과 · 검은 코르셋·짧은 치마·허벅지 부츠와 핏빛 머리, 갸름한 얼굴로 그림을 다시 그림",
      ],
      en: [
        "Slayer remade: she now carries a huge scythe whose blade is as long as its shaft, arching over her head (part of her sprite) · one press unleashes a blazing 5-move combo, then a rest at normal attack speed before it starts again · starter combo: triple slash → raid slash at a foe → line cleave → heavy slash + a fan of three blades → a grand slash with +30% reach · all 10 scythes have new combos (X-cut, blood nova, reaping pull, skyfall and more)",
        "Slayer: always heals 50% of damage dealt · each move still costs 5 HP but never drops her below 20 · no HP cost during Blood Massacre · flashy crimson crescents, blood spray and drifting petals · redrawn with a black corset, short skirt, thigh boots, blood-red hair and a slimmer face",
      ],
      ja: [
        "虐殺者を作り直し：柄と同じ長さの刃が頭上を横切る巨大な大鎌を持つ（キャラの絵の中に） · 1回押すととても速い5連続コンボが吹き荒れ、終わると通常の攻撃速度分休んでまた最初から · 初期武器のコンボ：鎌斬り3連 → 敵へ急襲して前方斬り → 一直線斬り → 強斬り＋扇状の剣気3つ → 範囲+30%の渾身の大斬り · 大鎌10本すべて新しいコンボ（X字斬り・血の剣気爆発・引き寄せ斬り・天墜など）",
        "虐殺者：常に与ダメージの50%を吸血 · 技ごとに体力5を使うが20未満にはならない · 血の虐殺中は体力を使わない · 血色の三日月・血しぶき・花びらが舞う華やかな攻撃エフェクト · 黒いコルセット・短いスカート・サイハイブーツと血色の髪、ほっそりした顔で描き直し",
      ],
    },
  },
  {
    version: "0.48.107",
    date: "2026-10-26",
    items: {
      ko: [
        "역병의사: 모기떼가 세 배로 많고 넓어져, 누르고 있는 동안 쉬지 않고 적을 갈아버림 (피해가 와다다 쌓여 오름) · 쥐떼는 맵 곳곳 아무 자리에서 튀어나와 둘레 적 여럿을 함께 갉음 · 죽음의 손아귀 즉사 확률 20% → 34% (사신의 손 44%)",
        "사멸: 기본 치명타 확률 20% · 독·죽음 같은 상태이상 피해에도 치명타가 뜸",
        "광야의 새벽: 메테오 범위가 더 커짐 · 마지막 보스를 잡지 못해도 시간이 되면 다음 보스가 계속 나와 여럿을 함께 상대",
        "테스트 중: 로비 펫을 모두 가진 상태로 써 볼 수 있음",
      ],
      en: [
        "Plague Doctor: the mosquito swarm is three times bigger and wider and, while you hold attack, grinds foes nonstop (damage piles up fast) · rats pop up anywhere on the map and gnaw several nearby foes at once · Grip of Death kill chance 20% → 34% (44% with Reaper's Hand)",
        "Samyeol: 20% base critical chance · status damage such as poison and death can now crit",
        "Dawn of the Wilds: bigger meteors · even if the final boss isn't defeated, more bosses keep arriving on schedule so you may face several at once",
        "During testing: all lobby pets are owned so you can try them",
      ],
      ja: [
        "疫病医：蚊の群れが3倍に増えて広くなり、押している間休まず敵をすり潰す（ダメージがどんどん積み上がる）· 鼠はマップのあちこちから現れ周りの敵を何体もまとめてかじる · 死の手の即死確率20% → 34%（死神の手で44%）",
        "死滅：基本クリティカル率20% · 毒・死などの状態異常ダメージにもクリティカルが出る",
        "荒野の夜明け：メテオの範囲が大きく · 最後のボスを倒せなくても時間になると次のボスが現れ、複数を同時に相手する",
        "テスト中：ロビーのペットをすべて所持した状態で試せる",
      ],
    },
  },
];
