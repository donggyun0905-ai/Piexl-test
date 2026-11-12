// 실버불렛 공용 도우미: 피해(각성·순은) · 은탄 쏘기·날아가기·맞힘(마크 · 성흔) · 성흔 → 달빛 각성(일제 사격 시작) · 성수 폭탄 · 대시로 장애물 넘기
import { srcEach } from "./dmgSrc";
import { SILVER_BULLET_PERKS as K } from "../itemsSilverBullet";
import { SILVER_BULLET as B } from "../weaponsSilverBullet";
import { STIGMA } from "../weaponsDawn";
import { bodyFits, type TileGrid } from "./layout";
import { applyMoon } from "./moonlight";
import { alive, inCircle, strike } from "./s2Kit";
import { addStigma, awaken, isAwake } from "./stigma";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, hasPerk, reachOf, roomGrid } from "./util";
import type { SbShot } from "./sbTypes";

export const isSilverBullet = (p: PlayerState) => p.characterId === "silverBullet";

/** 공격력 × mul (달빛 각성 중 더 셈) */
export const sbDmg = (p: PlayerState, mul: number) => p.stats.damage * mul * (isAwake(p) ? (hasPerk(p, "sbLunar") ? K.sbLunar.mul : B.awakeMul) : 1);

/** 연사에 필요한 마크 */
export const markNeed = (p: PlayerState) => (hasPerk(p, "sbEngrave") ? K.sbEngrave.need : B.markNeed);

/** 성흔 채움 → 가득 차면 달빛 각성 (둘레 달빛 폭발 · 잠깐 무적 · 은빛 활 일제 사격 시작) */
export function sbGain(s: RunState, n: number): void {
  const p = s.player;
  if (n <= 0 || !addStigma(p, n * (hasPerk(p, "sbFocus") ? K.sbFocus.gain : 1))) return;
  awaken(p, STIGMA.awakeTicks);
  for (const e of inCircle(s, p.x, p.y, B.awakeBurstR)) strike(s, e, p.stats.damage * B.awakeBurstMul, 12, "radiance");
  p.invulnTicks = Math.max(p.invulnTicks, B.awakeInv);
  p.sbUlt = B.ultTicks + (hasPerk(p, "sbEndless") ? K.sbEndless.more : 0);
  addEffect(s, { kind: "sbAwakeFx", x: p.x, y: p.y, dirX: 0, dirY: 0, size: B.awakeBurstR, maxTicks: 40, follow: true });
  addEffect(s, { kind: "sbBowFx", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: B.ultSide, maxTicks: p.sbUlt, follow: true });
}

/** 은탄 하나를 (x, y)에서 (dx, dy) 쪽으로 (거리는 사거리 증가 · 긴 총열 따름) */
export function shoot(p: PlayerState, x: number, y: number, dx: number, dy: number, speed: number, mul: number, k: number, extra: Partial<SbShot> = {}): void {
  const barrel = hasPerk(p, "sbBarrel");
  const sp = speed * (barrel ? K.sbBarrel.speed : 1);
  const t = Math.ceil((B.shotRange * reachOf(p) * (barrel ? K.sbBarrel.range : 1) * (k >= 3 ? 1.4 : 1)) / sp);
  (p.sbShots ??= []).push({ x, y, vx: dx * sp, vy: dy * sp, t, mul, k, ...extra });
}

/** 은탄이 적에 맞음: 피해 + 마크 1 (연사 탄은 마크·성흔 없음) */
function bulletHit(s: RunState, e: EnemyState, b: SbShot): void {
  const p = s.player;
  const pure = hasPerk(p, "sbPure") && (e.sbMarks ?? 0) >= K.sbPure.from ? K.sbPure.mul : 1;
  strike(s, e, sbDmg(p, b.mul * pure), 1);
  addEffect(s, { kind: "sbHitFx", x: b.x, y: b.y, dirX: Math.sign(b.vx), dirY: Math.sign(b.vy), size: b.k === 3 ? 4 : 6, maxTicks: 10 });
  if (b.k === 3) return;
  if (e.hp > 0) e.sbMarks = (e.sbMarks ?? 0) + 1;
  sbGain(s, B.gainHit + (e.hp > 0 ? 0 : B.gainKill));
}

/** 유도: 노린 적(없으면 가장 가까운 적) 쪽으로 꺾음 */
function steer(b: SbShot, foes: EnemyState[]): void {
  let e = foes.find((f) => f.id === b.tg);
  if (!e) {
    let best = Infinity;
    for (const f of foes) {
      const d = (f.x - b.x) ** 2 + (f.y - b.y) ** 2;
      if (d < best) [best, e] = [d, f];
    }
    if (e) b.tg = e.id;
  }
  const d = e ? Math.hypot(e.x - b.x, e.y - b.y) : 0;
  if (!e || d <= 0) return;
  const sp = Math.hypot(b.vx, b.vy);
  const k = b.turn ?? 1;
  const nx = b.vx / sp + ((e.x - b.x) / d - b.vx / sp) * k;
  const ny = b.vy / sp + ((e.y - b.y) / d - b.vy / sp) * k;
  const n = Math.hypot(nx, ny) || 1;
  b.vx = (nx / n) * sp;
  b.vy = (ny / n) * sp;
}

