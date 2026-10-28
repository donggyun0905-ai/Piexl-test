// 패왕전 연습장: 3대3 경기장에 나 혼자(우리 편 AI 없음) · 상대 셋은 허수아비 (그 캐릭터 그대로)
// 판이 끝나지 않음: 쓰러지면 체력이 바로 다시 참 · 스킬 대기 없음을 켜면 스킬을 계속 씀 · 허수아비는 가만히 / 움직이기만 / 싸움
// 가만히·움직이기만일 때는 허수아비의 소환물·펫·장판도 나를 때리지 않음 (pvpWorld transfer가 practiceSafe를 봄)
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
  // 연습장은 시작 준비(3·2·1) 없이 바로
  pv.readyAt = 0;
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

/** 연습장에서 이 자리가 받는 피해·상태를 없앨지 (허수아비가 싸우지 않을 때 사람 자리) */
export const practiceSafe = (s: RunState, i: number): boolean => {
  const pr = s.pvp!.practice;
  return !!pr && pr.dummy !== "fight" && !!s.pvp!.seats[i]!.human;
};

/** 쓰러지기 전에 체력을 다시 채움 · 사람 자리 스킬 대기 없앰 (stepPvp가 피해를 옮긴 뒤 부름) */
export function practiceTick(s: RunState): void {
  const pv = s.pvp!;
  const pr = pv.practice;
  if (!pr) return;
  eachSeat(s, (i) => {
    const p = s.player;
    if (!pv.seats[i]!.on) return;
    // 화면에 0으로 보이는 체력(0.5 미만)도 쓰러짐이라 그 전에 채움 (settleDeaths)
    if (p.hp < 0.5) p.hp = p.stats.maxHp;
    if (pr.noCd && pv.seats[i]!.human && p.pwCd) p.pwCd = [0, 0, 0, 0];
  });
}
