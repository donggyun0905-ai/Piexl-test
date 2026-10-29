// 이벤트 상점: 이벤트 코인으로 사는 효과 (스킨과 따로 장착, 이 기기에 저장). 칸 넷: 타격 · 대기 · 걸음 · 피해 숫자(데미지 스킨)
// 범 풍류 효과는 한정 스킨에서 떼어 와 낱개로 팜. 산 효과의 그림은 도트 편집 /pixel/?fx=1 에서 고칠 수 있음 (game/customArt)
import { loadText, saveText } from "../storage";
import { TEST_OPEN } from "../testFlags";
import { spendEventCoins } from "../event/eventCoins";
import { FX_THEMES, themeOf, type FxTheme, type FxThemeId } from "./fxThemes";

export type FxSlot = "hit" | "idle" | "walk" | "dmg";
/** 피해 숫자 모양 (damageNumbers.style): 범·여름 · 황금·네온 · 테마 세트 (shop/fxThemes) */
export type DmgStyle = "tiger" | "summer" | "gold" | "neon" | FxThemeId;

export interface FxItem {
  id: string;
  slot: FxSlot;
  price: number;
  /** 도트 편집으로 고칠 수 있는 그림 (game/limited/tigerSprites) */
  sprites: readonly string[];
  dmg?: DmgStyle;
  /** 테마 세트 효과 (game/limited/themeFx) */
  theme?: FxThemeId;
  /** 살 수 없고 보상으로만 얻음 (월드 워 리그 우승) */
  reward?: "league";
}

export const FX_ITEMS: readonly FxItem[] = [
  { id: "tigerHit", slot: "hit", price: 30, sprites: ["tiger:claw", "tiger:ring", "tiger:seal", "tiger:pillar"] },
  { id: "tigerIdle", slot: "idle", price: 25, sprites: ["tiger:aura"] },
  { id: "tigerWalk", slot: "walk", price: 15, sprites: ["tiger:paw"] },
  { id: "tigerDmg", slot: "dmg", price: 25, sprites: ["tiger:crit"], dmg: "tiger" },
  { id: "goldDmg", slot: "dmg", price: 15, sprites: [], dmg: "gold" },
  { id: "neonDmg", slot: "dmg", price: 15, sprites: [], dmg: "neon" },
  // 테마 세트 10개: 타격 · 대기 · 걸음 (앞 8세트는 데미지 스킨도). 세트 가격은 타격 20 · 대기 18 · 걸음 12 · 숫자 15
  ...FX_THEMES.filter((th) => th.id !== "victory").flatMap((th): FxItem[] => [
    { id: `${th.id}Hit`, slot: "hit", price: 20, sprites: [], theme: th.id },
    { id: `${th.id}Idle`, slot: "idle", price: 18, sprites: [], theme: th.id },
    { id: `${th.id}Walk`, slot: "walk", price: 12, sprites: [], theme: th.id },
    ...(th.dmg ? [{ id: `${th.id}Dmg`, slot: "dmg" as const, price: 15, sprites: [], dmg: th.id, theme: th.id }] : []),
  ]),
  // 월드 워 리그 우승 한정 '승리' 세트
  ...(["hit", "idle", "walk", "dmg"] as const).map((slot): FxItem => ({ id: `victory${slot[0]!.toUpperCase()}${slot.slice(1)}`, slot, price: 0, sprites: [], theme: "victory", reward: "league", ...(slot === "dmg" ? { dmg: "victory" as const } : {}) })),
];
export const FX_SLOTS: readonly FxSlot[] = ["hit", "idle", "walk", "dmg"];

interface Saved {
  owned: string[];
  equipped: Partial<Record<FxSlot, string>>;
}

function load(): Saved {
  try {
    const s = JSON.parse(loadText("fxShop") ?? "{}") as Partial<Saved>;
    return { owned: s.owned ?? [], equipped: s.equipped ?? {} };
  } catch {
    return { owned: [], equipped: {} };
  }
}
const save = (s: Saved) => saveText("fxShop", JSON.stringify(s));

/** 가진 효과 (테스트 중에는 전부) */
export const ownedFx = (): string[] => (TEST_OPEN ? FX_ITEMS.map((x) => x.id) : load().owned);
export const equippedFx = (): Partial<Record<FxSlot, string>> => load().equipped;

/** 사기: 코인이 모자라거나 이미 있으면 false */
export function buyFx(id: string): boolean {
  const item = FX_ITEMS.find((x) => x.id === id);
  if (!item || item.reward || ownedFx().includes(id) || !spendEventCoins(item.price)) return false;
  const s = load();
  s.owned.push(id);
  s.equipped[item.slot] = id;
  save(s);
  return true;
}

/** 보상으로 받음 (월드 워 리그 우승: 승리 세트 넷). 새로 받은 게 있으면 true */
export function grantFx(reward: "league"): boolean {
  const s = load();
  const add = FX_ITEMS.filter((x) => x.reward === reward && !s.owned.includes(x.id)).map((x) => x.id);
  s.owned.push(...add);
  save(s);
  return add.length > 0;
}

/** 장착 (null이면 그 칸 비우기) */
export function equipFx(slot: FxSlot, id: string | null): void {
  const s = load();
  if (id === null) delete s.equipped[slot];
  else if (ownedFx().includes(id)) s.equipped[slot] = id;
  save(s);
}

/** 판 시작 때: 켜진 효과 (한정 스킨 범 풍류를 입었으면 전부 범) */
/** limited: 입은 한정 스킨 테마 (범 풍류·여름 파도면 효과 전부) */
/** 범 효과는 hit·idle·walk (범 항목만), 테마 세트 효과는 themes (칸마다 다른 세트) */
export function activeFx(limited: "tiger" | "summer" | null): { hit: boolean; idle: boolean; walk: boolean; rest: boolean; dmg: DmgStyle | null; themes: Partial<Record<"hit" | "idle" | "walk", FxTheme>> } {
  if (limited) return { hit: true, idle: true, walk: true, rest: true, dmg: limited, themes: {} };
  const e = equippedFx();
  const own = ownedFx();
  const on = (slot: FxSlot) => {
    const id = e[slot];
    return id && own.includes(id) ? FX_ITEMS.find((x) => x.id === id) : undefined;
  };
  const tiger = (slot: FxSlot) => !!on(slot) && !on(slot)!.theme;
  const themes = Object.fromEntries((["hit", "idle", "walk"] as const).flatMap((slot) => (on(slot)?.theme ? [[slot, themeOf(on(slot)!.theme)!]] : [])));
  return { hit: tiger("hit"), idle: tiger("idle"), walk: tiger("walk"), rest: false, dmg: on("dmg")?.dmg ?? null, themes };
}

/** 도트 편집으로 고칠 수 있는 그림 (가진 효과의 그림) */
export const editableFx = (): string[] => FX_ITEMS.filter((x) => ownedFx().includes(x.id)).flatMap((x) => x.sprites);
