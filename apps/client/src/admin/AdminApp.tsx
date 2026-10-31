// 관리자 페이지 (/admin/): 이 주소의 서버(라이브·디벨롭·테스트) 게임 수치를 보고 바꿈. 저장하면 다음 판부터 게임에 적용
// 위쪽에서 던전 수치 / 타워 디펜스 수치 / 패왕전 수치를 고름 (주소 /admin/?td · ?pw). 세 수치는 서버에도 따로 저장
import { useCallback, useEffect, useState } from "react";
import { homeServer, logout, session, type ServerInfo, type SetKind } from "./adminApi";
import { BalanceAdmin } from "./BalanceAdmin";
import { ClearStats } from "./ClearStats";
import { Login } from "./Login";

function kindFromUrl(): SetKind {
  try {
    const q = new URLSearchParams(location.search);
    return q.has("td") ? "td" : q.has("pw") ? "pw" : "dungeon";
  } catch {
    return "dungeon";
  }
}

export function AdminApp() {
  // 이 주소의 서버만 다룸 (라이브는 pixel-rogue.pages.dev/admin/, 디벨롭은 develop…, 테스트는 test…)
  const [server] = useState<ServerInfo>(homeServer);
  const [kind, setKind] = useState<SetKind>(kindFromUrl);
  /** 수치 대신 캐릭터별 클리어 시간 보기 */
  const [clears, setClears] = useState(false);
  /** 로그인·로그아웃하면 늘려서 다시 확인 */
  const [reload, setReload] = useState(0);
  const loggedIn = reload >= 0 && session(server) !== "";
  const again = useCallback(() => setReload((n) => n + 1), []);

  // 고른 쪽을 주소에도 남김 (새로 고쳐도 그대로)
  useEffect(() => {
    const url = new URL(location.href);
    url.searchParams.delete("td");
    url.searchParams.delete("pw");
    if (kind !== "dungeon") url.searchParams.set(kind, "");
    history.replaceState(null, "", url);
  }, [kind]);

  return (
    <div className={`admin admin-${kind}`}>
      <header className="admin-top">
        <h1>Pixel Toybox 관리자</h1>
        <span className="admin-server">{server.label}</span>
        <span className="admin-kinds">
          <button type="button" className={!clears && kind === "dungeon" ? "active" : undefined} onClick={() => (setKind("dungeon"), setClears(false))}>
            던전 수치
          </button>
          <button type="button" className={!clears && kind === "td" ? "active" : undefined} onClick={() => (setKind("td"), setClears(false))}>
            타워 디펜스 수치
          </button>
          <button type="button" className={!clears && kind === "pw" ? "active" : undefined} onClick={() => (setKind("pw"), setClears(false))}>
            패왕전 수치
          </button>
          <button type="button" className={clears ? "active" : undefined} onClick={() => setClears(true)}>
            클리어 시간
          </button>
        </span>
        {/* 몬스터·보스 그림(도트) 고치기: 도트 편집 페이지의 몬스터 묶음 */}
        <a className="admin-pixel-link" href={`${import.meta.env.BASE_URL}pixel/`} target="_blank" rel="noreferrer">
          몬스터·보스 그림 고치기
        </a>
        {loggedIn && (
          <button
            type="button"
            className="admin-logout"
            onClick={() => {
              logout(server);
              again();
            }}
          >
            로그아웃
          </button>
        )}
      </header>
      {!clears && kind === "td" && <p className="admin-hint">타워 디펜스에만 쓰는 수치입니다. 여기서 바꿔도 던전(혼자 하기·일일 도전·배틀)에는 영향이 없습니다.</p>}
      {!clears && kind === "pw" && <p className="admin-hint">패왕전에만 쓰는 수치입니다 (역할군·캐릭터 능력치 배율·스킬·규칙). 여기서 바꿔도 던전·타워 디펜스에는 영향이 없습니다.</p>}
      {!loggedIn && <Login server={server} onDone={again} />}
      {loggedIn && clears && <ClearStats server={server} />}
      {loggedIn && !clears && <BalanceAdmin key={`${kind}:${reload}`} server={server} kind={kind} onLoggedOut={again} />}
    </div>
  );
}
