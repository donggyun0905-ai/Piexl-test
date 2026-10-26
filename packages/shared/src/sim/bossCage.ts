// 갓이터 궁극기 패링: 어둠이 좁혀 와 방이 아주 작아지고, 플레이어는 사방 쇠사슬에 묶여 못 움직이며 대시 키가 패링 키로 바뀜
// 작은 방 테두리 곳곳에서 창 여러 개가 날아오는데 빨간 창 하나만 진짜(더 빠르고, 보라 가짜 창들과 닿는 때가 다름) → 진짜가 닿기 직전에 눌러 받아 넘김 (가짜는 맞아도 아무 일 없음). 그동안 갓이터는 맞지 않고 다른 패턴도 쓰지 않음
import { createRng, deriveSeed } from "../rng";
import { hitDamage } from "./bossKit";
import { addShape } from "./hazards";
import type { EnemyState, ProjectileState, RunState, TickInput } from "./types";
import { addEffect, enemyShot, normalize, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  CAGE_TICKS: 900,
  CAGE_W: 112,
  CAGE_H: 80,
  /** 창: 사방에서 한꺼번에 날아와 같은 순간에 닿음 (한 번 패링으로 여러 개를 막음) · 예고 · 빠르기 · 묶음 간격 · 한 묶음 수(처음 → 중간 → 끝) · 늘어나는 틱 */
  SPEAR_WARN: 24,
  SPEAR_SPEED: 11,
  VOLLEY_GAP: 64,
  SPEAR_LEN: 60,
  /** 진짜 창: 빠르기 · 가짜보다 먼저·늦게 닿는 틱 (가장 작은 값 + 더해지는 범위) · 가장 짧은 예고 */
  REAL_SPEED: 13,
  REAL_OFF: 14,
  REAL_OFF_ADD: 10,
  REAL_MIN_WARN: 12,
  PARRY_CD: 28,
  /** 막은 뒤 이어지는 자세 (같은 묶음의 늦게 닿는 창까지) */
  PARRY_HOLD: 6,
};
export { R as BOSS_CAGE_RULES };

/** 좁혀지는 틱 · 전체 틱 · 작은 방 크기 */
export const CAGE_SHRINK = 60;
const VOLLEY = [3, 5, 7];
const MORE_AT = [400, 650];
/** 패링: 받아 넘기는 틱 · 다시 누를 수 있을 때까지 (받아 넘기면 바로 다시 가능) */
export const PARRY_TICKS = 14;

/** 탄막의 지금 방 [왼, 위, 오른, 아래] (처음엔 방 전체에서 작은 방으로 좁혀짐) */
export function cageRect(s: RunState, e: EnemyState): [number, number, number, number] | null {
  if (e.ultAt === undefined || e.kind !== "godeater") return null;
  const k = Math.min(1, (s.tick - e.ultAt) / CAGE_SHRINK);
  const cx = e.ultSafe?.[0] ?? 0;
  const cy = e.ultSafe?.[1] ?? 0;
  const lerp = (a: number, b: number) => a + (b - a) * k;
  return [lerp(ROOM_MIN_X, cx - R.CAGE_W / 2), lerp(ROOM_MIN_Y, cy - R.CAGE_H / 2), lerp(ROOM_MAX_X, cx + R.CAGE_W / 2), lerp(ROOM_MAX_Y, cy + R.CAGE_H / 2)];
}

/** 갓이터 패링 시작: 작은 방은 지금 플레이어 자리에. 하던 공격(위험 표시·탄·구역·망령·사슬)은 모두 거둠 */
export function startCage(s: RunState, e: EnemyState): void {
  const p = s.player;
  s.hazards = [];
  s.projectiles = s.projectiles.filter((pr) => pr.fromPlayer);
  s.enemies = s.enemies.filter((o) => o.kind !== "soul");
  e.zones = e.zonesEnd = e.repelAt = undefined;
  p.chains = [];
  p.chainTicks = 0;
  p.parryOn = true;
  e.ultAt = s.tick;
  e.ultSafe = [Math.max(ROOM_MIN_X + R.CAGE_W / 2, Math.min(ROOM_MAX_X - R.CAGE_W / 2, p.x)), Math.max(ROOM_MIN_Y + R.CAGE_H / 2, Math.min(ROOM_MAX_Y - R.CAGE_H / 2, p.y))];
  e.spears = [];
}

