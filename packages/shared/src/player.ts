// 플레이어 구분: 가입·로그인 없이 기기마다 무작위 ID. 기기 연동 코드로 다른 기기와 같은 ID를 씀.
// ID는 서버에만 보내고 화면·순위표에는 보여 주지 않음 (순위에는 닉네임만)

/** 기기 연동 코드 자릿수 (숫자) */
export const LINK_CODE_LENGTH = 6;
/** 연동 코드는 5분만 쓸 수 있고, 한 번 쓰면 사라짐 */
export const LINK_CODE_TTL_MS = 5 * 60_000;

/** 기기에서 만든 플레이어 ID 형식 (UUID 등) */
export function isPlayerId(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9_-]{16,64}$/.test(value);
}

export function isLinkCode(value: unknown): value is string {
  return typeof value === "string" && new RegExp(`^\\d{${LINK_CODE_LENGTH}}$`).test(value);
}
