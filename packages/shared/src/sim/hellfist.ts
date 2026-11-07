// 헬피스트(새벽의 성흔, 적혈의 주먹): 누르고 있으면 주먹 세 박자
// 1 오른 주먹 곧은 찌르기 → 2 악마 왼팔 내려찍기(앞 부채꼴 충격) → 3 허공 긁기(왼손 검지로 적을 가리켜 공중을 긁으면 그 적 자리에 검격 여러 줄 · 둘레도 조금)
// 맞힐수록 악마화가 쌓여 팔이 자라 모든 공격이 더 멀리 닿음 (sim/hellfistKit) · 성흔이 가득 차면 적혈 각성(공격 속도·회복·악마화 가득·허공 긁기 여럿)
// 수치 weaponsHellfist.HELLFIST · 아이템 itemsHellfist
import { TICK_RATE } from "../constants";
import { HELLFIST_PERKS as K } from "../itemsHellfist";
import { HELLFIST as H } from "../weaponsHellfist";
import { clawTargets, hfDmg, hfHit, hfReach, rageTick } from "./hellfistKit";
import { inCircle, inCone, inLine, strike, stun } from "./s2Kit";
import { isAwake, stigmaTick } from "./stigma";
import type { RunState } from "./types";
import { addEffect, hasPerk } from "./util";

/** 1타: 앞으로 곧게 찌르기 (쌍주먹: 한 번 더) */
function jab(s: RunState): void {
  const p = s.player;
  const len = H.jabLen * hfReach(p);
  const dmg = hfDmg(p, H.jabMul * (hasPerk(p, "hfKnuckle") ? K.hfKnuckle.mul : 1));
  const hit = inLine(s, len, H.jabW);
  for (const e of hit) {
    strike(s, e, dmg, H.jabPush);
    if (hasPerk(p, "hfDouble") && e.hp > 0) strike(s, e, dmg * K.hfDouble.mul);
  }
  addEffect(s, { kind: "hfJabFx", x: p.x, y: p.y - 4, dirX: p.faceX, dirY: p.faceY, size: len, style: isAwake(p) ? 1 : 0, maxTicks: 12, follow: true });
  hfHit(s, hit.length, H.gainJab);
}

/** 2타: 악마 왼팔로 앞을 내려찍음 (짓밟기 · 땅울림 · 무쇠 팔) */
function smash(s: RunState): void {
  const p = s.player;
  const iron = hasPerk(p, "hfIron");
  const r = H.smashR * hfReach(p) * (iron ? K.hfIron.r : 1);
  const dmg = hfDmg(p, H.smashMul * (hasPerk(p, "hfCrush") ? K.hfCrush.mul : 1));
  const hit = inCone(s, r, H.smashCos);
  for (const e of hit) {
    strike(s, e, dmg, H.smashPush * (iron ? K.hfIron.push : 1));
    if (hasPerk(p, "hfQuake")) stun(e, K.hfQuake.stun);
  }
  addEffect(s, { kind: "hfSmashFx", x: p.x, y: p.y - 2, dirX: p.faceX, dirY: p.faceY, size: r, arc: H.smashCos, style: isAwake(p) ? 1 : 0, maxTicks: 18, follow: true });
  hfHit(s, hit.length, H.gainSmash);
}

/** 3타: 왼손 검지로 적을 가리키고 허공을 긁음 → 그 적 자리에 검격 여러 줄 (가리킬 적이 없으면 앞 허공) */
function claw(s: RunState): void {
  const p = s.player;
  const aw = isAwake(p);
  const range = H.clawRange * hfReach(p) * (hasPerk(p, "hfFar") ? K.hfFar.r : 1);
  const n = (aw ? H.awakeTargets : H.clawTargets) + (hasPerk(p, "hfAim") ? K.hfAim.add : 0);
  const lines = H.clawHits + (hasPerk(p, "hfNail") ? K.hfNail.add : 0);
  const echo = hasPerk(p, "hfEcho");
  const splashR = H.clawSplash * (echo ? K.hfEcho.r : 1);
  const per = hfDmg(p, H.clawMul);
  const targets = clawTargets(s, range, n);
  const spots = targets.length ? targets.map((e) => ({ x: e.x, y: e.y, r: e.r, id: e.id })) : [{ x: p.x + p.faceX * range * 0.5, y: p.y + p.faceY * range * 0.5, r: 8, id: -1 }];
  let hits = 0;
  for (const at of spots) {
    for (const e of inCircle(s, at.x, at.y, splashR)) {
      if (e.id === at.id) {
        for (let i = 0; i < lines && e.hp > 0; i++) strike(s, e, per, i === lines - 1 ? 3 : 0);
        if (hasPerk(p, "hfRend") && e.hp > 0) strike(s, e, per * lines * K.hfRend.mul, 0, "bleed");
      } else strike(s, e, per * lines * (echo ? K.hfEcho.mul : H.splashMul), 2);
      hits++;
    }
    addEffect(s, { kind: "hfPointFx", x: p.x, y: p.y - 6, dirX: p.faceX, dirY: p.faceY, size: 1, toX: at.x, toY: at.y, style: aw ? 1 : 0, maxTicks: 16 });
    addEffect(s, { kind: "hfClawFx", x: at.x, y: at.y, dirX: p.faceX, dirY: p.faceY, size: lines, width: at.r + splashR * 0.5, style: aw ? 1 : 0, maxTicks: 22 });
  }
  hfHit(s, hits, H.gainClaw);
}

/** 틱마다 (적혈의 주먹을 들었을 때 player에서) */
export function hellfistTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  stigmaTick(p);
  rageTick(p);
  const aw = isAwake(p);
  // 공격 대기가 끝난 뒤부터 잼 (한참 안 치면 다시 1타부터)
  p.hfGap = (p.hfGap ?? 0) + (p.attackCooldown <= 0 ? 1 : 0);
  if (p.hfGap > H.comboGap) p.hfStep = 0;
  if (!want || p.attackCooldown > 0 || p.s2Rush) return;
  const k = p.hfStep ?? 0;
  if (k === 0) jab(s);
  else if (k === 1) smash(s);
  else claw(s);
  p.hfLast = { k, t: s.tick };
  p.hfStep = (k + 1) % 3;
  p.hfGap = 0;
  const fast = aw ? (hasPerk(p, "hfFrenzy") ? K.hfFrenzy.speed : H.awakeSpeed) : 1;
  p.attackCooldown = Math.max(1, Math.round((TICK_RATE / (speed * fast)) * (H.stepTime[k] ?? 1)));
  p.attackCount++;
}

/** 연습장 등에서 다시 시작할 때 */
export function resetHellfist(p: RunState["player"]): void {
  for (const k of ["sgGauge", "sgAwake", "sgAwakeMax", "hfStep", "hfGap", "hfLast", "hfRage", "hfIdle"] as const) delete p[k];
}

export { isHellfist, rageMax, rageOf } from "./hellfistKit";
