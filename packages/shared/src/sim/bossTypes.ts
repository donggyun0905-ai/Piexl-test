// 새 보스용 상태 타입. 모두 선택 값 (예전 저장에는 없음)
import type { BossKind } from "../content";

export interface BossEnemyState {
  /** 보스 행동 안의 몇 번째 단계 (연속 베기·돌진 횟수 등) */
  step?: number;
  /** 보스가 잠깐 쓰는 값 (활잡이 뛰기 대기·검신 일섬 끝 자리 등) */
  aux?: number;
  auxX?: number;
  auxY?: number;
  /** 지금은 맞지 않음 (천사장 탑: 차례가 아닌 탑 · 용: 무적·하늘로 날아오름) */
  immune?: boolean;
  /** 패왕전: 지금 움직이는 사람 눈에 안 보임 (수풀·투명). 자동 조준·유도탄이 노리지 않음 (맞히면 맞음) */
  pwHid?: boolean;
  /** 하늘에 떠 있음 (그림자만 보이고 몸에 닿아도 피해 없음) */
  air?: boolean;
  /** 태초의 어둠: 거대한 두 손 자리 [x1, y1, x2, y2] · 어둠이 깔린 남은 틱 · 방을 가로지르는 다크 오라 선 */
  hands?: number[];
  veil?: number;
  sweeps?: { x: boolean; dir: number; pos: number; wait: number }[];
  /** 바닥을 쳐서 퍼지는 원형 파동 (bossWaves) */
  waves?: { x: number; y: number; r: number; max: number; wait: number; speed: number; damage: number; hit?: boolean }[];
  /** 갓이터: 날려 버리기가 터지는 틱 · 받아 넘긴(패링) 횟수 */
  repelAt?: number;
  parries?: number;
  /** 태초의 빛: 네 방향 빔의 방향 [cos, sin] · 남은 틱 */
  beam?: [number, number];
  beamTicks?: number;
  /** 갓이터 구역 닫기: 닫히는 사분면(0 왼위 · 1 오른위 · 2 왼아래 · 3 오른아래)과 닫히는 틱 · 다시 열리는 틱 */
  zones?: { q: number; at: number }[];
  zonesEnd?: number;
  /** 궁극기 (bossUlts): 시작한 틱 · 용 염옥 장면마다 안전한 칸 / 갓이터 작은 방 가운데 [x, y] · 이미 썼음 */
  ultAt?: number;
  ultSafe?: number[];
  ultDone?: boolean;
  /** 갓이터 패링: 예고 중인 창 (나온 자리 · 방향 · 날아가는 틱 · 진짜인지) */
  spears?: { x: number; y: number; dx: number; dy: number; at: number; real: boolean }[];
  /** 데스웜: 솟은 자리 [x, y] · 들어갈 자리 [x, y] · 머리가 길 따라 나아간 거리 */
  wormPath?: number[];
  /** 데스웜 필살기: 입에서 나온 몬스터 id · 날아가는 독액 · 바닥 독 웅덩이 */
  brood?: number[];
  globs?: { x: number; y: number; vx: number; vy: number; t: number }[];
  pools?: { x: number; y: number; t: number }[];
  /** 괴력난신: 앞으로만 나가는 근접 콤보 (남은 타 · 다음 타까지 · 방향 · 범위 배율) · 지금 필살기(1 70% · 2 50% · 3 10%) · 쓴 필살기(비트) · 원기옥을 피한 횟수 */
  combo?: { left: number; t: number; dx: number; dy: number; reach: number };
  gUlt?: number;
  gDone?: number;
  gDodge?: number;
  /** 제천대성 (sim/bossSage) */
  sage?: SageState;
  /** 검은 잔영이 되살린 검은 짐승 (필살기 없음 · 공격 주기가 더 빠름) */
  dark?: boolean;
  /** 흰 보호막: 체력보다 먼저 깎임 (거대 전갈) */
  ward?: number;
  /** 검은 잔영: 지금 하는 말 (0 처음 · 1~3 짐승을 하나 잡을 때마다) · 말을 시작한 틱 */
  say?: number;
  sayAt?: number;
}

/** 제천대성: 근두운 자리·다음 공격까지·공격 수·하는 중인 공격(이름·시작 틱·방향·자리) · 몸 쪽 하는 중인 공격 · 여의봉 벽 [x0, y0, x1, y1, 끝 틱] · 내려선 뒤(강해짐) · 지난 공격 번호 */
export interface SageState {
  cx: number;
  cy: number;
  ct: number;
  cn: number;
  cAct?: string;
  cAt?: number;
  cDir?: [number, number];
  bAct?: string;
  bAt?: number;
  bX?: number;
  bY?: number;
  walls: number[][];
  foot?: boolean;
  lastB?: number;
  lastC?: number;
  /** 즉사기를 마지막으로 쓴 공격 수 */
  maxN?: number;
  /** 늦게 터지는 것 (sageKit.later) */
  later?: { at: number; kind: "rocks" | "wave" | "fist"; x: number; y: number; n: number }[];
}

