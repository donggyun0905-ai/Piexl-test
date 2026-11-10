// 루시퍼 2페이즈 (남성형, 움직이며 공격): 절망의 검 넷(sim/lucSwords) → 다 부수면 컷신 → 보스가 사라지고 어둠 속에 큰 원과 떨어지는 검(대시로 피함)
// → 5명 모두 사슬(화면의 방향키를 차례로 눌러 풂, 늦으면 기본 공격에 맞음) → 1대5 (모든 기본 공격) → 30줄부터 날개(몸으로 닿아 장착)
// → 바닥이 꺼짐: 날개 없는 사람은 떨어져 끝(관전) · 하늘 탄막 → 체력 0이면 쓰러지는 컷신 → 승리
import { ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "../constants";
import { chainPlayer } from "./bossBinds";
import { addShape } from "./hazards";
import { lucClearField, lucLines, lucRng, lucSpot, lucTargets, near } from "./lucKit";
import { spawnSwords, swordTick } from "./lucSwords";
import type { LucFight } from "./lucTypes";
import { allPlayers, eachSeat } from "./party";
import { RAID_LIVES } from "./raidLife";
import type { EnemyState, RunState } from "./types";
import { addEffect, enemyShot } from "./util";
import { rot } from "./orbit";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 낙하 검: 번 수 · 사이 틱 · 한 번에 원 수 · 반지름 · 경고 · 피해 */
  RAIN_N: 14,
  RAIN_GAP: 32,
  RAIN_EACH: 3,
  RAIN_R: 66,
  RAIN_WARN: 56,
  RAIN_DMG: 60,
  /** 사슬 시간 (bossBinds 사슬이 따로 끝남) */
  CHAIN: 260,
  /** 날개: 나오는 줄 · 수 · 닿는 반지름 · 바닥이 꺼지기까지 틱 */
  WING_LINES: 30,
  WINGS: 8,
  WING_R: 24,
  WING_WAIT: 600,
  /** 하늘 탄막: 나선 간격 · 고리 간격 · 탄 빠르기 · 탄 피해 */
  SPIRAL_EVERY: 5,
  RING_EVERY: 90,
  SHOT_SPEED: 1.6,
  SHOT_DMG: 22,
};
export { R as LUC_PHASE2_RULES };

/** 변신 컷신이 끝남: 절망의 검 넷 */
export function startPhase2(s: RunState, f: LucFight, spawned: EnemyState[]): void {
  f.p2 = "swords";
  spawned.push(...spawnSwords(s, f));
}

/** 2페이즈 틱 · 컷신을 시작해야 하면 그 이름 (sim/lucifer가 시작) */
export function phaseTwo(s: RunState, f: LucFight, e: EnemyState): "p2" | undefined {
  if (f.p2 === "swords") {
    swordTick(s, f);
    if (!s.enemies.some((o) => o.kind === "lucsword" && o.hp > 0)) {
      f.p2 = "rain";
      f.rainN = R.RAIN_N;
      f.rainAt = s.tick + 40;
      return "p2";
    }
    return undefined;
  }
  if (f.p2 === "rain") {
    e.immune = true;
    if (s.tick >= (f.rainAt ?? 0) && (f.rainN ?? 0) > 0) {
      f.rainN!--;
      f.rainAt = s.tick + R.RAIN_GAP;
      const rng = lucRng(s, "rain2");
      const list = lucTargets(s);
      for (let k = 0; k < R.RAIN_EACH; k++) {
        // 하나는 사람 자리, 나머지는 무작위
        const p = list[k % Math.max(1, list.length)]?.[1];
        const [x, y] = k === 0 && p ? [p.x, p.y] : lucSpot(rng, 50);
        addShape(s, R.RAIN_WARN, { x, y, radius: R.RAIN_R, damage: R.RAIN_DMG, fx: "lucFx", from: "swordfall", by: "lucifer" });
      }
    } else if ((f.rainN ?? 0) <= 0 && s.tick >= (f.rainAt ?? 0) + R.RAIN_WARN) {
      // 모두 사슬에 묶임
      f.p2 = "chain";
      f.chainEnd = s.tick + R.CHAIN;
      eachSeat(s, () => !s.player.raidDark && chainPlayer(s), true);
    }
    return undefined;
  }
  if (f.p2 === "chain" && s.tick >= (f.chainEnd ?? 0)) f.p2 = "open";
  if (f.p2 === "open" && lucLines(e.hp, 2) <= R.WING_LINES) {
    f.p2 = "wings";
    f.fallAt = s.tick + R.WING_WAIT;
    const rng = lucRng(s, "wing");
    f.wings = Array.from({ length: R.WINGS }, () => lucSpot(rng, 60));
  }
  if (f.p2 === "wings") wingTick(s, f);
  if (f.p2 === "sky") skyTick(s, f, e);
  return undefined;
}

