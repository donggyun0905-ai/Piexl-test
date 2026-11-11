// 실버불렛(새벽의 성흔, 은빛 집행자): 누르고 있으면 쌍권총 (한 번에 은탄 두 발: 오른손 → 조금 뒤 왼손 · 공격력 낮고 빠름 · 모든 공격이 달빛 상태이상 sim/moonlight)
// 기본 공격 몇 번마다 성수 폭탄(광역 정화) · 대시: 장애물을 넘고 가까운 적에게 은탄 두 발 · 은탄 마크가 30이면 연사 2초 (성흔 안 참)
// 성흔이 가득 차면 달빛 각성: 버프 + 몸이 고정되고 앞에 흰 활 ) → 가운데 두 발·양끝 유도 두 발씩 매우 빠르게 (sim/silverBulletKit) · 수치 weaponsSilverBullet · 아이템 itemsSilverBullet
import { srcRun, srcFn } from "./dmgSrc";
import { TICK_RATE } from "../constants";
import { SILVER_BULLET_PERKS as K } from "../itemsSilverBullet";
import { SILVER_BULLET as B } from "../weaponsSilverBullet";
import { alive, inCircle, roomKey, strike as strike_ } from "./s2Kit";
import { isAwake, stigmaTick } from "./stigma";
import { bombsTick as bombsTick_, markNeed, sbDmg, shoot, shotsTick, throwBomb } from "./silverBulletKit";
import type { EnemyState, RunState } from "./types";
import { addEffect, hasPerk } from "./util";
const strike = srcFn("silverBullet", () => strike_), bombsTick = srcFn("silverBullet", () => bombsTick_);

/** 손 자리: side 1 오른손 · -1 왼손 (바라보는 쪽 기준) */
const gun = (s: RunState, side: number) => ({ x: s.player.x - s.player.faceY * B.gunSide * side, y: s.player.y - 4 + s.player.faceX * B.gunSide * side });

/** 한 손으로 은탄 한 발 (k 0 오른손 · 1 왼손) */
function fireHand(s: RunState, k: number): void {
  const p = s.player;
  const g = gun(s, k === 0 ? 1 : -1);
  const mul = B.shotMul * (hasPerk(p, "sbHollow") ? K.sbHollow.mul : 1);
  shoot(p, g.x, g.y, p.faceX, p.faceY, B.shotSpeed, mul, k, hasPerk(p, "sbPierce") ? { pierce: K.sbPierce.add } : {});
  addEffect(s, { kind: "sbMuzzleFx", x: g.x, y: g.y, dirX: p.faceX, dirY: p.faceY, size: 6, style: k, maxTicks: 6 });
}

/** 가까운 적 n (가까운 순) */
function nearest(s: RunState, x: number, y: number, n: number): EnemyState[] {
  return alive(s).map((e) => ({ e, d: (e.x - x) ** 2 + (e.y - y) ** 2 })).sort((a, b) => a.d - b.d || a.e.id - b.e.id).slice(0, n).map((o) => o.e);
}

/** 두 손에서 노린 적 쪽으로 은탄 두 발 (대시 · 연사) */
function pair(s: RunState, e: EnemyState | undefined, k: number, speed: number, mul: number): void {
  const p = s.player;
  for (const side of [1, -1]) {
    const g = gun(s, side);
    const d = e ? Math.hypot(e.x - g.x, e.y - g.y) || 1 : 1;
    const [dx, dy] = e ? [(e.x - g.x) / d, (e.y - g.y) / d] : [p.faceX, p.faceY];
    shoot(p, g.x, g.y, dx, dy, speed, mul, k, e ? { tg: e.id, turn: 1 } : {});
    addEffect(s, { kind: "sbMuzzleFx", x: g.x, y: g.y, dirX: dx, dirY: dy, size: 5, style: side > 0 ? 0 : 1, maxTicks: 5 });
  }
}

/** 대시를 시작하면: 가까운 적에게 은탄 두 발 (날렵한 발: 더) · 성수 뿌리기 */
function dashTick(s: RunState): void {
  const p = s.player;
  const dashing = p.dashTicks > 0;
  if (dashing && !p.sbDash) {
    const n = (B.dashShots + (hasPerk(p, "sbAgile") ? K.sbAgile.add : 0)) / 2;
    const foes = nearest(s, p.x, p.y, n);
    for (let i = 0; i < n; i++) pair(s, foes[i % Math.max(1, foes.length)], 2, B.barrageSpeed, B.dashMul);
    if (hasPerk(p, "sbSplash")) srcRun(s, "sbSplash", () => throwBomb(s, p.x, p.y, B.bombMul * K.sbSplash.mul, 1));
  }
  p.sbDash = dashing;
}

