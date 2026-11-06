// 패왕전 캐릭터별 스킬 표 모음 (평타 배율 · 스킬 1~4) · 계산은 sim/pwSkill
import type { CharacterId } from "./characters";
import { PW_KITS_1 } from "./pwKits1";
import { PW_KITS_2 } from "./pwKits2";
import { PW_KITS_3 } from "./pwKits3";
import type { PwKit, PwKits } from "./pwSkillTypes";

export const PW_KITS: PwKits = { ...PW_KITS_1, ...PW_KITS_2, ...PW_KITS_3 };

/** 캐릭터마다 스킬 그림 느낌 (그림만, 계산과 상관없음) */
export const PW_MOTIF: Partial<Record<CharacterId, string>> = {
  mage: "fire", bomber: "fire", imugi: "fire", oni: "fire",
  elementalist: "elements", engineer: "lightning", punk: "lightning",
  gunner: "tech", automata: "tech", artifacter: "tech", rider: "tech", tracker: "tech",
  plague: "poison", samyeol: "poison",
  ninja: "shadow", remnant: "shadow", mukin: "shadow", silk: "shadow", pungryu: "wind", leo: "lightning", onyx: "elements", fenrir: "wind", eclipse: "fire", thorken: "lightning", levia: "wind", tail: "blood", madQueen: "tech", hook: "wind", orca: "impact", wave: "wind", miryu: "blade", beatrice: "fire", ian: "shadow", gabriel: "impact", serena: "holy", rafael: "wind", yuriel: "holy", michaela: "blade", byeonhui: "shadow",
  forgotten: "holy", apostle: "holy", warden: "holy", doctor: "holy",
  slayer: "blood", eater: "blood",
  elder: "nature", idra: "nature", ren: "nature",
  mystic: "spirit", spiritist: "spirit", summoner: "spirit",
  beast: "beast", fly: "beast",
  bedouin: "wind", drifter: "wind",
  chronomancer: "time",
  brawler: "impact", titan: "impact", novice: "impact", abandoned: "impact",
  wanderer: "blade", general: "blade", collector: "blade",
};

/** 그 캐릭터의 패왕전 스킬 (숨은 캐릭터는 없음) */
export const kitOf = (c: CharacterId): PwKit | undefined => PW_KITS[c];

export type { PwBuff, PwFxStyle, PwHit, PwKit, PwShape, PwSkillDef, PwSummon } from "./pwSkillTypes";
