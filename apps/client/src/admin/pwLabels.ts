// 관리자 '패왕전 수치' 글자 (운영자용이라 한국어만): 묶음 이름 · 항목(캐릭터) 이름 · 스킬 값 이름 (skills.0.hit.dmg → 스킬 1 · 피해 배율)
import { TEXT } from "../i18n/text";
import { pwModeFieldLabel, pwModeRowLabel } from "./pwModeLabels";

const ko = (k: string) => (TEXT as Record<string, { ko: string } | undefined>)[k]?.ko ?? k;

export const PW_GROUP_LABEL = { pwRoles: "역할군", pwChars: "캐릭터 능력치", pwSkills: "스킬", pwItems: "사용 아이템 (패왕전 전용)",
  pwRules: "규칙",
  pwUnits: "병사·포탑·집 보스·몬스터",
  pwGrow: "쟁탈전·전쟁의 서막 (성장·증강)",
  pwCapture: "점령전",
  pwGiga: "기간토마키아",
  pwShop: "집 상점 장비",
} as const;

const CHAR_FIELD: Record<string, string> = {
  hp: "체력 배율",
  dmg: "공격력 배율",
  taken: "받는 피해 배율",
  skill: "스킬 피해 배율",
  rate: "공격 속도 배율",
  range: "사거리 배율",
  move: "이동 속도 배율",
};

const SKILL_PART: Record<string, string> = {
  cd: "재사용 대기 (초)",
  range: "사거리",
  radius: "반경·폭",
  arc: "부채꼴 반각 (라디안)",
  delay: "예고 뒤 터지기까지 (틱)",
  speed: "돌진 속도",
  heal: "회복 (최대 체력 비율)",
  "repeat.n": "반복 횟수",
  "repeat.every": "반복 간격 (틱)",
  "hit.dmg": "피해 배율",
  "hit.stun": "기절 (틱)",
  "hit.slow": "둔화 (틱)",
  "hit.root": "속박 (틱)",
  "hit.silence": "침묵 (틱)",
  "hit.push": "밀치기 (−면 끌어오기)",
  "hit.dot": "독 (틱)",
  "buff.ticks": "버프 시간 (틱)",
  "buff.dmg": "버프 공격력 배율",
  "buff.move": "버프 이동 속도 배율",
  "buff.rate": "버프 공격 속도 배율",
  "buff.taken": "버프 받는 피해 배율",
  "buff.regen": "버프 재생",
  "summon.n": "소환 수",
  "summon.ticks": "소환 시간 (틱)",
  "summon.dmg": "소환물 피해 배율",
  "summon.range": "소환물 사거리",
  "summon.every": "소환물 공격 간격 (틱)",
  "summon.hp": "소환물 체력 (내 최대 체력 비율)",
};

/** 항목 이름: 규칙 묶음은 '규칙'·'바뀐 기본 공격', 나머지는 캐릭터 이름 */
export function pwRowLabel(group: string, id: string): string {
  if (group === "pwRules") return id === "basic" ? "바뀐 기본 공격 (베두인·학살자·잔영)" : "규칙";
  return pwModeRowLabel(group, id) ?? ko(id);
}

/** 값 이름 (모르는 값은 null → 자동 이름) */
export function pwFieldLabel(group: string, key: string): string | null {
  if (group === "pwRoles") return "역할";
  if (group === "pwChars") return CHAR_FIELD[key] ?? null;
  if (group !== "pwSkills") return pwModeFieldLabel(group, key);
  if (key === "basic") return "평타 배율";
  const m = /^skills\.(\d)\.(.+)$/.exec(key);
  if (!m) return null;
  return `스킬 ${Number(m[1]) + 1}${m[1] === "3" ? "(궁극기)" : ""} · ${SKILL_PART[m[2]!] ?? m[2]}`;
}
