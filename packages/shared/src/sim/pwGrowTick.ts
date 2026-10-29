// 패왕전 성장 대결 한 틱 (pvp.stepPvp가 부름): 돈·집 회복 · 병사 무리 · 포탑 차례 · 병사·포탑·보스 · 장비 효과 · 쓰러진 것 보상 · 쟁탈전 규칙 · AI 장보기
import { PW_MODE } from "../paewangDefs";
import { PW_UNIT } from "../pwRules";
import { contestTick } from "./pwContest";
import { campDown, warTick } from "./pwWar";
import { gigaDrop, gigaTick } from "./pwGiga";
import { gearTick } from "./pwGear";
import { growEconomy, isGrow, reward, waveMul } from "./pwGrow";
import { botShop } from "./pwGrowBot";
import { laneTick, spawnWave } from "./pwLane";
import type { RunState } from "./types";
import { addEffect } from "./util";

export function growTick(s: RunState): void {
  const pv = s.pvp!;
  if (!isGrow(s) || pv.winner !== undefined || s.tick <= (pv.readyAt ?? 0)) return;
  const g = pv.grow!;
  growEconomy(s);
  if (s.tick >= g.waveAt) {
    if (g.waveAt > 0) spawnWave(s, waveMul(s), (team) => (g.owner === team ? PW_UNIT.wave.center : 1));
    g.waveAt = s.tick + PW_UNIT.wave.every;
  }
  // 뒤 포탑은 같은 길 앞 포탑이 부서져야 맞음
  for (const u of g.units) {
    if (u.kind !== "tower") continue;
    const back = !!u.order && g.units.some((v) => v.kind === "tower" && v.team === u.team && v.lane === u.lane && (v.order ?? 0) < u.order! && v.body.hp > 0);
    // 포탑 사거리 안에 상대 병사가 있어야 맞음 (사거리 긴 캐릭터가 혼자 멀리서 부수지 못하게)
    const r = PW_UNIT.tower.range + 16;
    const escort = g.units.some((v) => (v.kind === "minion" || v.kind === "archer") && v.team !== u.team && v.body.hp > 0 && (v.body.x - u.hx) ** 2 + (v.body.y - u.hy) ** 2 <= r * r);
    u.body.immune = back || !escort;
  }
  laneTick(s);
  gearTick(s);
  unitDeaths(s);
  if (PW_MODE[pv.mode].rule === "contest") contestTick(s);
  if (PW_MODE[pv.mode].rule === "war") warTick(s);
  if (PW_MODE[pv.mode].rule === "giganto") gigaTick(s);
  botShop(s);
}

/** 쓰러진 병사·포탑·보스: 막타 친 사람에게 돈·경험치 · 근처 같은 편 경험치 */
function unitDeaths(s: RunState): void {
  const g = s.pvp!.grow!;
  const keep = [];
  for (const u of g.units) {
    if (u.body.hp > 0) {
      keep.push(u);
      continue;
    }
    addEffect(s, { kind: "burst", x: u.body.x, y: u.body.y, dirX: 0, dirY: 0, size: u.body.r * 2, maxTicks: 16 });
    const kind = u.kind === "archer" ? "minion" : u.kind === "elite" ? "tower" : u.kind === "dragon" || u.kind === "godeater" || u.kind === "giantRed" || u.kind === "giantBlue" || u.kind === "giantWhite" ? "boss" : u.kind === "goblin" ? "tower" : u.kind;
    reward(s, u.body.lastHit, kind, u.body.x, u.body.y, u.team);
    if (u.kind === "boss") g.bossDown[u.team] = true;
    campDown(s, u);
    if (g.loot) gigaDrop(s, u.kind, u.body.x, u.body.y, u.id);
  }
  g.units = keep;
}
