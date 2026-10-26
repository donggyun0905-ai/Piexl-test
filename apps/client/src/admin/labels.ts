// 관리자 페이지 글자 (운영자용이라 한국어만). 캐릭터·무기 이름은 게임 번역에서 가져옴
import { BOSS_TEXT } from "../i18n/enemies";
import { DUNGEON_BALANCE, PASSIVES, TD_BALANCE, WEAPONS, type BalanceGroupId, type BalanceSet } from "@pixel-rogue/shared";
import { autoFieldLabel, ruleCategory, ruleLabel } from "./autoLabels";
import type { SetKind } from "./adminApi";
import { itemDesc, itemName } from "../i18n/items";
import { TEXT } from "../i18n/text";

export const GROUP_LABEL: Record<BalanceGroupId, string> = {
  characters: "캐릭터",
  weapons: "무기",
  rules: "규칙·기술 수치",
  effects: "아이템 효과",
  enemies: "적",
  bosses: "보스",
  passives: "패시브",
  useItems: "사용 아이템",
  shop: "상점 가격",
  tdRules: "규칙·돈",
  tdTowers: "타워(캐릭터) 보정",
  tdEnemies: "적",
  tdBosses: "보스",
  tdRounds: "보스 라운드",
};

/** 관리자 페이지에서 고르는 수치 세트 */
export const SETS: Record<SetKind, BalanceSet> = { dungeon: DUNGEON_BALANCE, td: TD_BALANCE };

export const FIELD_LABEL: Record<string, string> = {
  maxHp: "최대 체력",
  damage: "공격력",
  moveSpeed: "이동 속도",
  luck: "행운",
  damageMul: "공격력 배율",
  attackSpeed: "초당 공격",
  range: "사거리",
  projectileSpeed: "탄 속도",
  arcCos: "휘두르는 폭 (cos)",
  blast: "폭발 범위",
  pierce: "관통 수",
  hp: "체력",
  speed: "이동 속도",
  contactDamage: "몸 피해",
  gold: "주는 돈",
  radius: "크기 (반지름)",
  shield: "방패 (깨야 하는 횟수)",
  parry: "막기 확률 (0~1)",
  // 사용 아이템
  healRatio: "회복 (1=최대 체력)",
  ticks: "시간 (틱)",
  // 패시브 효과
  heal: "회복",
  cooldown: "대기 시간 배율",
  turn: "휘는 정도",
  reach: "찾는 거리",
  stacks: "최대 중첩",
  below: "체력 기준 (비율)",
  invuln: "무적 시간 배율",
  taken: "받는 피해 배율",
  splash: "주변 피해 비율",
  every: "몇 번째 공격마다",
  push: "밀어내는 힘",
  bounces: "튕기는 횟수",
  hits: "맞힌 적 수",
  chance: "확률 (0~1)",
  mul: "배율",
  // 상점
  passive: "패시브",
  weapon: "무기",
  use: "사용 아이템 (기본)",
  potion: "회복약",
  elixir: "명약",
  reroll: "새로고침 처음",
  rerollStep: "새로고침 오르는 양",
  perFloor: "층마다 오르는 양",
  luckDiscount: "행운 1당 할인",
  maxDiscount: "최대 할인",
};

/** 패시브 능력치 변화 이름 ("maxHp.add" → "최대 체력 +") */
const MOD_LABEL: Record<string, string> = { add: "+", mul: "×" };

/** 값 이름 옆 작은 설명 */
export const FIELD_HINT: Record<string, string> = {
  damageMul: "캐릭터 공격력 × 이 값",
  range: "픽셀 (한 칸 16)",
  projectileSpeed: "픽셀/틱",
  moveSpeed: "픽셀/틱",
  speed: "픽셀/틱",
  arcCos: "0.5=앞 120도, 0=180도, -1=한 바퀴",
  blast: "픽셀, 주변은 절반 피해",
  ticks: "60틱 = 1초",
  luckDiscount: "0.05 = 5%",
};

const ENEMY_NAME: Record<string, string> = {
  crawler: "기는 적 (몸으로 부딪힘)",
  spitter: "탄 쏘는 적",
  charger: "돌진하는 적",
  mortar: "포격수",
  hulk: "강철 거구 (1·2층)",
  brood: "무리 여왕 (3·4층)",
  seer: "공허의 눈 (5·6층)",
  slime: "슬라임 (타워 디펜스)",
  runner: "도마뱀 (타워 디펜스, 빠름)",
  bat: "박쥐 (타워 디펜스, 떼)",
  beetle: "딱정벌레 (타워 디펜스, 등껍질)",
  golem: "바위 골렘 (타워 디펜스, 단단)",
  shaman: "주술사 (타워 디펜스, 주변 회복)",
  eggsac: "알주머니 (타워 디펜스, 터지면 슬라임)",
  wisp: "도깨비불 (타워 디펜스, 순간이동)",
};

