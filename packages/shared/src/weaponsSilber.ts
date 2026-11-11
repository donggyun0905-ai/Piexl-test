// 실베르 무기 묶음 (content.WEAPONS에 펼쳐 넣음): 조커 카드 3 · 쉐도잉 붓 1 · 인형술사 손 1 · 래빗 망치 1 · 백령 대태도 1 · 빙설 얼음 칼날 10
import { JOKER_WEAPONS } from "./weaponsJoker";
import { SHADOWING_WEAPONS } from "./weaponsShadowing";
import { PUPPET_WEAPONS } from "./weaponsPuppet";
import { RABBIT_WEAPONS } from "./weaponsRabbit";
import { BAEK_WEAPONS } from "./weaponsBaekryeong";
import { BINGSEOL_WEAPONS } from "./weaponsBingseol";

export const SILBER_WEAPON_SET = { ...JOKER_WEAPONS, ...SHADOWING_WEAPONS, ...PUPPET_WEAPONS, ...RABBIT_WEAPONS, ...BAEK_WEAPONS, ...BINGSEOL_WEAPONS };
