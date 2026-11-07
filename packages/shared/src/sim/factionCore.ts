// 성국 핵심 스킬 각성 (sim/faction이 부름): 스킬을 쓴 횟수를 셈(스킬 대기가 다시 찬 순간) → 정한 횟수면 핵심 스킬이 각성(그 판 끝까지)
// 각성한 핵심 스킬을 쓰면 잠깐 주는 피해 증가 + 둘레 금빛 빛기둥 (수치 factionDefs.FACTION_CORE · 캐릭터마다 핵심 스킬 FACTION_CORE_SKILL)
import type { CharacterId } from "../characters";
import { FACTION_CORE as C, FACTION_CORE_SKILL } from "../factionDefs";
import { beatriceSkills } from "./beatriceKit";
import { blastAt } from "./combat";
import { gabrielSkills } from "./gabrielKit";
import { ianSkills } from "./ianKit";
import { michaelaSkills } from "./michaelaKit";
import { rafaelSkills } from "./rafaelKit";
import { serenaSkills } from "./serenaKit";
import type { PlayerState, RunState } from "./types";
import { addEffect } from "./util";
import { yurielSkills } from "./yurielKit";

const COOLDOWNS: Partial<Record<CharacterId, (p: PlayerState) => number[]>> = {
  beatrice: beatriceSkills, ian: ianSkills, gabriel: gabrielSkills, serena: serenaSkills, rafael: rafaelSkills, yuriel: yurielSkills, michaela: michaelaSkills,
};

/** 핵심 스킬이 각성했는지 · 몇 번째 스킬인지 (화면 스킬 칸이 빛남) */
export const coreAwake = (p: PlayerState) => (p.fcUses ?? 0) >= C.uses;
export const coreSkillOf = (c: CharacterId) => FACTION_CORE_SKILL[c];

/** 틱마다: 스킬 대기가 다시 차면 쓴 것으로 셈 · 각성한 핵심 스킬이면 빛기둥 */
export function coreTick(s: RunState): void {
  const p = s.player;
  if ((p.fcCoreT ?? 0) > 0) p.fcCoreT!--;
  const cds = COOLDOWNS[p.characterId]?.(p);
  if (!cds) return;
  const prev = p.fcCds ?? cds;
  p.fcCds = cds;
  cds.forEach((v, i) => {
    if (v <= (prev[i] ?? 0) + 0.3) return;
    const was = coreAwake(p);
    if (i === coreSkillOf(p.characterId) && was) pillar(s);
    p.fcUses = (p.fcUses ?? 0) + 1;
    if (!was && coreAwake(p)) addEffect(s, { kind: "fcCoreOn", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 40, maxTicks: 50, follow: true });
  });
}

function pillar(s: RunState): void {
  const p = s.player;
  p.fcCoreT = C.window;
  addEffect(s, { kind: "fcCorePillar", x: p.x, y: p.y, dirX: 0, dirY: 0, size: C.pillarR, maxTicks: 36 });
  blastAt(s, p.x, p.y, C.pillarR, p.stats.damage * C.pillarMul, { push: 6 });
}

/** 주는 피해 배율: 각성한 핵심 스킬을 쓴 뒤 잠깐 */
export const coreDmgMul = (p: PlayerState) => ((p.fcCoreT ?? 0) > 0 ? C.dmg : 1);
