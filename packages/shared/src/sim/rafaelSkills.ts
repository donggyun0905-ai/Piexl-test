// 라파엘 스킬 넷(1 바람 걸음 · 2 폭풍 화살비 · 3 에테르 스코프 · 4 천공의 빛 화살) · 화살비 · 빛 화살 모으기 (sim/rafael에서 부름)
import { RAFAEL_PERKS as K } from "../itemsRafael";
import { RAFAEL as F } from "../weaponsRafael";
import { aimAt, isMark, onRay, rfCooldown, rfHit } from "./rafaelKit";
import { inCircle, rushTick, startRush } from "./s2Kit";
import type { RunState } from "./types";
import { addEffect, hasPerk } from "./util";

/** 1 바람 걸음: 뒤로 뛰며 떠난 자리에 돌풍 (밀쳐냄) · 다음 공격이 저격 */
function windStep(s: RunState): void {
  const p = s.player;
  const dist = F.stepDist * (hasPerk(p, "rfTail") ? K.rfTail.dist : 1);
  for (const e of inCircle(s, p.x, p.y, F.gustR)) rfHit(s, e, F.gustMul, F.gustPush);
  addEffect(s, { kind: "rfGustFx", x: p.x, y: p.y, dirX: -p.faceX, dirY: -p.faceY, size: F.gustR, maxTicks: 24 });
  startRush(p, { t: F.stepTicks, dx: -p.faceX, dy: -p.faceY, step: dist, dmg: 0, push: 0, invuln: true, tint: "#d8f0ff", w: 1 });
  // 뒤로 뛰기만 함 (지나가는 적은 치지 않음)
  p.s2Rush!.hit = s.enemies.map((e) => e.id);
  p.rfEmp = true;
}

/** 2 폭풍 화살비: 표적(없으면 앞) 자리에 화살이 연달아 쏟아짐 */
function storm(s: RunState): void {
  const p = s.player;
  const e = s.enemies.find((o) => o.hp > 0 && isMark(p, o));
  const x = e ? e.x : p.x + p.faceX * F.stormAt;
  const y = e ? e.y : p.y + p.faceY * F.stormAt;
  const r = F.stormR * (hasPerk(p, "rfEye") ? K.rfEye.r : 1);
  const n = F.stormN + (hasPerk(p, "rfRain") ? K.rfRain.more : 0);
  (p.rfStorms ??= []).push({ x, y, t: F.stormDelay, n, r });
  addEffect(s, { kind: "rfStormFx", x, y, dirX: 0, dirY: 0, size: r, style: 0, maxTicks: F.stormDelay });
}

/** 스킬 키 (1~4) */
export function rfSkill(s: RunState, i: number): void {
  const p = s.player;
  const cd = (p.rfCd ??= [0, 0, 0, 0]);
  if ((cd[i] ?? 0) > 0 || p.s2Rush || (p.rfCharge ?? 0) > 0) return;
  cd[i] = rfCooldown(p, i);
  if (i === 0) windStep(s);
  else if (i === 1) storm(s);
  else if (i === 2) {
    p.rfScope = F.scopeTicks + (hasPerk(p, "rfFocus") ? K.rfFocus.more : 0);
    addEffect(s, { kind: "rfScopeFx", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: 30, maxTicks: 30 });
  } else {
    // 4 천공의 빛 화살: 활을 크게 당겨 모은 뒤 쏨 (그동안 기본 공격 못 함)
    p.rfCharge = F.ultCharge;
    const [dx, dy] = aimAt(s, -1);
    p.rfAim = { x: dx, y: dy };
    addEffect(s, { kind: "rfChargeFx", x: p.x, y: p.y, dirX: dx, dirY: dy, size: 40, maxTicks: F.ultCharge });
  }
}

/** 바람 걸음 한 틱 */
export function stepTick(s: RunState): void {
  if (s.player.s2Rush) rushTick(s);
}

/** 폭풍 화살비: 떨어지기 시작하면 사이 틱마다 원 안의 적을 침 · 느려짐 */
export function stormTick(s: RunState): void {
  const p = s.player;
  const list = p.rfStorms;
  if (!list) return;
  for (const st of list) {
    if (--st.t > 0) continue;
    st.t = F.stormGap;
    st.n--;
    st.rain = true;
    for (const e of inCircle(s, st.x, st.y, st.r)) {
      rfHit(s, e, F.stormMul);
      e.slowTicks = Math.max(e.slowTicks ?? 0, F.stormSlow);
    }
    addEffect(s, { kind: "rfStormFx", x: st.x, y: st.y, dirX: st.n, dirY: 0, size: st.r, style: 1, maxTicks: 22 });
  }
  p.rfStorms = list.filter((st) => st.n > 0);
  if (p.rfStorms.length === 0) delete p.rfStorms;
}

/** 천공의 빛 화살: 다 모으면 방을 가로지르는 거대한 빛의 화살 · 끝에서 폭발 */
export function chargeTick(s: RunState): void {
  const p = s.player;
  if (!(p.rfCharge ?? 0)) return;
  p.invulnTicks = Math.max(p.invulnTicks, 2);
  if (--p.rfCharge! > 0) return;
  delete p.rfCharge;
  const { x: dx, y: dy } = p.rfAim ?? { x: p.faceX, y: p.faceY };
  delete p.rfAim;
  const w = F.ultW * (hasPerk(p, "rfLance") ? K.rfLance.w : 1);
  const mul = F.ultMul * (hasPerk(p, "rfWrath") ? K.rfWrath.mul : 1);
  const hits = onRay(s, dx, dy, F.ultLen, w);
  for (const e of hits) rfHit(s, e, mul, F.ultPush);
  // 끝 폭발: 가장 먼 적 자리 (없으면 줄 끝)
  const far = hits[hits.length - 1];
  const ex = far ? far.x : p.x + dx * F.ultLen * 0.6;
  const ey = far ? far.y : p.y + dy * F.ultLen * 0.6;
  for (const e of inCircle(s, ex, ey, F.ultBlastR)) rfHit(s, e, F.ultBlastMul * (hasPerk(p, "rfWrath") ? K.rfWrath.mul : 1));
  addEffect(s, { kind: "rfHeavenFx", x: p.x, y: p.y, dirX: dx, dirY: dy, size: w, toX: p.x + dx * F.ultLen, toY: p.y + dy * F.ultLen, maxTicks: 40 });
  addEffect(s, { kind: "rfBlastFx", x: ex, y: ey, dirX: dx, dirY: dy, size: F.ultBlastR, maxTicks: 30 });
}
