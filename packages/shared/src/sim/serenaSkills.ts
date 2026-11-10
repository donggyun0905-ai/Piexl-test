// 세레나 스킬 넷(1 환혹의 스텝 · 2 매혹 · 3 맹독 비수 · 4 환혹의 무도) · 매혹 · 도는 사슬 채찍 · 환혹의 회오리 (sim/serena에서 부름)
import { SERENA_PERKS as K } from "../itemsSerena";
import { SERENA as N } from "../weaponsSerena";
import { orbCount, snCooldown, snHit, snOrbAt, addThorns } from "./serenaKit";
import { alive, inCircle, inCone, isBoss, poison, rushTick, startRush, stun } from "./s2Kit";
import type { RunState } from "./types";
import { addEffect, hasPerk, reachOf } from "./util";

/** 2 매혹: 둘레 적을 홀림 (멈춘 채 나에게 끌려옴 · 받는 피해 증가 · 가시) */
function charm(s: RunState): void {
  const p = s.player;
  const perfume = hasPerk(p, "snPerfume");
  const r = N.charmR * (perfume ? K.snPerfume.r : 1);
  const t = Math.round(N.charmTicks * (perfume ? K.snPerfume.ticks : 1));
  for (const e of inCircle(s, p.x, p.y, r)) {
    snHit(s, e, N.charmMul, N.charmThorns);
    e.snCharm = Math.max(e.snCharm ?? 0, t);
    if (isBoss(e)) e.slowTicks = Math.max(e.slowTicks ?? 0, t);
    else stun(e, t);
  }
  addEffect(s, { kind: "snCharmFx", x: p.x, y: p.y, dirX: 0, dirY: 0, size: r, maxTicks: 36 });
}

/** 3 맹독 비수: 앞 부채꼴로 에테르 비수를 흩뿌림 (가시 · 독) */
function knives(s: RunState): void {
  const p = s.player;
  const more = hasPerk(p, "snQuiver");
  const cos = more ? K.snQuiver.cos : N.knifeCos;
  for (const e of inCone(s, N.knifeR, cos)) {
    snHit(s, e, N.knifeMul, N.knifeThorns);
    poison(e, p.stats.damage * N.knifePoison, N.knifePoisonTicks);
  }
  addEffect(s, { kind: "snKnifeFx", x: p.x, y: p.y - 4, dirX: p.faceX, dirY: p.faceY, size: N.knifeR, style: N.knifeN + (more ? K.snQuiver.more : 0), maxTicks: 22 });
}

/** 4 환혹의 무도: 사슬 채찍이 여섯으로 늘어 더 크게 휘젓고 · 방의 모든 적에 가시 */
function ult(s: RunState): void {
  const p = s.player;
  p.snUlt = N.ultTicks + (hasPerk(p, "snNight") ? K.snNight.more : 0);
  for (const e of alive(s)) addThorns(s, e, N.ultThorns);
  addEffect(s, { kind: "snUltFx", x: p.x, y: p.y, dirX: 0, dirY: 0, size: N.orbR * N.ultOrbR, maxTicks: 50 });
}

/** 스킬 키 (1~4) */
export function snSkill(s: RunState, i: number): void {
  const p = s.player;
  const cd = (p.snCd ??= [0, 0, 0, 0]);
  if ((cd[i] ?? 0) > 0 || p.s2Rush) return;
  cd[i] = snCooldown(p, i);
  if (i === 0) {
    p.snDash = N.stepN;
    nextStep(s);
    if (hasPerk(p, "snMirage")) p.snMirage = N.stepTicks * N.stepN + K.snMirage.ticks;
  } else if (i === 1) charm(s);
  else if (i === 2) knives(s);
  else ult(s);
}

