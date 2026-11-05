// 웨이브 기술 30개 모음: 나갈 때(cast) · 빚은 것 한 틱(step) — 기술마다 파일 waveSkillsA~E
import { CASTS_A, STEPS_A } from "./waveSkillsA";
import { CASTS_B, STEPS_B } from "./waveSkillsB";
import { CASTS_C, STEPS_C } from "./waveSkillsC";
import { CASTS_D, STEPS_D } from "./waveSkillsD";
import { CASTS_E, STEPS_E } from "./waveSkillsE";

export const WAVE_CASTS = { ...CASTS_A, ...CASTS_B, ...CASTS_C, ...CASTS_D, ...CASTS_E };
export const WAVE_STEPS = { ...STEPS_A, ...STEPS_B, ...STEPS_C, ...STEPS_D, ...STEPS_E };
