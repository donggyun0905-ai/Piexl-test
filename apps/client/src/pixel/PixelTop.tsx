// 도트 편집 위쪽 줄: 그림 고르기(개발용) 또는 나만의 스킨 바탕 불러오기 · 내려받기·불러오기·원래대로 · 설명
import type { TextKey } from "../i18n";
import type { Asset } from "./assets";
import { GROUPS } from "./labels";
import { Picker } from "./Picker";

interface Props {
  t: (k: TextKey) => string;
  /** 나만의 스킨 모드면 바탕으로 불러올 그림들 (아니면 null = 개발용 전체 편집) */
  bases: Asset[] | null;
  /** 내 효과 모드 (이벤트 상점에서 산 효과 그림만) */
  fx: boolean;
  assets: Asset[];
  asset: Asset;
  draft: boolean;
  apply: boolean;
  onOpen: (a: Asset) => void;
  onBase: (a: Asset) => void;
  onDownload: () => void;
  onUpload: (f: File | undefined) => void;
  onReset: () => void;
  onApply: (on: boolean) => void;
  /** 창작 공간 창 열기 (개발용 화면에서만) */
  onCreate?: () => void;
}

export function PixelTop({ t, bases, fx, assets, asset, draft, apply, onOpen, onBase, onDownload, onUpload, onReset, onApply, onCreate }: Props) {
  const group = GROUPS.find((x) => x.id === asset.group)!;
  return (
    <>
      <header className="px-top">
        <h1>{fx ? t("pxFxTitle") : bases ? `${t("pxMyTitle")} · ${t(asset.id.slice(3) as TextKey)}` : t("pxTitle")}</h1>
        {fx ? (
          <select value={asset.id} onChange={(e) => onOpen(assets.find((x) => x.id === e.target.value)!)}>
            {assets.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        ) : bases ? (
          <label className="px-base">
            {t("pxMyBase")}
            <select value="" onChange={(e) => {
              const a = bases.find((x) => x.id === e.target.value);
              if (a && confirm(t("pxMyBaseAsk"))) onBase(a);
            }}>
              <option value="">—</option>
              {bases.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <Picker assets={assets} current={asset} onOpen={onOpen} />
        )}
        {onCreate && (
          <button type="button" className="px-make" onClick={onCreate}>
            🎨 창작 공간 (새 그림)
          </button>
        )}
        {draft && <span className="px-draft">{t("pxDrafting")}</span>}
        <button type="button" onClick={onDownload}>
          {t("pxDownload")}
        </button>
        <label className="px-file">
          {t("pxUpload")}
          <input type="file" accept="image/png" onChange={(e) => onUpload(e.target.files?.[0])} />
        </label>
        <button type="button" onClick={() => confirm(t("pxResetAsk")) && onReset()}>
          {t("pxReset")}
        </button>
        {bases || fx ? (
          <a className="px-back" href={import.meta.env.BASE_URL}>
            {t("pxMyBack")}
          </a>
        ) : (
          <label className="px-apply" title="켜면 이 기기에서 게임을 새로 열 때 고치는 중인 그림이 바로 보입니다 (다른 사람에게는 안 보임)">
            <input type="checkbox" checked={apply} onChange={(e) => onApply(e.target.checked)} /> 이 기기 게임에 바로 써 보기
          </label>
        )}
      </header>
      {fx ? (
        <p className="px-help">
          {t("pxFxHelp")} · {t("pxKeys")} · {t("pxKeys2")}
        </p>
      ) : bases ? (
        <>
          <p className="px-help">{t("pxMyHelp")}</p>
          <p className="px-help px-warn">{t("pxMyWarn")}</p>
          <p className="px-help">{t("pxKeys")} · {t("pxKeys2")}</p>
        </>
      ) : (
        <p className="px-help">
          <b>{group.label}</b>: {group.help}. {asset.place ? <>다 찍으면 'PNG 내려받기'로 받아 전달해 주세요 (넣을 자리: <code>{asset.place}</code>). </> : "PNG 내려받기로 파일로 받을 수 있습니다. "}
          {t("pxKeys")} · {t("pxKeys2")}
        </p>
      )}
    </>
  );
}
