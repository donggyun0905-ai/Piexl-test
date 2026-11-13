// 느아르 상태 타입 (sim/noir·nrKit·nrVolley·nrSkills·nrAdapt). 모두 선택 값 (예전 저장에는 없음)

export type NrVolleyKind = "flurry" | "spin" | "sever" | "squeeze" | "drain" | "devour" | "origin" | "rift" | "barrier" | "abyss" | RgVolleyKind | BuVolleyKind | JnVolleyKind | MzVolleyKind | VtVolleyKind | BcVolleyKind;
/** 블랑 기술 (sim/blanc·bcSkills) */
export type BcVolleyKind = "bcFan" | "bcBless" | "bcPuppet" | "bcMirror" | "bcRift" | "bcSeize" | "bcCrusade" | "bcPhantom" | "bcWhisper" | "bcRedeem" | "bcParadox" | "bcSanctum" | "bcTransfer";
/** 베르 기술 (sim/vert·vtSkills) */
export type VtVolleyKind = "vtSlash" | "vtSpin" | "vtFrenzy" | "vtWhip" | "vtGarden" | "vtForest" | "vtDance";
/** 마젠타 기술 (sim/magenta·mzSkills) */
export type MzVolleyKind = "mzRain" | "mzBloom" | "mzPollen" | "mzClone" | "mzPrison" | "mzGarden" | "mzSoul" | "mzVortex" | "mzStorm" | "mzErode" | "mzEnd";
/** 루주 기술 (sim/rouge·rgSkills): 쌍검격 · 난무 · 회전참 · 가시 찌르기 · 꽃잎 폭풍 · 가시숲 · 혈화 만개 · 혈검무 · 혈월참 · 폭우 · 종언 */
export type RgVolleyKind = "rgX" | "rgFlame" | "rgSpin" | "rgThorn" | "rgPetal" | "rgForest" | "rgBloom" | "rgDance" | "rgMoon" | "rgRain" | "rgEnd";
/** 블뢰 기술 (sim/bleu·buSkills): 빙결의 파동 · 빙정 폭발 · 영구빙벽 · 영혼 늑대·매 · 빙시계의 태엽 · 절대 영도 · 시간 동결 · 시간감옥 · 빙창의 폭우 · 종언의 영구동토 */
/** 존 기술 (sim/jaune·jnSkills): 벽력일섬 · 뇌광 연속격 · 황금 번개 주먹 · 지그재그 뇌격 · 번개 분신 · 뇌전 구속 · 황금 뇌구 · 혼돈의 낙뢰 · 뇌신의 손아귀 · 천둥의 발자취 · 광란의 천뢰 · 초월 벽력일섬 · 황뢰 천수 · 종언의 황천뢰 */
export type JnVolleyKind = "jnFlash" | "jnRapid" | "jnFist" | "jnZig" | "jnClone" | "jnBind" | "jnOrb" | "jnChaos" | "jnHand" | "jnStep" | "jnFrenzy" | "jnBeam" | "jnThousand" | "jnEnd";
export type BuVolleyKind = "buWave" | "buBurst" | "buWall" | "buWolf" | "buHawk" | "buClock" | "buZero" | "buStop" | "buPrison" | "buRain" | "buEnd";

/** 맞은 적에게 붙는 것 (루주): 출혈 스택 · 화상 · (블뢰) 서리 피해로 들어감 · 얼리는 틱 */
export interface HitOn {
  bleed?: number;
  burn?: boolean;
  frost?: boolean;
  freeze?: number;
  /** (존) 번개: 감전 피해 + 황금 번개 추가 타격 */
  zap?: boolean;
  /** (마젠타) 쌓을 저주 겹 (있으면 마젠타 한 대) · 반드시 매혹 */
  hex?: number;
  charm?: boolean;
  /** (베르) 독·출혈·화상·부식·느려짐 + 씨앗 (있으면 베르 한 대) */
  vt?: import("./vtTypes").VtOn;
  /** (블랑) 조종·기절·약화·영혼의 틈 (있으면 블랑 한 대) */
  bc?: import("./bcTypes").BcOn;
}

