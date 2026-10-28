import { describe, expect, it } from "vitest";
import { ARTIFACTER, AUTOMATA, BOMBER, CHARACTER_IDS, PUNK, RIDER, type WeaponId } from "../content";
import { boom } from "./bomber";
import { ROOM_MAX_X } from "../constants";
import { EMPTY_INPUT } from "./inputTypes";
import { ARTIFACTER_HIDDEN } from "../itemsArtifacter";
import type { CharacterId } from "../characters";
import { PASSIVES, type PassiveDef, type PassiveId } from "../items";
import { createRun, stepSim, type RunState } from "./index";
import { characterWeapons, passivePool } from "./loot";
import { recalcStats } from "./items";
import { enemy, FIRE } from "./perkTestUtil";
import { riderMoveMul, riderSpeedMul } from "./rider";
import { punkMoveMul, timeSlowed } from "./punk";
import { FLAME, flameStacks } from "./flames";

function run(c: CharacterId, weapon: WeaponId, ...perks: PassiveId[]): RunState {
  const s = createRun(7, c);
  s.player.weaponId = weapon;
  s.player.passives.push(...perks);
  recalcStats(s);
  s.player.x = s.player.prevX = 50;
  s.player.y = s.player.prevY = 72;
  s.enemies = [0, 1, 2].map((i) => ({ ...enemy(i + 1, 80 + i * 10, 72, 99999), rootTicks: 99999 }));
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);

