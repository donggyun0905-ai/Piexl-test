// 기간토마키아 화면 정보: 배낭 10칸(한 칸은 금고, 누르면 금고와 바꿈) · 돈 · 제작할 수 있는 전설 장비(누르면 3초 가만히) · 미니맵(자기장·출구·나)
import { allPlayers, canCraft, GIGA_MENU, inPlay, isGiga, openLoot, PW_ARENAS, PW_LEGEND, pvpZone, TILE_SIZE, useSeat as takeSeat, type PwLoot, type RunState } from "@pixel-rogue/shared";
import { useEffect, useRef, useState } from "react";
import { GigaBag, GigaBox } from "./PwGigaWindows";
import type { Controls } from "../game/controls";
import { ItemIcon } from "../game/itemIcon";
import type { Lang, TextKey } from "../i18n";
import { itemName } from "../i18n/items";
import { gearItem, gearLines, gearName } from "./pwGearView";

interface Props {
  run: RunState;
  me: number;
  lang: Lang;
  t: (k: TextKey) => string;
  controls: () => Controls | null;
}

const LEGENDS = Object.keys(PW_LEGEND);
/** 배낭 물건 그림·이름: 장비(패시브 그림) · 사용 아이템 u: · 상점 물건 g: */
export function Item({ id, lang, t }: { id: string; lang: Lang; t: (k: TextKey) => string }) {
  if (id.startsWith("g:")) return <span className="pw-giga-goods" title={t(`pwGoods_${id.slice(2)}` as TextKey)}>🎁</span>;
  const use = id.startsWith("u:");
  const key = use ? id.slice(2) : id;
  return (
    <span title={use ? itemName("use", key, lang) : `${gearName(key, lang)}\n${gearLines(key, t).join("\n")}`}>
      <ItemIcon item={use ? ({ kind: "use", id: key } as never) : gearItem(key, lang)} size={22} />
    </span>
  );
}

function MiniMap({ run, me }: { run: RunState; me: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const a = PW_ARENAS[run.pvp!.arena];
  const k = 0.6;
  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    const px = (v: number) => (v / TILE_SIZE) * k;
    ctx.fillStyle = "rgba(20, 30, 20, 0.85)";
    ctx.fillRect(0, 0, a.cols * k, a.rows * k);
    const z = pvpZone(run);
    if (z) {
      ctx.strokeStyle = "#8ac8ff";
      ctx.beginPath();
      ctx.arc(px(z.x), px(z.y), px(z.r), 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = "#ffffff";
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.arc(px(z.tx), px(z.ty), px(z.tr), 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    for (const e of run.pvp!.grow?.exits ?? []) {
      ctx.fillStyle = "#6af0a0";
      ctx.fillRect(px(e.x) - 3, px(e.y) - 3, 6, 6);
    }
    const p = allPlayers(run)[me]!;
    ctx.fillStyle = "#ffe040";
    ctx.fillRect(px(p.x) - 2, px(p.y) - 2, 4, 4);
  });
  return <canvas ref={ref} className="pw-giga-map" width={a.cols * k} height={a.rows * k} aria-hidden="true" />;
}

/** 내 자리 기준: 제작할 수 있는 것 · 돈 · 열어 둔 상자 (보던 자리로 돌려놓음) */
export function gigaView(run: RunState, me: number): { craft: string[]; gold: number; open: PwLoot | undefined } {
  const back = run.seat ?? 0;
  takeSeat(run, me);
  const out = { craft: LEGENDS.filter((id) => canCraft(run, id)), gold: run.gold, open: openLoot(run) };
  takeSeat(run, back);
  return out;
}

export function PwGigaHud({ run, me, lang, t, controls }: Props) {
  const [bag, setBag] = useState(false);
  const [boxShut, setBoxShut] = useState<number | null>(null);
  const state = useRef({ bag: false, box: false });
  const giga = isGiga(run);
  const v = giga ? gigaView(run, me) : null;
  const box = v?.open && v.open.id !== boxShut ? v.open : undefined;
  useEffect(() => {
    state.current = { bag, box: !!box };
  }, [bag, box]);
  useEffect(() => {
    // B: 배낭 · Esc: 열린 상자·배낭 창만 닫음 (나가기 확인 창이 뜨지 않게 먼저 받음)
    const key = (e: KeyboardEvent) => {
      if (!giga || e.repeat) return;
      if (e.code === "KeyB") setBag((x) => !x);
      if (e.code === "Escape" && (state.current.bag || state.current.box)) {
        e.stopImmediatePropagation();
        e.preventDefault();
        setBag(false);
        setBoxShut(run.player.pwOpen ?? null);
        controls()?.queueMenu(GIGA_MENU.close);
      }
    };
    window.addEventListener("keydown", key, true);
    return () => window.removeEventListener("keydown", key, true);
  }, [giga, controls, run]);
  if (!giga || !v) return null;
  const p = allPlayers(run)[me]!;
  const send = (code: number) => controls()?.queueMenu(code);
  const alive = run.pvp!.seats.filter((_, i) => inPlay(run, i)).length;
  const full = (p.pwBag?.length ?? 0) >= 9;
  return (
    <>
      <div className="pw-giga">
        <MiniMap run={run} me={me} />
        <div className="pw-giga-side">
          <b>
            🪙 {v.gold} · {t("pwAlive").replace("{n}", String(alive))}
            {p.pwCraft && ` · ${t("pwGigaCrafting")}`}
          </b>
          <div className="pw-giga-bag" onClick={() => setBag(true)} title={t("pwGigaBagOpen")}>
            <span className="vault">{p.pwVault ? <Item id={p.pwVault} lang={lang} t={t} /> : "🔒"}</span>
            {Array.from({ length: 9 }, (_, k) => (
              <span key={k}>{p.pwBag?.[k] && <Item id={p.pwBag[k]!} lang={lang} t={t} />}</span>
            ))}
          </div>
          <small>{t("pwGigaBagOpen")}</small>
        </div>
      </div>
      {box && <GigaBox loot={box} full={full} lang={lang} t={t} send={send} onClose={() => (setBoxShut(box.id), send(GIGA_MENU.close))} />}
      {bag && <GigaBag p={p} craft={v.craft} gold={v.gold} lang={lang} t={t} send={send} onClose={() => setBag(false)} />}
    </>
  );
}
