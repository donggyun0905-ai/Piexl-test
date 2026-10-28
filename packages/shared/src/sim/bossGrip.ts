// 거대 전갈이 플레이어에게 거는 것: 꼬리 독(0.5초마다 피해) · 집게에 붙잡힘(못 움직이고 대시도 못 함, 0.5초마다 피해). 둘 다 체력 1 아래로는 안 깎음
// 죽음(전갈 필살기 검은 독액): 독보다 세고 겹칠수록 아픔, 쓰러질 수 있음
import { hitDamage, shotDamage } from "./bossKit";
import type { EnemyState, RunState, TickInput } from "./types";
import { addEffect, keepInRoom } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 독: 남은 틱 · 피해 간격 · 탄 피해에 곱하는 값 */
  VENOM_TICKS: 300,
  VENOM_GAP: 30,
  VENOM_MUL: 0.3,
  /** 집게: 붙잡는 틱 · 탄 피해에 곱하는 값 */
  PINCH_TICKS: 180,
  PINCH_MUL: 0.4,
  /** 죽음: 남은 틱 · 최대 겹 · 근접 피해에 곱하는 값(겹마다) */
  DOOM_TICKS: 360,
  DOOM_MAX: 3,
  DOOM_MUL: 0.12,
};
export { R as BOSS_GRIP_RULES };

export function poisonPlayer(s: RunState): void {
  s.player.venomTicks = R.VENOM_TICKS;
}

/** 대시 무적을 무시하고 (짐승 필살기: 대시로 씹지 못하게) */
export function throughDash(s: RunState, f: () => void): void {
  const p = s.player;
  const dash = p.dashTicks;
  p.dashTicks = 0;
  f();
  p.dashTicks = dash;
}

export function doomPlayer(s: RunState): void {
  const p = s.player;
  p.doomStacks = Math.min(R.DOOM_MAX, (p.doomStacks ?? 0) + 1);
  p.doomTicks = R.DOOM_TICKS;
}

export function pinchPlayer(s: RunState, e: EnemyState, ticks = R.PINCH_TICKS): void {
  s.player.pinchTicks = ticks;
  s.player.pinchBy = e.id;
}

/** 독·집게 피해 (맞은 뒤 무적과 상관없이, 1 아래로는 안 내려감) */
function sting(s: RunState, mul: number): void {
  const p = s.player;
  if (p.shieldTicks > 0) return;
  p.hp = Math.max(1, p.hp - Math.max(1, Math.round(shotDamage(s) * mul)));
  addEffect(s, { kind: "hit", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 4, maxTicks: 8 });
}

/** 틱마다 (플레이어가 움직이기 전): 독 피해 · 붙잡혔으면 집게 앞에 묶어 두고 이동·대시를 막음 */
export function gripInput(s: RunState, input: TickInput): TickInput {
  const p = s.player;
  if ((p.venomTicks ?? 0) > 0) {
    p.venomTicks = (p.venomTicks ?? 0) - 1;
    if (s.tick % R.VENOM_GAP === 0) sting(s, R.VENOM_MUL);
  }
  if ((p.doomTicks ?? 0) > 0) {
    p.doomTicks = (p.doomTicks ?? 0) - 1;
    if (s.tick % R.VENOM_GAP === R.VENOM_GAP / 2 && p.shieldTicks <= 0) {
      p.hp -= Math.max(1, Math.round(hitDamage(s) * R.DOOM_MUL * (p.doomStacks ?? 1)));
      addEffect(s, { kind: "hit", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 5, maxTicks: 8 });
    }
    if (p.doomTicks === 0) p.doomStacks = 0;
  }
  if ((p.pinchTicks ?? 0) <= 0) return input;
  p.pinchTicks = (p.pinchTicks ?? 0) - 1;
  const e = s.enemies.find((o) => o.id === p.pinchBy && o.hp > 0);
  if (!e) {
    p.pinchTicks = 0;
    return input;
  }
  if (p.pinchTicks % R.VENOM_GAP === 0) sting(s, R.PINCH_MUL);
  p.x = e.x + e.dirX * (e.r + p.r - 4);
  p.y = e.y + e.dirY * (e.r + p.r - 4);
  keepInRoom(p);
  return { ...input, moveX: 0, moveY: 0, dash: false };
}
