// 경매장 '암흑가' (비밀의 방, sim/vault): 대강당 무대 위 상품 5개(4번째부터 ???) · 진행자 · 의자에 그림자 손님들
// 상품마다 숨은 값어치(플레이어는 모름)가 있고, 그림자 손님은 그 값을 넘겨 부르지 않음
// 맨 앞줄 가운데 손님 의자에 F로 앉으면 경매 시작·창 (입찰(+10) · 포기). 다시 F(Esc)면 일어남. 아무도 더 부르지 않으면 하나·둘·셋 → 낙찰 (내가 앞서면 돈을 내고 받음)
// 상품: 무작위 패시브 또는 증강 기술 하나 (광야의 새벽 각성 기술, 낙찰받으면 가진 패시브 중 골라 붙임)
import type { PassiveId } from "../items";
import { AUCTION } from "../secretDefs";
import { createRng, deriveSeed } from "../rng";
import { depth } from "./hero";
import { recalcStats } from "./items";
import { addPickup, CX, CY, passivePool, pickDistinct, seatSalt } from "./loot";
import { SKILLS, type SwarmSkill } from "./swarmEvo";
import type { Pickup, RunState } from "./types";
import type { AuctionState } from "./vaultTypes";
import { addEffect, ROOM_MIN_Y } from "./util";

/** 입력 menu 기능 번호: 경매 (a = 0 시작 · 1 입찰 · 2 포기 · 10 + n = 증강을 n번째 패시브에 붙임) */
export const AUCTION_OP = 15;
/** 진행자 자리 · 상품 줄 · 상품 사이 · 낙찰 뒤 다음 상품까지 틱 · 그림자 손님 자리 수 */
export const hostY = () => ROOM_MIN_Y + 30;
export const lotY = () => ROOM_MIN_Y + 22;
export const LOT_GAP = 30;
export const SHADOW_SEATS = 14;
/** 내 의자 (맨 앞줄 가운데, 바닥 물건 kind "auction") */
export const mySeatY = () => CY + 6;
const PAUSE = 60;

const roomKey = (s: RunState) => s.floor * 1000 + s.roomId;
/** 이 방의 경매 (없으면 null) */
export const auctionHere = (s: RunState): AuctionState | null => (s.player.auction?.room === roomKey(s) ? s.player.auction : null);
/** 다음에 부를 값 (아무도 안 불렀으면 시작가 그대로) */
export const nextBid = (a: AuctionState) => (a.lead === 0 ? a.price : a.price + AUCTION.step);
/** 하나·둘·셋 단계 (0 = 아직, 1~3) */
export const goingStage = (a: AuctionState, tick: number) => Math.max(0, Math.min(3, Math.floor((tick - a.t) / AUCTION.going)));
/** 상품이 ???로 보이는지 (4번째부터, 낙찰되면 보임) */
export const lotHidden = (a: AuctionState, i: number) => i >= AUCTION.hidden && !a.lots[i]?.won;

const roundStep = (v: number) => Math.max(AUCTION.step, Math.round(v / AUCTION.step) * AUCTION.step);
const wait = (s: RunState, a: AuctionState) => createRng(deriveSeed(s.seed, "auctionWait", s.floor, s.roomId, a.lot, a.bids, ...seatSalt(s))).int(AUCTION.waitMin, AUCTION.waitMax);

/** 방에 처음 들어가면: 진행자 · 상품 다섯 (값어치는 층이 깊을수록 큼) */
export function spawnAuction(s: RunState, roomId: number): void {
  addPickup(s, roomId, "auction", "0", CX, mySeatY(), 0);
  const rng = createRng(deriveSeed(s.seed, "auction", s.floor, roomId, ...seatSalt(s)));
  const passives = pickDistinct(rng, passivePool(s), AUCTION.lots);
  const lots = Array.from({ length: AUCTION.lots }, (_, i) => {
    const aug = rng.nextFloat() < AUCTION.augChance;
    const value = roundStep((AUCTION.valueMin + rng.nextFloat() * (AUCTION.valueMax - AUCTION.valueMin)) * (1 + AUCTION.perFloor * (depth(s) - 1)));
    return { kind: aug ? ("aug" as const) : ("passive" as const), id: aug ? rng.pick(SKILLS) : (passives[i] ?? passives[0] ?? "whetstone"), value };
  });
  s.player.auction = { room: s.floor * 1000 + roomId, lots, lot: -1, price: 0, lead: 0, who: 0, t: 0, next: 0, bids: 0 };
}

/** 내 의자 앞 (station.stationAt): F = 앉기(처음이면 경매 시작)·일어나기. 앉아 있는 동안 창이 열림 (itemId "1" = 앉음) */
export function auctionAt(s: RunState, pk: Pickup, interact: boolean): void {
  const a = auctionHere(s);
  if (s.prompt.kind !== "none" || !a) return;
  if (interact) pk.itemId = pk.itemId === "1" ? "0" : "1";
  if (interact && pk.itemId === "1" && a.lot < 0) startLot(s, a, 0, s.tick + 30);
  s.prompt = { kind: "station", station: "auction", open: pk.itemId === "1" };
}

