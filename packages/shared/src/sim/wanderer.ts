// 방랑객(아스칼론, 시즌 2): 카타나를 든 떠돌이 무사. 기본 예리함 25% (맞히면 확률로 방어 -25% + 출혈, baseStats)
// 무기마다: 앞쪽 베기 · 발도 · 무심의 원(가만히 서면 원에 들어온 적을 바로 벰) · 칼날 폭풍 · 천검란(게이지 → 방 전체 칼날 폭풍) · 달빛 일섬
// 수치는 weaponsWanderer.WANDERER, 아이템은 itemsWanderer
import { TICK_RATE } from "../constants";
import { WANDERER_PERKS as K } from "../itemsWanderer";
import { WANDERER as W, type KatanaStyle } from "../weaponsWanderer";
import { nearest } from "./brawlMoves";
import { applyBleed } from "./gunExtras";
import { alive, inCircle, inCone, inLine, onSegment, shoot, strike } from "./s2Kit";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, hasPerk, keepInRoom, normalize, roomGrid, STILL_TICKS, weaponOf } from "./util";

const styleOf = (p: PlayerState): KatanaStyle => weaponOf(p).katana ?? { mode: "slash", reach: 34, arc: 0.2 };
const isWanderer = (p: PlayerState) => p.characterId === "wanderer";

/** 무심의 원 반지름 */
export const zoneRadius = (p: PlayerState) => W.zoneR * (hasPerk(p, "wdCalm") ? K.wdCalm.r : 1);
/** 화면용: 천검란 게이지 0~1 */
export const wandererGauge = (p: PlayerState) => Math.min(1, (p.wdGauge ?? 0) / W.tempestNeed);

/** 이번 칼의 피해 배율: 명경지수(가만히) · 납도(쉬었다 첫 칼) */
function cutMul(s: RunState): number {
  const p = s.player;
  let m = 1;
  if (hasPerk(p, "wdCalm") && p.stillTicks >= STILL_TICKS) m *= K.wdCalm.mul;
  if (hasPerk(p, "wdSheath") && s.tick - (p.wdLast ?? -999) >= K.wdSheath.rest) m *= K.wdSheath.mul;
  return m;
}

/** 맞힌 적 수만큼 천검란 게이지 */
function hitAll(s: RunState, foes: EnemyState[], dmg: number): void {
  for (const e of foes) strike(s, e, dmg);
  const p = s.player;
  if (styleOf(p).mode === "tempest" && foes.length) p.wdGauge = (p.wdGauge ?? 0) + foes.length * (hasPerk(p, "wdGauge") ? K.wdGauge.mul : 1);
}

/** 노리는 적 쪽으로 돌아섬 */
function faceTarget(s: RunState): void {
  const p = s.player;
  const e = nearest(s, p.stats.range + 40);
  const d = e && normalize(e.x - p.x, e.y - p.y);
  if (d) [p.faceX, p.faceY] = d;
}

/** 앞쪽 한 번 베기 */
function slash(s: RunState, dmg: number): void {
  const p = s.player;
  const st = styleOf(p);
  faceTarget(s);
  hitAll(s, inCone(s, st.reach, st.arc), dmg);
  addEffect(s, { kind: "wdSlash", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: st.reach, maxTicks: 10, width: st.arc < 0 ? 1 : 0 });
}

/** 한 번 공격 */
function attack(s: RunState): void {
  const p = s.player;
  const st = styleOf(p);
  const dmg = p.stats.damage * cutMul(s);
  p.wdLast = s.tick;
  if (st.mode === "iai" || st.mode === "lunge") {
    faceTarget(s);
    const x0 = p.x;
    const y0 = p.y;
    hitAll(s, inLine(s, st.reach, W.lineWidth), dmg);
    if (st.mode === "lunge") {
      p.x += p.faceX * st.reach * 0.8;
      p.y += p.faceY * st.reach * 0.8;
      keepInRoom(p, roomGrid(s));
      p.prevX = p.x;
      p.prevY = p.y;
    }
    addEffect(s, { kind: "wdIai", x: x0, y: y0 - 3, dirX: p.faceX, dirY: p.faceY, size: W.lineWidth, toX: x0 + p.faceX * st.reach, toY: y0 - 3 + p.faceY * st.reach, maxTicks: 14 });
  } else {
    slash(s, dmg);
    const more = (st.hits ?? 1) - 1;
    if (more > 0) p.wdQueue = Array.from({ length: more }, (_, i) => (i + 1) * W.flurryGap);
  }
  const waves = (st.waves ?? 0) + (st.waves ? (hasPerk(p, "wdWind") ? K.wdWind.n : 0) : 0);
  for (let i = 0; i < waves; i++) shoot(s, (i - (waves - 1) / 2) * 0.25, { damage: p.stats.damage * W.waveMul, spirit: st.mode === "storm" ? "wdStorm" : "wdWave", r: W.waveR, range: p.stats.range, speed: W.waveSpeed, pierce: 99 });
}

