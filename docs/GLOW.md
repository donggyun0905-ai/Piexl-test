# 빛 효과 층 (PixiJS·WebGL) 안내

마지막 수정: 2026-11-05 14:51 (한국 시간)

게임 화면은 Canvas 2D로 그리고, 그 **바로 위에 PixiJS(WebGL) 투명 캔버스 한 장**을 겹쳐 "빛나는 것"만 그린다 (0.49.36부터).
디자인·이펙트를 만들 때 "이건 Canvas 2D로 그릴까, 빛 층으로 그릴까"를 정하는 기준과 쓰는 법을 적는다.

## 1. 구조

| 파일 | 하는 일 |
| --- | --- |
| `apps/client/src/game/glow/glowLayer.ts` | PixiJS 불러오기(처음 쓸 때만) · 게임 캔버스와 자리·크기·흔들림 맞추기 · 붉은 테두리·번쩍임 · 매 화면 그리기 |
| `apps/client/src/game/glow/glowParts.ts` | 빛 조각 모음(최대 900개 다시 씀): `dot` 둥근 빛 · `spark` 날아가는 불티(방향으로 길쭉) · `ring` 퍼지는 고리 |
| `apps/client/src/game/glow/glowWatch.ts` | 게임 상태 변화 → 효과 (맞힘·치명타·처치·보스 처치·탄 꼬리·큰 공격·내가 맞음) |
| `apps/client/src/styles/glow.css` | 층 위치 (누름은 아래로 통과) |
| 설정 `glowFx` (`settings.ts`, 글자 `i18n/text/runGuide.ts`) | 설정 창 '빛 효과' 켜기·끄기 (기본 켜짐) |

- `gameLoop.ts`에서 `drawFrame` 바로 뒤에 `glow.frame(...)`을 부르고, 끝날 때 `glow.destroy()`.
- PixiJS는 `import("pixi.js")`로 따로 불러와 **첫 화면 로딩에는 들어가지 않음** (압축 후 약 180KB, 게임 들어갈 때 한 번).
- WebGL이 안 되는 기기는 `start()`가 조용히 실패 → 빛만 빠지고 게임은 그대로.
- Cloudflare 비용 없음: 사용자 기기에서 그리고, Pages 정적 파일은 무료·무제한.

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
// 화면 전체: 붉은 테두리·번쩍임 (0~1, 저절로 줄어듦)
cues.hurt = 1;
cues.flash = 1;
```

- "새로 생긴 것" 찾기: 효과(`s.effects`)는 `WeakSet`으로 처음 본 것만 · 적은 `id`별 이전 체력과 비교 · 처치는 사라진 적 + `s.kills` 증가로.
- 특정 캐릭터 전용 빛: `s.player`의 그 캐릭터 상태 값 변화를 보고 만든다 (협동은 `allPlayers`).
- 크게 빛날 효과 종류는 `glowWatch.ts`의 `BIG_FX` 목록에 이름만 넣으면 빛·고리·불티가 붙는다.

## 5. 확인하는 법

1. `apps/client`에서 `npx vite` → `http://localhost:5173/?adminPractice=warden` (연습장 바로 열기)
2. 개발 서버에서는 콘솔에 `window.pixelRogueRun`이 있어 상태를 바꿔 볼 수 있음:
   - 맞힘·치명타: `e.hp -= 5; e.critTick = run.tick`
   - 처치: 적을 `run.enemies`에서 빼고 `run.kills += 1`
   - 내가 맞음: `run.player.hp -= 30`
3. 헤드리스 브라우저는 `--use-angle=swiftshader --enable-unsafe-swiftshader`로 띄워야 WebGL이 켜짐.
4. 폰에서 느리면 먼저 조각 수 한도(`MAX_PARTS`·`MAX_TRAILS`)를 낮춘다.

## 6. 앞으로 넣으면 좋을 곳 (2026-11-05 코드 살펴본 결과)

