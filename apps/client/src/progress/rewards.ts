// 퀘스트·보스 도전 보상: 로비 칩 · 1~2성 장신구 (2026-11-15 사용자) · 장신구 굴림은 기기 랜덤(accRnd, 게임 판 결과와 상관없음)
import { ACC_KINDS, ACC_SET_COUNT, addAcc, RING_BASES, rollOpts, type AccItem } from "@pixel-rogue/shared";
import { accRnd, loadBag, saveBag } from "../event/acc/accStore";
import { addChips } from "../lobby/chips";

/** 보상 수치 */
export const REWARD_RULES = {
  /** 최종보스를 잡으면: 칩 · 장신구 개수(최소~최대) · 2성이 나올 확률 */
  bossChips: 3000,
  bossAcc: [1, 2] as const,
  star2: 0.35,
  /** 서브 퀘스트: 사냥터 · 필드 보스 · 최종보스(잡은 보상과 따로) */
  subChips: 300,
  subBossChips: 1000,
  subFinalChips: 2000,
  /** 긴급(일일) 퀘스트 하나 */
  dailyChips: 200,
};

export interface Reward {
  chips: number;
  acc: AccItem[];
}

/** 1~2성 장신구 n개를 가방에 넣음 */
function giveAcc(n: number): AccItem[] {
  const bag = loadBag();
  const items = Array.from({ length: n }, (): Omit<AccItem, "uid"> => {
    const kind = ACC_KINDS[Math.floor(accRnd() * ACC_KINDS.length)]!;
    const star = accRnd() < REWARD_RULES.star2 ? 2 : 1;
    return { kind, set: Math.floor(accRnd() * ACC_SET_COUNT), star, lv: 0, opts: rollOpts(accRnd), ...(kind === "ring" ? { ringBase: Math.floor(accRnd() * RING_BASES.length) } : {}) };
  });
  const out = addAcc(bag, items);
  saveBag(bag);
  return out;
}

export function giveReward(chips: number, acc = 0): Reward {
  if (chips > 0) addChips(chips);
  return { chips, acc: acc > 0 ? giveAcc(acc) : [] };
}

/** 최종보스를 잡은 보상 */
export const bossReward = (): Reward => {
  const [lo, hi] = REWARD_RULES.bossAcc;
  return giveReward(REWARD_RULES.bossChips, lo + Math.floor(accRnd() * (hi - lo + 1)));
};
