// 마젠타 스킬(숫자 키 1~4, 처음부터 열림 · 적응력 강화에 성공하면 강화판)
// 1 환상의 꽃감옥 / 환영 붕괴 · 2 악몽의 꽃밭 / 영혼 유린 · 3 유혹의 소용돌이 / 매혹의 강우 · 4 독화 침식 / 종언의 푸시아 성역
import { MZ_HEX as H, MZ_LV as L, MZ_SKILLS as K } from "../itemsMagenta";
import { hex, mzAim, mzScent, mzZone, reps } from "./magenta";
import { mzBurst, mzCharm, mzHexAdd } from "./mzHex";
import { nrAlive, nrArea } from "./nrKit";
import { ashFxLen, nrVolley } from "./nrVolley";
import { root } from "./s2Kit";
import type { RunState } from "./types";
import { addEffect } from "./util";

type P = RunState["player"];
/** 방 전체 반지름 */
const ALL = 4000;

/** 스킬 칸 차례의 수치 이름 (보통 · 강화) · 피해 출처 (화면 글자 키) */
export const MZ_SKILL_IDS = [["prison", "collapse"], ["garden", "soul"], ["vortex", "rain"], ["erode", "end"]] as const;
export const mzSkillSrc = (p: P, i: number) => (p.nrSkillUp?.[i] ? `k:mzSkillUp${i + 1}` : `k:mzSkill${i + 1}`);

/** 스킬 칸 넷의 남은 대기 (0~1) */
export const mzSkills = (p: P): number[] => MZ_SKILL_IDS.map((ids, i) => Math.min(1, (p.nrSkillCd?.[i] ?? 0) / K[ids[p.nrSkillUp?.[i] ? 1 : 0]].cd));

/** (x, y) 둘레 r 안 살아 있는 적 */
const inside = (s: RunState, x: number, y: number, r: number) => s.enemies.filter((e) => nrAlive(e) && (e.x - x) ** 2 + (e.y - y) ** 2 <= (r + e.r) ** 2);

/** 스킬 i(0~3) 쓰기 */
export function mzSkill(s: RunState, i: number): void {
  const p = s.player;
  const cd = (p.nrSkillCd ??= [0, 0, 0, 0]);
  const ids = MZ_SKILL_IDS[i];
  if (!ids || (cd[i] ?? 0) > 0) return;
  const id = ids[p.nrSkillUp?.[i] ? 1 : 0];
  cd[i] = K[id].cd;
  const D = p.stats.damage;
  if (id === "prison") {
    // 환상의 꽃감옥: 묶고 매혹 + 약한 8타
    const R = K.prison;
    const [x, y] = mzAim(s);
    for (const e of inside(s, x, y, R.r)) root(e, R.root);
    mzZone(s, "mzPrison", x, y, R.r, R.every, reps(R.hits, D * L.weak), hex(1, true));
  } else if (id === "collapse") {
    // 환영 붕괴: 보통 1타(저주 1겹) → 범위 안 적의 저주를 2배로 터뜨림
    const R = K.collapse;
    const [x, y] = mzAim(s);
    nrArea(s, x, y, R.r, D * L.mid, undefined, hex());
    for (const e of inside(s, x, y, R.r)) mzBurst(s, e, R.burstMul);
    addEffect(s, { kind: "mzCollapse", x, y, dirX: 0, dirY: 0, size: R.r, maxTicks: 30 });
  } else if (id === "garden") {
    const R = K.garden;
    mzZone(s, "mzGarden", p.x, p.y, R.r, R.every, reps(R.hits, D * L.vweak), hex());
    for (let n = 0; n < R.scents; n++) mzScent(s, true);
  } else if (id === "soul") {
    // 영혼 유린: 앞으로 천천히 날아가는 저주 구체
    const R = K.soul;
    nrVolley(s, { kind: "mzSoul", x: p.x, y: p.y, r: R.r, dmg: 0, dmgs: reps(R.hits, D * L.weak), n: R.hits, every: R.every, fin: D * L.strong, pull: R.pull, on: hex(), vel: [p.faceX * R.speed, p.faceY * R.speed] });
    addEffect(s, { kind: "mzSoul", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: R.r, maxTicks: ashFxLen(R.hits + 1, R.every) });
  } else if (id === "vortex") {
    const R = K.vortex;
    const [x, y] = mzAim(s);
    mzZone(s, "mzVortex", x, y, R.r, R.every, reps(R.hits, D * L.vweak), hex(), D * L.strong, R.pull);
    for (const e of inside(s, x, y, R.r)) mzCharm(s, e);
  } else if (id === "rain") {
    // 매혹의 강우: 방 전체 매혹 + 약한 12타
    const R = K.rain;
    for (const e of inside(s, p.x, p.y, ALL)) mzCharm(s, e);
    nrVolley(s, { kind: "mzStorm", x: p.x, y: p.y, r: ALL, dmg: 0, dmgs: reps(R.hits, D * L.weak), n: R.hits, every: R.every, on: hex() });
    addEffect(s, { kind: "mzStorm", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 90, maxTicks: ashFxLen(R.hits, R.every) });
  } else if (id === "erode") {
    // 독화 침식: 세 겹이 차례로 퍼짐 (저주 2겹씩)
    const R = K.erode;
    R.rs.forEach((r, n) => nrVolley(s, { kind: "mzErode", x: p.x, y: p.y, r, dmg: 0, dmgs: reps(R.hits, D * L.weak), n: R.hits, every: R.every, on: hex(2) }, n * R.gap));
    addEffect(s, { kind: "mzErode", x: p.x, y: p.y, dirX: 0, dirY: 0, size: R.rs[R.rs.length - 1]!, maxTicks: ashFxLen(R.hits, R.every, (R.rs.length - 1) * R.gap) });
  } else {
    // 종언의 푸시아 성역: 방 전체 매혹 + 저주 가득 → 약한 20타 → 저주 3배 터뜨리기 + 강한 1타
    const R = K.end;
    for (const e of inside(s, p.x, p.y, ALL)) {
      mzCharm(s, e);
      mzHexAdd(s, e, H.max);
    }
    nrVolley(s, { kind: "mzEnd", x: p.x, y: p.y, r: ALL, dmg: 0, dmgs: reps(R.hits, D * L.weak), n: R.hits, every: R.every, fin: D * L.strong, on: hex() });
    p.mzEndAt = s.tick + (R.hits - 1) * R.every;
    addEffect(s, { kind: "mzEnd", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 150, maxTicks: ashFxLen(R.hits + 1, R.every) });
  }
}

/** 틱마다: 종언의 푸시아 성역 마지막 한 방 때 방 전체 저주를 3배로 터뜨림 */
export function mzEndTick(s: RunState): void {
  const p = s.player;
  if (p.mzEndAt === undefined || p.mzEndAt > s.tick) return;
  delete p.mzEndAt;
  for (const e of inside(s, p.x, p.y, ALL)) mzBurst(s, e, K.end.burstMul);
}
