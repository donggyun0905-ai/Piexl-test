// 함께 하기 초대 링크: 주소 ?room=코드 로 들어오면 그 방에 바로 들어간다

const CODE = /^[A-Z0-9]{6}$/;

/** 주소의 ?room= 값 (한 번 읽으면 주소에서 지움: 새로고침해도 다시 들어가지 않게) */
export function takeRoomFromUrl(key: "room" | "coop" = "room"): string {
  try {
    const params = new URLSearchParams(location.search);
    const code = (params.get(key) ?? "").toUpperCase();
    if (!params.has(key)) return "";
    params.delete(key);
    const rest = params.toString();
    history.replaceState(history.state, "", location.pathname + (rest ? `?${rest}` : "") + location.hash);
    return CODE.test(code) ? code : "";
  } catch {
    return "";
  }
}

/** 협동 방은 ?coop=코드 */
export function inviteUrl(code: string, coop = false): string {
  return `${location.origin}/?${coop ? "coop" : "room"}=${code}`;
}

/** 클립보드 복사 (못 쓰면 false) */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
