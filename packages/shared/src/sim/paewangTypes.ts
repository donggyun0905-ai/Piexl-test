// 패왕전 상태 (sim/paewang). AI 캐릭터 = 상대는 적(EnemyState, kind "fighter"), 내 편은 allies 목록. 둘 다 같은 머리(PwBrain)로 움직임
import type { CharacterId } from "../content";
import type { PassiveId, UseItemId } from "../items";
import type { WeaponId } from "../content";
import type { PwMode } from "../paewangDefs";
import type { PwArenaId } from "../paewangMaps";
import type { Body, EnemyState } from "./types";

/** AI 캐릭터의 머리: 공격 방식·쿨타임·움직임 */
export interface PwBrain {
  char: CharacterId;
  /** 편: 0 = 내 편 · 1 = 상대 편 · 모두가 적이면 저마다 다른 번호 */
  team: number;
  /** 이름표 번호 (화면에서 이름 고르기) */
  tag: number;
  melee: boolean;
  range: number;
  dmg: number;
  /** 공격 사이 틱 · 탄 속도 · 한 번에 쏘는 발 수 · 근접 휘두르는 범위(cos) */
  every: number;
  speed: number;
  shotSpeed: number;
  shots: number;
  arc: number;
  cd: number;
  skill: number;
  dashCd: number;
  dash: number;
  dashX: number;
  dashY: number;
  /** 옆걸음 방향과 바꾸는 틱 · 막혔을 때 비켜 가기 */
  side: number;
  sideT: number;
  stuck: number;
  /** 바라보는 쪽 · 휘두름을 보여 줄 남은 틱 */
  faceX: number;
  faceY: number;
  swing: number;
  /** 목표가 없을 때 걸어갈 곳 */
  goalX: number;
  goalY: number;
  /** 데스매치 레벨 (1~21) */
  lv?: number;
}

export interface PwEnemyState {
  pw?: PwBrain;
  /** 마지막으로 때린 AI (처치를 그 AI에게. 없으면 나) */
  pwBy?: number;
}

export interface PwShotState {
  /** AI가 쏜 탄: 쏜 AI · 편 (내 편 탄은 나를 맞히지 않음) */
  pwBy?: number;
  pwTeam?: number;
}

/** 내 편 AI */
export interface PwAlly extends Body {
  id: number;
  hp: number;
  maxHp: number;
  hitFlash: number;
  pw: PwBrain;
}

