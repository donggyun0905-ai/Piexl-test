// 사멸(헬리오스, 사천 당가): 독침. 모든 침에 독 + 죽음(1초마다 피해)이 붙음
// 침을 많이 던질수록 맵에 독가스가 피어남 (침 30개마다 하나, 최대 6). 수치는 weaponsSamyeol.SAMYEOL, 아이템은 itemsSamyeol
import { srcRun } from "./dmgSrc";
import { TICK_RATE } from "../constants";
import { SAMYEOL_PERKS as K } from "../itemsSamyeol";
import { createRng, deriveSeed } from "../rng";
import { SAMYEOL as S, type NeedleStyle } from "../weaponsSamyeol";
import { nearest } from "./brawlMoves";
import { dotDamage, healPlayer } from "./combat";
import { inCircle, poison, shoot } from "./s2Kit";
import type { EnemyState, PlayerState, ProjectileState, RunState } from "./types";
import { addEffect, dist2, hasPerk, weaponOf } from "./util";

const styleOf = (p: PlayerState): NeedleStyle => weaponOf(p).needle ?? { n: 3, pattern: "fan", spread: 0.15 };
const roll = (s: RunState, tag: string, n: number) => createRng(deriveSeed(s.seed, tag, s.tick, n)).nextFloat();

/** 비단 옷: 독가스 안에서 받는 피해 (classTaken) */
export function samyeolTaken(p: PlayerState): number {
  if (p.characterId !== "samyeol" || !hasPerk(p, "smSilk")) return 1;
  return (p.smGas ?? []).some((g) => dist2(g, p) <= g.r * g.r) ? K.smSilk.taken : 1;
}

/** 독 + 죽음 걸기 (dmg: 그 공격의 피해) */
function afflict(s: RunState, e: EnemyState, dmg: number): void {
  const p = s.player;
  const st = styleOf(p);
  const venom = S.venom * (st.venom ?? 1) * (hasPerk(p, "smVenom") ? K.smVenom.mul : 1);
  const doom = S.doom * (st.doom ?? 1) * (hasPerk(p, "smReaper") ? K.smReaper.mul : 1);
  poison(e, dmg * venom, S.venomTicks);
  // 죽음: 걸려 있으면 더 센 쪽으로, 시간은 처음부터
  e.smDeathDmg = (e.smDeath ?? 0) > 0 ? Math.max(e.smDeathDmg ?? 0, dmg * doom) : dmg * doom;
  e.smDeath = S.doomTicks;
}

/** 쓰러졌을 때: 독의 입맞춤 · 독꽃 */
function fallen(s: RunState, e: EnemyState): void {
  const p = s.player;
  if (e.hp > 0) return;
  if (hasPerk(p, "smKiss")) healPlayer(s, K.smKiss.heal);
  if (hasPerk(p, "smBloom") && (e.poisonTicks ?? 0) > 0) srcRun(s, "smBloom", () => { gas(s, e.x, e.y, K.smBloom.r); });
}

/** 침이 맞았을 때 (s2Hits) */
export function needleHit(s: RunState, pr: ProjectileState, e: EnemyState): void {
  if (s.player.characterId !== "samyeol") return;
  afflict(s, e, pr.damage);
  fallen(s, e);
}

/** 독가스 하나 (오래된 것부터 사라짐) */
function gas(s: RunState, x: number, y: number, size = 1): void {
  const p = s.player;
  const big = hasPerk(p, "smCloud");
  const list = (p.smGas ?? []).slice(-(S.gasMax - 1));
  list.push({ x, y, r: S.gasR * size * (big ? K.smCloud.r : 1), t: Math.round(S.gasTicks * (big ? K.smCloud.dur : 1)), dmg: p.stats.damage * S.gasMul });
  p.smGas = list;
  addEffect(s, { kind: "smGas", x, y, dirX: 0, dirY: 0, size: S.gasR * size, maxTicks: 24 });
}