### 먼저 (눈에 잘 띄고, 같은 층을 그대로 씀)
| 곳 | 파일 | 넣을 빛 |
| --- | --- | --- |
| 한정 스킨 효과 | `game/limited/` (`tigerFx`·`summerFx`·`themeFx`, 지금 `fxLight.ts`로 빛 흉내) | 타격·KO·대기 빛을 빛 층으로 → 한정 스킨이 확실히 비싸 보이게 |
| 상점 효과 스킨 (타격·대기·걸음·피해 숫자) | `shop/effects.ts`·`fxThemes.ts`, `game/dmgSkins.ts`(`lighter` 합성), 미리보기 `shop/FxPreview.tsx` | 세트별 색 불티·빛 꼬리 · 미리보기에도 같은 층 |
| 각성·궁극기·필살기 | `render/awakenA·B·C`·`ults`·`beastUlts`·`general`(필살기 이름) | 큰 번쩍임·빛기둥·충격파 고리 |
| 이미 빛을 흉내 내는 이펙트 | `shadowBlur`: `render/terrain`(용암)·`leviaWhale`·`tailShark`·`eclipseBits` · `lighter`: `pwFxBits`·`eclipseBits`·`imugi`·`collectorArt`·`propArt`·`drawStation` · 큰 그라데이션: `pwFxBits`·`awakenA`·`guardFx`·`pwMarks`·`onyxPillar`·`seaLight` | 번짐 부분만 빛 층으로 옮김 → 더 밝고 폰에서 더 빠름 |

### 다음 (조금 더 손이 감)
| 곳 | 파일 | 넣을 빛 |
| --- | --- | --- |
| 조명·어둠 | 어두운 방(추적자 조준 어둠, 태초의 어둠 `render/primeval`), 용암 지형 `render/terrain` | 내 주변·횃불·용암만 밝은 조명 (빛 층에 어둠 막 + 구멍) |
| 바닥 아이템·돈·보물 | `game/drawPickup.ts`, `render/room`, 보물방·황금방 | 희귀할수록 강한 빛기둥·반짝임, 돈 줍기 반짝 |
| 회복·보호막·레벨 업 | `sim/heal`을 읽어 화면에서, 풋내기 `NovicePanel` 레벨, 패왕전 `pwBuffFx` | 초록 빛 오름·보호막 고리·레벨 업 빛기둥 |
| 패왕전 스킬 | `render/pwSkillFx`·`pwSkillMotif`·`pwBuffFx` | 편 색 빛 (아군 파랑·적 빨강) |
| 보스 공격 효과 | `render/bossFx`·`lastShots`·`ults` | 탄·폭발 번짐만 (예고 표시는 그대로 Canvas 2D) |

### 게임 화면 밖 (같은 코드를 다른 캔버스에 붙여야 함)
| 곳 | 파일 | 넣을 빛 |
| --- | --- | --- |
| 뽑기 연출 | `shop/GachaReveal.tsx`·`GachaPrize.tsx`·`GachaPack.tsx` | 등급별 빛기둥·폭죽 (한정 등급은 화면 번쩍임) |
| 타워 디펜스 | `td/TdGame.tsx`·`tdFx.ts`·`tdDraw.ts` | 타워 공격 빛·적 처치 폭발 (`glowWatch`와 비슷하게 `td` 상태를 봄) |
| 로비 무대 | `lobby/party.ts`(조명·미러볼·색종이)·`LobbyStage.tsx` | 무대 조명 빛줄기·미러볼 반짝임 |
| 명예의 전당 | `lobby/hallArt.ts`(`lighter` 합성) | 우승자 빛 |
| 메인 화면 | `TitleScreen.tsx` | 떠다니는 빛 가루 |

→ 게임 밖 화면에 붙일 때는 `createGlowLayer`를 "상태 보기"와 떼어 공용으로 만들고(층·조각만), 화면마다 자기 `watch`를 둔다.
