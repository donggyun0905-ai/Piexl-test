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
  const snap = snapOf((runRef = s));
  cur = id;
  try {
    return fn();
  } finally {
    tagNew(s, snap, id);
    cur = was;
  }
}

/** 지금 판 (srcEach·srcCb가 새로 생긴 것에 출처를 달 때 씀 · srcRun·srcBind가 정함) */
let runRef: RunState | undefined;
export const srcBind = (s: RunState) => void (runRef = s);

interface Snap {
  shots: RunState["projectiles"];
  blasts: RunState["pendingBlasts"];
  n: number;
  m: number;
  lists: (unknown[] | undefined)[];
  lens: number[];
}
const listsOf = (s: RunState) => s.player as unknown as Record<string, unknown[] | undefined>;
function snapOf(s: RunState): Snap {
  const pl = listsOf(s);
  const lists = LISTS.map((k) => pl[k]);
  return { shots: s.projectiles, blasts: s.pendingBlasts, n: s.projectiles.length, m: s.pendingBlasts.length, lists, lens: lists.map((l) => l?.length ?? 0) };
}
/** 구간 안에서 새로 생긴 소환물·장판·탄·폭발에 출처를 달아 둠 (나중에 때릴 때 srcEach·srcCb가 꺼내 씀) */
function tagNew(s: RunState, sn: Snap, id: string): void {
  const pl = listsOf(s);
  for (let k = 0; k < LISTS.length; k++) {
    const l = pl[LISTS[k]!];
    const old = sn.lists[k];
    if (!l || (l === old && l.length === sn.lens[k])) continue;
    const had = old && l !== old ? new Set(old) : null;
    for (let i = l === old ? sn.lens[k]! : 0; i < l.length; i++) {
      const o = l[i] as Tagged | null;
      if (o && typeof o === "object" && !had?.has(o)) o.dsrc ??= id;
    }
  }
  const shots = sn.shots;
  if (s.projectiles === shots) for (let i = sn.n; i < shots.length; i++) if (shots[i]!.fromPlayer) shots[i]!.src ??= id;
  if (s.pendingBlasts === sn.blasts) for (let i = sn.m; i < sn.blasts.length; i++) sn.blasts[i]!.src ??= id;
}

/** id가 있을 때만 그 출처로 (덤으로 한 번 더 나가는 공격: 두 번째부터 패시브 몫) */
export function srcOpt<T>(s: RunState, id: string | false | undefined, fn: () => T): T {
  return id ? srcRun(s, id, fn) : fn();
}

/** 계속 남는 소환물·장판·예약 공격 목록 (플레이어 상태의 이름): 패시브 구간에서 만든 것은 만든 패시브를 달고 다님 */
const LISTS = "nrVolleys nrLaters nrWaves lnStrikes oStorms echoes bmBombs apDooms zsClouds wvBits wdMoon vyMarks tkWhirls summons stStars spirits spGas spDrops skLines shades sdZones sdSpirits sbShots sbBombs rfStorms rdFire rWyrms puFalls ppSpots ppDolls ppAllies pgMarks ocPools ocDarts oZones oSplash nlShots nlDets mqShells mnCracks mnBombs mcQueue mcFalls mcChains lvWhales lvPools lnWaves imBolts icZones icWaves iaThreads hrOwls hrDecoys hrBeasts ghosts gbDrops foresights fnWaves fnCracks flyers fgFalls ecHoles ecCuts eaQueue cyEmp crZones crCracks clQueue bzStrikes byWhirls btWaves btExecs bmFires bjVolleys bjShots awFields asWaves asSplit asRapids asFists arShots arEchoes rvUnits rvEvents geSeqs geThrows apDrops allies ducklings hkSlides mnNodes mnPits mrStreams mrBlades puClones puInks rbWaves rbMarks tlSharks apFields lxQ vyVolley bySwords byShots jkCards bsBows bsDust bsShots jnZaps jnBolts mzBrands".split(" ");
interface Tagged {
  dsrc?: string;
}

/** 소환물 하나에 만든 출처를 직접 달기 (목록 밖에서 만들어 나중에 넣을 때) */
export function srcTag<T extends object>(o: T, id: string): T {
  (o as Tagged).dsrc ??= id;
  return o;
}

/** 소환물 목록을 돌 때: 하나마다 그것을 만든 패시브를 출처로 (없으면 지금 출처 그대로) */
export function* srcEach<T>(list: readonly T[]): Generator<T> {
  const was = cur;
  try {
    for (const o of list) {
      const id = (o as Tagged | null)?.dsrc;
      const s = id ? runRef : undefined;
      const snap = s && snapOf(s);
      cur = id ?? was;
      yield o;
      // 그 소환물이 이번에 새로 만든 탄·소환물도 같은 출처를 달고 감
      if (s && snap) tagNew(s, snap, id!);
    }
  } finally {
    cur = was;
  }
}

/** filter·forEach에 넘기는 함수용: 그 소환물을 만든 패시브를 출처로 */
export function srcCb<T, R>(fn: (o: T, i: number) => R): (o: T, i: number) => R {
  return (o, i) => {
    const id = (o as Tagged | null)?.dsrc;
    return id ? (runRef ? srcRun(runRef, id, () => fn(o, i)) : srcAs(id, () => fn(o, i))) : fn(o, i);
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
