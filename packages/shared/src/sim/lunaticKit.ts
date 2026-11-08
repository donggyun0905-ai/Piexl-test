// 루나틱 공용 도우미: 맞힘(성흔) · 성흔 → 만월 각성 · 월광 표적(조준점) 띄우기 · 곧 들어갈 공격(달빛 베기·초승달 비·잔상 찌르기) · 월광 검기
import { createRng, deriveSeed } from "../rng";
import { LUNATIC_PERKS as K } from "../itemsLunatic";
import { LUNATIC as L } from "../weaponsLunatic";
import { STIGMA } from "../weaponsDawn";
import type { LnStrike } from "./lnTypes";
import { applyMoon } from "./moonlight";
import { rot } from "./orbit";
import { setSlashing } from "./lunaticWeak";
import { alive, inCircle, strike } from "./s2Kit";
import { addStigma, awaken } from "./stigma";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, hasPerk, reachOf } from "./util";

/** 성흔 채움 → 가득 차면 만월 각성 (둘레 달빛 폭발 · 잠깐 무적) */
export function lnGain(s: RunState, n: number): void {
  const p = s.player;
  if (n <= 0 || !addStigma(p, n * (hasPerk(p, "lnSense") ? K.lnSense.gain : 1))) return;
  awaken(p, STIGMA.awakeTicks + (hasPerk(p, "lnEndless") ? K.lnEndless.more : 0));
  const r = L.awakeR * reachOf(p);
  for (const e of inCircle(s, p.x, p.y, r)) strike(s, e, p.stats.damage * L.awakeMul, 10, "moon");
  p.invulnTicks = Math.max(p.invulnTicks, L.awakeInv);
  addEffect(s, { kind: "lnAwakeFx", x: p.x, y: p.y, dirX: 0, dirY: 0, size: r, maxTicks: 40, follow: true });
}

/** 루나틱 공격 맞힘: 피해 · 성흔 */
export function lnHit(s: RunState, e: EnemyState, mul: number, push = 0): void {
  strike(s, e, s.player.stats.damage * mul, push);
  lnGain(s, L.gainHit + (e.hp > 0 ? 0 : L.gainKill));
}

/** 월광 표적: 간격마다 적 머리 위에 조준점 (쌍둥이 달: 둘) · 떠 있는 시간이 다 되면 사라짐 */
export function marksTick(s: RunState): void {
  const p = s.player;
  for (const e of s.enemies) if ((e.lnMark ?? 0) > 0 && --e.lnMark! <= 0) delete e.lnMark;
  p.lnMarkT = (p.lnMarkT ?? L.markFirst) - 1;
  if (p.lnMarkT > 0) return;
  p.lnMarkT = Math.round(L.markEvery * (hasPerk(p, "lnMarkFast") ? K.lnMarkFast.every : 1));
  const free = alive(s).filter((e) => !(e.lnMark ?? 0));
  const rng = createRng(deriveSeed(s.seed, "lnMark", s.tick));
  for (let i = 0; i < (hasPerk(p, "lnTwinMark") ? K.lnTwinMark.n : 1) && free.length > 0; i++) {
    const e = free.splice(Math.floor(rng.nextFloat() * free.length), 1)[0]!;
    e.lnMark = L.markTicks;
    addEffect(s, { kind: "lnMarkFx", x: e.x, y: e.y - e.r - 8, dirX: 0, dirY: 0, size: e.r, maxTicks: 18 });
  }
}

/** 곧 들어갈 공격 하나 */
const addStrike = (p: PlayerState, b: LnStrike) => (p.lnStrikes ??= []).push(b);

