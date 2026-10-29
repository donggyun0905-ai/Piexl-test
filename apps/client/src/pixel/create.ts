// 도트 편집 창작 공간 (/pixel/ → 🎨 창작 공간, 또는 /pixel/?create): 크기를 마음대로 정한 빈 그림판 (16~2048칸, 칸 나누기로 움직임 시트도)
// 목록(이름·크기·칸)은 localStorage, 그림은 크니까 IndexedDB에 PNG로 이 기기에만 저장 (막혀 있으면 이번 창에서만 씀)
import type { Asset } from "./assets";
import { loadImage, toCanvas } from "./sheet";

export interface Creation {
  id: string;
  name: string;
  w: number;
  h: number;
  /** 칸 나누기 (가로 칸 수 · 세로 줄 수, 1×1 = 한 장) */
  cols: number;
  rows: number;
}

/** 고를 수 있는 크기 (정사각) · 가장 큰 크기 */
export const CREATE_SIZES = [16, 24, 32, 48, 64, 80, 96, 128, 192, 256, 384, 512, 768, 1024, 2048];
export const CREATE_MAX = 2048;

const LIST = "pxCreations";
const DB = "pixel-rogue-create";
const STORE = "art";

export function listCreations(): Creation[] {
  try {
    return JSON.parse(localStorage.getItem(LIST) ?? "[]") as Creation[];
  } catch {
    return [];
  }
}

function saveList(list: Creation[]): void {
  try {
    localStorage.setItem(LIST, JSON.stringify(list));
  } catch {
    // 막힘
  }
}

function db(): Promise<IDBDatabase> {
  return new Promise((ok, fail) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => ok(req.result);
    req.onerror = () => fail(req.error);
  });
}

async function put(id: string, blob: Blob | null): Promise<void> {
  const d = await db();
  await new Promise<void>((ok, fail) => {
    const tx = d.transaction(STORE, "readwrite");
    if (blob) tx.objectStore(STORE).put(blob, id);
    else tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => ok();
    tx.onerror = () => fail(tx.error);
  });
}

async function get(id: string): Promise<Blob | undefined> {
  const d = await db();
  return new Promise((ok, fail) => {
    const req = d.transaction(STORE).objectStore(STORE).get(id);
    req.onsuccess = () => ok(req.result as Blob | undefined);
    req.onerror = () => fail(req.error);
  });
}

export function newCreation(name: string, w: number, h: number, cols: number, rows: number): Creation {
  const clamp = (v: number, max: number) => Math.max(1, Math.min(max, Math.round(v) || 1));
  const c: Creation = { id: `create:${Date.now().toString(36)}`, name: name.trim() || "새 그림", w: clamp(w, CREATE_MAX), h: clamp(h, CREATE_MAX), cols: clamp(cols, 64), rows: clamp(rows, 64) };
  saveList([c, ...listCreations()]);
  return c;
}

export function removeCreation(id: string): void {
  saveList(listCreations().filter((c) => c.id !== id));
  void put(id, null).catch(() => undefined);
}

/** 그림 저장 (그릴 때마다 부르면 0.8초 모아서 한 번) */
const timers = new Map<string, number>();
export function saveCreation(id: string, d: ImageData): void {
  window.clearTimeout(timers.get(id));
  timers.set(
    id,
    window.setTimeout(() => {
      toCanvas(d).toBlob((b) => b && void put(id, b).catch(() => undefined), "image/png");
    }, 800),
  );
}

export const isCreation = (id: string) => id.startsWith("create:");

/** 창작 그림을 편집기 그림으로: 저장된 그림이 없으면 투명한 빈 판 */
export function creationAsset(c: Creation): Asset {
  const cw = Math.floor(c.w / c.cols);
  const ch = Math.floor(c.h / c.rows);
  return {
    id: c.id,
    label: `${c.name} (${c.w}×${c.h}${c.cols * c.rows > 1 ? ` · ${c.cols}×${c.rows}칸` : ""})`,
    group: "create",
    load: async () => {
      const blob = await get(c.id).catch(() => undefined);
      if (!blob) return new ImageData(c.w, c.h);
      const url = URL.createObjectURL(blob);
      try {
        return await loadImage(url);
      } finally {
        URL.revokeObjectURL(url);
      }
    },
    grid: { cw, ch, cols: c.cols, rows: c.rows },
    rowNames: Array.from({ length: c.rows }, (_, i) => `${i + 1}줄`),
    file: c.name.replace(/[\\/:*?"<>|\s]+/g, "_") || "drawing",
    place: "",
  };
}