/** 환혹의 스텝 다음 돌진: 바라보는 쪽으로 · 둘레를 기울어진 사슬 회전으로 침 (1번 / · 2번 - · 3번 \\) */
function nextStep(s: RunState): void {
  const p = s.player;
  const k = N.stepN - (p.snDash ?? 0);
  p.snDash = (p.snDash ?? 1) - 1;
  p.snDashK = k;
  const wing = hasPerk(p, "snWing");
  const dmg = p.stats.damage * N.stepMul * (wing ? K.snWing.mul : 1);
  startRush(p, { t: N.stepTicks, dx: p.faceX, dy: p.faceY, step: N.stepDist * (wing ? K.snWing.dist : 1), dmg, push: 0, invuln: true, tint: "#ffe0f0", w: N.stepW });
  for (const e of inCircle(s, p.x, p.y, N.stepSpinR)) snHit(s, e, N.stepSpinMul * (wing ? K.snWing.mul : 1));
  addEffect(s, { kind: "snDashFx", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: N.stepSpinR, style: k, maxTicks: N.stepTicks + 10 });
}

/** 환혹의 스텝 한 틱: 지나간 적에 가시 · 돌진이 끝나면 다음 돌진 */
export function dashTick(s: RunState): void {
  const p = s.player;
  if (p.s2Rush) rushTick(s, (e) => addThorns(s, e, N.stepThorns));
  if (!p.s2Rush && (p.snDash ?? 0) > 0) nextStep(s);
  else if (!p.s2Rush) {
    delete p.snDash;
    delete p.snDashK;
  }
}

/** 매혹된 적: 멈춘 채 나에게 천천히 끌려옴 (보스는 안 끌려옴) */
export function charmTick(s: RunState): void {
  const p = s.player;
  for (const e of s.enemies) {
    if (!(e.snCharm ?? 0)) continue;
    if (--e.snCharm! <= 0 || e.hp <= 0) {
      delete e.snCharm;
      continue;
    }
    const d = Math.hypot(p.x - e.x, p.y - e.y);
    if (isBoss(e) || d < p.r + e.r + 6) continue;
    e.x += ((p.x - e.x) / d) * N.charmPull;
    e.y += ((p.y - e.y) / d) * N.charmPull;
  }
}

/** 도는 사슬 채찍: 비수가 지나가는 적을 침 (같은 적은 잠깐 뒤 다시) */
export function orbTick(s: RunState): void {
  const p = s.player;
  const every = Math.round(N.orbEvery * (hasPerk(p, "snSpin") ? K.snSpin.every : 1));
  const mul = N.orbMul * ((p.snUlt ?? 0) > 0 ? N.ultOrbMul : 1) * (hasPerk(p, "snEdge") ? K.snEdge.mul : 1);
  for (let i = 0; i < orbCount(p); i++) {
    const [x, y] = snOrbAt(p, s.tick, i);
    for (const e of alive(s)) {
      if ((e.snOrbAt ?? 0) > s.tick || Math.hypot(e.x - x, e.y - y) > N.orbHitR + e.r) continue;
      e.snOrbAt = s.tick + every;
      snHit(s, e, mul);
      addEffect(s, { kind: "snHitFx", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 4, maxTicks: 12 });
    }
  }
}

/** 환혹의 회오리: 여러 사슬 채찍이 둘레를 연달아 크게 휘저음 */
export function whirlTick(s: RunState): void {
  const p = s.player;
  if (!(p.snWhirl ?? 0)) return;
  if ((p.snWhirlAt ?? 0) > 0) {
    p.snWhirlAt!--;
    return;
  }
  p.snWhirl!--;
  p.snWhirlAt = N.whirlGap;
  const wr = N.whirlR * reachOf(p);
  for (const e of inCircle(s, p.x, p.y, wr)) snHit(s, e, N.whirlMul, 1, N.whirlPush);
  addEffect(s, { kind: "snWhirlFx", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: wr, style: p.snWhirl! % 2, maxTicks: 20 });
  if (p.snWhirl! <= 0) {
    delete p.snWhirl;
    delete p.snWhirlAt;
  }
}
