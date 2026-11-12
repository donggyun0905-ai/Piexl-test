// 이드라(비르디아, 세계수의 아이): 가이아 하나가 대시 키로 대궁 → 단검 → 방패 → 채찍 차례로 바뀜 (바꿀 때 변환 일격, 대시는 그대로)
// 대궁: 느리고 센 관통 화살 · 단검: 아주 빠른 찌르기, 다섯 번째마다 우드브레이커 일격(묶음) · 방패: 앞쪽 반원 강타·밀침·보호막, 받는 피해 감소
// 채찍: 앞으로 뻗는 가시 채찍(한 줄의 적 모두, 독). 수치는 weaponsIdra.IDRA, 아이템은 itemsIdra
import { srcFn, srcOpt, srcRun } from "./dmgSrc";
import { TICK_RATE } from "../constants";
import { IDRA_PERKS as K } from "../itemsIdra";
import { GAIA_FORMS, IDRA as I } from "../weaponsIdra";
import { blastAt as blastAt_, healPlayer } from "./combat";
import { fan, inCone, inLine, poison, root, roomKey, strike as strike_ } from "./s2Kit";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, DASH_TICKS, hasPerk } from "./util";
import { raiseShield } from "./imugiMods";
const blastAt = srcFn("idra", () => blastAt_), strike = srcFn("idra", () => strike_);

const formOf = (p: PlayerState) => GAIA_FORMS[p.gForm ?? 0] ?? "bow";

/** 사계로 오른 피해 배율 */
const seasonMul = (p: PlayerState) => ((p.gSeason ?? 0) > 0 ? K.idFourSeasons.damage : 1);
/** 지금 모습·사계절의 공격력 배율 (평타, 능력치 창도 씀) */
export const idraDmgMul = (p: PlayerState) => I.form[formOf(p)].dmg * seasonMul(p);

/** 방패 모습일 때 받는 피해 배율 (combat.damagePlayer) */
export function idraTaken(p: PlayerState): number {
  if (p.characterId !== "idra" || formOf(p) !== "shield") return 1;
  return hasPerk(p, "idAncientWall") ? K.idAncientWall.taken : I.shieldTaken;
}

/** 맞았을 때 (combat.damagePlayer): 가시 방패 */
export function idraHurt(s: RunState): void {
  const p = s.player;
  if (p.characterId === "idra" && formOf(p) === "shield" && hasPerk(p, "idThornShield")) srcRun(s, "idThornShield", () => blastAt(s, p.x, p.y, K.idThornShield.r, p.stats.damage * K.idThornShield.mul, { push: 6 }));
}

/** 대시 키: 다음 모습으로 바꾸며 둘레에 변환 일격 · 대시는 그대로 함 (대시 틱을 돌려줌) */
export function idraSwap(s: RunState): number {
  const p = s.player;
  const form = ((p.gForm ?? 0) + 1) % GAIA_FORMS.length;
  p.gForm = form;
  p.gHits = 0;
  const bloom = hasPerk(p, "idBloomSwap") ? K.idBloomSwap.mul : 1;
  const r = I.swapR * bloom;
  blastAt(s, p.x, p.y, r, p.stats.damage * I.swapMul * bloom * seasonMul(p), { still: true });
  addEffect(s, { kind: "gaiaSwap", x: p.x, y: p.y, dirX: form, dirY: 0, size: r, maxTicks: 16 });
  if (hasPerk(p, "idGaiaGrace")) healPlayer(s, K.idGaiaGrace.heal);
  // 사계: 네 모습을 모두 거치면 피해 증가 (다시 처음부터 셈)
  p.gSeen = (p.gSeen ?? 0) | (1 << form);
  if (p.gSeen === 15) {
    p.gSeen = 1 << form;
    if (hasPerk(p, "idFourSeasons")) p.gSeason = K.idFourSeasons.ticks;
  }
  return DASH_TICKS;
}

