// 시즌 3 단계별 보스·소품 수치 (enemyDefs가 커서 나눔, ENEMIES에 펼쳐 넣음)
import type { EnemyDef } from "./enemyDefs";

/** 시즌 3 단계별 보스가 쓰는 것: 지옥문 · 임프 · 달 조각 (sim/bossGatekeeper·bossMoonEater) */
export type S3PropKind = "hellgate" | "imp" | "moonshard" | "levprison";
/** 시즌 3 단계별 보스: 지옥문 수문장(1단계) · 쌍둥이 루(2단계, 레는 루가 데려옴) · 달을 삼키는 자(3단계) */
export type S3BossKind = "gatekeeper" | "twinlu" | "twinre" | "mooneater";
/** 시즌 3 라스트 보스 켈베로스가 갈라진 세 사람: 권귀(주먹) · 염희(불) · 검귀(대검) (sim/bossCerbTrio) */
export type CerbKind = "cerbfist" | "cerbflame" | "cerbblade";
export const CERB_TRIO: readonly CerbKind[] = ["cerbfist", "cerbflame", "cerbblade"];
/** 시즌 3 라스트 보스 레비아탄의 다음 모습: 심연고래(수면 아래) · 해왕(사람) (sim/bossLevWhale·bossLevKing) */
export type LevKind = "levwhale" | "levking";

export const S3_ENEMIES: Record<S3BossKind | S3PropKind | CerbKind | LevKind | "cerberus" | "leviathan" | "asmodeus", EnemyDef> = {
  /** 시즌 3 라스트 보스 켈베로스: 네 사슬에 묶인 세 머리 지옥견 (움직이지 않음, 흰 쉴드부터 깎음) → 쉴드가 깨지면 세 사람으로 갈라짐. 체력 = 세 사람 체력의 합 (sim/bossCerberus) */
  cerberus: { kind: "cerberus", hp: 5600, radius: 26, speed: 0, contactDamage: 20, gold: 100, boss: true },
  /** 켈베로스 페이즈 2: 권귀 (주먹, 가까이 따라옴) · 염희 (불, 위쪽에서 마법) · 검귀 (대검, 돌진) */
  cerbfist: { kind: "cerbfist", hp: 2000, radius: 12, speed: 0.6, contactDamage: 16, gold: 0, boss: true },
  cerbflame: { kind: "cerbflame", hp: 1600, radius: 11, speed: 0.35, contactDamage: 14, gold: 0, boss: true },
  cerbblade: { kind: "cerbblade", hp: 2000, radius: 12, speed: 0.55, contactDamage: 16, gold: 0, boss: true },
  /** 시즌 3 라스트 보스 레비아탄: 페이즈 1 심해룡 (방 위쪽, 물속 · 체력은 흰 막대 BOSS_LEVIATHAN_RULES.DRAGON) → 고래 → 해왕. 체력 = 고래 + 해왕 (sim/bossLeviathan) */
  leviathan: { kind: "leviathan", hp: 6100, radius: 26, speed: 0, contactDamage: 18, gold: 100, boss: true },
  /** 레비아탄 페이즈 2: 심연고래 (수면 아래에서 떠올라 공격, 잠수 중 무적) · 페이즈 3: 해왕 (걸어 다님) */
  levwhale: { kind: "levwhale", hp: 2600, radius: 22, speed: 1.1, contactDamage: 16, gold: 0, boss: true },
  levking: { kind: "levking", hp: 3500, radius: 13, speed: 0.55, contactDamage: 16, gold: 0, boss: true },
  /** 시즌 3 라스트 보스 아스모데우스의 화신체: 체력 줄 ×100 (한 줄 = 1%), 75줄·50줄에서 변신 궁극기 · 10줄 마지막 궁극기 (sim/bossAsmo) */
  asmodeus: { kind: "asmodeus", hp: 9600, radius: 14, speed: 0.5, contactDamage: 18, gold: 100, boss: true },
  /** 레비아탄 물감옥 (갇힌 사람 자리에 생김, 때려 깨면 풀려남) */
  levprison: { kind: "levprison", hp: 140, radius: 13, speed: 0, contactDamage: 0, gold: 0 },
  /** 시즌 3 1단계 보스: 지옥문 수문장 (지옥문 셋을 열고 넘나듦 · 문을 부수면 약해짐 · 다 부수면 무릎, sim/bossGatekeeper) */
  gatekeeper: { kind: "gatekeeper", hp: 450, radius: 12, speed: 0.42, contactDamage: 15, gold: 20, boss: true },
  /** 시즌 3 2단계 보스: 쌍둥이 루 (흰 가면·근접) · 레 (검은 가면·원거리). 핏줄로 이어짐 · 한쪽만 쓰러뜨리면 다시 일어남 (sim/bossTwins) */
  twinlu: { kind: "twinlu", hp: 420, radius: 8, speed: 0.55, contactDamage: 12, gold: 25, boss: true },
  twinre: { kind: "twinre", hp: 360, radius: 8, speed: 0.4, contactDamage: 10, gold: 0, boss: true },
  /** 시즌 3 3단계 보스: 달을 삼키는 자 (방이 어둡고 달이 차오름 · 보름달 월식은 달빛 기둥 안에서만 피함, sim/bossMoonEater) */
  mooneater: { kind: "mooneater", hp: 1250, radius: 11, speed: 0.3, contactDamage: 14, gold: 30, boss: true },
  /** 지옥문 (수문장이 엶): 맞힐 수 있음 · 움직이지 않음 · 열린 동안 임프가 나옴 */
  hellgate: { kind: "hellgate", hp: 60, radius: 10, speed: 0, contactDamage: 0, gold: 0 },
  /** 임프 (지옥문에서 나옴): 작고 빠름 · 불붙은 임프는 붙으면 터짐 */
  imp: { kind: "imp", hp: 14, radius: 5, speed: 0.62, contactDamage: 6, gold: 0 },
  /** 달 조각 (달을 삼키는 자): 깨면 그 자리에 달빛 기둥 */
  moonshard: { kind: "moonshard", hp: 40, radius: 7, speed: 0, contactDamage: 0, gold: 0 },
};
