// 테일 영역 바다: 둘레 바다 안에 적이 있으면 물 상어가 저절로 나옴 (확률로 삼키기 · 돌진 · 낙하)
// 바다 종류마다: 상어 비율·간격·크기 · 뇌우 번개 · 빙해 느려짐 · 소용돌이 끌어당김
import { TAIL_PERKS as K } from "../itemsTail";
import { createRng, deriveSeed } from "../rng";
import { TAIL as T } from "../weaponsTail";
import { rot } from "./orbit";
import { inCircle, isBoss, onSegment, stun } from "./s2Kit";
import { inSea, seaOf, sharkDmg, sharkSize, tlHit } from "./tailKit";
import type { TlShark } from "./tailTypes";
import type { EnemyState, RunState } from "./types";
import { addEffect, dist2, hasPerk } from "./util";

/** 다음 상어까지 틱 (바다 종류 · 상어 떼 · 공격 속도) */
function interval(s: RunState, speed: number): number {
  const p = s.player;
  return Math.max(10, Math.round((T.sharkEvery * (seaOf(p).every ?? 1) * (hasPerk(p, "tlSchool") ? K.tlSchool.every : 1)) / Math.max(0.3, speed)));
}

/** 뇌우 바다: 문 적에게서 가까운 다른 적에게 번개 */
function stormBolt(s: RunState, from: EnemyState): void {
  const p = s.player;
  if (seaOf(p).sea !== "storm") return;
  let best: EnemyState | undefined;
  for (const e of inCircle(s, from.x, from.y, T.boltReach)) {
    if (e.id !== from.id && (!best || dist2(e, from) < dist2(best, from))) best = e;
  }
  if (!best) return;
  tlHit(s, best, sharkDmg(p, T.boltMul), 0, "shock");
  addEffect(s, { kind: "tlBolt", x: from.x, y: from.y, toX: best.x, toY: best.y, dirX: 0, dirY: 0, size: 6, maxTicks: 14 });
}

/** 상어를 하나 내보냄 (적 e를 노림) */
function spawn(s: RunState, e: EnemyState, k: 0 | 1 | 2, flip: number): void {
  const p = s.player;
  const size = sharkSize(p);
  const list = (p.tlSharks ??= []);
  const base = { x: e.x, y: e.y, id: e.id, dx: 0, dy: 0, sp: 0, hit: [] as number[] };
  if (k === 0) {
    const jaws = hasPerk(p, "tlJaws");
    list.push({ ...base, k, t: T.mawTicks, t0: T.mawTicks, r: T.mawR * size * (jaws ? K.tlJaws.r : 1), dmg: sharkDmg(p, T.mawMul * (jaws ? K.tlJaws.mul : 1)) });
  } else if (k === 2) {
    list.push({ ...base, k, t: T.diveTicks, t0: T.diveTicks, r: T.diveR * size * (hasPerk(p, "tlBreach") ? K.tlBreach.r : 1), dmg: sharkDmg(p, T.diveMul) });
  } else {
    // 나 → 적 방향을 조금 비튼 쪽으로, 적 뒤 바다에서 튀어나와 적을 꿰뚫고 다시 잠수
    const len = Math.hypot(e.x - p.x, e.y - p.y) || 1;
    const [c, sn] = rot(0.9 * flip);
    const ux = (e.x - p.x) / len;
    const uy = (e.y - p.y) / len;
    const sp = T.dashStep * (seaOf(p).sea === "mako" ? T.makoStep : 1);
    const add = (dx: number, dy: number, mul: number) => {
      const x = e.x - dx * 56;
      const y = e.y - dy * 56;
      const t = Math.ceil(112 / sp);
      list.push({ ...base, k, x, y, dx, dy, sp, t, t0: t, r: T.dashW * size, dmg: sharkDmg(p, T.dashMul * mul), hit: [] });
      addEffect(s, { kind: "tlLeap", x, y, dirX: dx, dirY: dy, size: 12 * size, maxTicks: 16 });
    };
    const dx = ux * c - uy * sn;
    const dy = ux * sn + uy * c;
    add(dx, dy, 1);
    if (hasPerk(p, "tlRip")) add(-dx, -dy, K.tlRip.mul);
  }
  if (list.length > 10) list.shift();
}

