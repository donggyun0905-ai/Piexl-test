// 오닉스 보석 일곱: 저마다 따로 확률을 굴려 반응 (시드) · 한 번에 많이 반응하면 칠보 공명
// 홍옥 불기둥 · 호박 운석 · 황옥 연쇄 번개 · 비취 덩굴 가시 · 청옥 서리 · 남옥 꿰뚫는 빛줄기 · 자수정 공허 붕괴
import { ONYX_PERKS as K } from "../itemsOnyx";
import { createRng, deriveSeed } from "../rng";
import { ONYX as O, ONYX_GEM_IDS, ONYX_GEMS as G, type OnyxGem } from "../weaponsOnyx";
import { healPlayer } from "./combat";
import { alive, isBoss, inCircle, inLine, poison, strike, stun } from "./s2Kit";
import type { OnyxFx } from "./fxTypes";
import type { EnemyState, RunState } from "./types";
import { addEffect, dist2, hasPerk, normalize } from "./util";

/** 보석 피해 기준 (보석 왕관 +) */
const power = (s: RunState) => s.player.stats.damage * (hasPerk(s.player, "oxCrown") ? K.oxCrown.mul : 1);
const byId = (a: EnemyState, b: EnemyState) => a.id - b.id;

/** 반응 확률 (연마된 보석 +) */
export function gemChance(s: RunState, g: OnyxGem): number {
  return Math.min(1, G[g].chance + (hasPerk(s.player, "oxPolish") ? K.oxPolish.add : 0));
}

const fx = (s: RunState, kind: OnyxFx, x: number, y: number, size: number, maxTicks: number, more: Record<string, number> = {}) =>
  addEffect(s, { kind, x, y, dirX: 0, dirY: 0, size, maxTicks, ...more });

/** 보석 하나 반응 (자리 k = 광륜 위 순서) */
export function fireGem(s: RunState, g: OnyxGem): void {
  const p = s.player;
  const list = alive(s).sort(byId);
  const dmg = power(s) * G[g].mul;
  const near = [...list].sort((a, b) => dist2(a, p) - dist2(b, p) || a.id - b.id);
  const rng = createRng(deriveSeed(s.seed, "oxGem", g, s.tick));
  switch (g) {
    case "ruby": {
      const e = near[0];
      if (!e) return;
      for (const o of inCircle(s, e.x, e.y, G.ruby.r)) {
        strike(s, o, dmg, 4, "burn");
        o.burnTicks = Math.max(o.burnTicks ?? 0, G.ruby.burn);
        o.burnDmg = Math.max(o.burnDmg ?? 0, power(s) * 0.15);
      }
      fx(s, "oxRuby", e.x, e.y, G.ruby.r, 34);
      break;
    }
    case "amber": {
      const pick = [...list];
      for (let i = 0; i < G.amber.n && pick.length; i++) {
        const e = pick.splice(Math.floor(rng.nextFloat() * pick.length), 1)[0]!;
        for (const o of inCircle(s, e.x, e.y, G.amber.r)) strike(s, o, dmg, 6);
        fx(s, "oxAmber", e.x, e.y, G.amber.r, 30 + i * 4);
      }
      break;
    }
    case "topaz": {
      let at = { x: p.x, y: p.y - 10 };
      const left = [...list];
      for (let i = 0; i < G.topaz.n; i++) {
        const next = left.filter((e) => dist2(e, at) <= G.topaz.reach ** 2).sort((a, b) => dist2(a, at) - dist2(b, at) || a.id - b.id)[0];
        if (!next) break;
        left.splice(left.indexOf(next), 1);
        strike(s, next, dmg, 0, "shock");
        fx(s, "oxTopaz", at.x, at.y, 3, 18, { toX: next.x, toY: next.y });
        at = next;
      }
      break;
    }
    case "jade": {
      for (const e of inCircle(s, p.x, p.y, G.jade.r)) {
        strike(s, e, dmg, 8, "poison");
        poison(e, power(s) * 0.1 + G.jade.poison, G.jade.ticks);
      }
      healPlayer(s, p.stats.maxHp * G.jade.heal);
      fx(s, "oxJade", p.x, p.y, G.jade.r, 36);
      break;
    }
    case "sapphire": {
      for (const e of list) {
        strike(s, e, dmg, 0, "frost");
        if (!isBoss(e)) e.slowTicks = Math.max(e.slowTicks ?? 0, G.sapphire.slow);
        fx(s, "oxFrost", e.x, e.y, e.r + 8, 30);
      }
      fx(s, "oxSapph", p.x, p.y, 160, 40);
      break;
    }
    case "aqua": {
      const t = near[0];
      const d = (p.oxFly && normalize(p.dashDirX, p.dashDirY)) || (t && normalize(t.x - p.x, t.y - p.y)) || [p.faceX, p.faceY];
      for (const e of inLine(s, G.aqua.len, G.aqua.w, d[0], d[1])) strike(s, e, dmg, 3);
      addEffect(s, { kind: "oxAqua", x: p.x, y: p.y - 6, dirX: d[0], dirY: d[1], size: G.aqua.len, width: G.aqua.w, maxTicks: 26 });
      break;
    }
    case "amethyst": {
      const e = [...list].sort((a, b) => b.hp - a.hp || a.id - b.id)[0];
      if (!e) return;
      for (const o of inCircle(s, e.x, e.y, G.amethyst.r)) {
        if (o !== e && !isBoss(o)) {
          const v = normalize(e.x - o.x, e.y - o.y);
          if (v) [o.x, o.y] = [o.x + v[0] * G.amethyst.pull, o.y + v[1] * G.amethyst.pull];
        }
        strike(s, o, o === e ? dmg : dmg * 0.5, 0, "voidbolt");
      }
      fx(s, "oxAmeth", e.x, e.y, G.amethyst.r, 44);
      break;
    }
  }
  p.oxGems = (p.oxGems ?? 0) + 1;
}

/** 보석 일곱이 저마다 굴림 (mul: 확률 배율) → 반응한 보석 수 · 많으면 칠보 공명 */
export function rollGems(s: RunState, tag: string, mul = 1): number {
  const p = s.player;
  if (!alive(s).length) return 0;
  let lit = 0;
  let n = 0;
  ONYX_GEM_IDS.forEach((g, k) => {
    // 보석마다 따로 굴림 (같은 틱이라도 보석마다 다른 시드)
    const r = createRng(deriveSeed(s.seed, "oxRoll", tag, g, s.tick)).nextFloat();
    if (r >= gemChance(s, g) * mul) return;
    fireGem(s, g);
    lit |= 1 << k;
    n++;
  });
  if (n === 0) return 0;
  p.oxLit = lit;
  p.oxLitAt = s.tick;
  const need = hasPerk(p, "oxResonance") ? K.oxResonance.need : O.resonNeed;
  if (n >= need) resonate(s);
  return n;
}

/** 칠보 공명: 방 안 모든 적에게 일곱 빛 폭발 + 기절 */
function resonate(s: RunState): void {
  const p = s.player;
  p.oxResons = (p.oxResons ?? 0) + 1;
  for (const e of alive(s)) {
    strike(s, e, power(s) * O.resonMul, 0, "radiance");
    stun(e, O.resonStun);
  }
  fx(s, "oxReson", p.x, p.y - 8, 180, 60);
}
