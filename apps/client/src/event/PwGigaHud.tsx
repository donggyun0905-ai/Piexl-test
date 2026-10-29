// 기간토마키아 화면 정보: 배낭 10칸(한 칸은 금고, 누르면 금고와 바꿈) · 돈 · 제작할 수 있는 전설 장비(누르면 3초 가만히) · 미니맵(자기장·출구·나)
import { allPlayers, canCraft, GIGA_MENU, inPlay, isGiga, PW_ARENAS, PW_LEGEND, pvpZone, TILE_SIZE, useSeat as takeSeat, type RunState } from "@pixel-rogue/shared";
import { useEffect, useRef } from "react";
import type { Controls } from "../game/controls";
import { ItemIcon } from "../game/itemIcon";
import type { Lang, TextKey } from "../i18n";
import { itemName } from "../i18n/items";
import { gearLines } from "./PwShop";

interface Props {
  run: RunState;
  me: number;
  lang: Lang;
  t: (k: TextKey) => string;
  controls: () => Controls | null;
}

const LEGENDS = Object.keys(PW_LEGEND);
/** 배낭 물건 그림·이름: 장비(패시브 그림) · 사용 아이템 u: · 상점 물건 g: */
function Item({ id, lang, t }: { id: string; lang: Lang; t: (k: TextKey) => string }) {
  if (id.startsWith("g:")) return <span className="pw-giga-goods" title={t(`pwGoods_${id.slice(2)}` as TextKey)}>🎁</span>;
  const use = id.startsWith("u:");
  const key = use ? id.slice(2) : id;
  return (
    <span title={use ? itemName("use", key, lang) : `${itemName("passive", key, lang)}\n${gearLines(key, t).join("\n")}`}>
      <ItemIcon item={{ kind: use ? "use" : "passive", id: key } as never} size={22} />
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

/** 제작할 수 있는 것·돈: 내 자리를 꺼내 놓고 셈 (보던 자리로 돌려놓음) */
function mine(run: RunState, me: number): { craft: string[]; gold: number } {
  const back = run.seat ?? 0;
  takeSeat(run, me);
  const out = { craft: LEGENDS.filter((id) => canCraft(run, id)), gold: run.gold };
  takeSeat(run, back);
  return out;
}

export function PwGigaHud({ run, me, lang, t, controls }: Props) {
  if (!isGiga(run)) return null;
  const p = allPlayers(run)[me]!;
  const send = (code: number) => controls()?.queueMenu(code);
  const { craft, gold } = mine(run, me);
  const alive = run.pvp!.seats.filter((_, i) => inPlay(run, i)).length;
  return (
    <div className="pw-giga">
      <MiniMap run={run} me={me} />
      <div className="pw-giga-side">
        <b>
          🪙 {gold} · {t("pwAlive").replace("{n}", String(alive))}
          {p.pwCraft && ` · ${t("pwGigaCrafting")}`}
        </b>
        <div className="pw-giga-bag">
          <button type="button" className="vault" title={t("pwGigaVault")} onClick={() => send(GIGA_MENU.vault + (p.pwBag?.length ?? 0))}>
            {p.pwVault ? <Item id={p.pwVault} lang={lang} t={t} /> : "🔒"}
          </button>
          {Array.from({ length: 9 }, (_, k) => {
            const id = p.pwBag?.[k];
            return (
              <button key={k} type="button" disabled={!id} title={t("pwGigaToVault")} onClick={() => send(GIGA_MENU.vault + k)}>
                {id && <Item id={id} lang={lang} t={t} />}
              </button>
            );
          })}
        </div>
        {craft.length > 0 && (
          <div className="pw-giga-craft">
            <small>{t("pwGigaCraft")}</small>
            {craft.map((id) => (
              <button key={id} type="button" disabled={!!p.pwCraft} title={gearLines(id, t).join("\n")} onClick={() => send(GIGA_MENU.craft + LEGENDS.indexOf(id))}>
                <ItemIcon item={{ kind: "passive", id } as never} size={22} /> {PW_LEGEND[id]!.cost}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
