// 프롤로그(서기관·이름 묻기)를 봤는지 (docs/QUEST.md 2절) · 처음 '플레이'를 누르면 보여 줌, 기록이 있던 사람도 한 번
import { loadText, saveText } from "../storage";
import { hasFlag, setFlag } from "./quest";

const KEY = "prologueSeen";
/** 봤는지 (이 기기 또는 서버 백업된 퀘스트 기록) */
export const prologueSeen = (): boolean => !!loadText(KEY) || hasFlag("prologue");
export function markPrologue(): void {
  saveText(KEY, "1");
  setFlag("prologue");
}
