// 리바이어 전용 아이템 20개: 캐릭터(창·콤보) 10 · 고래 10. 효과는 sim/levia·leviaWhale. 수치는 LEVIA_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "levia" as const, effect: true as const });

export const LEVIA_PASSIVES = {
  // ── 캐릭터 10 ──
  /** 물마루: 1타 휘두르기가 더 넓음 */
  lvCrest: P("lvCrest"),
  /** 나선 물결: 3타 한 바퀴 휘두르기 피해·범위 + */
  lvSpiral: P("lvSpiral"),
  /** 쇄파: 4타 충격파 피해 + · 부채꼴이 넓어짐 */
  lvBreaker: P("lvBreaker"),
  /** 파도타기: 4타 돌진이 멀리 가고 그동안 무적 */
  lvSurf: P("lvSurf"),
  /** 역류: 3타 고래 대돌격이 더 크고 멀리 감 */
  lvCurrent: P("lvCurrent"),
  /** 닻 없는 배: 대시한 뒤 다음 공격이 곧바로 4타 돌진 (콤보 건너뛰기) */
  lvAnchorless: P("lvAnchorless", [{ stat: "moveSpeed", add: 0.08 }]),
  /** 소금 바람: 4타를 끝낼 때마다 체력 회복 */
  lvSalt: P("lvSalt"),
  /** 소라 갑옷: 최대 체력 + · 받는 피해 줄어듦 */
  lvShell: P("lvShell", [{ stat: "maxHp", add: 25 }]),
  /** 해방의 깃발: 체력이 많을 때 피해 + */
  lvFlag: P("lvFlag"),
  /** 물보라 창끝: 1타 때 앞으로 물살 두 줄기 */
  lvSpray: P("lvSpray"),
  // ── 고래 10 ──
  /** 고래의 부름: 고래가 더 잘 나옴 */
  lvCall: P("lvCall"),
  /** 심해의 노래: 고래가 나오면 둘레 적이 잠깐 멈춤 */
  lvSong: P("lvSong"),
  /** 아기 고래: 고래가 나오면 아기 고래가 가까운 적에게 돌진 */
  lvCalf: P("lvCalf"),
  /** 물뿜기: 고래가 나오면 내 자리에 물기둥 (둘레 피해 + 회복) */
  lvBlowhole: P("lvBlowhole"),
  /** 고래수염: 고래 피해 + */
  lvBaleen: P("lvBaleen"),
  /** 고래 무리: 고래 대돌격 +1마리 */
  lvPod: P("lvPod"),
  /** 흰 고래: 고래가 나올 때마다 이번 판 고래 확률이 조금씩 오름 */
  lvWhite: P("lvWhite"),
  /** 용연향: 고래가 한 번에 여럿을 맞히면 잠깐 콤보가 빨라짐 */
  lvAmber: P("lvAmber"),
  /** 심해 압력: 고래에 맞은 적이 느려짐 */
  lvDeep: P("lvDeep"),
  /** 바다의 왕: 고래가 더 커짐 (모든 고래 범위 +) */
  lvKingWhale: P("lvKingWhale"),
} as const satisfies Record<string, PassiveDef>;

/** 리바이어 아이템 수치 */
export const LEVIA_PERKS = {
  /** 물마루: 1타 거리 배율 */
  lvCrest: { reach: 1.35 },
  /** 나선 물결: 3타 회전 피해 배율 · 거리 배율 */
  lvSpiral: { mul: 1.5, reach: 1.25 },
  /** 쇄파: 충격파 피해 배율 · 부채꼴(cos) */
  lvBreaker: { mul: 1.4, arc: 0 },
  /** 파도타기: 돌진 거리 배율 */
  lvSurf: { rush: 1.4 },
  /** 역류: 대돌격 거리 배율 · 크기 배율 */
  lvCurrent: { range: 1.35, r: 1.35 },
  /** 닻 없는 배: 대시 뒤 4타로 이어지는 틱 */
  lvAnchorless: { ticks: 60 },
  /** 소금 바람: 회복 (최대 체력 비율) */
  lvSalt: { heal: 0.02 },
  /** 소라 갑옷: 받는 피해 배율 */
  lvShell: { taken: 0.92 },
  /** 해방의 깃발: 체력이 이 비율 이상이면 · 피해 배율 */
  lvFlag: { hp: 0.7, mul: 1.15 },
  /** 물보라 창끝: 물살 수 · 사이 각도 · 피해 배율 · 거리 */
  lvSpray: { n: 2, spread: 0.3, mul: 0.6, range: 120 },
  /** 고래의 부름: 고래 확률 + */
  lvCall: { chance: 0.12 },
  /** 심해의 노래: 반지름 · 기절 틱 */
  lvSong: { r: 70, stun: 30 },
  /** 아기 고래: 몸 크기 · 피해 배율 · 거리 */
  lvCalf: { r: 7, mul: 1, range: 160 },
  /** 물뿜기: 반지름 · 피해 배율 · 회복 (최대 체력 비율) */
  lvBlowhole: { r: 40, mul: 1, heal: 0.01 },
  /** 고래수염: 고래 피해 배율 */
  lvBaleen: { mul: 1.35 },
  /** 고래 무리: 더 나오는 고래 · 사이 각도 */
  lvPod: { n: 1, spread: 0.32 },
  /** 흰 고래: 나올 때마다 확률 + · 최대 */
  lvWhite: { step: 0.01, max: 0.15 },
  /** 용연향: 이만큼 이상 맞히면 · 빨라지는 틱 · 공격 속도 배율 */
  lvAmber: { need: 3, ticks: 180, speed: 1.25 },
  /** 심해 압력: 느려짐 틱 */
  lvDeep: { slow: 90 },
  /** 바다의 왕: 고래 크기 배율 */
  lvKingWhale: { size: 1.3 },
};
