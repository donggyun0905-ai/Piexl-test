// 게임 상태가 바뀐 것을 보고 소리·진동·화면 흔들림을 냄 (게임 계산에는 영향 없음)
import { ENEMIES, type RunState } from "@pixel-rogue/shared";
import { getSettings } from "../settings";
import { wornLimited, wornVictory } from "../game/limited/limited";
import { setVictoryMusic } from "./victorySound";
import { skillSounds } from "./sfxSkills";
import { play, setMusicBoss, startMusic, stopMusic, type Sfx } from "./sound";
import { setTigerMusic } from "./tigerSound";
import { setSummerMusic } from "./summerSound";

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
  /** 공격 횟수 (탄·휘두르기 효과가 없는 캐릭터도 공격 소리가 나게) */
  attacks: number;
  tick: number;
  /** 추적자: 암습 저격 남은 발 · 강력한 한방 모으는 중 */
  ambush: number;
  charging: boolean;
  /** 잊혀진 자: 신족 */
  god: boolean;
  /** 잔영: 순간이동 남은 대기 */
  rmDodges: number;
  rmCuts: number;
  /** 예리함 칼빛 · 천검란 (화면에 있는 효과 수) */
  sharps: number;
  cuts: number;
  storms: number;
  /** 영사: 찢기 · 장전 끝 (화면에 있는 효과 수) */
  rends: number;
  reloads: number;
  /** 에테르 광부: 광산 붕괴 (화면에 있는 효과 수) */
  caves: number;
  /** 운명의 여행자: 모래시계 뒤집힘 수 */
  flips: number;
  /** 제우스 강림 중 */
  zsGod: boolean;
  /** 차원의 순례자: 배낭에서 꺼낸 수집품 그림 수 */
  bags: number;
  /** 왕 대검 (왕관 변신·몰락한 왕): 휘두른 효과 수 · 내리꽂은 효과 수 · 들어온 영혼 */
  kgSwings: number;
  kgPlants: number;
  kgSouls: number;
  /** 빛의 사도: '+' 빛의 검 효과 수 · 빛의 조각 수 */
  lxCrosses: number;
  lxShards: number;
}

/** 탄을 쏘는 느낌의 캐릭터 (나머지는 휘두르는 소리) */
const SHOOTERS = new Set(["stargazer", "elder", "plague", "samyeol", "spiritist", "scribe", "automata", "bomber", "artifacter"]);

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
    attacks: s.player.attackCount,
    tick: s.tick,
    ambush: s.player.trAmbush ? (s.player.trShot ?? 0) : 0,
    charging: (s.player.trCharge ?? 0) > 0,
    god: (s.player.fgGod ?? 0) > 0,
    rmDodges: s.player.rmDodges ?? 0,
    rmCuts: s.effects.filter((f) => f.kind === "rmFlurry" && f.ticks >= f.maxTicks - 1).length,
    sharps: s.effects.filter((f) => f.kind === "wdSharp").length,
    cuts: s.effects.filter((f) => f.kind === "wdCut" && f.ticks >= f.maxTicks - 1).length,
    storms: s.effects.filter((f) => f.kind === "wdTempest").length,
    rends: s.effects.filter((f) => f.kind === "skRend").length,
    reloads: s.effects.filter((f) => f.kind === "skReload").length,
    caves: s.effects.filter((f) => f.kind === "mnCave").length,
    flips: s.player.vyFlips ?? 0,
    zsGod: (s.player.zsGod ?? 0) > 0,
    bags: s.effects.filter((f) => f.kind === "pgBag").length,
    kgSwings: s.effects.filter((f) => f.kind === "kgSlash" || f.kind === "kgWave").length,
    kgPlants: s.effects.filter((f) => f.kind === "kgPlant").length,
    kgSouls: s.player.fkSouls ?? 0,
    lxCrosses: s.effects.filter((f) => f.kind === "lxCross").length,
    lxShards: s.player.passives.filter((id) => id === "lxShard").length,
  };
}

