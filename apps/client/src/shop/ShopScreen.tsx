// 상점: 위에 만능 쿠폰 수·이벤트 코인 수, 탭 다섯 (스킨 · 로비 꾸밈 · 뽑기 · 이벤트(이벤트 코인 효과) · 미션)
import { useState } from "react";
import type { TextKey } from "../i18n";
import { EventTab } from "./EventTab";
import { GachaTab } from "./GachaTab";
import { LobbyTab } from "./LobbyTab";
import { MissionTab } from "./MissionTab";
import { SkinTab } from "./SkinTab";
import { coupons } from "./wallet";
import { eventCoins } from "../event/eventCoins";
import { EcoinIcon } from "../event/EcoinIcon";

type Tab = "skins" | "lobby" | "gacha" | "event" | "missions";
const TABS: { id: Tab; label: TextKey }[] = [
  { id: "skins", label: "shopSkins" },
  { id: "lobby", label: "shopLobby" },
  { id: "gacha", label: "shopGacha" },
  { id: "event", label: "shopEvent" },
  { id: "missions", label: "shopMissions" },
];

export function ShopScreen({ t, onBack }: { t: (k: TextKey) => string; onBack: () => void }) {
  const [tab, setTab] = useState<Tab>("skins");
  const [money, setMoney] = useState(coupons);
  const [ecoins, setEcoins] = useState(eventCoins);
  const refresh = () => {
    setMoney(coupons());
    setEcoins(eventCoins());
  };
  return (
    <main className="shop-screen">
      <header className="shop-head">
        <h2>{t("shop")}</h2>
        <span className="shop-wallets">
          <span className="shop-coupons">
            🎟 {t("shopCoupons")} <b>{money}</b>
          </span>
          <span className="shop-coupons ecoin">
            <EcoinIcon /> {t("shopEcoins")} <b>{ecoins}</b>
          </span>
        </span>
      </header>
      <nav className="shop-tabs">
        {TABS.map((x) => (
          <button key={x.id} type="button" className={tab === x.id ? "active" : ""} onClick={() => setTab(x.id)}>
            {t(x.label)}
          </button>
        ))}
      </nav>
      {tab === "skins" && <SkinTab t={t} onChange={refresh} />}
      {tab === "lobby" && <LobbyTab t={t} onChange={refresh} />}
      {tab === "gacha" && <GachaTab t={t} onChange={refresh} />}
      {tab === "event" && <EventTab t={t} onChange={refresh} />}
      {tab === "missions" && <MissionTab t={t} onChange={refresh} />}
      <button type="button" className="secondary" onClick={onBack}>
        {t("back")}
      </button>
    </main>
  );
}
