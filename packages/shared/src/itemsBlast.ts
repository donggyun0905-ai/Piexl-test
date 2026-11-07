// 블래스트 전용 아이템 20개: 화력 5 · 폭멸 5 · 성흔 5 · 사냥꾼 5. 효과는 sim/blast. 수치는 BLAST_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "blast" as const, effect: true as const });

export const BLAST_PASSIVES = {
  // ── 화력 ──
  /** 대형 벅샷: 산탄 피해 증가 */
  blBuckshot: P("blBuckshot", [{ stat: "damage", add: 1 }]),
  /** 슬러그탄: 초근접 피해 증가 */
  blSlug: P("blSlug", [{ stat: "damage", add: 1 }]),
  /** 조임 총열: 산탄이 더 멀리 닿음 */
  blChoke: P("blChoke", [{ stat: "range", add: 10 }]),
  /** 용의 숨결탄: 맞은 적이 불탐 */
  blDragon: P("blDragon", [{ stat: "maxHp", add: 10 }]),
  /** 찢는 탄: 초근접으로 맞은 적이 피를 흘림 */
  blShred: P("blShred", [{ stat: "attackSpeed", add: 0.05 }]),
  // ── 폭멸 ──
  /** 폭멸의 화약: 폭멸 피해 증가 */
  blGore: P("blGore", [{ stat: "damage", add: 1 }]),
  /** 연쇄 폭멸: 폭멸 범위 증가 · 폭멸로 처치해도 다시 폭멸 */
  blChain: P("blChain", [{ stat: "luck", add: 1 }]),
  /** 반동 강화: 초근접으로 더 크게 밀치고 잠깐 멈춤 */
  blRecoil: P("blRecoil", [{ stat: "maxHp", add: 10 }]),
  /** 넓은 산탄: 부채꼴이 넓어짐 */
  blSpread: P("blSpread", [{ stat: "range", add: 10 }]),
  /** 빠른 장전: 한 발씩 장전이 빨라짐 */
  blPump: P("blPump", [{ stat: "attackSpeed", add: 0.05 }]),
  // ── 성흔 ──
  /** 달빛 탄피: 성흔이 더 빨리 참 */
  blMoonlight: P("blMoonlight", [{ stat: "luck", add: 1 }]),
  /** 보름달: 달빛 각성이 더 오래 감 */
  blFull: P("blFull", [{ stat: "maxHp", add: 10 }]),
  /** 사냥꾼의 표식: 처치할 때 성흔이 더 많이 참 */
  blHunter: P("blHunter", [{ stat: "moveSpeed", add: 0.1 }]),
  /** 달무리: 각성하는 순간 달빛 폭발이 더 크고 셈 */
  blHalo: P("blHalo", [{ stat: "damage", add: 1 }]),
  /** 월광 산탄: 각성 중 피해 더 증가 · 달빛 산탄 더 많이 */
  blLunar: P("blLunar", [{ stat: "damage", add: 1 }]),
  // ── 사냥꾼 ──
  /** 피의 사냥: 초근접으로 처치하면 체력 회복 */
  blBlood: P("blBlood", [{ stat: "maxHp", add: 10 }]),
  /** 은탄: 보스에게 더 셈 */
  blSilver: P("blSilver", [{ stat: "damage", add: 1 }]),
  /** 섬광탄: 초근접으로 맞은 적이 느려짐 */
  blFlare: P("blFlare", [{ stat: "moveSpeed", add: 0.1 }]),
  /** 남은 달빛: 각성이 끝나도 성흔이 조금 남음 */
  blRemain: P("blRemain", [{ stat: "luck", add: 1 }]),
  /** 끝없는 밤: 각성 중 처치하면 각성이 늘어남 */
  blNight: P("blNight", [{ stat: "attackSpeed", add: 0.05 }]),
} as const satisfies Record<string, PassiveDef>;

/** 전용 아이템 수치 (배율 1 = 100%, 시간은 틱) */
export const BLAST_PERKS = {
  /** 대형 벅샷: 산탄 피해 배율 */
  blBuckshot: { mul: 1.2 },
  /** 슬러그탄: 초근접 피해 배율 */
  blSlug: { mul: 1.35 },
  /** 조임 총열: 거리 배율 */
  blChoke: { reach: 1.3 },
  /** 용의 숨결탄: 화상 (공격력 대비) */
  blDragon: { burn: 0.3 },
  /** 찢는 탄: 출혈 피해 (그 한 발 피해 대비) */
  blShred: { mul: 0.25 },
  /** 폭멸의 화약: 폭멸 피해 배율 */
  blGore: { mul: 1.6 },
  /** 연쇄 폭멸: 폭멸 반지름 배율 */
  blChain: { r: 1.5 },
  /** 반동 강화: 밀침 배율 · 멈춤 틱 */
  blRecoil: { push: 1.6, stun: 30 },
  /** 넓은 산탄: 부채꼴 cos (작을수록 넓음) */
  blSpread: { arc: 0.42 },
  /** 빠른 장전: 장전 틱 배율 */
  blPump: { load: 0.7 },
  /** 달빛 탄피: 차는 양 배율 */
  blMoonlight: { gain: 1.3 },
  /** 보름달: 각성 틱 더함 */
  blFull: { more: 120 },
  /** 사냥꾼의 표식: 처치할 때 차는 양 배율 */
  blHunter: { kill: 2 },
  /** 달무리: 각성 폭발 반지름·피해 배율 */
  blHalo: { r: 1.4, mul: 2 },
  /** 월광 산탄: 각성 중 피해 배율 더함 · 달빛 산탄 더함 */
  blLunar: { mul: 0.25, more: 2 },
  /** 피의 사냥: 초근접 처치 회복 (최대 체력 대비) */
  blBlood: { heal: 0.03 },
  /** 은탄: 보스 피해 배율 */
  blSilver: { mul: 1.25 },
  /** 섬광탄: 느려짐 틱 */
  blFlare: { slow: 60 },
  /** 남은 달빛: 각성이 끝난 뒤 남는 성흔 (최대 대비) */
  blRemain: { keep: 0.3 },
  /** 끝없는 밤: 각성 중 처치마다 되돌리는 틱 (처음 각성 시간보다 길어지지는 않음) */
  blNight: { more: 20 },
};
