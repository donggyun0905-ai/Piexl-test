// 레이븐 상태 타입 (sim/raven·rvKit·rvProcs·rvUnits·rvSkills). 모두 선택 값 (예전 저장에는 없음)

/** 움직이며 닿는 적을 한 번씩 때리는 기물: 폰(진군) · 룩(밀어냄) · 검격(퀸 칙령) · 승격 폰(가까운 적을 쫓다 퀸으로 폭발) · 금빛 폰(갬빗) */
export type RvUnitKind = "pawn" | "rook" | "blade" | "promo" | "gold";

/** 기물 하나: 자리 · 방향 · 빠르기 · 남은 틱 · 지난 틱 · 반지름 · 피해 · 맞힌 적 */
export interface RvUnit {
  kind: RvUnitKind;
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  dx: number;
  dy: number;
  spd: number;
  t: number;
  age: number;
  r: number;
  dmg: number;
  hit: number[];
}

/** 잠시 뒤 터지는 공격: area 범위 · pillar 퀸 빛기둥(체크 터뜨림) · beam 비숍 대각선 둘 · rook 룩 돌진 시작 · decree 퀸 8방향 검격 · cross 그랜드 십자 빛 */
export type RvEventKind = "area" | "pillar" | "beam" | "rook" | "decree" | "cross";

/** 예약 공격: 터지는 틱 · 종류 · 자리 · 방향 · 반지름(너비) · 피해 · 기절 틱 · 따라갈 적 · 그림(효과 이름·모양) */
export interface RvEvent {
  at: number;
  kind: RvEventKind;
  x: number;
  y: number;
  dx: number;
  dy: number;
  r: number;
  dmg: number;
  stun?: number;
  id?: number;
  fx?: string;
  style?: number;
}

export interface RavenPlayerState {
  /** 다시 공격까지 · 방 · 마지막으로 공격한 틱(그림) · 다음 차례(0 킹 · 1 퀸) */
  rvCd?: number;
  rvRoom?: number;
  rvAtkAt?: number;
  rvStep?: number;
  /** 움직이는 기물 · 예약 공격 */
  rvUnits?: RvUnit[];
  rvEvents?: RvEvent[];
  /** 스킬 1~4 남은 대기 틱 */
  rvSkillCd?: number[];
  /** 그랜드 체크메이트가 끝나는 틱 (방 가득 체스판 그림) · 캐슬링 방어막이 켜진 틱(그림) */
  rvGrandEnd?: number;
  rvCastleAt?: number;
  /** 지난 틱까지의 처치 수 (갬빗) · 확률 굴린 수 (시드) */
  rvKills?: number;
  rvRolls?: number;
}

export interface RavenEnemyState {
  /** 체크 표식이 끝나는 틱 */
  rvCheck?: number;
}

/** 효과: 킹 내려찍기 · 퀸 빛기둥 · 체크메이트(체크 터짐) · 체크 붙음 · 나이트 도약(x,y → toX,toY) · 나이트 내려찍기 · 비숍 대각선 · 퀸 칙령 · 킹 심판(예고 → 짓누름)
 * 승격 퀸 폭발 · 체스판 기둥 · 체크메이트 포위(기물 8) · 포위 한 대 · 캐슬링(x,y → toX,toY) · 룩 충격파 · 그랜드 기물 한 대(style 기물) · 그랜드 십자 빛 · 그랜드 시작 · 폰 맞음 */
export type RavenFx = "rvSlam" | "rvPillar" | "rvMatePop" | "rvCheck" | "rvKnight" | "rvKnightLand" | "rvBeam" | "rvDecree" | "rvJudge" | "rvPromo" | "rvBoardHit" | "rvMateRing" | "rvMateHit" | "rvCastle" | "rvRookShock" | "rvGrandPiece" | "rvCross" | "rvGrand" | "rvPawnHit";
