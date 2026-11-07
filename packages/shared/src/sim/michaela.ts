// 미카엘라(성국, 공허의 인도자): 누르고 있으면 그 무기의 3연격 (무기마다 다른 기술 셋, michaelaWeaponMoves · 기술 계산은 sim/michaelaMoves)
// 무기는 사용자 그림에서 잘라 낸 37개(창 21 · 검 16, michaelaWeaponList) · 무기마다 속성 8가지 중 하나 → 그 속성으로 맞힘 (sim/michaelaKit)
// 박힌 무기에 닿거나 대시로 순간 이동해 들면 그 무기의 기술 둘이 연달아 나감 (sim/michaelaSkills·michaelaKit) · 스킬 넷은 숫자 키
import { TICK_RATE } from "../constants";
import { MICHAELA as M } from "../weaponsMichaela";
import { MC_WEAPON_MOVES } from "../michaelaWeaponMoves";
import { hold, pickWeapon } from "./michaelaKit";
import { doMove, queueTick } from "./michaelaMoves";
import { mcSkill, mcTouch, mcWorld, roomRain } from "./michaelaSkills";
import { roomKey } from "./s2Kit";
import type { RunState } from "./types";

/** 방이 바뀌면 무기를 거두고 새 방에 포탈에서 무기가 쏟아짐 */
function roomCheck(s: RunState): void {
  const p = s.player;
  const key = roomKey(s);
  if (p.mcRoom === key) return;
  p.mcRoom = key;
  for (const k of ["mcBlades", "mcFalls", "mcChains", "mcUlt", "mcQueue", "mcShiftT"] as const) delete p[k];
  roomRain(s);
}

/** 시간 재기: 대기 · 콤보 유지 */
function timers(s: RunState): void {
  const p = s.player;
  // 처음에는 검 하나를 듦
  if (p.mcWeapon === undefined) hold(p, pickWeapon(s, 0, "start"));
  const cd = (p.mcCd ??= [0, 0, 0, 0]);
  for (let i = 0; i < cd.length; i++) if (cd[i]! > 0) cd[i]!--;
  if ((p.mcComboT ?? 0) > 0 && --p.mcComboT! <= 0) delete p.mcCombo;
  if ((p.mcShiftT ?? 0) > 0 && --p.mcShiftT! <= 0) delete p.mcShiftT;
}

/** 틱마다 (무기 보관소를 들었을 때 player에서) */
export function michaelaTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  roomCheck(s);
  timers(s);
  mcWorld(s);
  mcTouch(s);
  queueTick(s);
  if (p.trKey && p.trKey >= 1 && p.trKey <= 4) mcSkill(s, p.trKey - 1);
  // 공격 대기가 끝난 뒤부터 잼 (공격 속도가 느려도 3타까지 이어지게)
  p.mcGap = (p.mcGap ?? 0) + (p.attackCooldown <= 0 ? 1 : 0);
  if (p.mcGap > M.comboGap) p.mcStep = 0;
  if (!want || p.attackCooldown > 0 || p.s2Rush) return;
  const k = p.mcStep ?? 0;
  // 무한의 무기고 중에는 모든 공격이 투척
  const set = MC_WEAPON_MOVES[p.mcWeapon ?? 0] ?? MC_WEAPON_MOVES[0]!;
  doMove(s, (p.mcUlt ?? 0) > 0 ? "throw" : set.c[k]!);
  p.mcLast = { k, t: s.tick };
  p.mcStep = (k + 1) % 3;
  p.mcGap = 0;
  p.attackCooldown = Math.max(1, Math.round((TICK_RATE / speed) * (M.stepTime[k] ?? 1)));
  p.attackCount++;
}

/** 연습장 등에서 다시 시작할 때 */
export function resetMichaela(p: RunState["player"]): void {
  for (const k of ["mcStep", "mcGap", "mcLast", "mcCd", "mcWeapon", "mcHeld", "mcElem", "mcCombo", "mcComboT", "mcBlades", "mcFalls", "mcChains", "mcUlt", "mcDash", "mcRoom", "mcQueue", "mcShiftT"] as const) delete p[k];
}

export { isMichaela, michaelaSkills } from "./michaelaKit";
