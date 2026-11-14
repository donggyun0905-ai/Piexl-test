// 캐릭터 숙련도: 게임을 시작한 판 수 → Lv 0~7 · 고른 테두리(숙련도 레벨까지) · 카드 꾸밈(시즌 3 레이드 보상).
// 이 기기 저장 "mastery" (cloudSave 백업 칸). 꾸밈이라 브라우저 저장만
import { uiSfx } from "../audio/uiSounds";
import type { CharacterId } from "@pixel-rogue/shared";
import { onCloudApplied } from "../cloudSave";
import { loadText, saveText } from "../storage";
import { TEST_OPEN } from "../testFlags";
import { noteMasteryUp } from "../select/charArt";

/** 레벨 n에 필요한 판 수 (Lv.1 = 1판 … Lv.7 = 80판) */
export const MASTERY_AT = [1, 3, 7, 15, 30, 50, 80] as const;
export const MASTERY_MAX = MASTERY_AT.length;

/** 카드 꾸밈 (시즌 3 레이드 보스 이벤트에서 얻음, 테스트 중에는 모두) */
export const CARD_SKINS = ["riftGate", "dragonScale", "frostCrown", "emberKeep", "starAbyss"] as const;
export type CardSkin = (typeof CARD_SKINS)[number];

interface Mastery {
  /** 캐릭터마다 시작한 판 수 (서버 합치기에서 두 기기 판 수가 더해짐) */
  plays: Partial<Record<CharacterId, number>>;
  /** 고른 테두리 레벨 (글자: 합치기에서 숫자처럼 더해지지 않게). 없으면 지금 숙련도 레벨 */
  frame: Partial<Record<CharacterId, string>>;
  /** 고른 카드 꾸밈 */
  card: Partial<Record<CharacterId, string>>;
  /** 가진 카드 꾸밈 */
  cards: string[];
}

let cache: Mastery | null = null;
onCloudApplied(() => (cache = null));

function load(): Mastery {
  if (cache) return cache;
  try {
    const m = JSON.parse(loadText("mastery") ?? "{}") as Partial<Mastery>;
    cache = { plays: m.plays ?? {}, frame: m.frame ?? {}, card: m.card ?? {}, cards: m.cards ?? [] };
  } catch {
    cache = { plays: {}, frame: {}, card: {}, cards: [] };
  }
  return cache;
}

function save(m: Mastery): void {
  cache = m;
  saveText("mastery", JSON.stringify(m));
}

export const playsOf = (c: CharacterId): number => load().plays[c] ?? 0;

/** 판 수 → 숙련도 레벨 (0~7) */
export const masteryLevel = (n: number): number => MASTERY_AT.filter((at) => n >= at).length;

/** 다음 레벨까지 남은 판 수 (최고 레벨이면 null) */
export function toNext(n: number): number | null {
  const at = MASTERY_AT.find((a) => n < a);
  return at === undefined ? null : at - n;
}

/** 이 캐릭터로 게임을 시작함 */
export function addPlay(c: CharacterId): void {
  const m = load();
  const n = (m.plays[c] ?? 0) + 1;
  save({ ...m, plays: { ...m.plays, [c]: n } });
  if (masteryLevel(n) > masteryLevel(n - 1)) {
    uiSfx("uiLevelUp");
    noteMasteryUp(c, masteryLevel(n));
  }
}

/** 보이는 테두리 레벨 (고른 것, 없으면 지금 레벨 · 지금 레벨보다 높게는 못 씀) */
export function frameOf(c: CharacterId): number {
  const lv = masteryLevel(playsOf(c));
  const pick = load().frame[c];
  return pick === undefined ? lv : Math.min(lv, Number(pick) || 0);
}

export function setFrame(c: CharacterId, lv: number): void {
  const m = load();
  save({ ...m, frame: { ...m.frame, [c]: String(lv) } });
}

export const ownedCards = (): readonly string[] => (TEST_OPEN ? CARD_SKINS : load().cards);

/** 입은 카드 꾸밈 (가진 것만) */
export function cardOf(c: CharacterId): CardSkin | null {
  const id = load().card[c];
  return id && ownedCards().includes(id) ? (id as CardSkin) : null;
}

export function setCard(c: CharacterId, id: CardSkin | null): void {
  const m = load();
  const card = { ...m.card };
  if (id) card[c] = id;
  else delete card[c];
  save({ ...m, card });
}
