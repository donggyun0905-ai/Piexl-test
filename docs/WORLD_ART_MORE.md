# 세계 지도 더 필요한 그림 (2026-11-15 점검)

> 지금 지도에서 **코드로 대충 그린 것 · 다른 나라 그림을 빌려 쓰는 것 · 아예 없는 것**을 모두 찾아 프롬프트로 정리.
> 만드는 법·파일 자리·공통 문장은 `docs/WORLD_ART.md`와 같음 (땅 결 = "땅 결 앞에 붙이는 문장", 물건 = "물건 묶음 앞에 붙이는 문장", 모두 끝에 "공통 문장" · 땅 1:1, 물건 3:2 · 아스칼론 `grass.png`·`trees.png` 참고 그림으로 같이)
> 사람(NPC) 그림은 캐릭터 그림 규칙(`docs/ART_AI.md`)을 따름. 우선순위: ★★★ 바로 눈에 띔 · ★★ 나라다운 느낌 · ★ 있으면 좋음

## 1. 사람 (NPC) — `art/지도/npc/{파일}.png`

지금 주민은 모두 플레이어 캐릭터를 빌려 세움. 이름 없는 사람(왕·경비병·상인)은 그림이 따로 필요함.
게임에는 **앞모습 한 장**(서 있는 자세)만 있어도 넣을 수 있음 (가만히 서서 숨 쉬듯 흔들림 · 걷는 사람은 4방향 걷기 시트).

### 앞에 붙이는 문장 (사람)
```
Single chibi pixel art character, 2-head-tall cute proportions with a big head, standing still and facing the viewer (front view),
full body centered, feet at the bottom, bold dark outline, transparent background (or solid flat magenta #FF00FF),
same style and size as cute chibi anime pixel RPG party members. Square 1:1, 128x128 pixel canvas.
```

| 파일 | 무엇 | ★ | 프롬프트 |
| --- | --- | --- | --- |
| `puppetKing.png` | 헬리오스 꼭두각시 황제 (왕좌, 이미 죽은 왕을 누군가 줄로 움직임) | ★★★ | `A puppet emperor: a pale, lifeless young king with hollow glassy eyes and a fixed thin smile, slumped but upright as if held by strings; an oversized golden sun crown slightly crooked, heavy crimson and gold imperial robe too big for his body, ornate gold collar and rings; faint thin silver strings rise from his wrists, shoulders and head up out of the frame; small cracks like porcelain on his cheek; holds a golden scepter loosely. Eerie but cute, not gory.` |
| `guardHelios.png` | 헬리오스 제국 근위병 (궁전·성문) | ★★ | `An imperial palace guard: polished gold and white plate armor with a red sash, tall plumed sun-crest helmet covering the eyes, holding a long halberd upright, red cape.` |
| `guardAscalon.png` | 아스칼론 기사 경비병 (성문·성채) | ★★ | `A royal knight guard: steel plate armor with a blue tabard showing a simple white lion shape, open-face helmet, holding a spear and a round shield, short blue cape.` |
| `guardSilber.png` | 실베르 요새 병사 | ★★ | `A northern fortress soldier: thick fur-lined grey armor, fur hood over a steel helmet, frosty breath, holding a long spear, wool scarf, sturdy boots dusted with snow.` |
| `merchant.png` | 시장 상인 (모든 나라 노점) | ★ | `A friendly market merchant: round cheerful face, brown apron over a cream shirt, rolled sleeves, headscarf, holding a small scale in one hand.` |
| `sailor.png` | 탈라시아 뱃사람 | ★ | `A harbor sailor: striped blue-white shirt, rolled trousers, knit cap, coil of rope over one shoulder, tanned face with a grin.` |

## 2. 나라마다 집 (지금 실베르·탈라시아·테라코어가 아스칼론 집을 빌려 씀) — `art/지도/{나라}/물건/houses.png`

건물은 **앞 아래 가운데에 문**이 보이게 (`docs/WORLD_ART.md` 같은 규칙) · 집 하나 = 지도 3칸 폭 · 두 가지 색으로 한 줄.

