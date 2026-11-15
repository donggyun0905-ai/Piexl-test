// 프롤로그(서기관·이름 묻기)를 봤는지 (docs/QUEST.md 2절) · 처음 '플레이'를 누르면 보여 줌, 기록이 있던 사람도 한 번
import { loadText, saveText } from "../storage";

const KEY = "prologueSeen";
export const prologueSeen = (): boolean => !!loadText(KEY);
export const markPrologue = (): void => saveText(KEY, "1");