const FINALS = new Set(["dragon", "godeater", "plight", "pdark"]);

/** 타워 디펜스 묶음의 항목 이름 */
function tdRowLabel(group: BalanceGroupId, id: string): string {
  const ko = (k: string) => (TEXT as Record<string, { ko: string }>)[k]?.ko ?? k;
  if (group === "tdRules") return "규칙";
  if (group === "tdTowers") return ko(id);
  if (group === "tdBosses") return `${ko(BOSS_TEXT[id] ?? id)}${FINALS.has(id) ? " (최종: 체력 그대로)" : ""}`;
  if (group === "tdRounds") return `${id.slice(1)}라운드 보스`;
  return id === "paladin" ? "성기사 (천사장이 부름)" : (ENEMY_NAME[id] ?? id).replace(" (타워 디펜스, ", " (").replace(" (타워 디펜스)", "");
}

export function rowLabel(group: BalanceGroupId, id: string): string {
  if (group.startsWith("td")) return tdRowLabel(group, id);
  if (group === "characters") return (TEXT as Record<string, { ko: string }>)[id]?.ko ?? id;
  if (group === "weapons") return itemName("weapon", id, "ko");
  if (group === "passives" || group === "effects") return itemName("passive", id, "ko");
  if (group === "rules") return ruleLabel(id);
  if (group === "useItems") return itemName("use", id, "ko");
  if (group === "shop") return "가격";
  return ENEMY_NAME[id] ?? id;
}

/** 항목 설명 (패시브·사용 아이템: 게임에 보이는 설명을 지금 수치로) */
export function rowDesc(group: BalanceGroupId, id: string): string {
  const t = (k: string) => (TEXT as Record<string, { ko: string }>)[k]?.ko ?? k;
  if (group === "passives" || group === "effects") return itemDesc("passive", id, "ko", t);
  if (group === "useItems") return itemDesc("use", id, "ko", t);
  return "";
}

/** 묶음마다 뜻이 다른 값 이름 */
const GROUP_FIELD_LABEL: Partial<Record<BalanceGroupId, Record<string, string>>> = {
  tdTowers: { damage: "공격력 배율", attackSpeed: "공격 속도 배율", range: "사거리 배율" },
  tdRounds: { hpMul: "보스 체력 배율", gap: "보스 사이 간격 (틱)" },
  tdRules: {
    lives: "목숨",
    startGold: "시작 돈",
    towerCost: "타워 값",
    towerCostStep: "타워 하나 늘 때마다 +",
    levelCost: "1→2레벨 비용",
    levelCostStep: "레벨마다 비용 +",
    levelDamage: "레벨마다 공격력 + (0.07=7%)",
    sellRate: "팔 때 돌려받는 비율",
    breakSec: "라운드 사이 (초)",
    earlyGold: "일찍 시작 1초당 돈",
    roundGold: "라운드 보상 돈",
    roundGoldStep: "라운드마다 보상 +",
    hpLinear: "적 체력 늘기 (직선)",
    hpCurve: "적 체력 늘기 (곡선)",
    minionCount: "일반 적 수 배율",
    leakMinion: "빠져나감: 일반",
    leakGolem: "빠져나감: 골렘",
    leakBoss: "빠져나감: 보스",
    finalSpeed: "최종 보스 빠르기 배율",
  },
  useItems: { damage: "피해" },
  passives: { damage: "피해 배율", speed: "속도 배율", gold: "돈 배율", hp: "체력 비율" },
};

export function fieldLabel(key: string, group?: BalanceGroupId): string {
  const own = group && GROUP_FIELD_LABEL[group]?.[key];
  if (own) return own;
  const [stat, how] = key.split(".");
  if (how && group === "passives") return `${FIELD_LABEL[stat!] ?? stat} ${MOD_LABEL[how] ?? how}`;
  return FIELD_LABEL[key] ?? autoFieldLabel(key);
}

/** 항목의 분류 (캐릭터별로 걸러 보기): 캐릭터·무기·아이템 효과는 그 캐릭터, 규칙은 표 분류 */
export function rowCategory(group: BalanceGroupId, id: string): string {
  const name = (c: string | undefined) => (c ? ((TEXT as Record<string, { ko: string } | undefined>)[c]?.ko ?? c) : "공용");
  if (group === "characters") return name(id);
  if (group === "weapons") return name((WEAPONS as Record<string, { exclusive?: string }>)[id]?.exclusive);
  if (group === "effects" || group === "passives") return name((PASSIVES as Record<string, { exclusive?: string }>)[id]?.exclusive);
  if (group === "rules") return ruleCategory(id);
  return "";
}

export function formatTime(ms: number): string {
  return new Date(ms).toLocaleString("ko-KR", { timeZone: "Asia/Seoul", hour12: false });
}
