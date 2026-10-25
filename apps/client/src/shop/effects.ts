// 이벤트 상점: 이벤트 코인으로 사는 효과 (스킨과 따로 장착, 이 기기에 저장). 칸 넷: 타격 · 대기 · 걸음 · 피해 숫자(데미지 스킨)
// 범 풍류 효과는 한정 스킨에서 떼어 와 낱개로 팜. 산 효과의 그림은 도트 편집 /pixel/?fx=1 에서 고칠 수 있음 (game/customArt)
import { loadText, saveText } from "../storage";
import { TEST_OPEN } from "../testFlags";
import { spendEventCoins } from "../event/eventCoins";

export type FxSlot = "hit" | "idle" | "walk" | "dmg";
/** 피해 숫자 모양 (damageNumbers.style) */
export type DmgStyle = "tiger" | "summer" | "gold" | "neon";

export interface FxItem {
  id: string;
  slot: FxSlot;
  price: number;
  /** 도트 편집으로 고칠 수 있는 그림 (game/limited/tigerSprites) */
  sprites: readonly string[];
  dmg?: DmgStyle;
}

export const FX_ITEMS: readonly FxItem[] = [
  { id: "tigerHit", slot: "hit", price: 30, sprites: ["tiger:claw", "tiger:ring", "tiger:seal", "tiger:pillar"] },
  { id: "tigerIdle", slot: "idle", price: 25, sprites: ["tiger:aura"] },
  { id: "tigerWalk", slot: "walk", price: 15, sprites: ["tiger:paw"] },
  { id: "tigerDmg", slot: "dmg", price: 25, sprites: ["tiger:crit"], dmg: "tiger" },
  { id: "goldDmg", slot: "dmg", price: 15, sprites: [], dmg: "gold" },
  { id: "neonDmg", slot: "dmg", price: 15, sprites: [], dmg: "neon" },
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
  if (!item || ownedFx().includes(id) || !spendEventCoins(item.price)) return false;
  const s = load();
  s.owned.push(id);
  s.equipped[item.slot] = id;
  save(s);
  return true;
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
export function activeFx(limited: "tiger" | "summer" | null): { hit: boolean; idle: boolean; walk: boolean; rest: boolean; dmg: DmgStyle | null } {
  if (limited) return { hit: true, idle: true, walk: true, rest: true, dmg: limited };
  const e = equippedFx();
  const own = ownedFx();
  const on = (slot: FxSlot) => {
    const id = e[slot];
    return id && own.includes(id) ? FX_ITEMS.find((x) => x.id === id) : undefined;
  };
  return { hit: !!on("hit"), idle: !!on("idle"), walk: !!on("walk"), rest: false, dmg: on("dmg")?.dmg ?? null };
}

/** 도트 편집으로 고칠 수 있는 그림 (가진 효과의 그림) */
export const editableFx = (): string[] => FX_ITEMS.filter((x) => ownedFx().includes(x.id)).flatMap((x) => x.sprites);
