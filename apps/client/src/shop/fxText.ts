// 이벤트 상점 테마 효과 글자 (한·영·일): 세트 이름 + 칸 이름 · 세트마다 칸별 설명
import type { Lang } from "../i18n";
import type { FxThemeId } from "./fxThemes";

type L = Record<Lang, string>;
type Slot = "hit" | "idle" | "walk" | "dmg";

const SET: Record<FxThemeId, L> = {
  sakura: { ko: "벚꽃", en: "Sakura", ja: "桜" },
  thunder: { ko: "뇌전", en: "Thunder", ja: "雷電" },
  frost: { ko: "서리", en: "Frost", ja: "霜" },
  inferno: { ko: "화염", en: "Inferno", ja: "火炎" },
  galaxy: { ko: "은하", en: "Galaxy", ja: "銀河" },
  candy: { ko: "사탕", en: "Candy", ja: "キャンディ" },
  retro: { ko: "8비트", en: "8-Bit", ja: "8ビット" },
  shadow: { ko: "그림자", en: "Shadow", ja: "影" },
  rhythm: { ko: "리듬", en: "Rhythm", ja: "リズム" },
  forest: { ko: "숲", en: "Forest", ja: "森" },
  victory: { ko: "승리", en: "Victory", ja: "勝利" },
};

const SLOT: Record<Slot, L> = {
  hit: { ko: "타격", en: "Hits", ja: "打撃" },
  idle: { ko: "대기", en: "Idle", ja: "待機" },
  walk: { ko: "걸음", en: "Steps", ja: "歩み" },
  dmg: { ko: "숫자", en: "Numbers", ja: "数字" },
};

