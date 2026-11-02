// 입력·상태 타입
import type { LuxEnemyState, LuxPlayerState } from "./luxTypes";
import type { ArenaRunState, BossEnemyState, BossPlayerState, BossShotState, RaidRunState } from "./bossTypes";
import type { BossKind, CharacterId, CharmKind, EnemyKind, WeaponId } from "../content";
import type { FoeStatusPlayerState } from "./foeStatus";
import type { GymPlayerState } from "./gym";
import type { TrialRunState } from "./trialTypes";
import type { RoomPlayerState } from "./roomTypes";
import type { PassiveId, UseItemId } from "../items";
import type { StatMod, Stats } from "../stats";
import type { FloorMap } from "./floor";
import type { Device, LaserEnemyState, LaserPlayerState } from "./laserTypes";
import type { OrbitEnemyState, OrbitPlayerState, OrbitShotState } from "./orbitTypes";
import type { BrawlEnemyState, BrawlPlayerState } from "./brawlTypes";
import type { GunEnemyState, GunPlayerState, GunShotState } from "./gunTypes";
import type { BeastPlayerState, BeastShotState } from "./beastTypes";
import type { MedicEnemyState, MedicPlayerState } from "./medicTypes";
import type { TdEnemyState } from "./tdTypes";
import type { NinjaEnemyState, NinjaPlayerState, NinjaShotState } from "./ninjaTypes";
import type { ChronoEnemyState, ChronoPlayerState, ChronoShotState } from "./chronoTypes";
import type { NovicePlayerState, SummonPlayerState } from "./summonTypes";
import type { BedouinPlayerState } from "./bedouinTypes";
import type { GeneralPlayerState } from "./generalTypes";
import type { ImugiEnemyState, ImugiPlayerState } from "./imugiTypes";
import type { ApostleEnemyState, ApostlePlayerState } from "./apostleTypes";
import type { AbandonedPlayerState, DuckPlayerState, H2EnemyState, H2PlayerState, ElderPlayerState, FlyPlayerState, IdraPlayerState, MorphPlayerState, PetRunState, RenPlayerState, S2EnemyState, SpiritPlayerState, OniEnemyState, OniPlayerState, S2Spirit, ScribeEnemyState, ScribePlayerState, StarPlayerState, TcPlayerState, TitanPlayerState, AscalonPlayerState, AscalonEnemyState, StationKind, HiddenRunState } from "./classTypes";
import type { Seat } from "./party";
import type { TabooSet } from "../taboo";
export type { Device } from "./laserTypes";
export type { EffectKind, EffectState, Hazard, PendingBlast } from "./fxTypes";
import type { EffectState, Hazard, PendingBlast } from "./fxTypes";
export * from "./inputTypes";
import type { SwarmEnemyState, SwarmPlayerState, SwarmRunState } from "./swarmTypes";
import type { PwEnemyState, PwPlayerState, PwRunState, PwShotState } from "./paewangTypes";
import type { TerrainRunState } from "./terrainTypes";
export interface Body {
  x: number;
  y: number;
  /** 이전 틱 위치 (화면에서 부드럽게 그리기용) */
  prevX: number;
  prevY: number;
  r: number;
}
export interface PlayerState extends Body, LaserPlayerState, OrbitPlayerState, BrawlPlayerState, MedicPlayerState, GunPlayerState, BeastPlayerState, BossPlayerState, NinjaPlayerState, ChronoPlayerState, SummonPlayerState, NovicePlayerState, BedouinPlayerState, GeneralPlayerState, ImugiPlayerState, ApostlePlayerState, StarPlayerState, DuckPlayerState, SwarmPlayerState, AbandonedPlayerState, TitanPlayerState, OniPlayerState, ScribePlayerState, IdraPlayerState, MorphPlayerState, FlyPlayerState, ElderPlayerState, RenPlayerState, SpiritPlayerState, H2PlayerState, TcPlayerState, AscalonPlayerState, PwPlayerState, LuxPlayerState, FoeStatusPlayerState, GymPlayerState, RoomPlayerState {
  characterId: CharacterId;
  weaponId: WeaponId;
  /** 가진 패시브 (같은 것 여러 개 가능) */
  passives: PassiveId[];
  /** 패시브에서 나온 능력치 변화 */
  mods: StatMod[];
  stats: Stats;
  useSlots: (UseItemId | null)[];
  /** 칸이 다 찼을 때 새 아이템과 바꿀 칸 (먼저 얻은 쪽) */
  replaceSlot: number;
  /** 보호막 남은 틱 (피해 없음) */
  shieldTicks: number;
  hp: number;
  /** 바라보는 방향 (길이 1) */
  faceX: number;
  faceY: number;
  attackCooldown: number;
  dashTicks: number;
  dashCooldown: number;
  dashDirX: number;
  dashDirY: number;
  /** 맞은 뒤 무적 남은 틱 */
  invulnTicks: number;
  // ── 공격 방식 아이템용 상태 ──
  /** 처치 연속 수와 남은 틱 (사냥의 흥분) */
  streak: number;
  streakTicks: number;
  /** 가만히 서 있은 틱 수 (숨 고르기) */
  stillTicks: number;
  /** 대시 직후 첫 공격 두 배가 남은 틱 (기습) */
  ambushTicks: number;
  /** 지금까지 공격한 횟수 (일제 사격 부적·회전 베기·별똥별) */
  attackCount: number;
  /** 이번 대시에서 이미 베어 낸 적 id (돌진 베기) */
  dashHitIds: number[];
  /** 땅의 부적으로 공격 속도가 빨라진 남은 틱. 예전 저장에는 없음 */
  hasteTicks?: number;
  /** 협동: 이 사람의 처치 수·받은 피해 (결과 창) */
  kills?: number;
  hurt?: number;
}

