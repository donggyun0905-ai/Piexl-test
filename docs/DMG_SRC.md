# 피해 출처 기록 (결과 창 '피해 출처')

마지막 수정: 2026-11-12 (4차)

## 어떻게 동작하나
- `sim/dmgSrc.ts`: 적 체력이 깎일 때마다 "지금 무엇이 때리는 중인지"(출처)로 나눠 `p.dmgBy`에 더함. 게임 결과에는 영향 없음 (기록만)
- 출처 종류: `""` 무기·기본 기술 (표시 안 된 모든 피해) · 패시브 id (그 패시브 구간) · `d:종류` 상태이상
- 적는 곳: `combat.damageEnemy` → `pvpRecap.logHit` → `logDmg` · 상태이상은 `util.markDot` → `logDot` · 체력을 직접 깎는 몇 곳은 `logDmg`를 직접 부름
- 패시브 구간 표시: `srcRun(s, "패시브id", () => { ... })` — 이 안에서 준 피해는 그 패시브의 것. 안에서 쏜 내 탄·잠시 뒤 폭발은 출처(`src`)를 달고 가서 맞을 때 그 출처로 셈
- 패왕전은 세지 않음 (연습장 허수아비는 셈)

## 일괄 표시 스크립트
`python3 scripts/dev/tag-dmg-src.py` (`packages/shared/src/sim`에서 실행). 아래 두 모양만 자동으로 감쌈 (2026-11-12 1차: 79개 파일 134곳)
- `if (hasPerk(p, "X") ...) { 피해를 주는 코드 }` — `else`가 없고 안에 `return`·`continue`·`break`가 없을 때
- 함수 맨 위 `if (!hasPerk(p, "X")) return;` — 그 뒤 함수 전체를 감쌈 (`: void` 함수만)

파일 크기 한도(300줄·14KB)를 넘게 되는 파일은 건너뜀. 돌린 뒤 `npm run check` 필수.

## 파일 단위 출처 (2차, 2026-11-12)
- `python3 ../../../../scripts/dev/bind-dmg-src.py` (`packages/shared/src/sim`에서 실행): 파일마다 가져온 피해 함수(`damageEnemy`·`blastAt`·`statusHit`·`…Kit`/`s2Kit`의 때리기 도우미)를 `srcFn("파일", ...)`으로 묶음 → 그 파일에서 준 피해는 `f:파일` (202개 파일)
- 우선순위: 패시브 구간(`srcRun`) > 가장 안쪽 파일 > 무기
- 공용 엔진 파일(`combat`·`projectiles`·`player`·`…Kit` 등)은 묶지 않음 (부른 쪽 파일의 것으로 셈)
- 이름: 화면 `apps/client/src/game/srcNames.ts` (한·영·일). **여기 이름이 없는 파일은 무기 줄에 합쳐짐** (캐릭터 본체 파일 = 기본 공격). 같은 이름끼리는 한 줄
- 새 기술 파일을 만들면: 스크립트를 다시 돌리고(이미 묶인 파일은 건너뜀) `srcNames`에 이름 한 줄

## 아직 무기 줄에 합쳐지는 것
- 캐릭터 본체 파일 안에 기본 공격과 스킬이 같이 있는 캐릭터의 스킬 (예: 스킬이 `캐릭터.ts` 한 파일에 있는 경우) → 파일을 나누거나 `srcRun(s, "f:이름", ...)`으로 감싸면 따로 나옴
- 패시브 구간 밖에서 쏜 탄 (출처를 달지 않아 맞을 때 무기로 셈)
- 능력치만 올리는 패시브는 원리상 따로 나오지 않음 (무기 피해에 섞임)

## 소환물이 만든 패시브를 달고 다님 (3차, 2026-11-12)
- 문제: 패시브 구간(`srcRun`)에서 만든 소환물·장판·예약 공격이 **나중 틱에** 때리면 구간이 이미 끝나서 파일 묶음 이름(예: 그림 소환)으로 잡혔음
- `dmgSrc.ts`의 `LISTS`: 플레이어 상태의 소환물 목록 이름들. `srcRun`이 끝날 때 그 목록에 새로 생긴 것에 `dsrc`(만든 패시브)를 달아 둠
- 때리는 쪽: 목록을 돌 때 `for (const x of srcEach(p.목록))`, `filter`에는 `filter(srcCb((x) => ...))` → 그 소환물의 `dsrc`가 출처가 됨 (없으면 그대로 = 파일 묶음·무기)
- **새 소환물 목록을 만들면**: `LISTS`에 이름을 넣고, 도는 곳에 `srcEach`·`srcCb`
- 한 줄짜리 `if (hasPerk(p, "X")) 피해;`는 `srcRun(s, "X", () => { ... })`로 감쌈 (17곳). 배율만 바꾸는 패시브(공격력 ×1.2 등)는 원리상 무기·기술 줄에 섞임

## 모든 캐릭터를 패시브·기술마다 (4차, 2026-11-12)
- 출처 키: `패시브id` · `k:글자키` 캐릭터 기본 스킬 하나(이름 = i18n 글자, 예: `k:gbSkill1`) · `n:이름` 기술 하나(이름은 `srcNames`의 표) · `n:vyS번호`/`n:vyA번호` 운명의 여행자 운명 칸의 기술·능력 · `d:종류` 상태이상 · `""` 무기
- `k:`·`n:`는 파일 묶음(`f:`)보다 먼저. `srcRun(s, "", …)`은 억지로 무기 줄
- 도우미: `srcOpt(s, 조건 && "id", fn)` 덤으로 한 번 더 나가는 공격(두 번째부터 패시브 몫) · `srcTag(물체, "id")` 목록 밖에서 만든 소환물에 직접 · `srcBind(s)` 틱마다(run.stepSim) 지금 판을 알려 `srcEach`·`srcCb`가 소환물이 새로 만든 탄·소환물에도 같은 출처를 달게 함
- 스크립트 (저장소 맨 위에서): `node scripts/dev/tag-dmg-src2.cjs scripts/dev/dmg-src-skip.json` (문법 분석으로 `if (hasPerk…) 공격` 감싸기 · 끝이 `return;`인 블록은 `return srcRun(…)`) · `node scripts/dev/each-dmg-src.cjs` (LISTS를 도는 for…of·filter에 srcEach·srcCb) · `node scripts/dev/fix-src-imports.cjs` (가져오기 맞추기). `scripts/dev/passive-ids.json`은 패시브 id 목록(새 패시브가 생기면 다시 만듦)
- 두 번 세기 막기: 피해 함수로 깎은 뒤 `markDot`도 부르는 곳은 `muteDot(() => markDot(…))` (출혈·독가스·포자) · 숫자만 깎는 곳은 `markDot`만
- 남은 것: 능력치·배율만 바꾸는 패시브는 무기·기술 줄에 섞임 (아리아·레이븐과 같음). 패시브가 하나의 기본 공격 자체를 바꾸는 것(분쇄 등)도 무기 줄
