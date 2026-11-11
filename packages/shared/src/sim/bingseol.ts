// 빙설(실베르): 누르면 무기 모양대로 얼음 칼날 공격 (부채꼴 베기·찌르기·던지기·몸 둘레·눈덩이, weaponsBingseol.BS_STYLE)
// 늘 몸 둘레 얼음 영역: 안의 적은 움직임·공격이 느려짐(sluggish) · 공격마다 전용 아이템 기술(sim/bsArms) · 궁극기(sim/bsUlt)
import { BINGSEOL_PERKS as K } from "../itemsBingseol";
import { BINGSEOL_WEAPONS, BS_FIELD as F, BS_SHOT as T } from "../weaponsBingseol";
import { fieldR, styleOf } from "./bsKit";
import { iceHit, turn } from "./bsHit";
import { armsTick, onAttack } from "./bsArms";
import { pushShot, shotsTick } from "./bsShots";
import { ultTick } from "./bsUlt";
import { alive } from "./shadowingSpirits";
import type { RunState } from "./types";
import { addEffect, hasPerk, normalize, reachOf } from "./util";

type P = RunState["player"];

export { fieldR, inField, isBingseol, styleOf } from "./bsKit";

const roomKey = (s: RunState) => s.floor * 1000 + s.roomId;
/** 무기 번호 (그림 모양) */
const weaponNo = (p: P) => Math.max(0, Object.keys(BINGSEOL_WEAPONS).indexOf(p.weaponId));

/** 무기 모양대로 한 번 공격 */
function strike(s: RunState): void {
  const p = s.player;
  const st = styleOf(p);
  const k = reachOf(p);
  const reach = st.reach * k;
  const dmg = p.stats.damage * st.mul;
  if (st.shape === 2 || st.shape === 4) {
    const speed = T.speed * Math.max(0.5, p.stats.projectileSpeed / 4);
    for (let i = 0; i < st.n; i++) {
      const [dx, dy] = turn(p, st.n === 1 ? 0 : (i - (st.n - 1) / 2) * st.spread);
      const snow = st.shape === 4;
      pushShot(p, { x: p.x + dx * 8, y: p.y + dy * 8, dx, dy, r: snow ? reach : T.r * k, dmg, kind: snow ? 5 : 0, age: 0, life: Math.max(8, Math.round(p.stats.range / speed)), speed, pierce: st.pierce, hit: [] });
    }
    return;
  }
  for (const e of s.enemies) {
    if (!alive(e)) continue;
    const dx = e.x - p.x;
    const dy = e.y - p.y;
    const dist = Math.hypot(dx, dy);
    if (st.shape === 1) {
      // 찌르기: 앞 줄 위 (줄과 떨어진 거리)
      const along = dx * p.faceX + dy * p.faceY;
      if (along < -e.r || along > reach + e.r || Math.abs(dx * p.faceY - dy * p.faceX) > 8 * k + e.r) continue;
    } else {
      if (dist > reach + e.r) continue;
      if (st.shape === 0 && dist > e.r && (dx * p.faceX + dy * p.faceY) / dist < st.arc) continue;
    }
    const d = normalize(dx, dy) ?? [p.faceX, p.faceY];
    iceHit(s, e, dmg, d[0], d[1]);
  }
  const kind = st.shape === 1 ? "bsThrust" : st.shape === 3 ? "bsSpin" : "bsSlash";
  addEffect(s, { kind, x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: reach, style: weaponNo(p), maxTicks: st.shape === 3 ? 16 : 12 });
}

/** 얼음 영역: 안의 적이 느려짐 · 눈보라 확장 냉기 피해 */
function fieldTick(s: RunState): void {
  const p = s.player;
  const r = fieldR(p);
  const storm = hasPerk(p, "bsStorm") && s.tick % K.bsStorm.every === 0;
  for (const e of s.enemies) {
    if (!alive(e) || (e.x - p.x) ** 2 + (e.y - p.y) ** 2 > (r + e.r) ** 2) continue;
    e.sluggish = Math.max(e.sluggish ?? 0, F.slow);
    if (storm) iceHit(s, e, p.stats.damage * K.bsStorm.mul, 0, 0);
  }
}

/** 틱마다 (얼음 칼날을 들었을 때 player에서) */
export function bingseolTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  const key = roomKey(s);
  if (p.bsRoom !== key) {
    p.bsRoom = key;
    p.bsShots = [];
    p.bsDust = [];
    p.bsBows = [];
    delete p.bsUlt;
    delete p.bsFrozen;
  }
  if ((p.bsCd ?? 0) > 0) p.bsCd = (p.bsCd ?? 0) - 1;
  if (want && (p.bsCd ?? 0) <= 0) {
    p.bsCd = Math.max(6, Math.round(styleOf(p).cd / Math.max(0.3, speed)));
    p.attackCount++;
    p.bsAtkAt = s.tick;
    strike(s);
    onAttack(s);
  }
  fieldTick(s);
  armsTick(s);
  shotsTick(s);
  ultTick(s);
}

/** 연습장 등에서 다시 시작할 때 */
export function resetBingseol(p: P): void {
  for (const k of ["bsCd", "bsRoom", "bsAtkAt", "bsShots", "bsDust", "bsBows", "bsUlt", "bsFrozen", "bsMade5", "bsMade10", "bsChain5", "bsChain10", "bsRest5", "bsRest10", "bsSpin"] as const) delete p[k];
}
