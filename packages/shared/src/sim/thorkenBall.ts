// 토르켄 철구공: 닻을 휘두를 때 사슬 끝 철구공이 나를 중심으로 크게 돌며 휩쓸고, 끝나는 자리에서 철구공마다 다른 기술
import { THORKEN_PERKS as K } from "../itemsThorken";
import { THORKEN as T } from "../weaponsThorken";
import { nearest } from "./brawlMoves";
import { healPlayer } from "./combat";
import { rot } from "./orbit";
import { alive, inCircle, shoot } from "./s2Kit";
import { addGauge, chainLen, flailOf, tkHit } from "./thorkenKit";
import { addWhirl, clap } from "./thorkenStorm";
import type { EnemyState, RunState } from "./types";
import { addEffect, dist2 } from "./util";

const TAU = Math.PI * 2;

/** 바라보는 쪽 각도 */
const faceAngle = (s: RunState) => Math.atan2(s.player.faceY, s.player.faceX);

/** 휘두르기 시작: 지금 철구공 자리 → 바라보는 쪽을 지나 반대편까지 (대해일은 한 바퀴) */
export function startSweep(s: RunState): void {
  const p = s.player;
  const st = flailOf(p);
  const a0 = Math.atan2((p.tkBy ?? p.y) - p.y, (p.tkBx ?? p.x) - p.x);
  const arc = st.arc ?? T.sweep;
  let dir = p.tkDir ?? 1;
  let span: number;
  if (arc >= TAU - 0.1) span = TAU;
  else {
    // 공이 있는 쪽에서 바라보는 쪽으로 도는 짧은 방향, 바라보는 쪽을 arc의 절반만큼 지나서 멈춤
    let d = faceAngle(s) - a0;
    while (d > Math.PI) d -= TAU;
    while (d < -Math.PI) d += TAU;
    if (Math.abs(d) > 0.3) dir = d > 0 ? 1 : -1;
    span = Math.min(TAU, Math.max(arc * 0.6, Math.abs(d) + arc / 2));
  }
  p.tkDir = -dir;
  // 사슬을 감거나 풀어 가까운 적이 있는 거리로 휘두름 (없으면 사슬 끝까지)
  const L = chainLen(p);
  const e = nearest(s, L);
  const r = e ? Math.max(T.anchorReach * 0.8, Math.min(L, Math.hypot(e.x - p.x, e.y - p.y))) : L;
  p.tkSweep = { t: T.sweepTicks, a0, a1: a0 + dir * span, r, hit: [] };
  addEffect(s, { kind: "tkSweep", x: p.x, y: p.y, dirX: a0, dirY: a0 + dir * span, size: r, maxTicks: T.sweepTicks + 8, tint: p.weaponId, follow: true });
}

/** 공 하나가 (x, y)에 있을 때 닿은 적 맞히기 (뇌운: 둘레로 번개 · 빙해: 느려짐) */
function ballHits(s: RunState, x: number, y: number, mul: number, hit: number[]): number {
  const p = s.player;
  const st = flailOf(p);
  let n = 0;
  for (const e of inCircle(s, x, y, T.ballR)) {
    if (hit.includes(e.id)) continue;
    hit.push(e.id);
    n++;
    tkHit(s, e, p.stats.damage * st.power * mul, 10, st.ball === "tide" ? "tide" : undefined);
    if (st.ball === "floe") e.slowTicks = Math.max(e.slowTicks ?? 0, T.floeSlow);
    if (st.ball === "volt") volt(s, e);
  }
  return n;
}

/** 뇌운: 맞은 적 둘레 가까운 적에게 번개가 튐 */
function volt(s: RunState, from: EnemyState): void {
  const p = s.player;
  const near = alive(s)
    .filter((e) => e.id !== from.id && dist2(e, from) < T.voltReach ** 2)
    .sort((a, b) => dist2(a, from) - dist2(b, from) || a.id - b.id)
    .slice(0, T.voltN);
  for (const e of near) {
    tkHit(s, e, p.stats.damage * T.voltMul, 0, "shock");
    addEffect(s, { kind: "tkVolt", x: from.x, y: from.y, dirX: 0, dirY: 0, size: 4, toX: e.x, toY: e.y, maxTicks: 12 });
  }
}

