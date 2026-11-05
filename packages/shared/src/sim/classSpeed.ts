// 직업마다 공격 속도 배율 (player.attackSpeedNow가 곱함 → 실제 공격 간격과 능력치 창 '공격 속도'가 늘 같게)
// 아티팩터 회로 폭주 · 잊혀진 자 강림 · 이드라 모습 · 닌자 그림자 질주 · 순례자 세계수 잎 · 이터 광분 · 펑크 신경 가속 · 학살자 분노 · 제우스 강림
import { EATER_PERKS } from "../itemsEater";
import { NINJA_PERKS } from "../itemsNinja";
import { PILGRIM_PERKS } from "../itemsPilgrim";
import { FORGOTTEN as F } from "../weaponsForgotten";
import { GAIA_FORMS, IDRA as I } from "../weaponsIdra";
import { PUNK } from "../weaponsPunk";
import { SLAYER } from "../weaponsSlayer";
import { ZEUS } from "../weaponsZeus";
import { afv } from "./afBench";
import type { PlayerState } from "./types";
import { hasPerk } from "./util";
import { slayerDmgMul } from "./slayer";
import { idraDmgMul } from "./idra";
import { eclipseDmgMul, eclipseSpeedMul } from "./eclipseStats";
import { thorkenSpeedMul } from "./thorkenKit";
import { leviaDmgMul, leviaSpeedMul } from "./leviaKit";
import { orcaSpeedMul } from "./orcaMoves";

/** 직업마다 평타 공격력 배율 (능력치 창 '공격력'에 같이 보임): 이드라 모습·사계절 · 학살자 낮은 체력·분노 */
export function classDamageMul(p: PlayerState): number {
  if (p.characterId === "idra") return idraDmgMul(p);
  if (p.characterId === "slayer") return slayerDmgMul(p);
  if (p.characterId === "eclipse") return eclipseDmgMul(p);
  if (p.characterId === "levia") return leviaDmgMul(p);
  return 1;
}

export function classSpeedMul(p: PlayerState): number {
  switch (p.characterId) {
    case "artifacter":
      return (p.afSurge ?? 0) > 0 ? afv(p, "afSurge", "speed") : 1;
    case "forgotten":
      return (p.fgGod ?? 0) > 0 ? F.godSpeed : 1;
    case "idra":
      return I.form[GAIA_FORMS[p.gForm ?? 0] ?? "bow"].speed;
    case "ninja":
      return (p.kageTicks ?? 0) > 0 ? 1 + NINJA_PERKS.shadowRush.speed : 1;
    case "pilgrim":
      return hasPerk(p, "pgWorldLeaf") && (p.pgBook?.length ?? 0) >= PILGRIM_PERKS.pgWorldLeaf.need ? PILGRIM_PERKS.pgWorldLeaf.mul : 1;
    case "eater": {
      const k = EATER_PERKS.eaFrenzy;
      return hasPerk(p, "eaFrenzy") ? 1 + Math.min(k.max, Math.floor((p.eaEaten ?? 0) / k.per) * k.speed) : 1;
    }
    case "punk":
      return (p.cyAccel ?? 0) > 0 ? PUNK.accelSpeed : 1;
    case "slayer":
      return (p.slRage ?? 0) > 0 ? SLAYER.rageSpeed : 1;
    case "eclipse":
      return eclipseSpeedMul(p);
    case "thorken":
      return thorkenSpeedMul(p);
    case "levia":
      return leviaSpeedMul(p);
    case "orca":
      return orcaSpeedMul(p);
    case "zeus":
      return p.zsGod ? ZEUS.godSpeed : 1;
    default:
      return 1;
  }
}