/** 날개 줍기 · 바닥이 꺼짐 (날개 없으면 끝) */
function wingTick(s: RunState, f: LucFight): void {
  eachSeat(s, () => {
    const p = s.player;
    if (p.raidWing || p.hp <= 0) return;
    const k = (f.wings ?? []).findIndex((w) => near(p, w[0]!, w[1]!, R.WING_R + p.r));
    if (k < 0) return;
    p.raidWing = true;
    f.wings!.splice(k, 1);
    addEffect(s, { kind: "lucFx", from: "wingOn", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 30, maxTicks: 30, foe: true });
  });
  if (s.tick < (f.fallAt ?? 0)) return;
  // 바닥이 꺼짐: 남은 효과·장판·탄·돌기둥·기둥·졸개를 모두 치움 (2026-11-10 사용자 요청)
  lucClearField(s);
  s.enemies = s.enemies.filter((e) => e.kind === "lucifer");
  f.p2 = "sky";
  f.wings = [];
  f.spin = 0;
  eachSeat(s, () => {
    const p = s.player;
    // 쓰러져 다시 살아나길 기다리는 사람은 떨어지지 않음 (살아나면 날개를 달고 나옴, skyTick)
    if (p.raidWing || p.hp <= 0) return;
    // 날개를 못 단 사람: 떨어짐 (데스 카운트와 상관없이 끝 → 관전)
    p.hp = 0;
    p.raidDownAt = s.tick;
    p.raidDeaths = RAID_LIVES;
    addEffect(s, { kind: "lucFx", from: "fall", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 30, maxTicks: 40, foe: true });
  });
  addEffect(s, { kind: "lucFx", from: "collapse", x: (ROOM_MIN_X + ROOM_MAX_X) / 2, y: (ROOM_MIN_Y + ROOM_MAX_Y) / 2, dirX: 0, dirY: 0, size: ROOM_MAX_X - ROOM_MIN_X, maxTicks: 50, foe: true });
}

/** 하늘 탄막: 보스는 위쪽 가운데로 떠오르고 나선·고리 탄 */
function skyTick(s: RunState, f: LucFight, e: EnemyState): void {
  const cx = (ROOM_MIN_X + ROOM_MAX_X) / 2;
  const cy = ROOM_MIN_Y + 130;
  e.x += (cx - e.x) * 0.02;
  e.y += (cy - e.y) * 0.02;
  // 다시 살아난 사람도 날개를 달고 나옴
  for (const p of allPlayers(s)) if (p.hp > 0) p.raidWing = true;
  f.spin = (f.spin ?? 0) + 1;
  if (f.spin % R.SPIRAL_EVERY === 0) {
    const [dx, dy] = rot(f.spin * 0.13);
    for (const k of [1, -1]) enemyShot(s, e.x, e.y, dx * k, dy * k, R.SHOT_SPEED, R.SHOT_DMG).from = "lucBolt";
  }
  if (f.spin % R.RING_EVERY === 0) {
    for (let k = 0; k < 20; k++) {
      const [dx, dy] = rot((k / 20) * Math.PI * 2 + f.spin * 0.05);
      enemyShot(s, e.x, e.y, dx, dy, R.SHOT_SPEED * 0.8, R.SHOT_DMG).from = "lucBolt";
    }
  }
}

/** 보스가 사라져 있는지 (낙하 검 동안) */
export const lucHidden = (f: LucFight | undefined) => f?.p2 === "rain";
/** 날개 반지름 (그리기·AI) */
export const LUC_WING_R = R.WING_R;
