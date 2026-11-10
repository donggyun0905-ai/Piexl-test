// 협동 짐작 화면 (방장·손님 공용): 짐작 상태를 들고 있다가 틱마다 한 틱씩만 더 계산함.
// 전에는 틱마다 확정 상태를 통째로 복사해 지금 틱까지(최대 36틱) 다시 계산해서 사람·적이 많으면 렉이 심했음.
// 확정된 남의 입력이 짐작과 크게 다를 때(이동·공격·버튼)나 REBUILD 틱마다만 확정에서 다시 계산함.
// 화면에만 쓰는 값이라 조준이 조금 다른 것은 넘어감 (확정 계산은 따로라 모든 화면 결과는 그대로 같음)
import { stepParty, type RunState, type TickInput } from "@pixel-rogue/shared";
import { watchingSeat } from "../game/camera";
import { replaceRun } from "./lockstep";

/** 짐작이 맞아도 이 틱마다는 확정에서 다시 계산 (조준 차이 바로잡기, 0.33초) */
const REBUILD = 20;
/** 조준 자리가 이만큼 넘게 다르면 짐작이 틀린 것으로 봄 */
const AIM_SLACK = 16;

/** 화면에 보이는 것이 달라질 만큼 다른 입력인지 */
function differs(a: TickInput, b: TickInput): boolean {
  return (
    a.moveX !== b.moveX || a.moveY !== b.moveY || a.attack !== b.attack || a.dash !== b.dash || a.interact !== b.interact ||
    a.autoAim !== b.autoAim || a.useSlot !== b.useSlot || a.pickChoice !== b.pickChoice || a.statPick !== b.statPick ||
    a.skill !== b.skill || (a.sell ?? 0) !== (b.sell ?? 0) || (a.menu ?? 0) !== (b.menu ?? 0) ||
    Math.abs(a.aimX - b.aimX) + Math.abs(a.aimY - b.aimY) > AIM_SLACK
  );
}

export class Predictor {
  private pred: RunState | null = null;
  /** 짐작에 쓴 틱별 입력 (확정되면 비교하고 지움) */
  private used = new Map<number, TickInput[]>();
  private dirty = true;
  private built = -1;

  /** 확정 상태가 통째로 바뀜 (처음 받음·다시 맞춤) */
  reset(): void {
    this.dirty = true;
  }

  /** t틱이 이 입력으로 확정됨: 짐작과 다르면 다음 화면에서 다시 계산 */
  confirmed(t: number, inputs: readonly TickInput[]): void {
    const u = this.used.get(t);
    this.used.delete(t);
    if (u && (u.length !== inputs.length || inputs.some((x, i) => differs(x, u[i]!)))) this.dirty = true;
  }

  /** 확정 + 지금 틱까지 짐작해 화면에 보여 줌 (확정 상태는 그대로) */
  show(display: RunState, confirmed: RunState, upTo: number, inputsAt: (tick: number) => TickInput[]): void {
    let s = this.pred;
    if (!s || this.dirty || s.tick < confirmed.tick || s.tick > upTo || confirmed.over || confirmed.tick - this.built >= REBUILD) {
      s = structuredClone(confirmed);
      this.used.clear();
      this.dirty = false;
      this.built = confirmed.tick;
    }
    for (let t = s.tick + 1; t <= upTo && !s.over; t++) {
      const ins = inputsAt(t);
      this.used.set(t, ins);
      stepParty(s, ins);
    }
    this.pred = s;
    const view = structuredClone(s);
    // 짐작으로 끝난 판은 확정될 때까지 끝내지 않음 (게임 화면이 멈추지 않게)
    if (view.over && !confirmed.over) view.over = false;
    // 관전 중이면 그 사람 자리를 꺼내 놓음 (화면·체력·장비·빌드가 모두 그 사람 것)
    replaceRun(display, view, watchingSeat() ?? view.seat ?? 0);
  }
}
