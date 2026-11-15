// 처음 장비 (2026-11-15 사용자): 퀘스트 모드(지도)에서 한 번만 1성 장신구 6개(반지 3·목걸이·귀걸이·브로치)를 주고 빈 칸에 끼움
// 장신구는 레이드에서만 나오는데 1~9장 동안 레이드가 닫혀 있어서, 지도 사냥(투력)에 쓸 첫 장비 · 추가 능력치는 누구나 같게 공격%·방어·체력 3줄, 값은 가장 낮게 (ACC_OPTIONS 0·2·8번)
import { ACC_SLOTS, addAcc, equip, type AccItem } from "@pixel-rogue/shared";
import { loadBag, saveBag } from "../event/acc/accStore";
import { hasFlag, questMode, setFlag } from "./quest";

const FLAG = "starterAcc";

/** 줄 장신구: 반지는 세트를 달리해서(같은 장신구는 한 번만 낌) 공격·방어·공격 속도 하나씩 */
function kit(): Omit<AccItem, "uid">[] {
  const low = (): [number, number][] => [
    [0, 0],
    [2, 0],
    [8, 0],
  ];
  const ring = (set: number, ringBase: number): Omit<AccItem, "uid"> => ({ kind: "ring", set, star: 1, lv: 0, ringBase, opts: low() });
  const one = (kind: "necklace" | "earring" | "brooch"): Omit<AccItem, "uid"> => ({ kind, set: 0, star: 1, lv: 0, opts: low() });
  return [ring(0, 0), ring(1, 1), ring(2, 2), one("necklace"), one("earring"), one("brooch")];
}

/** 아직 안 받았으면 주고 빈 칸에 끼움 · 줬으면 true */
export function grantStarterKit(): boolean {
  if (!questMode() || hasFlag(FLAG)) return false;
  const bag = loadBag();
  for (const it of addAcc(bag, kit())) {
    const slot = ACC_SLOTS.findIndex((k, i) => k === it.kind && bag.slots[i] === null);
    if (slot >= 0) equip(bag, slot, it.uid);
  }
  saveBag(bag);
  setFlag(FLAG);
  return true;
}
