// 루시퍼 2페이즈 절망의 검 (4개, 체력 각 10000): 유저 한 명씩 맡아 느리게 다가옴 · 검이 패턴 색으로 빛나다(1초) 맵 곳곳에 패턴
// 패턴 (레이드용 맵 잔패턴 그림): 0 붉은 X 사슬(감속) · 1 얼음 가시 줄(감속) · 2 금빛 검 비(치유 감소) · 3 불꽃 분출(화상) · 4 가시 덩굴 장판(독·감속) · 5 어둠의 소용돌이 손(기절)
// 검이 남아 있으면 15초마다 맵 전체 기절 0.5초 (1초 전 경고)
import { ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "../constants";
import { addShape } from "./hazards";
import { lucHurt, lucRng, lucSpot, lucStatus, lucTargets, near } from "./lucKit";
import type { LucFight } from "./lucTypes";
import { allPlayers, eachSeat } from "./party";
import type { EnemyState, RunState } from "./types";
import { addEffect, makeEnemy } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 빛나는 틱 (경고) · 패턴 사이 · 검마다 어긋나는 틱 */
  GLOW: 60,
  GAP: 400,
  STAGGER: 100,
  /** 맵 전체 기절: 간격 · 경고 · 기절 틱 */
  STUN_GAP: 900,
  STUN_WARN: 60,
  STUN: 30,
  /** 패턴 피해 */
  DMG: 44,
  /** 가시 덩굴: 수 · 반지름 · 남는 틱 · 피해 간격 · 피해 */
  VINES: 5,
  VINE_R: 60,
  VINE_LIFE: 300,
  VINE_EVERY: 30,
  VINE_DMG: 8,
};
export { R as LUC_SWORD_RULES };
/** 패턴 수 (그리기 색) */
export const SWORD_PATTERNS = 6;

/** 2페이즈 시작: 네 모서리에 검 넷 */
export function spawnSwords(s: RunState, f: LucFight): EnemyState[] {
  const n = allPlayers(s).length;
  const m = 90;
  const spots = [
    [ROOM_MIN_X + m, ROOM_MIN_Y + m],
    [ROOM_MAX_X - m, ROOM_MIN_Y + m],
    [ROOM_MIN_X + m, ROOM_MAX_Y - m],
    [ROOM_MAX_X - m, ROOM_MAX_Y - m],
  ];
  f.swords = [];
  f.stunAt = s.tick + R.STUN_GAP;
  return spots.map(([x, y], i) => {
    const e = makeEnemy(s, "lucsword", x!, y!, 1, 0);
    e.count = i % n;
    f.swords!.push([e.id, i % SWORD_PATTERNS, s.tick + 240 + i * R.STAGGER]);
    return e;
  });
}

/** 검 하나 (틱마다): 맡은 사람에게 느리게 */
export function updateSword(s: RunState, e: EnemyState): void {
  if (s.raidBoss?.fight?.cut) return;
  const players = allPlayers(s);
  const p = players[e.count];
  const t = p && p.hp > 0 && !p.raidDark ? p : players.find((q) => q.hp > 0 && !q.raidDark);
  if (!t) return;
  const dx = t.x - e.x;
  const dy = t.y - e.y;
  const d = Math.sqrt(dx * dx + dy * dy);
  if (d > 40) {
    e.x += (dx / d) * 0.12;
    e.y += (dy / d) * 0.12;
  }
}

/** 지금 빛나는 패턴 (그리기: 없으면 -1) */
export function swordGlow(s: RunState, f: LucFight, id: number): number {
  const w = f.swords?.find((x) => x[0] === id);
  return w && w[2]! - s.tick <= R.GLOW ? w[1]! : -1;
}

