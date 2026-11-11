# 빛 효과 층 (PixiJS·WebGL) 안내

마지막 수정: 2026-11-11 16:50 (한국 시간)

게임 화면은 Canvas 2D로 그리고, 그 **바로 위에 PixiJS(WebGL) 투명 캔버스 한 장**을 겹쳐 "빛나는 것"만 그린다 (0.49.36부터).
디자인·이펙트를 만들 때 "이건 Canvas 2D로 그릴까, 빛 층으로 그릴까"를 정하는 기준과 쓰는 법을 적는다.

## 1. 구조

| 파일 | 하는 일 |
| --- | --- |
| `game/glow/glowCanvas.ts` | **공용 층** `GlowCanvas`: PixiJS 불러오기(처음 쓸 때만) · 겹칠 요소 바로 뒤에 붙어 자리·크기·흔들림 맞춤 · 붉은 테두리(`cues.hurt`)·번쩍임(`cues.flash`) · `glowWanted()` 설정 확인 |
| `game/glow/glowParts.ts` | 빛 조각 모음(최대 900개 다시 씀): `dot` 둥근 빛 · `spark` 날아가는 불티 · `ring` 퍼지는 고리 · `hexColor` 글자 색 → 숫자 |
| `game/glow/glowLayer.ts` | 게임 화면: 게임 카메라에 맞춰 그림 · `addWatch`로 상태 보기 더함 (`gameLoop`에서 만듦) |
| `game/glow/glowWatch.ts` | 맞힘 불티·치명타 별빛 · 처치 폭발·보스 처치 번쩍 · 탄 꼬리(내 편 하늘색·적 붉게·보스 탄 크게) · 큰 공격(`BIG_FX`) · 내가 맞음 |
| `game/glow/glowSkills.ts` | 각성(꼬리표 색)·필살기(`ULT_FX`) · 보스 궁극기 기 모음 · 회복·보호막·돈 · 바닥 아이템 빛·주움 · 용암 불티 · 어두운 장면 등불 |
| `game/glow/glowSilber.ts` · `silberFxKinds.ts` | 크루세이더 뒤 실베르 캐릭터(조커·쉐도잉·인형술사·래빗·백령·빙설·아수라): 효과마다 색·세기 1~4 표 · 늘 켜진 빛(아수라 각성·날아가는 주먹·표식, 빙설 궁극기, 조커 카드, 쉐도잉 영혼, 백령 검기, 래빗 땅울림) — **새 실베르 캐릭터는 이 표에 효과 이름·색·세기를 더함** |
| `game/glow/glowKinds.ts` | 크게 빛날 효과 이름 `BIG_FX`(빛·고리·불티)·`ULT_FX`(빛기둥·번쩍) — **새 캐릭터 큰 기술은 여기에 이름만 더함** |
| `game/glow/glowHints.ts` | Canvas 2D → 빛 층 다리: `glowHint(ctx, x, y, 지름, 색)`·`glowHintRect` — 빛 층이 돌고 있으면 true(그리는 쪽은 `shadowBlur` 생략), 아니면 false(예전처럼 번짐) |
| `game/glow/glowSkin.ts` | 한정 스킨·상점 이벤트 효과 조각(`limited/tigerFx`의 `parts`)에 빛을 더함 |
| `game/glow/glowFlat.ts` | 카메라 없는 판 전체 화면 (타워 디펜스 `td/TdGame`) — 내 체력 빛은 끔 |
| `game/glow/useGlow.ts` | 화면 요소(DOM 카드·창)에 붙이는 훅 — 명예의 전당 우승자 카드(`daily/HallOfFame`) |
| `lobby/lobbyGlow.ts` | 로비·메인 화면 뒤 배경 (`LobbyStage`) |
| `shop/gachaGlow.ts` | 뽑기 연출 (`GachaReveal`, 카드 등급 색으로 터짐) |
| `styles/glow.css` | 층 위치 · **`mix-blend-mode: screen`** (아래 화면에 빛을 더함, 없으면 흐릿하게 덮임) |
| 설정 `glowFx` | 설정 창 '빛 효과' (기본 켜짐, 모든 빛 층이 따름) |

