// 레이븐 전용 아이템 20: 확률 기물 공격 8(폰·나이트·비숍·룩·퀸·킹·폰의 승격·합동 공세) · 스킬 개방 4(숫자 키 1~4) · 보조 8
// 효과는 sim/raven·rvProcs·rvUnits·rvSkills. 수치는 RV_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "chessRaven" as const, effect: true as const });

export const RAVEN_PASSIVES = {
  /** 폰 — 왕국의 진군: 공격마다 확률 · 금빛 폰 5~8개가 일렬로 앞으로 돌진 */
  rvPawn: P("rvPawn", [{ stat: "damage", mul: 1.05 }]),
  /** 나이트 — 황금 기사의 도약: 공격마다 확률 · 거대한 금빛 나이트가 L자로 뛰어 적을 내려찍음 */
  rvKnight: P("rvKnight", [{ stat: "moveSpeed", add: 0.05 }]),
  /** 비숍 — 성역의 대각선: 공격마다 확률 · 비숍이 양쪽 대각선으로 거대한 금빛 광선 */
  rvBishop: P("rvBishop", [{ stat: "range", mul: 1.06 }]),
  /** 룩 — 왕성의 철벽: 공격마다 확률 · 성벽 같은 룩이 앞으로 돌진하며 적을 밀어냄 */
  rvRook: P("rvRook", [{ stat: "maxHp", add: 15 }]),
  /** 퀸 — 여왕의 칙령: 공격마다 확률 · 백색 퀸이 떠올라 8방향으로 금빛 검격 */
  rvQueen: P("rvQueen", [{ stat: "attackSpeed", add: 0.05 }]),
  /** 킹 — 왕의 심판: 공격마다 확률 · 거대한 흑색 킹이 하늘에서 내려와 적 자리를 짓누름 */
  rvKing: P("rvKing", [{ stat: "damage", mul: 1.06 }]),
  /** 왕국의 체스판 (스킬 1): 몸 둘레에 큰 체스판 (안의 적은 받는 피해 증가) · 누르면 고른 칸마다 금빛 기둥 */
  rvBoard: P("rvBoard", [{ stat: "range", mul: 1.05 }]),
  /** 체크메이트 (스킬 2): 적 둘레에 기물 8개가 길을 막고 가운데를 한꺼번에 공격 */
  rvMate: P("rvMate", [{ stat: "luck", add: 2 }]),
  /** 폰의 승격: 공격마다 확률 · 작은 폰이 나아갈수록 빛나다 거대한 퀸으로 바뀌며 폭발 */
  rvPromote: P("rvPromote", [{ stat: "damage", mul: 1.05 }]),
  /** 캐슬링 — 왕의 수호 (스킬 3): 룩과 자리를 바꾸며 금빛 잔상 · 큰 방어막 · 남은 룩이 충격파 */
  rvCastle: P("rvCastle", [{ stat: "maxHp", add: 20 }]),
  /** 왕실의 합동 공세: 공격마다 확률 · 나이트가 뛰어들고 → 비숍 대각선 광선 → 룩 돌진 */
  rvAssault: P("rvAssault", [{ stat: "attackSpeed", add: 0.05 }]),
  /** 그랜드 체크메이트 (스킬 4·궁극기): 방 가득 체스판 · 기물 6종이 사방에서 포위 · 끝에 킹과 퀸이 거대한 십자 빛 */
  rvGrand: P("rvGrand", [{ stat: "damage", mul: 1.1 }]),
  /** 앙파상: 폰(진군·승격·갬빗) 피해 증가 · 진군 폰이 늘고 폰에 맞은 적은 잠깐 멈춤 */
  rvEnPassant: P("rvEnPassant", [{ stat: "luck", add: 2 }]),
  /** 왕실 근위대: 확률 기물 공격 8종이 모두 더 자주 나감 */
  rvGuard: P("rvGuard", [{ stat: "damage", mul: 1.05 }]),
  /** 왕의 철퇴: 킹 내려찍기 범위가 커지고 맞은 적이 잠깐 기절 */
  rvIron: P("rvIron", [{ stat: "maxHp", add: 10 }]),
  /** 여왕의 광휘: 퀸 빛기둥 앞으로 작은 빛기둥 둘이 이어 솟음 */
  rvRadiance: P("rvRadiance", [{ stat: "range", mul: 1.06 }]),
  /** 연쇄 체크: 체크메이트가 터지면 둘레 적에게 체크가 옮겨 붙음 */
  rvChain: P("rvChain", [{ stat: "luck", add: 2 }]),
  /** 템포: 스킬 대기 감소 · 체크메이트가 터질 때마다 스킬 대기가 줄어듦 */
  rvTempo: P("rvTempo", [{ stat: "attackSpeed", add: 0.06 }]),
  /** 스테일메이트: 받는 피해 감소 · 캐슬링 방어막이 커짐 */
  rvStale: P("rvStale", [{ stat: "maxHp", add: 20 }]),
  /** 갬빗: 적을 처치하면 체력 회복 · 그 자리에서 금빛 폰이 가까운 적에게 돌진 */
  rvGambit: P("rvGambit", [{ stat: "damage", mul: 1.05 }]),
} as const satisfies Record<string, PassiveDef>;

