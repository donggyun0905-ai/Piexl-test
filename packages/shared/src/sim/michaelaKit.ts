// 미카엘라 공용 도우미: 콤보 · 속성 맞히기 · 폭발·연쇄 · 박힌 무기 놓기·바꿔 들기 · 하늘에서 무기 떨어뜨리기 · 순간 이동 · 스킬 대기
import { MICHAELA_PERKS as K } from "../itemsMichaela";
import { MC_ELEMS, MICHAELA as M, MICHAELA_ELEM as E } from "../weaponsMichaela";
import { createRng, deriveSeed } from "../rng";
import type { McBlade } from "./mcTypes";
import { alive, inCircle, isBoss, poison, strike } from "./s2Kit";
import { ignite } from "./status";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, hasPerk } from "./util";

export const isMichaela = (p: PlayerState) => p.characterId === "michaela";

/** 시드로 무기 속성 하나 (0~7) */
export function pickElem(s: RunState, ...tag: (string | number)[]): number {
  return Math.floor(createRng(deriveSeed(s.seed, "mcElem", s.tick, ...tag)).nextFloat() * MC_ELEMS);
}

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

/** 속성 효과 (dmg: 그 한 번 피해) */
function elemHit(s: RunState, e: EnemyState, v: number, dmg: number): void {
  const p = s.player;
  if (e.hp <= 0 && v !== 5) return;
  if (v === 1) {
    strike(s, e, dmg * E.frostMul, 0, "frost");
    if (!isBoss(e)) e.slowTicks = Math.max(e.slowTicks ?? 0, E.frostSlow);
  } else if (v === 2) ignite(e, p.stats.damage * E.flameBurn);
  else if (v === 3) strike(s, e, dmg * E.bloodMul, 0, "bleed");
  else if (v === 4) strike(s, e, dmg * E.holyMul, 0, "radiance");
  else if (v === 5) {
    // 자전: 가장 가까운 다른 적에게 번개가 튐
    const o = alive(s).filter((x) => x !== e && Math.hypot(x.x - e.x, x.y - e.y) <= E.stormR).sort((a, b) => Math.hypot(a.x - e.x, a.y - e.y) - Math.hypot(b.x - e.x, b.y - e.y) || a.id - b.id)[0];
    if (!o) return;
    strike(s, o, dmg * E.stormMul, 0, "shock");
    addEffect(s, { kind: "mcBoltFx", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 4, toX: o.x, toY: o.y, maxTicks: 10 });
  } else if (v === 6) poison(e, p.stats.damage * E.jadePoison, E.jadeTicks);
  else if (v === 7) strike(s, e, dmg * E.tideMul, 0, "tide");
}

/** 한 번 맞힘: 공격력 × mul × 콤보 (성은: 더 셈 · 청해·성은: 더 밀침) → 속성 효과 */
export function mcHit(s: RunState, e: EnemyState, mul: number, push = 0, v = 0): void {
  if (e.hp <= 0) return;
  const dmg = s.player.stats.damage * mul * comboMul(s.player) * (v === 0 ? E.silverMul : 1);
  strike(s, e, dmg, push + (v === 0 ? E.silverPush : v === 7 ? E.tidePush : 0));
  elemHit(s, e, v, dmg);
}

/** 폭발: (x,y) 둘레 적에게 피해(속성 v) · 둘레 박힌 무기가 있으면 잠시 뒤 연달아 터짐 (chain: 연쇄로 터진 폭발) */
export function explode(s: RunState, x: number, y: number, r: number, mul: number, v: number, chain = false): void {
  const p = s.player;
  const rr = r * (hasPerk(p, "mcWide") ? K.mcWide.r : 1);
  const m = mul * (hasPerk(p, "mcPowder") ? K.mcPowder.mul : 1) * (chain && hasPerk(p, "mcFuse") ? K.mcFuse.mul : 1);
  for (const e of inCircle(s, x, y, rr)) {
    mcHit(s, e, m, 6, v);
    if (hasPerk(p, "mcShrapnel") && e.hp > 0) strike(s, e, p.stats.damage * m * K.mcShrapnel.mul, 0, "bleed");
  }
  addEffect(s, { kind: "mcBlastFx", x, y, dirX: chain ? 1 : 0, dirY: 0, size: rr, style: v, maxTicks: 24 });
  const cr = M.chainR * (hasPerk(p, "mcResonance") ? K.mcResonance.r : 1);
  for (const b of p.mcBlades ?? []) {
    if ((b.cd ?? 0) > s.tick || Math.hypot(b.x - x, b.y - y) > cr) continue;
    b.cd = s.tick + M.chainCd;
    (p.mcChains ??= []).push({ x: b.x, y: b.y, t: M.chainDelay, v: b.v ?? 0, mul: M.chainMul });
  }
}

