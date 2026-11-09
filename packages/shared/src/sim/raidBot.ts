// 레이드 AI 동료 입력 (자리를 꺼내 놓은 상태에서 부름, s.player = 그 AI). 무작위는 판 시드로만
// 준비 방: 무기·사용 아이템·대장간·제단·기구 앞을 차례로 들렀다가 출구 앞에서 기다림 (준비는 시작 때 정해 둠, 바닥 물건은 사람마다라 보이지 않음)
// 레이드 방: 기둥·불길·루시퍼(어둠의 세계면 자기 몬스터)를 노리고, 위험 표시·가시 고리·검기 빈칸·흰색 돔·지진파를 피함
import { ALTAR_IDS } from "../altarDefs";
import { ROOM_CX as CX, ROOM_CY as CY, ROOM_MIN_Y } from "../constants";
import { createRng, deriveSeed } from "../rng";
import { ALTAR_Y } from "./altar";
import { inSafe } from "./lucPillars";
import { LUC_ATTACK_RULES as A } from "./lucAttacks";
import { LUC_DARK_RULES as D } from "./lucDark";
import { LUC_DOME_R } from "./lucifer";
import { seatNo } from "./party";
import { RAID_ROOM } from "./raidTypes";
import { EMPTY_INPUT, type RunState, type TickInput } from "./types";
import { EXIT_X, normalize } from "./util";

const roll = (s: RunState, i: number, what: string) => createRng(deriveSeed(s.seed, "raidBot", i, what, s.roomId)).nextFloat();
const toInput = (mx: number, my: number, extra: Partial<TickInput> = {}): TickInput => ({ ...EMPTY_INPUT, moveX: Math.round(mx * 100), moveY: Math.round(my * 100), ...extra });

/** 준비 방에서 들를 곳 [x, y, 머무는 틱] (마지막은 출구 앞) */
function prepStops(s: RunState, i: number): number[][] {
  const p = s.player;
  const exit = [EXIT_X[1]!, ROOM_MIN_Y + 16, 1e9];
  if (s.roomId === RAID_ROOM.armory) return [[CX + (roll(s, i, "w") - 0.5) * 240, CY - 30, 40], [CX + (roll(s, i, "u1") - 0.5) * 90, CY + 8, 30], [CX + (roll(s, i, "u2") - 0.5) * 90, CY + 26, 30], exit];
  if (s.roomId === RAID_ROOM.forge) return [[CX + (roll(s, i, "f") - 0.5) * 40, CY + 18, 150], exit];
  if (s.roomId === RAID_ROOM.altar) {
    const k = Math.max(0, ALTAR_IDS.indexOf(p.augments?.[0]?.alt ?? "whale"));
    return [[CX + ((k % 4) - 1.5) * 64, ALTAR_Y + 58 + Math.floor(k / 4) * 70, 90], exit];
  }
  if (s.roomId === RAID_ROOM.gym) return [[CX + (roll(s, i, "g") - 0.5) * 30, CY + 16, 140], exit];
  return [exit];
}

/** AI 한 틱 입력 */
export function raidBotInput(s: RunState): TickInput {
  const i = seatNo(s);
  const p = s.player;
  if (p.hp <= 0) return EMPTY_INPUT;
  return s.roomId === RAID_ROOM.boss ? fightInput(s, i) : prepInput(s, i);
}

function prepInput(s: RunState, i: number): TickInput {
  const r = s.raidBoss!;
  const bot = (r.bot ??= []);
  let st = bot[i];
  if (!st || st[2] !== s.roomId) st = bot[i] = [0, 0, s.roomId];
  const stops = prepStops(s, i);
  const stop = stops[Math.min(st[0]!, stops.length - 1)]!;
  const p = s.player;
  const dx = stop[0]! - p.x;
  const dy = stop[1]! - p.y;
  if (dx * dx + dy * dy > 36) return toInput(...(normalize(dx, dy) ?? [0, 0]));
  if (++st[1]! >= stop[2]!) {
    st[0]!++;
    st[1] = 0;
  }
  return EMPTY_INPUT;
}