/** 적 행동 단계 (보스 volley 탄·summon 부르기·blink 순간이동, 가디언 swing 휘두르기) */
export type ChargerPhase = "walk" | "windup" | "charge" | "volley" | "summon" | "blink" | "swing" | "act";

export interface EnemyState extends Body, LaserEnemyState, OrbitEnemyState, BrawlEnemyState, MedicEnemyState, GunEnemyState, BossEnemyState, TdEnemyState, NinjaEnemyState, ImugiEnemyState, ApostleEnemyState, SwarmEnemyState, OniEnemyState, ScribeEnemyState, S2EnemyState, H2EnemyState, ChronoEnemyState, AscalonEnemyState, PwEnemyState, LuxEnemyState {
  /** 이 자리에 붙어 있음 (연습장 허수아비: 밀려도 제자리, sim/enemies) */
  anchor?: [number, number];
  id: number;
  kind: EnemyKind;
  hp: number;
  maxHp: number;
  /** 행동 타이머 (적마다 의미가 다름) */
  timer: number;
  phase: ChargerPhase;
  dirX: number;
  dirY: number;
  hitFlash: number;
  /** 마지막으로 치명타를 맞은 틱 (화면 표시용) */
  critTick?: number;
  /** 상태이상 피해를 받은 틱 · 그 틱에 받은 종류별 양 (화면 표시용) */
  dotTick?: number;
  dotAmt?: Partial<Record<DotKind, number>>;
  /** 보스 행동 횟수 (패턴 회전·순간이동 위치 계산용). 일반 적은 0 */
  count: number;
  /** 보스가 부른 적: 돈을 주지 않음 (끝없이 돈을 벌지 않게), 보스가 쓰러지면 같이 사라짐 */
  noGold: boolean;
  /** 협동: 마지막으로 때린 사람 자리 (처치·돈을 그 사람에게) */
  lastHit?: number;
  /** 불타는 남은 틱과 0.5초마다 받는 피해 (점화) */
  burnTicks?: number;
  burnDmg?: number;
  /** 중독 남은 틱과 0.5초마다 받는 피해 (닌자 독 수리검 등) */
  poisonTicks?: number;
  poisonDmg?: number;
  /** 수양 부적 장 수(최대 3)·남은 틱·0.5초마다 한 장 피해 · 붙은 부적 수·종류 (추가 효과가 터지면 떨어짐, 다른 부적이면 새로 셈) */
  seal?: number;
  sealTicks?: number;
  sealDmg?: number;
  charms?: number;
  charmKind?: CharmKind;
  /** 경직 남은 틱 (움직이지도 공격하지도 않음) · 가디언 방패 남은 수 */
  stunTicks?: number;
  shield?: number;
}

