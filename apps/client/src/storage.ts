// 브라우저 저장소. 사생활 보호 모드 등에서 실패할 수 있어 항상 감싸서 쓴다.
const PREFIX = "pixel-rogue:";

export function loadText(key: string): string | null {
  try {
    return localStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

export function saveText(key: string, value: string): void {
  try {
    localStorage.setItem(PREFIX + key, value);
  } catch {
    // 저장 실패는 무시 (게임 진행에는 영향 없음)
  }
}
