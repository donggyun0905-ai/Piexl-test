// 관리자 '규칙 수치'·'아이템 효과'에 넣을 표 모음: 무기·아이템 파일의 대문자 수치 표(*_PERKS는 아이템 효과) + 계산 파일 수치 묶음(sim/*_RULES)
// 새 무기·아이템 파일을 만들면 여기 import 한 줄과 MODULES에 이름 하나 추가
import * as buildSetDefs from "./buildSetDefs";
import * as itemsAbandoned from "./itemsAbandoned";
import * as itemsApostle from "./itemsApostle";
import * as itemsArtifacter from "./itemsArtifacter";
import * as itemsAutomata from "./itemsAutomata";
import * as itemsBeast from "./itemsBeast";
import * as itemsBedouin from "./itemsBedouin";
import * as itemsBomber from "./itemsBomber";
import * as itemsBrawler from "./itemsBrawler";
import * as itemsChrono from "./itemsChrono";
import * as itemsDoctor from "./itemsDoctor";
import * as itemsDuck from "./itemsDuck";
import * as itemsEater from "./itemsEater";
import * as itemsElder from "./itemsElder";
import * as itemsElemental from "./itemsElemental";
import * as itemsFly from "./itemsFly";
import * as itemsGeneral from "./itemsGeneral";
import * as itemsGunner from "./itemsGunner";
import * as itemsIdra from "./itemsIdra";
import * as itemsImugi from "./itemsImugi";
import * as itemsMorph from "./itemsMorph";
import * as itemsMukin from "./itemsMukin";
import * as itemsNinja from "./itemsNinja";
import * as itemsOni from "./itemsOni";
import * as itemsPlague from "./itemsPlague";
import * as itemsPunk from "./itemsPunk";
import * as itemsRen from "./itemsRen";
import * as itemsRider from "./itemsRider";
import * as itemsSamyeol from "./itemsSamyeol";
import * as itemsScribe from "./itemsScribe";
import * as itemsSeason2 from "./itemsSeason2";
import * as itemsSlayer from "./itemsSlayer";
import * as itemsSpirit from "./itemsSpirit";
import * as itemsStar from "./itemsStar";
import * as itemsSummon from "./itemsSummon";
import * as itemsTitan from "./itemsTitan";
import * as itemsTracker from "./itemsTracker";
import * as itemsForgotten from "./itemsForgotten";
import * as itemsRemnant from "./itemsRemnant";
import * as itemsWanderer from "./itemsWanderer";
import * as itemsSilk from "./itemsSilk";
import * as weaponsAbandoned from "./weaponsAbandoned";
import * as weaponsApostle from "./weaponsApostle";
import * as weaponsArtifacter from "./weaponsArtifacter";
import * as weaponsAutomata from "./weaponsAutomata";
import * as weaponsBase from "./weaponsBase";
import * as weaponsBeast from "./weaponsBeast";
import * as weaponsBedouin from "./weaponsBedouin";
import * as weaponsBomber from "./weaponsBomber";
import * as weaponsBrawler from "./weaponsBrawler";
import * as weaponsChrono from "./weaponsChrono";
import * as weaponsDoctor from "./weaponsDoctor";
import * as weaponsDuck from "./weaponsDuck";
import * as weaponsEater from "./weaponsEater";
import * as weaponsElder from "./weaponsElder";
import * as weaponsElemental from "./weaponsElemental";
import * as weaponsEngineer from "./weaponsEngineer";
import * as weaponsFly from "./weaponsFly";
import * as weaponsGeneral from "./weaponsGeneral";
import * as weaponsGunner from "./weaponsGunner";
import * as weaponsIdra from "./weaponsIdra";
import * as weaponsImugi from "./weaponsImugi";
import * as weaponsMorph from "./weaponsMorph";
import * as weaponsMukin from "./weaponsMukin";
import * as weaponsMystic from "./weaponsMystic";
import * as weaponsNinja from "./weaponsNinja";
import * as weaponsOni from "./weaponsOni";
import * as weaponsPlague from "./weaponsPlague";
import * as weaponsPunk from "./weaponsPunk";
import * as weaponsRen from "./weaponsRen";
import * as weaponsRider from "./weaponsRider";
import * as weaponsSamyeol from "./weaponsSamyeol";
import * as weaponsScribe from "./weaponsScribe";
import * as weaponsSlayer from "./weaponsSlayer";
import * as weaponsSpirit from "./weaponsSpirit";
import * as weaponsStar from "./weaponsStar";
import * as weaponsSummon from "./weaponsSummon";
import * as weaponsTitan from "./weaponsTitan";
import * as weaponsTracker from "./weaponsTracker";
import * as weaponsForgotten from "./weaponsForgotten";
import * as weaponsRemnant from "./weaponsRemnant";
import * as weaponsWanderer from "./weaponsWanderer";
import * as weaponsSilk from "./weaponsSilk";
import * as weaponsPungryu from "./weaponsPungryu";
import * as itemsPungryu from "./itemsPungryu";
import * as weaponsLeo from "./weaponsLeo";
import * as itemsLeo from "./itemsLeo";
import * as weaponsOnyx from "./weaponsOnyx";
import * as itemsOnyx from "./itemsOnyx";
import * as weaponsFenrir from "./weaponsFenrir";
import * as itemsFenrir from "./itemsFenrir";
import * as weaponsEclipse from "./weaponsEclipse";
import * as itemsEclipse from "./itemsEclipse";
import * as weaponsThorken from "./weaponsThorken";
import * as itemsThorken from "./itemsThorken";
import * as weaponsLevia from "./weaponsLevia";
import * as itemsLevia from "./itemsLevia";
import * as weaponsTail from "./weaponsTail";
import * as itemsTail from "./itemsTail";
import * as weaponsCollector from "./weaponsCollector";
import * as itemsCollector from "./itemsCollector";
import * as itemsMiner from "./itemsMiner";
import * as weaponsMiner from "./weaponsMiner";
import * as itemsVoyager from "./itemsVoyager";
import * as weaponsVoyager from "./weaponsVoyager";
import * as itemsZeus from "./itemsZeus";
import * as weaponsZeus from "./weaponsZeus";
import * as itemsPilgrim from "./itemsPilgrim";
import * as weaponsPilgrim from "./weaponsPilgrim";
import * as itemsFallenKing from "./itemsFallenKing";
import * as itemsLux from "./itemsLux";
import * as weaponsLux from "./weaponsLux";
import * as itemsHidden from "./itemsHidden";
import * as itemsDevil from "./itemsDevil";
import * as secretDefs from "./secretDefs";
import * as swarmDefs from "./swarmDefs";
import * as taboo from "./taboo";
import * as petDefs from "./petDefs";
import * as trackerParts from "./trackerParts";
import * as terrainDefs from "./terrainDefs";
import * as weaponsFallenKing from "./weaponsFallenKing";
import * as perks from "./perks";
import * as combos from "./combos";
import { SIM_RULES } from "./sim/rulesRegistry";
import { gymFxRow } from "./sim/gymPerks";

