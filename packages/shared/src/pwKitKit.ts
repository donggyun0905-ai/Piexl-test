// 패왕전 스킬 표를 짧게 적는 도우미: 모양마다 기본 사거리·반경·그림 (pwKits1~3이 씀)
import type { WeaponId } from "./content";
import type { PwFxStyle, PwKit, PwShape, PwSkillDef } from "./pwSkillTypes";

const BASE: Record<PwShape, { range: number; radius: number; fx: PwFxStyle }> = {
  point: { range: 150, radius: 28, fx: "burst" },
  line: { range: 170, radius: 8, fx: "beam" },
  cone: { range: 0, radius: 56, fx: "wave" },
  self: { range: 0, radius: 44, fx: "spin" },
  dash: { range: 100, radius: 14, fx: "dash" },
  blink: { range: 110, radius: 0, fx: "blink" },
  summon: { range: 120, radius: 0, fx: "summon" },
};

type Opt = Partial<Omit<PwSkillDef, "icon" | "shape" | "cd" | "tint">>;

/** 스킬 하나: 아이콘 무기 · 모양 · 대기(초) · 색 · 나머지 */
export function sk(icon: WeaponId, shape: PwShape, cd: number, tint: string, o: Opt = {}): PwSkillDef {
  const b = BASE[shape];
  return { icon, shape, cd, tint, range: b.range, radius: b.radius, fx: b.fx, ...(shape === "cone" ? { arc: 0.8 } : {}), ...(shape === "dash" ? { speed: 6 } : {}), ...o };
}

/** 캐릭터 하나: 평타 배율 · 스킬 넷 */
export const kit = (basic: number, a: PwSkillDef, b: PwSkillDef, c: PwSkillDef, d: PwSkillDef): PwKit => ({ basic, skills: [a, b, c, d] });

/** 상태이상 틱 (60틱 = 1초) */
export const SEC = 60;