export function createRunSounds(run: RunState, onShake: (power: number) => void) {
  let seen = snapshot(run);
  // 원소술사 회전체가 때릴 때 휘두르는 소리 (너무 잦지 않게)
  let orbSound = 0;
  // 한정 스킨(범 풍류·여름 파도)을 입었으면 전용 음악
  const limited = wornLimited(run.player.characterId);
  setTigerMusic(limited === "tiger");
  setSummerMusic(limited === "summer");
  setVictoryMusic(!limited && wornVictory(run.player.characterId));
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
      // 전용 효과만 쓰는 캐릭터: 공격할 때마다 소리 (이번에 탄·휘두르기 소리가 없었으면)
      const c = run.player.characterId;
      if (c === "tracker") {
        // 추적자: 총성마다 다르게, 암습 저격·강력한 한방은 화면이 크게 흔들림
        if (now.ambush > 0 && now.ambush !== seen.ambush) {
          fx.push("snipe");
          onShake(3);
        } else if (seen.charging && !now.charging) {
          fx.push("power");
          onShake(7);
        } else if (now.attacks > seen.attacks) fx.push("rifle");
        const i = fx.indexOf("shot");
        if (i >= 0 && fx.some((f) => f === "snipe" || f === "power" || f === "rifle")) fx.splice(i, 1);
      } else if (c === "forgotten") {
        // 잊혀진 자: 빛 공격은 맑은 종소리, 신족이 되면 오르는 화음
        if (!seen.god && now.god) {
          fx.push("awaken");
          onShake(4);
        }
        if (now.attacks > seen.attacks) fx.push("chime");
        const i = fx.indexOf("shot");
        if (i >= 0) fx.splice(i, 1);
      } else if (c === "silk") {
        // 영사: 실은 작게 튕기는 소리, 찢으면 "띵", 장전이 끝나면 실 감는 소리
        if (now.rends > seen.rends) fx.push("ting");
        else if (now.attacks > seen.attacks) fx.push("string");
        if (now.reloads > seen.reloads) fx.push("spool");
      } else if (c === "miner") {
        // 에테르 광부: 곡괭이는 "깡" · 광산 붕괴는 우르르 + 화면이 크게 흔들림
        if (now.attacks > seen.attacks) fx.push("clank");
        if (now.caves > seen.caves) {
          fx.push("rumble");
          onShake(6);
        }
      } else if (c === "zeus") {
        // 제우스: 번개마다 지직 · 강림하면 큰 천둥 + 화면이 크게 흔들림
        if (now.attacks > seen.attacks) fx.push("zap");
        if (now.zsGod && !seen.zsGod) {
          fx.push("descend");
          onShake(8);
        }
        const i = fx.indexOf("shot");
        if (i >= 0) fx.splice(i, 1);
      } else if (c === "pilgrim") {
        // 차원의 순례자: 쓸 때 반짝 소리 · 배낭에서 꺼내면 바스락
        if (now.attacks > seen.attacks) fx.push("twinkle");
        if (now.bags > seen.bags) fx.push("rustle");
        const i = fx.indexOf("shot");
        if (i >= 0) fx.splice(i, 1);
      } else if (c === "voyager") {
        // 운명의 여행자: 쏠 때 시위 소리 · 모래시계가 뒤집히면 주사위 구르는 소리
        if (now.attacks > seen.attacks) fx.push("twang");
        if (now.flips > seen.flips) fx.push("dice");
        const i = fx.indexOf("shot");
        if (i >= 0) fx.splice(i, 1);
      } else if (c === "wanderer") {
        // 방랑객: 적에게 칼선이 들어가면 "삥" · 그 밖의 칼질은 카타나 소리 · 천검란은 화면이 흔들림
        if (now.cuts > 0 && now.tick !== seen.tick) fx.push("ping");
        else if (now.attacks > seen.attacks) fx.push("katana");
        if (now.storms > seen.storms) {
          fx.push("tempest");
          onShake(4);
        }
        const i = fx.indexOf("swing");
        if (i >= 0) fx.splice(i, 1);
      } else if (c === "remnant") {
        // 잔영: 회피 성공(슬로우모션)은 쉭 빨려 드는 소리, 연속 베기는 칼 소리 + 흔들림, 내려찍기는 짧은 쉭
        if (now.rmDodges > seen.rmDodges) fx.push("blink");
        if (now.rmCuts > 0) {
          fx.push("katana");
          onShake(3);
        } else if (now.attacks > seen.attacks && !fx.includes("swing")) fx.push("slice");
      } else if (c === "fallenKing" || run.player.kingRoom !== undefined) {
        // 왕 대검: 무거운 휘두름 · 내리꽂으면 불길이 솟는 소리 · 영혼이 들어오면 맑은 소리
        if (now.kgSwings > seen.kgSwings) fx.push("kgCleave");
        if (now.kgPlants > seen.kgPlants) {
          fx.push("kgPyre");
          onShake(3);
        }
        if (now.kgSouls > seen.kgSouls) fx.push("kgSoul");
      } else if (c === "lux") {
        // 빛의 사도: 가벼운 빛 칼날 · '+' 빛의 검이 생기는 맑은 소리 · 빛의 조각을 얻는 오르는 소리
        if (now.attacks > seen.attacks) fx.push("lxBlade");
        if (now.lxCrosses > seen.lxCrosses) fx.push("lxCross");
        if (now.lxShards > seen.lxShards) fx.push("lxShard");
      } else if (now.attacks > seen.attacks && !fx.includes("shot") && !fx.includes("swing")) fx.push(SHOOTERS.has(c) ? "shot" : "swing");
      if (c === "elementalist" && now.hits > 0 && now.hits !== seen.hits && now.tick - orbSound >= 15) {
        orbSound = now.tick;
        if (!fx.includes("swing")) fx.push("swing");
      }
      // 예리함이 터지면 (어느 캐릭터든) 맑은 쇳소리
      if (now.sharps > seen.sharps) fx.push("sharp");
      if (now.parried > seen.parried) fx.push("parry");
      // 특수용병 보호막 성공: 1콤보 뒤 팅 · 2콤보 뒤 탕 · 3콤보(와 마무리) 뒤 펑
      if (now.guards > seen.guards) fx.push((["guard3", "guard1", "guard2", "guard3"] as const)[run.player.mercGuardStep ?? 0]!);
      skillSounds(run, fx, onShake);
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
