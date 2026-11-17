// 관리자 AI 측정 봇: 사람처럼 키를 눌러 혼자 하기를 돎 (그 캐릭터의 진짜 공격·스킬·대시가 그대로 나감 · 화면 전용, 기록·서버 없음)
// 싸움: 가까운 적 조준·공격 · 근접은 붙고 원거리는 거리 두고 옆걸음 · 위험 표시·날아오는 탄은 비키고 급하면 대시 · 스킬·사용 아이템·스탯 찍기는 때마다
// 정리 뒤: 층 보상 고르기 · 동전·공짜 아이템 줍기 · 살 수 있는 패시브 사기 · 출구(싸움 방 먼저)·계단으로
import { DOOR_HALF, distanceField, EMPTY_INPUT, EXIT_X, rewardChoices, ROOM_CX, ROOM_CY, ROOM_MIN_Y, roomGrid, walkToward, WEAPONS, type Pickup, type RunState, type TickInput } from "@pixel-rogue/shared";

/** 봇 수치: 원거리가 두는 거리 한도 · 탄을 살피는 거리 · 위험 표시를 미리 피하는 틱 · 정리 뒤 줍는 시간(틱) · 옆걸음 바꾸는 틱 · 상점에 들를 돈 · 적 몸에서 떨어져 있을 틈(픽셀, 원거리 · 근접) · 새로고침 뒤에도 남길 돈 · 노릴 적을 고를 때 체력 1이 거리 몇 픽셀만큼인지 */
const B = { farMax: 120, shotNear: 48, hazardSoon: 45, lootTicks: 420, strafeTicks: 90, shopGold: 40, crowd: 14, crowdMelee: 3, rerollKeep: 35, weakFirst: 0.15 };

export interface BotMem {
  /** 지금 방 (층/방) · 그 방에서 적 없이 지난 틱 */
  where: string;
  calm: number;
  /** 길찾기 거리 지도: 목표 자리 · 만든 틱 */
  field: Int16Array | null;
  fieldKey: string;
  fieldAt: number;
  /** 누를 차례 (스킬·스탯) */
  n: number;
  /** 노리는 적 id · 이 틱까지 그대로 */
  target: number;
  targetUntil: number;
}

export const newMem = (): BotMem => ({ where: "", calm: 0, field: null, fieldKey: "", fieldAt: -99, n: 0, target: 0, targetUntil: 0 });

/** 방 종류마다 고르는 순서 (낮을수록 먼저): 돈이 모였으면 상점 · 체력이 낮으면 쉼터 · 보상 방 · 싸움 방 · 오래 붙잡는 특수 방은 나중 */
function roomRank(s: RunState, type: string): number {
  const p = s.player;
  if (type === "exit") return 0;
  if (type === "shop") return s.gold >= B.shopGold ? 1 : 4;
  if (type === "rest") return p.hp < p.stats.maxHp * 0.5 ? 1 : 4;
  if (type === "treasure" || type === "golden") return 2;
  if (type === "elite" || type === "combat") return 3;
  return 5;
}

/** 지금 방에서 나갈 줄 (없으면 -1) */
export function pickLane(s: RunState): number {
  const exits = s.map.rooms[s.roomId]!.exits;
  let best = -1;
  let rank = 99;
  exits.forEach((to, lane) => {
    if (to < 0) return;
    const r = roomRank(s, s.map.rooms[to]!.type);
    if (r < rank) [best, rank] = [lane, r];
  });
  return best;
}

/** 벽을 돌아 그 자리로 걷기 */
function walk(s: RunState, m: BotMem, inp: TickInput, tx: number, ty: number): void {
  const g = roomGrid(s);
  const p = s.player;
  let dir: [number, number] | null;
  if (g) {
    const key = `${m.where}:${Math.round(tx / 16)}:${Math.round(ty / 16)}`;
    if (key !== m.fieldKey || s.tick - m.fieldAt > 20) [m.field, m.fieldKey, m.fieldAt] = [distanceField(g, tx, ty), key, s.tick];
    dir = walkToward(g, m.field!, p, tx, ty);
  } else {
    const d = Math.hypot(tx - p.x, ty - p.y);
    dir = d > 0.5 ? [(tx - p.x) / d, (ty - p.y) / d] : null;
  }
  if (dir) [inp.moveX, inp.moveY] = dir;
}

