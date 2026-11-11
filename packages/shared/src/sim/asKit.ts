// 아수라 공용 도우미 (sim/asura·asHit·asMoves·asAwake·classTaken가 같이 씀): 주먹 크기·피해 배율·귀진 표식·받는 피해
// 가벼운 것만 불러옴 (classTaken이 부름)
import { ASURA_PERKS as K } from "../itemsAsura";
import type { EnemyState, RunState } from "./types";
import { reachOf } from "./util";

type P = RunState["player"];

export const isAsura = (p: P) => p.characterId === "asura";
export const hasAs = (p: P, id: string) => p.passives.includes(id as never);

/** 주먹 크기 배율 (사거리 증가 · 귀수 확장) */
export const fistSize = (p: P) => reachOf(p) * (hasAs(p, "asReach") ? K.asReach.size : 1);

/** 아수라 피해 배율 (분노의 팔: 체력 절반 아래) */
export const asDmgMul = (p: P) => (hasAs(p, "asRage") && p.hp < p.stats.maxHp * K.asRage.below ? K.asRage.mul : 1);

/** 귀진 영역 반지름 (사거리 증가만큼) */
export const asFieldR = (p: P) => K.asField.r * reachOf(p);

/** 귀진 표식이 붙은 적인지 (영역 안에 있던 지난 틱까지) */
export const asMarked = (s: RunState, e: EnemyState) => (e.asMark ?? -9) >= s.tick - 1;

/** 표식 붙은 적이 받는 피해 배율 (방어력 감소) */
export const asuraTaken = (s: RunState, e: EnemyState) => (asMarked(s, e) ? 1 + K.asField.taken : 1);

/** 아수라가 받는 피해 배율 (귀갑) */
export const asuraHurtMul = (p: P) => (isAsura(p) && hasAs(p, "asShell") ? K.asShell.taken : 1);
