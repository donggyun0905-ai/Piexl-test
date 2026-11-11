// 백인장 공격마다 확률로 나가는 원거리 기술: 붉은 날개 폭우(15타) · 추적 침격(15타) · 관통 나선창(1타) · 기계익 충격파(1타)
import { BJ_PERKS as K } from "../itemsBaekinjang";
import { bjNearest, bjRoll, hasBj } from "./bjKit";
import { bjArea, bjHit, bjVolley } from "./bjVolley";
import { onSegment } from "./s2Kit";
import type { RunState } from "./types";
import { addEffect, reachOf } from "./util";

/** 공격 하나가 끝날 때마다 */
export function bjProcs(s: RunState): void {
  const p = s.player;
  const k = reachOf(p);
  const [dx, dy] = [p.faceX, p.faceY];
  const dmg = p.stats.damage;
  if (hasBj(p, "bjRain") && bjRoll(s, "bjRain") < K.bjRain.chance) {
    const R = K.bjRain;
    const len = R.len * k;
    bjVolley(s, { kind: "rain", x: p.x, y: p.y, dx, dy, r: len, dmg: dmg * R.mul, n: R.hits, every: R.every });
    addEffect(s, { kind: "bjRain", x: p.x + dx * len * 0.5, y: p.y + dy * len * 0.5, dirX: dx, dirY: dy, size: len * 0.6, maxTicks: R.hits * R.every + 6 });
  }
  if (hasBj(p, "bjNeedle") && bjRoll(s, "bjNeedle") < K.bjNeedle.chance) {
    const N = K.bjNeedle;
    const e = bjNearest(s, p.x, p.y, N.dist * k, dx, dy);
    if (e) {
      bjVolley(s, { kind: "needle", x: p.x, y: p.y, dx, dy, r: 0, dmg: dmg * N.mul, n: N.hits, every: N.every, id: e.id });
      addEffect(s, { kind: "bjNeedle", x: p.x + dx * 26, y: p.y + dy * 26 - 8, dirX: dx, dirY: dy, size: 30, maxTicks: 20 });
    }
  }
  if (hasBj(p, "bjSpear") && bjRoll(s, "bjSpear") < K.bjSpear.chance) {
    const S = K.bjSpear;
    const len = S.len * k;
    const [tx, ty] = [p.x + dx * len, p.y + dy * len];
    for (const e of onSegment(s, p.x, p.y, tx, ty, S.w)) bjHit(s, e, dmg * S.mul, true);
    addEffect(s, { kind: "bjSpear", x: p.x, y: p.y, dirX: dx, dirY: dy, size: len, toX: tx, toY: ty, maxTicks: 20 });
  }
  if (hasBj(p, "bjShock") && bjRoll(s, "bjShock") < K.bjShock.chance) {
    const r = K.bjShock.r * k;
    bjArea(s, p.x, p.y, r, dmg * K.bjShock.mul, { knock: true });
    addEffect(s, { kind: "bjShock", x: p.x, y: p.y, dirX: 0, dirY: 0, size: r, maxTicks: 20 });
  }
}
