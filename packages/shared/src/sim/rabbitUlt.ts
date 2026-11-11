// 래빗 슈퍼 럭키!(초거대 망치): 맵을 가릴 만큼 큰 망치가 왼쪽 밖에서 빠르게 나와 맵 1/5쯤에서 슬로우 모션이 되고
// 느린 동안 방 안 적 모두가 피해를 나눠 여러 번(최대 60번, 빠르게) 맞음 · 망치가 맵을 다 가리면 슬로우가 끝나고 오른쪽 밖으로 빠르게 휘둘러짐
// 망치 자리는 지난 틱(t)으로 화면이 똑같이 계산 (rabbitUltX). 느린 동안 적은 쉬고(sim/rabbit.rabbitSlowed) 적 탄도 느려짐
import { RABBIT_PERKS as K } from "../itemsRabbit";
import { ENEMIES } from "../enemyDefs";
import { RABBIT_ULT as U } from "../weaponsRabbit";
import { megaMul } from "./rabbitKit";
import { alive, damageEnemyLite } from "./shadowingSpirits";
import { restoreShots, slowShots } from "./slowShots";
import type { RunState } from "./types";
import { addEffect, ROOM_MAX_X, ROOM_MIN_X } from "./util";

/** 슈퍼 럭키 시작 */
export function startUlt(s: RunState): void {
  const p = s.player;
  p.rbUlt = { t: 0, hits: 0, dmg: (p.stats.damage * U.mul * megaMul(p)) / U.hits };
  p.rbUltCd = K.rbLucky.cd;
  addEffect(s, { kind: "rbUlt", x: p.x, y: p.y, dirX: 1, dirY: 0, size: 1, maxTicks: U.enter + U.slow + U.swing });
}

/**
 * 초거대 망치 가운데 x (맵 너비 W와 같은 크기로 그림): 나올 때 앞쪽 끝이 맵 1/5까지 빠르게 → 느리게 맵 가운데(다 가림) → 오른쪽 밖으로 빠르게
 * t = 지난 틱 (화면도 같은 식)
 */
export function rabbitUltX(t: number): number {
  const w = ROOM_MAX_X - ROOM_MIN_X;
  const start = ROOM_MIN_X - w;
  const fifth = ROOM_MIN_X - w / 2 + w / 5;
  const cover = ROOM_MIN_X + w / 2;
  const gone = ROOM_MAX_X + w;
  if (t < U.enter) return start + (fifth - start) * (t / U.enter);
  if (t < U.enter + U.slow) return fifth + (cover - fifth) * ((t - U.enter) / U.slow);
  return cover + (gone - cover) * Math.min(1, (t - U.enter - U.slow) / U.swing) ** 2;
}

/** 틱마다: 느린 동안 나눠 때림 (최대 hits번) · 끝나면 적 탄을 원래 빠르기로 */
export function ultTick(s: RunState): void {
  const p = s.player;
  const u = p.rbUlt;
  if (!u) return;
  u.t++;
  p.invulnTicks = Math.max(p.invulnTicks, 2);
  const slowEnd = U.enter + U.slow;
  if (u.t >= U.enter && u.t < slowEnd) {
    p.rbFrozen = slowShots(s, p.rbFrozen, U.shotSlow);
    const due = Math.min(U.hits, Math.floor(((u.t - U.enter) * U.hits) / Math.min(U.slow, U.hitTicks)) + 1);
    while (u.hits < due) hitAll(s, ++u.hits);
  }
  if (u.t === slowEnd) {
    restoreShots(s, p.rbFrozen, U.shotSlow);
    delete p.rbFrozen;
  }
  if (u.t >= slowEnd + U.swing) delete p.rbUlt;
}

/** 한 번 나눠 때림: 방 안 적 모두 (보스는 조금 덜) */
function hitAll(s: RunState, n: number): void {
  const u = s.player.rbUlt!;
  for (const e of s.enemies) {
    if (!alive(e)) continue;
    damageEnemyLite(s, e, u.dmg * (ENEMIES[e.kind].boss ? U.bossMul : 1), 1, 0);
    addEffect(s, { kind: "rbUltHit", x: e.x, y: e.y, dirX: 1, dirY: 0, size: e.r, style: n, maxTicks: 10 });
  }
}