/** 대난투에 떨어진 아이템 · 숲 함정 */
export interface PwTrap {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** 준비방에서 고른 것 */
export interface PwLoadout {
  weapon: WeaponId;
  passives: PassiveId[];
  uses: UseItemId[];
}

export interface PwState {
  mode: PwMode;
  arena: PwArenaId;
  allies: PwAlly[];
  /** 토너먼트: 아직 안 나온 내 편 · 상대 편 */
  benchA: CharacterId[];
  benchB: CharacterId[];
  /** 나오기를 기다리는 AI (토너먼트 다음 상대 · 데스매치 다시 살아나기) */
  waiting: { at: number; char: CharacterId; team: number; lv?: number; tag: number }[];
  /** 내가 쓰러져 내 편을 지켜보는 중 · 데스매치에서 다시 살아날 틱 */
  down: boolean;
  back?: number;
  /** 데스매치 내 레벨 */
  lv: number;
  /** 내가 쓰러뜨린 수 · 대난투 내가 쓰러질 때 남은 사람 수 (순위) */
  kills: number;
  place?: number;
  /** 다음 이름표 번호 */
  tags: number;
  /** 무한 모드 이벤트: AI가 내 능력치(최대 체력·공격력)에 이 배율을 곱해 씀 */
  same?: number;
}

/** 패왕전 자리 하나 (나·친구·AI 모두 진짜 캐릭터: 협동 자리 s.party를 씀, sim/pvp) */
export interface PvpSeat {
  team: number;
  /** 사람이 조작 (아니면 AI 입력, sim/pvpBot) */
  human: boolean;
  /** 경기장에 나와 있음 (토너먼트 대기·쓰러져 끝난 사람은 false) */
  on: boolean;
  kills: number;
  deaths: number;
  /** 마지막으로 나를 때린 자리 (쓰러지면 처치를 그 자리에) */
  by?: number;
  /** 데스매치 레벨 · 다시 나올 틱 */
  lv: number;
  back?: number;
  /** 기절·느려짐·묶임 남은 틱 (상대 공격이 그림자 적에 남긴 상태를 옮겨 옴) */
  stun: number;
  slow: number;
  root: number;
  /** AI 움직임 */
  side: number;
  sideT: number;
  stuck: number;
  goalX: number;
  goalY: number;
  dashCd: number;
  /** 지난번 AI 입력 때 자리 (막힘 판정) */
  lastX?: number;
  lastY?: number;
  /** AI가 상대를 마지막으로 본 곳 · 그쪽을 찾는 남은 틱 (수풀에 숨으면 정확한 자리는 모름) */
  seenX?: number;
  seenY?: number;
  seenT?: number;
  /** 이 판에 상대에게 준 피해 · 받은 피해 합 (점수판) */
  dealt?: number;
  taken?: number;
  /** 다시 나온 뒤 받은 피해 (누가 · 출처 · 합 · 가장 큰 한 방, pvpRecap) */
  recv?: { by: number; src: number; dmg: number; max: number }[];
  /** 얼음 시계에 얼어 있는 끝 틱 (그림) */
  iced?: number;
  /** 이번 판에 쓰러짐 (토너먼트 다음 차례 고르기) */
  fell?: boolean;
  /** 침묵(스킬 못 씀) 남은 틱 · 밀려나는 중 (틱마다 움직임 · 남은 틱) */
  silence?: number;
  push?: { vx: number; vy: number; t: number };
}

/** 패왕전 사람 자리 값 */
export interface PwPlayerState {
  /** 이동 속도 강화 구슬 남은 틱 */
  pwFast?: number;
  /** 스킬 1~4 남은 대기 틱 */
  pwCd?: number[];
  /** 걸린 버프 (스킬): 남은 틱과 효과 */
  pwBuffs?: { t: number; dmg?: number; move?: number; rate?: number; taken?: number; regen?: number; hide?: boolean }[];
  /** 스킬 돌진 중: 방향 · 남은·전체 거리 · 속도 · 맞힌 상대 · 스킬 번호 · 지난 구간(여러 번 돌진) */
  pwDash?: { dx: number; dy: number; left: number; total: number; speed: number; hit: number[]; k: number; seg?: number };
  /** 능력치를 바꾸는 버프 수 (바뀌면 능력치를 다시 계산) */
  pwSig?: number;
  /** 풋내기 패시브(마지막 버팀): 체력 1로 버티는 끝 틱 · -1 = 이번 판에 이미 씀 */
  pwStand?: number;
  /** 잔영 패왕전 기본 공격: 찌르기까지 남은 틱 (sim/pwBasic) */
  pwRm?: { t: number };
  /** 패왕전 직접 조준: 누른 곳까지 거리 (사람만, tracker.readAim) */
  pwAimD?: number;
  /** 플라이: 다음 급습이 붉은 급습 (신기루를 쓴 뒤) */
  pwRed?: boolean;
}

/** 스킬이 남긴 것: 예고 뒤 터짐·여러 번 터지는 장판·늦게 나가는 줄 (자리 · 스킬 번호 · 자리 · 방향 · 다음까지 틱 · 남은 횟수 · 나를 따라감) */
export interface PwCast {
  seat: number;
  k: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  t: number;
  left: number;
  follow?: boolean;
}

/** 스킬로 부른 것 (맞지 않음, 시간이 다하면 사라짐) */
export interface PwMinion {
  id: number;
  seat: number;
  k: number;
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  t: number;
  cd: number;
  /** 마지막 공격 대상 자리 (그림: 빛줄기) */
  shot?: { x: number; y: number; at: number };
  /** 맞는 몸 (상대 쪽 s.enemies에 들어가 맞음 · 체력이 다하면 부서짐, pvpWorld.assignFoes) */
  body?: EnemyState;
}

/** 패왕전 바닥 강화 구슬: 0 회복 · 1 공격 속도 · 2 이동 속도 (닿으면 바로) */
export interface PwOrb {
  id: number;
  kind: 0 | 1 | 2;
  x: number;
  y: number;
}

/** 패왕전 얼음 시계: 던진 자리(x·y)에서 떨어질 곳(tx·ty)으로 날아가 터지며 범위 안 상대를 얼림 · t 남은 틱(0 아래는 터진 뒤 그림만) */
export interface PwIce {
  x: number;
  y: number;
  tx: number;
  ty: number;
  t: number;
  team: number;
}

export interface PvpState {
  /** 이번 틱 그림자 적이 맞은 날것 피해 · 지금 피해의 출처 (pvpRecap) */
  hits?: { to: number; by: number; src: number; amt: number }[];
  src?: number;
  mode: PwMode;
  arena: PwArenaId;
  seats: PvpSeat[];
  /** 자리마다 그림자 적 (상대 쪽 자리 목록 s.enemies에 들어가 맞음) */
  proxies: EnemyState[];
  /** 대난투에서 내가(0번) 쓰러질 때 순위 */
  place?: number;
  /** 이긴 편 (모두가 적이면 자리 번호 + 100) */
  winner?: number;
  orbs?: PwOrb[];
  ice?: PwIce[];
  casts?: PwCast[];
  mins?: PwMinion[];
  /** 3판 2선승: 편마다 이긴 판 수 · 지금 판(1부터) · 지난 판 결과(화면 글자) · 이번 판 준비가 끝나는 틱 */
  wins?: Record<number, number>;
  round?: number;
  lastRound?: { team: number; at: number };
  readyAt?: number;
  /** 연습장: 허수아비(가만히 · 움직이기만 · 싸움) · 스킬 대기 없음. 판이 끝나지 않고 쓰러지면 바로 다시 참 (sim/pvpPractice) */
  practice?: PwPractice;
}

export interface PwPractice {
  dummy: "still" | "move" | "fight";
  noCd: boolean;
}

export interface PwRunState {
  /** 패왕전 (좌석 대결) */
  pvp?: PvpState;
  /** 무한 모드 AI 대결 (적으로 나오는 AI, sim/endless·paewangUnits) */
  pw?: PwState;
  /** 무한 모드: 이 층 보스방 AI 이벤트 (방을 나갔다 오면 다시 꺼냄) */
  pwRoom?: PwState;
}
