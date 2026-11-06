// 세레나(성국, 환혹의 무희): 비수 달린 사슬 채찍 둘이 늘 몸 둘레를 크게 돌며 적 사이를 휘저음 (낮은 피해 · 치명타 · 빛 피해 추가)
// 누르고 있으면 3연격 (채찍 휘두르기 둘 → 환혹의 회오리: 여러 사슬 채찍이 둘레를 연달아 휘저음) · 맞힌 적에 가시 → 가득 차면 마비
// 스킬 넷은 숫자 키(sim/serenaSkills) · 치명타는 sim/serenaCrit
import { TICK_RATE } from "../constants";
import { SERENA_PERKS as K } from "../itemsSerena";
import { SERENA as N } from "../weaponsSerena";
import { snHit, thornTick } from "./serenaKit";
import { charmTick, dashTick, orbTick, snSkill, whirlTick } from "./serenaSkills";
import { inCone, roomKey } from "./s2Kit";
import type { RunState } from "./types";
import { addEffect, hasPerk } from "./util";

/** 1·2타: 앞 넓은 부채꼴을 채찍으로 (k 0 오른쪽에서 · 1 왼쪽에서) */
function whip(s: RunState, k: number): void {
  const p = s.player;
  const r = N.whipR * (hasPerk(p, "snLash") ? K.snLash.r : 1);
  for (const e of inCone(s, r, N.whipCos)) snHit(s, e, N.whipMul);
  addEffect(s, { kind: "snWhipFx", x: p.x, y: p.y - 4, dirX: p.faceX, dirY: p.faceY, size: r, style: k, maxTicks: 16 });
}

/** 방이 바뀌면 회오리를 거둠 */
function roomCheck(s: RunState): void {
  const p = s.player;
  const key = roomKey(s);
  if (p.snRoom === key) return;
  p.snRoom = key;
  delete p.snWhirl;
  delete p.snWhirlAt;
}

/** 시간 재기: 대기 · 무도 · 신기루 베일 */
function timers(s: RunState): void {
  const p = s.player;
  const cd = (p.snCd ??= [0, 0, 0, 0]);
  for (let i = 0; i < cd.length; i++) if (cd[i]! > 0) cd[i]!--;
  if ((p.snUlt ?? 0) > 0 && --p.snUlt! <= 0) delete p.snUlt;
  if ((p.snMirage ?? 0) > 0 && --p.snMirage! <= 0) delete p.snMirage;
}

/** 틱마다 (채찍을 들었을 때 player에서) */
export function serenaTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  roomCheck(s);
  timers(s);
  thornTick(s);
  dashTick(s);
  charmTick(s);
  orbTick(s);
  whirlTick(s);
  if (p.trKey && p.trKey >= 1 && p.trKey <= 4) snSkill(s, p.trKey - 1);
  // 공격 대기가 끝난 뒤부터 잼 (공격 속도가 느려도 3타까지 이어지게)
  p.snGap = (p.snGap ?? 0) + (p.attackCooldown <= 0 ? 1 : 0);
  if (p.snGap > N.comboGap) p.snStep = 0;
  if (!want || p.attackCooldown > 0 || p.s2Rush) return;
  const k = p.snStep ?? 0;
  if (k < 2) whip(s, k);
  // 3타 환혹의 회오리 (끝없는 박자: 한 번 더) · 환혹의 무도 중에는 1·2타에도 한 번씩
  const whirls = k === 2 ? N.whirlN + (hasPerk(p, "snTempo") ? K.snTempo.more : 0) : (p.snUlt ?? 0) > 0 ? 1 : 0;
  if (whirls > 0) {
    p.snWhirl = (p.snWhirl ?? 0) + whirls;
    p.snWhirlAt ??= 0;
  }
  p.snStep = (k + 1) % 3;
  p.snGap = 0;
  p.attackCooldown = Math.max(1, Math.round((TICK_RATE / speed) * (N.stepTime[k] ?? 1)));
  p.attackCount++;
}

/** 연습장 등에서 다시 시작할 때 */
export function resetSerena(p: RunState["player"]): void {
  for (const k of ["snStep", "snGap", "snCd", "snWhirl", "snWhirlAt", "snUlt", "snMirage", "snRoom"] as const) delete p[k];
}

export { isSerena, serenaSkills, snOrbAt } from "./serenaKit";
