// 광야의 새벽: 두 번째~네 번째 무기 = 캐릭터 자리에서 따로 공격하는 그림자 공격자.
// 공격자마다 run.player·탄·장치·효과를 꺼내 놓고 기존 계산을 그대로 돌림 (타워 디펜스 tdTowers와 같은 방식)
import type { WeaponId } from "../content";
import { recallChakram } from "./bedouin";
import { removeDead } from "./combat";
import { updatePending } from "./pending";
import { equipWeapon, recalcStats } from "./items";
import { updateLaserGear } from "./laserGear";
import { updateMedicGear } from "./medicGear";
import { updateOrbit } from "./orbit";
import { updatePlayer } from "./player";
import { updateProjectiles } from "./projectiles";
import { newPlayer } from "./run";
import type { SwarmWeapon } from "./swarmTypes";
import { evoNova } from "./swarmEvo";
import { updateCharms } from "./talisman";
import type { TdAttacker } from "./tdTypes";
import type { PlayerState, RunState, TickInput } from "./types";

/** 공격자 하나를 run에 꺼내 놓고 fn (끝나면 탄·장치·효과를 공격자에게 돌려놓고 본인을 다시) */
export function withGhost(s: RunState, a: TdAttacker, fn: () => void): void {
  const hero = s.player;
  const keep = { shots: s.projectiles, devices: s.devices, effects: s.effects, blasts: s.pendingBlasts };
  s.player = a.p;
  s.projectiles = a.shots;
  s.devices = a.devices;
  s.effects = a.effects;
  s.pendingBlasts = a.blasts;
  fn();
  a.shots = s.projectiles;
  a.devices = s.devices ?? [];
  a.effects = s.effects;
  a.blasts = s.pendingBlasts;
  s.player = hero;
  s.projectiles = keep.shots;
  s.devices = keep.devices;
  s.effects = keep.effects;
  s.pendingBlasts = keep.blasts;
}

/** 본인·그림자 공격자 모두에게 fn (s.player가 그 공격자) */
export function eachFighter(s: RunState, fn: (p: PlayerState, w: SwarmWeapon) => void): void {
  const sw = s.swarm;
  if (!sw) return;
  for (const w of sw.weapons) {
    if (w.ghost) withGhost(s, w.ghost, () => fn(s.player, w));
    else fn(s.player, w);
  }
}

/** 새 무기: 그림자 공격자를 만들어 본인과 같은 패시브로 */
export function addGhost(s: RunState, id: WeaponId): SwarmWeapon {
  const hero = s.player;
  const p = newPlayer(hero.characterId, hero.x, hero.y);
  p.passives = [...hero.passives];
  p.svPass = { ...hero.svPass };
  p.svLv = 1;
  // 버려진 자들 두 번째 무기부터는 탭을 누를 수 없어 조합대로 스스로 교대
  if (hero.characterId === "abandoned") p.abAuto = true;
  const ghost: TdAttacker = { p, shots: [], devices: [], effects: [], blasts: [] };
  withGhost(s, ghost, () => equipWeapon(s, id));
  return { id, ghost };
}

/** 틱마다 그림자 공격자: 본인 자리·체력에 맞춰 같은 조준으로 공격. 회복·자해는 본인 체력으로 옮김 */
export function updateGhosts(s: RunState, input: TickInput): void {
  const sw = s.swarm;
  const hero = s.player;
  if (!sw) return;
  for (const w of sw.weapons) {
    const a = w.ghost;
    if (!a) continue;
    a.p.hp = hero.hp;
    withGhost(s, a, () => {
      const p = s.player;
      p.prevX = p.x = hero.x;
      p.prevY = p.y = hero.y;
      for (const pr of s.projectiles) {
        pr.prevX = pr.x;
        pr.prevY = pr.y;
      }
      updatePlayer(s, { ...input, moveX: 0, moveY: 0, dash: false, interact: false, useSlot: 0, pickChoice: 0, statPick: 0 });
      recallChakram(p);
      p.x = hero.x;
      p.y = hero.y;
      p.dashTicks = 0;
      updateLaserGear(s);
      updateOrbit(s);
      updateMedicGear(s);
      updateProjectiles(s);
      updateCharms(s);
      updatePending(s);
      evoNova(s);
      removeDead(s);
      for (const fx of s.effects) fx.ticks--;
      s.effects = s.effects.filter((fx) => fx.ticks > 0);
    });
    hero.hp = Math.max(0, Math.min(hero.stats.maxHp, a.p.hp));
  }
}

/** 패시브·무기가 바뀐 뒤: 모든 공격자의 패시브를 본인과 같게 하고 능력치 다시 계산 */
export function syncFighters(s: RunState): void {
  const hero = s.player;
  eachFighter(s, (p) => {
    if (p !== hero) {
      p.passives = [...hero.passives];
      p.svPass = { ...hero.svPass };
      p.svMight = hero.svMight;
    }
    recalcStats(s);
  });
}
