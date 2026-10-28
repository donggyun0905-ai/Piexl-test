// 웹앱 설치용 서비스 워커: 한 번 받은 화면 파일을 저장해 두고, 인터넷이 없을 때 꺼내 씀 (혼자 하기)
// 페이지·그림은 늘 새로 받고 실패할 때만 저장본 → 업데이트가 바로 보임
// 서버(게임 서버·순위표) 요청은 다른 주소라 건드리지 않음
// 이름은 게임 버전마다 바뀜 (install.ts가 sw.js?v=버전으로 등록) → 새 버전이 켜질 때 예전 저장본을 모두 지워 저장 공간이 쌓이지 않게
const CACHE = "pixel-rogue-" + (new URL(self.location.href).searchParams.get("v") || "v1");

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// 저장 후 돌려줌 (응답은 한 번만 읽을 수 있어 복사본을 저장)
function keep(key, res) {
  if (res.ok) {
    const copy = res.clone();
    caches.open(CACHE).then((c) => c.put(key, copy));
  }
  return res;
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== self.location.origin) return;
  // 이름에 해시가 붙은 파일(/assets/)은 내용이 바뀌지 않으니 저장본 먼저
  if (url.pathname.startsWith("/assets/")) {
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => keep(req, res))));
    return;
  }
  // 페이지·그림 등은 새로 받고, 실패할 때만 저장본
  const key = req.mode === "navigate" ? "/" : req;
  e.respondWith(
    fetch(req)
      .then((res) => keep(key, res))
      .catch(() => caches.match(key).then((r) => r || Response.error())),
  );
});
