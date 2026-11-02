// 비밀의 방 수치 (계산은 sim/secret 금 간 벽 · sim/devil 악마의 방 · sim/gamble 도박꾼의 방 · sim/auction 경매장)
// 관리자 페이지에서 바꿀 수 있음 (balanceTables)

/** 비밀의 방 셋 (금 간 벽을 부수면 같은 확률로 하나) */
export type SecretKind = "devil" | "gamble" | "auction";
export const SECRET_KINDS: readonly SecretKind[] = ["devil", "gamble", "auction"];
/** 시련 1000점 보상으로 골라 들어가는 방 (hidden = 차원의 순례자 히든 상점) */
export const SECRET_PICKS = ["devil", "gamble", "auction", "hidden"] as const;
export type SecretPick = (typeof SECRET_PICKS)[number];

/** 금 간 벽: 일반 전투방에 처음 들어갈 때 생길 확률 · 무너지는 데 걸리는 틱 · 벽 끝에서 떨어진 거리 */
export const SECRET_WALL = { chance: 0.05, crumble: 36, edge: 34 };

/** 도박꾼의 방: 당첨 패시브 수 · 돈 · 고르는 능력치 카드 수 · 꽝이면 깎이는 능력치 수·비율 · 보여 주는 틱 · 섞는 횟수 · 한 번 바꾸는 틱 */
export const GAMBLE = { passives: 5, gold: 300, picks: 2, lose: 2, down: 0.1, show: 70, swaps: 10, swapTicks: 20 };

/** 경매장: 상품 수 · 이 차례(0부터)부터 ??? · 값어치 범위(층마다 배율 +) · 시작가 비율 · 한 번 올리는 값 · 그림자 손님이 부르기까지 틱 · 하나·둘·셋 틱 · 증강이 나올 확률 */
export const AUCTION = { lots: 5, hidden: 3, valueMin: 60, valueMax: 220, perFloor: 0.25, start: 0.35, step: 10, waitMin: 24, waitMax: 70, going: 75, augChance: 0.4 };
