// 추적자(아스칼론, 시즌 2): 저격총 하나 + 스킬 셋 (PC 1·2·3 키, 모바일 스킬 버튼)
// 1 암습 저격: 보호막 20, 화면이 어두워진 채 5초 동안 직접 조준해 쏨 (조준경 가운데 작은 원 안의 적만 맞음, 한 발 200%, 다시 누르면 끝 · 일찍 끝내면 남은 시간만큼 대기가 줄어듦) · 대기 10초
// 2 강력한 한방: 모으는 동안 앞에 탄을 막는 벽 → 방을 꿰뚫는 한 줄 (공격력 1000% + 최대 체력 20%, 보스는 그 1/5) · 대기 60초
// 3 연발사격: 조준 없이 10발을 흩뿌려 쏨 · 대기 3초. 세 스킬은 서로 쓰는 도중에도 같이 쓸 수 있음. 수치는 weaponsTracker.TRACKER, 아이템은 itemsTracker
import { srcRun } from "./dmgSrc";
import { tuneVal } from "./trTune";
import { TICK_RATE } from "../constants";
import { TRACKER_PERKS as K } from "../itemsTracker";
import { createRng, deriveSeed } from "../rng";
import { TRACKER as T } from "../weaponsTracker";
import { alive, inLine, isBoss, shoot, strike } from "./s2Kit";
import { AIM_DIST_STEP, type TickInput } from "./inputTypes";
import type { EnemyState, PlayerState, ProjectileState, RunState } from "./types";
import { addEffect, dist2, hasPerk, normalize, weaponOf } from "./util";

/** 입력 중 이 틱에 쓰는 것을 담아 둠: 누른 곳까지 거리(레이저·의사·거너·저격) · 누른 스킬 키 (player에서 부름) */
export function readAim(p: PlayerState, input: TickInput): void {
  const k = weaponOf(p).kind;
  if (k === "laser" || k === "medic" || k === "gun" || k === "snipe" || k === "bomb" || k === "blueFire") p.aimDist = input.autoAim ? undefined : (Math.sqrt(input.aimX * input.aimX + input.aimY * input.aimY) / 100) * AIM_DIST_STEP;
  p.trKey = input.skill;
  // 패왕전 직접 조준: 누른 곳까지 거리 (자동 조준이면 없음, pwBasic.manualAim)
  p.pwAimD = input.autoAim ? undefined : (Math.sqrt(input.aimX * input.aimX + input.aimY * input.aimY) / 100) * AIM_DIST_STEP;
}

const isTracker = (p: PlayerState) => p.characterId === "tracker" && weaponOf(p).kind === "snipe";
const roll = (s: RunState, tag: string, n: number) => createRng(deriveSeed(s.seed, tag, s.tick, n)).nextFloat();

/** 스킬마다 대기 틱 (아이템 반영) */
export function trackerCooldown(p: PlayerState, i: number): number {
  const base = Math.round((T.cooldowns[i] ?? 0) * tuneVal(p, "cd") * (i === 2 ? tuneVal(p, "cd3") : 1));
  if (i === 0 && hasPerk(p, "trSilencer")) return Math.round(base * K.trSilencer.cd);
  if (i === 1 && hasPerk(p, "trCharge")) return K.trCharge.cd;
  return base;
}

/** 화면용: 스킬마다 남은 대기 0~1 (0 = 쓸 수 있음) */
export function trackerSkills(p: PlayerState): number[] {
  return [0, 1, 2].map((i) => Math.min(1, (p.trCd?.[i] ?? 0) / Math.max(1, trackerCooldown(p, i))));
}

/** 한 발 피해 배율: 할로 포인트(평소만) · 양각대 · 헤드샷 */
function shotMul(s: RunState, normal: boolean, n: number): number {
  const p = s.player;
  let m = normal && hasPerk(p, "trHollow") ? K.trHollow.mul : 1;
  if (hasPerk(p, "trBipod") && p.stillTicks >= K.trBipod.still) m *= K.trBipod.mul;
  if (hasPerk(p, "trHeadshot") && roll(s, "trHead", n) < K.trHeadshot.chance) m *= K.trHeadshot.mul;
  return m;
}

/** 맞힌 적: 사냥감 표식 */
function marked(p: PlayerState, e: EnemyState): void {
  if (hasPerk(p, "trMark")) e.trMarked = K.trMark.ticks;
}

