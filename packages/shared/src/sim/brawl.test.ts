import { describe, expect, it } from "vitest";
import { WEAPONS } from "../content";
import { damagePlayer } from "./combat";
import { createRun, EMPTY_INPUT, stepSim } from "./index";
import { weaponPool } from "./loot";
import { brawler, hold, lost, nextMove } from "./brawlTestUtil";
import { enemy, FIRE } from "./perkTestUtil";

describe("격투가 콤보", () => {
  it("격투가는 전용 무기만 얻음", () => {
    for (const id of weaponPool(brawler())) expect(WEAPONS[id]).toMatchObject({ exclusive: "brawler" });
  });

  it("주먹: 앞 치기 → 발차기 → 무적 폭발, 그 뒤 처음부터", () => {
    const s = brawler();
    const e = enemy(1, 140, 72);
    s.enemies = [e];
    const dmg = s.player.stats.damage;
    nextMove(s);
    expect(lost(e)).toBeCloseTo(dmg);
    nextMove(s);
    expect(lost(e)).toBeCloseTo(dmg * 2.3);
    nextMove(s);
    expect(lost(e)).toBeCloseTo(dmg * 4.5);
    expect(s.player.invulnTicks).toBeGreaterThan(0);
    expect(s.player.comboStep).toBe(0);
  });

  it("잠깐 쉬면 콤보가 처음부터", () => {
    const s = brawler();
    s.enemies = [enemy(1, 135, 72)];
    nextMove(s);
    expect(s.player.comboStep).toBe(1);
    hold(s, 200, false);
    expect(s.player.comboStep).toBe(0);
  });

  it("복싱 글러브: 세 번째 기술은 무적으로 5번 연속", () => {
    const s = brawler("boxinggloves");
    const e = enemy(1, 136, 72);
    s.enemies = [e];
    nextMove(s);
    nextMove(s);
    hold(s, 12);
    const before = lost(e);
    nextMove(s);
    hold(s, 30);
    expect((lost(e) - before) / (s.player.stats.damage * 0.8)).toBeCloseTo(5);
  });

  it("킥: 적 바로 앞까지 돌진하되 몸이 닿지 않음, 세 번째는 모았다가 큰 범위", () => {
    const s = brawler("kick");
    const far = enemy(9, 145, 72);
    s.enemies = [far];
    nextMove(s);
    const x = s.player.x;
    nextMove(s);
    expect(s.player.x).toBeGreaterThan(x);
    expect(far.x - s.player.x).toBeGreaterThan(s.player.r + far.r);
    expect(lost(far)).toBeGreaterThan(0);
    const e = enemy(1, s.player.x - 40, s.player.y);
    s.enemies = [e];
    nextMove(s);
    expect(s.player.chargeTicks).toBeGreaterThan(0);
    hold(s, 50);
    expect(lost(e)).toBeCloseTo(s.player.stats.damage * 3);
  });

  it("유도: 붙잡은 적은 앞에 들려 있고 몸에 닿아도 피해 없음, 세 번째에 내리꽂음", () => {
    const s = brawler("judo");
    const e = enemy(1, 135, 72);
    const other = enemy(2, 175, 72);
    s.enemies = [e, other];
    nextMove(s);
    nextMove(s);
    expect(s.player.grabId).toBe(1);
    const hp = s.player.hp;
    e.x = s.player.x;
    e.y = s.player.y;
    stepSim(s, EMPTY_INPUT);
    expect(s.player.hp).toBe(hp);
    nextMove(s);
    expect(s.player.grabId).toBeUndefined();
    expect(lost(other)).toBeGreaterThan(0);
  });

  it("쌍광연격: 앞쪽 쌍검(두 번) → 한 바퀴 쌍검(뒤도 두 번) → 무적 관통 돌진, 공격 범위 반대편 끝까지", () => {
    const s = brawler("jiujitsu");
    const e = enemy(1, 140, 72);
    s.enemies = [e];
    nextMove(s);
    const one = s.player.stats.damage * 0.7;
    expect(lost(e)).toBeCloseTo(one * 2);
    expect(s.effects.filter((fx) => fx.kind === "swing")).toHaveLength(2);
    // 두 번째는 뒤쪽 적도
    e.x = 100;
    const before = lost(e);
    nextMove(s);
    expect(lost(e) - before).toBeCloseTo(s.player.stats.damage * 0.8 * 2);
    // 가까운 적은 꿰뚫고 내 공격 범위 끝까지 (적 바로 뒤에서 멈추지 않음)
    e.x = s.player.x + 10;
    const x0 = s.player.x;
    const hp = e.hp;
    nextMove(s);
    expect(e.hp).toBeLessThan(hp);
    expect(s.player.x - x0).toBeCloseTo(s.player.stats.range, 0);
    expect(s.player.invulnTicks).toBeGreaterThan(0);
    expect(s.player.comboStep).toBe(0);
  });

  it("쌍광연격: 찌르기 길이·별 크기는 내 공격 범위를 따라감 (넓어지면 더 멀리)", () => {
    const reachOf = (...perks: Parameters<typeof brawler>[1][]) => {
      const s = brawler("jiujitsu", ...perks);
      const e = enemy(1, 70, 72);
      s.enemies = [e];
      s.player.x = s.player.prevX = 60;
      for (let k = 0; k < 3; k++) nextMove(s);
      return { moved: s.player.x - 60, star: Math.hypot(s.player.starDx ?? 0, s.player.starDy ?? 0), range: s.player.stats.range };
    };
    const base = reachOf();
    const wide = reachOf("longGrip", "longGrip");
    expect(base.star).toBeCloseTo(base.range);
    expect(wide.range).toBeGreaterThan(base.range);
    expect(wide.moved).toBeGreaterThan(base.moved);
    expect(wide.star).toBeCloseTo(wide.range);
  });

  it("쌍광연격: 5번 연속 콤보를 마치면 공격 범위 원 위 다섯 점을 찌르기로 이어 별을 그림 (그동안 무적)", () => {
    const s = brawler("jiujitsu");
    const e = enemy(1, 140, 72);
    s.enemies = [e];
    s.player.comboRuns = 3;
    for (let k = 0; k < 3; k++) nextMove(s);
    expect(s.player.starLeft ?? 0).toBe(0);
    s.player.x = s.player.prevX = 120;
    e.x = 140;
    for (let k = 0; k < 3; k++) nextMove(s);
    expect(s.player.comboRuns).toBe(5);
    expect(s.player.starLeft).toBe(5);
    const spots = new Set<string>();
    let invuln = true;
    for (let i = 0; i < 40; i++) {
      hold(s, 1);
      if ((s.player.starLeft ?? 0) > 0) invuln &&= s.player.invulnTicks > 0;
      spots.add(`${Math.round(s.player.x)},${Math.round(s.player.y)}`);
    }
    expect(s.player.starLeft).toBe(0);
    expect(invuln).toBe(true);
    expect(spots.size).toBeGreaterThanOrEqual(4);
  });

  it("유도: 보스·허수아비 앞에서는 바위를 만들어 들고(무적) 던짐", () => {
    const s = brawler("judo");
    const boss = { ...enemy(1, 138, 72), kind: "hulk" as const, r: 11 };
    s.enemies = [boss];
    nextMove(s);
    nextMove(s);
    expect(s.player.rock).toBe(true);
    s.player.invulnTicks = 0;
    hold(s, 1, false);
    expect(s.player.invulnTicks).toBeGreaterThan(0);
    const before = lost(boss);
    nextMove(s);
    expect(s.player.rock).toBe(false);
    expect(lost(boss) - before).toBeCloseTo(s.player.stats.damage * 3);
  });

  it("맞히지 못하면 다음 기술로 넘어가지 않음 (파동탄 제외)", () => {
    const s = brawler("fist");
    s.enemies = [enemy(1, 200, 72)];
    nextMove(s);
    expect(s.player.comboStep).toBe(0);
    s.enemies[0]!.x = 135;
    nextMove(s);
    expect(s.player.comboStep).toBe(1);
    const k = brawler("energywave");
    nextMove(k);
    expect(k.player.comboStep).toBe(1);
  });

  it("가라테: 버티는 동안 받는 피해 절반, 받은 피해 ×3으로 되받아침, 마지막은 체력 20% 이하 적을 쓰러뜨림", () => {
    const s = brawler("karate");
    const e = enemy(1, 150, 72, 1000);
    s.enemies = [e];
    nextMove(s);
    expect(s.player.rootTicks).toBeGreaterThan(0);
    const hp = s.player.hp;
    damagePlayer(s, 10);
    expect(hp - s.player.hp).toBe(5);
    s.player.invulnTicks = 0;
    nextMove(s);
    expect(lost(e)).toBeCloseTo(s.player.stats.damage + 15);
    e.hp = 150;
    s.player.hp = 50;
    nextMove(s);
    expect(e.hp).toBeLessThanOrEqual(0);
    // 입힌 피해(150)의 30% 회복
    expect(s.player.hp).toBeCloseTo(50 + 45);
  });

  it("택견: 네 단계, 세 번째에 기절", () => {
    const s = brawler("taekkyon");
    const e = enemy(1, 145, 72);
    s.enemies = [e];
    nextMove(s);
    nextMove(s);
    e.x = s.player.x + 20;
    nextMove(s);
    expect(e.stunTicks).toBeGreaterThan(0);
    nextMove(s);
    expect(s.player.comboStep).toBe(0);
  });

  it("UFC: 다섯 단계 (붙잡고 내리꽂기 포함)", () => {
    const s = brawler("mma");
    const e = enemy(1, 140, 72);
    s.enemies = [e, enemy(2, 190, 72)];
    for (let k = 0; k < 3; k++) nextMove(s);
    expect(s.player.grabId).toBe(1);
    nextMove(s);
    nextMove(s);
    expect(s.player.comboStep).toBe(0);
  });

  it("콤보(파동탄): 1발 → 부채꼴 3발 → 5발 → 기를 모아 사방으로 30발, 한 발 5", () => {
    const s = brawler("energywave");
    const kis = () => s.projectiles.filter((pr) => pr.spirit === "ki");
    const counts: number[] = [];
    for (let k = 0; k < 3; k++) {
      s.projectiles = [];
      nextMove(s);
      counts.push(kis().length);
    }
    expect(counts).toEqual([1, 3, 5]);
    expect(kis()[0]!.damage).toBeCloseTo(5, 0);
    s.projectiles = [];
    nextMove(s);
    expect(kis()).toHaveLength(0);
    hold(s, 60, false);
    expect(kis()).toHaveLength(30);
    // 앞뒤 모두로 퍼짐
    expect(kis().some((pr) => pr.vx < 0) && kis().some((pr) => pr.vx > 0)).toBe(true);
    expect(s.player.comboStep).toBe(0);
  });

  it("같은 시드·입력이면 결과가 같음", () => {
    const play = () => {
      const s = createRun(12, "brawler");
      for (let i = 0; i < 600; i++) stepSim(s, { ...FIRE, autoAim: true, moveX: i % 200 < 100 ? 60 : -60 });
      return [s.player.x, s.player.comboStep, s.kills, s.enemies.map((e) => e.hp)];
    };
    expect(play()).toEqual(play());
  });
});
