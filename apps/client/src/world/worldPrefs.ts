// 세계 지도 전용 설정 (이 기기에 저장, Esc 설정 창 WorldMenu에서 바꿈): 장소 이름표 늘 보기 · 구석 미니맵 · 확대 배율(마우스 휠)
import { loadText, saveText } from "../storage";

export interface WorldPrefs {
  names: boolean;
  mini: boolean;
  /** 0.6(넓게) ~ 1.8(가깝게) */
  zoom: number;
}

const KEY = "worldPrefs";
const DEF: WorldPrefs = { names: false, mini: true, zoom: 1 };
export const ZOOM_MIN = 0.6;
export const ZOOM_MAX = 1.8;

let cur: WorldPrefs = (() => {
  try {
    return { ...DEF, ...(JSON.parse(loadText(KEY) ?? "{}") as Partial<WorldPrefs>) };
  } catch {
    return { ...DEF };
  }
})();

export const worldPrefs = (): WorldPrefs => cur;
export function setWorldPrefs(p: Partial<WorldPrefs>): void {
  cur = { ...cur, ...p };
  saveText(KEY, JSON.stringify(cur));
}
