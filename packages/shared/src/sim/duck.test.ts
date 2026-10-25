import { describe, expect, it } from "vitest";
import { CHARACTER_IDS, CHARACTERS, HIDDEN_CHARACTERS, WEAPONS, type WeaponId } from "../content";
import { PASSIVES, type PassiveId } from "../items";
import { DUCK } from "../weaponsDuck";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { characterWeapons } from "./loot";
import { recalcStats } from "./items";
import { enemy, FIRE } from "./perkTestUtil";

/** 오리로 시작해 무기·아이템을 가진 채, 적 없는 방 (오른쪽을 봄) */
function duck(weapon: WeaponId = "rubberDuck", ...perks: PassiveId[]): RunState {
  const s = createRun(3, "duck");
  s.player.weaponId = weapon;
  s.player.passives.push(...perks);
  recalcStats(s);
  s.enemies = [];
  s.player.x = s.player.prevX = 60;
  s.player.y = s.player.prevY = 72;
  return s;
}
const attackOnce = (s: RunState) => {
  const n = s.player.attackCount;
  for (let i = 0; i < 300 && s.player.attackCount === n; i++) stepSim(s, FIRE);
};
const step = (s: RunState, n: number) => {
  for (let i = 0; i < n; i++) stepSim(s, EMPTY_INPUT);
};
/** 걸어오지 않게 묶어 둔 적 */
const held = (id: number, x: number, y: number, hp?: number) => ({ ...enemy(id, x, y, hp), rootTicks: 99999 });
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);

describe("오리 (히든)", () => {
  it("고무 오리로 시작, 무기 10개 · 전용 아이템 10개, 목록에는 없음", () => {
    expect(CHARACTERS.duck.startWeapon).toBe("rubberDuck");
    expect(characterWeapons("duck")).toHaveLength(10);
    expect(Object.values(PASSIVES).filter((d) => "exclusive" in d && d.exclusive === "duck")).toHaveLength(10);
    for (const id of characterWeapons("duck")) expect(WEAPONS[id].kind).toBe("quack");
    expect(CHARACTER_IDS).not.toContain("duck");
    expect(HIDDEN_CHARACTERS).toContain("duck");
  });

  it("꽥은 앞쪽 적을 맞히고 밀어냄 (뒤쪽 적은 새끼 오리 꽥만 맞아 덜 아픔)", () => {
    const s = duck();
    s.enemies = [held(1, 90, 72), held(2, 30, 72)];
    attackOnce(s);
    const [front, back] = s.enemies.map((e) => e.maxHp - e.hp);
    expect(s.enemies[0]!.x).toBeGreaterThan(90);
    expect(front).toBeGreaterThan(back!);
  });

  it("4번째 꽥은 둘레 전체 큰 꽥 (뒤쪽 적도 기절)", () => {
    const s = duck();
    s.enemies = [held(1, 30, 72)];
    for (let i = 0; i < DUCK.big.every - 1; i++) attackOnce(s);
    expect(s.enemies[0]!.stunTicks ?? 0).toBe(0);
    attackOnce(s);
    expect(s.enemies[0]!.stunTicks).toBeGreaterThan(0);
  });

  it("새끼 오리가 줄지어 따라오고, 닿은 적 탄을 막음", () => {
    const s = duck();
    step(s, 5);
    expect(s.player.ducklings).toHaveLength(2);
    const d = s.player.ducklings![0]!;
    s.projectiles.push({ id: 999, fromPlayer: false, x: d.x, y: d.y, prevX: d.x, prevY: d.y, r: 2, vx: 0, vy: 0, damage: 5, ticksLeft: 60 });
    step(s, 1);
    expect(s.projectiles.some((pr) => pr.id === 999)).toBe(false);
    expect(s.player.hp).toBe(s.player.stats.maxHp);
  });

  it("엄마 오리는 새끼 6마리, 한 마리 더는 아이템마다 +1", () => {
    const s = duck("motherDuck", "extraDuckling", "extraDuckling");
    step(s, 2);
    expect(s.player.ducklings).toHaveLength(8);
  });

  it("새끼 오리도 가까운 적에게 같이 꽥", () => {
    const solo = duck();
    solo.enemies = [held(1, 90, 72)];
    step(solo, 30);
    attackOnce(solo);
    const many = duck("rubberDuck", "extraDuckling", "extraDuckling");
    many.enemies = [held(1, 90, 72)];
    step(many, 30);
    attackOnce(many);
    expect(lost(many)).toBeGreaterThan(lost(solo));
  });

  it("황금알은 잠시 뒤 터짐", () => {
    const s = duck("goldenEgg");
    s.enemies = [held(1, 140, 72)];
    attackOnce(s);
    expect(lost(s)).toBe(0);
    step(s, DUCK.eggTicks + 1);
    expect(lost(s)).toBeGreaterThan(0);
  });

  it("백조의 노래는 체력이 낮을수록 셈", () => {
    const full = duck("swanSong");
    full.enemies = [held(1, 100, 72)];
    attackOnce(full);
    const low = duck("swanSong");
    low.player.hp = 10;
    low.enemies = [held(1, 100, 72)];
    attackOnce(low);
    expect(lost(low)).toBeGreaterThan(lost(full));
  });
});
