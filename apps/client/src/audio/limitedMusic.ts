// 한정 스킨 전용 음악 켜기 (runSounds가 판 시작 때 부름): 범 풍류 · 여름 파도 · 네온 펄스 · 아니면 기본 곡
import { setCyberMusic } from "./cyberSound";
import { setSummerMusic } from "./summerSound";
import { setTigerMusic } from "./tigerSound";

export function setLimitedMusic(theme: string | null): void {
  // 범을 먼저 끄거나 켜야(끄면 기본 곡) 다른 테마가 그 위에 덮음
  setTigerMusic(theme === "tiger");
  setSummerMusic(theme === "summer");
  setCyberMusic(theme === "cyber");
}
