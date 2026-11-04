// 패왕전 전용 패시브 (던전 패시브와 따로). 수치는 paewangPassive.PW_PASSIVE (관리자 '패왕전 수치 · 규칙' passive)
// 맞힐 때 배율·효과(passiveHitMul, pwMatchup이 부름) · 틱마다(passiveTick, pvp 자리마다) · 스킬 쓸 때(passiveCast)
// 캐릭터마다 세는 값은 p.pwPs (판마다 처음으로, pvpFlow.freshStart). 기본 공격 = pv.src 없음
import { PW } from "../paewangDefs";
import { PW_PASSIVE as P } from "../paewangPassive";
import { createRng, deriveSeed } from "../rng";
import { armsOnBack } from "./collector";
import { heal } from "./heal";
import { allPlayers, seatNo } from "./party";
import { roleHealMul } from "./pwMatchup";
import { alliesNear } from "./pwSkillHit";
import { inPlay } from "./pvpWorld";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect } from "./util";

type Buff = NonNullable<PlayerState["pwBuffs"]>[number];

const get = (p: PlayerState, k: string, d = 0): number => p.pwPs?.[k] ?? d;
const put = (p: PlayerState, k: string, v: number): number => ((p.pwPs ??= {})[k] = v);
/** 세는 값 하나 올리고 돌려줌 */
export const pwCount = (p: PlayerState, k: string): number => put(p, k, get(p, k) + 1);
const isBasic = (s: RunState): boolean => !s.pvp!.src;
const stun = (e: EnemyState, t: number) => (e.stunTicks = Math.max(e.stunTicks ?? 0, t));
const near = (a: { x: number; y: number }, b: { x: number; y: number }, r: number) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2 <= r * r;

/** 역병의사에게 맞은 사람: 받는 회복 배율 */
export const plagueCut = (s: RunState, q: PlayerState): number => (s.pvp && get(q, "plg") > s.tick ? P.plagueHeal : 1);

/** 다른 사람(아군)을 회복 (패왕전 회복 배율·서포터·역병) */
function healOther(s: RunState, q: PlayerState, amt: number): void {
  if (q === s.player) return heal(s, amt);
  q.hp = Math.min(q.stats.maxHp, q.hp + amt * PW.heal * roleHealMul(s) * plagueCut(s, q));
}

/** 가장 가까운 아군 (없으면 나) */
function nearestAlly(s: RunState): PlayerState {
  const p = s.player;
  const list = alliesNear(s, p.x, p.y, 1e5).filter((q) => q !== p);
  return list.sort((a, b) => (a.x - p.x) ** 2 + (a.y - p.y) ** 2 - ((b.x - p.x) ** 2 + (b.y - p.y) ** 2))[0] ?? p;
}

/** 악의 사도 죄의 오라: 때린 사람 둘레 아군 사도 · 맞은 쪽이 그 사도 둘레 */
function apostleAura(s: RunState, e: EnemyState): number {
  const pv = s.pvp!;
  const me = seatNo(s);
  let m = 1;
  allPlayers(s).forEach((q, j) => {
    if (q.characterId !== "apostle" || pv.seats[j]!.team !== pv.seats[me]!.team || !inPlay(s, j)) return;
    if (q !== s.player && near(q, s.player, P.apostleR)) m *= P.apostleAlly;
    if (near(q, e, P.apostleR)) m *= P.apostleFoe;
  });
  return m;
}

/** 아티팩터: 가까운 아군 하나에게 무작위 버프 (시드) */
function craft(s: RunState): void {
  const q = nearestAlly(s);
  const r = Math.floor(createRng(deriveSeed(s.seed, "pwCraft", s.tick, seatNo(s))).nextFloat() * 3);
  const t = P.artifacterTicks;
  (q.pwBuffs ??= []).push(r === 0 ? { t, dmg: P.artifacterDmg } : r === 1 ? { t, taken: P.artifacterTaken } : { t, move: P.artifacterMove });
  addEffect(s, { kind: "ring", x: q.x, y: q.y, dirX: 0, dirY: 0, size: 16, maxTicks: 20 });
}

