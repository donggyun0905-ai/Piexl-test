import { describe, expect, it } from "vitest";
import { damageEnemy } from "./combat";
import { BOSS_LEVIATHAN_RULES as L } from "./bossLeviathan";
import { BOSS_LEV_KING_RULES as K, levTaken } from "./bossLevKing";
import { airLeft, BOSS_LEV_KIT_RULES as T, startPrison } from "./levKit";
import { ENEMIES } from "../content";
import { EMPTY_INPUT, stepSim, type EnemyState, type RunState } from "./index";
import { createPracticeRun, practiceSpawn } from "./practice";

/** 연습장 큰 방에 레비아탄 */
function levRun(): RunState {
  const run = createPracticeRun("warden");
  practiceSpawn(run, "leviathan");
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

const find = (run: RunState, kind: string) => run.enemies.find((e) => e.kind === kind && e.hp > 0);

/** 용 체력(흰 막대)을 다 깎아 고래로 */
function toWhale(run: RunState): EnemyState {
  const boss = find(run, "leviathan")!;
  steps(run, 2);
  damageEnemy(run, boss, (boss.ward ?? 0) + 10, 0, 0);
  steps(run, L.SHIFT + 5);
  return boss;
}

/** 고래를 쓰러뜨려 해왕으로 */
function toKing(run: RunState): EnemyState {
  toWhale(run);
  const whale = find(run, "levwhale")!;
  whale.hp = 0;
  steps(run, L.SHIFT + 5);
  return find(run, "levking")!;
}

describe("레비아탄", () => {
  it("체력: 용 + 고래 + 해왕 = 9600 (멸망의 용과 같음) · 켈베로스도 쉴드 + 세 사람 ≒ 9600", () => {
    expect(L.DRAGON + ENEMIES.levwhale.hp + ENEMIES.levking.hp).toBe(ENEMIES.dragon.hp);
    expect(ENEMIES.leviathan.hp).toBe(ENEMIES.levwhale.hp + ENEMIES.levking.hp);
    const trio = ENEMIES.cerbfist.hp + ENEMIES.cerbflame.hp + ENEMIES.cerbblade.hp;
    expect(trio).toBe(ENEMIES.cerberus.hp);
    expect(Math.abs(trio * 1.715 - ENEMIES.dragon.hp)).toBeLessThan(20);
  });

  it("페이즈 1: 방이 물 · 용 체력만 깎이고 제자리 · 숨이 닳다가 비눗방울에서 다시 참", () => {
    const run = levRun();
    const boss = find(run, "leviathan")!;
    steps(run, 2);
    expect(run.terrain!.water.length).toBe(1);
    const [x, y] = [boss.x, boss.y];
    const ward = boss.ward!;
    damageEnemy(run, boss, 200, 1, 0);
    steps(run, 30);
    expect(boss.ward).toBe(ward - 200);
    expect(boss.hp).toBe(boss.maxHp);
    expect([boss.x, boss.y]).toEqual([x, y]);
    steps(run, T.AIR);
    expect(airLeft(boss, 0)).toBe(0);
    boss.lhBubbles!.push([run.player.x, run.player.y, run.tick + 100]);
    steps(run, 20);
    expect(airLeft(boss, 0)).toBeGreaterThan(0.3);
  });

  it("물감옥: 갇히면 못 움직이고 숨이 두 배로 닳음 · 깨면 풀려남", () => {
    const run = levRun();
    const boss = find(run, "leviathan")!;
    steps(run, 2);
    run.player.invulnTicks = 0;
    startPrison(run, boss);
    for (let i = 0; i < T.PRISON_WARN + 1; i++) stepSim(run, EMPTY_INPUT);
    const cage = find(run, "levprison")!;
    expect(cage).toBeDefined();
    const a0 = boss.lhAir![0]!;
    steps(run, 10);
    expect(a0 - boss.lhAir![0]!).toBe(20);
    expect([run.player.x, run.player.y]).toEqual([cage.x, cage.y]);
    damageEnemy(run, cage, cage.hp + 1, 0, 0);
    steps(run, 2);
    expect(find(run, "levprison")).toBeUndefined();
  });

  it("페이즈 2: 수면 위(물은 남아 느려짐, 숨 없음) · 고래는 잠수 중 무적 · 떠오르면 맞음", () => {
    const run = levRun();
    const boss = toWhale(run);
    expect(boss.lhWet).toBe(false);
    expect(run.terrain!.water.length).toBe(1);
    const whale = find(run, "levwhale")!;
    expect(whale.immune).toBe(true);
    const hp = whale.hp;
    damageEnemy(run, whale, 100, 0, 0);
    expect(whale.hp).toBe(hp);
    let up = false;
    for (let i = 0; i < 400 && !up; i++) {
      steps(run, 1);
      up = whale.lhUp === 2;
    }
    expect(up).toBe(true);
    damageEnemy(run, whale, 100, 0, 0);
    expect(whale.hp).toBeLessThan(hp);
    steps(run, 1);
    expect(boss.hp).toBe(whale.hp + Math.round(ENEMIES.levking.hp * (boss.maxHp / ENEMIES.leviathan.hp)));
  });

  it("사슬 팔은 기절 1.5초 · 물기둥은 기절 + 느림", () => {
    const run = levRun();
    steps(run, 2);
    const p = run.player;
    p.invulnTicks = 0;
    run.hazards = [
      { tick: run.tick + 1, start: run.tick, x: p.x, y: p.y, radius: 20, damage: 1, by: "levwhale" },
    ];
    stepSim(run, EMPTY_INPUT);
    stepSim(run, EMPTY_INPUT);
    expect(p.dbStun ?? 0).toBeGreaterThan(80);
    p.dbStun = 0;
    p.invulnTicks = 0;
    run.hazards = [{ tick: run.tick + 1, start: run.tick, x: p.x, y: p.y, radius: 20, damage: 1, by: "leviathan" }];
    stepSim(run, EMPTY_INPUT);
    stepSim(run, EMPTY_INPUT);
    expect(p.dbStun ?? 0).toBeGreaterThan(30);
    expect(p.dbSlow ?? 0).toBeGreaterThan(0);
  });

  it("페이즈 3: 물이 빠지고 해왕 · 10% 아래 해일 승천(무적·숨) → 지쳐 받는 피해 1.5배 · 쓰러뜨리면 끝", () => {
    const run = levRun();
    const king = toKing(run);
    const boss = find(run, "leviathan")!;
    expect(king).toBeDefined();
    expect(run.terrain!.water.length).toBe(0);
    king.hp = Math.floor(king.maxHp * 0.09);
    steps(run, 3);
    expect(king.immune).toBe(true);
    expect(boss.lhWet).toBe(true);
    expect(run.terrain!.water.length).toBe(1);
    steps(run, K.ULT);
    expect(boss.lhWet).toBe(false);
    expect(levTaken(run, king)).toBe(K.TIRED_TAKEN);
    damageEnemy(run, king, king.hp + 10, 0, 0);
    steps(run, 3);
    expect(find(run, "leviathan")).toBeUndefined();
  });

  it("세 모습을 오래 돌려도 오류 없이 패턴이 나옴", () => {
    const run = levRun();
    steps(run, 2500);
    const boss = find(run, "leviathan")!;
    expect(boss.lhOrbs ?? 0).toBeGreaterThan(0);
    expect(run.enemies.some((e) => e.lhGhost)).toBe(true);
    toWhale(run);
    steps(run, 1500);
    const king = toKing(run);
    steps(run, 2000);
    expect(king.lhTide !== undefined || (king.lhNextTide ?? 0) > run.tick).toBe(true);
    expect(king.count).toBeGreaterThan(4);
  });

  it("같은 시드면 같은 결과", () => {
    const a = levRun();
    const b = levRun();
    steps(a, 900);
    steps(b, 900);
    expect(a.hazards!.map((h) => [h.x, h.y, h.tick])).toEqual(b.hazards!.map((h) => [h.x, h.y, h.tick]));
    expect(a.enemies.map((e) => [e.kind, e.x, e.y])).toEqual(b.enemies.map((e) => [e.kind, e.x, e.y]));
  });
});
