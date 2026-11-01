// 아카이브 티어표: 관리자 페이지 '티어 플레잉'에서 저장한 표를 서버에서 받아 씀 (없거나 못 받으면 기본 표 tierData · 받은 표는 이 기기에 남겨 다음엔 바로)
import { CHARACTER_IDS, type CharacterId } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import { apiGet } from "../api";
import { loadText, saveText } from "../storage";
import { TIERS } from "./tierData";

type Tier = (typeof TIERS)[number];
const KEY = "pixel-rogue:tierList";

function fromServer(raw: unknown): Tier[] | null {
  if (!Array.isArray(raw)) return null;
  return TIERS.map((t) => {
    const got = (raw as { id?: string; chars?: string[] }[]).find((r) => r?.id === t.id);
    const chars = (got?.chars ?? []).filter((c): c is CharacterId => (CHARACTER_IDS as readonly string[]).includes(c));
    return { ...t, chars };
  });
}

function cached(): Tier[] | null {
  try {
    return fromServer(JSON.parse(loadText(KEY) ?? "null"));
  } catch {
    return null;
  }
}

export function useLiveTiers(): readonly Tier[] {
  const [tiers, setTiers] = useState<readonly Tier[]>(() => cached() ?? TIERS);
  useEffect(() => {
    void apiGet<{ tiers: unknown }>("/api/tier").then((r) => {
      const got = r.ok ? fromServer(r.data?.tiers) : null;
      if (!got) return;
      saveText(KEY, JSON.stringify(r.data!.tiers));
      setTiers(got);
    });
  }, []);
  return tiers;
}
