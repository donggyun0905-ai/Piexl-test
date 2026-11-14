// 캐릭터 선택 일러스트: 그림 주소 · 새로 얻은 캐릭터·오른 숙련도 찾기 (CharArtWatch가 CharArtReveal로 크게 보여 줌)
import { ALL_CHARACTER_IDS, CHARACTER_IDS, type CharacterId } from "@pixel-rogue/shared";
import { characterOpen } from "../characterGoals";
import { hallUnlocked } from "../lobby/exhibits";
import { ownedLimited } from "../shop/limitedChars";
import { loadAchievements } from "../records";
import { loadText, saveText } from "../storage";
import { CHAR_ART } from "./charArtList";

/** 일러스트 주소 (그림이 없으면 null) · 그림은 scripts/art/char_art.py로 넣음 */
export const charArtSrc = (c: CharacterId): string | null => (CHAR_ART.has(c) ? `${import.meta.env.BASE_URL}sprites/charArt/${c}.webp` : null);
/** 스토리 대화 초상화용 (머리·가슴, 256px) */
export const charFaceSrc = (c: string): string | null => (CHAR_ART.has(c) ? `${import.meta.env.BASE_URL}sprites/charArt/face/${c}.webp` : null);
/** 선택 창 카드용 (가운데 정사각형 400px) */
export const charCardSrc = (c: CharacterId): string | null => (CHAR_ART.has(c) ? `${import.meta.env.BASE_URL}sprites/charArt/card/${c}.webp` : null);

/** 이미 보여 준(또는 처음부터 가진) 캐릭터 기록 */
const KEY = "charArtSeen";
/** 다시 찾아보라는 신호 (칩으로 사기·뽑기 직후) */
export const CHAR_CHECK = "pr-char-check";
export const askCharCheck = (): boolean => window.dispatchEvent(new Event(CHAR_CHECK));

/** 지금 가진 캐릭터 (고를 수 있는 것: 보통 + 전시장으로 연 숨은 + 뽑은 한정) */
function ownedNow(): CharacterId[] {
  const achieved = loadAchievements();
  const extra = new Set<CharacterId>([...hallUnlocked(), ...ownedLimited()]);
  return ALL_CHARACTER_IDS.filter((c) => (CHARACTER_IDS.includes(c) || extra.has(c)) && characterOpen(c, achieved));
}

/** 새로 얻은 캐릭터 중 일러스트가 있는 것 (본 것으로 기록). 처음 한 번은 지금 가진 것을 모두 본 것으로만 적음 */
export function takeNewChars(): CharacterId[] {
  const now = ownedNow();
  const raw = loadText(KEY);
  const seen = new Set<string>(raw ? (JSON.parse(raw) as string[]) : now);
  const fresh = raw ? now.filter((c) => !seen.has(c)) : [];
  if (!raw || fresh.length) saveText(KEY, JSON.stringify([...seen, ...fresh]));
  return fresh.filter((c) => CHAR_ART.has(c));
}

/** 숙련도가 오른 캐릭터 (판을 시작할 때 오르므로 적어 두었다가 판이 끝나고 메인·선택 화면에서 보여 줌) */
const UPS = "charArtUps";
type MasteryUp = { c: CharacterId; lv: number };
export function noteMasteryUp(c: CharacterId, lv: number): void {
  if (!CHAR_ART.has(c)) return;
  const raw = loadText(UPS);
  const list = (raw ? (JSON.parse(raw) as MasteryUp[]) : []).filter((u) => u.c !== c);
  saveText(UPS, JSON.stringify([...list, { c, lv }]));
}
export function takeMasteryUps(): MasteryUp[] {
  const raw = loadText(UPS);
  if (!raw) return [];
  saveText(UPS, "[]");
  return JSON.parse(raw) as MasteryUp[];
}
