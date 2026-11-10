// 패왕전 전설 장비 특수 효과 (pwShop.PW_GEAR_FX): 상대 캐릭터를 때릴 때·맞을 때(pv.hits, 병사는 빼고) · 틱마다 · 쓰러질 때 버팀
// 중첩(아티팩트 7색·신의 파편·운명의 주사위)은 5초 안에 다시 때리거나 맞으면 유지. 확률은 판 시드로만
import { PW } from "../paewangDefs";
import { PW_GROW } from "../pwRules";
import { PW_GEAR_FX as F } from "../pwShop";
import { createRng, deriveSeed } from "../rng";
import { damagePlayer, healPlayer } from "./combat";
import { recalcStats } from "./items";
import { allPlayers, eachSeat, seatNo, useSeat } from "./party";
import { inPlay } from "./pvpWorld";
import { stk } from "./pwGearStat";
import type { PlayerState, RunState } from "./types";
import { addEffect } from "./util";

const has = (p: PlayerState, id: string) => !!p.pwGear?.includes(id);
const fxOf = (p: PlayerState) => (p.pwFx ??= {});
const roll = (s: RunState, tag: string, n: number) => createRng(deriveSeed(s.seed, "pwGear", tag, s.tick, n)).nextFloat();

/** 한 칸 쌓기 (5초 안이면 이어서, 최대 max) */
function stack(s: RunState, p: PlayerState, id: string, max: number): void {
  const st = (p.pwStk ??= {});
  const cur = st[id];
  const n = Math.min(max, (cur && s.tick - cur[1] <= PW_GROW.stackKeep ? cur[0] : 0) + 1);
  st[id] = [n, s.tick];
}

/** 다른 자리에 피해 (때린 사람 by) */
export function hurtSeat(s: RunState, j: number, dmg: number, by: number): void {
  const back = seatNo(s);
  useSeat(s, j);
  if (inPlay(s, j) && dmg > 0) {
    damagePlayer(s, dmg);
    if (by !== j) s.pvp!.seats[j]!.by = by;
  }
  useSeat(s, back);
}

/** 확률 효과 사이 쉬는 틱 (한 틱에 여러 번 맞아도 한 번만) */
function ready(s: RunState, p: PlayerState, id: string, gap = 20): boolean {
  const f = fxOf(p);
  if (s.tick - (f[`cd_${id}`] ?? -1e9) < gap) return false;
  f[`cd_${id}`] = s.tick;
  return true;
}

