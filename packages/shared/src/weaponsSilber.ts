// 실베르 무기 묶음 (content.WEAPONS에 펼쳐 넣음): 조커 카드 3 · 쉐도잉 붓 1
import { JOKER_WEAPONS } from "./weaponsJoker";
import { SHADOWING_WEAPONS } from "./weaponsShadowing";

export const SILBER_WEAPON_SET = { ...JOKER_WEAPONS, ...SHADOWING_WEAPONS };
