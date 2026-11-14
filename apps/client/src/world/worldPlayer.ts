// 세계 지도에서 걸어 다니는 내 캐릭터 (고른 것, 이 기기에 저장) · 투력 (낀 레이드 장신구, shared/accPower)
import { accPower, CHARACTERS, type CharacterId } from "@pixel-rogue/shared";
import { myAccTotals } from "../event/acc/accStore";
import { loadText, saveText } from "../storage";

const KEY = "worldChar";

export function loadWorldChar(): CharacterId {
  const v = loadText(KEY);
  return v && v in CHARACTERS ? (v as CharacterId) : "warden";
}
export const saveWorldChar = (c: CharacterId): void => saveText(KEY, c);

/** 지금 내 투력 */
export const myPower = (): number => accPower(myAccTotals());
