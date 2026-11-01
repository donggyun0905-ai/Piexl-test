// 계산 파일마다 있는 수치 묶음 모음 (관리자 페이지 '규칙 수치'). 자동으로 만든 목록: 파일에 *_RULES를 더하면 여기에도 한 줄
import { ABANDONED_KIDS_RULES } from "./abandonedKids";
import { ABANDONED_SHOW_RULES } from "./abandonedShow";
import { ARENA_RULES } from "./arena";
import { ORIGIN_RULES } from "./origin";
import { AF_BENCH_RULES } from "./afBench";
import { PILGRIM_RULES } from "./pilgrim";
import { ALLY_RULES } from "./allies";
import { KING_FORM_RULES } from "./kingForm";
import { KING_BLADE_RULES } from "./kingBlade";
import { BASE_STATS_RULES } from "./baseStats";
import { BEAST_RULES } from "./beast";
import { BEAST_ULTS_RULES } from "./beastUlts";
import { BOSS_ANGEL_RULES } from "./bossAngel";
import { BOSS_BINDS_RULES } from "./bossBinds";
import { BOSS_BLADES_RULES } from "./bossBlades";
import { BOSS_CAGE_RULES } from "./bossCage";
import { BOSS_DARK_RULES } from "./bossDark";
import { BOSS_DEMIGOD_RULES } from "./bossDemigod";
import { BOSS_SAGE_RULES } from "./bossSage";
import { SAGE_BODY_RULES } from "./sageBody";
import { SAGE_KIT_RULES } from "./sageKit";
import { SAGE_STAFF_RULES } from "./sageStaff";
import { SAGE_CLOUD_RULES } from "./sageCloud";
import { DEMIGOD_ULTS_RULES } from "./demigodUlts";
import { BOSS_DRAGON_RULES } from "./bossDragon";
import { BOSS_GRIP_RULES } from "./bossGrip";
import { BOSS_HADES_RULES } from "./bossHades";
import { BOSS_LIGHT_RULES } from "./bossLight";
import { BOSS_PRIMEVAL_RULES } from "./bossPrimeval";
import { BOSS_ROC_RULES } from "./bossRoc";
import { BOSS_SCORPION_RULES } from "./bossScorpion";
import { BOSS_ULTS_RULES } from "./bossUlts";
import { BOSS_UMBRA_RULES } from "./bossUmbra";
import { BOSS_WAVES_RULES } from "./bossWaves";
import { BOSS_WORM_RULES } from "./bossWorm";
import { BOSS_ZONES_RULES } from "./bossZones";
import { BOSSES_ONE_RULES } from "./bossesOne";
import { BOSSES_THREE_RULES } from "./bossesThree";
import { BOSSES_TWO_RULES } from "./bossesTwo";
import { BRAWL_RULES } from "./brawl";
import { BRAWL_MOVES_RULES } from "./brawlMoves";
import { BRAWL_STAR_RULES } from "./brawlStar";
import { CHRONO_RULES } from "./chrono";
import { RUNE_RULES } from "./rune";
import { MORPH_XP_RULES } from "./morphXp";
import { COMBAT_RULES } from "./combat";
import { CRITTERS_RULES } from "./critters";
import { STALKERS_RULES } from "./stalkers";
import { BOSS_TOAD_RULES } from "./bossToad";
import { BOSS_SALAMANDER_RULES } from "./bossSalamander";
import { BOSS_JELLY_RULES } from "./bossJelly";
import { BOSS_CAPTAIN_RULES } from "./bossCaptain";
import { DUCKLINGS_RULES } from "./ducklings";
import { ENEMIES_RULES } from "./enemies";
import { GUN_RULES } from "./gun";
import { GUN_EXTRAS_RULES } from "./gunExtras";
import { HAZARDS_RULES } from "./hazards";
import { HEAL_RULES } from "./heal";
import { HERO_RULES } from "./hero";
import { ENDLESS_RULES } from "./endless";
import { ITEMS_RULES } from "./items";
import { LASER_RULES } from "./laser";
import { LASER_GEAR_RULES } from "./laserGear";
import { LASER_WEAPONS_RULES } from "./laserWeapons";
import { LOOT_RULES } from "./loot";
import { MEDIC_GEAR_RULES } from "./medicGear";
import { MEDIC_WEAPONS_RULES } from "./medicWeapons";
import { MINIONS_RULES } from "./minions";
import { NINJA_RULES } from "./ninja";
import { NOVICE_RULES } from "./novice";
import { ORBIT_RULES } from "./orbit";
import { ORBIT_ATTACK_RULES } from "./orbitAttack";
import { ORBIT_BLADES_RULES } from "./orbitBlades";
import { ORBIT_ELEMENTS_RULES } from "./orbitElements";
import { ORBIT_PERKS_RULES } from "./orbitPerks";
import { PARTY_RULES } from "./party";
import { PETS_RULES } from "./pets";
import { PLAYER_RULES } from "./player";
import { PROJECTILES_RULES } from "./projectiles";
import { ROOMS_RULES } from "./rooms";
import { SHADES_RULES } from "./shades";
import { SUMMONS_RULES } from "./summons";
import { STATUS_RULES } from "./status";
import { FOE_STATUS_RULES } from "./foeStatus";
import { ALLY_MOVE_RULES } from "./allyMove";
import { ELITE_RULES } from "./elite";
import { GYM_RULES } from "./gym";
import { TALISMAN_RULES } from "./talisman";
import { TD_RULES } from "./td";
import { TD_WAVES_RULES } from "./tdWaves";
import { UTIL_RULES } from "./util";
import { WORM_ULT_RULES } from "./wormUlt";

