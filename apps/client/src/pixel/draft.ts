// 도트 편집 초안: 고치던 그림을 이 기기에 PNG(data URL)로 저장 (게임의 '바로 써 보기'도 이걸 읽음, game/customArt). 저장이 막혀 있으면 조용히 넘어감
import { draftKey } from "../game/customArt";
import { toCanvas } from "./sheet";

export function loadDraft(id: string): string | null {
  try {
    return localStorage.getItem(draftKey(id));
  } catch {
    return null;
  }
}

export function saveDraft(id: string, d: ImageData): void {
  try {
    localStorage.setItem(draftKey(id), toCanvas(d).toDataURL("image/png"));
  } catch {
    // 저장 공간이 없거나 막힘
  }
}

export function removeDraft(id: string): void {
  try {
    localStorage.removeItem(draftKey(id));
  } catch {
    // 막힘
  }
}
