// 악의 사도 영혼 놓기: 쓰러진 적 자리 · 보스 둘레 (combat.removeDead에서도 부름, 그래서 combat을 가져오지 않음) · 검은 미사 보호막
import { APOSTLE_PERKS as K } from "../itemsApostle";
import { APOSTLE } from "../weaponsApostle";
import type { RunState } from "./types";
import { hasPerk } from "./util";

export const soulWhere = (s: RunState) => `${s.floor}/${s.roomId}`;

export function addSoul(s: RunState, x: number, y: number): void {
  const p = s.player;
  if (p.characterId !== "apostle") return;
  const souls = (p.apSouls ??= []);
  souls.push({ x, y, left: APOSTLE.soulTicks, where: soulWhere(s) });
  if (souls.length > APOSTLE.maxSouls) souls.shift();
}

/** 적이 쓰러지면: 영혼 · 검은 미사 보호막 */
export function apostleKill(s: RunState, x: number, y: number): void {
  const p = s.player;
  if (p.characterId !== "apostle") return;
  addSoul(s, x, y);
  if (!hasPerk(p, "blackMass")) return;
  const add = Math.min(K.blackMass.max - (p.apMass ?? 0), K.blackMass.shield);
  if (add <= 0) return;
  p.apMass = (p.apMass ?? 0) + add;
  p.shieldPts = (p.shieldPts ?? 0) + add;
}
