// 수집가 수집 무기 30의 공격 하나하나 (sim/collector가 콤보 차례에 부름). 여러 번 때리는 무기는 clQueue에 다음 칸을 예약
// 그리기 효과 clMove: from = 모양(arc 초승달 베기 · streak 뻗어 나가는 화살 빛 · spin 한 바퀴 · thrust 찌르기 · slam 내려찍기 · spikes 얼음 가시 · claw 발톱
//   · beam 빛줄기 · charge 모으기 · fist 주먹 · shock 충격파 · pillar 빛기둥 · vortex 소용돌이 · vines 덩굴 · flash 총구 불꽃)
//   · tint = 무기 색 · motif = 무기 id(무기 그림) · arc = 베기 반각 · style = 기울기(1 / · -1 \ · 2 위에서 아래) · width = 굵기
// 날아가는 탄은 spirit "clShot" (tint = 무기 id, 그림은 render/collector)
import { CL_ARMS, type ClArmId } from "../itemsCollector";
import { healPlayer } from "./combat";
import { applyBleed } from "./gunExtras";
import { inCircle, inCone, isBoss, onSegment, root, shoot, strike as strike_, stun } from "./s2Kit";
import { ignite } from "./status";
import type { EnemyState, ProjectileState, RunState } from "./types";
import { addEffect, keepInRoom, normalize, roomGrid } from "./util";
import { srcFn } from "./dmgSrc";
const strike = srcFn("collectorMoves", () => strike_);

type Vis = "arc" | "streak" | "spin" | "thrust" | "slam" | "spikes" | "claw" | "beam" | "charge" | "fist" | "shock" | "pillar" | "vortex" | "vines" | "flash";

/** 이펙트 하나 (a = 방향 각) */
function fx(s: RunState, id: ClArmId, vis: Vis, x: number, y: number, a: number, size: number, more: { arc?: number; style?: number; width?: number; toX?: number; toY?: number; ticks?: number } = {}): void {
  addEffect(s, { kind: "clMove", x, y, dirX: Math.cos(a), dirY: Math.sin(a), size, maxTicks: more.ticks ?? 16, from: vis, tint: CL_ARMS[id].color, motif: id, arc: more.arc, style: more.style, width: more.width, toX: more.toX, toY: more.toY });
}

/** 맞힘: 피해 + 무기 추가 효과 (준 피해 합) */
function hit(s: RunState, id: ClArmId, list: EnemyState[], mul: number, cx = s.player.x, cy = s.player.y): number {
  const arm = CL_ARMS[id];
  const dmg = s.player.stats.damage * arm.mul * mul;
  const v = arm.val ?? 0;
  for (const e of list) {
    strike(s, e, dmg, arm.fx === "push" ? v : 0);
    if (arm.fx === "slow") e.slowTicks = Math.max(e.slowTicks ?? 0, v);
    else if (arm.fx === "burn") ignite(e, dmg * v);
    else if (arm.fx === "stun") stun(e, v);
    else if (arm.fx === "root") root(e, v);
    else if (arm.fx === "bleed" && e.hp > 0) applyBleed(e);
    else if (arm.fx === "pull" && !isBoss(e)) {
      const d = normalize(cx - e.x, cy - e.y);
      if (d && Math.hypot(cx - e.x, cy - e.y) > v) {
        e.x += d[0] * v;
        e.y += d[1] * v;
      }
    }
  }
  const sum = dmg * list.length;
  if (arm.fx === "heal" && sum > 0) healPlayer(s, v);
  if (arm.fx === "leech" && sum > 0) healPlayer(s, sum * v);
  return sum;
}

/** 방향 각 a로 뻗은 줄 (길이 len, 굵기 w) */
const line = (s: RunState, a: number, len: number, w: number, x = s.player.x, y = s.player.y) => onSegment(s, x, y, x + Math.cos(a) * len, y + Math.sin(a) * len, w);
/** 방향 각 a의 부채꼴 (cos) */
function cone(s: RunState, a: number, reach: number, cosArc: number): EnemyState[] {
  const p = s.player;
  const [fx0, fy0] = [p.faceX, p.faceY];
  [p.faceX, p.faceY] = [Math.cos(a), Math.sin(a)];
  const out = inCone(s, reach, cosArc);
  [p.faceX, p.faceY] = [fx0, fy0];
  return out;
}

