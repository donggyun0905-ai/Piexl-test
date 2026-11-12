// 아리아 기본 패시브 여덟 음표 터짐: 방에 서로 다른 음표 8개가 모이면 종류마다 하나씩(가장 오래된 것) 저마다 다른 색으로 크게 터짐
// 악기 넷(피아노·하프·호른·클라리넷)이 다 놓여 있으면 악보 완성 시작 (sim/arFinale) · 앙코르: 잠시 뒤 같은 자리에서 한 번 더
import { ARIA_PERKS as K } from "../itemsAria";
import { AR_NOTE as N } from "../weaponsAria";
import { startFinale } from "./arFinale";
import { arArea as arArea_, hasAr, styleOf } from "./arKit";
import { srcFn, srcRun, srcEach } from "./dmgSrc";
import type { RunState } from "./types";
import { reachOf } from "./util";

const arArea = srcFn("arBurst", () => arArea_);

/** 악기 넷이 모두 놓여 있는지 */
export const allInstruments = (s: RunState) => [0, 1, 2, 3].every((k) => (s.player.arInst ?? []).some((i) => i.kind === k));

/** 서로 다른 음표 8개가 모였으면 터짐 */
export function checkBurst(s: RunState): void {
  const p = s.player;
  const notes = p.arNotes ?? [];
  if (notes.length < N.kinds) return;
  const pick = new Map<number, (typeof notes)[number]>();
  for (const n of notes) if (!pick.has(n.kind)) pick.set(n.kind, n);
  if (pick.size < N.kinds) return;
  const used = new Set(pick.values());
  p.arNotes = notes.filter((n) => !used.has(n));
  p.arBursts = (p.arBursts ?? 0) + 1;
  const r = N.burstR * reachOf(p) * (hasAr(p, "arForte") ? K.arForte.burst : 1);
  const dmg = p.stats.damage * N.burstMul * styleOf(p).burst;
  for (const n of used) {
    arArea(s, n.x, n.y, r, dmg, "arBurst", n.kind, 36);
    if (hasAr(p, "arEncore")) srcRun(s, "arEncore", () => { (p.arEchoes ??= []).push({ x: n.x, y: n.y, r, dmg: dmg * K.arEncore.mul, kind: n.kind, t: K.arEncore.delay }); });
  }
  if (allInstruments(s)) startFinale(s);
}

/** 앙코르: 기다렸다가 다시 터짐 */
export function burstTick(s: RunState): void {
  const p = s.player;
  if (!p.arEchoes?.length) return;
  for (const e of srcEach(p.arEchoes)) if (--e.t <= 0) srcRun(s, "arEncore", () => arArea_(s, e.x, e.y, e.r, e.dmg, "arEncore", e.kind, 30));
  p.arEchoes = p.arEchoes.filter((e) => e.t > 0);
}