/** 지금 자리(s.player)가 상대 사람 target(그림자 적 e, j번 자리)을 맞힐 때: 피해 배율 (기절·묶기 등은 e에 걸면 옮겨짐) */
export function passiveHitMul(s: RunState, e: EnemyState, j: number, target: PlayerState): number {
  const p = s.player;
  const basic = isBasic(s);
  let m = apostleAura(s, e);
  switch (p.characterId) {
    case "oni":
      return m * (1 + P.oniRage * Math.max(0, 1 - p.hp / p.stats.maxHp));
    case "general":
      if (!basic) break;
      if (s.tick - get(p, "gnT", -1e9) > P.generalGap) put(p, "gnC", 0);
      put(p, "gnT", s.tick);
      if (pwCount(p, "gnC") > P.generalN) {
        put(p, "gnC", 0);
        stun(e, P.generalStun);
        m *= P.generalMul;
      }
      break;
    case "mukin":
      if (p.pwDash) stun(e, P.mukinStun);
      break;
    case "drifter":
      if (!basic) break;
      if (!near(p, e, p.stats.range * P.drifterFar)) m *= P.drifterFarMul;
      if (get(p, "drD")) {
        put(p, "drD", 0);
        m *= P.drifterDashMul;
      }
      break;
    case "engineer":
      if (get(p, "enT", -1) !== j) {
        put(p, "enT", j);
        put(p, "enC", 0);
      }
      return m * (1 + Math.min(P.engHeatMax, P.engHeat * (pwCount(p, "enC") - 1)));
    case "gunner":
      if (basic && get(p, "guS") > 0) {
        put(p, "guS", get(p, "guS") - 1);
        m *= P.gunnerMul;
      }
      break;
    case "samyeol":
      if (basic && pwCount(p, "smN") % P.samyeolN === 0) m *= P.samyeolMul;
      break;
    case "tracker":
      if (basic && get(p, "trS") >= P.trackerStill) {
        put(p, "trS", 0);
        m *= P.trackerMul;
      }
      break;
    case "elementalist": {
      const ph = Math.floor(s.tick / P.elemEvery) % 3;
      if (ph === 0) {
        e.poisonTicks = Math.max(e.poisonTicks ?? 0, P.elemEvery);
        e.poisonDmg = Math.max(e.poisonDmg ?? 0, (p.stats.damage * P.elemBurn) / 6);
      } else if (ph === 1) e.slowTicks = Math.max(e.slowTicks ?? 0, P.elemSlow);
      else m *= P.elemShock;
      break;
    }
    case "elder":
      if (basic && s.tick - get(p, `el${j}`, -1e9) >= P.elderGap) {
        put(p, `el${j}`, s.tick);
        e.rootTicks = Math.max(e.rootTicks ?? 0, P.elderRoot);
      }
      break;
    case "plague":
      put(target, "plg", s.tick + P.plagueTicks);
      break;
    case "brawler":
      if (basic && pwCount(p, "brN") % P.brawlerN === 0) stun(e, P.brawlerStun);
      break;
    case "beast":
      if (target.hp < target.stats.maxHp * P.beastBelow) m *= P.beastMul;
      break;
    case "eater":
      if (basic && pwCount(p, "eaN") % P.eaterN === 0) {
        m *= P.eaterMul;
        heal(s, p.stats.damage * P.eaterMul * P.eaterHeal);
      }
      break;
    case "abandoned":
      if (basic && get(p, "abT")) {
        put(p, "abT", 0);
        m *= P.abandonedMul;
      }
      break;
    case "mystic":
      if (basic) healOther(s, nearestAlly(s), nearestAlly(s).stats.maxHp * P.mysticHeal);
      break;
    case "artifacter":
      if (pwCount(p, "afN") % P.artifacterN === 0) craft(s);
      break;
    case "collector":
      // 수집품의 무게: 등 뒤에 뜬 수집 무기 하나마다 평타 피해 +
      if (basic) m *= 1 + Math.min(P.collectorMax, armsOnBack(p).length * P.collectorPer);
      break;
    case "pungryu":
      // 구절 완성: 평타 네 번째마다 더 아픔
      if (basic && pwCount(p, "puN") % P.pungryuN === 0) m *= P.pungryuMul;
      break;
  }
  return m;
}

