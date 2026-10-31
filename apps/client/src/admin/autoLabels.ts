// 자동으로 찾은 수치의 이름 (관리자 페이지): 규칙 표 이름 → 캐릭터·분류, 값 이름 → 낱말을 한국어로 바꿔 이어 붙임
import { TEXT } from "../i18n/text";

const ko = (k: string) => (TEXT as Record<string, { ko: string } | undefined>)[k]?.ko;

/** 규칙 표 이름 앞부분 → 분류 (캐릭터 이름이 아니라 계산 파일 이름일 때) */
const PREFIX: [RegExp, string][] = [
  [/^(GUN|GUNNER)/, "gunner"],
  [/^LASER/, "engineer"],
  [/^(MEDIC|HEAL)/, "doctor"],
  [/^ORBIT/, "elementalist"],
  [/^BRAWL/, "brawler"],
  [/^(BEAST|PETS|TIGER)/, "beast"],
  [/^(SHADES|NINJA)/, "ninja"],
  [/^CHRONO/, "chronomancer"],
  [/^SUMMON/, "summoner"],
  [/^TALISMAN/, "mystic"],
  [/^NOVICE/, "novice"],
  [/^ABANDONED|^TAG_SETS/, "abandoned"],
  [/^DUCK/, "duck"],
  [/^(GAIA|IDRA)/, "idra"],
  [/^MORPH/, "byeonhui"],
  [/^(FORMATIONS|ELDER)/, "elder"],
  [/^(REN)/, "ren"],
  [/^(GREAT_SPIRITS|SMALL_SPIRITS|SPIRIT)/, "spiritist"],
];

/** 계산 파일 이름 → 분류 이름 (캐릭터가 아닌 것) */
const SYSTEM: [RegExp, string][] = [
  [/^BOSS/, "보스"],
  [/^(CRITTERS|TD)/, "타워 디펜스 적"],
  [/^MINIONS/, "날벌레·가디언"],
  [/^(ENEMIES|HAZARDS)/, "적 공통"],
  [/^ENDLESS/, "무한 모드"],
  [/^(COMBAT|PROJECTILES|PLAYER|ITEMS|LOOT|ROOMS|UTIL|PARTY|HERO|ARENA)/, "게임 공통"],
];

/** 규칙 표가 어느 캐릭터 것인지 (캐릭터 id, 아니면 undefined) */
export function ruleCharId(name: string): string | undefined {
  const base = name.replace(/_RULES$/, "");
  const head = base.split("_")[0]!.toLowerCase();
  if (ko(head) && ko(`${head}Desc`)) return head;
  for (const [re, id] of PREFIX) if (re.test(base)) return id;
  return undefined;
}

/** 규칙 표 하나의 분류 (캐릭터 이름 또는 분류 이름) */
export function ruleCategory(name: string): string {
  const id = ruleCharId(name);
  if (id) return ko(id) ?? id;
  const base = name.replace(/_RULES$/, "");
  for (const [re, label] of SYSTEM) if (re.test(base)) return label;
  return "기타";
}

/** 규칙 표 이름 (분류 + 표 이름) */
export function ruleLabel(name: string): string {
  return `${ruleCategory(name)} · ${name}`;
}

const WORDS: Record<string, string> = {
  dmg: "피해", damage: "피해", mul: "배율", chance: "확률", ticks: "틱", tick: "틱", r: "반경", radius: "반경", reach: "거리", range: "사거리",
  n: "수", count: "수", every: "마다", speed: "빠르기", max: "최대", min: "최소", heal: "회복", gold: "돈", push: "밀침", stun: "기절",
  slow: "느림", blast: "폭발", hp: "체력", taken: "받는 피해", add: "더함", gap: "간격", cd: "대기", cool: "대기", cooldown: "대기",
  missile: "미사일", missiles: "미사일", doll: "인형", beam: "레이저", pulse: "펄스", fire: "불", burn: "화상", poison: "독", bleed: "출혈",
  crit: "치명타", crits: "치명타", rage: "분노", gauge: "게이지", stack: "스택", stacks: "스택", combo: "콤보", life: "흡혈", leech: "흡혈",
  shield: "보호막", armor: "방어", def: "방어", regen: "재생", width: "폭", w: "폭", len: "길이", fuse: "도화선", mine: "지뢰", bomb: "폭탄",
  art: "예술", after: "여진", trail: "자국", step: "한 틱 거리", base: "기본", extra: "추가", bonus: "추가", boss: "보스", time: "시간",
  duration: "시간", delay: "지연", arc: "부채꼴", angle: "각도", spread: "퍼짐", shots: "발 수", shot: "탄", ammo: "탄창", reload: "장전",
  wave: "파동", size: "크기", scale: "크기 배율", per: "당", hit: "맞힘", hits: "맞힘", kill: "처치", kills: "처치", accel: "가속",
  auto: "모양", ride: "모양", cyber: "모양", gun: "총", talon: "발톱", needle: "독침", maw: "그림자",
  defense: "방어력", reduction: "피해 감소", dodge: "회피", lifesteal: "흡혈", sharpness: "예리함", status: "상태이상", power: "강화", gain: "획득",
  venom: "독", sting: "독침", pct: "%", div: "나눔", corrode: "부식", swarm: "떼", cloud: "구름", rats: "쥐", rat: "쥐", gas: "가스",
  dash: "대시", move: "이동", attack: "공격", sword: "검", swing: "휘두르기", split: "갈라짐", sat: "위성", bind: "묶음", beams: "줄기 수",
};

/** 값 이름 → 읽기 쉬운 이름 ("missiles.chance" → "미사일·확률", "MISSILE_MUL" → "미사일·배율") */
export function autoFieldLabel(key: string): string {
  return key
    .split(".")
    .map((part) =>
      /^\d+$/.test(part)
        ? `${Number(part) + 1}번째`
        : part
            .replace(/([a-z])([A-Z])/g, "$1_$2")
            .split("_")
            .map((w) => WORDS[w.toLowerCase()] ?? w.toLowerCase())
            .join(" "),
    )
    .join(" · ");
}
