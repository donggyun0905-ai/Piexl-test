// 효과(그리기 전용)·위험 표시·잠시 뒤 폭발 타입
import type { SeaFx } from "./waveTypes";
import type { MiryuFx } from "./miryuTypes";
import type { EnemyKind } from "../content";

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
/** 차원의 순례자 */
export type PilgrimFx = "pgSlash" | "pgFire" | "pgBonk" | "pgBeam" | "pgPush" | "pgRing" | "pgSand" | "pgBlast" | "pgFall" | "pgKey" | "pgBag" | "pgPlant" | "pgHeal";
export type ZeusFx = "zsSky" | "zsArc" | "zsOverload" | "zsDescend" | "zsAegis" | "zsClap" | "zsSpear";
export type VoyagerFx = "vyFlip" | "vyLoose" | "vyCrit" | "vyBeam" | "vyChain" | "vyRain" | "vyMeteor" | "vyBoulder" | "vyHorse" | "vyWind" | "vyShield" | "vySiren" | "vyTide" | "vyWhirl" | "vyBite" | "vyBolt" | "vyPig" | "vyIsland" | "vySun";
/** 풍류사 (sim/pungryu·pungryuVerse·pungryuPerks) */
export type PungFx = "puVerse" | "puPillar" | "puWave" | "puStarLine" | "puWind" | "puReap" | "puFrost" | "puGoldStream" | "puSword" | "puTeleport" | "puClone" | "puDisguise" | "puFlute";
/** 레오 (sim/leo·leoPerks): 발톱(width 0/1 왼·오) · 번개 물기 · 사자후(width 1 = 우레 포효) · 낙뢰(tint gem·storm·roar) · 연쇄(toX·toY) · 도약(toX·toY) · 방전(width 1 = 갑주) · 보석 빛 */
export type LeoFx = "leClaw" | "leBite" | "leRoar" | "leBolt" | "leChain" | "lePounce" | "leSpark" | "leGem";
/** 오닉스 (sim/onyx·onyxGems): 광륜·빛줄기(toX·toY) · 날아오름·내려앉음(width 1 = 낙하 충격) · 보석 일곱(홍옥 불기둥·호박 운석·황옥 번개·비취 덩굴·청옥 서리(+적마다 oxFrost)·남옥 빛줄기·자수정 공허) · 공명 · 반격 · 꼬리 */
export type OnyxFx = "oxHalo" | "oxBeam" | "oxLift" | "oxLand" | "oxRuby" | "oxAmber" | "oxTopaz" | "oxJade" | "oxSapph" | "oxFrost" | "oxAqua" | "oxAmeth" | "oxReson" | "oxShard" | "oxDust";
/** 펜리르 (sim/fenrir·fenrirStats): 1·2타 베기(width 1 = 되베기) · 지면 검기 출발·바닥 자국(width 1 = 큰 검기) · 난도 고리·베기 · 뛰어오름·착지(width 1 = 울부짖음) · 광륜 · 회피 잔상 · 사냥 */
export type FenrirFx = "fnBite" | "fnWaveGo" | "fnScar" | "fnRing" | "fnCut" | "fnJump" | "fnLand" | "fnHalo" | "fnDodge" | "fnHunt";
/** 이클립스 (sim/eclipse·eclipseZone): 태양 직각 검격(width 1~4타)·5타 십자 · 일식 베기(width 0 내려·1 올려·2 초승달)·회전·돌진·뛰어오름·낙하 · 맞음 불꽃(width 1 = 일식) · 영역 불꽃 · 치유의 빛 · 바뀜(width 1 = 일식이 됨)·바뀜 끝 · 개기일식 */
export type EclipseFx = "ecSlash" | "ecCross" | "ecHew" | "ecSpin" | "ecDash" | "ecJump" | "ecSlam" | "ecSpark" | "ecBurn" | "ecHeal" | "ecShift" | "ecShiftEnd" | "ecTotal";
/** 토르켄 (sim/thorken·thorkenBall·thorkenStorm) */
export type ThorFx = "tkAnchor" | "tkSweep" | "tkThrow" | "tkClap" | "tkSplash" | "tkReel" | "tkStormCall" | "tkBolt" | "tkBell" | "tkTide" | "tkVolt" | "tkGeyser" | "tkFrost";
/** 리바이어 (sim/levia·leviaWhale): 1타 창·고래 날개 · 2타 회전·고래 감기·대돌격 · 3타 충격파 · 고래 도약 · 번개 · 노래 · 물뿜기 · 산호 터짐 */
export type LeviaFx = "lvSwing" | "lvFin" | "lvThrust" | "lvTailSweep" | "lvSpin" | "lvOrbit" | "lvCharge" | "lvQuake" | "lvBreach" | "lvBolt" | "lvSong" | "lvGush" | "lvBurst";
export type SecretFx = ThorFx | LeviaFx | SeaFx | MiryuFx | VoyagerFx | ZeusFx | PilgrimFx | PungFx | LeoFx | OnyxFx | FenrirFx | EclipseFx | "clMove" | "mnSwing" | "mnCrack" | "mnErupt" | "mnRock" | "mnCave" | "mnBoom" | "mnShatter" | "mnFall" | "mnDig" | "mnBurst" | "mnPull" | "mnGem" | "mnPillar" | "mnCanary";
/** 떠돌이 기습 쏨·맞음 · 파수꾼 반격 베기 (sim/origin) · 작업대 성공·실패·파괴 (sim/station) */
/** 히든 아이템·순례자 (sim/hiddenPerks·hiddenUse·pilgrim) */
export type HiddenFx = "hdDice" | "hdChest" | "hdCurse" | "hdFreeze" | "hdWarp" | "hdQuake" | "hdMirror" | "hdLeaf" | "hdAether" | "hdMeteor" | "hdScroll" | "hdGate" | "hdPortal" | "hdShow" | "hdText";
/** 옛 제국의 왕(바스러져가는 왕관)·몰락한 왕 대검 (sim/kingBlade, tint = 붉은빛·푸른빛): X자 베기(dir, width ±1 = 사선 방향) · 길어지는 검기(toX·toY) · 내리꽂기 · 불꽃 선(toX·toY) · 불기둥 · 영혼 빛줄기(toX·toY) · 변신 */
export type KingFx = "kgSlash" | "kgWave" | "kgPlant" | "kgLine" | "kgPillar" | "kgSoul" | "kgForm" | LuxFx;
/** 빛의 사도: "+" 빛의 검 · 칼날 휘두름 · 빛의 조각이 몸에 듦 · 성장 · 빛의 적 등장 */
export type LuxFx = "lxCross" | "lxSwing" | "lxShard" | "lxGrow" | "lxFoe";
export type OriginFx = "ogShot" | "ogHit" | "ogCounter" | "stOk" | "stFail" | "stBreak";
/** 비밀의 방 (sim/secret·devil·gamble·auction): 벽 무너짐 · 악마 거래·거절 · 절규 범위 · 리퍼 낫 · 야바위 당첨·꽝 · 경매 입찰·낙찰·돈 날림 */
export type VaultFx = "srCrumble" | "srDeal" | "srRefuse" | "srScream" | "srScythe" | "srWin" | "srLose" | "srBid" | "srSold" | "srMoney";
export type EffectKind = VaultFx | OriginFx | KingFx | HiddenFx | ImugiFx | ApostleFx | DuckFx | SecretFx | "stPlace" | "stComet" | "stBurst" | "coinGet" | "sandspin" | "thrust" | "legend" | "swing" | "hit" | "burst" | "blast" | "beam" | "bolt" | "flame" | "mark" | "ring" | "bloom" | "streak" | "verdant" | "slam" | "cleave" | "ghostgun" | "lob" | "scratch" | "tigerScratch" | "tagSwap" | "tagSpecial" | "titanSlam" | "titanSmash" | "titanDrill" | "titanParry" | TagFx | OniFx | "catnip" | "scWord" | "gaiaSwap" | "elPillar" | "elWalls" | "elSword" | "elFist" | "renSlam" | "renRock" | "renHead" | "renStone" | "renDrop" | "renCrush" | "mRaid" | "mEvo" | "bearSwipe" | "flyRake" | "spBeam" | "gsCast" | "plBurst" | "plMark" | "plSwarmBite" | "plPuff" | "plGrip" | "slSlash" | "slChop" | "slSpin" | "slBurst" | "slLine" | "slRage" | "slX" | "slNova" | "slReap" | "slSky" | "slRaid" | "slGrand" | "eaSlash" | "eaBite" | "eaAbyss" | "eaSpear" | "eaX" | "eaLurk" | "eaEat" | "mkGuard" | "smGas" | "smBurst" | "adBeam" | "adLaunch" | "adSat" | "adSword" | "rdPulse" | "rdSmash" | "rdStab" | "rdSpin" | "rdFlame" | "rdLance" | "rdCut" | "bmBoom" | "bmStar" | "afBlast" | "afMuzzle" | "afCraft" | "cySlash" | "cyWire" | "cyMantis" | "cyPunch" | "cySpin" | "cyHack" | "cyEmp" | "cyAccel" | "gsFist" | "gsCube" | "gsChant" | "gsArrow" | "gsBeam" | "gsGas" | "gsRune" | "mgSpell" | "chCollapse" | "trSnipe" | "trBeam" | "trSkill" | "fgCross" | "fgFlash" | "fgBeam" | "fgNova" | "fgSlash" | "fgPillar" | "fgAwaken" | "rmStab" | "rmDodge" | "rmFlurry" | "rmEclipse" | "trWake" | "trCurse" | "trChest" | "trOpen" | "trSpawn" | "alChoose" | "wdSlash" | "wdIai" | "wdCut" | "wdPull" | "wdTempest" | "wdSharp" | "skLine" | "skRend" | "skBleed" | "skReload" | "elLight" | "elBang" | "elWell" | "pwFx" | "pwWarn" | "awaken" | BossFx | MedicFx;
export type BossFx = "staff" | "staffSpin" | "bslash" | "stab" | "vine" | "gleam" | "rgleam" | "holy" | "pillar" | "meteor" | "dark" | "fake" | "scythe" | "spike" | "parry" | "memory";

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
  /** 패왕전 스킬 그림(pwFx·pwWarn): 모양 번호(PW_FX_STYLES) · 부채꼴 반각 */
  style?: number;
  arc?: number;
  /** 패왕전 궁극기 그림 (소리·이름 알림, 쓴 사람은 seat) */
  ult?: boolean;
  /** 패왕전 스킬 그림 위에 얹는 캐릭터 느낌 (불·얼음·번개·독·그림자·빛·피·자연·영혼·기계·바람·시간·충격·칼날·야수·쥐, pwKits.PW_MOTIF) */
  motif?: string;
  /** 협동: 만든 사람 자리 (그 사람 둘레에 그림) */
  seat?: number;
  /** 적의 위험 표시가 터진 것 (그리기: 시즌 2 층 보스 모양) */
  foe?: boolean;
  /** 그리기용: 만든 적 종류 (박격포 등) */
  from?: string;
}

/** 적이 남긴 위험 표시: tick이 되면 범위 안 플레이어에게 피해. 기본은 원, dir·arc가 있으면 부채꼴, toX·toY가 있으면 굵기 width인 선 */
export interface Hazard {
  /** 그리기용: 만든 적 종류 (박격포 등) */
  from?: string;
  /** 공격한 적 종류 (맞으면 그 적의 상태이상, sim/foeStatus) */
  by?: EnemyKind;
  /** 예고만: 때가 되어도 터지지 않고 만든 적이 지울 때까지 남음 (땅 물고기, 최대 5초) */
  hold?: boolean;
  /** 만든 적 id: 터지기 전에 그 적이 쓰러지면 사라짐 (땅 물고기 착지) */
  owner?: number;
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
