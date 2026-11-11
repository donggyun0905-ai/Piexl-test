// 패왕전 받은 피해 정리 (쓰러졌을 때 화면이 보여 줌): 누가 · 무엇으로(평타·스킬 1~4·소환·지속 피해·지형) · 합 · 가장 큰 한 방 · 준 피해 · 받은 회복
// 그림자 적이 맞을 때 날것 피해를 적어 두고(logHit), 사람에게 넘길 때(transfer) 실제로 줄어든 체력을 그 비율로 나눔
import { raidLogHit } from "./raidStats";
import { seatNo } from "./party";
import { logDmg } from "./dmgSrc";
import type { EnemyState, RunState } from "./types";

/** 피해 출처: 0 평타 · 1~4 스킬 · 5 소환한 것 · 6 지속 피해(독·불) · 7 지형(함정·용암·가시, 때린 사람 -1) */
export const PW_SRC_SUMMON = 5;
export const PW_SRC_DOT = 6;
export const PW_SRC_ENV = 7;

type Seat = NonNullable<RunState["pvp"]>["seats"][number];

function addRecv(seat: Seat, by: number, src: number, d: number): void {
  const recv = (seat.recv ??= []);
  let r = recv.find((x) => x.by === by && x.src === src);
  if (!r) recv.push((r = { by, src, dmg: 0, max: 0 }));
  r.dmg += d;
  r.max = Math.max(r.max, d);
}

/** 지형 피해: 맞기 전 체력 before와 지금 자리의 체력 차이를 적음 (damagePlayer 바로 뒤에 부름) */
export function recapEnv(s: RunState, before: number): void {
  const lost = before - Math.max(0, s.player.hp);
  if (s.pvp && lost > 0) addRecv(s.pvp.seats[seatNo(s)]!, -1, PW_SRC_ENV, lost);
}

/** 받은 회복 (seat: 회복한 자리, 실제로 늘어난 체력) */
export function recapHeal(s: RunState, seat: number, amt: number): void {
  const x = s.pvp?.seats[seat];
  if (!x || amt <= 0) return;
  x.healed = (x.healed ?? 0) + amt;
  x.healAll = (x.healAll ?? 0) + amt;
}

/** 그림자 적이 맞음 (지금 자리 = 때린 사람, 출처는 pv.src) */
export function logHit(s: RunState, e: EnemyState, amt: number): void {
  logDmg(s, e, amt);
  if (s.raidBoss) return raidLogHit(s, e, amt);
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
  for (const h of hs) {
    const d = (lost * h.amt) / sum;
    addRecv(pv.seats[i]!, h.by, h.src, d);
    // 때린 사람 쪽: 다시 나온 뒤 상대마다 준 피해
    const gave = (pv.seats[h.by]!.gave ??= []);
    const g = gave.find((x) => x.to === i);
    if (g) g.dmg += d;
    else gave.push({ to: i, dmg: d });
  }
}

/** 다시 나오거나 다음 판: 정리를 지움 */
export function recapReset(seat: Seat): void {
  seat.recv = seat.gave = seat.healed = undefined;
}
