// 로그 버프 창에 보여 줄 값 (BuffPanel): 캐릭터·아이템의 '남은 틱' 상태 중 버프(좋은 효과)·적이 건 상태이상(빨강)·다시 쓰기까지(대기) · 막대 길이는 처음 본 값(가장 큰 값) 기준
import type { PlayerState } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";

type Kind = "buff" | "debuff" | "cd";
/** [상태 이름, 글자 키, 버프/상태이상/대기] */
const TABLE: readonly [string, TextKey, Kind][] = [
  ["lureTicks", "dbCharm", "debuff"],
  ["poison", "dbPoison", "debuff"],
  ["corrode", "dbHealCut", "debuff"],
  ["dbBleed", "dbBleed", "debuff"],
  ["dbRot", "dbRot", "debuff"],
  ["dbCurse", "dbCurse", "debuff"],
  ["dbFear", "dbFear", "debuff"],
  ["dbStun", "dbStun", "debuff"],
  ["dbRoot", "dbRoot", "debuff"],
  ["dbSlow", "dbSlow", "debuff"],
  ["dbBurn", "dbBurn", "debuff"],
  ["venomTicks", "dbVenom", "debuff"],
  ["doomTicks", "dbDoom", "debuff"],
  ["shieldTicks", "bfShield", "buff"],
  ["hasteTicks", "bfHaste", "buff"],
  ["streakTicks", "bfStreak", "buff"],
  ["ambushTicks", "bfAmbush", "buff"],
  ["counterTicks", "bfCounter", "buff"],
  ["frenzyTicks", "bfFrenzy", "buff"],
  ["roarTicks", "bfRoar", "buff"],
  ["tigerTicks", "bfTiger", "buff"],
  ["warCryTicks", "bfWarCry", "buff"],
  ["gShieldTicks", "bfGShield", "buff"],
  ["mercShieldTicks", "bfMercShield", "buff"],
  ["boostTicks", "bfBoost", "buff"],
  ["gownTicks", "bfGown", "buff"],
  ["kageTicks", "bfKage", "buff"],
  ["rushTicks", "bfRush", "buff"],
  ["buffTicks", "bfStrong", "buff"],
  ["guardTicks", "bfGuard", "buff"],
  ["lashTicks", "bfLash", "buff"],
  ["abBuff", "bfTrio", "buff"],
  ["dashCooldown", "bfDashCd", "cd"],
  ["petCd", "bfPetCd", "cd"],
  ["wireCd", "bfWireCd", "cd"],
  ["oSpiritCd", "bfSpiritCd", "cd"],
  ["overheatTicks", "bfOverheat", "cd"],
];

export interface BuffRow {
  key: TextKey;
  kind: Kind;
  /** 남은 초 · 막대 비율 (0~1) */
  sec: number;
  ratio: number;
}

/** 지금 켜진 버프·대기 (max: 상태마다 본 값 중 가장 큰 값, 새로 켜지면 다시 잼) */
export function buffRows(p: PlayerState, max: Map<string, number>): BuffRow[] {
  const out: BuffRow[] = [];
  for (const [field, key, kind] of TABLE) {
    // 끌려감은 세이렌 매혹일 때만 (어둠의 블랙홀은 lureId가 있음)
    const v = field === "lureTicks" && p.lureId !== undefined ? 0 : (p as unknown as Record<string, unknown>)[field];
    if (typeof v !== "number" || v <= 0) {
      max.delete(field);
      continue;
    }
    const m = Math.max(v, max.get(field) ?? 0);
    max.set(field, m);
    out.push({ key, kind, sec: Math.ceil(v / 60), ratio: v / m });
  }
  return out;
}