| 파일 | 왼쪽부터 | ★ | 프롬프트 |
| --- | --- | --- | --- |
| `silber/물건/houses.png` | 눈 지붕 돌집 · 같은 집 다른 색 | ★★★ | `Two objects: 1) a small sturdy northern stone cottage with thick grey stone walls, a steep dark slate roof covered in a thick layer of snow, icicles on the eaves, a heavy wooden front door at the bottom center, one small warm-lit window, 2) the same cottage with a dark brown timber roof under snow and a stone chimney.` |
| `thalassia/물건/houses.png` | 항구 집 · 같은 집 다른 색 | ★★★ | `Two objects: 1) a cheerful harbor townhouse with whitewashed walls, a bright blue tiled roof, blue wooden shutters, a rope and small anchor plaque by the front door at the bottom center, 2) the same house with a terracotta orange roof and green shutters.` |
| `terracore/물건/houses.png` | 노동자 집 · 같은 집 다른 색 | ★★★ | `Two objects: 1) a compact industrial worker house of soot-stained red brick with a riveted iron roof, a small copper pipe and vent on the side, a metal-framed front door at the bottom center, 2) the same house with grey brick walls and a corrugated steel roof.` |
| `desert/물건/houses.png` | 사막 흙집 (대상 마을) | ★ | `Two objects: 1) a small desert adobe house with rounded sand-colored mud walls, a flat roof with a wooden beam edge, a cloth-covered doorway at the bottom center, 2) the same house with a small dome on top and blue painted door frame.` |

## 3. 바닥 (지금은 다른 나라 땅 결을 빌려 깔았음 — 맞는 그림이 오면 바꿔 끼우기만)

| 파일 | 지금 빌린 것 | ★ | 프롬프트 |
| --- | --- | --- | --- |
| `ascalon/땅/townStone.png` | 비연 돌길 `tileRoad` | ★★ | `Medieval town square paving of warm grey rounded cobblestones of mixed sizes, neat mortar lines, a few lighter worn stones, clean.` |
| `helios/땅/sandPaving.png` | 성국 순례길 `pilgrimRoad` | ★★ | `Sun-baked sandstone paving of large pale golden rectangular slabs laid in a running bond, thin warm grout, faint wear, clean and bright.` |
| `thalassia/땅/harborCobble.png` | 비연 돌길 `tileRoad` | ★★ | `Harbor town cobblestones: rounded blue-grey stones with a slightly wet sheen, sandy grout, tiny shell bits between stones.` |
| `silber/땅/frostFlag.png` | 비연 돌길 `tileRoad` | ★★ | `Fortress courtyard flagstones of dark grey square slabs with frost in the cracks and small patches of trampled snow, cold and clean.` |
| `ascalon/땅/flowerBed.png` | 코드 꽃 | ★ | `A dense flower garden bed seen from above: mixed small red, yellow, white and violet flowers among green leaves, evenly spread, soft and bright.` |

## 4. 코드로 대충 그린 것 → 그림 (`art/지도/common/물건/{파일}.png`)

| 파일 | 왼쪽부터 | ★ | 프롬프트 |
| --- | --- | --- | --- |
| `warpStones.png` | 순간 이동석 · 꺼진 이동석 | ★★★ | `Two objects: 1) a magical teleport waystone: a waist-high pillar of smooth pale stone on a round carved base, a floating glowing blue crystal hovering above it, thin blue rune lines on the pillar, 2) the same waystone dormant: the crystal resting dark and grey on top, runes unlit.` |
| `shopSigns.png` | 무기·방패·물약·주머니·망치·침대 간판 | ★★ | `Six objects: small hanging wooden shop signboards on short iron brackets, each painted with one simple symbol: 1) a sword, 2) a shield, 3) a red potion bottle, 4) a coin pouch, 5) a smith hammer, 6) a bed with a moon. Same size and wood style.` |
| `towerMemory.png` | 기억의 탑 (무한 모드 입구) | ★★ | `One object: a tall slender ancient stone tower of pale blue-grey stone, spiraling carved bands, a glowing violet window near the top, a grand arched door at the bottom center, floating rune stones circling the upper part.` |
| `colosseumGate.png` | 콜로세움 정문 (패왕전) | ★ | `One object: a massive arena entrance gate: a tall stone arch with heavy iron portcullis half raised, crossed swords emblem above, two flaming braziers on pillars at the sides.` |
| `fences.png` | 나무 울타리 · 돌 울타리 · 철 울타리 | ★ | `Three objects: 1) a short wooden picket fence segment, 2) a low stacked stone fence segment, 3) a black wrought-iron fence segment with spear tips. Each segment exactly as wide as it is tall times two, straight, seen from the front.` |

