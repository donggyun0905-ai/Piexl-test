// 기간토마키아 뿔 거인 기술 (맞아서 화가 난 동안만, pwLane.laneTick이 부름). 수치 pwRules.PW_GIGA.skill
// 흰 뿔: 돌 던지기 (떨어질 자리에 그림자 → 그 둘레) · 푸른 뿔: 준비 뒤 노린 곳으로 돌진 (지나가며 한 번씩)
// 붉은 뿔: 가까우면 내려찍기 (넓은 원), 멀면 레이저 (준비 동안 조준선 → 곧은 빛). 화면은 render/gigaGiants가 u.sk를 그림
import { PW_GIGA, PW_UNIT } from "../pwRules";
import { allPlayers } from "./party";
import { inPlay } from "./pvpWorld";
import type { PwUnit } from "./pwGrowTypes";
import type { RunState } from "./types";
import { addEffect, segDist2 } from "./util";

const K = PW_GIGA.skill;
type Hit = (s: RunState, seat: number, dmg: number) => void;

/** 자리(x, y)에서 반지름 r 안의 사람 (경기 중) */
function seatsNear(s: RunState, x: number, y: number, r: number): number[] {
  return allPlayers(s).flatMap((p, i) => (inPlay(s, i) && (p.x - x) ** 2 + (p.y - y) ** 2 <= (r + p.r) ** 2 ? [i] : []));
}

/** 기술 시작 (쓸 수 있으면) */
function start(s: RunState, u: PwUnit, tx: number, ty: number, dist: number): void {
  const b = u.body;
  const go = (k: "rock" | "charge" | "laser" | "quake", wind: number, last: number) => {
    u.sk = { k, at: s.tick, fire: s.tick + wind, end: s.tick + wind + last, x: b.x, y: b.y, tx, ty };
    u.skCd = K[k].every;
  };
  if (u.kind === "giantWhite" && dist <= K.rock.range) go("rock", K.rock.wind, K.rock.fly);
  else if (u.kind === "giantBlue" && dist <= K.charge.range && dist > 30) go("charge", K.charge.wind, K.charge.dash);
  else if (u.kind === "giantRed" && dist <= K.quake.range) go("quake", K.quake.wind, 4);
  else if (u.kind === "giantRed" && dist <= K.laser.range) {
    // 레이저: 노린 쪽으로 정해진 길이만큼
    const len = Math.hypot(tx - b.x, ty - b.y) || 1;
    go("laser", K.laser.wind, K.laser.beam);
    u.sk!.tx = b.x + ((tx - b.x) / len) * K.laser.len;
    u.sk!.ty = b.y + ((ty - b.y) / len) * K.laser.len;
  }
}

/** 틱마다: 기술을 쓰는 중이면 true (그동안 보통 공격·걷기 없음) */
export function giantSkill(s: RunState, u: PwUnit, foe: { x: number; y: number } | null, hit: Hit): boolean {
  if (!u.kind.startsWith("giant")) return false;
  const b = u.body;
  if (u.skCd !== undefined && u.skCd > 0) u.skCd--;
  const sk = u.sk;
  if (!sk) {
    if (!foe || (u.skCd ?? 0) > 0) return false;
    start(s, u, foe.x, foe.y, Math.hypot(foe.x - b.x, foe.y - b.y));
    return !!u.sk;
  }
  const dmg = PW_UNIT[u.kind].dmg * u.mul;
  if (s.tick > sk.end) {
    u.sk = undefined;
    return false;
  }
  if (sk.k === "rock" && s.tick === sk.end) {
    addEffect(s, { kind: "slam", x: sk.tx, y: sk.ty, dirX: 0, dirY: 0, size: K.rock.r, maxTicks: 14 });
    for (const i of seatsNear(s, sk.tx, sk.ty, K.rock.r)) hit(s, i, dmg * K.rock.mul);
  } else if (sk.k === "charge" && s.tick >= sk.fire) {
    // 노린 곳으로 달림 (닿으면 멈춤) · 지나가며 부딪힌 사람마다 한 번
    const dx = sk.tx - b.x;
    const dy = sk.ty - b.y;
    const len = Math.hypot(dx, dy);
    if (len > K.charge.speed) {
      b.x += (dx / len) * K.charge.speed;
      b.y += (dy / len) * K.charge.speed;
      b.dirX = dx;
    } else sk.end = s.tick;
    for (const i of seatsNear(s, b.x, b.y, K.charge.r)) {
      if (sk.hit?.includes(i)) continue;
      (sk.hit ??= []).push(i);
      hit(s, i, dmg * K.charge.mul);
    }
  } else if (sk.k === "quake" && s.tick === sk.fire) {
    addEffect(s, { kind: "slam", x: b.x, y: b.y, dirX: 0, dirY: 0, size: K.quake.r, maxTicks: 20 });
    for (const i of seatsNear(s, b.x, b.y, K.quake.r)) hit(s, i, dmg * K.quake.mul);
  } else if (sk.k === "laser" && s.tick === sk.fire) {
    allPlayers(s).forEach((p, i) => {
      if (inPlay(s, i) && segDist2(p, { x: sk.x, y: sk.y }, { x: sk.tx, y: sk.ty }) <= (K.laser.w + p.r) ** 2) hit(s, i, dmg * K.laser.mul);
    });
  }
  return true;
}
