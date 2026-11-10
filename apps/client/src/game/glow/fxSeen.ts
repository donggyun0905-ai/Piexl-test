// 빛 효과가 이미 본 게임 효과인지 (glowWatch·glowSkills 공용).
// 객체로 기억하면 협동처럼 화면 상태를 틱마다 새로 만드는 곳에서 모든 효과가 매번 새것으로 보여
// 빛이 계속 다시 터짐(안 꺼지는 것처럼 보이고 렉). 그래서 종류·자리·생긴 틱·순서로 기억함
import type { EffectState, RunState } from "@pixel-rogue/shared";

export class FxSeen {
  private seen = new Set<string>();

  /** 이번 화면에서 처음 보는 효과만 돌려줌 (사라진 효과의 기억은 버림) */
  fresh(s: RunState): EffectState[] {
    const now = new Set<string>();
    const out: EffectState[] = [];
    const n = new Map<string, number>();
    for (const fx of s.effects) {
      const base = `${fx.kind}|${fx.seat ?? -1}|${s.tick - (fx.maxTicks - fx.ticks)}`;
      const k = n.get(base) ?? 0;
      n.set(base, k + 1);
      const key = `${base}|${k}`;
      now.add(key);
      if (!this.seen.has(key)) out.push(fx);
    }
    this.seen = now;
    return out;
  }
}