/** 전용 아이템 수치 (피해 배율은 공격력 ×, 시간은 틱(60 = 1초), 거리는 픽셀(사거리 증가만큼 늘어남), 확률은 0~1) */
export const RV_PERKS = {
  /** 폰 진군: 공격마다 확률 · 가장 적은·많은 폰 수 · 폰 사이 거리 · 빠르기 · 가는 틱 · 맞는 반지름 · 피해 배율 */
  rvPawn: { chance: 0.12, min: 5, max: 8, gap: 12, speed: 3.2, ticks: 45, r: 9, mul: 0.55 },
  /** 나이트 도약: 공격마다 확률 · 적을 찾는 거리 · 뛰어 내려앉기까지 틱 · 내려찍는 반지름 · 피해 배율 */
  rvKnight: { chance: 0.1, dist: 220, fly: 24, r: 40, mul: 2.2 },
  /** 비숍 대각선: 공격마다 확률 · 광선 쏘기까지 틱 · 광선 길이 · 맞히는 너비 · 피해 배율 */
  rvBishop: { chance: 0.1, delay: 8, len: 220, w: 12, mul: 1.6 },
  /** 룩 철벽: 공격마다 확률 · 빠르기 · 가는 틱 · 성벽 반지름 · 피해 배율 */
  rvRook: { chance: 0.08, speed: 4, ticks: 35, r: 22, mul: 1.4 },
  /** 퀸 칙령: 공격마다 확률 · 떠올라 검격 쏘기까지 틱 · 검격 빠르기 · 가는 틱 · 반지름 · 피해 배율 */
  rvQueen: { chance: 0.08, delay: 12, speed: 5, ticks: 36, r: 10, mul: 0.9 },
  /** 킹 심판: 공격마다 확률 · 적을 찾는 거리 · 내려오기까지 틱 · 짓누르는 반지름 · 피해 배율 · 기절 틱(보스 빼고) */
  rvKing: { chance: 0.07, dist: 260, fall: 30, r: 50, mul: 3, stun: 30 },
  /** 왕국의 체스판: 대기 틱 · 칸 크기 · 한 줄 칸 수 · 기둥 수 · 솟기까지 틱 · 기둥 사이 틱 · 피해 배율 · 판 안 적이 받는 피해 배율 */
  rvBoard: { cd: 420, cell: 20, n: 8, pillars: 12, delay: 18, gap: 2, mul: 1.2, taken: 1.1 },
  /** 체크메이트: 대기 틱 · 적을 찾는 거리 · 기물이 둘러싸는 반지름 · 일제 공격까지 틱 · 기물 하나 피해 배율 · 마지막 한 방 배율 · 보스 느려짐 */
  rvMate: { cd: 720, dist: 240, r: 40, hold: 40, mul: 0.6, final: 2.5, slow: 60 },
  /** 폰의 승격: 공격마다 확률 · 빠르기 · 가는 틱(끝나면 퀸으로 폭발) · 폭발 반지름 · 피해 배율 */
  rvPromote: { chance: 0.08, speed: 2.2, ticks: 60, r: 56, mul: 3.2 },
  /** 캐슬링: 대기 틱 · 룩이 서는 거리(자리를 바꿈) · 방어막(최대 체력 비율) · 무적 틱 · 남은 룩 충격파 반지름 · 피해 배율 */
  rvCastle: { cd: 600, dist: 90, shield: 0.3, invuln: 30, r: 44, mul: 1.8 },
  /** 합동 공세: 공격마다 확률 · 찾는 거리 · 나이트(틱·반지름·배율) · 비숍(틱·배율) · 룩(틱·배율) */
  rvAssault: { chance: 0.06, dist: 240, knightAt: 20, knightR: 36, knightMul: 1.6, bishopAt: 30, bishopMul: 1.4, rookAt: 40, rookMul: 1.4 },
  /** 그랜드 체크메이트: 대기 틱 · 기물이 몇 틱마다 · 기물 공격 수 · 기물 반지름 · 기물 피해 배율 · 십자 빛까지 틱 · 십자 너비 · 십자 피해 배율 */
  rvGrand: { cd: 3000, every: 6, hits: 20, r: 34, mul: 0.9, cross: 140, w: 26, crossMul: 6 },
  /** 앙파상: 폰 피해 배율 · 더하는 진군 폰 수 · 폰에 맞은 적이 멈추는 틱 */
  rvEnPassant: { mul: 1.3, more: 3, stun: 20 },
  /** 왕실 근위대: 확률 기물 공격마다 더하는 확률 */
  rvGuard: { add: 0.05 },
  /** 왕의 철퇴: 킹 내려찍기 반지름 배율 · 기절 틱(보스 빼고) */
  rvIron: { r: 1.3, stun: 30 },
  /** 여왕의 광휘: 작은 빛기둥 수 · 사이 거리 · 솟는 틱 간격 · 피해 배율 */
  rvRadiance: { n: 2, gap: 30, every: 4, mul: 0.6 },
  /** 연쇄 체크: 옮겨 붙는 반지름 */
  rvChain: { r: 60 },
  /** 템포: 스킬 대기 배율 · 체크메이트마다 줄어드는 대기 틱 */
  rvTempo: { cd: 0.8, cut: 30 },
  /** 스테일메이트: 받는 피해 배율 · 캐슬링 방어막 배율 */
  rvStale: { taken: 0.88, shield: 1.5 },
  /** 갬빗: 처치마다 회복량 · 금빛 폰 피해 배율 · 폰 빠르기 · 가는 틱 */
  rvGambit: { heal: 1, mul: 0.8, speed: 3.5, ticks: 50 },
};
