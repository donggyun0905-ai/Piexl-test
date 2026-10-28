// 패왕전 스킬 시전: 1~4 키 → 누른 곳(사거리 안)으로 지점·직선·부채꼴·자신·돌진·순간이동·소환 · 재사용 대기 · 침묵이면 못 씀
// 피해·상태이상·회복·버프는 pwSkillHit, 틱마다 처리(돌진·예고·장판·소환)는 pwSkillRun
import { PW } from "../paewangDefs";
import { kitOf, type PwSkillDef } from "../pwKits";
import { AIM_DIST_STEP, type TickInput } from "./inputTypes";
import { seatNo } from "./party";
import { inPlay } from "./pvpWorld";
import { castFx, resolveCast } from "./pwSkillHit";
import type { RunState } from "./types";
import { keepInRoom, roomGrid } from "./util";

/** 지금 자리의 k번 스킬 (없으면 undefined) */
export const skillDef = (s: RunState, k: number): PwSkillDef | undefined => kitOf(s.player.characterId)?.skills[k];

/** 누른 방향·거리 (없으면 바라보는 쪽 · 사거리 끝) */
function aimOf(s: RunState, input: TickInput, range: number): [number, number, number] {
  const p = s.player;
  const len = Math.hypot(input.aimX, input.aimY);
  if (len <= 0) return [p.faceX, p.faceY, range];
  return [input.aimX / len, input.aimY / len, Math.min(range, (len / 100) * AIM_DIST_STEP)];
}

/** k번 스킬을 쓸 수 있는지 (대기 · 침묵 · 돌진 중) */
export function canCast(s: RunState, k: number): boolean {
  const p = s.player;
  const seat = s.pvp!.seats[seatNo(s)]!;
  return !!skillDef(s, k) && (p.pwCd?.[k] ?? 0) <= 0 && (seat.silence ?? 0) <= 0 && !p.pwDash && s.tick > (s.pvp!.readyAt ?? PW.ready);
}

/** 스킬 쓰기 (k: 0~3) */
export function castSkill(s: RunState, k: number, input: TickInput): void {
  const def = skillDef(s, k);
  if (!def || !canCast(s, k)) return;
  const p = s.player;
  const i = seatNo(s);
  const pv = s.pvp!;
  (p.pwCd ??= [0, 0, 0, 0])[k] = Math.round(def.cd * 60);
  const [dx, dy, d] = aimOf(s, input, def.range);
  p.faceX = dx;
  p.faceY = dy;
  const casts = (pv.casts ??= []);
  const left = def.repeat?.n ?? 1;
  switch (def.shape) {
    case "point": {
      const at = { x: p.x + dx * d, y: p.y + dy * d, prevX: 0, prevY: 0, r: 1 };
      keepInRoom(at, roomGrid(s));
      casts.push({ seat: i, k, x: at.x, y: at.y, dx, dy, t: def.delay ?? 0, left });
      if (def.delay) castFx(s, def, at.x, at.y, dx, dy, def.delay, true);
      return;
    }
    case "line":
      casts.push({ seat: i, k, x: p.x, y: p.y, dx, dy, t: def.delay ?? 0, left });
      if (def.delay) castFx(s, def, p.x, p.y, dx, dy, def.delay, true);
      return;
    case "cone":
    case "self":
      casts.push({ seat: i, k, x: p.x, y: p.y, dx, dy, t: 0, left, follow: true });
      return;
    case "dash":
      const total = Math.max(40, d) * (def.repeat ? def.repeat.n : 1);
      p.pwDash = { dx, dy, left: total, total, speed: def.speed ?? 6, hit: [], k };
      castFx(s, def, p.x, p.y, dx, dy, 18);
      return;
    case "blink":
      blink(s, def, k, dx, dy, d);
      return;
    case "summon": {
      const sm = def.summon!;
      const mins = (pv.mins ??= []);
      for (let n = 0; n < sm.n; n++) {
        const a = (n / sm.n) * Math.PI * 2;
        const x = sm.still ? p.x + dx * Math.min(d, 60) : p.x + (n === 0 && sm.n === 1 ? -dx * 14 : Math.cos(a) * 16);
        const y = sm.still ? p.y + dy * Math.min(d, 60) : p.y + (n === 0 && sm.n === 1 ? -dy * 14 : Math.sin(a) * 16);
        // 벽 안에 생기지 않게 방 안으로
        const b = { x, y, prevX: x, prevY: y, r: 4 };
        keepInRoom(b, roomGrid(s));
        mins.push({ id: s.nextId++, seat: i, k, x: b.x, y: b.y, prevX: b.x, prevY: b.y, t: sm.ticks, cd: 20 + n * 6 });
        castFx(s, def, b.x, b.y, 0, 0, 24);
      }
      return;
    }
  }
}

/** 순간이동: 누른 곳으로 (behind: 그쪽 가장 가까운 상대 등 뒤로) · 내려앉은 자리에 피해 */
function blink(s: RunState, def: PwSkillDef, k: number, dx: number, dy: number, d: number): void {
  const p = s.player;
  const ox = p.x;
  const oy = p.y;
  let tx = p.x + dx * d;
  let ty = p.y + dy * d;
  if (def.behind) {
    // 누른 곳에서 가장 가까운 (사거리 안) 상대
    let best: { x: number; y: number; r: number } | null = null;
    let bd = Infinity;
    for (const e of s.enemies) {
      if (e.hp <= 0 || e.immune || (e.x - p.x) ** 2 + (e.y - p.y) ** 2 > (def.range + 20) ** 2) continue;
      const dd = (e.x - tx) ** 2 + (e.y - ty) ** 2;
      if (dd < bd) [bd, best] = [dd, e];
    }
    if (best) {
      const l = Math.hypot(best.x - p.x, best.y - p.y) || 1;
      tx = best.x + ((best.x - p.x) / l) * (best.r + p.r + 4);
      ty = best.y + ((best.y - p.y) / l) * (best.r + p.r + 4);
    }
  }
  p.x = p.prevX = tx;
  p.y = p.prevY = ty;
  keepInRoom(p, roomGrid(s));
  castFx(s, def, ox, oy, dx, dy, 16);
  if (def.hit) s.pvp!.casts!.push({ seat: seatNo(s), k, x: p.x, y: p.y, dx, dy, t: 0, left: 1 });
  else castFx(s, def, p.x, p.y, dx, dy, 16);
}

/** 쓰러졌거나 판이 바뀌면 그 사람의 장판·예고·소환을 없앰 */
export function clearSkills(s: RunState, i: number): void {
  const pv = s.pvp!;
  pv.casts = pv.casts?.filter((c) => c.seat !== i);
  pv.mins = pv.mins?.filter((m) => m.seat !== i);
}

/** 예고·장판 하나 처리 (그 사람 자리를 꺼내 놓고 부름) · 다 쓴 것은 false */
export function stepCast(s: RunState, c: NonNullable<NonNullable<RunState["pvp"]>["casts"]>[number]): boolean {
  if (!inPlay(s, c.seat)) return false;
  if (c.t > 0) {
    c.t--;
    return true;
  }
  const def = skillDef(s, c.k);
  if (!def) return false;
  resolveCast(s, def, c);
  c.left--;
  c.t = (def.repeat?.every ?? 1) - 1;
  return c.left > 0;
}
