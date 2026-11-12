// 오니(도깨비): 방망이를 느리고 세게 휘두름 · 맞으면 무기마다 확률로 추가 공격(oniArts) · 휘두를 때마다 신인족 게이지가 차고
// 다 차면 30초 신인족(공격력 +45% · 최대 체력 +50% · 추가 공격 100%). 틱마다 재생력 회복 · 한파·서리·폭풍·물보라·죽음 처리
// 능력치 바꾸기·제한은 oniRules, 무기 표는 weaponsOni
import { PW_PASSIVE } from "../paewangPassive";
import { TICK_RATE } from "../constants";
import { ONI_PERKS as K } from "../itemsOni";
import { ONI } from "../weaponsOni";
import { artChance, CLUB_TINT, clubArt, inCircle } from "./oniArts";
import { damageEnemy as damageEnemy_, dotDamage, healPlayer } from "./combat";
import { recalcStats } from "./items";
import { createRng, deriveSeed } from "../rng";
import type { EnemyState, RunState } from "./types";
import { addEffect, dist2, hasPerk, normalize, weaponOf } from "./util";
import { srcFn, srcEach } from "./dmgSrc";
const damageEnemy = srcFn("oni", () => damageEnemy_);

/** 방망이 휘두르기: 앞 부채꼴 안 적에게 공격력만큼 · 맞은 적 (가까운 순) */
function swing(s: RunState): EnemyState[] {
  const p = s.player;
  const w = weaponOf(p);
  const r = p.stats.range;
  const arc = w.arcCos ?? 0.2;
  const hit = s.enemies
    .filter((e) => {
      if (e.hp <= 0) return false;
      const dx = e.x - p.x;
      const dy = e.y - p.y;
      const d = Math.hypot(dx, dy);
      return d <= r + e.r && (d <= p.r + e.r || (dx * p.faceX + dy * p.faceY) / d >= arc);
    })
    .sort((a, b) => dist2(a, p) - dist2(b, p) || a.id - b.id);
  for (const e of hit) {
    const d = normalize(e.x - p.x, e.y - p.y) ?? [p.faceX, p.faceY];
    damageEnemy(s, e, p.stats.damage, d[0], d[1]);
  }
  addEffect(s, { kind: "oSwing", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: r, width: arc, maxTicks: 12, tint: CLUB_TINT[w.club ?? "thunder"] });
  return hit;
}

/** 신인족 게이지: 휘두를 때마다 하나, 다 차면 30초 신인족 (그동안은 차지 않음) */
function gauge(s: RunState): void {
  const p = s.player;
  if ((p.oGod ?? 0) > 0) return;
  p.oGauge = (p.oGauge ?? 0) + 1;
  if (p.oGauge < (s.pvp ? PW_PASSIVE.oniGauge : ONI.gaugeMax)) return;
  p.oGauge = 0;
  p.oGod = s.pvp ? PW_PASSIVE.oniGodTicks : ONI.godTicks;
  recalcStats(s);
  addEffect(s, { kind: "oGod", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 30, maxTicks: 40, tint: "#ffd040" });
}

/** 바닥 한파·서리: 안의 적 느려짐 (서리는 1초마다 공격력 10%) · 2.5초 머물면 영령 (적마다 다시 쓰기 대기) */
function zones(s: RunState): void {
  const p = s.player;
  const echo = hasPerk(p, "oniSpiritEcho");
  for (const z of srcEach(p.oZones ?? [])) z.ticks--;
  p.oZones = (p.oZones ?? []).filter((z) => z.ticks > 0);
  if (p.oZones.length === 0) delete p.oZones;
  for (const e of s.enemies) {
    if (e.hp <= 0) continue;
    if ((e.oSpiritCd ?? 0) > 0) e.oSpiritCd = (e.oSpiritCd ?? 0) - 1;
    const z = (p.oZones ?? []).find((q) => (e.x - q.x) ** 2 + (e.y - q.y) ** 2 <= (q.r + e.r) ** 2);
    if (!z) {
      if (e.oChill) e.oChill = 0;
      continue;
    }
    e.sluggish = Math.max(e.sluggish ?? 0, ONI.frost.slow);
    if (z.kind === "azure" && s.tick % TICK_RATE === 0) dotDamage(s, e, "frost", p.stats.damage * ONI.azure.zoneMul);
    e.oChill = (e.oChill ?? 0) + 1;
    if (e.oChill < ONI.frost.spiritAfter || (e.oSpiritCd ?? 0) > 0) continue;
    e.oChill = 0;
    if (z.kind === "azure") {
      dotDamage(s, e, "shock", p.stats.damage * ONI.azure.spiritMul);
      dotDamage(s, e, "frost", p.stats.maxHp * ONI.azure.spiritHp);
      e.oSpiritCd = ONI.frost.spiritCd;
    } else {
      dotDamage(s, e, "frost", p.stats.maxHp * (echo ? K.oniSpiritEcho.hp : ONI.frost.spiritHp));
      e.oSpiritCd = echo ? K.oniSpiritEcho.cd : ONI.frost.spiritCd;
    }
    addEffect(s, { kind: "oSpirit", x: e.x, y: e.y, dirX: z.kind === "azure" ? 1 : 0, dirY: 0, size: e.r + 10, maxTicks: 24, tint: CLUB_TINT[z.kind] });
  }
}

