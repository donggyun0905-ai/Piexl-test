// 세레나 스킬 넷(1 환혹의 스텝 · 2 가시 정원 · 3 맹독 비수 · 4 환혹의 무도) · 가시 정원 장판 · 도는 사슬 채찍 · 환혹의 회오리 (sim/serena에서 부름)
import { SERENA_PERKS as K } from "../itemsSerena";
import { SERENA as N } from "../weaponsSerena";
import { orbCount, snCooldown, snHit, snOrbAt, addThorns } from "./serenaKit";
import { rot } from "./orbit";
import { alive, inCircle, inCone, poison, rushTick, startRush } from "./s2Kit";
import type { RunState } from "./types";
import { addEffect, hasPerk } from "./util";

const TAU = Math.PI * 2;

/** 2 가시 정원: 둘레에 빛의 강철 가시 장판을 흩뿌림 (가운데 하나 + 둘레) */
function garden(s: RunState): void {
  const p = s.player;
  const briar = hasPerk(p, "snBriar");
  const r = N.gardenR * (briar ? K.snBriar.r : 1);
  const t = Math.round(N.gardenTicks * (briar ? K.snBriar.ticks : 1));
  const list = (p.snFields = [{ x: p.x, y: p.y, t, r }]);
  for (let i = 0; i < N.gardenN; i++) {
    const [c, sn] = rot((i / N.gardenN) * TAU);
    list.push({ x: p.x + c * N.gardenAt, y: p.y + sn * N.gardenAt, t, r });
  }
  addEffect(s, { kind: "snFieldFx", x: p.x, y: p.y, dirX: 0, dirY: 0, size: N.gardenAt + r, maxTicks: 30 });
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
    const wing = hasPerk(p, "snWing");
    const dmg = p.stats.damage * N.stepMul * (wing ? K.snWing.mul : 1);
    startRush(p, { t: N.stepTicks, dx: p.faceX, dy: p.faceY, step: N.stepDist * (wing ? K.snWing.dist : 1), dmg, push: 0, invuln: true, tint: "#ffe0f0", w: N.stepW });
    addEffect(s, { kind: "snDashFx", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: N.stepW, maxTicks: N.stepTicks + 10 });
    if (hasPerk(p, "snMirage")) p.snMirage = N.stepTicks + K.snMirage.ticks;
  } else if (i === 1) garden(s);
  else if (i === 2) knives(s);
  else ult(s);
}

/** 환혹의 스텝 한 틱: 지나간 적에 가시 */
export function dashTick(s: RunState): void {
  if (s.player.s2Rush) rushTick(s, (e) => addThorns(s, e, N.stepThorns));
}

/** 가시 정원 장판: 안의 적에게 시간마다 피해·가시 · 느려짐 */
export function fieldsTick(s: RunState): void {
  const p = s.player;
  const list = p.snFields;
  if (!list) return;
  for (const f of list) {
    f.t--;
    for (const e of inCircle(s, f.x, f.y, f.r)) {
      e.slowTicks = Math.max(e.slowTicks ?? 0, 10);
      if ((e.snFieldAt ?? 0) > s.tick) continue;
      e.snFieldAt = s.tick + N.gardenEvery;
      snHit(s, e, N.gardenMul);
    }
  }
  p.snFields = list.filter((f) => f.t > 0);
  if (p.snFields.length === 0) delete p.snFields;
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
  for (const e of inCircle(s, p.x, p.y, N.whirlR)) snHit(s, e, N.whirlMul, 1, N.whirlPush);
  addEffect(s, { kind: "snWhirlFx", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: N.whirlR, style: p.snWhirl! % 2, maxTicks: 20 });
  if (p.snWhirl! <= 0) {
    delete p.snWhirl;
    delete p.snWhirlAt;
  }
}
