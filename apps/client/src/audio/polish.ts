// 소리 다듬기 (runSounds가 낼 소리 목록을 마지막에 손봄): 기본 휘두름·탄 소리를 든 무기에 맞는 소리로 바꾸고, 대시·회복·방 정리·위험 체력 소리를 더함
import { ENEMIES, WEAPONS, type RunState } from "@pixel-rogue/shared";
import { getSettings } from "../settings";
import { REST_MUSIC, SHOP_MUSIC } from "./calmMusic";
import { foeSounds } from "./foeSounds";
import { setBossTune } from "./musicLayers";
import { setRoomMusic } from "./roomMusic";
import { play, type Sfx } from "./sound";
import { vaultMusic } from "./vaultSound";

/** 공격 소리 → 맞는 소리 (없으면 기본 "퍽") */
const HIT: Partial<Record<Sfx, Sfx>> = { wpBlade: "hitSlash", wpLight: "hitSlash", wpHeavy: "hitBlunt", wpFist: "hitBlunt", wpBoom: "hitBlunt", wpThrust: "hitPierce", wpBow: "hitPierce", wpThrow: "hitPierce", wpGun: "hitPierce", wpMagic: "hitMagic" };

/** 무기 종류(kind)마다 공격 소리 (전용 소리가 따로 있는 캐릭터의 무기는 넣지 않음 → 기본 소리 그대로) */
const KIND: Record<string, Sfx> = {
  gun: "wpGun", cyber: "wpGun",
  combo: "wpFist", beast: "wpFist", morph: "wpFist", talon: "wpFist", maw: "wpFist",
  titan: "wpHeavy", club: "wpHeavy", ram: "wpHeavy",
  spear: "wpThrust", needle: "wpThrust",
  shade: "wpBlade", scythe: "wpBlade", chakram: "wpBlade",
  quill: "wpThrow",
  star: "wpMagic", chrono: "wpMagic", summon: "wpMagic", gaia: "wpMagic", earthwood: "wpMagic", pact: "wpMagic", pest: "wpMagic", solar: "wpMagic",
  bomb: "wpBoom",
};
interface Def { kind: string; damageMul: number; attackSpeed: number; arcCos?: number; blast?: number }

/** 든 무기의 공격 소리: [휘두를 때, 쏠 때] (없으면 기본 소리) */
function weaponFx(id: string): [Sfx | undefined, Sfx | undefined] {
  const w = (WEAPONS as Record<string, Def>)[id];
  if (!w) return [undefined, undefined];
  if (w.kind === "melee") {
    if (id === "fists") return ["wpFist", undefined];
    if (w.damageMul >= 1.5 || w.attackSpeed <= 1.5) return ["wpHeavy", undefined];
    if ((w.arcCos ?? 0) >= 0.7) return ["wpThrust", undefined];
    return [w.attackSpeed >= 3.2 ? "wpLight" : "wpBlade", undefined];
  }
  if (w.kind === "ranged") {
    if (w.blast || /staff|wand|orb|rod|glove|starfall/.test(id)) return [undefined, "wpMagic"];
    return [undefined, /bow|arbalest|repeater/.test(id) ? "wpBow" : "wpThrow"];
  }
  const k = KIND[w.kind];
  return [k, k];
}

interface Seen { dash: number; hp: number; room: number; floor: number; cleared: boolean; fought: boolean; beat: number; calm: string; boss: string }
const seenOf = new WeakMap<RunState, Seen>();
/** 위험 체력: 최대 체력의 이 비율 이하면 이 틱마다 심장 소리 */
const LOW_HP = 0.25;
const LOW_GAP = 50;

export function polish(run: RunState, fx: Sfx[]): Sfx[] {
  const p = run.player;
  const [sw, sh] = weaponFx(p.weaponId);
  const hit = HIT[(sw ?? sh)!];
  for (let i = 0; i < fx.length; i++) {
    if (fx[i] === "swing" && sw) fx[i] = sw;
    else if (fx[i] === "shot" && sh) fx[i] = sh;
    else if (fx[i] === "hit" && hit) fx[i] = hit;
  }
  foeSounds(run, fx);
  // 상점·쉼터 방은 잔잔한 곡 · 보스가 나오면 그 보스의 가락 (마지막 보스는 가장 웅장하게)
  const type = run.map.rooms[run.roomId]?.type ?? "";
  const calm = type === "shop" || type === "rest" ? type : "";
  const boss = run.enemies.find((e) => ENEMIES[e.kind].boss)?.kind ?? "";
  const cleared = run.rooms[run.roomId]?.cleared ?? true;
  const was = seenOf.get(run);
  const now: Seen = { dash: p.dashTicks, hp: p.hp, room: run.roomId, floor: run.floor, cleared, fought: run.enemies.length > 0 || (!!was?.fought && was.room === run.roomId && was.floor === run.floor), beat: was?.beat ?? 0, calm, boss };
  seenOf.set(run, now);
  if (!was) setBossTune(null);
  if (boss && boss !== was?.boss) setBossTune(boss, !!run.lastBoss || run.floor >= 7 || (!!run.arena && run.roomId === run.map.rooms.length - 1));
  if (calm !== (was?.calm ?? "")) {
    if (calm) setRoomMusic(calm === "shop" ? SHOP_MUSIC : REST_MUSIC);
    else if (type !== "altar" && type !== "trial" && !vaultMusic(type)) setRoomMusic(null);
  }
  if (!was || run.over) return fx;
  if (now.dash > 0 && was.dash === 0) fx.push("dash");
  if (now.hp > was.hp + 0.9 && !fx.includes("use")) fx.push("heal");
  // 적이 있던 방을 막 정리했을 때만 (이미 정리된 방에 들어갈 때는 조용히)
  if (cleared && !was.cleared && was.fought && now.room === was.room && now.floor === was.floor) fx.push("roomClear");
  if (getSettings().heartbeat && p.hp > 0 && p.hp <= p.stats.maxHp * LOW_HP && (run.tick < now.beat || run.tick - now.beat >= LOW_GAP)) {
    now.beat = run.tick;
    fx.push("lowHp");
  }
  return fx;
}

/** 메뉴 버튼을 누르면 작은 소리 (모바일 조작 버튼은 빼고) */
export function uiClick(e: Event): void {
  const el = e.target instanceof Element ? e.target.closest("button") : null;
  if (el && getSettings().uiSound && !el.closest(".touch-buttons")) play("uiClick");
}
