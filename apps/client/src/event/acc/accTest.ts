// 시험 서버 전용 (TEST_OPEN, 라이브 main에선 꺼짐): 장비창에 모든 장신구 채우기
// 세트 10 × 종류 4마다 1·2·3·5성 하나씩 + 4성 넷(5성 승급 재료) · 반지는 기본 능력치 세 가지 모두 · 전설 5개 하나씩
import { ACC_KINDS, ACC_LEGENDS, ACC_RULES, ACC_SET_COUNT, addAcc, rollOpts, RING_BASES, type AccBag, type AccItem } from "@pixel-rogue/shared";
import { TEST_OPEN } from "../../testFlags";
import { loadText, saveText } from "../../storage";
import { accRnd, loadBag, saveBag } from "./accStore";

const KEY = "raidAccTestFill";

export function fillAll(bag: AccBag): void {
  const list: Omit<AccItem, "uid">[] = [];
  for (let set = 0; set < ACC_SET_COUNT; set++)
    for (const kind of ACC_KINDS) {
      const bases = kind === "ring" ? RING_BASES.map((_, i) => i) : [undefined];
      for (const ringBase of bases)
        for (const star of [1, 2, 3, 4, 4, 4, 4, 5])
          list.push({ kind, set, star, lv: 0, opts: rollOpts(accRnd), ...(ringBase !== undefined ? { ringBase } : {}) });
    }
  ACC_LEGENDS.forEach((l, legend) => list.push({ kind: l.kind, set: -1, legend, star: ACC_RULES.enhanceFrom, lv: 0, opts: rollOpts(accRnd) }));
  addAcc(bag, list);
}

/** 시험 서버에서 장비창을 처음 열 때 한 번 채움 */
export function testFillOnce(): void {
  if (!TEST_OPEN || loadText(KEY)) return;
  const bag = loadBag();
  fillAll(bag);
  saveBag(bag);
  saveText(KEY, "1");
}