## 5. 나라다운 거리 소품 (있으면 거리가 덜 비어 보임) — `art/지도/{나라}/물건/{파일}.png`

지금은 있는 그림으로 길가 가로등·기둥·화로·촛대와 집 앞 통·상자·화분을 놓았음 (`world_props.py`). 아래가 오면 더 놓음.

| 파일 | 왼쪽부터 | ★ | 프롬프트 |
| --- | --- | --- | --- |
| `common/물건/market.png` | 과일 노점 · 천 노점 · 무기 노점 · 빵 노점 | ★★★ | `Four objects: market stalls with striped cloth awnings on wooden frames: 1) a fruit stall with apples, grapes and melons in baskets, red-white awning, 2) a fabric stall with folded colorful cloth rolls, purple-white awning, 3) a weapon stall with swords and shields on a rack, green-white awning, 4) a bakery stall with bread loaves and pies, yellow-white awning.` |
| `common/물건/townProps.png` | 우물 · 벤치 · 수레 · 게시판 | ★★★ | `Four objects: 1) a round stone well with a small wooden roof and a bucket on a rope, 2) a wooden park bench with iron legs, 3) a wooden hand cart loaded with sacks and crates, 4) a wooden notice board with pinned paper notes (blank papers, no writing).` |
| `ascalon/물건/knightStatue.png` | 기사 동상 · 사자 분수 | ★★ | `Two objects: 1) a heroic bronze knight statue raising a sword on a tall stone pedestal, 2) a round stone fountain with a lion head spouting water into a basin.` |
| `helios/물건/empireProps.png` | 태양 문장 깃발대 · 야자 화분 · 금빛 가로등 · 마차 | ★★ | `Four objects: 1) a gilded lamp post with a sun-shaped lantern, 2) a large terracotta planter with a small palm, 3) a gold-trimmed imperial carriage without horses, 4) a low marble bench with gold feet.` |
| `silber/물건/fortProps.png` | 장작 더미 · 눈 덮인 수레 · 경보 종 · 훈련 표적 | ★★ | `Four objects: 1) a stacked firewood pile with snow on top, 2) a supply sled with crates under a tarp, 3) an alarm bell hanging from a wooden frame, 4) an archery target on a stand with arrows stuck in it.` |
| `thalassia/물건/harborProps.png` | 밧줄 더미 · 생선 바구니 · 갈매기 앉은 말뚝 · 돛 천 더미 | ★ | `Four objects: 1) a coil of thick rope, 2) a wicker basket full of silver fish, 3) a wooden mooring post with a white seagull standing on top, 4) a folded pile of canvas sail cloth.` |
| `terracore/물건/streetProps.png` | 증기 배출구 · 기름통 · 작업대 · 톱니 표지 | ★ | `Four objects: 1) a floor steam vent grate with a pipe stub, 2) a dented oil drum with a hazard stripe, 3) a workbench with tools and a vise, 4) a large standing gear-shaped street sign without text.` |

## 넣는 곳 (Claude 쪽)

- NPC 한 장 그림: `Place`에 그림 이름을 주면 캐릭터 대신 그 그림을 세우게 코드 추가 (꼭두각시 황제 = 헬리오스 궁전 빈 왕좌 앞 `heliosPalace` (9, 4))
- 나라 집: 그 나라 `Region.skin`에 `house_red`·`house_blue` → 새 그림
- 바닥: `Region.skin`의 `snowStone`(실베르는 `floor`) → 새 땅 결 이름
- 순간 이동석·간판·탑·콜로세움 문: `worldPlaceSigns`가 그림이 있으면 그림, 없으면 지금 코드 그림
- 거리 소품: `scripts/art/world_props.py` 나라 표에 넣으면 자동으로 길가·집 앞에 놓임
