// 펫 상점 (로비 게임기 자리): 로비 칩으로 펫을 사고 한 마리를 데리고 감. 능력은 순위 경쟁 모드(일일 도전·레이드·아레나·배틀)에서는 쓰이지 않음
import { LOBBY_PET_IDS, LOBBY_PETS, type LobbyPetId } from "@pixel-rogue/shared";
import { useEffect, useRef, useState } from "react";
import type { TextKey } from "../i18n";
import { loadChips } from "./chips";
import { drawPetArt } from "./petArt";
import { buyPet, equipPet, equippedPet, ownedPets } from "./petStore";

function PetPortrait({ id }: { id: LobbyPetId }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let raf = 0;
    const loop = (ms: number) => {
      const ctx = ref.current?.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, 32, 28);
        drawPetArt(ctx, id, 16, 24, 1, ms / 1000);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [id]);
  return <canvas ref={ref} width={32} height={28} className="pet-portrait" aria-hidden="true" />;
}

export function PetShop({ t }: { t: (k: TextKey) => string }) {
  const [chips, setChips] = useState(loadChips);
  const [owned, setOwned] = useState(ownedPets);
  const [equipped, setEquipped] = useState(equippedPet);
  const refresh = () => {
    setChips(loadChips());
    setOwned(ownedPets());
    setEquipped(equippedPet());
  };
  return (
    <div className="mg pet-shop">
      <p className="pet-chips">
        🪙 {chips.toLocaleString()} · <small>{t("petShopNote")}</small>
      </p>
      <ul className="pet-list">
        {LOBBY_PET_IDS.map((id) => {
          const have = owned.includes(id);
          const on = equipped === id;
          const price = LOBBY_PETS[id].price;
          return (
            <li key={id} className={`pet-row${on ? " on" : ""}`}>
              <PetPortrait id={id} />
              <span className="pet-text">
                <strong>{t(`pet_${id}` as TextKey)}</strong>
                <small>{t(`petBuff_${id}` as TextKey)}</small>
              </span>
              {!have ? (
                <button
                  type="button"
                  className="primary"
                  disabled={chips < price}
                  onClick={() => {
                    buyPet(id);
                    refresh();
                  }}
                >
                  🪙 {price.toLocaleString()}
                </button>
              ) : (
                <button
                  type="button"
                  className={on ? "secondary" : "primary"}
                  onClick={() => {
                    equipPet(on ? null : id);
                    refresh();
                  }}
                >
                  {t(on ? "petLeave" : "petTake")}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
