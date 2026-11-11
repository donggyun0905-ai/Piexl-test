// 장수 기술 하나하나: 찌르기 선 · 휘두르기·한 바퀴 · 원 폭발 · 날아가는 검기 · 돌진 내리꽂기 · 크게 내려베기 · 돌진 베기 · 연속 찌르기 · 발 구르기 · 부채꼴 검기 · X자 베기 (콤보 순서는 general, 필살기는 generalLegends)
import { GENERAL_PERKS as K } from "../itemsGeneral";
import { GENERAL } from "../weaponsGeneral";
import { ENEMIES } from "../enemyDefs";
import { damageEnemy as damageEnemy_ } from "./combat";
import { applyBleed } from "./gunExtras";
import type { EnemyState, RunState } from "./types";
import { addEffect, hasPerk, keepInRoom, normalize, roomGrid } from "./util";
import { srcFn } from "./dmgSrc";
const damageEnemy = srcFn("generalMoves", () => damageEnemy_);

/** 적 하나 맞힘: 보스 추가 피해 · 찌르기 출혈 · 쓰러뜨리면 명장의 기세 */
export function spearHit(s: RunState, e: EnemyState, dmg: number, dx: number, dy: number, stab = false): void {
  const p = s.player;
  const boss = ENEMIES[e.kind].boss && hasPerk(p, "armorPierce") ? K.armorPierce.damage : 1;
  damageEnemy(s, e, dmg * boss, dx, dy);
  if (stab && hasPerk(p, "bloodBlade")) applyBleed(e);
  if (e.hp <= 0 && hasPerk(p, "momentum")) p.momentumReady = true;
}

/** 적에게 뛰어들 때 보호막 (이미 있으면 새로 채우지 않고 시간만 늘림 · 끝나면 general.generalTick이 거둠) */
export function dashGuard(s: RunState): void {
  const p = s.player;
  if (!(p.gShieldTicks ?? 0)) p.shieldPts = (p.shieldPts ?? 0) + GENERAL.dashShield;
  p.gShieldTicks = GENERAL.dashShieldTicks;
}

/** 찌르기: 내 앞으로 길이 len, 굵기 width인 선 안의 적 (각도 a만큼 돌리고, 옆으로 off만큼 비켜서) */
export function thrustLine(s: RunState, dmg: number, len: number, width = GENERAL.width, a = 0, off = 0): void {
  const p = s.player;
  const fx = p.faceX * Math.cos(a) - p.faceY * Math.sin(a);
  const fy = p.faceX * Math.sin(a) + p.faceY * Math.cos(a);
  lineHit(s, dmg, p.x - fy * off, p.y + fx * off, fx, fy, len, width);
}

/** 선 하나 (시작점·방향·길이·굵기) 안의 적을 찌르고 창날 선을 그림 */
function lineHit(s: RunState, dmg: number, x0: number, y0: number, fx: number, fy: number, len: number, width: number): void {
  for (const e of [...s.enemies]) {
    if (e.hp <= 0) continue;
    const dx = e.x - x0;
    const dy = e.y - y0;
    const t = dx * fx + dy * fy;
    const side = Math.abs(dx * fy - dy * fx);
    if (t < -e.r || t > len + e.r || side > width + e.r) continue;
    spearHit(s, e, dmg, fx, fy, true);
  }
  addEffect(s, { kind: "thrust", x: x0, y: y0, dirX: fx, dirY: fy, size: len, toX: x0 + fx * len, toY: y0 + fy * len, width, maxTicks: 9 });
}

/** 휘두르기·한 바퀴: 반경 안 앞쪽 부채꼴(arcCos, -1이면 한 바퀴) */
export function sweep(s: RunState, dmg: number, radius: number, arcCos: number, show = true): void {
  const p = s.player;
  for (const e of [...s.enemies]) {
    if (e.hp <= 0) continue;
    const dx = e.x - p.x;
    const dy = e.y - p.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d > radius + e.r) continue;
    if (arcCos > -1 && d > p.r + e.r && (dx * p.faceX + dy * p.faceY) / d < arcCos) continue;
    spearHit(s, e, dmg, d === 0 ? p.faceX : dx / d, d === 0 ? p.faceY : dy / d);
  }
  const spin = arcCos <= -1;
  if (show) addEffect(s, { kind: "swing", x: p.x, y: p.y, dirX: spin ? 0 : p.faceX, dirY: spin ? 0 : p.faceY, size: radius, maxTicks: 9, width: 3 });
}

/** 원 안 모든 적 */
export function burst(s: RunState, x: number, y: number, radius: number, dmg: number): void {
  for (const e of [...s.enemies]) {
    if (e.hp <= 0) continue;
    const rr = radius + e.r;
    if ((e.x - x) ** 2 + (e.y - y) ** 2 > rr * rr) continue;
    const d = normalize(e.x - x, e.y - y) ?? [0, 0];
    spearHit(s, e, dmg, d[0], d[1]);
  }
  addEffect(s, { kind: "blast", x, y, dirX: 0, dirY: 0, size: radius, maxTicks: 14 });
}

