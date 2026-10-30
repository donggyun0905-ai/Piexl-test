// 빛의 사도: 떨어진 빛의 힘을 얻은 적 (층마다 전투방 셋, 판 시드로 고름 · 빛의 사도가 있는 판만)
// 방마다 셋 중 하나: 빛을 두른 강한 몬스터(무리 중 가장 센 하나) · 빛을 얻은 보스 · 빛을 훔친 그림자와 1대1 (나를 닮은 그림자 하나)
// 쓰러뜨리면 빛의 조각(lxShard)이 떨어짐 → 줍는 순간 성장 (sim/lux). 무한 모드는 층 제한 없이, 영웅의 길·레이드 아레나·패왕전은 없음
import { ROOM_CX, ROOM_MIN_Y } from "../constants";
import { bossForFloor } from "../content";
import { createRng, deriveSeed } from "../rng";
import { LUX } from "../weaponsLux";
import { spawnBoss } from "./bosses";
import { FLOOR_COUNT } from "./floor";
import { addPickup } from "./loot";
import { allPlayers } from "./party";
import type { EnemyState, RunState } from "./types";
import { addEffect, makeEnemy } from "./util";

const hasLux = (s: RunState) => allPlayers(s).some((p) => p.characterId === "lux");

/** 이 층에서 빛의 적이 나올 전투방 (방 번호, 최대 셋) */
export function luxRooms(s: RunState): number[] {
  if (!hasLux(s) || s.arenaLv || s.hero || s.pvp || s.swarm || (!s.endless && s.floor > FLOOR_COUNT)) return [];
  const combat = s.map.rooms.flatMap((r, i) => (r.type === "combat" ? [i] : []));
  const rng = createRng(deriveSeed(s.seed, "luxRooms", s.floor));
  const out: number[] = [];
  while (out.length < LUX.foes && combat.length) out.push(combat.splice(rng.int(0, combat.length - 1), 1)[0]!);
  return out;
}

/** 방의 적 무리에 빛을 입힘 (빛의 방이 아니면 그대로) */
export function luxRoom(s: RunState, roomId: number, list: EnemyState[]): EnemyState[] {
  if (!luxRooms(s).includes(roomId) || !list.length) return list;
  const kind = createRng(deriveSeed(s.seed, "luxKind", s.floor, roomId)).int(0, 2);
  let out = list;
  if (kind === 1) {
    // 빛을 얻은 보스 (이 층 보스, 체력은 낮춤)
    const b = spawnBoss(s, bossForFloor(s.floor, s.seed));
    b.hp = b.maxHp = Math.round(b.maxHp * LUX.bossHp);
    out = [b];
  } else if (kind === 2) {
    // 빛을 훔친 그림자: 나를 닮은 그림자 하나와 1대1
    const d = makeEnemy(s, "doppel", ROOM_CX, ROOM_MIN_Y + 40, LUX.duelHp * (1 + s.floor * 0.35), 60);
    d.luxDuel = true;
    out = [d];
  } else {
    // 빛을 두른 몬스터: 무리 중 가장 센 하나가 크고 단단해짐
    const top = [...list].sort((a, b) => b.maxHp - a.maxHp || a.id - b.id)[0]!;
    top.hp = top.maxHp = Math.round(top.maxHp * LUX.packHp);
    top.r = Math.round(top.r * 1.2);
  }
  const lit = kind === 0 ? [[...list].sort((a, b) => b.maxHp - a.maxHp || a.id - b.id)[0]!] : out;
  for (const e of lit) {
    e.lux = true;
    addEffect(s, { kind: "lxFoe", x: e.x, y: e.y, dirX: kind, dirY: 0, size: e.r * 3, maxTicks: 60 });
  }
  return out;
}

/** 빛의 적이 쓰러짐 (hiddenPerks.relicKill): 빛의 조각 (협동이면 빛의 사도 자리 것) */
export function luxKill(s: RunState, e: EnemyState): void {
  if (!e.lux) return;
  addPickup(s, s.roomId, "passive", "lxShard", e.x, e.y);
  const owner = allPlayers(s).findIndex((p) => p.characterId === "lux");
  const pk = s.rooms[s.roomId]!.pickups.at(-1)!;
  if (s.party && owner >= 0) pk.owner = owner;
  addEffect(s, { kind: "lxShard", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 20, maxTicks: 40 });
}
