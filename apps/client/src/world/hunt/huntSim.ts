// 지도 사냥 계산 (화면에서만, 순위·서버와 상관없음): 몬스터 나기·돌아다니기·쫓기·예고 뒤 때리기·다시 나기 · 내 휘두르기·대시·체력·쓰러짐
// 몬스터 자리·돌아다니기는 시드 랜덤(지역마다) · 각도는 sim/orbit 대신 atan2 비교만 (그림·판정 모두 화면 전용)
import { createRng, deriveSeed, type CharacterId } from "@pixel-rogue/shared";
import type { Walker } from "../../lobby/walker";
import { WTILE } from "../worldMap";
import { groundsIn, HUNT_RULES as R, type HuntGround } from "./huntGrounds";
import { huntStats, type HuntStats } from "./huntStats";

export interface Mob {
  g: HuntGround;
  x: number;
  y: number;
  hp: number;
  /** idle 돌아다님 · chase 쫓음 · windup 때리기 예고 · home 사냥터로 돌아감 · dead 다시 나기 기다림 */
  st: "idle" | "chase" | "windup" | "home" | "dead";
  /** 지금 상태 남은 시간 · 다음 공격까지 */
  t: number;
  cd: number;
  /** 돌아다닐 곳 · 바라보는 쪽(왼쪽이면 true) · 맞은 반짝임 */
  wx: number;
  wy: number;
  left: boolean;
  flash: number;
}
export interface Pop {
  x: number;
  y: number;
  text: string;
  color: string;
  t: number;
}
export interface HuntMe {
  hp: number;
  st: HuntStats;
  /** 휘두르기 재사용 · 휘두른 그림 남은 시간 · 휘두른 방향 */
  swingCd: number;
  swingT: number;
  sx: number;
  sy: number;
  dashT: number;
  dashCd: number;
  dx: number;
  dy: number;
  /** 마지막으로 맞은 뒤 지난 시간 · 쓰러진 남은 시간 */
  calm: number;
  down: number;
}
export interface Hunt {
  mobs: Mob[];
  me: HuntMe;
  pops: Pop[];
}

type Stand = (x: number, y: number) => boolean;
/** 휘두른 그림이 보이는 시간 (초) */
export const SWING_SHOW = 0.22;
const cx = (g: HuntGround) => (g.tx + 0.5) * WTILE;
const cy = (g: HuntGround) => (g.ty + 0.5) * WTILE;

