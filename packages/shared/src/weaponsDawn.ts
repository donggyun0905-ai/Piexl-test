// 새벽의 성흔(악마 사냥꾼) 무기 모음 + 공용 성흔 게이지 수치 (content가 커서 나눔 · 이름이 _WEAPONS로 끝나지 않게). 새벽의 성흔 캐릭터는 모두 성흔 게이지 (네일러는 스킬 넷도)
import { BLAST_WEAPONS } from "./weaponsBlast";
import { NAILER_WEAPONS } from "./weaponsNailer";
import { SCISSORS_WEAPONS } from "./weaponsScissors";
import { HELLFIST_WEAPONS } from "./weaponsHellfist";
import { SILVER_BULLET_WEAPONS } from "./weaponsSilverBullet";
import { BLUE_FLAME_WEAPONS } from "./weaponsBlueFlame";
import { LUNATIC_WEAPONS } from "./weaponsLunatic";
import { INCISION_WEAPONS } from "./weaponsIncision";
import { CRUSADER_WEAPONS } from "./weaponsCrusader";

export const DAWN_WEAPON_SET = { ...BLAST_WEAPONS, ...NAILER_WEAPONS, ...SCISSORS_WEAPONS, ...HELLFIST_WEAPONS, ...SILVER_BULLET_WEAPONS, ...BLUE_FLAME_WEAPONS, ...LUNATIC_WEAPONS, ...INCISION_WEAPONS, ...CRUSADER_WEAPONS };

/** 성흔(달빛의 힘) 게이지 공용 수치: 맞히면 참 → 가득 차면 자동으로 달빛 각성 → 끝나면 0부터 (차는 양은 캐릭터마다) */
export const STIGMA = {
  /** 게이지 최대 */
  max: 100,
  /** 달빛 각성 틱 */
  awakeTicks: 360,
};