/** 피할 쪽 (위험 표시 안·날아오는 탄) · 급하면 urgent */
function dodge(s: RunState): { x: number; y: number; urgent: boolean } {
  const p = s.player;
  let [x, y, urgent] = [0, 0, false];
  for (const h of s.hazards ?? []) {
    const left = h.tick - s.tick;
    if (left > B.hazardSoon || left < -2) continue;
    const [dx, dy] = [p.x - h.x, p.y - h.y];
    const d = Math.hypot(dx, dy);
    if (d > h.radius + p.r + 6) continue;
    // 부채꼴: 바깥쪽에 서 있으면 안 맞음
    if (h.arc !== undefined && h.arc > -1 && h.dirX !== undefined && d > 1 && (dx * h.dirX + dy * (h.dirY ?? 0)) / d < h.arc - 0.15) continue;
    x += d > 0.5 ? dx / d : 1;
    y += d > 0.5 ? dy / d : 0;
    urgent ||= left < 14;
  }
  for (const pr of s.projectiles) {
    if (pr.fromPlayer) continue;
    const [dx, dy] = [p.x - pr.x, p.y - pr.y];
    const d = Math.hypot(dx, dy);
    const v = Math.hypot(pr.vx, pr.vy);
    if (d > B.shotNear || v < 0.01 || dx * pr.vx + dy * pr.vy <= 0) continue;
    // 탄이 가는 길의 옆으로 (내가 서 있는 쪽)
    const side = dx * -pr.vy + dy * pr.vx >= 0 ? 1 : -1;
    x += (-pr.vy / v) * side;
    y += (pr.vx / v) * side;
    urgent ||= d < 22;
  }
  return { x, y, urgent };
}

/** 무기 세기 어림 (피해 배율 × 공격 속도) */
const power = (id: string): number => {
  const w = (WEAPONS as Record<string, { damageMul: number; attackSpeed: number } | undefined>)[id];
  return w ? w.damageMul * w.attackSpeed : 0;
};

/** 주울 것: 동전 · 공짜 패시브·사용 아이템 · 살 수 있는 패시브 · 살 패시브가 없고 돈이 넉넉하면 상점 새로고침 (무기는 어림 세기가 더 높을 때만) */
function lootTarget(s: RunState): Pickup | null {
  const p = s.player;
  const all = s.rooms[s.roomId]!.pickups;
  const selling = all.some((pk) => pk.kind === "passive" && pk.price > 0);
  let best: Pickup | null = null;
  let bd = Infinity;
  for (const pk of all) {
    const free = (pk.kind === "passive" || pk.kind === "use" || (pk.kind === "weapon" && power(pk.itemId) > power(p.weaponId) * 1.05)) && pk.group === 0 && pk.price === 0 && pk.armed;
    const buy = pk.kind === "passive" && pk.price > 0 && s.gold >= pk.price;
    const reroll = pk.kind === "reroll" && !selling && s.gold >= pk.price + B.rerollKeep;
    if (pk.kind !== "coin" && !free && !buy && !reroll) continue;
    const d = (pk.x - p.x) ** 2 + (pk.y - p.y) ** 2;
    if (d < bd) [best, bd] = [pk, d];
  }
  return best;
}

/** 이번 틱 입력 (이동은 본편 입력처럼 -100~100) */
export function botInput(s: RunState, m: BotMem): TickInput {
  const inp = think(s, m);
  const len = Math.hypot(inp.moveX, inp.moveY);
  if (len > 0.01) [inp.moveX, inp.moveY] = [Math.round((inp.moveX / len) * 100), Math.round((inp.moveY / len) * 100)];
  return inp;
}

