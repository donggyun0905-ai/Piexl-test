// 패왕전 대결 방법 안내: 대결 고르기 화면의 버튼 · 처음 들어오면 한 번 저절로 열림 (목표·조작·화면 보기·경기장·요령)
import { useState } from "react";
import type { TextKey } from "../i18n";
import { Modal } from "../menu/Modal";
import { loadText, saveText } from "../storage";

const SEEN = "pwGuideSeen2";
const PARTS: readonly [TextKey, TextKey][] = [
  ["pwGuideGoalH", "pwGuideGoal"],
  ["pwGuideKeysH", "pwGuideKeys"],
  ["pwGuideSeeH", "pwGuideSee"],
  ["pwGuideFieldH", "pwGuideField"],
  ["pwGuideTipH", "pwGuideTip"],
];

export function PwGuide({ t }: { t: (k: TextKey) => string }) {
  const [open, setOpen] = useState(() => loadText(SEEN) !== "1");
  const close = () => {
    saveText(SEEN, "1");
    setOpen(false);
  };
  return (
    <>
      <button type="button" className="pw-guide-btn" onClick={() => setOpen(true)}>
        ❓ {t("pwGuide")}
      </button>
      {open && (
        <Modal title={t("pwGuide")} t={t} onClose={close} className="pw-guide">
          {PARTS.map(([h, body]) => (
            <section key={h}>
              <h3>{t(h)}</h3>
              <ul>
                {t(body)
                  .split(" · ")
                  .map((line) => (
                    <li key={line}>{line}</li>
                  ))}
              </ul>
            </section>
          ))}
        </Modal>
      )}
    </>
  );
}
