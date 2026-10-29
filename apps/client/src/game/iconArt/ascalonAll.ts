// 아스칼론·시즌 2 히든 아이콘 모음 (추적자 · 잊혀진 자 · 잔영 · 방랑객 · 영사 · 에테르 광부 · 운명의 여행자 · 제우스 · 차원의 순례자): weapons·passives가 한 줄로 가져감
import { ASC_PASSIVE_ART, ASC_WEAPON_ART } from "./ascalon";
import { FG_PASSIVE_ART, FG_WEAPON_ART } from "./forgotten";
import { RM_PASSIVE_ART, RM_WEAPON_ART } from "./remnant";
import { SK_PASSIVE_ART, SK_WEAPON_ART } from "./silk";
import { WD_PASSIVE_ART, WD_WEAPON_ART } from "./wanderer";
import { MN_PASSIVE_ART, MN_WEAPON_ART } from "./miner";
import { VY_PASSIVE_ART, VY_WEAPON_ART } from "./voyager";
import { ZS_PASSIVE_ART, ZS_WEAPON_ART } from "./zeus";
import { PG_PASSIVE_ART, PG_WEAPON_ART } from "./pgHero";
import { FK_PASSIVE_ART, FK_WEAPON_ART } from "./fallenKing";

export const ASCALON_WEAPON_ART = { ...ASC_WEAPON_ART, ...FG_WEAPON_ART, ...RM_WEAPON_ART, ...WD_WEAPON_ART, ...SK_WEAPON_ART, ...MN_WEAPON_ART, ...VY_WEAPON_ART, ...ZS_WEAPON_ART, ...PG_WEAPON_ART, ...FK_WEAPON_ART };
export const ASCALON_PASSIVE_ART = { ...ASC_PASSIVE_ART, ...FG_PASSIVE_ART, ...RM_PASSIVE_ART, ...WD_PASSIVE_ART, ...SK_PASSIVE_ART, ...MN_PASSIVE_ART, ...VY_PASSIVE_ART, ...ZS_PASSIVE_ART, ...PG_PASSIVE_ART, ...FK_PASSIVE_ART };
