// 패왕전 캐릭터별 스킬 표 모음 (평타 배율 · 스킬 1~4) · 계산은 sim/pwSkill
import type { CharacterId } from "./characters";
import { PW_KITS_1 } from "./pwKits1";
import { PW_KITS_2 } from "./pwKits2";
import { PW_KITS_3 } from "./pwKits3";
import type { PwKit, PwKits } from "./pwSkillTypes";

export const PW_KITS: PwKits = { ...PW_KITS_1, ...PW_KITS_2, ...PW_KITS_3 };

/** 그 캐릭터의 패왕전 스킬 (숨은 캐릭터는 없음) */
export const kitOf = (c: CharacterId): PwKit | undefined => PW_KITS[c];

export type { PwBuff, PwFxStyle, PwHit, PwKit, PwShape, PwSkillDef, PwSummon } from "./pwSkillTypes";
