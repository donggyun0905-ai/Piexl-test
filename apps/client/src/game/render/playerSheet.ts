// 지금 그릴 플레이어 그림 시트 이름: 왕의 방 · 오니 신인족 · 학살자 피의 학살 · 헬피스트 적혈 각성(악마화) · 빛의 사도 성장 · 이클립스 낮/밤 · 그 밖은 캐릭터 기본 (actors가 커서 나눔)
import { luxStage, type PlayerState } from "@pixel-rogue/shared";
import { sheetFor } from "../sprites";
import { eclipseSheet } from "./eclipseAura";

export function playerSheet(p: PlayerState): string {
  if (p.kingRoom !== undefined) return "crownKing";
  if (p.characterId === "oni" && (p.oGod ?? 0) > 0) return "oni_god";
  if (p.characterId === "slayer" && (p.slRage ?? 0) > 0) return "slayer_rage";
  if (p.characterId === "hellfist" && (p.sgAwake ?? 0) > 0) return "hellfistDemon";
  if (p.characterId === "lux" && luxStage(p) > 0) return `lux${luxStage(p) + 1}`;
  return eclipseSheet(p) ?? sheetFor(p.characterId, p.lv, p.abM);
}