/** 앞으로 날아가는 검기 (관통) */
export function wave(s: RunState, dmg: number, range: number, a = 0, spirit: "crescent" | "spearShot" = "crescent"): void {
  const p = s.player;
  const fx = p.faceX * Math.cos(a) - p.faceY * Math.sin(a);
  const fy = p.faceX * Math.sin(a) + p.faceY * Math.cos(a);
  const sp = 3.5;
  s.projectiles.push({ id: s.nextId++, fromPlayer: true, x: p.x + fx * 6, y: p.y + fy * 6, prevX: p.x, prevY: p.y, r: spirit === "crescent" ? 6 : 3, vx: fx * sp, vy: fy * sp, damage: dmg, ticksLeft: Math.ceil(range / sp), pierce: 99, hitIds: [], spirit });
}

/** 돌진 내리꽂기: 몸을 살짝 돌리며 앞으로 나가 찌르고 끝에서 폭발 */
export function lunge(s: RunState, dmg: number, len: number): void {
  const p = s.player;
  const dist = GENERAL.lungeDist * (hasPerk(p, "redHare") ? K.redHare.lunge : 1);
  dashGuard(s);
  p.x += p.faceX * dist;
  p.y += p.faceY * dist;
  keepInRoom(p, roomGrid(s));
  thrustLine(s, dmg * 0.6, len, GENERAL.width + 2);
  burst(s, p.x + p.faceX * len, p.y + p.faceY * len, GENERAL.lungeBlast * (hasPerk(p, "warBanner") ? K.warBanner.area : 1), dmg);
}

/** 크게 내려베기: 넓고 깊은 앞쪽 반원 (휘두르기보다 멀리·넓게) */
export function cleave(s: RunState, dmg: number, range: number): void {
  sweep(s, dmg, range * 1.05, -0.1);
}

/** 돌진 베기: 앞으로 멀리 달려가며 지나간 길 위의 적을 모두 벰 (폭발 없음) */
export function rush(s: RunState, dmg: number): void {
  const p = s.player;
  const dist = GENERAL.rushDist * (hasPerk(p, "redHare") ? K.redHare.lunge : 1);
  dashGuard(s);
  const x0 = p.x;
  const y0 = p.y;
  p.x += p.faceX * dist;
  p.y += p.faceY * dist;
  keepInRoom(p, roomGrid(s));
  const len = Math.hypot(p.x - x0, p.y - y0);
  for (const e of [...s.enemies]) {
    if (e.hp <= 0) continue;
    const t = (e.x - x0) * p.faceX + (e.y - y0) * p.faceY;
    const side = Math.abs((e.x - x0) * p.faceY - (e.y - y0) * p.faceX);
    if (t < -e.r || t > len + 12 + e.r || side > GENERAL.width + 4 + e.r) continue;
    spearHit(s, e, dmg, p.faceX, p.faceY);
  }
  addEffect(s, { kind: "streak", x: x0, y: y0, dirX: p.faceX, dirY: p.faceY, size: 4, toX: p.x + p.faceX * 12, toY: p.y + p.faceY * 12, maxTicks: 14 });
}

/** 연속 찌르기: 다섯 번 빠르게 (살짝 퍼짐), 피해는 다섯으로 나눔 */
export function flurry(s: RunState, dmg: number, range: number): void {
  for (let i = 0; i < 5; i++) thrustLine(s, dmg / 5, range, GENERAL.width - 2, (i - 2) * 0.09);
}

/** 발 구르기: 내 둘레 충격파 */
export function shock(s: RunState, dmg: number, range: number): void {
  const p = s.player;
  burst(s, p.x, p.y, range * GENERAL.shockReach, dmg);
  addEffect(s, { kind: "ring", x: p.x, y: p.y, dirX: 0, dirY: 0, size: range * GENERAL.shockReach, maxTicks: 18 });
}

/** 부채꼴 검기 셋 */
export function fan(s: RunState, dmg: number, range: number): void {
  for (const a of [-0.35, 0, 0.35]) wave(s, dmg / 3, range * 2.5, a);
}

/** X자 베기: 엇갈린 두 줄 */
export function cross(s: RunState, dmg: number, range: number): void {
  // 내 앞 range*0.55 자리에서 엇갈리는 대각선 두 줄 (X자), 각 줄 길이 range*0.9
  const p = s.player;
  const cx = p.x + p.faceX * range * 0.55;
  const cy = p.y + p.faceY * range * 0.55;
  const half = range * 0.45;
  for (const side of [-1, 1]) {
    const c = Math.SQRT1_2;
    const fx = (p.faceX - side * p.faceY) * c;
    const fy = (p.faceY + side * p.faceX) * c;
    lineHit(s, dmg / 2, cx - fx * half, cy - fy * half, fx, fy, half * 2, GENERAL.width + 1);
  }
}
