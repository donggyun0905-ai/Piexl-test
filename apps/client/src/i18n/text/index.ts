// 화면 글자 (한·영·일). 새 글자는 화면에 맞는 파일에 추가 (키 이름은 전체에서 겹치면 안 됨)
import { MENU_TEXT } from "./menu";
import { GAME_TEXT } from "./game";
import { TUTORIAL_TEXT } from "./tutorial";
import { PRACTICE_TEXT } from "./practice";
import { DAILY_TEXT } from "./daily";
import { STATION_TEXT } from "./station";
import { GYM_TEXT } from "./gym";
import { RUN_GUIDE_TEXT } from "./runGuide";
import { CHAR_GOAL_TEXT } from "./charGoals";
import { TRIAL_TEXT } from "./trial";
import { HIDDEN_TRIAL_TEXT } from "./hiddenTrial";
import { ALTAR_TEXT } from "./altar";
import { BUILD_SET_TEXT } from "./buildSets";
import { VAULT_TEXT } from "./vault";
import { BATTLE_TEXT } from "./battle";
import { CHARACTER_TEXT } from "./characters";
import { CHARACTER_TEXT_NEW } from "./charactersNew";
import { CHARACTER_TEXT_THALASSIA } from "./charactersThalassia";
import { CHARACTER_TEXT_THALASSIA_2 } from "./charactersThalassia2";
import { CHARACTER_TEXT_SEONGGUK } from "./charactersSeongguk";
import { CHARACTER_TEXT_IAN } from "./charactersIan";
import { CHARACTER_TEXT_GABRIEL } from "./charactersGabriel";
import { CHARACTER_TEXT_SERENA } from "./charactersSerena";
import { CHARACTER_TEXT_RAFAEL } from "./charactersRafael";
import { CHARACTER_TEXT_YURIEL } from "./charactersYuriel";
import { CHARACTER_TEXT_MICHAELA } from "./charactersMichaela";
import { CHARACTER_TEXT_BLAST } from "./charactersBlast";
import { CHARACTER_TEXT_NAILER } from "./charactersNailer";
import { CHARACTER_TEXT_SCISSORS } from "./charactersScissors";
import { CHARACTER_TEXT_HELLFIST } from "./charactersHellfist";
import { CHARACTER_TEXT_SILVER_BULLET } from "./charactersSilverBullet";
import { CHARACTER_TEXT_BLUE_FLAME } from "./charactersBlueFlame";
import { CHARACTER_TEXT_LUNATIC } from "./charactersLunatic";
import { CHARACTER_TEXT_INCISION } from "./charactersIncision";
import { CHARACTER_TEXT_CRUSADER } from "./charactersCrusader";
import { CHARACTER_TEXT_JOKER } from "./charactersJoker";
import { CHARACTER_TEXT_SHADOWING } from "./charactersShadowing";
import { CHARACTER_TEXT_PUPPETEER } from "./charactersPuppeteer";
import { CHARACTER_TEXT_RABBIT } from "./charactersRabbit";
import { CHARACTER_TEXT_BAEKRYEONG } from "./charactersBaekryeong";
import { CHARACTER_TEXT_BINGSEOL } from "./charactersBingseol";
import { CHARACTER_TEXT_BAEKINJANG } from "./charactersBaekinjang";
import { CHARACTER_TEXT_ARIA } from "./charactersAria";
import { CHARACTER_TEXT_RAVEN } from "./charactersRaven";
import { CHARACTER_TEXT_GEARS } from "./charactersGears";
import { CHARACTER_TEXT_NOIR } from "./charactersNoir";
import { NOIR_ATTACK_TEXT } from "./noirAttacks";
import { CHARACTER_TEXT_ROUGE } from "./charactersRouge";
import { ROUGE_ATTACK_TEXT } from "./rougeAttacks";
import { CHARACTER_TEXT_BLEU } from "./charactersBleu";
import { BLEU_ATTACK_TEXT } from "./bleuAttacks";
import { CHARACTER_TEXT_JAUNE } from "./charactersJaune";
import { JAUNE_ATTACK_TEXT } from "./jauneAttacks";
import { CHARACTER_TEXT_MAGENTA } from "./charactersMagenta";
import { MAGENTA_ATTACK_TEXT } from "./magentaAttacks";
import { CHARACTER_TEXT_VERT } from "./charactersVert";
import { VERT_ATTACK_TEXT } from "./vertAttacks";
import { CHARACTER_TEXT_BLANC } from "./charactersBlanc";
import { BLANC_ATTACK_TEXT } from "./blancAttacks";
import { CHARACTER_TEXT_ASURA } from "./charactersAsura";
import { CHARACTER_TEXT_HONRYEONG } from "./charactersHonryeong";
import { FACTION_TRAIT_TEXT } from "./factionTraits";
import { CHARACTER_TEXT_2 } from "./characters2";
import { SPIRIT_TEXT } from "./spiritTexts";
import { CHARACTER_TEXT_HELIOS } from "./charactersHelios";
import { CHARACTER_TEXT_TERRA } from "./charactersTerra";
import { CHARACTER_TEXT_ASCALON } from "./charactersAscalon";
import { CHARACTER_TEXT_SECRET } from "./charactersSecret";
import { SWARM_EVO_TEXT } from "./swarmEvo";
import { RAID_TEXT } from "./raid";
import { TD_TEXT } from "./td";
import { SHOP_TEXT } from "./shop";
import { LOBBY_TEXT } from "./lobby";
import { MINI_LOOK_TEXT } from "./minigamesLook";
import { CARDS_MULTI_TEXT } from "./cardsMulti";
import { PIXEL_TEXT } from "./pixel";
import { SUMMARY_TEXT } from "./summary";
import { COOP_TEXT } from "./coop";
import { MEDAL_TEXT } from "./medal";
import { TABOO_UI_TEXT } from "./taboo";
import { SWARM_TEXT } from "./swarm";
import { RAID_BOSS_TEXT } from "./raidBoss";
import { ACC_TEXT } from "./acc";
import { RAID_PREP_TEXT } from "./raidPrep";
import { PAEWANG_TEXT } from "./paewang";
import { PAEWANG_GUIDE_TEXT } from "./paewangGuide";
import { PAEWANG_MAP_TEXT } from "./paewangMaps";
import { PW_SKILL_NAMES_1 } from "./pwSkillNames1";
import { PW_SKILL_NAMES_2 } from "./pwSkillNames2";
import { PW_SKILL_UI_TEXT } from "./pwSkillUi";
import { PW_DRAFT_TEXT } from "./pwDraft";
import { PW_PRACTICE_TEXT } from "./pwPractice";
import { PW_MODES_NEW_TEXT } from "./pwModesNew";
import { PW_GROW_TEXT } from "./pwGrow";
import { PW_GROW_GEAR_TEXT } from "./pwGrowGear";
import { PW_REC_TEXT } from "./pwRec";
import { BUFF_TEXT } from "./buffs";
import { CHAR_SELECT_TEXT } from "./charSelect";
import { PW_CHANGES_TEXT } from "./pwChanges";
import { PW_PASSIVE_TEXT } from "./pwPassives";
import { RANK_TEXT } from "./rank";
import { STORY_TEXT } from "./story";
import { STORY_STAGE_TEXT } from "./storyStage";
import { WORLD_TEXT } from "./world";
import { WORLD_TOWN_TEXT } from "./worldTown";
import { WORLD_TERRA_TEXT } from "./worldTerra";
import { WORLD_VIRDIA_TEXT } from "./worldVirdia";
import { WORLD_HELIOS_TEXT } from "./worldHelios";
import { WORLD_DESERT_TEXT } from "./worldDesert";
import { TIER_TEXT } from "./tier";
import { UMBRA_TEXT } from "./umbra";

