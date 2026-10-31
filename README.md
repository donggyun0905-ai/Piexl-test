# Pixel Toybox (주소·서버 이름은 pixel-rogue)

픽셀 그래픽 탑뷰 실시간 액션 로그라이크 웹게임. 계획은 [docs/PLAN.md](docs/PLAN.md), 개발일지는 [docs/devlog/](docs/devlog/) (월별).

| 브랜치 | 화면 | 서버 |
| --- | --- | --- |
| `develop` (베타) | https://develop.pixel-rogue.pages.dev | https://pixel-rogue-beta.numgame.workers.dev |
| `main` (라이브) | https://pixel-rogue.pages.dev | https://pixel-rogue.numgame.workers.dev |

## 구조

- `apps/client` 화면 (React + Canvas, Vite)
- `apps/server` 게임 서버 (Cloudflare Workers)
- `packages/shared` 화면·서버 공용 규칙 (시드 랜덤, 게임 계산)

## 명령 (Node.js 22 이상)

```bash
npm install
npm run dev          # 화면 http://localhost:5173
npm run dev:server   # 서버 http://localhost:8787 (베타 설정)
npm run check        # 타입 검사 + 린트 + 테스트
```

push하면 GitHub Actions가 화면·서버 중 바뀐 쪽만 배포합니다.