/** 수집 탄 (방향 각 a) */
function shot(s: RunState, id: ClArmId, a: number, mul: number, opt: Partial<ProjectileState> & { range: number; speed: number }): void {
  const p = s.player;
  const base = Math.atan2(p.faceY, p.faceX);
  shoot(s, a - base, { damage: p.stats.damage * CL_ARMS[id].mul * mul, spirit: "clShot", range: opt.range, speed: opt.speed, r: opt.r ?? 3 });
  const pr = s.projectiles[s.projectiles.length - 1]!;
  Object.assign(pr, { tint: id }, opt);
  delete (pr as { range?: number }).range;
  delete (pr as { speed?: number }).speed;
  if (CL_ARMS[id].fx === "slow") pr.slow = CL_ARMS[id].val;
  if (CL_ARMS[id].fx === "bleed") pr.bleed = true;
}

/** 내 앞 dist 자리 */
const ahead = (s: RunState, a: number, dist: number): [number, number] => [s.player.x + Math.cos(a) * dist, s.player.y + Math.sin(a) * dist];

/** 무기 id의 k번째 칸 (a = 노린 방향 각, tx·ty = 노린 자리). 다음 칸까지 틱을 돌려줌 (없으면 0) */
export function armMove(s: RunState, id: ClArmId, k: number, a: number, tx: number, ty: number): number {
  const p = s.player;
  const r = CL_ARMS[id].reach;
  switch (id) {
    case "clHolySword":
      hit(s, id, cone(s, a, r, 0.1), 1);
      fx(s, id, "arc", p.x, p.y, a, r, { arc: 1.1, width: 8 });
      return 0;
    case "clBloodSword": {
      // X자 베기: / 한 번 → \ 한 번
      const tilt = k === 0 ? 1 : -1;
      hit(s, id, cone(s, a, r, 0.2), 0.8);
      fx(s, id, "arc", ...ahead(s, a, 18), a, r * 1.25, { arc: 1.2, style: tilt, width: 9, ticks: 14 });
      return k === 0 ? 5 : 0;
    }
    case "clIceSword": {
      // 앞으로 내려찍기 → 그 자리에 얼음 가시
      const [x, y] = ahead(s, a, 22);
      hit(s, id, inCircle(s, x, y, 26), 1.2, x, y);
      fx(s, id, "arc", p.x, p.y, a, r * 0.9, { arc: 0.9, style: 2, width: 8 });
      fx(s, id, "spikes", x, y, a, 26, { ticks: 26 });
      return 0;
    }
    case "clSunSword":
      hit(s, id, inCircle(s, p.x, p.y, r), 1);
      fx(s, id, "spin", p.x, p.y, a, r, { width: 8, ticks: 18 });
      return 0;
    case "clVoidSword":
      hit(s, id, cone(s, a, 48, 0), 1.2, p.x, p.y);
      fx(s, id, "arc", p.x, p.y, a, 48, { arc: 1.6, width: 12, ticks: 18 });
      return 0;
    case "clChainCleaver":
      hit(s, id, cone(s, a, 62, -0.35), 1);
      fx(s, id, "arc", p.x, p.y, a, 62, { arc: 2, width: 16, ticks: 20 });
      return 0;
    case "clKatana": {
      // 방랑객의 칼선으로 네 번 연속 (더 긴 칼선)
      const list = line(s, a + (k % 2 ? 0.25 : -0.25), r, 12);
      hit(s, id, list, 0.55);
      const e = list[0];
      const [cx, cy] = e ? [e.x, e.y] : ahead(s, a, r * 0.6);
      const q = (k % 2 ? 1 : -1) * 0.9;
      addEffect(s, { kind: "wdCut", x: cx, y: cy, dirX: Math.cos(a + q), dirY: Math.sin(a + q), size: 30, maxTicks: 12 });
      return k < 3 ? 4 : 0;
    }
    case "clSunStaff":
      hit(s, id, inCircle(s, tx, ty, r), 1, tx, ty);
      fx(s, id, "pillar", tx, ty, a, r, { ticks: 24 });
      return 0;
    case "clVoidStaff":
      // 노린 자리에 블랙홀: 세 번 끌어당기며 때림
      hit(s, id, inCircle(s, tx, ty, r), 0.5, tx, ty);
      if (k === 0) fx(s, id, "vortex", tx, ty, a, r, { ticks: 34 });
      return k < 2 ? 10 : 0;
    case "clVineStaff":
      hit(s, id, inCircle(s, tx, ty, r), 1, tx, ty);
      fx(s, id, "vines", tx, ty, a, r, { ticks: 30 });
      return 0;
    case "clWhiteBow":
      // 유도 화살 셋
      for (const d of [-0.35, 0, 0.35]) shot(s, id, a + d, 1, { range: 200, speed: 3.6, homing: true, r: 3 });
      return 0;
    case "clBloodBow":
      // 그대로: 화살 세 줄을 바로
      for (const d of [-0.16, 0, 0.16]) hit(s, id, line(s, a + d, r, 4), 1);
      for (const d of [-0.16, 0, 0.16]) fx(s, id, "streak", p.x, p.y, a + d, r, { width: 2, ticks: 12 });
      return 0;
    case "clIceBow":
      // 얼음 가지: 부채꼴로 퍼지고 맞으면 두 갈래로 갈라지는 화살
      for (let i = 0; i < 5; i++) shot(s, id, a + (i - 2) * 0.28, 0.8, { range: 160, speed: 3.8, split: true, r: 3 });
      return 0;
    case "clGoldBow":
      shot(s, id, a, 2.4, { range: 240, speed: 4.4, pierce: 99, hitIds: [], r: 7 });
      fx(s, id, "charge", p.x, p.y, a, 14, { ticks: 12 });
      return 0;
    case "clCrossbow":
      shot(s, id, a, 1, { range: 240, speed: 6, pierce: 2, hitIds: [], bleed: true, r: 3 });
      return 0;
    case "clPistol": {
      // 산탄: 일곱 발이 퍼지며 · 쏜 반동으로 뒤로 밀림
      for (let i = 0; i < 7; i++) shot(s, id, a + (i - 3) * 0.09, 1, { range: 110, speed: 5, r: 2 });
      fx(s, id, "flash", ...ahead(s, a, 10), a, 14, { ticks: 8 });
      p.x -= Math.cos(a) * 10;
      p.y -= Math.sin(a) * 10;
      keepInRoom(p, roomGrid(s));
      return 0;
    }
    case "clStarTome":
      // 몸 둘레의 별빛 여덟이 적을 쫓아감
      for (let i = 0; i < 8; i++) shot(s, id, (i / 8) * Math.PI * 2, 1, { range: 220, speed: 2.6, seek: true, homing: true, r: 3 });
      return 0;
    case "clEyeTome":
      // 모았다가 레이저
      if (k === 0) {
        fx(s, id, "charge", ...ahead(s, a, 12), a, 16, { ticks: 10 });
        return 8;
      }
      hit(s, id, line(s, a, r, 9), 1);
      fx(s, id, "beam", ...ahead(s, a, 12), a, r, { width: 9, toX: p.x + Math.cos(a) * r, toY: p.y + Math.sin(a) * r, ticks: 18 });
      return 0;
    case "clGoldFist":
      hit(s, id, cone(s, a, r, 0.55), 1);
      fx(s, id, "fist", p.x, p.y, a, r, { ticks: 16 });
      fx(s, id, "shock", ...ahead(s, a, -10), a + Math.PI, 30, { ticks: 16 });
      return 0;
    case "clClaw": {
      // 호랑이 발톱처럼 / 한 번 \ 한 번
      const [x, y] = ahead(s, a, 16);
      hit(s, id, inCircle(s, x, y, r), 1, x, y);
      fx(s, id, "claw", x, y, a, r, { style: k === 0 ? 1 : -1, ticks: 14 });
      return k === 0 ? 5 : 0;
    }
    case "clBlueSpear":
      // 바닥을 찍고(둘레) → 앞으로 지르기
      if (k === 0) {
        hit(s, id, inCircle(s, p.x, p.y, 30), 0.8);
        fx(s, id, "slam", p.x, p.y, a, 30, { ticks: 18 });
        return 6;
      }
      hit(s, id, line(s, a, 90, 7), 1.2);
      fx(s, id, "thrust", p.x, p.y, a, 90, { width: 7 });
      return 0;
    case "clRedSpear":
      if (k === 0) {
        hit(s, id, cone(s, a, 40, 0.1), 0.8);
        fx(s, id, "arc", p.x, p.y, a, 40, { arc: 1.1, width: 9 });
        return 5;
      }
      hit(s, id, line(s, a, 95, 7), 1.2);
      fx(s, id, "thrust", p.x, p.y, a, 95, { width: 7 });
      return 0;
    case "clIceSpear": {
      // 앞으로 사방팔방 열 번 찌르기
      const q = a + (((k * 7) % 11) / 10 - 0.5) * 1.6;
      hit(s, id, line(s, q, 80, 5), 0.35);
      fx(s, id, "thrust", p.x, p.y, q, 80, { width: 4, ticks: 10 });
      return k < 9 ? 2 : 0;
    }
    case "clGoldSpear":
      hit(s, id, [...new Set([...line(s, a, 110, 7), ...cone(s, a, 44, 0.1)])], 1.2);
      fx(s, id, "thrust", p.x, p.y, a, 110, { width: 8 });
      fx(s, id, "arc", p.x, p.y, a, 44, { arc: 1.1, width: 10 });
      return 0;
    case "clStoneHammer":
      // 천천히 치켜들었다(빈칸) → 크게 휘두름
      if (k === 0) {
        fx(s, id, "charge", p.x, p.y - 14, a, 12, { ticks: 12 });
        return 12;
      }
      hit(s, id, cone(s, a, 46, -0.2), 1.6);
      fx(s, id, "arc", p.x, p.y, a, 46, { arc: 1.4, width: 16, ticks: 22 });
      fx(s, id, "slam", ...ahead(s, a, 26), a, 34, { ticks: 20 });
      return 0;
    case "clBloodHammer":
      // 휘두른 뒤 피의 칼날이 날아감
      hit(s, id, cone(s, a, 40, -0.1), 1.2);
      fx(s, id, "arc", p.x, p.y, a, 40, { arc: 1.3, width: 14, ticks: 18 });
      shot(s, id, a, 0.8, { range: 160, speed: 4, pierce: 99, hitIds: [], r: 8 });
      return 0;
    case "clBlueAxe":
      hit(s, id, cone(s, a, 40, -0.1), 1);
      fx(s, id, "arc", p.x, p.y, a, 40, { arc: 1.3, width: 12 });
      shot(s, id, a, 0.8, { range: 160, speed: 4, pierce: 99, hitIds: [], r: 8 });
      return 0;
    case "clRedAxe": {
      // 빠르게 세 번 (좌·우·좌)
      const side = k % 2 ? -1 : 1;
      hit(s, id, cone(s, a, r, 0.1), 0.7);
      fx(s, id, "arc", p.x, p.y, a + side * 0.2, r, { arc: 1, style: side, width: 10, ticks: 12 });
      return k < 2 ? 3 : 0;
    }
    case "clScythe": {
      // 왼쪽으로 크게 → 위에서 아래로 → 왼쪽에서 오른쪽으로
      const style = [1, 2, -1][k]!;
      hit(s, id, cone(s, a, r, k === 1 ? 0.3 : -0.3), 0.8);
      fx(s, id, "arc", p.x, p.y, a, r, { arc: k === 1 ? 1 : 1.7, style, width: 14, ticks: 16 });
      return k < 2 ? 6 : 0;
    }
    case "clCrescent":
      // 되돌아오는 칼날 둘 + 앞으로 검격 두 번
      if (k === 0) for (const d of [-0.35, 0.35]) shot(s, id, a + d, 0.8, { range: r, speed: 3.6, back: true, span: 40, pierce: 99, hitIds: [], r: 6 });
      hit(s, id, cone(s, a, 36, 0.1), 0.7);
      fx(s, id, "arc", p.x, p.y, a, 36, { arc: 1.1, style: k === 0 ? 1 : -1, width: 9, ticks: 12 });
      return k === 0 ? 5 : 0;
  }
  return 0;
}