function think(s: RunState, m: BotMem): TickInput {
  const p = s.player;
  const inp: TickInput = { ...EMPTY_INPUT, autoAim: true };
  const where = `${s.floor}/${s.roomId}`;
  if (where !== m.where) [m.where, m.calm, m.fieldKey] = [where, 0, ""];
  const foes = s.enemies.filter((e) => e.hp > 0);
  // 때마다 누르는 것: 스킬 · 풋내기 스탯 · 체력이 낮으면 사용 아이템(싸움 중엔 가끔)
  if (s.tick % 20 === 0) inp.skill = 1 + (m.n++ % 4);
  if (s.tick % 30 === 7) inp.statPick = 1 + (m.n % 7);
  if ((p.hp < p.stats.maxHp * 0.5 && s.tick % 45 === 3) || (foes.length > 0 && s.tick % 240 === 11)) inp.useSlot = 1 + (Math.floor(s.tick / 45) % 2);

  if (foes.length > 0) {
    m.calm = 0;
    // 노릴 적: 가깝고 체력이 적은 쪽부터 (치유사 같은 약한 적을 먼저 잡아야 큰 적이 안 살아남) · 0.5초는 같은 적
    const cost = (e: (typeof foes)[number]) => Math.hypot(e.x - p.x, e.y - p.y) + e.hp * B.weakFirst;
    let t = foes.find((e) => e.id === m.target && s.tick < m.targetUntil);
    if (!t) {
      t = foes[0]!;
      for (const e of foes) if (cost(e) < cost(t)) t = e;
      [m.target, m.targetUntil] = [t.id, s.tick + 30];
    }
    const [dx, dy] = [t.x - p.x, t.y - p.y];
    const d = Math.hypot(dx, dy) || 1;
    [inp.aimX, inp.aimY, inp.attack] = [dx, dy, true];
    const range = p.stats.range;
    const melee = range < 70;
    // 근접은 닿는 끝 거리에서 (적 몸에 붙으면 맞음), 원거리는 멀찍이
    const want = melee ? Math.max(8, range * 0.8) + t.r : Math.min(range * 0.8, B.farMax);
    const av = dodge(s);
    const side = Math.floor(s.tick / B.strafeTicks) % 2 ? 1 : -1;
    // 몸이 닿을 만큼 가까운 적들에게서 물러남
    let [cx, cy, crowded] = [0, 0, false];
    for (const e of foes) {
      const ed = Math.hypot(e.x - p.x, e.y - p.y) || 1;
      if (ed > e.r + p.r + (melee ? B.crowdMelee : B.crowd)) continue;
      cx += (p.x - e.x) / ed;
      cy += (p.y - e.y) / ed;
      crowded = true;
    }
    if (av.x || av.y) {
      [inp.moveX, inp.moveY] = [av.x, av.y];
      if (av.urgent && p.dashCooldown === 0) inp.dash = true;
    } else if (crowded) {
      [inp.moveX, inp.moveY] = [cx + (-dy / d) * side * 0.5, cy + (dx / d) * side * 0.5];
      if (p.hp < p.stats.maxHp * 0.4 && p.dashCooldown === 0) inp.dash = true;
    } else if (d > want + 6) walk(s, m, inp, t.x, t.y);
    else if (d < want * 0.7) [inp.moveX, inp.moveY] = [-dx / d + (-dy / d) * side * 0.6, -dy / d + (dx / d) * side * 0.6];
    else [inp.moveX, inp.moveY] = [(-dy / d) * side, (dx / d) * side];
    return inp;
  }

  m.calm++;
  const st = s.rooms[s.roomId]!;
  if (rewardChoices(s).length > 0) inp.pickChoice = 1;
  const loot = m.calm < B.lootTicks ? lootTarget(s) : null;
  if (loot) {
    walk(s, m, inp, loot.x, loot.y);
    if (s.prompt.kind === "buy" && s.tick % 6 === 0) inp.interact = true;
    return inp;
  }
  if (s.map.rooms[s.roomId]!.type === "exit" && st.cleared) {
    walk(s, m, inp, ROOM_CX, ROOM_CY);
    if (s.prompt.kind === "stairs" && s.tick % 6 === 0) inp.interact = true;
    return inp;
  }
  const lane = pickLane(s);
  if (lane < 0 || !st.cleared) {
    // 아직 안 끝난 특수 방: 가운데에서 기다림 (오래 걸리면 benchRun이 넘김)
    walk(s, m, inp, ROOM_CX, ROOM_CY);
    return inp;
  }
  const ex = EXIT_X[lane]!;
  if (Math.abs(p.x - ex) <= DOOR_HALF - 3 && p.y < ROOM_MIN_Y + p.r + 14) [inp.moveX, inp.moveY] = [0, -1];
  else walk(s, m, inp, ex, ROOM_MIN_Y + p.r + 2);
  return inp;
}
