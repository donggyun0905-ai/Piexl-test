// 패왕전 연습장: 3대3 경기장에 나 혼자(우리 편 AI 없음) · 상대 셋은 허수아비 (그 캐릭터 그대로)
// 판이 끝나지 않음: 쓰러지면 체력이 바로 다시 참 · 스킬 대기 없음을 켜면 스킬을 계속 씀 · 허수아비는 가만히 / 움직이기만 / 싸움
import type { CharacterId } from "../characters";
import { CHARACTER_IDS } from "../characters";
import type { PwArenaId } from "../paewangMaps";
import { createRng, deriveSeed } from "../rng";
import { allPlayers, eachSeat } from "./party";
import type { PwPractice } from "./paewangTypes";
import { createPvp } from "./pvp";
import { EMPTY_INPUT, type RunState, type TickInput } from "./types";

const DUMMY_GAP_X = 130;
const DUMMY_GAP_Y = 72;

/** 연습장 판 (dummies 없으면 시드로 무작위 캐릭터) */
export function createPractice(seed: number, characterId: CharacterId, arena?: PwArenaId, dummies?: readonly CharacterId[]): RunState {
  const rng = createRng(deriveSeed(seed, "pwPractice"));
  const foes = [0, 1, 2].map((k) => dummies?.[k] ?? rng.pick(CHARACTER_IDS));
  const s = createPvp(seed, "trio", [{ characterId }, null, null, ...foes.map((c) => ({ characterId: c, ai: true }))], arena);
  const pv = s.pvp!;
  pv.seats[1]!.on = pv.seats[2]!.on = false;
  pv.practice = { dummy: "still", noCd: true };
  // 허수아비는 내 앞에 세로로 셋 (멀리 가지 않아도 바로 써 보게)
  const all = allPlayers(s);
  all.slice(3).forEach((d, k) => {
    d.x = d.prevX = all[0]!.x + DUMMY_GAP_X;
    d.y = d.prevY = all[0]!.y + (k - 1) * DUMMY_GAP_Y;
  });
  return s;
}

/** 허수아비 입력: 가만히는 아무것도 안 함 · 움직이기만은 공격·스킬·아이템 없이 */
export function dummyInput(pr: PwPractice, input: TickInput): TickInput {
  if (pr.dummy === "still") return EMPTY_INPUT;
  if (pr.dummy === "move") return { ...input, attack: false, skill: 0, useSlot: 0, autoAim: true };
  return input;
}

/** 쓰러지기 전에 체력을 다시 채움 · 사람 자리 스킬 대기 없앰 (stepPvp가 피해를 옮긴 뒤 부름) */
export function practiceTick(s: RunState): void {
  const pv = s.pvp!;
  const pr = pv.practice;
  if (!pr) return;
  eachSeat(s, (i) => {
    const p = s.player;
    if (!pv.seats[i]!.on) return;
    if (p.hp <= 0) p.hp = p.stats.maxHp;
    if (pr.noCd && pv.seats[i]!.human && p.pwCd) p.pwCd = [0, 0, 0, 0];
  });
}