const MODULES: Record<string, unknown>[] = [itemsAbandoned, itemsApostle, itemsArtifacter, itemsAutomata, itemsBeast, itemsBedouin, itemsBomber, itemsBrawler, itemsChrono, itemsDoctor, itemsDuck, itemsEater, itemsElder, itemsElemental, itemsFly, itemsGeneral, itemsGunner, itemsIdra, itemsImugi, itemsMorph, itemsMukin, itemsNinja, itemsOni, itemsPlague, itemsPunk, itemsRen, itemsRider, itemsSamyeol, itemsScribe, itemsSeason2, itemsSlayer, itemsSpirit, itemsStar, itemsSummon, itemsTitan, itemsTracker, itemsForgotten, itemsRemnant, itemsWanderer, itemsSilk, itemsPungryu, itemsLeo, itemsOnyx, itemsFenrir, itemsEclipse, itemsThorken, weaponsThorken, itemsLevia, weaponsLevia, itemsTail, weaponsTail, itemsCollector, weaponsCollector, weaponsAbandoned, weaponsApostle, weaponsArtifacter, weaponsAutomata, weaponsBase, weaponsBeast, weaponsBedouin, weaponsBomber, weaponsBrawler, weaponsChrono, weaponsDoctor, weaponsDuck, weaponsEater, weaponsElder, weaponsElemental, weaponsEngineer, weaponsFly, weaponsGeneral, weaponsGunner, weaponsIdra, weaponsImugi, weaponsMorph, weaponsMukin, weaponsMystic, weaponsNinja, weaponsOni, weaponsPlague, weaponsPunk, weaponsRen, weaponsRider, weaponsSamyeol, weaponsScribe, weaponsSlayer, weaponsSpirit, weaponsStar, weaponsSummon, weaponsTitan, weaponsTracker, weaponsForgotten, weaponsRemnant, weaponsWanderer, weaponsSilk, weaponsPungryu, weaponsLeo, weaponsOnyx, weaponsFenrir, weaponsEclipse, itemsMiner, weaponsMiner, itemsVoyager, weaponsVoyager, itemsZeus, weaponsZeus, itemsPilgrim, itemsFallenKing, weaponsFallenKing, itemsLux, weaponsLux, itemsHidden, itemsDevil, secretDefs, swarmDefs, taboo, petDefs, trackerParts, terrainDefs, weaponsPilgrim, perks, combos, buildSetDefs];

