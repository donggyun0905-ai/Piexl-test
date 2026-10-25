// 오니 방망이 추가 공격 (무기마다 하나, 휘두른 공격이 맞았을 때 확률로). 피해는 속성 피해(색 숫자) dotDamage
// 스킬 공격력 = 지금 공격력 · 효과 범위는 사거리 아이템만큼 (p.oReach)
import { ENEMIES } from "../enemyDefs";
import { ONI_PERKS as K } from "../itemsOni";
import { ONI, type ClubArt } from "../weaponsOni";
import { dotDamage, healPlayer, ignite } from "./combat";
import { raiseShield } from "./imugiMods";
import type { DotKind, EnemyState, RunState } from "./types";
import { addEffect, hasPerk, keepInRoom, normalize, roomGrid } from "./util";

/** 무기마다 번개·불꽃 색 */
export const CLUB_TINT: Record<ClubArt, string> = {
  thunder: "#ffe04a",
  frost: "#9ae8ff",
  lotus: "#ff6a2a",
  gold: "#ffd040",
  yamata: "#9a4aff",
  genesis: "#fff8d8",
  wind: "#8af0c0",
  tide: "#3a9aff",
  black: "#1a1020",
  azure: "#6ad8ff",
};

/** 추가 공격 확률 (아이템 반영, 신인족이면 100%) */
export function artChance(s: RunState, art: ClubArt): number {
  const p = s.player;
  if ((p.oGod ?? 0) > 0) return 1;
  let c = ONI[art].chance;
  if (art === "thunder" && hasPerk(p, "oniJudgment")) c += K.oniJudgment.chance;
  if (art === "lotus" && hasPerk(p, "oniRedLotus")) c += K.oniRedLotus.chance;
  if (art === "yamata" && hasPerk(p, "oniShadowSpread")) c += K.oniShadowSpread.chance;
  return Math.min(1, c);
}

/** (x, y)에서 (dx, dy) 쪽 부채꼴(반경 r, cos 이상) 안의 적 */
function inFan(s: RunState, x: number, y: number, dx: number, dy: number, r: number, cos: number): EnemyState[] {
  return s.enemies.filter((e) => {
    if (e.hp <= 0) return false;
    const ex = e.x - x;
    const ey = e.y - y;
    const d = Math.hypot(ex, ey);
    return d <= r + e.r && (d <= e.r + 4 || (ex * dx + ey * dy) / d >= cos);
  });
}

/** 반경 안의 적 */
export const inCircle = (s: RunState, x: number, y: number, r: number) => s.enemies.filter((e) => e.hp > 0 && (e.x - x) ** 2 + (e.y - y) ** 2 <= (r + e.r) ** 2);

/** 부채꼴 번개 (명뢰봉·흑뢰봉·청전): 맞은 적마다 피해, 연쇄 뇌격이면 가까운 다른 적에게 한 번 더 */
function boltFan(s: RunState, art: ClubArt, dx: number, dy: number, dmg: number, kind: DotKind, after?: (e: EnemyState) => void): void {
  const p = s.player;
  const cloud = art === "thunder" && hasPerk(p, "oniThunderCloud");
  const r = ONI.thunder.fanR * (p.oReach ?? 1) * (cloud ? K.oniThunderCloud.range : 1);
  const hit = inFan(s, p.x, p.y, dx, dy, r, ONI.thunder.fanCos);
  for (const e of hit) {
    dotDamage(s, e, kind, dmg * (cloud ? K.oniThunderCloud.damage : 1));
    after?.(e);
    if (art === "thunder" && hasPerk(p, "oniChainBolt")) {
      const o = inCircle(s, e.x, e.y, K.oniChainBolt.reach).find((x) => x !== e);
      if (o) {
        dotDamage(s, o, "shock", p.stats.damage * K.oniChainBolt.mul);
        addEffect(s, { kind: "oSplash", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 2, toX: o.x, toY: o.y, maxTicks: 10, tint: CLUB_TINT.thunder });
      }
    }
  }
  addEffect(s, { kind: "oBolt", x: p.x, y: p.y - 4, dirX: dx, dirY: dy, size: r, width: ONI.thunder.fanCos, maxTicks: 16, tint: CLUB_TINT[art] });
}

/** 방어력 깎기 (청전: 받는 피해 +5%) */
function shred(e: EnemyState): void {
  e.apDef = Math.max(e.apDef ?? 0, ONI.azure.def);
}

/** 바닥 한파·서리 깔기 */
function chill(s: RunState, kind: "frost" | "azure"): void {
  const p = s.player;
  const perma = kind === "frost" && hasPerk(p, "oniPermafrost");
  const r = ONI.frost.zoneR * (p.oReach ?? 1) * (perma ? K.oniPermafrost.radius : 1);
  (p.oZones ??= []).push({ x: p.x, y: p.y, r, ticks: ONI.frost.zoneTicks + (perma ? K.oniPermafrost.ticks : 0), kind });
  addEffect(s, { kind: "oFrost", x: p.x, y: p.y, dirX: kind === "azure" ? 1 : 0, dirY: 0, size: r, maxTicks: 22, tint: CLUB_TINT[kind] });
}