/** 달빛 베기: 확정 치명타 달빛 피해 + 달빛 스택 · 이어지는 달빛 · 초승달 비 */
function slash(s: RunState, b: LnStrike): void {
  const p = s.player;
  const r = b.r * reachOf(p);
  addEffect(s, { kind: "lnSlashFx", x: b.x, y: b.y, dirX: p.faceX, dirY: p.faceY, size: r, maxTicks: 20 });
  setSlashing(true);
  p.rmSure = true;
  for (const e of inCircle(s, b.x, b.y, r)) {
    strike(s, e, p.stats.damage * b.mul, 3, "moon");
    applyMoon(e, hasPerk(p, "lnFullMoon") ? K.lnFullMoon.stacks : L.slashMoon);
  }
  delete p.rmSure;
  setSlashing(false);
  lnGain(s, L.gainSlash);
  if (!b.chain && hasPerk(p, "lnChain")) {
    const next = alive(s)
      .filter((e) => e.id !== b.tg && (e.x - b.x) ** 2 + (e.y - b.y) ** 2 <= (K.lnChain.reach * reachOf(p)) ** 2)
      .sort((a, c) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2 - ((c.x - b.x) ** 2 + (c.y - b.y) ** 2) || a.id - c.id)[0];
    if (next) addStrike(p, { ...b, x0: b.x, y0: b.y, x: next.x, y: next.y, t: L.slashDelay + 4, mul: b.mul * K.lnChain.mul, tg: next.id, chain: true });
  }
  if (!hasPerk(p, "lnMoonRain")) return;
  const m = K.lnMoonRain;
  const rng = createRng(deriveSeed(s.seed, "lnRain", s.tick, b.tg ?? 0));
  for (let i = 0; i < m.n; i++) {
    const [nx, ny] = rot(((i + rng.nextFloat() * 0.4) / m.n) * Math.PI * 2);
    const d = m.spread * reachOf(p) * (0.6 + rng.nextFloat() * 0.4);
    addStrike(p, { k: 1, x0: b.x, y0: b.y - 40, x: b.x + nx * d, y: b.y + ny * d, t: m.delay + i * 3, mul: m.mul, r: m.r });
  }
}

/** 선분 (x0,y0)→(x,y) 둘레 w 안 적 */
function onSegment(s: RunState, b: LnStrike): EnemyState[] {
  const dx = b.x - b.x0;
  const dy = b.y - b.y0;
  const len = Math.hypot(dx, dy) || 1;
  return alive(s).filter((e) => {
    const t = ((e.x - b.x0) * dx + (e.y - b.y0) * dy) / len;
    const off = Math.abs((e.x - b.x0) * dy - (e.y - b.y0) * dx) / len;
    return t > -e.r && t < len + e.r && off < b.r + e.r;
  });
}

/** 떨어짐: 종류마다 */
function land(s: RunState, b: LnStrike): void {
  if (b.k === 0) {
    const e = alive(s).find((f) => f.id === b.tg);
    if (e) [b.x, b.y] = [e.x, e.y];
    return slash(s, b);
  }
  if (b.k === 1) {
    for (const e of inCircle(s, b.x, b.y, b.r * reachOf(s.player))) {
      lnHit(s, e, b.mul);
      applyMoon(e, 1);
    }
    addEffect(s, { kind: "lnRainFx", x: b.x, y: b.y, dirX: 0, dirY: 0, size: b.r, maxTicks: 16 });
    return;
  }
  for (const e of onSegment(s, b)) lnHit(s, e, b.mul, 3);
  addEffect(s, { kind: "lnAfterFx", x: b.x0, y: b.y0, dirX: 0, dirY: 0, size: b.r, maxTicks: 16, toX: b.x, toY: b.y });
}

/** 곧 들어갈 공격 한 틱 (달빛 베기는 노린 적을 따라감) */
export function strikesTick(s: RunState): void {
  const p = s.player;
  const list = p.lnStrikes;
  if (!list) return;
  for (const b of list.slice()) if (--b.t <= 0) land(s, b);
  p.lnStrikes = (p.lnStrikes ?? []).filter((b) => b.t > 0);
  if (p.lnStrikes.length === 0) delete p.lnStrikes;
}

/** 월광 검기 쏘기 (칼끝에서 앞으로) */
export function addWave(p: PlayerState, x: number, y: number, dx: number, dy: number): void {
  const w = K.lnWave;
  (p.lnWaves ??= []).push({ x, y, vx: dx * w.speed, vy: dy * w.speed, t: Math.round(w.ticks * reachOf(p)), hit: [] });
}

/** 월광 검기 한 틱: 나아가며 닿은 적을 한 번씩 벰 (꿰뚫음) */
export function wavesTick(s: RunState): void {
  const p = s.player;
  const list = p.lnWaves;
  if (!list) return;
  const r = K.lnWave.r * reachOf(p);
  for (const w of list) {
    w.x += w.vx;
    w.y += w.vy;
    w.t--;
    for (const e of inCircle(s, w.x, w.y, r)) {
      if (w.hit.includes(e.id)) continue;
      w.hit.push(e.id);
      lnHit(s, e, K.lnWave.mul, 2);
    }
  }
  p.lnWaves = list.filter((w) => w.t > 0);
  if (p.lnWaves.length === 0) delete p.lnWaves;
}