/** 표가 아닌 것(무기 표·패시브 표·사용 아이템·이름 목록 등)은 빼고 대문자 이름의 객체만 */
const SKIP = /_WEAPONS$|_PASSIVES$|^PASSIVES$|_USE$|_HIDDEN$|^SHOP_PRICES$|_COLORS$/;
const hasNumber = (v: unknown, d = 0): boolean =>
  typeof v === "number" || (typeof v === "object" && v !== null && d < 4 && Object.values(v).some((x) => hasNumber(x, d + 1)));

/** 적·보스 기술 수치는 적·보스 탭으로 (계산 파일 이름으로 나눔) */
const BOSS_RULE = /^BOSS/;
const ENEMY_RULE = /^(ENEMIES|MINIONS|CRITTERS|HAZARDS)_RULES$/;

function collect(): { rules: Record<string, unknown>; effects: Record<string, unknown>; boss: Record<string, unknown>; enemy: Record<string, unknown> } {
  const rules: Record<string, unknown> = {};
  const effects: Record<string, unknown> = {};
  const boss: Record<string, unknown> = {};
  const enemy: Record<string, unknown> = {};
  for (const mod of MODULES) {
    for (const [name, v] of Object.entries(mod)) {
      if (!/^[A-Z][A-Z0-9_]*$/.test(name) || SKIP.test(name) || typeof v !== "object" || v === null || Array.isArray(v) || !hasNumber(v)) continue;
      // 아이템 효과 표는 아이템 하나씩 (같은 객체를 그대로 가리켜 바꾸면 바로 게임에 들어감)
      // 단련의 방에서 강화한 효과 수치는 그 사람에게만 높게 읽힘 (sim/gymPerks)
      if (/PERKS$/.test(name)) for (const [id, row] of Object.entries(v)) effects[id] = (v as Record<string, unknown>)[id] = typeof row === "object" && row ? gymFxRow(id, row) : row;
      else rules[name] = v;
    }
  }
  for (const [name, v] of Object.entries(SIM_RULES)) (BOSS_RULE.test(name) ? boss : ENEMY_RULE.test(name) ? enemy : rules)[name] = v;
  return { rules, effects, boss, enemy };
}

export const { rules: RULE_TABLES, effects: EFFECT_TABLES, boss: BOSS_RULE_TABLES, enemy: ENEMY_RULE_TABLES } = collect();
