import { describe, expect, it } from "vitest";
import { CHARACTERS, WEAPONS, type WeaponId } from "../content";
import type { PassiveId } from "../items";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { weaponPool } from "./loot";
import { enemy, FIRE } from "./perkTestUtil";
import { markEnemy } from "./shades";

/** 닌자로 시작해 무기·아이템을 가진 채, 적 없는 방 가운데 (오른쪽을 봄) */
function ninja(weapon: WeaponId = "shuriken", ...perks: PassiveId[]): RunState {
  const s = createRun(3, "ninja");
  s.player.weaponId = weapon;
  s.player.passives.push(...perks);
  recalcStats(s);
  s.enemies = [];
  s.player.x = s.player.prevX = 80;
  s.player.y = s.player.prevY = 72;
  return s;
}

const lost = (s: RunState, id = 1) => {
  const e = s.enemies.find((x) => x.id === id);
  return e ? e.maxHp - e.hp : Infinity;
};

function fire(s: RunState, n: number): void {
  for (let i = 0; i < n; i++) stepSim(s, FIRE);
}

describe("닌자", () => {
  it("전용 무기 10개만 얻고, 수리검으로 시작", () => {
    expect(CHARACTERS.ninja.startWeapon).toBe("shuriken");
    const all = weaponPool(ninja(), true);
    expect(all).toHaveLength(9);
    for (const id of all) expect(WEAPONS[id]).toMatchObject({ exclusive: "ninja", kind: "shade" });
  });

  it("수리검 3번 맞히면 적 뒤에 그림자가 나와 벰", () => {
    const s = ninja();
    s.enemies = [enemy(1, 110, 72)];
    s.player.shades = [];
    markEnemy(s, s.enemies[0]!);
    markEnemy(s, s.enemies[0]!);
    expect(s.player.shades).toHaveLength(0);
    markEnemy(s, s.enemies[0]!);
    expect(s.player.shades).toHaveLength(1);
    const sh = s.player.shades![0]!;
    // 닌자 반대편(적의 오른쪽 뒤)
    expect(sh.x).toBeGreaterThan(110);
    fire(s, 1);
    const before = lost(s);
    for (let i = 0; i < 10; i++) stepSim(s, { ...FIRE, attack: false });
    expect(lost(s) - before).toBeGreaterThanOrEqual(s.player.stats.damage * 1.7);
  });

  it("던져서 쌓은 표식으로 그림자가 실제로 나옴", () => {
    const s = ninja();
    s.enemies = [enemy(1, 110, 72)];
    fire(s, 90);
    expect(lost(s)).toBeGreaterThan(s.player.stats.damage * 5);
  });

  it("환영진: 표식 5개가 찬 적 둘레 사거리 절반만 한 원 위 9곳에서 그림자가 가운데로 돌진", () => {
    const s = ninja("phantomring");
    s.enemies = [enemy(1, 120, 72)];
    s.player.shades = [];
    // 표식 4번까지는 아무 일 없고 5번째에 발동
    for (let i = 0; i < 4; i++) markEnemy(s, s.enemies[0]!);
    expect(s.player.shades).toHaveLength(0);
    markEnemy(s, s.enemies[0]!);
    const ring = s.player.shades!;
    expect(ring).toHaveLength(9);
    const r = s.player.stats.range * 0.5;
    for (const sh of ring) expect(Math.hypot(sh.x - 120, sh.y - 72)).toBeCloseTo(r, 1);
    // 사거리가 늘면 원도 커짐
    const t = ninja("phantomring");
    t.player.stats.range *= 1.5;
    t.enemies = [enemy(1, 120, 72)];
    t.player.shades = [];
    for (let i = 0; i < 5; i++) markEnemy(t, t.enemies[0]!);
    expect(Math.hypot(t.player.shades![0]!.x - 120, t.player.shades![0]!.y - 72)).toBeCloseTo(r * 1.5, 1);
    // 가운데로 모여 때림 (9 × 45%, 지나가며 벤 것 포함)
    for (let i = 0; i < 20; i++) stepSim(s, { ...FIRE, attack: false });
    expect(lost(s)).toBeGreaterThanOrEqual(s.player.stats.damage * 0.45 * 9);
  });

  it("그림자 표식: 필요한 표식 -1 · 쌍그림자: 둘씩", () => {
    const s = ninja("shuriken", "shadowMark", "twinShadow");
    s.enemies = [enemy(1, 110, 72)];
    s.player.shades = [];
    markEnemy(s, s.enemies[0]!);
    markEnemy(s, s.enemies[0]!);
    expect(s.player.shades).toHaveLength(2);
  });

  it("무기마다 피해가 나옴 · 좋은 무기와 나쁜 무기 차이가 크지 않음 (적 1명 · 뭉친 적 3명)", () => {
    const measure = (id: WeaponId, n: number) => {
      const s = ninja(id);
      s.enemies = [enemy(1, 100, 72, 99999), enemy(2, 106, 60, 99999), enemy(3, 106, 84, 99999)].slice(0, n).map((e) => ({ ...e, kind: "dummy" as const }));
      // 허수아비는 밀려나지 않게 제자리로
      const home = s.enemies.map((e) => [e.x, e.y] as const);
      for (let i = 0; i < 600; i++) {
        stepSim(s, FIRE);
        s.enemies.forEach((e, k) => ([e.x, e.y] = home[k]!));
      }
      return s.enemies.reduce((sum, e) => sum + lost(s, e.id), 0) / 10;
    };
    const ids = weaponPool(ninja(), true).concat("shuriken");
    const one = ids.map((id) => measure(id, 1));
    const three = ids.map((id) => measure(id, 3));
    // 적 1명에 가장 약한 무기도 가장 강한 무기의 절반 이상, 둘을 합친 점수도 절반 이상
    expect(Math.min(...one)).toBeGreaterThan(Math.max(...one) / 2);
    const both = ids.map((_, i) => one[i]! + three[i]! / 2);
    expect(Math.min(...both)).toBeGreaterThan(Math.max(...both) / 2);
  });
});
