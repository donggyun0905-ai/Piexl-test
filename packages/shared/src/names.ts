// 닉네임·채팅 금칙어 필터 (화면·서버 공용). 목록은 기본만 넣어 둠 → 이용자가 늘면 보강
const BANNED = [
  // 한국어
  "시발", "씨발", "씨바", "ㅅㅂ", "ㅆㅂ", "병신", "ㅂㅅ", "개새", "새끼", "좆", "존나", "지랄", "닥쳐", "미친놈", "미친년", "엠창", "니애미", "느금",
  // 영어
  "fuck", "shit", "bitch", "cunt", "dick", "pussy", "asshole", "nigger", "nigga", "faggot", "retard", "whore", "slut",
  // 일본어
  "死ね", "しね", "殺す", "ころす", "くたばれ", "ちんこ", "まんこ", "きちがい", "ガイジ",
];

/** 비교용: 소문자, 공백·기호 없앰 (사이에 끼운 글자로 피해 가는 것을 조금 막음) */
function squash(text: string): string {
  return text.toLowerCase().replace(/[\s._\-*~!@#$%^&()+=|\\/,'"`0-9]/g, "");
}

export function hasBannedWord(text: string): boolean {
  const s = squash(text);
  return BANNED.some((w) => s.includes(w));
}

export const DEFAULT_NICKNAME = "Player";
export const NICKNAME_MAX = 12;

/** 닉네임 정리: 앞뒤 공백·제어 문자 제거, 길이 제한, 금칙어면 기본 이름 */
export function cleanNickname(text: string): string {
  // eslint-disable-next-line no-control-regex
  const t = text.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, NICKNAME_MAX);
  if (!t || hasBannedWord(t)) return DEFAULT_NICKNAME;
  return t;
}

/** 채팅 정리: 길이 제한, 금칙어가 있으면 그 부분을 *로 */
export function cleanChat(text: string, max = 80): string {
  // eslint-disable-next-line no-control-regex
  let t = text.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, max);
  for (const w of BANNED) {
    const re = new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    t = t.replace(re, "*".repeat(w.length));
  }
  if (hasBannedWord(t)) return "***";
  return t;
}
