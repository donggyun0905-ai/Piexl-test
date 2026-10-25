// 게임 상태가 바뀐 것을 보고 소리·진동·화면 흔들림을 냄 (게임 계산에는 영향 없음)
import { ENEMIES, type RunState } from "@pixel-rogue/shared";
import { getSettings } from "../settings";
import { wornLimited } from "../game/limited/limited";
import { play, setMusicBoss, startMusic, stopMusic, type Sfx } from "./sound";
import { setTigerMusic } from "./tigerSound";

interface Seen {
  kills: number;
  bossKills: number;
  hp: number;
  gold: number;
  purchases: number;
  buys: number;
  floor: number;
  shots: number;
  swings: number;
  /** 레이저를 쏘는 중 (기계공학자) */
  beaming: boolean;
  hits: number;
  crits: number;
  items: string;
  slots: number;
  boss: boolean;
  over: boolean;
  parried: number;
  guards: number;
}

function snapshot(s: RunState): Seen {
  return {
    kills: s.kills,
    bossKills: s.bossKills,
    hp: s.player.hp,
    gold: s.gold,
    purchases: s.purchases,
    buys: s.buys.length,
    floor: s.floor,
    // 내 탄 + 의사 탄(주사기·바늘·알약)
    shots: Math.max(
      s.projectiles.reduce((m, p) => (p.fromPlayer ? Math.max(m, p.id) : m), 0),
      (s.devices ?? []).reduce((m, d) => (d.kind === "shot" ? Math.max(m, d.id) : m), 0),
    ),
    swings: s.effects.filter((e) => e.kind === "swing").length,
    beaming: s.effects.some((e) => e.follow),
    hits: s.enemies.filter((e) => e.hitFlash === 6).length,
    crits: s.crits ?? 0,
    items: `${s.player.weaponId}|${s.player.passives.length}`,
    slots: s.player.useSlots.filter(Boolean).length,
    boss: s.enemies.some((e) => ENEMIES[e.kind].boss),
    over: s.over,
    parried: s.player.parryHits ?? 0,
    guards: s.player.mercGuards ?? 0,
  };
}

export function createRunSounds(run: RunState, onShake: (power: number) => void) {
  let seen = snapshot(run);
  // 한정 스킨(범 풍류)을 입었으면 전용 음악
  setTigerMusic(wornLimited(run.player.characterId) === "tiger");
  startMusic(run.floor, seen.boss);
  return {
    /** 틱을 진행한 프레임마다 */
    update(): void {
      const now = snapshot(run);
      const fx: Sfx[] = [];
      if (now.bossKills > seen.bossKills) fx.push("bossDown");
      else if (now.kills > seen.kills) fx.push("kill");
      // 치명타는 크게 "챙!" (연속이면 음이 올라감, 처치 소리와도 같이)
      if (now.crits > seen.crits) fx.push("crit");
      else if (now.bossKills === seen.bossKills && now.kills === seen.kills && now.hits > 0 && now.hits !== seen.hits) fx.push("hit");
      if (now.hp < seen.hp - 0.5) {
        fx.push("hurt");
        const s = getSettings();
        if (s.vibration) navigator.vibrate?.(40);
        onShake(Math.min(4, (seen.hp - now.hp) / 6));
      }
      if (now.purchases > seen.purchases || now.buys > seen.buys) fx.push("buy");
      else if (now.gold > seen.gold) fx.push("coin");
      if (now.items !== seen.items || now.slots > seen.slots) fx.push("pickup");
      if (now.slots < seen.slots) fx.push("use");
      if (now.shots > seen.shots || (now.beaming && !seen.beaming)) fx.push("shot");
      if (now.swings > seen.swings) fx.push("swing");
      if (now.parried > seen.parried) fx.push("parry");
      // 특수용병 보호막 성공: 1콤보 뒤 팅 · 2콤보 뒤 탕 · 3콤보(와 마무리) 뒤 펑
      if (now.guards > seen.guards) fx.push((["guard3", "guard1", "guard2", "guard3"] as const)[run.player.mercGuardStep ?? 0]!);
      if (now.floor !== seen.floor) {
        fx.push("stairs");
        startMusic(now.floor, false);
      }
      if (now.boss && !seen.boss) {
        fx.push("boss");
        setMusicBoss(true);
      }
      if (!now.boss && seen.boss) setMusicBoss(false);
      if (now.over && !seen.over) {
        fx.push(run.won ? "clear" : "fall");
        stopMusic();
      }
      for (const f of fx) play(f);
      seen = now;
    },
    dispose(): void {
      stopMusic();
      setTigerMusic(false);
    },
  };
}
