// 설정 (이 기기에 저장): 효과음·음악 크기, 진동, 화면 흔들림, 능력치 보기, 공격 사거리 보기, 피해 숫자 보기, 맞는 범위 보기, 모바일 조작키 크기·위치
import { useSyncExternalStore } from "react";
import { loadText, saveText } from "./storage";

export interface Settings {
  /** 0~1 */
  sfx: number;
  music: number;
  vibration: boolean;
  shake: boolean;
  /** 게임 화면에 내 능력치 수치를 보여 줌 */
  showStats: boolean;
  /** 캐릭터의 실제 맞는 범위를 늘 보여 줌 (끄면 Space·버튼을 누르는 동안만) */
  showHitbox: boolean;
  /** 내 공격 사거리 원을 보여 줌 (적이 다가올수록 진해짐) */
  showRange: boolean;
  /** 적에게 들어간 피해를 숫자로 띄움 */
  showDamage: boolean;
  /** 모바일 오른쪽 아래 버튼 크기 배율 */
  buttonScale: number;
  /** 모바일 조이스틱 크기 배율 */
  stickScale: number;
  /** 모바일 버튼을 기본 자리에서 옮긴 거리 [화면 너비 비율, 화면 높이 비율] (화면을 돌려도 비슷한 자리에 있게 비율로) */
  buttonPos: Partial<Record<TouchButtonId, [number, number]>>;
}

/** 모바일 버튼 (TouchButtons의 data-act) */
export type TouchButtonId = "dash" | "use1" | "use2" | "interact" | "hitbox";

const DEFAULTS: Settings = {
  sfx: 0.6,
  music: 0.35,
  vibration: true,
  shake: true,
  showStats: false,
  showHitbox: false,
  showRange: true,
  showDamage: true,
  buttonScale: 1,
  stickScale: 1,
  buttonPos: {},
};

function read(): Settings {
  try {
    const raw = loadText("settings");
    return raw ? { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Settings>) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

let current = read();
applyScaleVars();

/** 조작키 크기를 CSS 변수로 (styles/touch.css·game.css가 씀) */
function applyScaleVars(): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement.style;
  root.setProperty("--button-scale", String(current.buttonScale));
  root.setProperty("--stick-scale", String(current.stickScale));
}
const listeners = new Set<() => void>();

export function getSettings(): Settings {
  return current;
}

export function setSettings(patch: Partial<Settings>): void {
  current = { ...current, ...patch };
  saveText("settings", JSON.stringify(current));
  applyScaleVars();
  for (const fn of listeners) fn();
}

export function useSettings(): Settings {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    getSettings,
  );
}