/** 추가 공격 하나 (e = 맞은 적 중 가장 가까운 적, hits = 이번에 맞은 적 모두) */
export function clubArt(s: RunState, art: ClubArt, e: EnemyState, hits: readonly EnemyState[]): void {
  const p = s.player;
  const atk = p.stats.damage;
  const hp = p.stats.maxHp;
  const reach = p.oReach ?? 1;
  const d = normalize(e.x - p.x, e.y - p.y) ?? [p.faceX, p.faceY];
  const tint = CLUB_TINT[art];
  switch (art) {
    case "thunder":
      dotDamage(s, e, "shock", atk * ONI.thunder.mul);
      return boltFan(s, art, d[0], d[1], atk * ONI.thunder.fanMul, "shock");
    case "black":
      dotDamage(s, e, "voidbolt", atk * ONI.black.mul + hp * ONI.black.hp);
      return boltFan(s, art, d[0], d[1], atk * ONI.black.fanMul, "voidbolt");
    case "azure":
      // 빙뢰: 최대 체력만큼 + 방어력 깎기, 부채꼴 번개에 맞은 적도 · 서리 깔기
      dotDamage(s, e, "frost", hp * ONI.azure.hp);
      shred(e);
      boltFan(s, art, d[0], d[1], atk * ONI.thunder.fanMul, "shock", shred);
      return chill(s, "azure");
    case "frost": {
      const cap = hasPerk(p, "oniFrostMail") ? K.oniFrostMail.shieldMax : ONI.frost.shield;
      raiseShield(p, ONI.frost.shield, cap);
      for (const h of hits) {
        dotDamage(s, h, "frost", atk * ONI.frost.mul);
        if (h.kind !== "dummy") h.stunTicks = Math.max(h.stunTicks ?? 0, ENEMIES[h.kind].boss ? ONI.frost.freeze / 2 : ONI.frost.freeze);
      }
      return chill(s, "frost");
    }
    case "lotus": {
      dotDamage(s, e, "burn", atk * ONI.lotus.mul + hp * ONI.lotus.hp);
      const r = ONI.lotus.fanR * reach;
      for (const o of inFan(s, p.x, p.y, d[0], d[1], r, ONI.lotus.fanCos)) {
        dotDamage(s, o, "burn", atk * ONI.lotus.fanMul);
        if (hasPerk(p, "oniHellBrand")) ignite(o, atk);
      }
      if (hasPerk(p, "oniBloodFlame")) healPlayer(s, hp * K.oniBloodFlame.heal);
      addEffect(s, { kind: "oFlame", x: p.x, y: p.y - 4, dirX: d[0], dirY: d[1], size: r, width: ONI.lotus.fanCos, maxTicks: 22, tint });
      return;
    }
    case "gold": {
      if (s.gold <= 0) return;
      dotDamage(s, e, "gold", s.gold * ONI.gold.pct);
      s.gold -= Math.max(1, Math.floor(s.gold * ONI.gold.cost));
      addEffect(s, { kind: "oCoins", x: p.x, y: p.y - 4, dirX: d[0], dirY: d[1], size: ONI.lotus.fanR * reach, width: ONI.lotus.fanCos, maxTicks: 24, tint });
      return;
    }
    case "yamata": {
      dotDamage(s, e, "curse", atk * ONI.yamata.mul);
      e.oDeath = hasPerk(p, "oniEightHeads") ? K.oniEightHeads.ticks : ONI.yamata.ticks;
      e.oDeathDmg = (hp * (p.oRegen ?? ONI.regenBase)) / 100;
      addEffect(s, { kind: "oDark", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 22 * reach, maxTicks: 18, tint });
      return;
    }
    case "genesis": {
      const r = ONI.genesis.radius * reach;
      for (const o of inCircle(s, e.x, e.y, r)) dotDamage(s, o, "radiance", hp * ONI.genesis.hp);
      addEffect(s, { kind: "oPillar", x: e.x, y: e.y, dirX: 0, dirY: 0, size: r, maxTicks: 30, tint });
      return;
    }
    case "wind": {
      const n = hasPerk(p, "oniTwinWind") ? K.oniTwinWind.count : 1;
      for (let i = 0; i < n; i++) {
        const x = e.x + (i ? -10 : 0);
        (p.oStorms ??= []).push({ x, y: e.y, prevX: x, prevY: e.y, ticks: hasPerk(p, "oniTyphoonEye") ? K.oniTyphoonEye.ticks : ONI.wind.ticks, dmg: hp * ONI.wind.hp, cd: 0 });
      }
      return;
    }
    case "tide": {
      const great = hasPerk(p, "oniGreatWave");
      const r = ONI.tide.fanR * reach * (great ? K.oniGreatWave.range : 1);
      let dealt = 0;
      for (const o of inFan(s, p.x, p.y, d[0], d[1], r, ONI.tide.fanCos)) {
        const before = o.hp;
        dotDamage(s, o, "tide", hp * ONI.tide.hp);
        dealt += before - Math.max(0, o.hp);
        if (!ENEMIES[o.kind].boss && o.kind !== "dummy") {
          const push = ONI.tide.push * (great ? K.oniGreatWave.push : 1);
          o.x += d[0] * push;
          o.y += d[1] * push;
          keepInRoom(o, roomGrid(s));
        }
      }
      const chains = hasPerk(p, "oniSprayChain") ? K.oniSprayChain.chains : ONI.tide.chains;
      if (dealt > 0) (p.oSplash ??= []).push({ x: e.x, y: e.y, left: chains, wait: ONI.tide.gap, dmg: (dealt * ONI.tide.share) / chains });
      if (hasPerk(p, "oniDragonPalace")) healPlayer(s, hp * K.oniDragonPalace.heal);
      addEffect(s, { kind: "oWave", x: p.x, y: p.y, dirX: d[0], dirY: d[1], size: r, width: ONI.tide.fanCos, maxTicks: 22, tint });
      return;
    }
  }
}
