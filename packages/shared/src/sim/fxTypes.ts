// 효과(그리기 전용)·위험 표시·잠시 뒤 폭발 타입

/**
 * 의사 효과: slash 메스 교차 베기 · cut 베인 자국 · tube 수혈 튜브 · ecg 제세동기 심전도 · zap 전기 불꽃 · pole 링거 폴대 회전
 * · puff 가스 퍼짐 · pillpop 알약 터짐 · medburst 구급 키트 폭발 · lash 붕대 채찍 · stitch 봉합 바느질 · plus 회복(width 1 = 보호막) · antibody 항체 반사 · bump 구급차 충돌
 */
export type MedicFx = "slash" | "cut" | "tube" | "ecg" | "zap" | "pole" | "puff" | "pillpop" | "medburst" | "lash" | "stitch" | "plus" | "antibody" | "bump";

/**
 * beam 레이저 · bolt 번개 · flame 플라즈마 부채꼴 · mark 위성 포 낙하 표시 · ring 자기장 장판(follow)·해머·지뢰 충격파 · bloom 벚꽃 만개
 * streak 원소술사 검·별이 날아간 자국(toX·toY) · verdant 풀 원소 범위 · slam 중력·갓 핸드·격투가 내려찍기
 * cleave 가디언 휘두르기 (x·y에서 dir 쪽 부채꼴) · ghostgun 거너 건 마스터 유령 총 · lob 수류탄이 날아감(toX·toY)
 * tagSwap 버려진 자들 교대(dirX = 들어온 아이) · tagSpecial 버려진 자들 특수기 · titanSlam 거인 내려침 · titanSmash 거인 기계팔 강타
 * gaiaSwap 이드라 가이아 모습 바꿈(dirX = 새 모습) · 장로 진: elPillar 불·빛기둥(tint) · elWalls 양쪽 벽 · elSword 떨어지는 검 · elFist 바위 주먹 · renSlam 렌 토목(dirX = 차례) · renRock 렌 돌 던지기(dir) · renHead 용머리 · renStone 머리 위 토목(dirX = 쌓인 수) · renDrop 큰 돌 · renCrush 양쪽 토목 짓뭉개기 · mRaid 변희 공중 습격 선(toX·toY, dirX 1 = 불) · mEvo 변희 각성 기술(dirX = 동물 순번) · bearSwipe 곰 할퀴기 · flyRake 플라이 끝 할퀴기 · spBeam 정령 공격 줄(toX·toY, tint) · gsCast 대정령 기술(dirX = 대정령 순번, toX·toY = 대정령 자리) · gsFist 떨어지는 돌주먹·gsCube 심연 입방체(dirY = 떨어지기까지 틱) · gsChant 실반가드 주문 · gsArrow 거대 마법 화살·gsBeam 엄브라 레이저(toX·toY) · gsGas 독가스 구름 · gsRune 대정령 머리 위 마법 문자(dirX = 대정령 순번) · titanDrill 드릴 팔 찌르기(dir, size 길이) · titanParry 거인 패링 성공
 * 버려진 자들 특수기: tagDash 그림자 질주 자국(toX·toY) · tagCut 베기 X자 · tagMeteor 하늘 찍기 충격 · tagShove 밀침 · tagFlash 총구 불꽃(dir) · tagMiss 조합 틀림 ✕
 * scratch 야수·고양이 할퀸 자국 · tigerScratch 호랑이 발톱·호랑이 변신 할퀸 자국(굵은 네 줄) · catnip 캣닢 구름 · sandspin 베두인이 차크람을 주우며 모래와 함께 한 바퀴 벰 · thrust 장수 찌르기(toX·toY, width) · legend 장수 필살기 이름(dirX = generalLegends.LEGENDS 순번)
 * 보스 공격: bslash 부채꼴 베기(dir, size 반경, width 부채꼴 cos) · stab 찌르기(toX·toY, width 굵기) · vine 솟아오르는 덩굴(toX·toY) · gleam 빛나는 검기(toX·toY) · holy 빛기둥
 */
