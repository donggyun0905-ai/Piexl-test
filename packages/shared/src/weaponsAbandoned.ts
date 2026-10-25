// 버려진 자들 전용 무기: 한 캐릭터 안의 세 아이 P1(방패·초록)·P2(총·빨강)·P3(검·파랑). 대시 버튼 = 탭(다음 아이로 교대)
// 무기마다 세 아이의 콤보 기술 · 탭 조합 순서(3단계) · 단계마다 특수기가 통째로 바뀜. 공격 속도는 오르지 않음 (무기 값 그대로). 계산은 sim/abandoned·abandonedMoves
import type { WeaponDef } from "./content";

/**
 * 방패: bash 방패 치기(앞 부채꼴, 밀침) · charge 방패 돌진(앞으로 나가며 선 위 적 기절) · slam 내려찍기(둘레, 기절) · wall 방패 벽(넓은 앞 반원, 크게 밀침) · guard 막기(잠깐 받는 피해 크게 줄고 앞을 침)
 * 총: shot 한 발 · burst 세 발 · spray 다섯 발 부채꼴 · pierce 관통탄 · grenade 수류탄(떨어진 곳 폭발) · snipe 저격(아주 길고 센 관통)
 * 검: slash 베기 · thrust 찌르기 · spin 한 바퀴 · wave 검기 · cross X자 베기 · dash 돌진 베기
 */
export type TagMoveKind = "bash" | "charge" | "slam" | "wall" | "guard" | "shot" | "burst" | "spray" | "pierce" | "grenade" | "snipe" | "slash" | "thrust" | "spin" | "wave" | "cross" | "dash";

export interface TagMove {
  kind: TagMoveKind;
  mul: number;
}

/**
 * 특수기 (P3 차례가 조합대로 끝나면 곁에서 싸우던 두 아이가 펼치는 연출 공격, sim/abandonedShow)
 * 1단계 암살: shadow 그림자 질주(투명해져 적을 가로지르며 여러 번 베고 X자로 마무리) · blink 그림자 베기(적 뒤로 순간이동하며 하나씩 벰)
 * 2단계 총의 춤: kata 건 카타(총 쥔 아이가 돌며 나선으로 쏨, 방패가 곁을 지킴) · waltz 탄환 왈츠(둘이 적 둘레를 돌며 안쪽으로 쏨)
 * 3단계 방패 일격: meteor 하늘 찍기(방패 아이가 높이 뛰어 내리찍음) · pinball 맞받아치기(밀치고 뒤에서 다시 밀쳐 돌려보낸 뒤 위에서 찍음)
 * alt: 무기마다 바뀌는 점 (shadow 질주 늘어남 · blink 베기 늘어남 · kata 수류탄 · waltz 관통탄 · meteor 세 군데 · pinball 두 번 왕복)
 */
export type TagSpecialKind = "shadow" | "blink" | "kata" | "waltz" | "meteor" | "pinball";

export interface TagSpecial {
  kind: TagSpecialKind;
  mul: number;
  alt?: boolean;
}

/** 무기 하나의 조합: 세 아이의 콤보 · 3단계 조합(단계마다 P1·P2·P3가 칠 횟수, 사이에 탭) · 단계마다 특수기 */
export interface TagSet {
  moves: readonly [readonly TagMove[], readonly TagMove[], readonly TagMove[]];
  stages: readonly [readonly [number, number, number], readonly [number, number, number], readonly [number, number, number]];
  specials: readonly [TagSpecial, TagSpecial, TagSpecial];
}

const m = (kind: TagMoveKind, mul = 1): TagMove => ({ kind, mul });
const sp = (kind: TagSpecialKind, mul: number, alt = false): TagSpecial => (alt ? { kind, mul, alt } : { kind, mul });

