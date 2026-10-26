// 오리의 새끼 오리: 주인 뒤에 한 줄로 따라오며 닿은 적 탄을 막고, 주인이 꽥 하면 가까운 적에게 같이 꽥
import { DUCK } from "../weaponsDuck";
import { DUCK_PERKS as K } from "../itemsDuck";
import { damageEnemy, healPlayer } from "./combat";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, dist2, hasPerk, keepInRoom, normalize, roomGrid, weaponOf } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 너무 멀어지면(방을 옮김 등) 앞 오리 곁으로 */
  LEASH: 60,
};
export { R as DUCKLINGS_RULES };

/** 이 무기·아이템으로 데리고 다닐 새끼 오리 수 */
export function ducklingCount(p: PlayerState): number {
  const w = weaponOf(p);
  if (w.kind !== "quack") return 0;
  return (w.ducklings ?? 0) + p.passives.filter((id) => id === "extraDuckling").length;
}

/** 틱마다: 수 맞추기 · 앞 오리를 따라 걷기 · 적 탄 막기 */
export function updateDucklings(s: RunState): void {
  const p = s.player;
  const n = ducklingCount(p);
  const list = (p.ducklings ?? []).slice(0, n);
  for (let i = list.length; i < n; i++) {
    const lead = list[i - 1] ?? p;
    list.push({ x: lead.x, y: lead.y, prevX: lead.x, prevY: lead.y, cd: 0, face: 1 });
  }
  p.ducklings = list;
  const g = roomGrid(s);
  list.forEach((d, i) => {
    const lead = i === 0 ? p : list[i - 1]!;
    d.prevX = d.x;
    d.prevY = d.y;
    if (d.cd > 0) d.cd--;
    const far = Math.sqrt(dist2(d, lead));
    if (far > R.LEASH) {
      d.x = d.prevX = lead.x;
      d.y = d.prevY = lead.y;
      return;
    }
    // 앞 오리와 간격을 두고 따라감
    const gap = i === 0 ? p.r + DUCK.chick.gap - 2 : DUCK.chick.gap;
    if (far > gap) {
      const to = normalize(lead.x - d.x, lead.y - d.y)!;
      d.x += to[0] * (far - gap);
      d.y += to[1] * (far - gap);
      if (Math.abs(to[0]) > 0.2) d.face = to[0] < 0 ? -1 : 1;
    }
    const body = { x: d.x, y: d.y, prevX: d.x, prevY: d.y, r: DUCK.chick.r };
    keepInRoom(body, g);
    d.x = body.x;
    d.y = body.y;
  });
  if (list.length > 0) block(s);
}

/** 막을 수 있는 새끼 오리에 닿은 적 탄은 사라짐 */
function block(s: RunState): void {
  const p = s.player;
  const list = p.ducklings ?? [];
  const again = hasPerk(p, "braveDuckling") ? K.braveDuckling.block : DUCK.chick.block;
  s.projectiles = s.projectiles.filter((pr) => {
    if (pr.fromPlayer) return true;
    const d = list.find((d) => d.cd <= 0 && dist2(d, pr) < (DUCK.chick.r + pr.r + 1) ** 2);
    if (!d) return true;
    d.cd = again;
    if (hasPerk(p, "breadSnack")) healPlayer(s, K.breadSnack.heal);
    addEffect(s, { kind: "hit", x: pr.x, y: pr.y, dirX: 0, dirY: 0, size: 3, maxTicks: 6 });
    return false;
  });
}

/** 주인이 꽥 할 때: 새끼 오리마다 가까운 적에게 작은 꽥 */
export function echoQuack(s: RunState, dmg: number): void {
  const p = s.player;
  const loud = hasPerk(p, "echoQuack");
  const mul = loud ? K.echoQuack.echo : DUCK.chick.echo;
  const range = DUCK.chick.echoRange * (loud ? K.echoQuack.range : 1);
  for (const d of p.ducklings ?? []) {
    let best: EnemyState | null = null;
    for (const e of s.enemies) {
      if (e.hp <= 0 || dist2(e, d) > (range + e.r) ** 2) continue;
      if (!best || dist2(e, d) < dist2(best, d)) best = e;
    }
    if (!best) continue;
    const dir = normalize(best.x - d.x, best.y - d.y) ?? [d.face, 0];
    damageEnemy(s, best, dmg * mul, dir[0], dir[1]);
    d.face = dir[0] < 0 ? -1 : 1;
    addEffect(s, { kind: "quack", x: d.x, y: d.y, dirX: dir[0], dirY: dir[1], size: 12, maxTicks: 10, width: 0.5 });
  }
}
