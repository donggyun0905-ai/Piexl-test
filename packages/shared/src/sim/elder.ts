// 장로(비르디아): 진법. 공격하면 적 자리(없으면 바라보는 쪽)에 네모난 진을 깔고, 잠시 뒤 진이 발동. 한 번에 깔린 진은 셋까지 (오래된 것부터 사라짐)
// 진마다: 덩굴 강타 · 불기둥 · 양쪽 벽 · 함정 구멍 · 떨어지는 검 · 번개 · 얼음 · 빨아들이는 바람 · 바위 주먹 · 천원진. 수치는 weaponsElder, 아이템은 itemsElder
import { srcRun, srcFn } from "./dmgSrc";
import { manualAim } from "./pwBasic";
import { TICK_RATE } from "../constants";
import { ELDER_PERKS as K } from "../itemsElder";
import { createRng, deriveSeed } from "../rng";
import { ELDER as L, FORMATIONS, type FormationKind } from "../weaponsElder";
import { blastAt as blastAt_, healPlayer, ignite } from "./combat";
import { alive, roomKey, stun, strike as strike_ } from "./s2Kit";
import type { ElderSeal } from "./s2Types";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, dist2, hasPerk, keepInRoom, roomGrid, STILL_TICKS, weaponOf } from "./util";
const blastAt = srcFn("elder", () => blastAt_), strike = srcFn("elder", () => strike_);

/** 네모난 진 안의 적 */
const inSeal = (s: RunState, g: ElderSeal) => alive(s).filter((e) => Math.abs(e.x - g.x) <= g.r + e.r && Math.abs(e.y - g.y) <= g.r + e.r);

/** 내 진 안에 서 있으면 받는 피해 감소 (classTaken) */
export function elderTaken(p: PlayerState): number {
  if (!hasPerk(p, "elWard")) return 1;
  return (p.seals ?? []).some((g) => g.arm <= 0 && Math.abs(p.x - g.x) <= g.r && Math.abs(p.y - g.y) <= g.r) ? K.elWard.taken : 1;
}

/** 진 한 번 맥박 (last: 남는 진의 마지막) */
function pulse(s: RunState, g: ElderSeal, last: boolean): void {
  const f = FORMATIONS[g.kind];
  const list = inSeal(s, g);
  const fx = { x: g.x, y: g.y, dirX: 0, dirY: 0 };
  switch (g.kind) {
    case "vine":
      for (const e of list) strike(s, e, g.dmg, f.push);
      addEffect(s, { kind: "vine", ...fx, y: g.y + g.r, size: 6, toX: g.x, toY: g.y - g.r * 1.4, maxTicks: 18 });
      return;
    case "daggers":
      for (const e of list) {
        strike(s, e, g.dmg);
        ignite(e, g.dmg);
      }
      addEffect(s, { kind: "elPillar", ...fx, size: g.r, maxTicks: 16 });
      return;
    case "walls":
      for (const e of list) {
        strike(s, e, g.dmg, 0, "frost");
        stun(e, f.stun ?? 0);
      }
      addEffect(s, { kind: "elWalls", ...fx, size: g.r, maxTicks: 18 });
      return;
    case "pit":
      for (const e of list) {
        strike(s, e, g.dmg, 0, "frost");
        stun(e, f.stun ?? 0);
      }
      return;
    case "swords": {
      const rng = createRng(deriveSeed(s.seed, "elSword", g.id, g.life));
      for (let i = 0; i < L.swords; i++) {
        // 진 안의 적이 있으면 그 위로, 없으면 진 안 아무 곳
        const e = list.length ? list[rng.int(0, list.length - 1)]! : null;
        const x = e ? e.x : g.x + rng.int(-g.r, g.r);
        const y = e ? e.y : g.y + rng.int(-g.r, g.r);
        blastAt(s, x, y, L.swordR, g.dmg, { still: true });
        addEffect(s, { kind: "elSword", x, y, dirX: 0, dirY: 0, size: L.swordR, maxTicks: 14 });
      }
      return;
    }
    case "thunder": {
      const e = list.sort((a, b) => dist2(a, g) - dist2(b, g) || a.id - b.id)[0];
      if (!e) return;
      strike(s, e, g.dmg, 0, "shock");
      addEffect(s, { kind: "bolt", x: e.x, y: e.y - 40, dirX: 0, dirY: 0, size: 2, maxTicks: 10, toX: e.x, toY: e.y, width: 2 });
      return;
    }
    case "frost":
      for (const e of list) {
        strike(s, e, g.dmg, 0, "frost");
        stun(e, f.stun ?? 0);
      }
      addEffect(s, { kind: "oFrost", ...fx, size: g.r, maxTicks: 24, tint: "#8ad8ff" });
      return;
    case "wind":
      for (const e of list) strike(s, e, g.dmg, 0, "storm");
      return;
    case "fist":
      for (const e of list) strike(s, e, g.dmg, f.push);
      addEffect(s, { kind: "elFist", ...fx, size: g.r, maxTicks: 18 });
      return;
    case "heaven":
      for (const e of list) strike(s, e, g.dmg, 0, "radiance");
      addEffect(s, { kind: "elPillar", ...fx, size: g.r * 0.5, maxTicks: 14, tint: "#fff4c0" });
      if (last) {
        blastAt(s, g.x, g.y, g.r * 1.2, g.dmg * L.heavenFinal, { still: true });
        addEffect(s, { kind: "holy", ...fx, size: g.r, maxTicks: 22 });
      }
      return;
  }
}

