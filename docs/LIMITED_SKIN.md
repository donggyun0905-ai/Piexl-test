# 한정 스킨 만들 때 체크리스트

마지막 수정: 2026-10-30 (한국 시간)

한정 스킨(범 풍류 `tiger` · 여름 파도 `summer` · 승리 `victory`)을 새로 만들 때 빠뜨리지 않도록 정리한 목록. 같은 시즌의 다른 한정 스킨(그림·효과)을 먼저 보고 그대로 따라 만든다 (CLAUDE.md 규칙).

## 1. 그림 (시트)

- [ ] 캐릭터마다 `apps/client/public/sprites/skins/{캐릭터}_{테마}.png`: 기본 그림과 같은 칸 배치 (4×4: 앞 · 뒤 · 옆 걷기 · 옆 공격)
- [ ] 따로 그림이 있는 캐릭터: 버려진 자들 `_p2`·`_p3` · 베두인 차크람을 던진 뒤 `_bare`
- [ ] 테두리는 테마 색 (범 풍류 금빛, 여름 파도 바다빛, 승리 금빛). 보통 스킨은 보랏빛 `#4e4262`
- [ ] 생성기는 `scripts/art/`에 (예: `tiger`는 캐릭터 꾸밈 함수, `victory_skins.py`는 기본 그림 위에 덧그림). `docs/ART.md` 스킨 줄에 한 줄 추가
- [ ] 도트 편집(`/pixel/`) 목록에 나오게: `pixel/assets.ts` (시트 목록 · 나만의 스킨 바탕)

## 2. 효과 (입었을 때)

| 때 | 범 풍류 | 여름 파도 | 승리 |
| --- | --- | --- | --- |
| 맞힘 (타격) | 발톱 · 고리 · 도장 · 기둥 | 물보라 | 금빛 훈장 별 |
| 처치 | 큰 고리 · 기둥 | 큰 물보라 | 별 터짐 |
| 가만히 (대기) | 범 기운 · 다 차면 울음 | 파도 · 갈매기 | 승리의 별이 떠오름 |
| 걸음 | 발자국 | 물 발자국 | 금빛 별 자국 |
| 강해짐 (패시브·무기 얻음) | 금빛 기둥 + "범의 기운!" + 울음 | "파도의 힘!" + 파도 소리 | 금빛 기둥 + "승리의 기운!" + 팡파르 |
| 쏘기·휘두르기 | 금빛 섬광 | 물빛 섬광 | 금빛 섬광 |
| 피해 숫자 | 범 숫자 (`tigerNumber`) | 여름 숫자 (`summerNumber`) | 훈장 숫자 (테마 `dmg`) |

- [ ] 효과 만드는 곳: `game/limited/` (범 `tigerFx`·`tigerDraw`·`tigerRest`, 여름 `summerFx`·`summerDraw`·`summerRest`, 테마 세트 `themeFx`·`themeDraw`·`themeShapes`)
- [ ] 강해짐 글자: `i18n/text/game.ts` (`tigerPower`·`summerPower`·`victoryPower`) · 한·영·일
- [ ] 입었는지: `game/limited/limited.ts` (`wornLimited` · `wornVictory`) → `game/gameLoop.ts`가 효과를 켬 · `shop/effects.activeFx`
- [ ] 내 자리에서만 (관전 중에는 그리지 않음, gameLoop `onMe`)

## 3. 소리

- [ ] 전용 음악: `audio/tigerSound`·`summerSound`·`victorySound` (`setMusicBeat`, 파일 없이 브라우저에서 만든 곡) → `audio/runSounds.ts`에서 켬
- [ ] 강해질 때·대기 다 찼을 때 소리 (울음 · 파도 · 팡파르)

## 4. 상점·얻는 방법

- [ ] `shop/skins.ts`: 테마 이름 (`LIMITED_THEMES` 뽑기 한정 · 보상 전용은 따로, 예 `VICTORY_THEME`) · 어느 캐릭터에 있는지
- [ ] 상점 스킨 탭 카드 (`shop/SkinTab.tsx`, '한정' 표시 · 잠김 글자) · 고르기 (`shop/SkinChooser.tsx`)
- [ ] 얻는 곳: 뽑기 (`shop/wallet.gacha`) 또는 보상 (`grantVictorySkins` 등)
- [ ] 테마 이름 글자 `i18n/text/shop.ts` (`skinTiger`·`skinSummer`·`skinVictory`) · `THEME_KEY`

## 5. 마무리

- [ ] 테스트 (`shop/skins.test.ts` 등) · `npm run check`
- [ ] 버전 올리기 + 패치 노트 (한·영·일)
- [ ] `docs/MAP.md`에 새 파일 한 줄
- [ ] 화면 확인: 상점 카드 · 게임에서 입고 맞힘·대기·걸음·강해짐 · 음악
