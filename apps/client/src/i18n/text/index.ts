// 화면 글자 (한·영·일). 새 글자는 화면에 맞는 파일에 추가 (키 이름은 전체에서 겹치면 안 됨)
import { MENU_TEXT } from "./menu";
import { GAME_TEXT } from "./game";
import { TUTORIAL_TEXT } from "./tutorial";
import { PRACTICE_TEXT } from "./practice";
import { DAILY_TEXT } from "./daily";
import { BATTLE_TEXT } from "./battle";
import { CHARACTER_TEXT } from "./characters";
import { CHARACTER_TEXT_NEW } from "./charactersNew";
import { CHARACTER_TEXT_HELIOS } from "./charactersHelios";
import { CHARACTER_TEXT_TERRA } from "./charactersTerra";
import { CHARACTER_TEXT_ASCALON } from "./charactersAscalon";
import { CHARACTER_TEXT_SECRET } from "./charactersSecret";
import { SWARM_EVO_TEXT } from "./swarmEvo";
import { RAID_TEXT } from "./raid";
import { TD_TEXT } from "./td";
import { SHOP_TEXT } from "./shop";
import { LOBBY_TEXT } from "./lobby";
import { CARDS_MULTI_TEXT } from "./cardsMulti";
import { PIXEL_TEXT } from "./pixel";
import { SUMMARY_TEXT } from "./summary";
import { COOP_TEXT } from "./coop";
import { MEDAL_TEXT } from "./medal";
import { TABOO_UI_TEXT } from "./taboo";
import { SWARM_TEXT } from "./swarm";
import { PAEWANG_TEXT } from "./paewang";
import { RANK_TEXT } from "./rank";
import { STORY_TEXT } from "./story";
import { UMBRA_TEXT } from "./umbra";

export const TEXT = {
  ...MENU_TEXT,
  ...GAME_TEXT,
  ...TUTORIAL_TEXT,
  ...PRACTICE_TEXT,
  ...DAILY_TEXT,
  ...BATTLE_TEXT,
  ...CHARACTER_TEXT,
  ...CHARACTER_TEXT_NEW,
  ...CHARACTER_TEXT_HELIOS,
  ...CHARACTER_TEXT_TERRA,
  ...CHARACTER_TEXT_ASCALON,
  ...CHARACTER_TEXT_SECRET,
  ...SWARM_EVO_TEXT,
  ...STORY_TEXT,
  ...RAID_TEXT,
  ...TD_TEXT,
  ...SHOP_TEXT,
  ...LOBBY_TEXT,
  ...CARDS_MULTI_TEXT,
  ...PIXEL_TEXT,
  ...SUMMARY_TEXT,
  ...COOP_TEXT,
  ...MEDAL_TEXT,
  ...TABOO_UI_TEXT,
  ...SWARM_TEXT,
  ...PAEWANG_TEXT,
  ...RANK_TEXT,
  ...UMBRA_TEXT,
};

/** 파일끼리 키가 겹치지 않는지 테스트에서 확인 */
export const TEXT_PARTS = [MENU_TEXT, GAME_TEXT, TUTORIAL_TEXT, PRACTICE_TEXT, DAILY_TEXT, BATTLE_TEXT, CHARACTER_TEXT, CHARACTER_TEXT_NEW, CHARACTER_TEXT_HELIOS, CHARACTER_TEXT_TERRA, CHARACTER_TEXT_ASCALON, CHARACTER_TEXT_SECRET, RAID_TEXT, TD_TEXT, SHOP_TEXT, LOBBY_TEXT, CARDS_MULTI_TEXT, PIXEL_TEXT, SUMMARY_TEXT, COOP_TEXT, MEDAL_TEXT, TABOO_UI_TEXT, SWARM_TEXT, SWARM_EVO_TEXT, STORY_TEXT, PAEWANG_TEXT, RANK_TEXT, UMBRA_TEXT];
