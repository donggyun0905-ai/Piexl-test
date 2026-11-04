// 시즌 2 1단계 보스 늪의 두꺼비 왕: 폴짝 다가옴 → 차례로 ① 뛰어 내려찍기(떨어진 자리가 진흙) ② 혀로 끌어당기기 ③ 진흙 덩이 뱉기(떨어진 자리가 진흙)
// 체력 절반 아래면 더 자주·더 많이 (내려찍을 때 진흙 탄 고리). 진흙은 사람을 느리게 함 (sim/terrain)
import { dashDodged } from "./remnant";
import { TILE_SIZE } from "../constants";
import { distTo, fan, half, hitDamage, ring } from "./bossKit";
import { addShape, inHazard } from "./hazards";
import { eachSeat } from "./party";
import type { TerrainState } from "./terrainTypes";
import type { EnemyState, RunState } from "./types";
import { keepInRoom, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, roomGrid } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 뛰어 내려찍기: 예고 틱 · 범위 */
  LEAP_WARN: 50,
  LEAP_R: 34,
  /** 혀: 길이 · 굵기 · 예고 틱 · 끌어당기는 거리 */
  TONGUE_LEN: 130,
  TONGUE_W: 6,
  TONGUE_WARN: 34,
  PULL: 55,
  /** 진흙 덩이: 떨어지는 예고 틱 · 범위 · 한 번에 몇 개 */
  BLOB_WARN: 45,
  BLOB_R: 18,
  BLOBS: 3,
  /** 방에 진흙은 최대 몇 덩이 */
  MUD_MAX: 8,
  /** 폴짝 한 번 거리 · 쉬는 틱 */
  HOP: 14,
  REST: 90,
};
export { R as BOSS_TOAD_RULES };

type Vec = readonly [number, number];

/** 방 지형 (없으면 만듦) */
export function roomTerrain(s: RunState): TerrainState {
  if (!s.terrain || s.terrain.room !== s.roomId) s.terrain = { room: s.roomId, mud: [], lava: [], water: [], spikes: [] };
  return s.terrain;
}

/** 진흙 한 덩이 (방 안으로) */
function mudAt(s: RunState, x: number, y: number, size: number): void {
  const t = roomTerrain(s);
  const w = size * TILE_SIZE;
  const rx = Math.max(ROOM_MIN_X, Math.min(ROOM_MAX_X - w, x - w / 2));
  const ry = Math.max(ROOM_MIN_Y, Math.min(ROOM_MAX_Y - w, y - w / 2));
  t.mud.push([Math.round(rx), Math.round(ry), w, w]);
  if (t.mud.length > R.MUD_MAX) t.mud.shift();
}

export function updateToad(s: RunState, e: EnemyState, toP: Vec): void {
  const h = half(e);
  // 떨어질 진흙 덩이
  if (e.pools?.length) {
    for (const b of e.pools) if (b.t === s.tick) mudAt(s, b.x, b.y, 2);
    e.pools = e.pools.filter((b) => b.t > s.tick);
  }
  if (e.phase === "walk") {
    // 폴짝폴짝: 몇 틱마다 짧게 뜀
    if (s.tick % 24 < 8) {
      e.x += toP[0] * (R.HOP / 8);
      e.y += toP[1] * (R.HOP / 8);
    }
    e.dirX = toP[0];
    e.dirY = toP[1];
    if (e.timer > 0) return;
    e.count++;
    const pick = e.count % 3;
    if (pick === 1 || (pick === 0 && distTo(s, e) > R.TONGUE_LEN)) {
      // 뛰어 내려찍기: 지금 플레이어 자리에 원 예고, 그 사이 하늘을 날아감
      e.phase = "charge";
      e.timer = R.LEAP_WARN;
      e.auxX = s.player.x;
      e.auxY = s.player.y;
      e.air = true;
      addShape(s, R.LEAP_WARN, { x: s.player.x, y: s.player.y, radius: R.LEAP_R * (h ? 1.2 : 1), damage: hitDamage(s) });
    } else if (pick === 2) {
      // 혀: 플레이어 쪽 긴 선, 맞으면 끌려옴
      e.phase = "windup";
      e.timer = R.TONGUE_WARN;
      e.dirX = toP[0];
      e.dirY = toP[1];
      addShape(s, R.TONGUE_WARN, { x: e.x, y: e.y, radius: 0, damage: Math.round(hitDamage(s) * 0.6), toX: e.x + toP[0] * R.TONGUE_LEN, toY: e.y + toP[1] * R.TONGUE_LEN, width: R.TONGUE_W, fx: "stab" });
    } else {
      // 진흙 덩이: 플레이어 둘레 몇 군데에 떨어짐
      const n = R.BLOBS + (h ? 2 : 0);
      for (let i = 0; i < n; i++) {
        const ox = i === 0 ? 0 : ((i % 2 ? 1 : -1) * (20 + 12 * Math.ceil(i / 2)));
        const oy = i === 0 ? 0 : ((i % 3) - 1) * 16;
        const x = s.player.x + ox;
        const y = s.player.y + oy;
        addShape(s, R.BLOB_WARN + i * 6, { x, y, radius: R.BLOB_R, damage: Math.round(hitDamage(s) * 0.7) });
        (e.pools ??= []).push({ x, y, t: s.tick + R.BLOB_WARN + i * 6 });
      }
      if (h) fan(s, e, toP, [-1, 0, 1], 1.4, { look: "rock" });
      e.timer = h ? R.REST - 20 : R.REST;
    }
  } else if (e.phase === "charge") {
    // 하늘을 날아 내려찍을 자리로
    const tx = e.auxX ?? e.x;
    const ty = e.auxY ?? e.y;
    const k = 1 / Math.max(1, e.timer);
    e.x += (tx - e.x) * k;
    e.y += (ty - e.y) * k;
    if (e.timer > 0) return;
    e.air = false;
    mudAt(s, e.x, e.y, 3);
    if (h) ring(s, e, 2, e.count, 1.3, { look: "rock" });
    e.phase = "walk";
    e.timer = h ? R.REST - 25 : R.REST;
  } else if (e.phase === "windup") {
    if (e.timer > 0) return;
    // 혀가 닿은 사람은 두꺼비 쪽으로 끌려옴
    const line = { tick: 0, start: 0, x: e.x, y: e.y, radius: 0, damage: 0, toX: e.x + e.dirX * R.TONGUE_LEN, toY: e.y + e.dirY * R.TONGUE_LEN, width: R.TONGUE_W };
    eachSeat(
      s,
      () => {
        const p = s.player;
        if (!inHazard(line, p.x, p.y, p.r) || dashDodged(s)) return;
        p.x -= e.dirX * R.PULL;
        p.y -= e.dirY * R.PULL;
        keepInRoom(p, roomGrid(s));
      },
      !!s.party,
    );
    e.phase = "walk";
    e.timer = h ? R.REST - 20 : R.REST;
  }
}
