// 루시퍼 1페이즈 석화의 기둥 (4개, 루시퍼와 사슬로 묶임): 유저 한 명씩 맡아 아주 느리게 따라감
// 1분마다 4개가 동시에 석화의 빔 → 원형 지진파 3번 (대시로 넘음) · 기둥이 남아 있으면 루시퍼 보호막 10000 (겹치지 않음)
// 기둥이 부서질 때마다: 루시퍼 기절 + 검기 5번 (왼쪽·오른쪽·위에서 맵을 덮음, 작은 네모 빈칸만 안전)
import { ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "../constants";
import { ENEMIES } from "../content";
import { LUC_RULES as L, lucHurt, lucPose, lucRng, lucSpot } from "./lucKit";
import type { LucFight } from "./lucTypes";
import { allPlayers } from "./party";
import { remnantDodge } from "./remnant";
import type { EnemyState, RunState } from "./types";
import { addEffect, makeEnemy } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 처음 자리: 루시퍼에서 대각선으로 떨어진 거리 */
  START_DX: 210,
  START_DY: 120,
  /** 지진파: 3번 사이 틱 · 퍼지는 빠르기 · 최대 반지름 · 굵기(반) */
  WAVE_GAP: 34,
  WAVE_SPEED: 2.4,
  WAVE_MAX: 520,
  WAVE_W: 6,
  /** 검기: 번 수 · 경고(빈칸 보이기) 틱 · 다음 검기까지 · 빈칸 수 · 빈칸 한 변(반) */
  SLASH_N: 5,
  SLASH_WARN: 100,
  SLASH_NEXT: 120,
  SAFE_N: 4,
  SAFE_HALF: 16,
};
export { R as LUC_PILLAR_RULES };

/** 레이드 방에 처음 들어갈 때: 기둥 4개 (왼쪽 위·오른쪽 위·왼쪽 아래·오른쪽 아래) · 맡는 자리는 count */
export function spawnPillars(s: RunState, boss: EnemyState): EnemyState[] {
  const n = allPlayers(s).length;
  return [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ].map(([sx, sy], i) => {
    const e = makeEnemy(s, "lucpillar", boss.x + sx! * R.START_DX, boss.y + sy! * R.START_DY, 1, 0);
    e.count = i % n;
    return e;
  });
}

/** 기둥 하나 (틱마다): 맡은 사람에게 아주 느리게 */
export function updatePillar(s: RunState, e: EnemyState): void {
  const f = s.raidBoss?.fight;
  if (f?.cut) return;
  const players = allPlayers(s);
  const p = players[e.count] ?? players[0]!;
  const target = p.hp > 0 ? p : players.find((q) => q.hp > 0);
  if (!target) return;
  const dx = target.x - e.x;
  const dy = target.y - e.y;
  const d = Math.sqrt(dx * dx + dy * dy);
  if (d > 30) {
    e.x += (dx / d) * ENEMIES.lucpillar.speed;
    e.y += (dy / d) * ENEMIES.lucpillar.speed;
  }
}

/** 틱마다 (루시퍼가 부름): 빔·보호막 · 지진파 · 부서진 기둥 → 기절·검기 */
export function pillarTick(s: RunState, f: LucFight, boss: EnemyState): void {
  const pillars = s.enemies.filter((e) => e.kind === "lucpillar" && e.hp > 0);
  if (f.phase === 1 && s.tick >= f.beamAt) {
    f.beamAt = s.tick + L.BEAM_GAP;
    if (pillars.length > 0) {
      boss.ward = L.SHIELD;
      lucPose(s, f, 3, 60);
      for (const e of pillars) {
        for (let k = 0; k < 3; k++) f.waves.push([e.x, e.y, 0, k * R.WAVE_GAP, 0]);
        addEffect(s, { kind: "lucFx", from: "beam", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 40, maxTicks: 50, foe: true });
      }
    }
  }
  waveTick(s, f);
  // 기둥이 새로 부서짐 → 기절 + 검기 5번
  const down = 4 - pillars.length;
  if (f.phase === 1 && down > f.down) {
    f.down = down;
    f.slashN = R.SLASH_N;
    f.stunEnd = Number.MAX_SAFE_INTEGER;
    nextSlash(s, f);
  }
  slashTick(s, f);
}

/** 지진파: 커지는 고리에 닿으면 피해 (한 사람에 한 번, 대시로 넘음) */
function waveTick(s: RunState, f: LucFight): void {
  const players = allPlayers(s);
  f.waves = f.waves.filter((w) => {
    if (w[3]! > 0) {
      w[3]!--;
      return true;
    }
    w[2]! += R.WAVE_SPEED;
    players.forEach((p, i) => {
      if (p.hp <= 0 || p.raidDark || (w[4]! & (1 << i)) !== 0) return;
      const d = Math.sqrt((p.x - w[0]!) ** 2 + (p.y - w[1]!) ** 2);
      if (Math.abs(d - w[2]!) > R.WAVE_W + p.r) return;
      w[4]! |= 1 << i;
      if (p.dashTicks > 0) return remnantDodgeAt(s, i);
      lucHurt(s, L.WAVE, (_q, seat) => seat === i, false);
    });
    return w[2]! < R.WAVE_MAX;
  });
}

/** 대시로 넘은 사람 (잔영 회피 효과는 그 사람 것) */
function remnantDodgeAt(s: RunState, seat: number): void {
  if ((s.seat ?? 0) === seat) remnantDodge(s);
}

/** 다음 검기: 방향과 빈칸을 정하고 경고 */
function nextSlash(s: RunState, f: LucFight): void {
  const rng = lucRng(s, "slash", f.slashN ?? 0);
  f.slashSide = rng.int(0, 2);
  f.slashAt = s.tick + R.SLASH_WARN;
  const safe: number[] = [];
  for (let i = 0; i < R.SAFE_N; i++) safe.push(...lucSpot(rng, 50));
  f.safe = safe;
}

/** 빈칸 안인지 */
export function inSafe(f: LucFight, x: number, y: number): boolean {
  const sf = f.safe ?? [];
  for (let i = 0; i < sf.length; i += 2) if (Math.abs(x - sf[i]!) <= R.SAFE_HALF && Math.abs(y - sf[i + 1]!) <= R.SAFE_HALF) return true;
  return false;
}

function slashTick(s: RunState, f: LucFight): void {
  if (f.slashAt === undefined || s.tick < f.slashAt) return;
  // 빈칸 밖은 모두 맞음 (대시로도 못 피함)
  lucHurt(s, L.SLASH, (p) => !inSafe(f, p.x, p.y), false);
  const cx = (ROOM_MIN_X + ROOM_MAX_X) / 2;
  const cy = (ROOM_MIN_Y + ROOM_MAX_Y) / 2;
  addEffect(s, { kind: "lucFx", from: "slash", x: cx, y: cy, dirX: f.slashSide ?? 0, dirY: 0, size: ROOM_MAX_X - ROOM_MIN_X, maxTicks: 30, foe: true });
  f.slashN = (f.slashN ?? 1) - 1;
  if (f.slashN > 0) {
    nextSlash(s, f);
    f.slashAt = s.tick + R.SLASH_NEXT;
  } else {
    f.slashAt = undefined;
    f.safe = undefined;
    f.stunEnd = s.tick + 30;
  }
}

/** 경고 중인 검기 (그리기·AI): 남은 틱 */
export const slashLeft = (s: RunState, f: LucFight) => (f.slashAt === undefined ? -1 : f.slashAt - s.tick);