export interface ProjectileState extends Body, GunShotState, BeastShotState, OrbitShotState, BossShotState, NinjaShotState, ChronoShotState, PwShotState {
  id: number;
  fromPlayer: boolean;
  vx: number;
  vy: number;
  damage: number;
  ticksLeft: number;
  /** 마법탄: 맞으면 이 반경 안 다른 적에게 절반 피해 (없으면 한 적만) */
  blast?: number;
  /** 관통: 더 뚫고 지나갈 수 있는 적 수, 이미 맞힌 적 id */
  pierce?: number;
  hitIds?: number[];
  bounces?: number; // 벽에 맞으면 튕길 수 있는 남은 횟수
  /** 쏜 적 종류 (맞으면 그 적의 상태이상, sim/foeStatus) */
  by?: EnemyKind;
  /** 가까운 적 쪽으로 휘어짐 · seek = 유도 미사일 (멀리 있는 적도 늘 쫓아감, 더 세게 꺾임) */
  homing?: boolean;
  seek?: boolean;
  /** 사거리 끝에서 한 번 되돌아옴 (span = 되돌아갈 때 날아갈 틱 수) */
  back?: boolean;
  span?: number;
  /** 적에게 맞으면 두 갈래로 갈라짐 */
  split?: boolean;
  /** 협동: 쏜 사람 자리 (owner는 적 탄의 주인 적) */
  shooter?: number;
  /** 마법탄 폭발이 주변 적에게 주는 피해 비율 (없으면 절반) */
  splash?: number;
  /** 음양사 부적: 맞히면 세어서 추가 효과 (charged = 반야로 바로 터짐) */
  charm?: CharmKind;
  charged?: boolean;
  /** 빠르게 나갔다가 이 빠르기까지 점점 느려짐 (벚꽃) */
  easeTo?: number;
  /** ghost: 벽·기둥을 뚫음 (번개) · aura: 지나가는 자리 주변에 0.25초마다 이만큼 피해 (땅) · spirit: 따로 나가는 탄 모양 (그리기용) */
  ghost?: boolean;
  aura?: number;
  /** 색 (장수 필살기 검기) */
  tint?: string;
  spirit?: "orb" | "seek" | "pet" | "steel" | "trigger" | "bullet" | "yarn" | "hairball" | "ki" | "shuriken" | "kunai" | "fuma" | "needle" | "chrono" | "sand" | "disc" | "gear" | "fireball" | "bone" | "spore" | "fairy" | "chakram" | "crescent" | "spearShot" | "shard" | "feather" | "bubble" | "ink" | S2Spirit;
}

/** reroll: 상점 새로고침 (itemId = 누른 횟수, price = 다음 가격) */
export type PickupKind = StationKind | "weapon" | "use" | "passive" | "coin" | "reroll" | "trash";

/** 바닥에 놓인 아이템 */
export interface Pickup {
  id: number;
  kind: PickupKind;
  itemId: string;
  x: number;
  y: number;
  /** 같은 묶음(보상 3개 중 1개)은 하나를 고르면 나머지가 사라짐. 0이면 묶음 없음 */
  group: number;
  /** 플레이어가 닿아 있는 동안은 false (방금 내려놓은 것을 바로 다시 줍지 않게) */
  armed: boolean;
  /** 상점 가격 (0이면 공짜). 돈(coin)은 주울 때 얻는 양 */
  price: number;
  /** 협동: 이 아이템을 가질 수 있는 사람 자리 (남의 것은 흐리게 보이고 못 주움) */
  owner?: number;
}

export interface RoomState {
  visited: boolean;
  cleared: boolean;
  pickups: Pickup[];
  /** 이 방에 남은 적 (null = 아직 들어간 적 없음). 지금 있는 방은 RunState.enemies가 기준 */
  enemies: EnemyState[] | null;
}

/** 화면에 띄울 안내 (상호작용 가능한 것) */
import type { Prompt } from "./stationTypes";
export type { Prompt };

export interface FloorLogEntry {
  floor: number;
  tick: number;
  hp: number;
  gold: number;
}

export interface BuyLogEntry {
  floor: number;
  roomId: number;
  kind: PickupKind;
  itemId: string;
  price: number;
}
/** 상태이상 피해 종류: 출혈 · 화상 · 독 · 저주(수양 부적) */
export type DotKind = "bleed" | "burn" | "poison" | "curse" | "storm" | "rot" | "death" | "hellfire" | "shock" | "frost" | "tide" | "gold" | "radiance" | "voidbolt";

