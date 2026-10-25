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
import type { RunState } from "./types";

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
};
