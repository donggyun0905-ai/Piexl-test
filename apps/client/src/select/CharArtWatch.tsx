// 캐릭터를 새로 얻으면 일러스트를 띄움: 메인·캐릭터 선택 화면에 올 때(App이 noteScreen으로 알림)·칩으로 산 직후(askCharCheck) 찾아봄 · 여럿이면 하나씩
import type { CharacterId } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import { detectLang, type TextKey } from "../i18n";
import { TEXT } from "../i18n/text";
import { CHAR_CHECK, takeNewChars } from "./charArt";
import { CharArtReveal } from "./CharArtReveal";

/** 일러스트를 띄워도 되는 화면 (게임·대결 중에는 띄우지 않음) */
const CALM = new Set(["title", "select", "practiceSelect", "tutorialSelect"]);
const SCREEN = "pr-screen";
/** 지금 화면 이름 (알림보다 늦게 붙어도 알 수 있게) */
let current = "";
/** App이 그릴 때 지금 화면 이름을 적음 (이 창보다 먼저 그려져 첫 화면도 알 수 있음) */
export const screenNow = (name: string): void => void (current = name);
/** App이 화면을 바꾼 뒤 알림 */
export const noteScreen = (name: string): boolean => window.dispatchEvent(new CustomEvent(SCREEN, { detail: name }));

const t = (k: TextKey): string => TEXT[k][detectLang()];

export function CharArtWatch() {
  const [calm, setCalm] = useState(() => CALM.has(current));
  const [queue, setQueue] = useState<CharacterId[]>([]);
  useEffect(() => {
    const onScreen = (e: Event) => setCalm(CALM.has((e as CustomEvent<string>).detail));
    window.addEventListener(SCREEN, onScreen);
    return () => window.removeEventListener(SCREEN, onScreen);
  }, []);
  useEffect(() => {
    if (!calm) return;
    const check = () => {
      const fresh = takeNewChars();
      if (fresh.length) setQueue((q) => [...q, ...fresh.filter((c) => !q.includes(c))]);
    };
    check();
    window.addEventListener(CHAR_CHECK, check);
    return () => window.removeEventListener(CHAR_CHECK, check);
  }, [calm]);
  const c = calm ? queue[0] : undefined;
  return c ? <CharArtReveal t={t} c={c} fresh onClose={() => setQueue((q) => q.slice(1))} /> : null;
}