/** 크라켄: 나와 철구공 사이 사슬에 닿은 적도 벰 */
function chainHits(s: RunState, x: number, y: number, hit: number[]): void {
  const p = s.player;
  const len = Math.hypot(x - p.x, y - p.y);
  if (len < 1) return;
  const dx = (x - p.x) / len;
  const dy = (y - p.y) / len;
  for (const e of alive(s)) {
    if (hit.includes(-e.id)) continue;
    const t = (e.x - p.x) * dx + (e.y - p.y) * dy;
    const off = Math.abs((e.x - p.x) * dy - (e.y - p.y) * dx);
    if (t < 0 || t > len - T.ballR || off > T.krakenW + e.r) continue;
    hit.push(-e.id);
    tkHit(s, e, p.stats.damage * T.krakenMul, 0, "bleed");
  }
}

/** 휘두르는 중 틱: 공 자리를 옮기며 맞힘 · 끝나면 철구공 기술 */
export function sweepTick(s: RunState): void {
  const p = s.player;
  const sw = p.tkSweep;
  if (!sw) return;
  const st = flailOf(p);
  // 한 틱에 너무 많이 돌면 그 사이도 확인 (빈틈 없이)
  const parts = 3;
  let n = 0;
  for (let k = 1; k <= parts; k++) {
    const f = 1 - (sw.t - 1 + (parts - k) / parts) / T.sweepTicks;
    const a = sw.a0 + (sw.a1 - sw.a0) * Math.min(1, f);
    const [c, sn] = rot(a);
    p.tkBx = p.x + c * sw.r;
    p.tkBy = p.y + sn * sw.r;
    n += ballHits(s, p.tkBx, p.tkBy, 1, sw.hit);
    if (st.ball === "twin") n += ballHits(s, p.x - c * sw.r, p.y - sn * sw.r, 1, sw.hit);
    if (st.ball === "kraken") chainHits(s, p.tkBx, p.tkBy, sw.hit);
  }
  addGauge(p, n * T.gaugeBall);
  sw.t--;
  if (sw.t > 0) return;
  const hits = sw.hit.filter((id) => id > 0).length;
  delete p.tkSweep;
  if (p.passives.includes("tkCompass") && hits >= K.tkCompass.need) healPlayer(s, p.stats.maxHp * K.tkCompass.heal);
  sweepEnd(s, p.tkBx ?? p.x, p.tkBy ?? p.y);
}

/** 휘두르기가 끝난 자리에서 철구공마다 기술 */
function sweepEnd(s: RunState, x: number, y: number): void {
  const p = s.player;
  const st = flailOf(p);
  p.tkSwings = (p.tkSwings ?? 0) + 1;
  switch (st.ball) {
    case "tide": {
      for (const e of inCircle(s, x, y, T.tideR)) tkHit(s, e, p.stats.damage * T.tideMul, T.tidePush, "tide");
      addEffect(s, { kind: "tkTide", x, y, dirX: 0, dirY: 0, size: T.tideR, maxTicks: 26 });
      break;
    }
    case "whirl":
      addWhirl(s, x, y);
      break;
    case "urchin": {
      // 성게 가시: 공 자리에서 사방으로 (shoot은 내 자리에서 쏘므로 쏜 뒤 옮김)
      const from = s.projectiles.length;
      for (let i = 0; i < T.spikes; i++) shoot(s, (i * TAU) / T.spikes, { damage: p.stats.damage * T.spikeMul, spirit: "tkSpike", r: 3, range: T.spikeRange, pierce: 1 });
      for (const pr of s.projectiles.slice(from)) {
        pr.x += x - p.x;
        pr.y += y - p.y;
        pr.prevX = pr.x;
        pr.prevY = pr.y;
      }
      break;
    }
    case "geyser":
      if ((p.tkSwings ?? 0) % T.geyserEvery === 0) {
        clap(s, x, y, T.geyserR, p.stats.damage * T.geyserMul, T.geyserStun);
        addEffect(s, { kind: "tkGeyser", x, y, dirX: 0, dirY: 0, size: T.geyserR, maxTicks: 34 });
      }
      break;
    case "floe":
      addEffect(s, { kind: "tkFrost", x, y, dirX: 0, dirY: 0, size: 22, maxTicks: 30 });
      break;
    default:
      addEffect(s, { kind: "tkSplash", x, y, dirX: 0, dirY: 0, size: 16, maxTicks: 18 });
  }
}
