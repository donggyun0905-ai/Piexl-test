// 직업마다 이동 속도 배율 모음 (player 이동에서 한 번에 곱함)
import { brawlMoveMul } from "./brawl";
import { flyMoveMul } from "./fly";
import { gunMoveMul } from "./gun";
import { medicMoveMul } from "./heal";
import { orbitMoveMul } from "./orbit";
import { punkMoveMul } from "./punk";
import { riderMoveMul } from "./rider";
import { slayerMoveMul } from "./slayer";
import { voyagerMoveMul } from "./voyager";
import type { PlayerState } from "./types";
import { PW } from "../paewangDefs";
export { classDamageMul, classSpeedMul } from "./classSpeed";

export function classMoveMul(p: PlayerState, tick: number): number {
  return orbitMoveMul(p) * brawlMoveMul(p) * medicMoveMul(p) * gunMoveMul(p, tick) * flyMoveMul(p) * slayerMoveMul(p) * riderMoveMul(p) * punkMoveMul(p) * voyagerMoveMul(p) * ((p.pwFast ?? 0) > 0 ? PW.orbMove : 1);
}
export { foeHeld, foeMoveMul, foeNoAttack } from "./foeStatus";
export { trialMoveMul } from "./trialFoes";