/** 이번 틱 상대 캐릭터끼리 맞은 것 (pvpWorld.transfer가 부름) */
export function gearHits(s: RunState, hits: readonly { to: number; by: number; amt: number }[]): void {
  const ps = allPlayers(s);
  const pv = s.pvp!;
  for (const h of hits) {
    const a = ps[h.by];
    const v = ps[h.to];
    if (!a || !v || h.by === h.to) continue;
    const amt = h.amt * PW.taken;
    // 때린 쪽
    for (const id of ["relicRed", "relicBlue", "relicGold", "relicPrism"] as const) if (has(a, id)) stack(s, a, id, F[id].max);
    if (has(a, "fateDice") && stk(a, "fate") < F.fateDice.max) {
      stack(s, a, "fate", F.fateDice.max);
      const k = Math.floor(roll(s, "fate", h.by) * 4);
      fxOf(a)[`fate${k}`] = (fxOf(a)[`fate${k}`] ?? 0) + 1;
    }
    const vf = fxOf(v);
    if (has(a, "ifritClaw")) {
      Object.assign(vf, { antiUntil: s.tick + F.ifritClaw.ticks, antiCut: F.ifritClaw.cut, burnUntil: s.tick + F.ifritClaw.ticks, burnDmg: a.stats.damage * F.ifritClaw.burn, burnBy: h.by });
      vf.burnN = Math.min(F.ifritClaw.max, (vf.burnN ?? 0) + 1);
    }
    if (has(a, "sylphQuiver") && ready(s, a, "sylph") && roll(s, "sylph", h.by) < F.sylphQuiver.chance) {
      Object.assign(vf, { tornUntil: s.tick + F.sylphQuiver.ticks, tornDmg: a.stats.damage * F.sylphQuiver.mul, tornBy: h.by });
    }
    if (has(a, "gnomeHammer") && ready(s, a, "gnome", 10)) {
      addEffect(s, { kind: "ring", x: v.x, y: v.y, dirX: 0, dirY: 0, size: F.gnomeHammer.r, maxTicks: 12 });
      ps.forEach((q, j) => {
        if (j !== h.to && pv.seats[j]!.team !== pv.seats[h.by]!.team && (q.x - v.x) ** 2 + (q.y - v.y) ** 2 < F.gnomeHammer.r ** 2) hurtSeat(s, j, amt * F.gnomeHammer.mul, h.by);
      });
    }
    if (has(a, "cupidSpirit")) Object.assign(vf, { cupid: Math.min(F.cupidSpirit.max, (vf.cupid ?? 0) + 1), cupidUntil: s.tick + F.cupidSpirit.ticks });
    // 맞은 쪽
    vf.hurtAt = s.tick;
    if (has(v, "relicSilver")) stack(s, v, "relicSilver", F.relicSilver.max);
    if (has(v, "relicWhite")) stack(s, v, "relicWhite", F.relicWhite.max);
    if (has(v, "godShard")) stack(s, v, "godShard", F.godShard.max);
    if (has(v, "aphroditeMirror") && ready(s, v, "mirror") && roll(s, "mirror", h.to) < F.aphroditeMirror.chance) {
      addEffect(s, { kind: "beam", x: v.x, y: v.y, dirX: a.x - v.x, dirY: a.y - v.y, size: 4, maxTicks: 14 });
      hurtSeat(s, h.by, amt * F.aphroditeMirror.mul, h.to);
    }
    if (has(v, "blizzardLance") && ready(s, v, "lance", 30)) {
      const b = F.blizzardLance;
      if (roll(s, "lance", h.to) < b.dash) hurtSeat(s, h.by, v.stats.damage * b.dashMul * 3, h.to);
      if (roll(s, "freeze", h.to) < b.freeze) {
        pv.seats[h.by]!.stun = Math.max(pv.seats[h.by]!.stun, b.stun);
        pv.seats[h.by]!.iced = s.tick + b.stun;
        hurtSeat(s, h.by, v.stats.damage * b.freezeMul * 3, h.to);
      }
    }
    if (has(v, "aetherBomb")) {
      vf.aether = (vf.aether ?? 0) + amt;
      if (vf.aether >= v.stats.maxHp * F.aetherBomb.store) {
        vf.aether = 0;
        addEffect(s, { kind: "burst", x: v.x, y: v.y, dirX: 0, dirY: 0, size: F.aetherBomb.r, maxTicks: 18 });
        ps.forEach((q, j) => {
          if (pv.seats[j]!.team !== pv.seats[h.to]!.team && (q.x - v.x) ** 2 + (q.y - v.y) ** 2 < F.aetherBomb.r ** 2) hurtSeat(s, j, v.stats.damage * F.aetherBomb.mul * 3, h.to);
        });
      }
    }
  }
}

/** 능력치를 바꾸는 값 묶음 (바뀌면 다시 계산) */
function gearSig(p: PlayerState): number {
  const f = p.pwFx ?? {};
  let n = (f.green ?? 0) * 7 + (f.portal ?? 0) * 1000 + (f.crown ?? 0) * 100 + (f.cupid ?? 0) * 13;
  for (const [id, [k]] of Object.entries(p.pwStk ?? {})) n += k * (id.length * 31 + id.charCodeAt(0));
  return n;
}

