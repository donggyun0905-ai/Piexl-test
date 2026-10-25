// 시즌 2 캐릭터 탄이 적에게 맞았을 때 (projectiles에서 탄 모양으로 나눔)
import { gaiaArrowHit } from "./idra";
import { morphShotHit } from "./morph";
import { slayerOnHit } from "./slayer";
import { eaterOnHit } from "./eater";
import { needleHit } from "./samyeol";
import { rocketHit } from "./bomber";
import { repulsorHit } from "./artifacter";
import { punkShotHit } from "./punk";
import type { EnemyState, ProjectileState, RunState } from "./types";

export function s2Hit(s: RunState, pr: ProjectileState, e: EnemyState): void {
  if (pr.spirit === "gaiaArrow") gaiaArrowHit(s, e);
  else if (pr.spirit === "slBlade" || pr.spirit === "slThrow") slayerOnHit(s, e, pr.damage);
  else if (pr.spirit === "eaBlade") eaterOnHit(s, e);
  else if (pr.spirit === "smNeedle") needleHit(s, pr, e);
  else if (pr.spirit === "bmRocket") rocketHit(s, pr, e);
  else if (pr.spirit === "afBlast") repulsorHit(s, pr, e);
  else if (pr.spirit === "cyBullet") punkShotHit(s, pr, e);
  else if (pr.spirit === "eagleFeather" || pr.spirit === "venomSpit" || pr.spirit === "web" || pr.spirit === "phoenixFire" || pr.spirit === "batling") morphShotHit(s, pr, e);
}
