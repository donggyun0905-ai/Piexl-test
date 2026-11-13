// 메뉴 소리를 언제 낼지 (2026-11-13): 화면 아무 곳의 버튼을 누르면 종류에 맞는 소리 (설정의 '메뉴 소리'를 끄면 안 남, 모바일 조작 버튼·뽑기 카드는 빼고)
// 확인(primary) 토독 · 닫기(ghost·닫기 글자) 툭 · 탭 샥 · 켜고 끄기 딸깍 · 그 밖 톡 · 상점·뽑기는 uiSfx로 직접 부름
import { getSettings } from "../settings";
import { play } from "./sound";
import type { UiSfx } from "./sfxUi";

/** 메뉴 소리를 켰을 때만 냄 */
export function uiSfx(name: UiSfx): void {
  if (getSettings().uiSound) play(name);
}

const BACK = /^(닫기|뒤로|취소|close|back|cancel|閉じる|戻る|キャンセル)$/i;

/** 누른 버튼에 맞는 소리 (main에서 click에 걺) */
export function uiClick(e: Event): void {
  if (!(e.target instanceof Element) || !getSettings().uiSound) return;
  const box = e.target.closest("input[type=checkbox], [role=switch]");
  if (box) return uiSfx((box as HTMLInputElement).checked || box.getAttribute("aria-checked") === "true" ? "uiOn" : "uiOff");
  const el = e.target.closest("button, [role=tab]");
  if (!el || el.closest(".touch-buttons, .gacha-card, .gacha-pack-wrap")) return;
  const c = el.classList;
  if (el.getAttribute("role") === "tab" || c.contains("tab")) uiSfx("uiTab");
  else if (c.contains("ghost") || BACK.test(el.textContent?.trim() ?? "")) uiSfx("uiBack");
  else if (c.contains("primary")) uiSfx("uiConfirm");
  else uiSfx("uiClick");
}
