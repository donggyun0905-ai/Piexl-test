// 캐릭터 설명: 테라코어 수집가 · 한·영·일 (수치는 itemsCollector·weaponsCollector와 맞춤)
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_T3: Guide = {
  collector: [
    "테라코어 · 수집가 · 등에 무기를 잔뜩 짊어진 푸른 머리의 무기 수집가 · 체력 100 · 행운 2",
    "무기는 수집가의 검 하나뿐 (앞을 반원으로 벰 · 잃지 않음). 대신 바닥·상자·상점에서 수집 무기 30개를 모음 (수집 무기 = 패시브, 하나씩만)",
    "콤보: 공격할 때마다 한 칸씩 · 기본 검 → 얻은 차례대로 수집 무기의 기술 → 다시 기본 검. 수집 무기를 얻을 때마다 콤보가 한 칸 늘어남",
    "모은 무기는 등 뒤 위 공중에 줄지어 떠 있음. 콤보에 쓴 무기는 등 뒤에서 사라져 방 어딘가(벽·기둥 위 빼고)에 날아가 박힘 → 박힌 동안은 콤보에서 빠짐",
    "박힌 무기에 몸이 닿으면 그 자리에서 그 무기의 기술이 바로 터짐 (공격 주기와 따로 · 피해 120%) → 등 뒤로 돌아옴. 방을 나가면 저절로 돌아옴",
    "수집 무기 30: 검 5(빛 회복·피 흡혈·얼음 느림·태양 불·공허 끌어당김) · 사슬 큰칼 · 붉은 카타나(내달려 벰) · 지팡이 3 · 활 4 · 석궁 · 쌍열 권총 · 마법서 2 · 건틀릿 2 · 창 4 · 망치 2 · 도끼 2 · 해골 낫 · 쌍월 칼날. 무기마다 작은 능력치(공격력·사거리·체력·공격 속도 등)",
    "이펙트 색은 그 무기의 색을 따라감. 많이 움직이며 박힌 무기를 밟을수록 강함",
  ],
};

export const GUIDE_EN_T3: Guide = {
  collector: [
    "Terracore · Collector · a blue-haired weapon collector with a back full of blades · 100 HP · Luck 2",
    "His only weapon is the Collector's Blade (a half-circle slash, never lost). Instead he gathers 30 collectibles from floors, chests and shops (collectibles are passives, one of each)",
    "Combo: one step per attack · blade → each collectible's technique in the order obtained → blade again. Every new collectible adds a step",
    "His collection floats in a row above his back. A weapon used in the combo vanishes from his back and sticks somewhere in the room (never on walls or pillars) → while stuck it leaves the combo",
    "Touch a stuck weapon to unleash its technique on the spot (apart from the attack cycle · 120% damage) → it returns to his back. Leaving the room brings them all back",
    "30 collectibles: 5 swords (holy heal, blood leech, ice slow, sun burn, void pull) · Chain Cleaver · Crimson Katana (dash cut) · 3 staves · 4 bows · Crossbow · Twin-Barrel Pistol · 2 tomes · 2 gauntlets · 4 spears · 2 hammers · 2 axes · Skull Scythe · Twin Crescent. Each also gives a small stat (damage, range, HP, attack speed…)",
    "Effects take the color of each weapon. The more you move and step on stuck weapons, the stronger he is",
  ],
};

export const GUIDE_JA_T3: Guide = {
  collector: [
    "テラコア · コレクター · 背中に武器をどっさり背負った青髪の武器コレクター · 体力100 · 幸運2",
    "武器はコレクターの剣一つだけ（前方を半円に斬る · 失わない）。代わりに床・宝箱・ショップから収集武器30個を集める（収集武器 = パッシブ、各1つ）",
    "コンボ: 攻撃するたびに一段 · 基本の剣 → 手に入れた順に収集武器の技 → また基本の剣。収集武器を得るたびにコンボが一段伸びる",
    "集めた武器は背中の上の空中に並んで浮かぶ。コンボで使った武器は背中から消え、部屋のどこか（壁・柱の上以外）に飛んで刺さる → 刺さっている間はコンボから外れる",
    "刺さった武器に体が触れるとその場でその武器の技がすぐ炸裂（攻撃周期とは別 · ダメージ120%）→ 背中に戻る。部屋を出ると自動で戻る",
    "収集武器30: 剣5（光の回復・血の吸血・氷の鈍化・太陽の炎・虚空の引き寄せ）· 鎖の大鉈 · 紅の刀（駆け抜け斬り）· 杖3 · 弓4 · クロスボウ · 二連拳銃 · 魔導書2 · 籠手2 · 槍4 · 大槌2 · 斧2 · 髑髏の鎌 · 双月の刃。武器ごとに小さな能力値（攻撃力・射程・体力・攻撃速度など）",
    "エフェクトの色はその武器の色に従う。たくさん動いて刺さった武器を踏むほど強い",
  ],
};
