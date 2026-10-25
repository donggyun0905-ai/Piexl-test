// 도트 편집(/pixel/)에서 고친 그림을 게임에 씀.
// 1) 저장소에 넣은 그림: 캐릭터·스킨·몬스터는 원래 파일을 바꾸고, 코드로 그리던 것(아이콘·효과·탄)은 public/sprites/custom/{파일}.png + 아래 목록
// 2) 이 기기에서 '게임에 바로 써 보기'를 켜면 고치던 초안(localStorage)을 먼저 씀
/** 저장소에 넣은 코드 그림 교체 (id, 예: "icon:weapon:club", "fx:swing", "shot:player") */
export const CUSTOM_FILES: readonly string[] = ["fx:swing", "fx:hit", "fx:blast", "shot:player", "shot:magic", "shot:enemy", "tiger:claw", "tiger:crit", "tiger:seal", "tiger:ring", "tiger:pillar", "tiger:aura", "tiger:sleep", "tiger:tail", "tiger:band"];

const APPLY_KEY = "pixel-rogue:pixel:apply";
/** 초안 저장 자리 (캐릭터·스킨은 시트 이름 그대로) */
export const draftKey = (id: string) => `pixel-rogue:pixel:${id}`;
/** 파일 이름: id의 ':'를 '_'로 */
export const artFile = (id: string) => id.replace(/:/g, "_");
/** 도트 편집 페이지가 원래 그림을 만들 때 잠깐 끔 */
export const customArt = { off: false };

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export const applyDrafts = () => read(APPLY_KEY) === "1";
export function setApplyDrafts(on: boolean): void {
  try {
    if (on) localStorage.setItem(APPLY_KEY, "1");
    else localStorage.removeItem(APPLY_KEY);
  } catch {
    // 저장이 막혀 있음
  }
}

/** 이 기기의 초안 (써 보기를 켰을 때만) */
export const draftSrc = (id: string): string | null => (applyDrafts() ? read(draftKey(id)) : null);

/** 이벤트 상점에서 산 효과를 이 기기에서 고친 그림 (/pixel/?fx=1, 초안 이름 myfx:{id}) */
export const myFxKey = (id: string) => `myfx:${id}`;

/** 코드 그림을 바꿀 그림 주소: 내가 고친 효과 → 초안 → 저장소 그림 → 없음 */
function customSrc(id: string): string | null {
  return read(draftKey(myFxKey(id))) ?? draftSrc(id) ?? (CUSTOM_FILES.includes(id) ? `${import.meta.env.BASE_URL}sprites/custom/${artFile(id)}.png` : null);
}

const images = new Map<string, HTMLImageElement | null>();
const listeners = new Set<() => void>();

/** 바꿀 그림을 하나 다 불러올 때마다 부름 (한 번 그려 두는 화면 아이콘이 다시 그리게). 돌려준 함수로 끊음 */
export function onCustomArt(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** 다 불러온 바꿀 그림 (없거나 불러오는 중이면 undefined) */
export function customImage(id: string): HTMLImageElement | undefined {
  if (customArt.off) return undefined;
  if (!images.has(id)) {
    images.set(id, null);
    const src = customSrc(id);
    if (src) {
      const img = new Image();
      img.onload = () => {
        images.set(id, img);
        for (const fn of listeners) fn();
      };
      img.src = src;
    }
  }
  return images.get(id) ?? undefined;
}

/** 나만의 스킨 그림 주소: 이 기기에 그린 그림 → 없으면 그 캐릭터 기본 그림 (베두인 '던진 뒤'도 같은 그림). 나만의 스킨이 아니면 null */
export function mySkinSrc(name: string): string | null {
  const m = /^(.+)_my(_bare)?$/.exec(name);
  if (!m) return null;
  return read(draftKey(`my:${m[1]}`)) ?? `${import.meta.env.BASE_URL}sprites/${m[1]}.png`;
}
