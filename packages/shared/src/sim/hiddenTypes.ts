// 히든 상점(차원의 순례자)·히든 아이템 상태 (sim/pilgrim·hiddenPerks). 모두 선택 값 (예전 저장에는 없음)
import type { CharacterId, WeaponId } from "../content";
import type { GreatSpirit } from "../weaponsSpirit";

/** 방에 와 있는 차원의 순례자: 방 · 포탈에서 나온 틱 · 물건을 펼쳤는지 */
export interface PilgrimState {
  room: number;
  /** 만난 층 (다른 층의 같은 번호 방에 남아 보이지 않게) */
  floor?: number;
  t0: number;
  shown: boolean;
  /** 물건을 펼쳐 준 자리 (협동은 사람마다) */
  seats?: number[];
}

export interface HiddenRunState {
  /** 이 판에 히든 상점이 나올 수 있음 (혼자 하기·무한·협동, 화면이 판을 시작할 때 켬) */
  pilgrim?: boolean;
  /** 이 층에 와 있는 순례자 */
  pilgrimNpc?: PilgrimState;
  /** 이번 판 순례자를 만난 횟수 (로비 전시장 누적용) */
  pilgrimMet?: number;
  /** 포탈건이 기억한 방 */
  portalMark?: { floor: number; room: number };
  /** 능력치를 직접 정하는 판 (타워 디펜스: 레벨·보정을 능력치에 곱함) → 0.5초 안전망 재계산을 하지 않음 */
  fixedStats?: boolean;
  /** 테라포밍: 이 층 보스를 바꿈 */
  terraBoss?: { floor: number; kind: string };
}

/** 이프리트의 발톱: 겹친 화상 수 */
export interface HiddenEnemyState {
  ifrit?: number;
}

/** 히든 아이템 동료 (sim/allies): 월계선 = 무작위 히든 캐릭터 · 거짓된 용사 = 풋내기 */
export interface AllyState {
  kind: "laurel" | "hero";
  char: CharacterId;
  weapon: WeaponId;
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  hp: number;
  maxHp: number;
  dmg: number;
  range: number;
  /** 공격 사이 틱 · 남은 틱 · 맞은 뒤 무적 틱 */
  rate: number;
  cd: number;
  hurt: number;
  speed: number;
  faceX: number;
  faceY: number;
  moving: boolean;
  /** 가진 전용 패시브 수 (월계선) */
  perks: number;
  /** 거짓된 용사: 레벨 · 경험치 · 지난번 본 처치 수 */
  lv?: number;
  exp?: number;
  seenKills?: number;
}

export interface HiddenPlayerState {
  /** 동료 · 거짓된 용사를 부른 층 (쓰러지면 다음 층에 다시) */
  allies?: AllyState[];
  heroFloor?: number;
  /** 동료가 서 있는 층·방 (층 × 1000 + 방) */
  allyAt?: number;
  /** 큐피트의 정령: 같이 다니는 대정령 · 기술 대기 틱 */
  cupid?: GreatSpirit;
  cpGreat?: number;
  /** 바스러져가는 왕관: 옛 제국의 왕으로 변신한 방 (방을 나가면 풀림) */
  kingRoom?: number;
  /** 변신 전 체력 · 대검 콤보 단계 (0~3, 몰락한 왕도 씀) */
  kingHp?: number;
  kgStep?: number;
  /** 몰락한 왕: 모은 영혼 수 */
  fkSouls?: number;
  /** 금기된 아티팩트: 색마다 쌓인 처치 수 */
  relics?: Record<string, number>;
  /** 떨어진 신의 파편: 얻은 힘 (0~9) */
  shardPick?: number;
  /** 고르는 창이 열림 (저주받은 주사위 숫자 · 테라포밍 보스) */
  hdPick?: "curse" | "terra";
  /** 운명의 주사위 6이 나온 수 · 저주받은 주사위 보물 · 저주로 최대 체력 고정 */
  fateSix?: number;
  curseWin?: boolean;
  curseHp?: number;
  /** 블리자드 랜스: 다음에 날릴 수 있는 틱 · 날아가 있는 동안 (등 뒤 창 그림을 숨김) */
  lanceAt?: number;
  lanceOut?: number;
}
