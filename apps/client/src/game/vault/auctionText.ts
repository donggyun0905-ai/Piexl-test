// 경매 상품 글(이름·설명·아이콘): 경매 창(VaultPanels)과 무대 위 상품 마우스 설명(auctionTipAt)이 같이 씀
import { AUCTION, auctionHere, LOT_GAP, lotHidden, lotY, ROOM_CX, type AuctionState, type RunState } from "@pixel-rogue/shared";
import type { Lang, TextKey } from "../../i18n";
import { itemDesc, itemName } from "../../i18n/items";
import { pickupScreenPos, worldAt } from "../clickTargets";
import type { IconItem } from "../itemIcon";
import type { FloorTip } from "../PickupTip";

/** 상품 아이콘 (??? · 증강이면 null) */
export const lotItem = (a: AuctionState, i: number): IconItem | null => (lotHidden(a, i) || a.lots[i]!.kind !== "passive" ? null : ({ kind: "passive", id: a.lots[i]!.id } as IconItem));

export function lotName(a: AuctionState, i: number, lang: Lang, t: (k: TextKey) => string): string {
  const l = a.lots[i]!;
  if (lotHidden(a, i)) return "???";
  return l.kind === "passive" ? itemName("passive", l.id, lang) : `${t("auctionAug")} · ${t(`swarmSkill_${l.id}` as TextKey)}`;
}

export function lotDesc(a: AuctionState, i: number, lang: Lang, t: (k: TextKey) => string): string {
  const l = a.lots[i]!;
  if (lotHidden(a, i)) return t("auctionHiddenDesc");
  return l.kind === "passive" ? itemDesc("passive", l.id, lang, t) : t("auctionAugDesc");
}

/** 무대 위 상품 자리 (auctionDraw와 같음) */
const lotX = (i: number) => ROOM_CX + (i - (AUCTION.lots - 1) / 2) * LOT_GAP;

/** 화면 좌표 아래의 무대 상품 설명 (앉지 않아도 훑어볼 수 있게). 없으면 null */
export function auctionTipAt(run: RunState, canvas: HTMLCanvasElement, zoom: number, x: number, y: number, lang: Lang, t: (k: TextKey) => string): FloorTip | null {
  const a = run.map.rooms[run.roomId]?.type === "auction" ? auctionHere(run) : null;
  const w = a && worldAt(run, canvas, zoom, x, y);
  if (!a || !w) return null;
  const i = a.lots.findIndex((_, k) => Math.abs(w.x - lotX(k)) <= 11 && Math.abs(w.y - (lotY() - 2)) <= 12);
  if (i < 0) return null;
  const l = a.lots[i]!;
  const pos = pickupScreenPos(run, canvas, zoom, { x: lotX(i), y: lotY() - 4 });
  const sold = l.won ? ` · ${t(l.won === 1 ? "auctionMine" : "auctionTheirs")} ${l.price}G` : "";
  return { icon: lotItem(a, i), name: `${i + 1}. ${lotName(a, i, lang, t)}${sold}`, desc: lotDesc(a, i, lang, t), x: pos.x, y: pos.y, hint: a.lot < 0 ? t("auctionSitHint") : "", compare: null };
}
