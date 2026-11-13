// 상태이상 소리를 언제 낼지 (화면 전용, 게임 계산에는 영향 없음): 적의 지속 피해 종류(dotAmt)·경직·느려짐·속박·공포가 새로 걸린 순간 · 얼음 시계
// 냉기를 맞은 직후 경직되면 빙결(얼어붙음), 그 경직이 풀리면 얼음 깨짐 · 같은 소리는 GAP 틱 안에 한 번만
import type { DotKind, RunState } from "@pixel-rogue/shared";
import type { Sfx } from "./sound";

const DOT: Record<DotKind, Sfx> = {
  burn: "stBurn", hellfire: "stHellfire", blueflame: "stBlueflame", bleed: "stBleed", poison: "stPoison", rot: "stRot",
  shock: "stShock", storm: "stStorm", frost: "stFrost", tide: "stTide", curse: "stCurse", death: "stDeath",
  voidbolt: "stVoidbolt", gold: "stGold", radiance: "stRadiance", moon: "stMoon",
};
/** 같은 소리 사이 최소 틱 (0.25초) · 냉기 뒤 이 틱 안에 경직되면 빙결 */
const GAP = 15;
const ICE = 30;

interface Foe { dot?: number; stun: boolean; slow: boolean; root: boolean; fear: boolean; frostAt: number; frozen: boolean }
interface Seen { where: string; foes: Map<number, Foe>; last: Map<Sfx, number>; clock: boolean }
const seenOf = new WeakMap<RunState, Seen>();

/** 이번 프레임에 낼 상태이상 소리를 fx에 더함 */
export function statusSounds(run: RunState, fx: Sfx[]): void {
  const where = `${run.floor}/${run.roomId}`;
  let s = seenOf.get(run);
  if (!s || s.where !== where) {
    s = { where, foes: new Map(), last: s?.last ?? new Map(), clock: run.freezeTicks > 0 };
    seenOf.set(run, s);
  }
  const t = run.tick;
  const add = (f: Sfx) => {
    if (t - (s.last.get(f) ?? -999) < GAP || t < (s.last.get(f) ?? 0)) return;
    s.last.set(f, t);
    fx.push(f);
  };
  const next = new Map<number, Foe>();
  for (const e of run.enemies) {
    const was = s.foes.get(e.id);
    const now: Foe = { dot: e.dotTick, stun: (e.stunTicks ?? 0) > 0, slow: (e.slowTicks ?? 0) > 0, root: (e.rootTicks ?? 0) > 0, fear: (e.fearTicks ?? 0) > 0, frostAt: was?.frostAt ?? -999, frozen: was?.frozen ?? false };
    next.set(e.id, now);
    if (!was) continue;
    if (now.dot !== undefined && now.dot !== was.dot && e.dotAmt) {
      // 그 틱에 가장 많이 들어간 종류 하나만 (여러 개면 시끄러워서)
      let top: DotKind | undefined;
      for (const k of Object.keys(e.dotAmt) as DotKind[]) if ((e.dotAmt[k] ?? 0) > (top ? (e.dotAmt[top] ?? 0) : 0)) top = k;
      if (top) add(DOT[top]);
      if ((e.dotAmt.frost ?? 0) > 0) now.frostAt = t;
    }
    if (now.stun && !was.stun) {
      now.frozen = t - now.frostAt <= ICE;
      add(now.frozen ? "stFreeze" : "stStun");
    } else if (!now.stun && was.stun && was.frozen) {
      now.frozen = false;
      add("stShatter");
    }
    if (now.slow && !was.slow) add("stSlow");
    if (now.root && !was.root) add("stRoot");
    if (now.fear && !was.fear) add("stFear");
  }
  s.foes = next;
  // 얼음 시계: 방 전체가 얼었다가 풀림
  const clock = run.freezeTicks > 0;
  if (clock !== s.clock) add(clock ? "stFreeze" : "stShatter");
  s.clock = clock;
}
