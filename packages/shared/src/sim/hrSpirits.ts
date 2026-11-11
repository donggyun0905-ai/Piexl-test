// 혼령 소환수 (몸이 없는 것): 혼-효 부엉이(앉아 있다 범위 안 적에게 날아 낙하 공격 → 그 자리에 다시 앉음, 체력 없음·방을 나갈 때까지)
// 혼령사냥이 있으면 부엉이는 앉지 않고 방 어디든 계속 날아다니며 공격 · 혼-룡: 방을 덮는 용이 왼쪽에서 오른쪽으로 지나가며 모든 적을 60번 때림
import { ENEMIES } from "../enemyDefs";
import { HONRYEONG_PERKS as K } from "../itemsHonryeong";
import { hasHr, hrArea, hrHit, hrRoll, petMul } from "./hrKit";
import { foeNear } from "./puppetAllies";
import { alive } from "./shadowingSpirits";
import type { RunState } from "./types";
import { addEffect, reachOf } from "./util";

/** 용이 지나가는 틱 (화면도 씀) */
export const dragonTicks = () => K.hrDragon.hits * K.hrDragon.every;

/** 공격할 때: 확률로 부엉이를 내 자리에 · 용 */
export function spiritsOnAttack(s: RunState): void {
  const p = s.player;
  const pact = hasHr(p, "hrPact") ? K.hrPact.chance : 1;
  if (hasHr(p, "hrOwl") && (p.hrOwls?.length ?? 0) < K.hrOwl.max && hrRoll(s, "hrOwl") < K.hrOwl.chance * pact) {
    (p.hrOwls ??= []).push({ x: p.x, y: p.y, prevX: p.x, prevY: p.y, cd: 20, t: 0, fx: p.x, fy: p.y, tx: p.x, ty: p.y, face: p.faceX < 0 ? -1 : 1 });
    addEffect(s, { kind: "hrPuff", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 16, style: 1, maxTicks: 20 });
  }
  if (hasHr(p, "hrDragon") && !p.hrDragon && hrRoll(s, "hrDragon") < K.hrDragon.chance) {
    p.hrDragon = { t: 0, dmg: (p.stats.damage * K.hrDragon.mul) / K.hrDragon.hits };
  }
}

function owlsTick(s: RunState): void {
  const p = s.player;
  const O = K.hrOwl;
  const hunt = hasHr(p, "hrHunt");
  for (const o of p.hrOwls ?? []) {
    o.prevX = o.x;
    o.prevY = o.y;
    if (o.t > 0) {
      // 날아가는 중: 떠난 자리 → 내려앉을 자리
      o.t--;
      const f = 1 - o.t / O.fly;
      o.x = o.fx + (o.tx - o.fx) * f;
      o.y = o.fy + (o.ty - o.fy) * f;
      if (o.t <= 0) hrArea(s, o.x, o.y, O.r * reachOf(p), p.stats.damage * O.mul * petMul(p), "hrDive");
      continue;
    }
    if (o.cd > 0) {
      o.cd--;
      continue;
    }
    const e = foeNear(s, o.x, o.y, hunt ? 9999 : O.range * reachOf(p));
    if (!e) continue;
    o.cd = hunt ? K.hrHunt.owlRate : O.rate;
    o.t = O.fly;
    o.fx = o.x;
    o.fy = o.y;
    o.tx = e.x;
    o.ty = e.y;
    if (e.x !== o.x) o.face = e.x < o.x ? -1 : 1;
  }
}

function dragonTick(s: RunState): void {
  const p = s.player;
  const d = p.hrDragon;
  if (!d) return;
  d.t++;
  if (d.t % K.hrDragon.every === 0) {
    // 한 번씩 따로 때림 (화면이 피해 숫자를 60개 다 띄움)
    d.hitAt = s.tick;
    for (const e of s.enemies) {
      if (!alive(e)) continue;
      hrHit(s, e, d.dmg * (ENEMIES[e.kind].boss ? K.hrDragon.bossMul : 1), 1, 0);
      if (d.t % (K.hrDragon.every * 3) === 0) addEffect(s, { kind: "hrDragonHit", x: e.x, y: e.y, dirX: 1, dirY: 0, size: e.r, style: d.t, maxTicks: 10 });
    }
  }
  if (d.t >= dragonTicks()) delete p.hrDragon;
}

/** 틱마다: 부엉이 · 용 */
export function spiritsTick(s: RunState): void {
  owlsTick(s);
  dragonTick(s);
}