/** 평소 저격탄·연발탄이 맞았을 때 (s2Hits): 표식 · 도탄 */
export function trackerShotHit(s: RunState, pr: ProjectileState, e: EnemyState): void {
  const p = s.player;
  if (p.characterId !== "tracker") return;
  marked(p, e);
  if (pr.spirit !== "trBullet" || !hasPerk(p, "trRicochet")) return; return srcRun(s, "trRicochet", () => {
  const next = alive(s)
    .filter((o) => o !== e && dist2(o, e) <= K.trRicochet.reach ** 2)
    .sort((a, b) => dist2(a, e) - dist2(b, e) || a.id - b.id)[0];
  if (!next) return;
  const d = normalize(next.x - e.x, next.y - e.y) ?? [1, 0];
  s.projectiles.push({ id: s.nextId++, fromPlayer: true, x: e.x, y: e.y, prevX: e.x, prevY: e.y, r: 2, vx: d[0] * 6, vy: d[1] * 6, damage: pr.damage * K.trRicochet.mul, ticksLeft: 20, spirit: "trRico", hitIds: [e.id], pierce: 0 });
}); }

/** 암습 저격 한 발: 누른 곳(조준경 가운데)의 작은 원 안에 몸 가운데가 들어온 적만 맞음 (자동 조준 없음) */
function ambushShot(s: RunState): void {
  const p = s.player;
  const a = p.trAmbush!;
  const r = T.ambushR * tuneVal(p, "scopeR") * (hasPerk(p, "trScope") ? K.trScope.ring : 1);
  const x = p.x + p.faceX * (p.aimDist ?? 60);
  const y = p.y + p.faceY * (p.aimDist ?? 60);
  let best: EnemyState | undefined;
  let bestD = Infinity;
  for (const e of alive(s)) {
    const d = Math.hypot(e.x - x, e.y - y);
    if (d <= r + e.r * 0.5 && d < bestD) [best, bestD] = [e, d];
  }
  a.gap = T.ambushGap;
  p.trShot = s.tick;
  if (best) {
    strike(s, best, p.stats.damage * T.ambushMul * shotMul(s, false, s.tick));
    marked(p, best);
  }
  addEffect(s, { kind: "trSnipe", x, y, dirX: p.faceX, dirY: p.faceY, size: r, maxTicks: 14, width: best ? 1 : 0 });
}

/** 암습 저격 끝: 대기 시작 (일찍 끝내면 남은 시간만큼 덜 기다림) · 받은 보호막 거둠 */
function endAmbush(p: PlayerState): void {
  const a = p.trAmbush;
  if (!a) return;
  delete p.trAmbush;
  p.shieldPts = Math.min(p.shieldPts ?? 0, a.base);
  (p.trCd ??= [0, 0, 0])[0] = Math.max(0, trackerCooldown(p, 0) - Math.max(0, a.t));
}

/** 강력한 한방: 방을 꿰뚫는 한 줄 */
function powerShot(s: RunState): void {
  const p = s.player;
  const len = 420;
  for (const e of inLine(s, len, T.powerWidth)) {
    const hp = e.maxHp * T.powerHp * (isBoss(e) ? T.powerBoss : 1);
    strike(s, e, p.stats.damage * T.powerMul * shotMul(s, false, e.id) + hp, 16);
    marked(p, e);
  }
  addEffect(s, { kind: "trBeam", x: p.x, y: p.y - 3, dirX: p.faceX, dirY: p.faceY, size: T.powerWidth, toX: p.x + p.faceX * len, toY: p.y - 3 + p.faceY * len, maxTicks: 30 });
}

/** 모으는 동안 앞의 벽이 적 탄을 막음 */
function wallBlock(s: RunState): void {
  const p = s.player;
  const cx = p.x + p.faceX * T.wallDist;
  const cy = p.y + p.faceY * T.wallDist;
  const half = (T.wallWidth * tuneVal(s.player, "wall")) / 2;
  s.projectiles = s.projectiles.filter((pr) => {
    if (pr.fromPlayer) return true;
    const dx = pr.x - cx;
    const dy = pr.y - cy;
    const along = Math.abs(dx * -p.faceY + dy * p.faceX);
    const depth = Math.abs(dx * p.faceX + dy * p.faceY);
    if (along > half || depth > pr.r + 3) return true;
    addEffect(s, { kind: "hit", x: pr.x, y: pr.y, dirX: 0, dirY: 0, size: 3, maxTicks: 6 });
    return false;
  });
}

