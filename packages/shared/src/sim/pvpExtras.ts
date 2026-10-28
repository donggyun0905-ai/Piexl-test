// 패왕전 경기장 물건: 사용 아이템·강화 구슬 떨어뜨리기(모든 모드) · 강화 구슬 줍기 · 얼음 시계 폭탄(던져서 범위 얼리기) · 받은·준 피해 합
import { TILE_SIZE } from "../constants";
import type { UseItemId } from "../items";
import { PW } from "../paewangDefs";
import { PW_ARENAS } from "../paewangMaps";
import { createRng, deriveSeed } from "../rng";
import { healPlayer } from "./combat";
import { AIM_DIST_STEP, type TickInput } from "./inputTypes";
import { TILE_FLOOR } from "./layout";
import { addPickup } from "./loot";
import { pwGrid } from "./paewangGrid";
import { eachSeat, seatNo } from "./party";
import { inPlay } from "./pvpWorld";
import type { RunState } from "./types";
import { addEffect } from "./util";

/** 경기장에 떨어지는 사용 아이템 (돈주머니 등 대결에 쓸모없는 것은 뺌) */
const DROP_USES: readonly UseItemId[] = ["potion", "bomb", "ward", "frost"];

/** 간격마다 경기장 아무 바닥에 사용 아이템 또는 강화 구슬 (누구나 주울 수 있음) */
export function updateDrops(s: RunState): void {
  const pv = s.pvp!;
  if (s.tick % PW.dropEvery !== 0) return;
  const room = s.rooms[s.roomId]!;
  const orbs = (pv.orbs ??= []);
  if (room.pickups.length + orbs.length >= (pv.mode === "brawl" ? PW.dropMaxBrawl : PW.dropMax)) return;
  const def = PW_ARENAS[pv.arena];
  const grid = pwGrid(pv.arena);
  const rng = createRng(deriveSeed(s.seed, "pwDrop", s.tick));
  // 막힌 칸(벽·나무·물)이 아닌 곳을 몇 번 찾아봄
  for (let k = 0; k < 8; k++) {
    const c = 2 + Math.floor(rng.nextFloat() * (def.cols - 4));
    const r = 2 + Math.floor(rng.nextFloat() * (def.rows - 4));
    if (grid[r * def.cols + c] !== TILE_FLOOR) continue;
    const x = (c + 0.5) * TILE_SIZE;
    const y = (r + 0.5) * TILE_SIZE;
    if (rng.nextFloat() < 0.5) {
      addPickup(s, s.roomId, "use", rng.pick(DROP_USES), x, y);
      delete room.pickups[room.pickups.length - 1]!.owner;
    } else orbs.push({ id: s.nextId++, kind: Math.floor(rng.nextFloat() * 3) as 0 | 1 | 2, x, y });
    addEffect(s, { kind: "burst", x, y, dirX: 0, dirY: 0, size: 16, maxTicks: 20 });
    return;
  }
}

/** 강화 구슬 줍기: 회복 · 공격 속도 · 이동 속도 (닿으면 바로) · 이동 강화 시간 줄이기 */
export function pickOrbs(s: RunState): void {
  const pv = s.pvp!;
  eachSeat(s, (i) => {
    const p = s.player;
    if ((p.pwFast ?? 0) > 0) p.pwFast = (p.pwFast ?? 0) - 1;
    if (!inPlay(s, i) || !pv.orbs?.length) return;
    const at = pv.orbs.findIndex((o) => (o.x - p.x) ** 2 + (o.y - p.y) ** 2 <= (p.r + 7) ** 2);
    if (at < 0) return;
    const o = pv.orbs.splice(at, 1)[0]!;
    if (o.kind === 0) healPlayer(s, p.stats.maxHp * PW.orbHeal);
    else if (o.kind === 1) p.hasteTicks = PW.orbTicks;
    else p.pwFast = PW.orbTicks;
    addEffect(s, { kind: "burst", x: o.x, y: o.y, dirX: 0, dirY: 0, size: 12, maxTicks: 14 });
  });
}

/** 얼음 시계 (패왕전): 누른 곳 쪽으로 얼음 폭탄을 던짐 (최대 iceRange) */
export function throwIce(s: RunState, input: TickInput): void {
  const p = s.player;
  const len = Math.hypot(input.aimX, input.aimY);
  const dx = len > 0 ? input.aimX / len : p.faceX;
  const dy = len > 0 ? input.aimY / len : p.faceY;
  // 거리 단계가 없으면(조이스틱·AI) 멀리
  const d = Math.min(PW.iceRange, len > 0 ? (len / 100) * AIM_DIST_STEP : PW.iceRange);
  const team = s.pvp!.seats[seatNo(s)]!.team;
  (s.pvp!.ice ??= []).push({ x: p.x, y: p.y, tx: p.x + dx * d, ty: p.y + dy * d, t: PW.iceFly, team });
}

/** 얼음 폭탄 날아가기 · 떨어지면 범위 안 상대를 얼림(기절) · 터진 뒤 잠깐 그림만 남김 */
export function updateIce(s: RunState): void {
  const pv = s.pvp!;
  if (!pv.ice?.length) return;
  for (const b of pv.ice) {
    b.t--;
    if (b.t !== 0) continue;
    eachSeat(s, (i) => {
      const p = s.player;
      if (!inPlay(s, i) || pv.seats[i]!.team === b.team) return;
      if ((p.x - b.tx) ** 2 + (p.y - b.ty) ** 2 > (PW.iceRadius + p.r) ** 2) return;
      pv.seats[i]!.stun = Math.max(pv.seats[i]!.stun, PW.iceStun);
      pv.seats[i]!.iced = s.tick + PW.iceStun;
    });
  }
  pv.ice = pv.ice.filter((b) => b.t > -PW.iceShow);
}
