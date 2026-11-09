// 보스 행동: 강철 거구·무리 여왕·공허의 눈 (나머지 보스는 bossKit.BOSS_AI). 층마다 보스방(계단방)에 하나. 탄 방향은 16방향 고정 값으로 계산 (삼각함수 없음)
import { lateBossHp } from "./foeScale";
import { ROOM_WIDTH } from "../constants";
import { ENEMIES } from "../content";
import { createRng, deriveSeed } from "../rng";
import type { BossKind } from "../content";
import type { EnemyState, RunState } from "./types";
import { depth } from "./hero";
import { partyHpMul } from "./party";
import { tabooUp } from "./taboo";
import { fan, half, ring } from "./bossKit";
import { updateArcher, updateKnight } from "./bossesOne";
import { updateCentaur, updatePlant, updateSiren } from "./bossesTwo";
import { updateReaper, updateSwordGod } from "./bossesThree";
import { updateAngel } from "./bossAngel";
import { updateDragon } from "./bossDragon";
import { updateHades } from "./bossHades";
import { updateLight } from "./bossLight";
import { updateDark } from "./bossDark";
import { updateUmbra } from "./bossUmbra";
import { updateWorm } from "./bossWorm";
import { updateScorpion } from "./bossScorpion";
import { updateRoc } from "./bossRoc";
import { updateDemigod } from "./bossDemigod";
import { updateSage } from "./bossSage";
import { updateToad } from "./bossToad";
import { updateGateProp, updateGatekeeper } from "./bossGatekeeper";
import { updateTwin } from "./bossTwins";
import { updateMoonEater, updateMoonShard } from "./bossMoonEater";
import { updateSalamander } from "./bossSalamander";
import { updateJelly } from "./bossJelly";
import { updateCaptain } from "./bossCaptain";
import { updateCerberus } from "./bossCerberus";
import { updateCerbTrio } from "./bossCerbTrio";
import { updateLeviathan } from "./bossLeviathan";
import { updateLevWhale } from "./bossLevWhale";
import { updateLevKing } from "./bossLevKing";
import { updateAsmo } from "./bossAsmo";
import { updateLucifer } from "./lucifer";
import { updatePillar } from "./lucPillars";
import { updateFlame, updateShade } from "./lucDark";
import { updateSword } from "./lucSwords";
import { makeEnemy, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";

/** 보스 체력 배율 (층마다 늘어남) */
export function bossHpMul(floor: number): number {
  return 1 + 0.25 * (floor - 1);
}

type BossAi = (s: RunState, e: EnemyState, toP: readonly [number, number], go: readonly [number, number], spawned: EnemyState[]) => void;
const BOSS_AI: Partial<Record<EnemyState["kind"], BossAi>> = {
  knight: updateKnight,
  archer: updateArcher,
  siren: updateSiren,
  centaur: updateCentaur,
  plant: updatePlant,
  reaper: updateReaper,
  swordgod: updateSwordGod,
  archangel: updateAngel,
  dragon: updateDragon,
  godeater: updateHades,
  plight: updateLight,
  pdark: updateDark,
  umbra: updateUmbra,
  sandworm: (s, e, toP, _go, spawned) => updateWorm(s, e, toP, spawned),
  scorpion: (s, e, toP) => updateScorpion(s, e, toP, ENEMIES.scorpion.speed),
  roc: (s, e) => updateRoc(s, e),
  demigod: updateDemigod,
  sage: updateSage,
  // 시즌 2 새 보스
  toad: (s, e, toP) => updateToad(s, e, toP),
  salamander: (s, e, toP, go) => updateSalamander(s, e, toP, go),
  jelly: (s, e, toP, go) => updateJelly(s, e, toP, go),
  captain: updateCaptain,
  // 시즌 3 단계별 보스 (문·임프·달 조각도 여기서)
  gatekeeper: updateGatekeeper,
  hellgate: (s, e, _toP, go) => updateGateProp(s, e, go),
  imp: (s, e, _toP, go) => updateGateProp(s, e, go),
  twinlu: updateTwin,
  twinre: updateTwin,
  mooneater: updateMoonEater,
  moonshard: (_s, e) => updateMoonShard(e),
  // 시즌 3 라스트 보스 켈베로스 (페이즈 2 세 사람)
  cerberus: updateCerberus,
  cerbfist: (s, e, toP) => updateCerbTrio(s, e, toP),
  cerbflame: (s, e, toP) => updateCerbTrio(s, e, toP),
  cerbblade: (s, e, toP) => updateCerbTrio(s, e, toP),
  // 시즌 3 라스트 보스 레비아탄 (심해룡 → 고래 → 해왕)
  leviathan: updateLeviathan,
  levwhale: (s, e, toP) => updateLevWhale(s, e, toP),
  levking: (s, e, toP, _go, spawned) => updateLevKing(s, e, toP, spawned),
  // 시즌 3 라스트 보스 아스모데우스의 화신체 (체력 줄 ×100, 세 모습)
  asmodeus: (s, e, toP) => updateAsmo(s, e, toP),
  // 레이드 보스 루시퍼 · 석화의 기둥 · 악마의 불길 · 어둠의 세계 몬스터 (sim/lucifer·lucPillars·lucDark)
  lucifer: (s, e, toP, _go, spawned) => updateLucifer(s, e, toP, spawned),
  lucpillar: (s, e) => updatePillar(s, e),
  lucflame: (s, e, toP) => updateFlame(s, e, toP),
  lucshade: (s, e) => updateShade(s, e),
  lucsword: (s, e) => updateSword(s, e),
};

export function updateBoss(s: RunState, e: EnemyState, toP: readonly [number, number], go: readonly [number, number], spawned: EnemyState[]): void {
  const def = ENEMIES[e.kind];
  e.timer--;
  const ai = BOSS_AI[e.kind];
  if (ai) {
    ai(s, e, toP, go, spawned);
    // 라스트 보스 궁극기가 끝날 때까지는 무적
    if (e.ultAt !== undefined) e.immune = true;
    return;
  }
  if (e.kind === "hulk") {
    // 걷기 → 멈춰서 준비 → 돌진 → 멈출 때 사방으로 탄
    if (e.phase === "walk") {
      e.x += toP[0] * def.speed;
      e.y += toP[1] * def.speed;
      if (e.timer <= 0) {
        e.phase = "windup";
        e.timer = 40;
        e.dirX = toP[0];
        e.dirY = toP[1];
      }
    } else if (e.phase === "windup") {
      if (e.timer <= 0) {
        e.phase = "charge";
        e.timer = 30;
      }
    } else {
      e.x += e.dirX * 2.8;
      e.y += e.dirY * 2.8;
      if (e.timer <= 0) {
        ring(s, e, half(e) ? 1 : 2, e.count, 1.3);
        e.count++;
        e.phase = "walk";
        e.timer = half(e) ? 70 : 100;
      }
    }
  } else if (e.kind === "brood") {
    // 거리를 두고, 번갈아 기는 적 부르기 · 부채꼴 탄
    const dx = s.player.x - e.x;
    const dy = s.player.y - e.y;
    const d2 = dx * dx + dy * dy;
    const dir = d2 > 80 * 80 ? 1 : d2 < 60 * 60 ? -1 : 0;
    e.x += toP[0] * def.speed * dir;
    e.y += toP[1] * def.speed * dir;
    if (e.timer <= 0) {
      if (e.count % 2 === 0) {
        const minions = s.enemies.filter((m) => m.noGold && m.hp > 0).length + spawned.length;
        const hpMul = 1 + 0.15 * (depth(s) - 1);
        for (let i = 0; i < 2 && minions + i < 5; i++) {
          const m = makeEnemy(s, "crawler", e.x + (i === 0 ? -14 : 14), e.y, hpMul, 20);
          m.noGold = true;
          spawned.push(m);
        }
      } else {
        fan(s, e, toP, half(e) ? [-2, -1, 0, 1, 2] : [-1, 0, 1], 1.5);
      }
      e.count++;
      e.timer = half(e) ? 75 : 105;
    }
  } else {
    // seer: 천천히 다가오며 도는 고리 탄. 네 번째마다 깜빡이고 순간이동
    if (e.phase === "blink") {
      if (e.timer <= 0) {
        const rng = createRng(deriveSeed(s.seed, "floor", s.floor, "boss", e.count));
        for (let tries = 0; tries < 20; tries++) {
          e.x = rng.int(ROOM_MIN_X + 20, ROOM_MAX_X - 20);
          e.y = rng.int(ROOM_MIN_Y + 20, ROOM_MAX_Y - 20);
          const px = e.x - s.player.x;
          const py = e.y - s.player.y;
          if (px * px + py * py > 70 * 70) break;
        }
        e.prevX = e.x;
        e.prevY = e.y;
        e.phase = "walk";
        e.timer = 40;
      }
      return;
    }
    e.x += toP[0] * def.speed;
    e.y += toP[1] * def.speed;
    if (e.timer <= 0) {
      e.count++;
      if (e.count % 4 === 0) {
        e.phase = "blink";
        e.timer = 30;
        return;
      }
      ring(s, e, half(e) ? 1 : 2, e.count, 1.2);
      if (half(e)) fan(s, e, toP, [0], 2);
      e.timer = half(e) ? 55 : 70;
    }
  }
}

/** 보스방에 들어갔을 때: 보스 하나 (방 위쪽 가운데. 플레이어는 아래쪽 가운데에 놓임) */
export function spawnBoss(s: RunState, kind: BossKind): EnemyState {
  // 협동: 보스는 수 대신 체력만 조금 더
  return makeEnemy(s, kind, ROOM_WIDTH / 2, ROOM_MIN_Y + 20, bossHpMul(depth(s)) * lateBossHp(depth(s)) * partyHpMul(s) * tabooUp(s, "bossHp"), 90);
}
