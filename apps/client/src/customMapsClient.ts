// 관리자가 만든 맵 받기 (/api/maps): 앱을 열 때 한 번 받아 넣음 (customMaps) · 못 받으면 이 기기에 마지막으로 받은 맵
import { setCustomMaps } from "@pixel-rogue/shared";
import { apiGet } from "./api";
import { loadText, saveText } from "./storage";

const KEY = "customMaps";

try {
  setCustomMaps(JSON.parse(loadText(KEY) ?? "[]"));
} catch {
  // 망가진 값은 버림
}

export async function refreshCustomMaps(): Promise<void> {
  const res = await apiGet<{ maps: unknown }>("/api/maps");
  if (!res.ok || !res.data) return;
  setCustomMaps(res.data.maps);
  saveText(KEY, JSON.stringify(res.data.maps));
}