export const SIM_RULES: Record<string, Record<string, number>> = {
  ABANDONED_KIDS_RULES,
  ABANDONED_SHOW_RULES,
  ARENA_RULES,
  ORIGIN_RULES,
  AF_BENCH_RULES,
  PILGRIM_RULES,
  ALLY_RULES,
  KING_FORM_RULES,
  KING_BLADE_RULES,
  BASE_STATS_RULES,
  BEAST_RULES,
  BEAST_ULTS_RULES,
  BOSS_ANGEL_RULES,
  BOSS_BINDS_RULES,
  BOSS_BLADES_RULES,
  BOSS_CAGE_RULES,
  BOSS_DARK_RULES,
  BOSS_DEMIGOD_RULES,
  BOSS_SAGE_RULES,
  SAGE_BODY_RULES,
  SAGE_KIT_RULES,
  SAGE_STAFF_RULES,
  SAGE_CLOUD_RULES,
  DEMIGOD_ULTS_RULES,
  BOSS_DRAGON_RULES,
  BOSS_GRIP_RULES,
  BOSS_HADES_RULES,
  BOSS_LIGHT_RULES,
  BOSS_PRIMEVAL_RULES,
  BOSS_ROC_RULES,
  BOSS_SCORPION_RULES,
  BOSS_ULTS_RULES,
  BOSS_UMBRA_RULES,
  BOSS_WAVES_RULES,
  BOSS_WORM_RULES,
  BOSS_ZONES_RULES,
  BOSSES_ONE_RULES,
  BOSSES_THREE_RULES,
  BOSSES_TWO_RULES,
  BRAWL_RULES,
  BRAWL_MOVES_RULES,
  BRAWL_STAR_RULES,
  CHRONO_RULES,
  RUNE_RULES,
  MORPH_XP_RULES,
  COMBAT_RULES,
  CRITTERS_RULES,
  STALKERS_RULES,
  BOSS_TOAD_RULES,
  BOSS_SALAMANDER_RULES,
  BOSS_JELLY_RULES,
  BOSS_CAPTAIN_RULES,
  DUCKLINGS_RULES,
  ENEMIES_RULES,
  GUN_RULES,
  GUN_EXTRAS_RULES,
  HAZARDS_RULES,
  HEAL_RULES,
  HERO_RULES,
  ENDLESS_RULES,
  ITEMS_RULES,
  LASER_RULES,
  LASER_GEAR_RULES,
  LASER_WEAPONS_RULES,
  LOOT_RULES,
  MEDIC_GEAR_RULES,
  MEDIC_WEAPONS_RULES,
  MINIONS_RULES,
  NINJA_RULES,
  NOVICE_RULES,
  ORBIT_RULES,
  ORBIT_ATTACK_RULES,
  ORBIT_BLADES_RULES,
  ORBIT_ELEMENTS_RULES,
  ORBIT_PERKS_RULES,
  PARTY_RULES,
  PETS_RULES,
  PLAYER_RULES,
  PROJECTILES_RULES,
  ROOMS_RULES,
  SHADES_RULES,
  SUMMONS_RULES,
  STATUS_RULES,
  FOE_STATUS_RULES,
  ALLY_MOVE_RULES,
  ELITE_RULES,
  GYM_RULES,
  TALISMAN_RULES,
  TD_RULES,
  TD_WAVES_RULES,
  UTIL_RULES,
  WORM_ULT_RULES,
};
