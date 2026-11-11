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
import { LX_PASSIVE_ART, LX_WEAPON_ART } from "./lux";
import { CL_PASSIVE_ART, CL_WEAPON_ART } from "./collector";
import { PU_PASSIVE_ART, PU_WEAPON_ART } from "./pungryu";
import { LE_PASSIVE_ART, LE_WEAPON_ART } from "./leo";
import { OX_PASSIVE_ART, OX_WEAPON_ART } from "./onyx";
// 비르디아 영물 펜리르도 영물끼리 여기에 모음
import { FN_PASSIVE_ART, FN_WEAPON_ART } from "./fenrir";
// 헬리오스 이클립스도 새 캐릭터 묶음으로 여기에
import { EC_PASSIVE_ART, EC_WEAPON_ART } from "./eclipse";
// 탈라시아 토르켄도 여기에
import { TK_PASSIVE_ART, TK_WEAPON_ART } from "./thorken";
import { LV_PASSIVE_ART, LV_WEAPON_ART } from "./levia";
import { TL_PASSIVE_ART, TL_WEAPON_ART } from "./tail";
import { MQ_PASSIVE_ART, MQ_WEAPON_ART } from "./madQueen";
import { HK_PASSIVE_ART, HK_WEAPON_ART } from "./hook";
import { OC_PASSIVE_ART, OC_WEAPON_ART } from "./orca";
import { WV_PASSIVE_ART, WV_WEAPON_ART } from "./wave";
import { MR_PASSIVE_ART, MR_WEAPON_ART } from "./miryu";
import { BT_PASSIVE_ART, BT_WEAPON_ART } from "./beatrice";
import { IA_PASSIVE_ART, IA_WEAPON_ART } from "./ian";
import { GB_PASSIVE_ART, GB_WEAPON_ART } from "./gabriel";
import { SN_PASSIVE_ART, SN_WEAPON_ART } from "./serena";
import { RF_PASSIVE_ART, RF_WEAPON_ART } from "./rafael";
import { YR_PASSIVE_ART, YR_WEAPON_ART } from "./yuriel";
import { MC_PASSIVE_ART, MC_WEAPON_ART } from "./michaela";
import { BL_PASSIVE_ART, BL_WEAPON_ART } from "./blast";
import { NL_PASSIVE_ART, NL_WEAPON_ART } from "./nailer";
import { SX_PASSIVE_ART, SX_WEAPON_ART } from "./scissors";
import { HF_PASSIVE_ART, HF_WEAPON_ART } from "./hellfist";
import { SB_PASSIVE_ART, SB_WEAPON_ART } from "./silverBullet";
import { BZ_PASSIVE_ART, BZ_WEAPON_ART } from "./blueFlame";
import { LN_PASSIVE_ART, LN_WEAPON_ART } from "./lunatic";
import { IC_PASSIVE_ART, IC_WEAPON_ART } from "./incision";
import { CR_PASSIVE_ART, CR_WEAPON_ART } from "./crusader";
import { JK_PASSIVE_ART, JK_WEAPON_ART } from "./joker";
import { SD_PASSIVE_ART, SD_WEAPON_ART } from "./shadowing";
import { PP_PASSIVE_ART, PP_WEAPON_ART } from "./puppeteer";
import { RB_PASSIVE_ART, RB_WEAPON_ART } from "./rabbit";
import { AS_PASSIVE_ART, AS_WEAPON_ART } from "./asura";
import { BY_PASSIVE_ART, BY_WEAPON_ART } from "./baekryeong";
import { BS_PASSIVE_ART, BS_WEAPON_ART } from "./bingseol";

export const ASCALON_WEAPON_ART = { ...ASC_WEAPON_ART, ...FG_WEAPON_ART, ...RM_WEAPON_ART, ...WD_WEAPON_ART, ...SK_WEAPON_ART, ...MN_WEAPON_ART, ...VY_WEAPON_ART, ...ZS_WEAPON_ART, ...PG_WEAPON_ART, ...FK_WEAPON_ART, ...LX_WEAPON_ART, ...CL_WEAPON_ART, ...PU_WEAPON_ART, ...LE_WEAPON_ART, ...OX_WEAPON_ART, ...FN_WEAPON_ART, ...EC_WEAPON_ART, ...TK_WEAPON_ART, ...LV_WEAPON_ART, ...TL_WEAPON_ART, ...MQ_WEAPON_ART, ...HK_WEAPON_ART, ...OC_WEAPON_ART, ...WV_WEAPON_ART, ...MR_WEAPON_ART, ...BT_WEAPON_ART, ...IA_WEAPON_ART, ...GB_WEAPON_ART, ...SN_WEAPON_ART, ...RF_WEAPON_ART, ...YR_WEAPON_ART, ...MC_WEAPON_ART, ...BL_WEAPON_ART, ...NL_WEAPON_ART, ...SX_WEAPON_ART, ...HF_WEAPON_ART, ...SB_WEAPON_ART, ...BZ_WEAPON_ART, ...LN_WEAPON_ART, ...IC_WEAPON_ART, ...CR_WEAPON_ART, ...JK_WEAPON_ART, ...SD_WEAPON_ART, ...PP_WEAPON_ART, ...RB_WEAPON_ART, ...AS_WEAPON_ART, ...BY_WEAPON_ART, ...BS_WEAPON_ART };
export const ASCALON_PASSIVE_ART = { ...ASC_PASSIVE_ART, ...FG_PASSIVE_ART, ...RM_PASSIVE_ART, ...WD_PASSIVE_ART, ...SK_PASSIVE_ART, ...MN_PASSIVE_ART, ...VY_PASSIVE_ART, ...ZS_PASSIVE_ART, ...PG_PASSIVE_ART, ...FK_PASSIVE_ART, ...LX_PASSIVE_ART, ...CL_PASSIVE_ART, ...PU_PASSIVE_ART, ...LE_PASSIVE_ART, ...OX_PASSIVE_ART, ...FN_PASSIVE_ART, ...EC_PASSIVE_ART, ...TK_PASSIVE_ART, ...LV_PASSIVE_ART, ...TL_PASSIVE_ART, ...MQ_PASSIVE_ART, ...HK_PASSIVE_ART, ...OC_PASSIVE_ART, ...WV_PASSIVE_ART, ...MR_PASSIVE_ART, ...BT_PASSIVE_ART, ...IA_PASSIVE_ART, ...GB_PASSIVE_ART, ...SN_PASSIVE_ART, ...RF_PASSIVE_ART, ...YR_PASSIVE_ART, ...MC_PASSIVE_ART, ...BL_PASSIVE_ART, ...NL_PASSIVE_ART, ...SX_PASSIVE_ART, ...HF_PASSIVE_ART, ...SB_PASSIVE_ART, ...BZ_PASSIVE_ART, ...LN_PASSIVE_ART, ...IC_PASSIVE_ART, ...CR_PASSIVE_ART, ...JK_PASSIVE_ART, ...SD_PASSIVE_ART, ...PP_PASSIVE_ART, ...RB_PASSIVE_ART, ...AS_PASSIVE_ART, ...BY_PASSIVE_ART, ...BS_PASSIVE_ART };
