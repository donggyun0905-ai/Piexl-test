// 존 스킬(숫자 키 1~4, 처음부터 열림 · 적응력 강화에 성공하면 강화판)
// 1 황금 뇌구 / 광란의 천뢰 · 2 혼돈의 낙뢰 / 초월 벽력일섬 · 3 뇌신의 손아귀 / 황뢰 천수 · 4 천둥의 발자취 / 종언의 황천뢰
import { ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "../constants";
import { JN_BASE as B, JN_LV as L, JN_SKILLS as K } from "../itemsJaune";
import { jnAhead, jnLine, reps, ZAP } from "./jaune";
import { nrAim, nrAlive, nrHit } from "./nrKit";
import { nrVolley } from "./nrVolley";
import type { RunState } from "./types";
import { addEffect } from "./util";

type P = RunState["player"];

/** 스킬 칸 차례의 수치 이름 (보통 · 강화) · 피해 출처 (화면 글자 키) */
export const JN_SKILL_IDS = [["orb", "frenzy"], ["chaos", "beam"], ["hand", "thousand"], ["step", "end"]] as const;
export const jnSkillSrc = (p: P, i: number) => (p.nrSkillUp?.[i] ? `k:jnSkillUp${i + 1}` : `k:jnSkill${i + 1}`);

/** 스킬 칸 넷의 남은 대기 (0~1) */
export const jnSkills = (p: P): number[] => JN_SKILL_IDS.map((ids, i) => Math.min(1, (p.nrSkillCd?.[i] ?? 0) / K[ids[p.nrSkillUp?.[i] ? 1 : 0]].cd));

/** 앞으로 날아가는 번개 구체 (둘레를 나눠 때림) */
function orb(s: RunState, kind: "jnOrb" | "jnFrenzy", r: number, speed: number, every: number, dmgs: number[]): void {
  const p = s.player;
  nrVolley(s, { kind, x: p.x, y: p.y, r, dmg: 0, dmgs, n: dmgs.length, every, on: ZAP, vel: [p.faceX * speed, p.faceY * speed] });
  addEffect(s, { kind, x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: r, maxTicks: dmgs.length * every + 12 });
}

/** 천둥의 발자취 그림(시트 둘째 칸)의 지그재그 꺾이는 자리: 그림 너비에 대한 비율 (앞 쪽 u · 옆 v, 그림 가운데 0) */
const ZIG: readonly [number, number][] = [[-0.326, 0.003], [-0.24, -0.2], [-0.144, 0.134], [0.017, -0.231], [0.142, 0.212], [0.273, -0.111]];

/** 지그재그 길: 첫 자리가 (x, y)가 되게 그림 가운데를 정함 → 그림 가운데 · 지나갈 자리들 (방 안으로) */
export function zigPath(x: number, y: number, fx: number, fy: number, size: number): [number, number, [number, number][]] {
  // 그림 아래쪽 = 바라보는 쪽, 그림 오른쪽 = (fy, -fx) (화면 render/jauneFx와 같은 회전)
  const at = ([u, v]: readonly [number, number]): [number, number] => [(u * fx + v * fy) * size, (u * fy - v * fx) * size];
  const [ox, oy] = at(ZIG[0]!);
  const [cx, cy] = [x - ox, y - oy];
  const path = ZIG.slice(1).map((z): [number, number] => {
    const [dx, dy] = at(z);
    return [Math.max(ROOM_MIN_X + 12, Math.min(ROOM_MAX_X - 12, cx + dx)), Math.max(ROOM_MIN_Y + 12, Math.min(ROOM_MAX_Y - 12, cy + dy))];
  });
  return [cx, cy, path];
}

/** 스킬 i(0~3) 쓰기 */
export function jnSkill(s: RunState, i: number): void {
  const p = s.player;
  const cd = (p.nrSkillCd ??= [0, 0, 0, 0]);
  const ids = JN_SKILL_IDS[i];
  if (!ids || (cd[i] ?? 0) > 0) return;
  const id = ids[p.nrSkillUp?.[i] ? 1 : 0];
  cd[i] = K[id].cd;
  const D = p.stats.damage;
  if (id === "orb") {
    const R = K.orb;
    orb(s, "jnOrb", R.r, R.speed, R.every, [...reps(R.hits, D * L.weak), ...reps(R.tail, D * L.vweak)]);
  } else if (id === "frenzy") {
    const R = K.frenzy;
    orb(s, "jnFrenzy", R.r, R.speed, R.every, [D * L.strong, ...reps(R.hits, D * L.weak)]);
  } else if (id === "chaos") {
    const R = K.chaos;
    const [x, y] = nrAim(s, B.aim);
    const dmgs = [...reps(R.hits, D * L.weak), ...reps(R.fin, D * L.strong)];
    nrVolley(s, { kind: "jnChaos", x, y, r: R.r, dmg: 0, dmgs, n: dmgs.length, every: R.every, on: ZAP });
    addEffect(s, { kind: "jnChaos", x, y, dirX: 0, dirY: 0, size: R.r, style: R.hits * R.every, maxTicks: dmgs.length * R.every + 24 });
  } else if (id === "beam") {
    jnLine(s, "jnBeam", K.beam, reps(K.beam.hits, D * L.mid), D * L.strong);
  } else if (id === "hand") {
    const R = K.hand;
    jnAhead(s, "jnHand", R.ahead, R.r, R.every, reps(R.hits, D * L.weak), D * L.strong, R.pull);
  } else if (id === "thousand") {
    const R = K.thousand;
    jnAhead(s, "jnThousand", R.ahead, R.r, R.every, [...reps(R.mid, D * L.mid), ...reps(R.weak, D * L.weak), ...reps(R.vweak, D * L.vweak)], D * L.strong);
  } else if (id === "step") {
    // 천둥의 발자취: 이펙트 그림의 지그재그 길을 따라 돌진(닿은 적 약한 1타, 무적) + 돌진 중 몸 둘레 약한 6타 · 지나간 길에 매우 약한 70타
    const R = K.step;
    const [cx, cy, path] = zigPath(p.x, p.y, p.faceX, p.faceY, R.size);
    p.nrRush = { dx: p.faceX, dy: p.faceY, t: 90, step: R.step, dmg: D * L.weak, hit: [], sx: p.x, sy: p.y, fx: "jnPop", on: ZAP, path };
    nrVolley(s, { kind: "jnStep", x: p.x, y: p.y, r: R.r, dmg: D * L.weak, n: R.hits - 1, every: R.every, follow: true, on: ZAP });
    nrVolley(s, { kind: "jnStep", x: cx, y: cy, r: R.tailR, dmg: D * L.vweak, n: R.tail, every: 1, on: ZAP });
    addEffect(s, { kind: "jnStep", x: cx, y: cy, dirX: p.faceX, dirY: p.faceY, size: R.size, maxTicks: R.tail + 12 });
  } else {
    // 종언의 황천뢰: 구체를 쏨 → 처음 닿은 적 자리에서 (jnBoltTick)
    const R = K.end;
    (p.jnBolts ??= []).push({ x: p.x + p.faceX * 10, y: p.y + p.faceY * 10, dx: p.faceX, dy: p.faceY, left: R.range });
  }
}

/** 틱마다: 종언의 구체가 날아가 처음 닿은 적에게 번개 1타 → 그 자리에서 약한 7 · 보통 7 · 강한 1 + 매우매우 약한 70타 · 벽·거리 끝에서 사라짐 */
export function jnBoltTick(s: RunState): void {
  const p = s.player;
  if (!p.jnBolts?.length) return;
  const R = K.end;
  const D = p.stats.damage;
  for (const b of p.jnBolts) {
    b.x += b.dx * R.speed;
    b.y += b.dy * R.speed;
    b.left -= R.speed;
    const e = s.enemies.find((f) => nrAlive(f) && (f.x - b.x) ** 2 + (f.y - b.y) ** 2 <= (R.r + f.r) ** 2);
    const wall = b.x < ROOM_MIN_X || b.x > ROOM_MAX_X || b.y < ROOM_MIN_Y || b.y > ROOM_MAX_Y;
    if (!e && !wall && b.left > 0) continue;
    b.left = 0;
    if (!e) continue;
    nrHit(s, e, D * L.mid, ZAP);
    const dmgs = [...reps(7, D * L.weak), ...reps(7, D * L.mid), D * L.strong];
    nrVolley(s, { kind: "jnEnd", x: e.x, y: e.y, r: R.boom, dmg: 0, dmgs, n: dmgs.length, every: R.every, on: ZAP }, R.every);
    nrVolley(s, { kind: "jnEnd", x: e.x, y: e.y, r: R.boom, dmg: D * L.tiny, n: R.tail, every: 1, on: ZAP }, R.every);
    addEffect(s, { kind: "jnEnd", x: e.x, y: e.y, dirX: 0, dirY: 0, size: R.boom, maxTicks: Math.max(dmgs.length * R.every, R.tail) + 16 });
  }
  p.jnBolts = p.jnBolts.filter((b) => b.left > 0);
}
