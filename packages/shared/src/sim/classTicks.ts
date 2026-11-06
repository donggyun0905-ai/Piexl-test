// 직업 무기마다 틱 처리 (player에서 공격 종류로 골라 부름). 누르고 있는 동안(연속 공격·모으기·게이지)도 매 틱
import type { WeaponKind } from "../content";
import { abandonedTick } from "./abandoned";
import { apostleTick } from "./apostle";
import { beastTick } from "./beast";
import { bedouinTick } from "./bedouin";
import { comboTick } from "./brawl";
import { chronoTick } from "./chrono";
import { duckTick } from "./duck";
import { generalTick } from "./general";
import { gunTick } from "./gun";
import { imugiTick } from "./imugi";
import { ninjaTick } from "./ninja";
import { starTick } from "./star";
import { summonTick } from "./summon";
import { titanTick } from "./titan";
import { oniTick } from "./oni";
import { scribeTick } from "./scribe";
import { idraTick } from "./idra";
import { morphTick } from "./morph";
import { flyTick } from "./fly";
import { elderTick } from "./elder";
import { renTick } from "./ren";
import { spiritTick } from "./spirit";
import { plagueTick } from "./plague";
import { slayerTick } from "./slayer";
import { eaterTick } from "./eater";
import { mukinTick } from "./mukin";
import { samyeolTick } from "./samyeol";
import { automataTick } from "./automata";
import { riderTick } from "./rider";
import { bomberTick } from "./bomber";
import { artifacterTick } from "./artifacter";
import { punkTick } from "./punk";
import { trackerTick } from "./tracker";
import { forgottenTick } from "./forgotten";
import { remnantTick } from "./remnant";
import { wandererTick } from "./wanderer";
import { silkTick } from "./silk";
import { pungryuTick } from "./pungryu";
import { thorkenTick } from "./thorken";
import { leviaTick } from "./levia";
import { tailTick } from "./tail";
import { madQueenTick } from "./madQueen";
import { hookTick } from "./hook";
import { orcaTick } from "./orca";
import { waveTick } from "./wave";
import { miryuTick } from "./miryu";
import { beatriceTick } from "./beatrice";
import { leoTick } from "./leo";
import { onyxTick } from "./onyx";
import { fenrirTick } from "./fenrir";
import { eclipseTick } from "./eclipse";
import { collectorTick } from "./collector";
import { minerTick } from "./miner";
import { voyagerTick } from "./voyager";
import { zeusTick } from "./zeus";
import { pilgrimTick } from "./pgHero";
import { kingTick } from "./kingBlade";
import { luxTick } from "./lux";
import type { RunState } from "./types";

export { pwBasicTick } from "./pwBasic";
export { kingTick } from "./kingBlade";

type ClassTick = (s: RunState, want: boolean, speed: number) => void;

export const CLASS_TICKS: Partial<Record<WeaponKind, ClassTick>> = {
  combo: comboTick,
  gun: gunTick,
  beast: beastTick,
  shade: ninjaTick,
  chrono: chronoTick,
  summon: summonTick,
  chakram: bedouinTick,
  spear: generalTick,
  dragon: imugiTick,
  cross: apostleTick,
  star: starTick,
  quack: duckTick,
  tag: abandonedTick,
  titan: titanTick,
  club: oniTick,
  quill: scribeTick,
  gaia: idraTick,
  morph: morphTick,
  talon: flyTick,
  formation: elderTick,
  earthwood: renTick,
  pact: spiritTick,
  pest: plagueTick,
  scythe: slayerTick,
  maw: eaterTick,
  ram: mukinTick,
  needle: samyeolTick,
  automaton: automataTick,
  ride: riderTick,
  bomb: bomberTick,
  repulse: artifacterTick,
  cyber: punkTick,
  snipe: trackerTick,
  light: forgottenTick,
  phantom: remnantTick,
  katana: wandererTick,
  thread: silkTick,
  script: pungryuTick,
  anchor: thorkenTick,
  whale: leviaTick,
  shark: tailTick,
  fleet: madQueenTick,
  grapple: hookTick,
  riptide: orcaTick,
  muse: waveTick,
  flowblade: miryuTick,
  judgment: beatriceTick,
  lion: leoTick,
  gem: onyxTick,
  fang: fenrirTick,
  solar: eclipseTick,
  hoard: collectorTick,
  pick: minerTick,
  fate: voyagerTick,
  thunder: zeusTick,
  curio: pilgrimTick,
  zwei: kingTick,
  radiant: luxTick,
};