/** 스킬 키 (1·2·3) */
function useSkill(s: RunState, i: number): void {
  const p = s.player;
  const cd = (p.trCd ??= [0, 0, 0]);
  // 암습 저격 중에 1을 다시 누르면 바로 끝 · 다른 스킬을 쓰는 도중에도 쓸 수 있음
  if (i === 0 && p.trAmbush) return endAmbush(p);
  if ((cd[i] ?? 0) > 0 || (i === 1 && p.trCharge)) return;
  if (i === 0) {
    // 무적 대신 보호막 20 (겹치지 않고 20으로 맞춤)
    const base = p.shieldPts ?? 0;
    p.shieldPts = Math.max(base, T.ambushShield + tuneVal(p, "shield"));
    p.trAmbush = { t: Math.round(T.ambushTicks * tuneVal(p, "ambT")), gap: 0, base };
  }
  else if (i === 1) p.trCharge = T.powerCharge;
  else p.trBurst = { left: hasPerk(p, "trDrum") ? K.trDrum.shots : T.burstShots, gap: 0 };
  // 암습 저격은 끝난 뒤부터 대기
  if (i !== 0) cd[i] = trackerCooldown(p, i);
  addEffect(s, { kind: "trSkill", x: p.x, y: p.y, dirX: i, dirY: 0, size: 14, maxTicks: 16 });
}

/** 틱마다 (저격총을 들었을 때 player에서) */
export function trackerTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  if (!isTracker(p)) return;
  const cd = (p.trCd ??= [0, 0, 0]);
  for (let i = 0; i < cd.length; i++) if (cd[i]! > 0) cd[i]!--;
  for (const e of s.enemies) if ((e.trMarked ?? 0) > 0) e.trMarked!--;
  // 위장복: 대시하면 잠깐 받는 피해 줄어듦 (trackerGuard)
  if (p.dashTicks > 0 && !p.trDash && hasPerk(p, "trCamo")) p.trCamo = K.trCamo.ticks;
  if ((p.trCamo ?? 0) > 0) p.trCamo!--;
  p.trDash = p.dashTicks > 0;
  if (p.trKey && p.trKey >= 1 && p.trKey <= 3) useSkill(s, p.trKey - 1);
  // 연발사격 (움직이며 쏠 수 있음)
  const b = p.trBurst;
  if (b && --b.gap <= 0) {
    const a = (roll(s, "trBurst", b.left) - 0.5) * 2 * T.burstSpread * tuneVal(s.player, "spread");
    shoot(s, a, { damage: p.stats.damage * T.burstMul * shotMul(s, false, b.left), spirit: "trBurst", range: p.stats.range * 0.8, speed: 7, r: 2 });
    p.trShot = s.tick;
    b.gap = T.burstGap;
    if (--b.left <= 0) delete p.trBurst;
  }
  // 암습 저격: 움직이며 5초 동안 직접 조준해 쏨 (자동 조준이면 쏘지 않음)
  const am = p.trAmbush;
  if (am) {
    am.t--;
    if (am.gap > 0) am.gap--;
    if (am.gap <= 0 && want && p.aimDist !== undefined) ambushShot(s);
    if (am.t <= 0) endAmbush(p);
  }
  // 강력한 한방: 모으는 동안 앞에 벽 (움직일 수 있음, 암습 저격과 같이 쓸 수 있음)
  if (p.trCharge) {
    wallBlock(s);
    if (--p.trCharge <= 0) {
      delete p.trCharge;
      powerShot(s);
    }
  }
  // 평소 사격은 암습 저격·모으기 중에는 쉼
  if (p.trAmbush || p.trCharge || !want || p.attackCooldown > 0) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  p.trShot = s.tick;
  shoot(s, 0, { damage: p.stats.damage * shotMul(s, true, p.attackCount), spirit: "trBullet", range: p.stats.range, speed: p.stats.projectileSpeed, pierce: T.pierce, r: 2 });
}

/** 사냥감 표식이 붙은 적이 받는 피해 배율 (combat) */
export const trackerTaken = (e: EnemyState) => ((e.trMarked ?? 0) > 0 ? K.trMark.taken : 1);

/** 위장복: 대시한 뒤 잠깐 플레이어가 받는 피해 배율 (combat) */
export const trackerGuard = (p: PlayerState) => ((p.trCamo ?? 0) > 0 ? K.trCamo.taken : 1);

/** 연습장 등에서 다시 시작할 때 */
export function resetTracker(p: PlayerState): void {
  for (const k of ["trCd", "trAmbush", "trCharge", "trBurst", "trShot", "trDash", "trKey", "trCamo"] as const) delete p[k];
}
