// 진영 특징 시스템 (로그만 · 패왕전·대결 제외): 소속 찾기 · 맞힘·처치·맞음·틱 훅 · 피해 배율 (수치 factionDefs)
// 탈라시아 물결 콤보 · 헬리오스 타락 스택(학살자 피의 학살과 폭주가 겹치지 않음) · 테라코어 에너지(주고·맞으면 쌓임 → 대시로 터짐)는 여기 · 아스칼론 맹세 sim/factionOath · 비르디아 정령 sim/factionSpirit · 성국 핵심 스킬 sim/factionCore
import { puppetKill } from "./puppetCorpse";
import { rabbitKill } from "./rabbitCarrot";
import { baekKill } from "./baekSoul";
import type { CharacterId } from "../characters";
import { FACTION_HEAT as H, FACTION_MEMBERS, FACTION_TAINT as T, FACTION_TIDE as W, type FactionTrait } from "../factionDefs";
import { blastAt } from "./combat";
import { coreDmgMul, coreTick } from "./factionCore";
import { oathDmgMul, oathHurt, oathKill, oathTick } from "./factionOath";
import { spiritDmgMul, spiritHurt, spiritKill, spiritSpeedMul, spiritTaken, spiritTick } from "./factionSpirit";
import { dotDamage } from "./status";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect } from "./util";

const BY = new Map<CharacterId, FactionTrait>();
for (const [f, list] of Object.entries(FACTION_MEMBERS) as [FactionTrait, readonly CharacterId[]][]) for (const c of list) BY.set(c, f);

/** 이 캐릭터의 진영 특징 (로그가 아니면 없음: 패왕전·대결 · 광야의 새벽 · 타워 디펜스) */
export function traitOf(s: RunState): FactionTrait | null {
  if (s.pvp || s.pw || s.swarm || s.fixedStats || s.noFaction) return null;
  return BY.get(s.player.characterId) ?? null;
}
export const factionOfCharacter = (c: CharacterId): FactionTrait | null => BY.get(c) ?? null;

/** 물 피해가 없는 탈라시아 캐릭터 (콤보 물보라를 대신 받음) */
const DRY: readonly CharacterId[] = ["madQueen", "hook"];
const tideLv = (p: PlayerState) => Math.floor(Math.min(W.max, p.fcCombo ?? 0) / W.step);
/** 탈라시아 물 피해 배율 (statusHit·dotDamage의 tide) */
export const tideMul = (s: RunState) => (traitOf(s) === "thalassia" ? 1 + tideLv(s.player) * W.perStep : 1);

const rampaging = (p: PlayerState) => (p.fcRampage ?? 0) > 0;
/** 학살자 피의 학살 중인지 (타락 폭주와 겹치지 않게) */
const ownRage = (p: PlayerState) => (p.slRage ?? 0) > 0;
/** 학살자: 타락 폭주 중에는 피의 학살을 미룸 (sim/slayer) */
export const taintBlocksRage = (p: PlayerState) => rampaging(p);

/** 적을 맞힌 뒤 (combat.damageEnemy → baseStats.onHitExtra) */
export function factionHit(s: RunState, e: EnemyState): void {
  const tr = traitOf(s);
  const p = s.player;
  if (tr === "thalassia") {
    if (s.tick - (p.fcComboT ?? -999) < W.every) return;
    p.fcComboT = s.tick;
    const before = tideLv(p);
    p.fcCombo = Math.min(W.max, (p.fcCombo ?? 0) + 1);
    if (tideLv(p) > before) addEffect(s, { kind: "fcTideUp", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 18 + tideLv(p) * 2, maxTicks: 24, follow: true });
    if (DRY.includes(p.characterId) && (p.fcCombo ?? 0) >= W.splashFrom && e.hp > 0) splash(s, e);
  } else if (tr === "terracore" && s.tick - (p.fcHeatT ?? -999) >= H.every) {
    p.fcHeatT = s.tick;
    p.fcHeat = Math.min(H.max, (p.fcHeat ?? 0) + H.gain);
  }
}