/** 틱마다 (자리마다): 중첩 끝 · 녹색·귀환의 문·왕관 · 수정구 회복 · 화상·회오리·독 · 저주받은 주사위 영역. 능력치가 바뀌면 다시 계산 */
export function gearTick(s: RunState): void {
  const pv = s.pvp!;
  eachSeat(s, (i) => {
    const p = s.player;
    if (p.pwLv === undefined || !inPlay(s, i)) return;
    const f = fxOf(p);
    const sig = gearSig(p);
    for (const [id, [, t]] of Object.entries(p.pwStk ?? {})) {
      if (s.tick - t <= PW_GROW.stackKeep) continue;
      delete p.pwStk![id];
      if (id === "fate") f.fate0 = f.fate1 = f.fate2 = f.fate3 = 0;
    }
    const since = s.tick - (f.hurtAt ?? -1e9);
    if (has(p, "relicGreen")) f.green = since >= F.relicGreen.calm || (f.green && since < F.relicGreen.keep) ? 1 : 0;
    if (has(p, "portalGun")) f.portal = since >= F.portalGun.calm ? Math.min(F.portalGun.add, (f.portal ?? 0) + F.portalGun.per) : 0;
    if (has(p, "crumblingCrown") && s.tick % 30 === 0) f.crown = Math.round((1 - Math.max(0, p.hp) / p.stats.maxHp) * 10) / 10;
    if ((f.cupidUntil ?? 0) <= s.tick) f.cupid = 0;
    if (s.tick % 60 === 0) {
      if (has(p, "dryadOrb") && roll(s, "dryad", i) < F.dryadOrb.chance) healPlayer(s, p.stats.maxHp * F.dryadOrb.heal);
      if ((f.burnUntil ?? 0) > s.tick) hurtSeat(s, i, (f.burnDmg ?? 0) * (f.burnN ?? 1) * PW.taken, f.burnBy ?? i);
      else f.burnN = 0;
      if ((f.tornUntil ?? 0) > s.tick) hurtSeat(s, i, (f.tornDmg ?? 0) * PW.taken, f.tornBy ?? i);
      if ((f.poisonUntil ?? 0) > s.tick) hurtSeat(s, i, (f.poisonDmg ?? 0) * PW.taken, f.poisonBy ?? i);
      if (has(p, "cursedDice")) {
        const c = F.cursedDice;
        allPlayers(s).forEach((q, j) => {
          if (pv.seats[j]!.team === pv.seats[i]!.team || (q.x - p.x) ** 2 + (q.y - p.y) ** 2 > c.r ** 2) return;
          Object.assign(fxOf(q), { antiUntil: s.tick + 70, antiCut: c.cut, poisonUntil: s.tick + 70, poisonDmg: p.stats.damage * c.poison * 3, poisonBy: i });
        });
      }
    }
    if (gearSig(p) !== sig) recalcStats(s);
  });
}

/** 쓰러질 피해를 받았을 때 버팀 (떨어진 신의 날개: 체력 75%로 부활 · 테라포밍: 체력 1로 집으로). 버텼으면 true */
export function gearSave(s: RunState, home: readonly [number, number] | undefined): boolean {
  const p = s.player;
  if (p.pwLv === undefined || p.hp > 0) return false;
  const f = fxOf(p);
  if (has(p, "fallenWings") && s.tick - (f.wingsAt ?? -1e9) >= F.fallenWings.cd) {
    f.wingsAt = s.tick;
    p.hp = p.stats.maxHp * F.fallenWings.hp;
    addEffect(s, { kind: "burst", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 30, maxTicks: 24 });
    return true;
  }
  if (has(p, "terraform") && home && s.tick - (f.terraAt ?? -1e9) >= F.terraform.cd) {
    f.terraAt = s.tick;
    p.hp = 1;
    p.x = p.prevX = home[0];
    p.y = p.prevY = home[1];
    addEffect(s, { kind: "burst", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 24, maxTicks: 20 });
    return true;
  }
  return false;
}
