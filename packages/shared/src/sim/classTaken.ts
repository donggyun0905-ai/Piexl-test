// 직업마다 받는 피해 배율 · 맞았을 때 반응 (combat.damagePlayer에서 한 번에)
import { afflict, foeTakenMul } from "./foeStatus";
import type { EnemyKind } from "../content";
import { abandonedTaken } from "./abandoned";
import { zeusHurt, zeusTaken } from "./zeusPower";
import { pilgrimHurt, pilgrimTaken } from "./pgBag";
import { fallenKingTaken } from "./fallenKing";
import { elderTaken } from "./elder";
import { spiritTaken } from "./spiritGreat";
import { idraHurt, idraTaken } from "./idra";
import { morphTaken } from "./morph";
import { oniTaken } from "./oniRules";
import { titanTaken } from "./titan";
import { petTaken } from "./lobbyPet";
import { plagueTaken } from "./plague";
import { eaterTaken } from "./eater";
import { mukinHurt, mukinTaken } from "./mukin";
import { samyeolTaken } from "./samyeol";
import { automataTaken } from "./automata";
import { riderTaken } from "./rider";
import { bomberTaken } from "./bomber";
import { artifacterTaken } from "./artifacter";
import { punkTaken } from "./punk";
import { slayerTaken } from "./slayer";
import { forgottenHurt, forgottenTaken } from "./forgotten";
import { silkTaken } from "./silk";
import { disguise } from "./pungHooks";
import { thorkenTaken } from "./thorkenKit";
import { leviaTaken } from "./leviaKit";
import { tailTaken } from "./tailKit";
import { madQueenTaken } from "./madQueenKit";
import { hookTaken } from "./hookShot";
import { orcaTaken } from "./orcaMoves";
import { leoTaken } from "./leoPerks";
import { onyxHurt, onyxTaken } from "./onyx";
export { cloudEnv } from "./pungHooks";
import type { RunState } from "./types";

/** 버려진 자들 막기·맏이의 방패 · 거인(탱커·장갑판·방벽·자이로) · 오니 · 이드라 방패 · 변희 동물 · 장로 결계 · 정령사 아이언하이드 · 역병의사 가면 · 이터 그림자 몸 · 묵인 방어력(적어도 1). 받는 피해를 돌려줌 */
export function classTaken(s: RunState, taken: number): number {
  const p = s.player;
  idraHurt(s);
  return disguise(s, mukinTaken(p, taken * eaterTaken(p) * samyeolTaken(p) * automataTaken(p) * riderTaken(p) * bomberTaken(p) * artifacterTaken(p) * punkTaken(p) * forgottenTaken(p) * silkTaken(p) * slayerTaken(p) * abandonedTaken(p) * titanTaken(p) * oniTaken(p) * idraTaken(p) * morphTaken(p, !!s.pvp) * elderTaken(p) * spiritTaken(p) * plagueTaken(p) * petTaken(s) * zeusTaken(p) * pilgrimTaken(p) * fallenKingTaken(p) * leoTaken(s) * onyxTaken(p) * thorkenTaken(p) * leviaTaken(p) * tailTaken(p) * madQueenTaken(p) * hookTaken(p) * orcaTaken(p) * foeTakenMul(p)));
}

/** 맞은 뒤 무적: 용 염옥·갓이터 패링 궁극기 동안은 없음 · 묵인은 아주 짧게 · 때린 적의 상태이상 (foeStatus) */
export function afterHurt(s: RunState, from?: EnemyKind): void {
  afflict(s, from);
  if (s.enemies.some((e) => e.ultAt !== undefined && (e.kind === "dragon" || e.kind === "godeater"))) s.player.invulnTicks = 0;
  mukinHurt(s);
  onyxHurt(s);
  forgottenHurt(s);
  zeusHurt(s);
  pilgrimHurt(s);
}
