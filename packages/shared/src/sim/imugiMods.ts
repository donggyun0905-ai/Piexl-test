// 이무기 몸 강화 (sim/items.recalcStats에서 더함): 오라(콤보 72 이상) · 용이 된 몸(콤보 108 뒤 8초, 오라보다 강함)
import { IMUGI_PERKS as K } from "../itemsImugi";
import type { StatMod } from "../stats";
import { IMUGI } from "../weaponsImugi";
import type { PlayerState } from "./types";
import { hasPerk } from "./util";

/** 보호막을 채움: upTo까지만 (다른 보호막 위에 더 쌓지 않음). 실제로 늘어난 양 */
export function raiseShield(p: PlayerState, add: number, upTo: number): number {
  const cur = p.shieldPts ?? 0;
  const next = Math.max(cur, Math.min(upTo, cur + add));
  p.shieldPts = next;
  return next - cur;
}

export function imugiMods(p: PlayerState): StatMod[] {
  if (p.characterId !== "imugi") return [];
  // 화룡점정: 여의주를 물고 있으면 번개가 빨라짐 (여의주는 콤보가 없으니 오라·용과 따로)
  if (p.weaponId === "dragonPearl") return hasPerk(p, "dragonEye") ? [{ stat: "attackSpeed", mul: K.dragonEye.speed }] : [];
  const rage = hasPerk(p, "dragonRage") ? K.dragonRage.damage : 1;
  if ((p.imForm ?? 0) > 0) {
    const f = IMUGI.form;
    return [
      { stat: "damage", mul: f.damage * rage },
      { stat: "maxHp", add: f.hp },
      { stat: "moveSpeed", add: f.move },
      { stat: "attackSpeed", mul: f.speed },
    ];
  }
  if ((p.imCombo ?? 0) < IMUGI.aura) return [];
  return [
    { stat: "damage", mul: IMUGI.auraDamage * rage },
    { stat: "maxHp", add: IMUGI.auraHp },
    { stat: "moveSpeed", add: IMUGI.auraMove },
    { stat: "attackSpeed", mul: IMUGI.auraSpeed },
  ];
}

/** 용을 부른 수만큼 쌓인 영구 치명타 확률 (최대 72%, novice.rollCrit에서 씀) */
export function imugiCrit(p: PlayerState): number {
  return p.characterId === "imugi" ? Math.min(IMUGI.wakeCritMax, IMUGI.wakeCrit * (p.imWakes ?? 0)) : 0;
}
