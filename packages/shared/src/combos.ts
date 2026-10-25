// 격투가 콤보 표 (무기마다 공격 키를 누를 때마다 다음 기술, 잠깐 쉬면 처음부터). 기술 처리는 sim/brawl·brawlMoves
// mul: 공격력 배율 · range: 앞쪽 거리 또는 둘레 반경 · arc: 앞쪽 범위의 cos (-1 = 한 바퀴) · pace: 다음 기술까지 간격 배율

export type MoveKind =
  /** 앞쪽 근접 */
  | "strike"
  /** 둘레 범위 */
  | "spin"
  /** 여러 번 연속 (hits번, gap틱마다) */
  | "flurry"
  /** 앞으로 돌진(dash) 후 둘레 범위 */
  | "dash"
  /** 제자리에서 charge틱 모은 뒤 둘레 범위 */
  | "charge"
  /** 가장 가까운 적 붙잡기 (붙잡은 적에게는 피해를 받지 않음, dash가 있으면 돌진해서) */
  | "grab"
  /** 붙잡은 적 내리꽂기 (둘레 범위) */
  | "throw"
  /** 적 빨아들이기 */
  | "pull"
  /** 검 두 번 동시에 베기 (arc -1 = 한 바퀴) */
  | "twin"
  /** 가까운 적을 꿰뚫고 지나가 바로 뒤에서 멈추는 돌진 (지나간 자리의 적 모두) */
  | "pierce"
  /** 빨아들이고 제자리 버티기 3초 (받는 피해 절반, 받은 피해를 모음) */
  | "guard"
  /** 모은 피해 ×3 범위 일격 + 기절 */
  | "counter"
  /** 체력 20% 이하 적에게 돌진해 쓰러뜨림 (보스는 3배 피해) */
  | "execute"
  /** 파동탄 hits발 (spread가 있으면 부채꼴, charge가 있으면 먼저 모음, scatter면 사방으로 아무렇게나) */
  | "shot";

export interface ComboMove {
  kind: MoveKind;
  mul: number;
  range: number;
  arc?: number;
  hits?: number;
  gap?: number;
  invuln?: boolean;
  push?: number;
  stun?: number;
  dash?: number;
  charge?: number;
  pace?: number;
  /** 좌우 번갈아 (여러 번 연속일 때) */
  side?: boolean;
  /** 무적 틱 (없으면 기술마다 정한 값) */
  invulnTicks?: number;
  /** 파동탄: 부채꼴 사이 각 [cos, sin] · 사방으로 아무렇게나 */
  spread?: readonly [number, number];
  scatter?: boolean;
}

export type ComboStyle = "fist" | "boxing" | "kick" | "muaythai" | "judo" | "jiujitsu" | "mma" | "karate" | "taekkyon" | "energy";

export const COMBOS: Record<ComboStyle, readonly ComboMove[]> = {
  fist: [
    { kind: "strike", mul: 1, range: 22, arc: 0.5 },
    { kind: "strike", mul: 1.3, range: 28, arc: 0 },
    { kind: "spin", mul: 2.2, range: 34, invuln: true },
  ],
  boxing: [
    { kind: "strike", mul: 1, range: 20, arc: 0.5 },
    { kind: "flurry", mul: 0.9, range: 26, arc: 0.8, hits: 2, gap: 6 },
    { kind: "flurry", mul: 0.8, range: 24, arc: 0.5, hits: 5, gap: 5, invuln: true },
  ],
  kick: [
    { kind: "strike", mul: 1, range: 26, arc: 0.5, push: 16 },
    { kind: "dash", mul: 1.6, range: 30, dash: 32 },
    { kind: "charge", mul: 3, range: 44, charge: 45, invuln: true },
  ],
  muaythai: [
    { kind: "spin", mul: 0.8, range: 22 },
    { kind: "strike", mul: 1.4, range: 30, arc: 0.85 },
    { kind: "spin", mul: 2.5, range: 36 },
  ],
  judo: [
    { kind: "strike", mul: 0.7, range: 16, arc: 0.5 },
    { kind: "grab", mul: 0, range: 28 },
    { kind: "throw", mul: 3, range: 34, invuln: true, dash: 16 },
  ],
  // 쌍광연격 (예전 주짓수 자리): 앞쪽 쌍검 베기 → 한 바퀴 쌍검 베기 → 무적 관통 돌진
  jiujitsu: [
    { kind: "twin", mul: 0.7, range: 30, arc: 0.3 },
    { kind: "twin", mul: 0.8, range: 30, arc: -1 },
    { kind: "pierce", mul: 2.4, range: 110, dash: 140, invuln: true, invulnTicks: 30 },
  ],
  mma: [
    { kind: "strike", mul: 1.2, range: 26, arc: 0.85, pace: 1.6 },
    { kind: "flurry", mul: 1.2, range: 24, arc: 0.3, hits: 2, gap: 6, side: true, pace: 0.6 },
    { kind: "grab", mul: 0, range: 30, dash: 24, invuln: true, pace: 0.6 },
    { kind: "throw", mul: 3, range: 32, pace: 1.6 },
    { kind: "strike", mul: 2, range: 34, arc: -0.2, push: 24, pace: 0.6 },
  ],
  karate: [
    { kind: "guard", mul: 0, range: 50, push: 14, pace: 3 },
    { kind: "counter", mul: 1, range: 40, stun: 60 },
    { kind: "execute", mul: 3, range: 100, invuln: true },
  ],
  taekkyon: [
    { kind: "flurry", mul: 1, range: 22, arc: 0.3, hits: 3, gap: 3, side: true },
    { kind: "strike", mul: 1.6, range: 30, arc: 0.85, push: 20 },
    { kind: "dash", mul: 0.8, range: 36, dash: 26, invuln: true, stun: 40 },
    { kind: "spin", mul: 2.2, range: 26 },
  ],
  energy: [
    { kind: "shot", mul: 1, range: 170, hits: 1 },
    { kind: "shot", mul: 1, range: 170, hits: 3, spread: [0.9659, 0.2588] },
    { kind: "shot", mul: 1, range: 170, hits: 5, spread: [0.9659, 0.2588] },
    { kind: "shot", mul: 1, range: 170, hits: 30, charge: 45, scatter: true },
  ],
};
