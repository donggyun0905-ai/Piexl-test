// 상점 로비 꾸밈 탭: 기본 오락실 + 테마 8개 (미리 보기 · 사기 · 쓰기)
import { useEffect, useRef, useState } from "react";
import type { TextKey } from "../i18n";
import { drawLobby } from "../lobby/lobbyArt";
import { LOBBY_H, LOBBY_W } from "../lobby/lobbyMap";
import { LOBBY_PRICE, LOBBY_THEMES, type LobbyTheme } from "../lobby/lobbyThemes";
import { buyLobby, coupons, lobbyOwned, lobbyTheme, setLobbyTheme } from "./wallet";

function LobbyPreview({ theme }: { theme: LobbyTheme }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const draw = (now: number) => {
      ctx.imageSmoothingEnabled = false;
      drawLobby(ctx, theme, now / 1000, null);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [theme]);
  return <canvas ref={ref} width={LOBBY_W} height={LOBBY_H} className="lobby-preview" aria-hidden="true" />;
}

/** 로비 테마 이름 */
const LOBBY_KEY: Record<LobbyTheme, TextKey> = { arcade: "lobbyArcade", swim: "lobbyBeach", xmas: "skinXmas", halloween: "skinHalloween", school: "skinSchool", newyear: "skinNewyear", japan: "skinJapan", china: "skinChina", usa: "skinUsa" };
const name = (th: LobbyTheme, t: (k: TextKey) => string) => t(LOBBY_KEY[th]);

export function LobbyTab({ t, onChange }: { t: (k: TextKey) => string; onChange: () => void }) {
  const [, redraw] = useState(0);
  const owned = lobbyOwned();
  const using = lobbyTheme();
  const act = (fn: () => void) => {
    fn();
    redraw((n) => n + 1);
    onChange();
  };
  return (
    <div className="shop-grid lobby-grid">
      {LOBBY_THEMES.map((th) => {
        const has = th === "arcade" || owned.includes(th);
        return (
          <div key={th} className={`skin-card${using === th ? " wearing" : ""}`}>
            <LobbyPreview theme={th} />
            <strong>{name(th, t)}</strong>
            {using === th ? (
              <span className="skin-tag">{t("lobbyUsing")}</span>
            ) : has ? (
              <button type="button" className="secondary" onClick={() => act(() => setLobbyTheme(th))}>
                {t("lobbyUse")}
              </button>
            ) : (
              <button type="button" className="primary" disabled={coupons() < LOBBY_PRICE} onClick={() => act(() => buyLobby(th, LOBBY_PRICE))}>
                {t("shopBuy")} · 🎟 {LOBBY_PRICE}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
