// 크루세이더 성벽 돌진 (대시): 십자가를 앞으로 내밀고 돌진 → 앞에 닿은 적을 잡아 밀고 감 (보스는 한 번 피해만)
// 밀던 적이 벽·기둥에 막히면 벽 충돌 (더 큰 피해·긴 기절) · 대시가 끝나면 잡은 적을 모두 들이받음 · 돌진 낙인 (앞 땅에 작은 십자 균열)
import { CRUSADER_PERKS as K } from "../itemsCrusader";
import { CRUSADER as C } from "../weaponsCrusader";
import { addCrack, addWeight, crHits, crStrike } from "./crusaderKit";
import { alive, isBoss, stun } from "./s2Kit";
import type { RunState } from "./types";
import { addEffect, hasPerk, keepInRoom, reachOf, roomGrid } from "./util";

/** 벽에 부딪힘: 큰 피해 · 긴 기절 */
function wallHit(s: RunState, id: number): void {
  const p = s.player;
  const e = s.enemies.find((f) => f.id === id);
  if (!e) return;
  const w = hasPerk(p, "crRamWall");
  crStrike(s, e, C.wallMul * (w ? K.crRamWall.mul : 1));
  stun(e, C.wallStun + (w ? K.crRamWall.stun : 0));
  addEffect(s, { kind: "crWallFx", x: e.x, y: e.y, dirX: p.dashDirX, dirY: p.dashDirY, size: e.r + 10, maxTicks: 26 });
}

/** 돌진 한 틱 (대시 중) · 끝난 틱에 들이받기 */
export function ramTick(s: RunState): void {
  const p = s.player;
  const dashing = p.dashTicks > 0;
  if (dashing && !p.crRam) {
    p.crRam = { held: {}, done: [] };
    addEffect(s, { kind: "crRamFx", x: p.x, y: p.y, dirX: p.dashDirX, dirY: p.dashDirY, size: 22, maxTicks: 14, follow: true });
  }
  const ram = p.crRam;
  if (!ram) return;
  const dx = p.dashDirX;
  const dy = p.dashDirY;
  if (dashing) {
    const reach = C.ramR * reachOf(p) * (hasPerk(p, "crRamWide") ? K.crRamWide.r : 1);
    const grid = roomGrid(s);
    let caught = 0;
    for (const e of alive(s)) {
      if (ram.done.includes(e.id)) continue;
      const fx = e.x - p.x;
      const fy = e.y - p.y;
      const side = fx * dy - fy * dx;
      if (!(e.id in ram.held)) {
        const fwd = fx * dx + fy * dy;
        if (fwd < -2 || fwd > p.r + e.r + reach || Math.abs(side) > p.r + e.r + reach * 0.6) continue;
        if (isBoss(e)) {
          ram.done.push(e.id);
          crStrike(s, e, C.bossMul);
          caught++;
          continue;
        }
        ram.held[e.id] = Math.max(-p.r, Math.min(p.r, side));
        caught++;
      }
      // 십자가 앞에 붙여 밀고 감 · 벽에 막히면 벽 충돌
      const lat = ram.held[e.id]!;
      const tx = p.x + dx * (p.r + e.r + 2) + dy * lat;
      const ty = p.y + dy * (p.r + e.r + 2) - dx * lat;
      e.x = tx;
      e.y = ty;
      keepInRoom(e, grid);
      if ((e.x - tx) ** 2 + (e.y - ty) ** 2 > 4) {
        delete ram.held[e.id];
        ram.done.push(e.id);
        wallHit(s, e.id);
      }
    }
    if (caught && hasPerk(p, "crRamGain")) addWeight(p, caught * K.crRamGain.weight);
    crHits(s, caught);
    return;
  }
  // 대시 끝: 잡은 적을 들이받음
  delete p.crRam;
  const ids = Object.keys(ram.held).map(Number);
  let n = 0;
  for (const e of alive(s).filter((f) => ids.includes(f.id))) {
    crStrike(s, e, C.ramMul * (hasPerk(p, "crRamPow") ? K.crRamPow.mul : 1), 10);
    stun(e, C.ramStun);
    n++;
  }
  crHits(s, n);
  if (n) addEffect(s, { kind: "crRamEndFx", x: p.x + dx * 14, y: p.y + dy * 14, dirX: dx, dirY: dy, size: 26, maxTicks: 22 });
  if (hasPerk(p, "crRamSlam")) {
    const r = K.crRamSlam;
    const d = C.slamFwd * 0.6 * reachOf(p);
    addCrack(p, { x: p.x + dx * d, y: p.y + dy * d, dx, dy, n: [r.long, r.side, r.side, 0], mul: C.segMul * r.mul });
    addEffect(s, { kind: "crSlamFx", x: p.x + dx * d, y: p.y + dy * d, dirX: dx, dirY: dy, size: C.slamR * 0.6 * reachOf(p), maxTicks: 22, width: 1 });
  }
}