export const TAG_SETS: Record<string, TagSet> = {
  /** 골목 삼남매 (처음 무기): 1 / 탭 / 1+2 / 탭 / 1 ★ · 탭 / 2 / 탭 / 3 / 탭 / 2 ★ · 탭 / 3 / 탭 / 4+5 / 탭 / 3 ★ */
  street: {
    moves: [[m("bash"), m("bash", 1.1), m("slam", 1.4)], [m("shot", 0.6), m("shot", 0.6), m("shot", 0.7), m("shot", 0.7), m("burst", 1.2)], [m("slash"), m("slash", 1.1), m("spin", 1.5)]],
    stages: [[1, 2, 1], [1, 1, 1], [1, 2, 1]],
    specials: [sp("shadow", 3), sp("kata", 3.5), sp("meteor", 5)],
  },
  /** 고철 방패: 방패가 길고 묵직 */
  scrap: {
    moves: [[m("bash"), m("charge", 1.2), m("bash", 1.1), m("slam", 1.6)], [m("burst"), m("burst", 1.1), m("grenade", 1.4)], [m("thrust"), m("slash", 1.1), m("wave", 1.3)]],
    stages: [[2, 1, 1], [1, 1, 1], [1, 1, 1]],
    specials: [sp("shadow", 3.5), sp("waltz", 3), sp("meteor", 5, true)],
  },
  /** 쌍권총: 총 여섯 번 */
  twin: {
    moves: [[m("bash"), m("bash"), m("wall", 1.3)], [m("shot", 0.6), m("shot", 0.6), m("burst"), m("shot", 0.7), m("shot", 0.7), m("spray", 1.4)], [m("slash"), m("thrust", 1.1), m("cross", 1.4)]],
    stages: [[1, 3, 1], [1, 1, 1], [1, 2, 1]],
    specials: [sp("blink", 3), sp("kata", 3.5), sp("pinball", 5)],
  },
  /** 옥상 저격: 총은 적게, 멀리 세게 */
  sniper: {
    moves: [[m("guard"), m("bash", 1.1), m("slam", 1.3)], [m("pierce", 1.1), m("pierce", 1.2), m("snipe", 2.2)], [m("thrust"), m("thrust", 1.1), m("dash", 1.3), m("cross", 1.5)]],
    stages: [[1, 1, 1], [1, 1, 2], [1, 1, 1]],
    specials: [sp("shadow", 3.5, true), sp("waltz", 4, true), sp("meteor", 5.5)],
  },
  /** 부러진 칼: 검이 다섯 번 */
  broken: {
    moves: [[m("bash"), m("charge", 1.1), m("slam", 1.3)], [m("shot", 0.7), m("burst"), m("shot", 0.7), m("burst", 1.1)], [m("slash"), m("slash"), m("thrust", 1.1), m("spin", 1.3), m("wave", 1.6)]],
    stages: [[1, 2, 2], [1, 1, 1], [1, 1, 2]],
    specials: [sp("blink", 3, true), sp("kata", 3.5), sp("pinball", 5.5)],
  },
  /** 쇠파이프: 방패 다섯 번, 전부 지진 */
  pipe: {
    moves: [[m("bash"), m("bash"), m("charge", 1.2), m("bash", 1.1), m("slam", 1.7)], [m("shot", 0.8), m("burst"), m("grenade", 1.3)], [m("slash"), m("slash", 1.1), m("spin", 1.4)]],
    stages: [[2, 1, 1], [1, 1, 1], [2, 1, 1]],
    specials: [sp("shadow", 3.5), sp("waltz", 4), sp("meteor", 5, true)],
  },
  /** 불꽃놀이: 수류탄과 검기 */
  fireworks: {
    moves: [[m("wall"), m("bash", 1.1), m("slam", 1.3)], [m("grenade"), m("shot", 0.8), m("grenade", 1.1), m("spray", 1.3)], [m("wave"), m("slash", 1.1), m("wave", 1.4)]],
    stages: [[1, 1, 1], [1, 2, 1], [1, 1, 1]],
    specials: [sp("blink", 3.5), sp("kata", 4, true), sp("meteor", 5)],
  },
  /** 쇠사슬: 돌진이 많음 */
  chain: {
    moves: [[m("charge"), m("charge", 1.1), m("slam", 1.4)], [m("shot", 0.7), m("shot", 0.7), m("spray"), m("shot", 0.8), m("spray", 1.2)], [m("dash"), m("slash", 1.1), m("dash", 1.2), m("cross", 1.5)]],
    stages: [[1, 2, 1], [1, 1, 2], [1, 2, 1]],
    specials: [sp("shadow", 4, true), sp("waltz", 4), sp("pinball", 5, true)],
  },
  /** 네온 야구방망이: 방패 벽과 세 발 사격 */
  neon: {
    moves: [[m("bash"), m("wall", 1.1), m("bash", 1.1), m("wall", 1.4)], [m("burst"), m("burst"), m("burst", 1.1), m("spray", 1.3)], [m("slash", 1.1), m("spin", 1.3), m("cross", 1.6)]],
    stages: [[2, 1, 1], [1, 2, 1], [1, 1, 1]],
    specials: [sp("blink", 3), sp("kata", 4), sp("pinball", 5.5)],
  },
  /** 마지막 약속: 셋 다 길고, 마지막 특수기가 가장 셈 */
  promise: {
    moves: [[m("guard"), m("bash", 1.1), m("charge", 1.2), m("slam", 1.6)], [m("pierce"), m("burst", 1.1), m("spray", 1.2), m("grenade", 1.3), m("snipe", 2)], [m("slash", 1.1), m("thrust", 1.2), m("spin", 1.4), m("wave", 1.7)]],
    stages: [[1, 2, 1], [2, 1, 1], [1, 2, 2]],
    specials: [sp("shadow", 4, true), sp("kata", 5, true), sp("meteor", 7, true)],
  },
};

