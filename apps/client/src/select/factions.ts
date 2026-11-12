// 캐릭터 선택창 진영 탭: 스토리 진영(story/storyData)으로 캐릭터를 나눔. 아슈바르(느아르)는 검은 탭 · 버려진 자들(세 아이)은 헬리오스 · 숨은 캐릭터는 아카식 레코드·이방인 · 한정 캐릭터는 서고의 감시자
import { type CharacterId } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import { FACTIONS, type FactionId } from "../story/storyData";

/** 탭 순서 */
export const SELECT_TABS: readonly { id: FactionId; label: TextKey }[] = [
  { id: "ascalon", label: "csAscalon" },
  { id: "terracore", label: "csTerracore" },
  { id: "virdia", label: "csVirdia" },
  { id: "helios", label: "csHelios" },
  { id: "thalassia", label: "csThalassia" },
  { id: "seongguk", label: "csSeongguk" },
  { id: "dawn", label: "csDawn" },
  { id: "silber", label: "csSilber" },
  { id: "ashvar", label: "csAshvar" },
  { id: "akashic", label: "csAkashic" },
  { id: "outsider", label: "csOutsider" },
  { id: "archive", label: "csArchive" },
];

/** 진영 탭 아래 진영 특징 한 줄 (로그 전용 공통 능력 · 새벽의 성흔은 성흔 게이지) */
export const FACTION_TRAIT: Partial<Record<FactionId, { name: TextKey; tip: TextKey }>> = {
  ascalon: { name: "csTrait_ascalon", tip: "ftAscalonTip" },
  terracore: { name: "csTrait_terracore", tip: "ftTerracoreTip" },
  virdia: { name: "csTrait_virdia", tip: "ftVirdiaTip" },
  helios: { name: "csTrait_helios", tip: "ftHeliosTip" },
  thalassia: { name: "csTrait_thalassia", tip: "ftThalassiaTip" },
  seongguk: { name: "csTrait_seongguk", tip: "ftSeonggukTip" },
  dawn: { name: "csTrait_dawn", tip: "sgGaugeTip" },
  silber: { name: "csTrait_silber", tip: "ftSilberTip" },
  ashvar: { name: "csTrait_ashvar", tip: "ftAshvarTip" },
};

export function factionOf(c: CharacterId): FactionId {
  if (c === "abandoned") return "helios";
  return FACTIONS.find((f) => f.members.includes(c))?.id ?? "akashic";
}