/** 세트마다 칸별 설명 [타격, 대기, 걸음, 숫자] */
const DESC: Record<FxThemeId, Record<Lang, [string, string, string, string]>> = {
  sakura: {
    ko: ["맞히면 벚꽃잎이 흩날리고 반짝임, 처치하면 꽃보라", "가만히 있으면 분홍 빛 아래로 꽃잎이 내림", "걸음마다 꽃잎이 깔림", "분홍 숫자 · 치명타는 꽃잎 장식"],
    en: ["Petals and sparkles on hit, a flurry of blossoms on kills", "Petals drift down in a pink glow while you stand still", "Petals scatter with every step", "Pink numbers · crits get petal accents"],
    ja: ["当てると花びらときらめき、倒すと花吹雪", "止まっていると桃色の光の下に花びらが舞う", "一歩ごとに花びらが敷かれる", "桃色の数字・クリティカルは花びら飾り"],
  },
  thunder: {
    ko: ["맞히면 번개가 내리치고 불꽃이 튐", "가만히 있으면 둘레에 작은 번개가 튐", "걸음마다 번개 자국과 불꽃", "노란 전기 숫자 · 치명타는 하늘빛 번개"],
    en: ["Lightning strikes and sparks on hit", "Small bolts crackle around you while idle", "Bolt marks and sparks with each step", "Yellow electric numbers · crits are sky-blue bolts"],
    ja: ["当てると雷が落ちて火花が散る", "止まっていると周りに小さな雷が走る", "一歩ごとに雷の跡と火花", "黄色の電気数字・クリティカルは空色の雷"],
  },
  frost: {
    ko: ["맞히면 얼음 조각과 눈꽃", "가만히 있으면 서늘한 빛과 눈송이", "걸음마다 눈꽃 자국", "얼음빛 숫자 · 치명타는 눈꽃 장식"],
    en: ["Ice shards and snowflakes on hit", "Cool light and falling snow while idle", "Snowflake prints with each step", "Icy numbers · crits get snowflakes"],
    ja: ["当てると氷のかけらと雪の結晶", "止まっていると冷たい光と雪", "一歩ごとに雪の結晶の跡", "氷色の数字・クリティカルは雪の結晶"],
  },
  inferno: {
    ko: ["맞히면 불길이 솟고 불씨가 튐", "가만히 있으면 붉은 빛과 오르는 불씨", "걸음마다 불타는 발자국", "불꽃 숫자 · 치명타는 붉은 불길"],
    en: ["Flames burst and embers fly on hit", "A red glow and rising embers while idle", "Burning footprints with each step", "Fiery numbers · crits blaze red"],
    ja: ["当てると炎が上がり火の粉が散る", "止まっていると赤い光と昇る火の粉", "一歩ごとに燃える足あと", "炎の数字・クリティカルは赤い炎"],
  },
  galaxy: {
    ko: ["맞히면 별이 터지고 반짝임", "가만히 있으면 보랏빛 은하와 도는 별", "걸음마다 별 가루", "은하빛 숫자 · 치명타는 별 장식"],
    en: ["Stars burst and twinkle on hit", "A violet nebula with drifting stars while idle", "Stardust with each step", "Galactic numbers · crits get stars"],
    ja: ["当てると星がはじけてきらめく", "止まっていると紫の銀河と回る星", "一歩ごとに星屑", "銀河色の数字・クリティカルは星飾り"],
  },
  candy: {
    ko: ["맞히면 알록달록 사탕 가루와 하트", "가만히 있으면 하트가 둥실둥실", "걸음마다 스프링클이 톡톡", "흰 숫자에 분홍 테두리 · 치명타는 하트"],
    en: ["Colorful candy bits and hearts on hit", "Hearts float up while idle", "Sprinkles pop with each step", "White numbers with pink outlines · crits get hearts"],
    ja: ["当てるとカラフルなキャンディとハート", "止まっているとハートがふわふわ", "一歩ごとにスプリンクルがぽんぽん", "白い数字にピンクの縁・クリティカルはハート"],
  },
  retro: {
    ko: ["맞히면 도트 조각이 튀어 흩어짐", "가만히 있으면 초록 빛과 떠오르는 도트", "걸음마다 도트 블록", "8비트 초록 숫자 · 치명타는 노란 블록"],
    en: ["Pixel bits scatter on hit", "A green glow and floating pixels while idle", "Pixel blocks with each step", "8-bit green numbers · crits get yellow blocks"],
    ja: ["当てるとドットがはじけ散る", "止まっていると緑の光と浮かぶドット", "一歩ごとにドットブロック", "8ビットの緑の数字・クリティカルは黄色いブロック"],
  },
  shadow: {
    ko: ["맞히면 검은 안개와 보랏빛 칼날 자국", "가만히 있으면 어둠이 피어오름", "걸음마다 그림자 안개", "보랏빛 숫자 · 치명타는 붉은 칼날"],
    en: ["Dark mist and violet blade marks on hit", "Darkness rises around you while idle", "Shadow mist with each step", "Violet numbers · crits are crimson blades"],
    ja: ["当てると黒い霧と紫の刃の跡", "止まっていると闇が立ちのぼる", "一歩ごとに影の霧", "紫の数字・クリティカルは赤い刃"],
  },
  rhythm: {
    ko: ["맞히면 음표가 통통 튐", "가만히 있으면 음표가 흘러나옴", "걸음마다 음표가 찍힘", ""],
    en: ["Music notes bounce on hit", "Notes flow around you while idle", "A note with each step", ""],
    ja: ["当てると音符が弾む", "止まっていると音符があふれる", "一歩ごとに音符", ""],
  },
  forest: {
    ko: ["맞히면 나뭇잎이 흩날림", "가만히 있으면 반딧불이 모여듦", "걸음마다 새싹이 돋음", ""],
    en: ["Leaves scatter on hit", "Fireflies gather while idle", "Sprouts grow with each step", ""],
    ja: ["当てると木の葉が舞う", "止まっていると蛍が集まる", "一歩ごとに新芽が出る", ""],
  },
  victory: {
    ko: ["맞히면 금빛 훈장 별이 박히고 반짝임 (월드 워 리그 우승 한정)", "가만히 있으면 금빛 아래로 승리의 별이 떠오름 (한정)", "걸음마다 금빛 별 자국 (한정)", "금빛 훈장 숫자 · 치명타는 흰 별 (한정)"],
    en: ["Golden medal stars and sparkles on hit (World War League champion only)", "Victory stars rise in a golden glow while idle (limited)", "Golden star prints with every step (limited)", "Golden medal numbers · crits are white stars (limited)"],
    ja: ["当てると金色の勲章の星ときらめき（ワールドウォーリーグ優勝限定）", "止まっていると金色の光の下に勝利の星が昇る（限定）", "一歩ごとに金色の星の跡（限定）", "金色の勲章数字・クリティカルは白い星（限定）"],
  },
};

const SLOTS: readonly Slot[] = ["hit", "idle", "walk", "dmg"];

export function fxThemeName(theme: FxThemeId, slot: Slot, lang: Lang): string {
  return lang === "en" ? `${SET[theme].en} ${SLOT[slot].en}` : `${SET[theme][lang]} ${SLOT[slot][lang]}`;
}

export function fxThemeDesc(theme: FxThemeId, slot: Slot, lang: Lang): string {
  return DESC[theme][lang][SLOTS.indexOf(slot)] ?? "";
}

export const fxSetName = (theme: FxThemeId, lang: Lang): string => SET[theme][lang];
