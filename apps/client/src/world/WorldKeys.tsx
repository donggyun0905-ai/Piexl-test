// 지도 조작키 안내 창 (H · HUD 버튼, Esc·바깥 누르면 닫힘) · 키 이름은 언어와 상관없는 기호로
import type { TextKey } from "../i18n";
import { Modal } from "../menu/Modal";

const ROWS: readonly (readonly [string, TextKey])[] = [
  ["WASD · ↑↓←→", "wkMove"],
  ["Shift", "wkRun"],
  ["🖱L · J", "wkAttack"],
  ["🖱R · K", "wkDash"],
  ["F · Space · Enter", "wkUse"],
  ["B · C · M · Tab", "wkPanels"],
  ["🖱 ⇕", "wkWheel"],
  ["Esc", "wkEsc"],
  ["G", "wkGo"],
  ["H", "wkHelp"],
];

export function WorldKeys({ t, onClose }: { t: (k: TextKey) => string; onClose: () => void }) {
  return (
    <Modal title={t("wkTitle")} t={t} onClose={onClose}>
      <dl className="world-keys">
        {ROWS.map(([k, v]) => (
          <div key={v}>
            <dt>{k}</dt>
            <dd>{t(v)}</dd>
          </div>
        ))}
      </dl>
    </Modal>
  );
}
