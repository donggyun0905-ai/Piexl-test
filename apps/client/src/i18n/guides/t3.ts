// 캐릭터 설명: 테라코어 수집가 · 한·영·일 (수치는 itemsCollector·weaponsCollector와 맞춤)
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_T3: Guide = {
  collector: [
    "테라코어 · 수집가 · 등에 무기를 잔뜩 짊어진 푸른 머리의 무기 수집가 · 체력 100 · 행운 2",
    "무기는 수집가의 검 하나뿐 (앞을 반원으로 벰 · 잃지 않음). 대신 바닥·상자·상점에서 수집 무기 30개를 모음 (수집 무기 = 패시브, 하나씩만)",
    "콤보: 격투가처럼 공격할 때마다 한 칸씩 · 기본 검 → 얻은 차례대로 수집 무기 → 다시 기본 검 · 1초 쉬면 처음부터 · 발밑 점이 콤보 단계 (지나온 칸은 그 무기 색). 수집 무기를 얻을 때마다 콤보가 한 칸 늘어남",
    "모은 무기는 등 뒤 위 공중에 줄지어 떠 있고, 자기 차례가 되면 나와서 무기마다 다른 공격: 성검 검격 · 피의 검 X자 · 서리 검 내려찍기+얼음 가시 · 태양 검 한 바퀴 · 공허의 검 큰 반원 · 사슬 큰칼 더 큰 부채꼴 · 카타나 칼선 4연속 · 지팡이 빛기둥·블랙홀·덩굴 · 흰 날개 활 유도 화살 셋 · 얼음 활 갈라지는 화살 · 황금 활 거대한 마력 화살 · 석궁 출혈 · 쌍열 권총 산탄+반동 · 별의 마법서 유도 별빛 · 눈의 마법서 레이저 · 황금 건틀릿 거대한 주먹 · 어둠의 발톱 두 번 할퀴기 · 창 넷(찍고 지르기·검격+찌르기·10연 찌르기·찌르기+검격) · 돌 망치 느린 강타 · 피의 망치·푸른 도끼 날아가는 칼날 · 붉은 도끼 3연타 · 해골 낫 3방향 · 쌍월 되돌아오는 칼날",
    "수집 무기 30: 검 5(빛 회복·피 흡혈·얼음 느림·태양 불·공허 끌어당김) · 사슬 큰칼 · 붉은 카타나(내달려 벰) · 지팡이 3 · 활 4 · 석궁 · 쌍열 권총 · 마법서 2 · 건틀릿 2 · 창 4 · 망치 2 · 도끼 2 · 해골 낫 · 쌍월 칼날. 무기마다 작은 능력치(공격력·사거리·체력·공격 속도 등)",
    "이펙트 색은 그 무기의 색을 따라감. 무기를 많이 모을수록 콤보가 길고 화려해짐",
  ],
};

export const GUIDE_EN_T3: Guide = {
  collector: [
    "Terracore · Collector · a blue-haired weapon collector with a back full of blades · 100 HP · Luck 2",
    "His only weapon is the Collector's Blade (a half-circle slash, never lost). Instead he gathers 30 collectibles from floors, chests and shops (collectibles are passives, one of each)",
    "Combo: like the Brawler, one step per attack · blade → collectibles in the order obtained → blade again · pause for 1s and it restarts · the dots under his feet show the step (done steps glow in each weapon's color). Every new collectible adds a step",
    "His collection floats in a row above his back; on its turn each weapon comes out and attacks its own way: Holy Sword slash · Blood Sword X · Frost Sword slam + ice spikes · Sun Sword spin · Void Sword huge half-circle · Chain Cleaver wider fan · Katana 4 needle cuts · staves: light pillar, black hole, vines · White Wing Bow 3 homing arrows · Ice Bow splitting arrows · Golden Bow giant mana arrow · Crossbow bleed · pistol shotgun + recoil · Star Tome homing starlight · Eye Tome laser · Golden Gauntlet giant fist · Shadow Claw two rakes · 4 spears (slam & thrust, slash & thrust, 10 thrusts, thrust + slash) · Stone Hammer slow smash · Blood Hammer and Azure Axe flying blades · Crimson Axe triple swing · Skull Scythe 3 reaps · Twin Crescent returning blades",
    "30 collectibles: 5 swords (holy heal, blood leech, ice slow, sun burn, void pull) · Chain Cleaver · Crimson Katana (dash cut) · 3 staves · 4 bows · Crossbow · Twin-Barrel Pistol · 2 tomes · 2 gauntlets · 4 spears · 2 hammers · 2 axes · Skull Scythe · Twin Crescent. Each also gives a small stat (damage, range, HP, attack speed…)",
    "Effects take the color of each weapon. The more weapons you collect, the longer and flashier the combo",
  ],
};

export const GUIDE_JA_T3: Guide = {
  collector: [
    "テラコア · コレクター · 背中に武器をどっさり背負った青髪の武器コレクター · 体力100 · 幸運2",
    "武器はコレクターの剣一つだけ（前方を半円に斬る · 失わない）。代わりに床・宝箱・ショップから収集武器30個を集める（収集武器 = パッシブ、各1つ）",
    "コンボ: 格闘家のように攻撃するたびに一段ずつ · 基本の剣 → 手に入れた順に収集武器 → また基本の剣 · 1秒休むと最初から · 足元の点がコンボの段階（済んだ段はその武器の色）。収集武器を得るたびにコンボが一段伸びる",
    "集めた武器は背中の上の空中に並んで浮かび、自分の番になると出てきて武器ごとに違う攻撃: 聖剣の斬撃 · 血の剣X字 · 霜の剣叩きつけ+氷の棘 · 太陽の剣一回転 · 虚空の剣大きな半円 · 鎖の大鉈さらに広い扇 · 刀の刀線4連 · 杖の光柱・ブラックホール・蔦 · 白翼の弓追尾矢3本 · 氷の弓分かれる矢 · 黄金の弓巨大な魔力の矢 · クロスボウ出血 · 二連拳銃散弾+反動 · 星の魔導書追尾する星明かり · 瞳の魔導書レーザー · 黄金の籠手巨大な拳 · 闇の鉤爪二回引っかき · 槍4本（突き下ろし&突き・斬撃+突き・十連突き・突き+斬撃）· 石の大槌ゆっくり強打 · 血の大槌・蒼の斧飛ぶ刃 · 紅の斧三連 · 髑髏の鎌三方向 · 双月の刃戻ってくる刃",
    "収集武器30: 剣5（光の回復・血の吸血・氷の鈍化・太陽の炎・虚空の引き寄せ）· 鎖の大鉈 · 紅の刀（駆け抜け斬り）· 杖3 · 弓4 · クロスボウ · 二連拳銃 · 魔導書2 · 籠手2 · 槍4 · 大槌2 · 斧2 · 髑髏の鎌 · 双月の刃。武器ごとに小さな能力値（攻撃力・射程・体力・攻撃速度など）",
    "エフェクトの色はその武器の色に従う。武器を集めるほどコンボが長く華やかに",
  ],
};
