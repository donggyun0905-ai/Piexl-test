// 쓰러질 때 연출 (혼자 하기 던전): 0.5초마다 판을 복사해 두고 그 뒤 입력도 적어 둠 → 쓰러지면 조금 앞부터 1/3 속도로 다시 돌려 보여 줌(맞은 공격이 느리게)
// → 몸이 옆으로 쓰러짐 → 그다음 결과 창. 판 계산은 시드·입력으로 같게 다시 돌아가서 진짜 판은 건드리지 않음 (보여 주기만)
import { ROOM_HEIGHT, ROOM_WIDTH, stepSim, type RunState, type TickInput } from "@pixel-rogue/shared";
import type { Snap } from "./render/palette";

/** 몸 그리기 (render/actors.drawPlayer, 그림 파일을 쓰는 쪽이라 밖에서 받음) */
type DrawBody = (ctx: CanvasRenderingContext2D, s: RunState, alpha: number, snap: Snap, hitbox: boolean, hide: boolean) => void;

/** 복사 간격(틱) · 다시 보기 속도(화면 몇 장에 한 틱) · 쓰러지는 장 수 · 최소 되감기(틱) */
const EVERY = 30;
const SLOW = 3;
const FALL = 50;
const BACK = 24;

export class DeathCam {
  private snaps: { tick: number; state: RunState; inputs: TickInput[] }[] = [];
  private ghost: RunState | null = null;
  private queue: TickInput[] = [];
  private frame = 0;
  private fall = -1;
  private done = false;
  constructor(
    private readonly on: boolean,
    private readonly body: DrawBody,
  ) {}

  /** 틱마다 (stepSim 바로 전) */
  record(run: RunState, input: TickInput): void {
    if (!this.on || run.over) return;
    if (run.tick % EVERY === 0) {
      this.snaps.push({ tick: run.tick, state: structuredClone(run), inputs: [] });
      if (this.snaps.length > 3) this.snaps.shift();
    }
    for (const s of this.snaps) s.inputs.push(input);
  }

  private dying = (run: RunState) => this.on && run.over && !run.won && run.player.hp <= 0;

  /** 이번 장에 그릴 판: 쓰러지는 중이면 다시 돌리는 복사본 */
  view(run: RunState): RunState {
    if (!this.dying(run) || this.done) return this.ghost ?? run;
    if (!this.ghost) {
      const snap = [...this.snaps].reverse().find((x) => run.tick - x.tick >= BACK) ?? this.snaps[0];
      if (!snap) {
        this.done = true;
        return run;
      }
      this.ghost = structuredClone(snap.state);
      this.queue = snap.inputs.slice();
    }
    const g = this.ghost;
    if (this.fall < 0) {
      if (++this.frame % SLOW === 0) {
        const input = this.queue.shift();
        if (input && !g.over) stepSim(g, input);
        if (!input || g.over) this.fall = 0;
      }
    } else if (this.fall < FALL) this.fall++;
    else this.done = true;
    return g;
  }

  /** 결과 창을 띄워도 되는지 (쓰러짐 연출이 끝남) */
  ready = (run: RunState) => !this.dying(run) || this.done;
  /** 몸을 직접 그리는 중 (보통 몸은 숨김) */
  falling = () => this.fall >= 0;

  /** 쓰러지는 몸 · 붉은 기운 (gameLoop overlay) */
  drawFall(ctx: CanvasRenderingContext2D, snap: Snap): void {
    const g = this.ghost;
    if (!g) return;
    ctx.fillStyle = `rgba(140, 0, 10, ${0.25 + (0.15 * Math.max(0, this.fall)) / FALL})`;
    ctx.fillRect(0, 0, ROOM_WIDTH, ROOM_HEIGHT);
    if (this.fall < 0) return;
    const k = Math.min(1, this.fall / (FALL * 0.4));
    const p = g.player;
    const x = snap(p.x);
    const y = snap(p.y + p.r);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((k * Math.PI) / 2 * (p.faceX < 0 ? -1 : 1));
    ctx.translate(-x, -y);
    ctx.globalAlpha = 1 - 0.35 * k;
    // 맞은 뒤 무적 깜빡임 없이 · 끝난 판도 몸을 그리게 · 체력 줄은 빼고 (서든데스처럼, 복사본이라 판에는 영향 없음)
    p.invulnTicks = 0;
    const [over, sudden] = [g.over, g.sudden];
    [g.over, g.sudden] = [false, true];
    this.body(ctx, g, 1, snap, false, false);
    [g.over, g.sudden] = [over, sudden];
    ctx.restore();
  }
}
