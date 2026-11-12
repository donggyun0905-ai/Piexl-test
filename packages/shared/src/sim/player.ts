// 플레이어: 이동·조준·대시·공격
import { PERKS } from "../perks";
import { ambushCut, readyAmbush, takeOrigin, tickOrigin } from "./origin";
import { charmed, lureMove } from "./bossesTwo";
import { netMove } from "./bossPrimeval";
import { bindInput } from "./bossBinds";
import { TICK_RATE } from "../constants";
import { blastAt, damageEnemy } from "./combat";
import { afterCharmAttack, charmFields, HASTE_MUL } from "./talisman";
import { runeStroke } from "./rune";
import { beamInterval } from "./laser";
import { fireLaser } from "./laserWeapons";
import { orbitAttack } from "./orbitAttack";
import { mercGuard } from "./gunExtras";
import { BEDOUIN } from "../weaponsBedouin";
import { canDash, dashCooldownMul, rechargeDash, spendDash } from "./bedouin";
import { imugiDash } from "./imugi";
import { CLASS_TICKS, kingTick, pwBasicTick } from "./classTicks";
import { abandonedTag, tagReachMul } from "./abandoned";
import { titanParry } from "./titan";
import { idraSwap } from "./idra";
import { petTick } from "./lobbyPet";
import { ABANDONED } from "../weaponsAbandoned";
import { TITAN } from "../weaponsTitan";
import { beastSpeedMul } from "./pets";
import { fireMedic } from "./medicWeapons";
import { medicSpeedMul } from "./heal";
import { classMoveMul, classSpeedMul, foeHeld, foeMoveMul, foeNoAttack, onyxDash, trialMoveMul } from "./moveMul";
import type { EnemyState, PlayerState, RunState, TickInput } from "./types";
import { addEffect, shotDirs, DASH_COOLDOWN, DASH_SPEED_MUL, DASH_TICKS, dist2, hasPerk, keepInRoom, normalize, STILL_TICKS, weaponOf } from "./util";
import { readAim } from "./tracker";
import { srcRun } from "./dmgSrc"; import { tabooUp } from "./taboo"; import { blastSlideMul } from "./blastMag"; import { vaultGrid } from "./silverBulletKit";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 확대 폭발: 범위 피해가 없는 무기에도 이만큼의 기본 범위를 줌 (×1.5) */
  WIDE_BASE_BLAST: 12,
};
export { R as PLAYER_RULES };

/** 대시 대기 시간 (아이템으로 줄어듦) */
function dashCooldown(p: RunState["player"]): number {
  // 버려진 자들: 대시 버튼이 탭(교대), 짧게 다시 씀
  if (p.characterId === "abandoned") return ABANDONED.tagCd;
  if (p.characterId === "titan") return TITAN.parryCd;
  return Math.round(DASH_COOLDOWN * (hasPerk(p, "dashCloak") ? PERKS.dashCloak.cooldown : 1) * (hasPerk(p, "agility") ? 0.7 : 1) * (hasPerk(p, "goddessBlessing") ? 0.5 : 1) * (hasPerk(p, "silentStep") ? PERKS.silentStep.cooldown : 1) * (hasPerk(p, "clockwork") ? PERKS.clockwork.cooldown : 1) * dashCooldownMul(p));
}

function nearestEnemy(s: RunState): EnemyState | null {
  let best: EnemyState | null = null;
  let bestD = Infinity;
  for (const e of s.enemies) {
    if (e.immune || e.pwHid) continue;
    // 광야의 새벽 상자는 적보다 두 배 가까울 때만 · 같은 거리면 먼저 나온 적 (순서가 항상 같게)
    const d = dist2(e, s.player) * (e.svBox ? 4 : 1);
    if (d < bestD) {
      best = e;
      bestD = d;
    }
  }
  return best;
}

