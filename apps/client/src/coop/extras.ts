// 협동 편의 기능 (게임 계산과 상관없음): 빠른 신호 · 연결 지연 · 자리 색
import { allPlayers, DOOR_HALF, EXIT_X, isAlive, TILE_SIZE, type RunState } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";

/** 자리마다 색 (이름표·체력 줄·출구 점) */
export const SEAT_COLORS = ["#ffd84a", "#5ad1ff", "#ff7ab8", "#7ee07e", "#ffa04a"];
export const seatColor = (i: number) => SEAT_COLORS[i % SEAT_COLORS.length]!;

/** 신호 종류 (번호 = 키 3~6) */
export const SIGNALS: readonly TextKey[] = ["sigHere", "sigHelp", "sigGo", "sigWait"];
export const SIGNAL_MS = 3000;

/** 화면에 떠 있는 신호와 연결 지연 (방장·손님 모두 같은 모양) */
export class CoopExtras {
  /** 자리 번호 → 마지막 신호 */
  signals = new Map<number, { k: number; at: number }>();
  /** 상대 id → 왕복 지연 ms */
  rtt = new Map<string, number>();

  addSignal(seat: number, k: number): void {
    if (k >= 0 && k < SIGNALS.length) this.signals.set(seat, { k, at: performance.now() });
  }

  /** 지금 떠 있는 신호 (사라진 것은 지움) */
  live(): [number, { k: number; at: number }][] {
    const now = performance.now();
    for (const [seat, sig] of this.signals) if (now - sig.at > SIGNAL_MS) this.signals.delete(seat);
    return [...this.signals];
  }
}

/** 출구마다 그 앞에 선 사람 자리 번호 (출구 위에 점으로) */
export function playersAtExits(s: RunState): number[][] {
  const out: number[][] = EXIT_X.map(() => []);
  allPlayers(s).forEach((p, i) => {
    if (!isAlive(p) || p.y > TILE_SIZE + p.r + 2) return;
    EXIT_X.forEach((x, lane) => {
      if (Math.abs(p.x - x) <= DOOR_HALF + 2) out[lane]!.push(i);
    });
  });
  return out;
}