/** 나눠 때리는 기술 하나: 종류 · 자리 · 반지름 · 한 대 피해 · 한 대마다 더하는 피해 · 남은 수 · 처음 수 · 간격 · 다음 틱 · 빨아들이는 힘 · 끝 한 방 피해 · 몸을 따라감 · 적마다 때린 피해 합(공허 포식) */
export interface NrVolley {
  kind: NrVolleyKind;
  x: number;
  y: number;
  r: number;
  dmg: number;
  ramp: number;
  left: number;
  n: number;
  every: number;
  next: number;
  pull: number;
  fin: number;
  follow?: boolean;
  sums?: Record<number, number>;
  /** 한 대마다 피해 (있으면 dmg·ramp 대신) · 맞은 적에게 붙는 것 · 끝 한 방에만 화상 */
  dmgs?: number[];
  on?: HitOn;
  finBurn?: boolean;
  /** (존) 원 대신 (x, y)에서 dx·dy 쪽 직선(길이 · 너비)을 때림 · 틱마다 움직임(벽에서 멈춤) */
  line?: { dx: number; dy: number; len: number; w: number };
  vel?: [number, number];
  /** (베르) 원 대신 dx·dy 쪽 부채꼴만 */
  arc?: { at: number; dx: number; dy: number };
}

/** 늦게 오는 한 방 (마력 소멸 3초 뒤 · 공허의 낙인 창): 자리 · 반지름 · 피해 · 틱 · 겨눈 적(있으면 그 적만) */
export interface NrLater {
  x: number;
  y: number;
  r: number;
  dmg: number;
  at: number;
  id?: number;
  kind: "drain" | "brand" | "rgMark" | "rgFuneral";
  on?: HitOn;
}

/** 방을 휩쓰는 충격파: 처음 자리 · 지금 반지름 · 빠르기 · 피해 · 맞힌 적 · 시작 틱 */
export interface NrWave {
  x: number;
  y: number;
  r: number;
  speed: number;
  dmg: number;
  hit: number[];
  at: number;
}

/** 흑영 돌진: 방향 · 남은 틱 · 한 틱 거리 · 피해 · 맞힌 적 · 처음 자리 */
export interface NrRush {
  dx: number;
  dy: number;
  t: number;
  step: number;
  dmg: number;
  hit: number[];
  sx: number;
  sy: number;
  /** 끝날 때 효과 (루주 혈영 돌진) */
  fx?: "rgRush" | "jnPop" | "vtPop";
  /** 맞은 적에게 붙는 것 (존 번개) · 곧게 가지 않고 이 자리들을 차례로 지나감 (존 지그재그) */
  on?: HitOn;
  path?: [number, number][];
}

export interface NoirPlayerState {
  /** 다시 공격까지 · 방 · 마지막으로 벤 틱(그림) */
  nrCd?: number;
  nrRoom?: number;
  nrAtkAt?: number;
  /** 나눠 때리는 기술들 · 늦게 오는 한 방 · 충격파 · 돌진 */
  nrVolleys?: NrVolley[];
  nrLaters?: NrLater[];
  nrWaves?: NrWave[];
  nrRush?: NrRush;
  /** 스킬 1~4 남은 대기 틱 */
  nrSkillCd?: number[];
  /** 확률 굴린 수 (시드) */
  nrRolls?: number;
  /** 적응력: 레벨 · 흑 · 남은 강화 횟수 */
  nrLv?: number;
  nrExp?: number;
  nrPts?: number;
  /** 기본 공격 단계(1~4) · 추가 공격 단계(1~4) · 스킬 넷 강화했는지 · 악마 계급(0 하위 · 1 중위 · 2 고위 · 3 대악마) */
  nrBase?: number;
  nrExtra?: number;
  nrSkillUp?: boolean[];
  nrRank?: number;
  /** 강화마다 연속 실패 수 (0 기본 · 1 추가 · 2~5 스킬 1~4 · 6 승격) */
  nrFail?: number[];
  /** 마지막 강화 결과 (화면 알림: 틱 · 무엇 · 성공) */
  nrLast?: { t: number; what: number; ok: boolean };
}

export interface NoirEnemyState {
  /** 공허의 낙인이 붙은 동안 (끝나는 틱) */
  nrBrand?: number;
}

/** 효과: 칠흑 횡베기 · 무형의 난무 칼날 · 공허의 회전참 고리 · 절대 단절 직선 · 심연의 손아귀 · 공간 압축 · 마력 소멸 · 공허 포식 구체 · 흑영 돌진 잔상 · 시초의 공허 · 공허의 낙인 눈 · 검은 창 · 차원 절멸 균열 · 결계 붕괴 · 무한 심연 · 흑월 강림 달 · 태초의 종언 · 보라 충격파 · 터짐 · 레벨업 · 강화 성공 · 강화 실패 · 승격 */
export type NoirFx =
  | "nrSlash" | "nrFlurry" | "nrSpin" | "nrSever" | "nrGrasp" | "nrSqueeze" | "nrDrain" | "nrDevour"
  | "nrRush" | "nrOrigin" | "nrBrand" | "nrSpear" | "nrRift" | "nrBarrier" | "nrAbyss" | "nrMoon" | "nrEnd"
  | "nrWave" | "nrBurst" | "nrLevel" | "nrUpOk" | "nrUpFail" | "nrRankUp";
