// 직업 전용 아이템 설명 모음 (원소술사·격투가·거너·야수·닌자·시간술사·소환술사·베두인·장수·이무기·악의 사도) → effects.EFFECT_DESC에 합침
import type { PassiveId } from "@pixel-rogue/shared";
import { ELEMENTAL_EFFECTS } from "./elemental";
import { BRAWLER_EFFECTS } from "./brawler";
import { GUNNER_EFFECTS } from "./gunner";
import { BEAST_EFFECTS } from "./beast";
import { NINJA_EFFECTS } from "./ninja";
import { CHRONO_EFFECTS } from "./chrono";
import { SUMMON_EFFECTS } from "./summon";
import { BEDOUIN_EFFECTS } from "./bedouin";
import { GENERAL_EFFECTS } from "./general";
import { IMUGI_EFFECTS } from "./imugi";
import { APOSTLE_EFFECTS } from "./apostle";
import { STAR_EFFECTS } from "./star";
import { DUCK_EFFECTS } from "./duck";
import { SCRIBE_EFFECTS } from "./scribe";
import { S2_EFFECTS } from "./season2";
import { ABANDONED_EFFECTS } from "./abandoned";
import { TITAN_EFFECTS } from "./titan";
import { ONI_EFFECTS } from "./oni";
import type { Names } from "./names";

export const CLASS_EFFECTS: Partial<Record<PassiveId, Names>> = {
  ...ELEMENTAL_EFFECTS,
  ...BRAWLER_EFFECTS,
  ...GUNNER_EFFECTS,
  ...BEAST_EFFECTS,
  ...NINJA_EFFECTS,
  ...CHRONO_EFFECTS,
  ...SUMMON_EFFECTS,
  ...BEDOUIN_EFFECTS,
  ...GENERAL_EFFECTS,
  ...IMUGI_EFFECTS,
  ...APOSTLE_EFFECTS,
  ...STAR_EFFECTS,
  ...DUCK_EFFECTS,
  ...SCRIBE_EFFECTS,
  ...S2_EFFECTS,
  ...ABANDONED_EFFECTS,
  ...TITAN_EFFECTS,
  ...ONI_EFFECTS,
};