/** 이무기: 청룡·여의주 번개 · 적룡 폭발 · 성룡 빛 · 암룡 늑대 이빨(dirX = 몇 번째) · 천룡 하늘 · 콤보 72 기운이 차오름 · 콤보 108 용이 됨 */
export type ImugiFx = "imBolt" | "imBoom" | "imLight" | "imBite" | "imSky" | "imRise" | "imAwaken";
/** 악의 사도: 떨어지는 십자가 · 가면 검은 오라 · 색욕 광선(toX·toY) · 탐욕 황금 · 교만 중력 · 나태 잠 · 영혼 먹기 · 역천 불꽃 */
export type ApostleFx = "apCross" | "apAura" | "apBeam" | "apCoin" | "apGrav" | "apSleep" | "apSoul" | "apFlame";
/** 오리: 꽥 음파(dir, size 반경, width 부채꼴 cos, follow) · 물보라 · 큰 꽥 · 황금알이 날아감(toX·toY) */
export type DuckFx = "quack" | "splash" | "bigQuack" | "duckEgg";
/** 오니 추가 공격: 번개 부채꼴(dir, size 반경, width cos, tint) · 불꽃 · 금화 · 한파 · 어둠 · 빛 기둥 · 해일 · 물보라(toX·toY) · 영령 · 신인족 각성 · 방망이 휘두르기 */
export type OniFx = "oBolt" | "oFlame" | "oCoins" | "oFrost" | "oDark" | "oPillar" | "oWave" | "oSplash" | "oSpirit" | "oGod" | "oSwing";
/** 버려진 자들 특수기·조합 틀림 */
export type TagFx = "tagDash" | "tagCut" | "tagMeteor" | "tagShove" | "tagFlash" | "tagMiss";
/** 시즌 2 히든 (에테르 광부 · 운명의 여행자 · 제우스) */
export type ZeusFx = "zsSky" | "zsArc" | "zsOverload" | "zsDescend" | "zsAegis" | "zsClap" | "zsSpear";
export type VoyagerFx = "vyFlip" | "vyLoose" | "vyCrit" | "vyBeam" | "vyChain" | "vyRain" | "vyMeteor" | "vyBoulder" | "vyHorse" | "vyWind" | "vyShield" | "vySiren" | "vyTide" | "vyWhirl" | "vyBite" | "vyBolt" | "vyPig" | "vyIsland" | "vySun";
export type SecretFx = VoyagerFx | ZeusFx | "mnSwing" | "mnCrack" | "mnErupt" | "mnRock" | "mnCave" | "mnBoom" | "mnShatter" | "mnFall" | "mnDig" | "mnBurst" | "mnPull" | "mnGem" | "mnPillar" | "mnCanary";
export type EffectKind = ImugiFx | ApostleFx | DuckFx | SecretFx | "stPlace" | "stComet" | "stBurst" | "coinGet" | "sandspin" | "thrust" | "legend" | "swing" | "hit" | "burst" | "blast" | "beam" | "bolt" | "flame" | "mark" | "ring" | "bloom" | "streak" | "verdant" | "slam" | "cleave" | "ghostgun" | "lob" | "scratch" | "tigerScratch" | "tagSwap" | "tagSpecial" | "titanSlam" | "titanSmash" | "titanDrill" | "titanParry" | TagFx | OniFx | "catnip" | "scWord" | "gaiaSwap" | "elPillar" | "elWalls" | "elSword" | "elFist" | "renSlam" | "renRock" | "renHead" | "renStone" | "renDrop" | "renCrush" | "mRaid" | "mEvo" | "bearSwipe" | "flyRake" | "spBeam" | "gsCast" | "plBurst" | "plMark" | "plSwarmBite" | "plPuff" | "plGrip" | "slSlash" | "slChop" | "slSpin" | "slBurst" | "slLine" | "slRage" | "slX" | "slNova" | "slReap" | "slSky" | "slRaid" | "slGrand" | "eaSlash" | "eaBite" | "eaAbyss" | "eaSpear" | "eaX" | "eaLurk" | "eaEat" | "mkGuard" | "smGas" | "smBurst" | "adBeam" | "adLaunch" | "adSat" | "adSword" | "rdPulse" | "rdSmash" | "rdStab" | "rdSpin" | "rdFlame" | "rdLance" | "rdCut" | "bmBoom" | "bmStar" | "afBlast" | "afMuzzle" | "afCraft" | "cySlash" | "cyWire" | "cyMantis" | "cyPunch" | "cySpin" | "cyHack" | "cyEmp" | "cyAccel" | "gsFist" | "gsCube" | "gsChant" | "gsArrow" | "gsBeam" | "gsGas" | "gsRune" | "mgSpell" | "chCollapse" | "trSnipe" | "trBeam" | "trSkill" | "fgCross" | "fgFlash" | "fgBeam" | "fgNova" | "fgSlash" | "fgPillar" | "fgAwaken" | "rmSlash" | "rmVanish" | "rmAppear" | "rmEcho" | "wdSlash" | "wdIai" | "wdCut" | "wdPull" | "wdTempest" | "wdSharp" | "skLine" | "skRend" | "skBleed" | "skReload" | "elLight" | "elBang" | "elWell" | BossFx | MedicFx;
export type BossFx = "bslash" | "stab" | "vine" | "gleam" | "rgleam" | "holy" | "pillar" | "meteor" | "dark" | "fake" | "scythe" | "spike" | "parry" | "memory";

/** 그리기 전용 효과 (게임 결과에는 영향 없음) */
export interface EffectState {
  kind: EffectKind;
  x: number;
  y: number;
  dirX: number;
  dirY: number;
  size: number;
  ticks: number;
  maxTicks: number;
  /** 레이저·번개: 끝 자리, 굵기(절반). follow면 시작 자리가 플레이어를 따라감 */
  toX?: number;
  toY?: number;
  width?: number;
  follow?: boolean;
  /** 색 (장수 필살기마다 다른 빛깔) */
  tint?: string;
  /** 협동: 만든 사람 자리 (그 사람 둘레에 그림) */
  seat?: number;
}

/** 적이 남긴 위험 표시: tick이 되면 범위 안 플레이어에게 피해. 기본은 원, dir·arc가 있으면 부채꼴, toX·toY가 있으면 굵기 width인 선 */
export interface Hazard {
  /** 터지는 틱 */
  tick: number;
  /** 표시가 뜬 틱 (그리기용) */
  start: number;
  x: number;
  y: number;
  radius: number;
  damage: number;
  /** 부채꼴: 바라보는 쪽 · 부채꼴 cos (-1 = 한 바퀴) */
  dirX?: number;
  dirY?: number;
  arc?: number;
  /** 선: 끝 자리 · 굵기(반) */
  toX?: number;
  toY?: number;
  width?: number;
  /** 터질 때 효과 (없으면 원 폭발) */
  fx?: BossFx;
  /** 방 전체 심판 (갓이터): black = 그 순간 움직이고 있으면 맞음 · red = 가만히 있으면 맞음 */
  still?: "black" | "red";
  /** 대시 중이어도 맞음 (거대 매 필살기) */
  noDodge?: boolean;
  /** 터지기 직전 하얗게 깜박여 대시 시점을 알려 줌 (강해진 제천대성) */
  cue?: boolean;
}

/** 잠시 뒤 터지는 폭발 (메아리 폭발) */
export interface PendingBlast {
  tick: number;
  x: number;
  y: number;
  radius: number;
  damage: number;
}
