// 시즌 2(비르디아·헬리오스·테라코어) 캐릭터 전용 아이템 모음 (items·perks에서 한 번에 가져옴)
import { ELDER_PASSIVES, ELDER_PERKS } from "./itemsElder";
import { FLY_PASSIVES, FLY_PERKS } from "./itemsFly";
import { IDRA_PASSIVES, IDRA_PERKS } from "./itemsIdra";
import { MORPH_PASSIVES, MORPH_PERKS } from "./itemsMorph";
import { REN_PASSIVES, REN_PERKS } from "./itemsRen";
import { SPIRIT_PASSIVES, SPIRIT_PERKS } from "./itemsSpirit";
import { PLAGUE_PASSIVES, PLAGUE_PERKS } from "./itemsPlague";
import { SLAYER_PASSIVES, SLAYER_PERKS } from "./itemsSlayer";
import { EATER_PASSIVES, EATER_PERKS } from "./itemsEater";
import { MUKIN_PASSIVES, MUKIN_PERKS } from "./itemsMukin";
import { SAMYEOL_PASSIVES, SAMYEOL_PERKS } from "./itemsSamyeol";
import { AUTOMATA_PASSIVES, AUTOMATA_PERKS } from "./itemsAutomata";
import { RIDER_PASSIVES, RIDER_PERKS } from "./itemsRider";
import { BOMBER_PASSIVES, BOMBER_PERKS } from "./itemsBomber";
import { ARTIFACTER_PASSIVES, ARTIFACTER_PERKS } from "./itemsArtifacter";
import { PUNK_PASSIVES, PUNK_PERKS } from "./itemsPunk";
import { TRACKER_PASSIVES, TRACKER_PERKS } from "./itemsTracker";
import { FORGOTTEN_PASSIVES, FORGOTTEN_PERKS } from "./itemsForgotten";
import { REMNANT_PASSIVES, REMNANT_PERKS } from "./itemsRemnant";
import { WANDERER_PASSIVES, WANDERER_PERKS } from "./itemsWanderer";
import { SILK_PASSIVES, SILK_PERKS } from "./itemsSilk";
import { MINER_PASSIVES, MINER_PERKS } from "./itemsMiner";
import { VOYAGER_PASSIVES, VOYAGER_PERKS } from "./itemsVoyager";
import { ZEUS_PASSIVES, ZEUS_PERKS } from "./itemsZeus";
import { PILGRIM_PASSIVES, PILGRIM_PERKS } from "./itemsPilgrim";

export const S2_PASSIVES = { ...IDRA_PASSIVES, ...MORPH_PASSIVES, ...FLY_PASSIVES, ...ELDER_PASSIVES, ...REN_PASSIVES, ...SPIRIT_PASSIVES, ...PLAGUE_PASSIVES, ...SLAYER_PASSIVES, ...EATER_PASSIVES, ...MUKIN_PASSIVES, ...SAMYEOL_PASSIVES, ...AUTOMATA_PASSIVES, ...RIDER_PASSIVES, ...BOMBER_PASSIVES, ...ARTIFACTER_PASSIVES, ...PUNK_PASSIVES, ...TRACKER_PASSIVES, ...FORGOTTEN_PASSIVES, ...REMNANT_PASSIVES, ...WANDERER_PASSIVES, ...SILK_PASSIVES, ...MINER_PASSIVES, ...VOYAGER_PASSIVES, ...ZEUS_PASSIVES, ...PILGRIM_PASSIVES } as const;
export const S2_PERKS = { ...IDRA_PERKS, ...MORPH_PERKS, ...FLY_PERKS, ...ELDER_PERKS, ...REN_PERKS, ...SPIRIT_PERKS, ...PLAGUE_PERKS, ...SLAYER_PERKS, ...EATER_PERKS, ...MUKIN_PERKS, ...SAMYEOL_PERKS, ...AUTOMATA_PERKS, ...RIDER_PERKS, ...BOMBER_PERKS, ...ARTIFACTER_PERKS, ...PUNK_PERKS, ...TRACKER_PERKS, ...FORGOTTEN_PERKS, ...REMNANT_PERKS, ...WANDERER_PERKS, ...SILK_PERKS, ...MINER_PERKS, ...VOYAGER_PERKS, ...ZEUS_PERKS, ...PILGRIM_PERKS };