export const TEXT = {
  ...MENU_TEXT,
  ...GAME_TEXT,
  ...TUTORIAL_TEXT,
  ...PRACTICE_TEXT,
  ...DAILY_TEXT,
  ...STATION_TEXT,
  ...GYM_TEXT,
  ...RUN_GUIDE_TEXT,
  ...CHAR_GOAL_TEXT,
  ...TRIAL_TEXT,
  ...HIDDEN_TRIAL_TEXT,
  ...ALTAR_TEXT,
  ...BUILD_SET_TEXT,
  ...VAULT_TEXT,
  ...BATTLE_TEXT,
  ...CHARACTER_TEXT,
  ...CHARACTER_TEXT_NEW,
  ...CHARACTER_TEXT_THALASSIA,
  ...CHARACTER_TEXT_THALASSIA_2,
  ...CHARACTER_TEXT_SEONGGUK,
  ...CHARACTER_TEXT_IAN,
  ...CHARACTER_TEXT_GABRIEL,
  ...CHARACTER_TEXT_SERENA,
  ...CHARACTER_TEXT_RAFAEL,
  ...CHARACTER_TEXT_YURIEL,
  ...CHARACTER_TEXT_MICHAELA,
  ...CHARACTER_TEXT_BLAST,
  ...CHARACTER_TEXT_NAILER,
  ...CHARACTER_TEXT_SCISSORS,
  ...CHARACTER_TEXT_HELLFIST,
  ...CHARACTER_TEXT_SILVER_BULLET,
  ...CHARACTER_TEXT_BLUE_FLAME,
  ...CHARACTER_TEXT_LUNATIC,
  ...CHARACTER_TEXT_INCISION,
  ...CHARACTER_TEXT_CRUSADER,
  ...CHARACTER_TEXT_JOKER,
  ...CHARACTER_TEXT_SHADOWING,
  ...CHARACTER_TEXT_PUPPETEER,
  ...CHARACTER_TEXT_RABBIT,
  ...CHARACTER_TEXT_BAEKRYEONG,
  ...CHARACTER_TEXT_BINGSEOL,
  ...CHARACTER_TEXT_ASURA,
  ...CHARACTER_TEXT_BAEKINJANG,
  ...CHARACTER_TEXT_ARIA,
  ...CHARACTER_TEXT_RAVEN,
  ...CHARACTER_TEXT_GEARS,
  ...CHARACTER_TEXT_NOIR,
  ...NOIR_ATTACK_TEXT,
  ...CHARACTER_TEXT_ROUGE,
  ...ROUGE_ATTACK_TEXT,
  ...CHARACTER_TEXT_BLEU,
  ...BLEU_ATTACK_TEXT,
  ...CHARACTER_TEXT_JAUNE,
  ...CHARACTER_TEXT_MAGENTA,
  ...CHARACTER_TEXT_VERT,
  ...CHARACTER_TEXT_BLANC,
  ...JAUNE_ATTACK_TEXT,
  ...MAGENTA_ATTACK_TEXT,
  ...VERT_ATTACK_TEXT,
  ...BLANC_ATTACK_TEXT,
  ...CHARACTER_TEXT_HONRYEONG,
  ...FACTION_TRAIT_TEXT,
  ...CHARACTER_TEXT_2,
  ...SPIRIT_TEXT,
  ...CHARACTER_TEXT_HELIOS,
  ...CHARACTER_TEXT_TERRA,
  ...CHARACTER_TEXT_ASCALON,
  ...CHARACTER_TEXT_SECRET,
  ...SWARM_EVO_TEXT,
  ...STORY_TEXT,
  ...STORY_STAGE_TEXT,
  ...WORLD_TEXT,
  ...WORLD_TOWN_TEXT,
  ...WORLD_TERRA_TEXT,
  ...WORLD_VIRDIA_TEXT,
  ...WORLD_HELIOS_TEXT,
  ...WORLD_DESERT_TEXT,
  ...TIER_TEXT,
  ...RAID_TEXT,
  ...TD_TEXT,
  ...SHOP_TEXT,
  ...LOBBY_TEXT,
  ...MINI_LOOK_TEXT,
  ...CARDS_MULTI_TEXT,
  ...PIXEL_TEXT,
  ...SUMMARY_TEXT,
  ...COOP_TEXT,
  ...MEDAL_TEXT,
  ...TABOO_UI_TEXT,
  ...SWARM_TEXT,
  ...RAID_BOSS_TEXT,
  ...ACC_TEXT,
  ...RAID_PREP_TEXT,
  ...PAEWANG_TEXT,
  ...PAEWANG_GUIDE_TEXT,
  ...PAEWANG_MAP_TEXT,
  ...PW_SKILL_NAMES_1,
  ...PW_SKILL_NAMES_2,
  ...PW_SKILL_UI_TEXT,
  ...PW_DRAFT_TEXT,
  ...PW_PRACTICE_TEXT,
  ...PW_MODES_NEW_TEXT,
  ...PW_GROW_TEXT,
  ...PW_GROW_GEAR_TEXT,
  ...PW_REC_TEXT,
  ...BUFF_TEXT,
  ...CHAR_SELECT_TEXT,
  ...PW_CHANGES_TEXT,
  ...PW_PASSIVE_TEXT,
  ...RANK_TEXT,
  ...UMBRA_TEXT,
};

