// 도트 편집 페이지 (/pixel/). 두 모드:
// - 개발용 (/pixel/): 캐릭터·스킨·몬스터·아이콘·효과·탄 그림을 골라 찍고 PNG로 내려받음. '게임에 바로 써 보기'를 켜면 이 기기 게임에 바로 보임
// - 나만의 스킨 (/pixel/?my=캐릭터): 상점에서 산 칸에 직접 그림. 찍을 때마다 이 기기에 저장되고 그 기기 게임에 바로 나옴 (game/customArt.mySkinSrc)
// - 내 효과 (/pixel/?fx=1): 이벤트 상점에서 산 효과 그림을 고침. 이 기기 게임에 바로 나옴 (game/customArt.myFxKey)
import { CHARACTERS, type CharacterId } from "@pixel-rogue/shared";
import { useEffect, useRef, useState } from "react";
import { applyDrafts, setApplyDrafts } from "../game/customArt";
import { useLang, type TextKey } from "../i18n";
import { mySkinId } from "../shop/skins";
import { ownedSkins } from "../shop/wallet";
import { allAssets, gridOf, myAsset, myBases, myFxAssets, type Asset } from "./assets";
import { editableFx } from "../shop/effects";
import { Compare } from "./Compare";
import { loadDraft, removeDraft, saveDraft } from "./draft";
import { PixelTop } from "./PixelTop";
import { ColorPanel } from "./ColorPanel";
import { cellPixels, copyData, download, loadImage, OUTLINE, putCell, usedColors } from "./sheet";
import { TOOLS, ToolBar } from "./ToolBar";
import type { Tool } from "./tools";
import { useDrawing } from "./useDrawing";
import { CreatePanel } from "./CreatePanel";
import { creationAsset, isCreation, listCreations, saveCreation, type Creation } from "./create";
import { CellView, Preview, SheetView } from "./views";

const myParam = new URLSearchParams(window.location.search).get("my");
const MY = myParam && myParam in CHARACTERS ? (myParam as CharacterId) : null;
const FX = new URLSearchParams(window.location.search).has("fx");
const CREATE = new URLSearchParams(window.location.search).has("create");

export function PixelApp() {
  const { t } = useLang();
  // 한 번만 만듦 (언어를 바꿔도 고르던 그림이 그대로)
  const [assets] = useState(() => (MY ? [myAsset(MY)] : FX ? myFxAssets(editableFx(), t) : allAssets()));
  if (MY && !ownedSkins().includes(mySkinId(MY)))
    return (
      <div className="pixel-app">
        <h1>{t("pxMyTitle")}</h1>
        <p>{t("pxMyLocked")}</p>
        <a className="px-back" href={import.meta.env.BASE_URL}>
          {t("pxMyBack")}
        </a>
      </div>
    );
  if (FX && assets.length === 0)
    return (
      <div className="pixel-app">
        <h1>{t("pxFxTitle")}</h1>
        <p>{t("pxFxLocked")}</p>
        <a className="px-back" href={import.meta.env.BASE_URL}>
          {t("pxMyBack")}
        </a>
      </div>
    );
  return <Editor t={t} assets={assets} />;
}

