// 버프 창: 진영 특징 줄 (로그만 · 진영 이름 · 지금 값 · 마우스를 올리면 설명)
import { FACTION_HEAT, FACTION_OATH, FACTION_TAINT, FACTION_TIDE, factionGauge, type RunState } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import type { RoomBuff } from "./roomBuffs";

const FACTION: Record<string, TextKey> = { thalassia: "csThalassia", helios: "csHelios", terracore: "csTerracore", ascalon: "csAscalon", virdia: "csVirdia", seongguk: "csSeongguk" };
const TIP: Record<string, TextKey> = { thalassia: "ftThalassiaTip", helios: "ftHeliosTip", terracore: "ftTerracoreTip", ascalon: "ftAscalonTip", virdia: "ftVirdiaTip", seongguk: "ftSeonggukTip" };
const STAGE: TextKey[] = ["ftVirdiaStage0", "ftVirdiaStage1", "ftVirdiaStage2"];

function line(run: RunState, t: (k: TextKey) => string): string | null {
  const g = factionGauge(run);
  if (!g) return null;
  const n = String(g.n);
  const fill = (k: TextKey, p = 0, q = 0) => t(k).replace("{n}", n).replace("{p}", String(Math.round(p))).replace("{q}", String(Math.round(q * 10) / 10));
  switch (g.trait) {
    case "thalassia":
      return fill("bfFtThalassia", Math.floor(Math.min(g.n, FACTION_TIDE.max) / FACTION_TIDE.step) * FACTION_TIDE.perStep * 100);
    case "helios":
      return g.on ? t("bfFtHeliosOn") : fill("bfFtHelios", g.n * FACTION_TAINT.dmg * 100, g.n * FACTION_TAINT.taken * 100);
    case "terracore":
      return run.player.fcOver ? t("bfFtTerracoreOn") : fill("bfFtTerracore", (Math.min(g.n, FACTION_HEAT.max) / FACTION_HEAT.max) * FACTION_HEAT.dmg * 100);
    case "ascalon":
      return fill("bfFtAscalon", g.n * FACTION_OATH.gloryDmg * 100);
    case "virdia":
      return t("bfFtVirdia").replace("{s}", t(STAGE[g.stage ?? 0]!));
    case "seongguk":
      return g.on ? t("bfFtSeonggukOn") : fill("bfFtSeongguk");
  }
}

export function factionBuffs(run: RunState, t: (k: TextKey) => string): RoomBuff[] {
  const g = factionGauge(run);
  const l = line(run, t);
  if (!g || !l) return [];
  return [{ key: "faction", label: `${t(FACTION[g.trait]!)} · ${l}`, tip: t(TIP[g.trait]!), bad: g.trait === "terracore" && !!run.player.fcOver }];
}
