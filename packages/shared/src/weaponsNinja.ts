// 닌자 전용 무기: 무기마다 던지기·베기 방식(shade)과 그림자가 나오는 데 필요한 표식 수(marks)가 다름 (sim/ninja·shades)
// 수리검 등으로 적에게 표식을 쌓다가 다 차면 그 적의 그림자에서 그림자 분신이 튀어나와 벰
import type { WeaponDef } from "./content";

/**
 * shuriken 수리검 · kunai 쿠나이(관통) · fan 부채 수리검(3발) · ring 환영진(적 둘레 9곳에서 그림자가 가운데로) · sickle 사슬낫(넓게 베기)
 * smoke 연막탄(구름 속 적에게 표식·둔화) · clone 분신술(분신 둘이 같이 던짐) · blade 닌자도(빠른 베기, 그림자는 X자 베기)
 * fuma 풍마 수리검(큰 수리검이 뚫고 되돌아옴) · needle 그림자 꿰매기(맞은 적이 잠깐 묶임, 그림자는 땅에서 가시)
 */
export type ShadeStyle = "shuriken" | "kunai" | "fan" | "ring" | "sickle" | "smoke" | "clone" | "blade" | "fuma" | "needle";

export const NINJA_WEAPONS = {
  shuriken: { id: "shuriken", kind: "shade", damageMul: 0.64, attackSpeed: 3, range: 110, projectileSpeed: 3.6, shade: "shuriken", marks: 3, exclusive: "ninja" },
  kunai: { id: "kunai", kind: "shade", damageMul: 0.98, attackSpeed: 2.1, range: 130, projectileSpeed: 4.6, pierce: 1, shade: "kunai", marks: 2, exclusive: "ninja" },
  fanstar: { id: "fanstar", kind: "shade", damageMul: 0.38, attackSpeed: 2.2, range: 95, projectileSpeed: 3.4, shots: 3, spread: [0.9659, 0.2588], shade: "fan", marks: 4, exclusive: "ninja" },
  phantomring: { id: "phantomring", kind: "shade", damageMul: 0.64, attackSpeed: 2.4, range: 100, projectileSpeed: 3.6, shade: "ring", marks: 5, exclusive: "ninja" },
  kusarigama: { id: "kusarigama", kind: "shade", damageMul: 0.98, attackSpeed: 1.8, range: 44, projectileSpeed: 0, arcCos: 0.1, shade: "sickle", marks: 3, exclusive: "ninja" },
  smokebomb: { id: "smokebomb", kind: "shade", damageMul: 0.42, attackSpeed: 0.9, range: 100, projectileSpeed: 0, blast: 26, shade: "smoke", marks: 3, exclusive: "ninja" },
  shadowclone: { id: "shadowclone", kind: "shade", damageMul: 0.47, attackSpeed: 2.4, range: 105, projectileSpeed: 3.6, shade: "clone", marks: 3, exclusive: "ninja" },
  ninjato: { id: "ninjato", kind: "shade", damageMul: 0.77, attackSpeed: 2.4, range: 28, projectileSpeed: 0, arcCos: 0.4, shade: "blade", marks: 3, exclusive: "ninja" },
  fuma: { id: "fuma", kind: "shade", damageMul: 1.1, attackSpeed: 1.1, range: 120, projectileSpeed: 2.6, shade: "fuma", marks: 3, exclusive: "ninja" },
  kagenui: { id: "kagenui", kind: "shade", damageMul: 1.02, attackSpeed: 2, range: 120, projectileSpeed: 4.2, shade: "needle", marks: 3, exclusive: "ninja" },
} as const satisfies Record<string, WeaponDef>;
