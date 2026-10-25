// 기계공학자 장치, 틱마다: 리액터 과열 · 포탑·해머·지뢰·위성 포 준비 · 던진 포탑·지뢰 날아가기 · 포탑 조사 · 지뢰 터짐 · 위성 포 낙하 · 자기장 끌어당기기
import { ENEMIES } from "../content";
import { removeDead } from "./combat";
import { beamInterval, lensArea, REACTOR_OVERHEAT, zapArea } from "./laser";
import { gearPeriod, mineBlast, ORBITAL_RADIUS, turretShot } from "./laserWeapons";
import type { Device, RunState } from "./types";
import { addEffect, dist2, keepInRoom, roomGrid, weaponOf } from "./util";

/** 지뢰: 적이 이만큼 가까이 오면 터짐 (몸 반지름에 더함) */
const MINE_TOUCH = 8;
/** 자기장: 끌어당기는 속도, 이 거리 안으로는 안 끌어당김 (몸 반지름 합에 더함) */
const MAGNET_PULL = 0.45;
const MAGNET_GAP = 10;

/** 둔화 남은 시간 줄이기 (틱마다 한 번) */
export function decaySlow(s: RunState): void {
  for (const e of s.enemies) if (e.slowTicks) e.slowTicks--;
}

export function updateLaserGear(s: RunState): void {
  const p = s.player;
  const w = weaponOf(p);
  if ((p.overheatTicks ?? 0) > 0) p.overheatTicks = (p.overheatTicks ?? 0) - 1;
  if ((p.boostTicks ?? 0) > 0) {
    p.boostTicks = (p.boostTicks ?? 0) - 1;
    if (p.boostTicks === 0) p.overheatTicks = REACTOR_OVERHEAT;
  }
  if (!s.tdShared) decaySlow(s);
  // 포탑·해머·지뢰·위성 포: 시간이 지나면 다시 쓸 수 있음 (자기장은 누르고 있는 동안만 모임)
  const period = gearPeriod(p);
  if (period > 0 && w.gear !== "magnet") p.gearTicks = Math.min(period, (p.gearTicks ?? period) + 1);
  if (w.gear === "magnet") magnetPull(s);
  if (!s.devices?.length) return;
  // 무기를 바꾸면 포탑·지뢰는 사라짐 (떨어지는 위성 포는 그대로)
  s.devices = s.devices.filter((d) => (d.kind === "turret" ? w.gear === "turret" : d.kind === "mine" ? w.gear === "mines" : true));
  const speed = p.stats.attackSpeed;
  const interval = beamInterval(speed);
  let first = true;
  for (const d of [...s.devices]) {
    // 던진 것은 모두 여기서 날아감 (의사 마취 가스통·구급 키트도). 의사 장치는 medicGear가 처리
    if (fly(s, d)) continue;
    if (d.kind !== "turret" && d.kind !== "mine" && d.kind !== "strike") continue;
    if (d.kind === "turret") {
      d.life = (d.life ?? 0) - 1;
      if (d.life <= 0) {
        s.devices = (s.devices ?? []).filter((x) => x !== d);
        continue;
      }
      if (--d.timer > 0) continue;
      d.timer = interval;
      turretShot(s, d, speed, interval, first);
      first = false;
    } else if (d.timer > 0) {
      d.timer--;
      if (d.kind === "strike" && d.timer === 0) {
        s.devices = (s.devices ?? []).filter((x) => x !== d);
        const radius = ORBITAL_RADIUS * lensArea(p);
        zapArea(s, d.x, d.y, radius, d.dmg ?? 0, interval);
        addEffect(s, { kind: "blast", x: d.x, y: d.y, dirX: 0, dirY: 0, size: radius, maxTicks: 14 });
      }
    } else if (d.kind === "mine") {
      const touched = s.enemies.some((e) => {
        const rr = e.r + MINE_TOUCH;
        return e.hp > 0 && (e.x - d.x) * (e.x - d.x) + (e.y - d.y) * (e.y - d.y) <= rr * rr;
      });
      if (touched) mineBlast(s, d, false);
    }
  }
  removeDead(s);
}

/** 던진 포탑·지뢰: 날아가는 중이면 한 틱만큼 옮기고 true (떨어지는 순간 먼지) */
function fly(s: RunState, d: Device): boolean {
  const left = d.fly ?? 0;
  if (left <= 0) return false;
  d.x += ((d.toX ?? d.x) - d.x) / left;
  d.y += ((d.toY ?? d.y) - d.y) / left;
  d.fly = left - 1;
  if (d.fly === 0) addEffect(s, { kind: "hit", x: d.x, y: d.y, dirX: 0, dirY: 0, size: 3, maxTicks: 8 });
  return true;
}

/** 자기장: 장판에 든(둔화된) 적을 플레이어 쪽으로 끌어당김 (보스·허수아비 제외) */
function magnetPull(s: RunState): void {
  const p = s.player;
  const g = roomGrid(s);
  for (const e of s.enemies) {
    if (!e.slowTicks || e.hp <= 0 || ENEMIES[e.kind].boss || e.kind === "dummy") continue;
    const d = Math.sqrt(dist2(e, p));
    if (d <= p.r + e.r + MAGNET_GAP) continue;
    e.x += ((p.x - e.x) / d) * MAGNET_PULL;
    e.y += ((p.y - e.y) / d) * MAGNET_PULL;
    keepInRoom(e, g);
  }
}
