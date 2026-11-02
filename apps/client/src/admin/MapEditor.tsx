// 관리자 '맵 만들기': 종류(던전 방·광야의 새벽·타워 디펜스)를 고르고 칸을 드래그로 깔아 맵을 만들고 서버에 저장
// 던전 방은 혼자 하기(순위 경쟁 모드 빼고)의 방 모양·연습장에, 광야의 새벽·타워 디펜스는 맵 고르기에 나옴
import { blankMap, cleanMaps, MAP_KINDS, MAP_SIZE, MAP_TILES, tdFromTiles, type CustomMap, type MapKind } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import { adminApi, errorText, type ServerInfo } from "./adminApi";
import { MapCanvas, TILE_COLOR } from "./MapCanvas";

const KIND_SHORT: Record<MapKind, string> = { room: "던전 방", swarm: "광야의 새벽", td: "타워 디펜스" };
const KIND_LABEL: Record<MapKind, string> = { room: "던전 방 (13×7, 연습장에도)", swarm: "광야의 새벽 (64×40)", td: "타워 디펜스 (20×12)" };
const TILE_LABEL: Record<string, string> = {
  ".": "바닥",
  "#": "벽 (몸·탄 막음)",
  o: "기둥·바위 (몸·탄 막음)",
  "~": "깊은 물 (몸만 막음, 탄은 넘어감)",
  w: "얕은 물 (조금 느려짐, 감전되면 데임)",
  m: "진흙 (느려짐)",
  l: "용암 (데임)",
  x: "가시 함정 (주기적으로 솟음)",
  T: "미사일 타워 (나를 도움)",
  p: "길 (적이 걷는 곳)",
  g: "지킬 곳 (길 끝)",
};
const HELP: Record<MapKind, string> = {
  room: "혼자 하기 전투방·강한 적 방 모양으로 섞여 나옵니다. 위 출구 아래·아래 입구 위·가운데(보상 자리)는 바닥으로 두세요.",
  swarm: "가운데(시작 자리) 둘레는 비워 두세요. 타워(T)는 칸 하나에 하나.",
  td: "길(p)은 한 칸 너비로 끊기지 않게 이어 주세요. 한쪽 끝은 가장자리(여러 개면 입구 여러 개), 다른 끝은 지킬 곳(g) 하나입니다. 이어지지 않으면 맵 목록에 안 나옵니다.",
};

export function MapEditor({ server }: { server: ServerInfo }) {
  const [maps, setMaps] = useState<CustomMap[] | null>(null);
  const [sel, setSel] = useState<string>("");
  const [tile, setTile] = useState("#");
  const [brush, setBrush] = useState(1);
  const [dirty, setDirty] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    void adminApi.maps(server).then((res) => (res.ok && res.data ? setMaps(res.data.maps) : setMsg({ ok: false, text: errorText(res.error) })));
  }, [server]);

  if (!maps) return msg ? <p className="admin-error">{msg.text}</p> : <p className="admin-hint">불러오는 중…</p>;
  const map = maps.find((m) => m.id === sel);
  const update = (next: CustomMap[]) => {
    setMaps(next);
    setDirty(true);
  };
  const add = (kind: MapKind) => {
    let n = maps.length + 1;
    while (maps.some((m) => m.id === `${kind}-${n}`)) n++;
    const m = blankMap(kind, `${kind}-${n}`, `${KIND_SHORT[kind]} ${n}`);
    update([...maps, m]);
    setSel(m.id);
    setTile(kind === "td" ? "p" : "#");
  };
  const save = async () => {
    const res = await adminApi.saveMaps(server, cleanMaps(maps));
    if (res.ok && res.data) {
      setMaps(res.data.maps);
      setDirty(false);
      setMsg({ ok: true, text: `저장했습니다 (${res.data.maps.length}개). 새로 시작하는 판부터 나옵니다.` });
    } else setMsg({ ok: false, text: errorText(res.error) });
  };

  return (
    <div className="admin-maps">
      {msg && <p className={msg.ok ? "admin-ok" : "admin-error"}>{msg.text}</p>}
      <div className="admin-filter">
        {MAP_KINDS.map((k) => (
          <button key={k} type="button" onClick={() => add(k)}>
            + {KIND_LABEL[k]}
          </button>
        ))}
        <button type="button" className="primary" disabled={!dirty} onClick={() => void save()}>
          {server.label}에 저장
        </button>
      </div>
      <div className="admin-map-body">
        <ul className="admin-map-list">
          {maps.length === 0 && <li className="admin-hint">아직 만든 맵이 없습니다. 위에서 종류를 골라 새로 만드세요.</li>}
          {maps.map((m) => (
            <li key={m.id}>
              <button type="button" className={m.id === sel ? "active" : undefined} onClick={() => setSel(m.id)}>
                {m.name} <small>{KIND_SHORT[m.kind]}</small>
              </button>
            </li>
          ))}
        </ul>
        {map && (
          <div className="admin-map-edit">
            <div className="admin-filter">
              <input value={map.name} maxLength={30} onChange={(e) => update(maps.map((m) => (m.id === map.id ? { ...m, name: e.target.value } : m)))} />
              <span className="admin-hint">
                {map.id} · {MAP_SIZE[map.kind].cols}×{MAP_SIZE[map.kind].rows}
              </span>
              <button type="button" onClick={() => update(maps.map((m) => (m.id === map.id ? blankMap(m.kind, m.id, m.name) : m)))}>
                모두 지우기
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!confirm(`'${map.name}' 맵을 지울까요? (저장해야 서버에서도 지워짐)`)) return;
                  update(maps.filter((m) => m.id !== map.id));
                  setSel("");
                }}
              >
                맵 지우기
              </button>
            </div>
            <div className="admin-filter">
              {Object.entries(MAP_TILES)
                .filter(([, kinds]) => kinds.includes(map.kind))
                .map(([ch]) => (
                  <button key={ch} type="button" className={tile === ch ? "active" : undefined} onClick={() => setTile(ch)}>
                    <span className="admin-swatch" style={{ background: TILE_COLOR[ch] }} /> {TILE_LABEL[ch]}
                  </button>
                ))}
              <label>
                붓 크기
                <select value={brush} onChange={(e) => setBrush(Number(e.target.value))}>
                  {[1, 2, 3, 5].map((b) => (
                    <option key={b} value={b}>
                      {b}칸
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {map.kind === "td" && !tdFromTiles(map.id, map.name, map.tiles) && <p className="admin-error">길(p)이 가장자리에서 지킬 곳(g)까지 이어지지 않았습니다. 이대로는 맵 목록에 나오지 않습니다.</p>}
            <p className="admin-hint">누르고 끌어서 칠하기 · 오른쪽 버튼으로 끌면 바닥으로 지우기. {HELP[map.kind]}</p>
            <MapCanvas key={map.id} map={map} tile={tile} brush={brush} onChange={(tiles) => update(maps.map((m) => (m.id === map.id ? { ...m, tiles } : m)))} />
          </div>
        )}
      </div>
    </div>
  );
}
