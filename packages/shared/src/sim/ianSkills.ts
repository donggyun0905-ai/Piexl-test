// 이안 스킬 넷(1 인과의 실 · 2 그림자 걸음 · 3 기록 집행 · 4 인과율 속박) · 날아가는 실 · 인과 되돌림 (sim/ian에서 부름)
import { srcRun, srcFn } from "./dmgSrc";
import { IAN_PERKS as K } from "../itemsIan";
import { IAN as I } from "../weaponsIan";
import { addRec, bind, iaCooldown, iaHit as iaHit_ } from "./ianKit";
import { rot } from "./orbit";
import { alive, onSegment, rushTick as rushTick_, startRush, strike as strike_ } from "./s2Kit";
import type { RunState } from "./types";
import { addEffect, hasPerk } from "./util";
const iaHit = srcFn("ianSkills", () => iaHit_), rushTick = srcFn("ianSkills", () => rushTick_), strike = srcFn("ianSkills", () => strike_);

/** 인과의 실 한 가닥 (dx, dy 방향) */
function thread(s: RunState, dx: number, dy: number): void {
  const p = s.player;
  const w = I.threadW * (hasPerk(p, "iaSteel") ? K.iaSteel.width : 1);
  (p.iaThreads ??= []).push({ x: p.x, y: p.y, dx, dy, left: I.threadRange, w, hit: [] });
  addEffect(s, { kind: "iaThread", x: p.x, y: p.y, dirX: dx, dirY: dy, size: w, maxTicks: 14 });
}

/** 기록 집행: 기록이 있는 적마다 기록 수만큼 피해 (속박된 적은 가득 찬 것으로) · 그 자리에 '執' 글자 */
function writ(s: RunState): void {
  const p = s.player;
  const per = hasPerk(p, "iaEcho") ? K.iaEcho.mul : I.writMul;
  for (const e of alive(s)) {
    const bound = (e.iaBind ?? 0) > 0;
    const n = bound ? I.recMax : (e.iaRec ?? 0);
    if (n <= 0) continue;
    e.iaRec = hasPerk(p, "iaKnot") ? Math.floor((e.iaRec ?? 0) * K.iaKnot.keep) : 0;
    addEffect(s, { kind: "iaWrit", x: e.x, y: e.y - e.r - 4, dirX: n, dirY: 0, size: e.r + 8, maxTicks: 30 });
    iaHit(s, e, per * n);
  }
}

/** 스킬 키 (1~4) */
export function iaSkill(s: RunState, i: number): void {
  const p = s.player;
  const cd = (p.iaCd ??= [0, 0, 0, 0]);
  if ((cd[i] ?? 0) > 0 || p.s2Rush) return;
  cd[i] = iaCooldown(p, i);
  if (i === 0) {
    thread(s, p.faceX, p.faceY);
    if (hasPerk(p, "iaSpool")) srcRun(s, "iaSpool", () => {
      for (const a of [K.iaSpool.spread, -K.iaSpool.spread]) {
        const [c, sn] = rot(a);
        thread(s, p.faceX * c - p.faceY * sn, p.faceX * sn + p.faceY * c);
      }
    });
  } else if (i === 1) {
    const far = hasPerk(p, "iaShadow") ? K.iaShadow.dash : 1;
    startRush(p, { t: I.stepTicks, dx: p.faceX, dy: p.faceY, step: I.stepDist * far, dmg: p.stats.damage * I.stepMul, push: 0, invuln: true, tint: "#6a4aff", w: I.stepW });
    p.iaAmbush = true;
  } else if (i === 2) {
    writ(s);
  } else {
    // 인과율 속박: 방의 모든 적을 실로 묶음 → 끝날 때 그동안 받은 피해 일부가 되돌아와 터짐
    const t = I.lawTicks + (hasPerk(p, "iaLaw") ? K.iaLaw.more : 0);
    p.iaLaw = t;
    for (const e of alive(s)) {
      e.iaDebt = 0;
      bind(s, e, t);
    }
    addEffect(s, { kind: "iaLaw", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 1, maxTicks: 50 });
  }
}

/** 그림자 걸음 한 틱: 그림자 잔상 · 지나며 찌른 적에 기록 +1 */
export function stepTick(s: RunState): void {
  const p = s.player;
  const r = p.s2Rush;
  if (!r) return;
  addEffect(s, { kind: "iaStep", x: p.x, y: p.y, dirX: r.dx, dirY: r.dy, size: 12, maxTicks: 20 });
  rushTick(s, (e) => {
    addRec(s, e, 1);
    addEffect(s, { kind: "iaStab", x: e.x, y: e.y, dirX: r.dx, dirY: r.dy, size: e.r + 8, maxTicks: 14 });
  });
}

/** 인과의 실: 앞으로 날아가며 꿰뚫고, 맞은 적을 끌어당기며 기록 +2 */
export function threadsTick(s: RunState): void {
  const p = s.player;
  const list = p.iaThreads;
  if (!list) return;
  const rec = hasPerk(p, "iaWeave") ? K.iaWeave.rec : I.threadRec;
  const mul = I.threadMul * (hasPerk(p, "iaSteel") ? K.iaSteel.mul : 1);
  for (const w of list) {
    const ax = w.x;
    const ay = w.y;
    w.x += w.dx * I.threadSpeed;
    w.y += w.dy * I.threadSpeed;
    w.left -= I.threadSpeed;
    for (const e of onSegment(s, ax, ay, w.x, w.y, w.w)) {
      if (w.hit.includes(e.id)) continue;
      w.hit.push(e.id);
      iaHit(s, e, mul, -I.threadPull);
      addRec(s, e, rec);
    }
  }
  p.iaThreads = list.filter((w) => w.left > 0);
  if (p.iaThreads.length === 0) delete p.iaThreads;
}

/** 인과율 속박이 끝나면: 쌓인 피해가 적마다 되돌아와 터짐 */
export function lawTick(s: RunState): void {
  const p = s.player;
  if (!p.iaLaw || --p.iaLaw > 0) return;
  delete p.iaLaw;
  for (const e of alive(s)) {
    const d = e.iaDebt ?? 0;
    delete e.iaDebt;
    if (d <= 0) continue;
    strike(s, e, d);
    addEffect(s, { kind: "iaRebound", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 14, maxTicks: 28 });
  }
}