function Editor({ t, assets: BUILT }: { t: (k: TextKey) => string; assets: Asset[] }) {
  const [bases] = useState(() => (MY ? myBases(MY, ownedSkins(), t) : null));
  // 창작 공간 (개발용 화면에서만): 만든 그림은 목록 맨 앞 묶음
  const dev = !MY && !FX;
  const [made, setMade] = useState<Creation[]>(() => (dev ? listCreations() : []));
  const [creating, setCreating] = useState(dev && CREATE);
  const [ASSETS] = useState(() => BUILT);
  const allList = [...made.map(creationAsset), ...ASSETS];
  const [asset, setAsset] = useState<Asset>(() => (dev && CREATE && made[0] ? creationAsset(made[0]) : ASSETS[0]!));
  /** 불러온 그림과 그 그림 이름 (고른 그림과 다르면 아직 불러오는 중) */
  const [loaded, setLoaded] = useState<{ id: string; data: ImageData } | null>(null);
  const data = loaded && loaded.id === asset.id ? loaded.data : null;
  const [draft, setDraft] = useState(false);
  const [version, setVersion] = useState(0);
  const [sel, setSel] = useState<[number, number]>([0, 0]);
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState(OUTLINE);
  const [grid, setGrid] = useState(true);
  /** 붓·지우개 굵기 · 좌우 대칭 · 확대 배율 (1 = 보통) */
  const [size, setSize] = useState(1);
  const [mirror, setMirror] = useState(false);
  const [scale, setScaleRaw] = useState(1);
  const setScale = (v: number) => setScaleRaw(Math.max(0.1, Math.min(32, v)));
  const [apply, setApply] = useState(applyDrafts);
  const past = useRef<ImageData[]>([]);
  const future = useRef<ImageData[]>([]);
  const [clip, setClip] = useState<(string | null)[] | null>(null);
  const g = data ? gridOf(asset, data) : null;
  /** 붓 가장 굵게 (큰 그림판은 더 굵게) */
  const maxBrush = g ? Math.max(6, Math.min(64, Math.round(Math.max(g.cw, g.ch) / 16))) : 6;

  const fetchArt = (a: Asset, fresh = false) => {
    past.current = [];
    future.current = [];
    const d = fresh || isCreation(a.id) ? null : loadDraft(a.id);
    (d ? loadImage(d) : a.load()).then((img) => {
      setLoaded({ id: a.id, data: img });
      setDraft(!!d);
      setVersion((v) => v + 1);
    }, () => setLoaded(null));
  };
  const open = (a: Asset, fresh = false) => {
    setAsset(a);
    setSel([0, 0]);
    fetchArt(a, fresh);
  };
  const [first] = useState(asset);
  useEffect(() => fetchArt(first), [first]);

  /** 바꾸기 전 기록 → 바꾸기 → 다시 그리기 · 초안 저장 */
  const change = (fn: (d: ImageData) => void, record = true) => {
    if (!data) return;
    if (record) {
      past.current.push(copyData(data));
      // 큰 그림은 되돌리기 기록을 적게 (모두 합쳐 약 64MB 안)
      if (past.current.length > Math.max(8, Math.min(80, Math.floor(64e6 / (data.data.length || 1))))) past.current.shift();
      future.current = [];
    }
    fn(data);
    setVersion((v) => v + 1);
    setDraft(true);
    store(data);
  };
  const store = (d: ImageData) => (isCreation(asset.id) ? saveCreation(asset.id, d) : saveDraft(asset.id, d));
  const swap = (from: React.MutableRefObject<ImageData[]>, to: React.MutableRefObject<ImageData[]>) => {
    const prev = from.current.pop();
    if (!prev || !data) return;
    to.current.push(copyData(data));
    data.data.set(prev.data);
    setVersion((v) => v + 1);
    store(data);
  };
  const undo = () => swap(past, future);
  const redo = () => swap(future, past);

  const { onStroke, preview } = useDrawing({ data, g, sel, tool, color, size, mirror, change, onPicked: (c) => (setColor(c), setTool("pen")) });

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
      const k = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && k === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if ((e.ctrlKey || e.metaKey) && k === "y") {
        e.preventDefault();
        redo();
      } else if (k === "m") setMirror((m) => !m);
      else if (k === "[") setSize(Math.max(1, size - 1));
      else if (k === "]") setSize(Math.min(maxBrush, size + 1));
      else if (k === "+" || k === "=") setScale(scale * 1.25);
      else if (k === "-") setScale(scale / 1.25);
      else {
        const tl = TOOLS.find((x) => x[2].toLowerCase() === k);
        if (tl) setTool(tl[0]);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });

  /** 다른 그림(PNG·바탕)을 같은 크기일 때만 통째로 넣음 (되돌리기 가능) */
  const replaceWith = (src: Promise<ImageData>) => {
    if (!data) return;
    src.then(
      (img) => (img.width === data.width && img.height === data.height ? change((d) => d.data.set(img.data)) : alert(t("pxBadSize").replace("{w}", String(data.width)).replace("{h}", String(data.height)))),
      () => alert(t("pxBadPng")),
    );
  };
  // 칸이 크면(창작 공간 512·1024 등) 한 픽셀이 화면 1칸보다 작게도 보임
  const fit = g ? 448 / Math.max(g.cw, g.ch) : 1;
  const zoom = fit >= 2 ? Math.max(2, Math.round(fit * scale)) : Math.max(0.05, fit * scale);
  const rowName = asset.rowKeys ? t(asset.rowKeys[sel[0]]!) : (asset.rowNames?.[sel[0]] ?? `${sel[0] + 1}`);

  return (
    <div className="pixel-app">
      <PixelTop
        t={t}
        bases={bases}
        fx={FX}
        assets={allList}
        asset={asset}
        onCreate={dev ? () => setCreating(true) : undefined}
        draft={draft}
        apply={apply}
        onOpen={(a) => open(a)}
        onBase={(a) => replaceWith(a.load())}
        onDownload={() => data && download(data, asset.file)}
        onUpload={(f) => f && replaceWith(loadImage(URL.createObjectURL(f)))}
        onReset={() => (isCreation(asset.id) ? change((d) => d.data.fill(0)) : (removeDraft(asset.id), open(asset, true)))}
        onApply={(on) => (setApplyDrafts(on), setApply(on))}
      />
      {!data || !g ? (
        <p>{t("pxLoading")}</p>
      ) : (
        <div className="px-main">
          <section className="px-left">
            <SheetView data={data} g={g} width={256} sel={sel} onPick={(r, c) => setSel([r, c])} version={version} />
            <p>
              {rowName} · {t("pxCellNo").replace("{n}", String(sel[1] + 1))}
            </p>
            <Preview data={data} g={g} row={sel[0]} version={version} />
            <div className="px-row">
              <button type="button" onClick={() => setClip(cellPixels(data, g, sel[0], sel[1]))}>
                {t("pxCopy")}
              </button>
              <button type="button" disabled={!clip || clip.length !== g.cw * g.ch} onClick={() => clip && change((d) => putCell(d, g, sel[0], sel[1], clip))}>
                {t("pxPaste")}
              </button>
              <button type="button" onClick={() => change((d) => putCell(d, g, sel[0], sel[1], cellPixels(d, g, sel[0], sel[1]), true))}>
                {t("pxFlip")}
              </button>
            </div>
          </section>
          <section className="px-center">
            <ToolBar t={t} maxSize={maxBrush} tool={tool} setTool={setTool} size={size} setSize={setSize} mirror={mirror} setMirror={setMirror} grid={grid} setGrid={setGrid} zoom={scale} setZoom={setScale} undo={undo} redo={redo} />
            <div
              className="px-canvas-wrap"
              onWheel={(e) => {
                if (e.ctrlKey || e.metaKey) {
                  e.preventDefault();
                  setScale(scale * (e.deltaY < 0 ? 1.15 : 1 / 1.15));
                }
              }}
            >
              <CellView data={data} g={g} r={sel[0]} c={sel[1]} zoom={zoom} grid={grid} guide={asset.guide} onStroke={onStroke} preview={preview} previewColor={color} mirror={mirror} version={version} />
            </div>
            <ColorPanel color={color} used={usedColors(data)} t={t} onPick={setColor} />
          </section>
          {asset.group !== "create" && <Compare key={asset.group} title={t("pxCompare")} list={bases ?? allList.filter((a) => a.group === asset.group)} sel={sel} onPick={(r, c) => setSel([r, c])} />}
        </div>
      )}
      {creating && <CreatePanel onClose={() => setCreating(false)} onList={setMade} onOpen={(c) => (setCreating(false), open(creationAsset(c)))} />}
    </div>
  );
}