- PixiJS는 `import("pixi.js")`로 따로 불러와 **첫 화면 로딩에는 들어가지 않음** (압축 후 약 180KB).
- WebGL이 안 되는 기기는 빛만 빠지고 화면은 그대로.
- Cloudflare 비용 없음: 사용자 기기에서 그리고, Pages 정적 파일은 무료·무제한.
- **WebGL은 브라우저마다 동시에 16개쯤까지**: 카드가 여러 장 뜨는 목록(상점 효과 미리보기 `FxPreview` 등)에는 붙이지 않는다. 한 화면에 층 1~4개.

## 2. 꼭 지킬 것

1. **화면 꾸밈만.** `packages/shared/src/sim`(게임 계산)에는 절대 넣지 않는다. 빛 층은 상태를 **읽기만** 한다. 그래서 `Math.random`·`performance.now` 써도 됨 (시드·기록 검사와 무관).
2. **위험 표시를 가리지 않는다.** 보스 예고선·위험 원 위에 큰 빛을 덮지 않는다. 적 탄은 붉은 빛으로 *더 잘 보이게*만.
3. **조각 수 한도.** 한 번에 900개, 탄 꼬리 70개. 새 효과는 한 번에 많아야 수십 개. 매 화면 계속 만드는 효과(꼬리·오라)는 짧은 수명(0.1~0.2초)으로.
4. **지속 피해(독·불)는 불티 없음.** 너무 많아져 화면이 지저분해진다.
5. **방이 바뀌면 지움** (`glowWatch`가 `roomId` 변화로 처리).
6. **설정 하나로 끔.** 새 빛 효과도 모두 `glowFx`를 따른다 (따로 스위치 만들지 않음).
7. 파일 300줄·14KB 규칙 그대로. 효과가 늘면 `glow/` 안에 역할별 파일을 새로 만들고 `docs/MAP.md`에 한 줄.

## 3. 어느 쪽으로 그릴까 (디자인 기준)

| 이런 것 | 그리는 곳 |
| --- | --- |
| 모양·윤곽이 중요한 것 (캐릭터·무기 궤적·글자·아이콘·도트 그림) | Canvas 2D (`render/`) |
| 판정과 맞아야 하는 것 (위험 표시·공격 범위) | Canvas 2D |
| 겹칠수록 밝아지는 빛 (폭발 섬광·불티·빛 꼬리·충격파·번쩍임·오라 번짐) | **빛 층** |
| 지금 Canvas 2D에서 `shadowBlur`·`lighter` 합성·큰 `createRadialGradient`로 흉내 내는 빛 | **빛 층으로 옮길 후보** (폰에서 Canvas 2D 번짐은 느림) |

- 같은 효과를 둘로 나눠도 됨: **몸통·모양은 Canvas 2D, 번짐·불티는 빛 층** (예: 처치 → 적 그림은 사라지고 빛 층이 폭발).
- 색: 빛 층은 더하기(`add`) 합성이라 **어두운 색은 거의 안 보이고, 밝은 색은 겹치면 흰색으로** 간다. 진한 원색(주황 `0xff7a3c`·하늘 `0x7cf0ff`·보라 `0xc77dff`)을 쓰고 흰 심을 조금 섞으면 예쁘다.
- 세기: 일반 처치 0.3~0.5초, 보스·궁극기 0.8~1.2초. 화면 번쩍임(`cues.flash`)은 보스 처치·궁극기 같은 드문 순간에만.

## 4. 새 효과 넣는 법

`glowWatch.ts`(또는 새 파일)에서 상태 변화를 찾고 `GlowParts`로 만든다. 좌표·크기는 **게임 픽셀** 단위.

```ts
// 둥근 빛 하나 (커지며 사라짐)
parts.spawn(x, y, { life: 0.3, s0: 12, s1: 24, color: 0xffc53c, alpha: 0.8 });
// 퍼지는 고리
parts.spawn(x, y, { kind: "ring", life: 0.4, s0: 6, s1: 40, color: 0x7cf0ff });
// 사방 불티 (개수, 속도, 색, 수명, 크기)
parts.burst(x, y, 16, 220, 0xff7a3c, 0.55, 2.4);
// 계속 켜져 있는 빛 (매 화면 부름, 화면 속도와 상관없이 같은 밝기)
parts.steady(x, y, 30, 0xffd9a0, 0.3);
// 화면 전체: 붉은 테두리·번쩍임 (0~1, 저절로 줄어듦)
cues.hurt = 1;
cues.flash = 1;
```