/** 풍뢰진: 진 안의 적을 가운데로 (보스 빼고) */
function pull(s: RunState, g: ElderSeal): void {
  for (const e of inSeal(s, g)) {
    if (e.kind === "dummy") continue;
    const d = Math.hypot(g.x - e.x, g.y - e.y);
    if (d < 2) continue;
    e.x += ((g.x - e.x) / d) * L.pull;
    e.y += ((g.y - e.y) / d) * L.pull;
    keepInRoom(e, roomGrid(s));
  }
}

/** 깔린 진들 한 틱 */
function sealTick(s: RunState): void {
  const p = s.player;
  const seals = p.seals ?? [];
  for (const g of seals) {
    if (g.arm > 0) {
      if (--g.arm > 0) continue;
      pulse(s, g, FORMATIONS[g.kind].dur <= 0);
      g.next = FORMATIONS[g.kind].every;
      continue;
    }
    if (g.life <= 0) continue;
    g.life--;
    if (g.kind === "wind") pull(s, g);
    if (--g.next <= 0) {
      g.next = FORMATIONS[g.kind].every;
      pulse(s, g, g.life <= 0);
    }
  }
  p.seals = seals.filter((g) => g.arm > 0 || g.life > 0);
}

/** 진 하나 깔기 */
function place(s: RunState, kind: FormationKind, x: number, y: number): void {
  const p = s.player;
  const f = FORMATIONS[kind];
  const g: ElderSeal = {
    id: s.nextId++,
    kind,
    x,
    y,
    r: f.r * (hasPerk(p, "elExpand") ? K.elExpand.r : 1),
    arm: Math.max(1, Math.round(f.arm * (hasPerk(p, "elSage") ? K.elSage.arm : 1))),
    life: Math.round(f.dur * (hasPerk(p, "elLinger") ? K.elLinger.dur : 1)),
    next: 0,
    born: s.tick,
    dmg: p.stats.damage * f.mul * (hasPerk(p, "elMaster") ? K.elMaster.mul : 1),
  };
  const seals = [...(p.seals ?? []), g];
  const max = L.maxSeals + (hasPerk(p, "elMore") ? K.elMore.seals : 0);
  p.seals = seals.slice(Math.max(0, seals.length - max));
}

/** 진을 깔 자리: 사거리 안 가장 가까운 적 (skip은 빼고), 없으면 바라보는 쪽 */
function target(s: RunState, skip?: EnemyState): EnemyState | undefined {
  const p = s.player;
  return alive(s)
    .filter((e) => e !== skip && dist2(e, p) <= p.stats.range ** 2)
    .sort((a, b) => dist2(a, p) - dist2(b, p) || a.id - b.id)[0];
}

function cast(s: RunState): void {
  const p = s.player;
  p.eCasts = (p.eCasts ?? 0) + 1;
  const kind = weaponOf(p).formation ?? "vine";
  // 패왕전 사람은 마우스 자리 (자동 조준 없음)
  const aim = manualAim(s, p.stats.range);
  const e = aim ? undefined : target(s);
  const reach = p.stats.range * 0.6;
  place(s, kind, aim ? aim.x : e ? e.x : p.x + p.faceX * reach, aim ? aim.y : e ? e.y : p.y + p.faceY * reach);
  if (!aim && hasPerk(p, "elDouble") && p.eCasts % K.elDouble.every === 0) srcRun(s, "elDouble", () => {
    const o = target(s, e);
    if (o) place(s, kind, o.x, o.y);
  });
  if (hasPerk(p, "elStaff")) srcRun(s, "elStaff", () => {
    for (const t of alive(s)) if (dist2(t, p) <= (K.elStaff.r + t.r) ** 2) strike(s, t, p.stats.damage * K.elStaff.mul, K.elStaff.push);
    addEffect(s, { kind: "swing", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: K.elStaff.r, maxTicks: 8, tint: "#c8a060" });
  });
}

/** 틱마다 (진법 무기를 들었을 때 player에서) */
export function elderTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  // 방이 바뀌면 깔린 진은 사라짐
  if (p.eRoom !== roomKey(s)) {
    p.eRoom = roomKey(s);
    delete p.seals;
  }
  sealTick(s);
  if (hasPerk(p, "elTea") && p.stillTicks >= STILL_TICKS && s.tick % K.elTea.every === 0) healPlayer(s, K.elTea.heal);
  if (!want || p.attackCooldown > 0) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  cast(s);
}

/** 연습장 등에서 다시 시작할 때 */
export function resetElder(p: PlayerState): void {
  for (const k of ["seals", "eCasts", "eRoom"] as const) delete p[k];
}
