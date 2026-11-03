// 던전 판에서 캐릭터 해금 기록 모으기 (game/runTracker가 프레임마다 observe · 끝나면 finish)
// 방에 들어감(엘리트·쉼터) · 종류별 처치(스켈레톤 궁병·베놈) · 폭탄 쓰기 · 제단 쓰기 · 함정 · 능력치 최고 · 악마 템 · 큐피트의 정령 · 시련 1000점
// 끝: 영웅의 길(의사·악의 사도) · 멸망의 용 · 레이드 아레나 · 무한 모드 층 · 7분 클리어
import { DEVIL_IDS, extraOf, TICK_RATE, type RunState } from "@pixel-rogue/shared";
import { bump, flushUnlockStats, mark, raise, addDevil } from "./unlockStats";

/** 이 종류를 잡으면 셈 */
const KILL_KINDS = { skelarcher: "skelarcher", venom: "venom" } as const;

export function createUnlockRun(run: RunState) {
  // 패왕전·광야의 새벽은 따로 (각 기록 파일)
  const on = !run.pvp && !run.pw && !run.swarm;
  let room = "";
  let kills = run.kills;
  let foes = new Map<number, string>();
  let slots: (string | null)[] = [...run.player.useSlots];
  let altars = run.player.altar?.rooms.length ?? 0;
  let traps = run.trapHits ?? 0;
  return {
    observe(): void {
      if (!on || run.over) return;
      const p = run.player;
      // 방에 처음 들어감
      const key = `${run.floor}/${run.roomId}`;
      if (key !== room) {
        room = key;
        const type = run.map.rooms[run.roomId]?.type;
        if (type === "elite") bump("eliteRooms");
        if (type === "rest") bump("rests");
        foes = new Map();
        flushUnlockStats();
      }
      // 사라진 적 중 처치 수가 늘어난 만큼 (같은 방 안)
      const gained = run.kills - kills;
      kills = run.kills;
      if (gained > 0) {
        const alive = new Set(run.enemies.map((e) => e.id));
        let left = gained;
        for (const [id, kind] of foes) {
          if (left <= 0) break;
          if (alive.has(id)) continue;
          left--;
          if (kind in KILL_KINDS) bump(kind as keyof typeof KILL_KINDS);
        }
      }
      foes = new Map(run.enemies.filter((e) => !e.noGold).map((e) => [e.id, e.kind]));
      // 폭탄: 폭탄이 있던 칸이 비면 씀
      p.useSlots.forEach((it, i) => {
        if (slots[i] === "bomb" && it === null) bump("bombs");
      });
      slots = [...p.useSlots];
      const a = p.altar?.rooms.length ?? 0;
      if (a > altars) bump("altars", a - altars);
      altars = a;
      const tr = run.trapHits ?? 0;
      if (tr > traps) bump("traps", tr - traps);
      traps = tr;
      raise("defense", extraOf(p).defense);
      raise("maxHp", p.stats.maxHp);
      raise("attackSpeed", p.stats.attackSpeed);
      raise("moveSpeed", p.stats.moveSpeed);
      for (const id of p.passives) if ((DEVIL_IDS as readonly string[]).includes(id)) addDevil(id);
      if (p.useSlots.includes("cupidSpirit")) mark("cupid");
      if ((p.trial?.total ?? 0) >= 1000) mark("trial1000");
      if (run.endless) raise("endlessFloor", run.floor);
    },
    finish(): void {
      if (!on) return;
      if (run.endless) raise("endlessFloor", run.floor);
      if (run.won) {
        const c = run.player.characterId;
        if (run.hero) {
          mark("heroClear");
          if (c === "doctor") mark("heroDoctor");
          if (c === "apostle") mark("heroApostle");
        }
        if (run.arenaLv) mark("arenaClear");
        if (run.lastBoss === "dragon") mark("dragonClear");
        if (!run.hero && !run.arenaLv && !run.endless && run.tick <= 7 * 60 * TICK_RATE) mark("clear7");
      }
      flushUnlockStats();
    },
  };
}