/** 상어 하나 한 틱 · 끝나면 false */
function sharkStep(s: RunState, w: TlShark): boolean {
  const p = s.player;
  w.t--;
  if (w.k === 1) {
    const ax = w.x;
    const ay = w.y;
    w.x += w.dx * w.sp;
    w.y += w.dy * w.sp;
    for (const e of onSegment(s, ax, ay, w.x, w.y, w.r)) {
      if (w.hit.includes(e.id)) continue;
      w.hit.push(e.id);
      tlHit(s, e, w.dmg, isBoss(e) ? 0 : 7, "tide");
      if (w.hit.length === 1) stormBolt(s, e);
    }
    if (w.t <= 0) addEffect(s, { kind: "tlSplash", x: w.x, y: w.y, dirX: w.dx, dirY: w.dy, size: 14 * sharkSize(p), maxTicks: 18 });
    return w.t > 0;
  }
  // 삼키기·낙하: 내리치기 직전까지 노리는 적을 따라감
  const e = s.enemies.find((o) => o.id === w.id && o.hp > 0);
  if (e && w.t > 5) {
    w.x = e.x;
    w.y = e.y;
  }
  if (w.t > 0) return true;
  const hits = inCircle(s, w.x, w.y, w.r);
  for (const o of hits) {
    if (w.k === 0) {
      tlHit(s, o, w.dmg, 0, "tide", false);
      const d = Math.hypot(w.x - o.x, w.y - o.y);
      if (d > 1 && !isBoss(o) && o.kind !== "dummy") {
        const m = Math.min(d, T.mawPull);
        o.x += ((w.x - o.x) / d) * m;
        o.y += ((w.y - o.y) / d) * m;
      }
    } else {
      tlHit(s, o, w.dmg, 10, "tide");
      const k = (seaOf(p).sea === "hammer" ? T.hammerStun : 1) * (hasPerk(p, "tlBreach") ? K.tlBreach.stun : 1);
      stun(o, Math.round(T.diveStun * k));
    }
  }
  if (hits[0]) stormBolt(s, hits[0]);
  addEffect(s, { kind: w.k === 0 ? "tlMaw" : "tlSlam", x: w.x, y: w.y, dirX: 0, dirY: 0, size: w.r, maxTicks: w.k === 0 ? 22 : 26 });
  return false;
}

/** 바다 종류: 빙해 느려짐 · 소용돌이 끌어당김 */
function seaField(s: RunState, near: EnemyState[]): void {
  const p = s.player;
  const sea = seaOf(p).sea;
  if (sea === "frost") for (const e of near) e.slowTicks = Math.max(e.slowTicks ?? 0, T.frostSlow);
  if (sea !== "whirl") return;
  for (const e of near) {
    if (isBoss(e) || e.kind === "dummy") continue;
    const d = Math.hypot(p.x - e.x, p.y - e.y);
    if (d < 14) continue;
    e.x += ((p.x - e.x) / d) * T.whirlPull;
    e.y += ((p.y - e.y) / d) * T.whirlPull;
  }
}

/** 틱마다: 상어 움직이기 · 바다 안에 적이 있으면 새 상어 */
export function seaTick(s: RunState, speed: number): void {
  const p = s.player;
  if (p.tlSharks) {
    p.tlSharks = p.tlSharks.filter((w) => sharkStep(s, w));
    if (p.tlSharks.length === 0) delete p.tlSharks;
  }
  const near = inSea(s);
  seaField(s, near);
  if ((p.tlCd ?? 0) > 0) {
    p.tlCd = (p.tlCd ?? 0) - 1;
    return;
  }
  if (near.length === 0) return;
  const rng = createRng(deriveSeed(s.seed, "tlShark", s.tick, near.length));
  const e = near[Math.floor(rng.nextFloat() * near.length)]!;
  const w = seaOf(p).w ?? [T.wMaw, T.wDash, T.wDive];
  let r = rng.nextFloat() * (w[0] + w[1] + w[2]);
  const k: 0 | 1 | 2 = r < w[0] ? 0 : (r -= w[0]) < w[1] ? 1 : 2;
  spawn(s, e, k, rng.nextFloat() < 0.5 ? 1 : -1);
  p.tlCd = interval(s, speed);
}
