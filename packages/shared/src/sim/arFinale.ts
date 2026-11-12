// 아리아 악보 완성 (궁극기): 악기 넷이 모두 놓인 채 여덟 음표가 터지면 10초 동안 방 전체에 저마다 다른 색 폭죽이 쉬지 않고 터짐
// 폭죽 자리: 일부는 적을 노리고 나머지는 방 어딘가 · 끝나면 잠시 쉼(AR_FINALE.rest) · 앙코르면 더 길게
import { ARIA_PERKS as K } from "../itemsAria";
import { AR_FINALE as F, AR_NOTE as N } from "../weaponsAria";
import { arAlive, arArea as arArea_, arRng, arSpot, hasAr } from "./arKit";
import { srcFn } from "./dmgSrc";
import type { RunState } from "./types";
import { addEffect } from "./util";

const arArea = srcFn("arFinale", () => arArea_);

/** 악보 완성 시작 (이미 하는 중이거나 쉬는 중이면 안 함) */
export function startFinale(s: RunState): void {
  const p = s.player;
  if ((p.arFinale ?? 0) > 0 || (p.arFinaleReady ?? 0) > s.tick) return;
  p.arFinale = F.ticks + (hasAr(p, "arEncore") ? K.arEncore.finale : 0);
  addEffect(s, { kind: "arFinale", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 0, maxTicks: 90 });
}

/** 틱마다: 몇 틱마다 폭죽 여럿 */
export function finaleTick(s: RunState): void {
  const p = s.player;
  if ((p.arFinale ?? 0) <= 0) return;
  p.arFinale = (p.arFinale ?? 0) - 1;
  if (p.arFinale <= 0) {
    delete p.arFinale;
    p.arFinaleReady = s.tick + F.rest;
    return;
  }
  if (p.arFinale % F.every) return;
  const foes = s.enemies.filter(arAlive);
  for (let i = 0; i < F.n; i++) {
    const rng = arRng(s, "arBoom");
    const aim = foes.length > 0 && rng.nextFloat() < F.aim;
    const kind = Math.floor(rng.nextFloat() * N.kinds);
    let [x, y] = arSpot(s, "arBoomAt", F.r * 0.5);
    if (aim) {
      const e = foes[Math.floor(rng.nextFloat() * foes.length)]!;
      [x, y] = [e.x + (rng.nextFloat() - 0.5) * F.r, e.y + (rng.nextFloat() - 0.5) * F.r];
    }
    arArea(s, x, y, F.r, p.stats.damage * F.mul, "arBoom", kind, 34);
  }
  p.arBoomAt = s.tick;
}