export function updatePlayer(s: RunState, raw: TickInput): void {
  const p = s.player;
  // 라스트 보스의 사슬·거울 (bossBinds)
  const input = bindInput(s, raw);
  if (p.attackCooldown > 0) p.attackCooldown--;
  if (p.dashCooldown > 0) p.dashCooldown--;
  if (p.invulnTicks > 0) p.invulnTicks--;
  if (p.streakTicks > 0 && --p.streakTicks === 0) p.streak = 0;
  tickOrigin(s);

  // 이동 방향 (조이스틱 중간 값 허용, 최대 길이 1). 끌려가는 중이면 끄는 쪽, 그물에 걸리면 멈춤
  let [mx, my] = netMove(s, ...lureMove(s, input.moveX / 100, input.moveY / 100));
  const mlen = Math.sqrt(mx * mx + my * my);
  if (mlen > 1) {
    mx /= mlen;
    my /= mlen;
  }

  // 조준: 자동 공격이면 가장 가까운 적, 아니면 입력 방향
  s.autoTargetId = 0;
  let aim: [number, number] | null = null;
  let autoInRange = false;
  if (input.autoAim) {
    const target = nearestEnemy(s);
    if (target) {
      s.autoTargetId = target.id;
      aim = normalize(target.x - p.x, target.y - p.y);
      const reach = p.stats.range * tagReachMul(p) + target.r;
      autoInRange = dist2(target, p) <= reach * reach;
    }
  } else {
    aim = normalize(input.aimX, input.aimY);
  }
  // 누른 곳까지 거리 (지뢰·위성 포·포탑·저격을 거기로) · 추적자 스킬 키
  readAim(p, input);
  if (aim) {
    p.faceX = aim[0];
    p.faceY = aim[1];
  } else if (mlen > 0) {
    const m = normalize(mx, my);
    if (m) {
      p.faceX = m[0];
      p.faceY = m[1];
    }
  }

  const wasDashing = p.dashTicks > 0;
  const guarded = weaponOf(p).gun === "merc" && mercGuard(s, input.dash);
  // 대시: 이동 중이면 이동 방향, 아니면 바라보는 방향
  // 대시 모아 쓰기(베두인): 대기 시간이 끝나면 하나씩 참
  // 금기: 느린 숨 (대시 재사용 시간 증가)
  const cool = Math.round(dashCooldown(p) * tabooUp(s, "slowDash"));
  rechargeDash(p, cool);
  if (onyxDash(s, input.dash) && !guarded && p.dashTicks === 0 && canDash(p) && !foeHeld(p)) {
    const d = normalize(mx, my) ?? [p.faceX, p.faceY];
    p.dashDirX = d[0];
    p.dashDirY = d[1];
    p.dashTicks = p.characterId === "abandoned" ? abandonedTag(s) : p.characterId === "titan" ? titanParry(s) : p.characterId === "idra" ? idraSwap(s) : DASH_TICKS;
    spendDash(p, cool);
    p.dashHitIds = [];
    imugiDash(s);
    if (p.characterId === "byeonhui") p.mHuman = true;
  }

  if (p.dashTicks > 0) {
    p.dashTicks--;
    // 베두인은 더 멀리 대시
    const sp = p.stats.moveSpeed * DASH_SPEED_MUL * (p.characterId === "bedouin" ? BEDOUIN.dashReach : 1) * blastSlideMul(p, mx, my, DASH_SPEED_MUL);
    p.x += p.dashDirX * sp;
    p.y += p.dashDirY * sp;
  } else {
    // 결벽증·의사 가운: 맞은 뒤 잠깐 빨라짐 · 속도는 곧 힘: 콤보를 이어 갈수록 빨라짐 · 버티기·모으기 중에는 못 움직임
    const ms = (p.rootTicks ?? 0) > 0 ? 0 : p.stats.moveSpeed * classMoveMul(p, s.tick) * foeMoveMul(p) * trialMoveMul(s);
    // 베두인: 차크람을 던져 손이 비면 빨라짐
    const empty = p.ckHeld === false && p.characterId === "bedouin" ? BEDOUIN.emptySpeed : 0;
    p.x += mx * (ms + empty * foeMoveMul(p));
    p.y += my * (ms + empty * foeMoveMul(p));
  }
  keepInRoom(p, vaultGrid(s));
  // 돌진 베기: 대시로 지나간 적에게 공격력 1.5배 피해 (한 대시에 한 번씩)
  if (p.dashTicks > 0 && hasPerk(p, "dashSlash")) {
    for (const e of s.enemies) {
      if (e.hp <= 0 || p.dashHitIds.includes(e.id)) continue;
      const rr = p.r + e.r + 3;
      if (dist2(e, p) > rr * rr) continue;
      p.dashHitIds.push(e.id);
      damageEnemy(s, e, p.stats.damage * PERKS.dashSlash.damage, p.dashDirX, p.dashDirY);
    }
  }
  if (wasDashing && p.dashTicks === 0) {
    readyAmbush(p);
    // 대지 흔들기: 대시가 끝나면 주변에 충격파
    if (hasPerk(p, "earthshaker")) srcRun(s, "earthshaker", () => { blastAt(s, p.x, p.y, PERKS.earthshaker.radius, p.stats.damage * PERKS.earthshaker.damage, { push: PERKS.earthshaker.push }); });
  }
  p.stillTicks = mlen > 0 || p.dashTicks > 0 ? 0 : p.stillTicks + 1;

  // 자동 공격: 누르지 않아도 사거리 안에 적이 있으면 공격. 수동: 누르고 있으면 공격 · 세이렌에게 홀린 동안은 공격하지 못함
  const wantAttack = !charmed(p) && !foeNoAttack(p) && (input.autoAim ? autoInRange : input.attack);
  if (wantAttack) p.atkAt = s.tick; // 증강 기술은 공격하는 동안만 (altar)
  const speed = attackSpeedNow(p);
  // 직업 무기: 누르고 있는 동안(연속 공격·모으기·에너지파 게이지)도 매 틱 처리 (classTicks)
  const classTick = pwBasicTick(s) ?? (p.kingRoom !== undefined ? kingTick : CLASS_TICKS[weaponOf(p).kind]);
  petTick(s);
  if (classTick) classTick(s, wantAttack, speed);
  else if (wantAttack && p.attackCooldown === 0) {
    const kind = weaponOf(p).kind;
    if (kind === "medic") {
      p.attackCooldown = beamInterval(speed);
      fireMedic(s, speed, p.attackCooldown);
    } else if (kind === "laser") {
      // 레이저: 짧은 간격으로 계속 조사
      p.attackCooldown = beamInterval(speed);
      fireLaser(s, speed, p.attackCooldown);
    } else if (weaponOf(p).kind === "orbit") {
      // 원소술사: 회전체는 알아서 때리고, 공격 키는 총알·내려찍기 등에만
      p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
      p.attackCount++;
      orbitAttack(s);
    } else {
      p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
      attack(s);
    }
  }
}

