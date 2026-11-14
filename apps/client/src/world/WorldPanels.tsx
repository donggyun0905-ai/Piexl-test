// 세계 지도 위에 뜨는 큰 창: 게임 상점(가게 주인) · 대장간 메뉴(레이드 장신구 장비창·승급·강화·재설정) · 장비창(B, 왼쪽에 나라 지도) · 나라 지도(M) · 캐릭터 고르기(C) · 모드 고르기(기억의 탑 무한 모드·영웅의 길, 콜로세움 패왕전)
// 모두 Esc로 닫힘 (안쪽에 작은 창이 떠 있으면 그 창만 닫힘)
import type { CharacterId } from "@pixel-rogue/shared";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { CharacterSelect } from "../CharacterSelect";
import { AccForge, type ForgeMode } from "../event/acc/AccForge";
import { AccWindow } from "../event/acc/AccWindow";
import { useAccEsc } from "../event/acc/accStore";
import type { Lang, TextKey } from "../i18n";
import { FEATURE_STAGE, featureOpen } from "../progress/storyStage";
import { ShopScreen, type ShopTab } from "../shop/ShopScreen";
import { WorldMapModal, WorldMapView } from "./WorldMapView";
import type { Place, Region } from "./worldPlaces";

export type WorldPanel = { k: "shop"; tab: ShopTab } | { k: "smith" } | { k: "gear" } | { k: "map" } | { k: "char" } | { k: "gate"; gate: "tower" | "colosseum" };
/** 지도에서 들어가는 혼자 하기 종류 (장신구 없음, 메인 화면에서 들어간 것과 같음) */
export type WorldRun = "solo" | "endless" | "hero" | "paewang";

/** 모드 고르는 곳: 기억의 탑(무한 모드·영웅의 길) · 콜로세움(패왕전) — 스토리에서 아직 안 열린 모드는 누를 수 없음 */
const GATES = {
  tower: { icon: "🗼", name: "wpTower", text: "wpTowerText", modes: [{ m: "endless", f: "endless", label: "endlessRun" }, { m: "hero", f: "hero", label: "heroRun" }] },
  colosseum: { icon: "🏟", name: "wpColosseum", text: "wpColosseumText", modes: [{ m: "paewang", f: "paewang", label: "paewang" }] },
} as const;

interface Props {
  panel: WorldPanel;
  t: (k: TextKey) => string;
  lang: Lang;
  onClose: () => void;
  onChar: (c: CharacterId) => void;
  onRun: (m: WorldRun) => void;
  /** 나라 지도: 지금 나라 필드 · 이름 · 건물 안이면 들어온 문 앞 · 이동석 눌러 순간 이동 */
  map: { regionId: string; region: Region; title: string; me: readonly [number, number] | null; onGo: (p: Place) => void };
}

/** 화면 가득 덮는 창 (상점·캐릭터 고르기): 안에 작은 창(role=dialog)이 없을 때만 Esc로 닫힘 */
function Cover({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  });
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && !ref.current?.querySelector('[role="dialog"]') && close.current();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);
  return (
    <div ref={ref} className="world-cover">
      {children}
    </div>
  );
}

/** 대장간: 장비창·승급·강화·재설정 */
function SmithMenu({ t, onClose }: { t: (k: TextKey) => string; onClose: () => void }) {
  const [gear, setGear] = useState(false);
  const [forge, setForge] = useState<ForgeMode | null>(null);
  useAccEsc(() => !gear && !forge && onClose());
  if (gear) return <AccWindow t={t} onClose={() => setGear(false)} />;
  if (forge) return <AccForge t={t} mode={forge} start={null} onClose={() => setForge(null)} onChanged={() => undefined} />;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal world-note" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h3>🔨 {t("wpSmithy")}</h3>
        <p>{t("wpSmithMenu")}</p>
        <div className="world-warps">
          <button type="button" className="secondary" onClick={() => setGear(true)}>
            🎒 {t("accGear")}
          </button>
          <button type="button" className="secondary" onClick={() => setForge("promote")}>
            ⬆ {t("accPromote")}
          </button>
          <button type="button" className="secondary" onClick={() => setForge("enhance")}>
            ✦ {t("accEnhance")}
          </button>
          <button type="button" className="secondary" onClick={() => setForge("reroll")}>
            ⟳ {t("accReroll")}
          </button>
        </div>
        <button type="button" className="ghost" onClick={onClose}>
          {t("close")}
        </button>
      </div>
    </div>
  );
}

function GateMenu({ t, gate, onClose, onRun }: { t: (k: TextKey) => string; gate: keyof typeof GATES; onClose: () => void; onRun: (m: WorldRun) => void }) {
  useAccEsc(onClose);
  const g = GATES[gate];
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal world-note" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h3>
          {g.icon} {t(g.name)}
        </h3>
        <p>{t(g.text)}</p>
        <div className="world-warps">
          {g.modes.map((x) => (
            <button key={x.m} type="button" className="primary" disabled={!featureOpen(x.f)} onClick={() => onRun(x.m)}>
              {t(x.label)}
              {!featureOpen(x.f) && ` · ${t("wpTowerLocked").replace("{n}", String(FEATURE_STAGE[x.f]))}`}
            </button>
          ))}
        </div>
        <button type="button" className="ghost" onClick={onClose}>
          {t("close")}
        </button>
      </div>
    </div>
  );
}

export function WorldPanels({ panel, t, lang, onClose, onChar, onRun, map }: Props) {
  const { title, ...m } = map;
  if (panel.k === "gate") return <GateMenu t={t} gate={panel.gate} onClose={onClose} onRun={onRun} />;
  if (panel.k === "map") return <WorldMapModal t={t} title={title} onClose={onClose} {...m} />;
  if (panel.k === "gear")
    return (
      <AccWindow
        t={t}
        onClose={onClose}
        side={
          <aside className="wm-side">
            <h3>
              🗺 {t("wmTitle")} · {title}
            </h3>
            <WorldMapView t={t} {...m} />
          </aside>
        }
      />
    );
  if (panel.k === "smith") return <SmithMenu t={t} onClose={onClose} />;
  if (panel.k === "shop")
    return (
      <Cover onClose={onClose}>
        <ShopScreen lang={lang} t={t} start={panel.tab} onBack={onClose} />
      </Cover>
    );
  return (
    <Cover onClose={onClose}>
      <CharacterSelect t={t} showSeed={false} practice onBack={onClose} onSelect={(c) => onChar(c)} />
    </Cover>
  );
}
