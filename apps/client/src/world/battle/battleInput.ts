// 지도 전투 입력 → 본편 한 틱 입력 (game/controls와 같은 값 모양): WASD 이동 · 마우스 쪽 조준(거리 단계) · 좌클릭 꾹 = 공격 · 우클릭·K = 대시 · 1~4 = 스킬
import { AIM_DIST_MAX, AIM_DIST_STEP, quantize, type TickInput } from "@pixel-rogue/shared";

export interface BattlePad {
  /** 좌클릭을 누르고 있음 */
  attack: boolean;
  /** 다음 틱에 보낼 대시·스킬 (보내면 지움) */
  dash: boolean;
  skill: number;
}

export const newPad = (): BattlePad => ({ attack: false, dash: false, skill: 0 });

/** keys: 눌린 키 · aim: 나 → 마우스 (게임 픽셀) · walk: 터치로 누른 곳까지 (나 → 그곳, 없으면 null · 자동 공격) */
export function readPad(pad: BattlePad, keys: ReadonlySet<string>, aim: readonly [number, number], walk: readonly [number, number] | null = null): TickInput {
  const k = (a: string, b: string) => (keys.has(a) || keys.has(b) ? 100 : 0);
  if (walk) {
    // 모바일: 누른 곳으로 걷고 공격은 본편 자동 공격 (가까운 적)
    const d = Math.hypot(walk[0], walk[1]);
    const [mx, my] = d > 4 ? [quantize(walk[0] / d, 100), quantize(walk[1] / d, 100)] : [0, 0];
    const dash = pad.dash;
    [pad.dash, pad.skill] = [false, 0];
    return { moveX: mx, moveY: my, aimX: 0, aimY: 0, attack: false, dash, interact: false, useSlot: 0, pickChoice: 0, statPick: 0, skill: 0, autoAim: true };
  }
  const [dx, dy] = aim;
  const len = Math.hypot(dx, dy);
  const step = Math.max(1, Math.min(AIM_DIST_MAX, Math.round(len / AIM_DIST_STEP)));
  const input: TickInput = {
    moveX: k("KeyD", "ArrowRight") - k("KeyA", "ArrowLeft"),
    moveY: k("KeyS", "ArrowDown") - k("KeyW", "ArrowUp"),
    aimX: len > 0 ? quantize(dx / len, 100) * step : 0,
    aimY: len > 0 ? quantize(dy / len, 100) * step : 0,
    attack: pad.attack,
    dash: pad.dash,
    interact: false,
    useSlot: 0,
    pickChoice: 0,
    statPick: 0,
    skill: pad.skill,
    autoAim: false,
  };
  pad.dash = false;
  pad.skill = 0;
  return input;
}