/** 틱마다 (지금 자리, 움직인 뒤) */
export function passiveTick(s: RunState): void {
  const p = s.player;
  const pv = s.pvp!;
  switch (p.characterId) {
    case "warden":
      if (!get(p, "wd") && p.hp > 0 && p.hp < p.stats.maxHp * P.wardenBelow) {
        put(p, "wd", s.tick + P.wardenTicks);
        put(p, "wdA", p.stats.maxHp * P.wardenShield);
        p.shieldPts = (p.shieldPts ?? 0) + get(p, "wdA");
        addEffect(s, { kind: "ring", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 22, maxTicks: 24, tint: "#80c8ff" });
      } else if (get(p, "wd") > 0 && s.tick >= get(p, "wd")) {
        put(p, "wd", -1);
        p.shieldPts = Math.max(0, (p.shieldPts ?? 0) - get(p, "wdA"));
      }
      break;
    case "drifter":
      if (p.dashTicks > 0) put(p, "drD", 1);
      break;
    case "gunner": {
      const a = p.ammo ?? 0;
      if (a > get(p, "guA") + 1) put(p, "guS", P.gunnerShots);
      put(p, "guA", a);
      break;
    }
    case "tracker":
      put(p, "trS", p.x === p.prevX && p.y === p.prevY ? get(p, "trS") + 1 : 0);
      break;
    case "abandoned":
      if ((p.abM ?? 0) + 1 !== get(p, "abM")) {
        if (get(p, "abM")) put(p, "abT", 1);
        put(p, "abM", (p.abM ?? 0) + 1);
      }
      break;
    case "punk":
      if ((p.cyAccel ?? 0) <= 0) break;
      pv.proxies.forEach((e, j) => {
        if (pv.seats[j]!.team !== pv.seats[seatNo(s)]!.team && inPlay(s, j) && near(p, e, P.punkSlowR)) e.slowTicks = Math.max(e.slowTicks ?? 0, 10);
      });
      break;
    case "forgotten":
      if ((p.fgGod ?? 0) > 0 && s.tick % 60 === 0) for (const q of alliesNear(s, p.x, p.y, P.forgottenR)) healOther(s, q, q.stats.maxHp * P.forgottenRegen);
      break;
  }
}

/** 스킬을 쓸 때 (지금 자리): 변희·이드라 순환 버프 · 베두인 이동 */
export function passiveCast(s: RunState): void {
  const p = s.player;
  let b: Buff | undefined;
  if (p.characterId === "byeonhui") {
    const n = pwCount(p, "mo") % 3;
    b = n === 1 ? { t: P.morphTicks, move: P.morphMove } : n === 2 ? { t: P.morphTicks, taken: P.morphTaken } : { t: P.morphTicks, rate: P.morphRate };
  } else if (p.characterId === "idra") {
    const n = pwCount(p, "id") % 3;
    b = n === 1 ? { t: P.idraTicks, dmg: P.idraDmg } : n === 2 ? { t: P.idraTicks, rate: P.idraRate } : { t: P.idraTicks, taken: P.idraTaken };
  } else if (p.characterId === "bedouin") b = { t: P.bedouinTicks, move: P.bedouinMove };
  if (b) (p.pwBuffs ??= []).push(b);
}
