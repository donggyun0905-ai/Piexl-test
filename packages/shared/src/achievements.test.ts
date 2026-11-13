import { describe, expect, it } from "vitest";
import { achievedIn, achievementProgress, ACHIEVEMENT_IDS, careerWith, characterAvailable, computeScore, EMPTY_CAREER, itemAvailable, TIME_LIMIT_TICKS } from "./achievements";
import { createRun, EMPTY_INPUT, stepSim } from "./sim/index";

describe("업적·해금", () => {
  it("해금 전에는 잠긴 아이템이 나오지 않고, 해금하면 나옴", () => {
    expect(itemAvailable("passive", "whetstone", [])).toBe(true);
    expect(itemAvailable("passive", "quickDraw", [])).toBe(false);
    expect(itemAvailable("passive", "quickDraw", ["firstBoss"])).toBe(true);
    expect(itemAvailable("weapon", "glaive", ["firstBoss"])).toBe(false);
  });

  it("상태로 업적 판정", () => {
    const run = createRun(1, "drifter");
    expect(achievedIn(run)).toEqual([]);
    run.bossKills = 1;
    run.floor = 4;
    expect(achievedIn(run)).toEqual(["floor2", "floor3", "floor4", "firstBoss"]);
    run.won = true;
    run.tick = 60 * 60 * 11;
    expect(achievedIn(run)).toContain("fastClear");
    expect(achievedIn(run)).toContain("clearDrifter");
    expect(achievedIn(run)).not.toContain("swiftClear");
  });

  it("업적 id는 겹치지 않음, 캐릭터는 해금 업적이 없으면 열려 있음", () => {
    expect(new Set(ACHIEVEMENT_IDS).size).toBe(ACHIEVEMENT_IDS.length);
    expect(characterAvailable("mage", [])).toBe(true);
  });

  it("누적 업적: 이전 기록 + 이번 판", () => {
    const run = createRun(1, "mage");
    run.kills = 100;
    const career = { ...EMPTY_CAREER, kills: 950, runs: 9, clearedBy: { warden: 1, drifter: 2, mystic: 1, engineer: 1, elementalist: 1, brawler: 1, doctor: 1, gunner: 1, beast: 1, ninja: 1, chronomancer: 1, summoner: 1, novice: 1, bedouin: 1, general: 1, imugi: 1, apostle: 1, abandoned: 1, titan: 1, oni: 1, idra: 1, byeonhui: 1, fly: 1, elder: 1, ren: 1, spiritist: 1, plague: 1, slayer: 1, eater: 1, mukin: 1, samyeol: 1, automata: 1, rider: 1, bomber: 1, artifacter: 1, punk: 1, tracker: 1, forgotten: 1, remnant: 1, wanderer: 1, silk: 1, pungryu: 1, leo: 1, onyx: 1, fenrir: 1, eclipse: 1, thorken: 1, levia: 1, tail: 1, madQueen: 1, hook: 1, orca: 1, wave: 1, miryu: 1, beatrice: 1, ian: 1, gabriel: 1, serena: 1, rafael: 1, yuriel: 1, michaela: 1, blast: 1, nailer: 1, scissors: 1, hellfist: 1, silverBullet: 1, blueFlame: 1, lunatic: 1, incision: 1, crusader: 1, joker: 1, shadowing: 1, puppeteer: 1, rabbit: 1, baekryeong: 1, bingseol: 1, asura: 1, honryeong: 1, baekinjang: 1, aria: 1, chessRaven: 1, gears: 1, noir: 1, rouge: 1, bleu: 1, jaune: 1, magenta: 1, vert: 1, collector: 1 } };
    expect(achievedIn(run, career)).toContain("kills1000");
    expect(achievedIn(run, career)).not.toContain("runs10");
    run.over = true;
    run.won = true;
    expect(achievedIn(run, career)).toEqual(expect.arrayContaining(["runs10", "clearAll", "clearMage"]));
    const next = careerWith(career, run);
    expect(next).toMatchObject({ runs: 10, wins: 1, kills: 1050, clearedBy: { warden: 1, drifter: 2, mystic: 1, engineer: 1, elementalist: 1, brawler: 1, doctor: 1, gunner: 1, beast: 1, ninja: 1, chronomancer: 1, summoner: 1, novice: 1, bedouin: 1, general: 1, imugi: 1, apostle: 1, abandoned: 1, titan: 1, oni: 1, idra: 1, byeonhui: 1, fly: 1, elder: 1, ren: 1, spiritist: 1, plague: 1, slayer: 1, eater: 1, mukin: 1, samyeol: 1, automata: 1, rider: 1, bomber: 1, artifacter: 1, punk: 1, tracker: 1, forgotten: 1, remnant: 1, wanderer: 1, silk: 1, pungryu: 1, leo: 1, onyx: 1, fenrir: 1, eclipse: 1, thorken: 1, levia: 1, tail: 1, madQueen: 1, hook: 1, orca: 1, wave: 1, miryu: 1, beatrice: 1, ian: 1, gabriel: 1, serena: 1, rafael: 1, yuriel: 1, michaela: 1, blast: 1, nailer: 1, scissors: 1, hellfist: 1, silverBullet: 1, blueFlame: 1, lunatic: 1, incision: 1, crusader: 1, joker: 1, shadowing: 1, puppeteer: 1, rabbit: 1, baekryeong: 1, bingseol: 1, asura: 1, honryeong: 1, baekinjang: 1, aria: 1, chessRaven: 1, gears: 1, noir: 1, rouge: 1, bleu: 1, jaune: 1, magenta: 1, vert: 1, collector: 1, mage: 1 } });
    expect(achievementProgress("kills5000", next)).toEqual({ value: 1050, goal: 5000 });
    expect(achievementProgress("floor4", next)).toBeNull();
  });

  it("얼음 시계: 적이 멈춤", () => {
    const run = createRun(1, "warden");
    run.player.useSlots = ["frost", null];
    run.enemies = [{ id: 9, kind: "crawler", x: 40, y: 40, prevX: 40, prevY: 40, r: 5, hp: 50, maxHp: 50, timer: 0, phase: "walk", dirX: 0, dirY: 0, hitFlash: 0, count: 0, noGold: false }];
    stepSim(run, { ...EMPTY_INPUT, useSlot: 1 });
    stepSim(run, EMPTY_INPUT);
    expect(run.enemies[0]!.x).toBe(40);
    expect(run.freezeTicks).toBeGreaterThan(0);
  });
});

describe("점수", () => {
  it("층·처치·보스·클리어·남은 시간", () => {
    const run = createRun(1, "warden");
    run.floor = 3;
    run.kills = 20;
    run.bossKills = 2;
    expect(computeScore(run)).toMatchObject({ floor: 1000, kills: 200, bosses: 600, clear: 0, time: 0, total: 1800 });
    run.won = true;
    run.floor = 6;
    run.tick = TIME_LIMIT_TICKS - 60 * 100;
    expect(computeScore(run).time).toBe(300);
    run.tick = TIME_LIMIT_TICKS + 999;
    expect(computeScore(run).time).toBe(0);
  });
});