export interface RunState extends RaidRunState, ArenaRunState, SwarmRunState, PetRunState, PwRunState, TerrainRunState, HiddenRunState, TrialRunState {
  seed: number;
  tick: number;
  player: PlayerState;
  /** 지금 있는 방의 적 */
  enemies: EnemyState[];
  projectiles: ProjectileState[];
  /** 잠시 뒤 터질 폭발 (방을 나가면 사라짐) */
  pendingBlasts: PendingBlast[];
  /** 적이 남긴 위험 표시 (이어하기 저장에는 없을 수 있음) */
  hazards?: Hazard[];
  /** 기계공학자 장치 (예전 저장에는 없음) */
  devices?: Device[];
  effects: EffectState[];
  nextId: number;
  floor: number;
  map: FloorMap;
  roomId: number;
  rooms: RoomState[];
  prompt: Prompt;
  /** 가까이 있는 바닥 아이템 id (설명 표시용, 없으면 0) */
  nearPickupId: number;
  /** 바꾸기·고르기 아이템 위에 서 있는 아이템 id와 그 틱 수 (다 차면 가짐) */
  holdPickupId: number;
  holdTicks: number;
  kills: number;
  bossKills: number;
  gold: number;
  /** 한 판 동안 번 돈·쓴 돈·산 횟수 (업적·기록 검사용) */
  goldEarned: number;
  goldSpent: number;
  purchases: number;
  /** 지금 방에서 피해를 받았는지 (보스를 맞지 않고 잡기 업적) */
  roomDamaged: boolean;
  /** 피해 없이 잡은 보스 수 */
  flawlessBosses: number;
  /** 적·적 탄이 멈춘 남은 틱 (얼음 시계) */
  freezeTicks: number;
  /** 진행 기록 (일일 도전 기록 검사): 층에 도착한 시각·체력·돈 */
  floorLog: FloorLogEntry[];
  /** 산 물건 (일일 도전 기록 검사) */
  buys: BuyLogEntry[];
  /** 해금된 업적 id (혼자 하기만. 일일 도전·배틀은 빈 목록) → 나오는 아이템이 늘어남 */
  unlocks: string[];
  /** 서든데스: 한 대 맞으면 끝, 체력 회복 아이템 안 나옴 (예전 저장에는 없음) */
  sudden?: boolean;
  /** 무한 모드: 마지막 층이 없음 (끝까지 버티는 만큼) */
  endless?: boolean;
  /** 영웅의 길 (13단계, sim/hero) */
  hero?: boolean;
  /** 6층을 깬 뒤 도전한 라스트 보스 (7층) */
  lastBoss?: BossKind;
  /** 관리자 티어 플레잉 판: 로그에서 쓰러진 횟수 (쓰러지면 되살아남, sim/run.checkDeath) · 로그를 깬 틱 */
  tierPlay?: { deaths: number; clearTick?: number };
  /** 지금 방 크기 (칸 수, 없으면 보통 방). 라스트 보스방은 큼 */
  roomCols?: number;
  roomRows?: number;
  /** 여신의 선물에서 가진 아이템 수 */
  goldenPicks?: number;
  /** 태초의 빛과 어둠 방의 상자 벽 자리 (칸 [열, 행] 쌍, 그 방에 있을 때만) */
  arena?: number[];
  /** 타워 디펜스: 적 상태 시간(둔화·수양·출혈)은 공격자마다가 아니라 틱마다 한 번만 셈 */
  tdShared?: boolean;
  /** 자동 조준 대상 (그리기용) */
  autoTargetId: number;
  /** 금기의 서로 건 금기 (혼자 하기, 없으면 보통 판) · randomKit: 무작위 캐릭터로 시작해 무기·패시브·사용 아이템을 무작위로 받은 판 */
  taboo?: TabooSet;
  randomKit?: boolean;
  /** 지금까지 터진 치명타 수 (화면 소리용, 게임 계산에는 쓰지 않음) */
  crits?: number;
  /** 협동: 사람마다 따로인 값 (party.ts). seat = 지금 꺼내 놓은 자리 */
  party?: Seat[];
  seat?: number;
  big?: boolean; // 협동 3~5명: 큰 방 (constants.setRoomSize)
  over: boolean;
  /** 마지막 층 계단까지 도착 */
  won: boolean;
}
