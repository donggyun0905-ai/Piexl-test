// 미류(탈라시아, 해룡 수인): 누르고 있으면 대태도 3연격 (물결 가르기 → 역류 베기 → 해룡 일섬, sim/miryuCuts)
// 벤 자리는 흐르는 물길 · 벤 직후·대시 중 적 탄을 흘려 물방울로 모음 · 해류 게이지가 차면 다음 베기가 '천류 해방' (sim/miryuFlow)
// 대시해도 연격이 이어짐 (물 흐르듯) · 물줄기 걸음은 대시한 길이 물길
import { TICK_RATE } from "../constants";
import { MIRYU as M } from "../weaponsMiryu";
import { flash, sweep, whirlCut } from "./miryuCuts";
import { flowTick, startRelease } from "./miryuFlow";
import { addStream, mrOf } from "./miryuKit";
import { roomKey } from "./s2Kit";
import type { PlayerState, RunState } from "./types";
import { hasPerk } from "./util";

/** 방이 바뀌면 물길·물칼날·해룡을 거둠 (게이지·물방울은 남김) */
function roomCheck(s: RunState): void {
  const p = s.player;
  const key = roomKey(s);
  if (p.mrRoom === key) return;
  p.mrRoom = key;
  resetMiryu(p, true);
}

/** 대시: 시작하면 연격 간격을 지움(바로 다음 베기) · 끝나면 물줄기 걸음 물길 · 무형은 걸어온 길 기록 */
function moveCheck(s: RunState): void {
  const p = s.player;
  const dashing = p.dashTicks > 0;
  if (dashing && !p.mrDash) {
    p.mrDash = [p.prevX, p.prevY];
    if (p.mrStep) p.attackCooldown = 0;
    if (p.mrStep && (p.mrGap ?? 0) < M.comboGap) p.mrGap = 0;
  }
  if (!dashing && p.mrDash) {
    const [x, y] = p.mrDash;
    if (hasPerk(p, "mrCourse") && Math.hypot(p.x - x, p.y - y) > 12) {
      const pts: [number, number][] = [];
      for (let i = 0; i <= 4; i++) pts.push([x + (p.x - x) * (i / 4), y + (p.y - y) * (i / 4)]);
      addStream(s, pts);
    }
    delete p.mrDash;
  }
  if (mrOf(p).miryu !== "formless" || s.tick % M.trailEvery !== 0) return;
  const t = (p.mrTrail ??= []);
  const last = t[t.length - 1];
  if (last && Math.hypot(p.x - last[0], p.y - last[1]) < 6) return;
  t.push([p.x, p.y]);
  if (t.length > 10) t.shift();
}

/** 틱마다 (대태도를 들었을 때 player에서) */
export function miryuTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  roomCheck(s);
  moveCheck(s);
  flowTick(s);
  p.mrGap = (p.mrGap ?? 0) + 1;
  if (p.mrGap > M.comboGap) p.mrStep = 0;
  if (!want || p.attackCooldown > 0) return;
  if ((p.mrFlow ?? 0) >= M.flowMax && !p.mrDragon) {
    startRelease(s);
    p.attackCooldown = Math.max(1, Math.round((TICK_RATE / speed) * 0.7));
    p.mrLast = { k: 3, t: s.tick, side: 1 };
    p.attackCount++;
    return;
  }
  const k = p.mrStep ?? 0;
  if (k < 2) sweep(s, k, 1);
  else if (mrOf(p).miryu === "vortex") whirlCut(s, 1);
  else flash(s, 1);
  p.mrLast = { k, t: s.tick, side: k === 0 ? 1 : -1 };
  p.mrStep = (k + 1) % 3;
  p.mrGap = 0;
  p.attackCooldown = Math.max(1, Math.round((TICK_RATE / speed) * (M.stepTime[k] ?? 1)));
  p.attackCount++;
}

/** 연습장 등에서 다시 시작할 때 (keepRoom: 방 이름·게이지·물방울은 남김) */
export function resetMiryu(p: PlayerState, keepRoom = false): void {
  for (const k of ["mrStreams", "mrBlades", "mrDragon", "mrGuard", "mrDash", "mrTrail", "mrStep", "mrGap", "mrLast"] as const) delete p[k];
  if (!keepRoom) for (const k of ["mrRoom", "mrFlow", "mrDrops"] as const) delete p[k];
}

export { isMiryu, miryuMoveMul, miryuSpeedMul, miryuTaken } from "./miryuKit";
