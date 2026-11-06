// 캐릭터 선택창 진영 탭: 스토리 진영(story/storyData)으로 캐릭터를 나눔. 버려진 자들(세 아이)은 헬리오스 · 숨은 캐릭터는 아카식 레코드·이방인 · 한정 캐릭터는 서고의 감시자
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
  { id: "akashic", label: "csAkashic" },
  { id: "outsider", label: "csOutsider" },
  { id: "archive", label: "csArchive" },
];

export function factionOf(c: CharacterId): FactionId {
  if (c === "abandoned") return "helios";
  return FACTIONS.find((f) => f.members.includes(c))?.id ?? "akashic";
}
