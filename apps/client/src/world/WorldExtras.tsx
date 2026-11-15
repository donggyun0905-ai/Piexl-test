// 세계 지도 편의 기능 묶음 (WorldMode에서 뗌): Esc 설정 · H 조작키 · G 자동 걷기 · 구석 미니맵 · 획득 알림
import { useCallback, useState } from "react";
import type { Lang, TextKey } from "../i18n";
import { AutoWalk } from "./QuestHud";
import { WorldCornerMini } from "./WorldCornerMini";
import { WorldKeys } from "./WorldKeys";
import { WorldMenu } from "./WorldMenu";
import type { AutoState } from "./worldPath";
import { worldPrefs } from "./worldPrefs";
import { WorldToasts } from "./WorldToasts";

/** 창 상태 · 자동 걷기 요청 번호 (지역이 바뀌면 자동 걷기 표시는 처음부터) */
export function useWorldExtras(region: string) {
  const [menu, setMenu] = useState(false);
  const [keys, setKeys] = useState(false);
  const [autoN, setAutoN] = useState(0);
  // 어느 지역에서 받은 상태인지 같이 (다른 지역이면 없음)
  const [st, setSt] = useState<{ r: string; s: AutoState } | null>(null);
  const autoSt = st?.r === region ? st.s : null;
  const setAutoSt = useCallback((s: AutoState) => setSt({ r: region, s }), [region]);
  /** Esc·H·G (다른 창이 없을 때 WorldMode 키 처리에서) · 처리했으면 true */
  const key = useCallback((e: KeyboardEvent): boolean => {
    if (e.key === "Escape") setMenu(true);
    else if (e.code === "KeyH") setKeys(true);
    else if (e.code === "KeyG") setAutoN((n) => n + 1);
    else return false;
    return true;
  }, []);
  return {
    menu, setMenu, keys, setKeys, autoN, autoSt, setAutoSt,
    /** 창이 떠 있음 (걷기 멈춤) */
    open: menu || keys,
    go: () => setAutoN((n) => n + 1),
    key,
  };
}

interface Props {
  t: (k: TextKey) => string;
  lang: Lang;
  x: ReturnType<typeof useWorldExtras>;
  regionId: string;
  /** 지도가 다 받아졌고 다른 창이 없음 */
  ready: boolean;
  busy: boolean;
  field: boolean;
  mark: string | null;
  onMap: () => void;
  onExit: () => void;
}

export function WorldExtras({ t, lang, x, regionId, ready, busy, field, mark, onMap, onExit }: Props) {
  return (
    <>
      {ready && !busy && mark && <AutoWalk t={t} state={x.autoSt} onGo={x.go} />}
      {ready && field && worldPrefs().mini && <WorldCornerMini key={regionId} t={t} regionId={regionId} mark={mark} onOpen={onMap} />}
      <WorldToasts />
      {x.keys && <WorldKeys t={t} onClose={() => x.setKeys(false)} />}
      {x.menu && <WorldMenu t={t} lang={lang} onClose={() => x.setMenu(false)} onExit={onExit} />}
    </>
  );
}