export interface BossPlayerState {
  /** 부식독 남은 틱 (베놈 독가스): 모든 회복·재생 감소 (sim/heal) */
  corrode?: number;
  /** 독 남은 틱 (베놈 독가스를 밟음): 0.5초마다 독 피해, 가스를 나가도 남음 (sim/terrain) */
  poison?: number;
  /** 끌려가는 남은 틱 (세이렌 음표 · 어둠의 블랙홀) · 끌어당기는 적 id (없으면 세이렌) */
  lureTicks?: number;
  lureId?: number;
  /** 빛의 그물: 눌러야 할 남은 방향 · 마지막 입력 방향 · 틀려서 못 움직이는 남은 틱 */
  netSeq?: number[];
  netLast?: number;
  netStun?: number;
  /** 어둠: 유령에 닿은 횟수 · 옅어질 때까지 남은 틱 */
  darkStacks?: number;
  darkTicks?: number;
  /** 봉인의 사슬: 남은 방향(W·D·S·A) · 남은 틱 · 지난 틱에 누른 방향 · 거울(이동 반대) 남은 틱 · 갓이터 구역에 갇혀 깜깜한 남은 틱 */
  chains?: number[];
  chainTicks?: number;
  chainLast?: number;
  mirrorTicks?: number;
  blindTicks?: number;
  /** 갓이터 패링: 사슬에 묶여 못 움직이고 대시 키가 패링 키 · 받아 넘기는 남은 틱 · 다시 누를 때까지 · 지난 틱에 누르고 있었는지 */
  parryOn?: boolean;
  parryTicks?: number;
  parryCd?: number;
  parryLast?: boolean;
  /** 여신의 축복으로 이미 되살아났음 */
  blessUsed?: boolean;
  /** 받아 넘긴 횟수 (소리용) */
  parryHits?: number;
  /** 거대 전갈: 독 남은 틱 · 집게에 붙잡힌 남은 틱과 붙잡은 전갈 id (sim/bossGrip) */
  venomTicks?: number;
  pinchTicks?: number;
  pinchBy?: number;
  /** 죽음(거대 전갈 필살기 검은 독액): 남은 틱 · 겹 (독보다 세고 쓰러질 수 있음) */
  doomTicks?: number;
  doomStacks?: number;
}

/** 레이드(라스트 보스) 시간: 보스방에 처음 들어간 틱 · 보스를 다 잡기까지 걸린 틱 (명예의 전당) */
export interface RaidRunState {
  raidStart?: number;
  raidTicks?: number;
}

/** 레이드 아레나: 지금 레벨(1~15) · 방마다 보스 · 잡은 최종 보스 · 이번 보상 방에서 가진 사용 아이템 수 */
export interface ArenaRunState {
  arenaLv?: number;
  arenaRooms?: BossKind[][];
  arenaDone?: BossKind[];
  arenaPicks?: number;
}

export interface BossShotState {
  /** 그리기용: 쏜 적 종류 (탄 모양을 그 적 느낌으로) */
  from?: string;
  /** 그리기용 탄 모양 */
  look?: "arrow" | "note" | "spear" | "seed" | "soul" | "feather" | "light" | "fire" | "wave" | "orbRuin" | "orbChaos" | "bat" | "net" | "rock" | "bigwave" | "larrow" | "darrow" | "reaper" | "ember" | "rspear" | "fspear" | "doom" | "kifist" | "staff" | "bolt";
  /** 세이렌 음표: 플레이어에 맞아도 사라지지 않고, 맞으면 끌려감. 세이렌이 쓰러지면 사라짐 */
  lure?: boolean;
  /** 플레이어에 맞아도 사라지지 않음 (갓이터의 거대한 구슬) · 이 적이 쓰러지면 사라짐 */
  stay?: boolean;
  owner?: number;
  /** 빛의 그물: 맞으면 그물에 걸림 */
  net?: boolean;
  /** 마지막으로 벽에 닿으면 터져 이 수만큼 작은 불꽃으로 퍼짐 (튕김이 다 끝난 뒤) */
  shatter?: number;
  /** 갓이터 패링의 진짜 창: 패링 자세면 받아 넘김 · 가짜 창: 플레이어에 닿아도 아무 일 없음 */
  parry?: boolean;
  fake?: boolean;
  /** 거대 전갈 필살기 검은 독액: 맞으면 죽음 상태이상 */
  doom?: boolean;
}