/** 파일끼리 키가 겹치지 않는지 테스트에서 확인 */
export const TEXT_PARTS = [MENU_TEXT, GAME_TEXT, TUTORIAL_TEXT, PRACTICE_TEXT, DAILY_TEXT, STATION_TEXT, GYM_TEXT, RUN_GUIDE_TEXT, CHAR_GOAL_TEXT, TRIAL_TEXT, HIDDEN_TRIAL_TEXT, ALTAR_TEXT, BUILD_SET_TEXT, VAULT_TEXT, BATTLE_TEXT, CHARACTER_TEXT, CHARACTER_TEXT_NEW, CHARACTER_TEXT_THALASSIA, CHARACTER_TEXT_THALASSIA_2, CHARACTER_TEXT_SEONGGUK, CHARACTER_TEXT_IAN, CHARACTER_TEXT_GABRIEL, CHARACTER_TEXT_SERENA, CHARACTER_TEXT_RAFAEL, CHARACTER_TEXT_YURIEL, CHARACTER_TEXT_MICHAELA, CHARACTER_TEXT_BLAST, CHARACTER_TEXT_NAILER, CHARACTER_TEXT_SCISSORS, CHARACTER_TEXT_HELLFIST, CHARACTER_TEXT_SILVER_BULLET, CHARACTER_TEXT_BLUE_FLAME, CHARACTER_TEXT_LUNATIC, CHARACTER_TEXT_INCISION, CHARACTER_TEXT_CRUSADER, CHARACTER_TEXT_JOKER, CHARACTER_TEXT_SHADOWING, CHARACTER_TEXT_PUPPETEER, CHARACTER_TEXT_RABBIT, CHARACTER_TEXT_BAEKRYEONG, CHARACTER_TEXT_BINGSEOL, CHARACTER_TEXT_ASURA, CHARACTER_TEXT_BAEKINJANG, CHARACTER_TEXT_ARIA, CHARACTER_TEXT_RAVEN, CHARACTER_TEXT_GEARS, CHARACTER_TEXT_NOIR, NOIR_ATTACK_TEXT, CHARACTER_TEXT_ROUGE, ROUGE_ATTACK_TEXT, CHARACTER_TEXT_BLEU, BLEU_ATTACK_TEXT, CHARACTER_TEXT_JAUNE, JAUNE_ATTACK_TEXT, CHARACTER_TEXT_MAGENTA, MAGENTA_ATTACK_TEXT, CHARACTER_TEXT_VERT, CHARACTER_TEXT_BLANC, VERT_ATTACK_TEXT, BLANC_ATTACK_TEXT, CHARACTER_TEXT_HONRYEONG, FACTION_TRAIT_TEXT, CHARACTER_TEXT_2, SPIRIT_TEXT, CHARACTER_TEXT_HELIOS, CHARACTER_TEXT_TERRA, CHARACTER_TEXT_ASCALON, CHARACTER_TEXT_SECRET, RAID_TEXT, TD_TEXT, SHOP_TEXT, LOBBY_TEXT, MINI_LOOK_TEXT, CARDS_MULTI_TEXT, PIXEL_TEXT, SUMMARY_TEXT, COOP_TEXT, MEDAL_TEXT, TABOO_UI_TEXT, SWARM_TEXT, RAID_BOSS_TEXT, ACC_TEXT, RAID_PREP_TEXT, SWARM_EVO_TEXT, STORY_TEXT, STORY_STAGE_TEXT, WORLD_TEXT, WORLD_TOWN_TEXT, WORLD_TERRA_TEXT, WORLD_VIRDIA_TEXT, WORLD_HELIOS_TEXT, WORLD_DESERT_TEXT, TIER_TEXT, PAEWANG_TEXT, PAEWANG_GUIDE_TEXT, PAEWANG_MAP_TEXT, PW_SKILL_NAMES_1, PW_SKILL_NAMES_2, PW_SKILL_UI_TEXT, PW_DRAFT_TEXT, PW_PRACTICE_TEXT, PW_MODES_NEW_TEXT, PW_GROW_TEXT, PW_GROW_GEAR_TEXT, PW_REC_TEXT, BUFF_TEXT, CHAR_SELECT_TEXT, PW_CHANGES_TEXT, PW_PASSIVE_TEXT, RANK_TEXT, UMBRA_TEXT];
