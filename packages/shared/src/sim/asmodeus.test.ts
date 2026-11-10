import { describe, expect, it } from "vitest";
import { ENEMIES } from "../content";
import { chessColor, chessSafe, startChess } from "./asmoKit";
import { BOSS_ASMO_ULTS_RULES as U } from "./asmoUlts";
import { asmoLines, lineHp } from "./bossAsmo";
import { BOSS_ASMO_EXTRA_RULES as X } from "./bossAsmoExtra";
import { asmoTaken, BOSS_ASMO_LORD_RULES as L } from "./bossAsmoLord";
import { bouncePath } from "./bossAsmoLust";
import { BOSS_ASMO_VOID_RULES as V, LASER_ZONES, laserVolley } from "./bossAsmoVoid";
import { damageEnemy } from "./combat";
import { EMPTY_INPUT, stepSim, type EnemyState, type RunState } from "./index";
import { createPracticeRun, practiceSpawn } from "./practice";
import { ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";

function asmoRun(): RunState {
  const run = createPracticeRun("warden");
  practiceSpawn(run, "asmodeus");
  return run;
}

function steps(run: RunState, n: number, safe = true): void {
  for (let i = 0; i < n; i++) {
    stepSim(run, EMPTY_INPUT);
    if (safe) {
      run.player.invulnTicks = 99999;
      run.player.hp = run.player.stats.maxHp;
    }
  }
}

const boss = (run: RunState) => run.enemies.find((e) => e.kind === "asmodeus" && e.hp > 0)!;

/** 체력을 n줄 남게 (변신 궁극기가 있으면 그 줄에서 멈춤) */
function cutTo(run: RunState, e: EnemyState, lines: number): void {
  e.hp = Math.round(lineHp(e) * lines) - 1;
  steps(run, 2);
}

describe("아스모데우스의 화신체", () => {
  it("체력 9600 (다른 라스트 보스와 같음) · 100줄 · 한 줄 깎으면 ×99", () => {
    expect(ENEMIES.asmodeus.hp).toBe(ENEMIES.dragon.hp);
    const run = asmoRun();
    const e = boss(run);
    steps(run, 2);
    expect(asmoLines(e)).toBe(100);
    damageEnemy(run, e, lineHp(e) + 1, 0, 0);
    expect(asmoLines(e)).toBe(99);
    expect(e.amForm).toBe(1);
  });

  it("75줄: 넘친 피해는 버리고 무적 궁극기 → 끝나면 검은 해 · 50줄: 군주의 강림 → 강철 군주 · 10줄: 마지막 궁극기 → 지침", () => {
    const run = asmoRun();
    const e = boss(run);
    steps(run, 2);
    e.hp = Math.round(lineHp(e) * 60);
    steps(run, 1);
    expect(e.amUlt).toBe(1);
    expect(asmoLines(e)).toBe(75);
    expect(e.immune).toBe(true);
    damageEnemy(run, e, 9999, 0, 0);
    expect(asmoLines(e)).toBe(75);
    steps(run, U.ULT + 2);
    expect(e.amUlt).toBeUndefined();
    expect(e.amForm).toBe(2);
    cutTo(run, e, 40);
    expect(e.amUlt).toBe(2);
    expect(asmoLines(e)).toBe(50);
    steps(run, U.ULT + 2);
    expect(e.amForm).toBe(3);
    cutTo(run, e, 5);
    expect(e.amUlt).toBe(3);
    expect(asmoLines(e)).toBe(10);
    steps(run, U.ULT + 2);
    expect((e.amTired ?? 0) > run.tick).toBe(true);
    expect(asmoTaken(run, e)).toBeGreaterThan(1);
  });

  it("미니 블랙홀: 먹는 동안 체력이 줄지 않고 먹은 피해가 쌓임 → 끝나면 되돌려 쏨", () => {
    const run = asmoRun();
    const e = boss(run);
    steps(run, 2);
    e.amEatEnd = run.tick + 30;
    e.amEaten = 0;
    const hp = e.hp;
    damageEnemy(run, e, 200, 0, 0);
    steps(run, 1);
    expect(e.hp).toBe(hp);
    expect(e.amEaten).toBeGreaterThan(0);
    const before = run.projectiles.filter((p) => !p.fromPlayer).length;
    steps(run, 40);
    expect(e.amEatEnd).toBeUndefined();
    expect(run.projectiles.filter((p) => !p.fromPlayer).length).toBeGreaterThan(before);
  });

  it("강철의 몸: 앞에서 맞으면 -90%, 등 뒤는 그대로", () => {
    const run = asmoRun();
    const e = boss(run);
    steps(run, 2);
    e.amArmor = run.tick + 100;
    e.amFaceX = 0;
    e.amFaceY = 1;
    run.player.x = e.x;
    run.player.y = e.y + 40;
    expect(asmoTaken(run, e)).toBeCloseTo(L.ARMOR_TAKEN);
    run.player.y = e.y - 40;
    expect(asmoTaken(run, e)).toBe(1);
  });

  it("보라 레이저: 늘 맞지 않는 칸이 하나 남음 · 마창은 벽에 튕김", () => {
    const run = asmoRun();
    steps(run, 2);
    for (let k = 0; k < 20; k++) {
      run.hazards = [];
      laserVolley(run, k);
      const w = (ROOM_MAX_X - ROOM_MIN_X) / LASER_ZONES;
      const h = (ROOM_MAX_Y - ROOM_MIN_Y) / LASER_ZONES;
      let free = false;
      for (let c = 0; c < LASER_ZONES; c++)
        for (let r = 0; r < LASER_ZONES; r++) {
          const x = ROOM_MIN_X + (c + 0.5) * w;
          const y = ROOM_MIN_Y + (r + 0.5) * h;
          if (!run.hazards.some((z) => (z.x === z.toX ? Math.abs(x - z.x) < w / 2 : Math.abs(y - z.y) < h / 2))) free = true;
        }
      expect(free).toBe(true);
    }
    const path = bouncePath(ROOM_MIN_X + 50, ROOM_MIN_Y + 50, 0.6, 0.8, 2);
    expect(path.length).toBe(4);
    expect(V.LASERS).toBe(5);
  });

  it("두 빛의 바닥: 보스 불꽃과 다른 색 칸에 있으면 맞음", () => {
    const run = asmoRun();
    const e = boss(run);
    steps(run, 2);
    startChess(run, e, 300);
    const safe = chessSafe(run, e);
    const p = run.player;
    while (chessColor(p.x, p.y) === safe) p.x += 40;
    p.invulnTicks = 0;
    const hp = p.hp;
    steps(run, 30, false);
    expect(p.hp).toBeLessThan(hp);
  });

  it("추가 패턴: 꽃잎 회오리는 큰 탄 · 강철 돌진은 예고선 끝으로 이동 · 칼날 폭풍은 고리 3번", () => {
    const run = asmoRun();
    const e = boss(run);
    steps(run, 2);
    e.amNextEx1 = run.tick;
    steps(run, 2);
    expect(e.amPetalEnd).toBeDefined();
    steps(run, 20);
    expect(run.projectiles.some((p) => !p.fromPlayer && p.r === X.PETAL_SIZE)).toBe(true);
    e.amForm = 3;
    steps(run, 1);
    e.amNextEx1 = e.amNextEx2 = run.tick;
    steps(run, 2);
    const to = e.amCharge!;
    expect(to).toBeDefined();
    steps(run, X.CHARGE_WARN + 2);
    expect(e.amCharge).toBeUndefined();
    expect(Math.hypot(e.x - to[0], e.y - to[1])).toBeLessThan(2);
    steps(run, X.BLADE_GAP * X.BLADES);
    expect(e.amBladeAt).toBeUndefined();
  });

  it("전체를 돌려도 오류 없음 · 시드가 같으면 결과가 같음", () => {
    const a = asmoRun();
    const b = asmoRun();
    for (const run of [a, b]) {
      const e = boss(run);
      steps(run, 1500);
      cutTo(run, e, 60);
      steps(run, 2400);
      cutTo(run, e, 30);
      steps(run, 3000);
    }
    expect(boss(a).hp).toBe(boss(b).hp);
    expect(a.player.x).toBe(b.player.x);
    expect(a.projectiles.length).toBe(b.projectiles.length);
  });
});