/** 은탄 마크가 가득 찬 적이 있으면 연사 시작 · 연사 중이면 두 발씩 몰아 쏨 (끝나면 은빛 파열) */
function barrageTick(s: RunState): boolean {
  const p = s.player;
  if (!p.sbBarrage && !p.sbUlt) {
    const e = alive(s).find((f) => (f.sbMarks ?? 0) >= markNeed(p));
    if (!e) return false;
    e.sbMarks = 0;
    p.sbBarrage = { id: e.id, t: B.barrageTicks + (hasPerk(p, "sbStorm") ? K.sbStorm.more : 0) };
    addEffect(s, { kind: "sbBarrageFx", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r, maxTicks: 24 });
  }
  const b = p.sbBarrage;
  if (!b) return false;
  let e = alive(s).find((f) => f.id === b.id);
  if (!e) {
    e = nearest(s, p.x, p.y, 1)[0];
    if (e) b.id = e.id;
  }
  const gap = hasPerk(p, "sbRapid") ? K.sbRapid.gap : B.barrageGap;
  if (b.t % gap === 0) pair(s, e, 3, B.barrageSpeed, B.barrageMul);
  if (--b.t > 0) return true;
  delete p.sbBarrage;
  if (e && hasPerk(p, "sbBurst")) srcRun(s, "sbBurst", () => {
    for (const f of inCircle(s, e.x, e.y, K.sbBurst.r)) strike(s, f, sbDmg(p, K.sbBurst.mul), 6, "radiance");
    addEffect(s, { kind: "sbBurstFx", x: e.x, y: e.y, dirX: 0, dirY: 0, size: K.sbBurst.r, maxTicks: 22 });
  });
  return true;
}

/** 은빛 활 일제 사격 (각성 순간부터, 몸 고정): 가운데 두 발 · 양끝 유도 두 발씩 매우 빠르게 */
function ultTick(s: RunState): boolean {
  const p = s.player;
  if (!p.sbUlt) return false;
  p.rootTicks = 1;
  if (p.sbUlt % B.ultGap === 0) {
    const cx = p.x + p.faceX * 14;
    const cy = p.y - 4 + p.faceY * 14;
    const seek = hasPerk(p, "sbSeek") ? { turn: K.sbSeek.turn } : {};
    for (const o of [-3, 3]) shoot(p, cx - p.faceY * o, cy + p.faceX * o, p.faceX, p.faceY, B.ultSpeed, B.ultMul, 4, seek);
    const foes = nearest(s, cx, cy, 2);
    for (const [i, side] of [1, -1].entries()) {
      const tx = cx - p.faceY * B.ultSide * side - p.faceX * 10;
      const ty = cy + p.faceX * B.ultSide * side - p.faceY * 10;
      // 양끝은 바깥쪽으로 비스듬히 나가 적을 쫓음
      const dx = p.faceX - p.faceY * side * 0.6;
      const dy = p.faceY + p.faceX * side * 0.6;
      const n = Math.hypot(dx, dy);
      const tg = foes[i] ?? foes[0];
      shoot(p, tx, ty, dx / n, dy / n, B.ultSpeed, B.ultMul, 5, { turn: B.ultTurn, ...(tg ? { tg: tg.id } : {}) });
    }
  }
  if (--p.sbUlt > 0) return true;
  delete p.sbUlt;
  p.rootTicks = 0;
  return true;
}

/** 틱마다 (은빛 쌍권총을 들었을 때 player에서) */
export function silverBulletTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  if (p.sbRoom !== roomKey(s)) {
    for (const k of ["sbShots", "sbBombs", "sbBarrage", "sbLeft"] as const) delete p[k];
    p.sbRoom = roomKey(s);
  }
  stigmaTick(p);
  shotsTick(s);
  bombsTick(s);
  dashTick(s);
  if (p.sbLeft && --p.sbLeft <= 0) {
    delete p.sbLeft;
    fireHand(s, 1);
  }
  if (ultTick(s) || barrageTick(s)) return;
  if (!want || p.attackCooldown > 0 || p.s2Rush) return;
  // 오른손 먼저 · 왼손은 조금 뒤 (탕-탕)
  fireHand(s, 0);
  p.sbLeft = B.offTicks;
  p.sbCount = (p.sbCount ?? 0) + 1;
  if (hasPerk(p, "sbTriple") && p.sbCount % K.sbTriple.every === 0) srcRun(s, "sbTriple", () => pair(s, nearest(s, p.x, p.y, 1)[0], 0, B.shotSpeed, B.shotMul));
  if (p.sbCount % (hasPerk(p, "sbBelt") ? K.sbBelt.every : B.bombEvery) === 0) throwBomb(s, p.x, p.y - 4, B.bombMul);
  const fast = isAwake(p) ? B.awakeSpeed : 1;
  p.attackCooldown = Math.max(1, Math.round((TICK_RATE / (speed * fast)) * B.shotTime * (hasPerk(p, "sbQuick") ? K.sbQuick.time : 1)));
  p.attackCount++;
}

/** 연습장 등에서 다시 시작할 때 */
export function resetSilverBullet(p: RunState["player"]): void {
  for (const k of ["sgGauge", "sgAwake", "sgAwakeMax", "sbShots", "sbBombs", "sbLeft", "sbCount", "sbBarrage", "sbUlt", "sbDash", "sbVault", "sbRoom", "rootTicks"] as const) delete p[k];
}

export { isSilverBullet, markNeed, vaultGrid } from "./silverBulletKit";
