// 유리엘 스킬 넷(1 정화의 빛 · 2 집행의 철퇴 · 3 수호 결계 · 4 성녀의 단죄) · 결계 · 날아가는 철퇴 · 내리꽂힘 (sim/yuriel에서 부름)
import { YURIEL_PERKS as K } from "../itemsYuriel";
import { YURIEL as Y } from "../weaponsYuriel";
import { addSin, isYuriel, wardR, wards, yrCooldown, yrHeal, yrHit } from "./yurielKit";
import { alive, inCircle, isBoss, stun } from "./s2Kit";
import type { RunState } from "./types";
import { addEffect, hasPerk } from "./util";

/** 1 정화의 빛: 수정구의 성수가 둘레로 퍼짐 (빛 피해 · 단죄 +2) · 체력 회복 */
function holyLight(s: RunState): void {
  const p = s.player;
  const r = Y.lightR * (hasPerk(p, "yrOrb") ? K.yrOrb.r : 1);
  for (const e of inCircle(s, p.x, p.y, r)) yrHit(s, e, Y.lightMul, 6, Y.lightSin, true);
  yrHeal(s, Y.lightHeal);
  addEffect(s, { kind: "yrLightFx", x: p.x, y: p.y, dirX: 0, dirY: 0, size: r, maxTicks: 30 });
  addEffect(s, { kind: "yrHealFx", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 20, maxTicks: 30 });
}

/** 2 집행의 철퇴: 사슬 철퇴를 앞으로 던짐 (떨어지면 끌어당기고 기절) */
function throwMace(s: RunState): void {
  const p = s.player;
  const r = Y.maceR * (hasPerk(p, "yrVerdict") ? K.yrVerdict.r : 1);
  const x = p.x + p.faceX * Y.maceAt;
  const y = p.y + p.faceY * Y.maceAt;
  p.yrMace = { x, y, t: Y.maceDelay, r };
  addEffect(s, { kind: "yrMaceFx", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: r, toX: x, toY: y, maxTicks: Y.maceDelay });
}

/** 스킬 키 (1~4) */
export function yrSkill(s: RunState, i: number): void {
  const p = s.player;
  const cd = (p.yrCd ??= [0, 0, 0, 0]);
  if ((cd[i] ?? 0) > 0 || (p.yrUlt ?? 0) > 0) return;
  cd[i] = yrCooldown(p, i);
  if (i === 0) holyLight(s);
  else if (i === 1) throwMace(s);
  else if (i === 2) {
    const r = wardR(p, Y.wardR);
    p.yrWard = { x: p.x, y: p.y, r, t: Y.wardTicks + (hasPerk(p, "yrVigil") ? K.yrVigil.more : 0) };
    addEffect(s, { kind: "yrWardFx", x: p.x, y: p.y, dirX: 0, dirY: 0, size: r, maxTicks: 30 });
  } else {
    // 4 성녀의 단죄: 하늘에서 빛의 철퇴를 불러 내리꽂음 (모으는 동안 무적)
    p.yrUlt = Y.ultDelay;
    addEffect(s, { kind: "yrUltFx", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 60, maxTicks: Y.ultDelay });
  }
}

/** 철퇴가 땅에 떨어짐: 둘레 적을 끌어당겨 치고 기절 · 단죄 +2 */
export function maceTick(s: RunState): void {
  const p = s.player;
  const m = p.yrMace;
  if (!m || --m.t > 0) return;
  delete p.yrMace;
  const stunT = Math.round(Y.maceStun * (hasPerk(p, "yrVerdict") ? K.yrVerdict.stun : 1));
  for (const e of inCircle(s, m.x, m.y, m.r)) {
    if (!isBoss(e)) {
      const d = Math.hypot(p.x - e.x, p.y - e.y) || 1;
      const k = Math.min(Y.macePull, Math.max(0, d - p.r - e.r - 4));
      e.x += ((p.x - e.x) / d) * k;
      e.y += ((p.y - e.y) / d) * k;
    }
    yrHit(s, e, Y.maceMul, 0, Y.maceSin);
    stun(e, stunT);
  }
  addEffect(s, { kind: "yrSlamFx", x: m.x, y: m.y, dirX: 0, dirY: 0, size: m.r, maxTicks: 26 });
}

/** 결계 한 틱: 수호 결계 줄어듦 · 안에 있으면 1초마다 회복 · 안의 적은 느려지고 가끔 빛 피해 */
export function wardTick(s: RunState): void {
  const p = s.player;
  if (p.yrWard && --p.yrWard.t <= 0) delete p.yrWard;
  if ((p.yrSaint ?? 0) > 0) p.yrSaint!--;
  const list = wards(p);
  if (!list.length) return;
  if (s.tick % 60 === 0 && list.some((w) => Math.hypot(p.x - w.x, p.y - w.y) <= w.r)) yrHeal(s, Y.wardHeal);
  const every = Math.max(1, Math.round(Y.wardEvery * (hasPerk(p, "yrThorn") ? K.yrThorn.every : 1)));
  const pulse = s.tick % every === 0;
  for (const e of alive(s)) {
    if (!list.some((w) => Math.hypot(e.x - w.x, e.y - w.y) <= w.r)) continue;
    if (!isBoss(e)) e.slowTicks = Math.max(e.slowTicks ?? 0, 6);
    if (pulse) yrHit(s, e, Y.wardMul, 0, 0, true);
  }
}

/** 성녀의 단죄 한 틱: 다 모으면 방의 모든 적에게 빛의 철퇴 (단죄 가득 → 정화) · 크게 회복 · 성녀 강림 */
export function ultTick(s: RunState): void {
  const p = s.player;
  if (!(p.yrUlt ?? 0) || !isYuriel(p)) return;
  p.invulnTicks = Math.max(p.invulnTicks, 2);
  if (--p.yrUlt! > 0) return;
  delete p.yrUlt;
  const heaven = hasPerk(p, "yrHeaven");
  for (const e of alive(s)) {
    yrHit(s, e, Y.ultMul * (heaven ? K.yrHeaven.mul : 1), 0, 0, true);
    addSin(s, e, Y.sinMax);
    addEffect(s, { kind: "yrHolyFx", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 14, maxTicks: 30 });
  }
  yrHeal(s, Y.ultHeal);
  p.yrSaint = Y.ultTicks + (heaven ? K.yrHeaven.more : 0);
  addEffect(s, { kind: "yrHolyFx", x: p.x, y: p.y, dirX: 1, dirY: 0, size: 70, maxTicks: 36 });
}
