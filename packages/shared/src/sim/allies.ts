// 히든 아이템 동료 (p.allies): 순례자의 월계선 = 무작위 히든 캐릭터 · 거짓된 용사 = 풋내기 (레벨이 오르면 능력치를 무작위로 고름)
// 동료는 체력이 있고 적 몸박치기·적 탄에 맞음. 가까이 가면 '체력 먹이기 F' → 내 회복약(포션·엘릭서)을 먹임
// 무기는 그 캐릭터 무기 중 무작위 (사거리가 길면 탄, 짧으면 휘두르기). 월계선 동료는 그 캐릭터 전용 패시브를 모두 가진 만큼 셈
import { baseStats, CHARACTERS, HIDDEN_CHARACTERS, WEAPON_IDS, WEAPONS, type CharacterId, type WeaponDef, type WeaponId } from "../content";
import { ENEMIES } from "../enemyDefs";
import { PASSIVE_IDS, PASSIVES, USE_ITEMS, type PassiveDef } from "../items";
import { createRng, deriveSeed } from "../rng";
import { damageEnemy } from "./combat";
import type { AllyState } from "./hiddenTypes";
import type { RunState, TickInput } from "./types";
import { addEffect, normalize, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";

const R = {
  /** 월계선 동료: 체력 배율 · 전용 패시브 하나마다 공격력 + */
  laurelHp: 1.5,
  perPassive: 0.03,
  /** 거짓된 용사: 체력 배율 · 레벨마다 필요한 처치 수 · 최대 레벨 */
  heroHp: 1,
  heroNeed: 4,
  heroMaxLv: 30,
  /** 레벨이 오를 때 (무작위 하나): 공격력 배율 · 최대 체력 + · 공격 간격 배율 · 사거리 + */
  lvDamage: 1.12,
  lvHp: 15,
  lvRate: 0.93,
  lvRange: 6,
  /** 탄을 쏘는 사거리 기준 · 탄 빠르기 · 따라가는 거리 · 보는 거리 · 이동 빠르기 배율 */
  shootRange: 60,
  shotSpeed: 4,
  follow: 24,
  sight: 170,
  speed: 1.1,
  /** 몸 반지름 · 몸박치기 맞은 뒤 무적 틱 · 먹이는 거리 */
  r: 5,
  hurtTicks: 30,
  feedReach: 22,
};
export { R as ALLY_RULES };

/** 동료 하나 만들기 (월계선: 무작위 히든 캐릭터 · 용사: 풋내기) */
export function addAlly(s: RunState, kind: AllyState["kind"]): void {
  const p = s.player;
  const n = (p.allies ??= []).length;
  const rng = createRng(deriveSeed(s.seed, "ally", kind, s.floor, s.tick, n));
  const char: CharacterId = kind === "laurel" ? rng.pick(HIDDEN_CHARACTERS as CharacterId[]) : "novice";
  // 그 캐릭터 무기 (풋내기는 공용 무기) 중 무작위
  const own = WEAPON_IDS.filter((w) => (WEAPONS[w] as WeaponDef).exclusive === (kind === "laurel" ? char : undefined) && w !== "fists");
  const weapon: WeaponId = own.length ? rng.pick(own) : CHARACTERS[char].startWeapon;
  const st = baseStats(char, weapon);
  const perks = kind === "laurel" ? PASSIVE_IDS.filter((id) => (PASSIVES[id] as PassiveDef).exclusive === char).length : 0;
  const maxHp = Math.round(st.maxHp * (kind === "laurel" ? R.laurelHp : R.heroHp));
  p.allies.push({
    kind,
    char,
    weapon,
    x: p.x - 14,
    y: p.y + 6,
    prevX: p.x - 14,
    prevY: p.y + 6,
    hp: maxHp,
    maxHp,
    dmg: st.damage * (1 + perks * R.perPassive),
    range: Math.max(24, st.range),
    rate: Math.max(6, Math.round(60 / Math.max(0.2, st.attackSpeed))),
    speed: st.moveSpeed * R.speed,
    cd: 30,
    hurt: 0,
    faceX: 1,
    faceY: 0,
    moving: false,
    perks,
    ...(kind === "hero" ? { lv: 1, exp: 0, seenKills: s.kills } : {}),
  });
  addEffect(s, { kind: "hdPortal", x: p.x - 14, y: p.y - 4, dirX: 0, dirY: 0, size: 14, maxTicks: 40 });
}

/** 방을 옮기면 동료가 따라옴 (곁에 다시 섬) */
export function allyFollow(s: RunState): void {
  const p = s.player;
  (p.allies ?? []).forEach((a, i) => {
    a.x = a.prevX = p.x + (i % 2 ? 14 : -14);
    a.y = a.prevY = p.y + 6;
  });
}

/** 틱마다 (hiddenTick): 따라가기·싸우기·맞기·레벨 */
export function alliesTick(s: RunState): void {
  const p = s.player;
  if (!p.allies?.length) return;
  // 다른 방에 들어가면 곁에 다시 섬
  const at = s.floor * 1000 + s.roomId;
  if (p.allyAt !== at) {
    p.allyAt = at;
    allyFollow(s);
  }
  for (const a of p.allies) {
    a.prevX = a.x;
    a.prevY = a.y;
    if (a.hurt > 0) a.hurt--;
    if (a.cd > 0) a.cd--;
    heroLevel(s, a);
    const e = nearestEnemy(s, a);
    let tx = p.x - p.faceX * R.follow;
    let ty = p.y - p.faceY * R.follow;
    if (e) {
      const d = Math.hypot(e.x - a.x, e.y - a.y);
      const want = a.range >= R.shootRange ? a.range * 0.7 : e.r + 4;
      const dir = normalize(e.x - a.x, e.y - a.y) ?? [1, 0];
      [tx, ty] = d > want ? [e.x, e.y] : [a.x, a.y];
      a.faceX = dir[0];
      a.faceY = dir[1];
      if (d <= a.range + e.r && a.cd <= 0) attack(s, a, e);
    }
    const mv = normalize(tx - a.x, ty - a.y);
    const far = Math.hypot(tx - a.x, ty - a.y) > 6;
    a.moving = !!mv && far;
    if (mv && far) {
      a.x = Math.max(ROOM_MIN_X + R.r, Math.min(ROOM_MAX_X - R.r, a.x + mv[0] * a.speed));
      a.y = Math.max(ROOM_MIN_Y + R.r, Math.min(ROOM_MAX_Y - R.r, a.y + mv[1] * a.speed));
      if (!e) [a.faceX, a.faceY] = mv;
    }
    hurt(s, a);
  }
  // 쓰러진 동료는 빛이 되어 사라짐
  for (const a of p.allies.filter((x) => x.hp <= 0)) addEffect(s, { kind: "burst", x: a.x, y: a.y, dirX: 0, dirY: 0, size: 12, maxTicks: 20 });
  p.allies = p.allies.filter((x) => x.hp > 0);
}

function nearestEnemy(s: RunState, a: AllyState) {
  let best = null;
  let bd = R.sight * R.sight;
  for (const e of s.enemies) {
    if (e.hp <= 0 || e.kind === "dummy") continue;
    const d = (e.x - a.x) ** 2 + (e.y - a.y) ** 2;
    if (d < bd) [best, bd] = [e, d];
  }
  return best;
}

function attack(s: RunState, a: AllyState, e: RunState["enemies"][number]): void {
  a.cd = a.rate;
  const d = normalize(e.x - a.x, e.y - a.y) ?? [a.faceX, a.faceY];
  if (a.range >= R.shootRange) {
    s.projectiles.push({ id: s.nextId++, fromPlayer: true, x: a.x + d[0] * 5, y: a.y + d[1] * 5, prevX: a.x, prevY: a.y, r: 2.5, vx: d[0] * R.shotSpeed, vy: d[1] * R.shotSpeed, damage: a.dmg, ticksLeft: Math.ceil(a.range / R.shotSpeed) });
    return;
  }
  // 휘두르기: 앞쪽 둘레 적 모두
  for (const t of s.enemies) {
    if (t.hp <= 0) continue;
    const dx = t.x - a.x;
    const dy = t.y - a.y;
    if (Math.hypot(dx, dy) > a.range + t.r || dx * d[0] + dy * d[1] < -4) continue;
    damageEnemy(s, t, a.dmg, d[0], d[1]);
  }
  addEffect(s, { kind: "cleave", x: a.x, y: a.y, dirX: d[0], dirY: d[1], size: a.range, maxTicks: 10 });
}

/** 적 탄·몸박치기에 맞음 */
function hurt(s: RunState, a: AllyState): void {
  for (const pr of s.projectiles) {
    if (pr.fromPlayer || pr.ticksLeft <= 0) continue;
    if ((pr.x - a.x) ** 2 + (pr.y - a.y) ** 2 > (pr.r + R.r) ** 2) continue;
    a.hp -= pr.damage;
    pr.ticksLeft = 0;
  }
  if (a.hurt > 0) return;
  for (const e of s.enemies) {
    const dmg = ENEMIES[e.kind]?.contactDamage ?? 0;
    if (e.hp <= 0 || dmg <= 0 || (e.x - a.x) ** 2 + (e.y - a.y) ** 2 > (e.r + R.r) ** 2) continue;
    a.hp -= dmg;
    a.hurt = R.hurtTicks;
    addEffect(s, { kind: "hit", x: a.x, y: a.y, dirX: 0, dirY: 0, size: 4, maxTicks: 8 });
    return;
  }
}

/** 거짓된 용사: 처치가 쌓이면 레벨 · 능력치를 무작위로 고름 */
function heroLevel(s: RunState, a: AllyState): void {
  if (a.kind !== "hero") return;
  const gain = s.kills - (a.seenKills ?? s.kills);
  a.seenKills = s.kills;
  if (gain <= 0 || (a.lv ?? 1) >= R.heroMaxLv) return;
  a.exp = (a.exp ?? 0) + gain;
  while (a.exp >= R.heroNeed * (a.lv ?? 1) && (a.lv ?? 1) < R.heroMaxLv) {
    a.exp -= R.heroNeed * (a.lv ?? 1);
    a.lv = (a.lv ?? 1) + 1;
    const pick = createRng(deriveSeed(s.seed, "heroLv", a.lv, s.tick)).int(0, 3);
    if (pick === 0) a.dmg *= R.lvDamage;
    else if (pick === 1) {
      a.maxHp += R.lvHp;
      a.hp += R.lvHp;
    } else if (pick === 2) a.rate = Math.max(6, Math.round(a.rate * R.lvRate));
    else a.range += R.lvRange;
    addEffect(s, { kind: "hdShow", x: a.x, y: a.y - 14, dirX: 0, dirY: 0, size: 12, maxTicks: 30 });
  }
}

/** 가까운 다친 동료 (먹이기 안내) */
export function allyNear(s: RunState): number {
  const p = s.player;
  return (p.allies ?? []).findIndex((a) => a.hp < a.maxHp && (a.x - p.x) ** 2 + (a.y - p.y) ** 2 <= R.feedReach ** 2);
}

/** 아이템 처리 뒤 (stepSim·협동): 다친 동료 옆이면 '체력 먹이기 F' · 누르면 내 회복약 하나를 먹임 */
export function allyFeed(s: RunState, input: TickInput): void {
  if (s.prompt.kind !== "none") return;
  const i = allyNear(s);
  if (i < 0) return;
  const p = s.player;
  const slot = p.useSlots.findIndex((x) => x === "potion" || x === "elixir");
  s.prompt = { kind: "feed", has: slot >= 0 };
  if (!input.interact || slot < 0) return;
  const a = p.allies![i]!;
  const item = p.useSlots[slot] as "potion" | "elixir";
  p.useSlots[slot] = null;
  a.hp = Math.min(a.maxHp, a.hp + a.maxHp * USE_ITEMS[item].healRatio);
  addEffect(s, { kind: "burst", x: a.x, y: a.y, dirX: 0, dirY: 0, size: 12, maxTicks: 16 });
}
