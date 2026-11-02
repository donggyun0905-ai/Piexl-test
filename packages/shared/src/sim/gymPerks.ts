// 단련의 방 패시브 효과 강화: 아이템 효과 표(관리자 '아이템 효과', balanceTables.EFFECT_TABLES)의 그 패시브 수치를
// 단련한 사람에게만 단계마다 높여서 읽히게 함 (범위·피해·확률·회복·개수는 키우고, 재사용 대기·간격·지연·비용·받는 피해는 줄임)
// 지속 시간·최대치·조건(체력 몇 % 이하) 같은 애매한 수치는 그대로 · 올릴 수치가 없는 패시브는 단련 목록에 안 나옴 (sim/gym)
// 게임 한 틱 동안만(stepSim·stepParty가 gymCtx.run을 정함) 지금 사람(s.player)의 단계로 계산 → 화면·관리자는 늘 원래 값
import type { PlayerState, RunState } from "./types";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 단계마다 효과 수치가 좋아지는 몫 (0.1 = 10%: 키우는 수치는 ×1.1·×1.2…, 줄이는 수치는 ÷1.1·÷1.2…) */
  perLv: 0.1,
  /** 확률은 이 값을 넘지 않음 */
  maxChance: 0.95,
};
export { R as GYM_FX_RULES };

/** 클수록 좋은 수치 이름 (배율 mul·boss는 1을 넘는 몫만 키움) */
const UP = new Set(["damage", "dmg", "heal", "chance", "r", "radius", "reach", "range", "area", "width", "push", "shield", "regen", "hp", "add", "extra",
  "blast", "splash", "pull", "crit", "stun", "n", "hits", "shots", "bounces", "pierce", "charges", "mul", "boss"]);
/** 작을수록 좋은 수치 이름 (받는 피해 taken은 1보다 작을 때 줄이는 몫만 키움) */
const DOWN = new Set(["every", "cd", "cooldown", "delay", "cost", "taken"]);
const RATIO = new Set(["mul", "boss"]);

/** 이 수치를 올릴 수 있는지 */
export function fxScalable(k: string, v: number): boolean {
  if (!Number.isFinite(v) || v <= 0) return false;
  if (RATIO.has(k)) return v > 1;
  if (k === "taken") return v < 1;
  return UP.has(k) || DOWN.has(k);
}

/** 단계 lv에서 이 수치 */
export function fxScale(k: string, v: number, lv: number): number {
  if (lv <= 0 || !fxScalable(k, v)) return v;
  const b = R.perLv * lv;
  const int = Number.isInteger(v);
  if (RATIO.has(k)) return 1 + (v - 1) * (1 + b);
  if (k === "taken") return Math.max(0.1, 1 - (1 - v) * (1 + b));
  if (k === "chance") return Math.min(Math.max(v, R.maxChance), v * (1 + b));
  if (DOWN.has(k)) return int ? Math.max(1, Math.round(v / (1 + b))) : v / (1 + b);
  return int ? Math.round(v * (1 + b)) : v * (1 + b);
}

/** 지금 게임 한 틱을 계산 중인 판 (없으면 원래 값) */
export const gymCtx: { run: RunState | null } = { run: null };

/** 패시브 → 원래 효과 표 줄 */
const RAW = new Map<string, Record<string, unknown>>();

const lvOf = (p: PlayerState, id: string) => p.gym?.lv[`p:${id}`] ?? 0;

/** 효과 표의 한 줄을, 단련한 사람이 읽으면 높인 값이 나오는 줄로 (balanceTables가 부름 · 쓰기는 원래 줄로 그대로) */
export function gymFxRow<T extends object>(id: string, row: T): T {
  RAW.set(id, row as Record<string, unknown>);
  return new Proxy(row, {
    get(t, k, recv) {
      const v = Reflect.get(t, k, recv) as unknown;
      const run = gymCtx.run;
      if (!run || typeof v !== "number" || typeof k !== "string") return v;
      return fxScale(k, v, lvOf(run.player, id));
    },
  });
}

/** 이 패시브에서 단련으로 올라가는 효과 수치 [이름, 원래 값] (없으면 빈 목록 = 단련 목록에 안 나옴) */
export function fxKeys(id: string): [string, number][] {
  const row = RAW.get(id);
  if (!row) return [];
  return Object.entries(row).filter((e): e is [string, number] => typeof e[1] === "number" && fxScalable(e[0], e[1]));
}

/** 게임 한 틱을 이 판 기준으로 (단련한 효과 수치가 그 사람에게 높게 읽힘) */
export function withGymFx(s: RunState, fn: () => void): void {
  const prev = gymCtx.run;
  gymCtx.run = s;
  try {
    fn();
  } finally {
    gymCtx.run = prev;
  }
}