/** 한 번 공격 (모습마다) */
function attack(s: RunState, dmg: number): void {
  const p = s.player;
  const form = formOf(p);
  const reach = p.stats.range * I.form[form].reach;
  if (form === "bow") {
    const n = hasPerk(p, "idSplitArrow") ? 3 : 1;
    const at = s.projectiles.length;
    fan(s, n, I.arrowSpread, { damage: dmg, spirit: "gaiaArrow", r: 3, pierce: I.arrowPierce, range: reach, speed: p.stats.projectileSpeed * 1.3 });
    // 갈래 화살: 가운데 말고 양옆 화살은 그 아이템 몫
    if (n > 1) s.projectiles.slice(at).forEach((pr, i) => i !== (n - 1) / 2 && (pr.src ??= "idSplitArrow"));
    return;
  }
  if (form === "dagger") {
    // 우드브레이커: 다섯 번째마다 크게 + 묶음
    const big = (p.gHits ?? 0) % I.breakEvery === 0;
    const mul = big ? (hasPerk(p, "idBreaker") ? K.idBreaker.mul : I.breakMul) : 1;
    const stabs = hasPerk(p, "idTwinStab") ? 2 : 1;
    for (const e of inCone(s, reach, I.daggerArc)) {
      for (let i = 0; i < stabs; i++) srcOpt(s, i > 0 && "idTwinStab", () => strike(s, e, dmg * mul));
      if (big) root(e, I.breakRoot);
    }
    addEffect(s, { kind: "thrust", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: reach, toX: p.x + p.faceX * reach, toY: p.y + p.faceY * reach, width: big ? 4 : 2, maxTicks: big ? 10 : 6, tint: big ? "#7ae05a" : "#c8e8a0" });
    return;
  }
  if (form === "shield") {
    const gain = I.shieldGain * (hasPerk(p, "idAncientWall") ? K.idAncientWall.gain : 1);
    let n = 0;
    for (const e of inCone(s, reach, I.shieldArc)) {
      strike(s, e, dmg, I.shieldPush);
      n++;
    }
    if (n > 0) raiseShield(p, gain * n, p.stats.maxHp * I.shieldMax);
    addEffect(s, { kind: "swing", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: reach, maxTicks: 9, width: 3, tint: "#c8a060" });
    return;
  }
  // 채찍: 한 줄의 적 모두 + 가시 독
  const long = hasPerk(p, "idLongWhip");
  const len = reach * (long ? K.idLongWhip.reach : 1);
  const width = I.whipWidth + (long ? K.idLongWhip.width : 0);
  const bramble = hasPerk(p, "idBramble");
  for (const e of inLine(s, len, width)) {
    strike(s, e, dmg);
    poison(e, dmg * I.thorn * (bramble ? K.idBramble.poison : 1), I.thornTicks);
    if (bramble && e.kind !== "dummy") e.slowTicks = Math.max(e.slowTicks ?? 0, K.idBramble.slow);
  }
  addEffect(s, { kind: "vine", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: width, toX: p.x + p.faceX * len, toY: p.y + p.faceY * len, maxTicks: 12 });
}

/** 대궁 화살에 맞았을 때 (s2Hits) */
export function gaiaArrowHit(s: RunState, e: EnemyState): void {
  if (hasPerk(s.player, "idRootArrow")) root(e, K.idRootArrow.ticks);
}

/** 틱마다 (가이아를 들었을 때 player에서) */
export function idraTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  if ((p.gSeason ?? 0) > 0) p.gSeason = (p.gSeason ?? 0) - 1;
  if (hasPerk(p, "idDew") && s.tick % K.idDew.every === 0) healPlayer(s, K.idDew.heal);
  // 세계수의 심장: 방마다 한 번
  if (hasPerk(p, "idWorldHeart") && p.hp > 0 && p.hp <= p.stats.maxHp / 2 && p.gHeart !== roomKey(s)) {
    p.gHeart = roomKey(s);
    healPlayer(s, p.stats.maxHp * K.idWorldHeart.heal);
    p.invulnTicks = Math.max(p.invulnTicks, K.idWorldHeart.invuln);
    addEffect(s, { kind: "bloom", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 30, maxTicks: 40 });
  }
  if (!want || p.attackCooldown > 0) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  p.gHits = (p.gHits ?? 0) + 1;
  attack(s, p.stats.damage * idraDmgMul(p));
}

/** 연습장 등에서 다시 시작할 때 */
export function resetIdra(p: PlayerState): void {
  for (const k of ["gForm", "gHits", "gSeen", "gSeason", "gHeart"] as const) delete p[k];
}