/** 날아가는 은탄 한 틱: 나아가며 처음 닿은 적에 맞음 (관통: 더 뚫음) */
export function shotsTick(s: RunState): void {
  const p = s.player;
  const list = p.sbShots;
  if (!list) return;
  const foes = alive(s);
  for (const b of srcEach(list)) {
    if (b.turn !== undefined) steer(b, foes);
    b.x += b.vx;
    b.y += b.vy;
    b.t--;
    const hit = foes.find((e) => e.hp > 0 && !b.hit?.includes(e.id) && (e.x - b.x) ** 2 + (e.y - b.y) ** 2 <= (e.r + B.hitR) ** 2);
    if (!hit) continue;
    bulletHit(s, hit, b);
    if ((b.pierce ?? 0) > 0) {
      b.pierce!--;
      (b.hit ??= []).push(hit.id);
      if (b.tg === hit.id) delete b.tg;
    } else b.t = 0;
  }
  p.sbShots = list.filter((b) => b.t > 0);
  if (p.sbShots.length === 0) delete p.sbShots;
}

/** 성수 폭탄 던지기: 앞 가까운 적 자리 (없으면 앞 허공)에 떨어짐 */
export function throwBomb(s: RunState, x: number, y: number, mul: number, fly = B.bombFly): void {
  const p = s.player;
  const range = B.bombRange * reachOf(p);
  let tx = x + p.faceX * range * 0.7;
  let ty = y + p.faceY * range * 0.7;
  let best = range * range;
  for (const e of alive(s)) {
    const d = (e.x - x) ** 2 + (e.y - y) ** 2;
    if (d > best || ((e.x - x) * p.faceX + (e.y - y) * p.faceY) < 0) continue;
    [best, tx, ty] = [d, e.x, e.y];
  }
  (p.sbBombs ??= []).push({ x0: x, y0: y, x: tx, y: ty, t: fly, T: fly, mul });
}

/** 날아가는 성수 폭탄 한 틱: 떨어지면 터져 둘레 적에게 빛 피해 + 달빛 (광역 정화) */
export function bombsTick(s: RunState): void {
  const p = s.player;
  const list = p.sbBombs;
  if (!list) return;
  for (const b of srcEach(list)) {
    if (--b.t > 0) continue;
    const r = B.bombR * reachOf(p) * (hasPerk(p, "sbFlask") ? K.sbFlask.r : 1);
    const hit = inCircle(s, b.x, b.y, r);
    for (const e of hit) {
      strike(s, e, sbDmg(p, b.mul * (hasPerk(p, "sbBless") ? K.sbBless.mul : 1)), 5, "radiance");
      if (hasPerk(p, "sbPurify")) applyMoon(e, K.sbPurify.more);
    }
    addEffect(s, { kind: "sbBombFx", x: b.x, y: b.y, dirX: 0, dirY: 0, size: r, maxTicks: 26 });
    sbGain(s, hit.length * B.gainBomb);
  }
  p.sbBombs = list.filter((b) => b.t > 0);
  if (p.sbBombs.length === 0) delete p.sbBombs;
}

/** 몸이 막는 칸(장애물·기둥·벽)에 걸쳐 있는지 */
const overTile = (g: TileGrid, p: PlayerState) => !bodyFits(g, p.x, p.y, p.r);

/** 플레이어를 칸 밖으로 밀어낼 칸 배열 (sim/player keepInRoom): 실버불렛이 대시 중이면 장애물을 넘어감 (패왕전·대결은 빼고: 벽 너머로 빠져나감) (넘는 중 대시가 끝나면 다 넘을 때까지 더 미끄러짐) */
export function vaultGrid(s: RunState): TileGrid | null {
  const p = s.player;
  const g = roomGrid(s);
  if (!g || !isSilverBullet(p) || s.pvp || s.pw) return g;
  if (!overTile(g, p)) {
    delete p.sbVault;
    return g;
  }
  if (p.dashTicks <= 0 && p.sbVault === undefined) return g;
  p.sbVault = (p.sbVault ?? 0) + 1;
  if (p.sbVault === 1) addEffect(s, { kind: "sbVaultFx", x: p.x, y: p.y, dirX: p.dashDirX, dirY: p.dashDirY, size: 14, maxTicks: 20 });
  if (p.sbVault > B.vaultMax) return g;
  if (p.dashTicks <= 0) p.dashTicks = 1;
  return null;
}
