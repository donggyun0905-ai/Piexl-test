// 루시퍼 기본 공격 (docs/RAID_LUCIFER.md 4절): 손 마법진 → 발밑 어둠 불기둥 · 별 고리(닿으면 터짐) · 머리 위 가시 고리(두 번 깜빡이고 내리꽂힘)
// 기둥 넷이 부서진 뒤 더해짐: X자(위험 표시 없음, 다 그려지면 판정) · 보라 구(경고 없이 나타나 끌어당긴 뒤 터짐)
// 상태이상: 불기둥 화상 · 별 고리 감속 · 가시 고리 기절 · X자 치유 감소 50% · 보라 구 독
import { addShape } from "./hazards";
import { LUC_RULES as L, lucHurt, lucPose, lucRng, lucSpot, lucTargets, near } from "./lucKit";
import type { LucFight } from "./lucTypes";
import { allPlayers } from "./party";
import type { RunState } from "./types";
import { addEffect } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) · 크기는 큰 레이드 방에 맞춰 2배 (2026-11-09 사용자 요청) */
const R = {
  /** 어둠 불기둥: 경고 틱 · 반지름 (대시로 피할 만큼 큼) */
  FIRE_WARN: 70,
  FIRE_R: 76,
  /** 별 고리: 한 번에 수 · 남는 틱 · 닿는 반지름 · 터지는 반지름 */
  MINE_N: 9,
  MINE_LIFE: 180,
  MINE_TOUCH: 28,
  MINE_BLAST: 60,
  /** 가시 고리: 머리 위에 있는 3·4·5초 중 하나 · 마지막 두 번 깜빡임 틱 · 반지름 */
  CROWN_MIN: 180,
  CROWN_MAX: 300,
  CROWN_BLINK: 44,
  CROWN_R: 52,
  /** X자: 다 그려지기까지 틱 · 팔 길이 · 굵기(반) */
  X_DRAW: 42,
  X_LEN: 220,
  X_W: 20,
  /** 보라 구: 끌어당기는 틱 · 당기는 빠르기 · 터지는 반지름 */
  ORB_PULL: 80,
  ORB_SPEED: 0.9,
  ORB_R: 112,
};
export { R as LUC_ATTACK_RULES };

/** 다음 기본 공격 하나 (기둥이 남아 있는 동안은 불기둥·별 고리·가시 고리, 돔 뒤에는 X자·보라 구도) */
export function lucBasic(s: RunState, f: LucFight): void {
  const kinds = f.domeDone || f.phase === 2 ? 5 : 3;
  const k = f.atkN++ % kinds;
  if (k === 0) fire(s, f);
  else if (k === 1) mines(s, f);
  else if (k === 2) crowns(s, f);
  else if (k === 3) xMarks(s, f);
  else orb(s, f);
}

function fire(s: RunState, f: LucFight): void {
  lucPose(s, f, 1, 50);
  for (const [, p] of lucTargets(s)) addShape(s, R.FIRE_WARN, { x: p.x, y: p.y, radius: R.FIRE_R, damage: L.FIRE, fx: "lucFx", from: "fire", by: "lucifer" });
}

function mines(s: RunState, f: LucFight): void {
  lucPose(s, f, 2, 40);
  const rng = lucRng(s, "mine");
  for (let i = 0; i < R.MINE_N; i++) {
    const [x, y] = lucSpot(rng);
    f.mines.push([x, y, s.tick + R.MINE_LIFE]);
  }
}

function crowns(s: RunState, f: LucFight): void {
  lucPose(s, f, 4, 40);
  const rng = lucRng(s, "crown");
  const list = lucTargets(s);
  // 두 사람까지 (혼자면 하나)
  for (let i = 0; i < Math.min(2, list.length); i++) {
    const [seat, p] = list[rng.int(0, list.length - 1)]!;
    if (f.crowns.some((c) => c[0] === seat)) continue;
    const secs = rng.int(3, 5);
    f.crowns.push([seat, s.tick + secs * 60 + R.CROWN_BLINK, p.x, p.y - 20, 0]);
  }
}