/** 틱마다 (루시퍼가 부름): 패턴 · 맵 전체 기절 · 가시 덩굴 */
export function swordTick(s: RunState, f: LucFight): void {
  const alive = s.enemies.filter((e) => e.kind === "lucsword" && e.hp > 0);
  for (const w of f.swords ?? []) {
    const e = alive.find((x) => x.id === w[0]);
    if (!e || s.tick < w[2]!) continue;
    cast(s, f, e, w[1]!);
    w[1] = (w[1]! + 1) % SWORD_PATTERNS;
    w[2] = s.tick + R.GAP;
  }
  if (alive.length > 0 && f.stunAt !== undefined && s.tick >= f.stunAt) {
    f.stunAt = s.tick + R.STUN_GAP;
    eachSeat(s, () => {
      const p = s.player;
      if (!p.raidDark) p.dbStun = Math.max(p.dbStun ?? 0, R.STUN);
    }, true);
    addEffect(s, { kind: "lucFx", from: "stunAll", x: (ROOM_MIN_X + ROOM_MAX_X) / 2, y: (ROOM_MIN_Y + ROOM_MAX_Y) / 2, dirX: 0, dirY: 0, size: ROOM_MAX_X - ROOM_MIN_X, maxTicks: 30, foe: true });
  }
  // 가시 덩굴: 안에 있으면 0.5초마다 피해 + 독·감속
  f.vines = (f.vines ?? []).filter((v) => s.tick < v[3]!);
  if (s.tick % R.VINE_EVERY === 0)
    for (const v of f.vines) {
      lucHurt(s, R.VINE_DMG, (p) => near(p, v[0]!, v[1]!, v[2]! + p.r), false, "poison");
      eachSeat(s, () => near(s.player, v[0]!, v[1]!, v[2]!) && lucStatus(s.player, "slow"), true);
    }
}

/** 맵 전체 기절 경고 중인지 (그리기) */
export const stunWarn = (s: RunState, f: LucFight) => f.stunAt !== undefined && f.stunAt - s.tick <= R.STUN_WARN && s.enemies.some((e) => e.kind === "lucsword" && e.hp > 0);

function cast(s: RunState, f: LucFight, e: EnemyState, pat: number): void {
  const rng = lucRng(s, "sword", e.id);
  const targets = lucTargets(s);
  addEffect(s, { kind: "lucFx", from: "swordCast", x: e.x, y: e.y, dirX: pat, dirY: 0, size: 40, maxTicks: 30, foe: true });
  if (pat === 0) {
    // 붉은 X 사슬: 맵 곳곳 X자 세 개
    for (let k = 0; k < 3; k++) {
      const [x, y] = lucSpot(rng, 120);
      for (const sg of [1, -1]) addShape(s, 70, { x: x - 160, y: y - 160 * sg, toX: x + 160, toY: y + 160 * sg, width: 14, radius: 0, damage: R.DMG, fx: "lucFx", from: "chainx", by: "lucifer" });
    }
  } else if (pat === 1) {
    // 얼음 가시: 검에서 맡은 사람 쪽으로 차례로 솟음
    for (const [, p] of targets.slice(0, 3)) {
      const d = Math.sqrt((p.x - e.x) ** 2 + (p.y - e.y) ** 2) || 1;
      for (let k = 1; k <= 10; k++) addShape(s, 40 + k * 6, { x: e.x + ((p.x - e.x) / d) * k * 44, y: e.y + ((p.y - e.y) / d) * k * 44, radius: 26, damage: R.DMG * 0.8, fx: "lucFx", from: "ice", by: "lucifer" }, k * 4);
    }
  } else if (pat === 2) {
    // 금빛 검 비: 사람들 둘레에 떨어짐
    for (let k = 0; k < 14; k++) {
      const [, p] = targets[k % Math.max(1, targets.length)] ?? [0, { x: (ROOM_MIN_X + ROOM_MAX_X) / 2, y: (ROOM_MIN_Y + ROOM_MAX_Y) / 2 }];
      addShape(s, 70 + (k % 4) * 8, { x: p.x + (rng.nextFloat() - 0.5) * 300, y: p.y + (rng.nextFloat() - 0.5) * 300, radius: 32, damage: R.DMG, fx: "lucFx", from: "gold", by: "lucifer" });
    }
  } else if (pat === 3) {
    // 불꽃 분출: 맵 곳곳 큰 원
    for (let k = 0; k < 8; k++) {
      const [x, y] = lucSpot(rng, 60);
      addShape(s, 80, { x, y, radius: 56, damage: R.DMG, fx: "lucFx", from: "meteor", by: "lucifer" });
    }
  } else if (pat === 4) {
    // 가시 덩굴 장판 (남음)
    for (let k = 0; k < R.VINES; k++) {
      const [x, y] = lucSpot(rng, 80);
      (f.vines ??= []).push([x, y, R.VINE_R, s.tick + R.VINE_LIFE]);
    }
  } else {
    // 어둠의 손: 모든 사람 발밑
    for (const [, p] of targets) addShape(s, 55, { x: p.x, y: p.y, radius: 34, damage: R.DMG, fx: "lucFx", from: "hand", by: "lucifer" });
  }
}
