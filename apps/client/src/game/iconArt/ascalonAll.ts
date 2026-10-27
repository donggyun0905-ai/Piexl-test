// 아스칼론 아이콘 모음 (추적자 · 잊혀진 자 · 잔영 · 방랑객 · 영사): weapons·passives가 한 줄로 가져감
import { ASC_PASSIVE_ART, ASC_WEAPON_ART } from "./ascalon";
import { FG_PASSIVE_ART, FG_WEAPON_ART } from "./forgotten";
import { RM_PASSIVE_ART, RM_WEAPON_ART } from "./remnant";
import { SK_PASSIVE_ART, SK_WEAPON_ART } from "./silk";
import { WD_PASSIVE_ART, WD_WEAPON_ART } from "./wanderer";

export const ASCALON_WEAPON_ART = { ...ASC_WEAPON_ART, ...FG_WEAPON_ART, ...RM_WEAPON_ART, ...WD_WEAPON_ART, ...SK_WEAPON_ART };
export const ASCALON_PASSIVE_ART = { ...ASC_PASSIVE_ART, ...FG_PASSIVE_ART, ...RM_PASSIVE_ART, ...WD_PASSIVE_ART, ...SK_PASSIVE_ART };
