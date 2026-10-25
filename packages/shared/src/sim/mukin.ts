// 묵인(헬리오스): 거대한 몸. 방어력(받는 피해를 그 %만큼 무시, 한 번에 적어도 1은 받음) · 맞아도 무적이 거의 없음
// 공격은 몸으로 들이받는 돌진, 피해는 방어력의 300% · 재생력 10 (10초마다 그만큼) · 회복약은 천천히 차오름
// 수치는 weaponsMukin.MUKIN, 아이템은 itemsMukin
import { TICK_RATE } from "../constants";
import { MUKIN_PERKS as K } from "../itemsMukin";
import { MUKIN as M } from "../weaponsMukin";
import { nearest } from "./brawlMoves";
import { blastAt, healPlayer } from "./combat";
import { rushTick, startRush, stun } from "./s2Kit";
import type { PlayerState, RunState } from "./types";
import { addEffect, hasPerk, STILL_TICKS, weaponOf } from "./util";

/** 지금 방어력 (철판 · 묵상 · 요새 돌진, 상한 90) */
export function mukinDef(p: PlayerState): number {
  let d = M.defBase;
  if (hasPerk(p, "mkPlate")) d += K.mkPlate.def;
  if (hasPerk(p, "mkMeditate") && p.stillTicks >= STILL_TICKS) d += K.mkMeditate.def;
  if ((p.mkGuard ?? 0) > 0) d += weaponOf(p).ram?.guard ?? 0;
  return Math.min(M.defMax, d);
}

/** 재생력 (바위 심장 +10) */
export const mukinRegen = (p: PlayerState) => M.regenBase + (hasPerk(p, "mkRegen") ? K.mkRegen.regen : 0);

/** 받는 피해: 방어력만큼 무시하되 적어도 1 */
export function mukinTaken(p: PlayerState, taken: number): number {
  if (p.characterId !== "mukin" || taken <= 0) return taken;
  return Math.max(1, taken * (1 - mukinDef(p) / 100));
}

/** 맞은 뒤: 무적은 아주 짧게 · 가시 갑옷 */
export function mukinHurt(s: RunState): void {
  const p = s.player;
  if (p.characterId !== "mukin") return;
  p.invulnTicks = Math.min(p.invulnTicks, M.hurtTicks);
  if (!hasPerk(p, "mkSpikes") || (p.mkSpikeCd ?? 0) > 0) return;
  p.mkSpikeCd = K.mkSpikes.cd;
  blastAt(s, p.x, p.y, K.mkSpikes.r, mukinDef(p), { push: 4 });
}

/** 회복약: 바로 차지 않고 천천히 (약초 주머니 +50%) */
export function mukinPotion(s: RunState, amount: number): void {
  const p = s.player;
  p.mkPool = (p.mkPool ?? 0) + amount * (hasPerk(p, "mkPotion") ? K.mkPotion.mul : 1);
}

/** 돌진 하나 시작 (dx·dy 방향) */
function ram(s: RunState, dx: number, dy: number, dmg: number, chain: number, back: boolean): void {
  const p = s.player;
  const w = weaponOf(p);
  const dist = p.stats.range * (hasPerk(p, "mkMomentum") ? K.mkMomentum.mul : 1);
  startRush(p, { t: M.ramTicks, dx, dy, step: dist / M.ramTicks, dmg, push: w.ram?.push ?? 8, invuln: false, tint: "#c8a060" });
  p.mkNext = { chain, back, dmg, sx: p.x, sy: p.y };
}

/** 돌진이 끝났을 때: 충격파 · 짓밟기 · 땅울림 · 되돌아오기 · 연쇄 */
function ramEnd(s: RunState): void {
  const p = s.player;
  const n = p.mkNext;
  if (!n) return;
  delete p.mkNext;
  const st = weaponOf(p).ram;
  const def = mukinDef(p);
  if (st?.blast) blastAt(s, p.x, p.y, st.blast, def * M.blastMul * weaponOf(p).damageMul, { push: 8 });
  if (hasPerk(p, "mkTrample")) blastAt(s, p.x, p.y, K.mkTrample.r, def * M.blastMul, { push: 6 });
  if (st?.trail) for (const k of [0.25, 0.5, 0.75]) blastAt(s, n.sx + (p.x - n.sx) * k, n.sy + (p.y - n.sy) * k, 16, def * 0.6);
  if (st?.guard) {
    p.mkGuard = M.guardTicks;
    addEffect(s, { kind: "mkGuard", x: p.x, y: p.y, dirX: 0, dirY: 0, size: p.r + 6, maxTicks: 20 });
  }
  if (n.back) {
    const l = Math.hypot(n.sx - p.x, n.sy - p.y) || 1;
    ram(s, (n.sx - p.x) / l, (n.sy - p.y) / l, n.dmg, 0, false);
    return;
  }
  if (n.chain <= 0) return;
  const e = nearest(s, p.stats.range * 1.5);
  if (!e) return;
  const l = Math.hypot(e.x - p.x, e.y - p.y) || 1;
  ram(s, (e.x - p.x) / l, (e.y - p.y) / l, n.dmg, n.chain - 1, false);
}

/** 틱마다 (묵인 무기를 들었을 때 player에서) */
export function mukinTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  if ((p.mkGuard ?? 0) > 0) p.mkGuard = (p.mkGuard ?? 0) - 1;
  if ((p.mkSpikeCd ?? 0) > 0) p.mkSpikeCd = (p.mkSpikeCd ?? 0) - 1;
  // 회복약: 1초에 최대 체력의 10%씩
  if ((p.mkPool ?? 0) > 0 && p.hp > 0) {
    const amt = Math.min(p.mkPool ?? 0, (p.stats.maxHp * M.potionRate) / TICK_RATE);
    p.mkPool = (p.mkPool ?? 0) - amt;
    healPlayer(s, amt);
  }
  // 재생력: 10초마다 그만큼 (1초에 1/10씩)
  if (s.tick % TICK_RATE === 0 && p.hp > 0 && p.hp < p.stats.maxHp) healPlayer(s, mukinRegen(p) / 10);
  if (p.s2Rush) {
    const st = weaponOf(p).ram;
    const ticks = hasPerk(p, "mkShock") ? Math.max(st?.stun ?? 0, K.mkShock.ticks) : (st?.stun ?? 0);
    if (rushTick(s, ticks > 0 ? (e) => stun(e, ticks) : undefined)) ramEnd(s);
    return;
  }
  if (!want || p.attackCooldown > 0) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  const w = weaponOf(p);
  const dmg = mukinDef(p) * (hasPerk(p, "mkIron") ? K.mkIron.mul : M.ramMul) * w.damageMul + p.stats.damage;
  ram(s, p.faceX, p.faceY, dmg, w.ram?.chain ?? 0, w.ram?.back ?? false);
}

/** 연습장 등에서 다시 시작할 때 */
export function resetMukin(p: PlayerState): void {
  for (const k of ["mkPool", "mkGuard", "mkSpikeCd", "mkNext"] as const) delete p[k];
}
