// 패왕전에서만 바꾼 기본 공격 (player가 무기 대신 부름): 베두인 둘레 한 번 베기 · 학살자 대낫 베기만 · 잔영 뒤로 물러나 그림자에서 찌르고 5초 쉼
// 맞는 상대·그림은 스킬과 같은 방식(resolveCast). 피해는 공격력 × 배율
import { TICK_RATE } from "../constants";
import type { PwSkillDef } from "../pwKits";
import { seatNo } from "./party";
import { addBuff, resolveCast, skillPow } from "./pwSkillHit";
import type { PlayerState, RunState } from "./types";
import { keepInRoom, roomGrid } from "./util";

type Tick = (s: RunState, want: boolean, speed: number) => void;

/** 이 파일의 수치 */
const R = {
  bedouin: { radius: 42, mul: 1 },
  slayer: { radius: 48, arc: 0.9, mul: 1.1 },
  remnant: { back: 40, delay: 14, radius: 46, arc: 0.7, mul: 3.2, rest: 5 * TICK_RATE, hide: 50 },
};
export { R as PW_BASIC_RULES };

/** 기본 공격 한 번 (지금 자리가 쓴 사람). dmgMul = 공격력 배율 */
function strike(s: RunState, shape: "self" | "cone", radius: number, dmgMul: number, dx: number, dy: number, tint: string, fx: PwSkillDef["fx"], arc?: number, x = s.player.x, y = s.player.y): void {
  const p = s.player;
  const def: PwSkillDef = { icon: p.weaponId as PwSkillDef["icon"], shape, cd: 0, tint, fx, range: 0, radius, arc, hit: { dmg: (p.stats.damage * dmgMul) / skillPow(p) } };
  resolveCast(s, def, { seat: seatNo(s), k: -1, x, y, dx, dy, t: 0, left: 1 });
}

const cool = (p: PlayerState, speed: number) => (p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed)));

const BASICS: Partial<Record<string, Tick>> = {
  bedouin: (s, want, speed) => {
    const p = s.player;
    if (!want || p.attackCooldown > 0) return;
    cool(p, speed);
    strike(s, "self", R.bedouin.radius, R.bedouin.mul, p.faceX, p.faceY, "#ffd070", "spin");
  },
  slayer: (s, want, speed) => {
    const p = s.player;
    if (!want || p.attackCooldown > 0) return;
    cool(p, speed);
    strike(s, "cone", R.slayer.radius, R.slayer.mul, p.faceX, p.faceY, "#ff2a3a", "slash", R.slayer.arc);
  },
  // 잔영: 누르면 뒤로 물러나며 그림자(안 보임) → 잠시 뒤 앞을 크게 찌름 → 5초 동안 기본 공격 못 함
  remnant: (s, want) => {
    const p = s.player;
    const rm = (p.pwRm ??= { t: 0 });
    if (rm.t > 0 && --rm.t === 0) {
      strike(s, "cone", R.remnant.radius, R.remnant.mul, p.faceX, p.faceY, "#8a8ac8", "slash", R.remnant.arc);
      p.attackCooldown = R.remnant.rest;
      return;
    }
    if (!want || p.attackCooldown > 0 || rm.t > 0) return;
    const b = { x: p.x - p.faceX * R.remnant.back, y: p.y - p.faceY * R.remnant.back, prevX: p.x, prevY: p.y, r: p.r };
    keepInRoom(b, roomGrid(s));
    [p.x, p.y] = [b.x, b.y];
    addBuff(p, { icon: "rmDagger", shape: "self", cd: 0, tint: "#5a5a8a", fx: "blink", range: 0, radius: 0, buff: { ticks: R.remnant.hide, hide: true } } as PwSkillDef);
    rm.t = R.remnant.delay;
    p.attackCooldown = R.remnant.rest;
  },
};

/** 패왕전 사람: 자동 조준 없이 마우스 자리 (사거리까지). 자동 조준(AI)·다른 모드는 null */
export function manualAim(s: RunState, range: number): { x: number; y: number } | null {
  const p = s.player;
  if (!s.pvp || p.pwAimD === undefined) return null;
  const d = Math.min(range, p.pwAimD);
  return { x: p.x + p.faceX * d, y: p.y + p.faceY * d };
}

/** 패왕전에서 이 캐릭터의 기본 공격을 바꿨으면 그 틱 함수 */
export const pwBasicTick = (s: RunState): Tick | undefined => (s.pvp ? BASICS[s.player.characterId] : undefined);