/** 폭풍: 가까운 적을 천천히 따라가며 빠르게 벰 */
export function storms(s: RunState): void {
  const p = s.player;
  if (!p.oStorms) return;
  const gale = hasPerk(p, "oniGale");
  const r = ONI.wind.r * (p.oReach ?? 1);
  for (const st of srcEach(p.oStorms)) {
    st.prevX = st.x;
    st.prevY = st.y;
    st.ticks--;
    let best: EnemyState | null = null;
    for (const e of s.enemies) if (e.hp > 0 && !e.immune && (!best || dist2(e, st) < dist2(best, st))) best = e;
    if (best) {
      const d = normalize(best.x - st.x, best.y - st.y);
      const sp = ONI.wind.speed * (gale ? K.oniGale.speed : 1);
      if (d && dist2(best, st) > 4) {
        st.x += d[0] * sp;
        st.y += d[1] * sp;
      }
    }
    if (--st.cd > 0) continue;
    st.cd = gale ? K.oniGale.every : ONI.wind.every;
    for (const e of inCircle(s, st.x, st.y, r)) dotDamage(s, e, "storm", st.dmg);
  }
  p.oStorms = p.oStorms.filter((st) => st.ticks > 0);
  if (p.oStorms.length === 0) delete p.oStorms;
}

/** 물보라: 해일 피해의 일부를 주변 적에게 번갈아 나눠 줌 */
function splashes(s: RunState): void {
  const p = s.player;
  if (!p.oSplash) return;
  for (const sp of srcEach(p.oSplash)) {
    if (--sp.wait > 0) continue;
    sp.wait = ONI.tide.gap;
    sp.left--;
    const near = inCircle(s, sp.x, sp.y, ONI.tide.chainR).sort((a, b) => dist2(a, sp) - dist2(b, sp) || a.id - b.id);
    const e = near[(ONI.tide.chains * 7 - sp.left) % Math.max(1, near.length)];
    if (!e) continue;
    dotDamage(s, e, "tide", sp.dmg);
    addEffect(s, { kind: "oSplash", x: sp.x, y: sp.y, dirX: 0, dirY: 0, size: 3, toX: e.x, toY: e.y, maxTicks: 12, tint: CLUB_TINT.tide });
  }
  p.oSplash = p.oSplash.filter((sp) => sp.left > 0);
  if (p.oSplash.length === 0) delete p.oSplash;
}

/** 죽음 상태이상: 1초마다 피해 (심연 흡수면 일부 회복) */
function deaths(s: RunState): void {
  const p = s.player;
  for (const e of s.enemies) {
    if ((e.oDeath ?? 0) <= 0 || e.hp <= 0) continue;
    e.oDeath = (e.oDeath ?? 0) - 1;
    if (e.oDeath % TICK_RATE !== 0) continue;
    dotDamage(s, e, "death", e.oDeathDmg ?? 0);
    if (hasPerk(p, "oniAbyssDrink")) healPlayer(s, (e.oDeathDmg ?? 0) * K.oniAbyssDrink.heal);
  }
}

/** 틱마다 (오니 방망이를 들었을 때 player에서). want = 공격 키. 공격 속도는 무기 값 그대로 (공격 속도 아이템은 재생력으로) */
export function oniTick(s: RunState, want: boolean): void {
  const p = s.player;
  if ((p.oGod ?? 0) > 0) {
    p.oGod = (p.oGod ?? 0) - 1;
    if (p.oGod === 0) recalcStats(s);
  }
  // 재생력: 5초마다 그만큼 (1초에 1/5씩)
  if (s.tick % TICK_RATE === 0 && p.hp > 0 && p.hp < p.stats.maxHp) healPlayer(s, (p.oRegen ?? ONI.regenBase) / 5);
  zones(s);
  storms(s);
  splashes(s);
  deaths(s);
  if (!want || p.attackCooldown > 0) return;
  const w = weaponOf(p);
  p.attackCount++;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / w.attackSpeed));
  const hit = swing(s);
  gauge(s);
  if (hit.length === 0 || !w.club) return;
  if (createRng(deriveSeed(s.seed, "oni", s.tick, p.attackCount)).nextFloat() < artChance(s, w.club)) clubArt(s, w.club, hit[0]!, hit);
}

/** 처음으로 (연습장 초기화) */
export function resetOni(p: RunState["player"]): void {
  delete p.oGauge;
  delete p.oGod;
  delete p.oZones;
  delete p.oStorms;
  delete p.oSplash;
}