/** 물 피해가 없는 캐릭터: 콤보가 높으면 작은 물 피해가 같이 (물 피해라 콤보 배율이 붙음) */
const splash = (s: RunState, e: EnemyState) => dotDamage(s, e, "tide", s.player.stats.damage * W.splashMul);

/** 처치 (보스가 부른 졸개 빼고, combat.removeDead) */
export function factionKill(s: RunState, e: EnemyState): void {
  const tr = traitOf(s);
  const p = s.player;
  if (tr === "helios" && !rampaging(p)) {
    p.fcTaint = Math.min(T.max, (p.fcTaint ?? 0) + 1);
    if (p.fcTaint >= T.max && !ownRage(p)) rampage(s);
  } else if (tr === "virdia") spiritKill(s);
  else if (tr === "ascalon") oathKill(s, e);
  puppetKill(s, e);
  rabbitKill(s, e);
  baekKill(s, e);
}

function rampage(s: RunState): void {
  const p = s.player;
  p.fcRampage = T.rampageTicks;
  addEffect(s, { kind: "fcRampage", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 40, maxTicks: 36, follow: true });
}

/** 실제로 맞은 뒤 (combat.damagePlayer → classTaken.afterHurt) */
export function factionHurt(s: RunState): void {
  const tr = traitOf(s);
  const p = s.player;
  if (tr === "thalassia") delete p.fcCombo;
  else if (tr === "helios" && !rampaging(p)) p.fcTaint = Math.max(0, (p.fcTaint ?? 0) - T.hurtLoss);
  else if (tr === "ascalon") oathHurt(s);
  else if (tr === "virdia") spiritHurt(s);
  else if (tr === "terracore") p.fcHeat = Math.min(H.max, (p.fcHeat ?? 0) + H.hurtGain);
}

/** 틱마다 (baseStats.extraTick) */
export function factionTick(s: RunState): void {
  const tr = traitOf(s);
  const p = s.player;
  if (tr === "helios") {
    if (rampaging(p) && --p.fcRampage! <= 0) {
      delete p.fcRampage;
      p.fcTaint = T.after;
    } else if (!rampaging(p) && (p.fcTaint ?? 0) >= T.max && !ownRage(p)) rampage(s);
  } else if (tr === "terracore") heatTick(s);
  else if (tr === "ascalon") oathTick(s);
  else if (tr === "virdia") spiritTick(s);
  else if (tr === "seongguk") coreTick(s);
}

/** 테라코어: 에너지가 가득 차면 저절로 둘레로 크게 터짐 (대시가 없는 거인·오닉스도 똑같이) */
function heatTick(s: RunState): void {
  const p = s.player;
  if ((p.fcHeat ?? 0) < H.max) return;
  blastAt(s, p.x, p.y, H.ventR, p.stats.damage * H.ventMul, { push: 10 });
  p.fcHeat = 0;
  addEffect(s, { kind: "fcVent", x: p.x, y: p.y, dirX: 0, dirY: 0, size: H.ventR, maxTicks: 26 });
}

/** 주는 피해 배율 (classTaken.foeTaken): 타락 · 영광/깨진 맹세 · 각성 핵심 스킬 */
export function factionDmgMul(s: RunState): number {
  const tr = traitOf(s);
  const p = s.player;
  if (tr === "helios") return 1 + (rampaging(p) ? T.max : (p.fcTaint ?? 0)) * T.dmg;
  if (tr === "ascalon") return oathDmgMul(p);
  if (tr === "seongguk") return coreDmgMul(p);
  if (tr === "virdia") return spiritDmgMul(p);
  return 1;
}

/** 받는 피해 배율 (classTaken.classTaken): 타락 */
export function factionTaken(s: RunState): number {
  if (traitOf(s) === "virdia") return spiritTaken(s.player);
  if (traitOf(s) !== "helios") return 1;
  const p = s.player;
  return 1 + (rampaging(p) ? T.max : (p.fcTaint ?? 0)) * T.taken;
}

/** 공격 속도 배율 (player.attackSpeedNow): 타락 폭주 · 햇살 정령 */
export const factionSpeedMul = (p: PlayerState) => (rampaging(p) ? T.rampageSpeed : 1) * spiritSpeedMul(p);
