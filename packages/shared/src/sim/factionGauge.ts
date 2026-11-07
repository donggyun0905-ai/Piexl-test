// 화면용 진영 특징 값 (게이지 칸·스킬 칸 빛남): 진영 · 막대 0~1 · 숫자 · 켜짐(폭주·과부하·각성 등) · 맹세 · 정령 단계 · 성국 핵심 스킬 칸
import { FACTION_CORE, FACTION_HEAT, FACTION_OATH, FACTION_TAINT, FACTION_TIDE, type FactionTrait } from "../factionDefs";
import { SPIRIT_GROW, SPIRIT_PACK, type SpiritId } from "../spiritDefs";
import { traitOf } from "./faction";
import { coreAwake, coreSkillOf } from "./factionCore";
import { spiritStage } from "./factionSpirit";
import type { OathKind } from "./factionTypes";
import type { RunState } from "./types";
export { factionOfCharacter } from "./faction";

export interface FactionGauge {
  trait: FactionTrait;
  v: number;
  n: number;
  on?: boolean;
  /** 아스칼론: 이번 방 맹세 · 상태 (keep 지키는 중 · broken 깨짐 · kept 지킴) */
  oath?: OathKind;
  oathState?: "keep" | "broken" | "kept";
  /** 비르디아: 정령 단계 0~2 · 고른 정령 · 정령마다 숫자(여우 바꾸기 남은 수·꾸러미에 넣은 수·상자/먹보 모은 수/필요 수) */
  stage?: number;
  spirit?: SpiritId;
  extra?: string;
  /** 성국: 핵심 스킬 칸 (0부터) */
  core?: number;
}

const r2 = (v: number) => Math.round(Math.max(0, Math.min(1, v)) * 50) / 50;

export function factionGauge(s: RunState): FactionGauge | null {
  const trait = traitOf(s);
  if (!trait) return null;
  const p = s.player;
  switch (trait) {
    case "thalassia": {
      const n = p.fcCombo ?? 0;
      return { trait, v: r2(n / FACTION_TIDE.max), n, on: n >= FACTION_TIDE.step };
    }
    case "helios": {
      const on = (p.fcRampage ?? 0) > 0;
      return { trait, v: r2(on ? p.fcRampage! / FACTION_TAINT.rampageTicks : (p.fcTaint ?? 0) / FACTION_TAINT.max), n: on ? FACTION_TAINT.max : (p.fcTaint ?? 0), on };
    }
    case "terracore": {
      const n = Math.round(p.fcHeat ?? 0);
      return { trait, v: r2(n / FACTION_HEAT.max), n, on: (p.fcOver ?? 0) > 0 || n >= FACTION_HEAT.ventFrom };
    }
    case "ascalon": {
      const o = p.fcOath;
      const here = o && o.at === `${s.floor}/${s.roomId}` ? o : undefined;
      const oathState = here ? (here.broken ? "broken" : here.kept ? "kept" : "keep") : undefined;
      const n = p.fcGlory ?? 0;
      return { trait, v: r2(n / FACTION_OATH.gloryMax), n, ...(here ? { oath: here.kind, oathState } : {}) };
    }
    case "virdia": {
      const k = p.fcSpKills ?? 0;
      const stage = spiritStage(p);
      const v = stage >= 2 ? 1 : stage === 1 ? (k - SPIRIT_GROW.grow1) / (SPIRIT_GROW.grow2 - SPIRIT_GROW.grow1) : k / SPIRIT_GROW.grow1;
      const sp = p.fcSp;
      const extra =
        sp === "fox" ? `${p.fcFox ?? 0}` : sp === "bag" ? `${p.fcBag?.length ?? 0}/${SPIRIT_PACK.bagMax}` : sp === "chest" ? `${p.fcChestN ?? 0}/${SPIRIT_PACK.chestEvery}` : sp === "glutton" ? `${p.fcGlut ?? 0}/${SPIRIT_PACK.gluttonEvery}` : undefined;
      return { trait, v: r2(v), n: k, stage, ...(sp ? { spirit: sp } : {}), ...(extra ? { extra } : {}) };
    }
    case "seongguk": {
      const n = p.fcUses ?? 0;
      const core = coreSkillOf(p.characterId);
      return { trait, v: r2(n / FACTION_CORE.uses), n: Math.min(n, FACTION_CORE.uses), on: coreAwake(p), ...(core !== undefined ? { core } : {}) };
    }
  }
}
