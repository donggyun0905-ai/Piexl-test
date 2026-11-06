// 미카엘라 공용 도우미: 콤보 · 폭발·연쇄 · 박힌 무기 놓기·바꿔 들기 · 하늘에서 무기 떨어뜨리기 · 순간 이동 · 스킬 대기
import { MICHAELA_PERKS as K } from "../itemsMichaela";
import { MICHAELA as M } from "../weaponsMichaela";
import type { McBlade } from "./mcTypes";
import { inCircle, strike } from "./s2Kit";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, hasPerk } from "./util";

export const isMichaela = (p: PlayerState) => p.characterId === "michaela";

/** 콤보 피해 배율 */
export function comboMul(p: PlayerState): number {
  return 1 + (p.mcCombo ?? 0) * (hasPerk(p, "mcMadness") ? K.mcMadness.step : M.comboStep);
}

/** 콤보 n 쌓기 (유지 시간 다시) */
export function addCombo(p: PlayerState, n: number): void {
  const max = M.comboMax + (hasPerk(p, "mcFrenzy") ? K.mcFrenzy.more : 0);
  p.mcCombo = Math.min(max, (p.mcCombo ?? 0) + n);
  p.mcComboT = M.comboKeep + (hasPerk(p, "mcTempo") ? K.mcTempo.more : 0);
}

/** 한 번 맞힘: 공격력 × mul × 콤보 */
export function mcHit(s: RunState, e: EnemyState, mul: number, push = 0): void {
  if (e.hp <= 0) return;
  strike(s, e, s.player.stats.damage * mul * comboMul(s.player), push);
}

/** 폭발: (x,y) 둘레 적에게 피해 · 둘레 박힌 무기가 있으면 잠시 뒤 연달아 터짐 (chain: 연쇄로 터진 폭발) */
export function explode(s: RunState, x: number, y: number, r: number, mul: number, chain = false): void {
  const p = s.player;
  const rr = r * (hasPerk(p, "mcWide") ? K.mcWide.r : 1);
  const m = mul * (hasPerk(p, "mcPowder") ? K.mcPowder.mul : 1) * (chain && hasPerk(p, "mcFuse") ? K.mcFuse.mul : 1);
  for (const e of inCircle(s, x, y, rr)) {
    mcHit(s, e, m, 6);
    if (hasPerk(p, "mcShrapnel") && e.hp > 0) strike(s, e, p.stats.damage * m * K.mcShrapnel.mul, 0, "bleed");
  }
  addEffect(s, { kind: "mcBlastFx", x, y, dirX: chain ? 1 : 0, dirY: 0, size: rr, maxTicks: 22 });
  const cr = M.chainR * (hasPerk(p, "mcResonance") ? K.mcResonance.r : 1);
  for (const b of p.mcBlades ?? []) {
    if ((b.cd ?? 0) > s.tick || Math.hypot(b.x - x, b.y - y) > cr) continue;
    b.cd = s.tick + M.chainCd;
    (p.mcChains ??= []).push({ x: b.x, y: b.y, t: M.chainDelay, mul: M.chainMul });
  }
}

/** 박힌 무기 최대 수 */
const maxBlades = (p: PlayerState) => M.maxBlades + (hasPerk(p, "mcHoard") ? K.mcHoard.max : 0);

/** 무기를 땅에 박음 (가득 차면 가장 오래된 것을 뺌) · 바로 연쇄로 터지지 않게 잠깐 막음 */
export function plant(s: RunState, x: number, y: number, k: number): void {
  const list = (s.player.mcBlades ??= []);
  list.push({ x, y, k, cd: s.tick + M.chainCd });
  while (list.length > maxBlades(s.player)) list.shift();
}

/** 박힌 무기를 바꿔 듦: 그 무기를 들고 · 콤보 · 그 자리 폭발 (연쇄) */
export function swapTo(s: RunState, b: McBlade): void {
  const p = s.player;
  p.mcBlades = (p.mcBlades ?? []).filter((o) => o !== b);
  p.mcHeld = b.k;
  addCombo(p, 1 + (hasPerk(p, "mcDouble") ? K.mcDouble.more : 0));
  addEffect(s, { kind: "mcSwapFx", x: b.x, y: b.y, dirX: b.k, dirY: 0, size: M.swapR, maxTicks: 16 });
  explode(s, b.x, b.y, M.swapR, M.swapMul);
}

/** 박힌 무기로 순간 이동해 바꿔 들고 둘레를 벰 */
export function blinkTo(s: RunState, b: McBlade, r: number, mul: number, inv: number): void {
  const p = s.player;
  addEffect(s, { kind: "mcBlinkFx", x: p.x, y: p.y, dirX: 0, dirY: 0, size: r, toX: b.x, toY: b.y, maxTicks: 14 });
  p.x = p.prevX = b.x;
  p.y = p.prevY = b.y;
  p.invulnTicks = Math.max(p.invulnTicks, inv);
  for (const e of inCircle(s, p.x, p.y, r)) mcHit(s, e, mul, 8);
  swapTo(s, b);
}

/** 하늘(포탈)에서 무기를 떨어뜨림: t틱 뒤 (x,y)에 꽂혀 둘레 적을 치고 박힘 */
export function dropBlade(s: RunState, x: number, y: number, t: number, k: number, mul: number): void {
  (s.player.mcFalls ??= []).push({ x, y, t, k, mul });
  addEffect(s, { kind: "mcFallFx", x, y, dirX: k, dirY: 0, size: M.fallR, maxTicks: t });
}

/** 스킬마다 대기 틱 (아이템 반영) */
export function mcCooldown(p: PlayerState, i: number): number {
  return Math.round((M.cooldowns[i] ?? 0) * (hasPerk(p, "mcPrayer") ? K.mcPrayer.cd : 1));
}

/** 화면용: 스킬마다 남은 대기 0~1 (0 = 쓸 수 있음) */
export function michaelaSkills(p: PlayerState): number[] {
  return [0, 1, 2, 3].map((i) => Math.min(1, (p.mcCd?.[i] ?? 0) / Math.max(1, mcCooldown(p, i))));
}