function xMarks(s: RunState, f: LucFight): void {
  lucPose(s, f, 3, 40);
  for (const [, p] of lucTargets(s)) f.xs.push([p.x, p.y, s.tick + R.X_DRAW]);
}

function orb(s: RunState, f: LucFight): void {
  lucPose(s, f, 2, 40);
  const [x, y] = lucSpot(lucRng(s, "orb"), 80);
  f.orbs.push([x, y, s.tick + R.ORB_PULL]);
}

/** 틱마다: 별 고리 닿기 · 가시 고리 따라가기·떨어지기 · X자 판정 · 보라 구 당기기·터지기 */
export function lucAttackTick(s: RunState, f: LucFight): void {
  const players = allPlayers(s);
  // 별 고리: 몸이 닿으면 터짐 (그 둘레 모두)
  f.mines = f.mines.filter(([x, y, end]) => {
    if (s.tick >= end!) return false;
    if (!players.some((p) => p.hp > 0 && !p.raidDark && near(p, x!, y!, R.MINE_TOUCH + p.r))) return true;
    lucHurt(s, L.MINE, (p) => near(p, x!, y!, R.MINE_BLAST + p.r), false, "slow");
    addEffect(s, { kind: "lucFx", from: "mine", x: x!, y: y!, dirX: 0, dirY: 0, size: R.MINE_BLAST, maxTicks: 20, foe: true });
    return false;
  });
  // 가시 고리: 깜빡이기 전까지 머리 위를 따라감 → 그 자리에 내리꽂힘
  f.crowns = f.crowns.filter((c) => {
    const p = players[c[0]!];
    if (s.tick < c[1]! - R.CROWN_BLINK && p) {
      c[2] = p.x;
      c[3] = p.y - 20;
    } else c[4] = 1;
    if (s.tick < c[1]!) return true;
    const x = c[2]!;
    const y = c[3]! + 20;
    lucHurt(s, L.CROWN, (q) => near(q, x, y, R.CROWN_R + q.r), true, "stun");
    addEffect(s, { kind: "lucFx", from: "crown", x, y, dirX: 0, dirY: 0, size: R.CROWN_R, maxTicks: 22, foe: true });
    return false;
  });
  // X자: 다 그려지는 순간 두 대각선 위에 있으면 맞음
  f.xs = f.xs.filter(([x, y, at]) => {
    if (s.tick < at!) return true;
    lucHurt(s, L.X, (p) => onX(p.x - x!, p.y - y!, p.r), true, "cut");
    addEffect(s, { kind: "lucFx", from: "x", x: x!, y: y!, dirX: 0, dirY: 0, size: R.X_LEN, maxTicks: 18, foe: true });
    return false;
  });
  // 보라 구: 모두를 끌어당기다 터짐
  f.orbs = f.orbs.filter(([x, y, at]) => {
    for (const p of players) {
      if (p.hp <= 0 || p.raidDark) continue;
      const dx = x! - p.x;
      const dy = y! - p.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      if (d > 8) {
        p.x += (dx / d) * R.ORB_SPEED;
        p.y += (dy / d) * R.ORB_SPEED;
      }
    }
    if (s.tick < at!) return true;
    lucHurt(s, L.ORB, (p) => near(p, x!, y!, R.ORB_R + p.r), true, "poison");
    addEffect(s, { kind: "lucFx", from: "orb", x: x!, y: y!, dirX: 0, dirY: 0, size: R.ORB_R, maxTicks: 24, foe: true });
    return false;
  });
}

/** X자 두 대각선(팔 길이 X_LEN) 위인지 */
/** X자 두 대각선 위인지 (AI 피하기도 씀, sim/raidBot) */
export function onX(dx: number, dy: number, r: number): boolean {
  const w = R.X_W + r;
  if (Math.abs(dx) > R.X_LEN || Math.abs(dy) > R.X_LEN) return false;
  // 대각선까지 거리 = |dx ∓ dy| / √2
  return Math.abs(dx - dy) * 0.7071 <= w || Math.abs(dx + dy) * 0.7071 <= w;
}
