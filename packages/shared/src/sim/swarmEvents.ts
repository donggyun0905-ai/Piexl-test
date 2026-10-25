// 광야의 새벽 특수 이벤트 (2분마다 하나): 포위(적이 크게 원을 그려 몰려옴, 모두 잡으면 성공) · 메테오 비(10초 버티면 성공)
// · 구출(어딘가 아이가 도와 달라고 외침, 제한 시간 안에 닿으면 성공). 성공하면 내 앞에 아이템 셋
import { TICK_RATE } from "../constants";
import { createRng, deriveSeed } from "../rng";
import { SWARM, type SwarmDropKind } from "../swarmDefs";
import { addShape } from "./hazards";
import { minionKinds } from "./critters";
import { swarmMinutes } from "./swarmSpawn";
import type { RunState } from "./types";
import { DIR16, dist2, keepInRoom, makeEnemy, roomGrid, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";

const E = SWARM.events;
const KINDS = ["ring", "meteor", "rescue"] as const;
const REWARDS: readonly SwarmDropKind[] = ["heal", "magnet", "bomb", "chest", "gold"];

const clampX = (x: number) => Math.min(ROOM_MAX_X - 12, Math.max(ROOM_MIN_X + 12, x));
const clampY = (y: number) => Math.min(ROOM_MAX_Y - 12, Math.max(ROOM_MIN_Y + 12, y));

function start(s: RunState): void {
  const sw = s.swarm!;
  const rng = createRng(deriveSeed(s.seed, "swarmEvent", s.tick));
  // 포위 · 메테오 · 구출을 차례로 (시드마다 시작이 다름)
  const kind = KINDS[(Math.floor(s.tick / (E.every * TICK_RATE)) + (s.seed % 3)) % 3]!;
  const p = s.player;
  if (kind === "ring") {
    const ids: number[] = [];
    const kinds = minionKinds(s.floor);
    const hpMul = 1 + SWARM.hpPerMin * swarmMinutes(s);
    for (let i = 0; i < E.ring.count; i++) {
      const a = (i / E.ring.count) * Math.PI * 2;
      const e = makeEnemy(s, kinds[i % kinds.length]!, clampX(p.x + Math.cos(a) * E.ring.radius), clampY(p.y + Math.sin(a) * E.ring.radius), hpMul, 0);
      keepInRoom(e, roomGrid(s));
      s.enemies.push(e);
      ids.push(e.id);
    }
    sw.event = { kind, until: s.tick + E.ring.ticks, x: p.x, y: p.y, ids };
  } else if (kind === "meteor") sw.event = { kind, until: s.tick + E.meteor.ticks, x: p.x, y: p.y };
  else {
    const [dx, dy] = DIR16[rng.int(0, 15)]!;
    sw.event = { kind, until: s.tick + E.rescue.ticks, x: clampX(p.x + dx * E.rescue.dist), y: clampY(p.y + dy * E.rescue.dist) };
  }
}

function finish(s: RunState, ok: boolean): void {
  const sw = s.swarm!;
  sw.event = undefined;
  sw.eventEnd = { ok, tick: s.tick };
  if (!ok) return;
  sw.eventsWon = (sw.eventsWon ?? 0) + 1;
  const rng = createRng(deriveSeed(s.seed, "swarmEventWin", s.tick));
  const p = s.player;
  // 바라보는 쪽 앞에 나란히 (바로 먹히지 않게 조금 떨어져서)
  for (let i = 0; i < E.rewards; i++) {
    const side = (i - 1) * 18;
    sw.drops.push({ id: s.nextId++, x: p.x + p.faceX * 30 - p.faceY * side, y: p.y + p.faceY * 30 + p.faceX * side, kind: rng.pick(REWARDS) });
  }
}

/** 틱마다: 이벤트 시작·진행·끝 */
export function updateEvents(s: RunState): void {
  const sw = s.swarm!;
  sw.nextEvent ??= E.first * TICK_RATE;
  const ev = sw.event;
  if (!ev) {
    if (s.tick >= sw.nextEvent) {
      sw.nextEvent = s.tick + E.every * TICK_RATE;
      start(s);
    }
    return;
  }
  const p = s.player;
  if (ev.kind === "ring") {
    const left = s.enemies.some((e) => ev.ids?.includes(e.id) && e.hp > 0);
    if (!left) return finish(s, true);
  } else if (ev.kind === "meteor") {
    if (s.tick % E.meteor.every === 0) {
      const rng = createRng(deriveSeed(s.seed, "meteor", s.tick));
      const x = clampX(p.x + (rng.nextFloat() * 2 - 1) * E.meteor.spread);
      const y = clampY(p.y + (rng.nextFloat() * 2 - 1) * E.meteor.spread);
      addShape(s, 50, { x, y, radius: 22, damage: E.meteor.damage * (1 + 0.1 * swarmMinutes(s)), fx: "meteor" });
    }
    if (s.tick >= ev.until) return finish(s, true);
    return;
  } else if (dist2(p, ev) <= (p.r + E.rescue.touch) ** 2) return finish(s, true);
  if (s.tick >= ev.until) finish(s, false);
}
