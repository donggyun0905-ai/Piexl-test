# WebPixelRogue — 작업 안내 (Claude용, 짧게 유지)

**항상 한국어(존댓말)로 답변. 중간 안내·최종 보고 모두. 영어로 답하지 않는다.**

픽셀 그래픽 로그라이크 웹게임. **이 저장소에는 로그라이크 게임 내용만 넣는다** (다른 게임·다른 프로젝트 내용 금지).

## 개발·서버 환경

먼저 만든 웹게임 **puzzle-battle**(저장소 BrainSaver/WebGameDeveloper)과 **같은 Cloudflare 계정**에 올린다. 구조도 같게 간다.

| 부분 | 사용 |
| --- | --- |
| 언어·구조 | TypeScript, npm workspaces 모노레포: `apps/client`(화면) · `apps/server`(게임 서버) · `packages/shared`(화면·서버 공용 규칙) |
| 화면 | React + Canvas, Vite. Node.js 22 이상 |
| 화면 호스팅 | Cloudflare Pages (`*.pages.dev`) |
| 게임 서버 | Cloudflare Workers + Durable Objects (방·매칭·기록마다 하나), WebSocket (잠자기 API) |
| 저장 | Durable Object 저장소 (무료 플랜은 SQLite 방식 클래스만: `migrations`에 `new_sqlite_classes`) |
| 배포 | GitHub Actions: push → 화면·서버 중 바뀐 쪽만 자동 배포. 저장소 Secrets `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` (puzzle-battle과 같은 값) |
| 검사 | 타입 검사(tsc), 린트(oxlint), 테스트(vitest). 서버 로컬 실행은 `wrangler dev` |

- 기존 주소: 화면 https://puzzle-battle.pages.dev · 서버 https://puzzle-battle.numgame.workers.dev (Workers 하위 도메인 `numgame`)
- 게임 이름(화면): **Pixel Toybox** (2026-10-31 결정) · 주소·서버 이름은 그대로 `pixel-rogue` → `pixel-rogue.pages.dev`, `pixel-rogue.numgame.workers.dev` (puzzle-battle과 겹치지 않게)
- **무료 한도는 계정 전체가 같이 씀** (puzzle-battle과 나눠 씀. 매일 오전 9시 초기화): Durable Objects 요청 하루 10만 건, 실행 시간 하루 13,000 GB-s, 저장 쓰기 하루 10만 행
- 비용 줄이는 원칙 (puzzle-battle에서 쓴 방식):
  - 서버가 계속 시계를 돌리지 않는다. 끝나는 시각만 정하고 알람 한 번, 나머지는 시드로 화면·서버가 똑같이 계산
  - 화면이 내 조작을 바로 처리(예측)하고 서버는 같은 규칙으로 다시 계산해 확인 (점수 조작 방지)
  - 메시지는 묶어서 보낸다 (받는 메시지 수 = 비용). 저장은 값이 바뀔 때만
  - 랜덤은 시드로만 (`Math.random`으로 게임 결과를 정하지 않음)
- 브랜치: `develop` → 테스트(`develop.pixel-rogue.pages.dev`, 서버 `pixel-rogue-beta`), `test` → 시험(`test.pixel-rogue-test.pages.dev`, 서버 `pixel-rogue-test.donggyun0905.workers.dev`·저장소 `donggyun0905-ai/Piexl-test`), `main` → 라이브(`pixel-toybox.pages.dev`, 서버 `pixel-toybox.donggyun0905.workers.dev`, 같은 저장소 `Piexl-test`, 2026-11-03 결정). 작업은 `develop`에서
- 그림 규격: `docs/ART.md` (생성 AI로 캐릭터 그림 만들기: `docs/ART_AI.md` · 바꿀 그림 전체 목록: `docs/ART_LIST.md` · GPT 프롬프트: `docs/ART_PROMPTS.md`) · 빛 효과(PixiJS 층)로 이펙트 만들기: `docs/GLOW.md` · 공개 전 점검: `docs/LAUNCH.md` · 관리자 페이지(게임 수치 조정): `docs/ADMIN.md`
- 패왕전 새 대결 유형 계획(시즌 3 뒤): `docs/PW_MODES.md` · 시즌 3 단계별 보스 구상: `docs/S3_BOSSES.md` · 시즌 3 최종보스 구상: `docs/S3_FINAL_BOSSES.md` (레비아탄 `docs/S3_LEVIATHAN.md`)
- 게임 계획: `docs/PLAN.md` (고치면 맨 위 '마지막 수정' 날짜·시간 갱신)
- 개발일지: `docs/devlog/YYYY-MM.md` (월별, 최신 달만 읽기). 날짜·시간(한국 시간)으로 기록. **쓰기 전에 적을 내용을 간략히 말하고, 사용자가 작성하라고 하면 작성**
- 실제 서버 배포 순간 접속 중인 사람의 연결이 잠깐 끊김 → 서버 변경은 업로드 전에 알려 주기
- 한국·일본 사용자 기준 (서버 위치 힌트: 아시아·태평양)