/** 창 한 묶음: 작은 방 테두리 곳곳에서 플레이어 쪽으로, 먼 창부터 먼저 날아 모두 같은 순간에 닿음 */
function volley(s: RunState, e: EnemyState, rect: [number, number, number, number], n: number): void {
  const [l, t, r, b] = rect;
  const p = s.player;
  const rng = createRng(deriveSeed(s.seed, "spear", e.id, s.tick));
  const from = Array.from({ length: n }, (_, i) => {
    const side = (i + rng.int(0, 3)) % 4;
    const a = 0.1 + rng.nextFloat() * 0.8;
    const x = side < 2 ? l + a * (r - l) : side === 2 ? l : r;
    const y = side >= 2 ? t + a * (b - t) : side === 0 ? t : b;
    return { x, y, dist: Math.hypot(p.x - x, p.y - y) };
  });
  const far = Math.max(...from.map((f) => f.dist));
  // 보라 가짜 창은 모두 같은 순간에 닿고, 빨간 진짜 창 하나만 더 빠르게 그보다 조금 먼저나 늦게 닿음 (가짜에 누르면 진짜를 놓침)
  const arrive = R.SPEAR_WARN + far / R.SPEAR_SPEED;
  const off = (rng.nextFloat() < 0.5 ? -1 : 1) * (R.REAL_OFF + rng.int(0, R.REAL_OFF_ADD));
  from.forEach(({ x, y, dist }, i) => {
    const real = i === 0;
    const d = normalize(p.x - x, p.y - y) ?? [0, 1];
    const warn = real ? Math.max(R.REAL_MIN_WARN, Math.round(arrive + off - dist / R.REAL_SPEED)) : Math.round(arrive - dist / R.SPEAR_SPEED);
    addShape(s, warn, { x, y, radius: 0, damage: 0, toX: x + d[0] * R.SPEAR_LEN * 3, toY: y + d[1] * R.SPEAR_LEN * 3, width: 2, fx: real ? "stab" : "fake" });
    e.spears!.push({ x, y, dx: d[0], dy: d[1], at: s.tick + warn, real });
  });
}

/** 틱마다: 플레이어를 작은 방 안에 가두고 창 예고 → 발사 · 시간이 다 되면 방이 다시 넓어짐 */
export function updateCage(s: RunState, e: EnemyState): void {
  const rect = cageRect(s, e);
  if (!rect) return;
  const p = s.player;
  const t = s.tick - e.ultAt!;
  if (t >= R.CAGE_TICKS || e.hp <= 0) {
    e.ultAt = e.ultSafe = e.spears = undefined;
    e.immune = false;
    e.timer = 60;
    p.parryOn = false;
    return;
  }
  p.x = Math.max(rect[0] + p.r, Math.min(rect[2] - p.r, p.x));
  p.y = Math.max(rect[1] + p.r, Math.min(rect[3] - p.r, p.y));
  for (const sp of e.spears ?? []) {
    if (sp.at !== s.tick) continue;
    const pr = enemyShot(s, sp.x, sp.y, sp.dx, sp.dy, sp.real ? R.REAL_SPEED : R.SPEAR_SPEED, sp.real ? hitDamage(s) : 0);
    Object.assign(pr, sp.real ? { look: "rspear" as const, r: 3, parry: true, ticksLeft: 40 } : { look: "fspear" as const, r: 3, fake: true, ticksLeft: 40 });
  }
  e.spears = (e.spears ?? []).filter((sp) => sp.at > s.tick);
  if (t < CAGE_SHRINK + 30) return;
  if ((t - CAGE_SHRINK - 30) % R.VOLLEY_GAP !== 0 || t > R.CAGE_TICKS - 50) return;
  volley(s, e, rect, VOLLEY[MORE_AT.filter((m) => t >= m).length]!);
}

/** 패링 키 (대시 대신): 새로 누르면 잠깐 받아 넘기는 자세 */
export function parryInput(s: RunState, input: TickInput): TickInput {
  const p = s.player;
  if ((p.parryTicks ?? 0) > 0) p.parryTicks = (p.parryTicks ?? 0) - 1;
  if ((p.parryCd ?? 0) > 0) p.parryCd = (p.parryCd ?? 0) - 1;
  if (!p.parryOn) return input;
  if (input.dash && !p.parryLast && (p.parryCd ?? 0) === 0) {
    p.parryTicks = PARRY_TICKS;
    p.parryCd = R.PARRY_CD;
  }
  p.parryLast = input.dash;
  // 사방 쇠사슬에 묶여 움직이지 못하고 패링만 함
  return { ...input, moveX: 0, moveY: 0, dash: false };
}

/** 창이 플레이어에 닿음: 패링 자세면 받아 넘기고 true */
export function tryParry(s: RunState, pr: ProjectileState): boolean {
  const p = s.player;
  if (!pr.parry || (p.parryTicks ?? 0) <= 0) return false;
  // 한 묶음의 창은 1~2틱 차이로 닿으니, 막은 순간부터 자세를 조금 더 이어 나머지도 한꺼번에 막음. 바로 다시 누를 수 있음
  p.parryTicks = Math.max(p.parryTicks ?? 0, R.PARRY_HOLD);
  p.parryCd = 0;
  p.parryHits = (p.parryHits ?? 0) + 1;
  addEffect(s, { kind: "parry", x: pr.x, y: pr.y, dirX: -pr.vx, dirY: -pr.vy, size: 10, maxTicks: 14 });
  return true;
}
