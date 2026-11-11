// 아수라(실베르): 누르면 바라보는 쪽 앞을 귀신 주먹으로 넓게 침 (피해는 약함) · 공격마다 전용 아이템 기술 (sim/asMoves)
// 분쇄·악귀는 sim/asHit · 아수라 각성(필살기)은 sim/asAwake · 귀진: 몸 둘레 영역 안 적에게 표식(받는 피해 증가, classTaken)
import { ASURA_PERKS as K } from "../itemsAsura";
import { ASURA_FIST as F } from "../weaponsAsura";
import { awakeStrike, awakeTick } from "./asAwake";
import { splitTick } from "./asHit";
import { asFieldR, hasAs } from "./asKit";
import { movesTick, punch } from "./asMoves";
import { alive } from "./shadowingSpirits";
import type { RunState } from "./types";

type P = RunState["player"];

export { asFieldR, asMarked, isAsura } from "./asKit";

const roomKey = (s: RunState) => s.floor * 1000 + s.roomId;

/** 귀진: 영역 안 적에게 표식 */
function fieldTick(s: RunState): void {
  const p = s.player;
  if (!hasAs(p, "asField")) return;
  const r = asFieldR(p);
  for (const e of s.enemies) if (alive(e) && (e.x - p.x) ** 2 + (e.y - p.y) ** 2 <= (r + e.r) ** 2) e.asMark = s.tick;
}

/** 틱마다 (아수라 맨손을 들었을 때 player에서) */
export function asuraTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  const key = roomKey(s);
  if (p.asRoom !== key) {
    p.asRoom = key;
    p.asSplit = [];
    p.asRapids = [];
    p.asFists = [];
    p.asWaves = [];
    delete p.asPound;
  }
  // 수라장: 잠깐 안 맞히면 사라짐
  if ((p.asFury ?? 0) > 0 && s.tick - (p.asFuryAt ?? 0) > K.asFury.keep) p.asFury = 0;
  const spd = speed * (1 + (p.asFury ?? 0) * K.asFury.add);
  if ((p.asCd ?? 0) > 0) p.asCd = (p.asCd ?? 0) - 1;
  if (want && (p.asCd ?? 0) <= 0) {
    p.attackCount++;
    p.asAtkAt = s.tick;
    p.asHits = (p.asHits ?? 0) + 1;
    if ((p.asAwake ?? 0) > 0) p.asCd = awakeStrike(s, spd);
    else {
      p.asCd = Math.max(6, Math.round(F.cd / Math.max(0.3, spd)));
      punch(s);
    }
  }
  // 귀신 걸음: 대시가 끝나면 다음 주먹이 크게
  const dashing = p.dashTicks > 0;
  if (p.asDash && !dashing && hasAs(p, "asStep")) p.asStepBig = true;
  p.asDash = dashing;
  fieldTick(s);
  splitTick(s);
  movesTick(s);
  awakeTick(s, spd);
}

/** 연습장 등에서 다시 시작할 때 */
export function resetAsura(p: P): void {
  for (const k of ["asCd", "asRoom", "asAtkAt", "asHits", "asSplit", "asRapids", "asFists", "asWaves", "asAwake", "asAwakeAt", "asStep", "asPound", "asPoundCd", "asFury", "asFuryAt", "asStepBig", "asDash", "asRolls"] as const) delete p[k];
}