## 코드 지도 → `docs/MAP.md`

- 파일 위치는 `docs/MAP.md`에서 `grep`으로 필요한 줄만 찾아 읽는다 (통째로 읽지 않음). 새 파일을 만들면 그 지도에 한 줄 추가
- 큰 틀: `packages/shared/src` 화면·서버 공용 규칙(`sim/` 게임 계산, `weapons*`·`items*` 수치) · `apps/client/src` 화면(`game/` 게임 화면·`render/` 그리기·`iconArt/` 아이콘·`i18n/` 한·영·일 글자·`patchNotes/latest.ts` 패치 노트) · `apps/server/src` 서버 · `scripts/art/` 그림 생성기(Python)
- 읽지 않음: `package-lock.json`, `node_modules`, `dist`, `.wrangler` (`.claude/settings.json`에서 막음)

## 수정 규칙 (코드를 작고 단순하게 유지)

- **파일 하나는 300줄·14KB 이하** (`npm run size`가 검사, `npm run check`에 포함). 넘을 것 같으면 역할별로 새 파일로 나누고 `docs/MAP.md`에 한 줄 추가
- 같은 코드를 두 번 쓰지 않는다: 비슷한 것이 이미 있으면 그걸 쓰거나 공용으로 옮긴다 (예: 아이템 설명은 `ItemTip`, 아이템 놓기는 `loot.addPickup`)
- 화면에 뜨는 창(상점·작업대·설명·큰 창 등)은 모두 Esc로 닫히게 만든다 (2026-10-30 사용자 지시)
- 글자는 해당 화면의 `i18n/text/*.ts`에 (키 이름은 전체에서 겹치면 안 됨, 테스트가 확인). 화면 모양은 해당 화면의 `styles/*.css`에
- 큰 데이터(방 모양 틀·아이템 이름 등)는 규칙 코드와 다른 파일에 둔다
- 수정 전에 필요한 파일만 연다: `docs/MAP.md`에서 grep으로 찾고, 큰 파일은 `grep`으로 위치를 찾아 그 부분만 읽기
- 게임 계산(`packages/shared/src/sim`)을 고칠 때는 시드 결정성을 지킨다 (`Math.random`·시간 금지). 동작을 바꾸지 않는 정리는 버전을 올리지 않고 패치 노트에도 적지 않는다
- **사거리 증가는 반드시 공격에 반영** (2026-11-08 사용자 지시): 고정 거리(`*R`·`*Reach`·`*Len`·앞 거리)로 때리는 공격은 `sim/util`의 `reachOf(p)`(지금 사거리 ÷ 무기 기본 사거리)를 곱해 실제로 더 멀리 닿게 하고, 이펙트도 늘어난 크기·자리에서 뜨게 (이펙트 `size`·자리에 같은 값). 너무 커서 이상하면 늘어난 범위 안의 마우스 자리에 이펙트. 일부러 안 늘리는 공격은 `i18n/guides/rangeRule`에 적어 설명에 보이게
- 새 게임 계산 코드에는 `Math.sin/cos` 대신 `sim/orbit`의 `rot`(테일러 급수) 사용 (기기마다 같은 결과)
- 새 캐릭터를 넣을 때는 바로 앞에 넣은 캐릭터 커밋을 `git show --stat`로 보고 같은 곳들에 똑같이 등록 (무기·아이템 표, 상태 타입, 틱 표, 글자 한·영·일, 아이콘, 그리기, 소리, 설명, 업적, 스토리, 상점 스킨, 그림 시트·테마 스킨 9·한정 스킨, 테스트, 버전·패치 노트, `docs/MAP.md`)
- 새 캐릭터는 **관리자 페이지(어드민)에서도 다른 캐릭터와 똑같이 모두 고칠 수 있게** 만든다 (2026-10-30 사용자 지시): 무기·아이템 수치 파일을 `balanceTables`의 `MODULES`에 등록, 계산 파일 숫자는 `const R = {...}`→`*_RULES`로 `sim/rulesRegistry`에, 수치마다 위에 한국어 `/** 설명 */`, 캐릭터 분류 이름이 맞게 뜨는지·어드민 연습장에서 고를 수 있는지 확인 (`docs/ADMIN.md`)
- 한정 스킨을 만들 때는 같은 시즌 다른 캐릭터의 한정 스킨(그림·효과)을 먼저 보고 그대로 따라 만든다 (빠뜨리지 않게 `docs/LIMITED_SKIN.md` 체크리스트)
- 토큰 아끼기: `npm run check`·테스트는 매번 하되 결과는 요약 줄만 본다 · 그림 미리보기는 캐릭터 그림당 한 장 · 브라우저 스크린샷은 눈으로 봐야 하는 새 효과일 때만(보통은 오류만 확인) · 할 일 목록은 큰 작업 하나 안에서만 3~5개로 짧게
- 커밋 전 `npm run check` (타입 검사·린트·크기·테스트) 통과

