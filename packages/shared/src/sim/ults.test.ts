import { describe, expect, it } from "vitest";
import { damageEnemy, damagePlayer } from "./combat";
import { cageRect } from "./bossCage";
import { HELL_CHARGE, HELL_COLS, HELL_WAVES, hellCell, hellFireAt, startHellfire, updateHellfire } from "./bossUlts";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { continueToLastFloor } from "./rooms";
import { enemyShot, makeEnemy } from "./util";

function boss(kind: "dragon" | "godeater" | "plight" | "pdark", hp: number, seed = 11): RunState {
  const run = createRun(seed, "warden");
  continueToLastFloor(run, kind === "pdark" ? "plight" : kind);
  const e = makeEnemy(run, kind, 160, 50, 1, 10);
  e.maxHp = 5000;
  e.hp = hp;
  if (kind === "plight" || kind === "pdark") e.step = 2;
  run.enemies = [e];
  return run;
}

function steps(run: RunState, n: number, watch?: (r: RunState) => void): void {
  for (let i = 0; i < n; i++) {
    stepSim(run, EMPTY_INPUT);
    run.player.invulnTicks = 99999;
    watch?.(run);
  }
}

describe("라스트 보스 궁극기 (체력 10%)", () => {
  it("용 염옥: 10% 아래에서 한 번 · 안전한 칸은 이웃으로만 옮겨 가고, 마지막 장면부터 거꾸로 터짐 · 안전한 칸 밖이면 맞음", () => {
    const run = boss("dragon", 400);
    steps(run, 2);
    const e = run.enemies[0]!;
    expect(e.ultDone).toBe(true);
    expect(e.ultSafe).toHaveLength(HELL_WAVES);
    const safe = e.ultSafe!;
    for (let i = 1; i < safe.length; i++) {
      const dx = Math.abs((safe[i]! % HELL_COLS) - (safe[i - 1]! % HELL_COLS));
      const dy = Math.abs(Math.floor(safe[i]! / HELL_COLS) - Math.floor(safe[i - 1]! / HELL_COLS));
      expect(dx + dy).toBe(1);
    }
    for (let i = 1; i < HELL_WAVES; i++) expect(hellFireAt(i)).toBeLessThan(hellFireAt(i - 1));
    // 안전한 칸을 따라가면 안 맞고, 가만히 있으면 맞음
    for (const follow of [true, false]) {
      const r = boss("dragon", 5000);
      const d = r.enemies[0]!;
      startHellfire(r, d);
      const cells = [...d.ultSafe!];
      const start = r.tick;
      let hits = 0;
      for (let t = 0; t <= hellFireAt(0); t++) {
        r.tick = start + t;
        const next = cells.findIndex((_, i) => hellFireAt(i) === t);
        const [l, top, rr, b] = hellCell(next >= 0 && follow ? cells[next]! : cells[0] === 0 ? 1 : 0);
        r.player.x = (l + rr) / 2;
        r.player.y = (top + b) / 2;
        // 화염 가루에 맞아 무적인 중에도 분화구는 맞음
        r.player.invulnTicks = follow ? 0 : 999;
        const hp = r.player.hp;
        updateHellfire(r, d);
        if (r.player.hp < hp) hits++;
      }
      if (follow) expect(hits).toBe(0);
      else expect(hits).toBeGreaterThanOrEqual(HELL_WAVES - 2);
      expect(d.ultAt).toBeUndefined();
    }
  });

  it("갓이터 패링: 대검이 없을 때 10% 아래면 작은 방에 갇히고 대시 키가 패링 키 · 빠른 창만 날아옴 (다른 패턴 없음), 끝나면 풀림", () => {
    const run = boss("godeater", 400);
    run.enemies[0]!.step = 1;
    let spears = 0;
    let fakes = 0;
    let reals = 0;
    let inside = true;
    let immune = false;
    let others = false;
    steps(run, 300, (r) => {
      const e = r.enemies[0]!;
      const rect = cageRect(r, e);
      spears = Math.max(spears, (r.enemies[0]!.spears ?? []).length);
      fakes = Math.max(fakes, r.projectiles.filter((p) => p.look === "fspear" && p.fake && p.damage === 0).length);
      reals = Math.max(reals, r.projectiles.filter((p) => p.look === "rspear" && p.parry).length);
      others ||= r.projectiles.some((p) => p.look !== "rspear" && p.look !== "fspear");
      immune ||= e.immune === true;
      if (rect && r.tick - e.ultAt! > 60) inside &&= r.player.x >= rect[0] && r.player.x <= rect[2] && r.player.y >= rect[1] && r.player.y <= rect[3];
    });
    const e = run.enemies[0]!;
    expect(e.ultDone).toBe(true);
    expect(immune).toBe(true);
    expect(inside).toBe(true);
    // 한 묶음에 3개 이상 · 빨간 진짜 창은 한 번에 하나, 나머지는 보라 가짜 창
    expect(spears).toBeGreaterThanOrEqual(3);
    expect(reals).toBe(1);
    expect(fakes).toBeGreaterThanOrEqual(2);
    expect(others).toBe(false);
    expect(run.player.parryOn).toBe(true);
    // 대시 키를 누르면 대시 대신 패링 자세, 그 자세로 창을 받으면 피해 없음 · 아니면 맞음
    for (const parry of [true, false]) {
      const r = boss("godeater", 400);
      r.enemies[0]!.step = 1;
      steps(r, 100);
      r.projectiles = [];
      r.hazards = [];
      r.enemies[0]!.spears = [];
      r.player.invulnTicks = 0;
      const p = r.player;
      const x = p.x;
      if (parry) stepSim(r, { ...EMPTY_INPUT, dash: true, moveX: 100 });
      expect(p.dashTicks).toBe(0);
      expect(p.x).toBe(x);
      Object.assign(enemyShot(r, p.x - 12, p.y, 1, 0, 5, 20), { look: "spear" as const, parry: true, ticksLeft: 40 });
      Object.assign(enemyShot(r, p.x + 12, p.y, -1, 0, 5, 20), { look: "spear" as const, parry: true, ticksLeft: 40 });
      Object.assign(enemyShot(r, p.x, p.y - 12, 0, 1, 5, 20), { look: "spear" as const, parry: true, ticksLeft: 40 });
      const hp = p.hp;
      for (let i = 0; i < 4; i++) stepSim(r, EMPTY_INPUT);
      expect(p.hp < hp).toBe(!parry);
      // 한 번 눌러 세 개를 한꺼번에 막음
      expect(p.parryHits ?? 0).toBe(parry ? 3 : 0);
    }
    // 자세가 끝나 갈 때 막아도, 같은 묶음에서 조금 늦게 닿는 창까지 막음 (띠링 뒤에 맞지 않음)
    {
      const r = boss("godeater", 400);
      r.enemies[0]!.step = 1;
      steps(r, 100);
      r.projectiles = [];
      r.hazards = [];
      r.enemies[0]!.spears = [];
      const p = r.player;
      p.invulnTicks = 0;
      stepSim(r, { ...EMPTY_INPUT, dash: true });
      for (let i = 0; i < 11; i++) stepSim(r, EMPTY_INPUT);
      Object.assign(enemyShot(r, p.x - 12, p.y, 1, 0, 5, 20), { look: "spear" as const, parry: true, ticksLeft: 40 });
      Object.assign(enemyShot(r, p.x + 22, p.y, -1, 0, 5, 20), { look: "spear" as const, parry: true, ticksLeft: 40 });
      const hp = p.hp;
      for (let i = 0; i < 4; i++) stepSim(r, EMPTY_INPUT);
      expect(p.parryHits).toBe(2);
      expect(p.hp).toBe(hp);
    }
    steps(run, 700);
    expect(e.ultAt).toBeUndefined();
    expect(e.immune).toBe(false);
    expect(run.player.parryOn).toBe(false);
  });

  it("용 염옥 동안: 자기 패턴은 멈추고 방 전체에 느린 화염 가루 · 맞아도 무적 없음", () => {
    const run = boss("dragon", 400);
    const e = run.enemies[0]!;
    let embers = 0;
    let fastest = 0;
    let spreadX = 0;
    let hazards = 0;
    steps(run, 2);
    const x = e.x;
    steps(run, 500, (r) => {
      const em = r.projectiles.filter((p) => p.look === "ember");
      embers = Math.max(embers, em.length);
      fastest = Math.max(fastest, ...r.projectiles.map((p) => Math.hypot(p.vx, p.vy)));
      if (em.length > 10) spreadX = Math.max(spreadX, Math.max(...em.map((p) => p.x)) - Math.min(...em.map((p) => p.x)));
      hazards = Math.max(hazards, (r.hazards ?? []).length);
    });
    expect(embers).toBeGreaterThan(150);
    expect(fastest).toBeLessThan(0.7);
    expect(spreadX).toBeGreaterThan(200);
    expect(hazards).toBe(0);
    expect(e.x).toBe(x);
    // 궁극기 동안은 맞아도 무적(깜빡임)이 없음
    startHellfire(run, e);
    run.player.invulnTicks = 0;
    run.player.hp = 1e9;
    damagePlayer(run, 5);
    expect(run.player.invulnTicks).toBe(0);
  });

  it("태초의 빛·어둠: 혼자 남아 10% 아래면 보스 다섯을 부름, 부른 보스 하나가 쓰러져도 나머지는 남음", () => {
    const l = boss("plight", 300);
    steps(l, 2);
    expect(l.enemies.map((e) => e.kind).sort()).toEqual(["brood", "hulk", "plant", "plight", "siren", "swordgod"]);
    const d = boss("pdark", 300);
    steps(d, 2);
    expect(d.enemies.map((e) => e.kind).sort()).toEqual(["archer", "centaur", "knight", "pdark", "reaper", "seer"]);
    d.enemies.find((e) => e.kind === "knight")!.hp = 0;
    steps(d, 1);
    expect(d.enemies.filter((e) => e.noGold && e.kind !== "ghost")).toHaveLength(4);
    // 주인이 쓰러지면 다 사라짐
    d.enemies.find((e) => e.kind === "pdark")!.hp = 0;
    steps(d, 1);
    expect(d.enemies.filter((e) => e.noGold && e.hp > 0)).toHaveLength(0);
  });

  it("빛 혼자: 하늘의 빛 화살이 방 전체에 35발", () => {
    const run = boss("plight", 5000);
    let most = 0;
    let spanX = 0;
    steps(run, 700, (r) => {
      const holy = (r.hazards ?? []).filter((h) => h.fx === "holy");
      if (holy.length > most) {
        most = holy.length;
        spanX = Math.max(...holy.map((h) => h.x)) - Math.min(...holy.map((h) => h.x));
      }
    });
    expect(most).toBeGreaterThanOrEqual(35);
    expect(spanX).toBeGreaterThan(150);
  });

  it("궁극기가 끝날 때까지 세 보스 모두 무적 (끝나면 다시 맞음)", () => {
    const hurt = (r: RunState, e: RunState["enemies"][number]) => {
      const hp = e.hp;
      damageEnemy(r, e, 10, 0, 0);
      return e.hp < hp;
    };
    // 용: 불덩이가 터진 직후에도 무적
    const run = boss("dragon", 400);
    steps(run, HELL_CHARGE + 5);
    const d = run.enemies[0]!;
    expect(hurt(run, d)).toBe(false);
    // 분화구는 무적이어도 맞으니 쓰러지지 않게 체력을 채워 둠
    steps(run, hellFireAt(0) - HELL_CHARGE, (r) => (r.player.hp = 1e9));
    expect(d.ultAt).toBeUndefined();
    let back = false;
    steps(run, 400, (r) => (back ||= hurt(r, d)));
    expect(back).toBe(true);
    // 태초: 불러낸 보스가 다 쓰러질 때까지 무적
    const l = boss("plight", 300);
    steps(l, 3);
    const light = l.enemies.find((e) => e.kind === "plight")!;
    expect(hurt(l, light)).toBe(false);
    for (const e of l.enemies) if (e !== light) e.hp = 0;
    steps(l, 3);
    expect(hurt(l, light)).toBe(true);
  });

  it("궁극기를 쓰기 전에는 한 번에 큰 피해를 받아도 쓰러지지 않고 궁극기를 씀 (셋 모두)", () => {
    for (const kind of ["dragon", "godeater", "plight"] as const) {
      const run = boss(kind, 3000);
      if (kind === "godeater") run.enemies[0]!.step = 1;
      steps(run, 2);
      const e = run.enemies.find((o) => o.kind === kind)!;
      e.immune = false;
      damageEnemy(run, e, 1e9, 0, 0);
      if (e.hp > 0) e.hp = -5;
      steps(run, 2);
      expect(run.enemies.includes(e), kind).toBe(true);
      expect(e.ultDone, kind).toBe(true);
    }
  });

  it("기절·위압·얼음 시계 중이어도 궁극기를 씀 (궁극기 동안에도 멈추지 않음)", () => {
    for (const kind of ["dragon", "plight"] as const) {
      const run = boss(kind, 300);
      const e = run.enemies[0]!;
      e.stunTicks = 9999;
      e.fearTicks = 9999;
      run.freezeTicks = 9999;
      steps(run, 3);
      expect(e.ultDone, kind).toBe(true);
      expect(e.stunTicks, kind).toBe(0);
    }
    // 염옥이 기절·얼음에 멈춰 끝나지 않는 일 없음
    const run = boss("dragon", 300);
    steps(run, 2);
    const e = run.enemies[0]!;
    run.freezeTicks = 99999;
    steps(run, hellFireAt(0) + 10, (r) => {
      e.stunTicks = 50;
      r.player.hp = 1e9;
    });
    expect(e.ultAt).toBeUndefined();
  });

  it("같은 시드·입력이면 같은 결과", () => {
    const go = () => {
      const run = boss("dragon", 400);
      steps(run, 700);
      return JSON.stringify(run);
    };
    expect(go()).toBe(go());
  });
});
