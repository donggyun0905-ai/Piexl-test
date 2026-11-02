// 비밀의 방 상태 (sim/vault 금 간 벽 · sim/devil 악마의 방 · sim/gamble 도박꾼의 방 · sim/auction 경매장). 모두 선택 값 (예전 저장에는 없음)
import type { DevilId } from "../itemsDevil";
import type { SecretKind } from "../secretDefs";

export interface VaultRunState {
  /** 금 간 벽 (이 층 한 방): side 0 왼쪽 · 1 오른쪽 · 2 아래 벽 · pos 그 벽을 따라 자리 · broke 무너진 틱 · to 열린 비밀의 방 번호 */
  crack?: { floor: number; room: number; side: number; pos: number; kind: SecretKind; broke?: number; to?: number };
}

/** 경매 상품: 패시브 또는 증강 기술 (value = 그림자 손님이 부를 수 있는 가장 큰 값, 플레이어는 모름) · won 1 내가 · 2 그림자 손님 */
export interface AuctionLot {
  kind: "passive" | "aug";
  id: string;
  value: number;
  won?: 1 | 2;
  price?: number;
}

export interface AuctionState {
  /** 이 경매장 (층 × 1000 + 방) */
  room: number;
  lots: AuctionLot[];
  /** 지금 상품 차례 (-1 = 아직 시작 전, lots.length = 끝) */
  lot: number;
  /** 지금 값 · 앞선 사람 (0 없음 · 1 나 · 2 그림자 손님) · 손든 그림자 자리 · 마지막으로 부른 틱 · 그림자가 다음에 부를 틱 · 이 상품 부른 횟수 */
  price: number;
  lead: 0 | 1 | 2;
  who: number;
  t: number;
  next: number;
  bids: number;
  /** 낙찰받은 증강을 붙일 패시브를 고르는 중 (상품 차례) */
  graft?: number;
}

export interface VaultPlayerState {
  /** 악마의 방: 거래했는지 (7층에서 여신의 선물·천상의 상점 대신 단순 상점) · 마지막 거래 (화면 안내) */
  devil?: { pact?: boolean; last?: { id: DevilId; ok: boolean; tick: number } };
  /** 도박꾼의 방: 쓴 방 · 지금 판 (시작 틱 · 당첨 상자 · 섞는 순서 · 고른 자리 · 당첨) */
  gamble?: { rooms: number[]; room?: number; at?: number; prize?: number; swaps?: number[]; pick?: number; win?: boolean };
  auction?: AuctionState;
}