/** 지금 공격 속도 (사냥 열기·과충전·땅의 부적·의사 과잉 진료·무리의 우두머리 반영, 능력치 창도 이 값) */
export function attackSpeedNow(p: PlayerState): number {
  const still = p.stillTicks >= STILL_TICKS && hasPerk(p, "overcharge") ? PERKS.overcharge.speed : 1;
  const haste = (p.hasteTicks ?? 0) > 0 ? HASTE_MUL : 1;
  return p.stats.attackSpeed * (1 + PERKS.huntFrenzy.speed * p.streak) * still * haste * medicSpeedMul(p) * beastSpeedMul(p) * classSpeedMul(p);
}

function attack(s: RunState): void {
  const p = s.player;
  const w = weaponOf(p);
  let dmg = p.stats.damage;
  if (p.stillTicks >= STILL_TICKS && hasPerk(p, "steadyBreath")) dmg *= PERKS.steadyBreath.damage;
  const og = takeOrigin(s, w.kind === "melee"); // 떠돌이 기습 · 파수꾼 반격 (sim/origin)
  dmg *= og.mul;
  // 분노: 체력이 낮을수록 공격력 증가 · 마법사는 일반 공격이 약하고 공격마다 마법진에 한 획 (sim/rune)
  if (hasPerk(p, "rage")) dmg *= 1 + PERKS.rage.damage * (1 - Math.max(0, p.hp) / p.stats.maxHp);
  dmg *= runeStroke(s, dmg);
  p.attackCount++;
  if (w.kind === "melee") {
    // 회전 베기: 몇 번째 공격마다 한 바퀴
    const arcCos = og.spin || (hasPerk(p, "spinCleave") && p.attackCount % PERKS.spinCleave.every === 0) ? -1 : (w.arcCos ?? 0.5);
    const range = p.stats.range * og.reach;
    const executes = hasPerk(p, "executioner");
    for (const e of s.enemies) {
      const dx = e.x - p.x;
      const dy = e.y - p.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > range + e.r) continue;
      // 아주 가까우면 방향 상관없이 맞음, 아니면 앞쪽 범위 안만
      if (d > p.r + e.r && (dx * p.faceX + dy * p.faceY) / d < arcCos) continue;
      // 처형인의 표식: 체력 25% 이하 적에게 2배
      const mul = executes && e.hp <= e.maxHp * PERKS.executioner.below ? PERKS.executioner.damage : 1;
      damageEnemy(s, e, dmg * mul + ambushCut(p, e, og.cut), d === 0 ? p.faceX : dx / d, d === 0 ? p.faceY : dy / d);
    }
    // 검기: 휘두를 때마다 앞으로 관통하는 파동
    if (hasPerk(p, "waveSlash")) {
      const speed = 2.5;
      s.projectiles.push({
        id: s.nextId++,
        fromPlayer: true,
        x: p.x + p.faceX * (p.r + 2),
        y: p.y + p.faceY * (p.r + 2),
        prevX: p.x,
        prevY: p.y,
        r: 3,
        vx: p.faceX * speed,
        vy: p.faceY * speed,
        damage: dmg * PERKS.waveSlash.damage,
        ticksLeft: Math.ceil((range * 1.6) / speed),
        pierce: PERKS.waveSlash.pierce,
        hitIds: [],
      });
    }
    // 한 바퀴 휘두르기는 방향 0으로 그림 (원)
    const spin = arcCos <= -1;
    addEffect(s, { kind: "swing", x: p.x, y: p.y, dirX: spin ? 0 : p.faceX, dirY: spin ? 0 : p.faceY, size: range, maxTicks: 8 });
  } else {
    const speed = p.stats.projectileSpeed;
    const range = p.stats.range;
    const ticks = Math.ceil(range / speed);
    // 확대 폭발: 범위 +50%, 주변 피해 70% · 관통 마탄: 한 명 더 뚫음
    const wide = hasPerk(p, "wideBlast");
    const pierce = (w.pierce ?? 0) + (hasPerk(p, "piercingBolt") ? PERKS.piercingBolt.pierce : 0);
    const fire = (dx: number, dy: number, mul: number) => {
      s.projectiles.push({
        id: s.nextId++,
        fromPlayer: true,
        x: p.x + dx * (p.r + 2),
        y: p.y + dy * (p.r + 2),
        prevX: p.x,
        prevY: p.y,
        r: 2,
        vx: dx * speed,
        vy: dy * speed,
        damage: dmg * mul,
        ticksLeft: ticks,
        ...(w.blast || wide ? { blast: (w.blast ?? R.WIDE_BASE_BLAST) * (wide ? PERKS.wideBlast.blast : 1), ...(wide ? { splash: PERKS.wideBlast.splash } : {}) } : {}),
        ...(pierce > 0 ? { pierce, hitIds: [] } : {}),
        ...(hasPerk(p, "ricochet") ? { bounces: PERKS.ricochet.bounces } : {}),
        ...(hasPerk(p, "seekerFeather") ? { homing: true } : {}),
        ...(hasPerk(p, "returnFletch") || w.returns ? { back: true, span: ticks, hitIds: [] } : {}),
        ...(hasPerk(p, "splitHead") ? { split: true } : {}),
        ...(og.amb ? { ambush: og.amb, ...(og.cut ? { hpCut: og.cut } : {}) } : {}),
        ...charmFields(w, dmg * mul),
      });
    };
    let shots = w.shots ?? 1;
    let spread = w.spread;
    // 일제 사격 부적: 몇 번째 공격마다 발 수 +2
    if (hasPerk(p, "volleyCharm") && p.attackCount % PERKS.volleyCharm.every === 0) {
      shots += 2;
      spread = spread ?? [0.9659, 0.2588];
    }
    const first = s.projectiles.length;
    for (const [dx, dy] of shotDirs(p.faceX, p.faceY, shots, spread)) fire(dx, dy, 1);
    afterCharmAttack(s, first, dmg);
    if (hasPerk(p, "backQuiver")) fire(-p.faceX, -p.faceY, PERKS.backQuiver.damage);
    // 별똥별: 몇 번째 공격마다 가까운 적 3명에게 폭발
    if (hasPerk(p, "starShower") && p.attackCount % PERKS.starShower.every === 0) starShower(s, dmg * PERKS.starShower.damage);
  }
}

/** 가까운 적 3명(거리가 같으면 먼저 나온 적)의 자리에 폭발 */
function starShower(s: RunState, dmg: number): void {
  const p = s.player;
  const near = s.enemies
    .filter((e) => e.hp > 0)
    .map((e, i) => ({ e, i, d: dist2(e, p) }))
    .sort((a, b) => a.d - b.d || a.i - b.i)
    .slice(0, 3);
  for (const { e } of near) blastAt(s, e.x, e.y, PERKS.starShower.radius, dmg);
}