describe("테라코어 시즌 2", () => {
  it("오토마타·라이더: 무기 10 · 전용 아이템 10", () => {
    for (const c of ["automata", "rider"] as const) {
      expect(CHARACTER_IDS).toContain(c);
      expect(characterWeapons(c)).toHaveLength(10);
      expect(Object.values(PASSIVES).filter((p) => (p as PassiveDef).exclusive === c)).toHaveLength(10);
    }
  });

  it("모든 무기가 피해를 줌", () => {
    for (const c of ["automata", "rider"] as const) {
      for (const w of characterWeapons(c)) {
        const s = run(c, w);
        for (let i = 0; i < 120; i++) stepSim(s, FIRE);
        expect(lost(s), w).toBeGreaterThan(0);
      }
    }
  });

  it("자매 인형 셋이 곁에서 함께 쏨", () => {
    const s = run("automata", "adSisters");
    for (let i = 0; i < 90; i++) stepSim(s, FIRE);
    expect(s.player.adDolls).toHaveLength(3);
    // 자매 부르기를 더하면 넷
    s.player.passives.push("adCall" as PassiveId);
    stepSim(s, FIRE);
    expect(s.player.adDolls).toHaveLength(4);
    // 분신은 방 밖으로 나가지 않고, 쏠 때 35% 확률로 자기 자리에서 유도 미사일
    s.enemies[0]!.x = s.enemies[0]!.prevX = ROOM_MAX_X + 200;
    let fromDoll = false;
    for (let i = 0; i < 600; i++) {
      stepSim(s, FIRE);
      for (const d of s.player.adDolls ?? []) expect(d.x).toBeLessThanOrEqual(ROOM_MAX_X);
      fromDoll ||= s.effects.some((f) => f.kind === "adLaunch" && Math.abs(f.x - s.player.x) > 6);
    }
    expect(fromDoll).toBe(true);
    expect(AUTOMATA.dollMissile).toBe(0.35);
  });

  it("기본 능력: 쏠 때 50% 확률로 등 뒤에서 유도 미사일이 7발 넘게 (모든 미사일은 늘 쫓아감)", () => {
    const s = run("automata", "adFinger");
    let most = 0;
    for (let i = 0; i < 120; i++) {
      stepSim(s, FIRE);
      most = Math.max(most, s.projectiles.filter((p) => p.spirit === "adMissile").length);
    }
    expect(most).toBeGreaterThanOrEqual(7);
    expect(s.projectiles.filter((p) => p.spirit === "adMissile").every((p) => p.seek)).toBe(true);
  });

  it("오토마타: 전탄 발사는 늘 12발 넘게 · 리펄서 소드 두 번 베기 · 붉은 레이저 치명타", () => {
    const s = run("automata", "adArsenal");
    stepSim(s, FIRE);
    expect(s.projectiles.filter((p) => p.spirit === "adMissile").length).toBeGreaterThanOrEqual(12);
    const sw = run("automata", "adSword");
    const swings = new Set<number>();
    for (let i = 0; i < 12; i++) {
      stepSim(sw, FIRE);
      for (const f of sw.effects) if (f.kind === "adSword") swings.add(f.width ?? -1);
    }
    expect([...swings].sort()).toEqual([0, 1]);
    const red = run("automata", "adRed");
    for (let i = 0; i < 600; i++) stepSim(red, FIRE);
    expect(red.crits ?? 0).toBeGreaterThan(0);
    expect(AUTOMATA.critMul).toBeGreaterThan(1);
  });

  it("라이더: 달리면 피해가 커지고, 게이지가 차면 펄스", () => {
    const s = run("rider", "rdHammer");
    const still = riderSpeedMul(s.player);
    s.player.prevX = s.player.x - 2;
    expect(riderSpeedMul(s.player)).toBeGreaterThan(still);
    s.player.rdGauge = RIDER.gaugeMax - 1;
    const before = lost(s);
    for (let i = 0; i < 10; i++) stepSim(s, { ...FIRE, attack: false, moveX: 100 });
    expect(lost(s)).toBeGreaterThan(before);
    expect(s.player.rdGauge ?? 0).toBeLessThan(RIDER.gaugeMax);
  });

  it("붐버: 무기 10 · 아이템 10 · 모든 무기가 터져 피해, 잇따라 터지면 예술 연쇄", () => {
    expect(characterWeapons("bomber")).toHaveLength(10);
    expect(Object.values(PASSIVES).filter((p) => (p as PassiveDef).exclusive === "bomber")).toHaveLength(10);
    for (const w of characterWeapons("bomber")) {
      const s = run("bomber", w);
      // 끈끈이는 붙고 4.5초 뒤에 터짐 · 네이팜은 누른 곳(적 쪽 36칸)으로
      for (let i = 0; i < 330; i++) stepSim(s, w === "bmNapalm" ? { ...FIRE, aimX: 300 } : FIRE);
      expect(lost(s), w).toBeGreaterThan(0);
    }
    // 끈끈이가 여럿 붙으면 하나로 합쳐 수가 늘어남 · 지뢰는 적이 없어도 박아 둠 · 터지는 자리에 나도 있으면 아픔
    const st = run("bomber", "bmSticky");
    for (let i = 0; i < 200; i++) stepSim(st, FIRE);
    expect(Math.max(...(st.player.bmBombs ?? []).map((b) => b.stack ?? 0))).toBeGreaterThan(1);
    const mine = run("bomber", "bmMine");
    mine.enemies = [];
    for (let i = 0; i < 120; i++) stepSim(mine, FIRE);
    expect(mine.player.bmMines?.length ?? 0).toBeGreaterThan(0);
    // 박힌 지 3초가 지난 지뢰는 저절로 터짐
    for (let i = 0; i < BOMBER.mineFuse + 5; i++) stepSim(mine, EMPTY_INPUT);
    expect(Math.min(...mine.player.bmMines!.map((m) => m.born!))).toBeGreaterThan(mine.tick - BOMBER.mineFuse - 1);
    const self = run("bomber", "bmGrenade");
    const hp = self.player.hp;
    boom(self, self.player.x, self.player.y, 20, 1);
    expect(self.player.hp).toBe(hp - BOMBER.selfDmg);
    const s = run("bomber", "bmFirework");
    let art = 0;
    for (let i = 0; i < 180; i++) {
      stepSim(s, FIRE);
      art = Math.max(art, s.player.bmArt ?? 0);
    }
    expect(art).toBeGreaterThan(0);
  });

  it("아티팩터: 리펄스 총 하나 · 아이템 10 + 숨겨진 5 (보상에는 안 나옴) · 쓰러뜨리면 제작", () => {
    expect(characterWeapons("artifacter")).toEqual(["afRepulsor"]);
    expect(Object.values(PASSIVES).filter((p) => (p as PassiveDef).exclusive === "artifacter")).toHaveLength(15);
    const s = run("artifacter", "afRepulsor");
    for (const id of ARTIFACTER_HIDDEN) expect(passivePool(s)).not.toContain(id);
    s.enemies = Array.from({ length: ARTIFACTER.craftEvery }, (_, i) => ({ ...enemy(i + 1, 75 + (i % 3) * 3, 72 + ((i % 5) - 2) * 3, 1), rootTicks: 99999 }));
    const n = s.player.passives.length;
    for (let i = 0; i < 400 && s.enemies.some((e) => e.hp > 0); i++) stepSim(s, FIRE);
    expect(s.player.passives.length).toBeGreaterThan(n);
  });

  it("펑크: 무기 10 · 능력 10 · 모든 무기가 피해", () => {
    expect(characterWeapons("punk")).toHaveLength(10);
    expect(Object.values(PASSIVES).filter((p) => (p as PassiveDef).exclusive === "punk")).toHaveLength(10);
    for (const w of characterWeapons("punk")) {
      const s = run("punk", w);
      for (let i = 0; i < 120; i++) stepSim(s, FIRE);
      expect(lost(s), w).toBeGreaterThan(0);
    }
  });

  it("펑크 신경 가속: 게이지가 가득일 때 대시하면 켜지고 적 탄이 느려짐", () => {
    const s = run("punk", "cyKatana");
    s.player.cyGauge = PUNK.gaugeMax;
    s.projectiles.push({ id: 999, fromPlayer: false, x: 120, y: 72, prevX: 120, prevY: 72, r: 2, vx: -2, vy: 0, damage: 1, ticksLeft: 200 });
    stepSim(s, { ...EMPTY_INPUT, dash: true, moveX: 100 });
    stepSim(s, EMPTY_INPUT);
    expect(s.player.cyAccel ?? 0).toBeGreaterThan(0);
    expect(Math.abs(s.projectiles.find((p) => p.id === 999)!.vx)).toBeLessThan(2);
    // 가속 중: 무적 · 빠름 · 적은 쉬는 틱이 많음
    expect(s.player.invulnTicks).toBeGreaterThan(0);
    expect(punkMoveMul(s.player)).toBeGreaterThan(PUNK.baseMove);
    let rests = 0;
    for (let i = 0; i < 8; i++) if (timeSlowed({ ...s, tick: i }, false)) rests++;
    expect(rests).toBe(6);
  });

  it("펑크 신경 가속 중에는 무기와 따로 퀵 해킹이 가까운 적을 때림", () => {
    const s = run("punk", "cyKatana");
    s.player.cyAccel = 100;
    // 칼은 닿지 않는 거리의 적
    for (const e of s.enemies) e.x += 60;
    stepSim(s, FIRE);
    expect(s.enemies.filter((e) => e.hp < e.maxHp)).toHaveLength(PUNK.quickN);
    const off = run("punk", "cyKatana");
    for (const e of off.enemies) e.x += 60;
    stepSim(off, FIRE);
    expect(lost(off)).toBe(0);
  });

  it("펑크 광학 위장: 대시해도 무적이 아니고, 대시 뒤 첫 공격만 기습으로 세짐", () => {
    const s = run("punk", "cyKatana", "cyCloak");
    // 적과 반대쪽으로 대시 (몸에 닿아 맞은 무적과 헷갈리지 않게)
    stepSim(s, { ...EMPTY_INPUT, dash: true, moveY: 100 });
    for (let i = 0; i < 12; i++) stepSim(s, EMPTY_INPUT);
    expect(s.player.invulnTicks).toBe(0);
    expect(s.player.cyAmbush ?? 0).toBeGreaterThan(0);
    s.player.x = s.player.prevX = 50;
    stepSim(s, FIRE);
    expect(s.player.cyAmbush ?? 0).toBe(0);
  });

  it("라이더: 공격하면 게이지가 차고 빨라짐 · 단검은 더 빠르고 대시로 목을 벰 · 화염 배기 불꽃 스택", () => {
    const s = run("rider", "rdHammer");
    stepSim(s, FIRE);
    expect(s.player.rdGauge ?? 0).toBeGreaterThanOrEqual(RIDER.hitGauge);
    expect(riderMoveMul(s.player)).toBeGreaterThan(1);
    const d = run("rider", "rdDagger");
    expect(riderMoveMul(d.player)).toBeGreaterThan(1.3);
    const before = lost(d);
    stepSim(d, { ...EMPTY_INPUT, dash: true, moveX: 100 });
    expect(lost(d)).toBeGreaterThan(before);
    const f = run("rider", "rdExhaust");
    for (let i = 0; i < 120; i++) stepSim(f, FIRE);
    expect(Math.max(...f.enemies.map((e) => flameStacks(f, e)))).toBe(FLAME.max);
  });
});
