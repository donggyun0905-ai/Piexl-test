// 시즌 2(비르디아) 캐릭터용 상태 타입. 모두 선택 값 (예전 저장에는 없음)
import type { FormationKind } from "../weaponsElder";
import type { SmallSpirit } from "../weaponsSpirit";
import type { LobbyPetId } from "../petDefs";

/** 시즌 2 캐릭터 탄 모양 (그리기 · 맞힘 처리 s2Hits) */
export type S2Spirit = "gaiaArrow" | "eagleFeather" | "venomSpit" | "web" | "phoenixFire" | "batling" | "windBlade" | "wingBlade" | "magicMissile" | "slBlade" | "slThrow" | "eaBlade" | "smNeedle" | "adMissile" | "rdBolt" | "rdWheel" | "bmRocket" | "bmShard" | "afBlast" | "cyBullet";

/** 몸으로 내달리는 공격 (변희 멧돼지 돌진 · 플라이 급습, s2Kit.rushTick) */
export interface S2Rush {
  /** 남은 틱 · 방향 · 한 틱 거리 · 맞힐 때 피해 · 밀침 · 이번에 맞힌 적 · 무적 · 자국 색 */
  t: number;
  dx: number;
  dy: number;
  step: number;
  dmg: number;
  push: number;
  hit: number[];
  invuln: boolean;
  tint: string;
  /** 맞히는 폭 (없으면 몸 크기 + 4) */
  w?: number;
}

export interface IdraPlayerState {
  /** 가이아 모습 (0 대궁 · 1 단검 · 2 방패 · 3 채찍) */
  gForm?: number;
  /** 지금 모습으로 공격한 수 (우드브레이커 차례) */
  gHits?: number;
  /** 사계: 거친 모습 (비트) · 피해 증가 남은 틱 */
  gSeen?: number;
  gSeason?: number;
  /** 세계수의 심장을 쓴 방 ("층/방") */
  gHeart?: string;
}

export interface MorphPlayerState {
  /** 지금 동물로 공격한 수 (몇 번째마다 나오는 기술) */
  mCount?: number;
  /** 내달리는 중 (멧돼지 돌진 · 플라이 급습) */
  s2Rush?: S2Rush;
  /** 변희: 대시하면 사람 모습 (다시 공격하면 동물로) */
  mHuman?: boolean;
  /** 각성한 하늘 짐승의 공중 습격: 남은 내리긋기 · 다음까지 틱 · 피해 · 날아오른 자리 */
  mRaid?: { n: number; t: number; dmg: number; x: number; y: number; mul?: number; gap?: number };
  /** 동물마다 사냥 경험치 (다 차면 그 동물 전용 능력 하나, sim/morphXp) */
  mXp?: Partial<Record<string, number>>;
  /** 각성 불사조 열기: 남은 틱 */
  mHeat?: number;
}

export interface FlyPlayerState {
  /** 급습 수 · 가속 남은 틱·겹 · 비행 광란(다음 급습 강해짐) */
  fCount?: number;
  fBoost?: number;
  fStack?: number;
  fFrenzy?: boolean;
  /** 이번 급습을 시작한 자리 (신기루) */
  fStart?: { x: number; y: number };
  /** 그림자 발톱: 잠시 뒤 같은 길을 되짚는 분신 */
  fShade?: { tick: number; x: number; y: number; tx: number; ty: number; dmg: number };
}

/** 장로가 깐 진 하나 */
export interface ElderSeal {
  id: number;
  kind: FormationKind;
  x: number;
  y: number;
  /** 크기(반지름) · 발동까지 남은 틱 · 발동 뒤 남은 틱 · 다음 맥박까지 · 깐 틱 */
  r: number;
  arm: number;
  life: number;
  next: number;
  born: number;
  /** 한 번 맥박의 피해 */
  dmg: number;
}

export interface ElderPlayerState {
  /** 깐 진들 · 진을 깐 수 */
  seals?: ElderSeal[];
  eCasts?: number;
  /** 진을 깐 방 ("층/방", 바뀌면 진이 사라짐) */
  eRoom?: string;
}

export interface RenPlayerState {
  /** 다음 토목 차례 (0 타격 · 1 묶기 · 2 날려버리기 · 3 짓뭉개기 · 4 가두기) */
  rMove?: number;
}

export interface SpiritPlayerState {
  /** 곁의 작은 정령 (종류 · 다음 공격까지 틱) · 바뀌기까지 센 틱 · 불러낸 수(시드) · 대정령 다음 기술까지 틱 */
  spirits?: { kind: SmallSpirit; cd: number }[];
  spSwap?: number;
  spCount?: number;
  spGreat?: number;
  /** 대정령이 내리찍는 것: 티탄코어 돌주먹(0)·아비스루인 입방체(1) (떨어지는 틱·자리·반경·피해) */
  spDrops?: { tick: number; x: number; y: number; r: number; dmg: number; kind: 0 | 1 }[];
  /** 베놈하이드 독가스 구름 (남은 틱) */
  spGas?: { x: number; y: number; r: number; t: number; dmg: number }[];
  /** 실반가드 주문을 외며 모으는 중 (남은 틱·방향·피해) */
  spCharge?: { t: number; dx: number; dy: number; dmg: number };
}

export interface S2EnemyState {
  /** 렌의 토목 감옥에 갇힌 남은 틱 */
  renJail?: number;
  /** 예리함이 걸려 더 아픈 틱까지 (sim/baseStats) */
  sharpT?: number;
  /** 불꽃 스택 (라이더 화염 배기 · 붐버 네이팜): 쌓인 수 · 마지막으로 쌓인 틱 */
  flameN?: number;
  flameAt?: number;
}

export interface PetRunState {
  /** 데리고 온 로비 펫 (순위 경쟁 모드에는 없음) · 불사조로 이미 되살아났는지 */
  pet?: LobbyPetId;
  petRevived?: boolean;
}
