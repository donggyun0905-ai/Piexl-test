// 등 뒤에서 솟는 유도 미사일 (오토마타 · 붐버 로켓 같이 씀): 연기를 뿜으며 양옆으로 솟았다가, 멀리 있는 적도 늘 쫓아감
import { AUTOMATA as A } from "../weaponsAutomata";
import { createRng, deriveSeed } from "../rng";
import { alive } from "./s2Kit";
import type { RunState } from "./types";
import { addEffect, dist2 } from "./util";

/** n발 · 한 발 피해 · 폭발 반경 · small = 작은 미사일 (발사 연기 없음) */
export function backMissiles(s: RunState, n: number, dmg: number, blast: number, small = false): void {
  const p = s.player;
  const e = alive(s).sort((a, b) => dist2(a, p) - dist2(b, p) || a.id - b.id)[0];
  const base = e ? Math.atan2(e.y - p.y, e.x - p.x) : Math.atan2(p.faceY, p.faceX);
  for (let i = 0; i < n; i++) {
    // 등 뒤 양쪽으로 펼쳐 나갔다가 휘어 들어감
    const a = base + Math.PI + (i - (n - 1) / 2) * (2.4 / Math.max(1, n - 1)) * 0.9;
    const sp = A.missileSpeed * (0.85 + createRng(deriveSeed(s.seed, "msp", s.tick, i)).nextFloat() * 0.3);
    s.projectiles.push({ id: s.nextId++, fromPlayer: true, x: p.x - p.faceX * 4, y: p.y - 6, prevX: p.x, prevY: p.y - 6, r: small ? 1.5 : 2.5, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 0.8, damage: dmg, ticksLeft: A.missileTicks, homing: true, seek: true, blast, splash: 0.8, spirit: "adMissile" });
  }
  if (!small) addEffect(s, { kind: "adLaunch", x: p.x, y: p.y - 8, dirX: -p.faceX, dirY: -1, size: n, maxTicks: 18 });
}
