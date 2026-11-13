// 메뉴 소리를 언제 낼지 (2026-11-13): 화면 아무 곳의 버튼을 누르면 종류에 맞는 소리 (설정의 '메뉴 소리'를 끄면 안 남, 모바일 조작 버튼·뽑기 카드는 빼고)
// 버튼에 data-sfx가 있으면 그 소리 · 확인(primary) 토독 · 닫기(ghost·닫기 글자) 툭 · 탭 샥 · 켜고 끄기 딸깍 · 그 밖 톡 · 상점·뽑기는 uiSfx로 직접 부름
import { getSettings } from "../settings";
import { charVoice, type MenuSfx } from "./sfxMenu";
import { play, sfxOn } from "./sound";
import type { UiSfx } from "./sfxUi";

/** 메뉴 소리를 켰을 때만 냄 */
export function uiSfx(name: UiSfx | MenuSfx): void {
  if (getSettings().uiSound) play(name);
}

/** 캐릭터를 누를 때 그 캐릭터 소리 (진영 음색, sfxMenu) */
export function uiVoice(id: string, faction: string): void {
  if (getSettings().uiSound && sfxOn()) charVoice(id, faction);
}

/** 소리를 아직 낼 수 없으면(첫 터치 전) 첫 입력 때 냄 (메인 로고) · 돌려준 함수로 취소 (화면을 떠날 때) */
export function uiSfxSoon(name: UiSfx | MenuSfx): () => void {
  const off = () => {
    for (const ev of ["pointerdown", "keydown"]) window.removeEventListener(ev, go);
  };
  const go = () => {
    off();
    window.setTimeout(() => uiSfx(name), 0);
  };
  if (sfxOn()) uiSfx(name);
  else for (const ev of ["pointerdown", "keydown"]) window.addEventListener(ev, go, { passive: true });
  return off;
}

const BACK = /^(닫기|뒤로|취소|close|back|cancel|閉じる|戻る|キャンセル)$/i;

/** 누른 버튼에 맞는 소리 (main에서 click에 걺) */
export function uiClick(e: Event): void {
  if (!(e.target instanceof Element) || !getSettings().uiSound) return;
  const box = e.target.closest("input[type=checkbox], [role=switch]");
  if (box) return uiSfx((box as HTMLInputElement).checked || box.getAttribute("aria-checked") === "true" ? "uiOn" : "uiOff");
  const el = e.target.closest("button, [role=tab]");
  if (!el || el.closest(".touch-buttons, .gacha-card, .gacha-pack-wrap")) return;
  // 버튼마다 따로 정한 소리 (data-sfx, "none"이면 소리 없음 · 그 화면이 직접 냄)
  const own = el.getAttribute("data-sfx");
  if (own) return void (own !== "none" && uiSfx(own as UiSfx));
  const c = el.classList;
  if (el.getAttribute("role") === "tab" || c.contains("tab")) uiSfx("uiTab");
  else if (c.contains("ghost") || BACK.test(el.textContent?.trim() ?? "")) uiSfx("uiBack");
  else if (c.contains("primary")) uiSfx("uiConfirm");
  else uiSfx("uiClick");
}
