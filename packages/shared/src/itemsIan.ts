// 이안 전용 아이템 20개: 기록·속박 5 · 암살·급소 5 · 실 5 · 인과·스킬 5. 효과는 sim/ian·ianSkills·ianKit. 수치는 IAN_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "ian" as const, effect: true as const });

export const IAN_PASSIVES = {
  // ── 기록·속박 ──
  /** 깃펜 촉: 기록이 쌓일 때 가끔 하나 더 */
  iaQuill: P("iaQuill"),
  /** 두꺼운 장부: 속박이 더 오래 감 */
  iaLedger: P("iaLedger", [{ stat: "maxHp", add: 10 }]),
  /** 조항: 속박된 적이 받는 피해가 더 늘어남 */
  iaClause: P("iaClause", [{ stat: "damage", add: 1 }]),
  /** 연쇄 조문: 적이 속박될 때 둘레 적에게도 기록 */
  iaChain: P("iaChain"),
  /** 봉인 낙관: 속박된 적을 쓰러뜨리면 둘레 적에게 기록 */
  iaSeal: P("iaSeal"),
  // ── 암살·급소 ──
  /** 급소 해부도: 급소 피해가 더 셈 */
  iaVital: P("iaVital", [{ stat: "damage", add: 1 }]),
  /** 침묵의 서약: 한동안 맞지 않으면 다음 공격이 급소 */
  iaSilence: P("iaSilence", [{ stat: "moveSpeed", add: 0.05 }]),
  /** 그림자 잉크: 그림자 걸음이 더 멀리, 대기가 짧음 */
  iaShadow: P("iaShadow", [{ stat: "moveSpeed", add: 0.05 }]),
  /** 바늘 끝: 펜 찌르기가 더 길고 셈 */
  iaNeedle: P("iaNeedle", [{ stat: "range", add: 5 }]),
  /** 마지막 문장: 급소로 체력이 조금 남은 적을 바로 끝냄 (보스 제외) */
  iaReaper: P("iaReaper"),
  // ── 실 ──
  /** 강철 실타래: 인과의 실이 더 넓고 셈 */
  iaSteel: P("iaSteel", [{ stat: "damage", add: 1 }]),
  /** 엮음: 인과의 실이 기록을 더 쌓음 */
  iaWeave: P("iaWeave"),
  /** 올가미: 3타 실 휘감기가 더 넓고 세게 끌어당김 */
  iaSnare: P("iaSnare", [{ stat: "range", add: 5 }]),
  /** 실패: 인과의 실이 세 갈래 */
  iaSpool: P("iaSpool"),
  /** 매듭: 기록 집행 뒤에도 기록이 절반 남음 */
  iaKnot: P("iaKnot"),
  // ── 인과·스킬 ──
  /** 메아리 각주: 기록 집행 피해가 더 셈 */
  iaEcho: P("iaEcho", [{ stat: "damage", add: 1 }]),
  /** 인과의 무게: 인과율 속박이 더 오래 가고 더 많이 되돌림 */
  iaLaw: P("iaLaw"),
  /** 절대 조문: 인과율 속박 대기가 짧아짐 */
  iaAbsolute: P("iaAbsolute", [{ stat: "maxHp", add: 5 }]),
  /** 침묵의 기도: 모든 스킬 대기가 짧아짐 */
  iaVerse: P("iaVerse", [{ stat: "attackSpeed", add: 0.05 }]),
  /** 신의 부름: 적을 쓰러뜨릴 때마다 모든 스킬 대기가 줄어듦 */
  iaCall: P("iaCall", [{ stat: "attackSpeed", add: 0.05 }]),
} as const satisfies Record<string, PassiveDef>;

/** 전용 아이템 수치 (배율 1 = 100%, 시간은 틱) */
export const IAN_PERKS = {
  /** 깃펜 촉: 기록 하나 더 쌓일 확률 */
  iaQuill: { chance: 0.3 },
  /** 두꺼운 장부: 속박 시간 배율 */
  iaLedger: { mul: 1.5 },
  /** 조항: 속박된 적이 받는 피해 더함 (원래 값 대신) */
  iaClause: { taken: 0.4 },
  /** 연쇄 조문: 둘레 반지름 · 더하는 기록 */
  iaChain: { r: 70, rec: 1 },
  /** 봉인 낙관: 둘레 반지름 · 더하는 기록 */
  iaSeal: { r: 80, rec: 2 },
  /** 급소 해부도: 급소 피해 배율 (원래 값 대신) */
  iaVital: { mul: 2.4 },
  /** 침묵의 서약: 맞지 않고 지나야 하는 틱 */
  iaSilence: { ticks: 180 },
  /** 그림자 잉크: 돌진 거리 배율 · 대기 배율 */
  iaShadow: { dash: 1.3, cd: 0.7 },
  /** 바늘 끝: 찌르기 길이 배율 · 피해 배율 */
  iaNeedle: { len: 1.35, mul: 1.2 },
  /** 마지막 문장: 남은 체력 비율 기준 */
  iaReaper: { below: 0.15 },
  /** 강철 실타래: 폭 배율 · 피해 배율 */
  iaSteel: { width: 1.5, mul: 1.5 },
  /** 엮음: 인과의 실이 더하는 기록 (원래 값 대신) */
  iaWeave: { rec: 3 },
  /** 올가미: 닿는 거리 배율 · 끌어당김 배율 */
  iaSnare: { r: 1.3, pull: 1.6 },
  /** 실패: 갈래 사이 각(라디안) */
  iaSpool: { spread: 0.3 },
  /** 매듭: 집행 뒤 남는 기록 비율 */
  iaKnot: { keep: 0.5 },
  /** 메아리 각주: 기록 하나마다 피해 배율 (원래 값 대신) */
  iaEcho: { mul: 0.7 },
  /** 인과의 무게: 유지 틱 더함 · 되돌리는 몫 (원래 값 대신) */
  iaLaw: { more: 120, debt: 0.6 },
  /** 절대 조문: 인과율 속박 대기 (틱) */
  iaAbsolute: { cd: 1800 },
  /** 침묵의 기도: 스킬 대기 배율 */
  iaVerse: { cd: 0.85 },
  /** 신의 부름: 쓰러뜨릴 때마다 줄어드는 대기 (틱) */
  iaCall: { cut: 12 },
};
