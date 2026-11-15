// 지도 몬스터 (화면에서만, 순위·서버와 상관없음): 나기·돌아다니기·쫓기·사냥터로 돌아가기·다시 나기 · 내 체력·쓰러짐
// 싸움은 본편 계산으로 (world/battle: 쫓기 시작하면 주변 지도가 본편 판이 됨) · 자리·돌아다니기는 시드 랜덤(지역마다)
import { createRng, deriveSeed, WANDER_RULES, type CharacterId } from "@pixel-rogue/shared";
import type { Walker } from "../../lobby/walker";
import { WTILE } from "../worldMap";
import { groundsIn, HUNT_RULES as R, type HuntGround } from "./huntGrounds";
import { huntStats, type HuntStats } from "./huntStats";

export interface Mob {
  g: HuntGround;
  x: number;
  y: number;
  hp: number;
  /** idle 돌아다님 · chase 쫓음(→ 본편 판) · home 사냥터로 돌아감 · dead 다시 나기 기다림 (판 안에 들어간 동안도) */
  st: "idle" | "chase" | "home" | "dead";
  /** 지금 상태 남은 시간 */
  t: number;
  /** 돌아다닐 곳 · 바라보는 쪽(왼쪽이면 true) */
  wx: number;
  wy: number;
  left: boolean;
}
export interface HuntMe {
  hp: number;
  st: HuntStats;
  /** 대시 준비 몫 (0~1, 본편 판이 적음 · 판 밖에서는 1) */
  dashK: number;
  /** 마지막으로 판이 끝난 뒤 지난 시간 · 쓰러진 남은 시간 */
  calm: number;
  down: number;
}
export interface Hunt {
  mobs: Mob[];
  me: HuntMe;
}

type Stand = (x: number, y: number) => boolean;
const cx = (g: HuntGround) => (g.tx + 0.5) * WTILE;
const cy = (g: HuntGround) => (g.ty + 0.5) * WTILE;

/** 사냥터마다 몬스터 (처음엔 쓰러진 상태라 곧 그 안 빈자리에 남) */
export const mobsOf = (gs: readonly HuntGround[]): Mob[] => gs.flatMap((g) => Array.from({ length: g.count }, (): Mob => ({ g, x: cx(g), y: cy(g), hp: 0, st: "dead", t: 0, wx: cx(g), wy: cy(g), left: false })));

export function createHunt(region: string, who: CharacterId): Hunt & { rnd: () => number } {
  const rng = createRng(deriveSeed(7, "hunt", region));
  const st = huntStats(who);
  return { mobs: mobsOf(groundsIn(region)), rnd: () => rng.nextFloat(), me: { hp: st.maxHp, st, dashK: 1, calm: 99, down: 0 } };
}

/** 사냥터 안 아무 서 있을 수 있는 자리 */
function spot(g: HuntGround, rnd: () => number, stand: Stand, rad = g.rad): [number, number] {
  for (let k = 0; k < 12; k++) {
    const a = rnd() * 2 - 1;
    const b = rnd() * 2 - 1;
    if (a * a + b * b > 1) continue;
    const x = cx(g) + a * rad * WTILE;
    const y = cy(g) + b * rad * WTILE;
    if (stand(x, y)) return [x, y];
  }
  return [cx(g), cy(g)];
}

/** 막히면 한 축씩 */
function move(m: Mob, tx: number, ty: number, dist: number, stand: Stand): void {
  const d = Math.hypot(tx - m.x, ty - m.y);
  if (d < 1) return;
  const k = Math.min(1, dist / d);
  const nx = m.x + (tx - m.x) * k;
  const ny = m.y + (ty - m.y) * k;
  if (stand(nx, ny)) [m.x, m.y] = [nx, ny];
  else if (stand(nx, m.y)) m.x = nx;
  else if (stand(m.x, ny)) m.y = ny;
  if (Math.abs(tx - m.x) > 0.5) m.left = tx < m.x;
}

/** 한 장면: 몬스터·내 회복 · 쓰러졌다 일어나면 true (WorldStage가 가까운 이동석으로 옮김) */
export function stepHunt(h: Hunt & { rnd: () => number }, me: Walker, dt: number, stand: Stand): boolean {
  const s = h.me;
  let woke = false;
  s.calm += dt;
  s.dashK = 1;
  if (s.down > 0) {
    s.down -= dt;
    if (s.down <= 0) [s.hp, woke] = [s.st.maxHp, true];
  } else {
    const heal = s.st.regen + (s.calm > R.restAfter ? s.st.maxHp * R.restHeal : 0);
    s.hp = Math.min(s.st.maxHp, s.hp + heal * dt);
  }
  // 나에게서 먼 몬스터는 멈춤 (들판 떠돌이가 많아서)
  const range = WANDER_RULES.ACTIVE_TILES * WTILE;
  const act = (m: Mob) => Math.abs(m.x - me.x) < range && Math.abs(m.y - me.y) < range;
  for (const m of h.mobs) {
    if (!act(m) && m.st !== "dead") continue;
    m.t -= dt;
    if (m.st === "dead") {
      if (m.t > 0) continue;
      [m.x, m.y] = spot(m.g, h.rnd, stand);
      [m.hp, m.st, m.t] = [m.g.hp, "idle", 1];
      continue;
    }
    const d = Math.hypot(me.x - m.x, me.y - m.y);
    const away = Math.hypot(m.x - cx(m.g), m.y - cy(m.g)) > m.g.rad * WTILE * R.leash;
    if (m.st === "home" || away) {
      m.st = "home";
      move(m, cx(m.g), cy(m.g), m.g.speed * 1.4 * dt, stand);
      if (Math.hypot(m.x - cx(m.g), m.y - cy(m.g)) < WTILE * 2) m.st = "idle";
      continue;
    }
    if (s.down <= 0 && d < R.aggro) {
      m.st = "chase";
      if (d > m.g.r + 5) move(m, me.x, me.y, m.g.speed * dt, stand);
      continue;
    }
    m.st = "idle";
    if (m.t <= 0) {
      [m.wx, m.wy] = spot(m.g, h.rnd, stand, m.g.rad * 0.7);
      m.t = 2 + h.rnd() * 2;
    }
    move(m, m.wx, m.wy, m.g.speed * 0.5 * dt, stand);
  }
  // 몬스터끼리 겹치지 않게 조금씩 밀어냄
  const live = h.mobs.filter((m) => m.st !== "dead" && act(m));
  for (let i = 0; i < live.length; i++)
    for (let j = i + 1; j < live.length; j++) {
      const a = live[i]!;
      const b = live[j]!;
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const need = (a.g.r + b.g.r) * 0.9;
      if (d >= need) continue;
      const [ux, uy] = d > 0.01 ? [(a.x - b.x) / d, (a.y - b.y) / d] : [1, 0];
      const k = Math.min(need - d, 30 * dt) / 2;
      if (stand(a.x + ux * k, a.y + uy * k)) [a.x, a.y] = [a.x + ux * k, a.y + uy * k];
      if (stand(b.x - ux * k, b.y - uy * k)) [b.x, b.y] = [b.x - ux * k, b.y - uy * k];
    }
  return woke;
}
