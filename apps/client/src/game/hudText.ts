// HUD 글자: 시간, 상호작용 안내, 바닥 아이템 설명
import { GYM_DEVICE } from "../i18n/items/station";
import { devilCost, type DevilId, FLOOR_COUNT, HERO_FLOORS, isCapture, nearBuff, nearPortal, TICK_RATE, type RunState } from "@pixel-rogue/shared";
import type { Lang, TextKey } from "../i18n";
import { itemDesc, itemName } from "../i18n/items";
import { routeAsk } from "./routePlan";

export function formatTime(ticks: number): string {
  const sec = Math.floor(ticks / TICK_RATE);
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
}

/** 상호작용(F·버튼) 안내. 없으면 빈 글자 */
export function promptText(run: RunState, lang: Lang, t: (k: TextKey) => string): string {
  const pr = run.prompt;
  // 미리 정한 길: 방을 정리했으면 F로 다음 방 (game/routePlan)
  if (routeAsk(run)) return t("routeAsk");
  // 패왕전은 쓰러짐 안내를 위쪽(PwFeed)에서 따로 보여 줌
  if (run.party && run.player.hp <= 0) return run.pvp ? "" : t("coopDown");
  // 전쟁의 서막 포털
  if (run.pvp && nearPortal(run, run.seat ?? 0)) return t("pwPortalPrompt");
  // 점령전 버프 자리 옆
  if (run.pvp && isCapture(run) && !run.pvp.seats[run.seat ?? 0]?.chan && nearBuff(run, run.player.x, run.player.y) >= 0) return t("pwCapBuffPrompt");
  if (pr.kind === "feed") return t(pr.has ? "promptFeed" : "promptFeedNone");
  if (pr.kind === "revive") return t(pr.ready ? "promptRevive" : "promptReviveWait");
  if (pr.kind === "gather") return t("promptGather").replace("{have}", String(pr.have)).replace("{need}", String(pr.need));
  if (pr.kind === "pick") {
    const pk = run.rooms[run.roomId]?.pickups.find((x) => x.id === pr.pickupId);
    if (!pk) return "";
    return `${t("promptPick")}: ${itemName(pk.kind, pk.itemId, lang)} — ${itemDesc(pk.kind, pk.itemId, lang, t)}`;
  }
  if (pr.kind === "buy") {
    const pk = run.rooms[run.roomId]?.pickups.find((x) => x.id === pr.pickupId);
    if (!pk) return "";
    const head = run.gold >= pr.price ? t("promptBuy") : t("promptNoGold");
    return `${head.replace("{price}", String(pr.price))}: ${itemName(pk.kind, pk.itemId, lang)} — ${itemDesc(pk.kind, pk.itemId, lang, t)}`;
  }
  if (pr.kind === "station" && pr.station === "devil") {
    const pk = run.rooms[run.roomId]?.pickups.find((x) => x.id === run.nearPickupId && x.kind === "devil");
    const no = run.player.devil?.last && !run.player.devil.last.ok && run.tick - run.player.devil.last.tick < 90;
    return no ? t("promptDevilNo") : pk ? t("promptDevil").replace("{name}", itemName("passive", pk.itemId, lang)).replace("{cost}", String(devilCost(pk.itemId as DevilId, run.player))) : "";
  }
  if (pr.kind === "station") return t(pr.open ? "promptStationOpen" : "promptStation").replace("{name}", pr.station === "gym" ? GYM_DEVICE[pr.device ?? 0]![lang] : itemName(pr.station, "", lang));
  if (pr.kind === "trash") return t(pr.confirm ? "promptTrashSure" : "promptTrash").replace("{price}", String(pr.price));
  if (pr.kind === "flee") return run.player.hp > pr.cost ? t("promptFlee").replace("{cost}", String(pr.cost)) : t("promptNoHp");
  if (pr.kind === "stairs") return t(run.floor >= (run.hero ? HERO_FLOORS : FLOOR_COUNT) && !run.endless ? "promptEscape" : "promptStairs");
  return "";
}

/** 가까운 바닥 아이템 이름·설명 */
export function pickupText(run: RunState, lang: Lang, t: (k: TextKey) => string): string {
  const pk = run.rooms[run.roomId]?.pickups.find((x) => x.id === run.nearPickupId);
  if (!pk || pk.kind === "coin") return "";
  if (pk.price > 0 && pk.kind !== "trash" && pk.kind !== "bench" && pk.kind !== "tune" && pk.kind !== "gym" && pk.kind !== "boon") return `${itemName(pk.kind, pk.itemId, lang)} (${pk.price}G) — ${itemDesc(pk.kind, pk.itemId, lang, t)}`;
  return `${itemName(pk.kind, pk.itemId, lang)} — ${itemDesc(pk.kind, pk.itemId, lang, t)}`;
}