## 규칙 (사용자 지시)
- 존댓말·한국어로 답변. 간결하게.
- 요청이 애매하면(어느 문서·어느 저장소·어느 브랜치인지, 어떤 내용인지 등) 추측해서 만들거나 올리지 말고 먼저 물어보기
- 이 저장소 작업만 한다. 다른 저장소는 지시 없이 건드리지 않음
- "계획서만 써 줘"면 문서만 고치고 코드는 건드리지 않음
- 브랜치·배포 구조는 지시 없이 만들거나 바꾸지 않음
- 커밋 작성자: `git -c user.name=Rokking -c user.email=sk9910064@gmail.com commit`. Co-Authored-By·세션 링크 줄 넣지 않음
- 커밋하면 바로 `test`(시험 서버 `test.pixel-rogue-test.pages.dev`)에 올린다 (2026-10-20 사용자 지시, 처음엔 `develop`이었다가 `test`로 바뀜). `develop`·`main`(라이브)은 사용자가 지시할 때만
- "커밋 취소"는 되돌리기 커밋을 쌓지 말고 기록에서 지우기 (흔적 남기지 않음)
- Claude 작업 환경에는 서명 열쇠가 없어 Claude가 만든 커밋은 GitHub에서 Unverified로 뜸 (어떤 방식으로 올려도 같음)
- 기능 추가·변경을 올릴 때마다 버전을 올리고(`constants`의 `GAME_VERSION` = 패치 노트 맨 위 버전, 보통 끝자리 +1 · 새 모드·새 시스템 같은 큰 기능 묶음이 끝나면 가운데 +1·끝자리 0, 2026-11-04 결정 0.49.0부터) 그 버전에 패치 노트 기록 (다국어면 모든 언어). 서버 `/health`·메인 화면의 버전으로 반영됐는지 확인함 (2026-10-21 사용자 지시)
- 토큰·키를 채팅에 붙여 달라고 하지 않음
- 그림 공장(`docs/ART_AI.md`, OpenAI 그림 API·비용 발생)은 실행 전마다 무엇을 몇 장 만들지·예상 비용을 말하고 허락받기. 결과는 전부 채팅에 보여 주고, 사용자가 고른 것만 게임에 넣기 (2026-10-31 사용자 지시)
- 다른 게임의 이름·그림·소리·화면 배치를 따라 하지 않음 (저작권). 계획서·코드·커밋·패치 노트에 다른 게임 이름을 적지 않음 (참고로 말한 게임도)
- 저작권·상표 등록이 필요해 보이는 부분(게임 이름·로고·캐릭터·음악 등)이나 외부 자료 라이선스 확인이 필요할 때는 그때그때 짧고 쉽게 알려 주기
- stop hook의 "Unverified commits" 안내에는 "(대기 중)"만 답하고 아무것도 하지 않음