const W = (id: string, tag: string, damageMul: number, attackSpeed: number, range = 36) =>
  ({ id, kind: "tag", damageMul, attackSpeed, range, projectileSpeed: 4.5, arcCos: 0.3, tag, exclusive: "abandoned" }) as const;

export const ABANDONED_WEAPONS = {
  /** 골목 삼남매 (처음 무기) */
  streetKids: W("streetKids", "street", 1, 2.6),
  scrapShield: W("scrapShield", "scrap", 1.15, 2.3),
  twinPistols: W("twinPistols", "twin", 0.95, 2.9),
  rooftopRifle: W("rooftopRifle", "sniper", 1.1, 2.3, 40),
  brokenBlade: W("brokenBlade", "broken", 1.05, 2.6),
  ironPipe: W("ironPipe", "pipe", 1.15, 2.4),
  fireworks: W("fireworks", "fireworks", 1.05, 2.4),
  rustyChain: W("rustyChain", "chain", 1.05, 2.6, 40),
  neonBat: W("neonBat", "neon", 1.1, 2.5),
  lastPromise: W("lastPromise", "promise", 1.25, 2.5),
} as const satisfies Record<string, WeaponDef>;

/** 버려진 자들 수치: 탭 무적(틱)·탭 다시 쓰기까지(틱) */
export const ABANDONED = {
  tagInvuln: 30,
  tagCd: 18,
  /** 틀린 뒤 ✕를 보여 주는 틱 */
  missTicks: 50,
  /** 방패 치기 밀침 · 기절(틱) · 막기 틱·받는 피해 배율 · 돌진 거리 */
  push: 7,
  stun: 24,
  guardTicks: 45,
  guardTaken: 0.4,
  chargeDist: 26,
  /** 총: 탄 빠르기 · 퍼짐 각 · 수류탄 폭발 범위 · 저격 사거리 배율 */
  bulletSpeed: 4.5,
  spread: 0.16,
  grenadeR: 24,
  snipeReach: 3.5,
  /** 특수기 범위 */
  specialR: 34,
  /** 곁에서 싸우는 두 아이: 피해 배율 · 빠르기(이동 속도 배율) · 적을 찾는 거리 · 근접 닿는 거리 · 물러나는 틱 · 휘두르기 준비 틱 · 총 거리 · 총 두 발 간격·쉬는 틱 */
  kidMul: 0.3,
  kidSpeed: 1.05,
  kidSeek: 120,
  kidReach: 10,
  kidBack: 26,
  kidWind: 6,
  gunKeep: 56,
  gunPair: 7,
  gunRest: 56,
};
