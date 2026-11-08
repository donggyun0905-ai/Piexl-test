// 연습장 진영 도구 (화면 game/practice/PracticeFaction): 공생 정령 카드 다시 뽑기(무작위)·바로 고르기·자람 단계 · 진영 게이지 가득 · 스킬 대기 초기화 · 바닥에 아이템 놓기(구미호·코인 정령 시험)
import { FACTION_CORE, FACTION_HEAT, FACTION_OATH, FACTION_TAINT, FACTION_TIDE } from "../factionDefs";
import { createRng, deriveSeed } from "../rng";
import { SPIRIT_COIN, SPIRIT_GROW, SPIRIT_IDS, SPIRIT_PACK, type SpiritId } from "../spiritDefs";
import { STIGMA } from "../weaponsDawn";
import { traitOf } from "./faction";
import { addPickup, passivePool, pickDistinct, usePool } from "./loot";
import { awaken } from "./stigma";
import type { RunState } from "./types";

/** 정령 상태를 모두 지움 */
function clearSpirit(s: RunState): void {
  const p = s.player;
  for (const k of ["fcSp", "fcSpPick", "fcSpKills", "fcSpX", "fcSpY", "fcSpBuffT", "fcSpHealT", "fcSpRooms", "fcSpCyc", "fcCo", "fcFox", "fcBag", "fcBagOpen", "fcChestN", "fcChest", "fcGlut", "fcSpSeen", "fcSpRoom", "fcCoin", "fcCoinGift"] as const) delete p[k];
}

/** 카드 3장 다시 뽑기 (누를 때마다 다른 3장) */
export function practiceSpiritCards(s: RunState): void {
  clearSpirit(s);
  s.player.fcSpPick = pickDistinct(createRng(deriveSeed(s.seed, "practiceSpirit", s.tick)), SPIRIT_IDS, 3);
}

/** 정령 바로 고르기 */
export function practiceSpirit(s: RunState, id: SpiritId): void {
  clearSpirit(s);
  s.player.fcSp = id;
  s.player.fcSpCyc = 0;
}

/** 자람 단계 (0 유년기 ~ 3 궁극체) */
export function practiceSpiritStage(s: RunState, stage: number): void {
  s.player.fcSpKills = [0, SPIRIT_GROW.grow1, SPIRIT_GROW.grow2, SPIRIT_GROW.grow3][stage] ?? 0;
}

/** 진영 게이지 가득 (물결 콤보·타락·에너지·영광·핵심 스킬 각성·성흔 각성 · 구미호 바꾸기·코인 점수 +100) */
export function practiceFactionFill(s: RunState): void {
  const p = s.player;
  const tr = traitOf(s);
  if (tr === "thalassia") p.fcCombo = FACTION_TIDE.max;
  else if (tr === "helios") p.fcTaint = FACTION_TAINT.max;
  else if (tr === "terracore") p.fcHeat = FACTION_HEAT.max;
  else if (tr === "ascalon") p.fcGlory = FACTION_OATH.gloryMax;
  else if (tr === "seongguk") p.fcUses = FACTION_CORE.uses;
  else if (tr === "virdia") {
    if (p.fcSp === "fox") p.fcFox = SPIRIT_PACK.foxMax;
    if (p.fcSp === "coin") p.fcCoin = (p.fcCoin ?? 0) + SPIRIT_COIN.tier1;
  }
  if (p.characterId === "blast" || p.characterId === "nailer" || p.characterId === "scissors" || p.characterId === "hellfist" || p.characterId === "silverBullet" || p.characterId === "blueFlame" || p.characterId === "lunatic") awaken(p, STIGMA.awakeTicks);
}

/** 스킬 대기 초기화: 이름이 Cd로 끝나는 대기 값(숫자·배열)을 모두 0 */
export function practiceSkillReset(s: RunState): void {
  const p = s.player as unknown as Record<string, unknown>;
  for (const k of Object.keys(p)) {
    if (!k.endsWith("Cd")) continue;
    const v = p[k];
    if (typeof v === "number") p[k] = 0;
    else if (Array.isArray(v) && v.every((x) => typeof x === "number")) p[k] = v.map(() => 0);
  }
}

/** 바닥에 아이템 놓기: 공짜 패시브 2 · 사용 아이템 1 · 값이 붙은 패시브 1 (구미호·코인 정령 시험) */
export function practiceDropItems(s: RunState): void {
  const rng = createRng(deriveSeed(s.seed, "practiceDrop", s.tick));
  const p = s.player;
  const [a, b, c] = pickDistinct(rng, passivePool(s), 3);
  const y = p.y - 40;
  if (a) addPickup(s, s.roomId, "passive", a, p.x - 36, y);
  if (b) addPickup(s, s.roomId, "passive", b, p.x - 12, y);
  addPickup(s, s.roomId, "use", rng.pick(usePool(s, true)), p.x + 12, y);
  if (c) addPickup(s, s.roomId, "passive", c, p.x + 36, y, 0, 20);
}
