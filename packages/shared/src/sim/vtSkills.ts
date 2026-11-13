// 베르 스킬(숫자 키 1~4, 처음부터 열림 · 적응력 강화에 성공하면 강화판)
// 1 부패의 꽃밭 / 사령화 조종 · 2 가시숲 강림 / 만개의 포식자 · 3 대지 부식 / 천륜 가시무 · 4 기생 덩굴 감옥 / 종언의 생명수확
import { ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "../constants";
import { VT_BASE as B, VT_LV as L, VT_SEED as SD, VT_SKILLS as K } from "../itemsVert";
import { nrAim, nrAlive, nrNearest } from "./nrKit";
import { ALL, POI, reps, vt, vtZone } from "./vert";
import { vtRaise } from "./vtPlants";
import { vtAddPlant, vtAfflict, vtRoll, vtSprout } from "./vtRot";
import { root } from "./s2Kit";
import type { RunState } from "./types";
import { addEffect } from "./util";

type P = RunState["player"];

/** 스킬 칸 차례의 수치 이름 (보통 · 강화) · 피해 출처 (화면 글자 키) */
export const VT_SKILL_IDS = [["garden", "thrall"], ["forest", "maw"], ["erode", "dance"], ["prison", "end"]] as const;
export const vtSkillSrc = (p: P, i: number) => (p.nrSkillUp?.[i] ? `k:vtSkillUp${i + 1}` : `k:vtSkill${i + 1}`);

/** 스킬 칸 넷의 남은 대기 (0~1) */
export const vtSkills = (p: P): number[] => VT_SKILL_IDS.map((ids, i) => Math.min(1, (p.nrSkillCd?.[i] ?? 0) / K[ids[p.nrSkillUp?.[i] ? 1 : 0]].cd));

/** (x, y) 둘레 r 안 살아 있는 적 */
const inside = (s: RunState, x: number, y: number, r: number) => s.enemies.filter((e) => nrAlive(e) && (e.x - x) ** 2 + (e.y - y) ** 2 <= (r + e.r) ** 2);
const seeded = (s: RunState) => s.enemies.filter((e) => nrAlive(e) && (e.vtSeed ?? 0) > 0);

/** 스킬 i(0~3) 쓰기 */
export function vtSkill(s: RunState, i: number): void {
  const p = s.player;
  const cd = (p.nrSkillCd ??= [0, 0, 0, 0]);
  const ids = VT_SKILL_IDS[i];
  if (!ids || (cd[i] ?? 0) > 0) return;
  const id = ids[p.nrSkillUp?.[i] ? 1 : 0];
  cd[i] = K[id].cd;
  const D = p.stats.damage;
  if (id === "garden") {
    // 부패의 꽃밭: 고정 + 상태이상 넷 · 서서히 매우 약한 6타
    const R = K.garden;
    const [x, y] = nrAim(s, B.aim);
    for (const e of inside(s, x, y, R.r)) root(e, R.root);
    vtZone(s, "vtGarden", x, y, R.r, R.every, reps(R.hits, D * L.vweak), ALL);
  } else if (id === "thrall") {
    // 사령화 조종: 둘레에 독 · 쓰러진 적을 덩굴 인형으로
    const R = K.thrall;
    for (const e of inside(s, p.x, p.y, R.r)) vtAfflict(s, e, { poi: true });
    vtRaise(s);
    addEffect(s, { kind: "vtThrall", x: p.x, y: p.y, dirX: 0, dirY: 0, size: R.r * 0.7, maxTicks: 50 });
  } else if (id === "forest") {
    const R = K.forest;
    const [x, y] = nrAim(s, B.aim);
    vtZone(s, "vtForest", x, y, R.r, R.every, reps(R.hits, D * L.strong), vt({ poi: true, slow: R.slow }));
  } else if (id === "maw") {
    // 만개의 포식자: 마우스 자리에 꽃 (최대 3, 넘으면 오래된 것부터)
    const R = K.maw;
    const [x, y] = nrAim(s, B.aim);
    vtAddPlant(s, "maw", x, y, R.life, R.max);
    addEffect(s, { kind: "vtSprout", x, y, dirX: 0, dirY: 0, size: R.r, maxTicks: 20 });
  } else if (id === "erode") {
    // 대지 부식: 방 아무 곳 세 자리 (피해·고정은 vtPlants)
    const R = K.erode;
    for (let n = 0; n < R.n; n++) {
      const x = ROOM_MIN_X + R.r + (ROOM_MAX_X - ROOM_MIN_X - R.r * 2) * vtRoll(s, "vtErodeX");
      const y = ROOM_MIN_Y + R.r + (ROOM_MAX_Y - ROOM_MIN_Y - R.r * 2) * vtRoll(s, "vtErodeY");
      vtAddPlant(s, "erode", x, y, R.life, R.n);
      addEffect(s, { kind: "vtErode", x, y, dirX: 0, dirY: 0, size: R.r, maxTicks: R.life });
    }
  } else if (id === "dance") {
    // 천륜 가시무: 가까운 적에게 돌진 → 몸 둘레 4 → 8 → 32 → 2타
    const R = K.dance;
    const e = nrNearest(s, p.x, p.y, B.aim, p.faceX, p.faceY);
    const [tx, ty] = e ? [e.x, e.y] : [p.x + p.faceX * B.aim * 0.6, p.y + p.faceY * B.aim * 0.6];
    p.nrRush = { dx: p.faceX, dy: p.faceY, t: 40, step: R.step, dmg: D * L.weak, hit: [], sx: p.x, sy: p.y, fx: "vtPop", on: POI, path: [[tx, ty]] };
    const [a, b, c, d] = R.counts as unknown as [number, number, number, number];
    const dmgs = [...reps(a, D * L.weak), ...reps(b, D * L.vweak), ...reps(c, D * L.vvweak), ...reps(d, D * L.strong)];
    vtZone(s, "vtDance", p.x, p.y, R.r, R.every, dmgs, vt({ poi: true, bleed: true, burn: true }), { follow: true });
  } else if (id === "prison") {
    // 기생 덩굴 감옥: 씨앗이 있는 적 모두 바로 발아 + 고정
    for (const e of seeded(s)) {
      root(e, K.prison.root);
      addEffect(s, { kind: "vtPrison", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 30, maxTicks: K.prison.root });
      vtSprout(s, e);
    }
  } else {
    // 종언의 생명수확: 씨앗 가득 → 다섯 겹 발아 · 쓰러지면 시든 육신
    addEffect(s, { kind: "vtEnd", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 150, maxTicks: 60 });
    for (const e of seeded(s)) {
      e.vtSeed = SD.max;
      vtSprout(s, e, 1, { fx: "vtWither", vineOnKill: true });
    }
  }
}