- "새로 생긴 것" 찾기: 효과(`s.effects`)는 `WeakSet`으로 처음 본 것만 · 적은 `id`별 이전 체력과 비교 · 처치는 사라진 적 + `s.kills` 증가로.
- 특정 캐릭터 전용 빛: `s.player`의 그 캐릭터 상태 값 변화를 보고 만든다 (협동은 `allPlayers`).
- 크게 빛날 효과 종류는 `glowKinds.ts`의 `BIG_FX`(필살기급은 `ULT_FX`)에 이름만 넣으면 빛이 붙는다.
- Canvas 2D 그림에 번짐이 필요하면 `shadowBlur` 대신: `if (!glowHint(ctx, 0, 0, 지름, 색)) { ctx.shadowColor = 색; ctx.shadowBlur = 8; }` (빛 효과를 끈 사람은 예전 번짐)
- 매 화면 새로 놓는 빛은 `spawn`이 아니라 `steady` (느린 기기에서 흐려지지 않음)

## 5. 확인하는 법

1. `apps/client`에서 `npx vite` → `http://localhost:5173/?adminPractice=warden` (연습장 바로 열기)
2. 개발 서버에서는 콘솔에 `window.pixelRogueRun`이 있어 상태를 바꿔 볼 수 있음:
   - 맞힘·치명타: `e.hp -= 5; e.critTick = run.tick`
   - 처치: 적을 `run.enemies`에서 빼고 `run.kills += 1`
   - 내가 맞음: `run.player.hp -= 30`
3. 헤드리스 브라우저는 `--use-angle=swiftshader --enable-unsafe-swiftshader`로 띄워야 WebGL이 켜짐.
4. 폰에서 느리면 먼저 조각 수 한도(`MAX_PARTS`·`MAX_TRAILS`)를 낮춘다.

## 6. 넣은 곳과 남은 곳 (2026-11-05)

**넣음 (0.49.36~0.49.39)**: 캐릭터 큰 기술 38가지(`glowKinds`) · 용암·리바이어 고래·테일 상어·이클립스 날 번짐을 빛 층으로(`glowHints`, 이클립스는 날 길을 따라 여러 개) · 게임 화면 공통(맞힘·처치·탄·큰 공격·피격) · 한정 스킨·상점 이벤트 효과(게임 안) · 각성·필살기·보스 궁극기 · 회복·보호막·돈 · 바닥 아이템 · 용암 · 어두운 장면 등불 · 패왕전 편 색 탄 · 타워 디펜스 · 로비·메인 화면 배경·전시장 · 뽑기 · 명예의 전당 우승자 카드

**남음 (다음에 할 만한 것)**
| 곳 | 파일 | 할 일 |
| --- | --- | --- |
| Canvas 2D 빛 흉내 (남은 것) | `shadowBlur`: `minimap`(화면 글자 칸, 게임 층 밖이라 그대로) · `lighter` 합성: `pwFxBits`·`eclipseBits`·`imugi`·`collectorArt`·`propArt`·`drawStation`·`dmgSkins`·`lobby/hallArt` (`lighter`는 느리지 않아 그대로 둠) | 더 옮길 것 없음 (`lighter`는 그대로) |
| 캐릭터 전용 큰 기술 | 캐릭터마다 `render/*` | `glowSkills`의 `ULT_FX`·`glowWatch`의 `BIG_FX`에 효과 이름을 더하면 바로 빛남 |
| 상점 효과 미리보기 | `shop/FxPreview.tsx` | 카드가 여러 장이라 WebGL 한도 때문에 보류 (하나만 크게 보는 창을 만들면 그 창에만) |
| 메인 화면 글자 | `TitleScreen.tsx` | 지금은 뒤 로비 빛만. 제목 글자 반짝임은 CSS로 충분 |