/** 겨눌 곳 (가까운 적, 없으면 앞쪽) */
function aimAt(s: RunState): { x: number; y: number } {
  const p = s.player;
  return nearest(s, p.stats.range * 1.5) ?? { x: p.x + p.faceX * p.stats.range * 0.6, y: p.y + p.faceY * p.stats.range * 0.6 };
}

function needle(s: RunState, a: number, dmg: number, st: NeedleStyle): void {
  const p = s.player;
  const pierce = (st.pierce ?? 0) + (hasPerk(p, "smPierce") ? K.smPierce.n : 0);
  shoot(s, a, { damage: dmg, spirit: "smNeedle", r: S.needleR, range: p.stats.range, pierce, slow: st.slow });
}

/** 한 번 던지기 */
function throwNeedles(s: RunState): void {
  const p = s.player;
  const st = styleOf(p);
  const dmg = p.stats.damage;
  const n = st.n + (hasPerk(p, "smMore") ? K.smMore.n : 0);
  switch (st.pattern) {
    case "fan":
    case "line":
      for (let i = 0; i < n; i++) needle(s, (i - (n - 1) / 2) * st.spread, dmg, st);
      break;
    case "rain":
      for (let i = 0; i < n; i++) needle(s, (roll(s, "rain", i) - 0.5) * st.spread, dmg, st);
      break;
    case "ring":
      for (let i = 0; i < n; i++) needle(s, (i / n) * Math.PI * 2, dmg, st);
      addEffect(s, { kind: "smBurst", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 14, maxTicks: 14 });
      break;
    case "volley":
      p.smQueue = Array.from({ length: n }, (_, i) => ({ t: i * S.volleyGap, a: (roll(s, "volley", i) - 0.5) * st.spread * 2, dmg }));
      break;
  }
  if (st.plusFan) for (let i = 0; i < st.plusFan; i++) needle(s, (i - (st.plusFan - 1) / 2) * 0.12, dmg, st);
  if (st.mist) {
    const at = aimAt(s);
    gas(s, at.x, at.y, 0.7);
  }
  // 던진 침이 쌓이면 독가스
  const every = hasPerk(p, "smMist") ? K.smMist.every : S.gasEvery;
  // 패왕전은 맵에 독가스가 피어나지 않음 (맹독 패시브로, pwPassive)
  p.smCount = s.pvp ? 0 : (p.smCount ?? 0) + n + (st.plusFan ?? 0);
  while ((p.smCount ?? 0) >= every) {
    p.smCount = (p.smCount ?? 0) - every;
    const at = aimAt(s);
    gas(s, at.x + (roll(s, "gx", p.smCount ?? 0) - 0.5) * 30, at.y + (roll(s, "gy", p.smCount ?? 0) - 0.5) * 30);
  }
}

/** 틱마다: 잇따라 던지기 · 독가스 · 죽음 */
function update(s: RunState): void {
  const p = s.player;
  if (p.smQueue?.length) {
    for (const q of p.smQueue) if (q.t-- <= 0) needle(s, q.a, q.dmg, styleOf(p));
    p.smQueue = p.smQueue.filter((q) => q.t >= 0);
  }
  if (p.smGas?.length) {
    for (const g of p.smGas) {
      g.t--;
      if (g.t % S.pulse !== 0) continue;
      for (const e of inCircle(s, g.x, g.y, g.r)) afflict(s, e, g.dmg);
    }
    p.smGas = p.smGas.filter((g) => g.t > 0);
  }
  for (const e of s.enemies) {
    if ((e.smDeath ?? 0) <= 0 || e.hp <= 0) continue;
    e.smDeath = (e.smDeath ?? 0) - 1;
    if (e.smDeath % TICK_RATE !== 0) continue;
    dotDamage(s, e, "death", e.smDeathDmg ?? 0);
    fallen(s, e);
  }
}

/** 틱마다 (독침을 들었을 때 player에서) */
export function samyeolTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  update(s);
  if (!want || p.attackCooldown > 0) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  throwNeedles(s);
}

/** 연습장 등에서 다시 시작할 때 */
export function resetSamyeol(p: PlayerState): void {
  for (const k of ["smCount", "smGas", "smQueue"] as const) delete p[k];
}
