// 세계 지도 위에 뜨는 큰 창: 게임 상점(가게 주인) · 대장간 메뉴(레이드 장신구 장비창·승급·강화·재설정) · 장비창(B) · 캐릭터 고르기(C) · 기억의 탑(무한 모드·영웅의 길)
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

export type WorldPanel = { k: "shop"; tab: ShopTab } | { k: "smith" } | { k: "gear" } | { k: "char" } | { k: "tower" };
/** 지도에서 들어가는 혼자 하기 종류 (장신구 없음, 메인 화면에서 들어간 것과 같음) */
export type WorldRun = "solo" | "endless" | "hero";

interface Props {
  panel: WorldPanel;
  t: (k: TextKey) => string;
  lang: Lang;
  onClose: () => void;
  onChar: (c: CharacterId) => void;
  onRun: (m: WorldRun) => void;
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

/** 기억의 탑: 무한 모드 · 영웅의 길 (스토리에서 아직 안 열렸으면 누를 수 없음) */
function TowerMenu({ t, onClose, onRun }: { t: (k: TextKey) => string; onClose: () => void; onRun: (m: WorldRun) => void }) {
  useAccEsc(onClose);
  const modes = [
    { m: "endless", f: "endless", label: "endlessRun" },
    { m: "hero", f: "hero", label: "heroRun" },
  ] as const;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal world-note" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h3>🗼 {t("wpTower")}</h3>
        <p>{t("wpTowerText")}</p>
        <div className="world-warps">
          {modes.map((x) => (
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

export function WorldPanels({ panel, t, lang, onClose, onChar, onRun }: Props) {
  if (panel.k === "tower") return <TowerMenu t={t} onClose={onClose} onRun={onRun} />;
  if (panel.k === "gear") return <AccWindow t={t} onClose={onClose} />;
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
