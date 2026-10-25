// 플레이어 구분: 가입·로그인 없이 기기마다 무작위 ID (이 기기에 저장). 기기 연동하면 다른 기기의 ID로 바꿈.
// ID는 서버에만 보내고 화면에는 보여 주지 않음. 닉네임·해금은 이 기기에 두고 서버에도 저장 (연동한 기기끼리 맞춤)
import { cleanNickname, DEFAULT_NICKNAME } from "@pixel-rogue/shared";
import { apiPost } from "./api";
import { addAchievements, loadAchievements } from "./records";
import { loadText, saveText } from "./storage";

function randomId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    // 오래된 브라우저·http 주소 (ID는 게임 결과와 상관없어 브라우저 랜덤을 씀)
    return Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
  }
}

let cached: string | null = null;

/** 이 기기의 플레이어 ID (처음이면 만듦) */
export function getPlayerId(): string {
  if (cached) return cached;
  cached = loadText("playerId") || randomId();
  saveText("playerId", cached);
  return cached;
}

/** 기기 연동: 다른 기기의 ID로 바꿈 */
export function replacePlayerId(id: string): void {
  cached = id;
  saveText("playerId", id);
}

/** 연동 해제: 이 기기를 새 기기처럼 (새 ID, 닉네임 처음으로). 다른 기기와 서버 정보는 그대로 */
export function resetPlayerId(): void {
  replacePlayerId(randomId());
  saveText("nickname", "");
}

export function loadNickname(): string {
  return loadText("nickname") || DEFAULT_NICKNAME;
}

/** 닉네임 저장 (이 기기 + 서버). 금칙어는 Player로 */
export function saveNickname(name: string): string {
  const clean = cleanNickname(name);
  saveText("nickname", clean);
  void apiPost("/api/player/save", { player: getPlayerId(), nickname: clean });
  return clean;
}

interface Profile {
  nickname: string;
  unlocks: string[];
}

/** 서버 정보를 이 기기에 반영 (닉네임은 서버 것, 해금은 합침). 이 기기에만 있는 해금은 서버에도 */
export function applyProfile(p: Profile): void {
  if (p.nickname) saveText("nickname", p.nickname);
  addAchievements(p.unlocks);
  const local = loadAchievements();
  if (local.some((id) => !p.unlocks.includes(id))) {
    void apiPost("/api/player/save", { player: getPlayerId(), unlocks: local });
  }
}

/** 게임을 열 때 한 번: 다른 기기에서 바꾼 닉네임·해금 맞추기 */
export async function syncProfile(): Promise<void> {
  const res = await apiPost<Profile>("/api/player/profile", { player: getPlayerId() });
  if (res.ok && res.data) applyProfile(res.data);
}

/** 새 업적을 서버에도 저장 (업적을 얻을 때만이라 드묾) */
export function syncUnlocks(): void {
  void apiPost("/api/player/save", { player: getPlayerId(), unlocks: loadAchievements() });
}
