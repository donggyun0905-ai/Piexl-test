// 메인 화면 왼쪽 위 '앱 설치' 버튼. 앱으로 열려 있으면 숨김
// 안드로이드·PC 크롬·엣지: 브라우저 설치 창 / 아이폰·아이패드·그 밖: 설치 방법 안내
import { useState } from "react";
import type { TextKey } from "../i18n";
import { isInstalledApp, isIos, promptInstall, useCanPrompt } from "../install";
import { Icon } from "./Icon";
import { Modal } from "./Modal";

export function InstallButton({ t }: { t: (key: TextKey) => string }) {
  const [guide, setGuide] = useState(false);
  const canPrompt = useCanPrompt();
  if (isInstalledApp()) return null;

  const onClick = async () => {
    if (canPrompt && (await promptInstall())) return;
    setGuide(true);
  };

  return (
    <>
      <div className="topbar-left">
        <button type="button" className="icon-button" aria-label={t("installApp")} onClick={() => void onClick()}>
          <Icon name="download" />
          <span className="icon-button-label">{t("installApp")}</span>
        </button>
      </div>
      {guide && (
        <Modal title={t("installApp")} t={t} onClose={() => setGuide(false)}>
          <p>{t(isIos() ? "installGuideIos" : "installGuideOther")}</p>
          <p className="install-note">{t("installNote")}</p>
        </Modal>
      )}
    </>
  );
}
