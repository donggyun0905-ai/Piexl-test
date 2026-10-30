// 상점 쪽 저장(쿠폰·스킨·이벤트 코인·효과·펫·칩·미션)을 서버에도 백업: 브라우저 저장소를 지워도·기기 연동해도 남게.
// 바뀌면 몇 초 모아 한 번 올림 (요청 수 = 비용). 열 때 한 번 받아 맞춤. 서버는 차례 번호(rev)가 맞을 때만 받고,
// 다른 기기가 먼저 올렸으면 받은 값과 합쳐(cloudMerge) 다시 올림
import { apiPost } from "./api";
import { merge3, type Json } from "./cloudMerge";
import { getPlayerId } from "./player";
import { SERVER_URL } from "./serverStatus";
import { loadText, saveText, watchSaves } from "./storage";

export const CLOUD_KEYS = ["wallet", "eventCoins", "fxShop", "lobbyPets", "chips", "missions", "mastery"] as const;
const UPLOAD_MS = 4000;

type Blob = Record<string, Json>;
interface Meta {
  /** 이 기록이 누구 것인지 (기기 연동·해제로 ID가 바뀌면 처음부터 합침) */
  owner: string;
  rev: number;
  /** 마지막으로 서버와 맞춘 값 */
  base: Blob;
  dirty: boolean;
}
interface Stored {
  rev: number;
  data: Blob | null;
  saved?: boolean;
}

function readLocal(): Blob {
  const out: Blob = {};
  for (const k of CLOUD_KEYS) {
    try {
      const t = loadText(k);
      if (t) out[k] = JSON.parse(t);
    } catch {
      // 깨진 값은 건너뜀
    }
  }
  return out;
}

function loadMeta(): Meta {
  const fresh: Meta = { owner: getPlayerId(), rev: 0, base: {}, dirty: true };
  try {
    const m = JSON.parse(loadText("cloud") ?? "null") as Meta | null;
    return m && m.owner === getPlayerId() ? m : fresh;
  } catch {
    return fresh;
  }
}

let applying = false;
const listeners: (() => void)[] = [];
/** 서버 값으로 바꿨을 때 (기억해 둔 값을 버리게: wallet) */
export const onCloudApplied = (fn: () => void) => listeners.push(fn);

function writeLocal(data: Blob): void {
  applying = true;
  for (const k of CLOUD_KEYS) if (data[k] !== undefined) saveText(k, JSON.stringify(data[k]));
  applying = false;
  for (const fn of listeners) fn();
}

const saveMeta = (m: Meta) => saveText("cloud", JSON.stringify(m));

let timer: ReturnType<typeof setTimeout> | null = null;
let busy = false;
let again = false;

/** 열 때 한 번 · 바뀐 뒤 몇 초 뒤: 서버와 맞춤 */
export async function syncCloud(): Promise<void> {
  if (!SERVER_URL) return;
  if (busy) {
    again = true;
    return;
  }
  busy = true;
  try {
    let meta = loadMeta();
    const got = await apiPost<Stored>("/api/cloud/get", { player: getPlayerId() });
    if (!got.ok || !got.data) return;
    for (let tries = 0; tries < 3; tries++) {
      const server = got.data;
      if (server.data && server.rev !== meta.rev && JSON.stringify(server.data) === JSON.stringify(readLocal())) {
        // 창을 닫을 때 보낸 것이 이미 들어가 있음
        meta = { ...meta, rev: server.rev, base: server.data, dirty: false };
        saveMeta(meta);
      }
      if (server.data && server.rev !== meta.rev) {
        // 다른 기기가 먼저 바꿈: 이 기기에서 바꾼 게 없으면 서버 것 그대로, 있으면 합침
        const merged = meta.dirty ? (merge3(meta.base, readLocal(), server.data) as Blob) : server.data;
        writeLocal(merged);
        meta = { ...meta, rev: server.rev, base: server.data };
        saveMeta(meta);
      }
      if (!meta.dirty) return;
      const data = readLocal();
      const res = await apiPost<Stored>("/api/cloud/save", { player: getPlayerId(), base: meta.rev, data });
      if (!res.ok || !res.data) return;
      if (res.data.saved) {
        // 올리는 동안 또 바뀌었으면 dirty는 남겨 둠
        saveMeta({ ...meta, rev: res.data.rev, base: data, dirty: JSON.stringify(readLocal()) !== JSON.stringify(data) });
        return;
      }
      got.data = res.data;
    }
  } finally {
    busy = false;
    if (again) {
      again = false;
      void syncCloud();
    }
  }
}

/** 상점 쪽 값이 바뀌면 표시해 두고 잠시 뒤 올림 */
watchSaves((key) => {
  if (applying || !(CLOUD_KEYS as readonly string[]).includes(key)) return;
  const meta = loadMeta();
  if (!meta.dirty) saveMeta({ ...meta, dirty: true });
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    timer = null;
    void syncCloud();
  }, UPLOAD_MS);
});

// 창을 닫을 때 아직 안 올린 것이 있으면 바로 보냄 (응답은 못 받음: 어긋났으면 다음에 열 때 합침)
if (typeof window !== "undefined") {
  window.addEventListener("pagehide", () => {
    if (!timer || !SERVER_URL) return;
    clearTimeout(timer);
    timer = null;
    const body = JSON.stringify({ player: getPlayerId(), base: loadMeta().rev, data: readLocal() });
    navigator.sendBeacon?.(`${SERVER_URL}/api/cloud/save`, body);
  });
}
