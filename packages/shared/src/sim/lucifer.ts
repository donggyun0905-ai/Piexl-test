// 레이드 보스 루시퍼 (docs/RAID_LUCIFER.md): 체력 = 1페이즈 44000 + 2페이즈 44000 (페이즈마다 줄 ×99)
// 1페이즈 여성형: 움직이지 않음 · 석화의 기둥 4개(sim/lucPillars) · 기본 공격(sim/lucAttacks) · 기둥 둘 뒤 어둠의 기둥(sim/lucDark)
// 기둥 넷이 다 부서지면: 맵이 흔들리고 흰색 돔 → 2.5초 뒤 컷신 → 돔 밖은 최대 체력 80% 피해 → 이후 X자·보라 구 · 30줄부터 악마의 불길
// 1페이즈 체력을 다 깎으면 변신 컷신 → 2페이즈 남성형 (움직이며 공격)
import { ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "../constants";
import { lucAttackTick, lucBasic } from "./lucAttacks";
import { darkTick, flameTick } from "./lucDark";
import { LUC_RULES as L, lucFight, lucLines, lucRng, lucSpot, lucTargets, near } from "./lucKit";
import { pillarTick, spawnPillars } from "./lucPillars";
import type { LucCut, LucFight } from "./lucTypes";
import { eachSeat } from "./party";
import type { EnemyState, RunState } from "./types";
import { addEffect, makeEnemy } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 컷신 길이 (틱): 기둥 필살기 · 변신 · 2페이즈 필살기 · 쓰러짐 */
  CUT_PILLARS: 140,
  CUT_CHANGE: 135,
  CUT_P2: 125,
  CUT_DEATH: 110,
  /** 흰색 돔: 나타나고 컷신까지 (2.5초) · 반지름 */
  DOME_WAIT: 150,
  DOME_R: 46,
  /** 2페이즈: 걷는 빠르기 · 떨어져 있으려는 거리 */
  WALK: 0.45,
  KEEP: 110,
};
export { R as LUCIFER_RULES };

const CUT_TICKS: Record<LucCut, number> = { pillars: R.CUT_PILLARS, change: R.CUT_CHANGE, p2: R.CUT_P2, death: R.CUT_DEATH };

/** 레이드 방에 처음 들어갈 때: 루시퍼(방 가운데) + 석화의 기둥 넷 */
export function spawnLucifer(s: RunState): EnemyState[] {
  const boss = makeEnemy(s, "lucifer", (ROOM_MIN_X + ROOM_MAX_X) / 2, (ROOM_MIN_Y + ROOM_MAX_Y) / 2 + 10, 1, 0);
  return [boss, ...spawnPillars(s, boss)];
}

/** 컷신 시작: 모두 멈추고 적 공격·위험 표시를 치움 */
export function startCut(s: RunState, f: LucFight, cut: LucCut): void {
  f.cut = cut;
  f.cutEnd = s.tick + CUT_TICKS[cut];
  s.hazards = [];
  s.projectiles = s.projectiles.filter((p) => p.fromPlayer);
  f.mines = [];
  f.crowns = [];
  f.xs = [];
  f.orbs = [];
  f.waves = [];
}

export function updateLucifer(s: RunState, e: EnemyState, toP: readonly [number, number], spawned: EnemyState[]): void {
  const f = lucFight(s);
  e.stunTicks = 0;
  if (f.poseEnd <= s.tick) f.pose = 0;
  if (f.cut) {
    e.immune = true;
    if (s.tick >= (f.cutEnd ?? 0)) endCut(s, f, e);
    return;
  }
  e.immune = false;
  // 1페이즈 체력을 다 깎음 → 변신 (넘친 피해는 버림)
  if (f.phase === 1 && e.hp <= L.PHASE_HP) {
    e.hp = L.PHASE_HP;
    e.ward = 0;
    for (const o of s.enemies) if (o.kind === "lucpillar" || o.kind === "lucflame") o.hp = 0;
    return startCut(s, f, "change");
  }
  if (f.phase === 1) phaseOne(s, f, e, spawned);
  else walk(e, toP, s);
  lucAttackTick(s, f);
  const stunned = (f.stunEnd ?? 0) > s.tick;
  if (!stunned && s.tick >= f.nextAtk && lucTargets(s).length > 0) {
    f.nextAtk = s.tick + (f.phase === 1 ? L.ATK_GAP : L.ATK_GAP_2);
    lucBasic(s, f);
  }
}

function phaseOne(s: RunState, f: LucFight, e: EnemyState, spawned: EnemyState[]): void {
  pillarTick(s, f, e);
  if (f.down >= 2) darkTick(s, f, spawned);
  if (lucLines(e.hp, 1) <= L.FLAME_LINES) flameTick(s, f, spawned);
  // 기둥 넷이 다 부서짐 → 흔들림 + 흰색 돔 → 컷신
  if (f.down >= 4 && !f.domeDone && !f.dome && (f.stunEnd ?? 0) <= s.tick) {
    const [x, y] = lucSpot(lucRng(s, "dome"), 70);
    f.dome = [x, y, s.tick + R.DOME_WAIT];
  }
  if (f.dome) {
    if ((f.dome[2]! - s.tick) % 20 === 0) addEffect(s, { kind: "lucFx", from: "quake", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 60, maxTicks: 18, foe: true });
    if (s.tick >= f.dome[2]!) startCut(s, f, "pillars");
  }
}

/** 2페이즈: 가장 가까운 사람과 거리를 두며 걸음 */
function walk(e: EnemyState, toP: readonly [number, number], s: RunState): void {
  const p = s.player;
  const d = Math.sqrt((p.x - e.x) ** 2 + (p.y - e.y) ** 2);
  const dir = d > R.KEEP + 20 ? 1 : d < R.KEEP - 20 ? -0.6 : 0;
  e.x += toP[0] * R.WALK * dir;
  e.y += toP[1] * R.WALK * dir;
}

function endCut(s: RunState, f: LucFight, e: EnemyState): void {
  const cut = f.cut;
  f.cut = undefined;
  f.nextAtk = s.tick + 90;
  if (cut === "pillars" && f.dome) {
    // 돔 밖에 있던 사람: 최대 체력 80% (어둠의 세계는 제외)
    const [x, y] = f.dome;
    eachSeat(
      s,
      () => {
        const p = s.player;
        if (p.raidDark || near(p, x!, y!, R.DOME_R + p.r)) return;
        p.hp -= Math.ceil(p.stats.maxHp * L.DOME_CUT);
        addEffect(s, { kind: "lucFx", from: "domeHit", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 24, maxTicks: 24, foe: true });
      },
      true,
    );
    f.dome = undefined;
    f.domeDone = true;
  }
  if (cut === "change") {
    f.phase = 2;
    f.dark = undefined;
    f.stunEnd = undefined;
    f.slashAt = undefined;
    e.r = 30;
  }
}

/** 컷신 중인지 (모두 멈춤) */
export const lucCutting = (s: RunState) => !!s.raidBoss?.fight?.cut;
/** 흰색 돔 반지름 (그리기·AI) */
export const LUC_DOME_R = R.DOME_R;
