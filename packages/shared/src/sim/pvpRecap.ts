// 패왕전 받은 피해 정리 (쓰러졌을 때 화면이 보여 줌): 누가 · 무엇으로(평타·스킬 1~4·소환·지속 피해) · 합 · 가장 큰 한 방
// 그림자 적이 맞을 때 날것 피해를 적어 두고(logHit), 사람에게 넘길 때(transfer) 실제로 줄어든 체력을 그 비율로 나눔
import { seatNo } from "./party";
import type { EnemyState, RunState } from "./types";

/** 피해 출처: 0 평타 · 1~4 스킬 · 5 소환한 것 · 6 지속 피해(독·불) */
export const PW_SRC_SUMMON = 5;
export const PW_SRC_DOT = 6;

/** 그림자 적이 맞음 (지금 자리 = 때린 사람, 출처는 pv.src) */
export function logHit(s: RunState, e: EnemyState, amt: number): void {
  const pv = s.pvp;
  if (!pv || amt <= 0) return;
  const to = pv.proxies.indexOf(e);
  if (to >= 0) (pv.hits ??= []).push({ to, by: seatNo(s), src: pv.src ?? 0, amt });
}

/** i번 자리가 잃은 체력 lost를 이번 틱에 때린 것들에 나눠 적음 (적힌 게 없으면 마지막으로 때린 사람의 지속 피해) */
export function recapTake(s: RunState, i: number, lost: number, lastHit: number | undefined): void {
  const pv = s.pvp!;
  let hs = (pv.hits ?? []).filter((h) => h.to === i && h.by !== i);
  if (!hs.length && lastHit !== undefined && lastHit !== i) hs = [{ to: i, by: lastHit, src: PW_SRC_DOT, amt: 1 }];
  const sum = hs.reduce((a, h) => a + h.amt, 0);
  if (lost <= 0 || sum <= 0) return;
  const recv = (pv.seats[i]!.recv ??= []);
  for (const h of hs) {
    const d = (lost * h.amt) / sum;
    let r = recv.find((x) => x.by === h.by && x.src === h.src);
    if (!r) recv.push((r = { by: h.by, src: h.src, dmg: 0, max: 0 }));
    r.dmg += d;
    r.max = Math.max(r.max, d);
  }
}
