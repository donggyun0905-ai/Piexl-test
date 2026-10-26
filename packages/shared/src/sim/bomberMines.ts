// 붐버 유도 지뢰: 적이 없어도 땅에 박아 둠 (내 둘레에 흩어서) · 사거리 안에 적이 오면 눈을 뜨고 달려가 닿으면 터짐
import { BOMBER as B } from "../weaponsBomber";
import { alive } from "./s2Kit";
import type { RunState } from "./types";
import { dist2 } from "./util";

/** 지뢰 하나 박기 (최대 max개, 넘으면 가장 오래된 것부터 빠짐) */
export function placeMine(s: RunState, max: number, dmg: number, r: number): void {
  const p = s.player;
  const list = (p.bmMines ?? []).slice(-(max - 1));
  const a = (p.attackCount * 2.4) % (Math.PI * 2);
  list.push({ x: p.x + Math.cos(a) * 10, y: p.y + 2 + Math.sin(a) * 6, dmg, r });
  p.bmMines = list;
}

/** 틱마다: 잠든 지뢰는 사거리 안 적을 찾아 깨어나고, 깨어난 지뢰는 적에게 달려감 (boom: 터뜨리기) */
export function updateMines(s: RunState, boom: (x: number, y: number, r: number, dmg: number) => void): void {
  const p = s.player;
  if (!p.bmMines?.length) return;
  const keep = [];
  const taken = new Set<number>();
  for (const m of p.bmMines) if (m.run !== undefined) taken.add(m.run);
  for (const m of p.bmMines) {
    let e = m.run !== undefined ? s.enemies.find((o) => o.id === m.run && o.hp > 0) : undefined;
    if (!e) {
      // 아직 다른 지뢰가 쫓지 않는 가까운 적 (없으면 아무 적)
      const near = alive(s)
        .filter((o) => dist2(o, m) <= (p.stats.range + o.r) ** 2)
        .sort((a, b) => dist2(a, m) - dist2(b, m) || a.id - b.id);
      e = near.find((o) => !taken.has(o.id)) ?? near[0];
      if (e) {
        m.run = e.id;
        m.t ??= 0;
        taken.add(e.id);
      } else delete m.run;
    }
    if (e) {
      const d = Math.hypot(e.x - m.x, e.y - m.y) || 1;
      const step = Math.min(d, B.mineSpeed);
      m.x += ((e.x - m.x) / d) * step;
      m.y += ((e.y - m.y) / d) * step;
      m.t = (m.t ?? 0) + 1;
      if (d <= B.mineTrigger + e.r || m.t >= B.mineTicks) {
        boom(m.x, m.y, m.r, m.dmg);
        continue;
      }
    }
    keep.push(m);
  }
  p.bmMines = keep;
}
