// 시즌 3 단계별 보스·소품 수치 (enemyDefs가 커서 나눔, ENEMIES에 펼쳐 넣음)
import type { EnemyDef } from "./enemyDefs";

/** 시즌 3 단계별 보스가 쓰는 것: 지옥문 · 임프 · 달 조각 (sim/bossGatekeeper·bossMoonEater) */
export type S3PropKind = "hellgate" | "imp" | "moonshard";
/** 시즌 3 단계별 보스: 지옥문 수문장(1단계) · 쌍둥이 루(2단계, 레는 루가 데려옴) · 달을 삼키는 자(3단계) */
export type S3BossKind = "gatekeeper" | "twinlu" | "twinre" | "mooneater";

export const S3_ENEMIES: Record<S3BossKind | S3PropKind, EnemyDef> = {
  /** 시즌 3 1단계 보스: 지옥문 수문장 (지옥문 셋을 열고 넘나듦 · 문을 부수면 약해짐 · 다 부수면 무릎, sim/bossGatekeeper) */
  gatekeeper: { kind: "gatekeeper", hp: 450, radius: 12, speed: 0.42, contactDamage: 15, gold: 20, boss: true },
  /** 시즌 3 2단계 보스: 쌍둥이 루 (흰 가면·근접) · 레 (검은 가면·원거리). 핏줄로 이어짐 · 한쪽만 쓰러뜨리면 다시 일어남 (sim/bossTwins) */
  twinlu: { kind: "twinlu", hp: 300, radius: 8, speed: 0.55, contactDamage: 12, gold: 25, boss: true },
  twinre: { kind: "twinre", hp: 260, radius: 8, speed: 0.4, contactDamage: 10, gold: 0, boss: true },
  /** 시즌 3 3단계 보스: 달을 삼키는 자 (방이 어둡고 달이 차오름 · 보름달 월식은 달빛 기둥 안에서만 피함, sim/bossMoonEater) */
  mooneater: { kind: "mooneater", hp: 650, radius: 11, speed: 0.3, contactDamage: 14, gold: 30, boss: true },
  /** 지옥문 (수문장이 엶): 맞힐 수 있음 · 움직이지 않음 · 열린 동안 임프가 나옴 */
  hellgate: { kind: "hellgate", hp: 60, radius: 10, speed: 0, contactDamage: 0, gold: 0 },
  /** 임프 (지옥문에서 나옴): 작고 빠름 · 불붙은 임프는 붙으면 터짐 */
  imp: { kind: "imp", hp: 14, radius: 5, speed: 0.62, contactDamage: 6, gold: 0 },
  /** 달 조각 (달을 삼키는 자): 깨면 그 자리에 달빛 기둥 */
  moonshard: { kind: "moonshard", hp: 40, radius: 7, speed: 0, contactDamage: 0, gold: 0 },
};
