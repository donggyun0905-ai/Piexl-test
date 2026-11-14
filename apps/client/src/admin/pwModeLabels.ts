// 관리자 '패왕전 수치' 새 대결 탭 글자 (운영자용이라 한국어만): 병사·포탑·집 보스·몬스터 · 성장 대결 · 점령전 · 기간토마키아 · 집 상점 장비
import { PW_LEGEND, PW_SHOP_USES } from "@pixel-rogue/shared";
import { TEXT } from "../i18n/text";
import { itemName } from "../i18n/items";

const ko = (k: string) => (TEXT as Record<string, { ko: string } | undefined>)[k]?.ko ?? k;

const UNIT_NAME: Record<string, string> = {
  minion: "근접 병사",
  archer: "원거리 병사",
  tower: "포탑",
  boss: "집 보스 (집 지키는 로봇, 쟁탈전)",
  jungle: "정글 몬스터",
  elite: "안개 지역 보스 몬스터 (전쟁의 서막)",
  dragon: "파멸의 용 (전쟁의 서막 큰 보스)",
  godeater: "갓이터 (전쟁의 서막 큰 보스)",
  giantRed: "붉은 뿔 거인 (기간토마키아, 어려움)",
  giantBlue: "푸른 뿔 거인 (기간토마키아, 보통)",
  giantWhite: "흰 뿔 거인 (기간토마키아, 쉬움)",
  goblin: "도깨비 (기간토마키아)",
  wave: "병사 무리 (수·간격·강해짐)",
  etc: "공통 (찾는 거리·피해 배율·회복·귀환)",
};

const UNIT_FIELD: Record<string, string> = { hp: "체력", dmg: "공격력", every: "공격 간격 (틱, 60 = 1초)", range: "사거리", speed: "이동 속도", r: "몸 크기 (반지름)" };

const GEAR_FIELD: Record<string, string> = {
  cost: "값 (전설은 재료 말고 더 내는 돈)",
  hp: "체력 +",
  dmg: "공격력 +",
  dmgMul: "공격력 % (0.25 = 25%)",
  rate: "공격 속도 %",
  range: "사거리 +",
  rangeMul: "사거리 %",
  move: "이동 속도 %",
  shot: "투사체 속도 %",
  crit: "치명타 확률",
  critDmg: "치명타 피해 +",
  def: "방어력 +",
  regen: "재생력 +",
  dashCut: "대시 대기 줄임",
  skillDmg: "스킬 피해 %",
  skillHeal: "스킬 치유 %",
  maxLv: "최대 레벨",
};

const ROW: Record<string, string> = {
  PW_GROW: "성장 공통 (레벨·경험치·돈·집·부활) — 쟁탈전·전쟁의 서막",
  PW_CONTEST: "쟁탈전 (점령 시간)",
  PW_WAR: "전쟁의 서막 (체크포인트·큰 보스·강화)",
  PW_CAP: "점령전",
  PW_SHOP_USES: "집 상점 사용 아이템 값",
};

/** 항목 이름 (이 파일 묶음이 아니면 null) */
export function pwModeRowLabel(group: string, id: string): string | null {
  if (group === "pwUnits") return UNIT_NAME[id] ?? id;
  if (ROW[id]) return ROW[id];
  if (id.startsWith("aug_")) return `증강 · ${ko(`pwAug_${id.slice(4)}`)}`;
  if (group !== "pwShop") return null;
  if (id.startsWith("fx_")) return `${itemName("passive", id.slice(3), "ko")} · 특수 효과`;
  return `${itemName("passive", id, "ko")}${PW_LEGEND[id] ? " (전설)" : ""}`;
}

/** 값 이름 (모르는 값은 null → 설명·자동 이름) */
export function pwModeFieldLabel(group: string, key: string): string | null {
  if (group === "pwUnits") return UNIT_FIELD[key] ?? null;
  if (group !== "pwShop") return null;
  if (key.startsWith("need.")) return `재료 개수: ${itemName("passive", key.slice(5), "ko")}`;
  return GEAR_FIELD[key] ?? (key in PW_SHOP_USES ? `${itemName("use", key, "ko")} 값` : null);
}