/** 무심의 원: 가만히 서면 펼쳐지고, 원 안의 적을 바로 벰 (같은 적은 잠시 뒤 다시) */
function zone(s: RunState): void {
  const p = s.player;
  if (styleOf(p).mode !== "zone") {
    delete p.wdZone;
    return;
  }
  if (p.stillTicks >= W.zoneStill) p.wdZone = { x: p.x, y: p.y, linger: W.zoneLinger };
  else if (p.wdZone && --p.wdZone.linger <= 0) delete p.wdZone;
  const z = p.wdZone;
  if (!z) return;
  const r = zoneRadius(p);
  for (const e of inCircle(s, z.x, z.y, r)) {
    if ((e.wdCutT ?? 0) > s.tick) continue;
    e.wdCutT = s.tick + W.zoneGap;
    strike(s, e, p.stats.damage * W.zoneMul);
    addEffect(s, { kind: "wdCut", x: e.x, y: e.y, dirX: 0.7, dirY: -0.7, size: e.r + 6, maxTicks: 10 });
  }
}

/** 대시 시작: 무심의 원이 둘레 적을 끌어당김 / 대시 끝: 잔월(지나간 길을 벰) */
function dashing(s: RunState): void {
  const p = s.player;
  if (p.dashTicks > 0 && !p.wdDash) {
    p.wdDash = { x: p.x, y: p.y };
    const z = p.wdZone;
    if (z) {
      const r = zoneRadius(p);
      for (const e of inCircle(s, z.x, z.y, r * 1.8)) {
        const d = normalize(z.x - e.x, z.y - e.y);
        if (!d) continue;
        e.x += d[0] * W.zonePull;
        e.y += d[1] * W.zonePull;
      }
      addEffect(s, { kind: "wdPull", x: z.x, y: z.y, dirX: 0, dirY: 0, size: r * 1.8, maxTicks: 16 });
    }
  } else if (p.dashTicks <= 0 && p.wdDash) {
    const from = p.wdDash;
    delete p.wdDash;
    if (hasPerk(p, "wdBlink")) {
      for (const e of onSegment(s, from.x, from.y, p.x, p.y, K.wdBlink.width)) strike(s, e, p.stats.damage * K.wdBlink.mul);
      addEffect(s, { kind: "wdIai", x: from.x, y: from.y - 3, dirX: p.faceX, dirY: p.faceY, size: K.wdBlink.width, toX: p.x, toY: p.y - 3, maxTicks: 16 });
    }
  }
}

/** 천검란: 게이지가 차면 방 전체 칼날 폭풍 */
function tempest(s: RunState): void {
  const p = s.player;
  if (!p.wdTempest && (p.wdGauge ?? 0) >= W.tempestNeed) {
    p.wdGauge = 0;
    p.wdTempest = { left: W.tempestHits, gap: 0 };
  }
  const t = p.wdTempest;
  if (!t || --t.gap > 0) return;
  for (const e of alive(s)) {
    strike(s, e, p.stats.damage * W.tempestMul);
    addEffect(s, { kind: "wdCut", x: e.x, y: e.y, dirX: t.left % 2 ? 0.7 : -0.7, dirY: -0.7, size: e.r + 8, maxTicks: 10 });
  }
  addEffect(s, { kind: "wdTempest", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 200, maxTicks: 14 });
  t.gap = W.tempestGap;
  if (--t.left <= 0) delete p.wdTempest;
}

/** 틱마다 (카타나를 들었을 때 player에서) */
export function wandererTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  if (!isWanderer(p)) return;
  if (p.wdQueue?.length) {
    p.wdQueue = p.wdQueue.map((t) => t - 1);
    if (p.wdQueue.some((t) => t <= 0)) slash(s, p.stats.damage);
    p.wdQueue = p.wdQueue.filter((t) => t > 0);
  }
  zone(s);
  dashing(s);
  tempest(s);
  // 피의 비: 처치하면 둘레 적에게 출혈
  const fresh = s.kills - (p.wdSeen ?? s.kills);
  p.wdSeen = s.kills;
  if (fresh > 0 && hasPerk(p, "wdRain")) for (const e of inCircle(s, p.x, p.y, K.wdRain.r)) applyBleed(e);
  if (!want || p.attackCooldown > 0) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  attack(s);
}

/** 연습장 등에서 다시 시작할 때 */
export function resetWanderer(p: PlayerState): void {
  for (const k of ["wdQueue", "wdZone", "wdGauge", "wdTempest", "wdLast", "wdDash", "wdSeen"] as const) delete p[k];
}
