// 피해 출처 기록 (결과 창 '피해 출처'): 적 체력을 깎을 때마다 "지금 무엇이 때리는 중인지"로 나눠 사람마다 더해 둠 (p.dmgBy)
// 출처 = 패시브 id (그 패시브를 가졌을 때만 도는 코드 구간을 srcRun으로 감쌈) · 상태이상은 "d:종류" · 감싸지 않은 곳은 ""(무기·기본 기술)
// 캐릭터 기술·기본 패시브: 파일마다 피해 함수를 srcFn으로 묶어 "f:파일"로 셈 (패시브 구간이 먼저 · 가장 안쪽 파일이 이김 · 이름은 화면 game/srcNames)
// 구간 안에서 쏜 내 탄·잠시 뒤 폭발은 출처를 달고 가서(src) 맞을 때 그 출처로 셈 · 게임 결과에는 영향 없음 (기록만)
import type { DotKind, EnemyState, RunState } from "./types";

export interface DmgSrcPlayerState {
  /** 출처마다 준 피해 합 (패왕전 제외 · 연습장 허수아비는 셈: 능력치 칸에서 바로 확인) */
  dmgBy?: Record<string, number>;
}

/** 지금 때리는 출처 (틱 안에서만 잠깐 쓰는 값이라 상태에 넣지 않음) */
let cur: string | undefined;
let dotMuted = false;

/** 이 구간에서 준 피해는 id(패시브)의 것 · 구간 안에서 새로 생긴 내 탄·잠시 뒤 폭발에도 출처를 답 (안쪽 구간이 먼저) */
export function srcRun<T>(s: RunState, id: string, fn: () => T): T {
  const was = cur;
  const shots = s.projectiles;
  const blasts = s.pendingBlasts;
  const n = shots.length;
  const m = blasts.length;
  const pl = s.player as unknown as Record<string, unknown[] | undefined>;
  const lists = LISTS.map((k) => pl[k]);
  const lens = lists.map((l) => l?.length ?? 0);
  cur = id;
  try {
    return fn();
  } finally {
    // 구간 안에서 새로 생긴 소환물·장판에도 출처를 달아 둠 (나중에 때릴 때 srcEach·srcCb가 꺼내 씀)
    for (let k = 0; k < LISTS.length; k++) {
      const l = pl[LISTS[k]!];
      const old = lists[k];
      if (!l || (l === old && l.length === lens[k])) continue;
      const had = old && l !== old ? new Set(old) : null;
      for (let i = l === old ? lens[k]! : 0; i < l.length; i++) {
        const o = l[i] as Tagged | null;
        if (o && typeof o === "object" && !had?.has(o)) o.dsrc ??= id;
      }
    }
    if (s.projectiles === shots) for (let i = n; i < shots.length; i++) if (shots[i]!.fromPlayer) shots[i]!.src ??= id;
    if (s.pendingBlasts === blasts) for (let i = m; i < blasts.length; i++) blasts[i]!.src ??= id;
    cur = was;
  }
}

/** 계속 남는 소환물·장판·예약 공격 목록 (플레이어 상태의 이름): 패시브 구간에서 만든 것은 만든 패시브를 달고 다님 */
const LISTS = "lnStrikes oStorms echoes bmBombs apDooms zsClouds wvBits wdMoon vyMarks tkWhirls summons stStars spirits spGas spDrops skLines shades sdZones sdSpirits sbShots sbBombs rfStorms rdFire rWyrms puFalls ppSpots ppDolls ppAllies pgMarks ocPools ocDarts oZones oSplash nlShots nlDets mqShells mnCracks mnBombs mcQueue mcFalls mcChains lvWhales lvPools lnWaves imBolts icZones icWaves iaThreads hrOwls hrDecoys hrBeasts ghosts gbDrops foresights fnWaves fnCracks flyers fgFalls ecHoles ecCuts eaQueue cyEmp crZones crCracks clQueue bzStrikes byWhirls btWaves btExecs bmFires bjVolleys bjShots awFields asWaves asSplit asRapids asFists arShots arEchoes apDrops allies ducklings hkSlides mnNodes mnPits mrStreams mrBlades puClones puInks rbWaves rbMarks tlSharks apFields lxQ".split(" ");
interface Tagged {
  dsrc?: string;
}

/** 소환물 목록을 돌 때: 하나마다 그것을 만든 패시브를 출처로 (없으면 지금 출처 그대로) */
export function* srcEach<T>(list: readonly T[]): Generator<T> {
  const was = cur;
  try {
    for (const o of list) {
      cur = (o as Tagged | null)?.dsrc ?? was;
      yield o;
    }
  } finally {
    cur = was;
  }
}

/** filter·forEach에 넘기는 함수용: 그 소환물을 만든 패시브를 출처로 */
export function srcCb<T, R>(fn: (o: T, i: number) => R): (o: T, i: number) => R {
  return (o, i) => {
    const id = (o as Tagged | null)?.dsrc;
    return id ? srcAs(id, () => fn(o, i)) : fn(o, i);
  };
}

/** 이 파일에서 부르는 피해 함수 묶기: 패시브 구간 밖이면 "f:파일"로 (get: 순환 가져오기라도 안전하게 부를 때 꺼냄) */
export function srcFn<T extends (...a: never[]) => unknown>(file: string, get: () => T): T {
  const key = `f:${file}`;
  return ((...a: never[]) => {
    if (cur !== undefined && !cur.startsWith("f:")) return get()(...a);
    const was = cur;
    cur = key;
    try {
      return get()(...a);
    } finally {
      cur = was;
    }
  }) as T;
}

/** 탄·잠시 뒤 폭발이 맞을 차례: 달고 온 출처로 (없으면 기본) */
export function srcAs<T>(id: string | undefined, fn: () => T): T {
  const was = cur;
  cur = id;
  try {
    return fn();
  } finally {
    cur = was;
  }
}
export const setSrc = (id?: string) => void (cur = id);

/** 적이 잃은 체력 적기 (key가 없으면 지금 출처) */
export function logDmg(s: RunState, e: EnemyState, amt: number, key?: string): void {
  if (!(amt > 0) || s.pvp) return;
  const by = (s.player.dmgBy ??= {});
  const k = key ?? cur ?? "";
  by[k] = (by[k] ?? 0) + amt;
}

/** 상태이상 피해 (util.markDot이 부름) · 직접 때리며 색만 입히는 타격(statusHit)은 이미 적었으니 건너뜀 */
export function logDot(s: RunState, e: EnemyState, kind: DotKind, amt: number): void {
  if (!dotMuted) logDmg(s, e, amt, `d:${kind}`);
}
export function muteDot(fn: () => void): void {
  dotMuted = true;
  try {
    fn();
  } finally {
    dotMuted = false;
  }
}