/** 앉아 있으면 의자에 붙어 있음 (걸음·대시를 해도 틱 끝에 의자로, vaultTick은 움직임 다음) */
function stayOnSeat(s: RunState): void {
  const seat = s.rooms[s.roomId]?.pickups.find((pk) => pk.kind === "auction" && pk.itemId === "1");
  if (!seat) return;
  const p = s.player;
  p.x = seat.x;
  p.y = seat.y - 2;
}

function startLot(s: RunState, a: AuctionState, i: number, at: number): void {
  a.lot = i;
  a.lead = 0;
  a.bids = 0;
  a.t = at;
  const lot = a.lots[i];
  if (!lot) return;
  a.price = roundStep(lot.value * AUCTION.start);
  a.next = at + wait(s, a);
}

/** 낙찰 */
function sell(s: RunState, a: AuctionState): void {
  const lot = a.lots[a.lot]!;
  const p = s.player;
  lot.price = a.price;
  lot.won = a.lead === 1 ? 1 : 2;
  addEffect(s, { kind: "srSold", x: CX, y: hostY(), dirX: lot.won, dirY: 0, size: 40, maxTicks: 50 });
  if (lot.won === 1) {
    s.gold -= Math.min(s.gold, a.price);
    addEffect(s, { kind: "srMoney", x: p.x, y: p.y, toX: CX, toY: hostY(), dirX: 0, dirY: 0, size: Math.min(24, 6 + a.price / 20), maxTicks: 50 });
    if (lot.kind === "passive") {
      p.passives.push(lot.id as PassiveId);
      recalcStats(s);
    } else {
      // 증강: 패시브가 없으면 무작위 패시브 하나를 같이 받음 (붙일 곳)
      if (p.passives.length === 0) p.passives.push(...pickDistinct(createRng(deriveSeed(s.seed, "auctionHost", s.floor, s.roomId)), passivePool(s), 1));
      recalcStats(s);
      a.graft = a.lot;
    }
  }
  startLot(s, a, a.lot + 1, s.tick + PAUSE);
}

/** 창에서 누른 것 */
export function auctionMenu(s: RunState, n: number): void {
  const a = auctionHere(s);
  if (!a) return;
  const p = s.player;
  if (n >= 10) {
    const keep = p.passives[n - 10];
    const lot = a.graft !== undefined ? a.lots[a.graft] : undefined;
    if (!keep || !lot) return;
    (p.augments ??= []).push({ passive: keep, skills: [lot.id as SwarmSkill] });
    delete a.graft;
    a.t = s.tick + PAUSE;
    a.next = a.t + wait(s, a);
    return;
  }
  if (n === 0 && a.lot < 0) return startLot(s, a, 0, s.tick + 30);
  if (a.lot < 0 || a.lot >= a.lots.length || a.graft !== undefined || s.tick < a.t) return;
  if (n === 2 && a.lead !== 1) {
    a.lead = 2;
    return sell(s, a);
  }
  if (n !== 1 || a.lead === 1 || s.gold < nextBid(a)) return;
  a.price = nextBid(a);
  a.lead = 1;
  a.bids++;
  a.t = s.tick;
  a.next = s.tick + wait(s, a);
  addEffect(s, { kind: "srBid", x: p.x, y: p.y, dirX: -1, dirY: 0, size: a.price, maxTicks: 30 });
}

/** 틱마다 (사람마다): 그림자 손님이 부름 · 하나·둘·셋 → 낙찰 */
export function auctionTick(s: RunState): void {
  const a = auctionHere(s);
  if (a && s.map.rooms[s.roomId]?.type === "auction") stayOnSeat(s);
  if (!a || a.lot < 0 || a.lot >= a.lots.length || s.map.rooms[s.roomId]?.type !== "auction") return;
  if (a.graft !== undefined) {
    a.t = s.tick + PAUSE;
    a.next = a.t + 1;
    return;
  }
  if (s.tick < a.t) return;
  const lot = a.lots[a.lot]!;
  if (a.lead !== 2 && s.tick >= a.next && nextBid(a) <= lot.value) {
    a.price = nextBid(a);
    a.lead = 2;
    a.bids++;
    a.t = s.tick;
    a.who = createRng(deriveSeed(s.seed, "auctionWho", s.floor, s.roomId, a.lot, a.bids)).int(0, SHADOW_SEATS - 1);
    addEffect(s, { kind: "srBid", x: CX, y: hostY(), dirX: a.who, dirY: 0, size: a.price, maxTicks: 30 });
    return;
  }
  if (s.tick - a.t >= AUCTION.going * 3) {
    if (a.lead === 0) a.lead = 2;
    sell(s, a);
  }
}
