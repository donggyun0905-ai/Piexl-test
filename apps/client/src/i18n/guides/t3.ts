// 캐릭터 설명: 테라코어 수집가 · 한·영·일 (수치는 itemsCollector·weaponsCollector와 맞춤)
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_T3: Guide = {
  collector: [
    "테라코어 · 수집가 · 등에 무기를 잔뜩 짊어진 푸른 머리의 무기 수집가 · 체력 100 · 행운 2",
    "무기는 수집가의 검 하나뿐 (앞을 반원으로 벰 · 잃지 않음). 대신 바닥·상자·상점에서 수집 무기 30개를 모음 (수집 무기 = 패시브, 하나씩만)",
    "콤보: 공격 한 번에 콤보 전체가 짧은 간격(0.08초)으로 이어짐 · 기본 검 → 얻은 차례대로 수집 무기 → 다 끝나면 공격 대기. 수집 무기를 얻을 때마다 콤보가 한 칸 늘어남",
    "모은 무기는 등 뒤 위 공중에 줄지어 떠 있고, 자기 차례가 되면 날아 나와 자기 방식으로 공격한 뒤 돌아옴: 검은 내 둘레를 한 바퀴 · 낫은 크게 쓸기 · 망치·큰칼은 떨어져 내리찍기 · 카타나는 발도(앞으로 내달림) · 지팡이는 떠올라 노린 적 자리에 마법 · 활·석궁·총은 나타나 쏨 · 창·쌍월은 던짐 · 별의 마법서는 별이 떨어짐 · 눈의 마법서는 빛줄기 · 황금 건틀릿은 거대한 주먹 · 발톱은 X자 할퀴기 · 도끼는 둘레를 돎",
    "수집 무기 30: 검 5(빛 회복·피 흡혈·얼음 느림·태양 불·공허 끌어당김) · 사슬 큰칼 · 붉은 카타나(내달려 벰) · 지팡이 3 · 활 4 · 석궁 · 쌍열 권총 · 마법서 2 · 건틀릿 2 · 창 4 · 망치 2 · 도끼 2 · 해골 낫 · 쌍월 칼날. 무기마다 작은 능력치(공격력·사거리·체력·공격 속도 등)",
    "이펙트 색은 그 무기의 색을 따라감. 무기를 많이 모을수록 콤보가 길고 화려해짐",
  ],
};

export const GUIDE_EN_T3: Guide = {
  collector: [
    "Terracore · Collector · a blue-haired weapon collector with a back full of blades · 100 HP · Luck 2",
    "His only weapon is the Collector's Blade (a half-circle slash, never lost). Instead he gathers 30 collectibles from floors, chests and shops (collectibles are passives, one of each)",
    "Combo: one attack chains the whole combo at short intervals (0.08s) · blade → collectibles in the order obtained → then the attack cooldown. Every new collectible adds a step",
    "His collection floats in a row above his back; on its turn each weapon flies out, attacks in its own way and returns: swords whirl around you · the scythe reaps wide · hammers and the cleaver drop and slam · the katana draws and dashes · staves rise and cast on the target · bows, crossbow and pistol appear and shoot · spears and the crescent are thrown · the Star Tome drops stars · the Eye Tome fires a beam · the gauntlet throws a giant fist · claws rake an X · axes circle you",
    "30 collectibles: 5 swords (holy heal, blood leech, ice slow, sun burn, void pull) · Chain Cleaver · Crimson Katana (dash cut) · 3 staves · 4 bows · Crossbow · Twin-Barrel Pistol · 2 tomes · 2 gauntlets · 4 spears · 2 hammers · 2 axes · Skull Scythe · Twin Crescent. Each also gives a small stat (damage, range, HP, attack speed…)",
    "Effects take the color of each weapon. The more weapons you collect, the longer and flashier the combo",
  ],
};

export const GUIDE_JA_T3: Guide = {
  collector: [
    "テラコア · コレクター · 背中に武器をどっさり背負った青髪の武器コレクター · 体力100 · 幸運2",
    "武器はコレクターの剣一つだけ（前方を半円に斬る · 失わない）。代わりに床・宝箱・ショップから収集武器30個を集める（収集武器 = パッシブ、各1つ）",
    "コンボ: 一回の攻撃でコンボ全体が短い間隔（0.08秒）で続く · 基本の剣 → 手に入れた順に収集武器 → 終われば攻撃待ち。収集武器を得るたびにコンボが一段伸びる",
    "集めた武器は背中の上の空中に並んで浮かび、自分の番になると飛び出して自分のやり方で攻撃して戻る: 剣は自分の周りを一周 · 鎌は大きく薙ぐ · 大槌・大鉈は落ちて叩きつけ · 刀は抜刀（前へ駆ける）· 杖は浮かんで狙った敵に魔法 · 弓・クロスボウ・銃は現れて撃つ · 槍・双月は投げる · 星の魔導書は星が降る · 瞳の魔導書は光線 · 黄金の籠手は巨大な拳 · 鉤爪はX字に引っかく · 斧は周りを回る",
    "収集武器30: 剣5（光の回復・血の吸血・氷の鈍化・太陽の炎・虚空の引き寄せ）· 鎖の大鉈 · 紅の刀（駆け抜け斬り）· 杖3 · 弓4 · クロスボウ · 二連拳銃 · 魔導書2 · 籠手2 · 槍4 · 大槌2 · 斧2 · 髑髏の鎌 · 双月の刃。武器ごとに小さな能力値（攻撃力・射程・体力・攻撃速度など）",
    "エフェクトの色はその武器の色に従う。武器を集めるほどコンボが長く華やかに",
  ],
};
