// 펜리르 능력치 쪽 효과: 벼린 송곳니(예리함)·노장의 투혼(회피) 몫 · 늙은 늑대의 지혜(피하면 공격력) · 선왕의 광륜(쓰러질 때 버팀) · 사냥 본능 이동 속도
// (공격은 sim/fenrir. 이 파일은 baseStats·run·moveMul이 부르므로 가볍게 둠)
import type { ExtraStats } from "../characters";
import { FENRIR_PERKS as K } from "../itemsFenrir";
import type { PlayerState, RunState } from "./types";
import { addEffect, hasPerk } from "./util";

export const isFenrir = (p: PlayerState) => p.characterId === "fenrir";

/** 아이템이 더하는 추가 기본 스탯 (baseStats.extraOf) */
export function fenrirExtras(p: PlayerState): Partial<ExtraStats> | null {
  if (!isFenrir(p)) return null;
  const sharp = hasPerk(p, "fnFang") ? K.fnFang.sharp : 0;
  const low = hasPerk(p, "fnVeteran") && p.hp < p.stats.maxHp * K.fnVeteran.hp ? K.fnVeteran.dodge : 0;
  return sharp || low ? { sharpness: sharp, dodge: low } : null;
}

/** 피해를 피했을 때 (baseStats.dodged): 은빛 잔상 · 늙은 늑대의 지혜 */
export function fenrirDodged(s: RunState): void {
  const p = s.player;
  if (!isFenrir(p)) return;
  addEffect(s, { kind: "fnDodge", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: 14, maxTicks: 18 });
  if (hasPerk(p, "fnWisdom")) p.fnWise = K.fnWisdom.ticks;
}

/** 선왕의 광륜: 층마다 한 번 체력 1로 버팀 (run.checkDeath) */
export function fenrirSave(s: RunState): void {
  const p = s.player;
  if (p.hp > 0 || !isFenrir(p) || !hasPerk(p, "fnHalo") || p.fnHaloFloor === s.floor) return;
  p.fnHaloFloor = s.floor;
  p.hp = 1;
  p.invulnTicks = Math.max(p.invulnTicks, K.fnHalo.invuln);
  addEffect(s, { kind: "fnHalo", x: p.x, y: p.y - 10, dirX: 0, dirY: 0, size: 26, maxTicks: 40 });
}

/** 사냥 본능 이동 속도 배율 (moveMul) */
export function fenrirMoveMul(p: PlayerState): number {
  return (p.fnHuntT ?? 0) > 0 && p.stats.moveSpeed > 0 ? (p.stats.moveSpeed + K.fnHunt.move) / p.stats.moveSpeed : 1;
}

/** 대시 대기 시간 배율 (질풍) */
export const fenrirDashMul = (p: PlayerState) => (hasPerk(p, "fnGale") ? K.fnGale.dash : 1);