export function createHunt(region: string, who: CharacterId): Hunt & { rnd: () => number } {
  const rng = createRng(deriveSeed(7, "hunt", region));
  const rnd = () => rng.nextFloat();
  const st = huntStats(who);
  const mobs: Mob[] = groundsIn(region).flatMap((g) => Array.from({ length: g.count }, (): Mob => ({ g, x: cx(g), y: cy(g), hp: 0, st: "dead", t: 0, cd: 0, wx: cx(g), wy: cy(g), left: false, flash: 0 })));
  return { mobs, pops: [], rnd, me: { hp: st.maxHp, st, swingCd: 0, swingT: 0, sx: 0, sy: 1, dashT: 0, dashCd: 0, dx: 0, dy: 0, calm: 99, down: 0 } };
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

const pop = (h: Hunt, x: number, y: number, text: string, color: string) => h.pops.push({ x, y, text, color, t: 0.8 });

/** 나를 때림 (대시 중·쓰러짐은 안 맞음) */
function hurt(h: Hunt & { rnd: () => number }, me: Walker, dmg: number): void {
  const s = h.me;
  if (s.dashT > 0 || s.down > 0) return;
  const half = s.st.half > 0 && h.rnd() < s.st.half ? 0.5 : 1;
  const n = Math.max(1, Math.round(dmg * s.st.taken * half));
  s.hp -= n;
  s.calm = 0;
  pop(h, me.x, me.y - 14, `-${n}`, "#ff6a6a");
  if (s.hp <= 0) [s.hp, s.down] = [0, R.downTime];
}

/** 한 장면: 몬스터·나 · 쓰러졌다 일어나면 true (WorldStage가 처음 자리로 옮김) · 잡은 사냥터 id는 onKill */
export function stepHunt(h: Hunt & { rnd: () => number }, me: Walker, dt: number, stand: Stand, onKill: (g: string) => void): boolean {
  const s = h.me;
  let woke = false;
  for (const p of h.pops) [p.t, p.y] = [p.t - dt, p.y - 18 * dt];
  h.pops = h.pops.filter((p) => p.t > 0);
  s.swingCd -= dt;
  s.swingT -= dt;
  s.dashCd -= dt;
  s.calm += dt;
  if (s.down > 0) {
    s.down -= dt;
    if (s.down <= 0) [s.hp, woke] = [s.st.maxHp, true];
  } else {
    const heal = s.st.regen + (s.calm > R.restAfter ? s.st.maxHp * R.restHeal : 0);
    s.hp = Math.min(s.st.maxHp, s.hp + heal * dt);
  }
  if (s.dashT > 0) {
    s.dashT -= dt;
    const sp = 80 * R.dashMul * s.st.moveMul * dt;
    const nx = me.x + s.dx * sp;
    const ny = me.y + s.dy * sp;
    if (stand(nx, ny)) [me.x, me.y] = [nx, ny];
  }
  // 휘두르기로 쓰러진 몬스터 → 다시 나기 기다림
  for (const m of h.mobs) {
    if (m.st === "dead" || m.hp > 0) continue;
    [m.st, m.t] = ["dead", m.g.respawn];
    onKill(m.g.id);
  }
  for (const m of h.mobs) {
    m.flash -= dt;
    m.t -= dt;
    m.cd -= dt;
    if (m.st === "dead") {
      if (m.t > 0) continue;
      [m.x, m.y] = spot(m.g, h.rnd, stand);
      [m.hp, m.st, m.t] = [m.g.hp, "idle", 1];
      continue;
    }
    const d = Math.hypot(me.x - m.x, me.y - m.y);
    const away = Math.hypot(m.x - cx(m.g), m.y - cy(m.g)) > m.g.rad * WTILE * R.leash;
    const sees = s.down <= 0 && d < R.aggro;
    if (m.st === "windup") {
      if (m.t <= 0) {
        if (d < m.g.r + 5 + R.reach + 4) hurt(h, me, m.g.dmg);
        [m.st, m.cd] = ["chase", R.attackGap];
      }
      continue;
    }
    if (m.st === "home" || away) {
      m.st = "home";
      move(m, cx(m.g), cy(m.g), m.g.speed * 1.4 * dt, stand);
      if (Math.hypot(m.x - cx(m.g), m.y - cy(m.g)) < WTILE * 2) [m.st, m.hp] = ["idle", m.g.hp];
      continue;
    }
    if (sees) {
      m.st = "chase";
      if (d < m.g.r + 5 + R.reach && m.cd <= 0) [m.st, m.t] = ["windup", R.windup];
      else if (d > m.g.r + 5) move(m, me.x, me.y, m.g.speed * dt, stand);
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
  const live = h.mobs.filter((m) => m.st !== "dead");
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

/** 휘두르기 (J·좌클릭): 바라보는 쪽(좌클릭이면 마우스 쪽) 부채꼴 안 몬스터 */
export function swing(h: Hunt & { rnd: () => number }, me: Walker, aim?: readonly [number, number]): void {
  const s = h.me;
  if (s.swingCd > 0 || s.down > 0) return;
  if (aim) [me.fx, me.fy] = aim;
  const len = Math.hypot(me.fx, me.fy) || 1;
  [s.sx, s.sy] = [me.fx / len, me.fy / len || (me.fx ? 0 : 1)];
  [s.swingCd, s.swingT] = [R.swingGap * s.st.gapMul, SWING_SHOW];
  const reach = R.swingReach * s.st.reachMul;
  const face = Math.atan2(s.sy, s.sx);
  for (const m of h.mobs) {
    if (m.st === "dead") continue;
    const d = Math.hypot(m.x - me.x, m.y - me.y);
    if (d > reach + m.g.r) continue;
    let a = Math.abs(Math.atan2(m.y - me.y, m.x - me.x) - face);
    if (a > Math.PI) a = Math.PI * 2 - a;
    if (d > m.g.r + 6 && a > R.swingArc) continue;
    const crit = h.rnd() < s.st.crit;
    const n = Math.max(1, Math.round(s.st.dmg * (crit ? s.st.critDmg : 1)));
    m.hp -= n;
    m.flash = 0.15;
    if (m.st === "idle") [m.st, m.cd] = ["chase", 0.4];
    // 조금 밀려남
    m.x += ((m.x - me.x) / (d || 1)) * 4;
    m.y += ((m.y - me.y) / (d || 1)) * 4;
    s.hp = Math.min(s.st.maxHp, s.hp + n * s.st.lifesteal);
    pop(h, m.x, m.y - m.g.r - 6, crit ? `${n}!` : String(n), crit ? "#ffd84a" : "#ffffff");
  }
}

/** 대시 (Shift·K·우클릭): 우클릭이면 마우스 쪽 · 아니면 걷는 쪽(없으면 바라보는 쪽)으로 짧게 · 그동안 안 맞음 */
export function dash(h: Hunt, me: Walker, keys: ReadonlySet<string>, aim?: readonly [number, number]): void {
  const s = h.me;
  if (s.dashCd > 0 || s.down > 0) return;
  let x = (keys.has("KeyD") || keys.has("ArrowRight") ? 1 : 0) - (keys.has("KeyA") || keys.has("ArrowLeft") ? 1 : 0);
  let y = (keys.has("KeyS") || keys.has("ArrowDown") ? 1 : 0) - (keys.has("KeyW") || keys.has("ArrowUp") ? 1 : 0);
  if (aim) [x, y] = aim;
  if (!x && !y) [x, y] = [me.fx, me.fy];
  const len = Math.hypot(x, y) || 1;
  [s.dx, s.dy, s.dashT, s.dashCd] = [x / len, y / len, R.dashTime, R.dashGap * s.st.dashMul];
}
