// 성국 캐릭터 무기 모음 (content가 커서 나눔 · 이름이 _WEAPONS로 끝나지 않게: ids.test가 표마다 겹침을 봄): 베아트리스 · 이안 · 가브리엘 · 세레나 · 라파엘 · 유리엘
import { BEATRICE_WEAPONS } from "./weaponsBeatrice";
import { GABRIEL_WEAPONS } from "./weaponsGabriel";
import { IAN_WEAPONS } from "./weaponsIan";
import { RAFAEL_WEAPONS } from "./weaponsRafael";
import { SERENA_WEAPONS } from "./weaponsSerena";
import { YURIEL_WEAPONS } from "./weaponsYuriel";

export const SEONGGUK_WEAPON_SET = { ...BEATRICE_WEAPONS, ...IAN_WEAPONS, ...GABRIEL_WEAPONS, ...SERENA_WEAPONS, ...RAFAEL_WEAPONS, ...YURIEL_WEAPONS };