/** 박힌 무기 최대 수 */
const maxBlades = (p: PlayerState) => M.maxBlades + (hasPerk(p, "mcHoard") ? K.mcHoard.max : 0);

/** 무기를 땅에 박음 (가득 차면 가장 오래된 것을 뺌) · 바로 연쇄로 터지지 않게 잠깐 막음 */
export function plant(s: RunState, x: number, y: number, k: number, v: number): void {
  const list = (s.player.mcBlades ??= []);
  list.push({ x, y, k, v, cd: s.tick + M.chainCd });
  while (list.length > maxBlades(s.player)) list.shift();
}

/** 박힌 무기를 바꿔 듦: 그 무기(종류·속성)를 들고 · 콤보 · 그 자리 폭발 (연쇄) */
export function swapTo(s: RunState, b: McBlade): void {
  const p = s.player;
  p.mcBlades = (p.mcBlades ?? []).filter((o) => o !== b);
  p.mcHeld = b.k;
  p.mcElem = b.v ?? 0;
  addCombo(p, 1 + (hasPerk(p, "mcDouble") ? K.mcDouble.more : 0));
  addEffect(s, { kind: "mcSwapFx", x: b.x, y: b.y, dirX: 0, dirY: 0, size: M.swapR, style: p.mcElem * 2 + b.k, maxTicks: 16 });
  explode(s, b.x, b.y, M.swapR, M.swapMul, p.mcElem);
}

/** 박힌 무기로 순간 이동해 바꿔 들고 둘레를 벰 (그 무기의 속성으로) */
export function blinkTo(s: RunState, b: McBlade, r: number, mul: number, inv: number): void {
  const p = s.player;
  const v = b.v ?? 0;
  addEffect(s, { kind: "mcBlinkFx", x: p.x, y: p.y, dirX: 0, dirY: 0, size: r, style: v * 2 + b.k, toX: b.x, toY: b.y, maxTicks: 14 });
  p.x = p.prevX = b.x;
  p.y = p.prevY = b.y;
  p.invulnTicks = Math.max(p.invulnTicks, inv);
  for (const e of inCircle(s, p.x, p.y, r)) mcHit(s, e, mul, 8, v);
  swapTo(s, b);
}

/** 하늘(포탈)에서 무기를 떨어뜨림: t틱 뒤 (x,y)에 꽂혀 둘레 적을 치고 박힘 */
export function dropBlade(s: RunState, x: number, y: number, t: number, k: number, v: number, mul: number): void {
  (s.player.mcFalls ??= []).push({ x, y, t, k, v, mul });
  addEffect(s, { kind: "mcFallFx", x, y, dirX: 0, dirY: 0, size: M.fallR, style: v * 2 + k, maxTicks: t });
}

/** 스킬마다 대기 틱 (아이템 반영) */
export function mcCooldown(p: PlayerState, i: number): number {
  return Math.round((M.cooldowns[i] ?? 0) * (hasPerk(p, "mcPrayer") ? K.mcPrayer.cd : 1));
}

/** 화면용: 스킬마다 남은 대기 0~1 (0 = 쓸 수 있음) */
export function michaelaSkills(p: PlayerState): number[] {
  return [0, 1, 2, 3].map((i) => Math.min(1, (p.mcCd?.[i] ?? 0) / Math.max(1, mcCooldown(p, i))));
}