function fightInput(s: RunState, i: number): TickInput {
  const p = s.player;
  const f = s.raidBoss!.fight;
  if (f?.cut) return EMPTY_INPUT;
  // 사슬: 보이는 방향을 차례로 (한 틱 누르고 한 틱 뗌)
  const seq = p.chains;
  if (seq && seq.length > 0 && (p.chainTicks ?? 0) > 0) {
    if (s.tick % 2 === 1 || roll(s, i, `c${seq.length}`) < 0.3) return EMPTY_INPUT;
    const d = seq[0]!;
    return toInput(d === 1 ? 1 : d === 3 ? -1 : 0, d === 2 ? 1 : d === 0 ? -1 : 0);
  }
  // 노릴 적: 어둠의 세계면 내 몬스터 · 아니면 기둥 → 불길 → 루시퍼 (가까운 것)
  const foes = s.enemies.filter((e) => e.hp > 0 && (p.raidDark ? e.kind === "lucshade" && e.count === i : e.kind !== "lucshade"));
  const rank = (k: string) => (k === "lucpillar" || k === "lucsword" ? 0 : k === "lucflame" ? 1 : 2);
  foes.sort((a, b) => rank(a.kind) - rank(b.kind) || (a.x - p.x) ** 2 + (a.y - p.y) ** 2 - ((b.x - p.x) ** 2 + (b.y - p.y) ** 2));
  const t = foes[0];
  let mx = 0;
  let my = 0;
  let dash = false;
  const range = Math.max(24, Math.min(140, p.stats.range));
  if (t) {
    const d = Math.sqrt((t.x - p.x) ** 2 + (t.y - p.y) ** 2);
    const to = normalize(t.x - p.x, t.y - p.y) ?? [0, 0];
    const want = range * 0.7 + t.r;
    const go = d > want + 6 ? 1 : d < want - 18 ? -1 : 0;
    const side = roll(s, i, "side") < 0.5 ? 1 : -1;
    mx = to[0] * go - to[1] * side * 0.4;
    my = to[1] * go + to[0] * side * 0.4;
  }
  const flee = (x: number, y: number, r: number, soon: boolean) => {
    const dx = p.x - x;
    const dy = p.y - y;
    if (dx * dx + dy * dy > (r + p.r + 6) ** 2) return;
    const n = normalize(dx, dy) ?? [1, 0];
    [mx, my] = n;
    if (soon) dash = true;
  };
  for (const h of s.hazards ?? []) if (h.toX === undefined && h.tick - s.tick < 40) flee(h.x, h.y, h.radius, h.tick - s.tick < 10);
  if (f) {
    for (const c of f.crowns) if (c[0] === i && c[4]) flee(c[2]!, c[3]! + 20, A.CROWN_R, c[1]! - s.tick < 10);
    for (const m of f.mines) flee(m[0]!, m[1]!, A.MINE_TOUCH + 4, false);
    for (const o of f.orbs) flee(o[0]!, o[1]!, A.ORB_R, o[2]! - s.tick < 12);
    const dk = f.dark?.[i];
    if (dk && dk[2]! - s.tick < 60) flee(dk[0]!, dk[1]!, D.DARK_R + 4, dk[2]! - s.tick < 12);
    for (const w of f.waves) if (w[3] === 0 && Math.abs(Math.sqrt((p.x - w[0]!) ** 2 + (p.y - w[1]!) ** 2) - w[2]!) < 14) dash = true;
    // 검기 경고: 가장 가까운 빈칸으로 · 흰색 돔: 돔 안으로
    const goTo = (x: number, y: number) => ([mx, my] = normalize(x - p.x, y - p.y) ?? [0, 0]);
    if (f.safe && !inSafe(f, p.x, p.y)) {
      let best = 0;
      for (let k = 2; k < f.safe.length; k += 2) if ((f.safe[k]! - p.x) ** 2 + (f.safe[k + 1]! - p.y) ** 2 < (f.safe[best]! - p.x) ** 2 + (f.safe[best + 1]! - p.y) ** 2) best = k;
      goTo(f.safe[best]!, f.safe[best + 1]!);
    }
    if (f.dome && (p.x - f.dome[0]!) ** 2 + (p.y - f.dome[1]!) ** 2 > (LUC_DOME_R * 0.6) ** 2) goTo(f.dome[0]!, f.dome[1]!);
    // 날개: 아직 없으면 가장 가까운 날개로
    if (f.wings?.length && !p.raidWing) {
      const w = [...f.wings].sort((a, b) => (a[0]! - p.x) ** 2 + (a[1]! - p.y) ** 2 - ((b[0]! - p.x) ** 2 + (b[1]! - p.y) ** 2))[0]!;
      goTo(w[0]!, w[1]!);
    }
    // 하늘 탄막: 가까이 오는 적 탄을 옆으로 피함
    if (f.p2 === "sky")
      for (const pr of s.projectiles) {
        if (pr.fromPlayer || (pr.x - p.x) ** 2 + (pr.y - p.y) ** 2 > 36 * 36 || (p.x - pr.x) * pr.vx + (p.y - pr.y) * pr.vy <= 0) continue;
        [mx, my] = normalize(-pr.vy, pr.vx) ?? [1, 0];
        break;
      }
  }
  const aim = t ? (normalize(t.x - p.x, t.y - p.y) ?? [1, 0]) : [p.faceX, p.faceY];
  return toInput(mx, my, { aimX: Math.round(aim[0]! * 100) * 10, aimY: Math.round(aim[1]! * 100) * 10, attack: !!t, dash, autoAim: true });
}
