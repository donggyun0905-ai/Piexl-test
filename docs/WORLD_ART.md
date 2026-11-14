# 세계 지도 그림 (B안: 땅 결·물건 그림) — 모든 나라 + 건물 안

> 작성 2026-11-14 (한국 시간) · 상태: **⏸ 추후 할 일** — 코드 준비는 끝남. 그림 생성 도구를 다른 작업에 쓰는 중이라 미룸 (2026-11-14 사용자 결정). 그림이 생기면 아래 '하는 순서'대로 이어서 함

지금 세계 지도는 코드로 그린 그림(A안)입니다. 아래 그림을 만들어 올리면 **올린 것만** 그 그림으로 바뀌고, 나머지는 그대로 코드 그림입니다 (하나씩 넣어도 됨).

## 하는 순서

1. 아래 프롬프트로 그림을 만든다 (그림 도구 아무거나, **원본 PNG 다운로드** · 화면 캡처 말고)
2. 채팅에 올리면 Claude가 `art/지도/{나라}/땅/{이름}.png`, `art/지도/{나라}/물건/{묶음}.png`에 넣고 `python3 scripts/art/world_art.py` 실행
   - 땅 결: 256×256으로 줄이고 이어 붙여도 이음매 없게 손질 → `public/world/tex/`
   - 물건: 배경을 지우고 왼쪽부터 하나씩 잘라 크기 맞춤 → `public/world/obj/`
   - `public/world/art.json` 목록을 새로 씀 (게임은 목록에 있는 그림만 받음)
3. 게임 화면 스크린샷을 보여 드림 → 마음에 들면 올리기, 아니면 다시 생성

크기 기준: 그림 1픽셀 = 지도 1/4픽셀 (캐릭터 그림과 같은 선명도) · 한 칸 = 64픽셀.

## 모든 나라에 같은 규칙 (2026-11-14 사용자와 정함)

- **그림은 재료만, 빛·그림자·움직임은 코드**: 그림에 그림자·빛 방향을 넣지 않음 → 코드가 한 방향 그림자·날씨·입자·색 보정을 나라마다 얹음
- 흔들리는 물건(나무·대나무·해초·깃발)은 통째로 한 장이면 됨 → 코드가 그림의 위쪽만 띠로 나눠 바람에 기울임
- 채도는 손질 스크립트가 캐릭터 그림과 같은 범위로 맞춤
- 건물은 **앞 아래 가운데에 문**이 보이게 (들어가면 건물 안 지도)
- **화풍 기준**: 아스칼론 `grass.png`·`trees.png` 두 장을 먼저 만들어 마음에 들면, 이후 모든 그림에 이 두 장을 참고 그림으로 같이 붙임
- 파일 자리: `art/지도/{나라 id}/땅/{파일}.png` · `art/지도/{나라 id}/물건/{파일}.png` (건물 안은 `art/지도/interior/`)
- 무료 생성: Claude 채팅·Cowork의 Higgsfield (Claude Code에서는 크레딧이 듦) · 땅 1:1, 물건 3:2

### 땅 결 앞에 붙이는 문장
```
Seamless tileable ground texture, viewed straight from above (flat, no perspective, no horizon),
the pattern fills the whole square image edge to edge, evenly spread, no single big focal object,
no cast shadows from outside objects, no border or vignette. Square 1:1.
```

### 물건 묶음 앞에 붙이는 문장
```
Game sprite sheet on a solid flat pure magenta background (#FF00FF), no gradient, no ground, no cast shadows on the background.
The objects stand in ONE horizontal row from left to right, with wide empty magenta gaps between them;
each object is complete, not touching another object or the image edge. Viewed from a top-down 3/4 RPG angle. Landscape 3:2.
```

### 모든 그림 끝에 붙이는 공통 문장
```
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

## 아스칼론 (`ascalon`) — 왕국·성·평야

### 아스칼론 땅 결 (`ascalon`, 11장)

| 파일 이름 | 무엇 | 프롬프트 (위 문장 다음에) |
| --- | --- | --- |
| `grass.png` | 풀밭 | `Lush green meadow grass: short grass blades in several greens, a few tiny darker clumps and small light highlights, very subtle.` |
| `path.png` | 흙길 | `Packed dirt road: warm light-brown earth with small pebbles, faint footpath wear, a few tiny cracks.` |
| `sand.png` | 모래 | `Soft beach sand: pale warm yellow sand with gentle ripples and a few tiny shells and grains.` |
| `water.png` | 물 | `Clear shallow river water: medium blue with soft lighter ripple lines and small sparkles, calm.` |
| `deep.png` | 깊은 물 | `Deep river water: dark blue with slow subtle ripples, darker than shallow water, calm.` |
| `field.png` | 밀밭 | `Golden wheat field seen from above: dense rows of ripe wheat ears in horizontal rows, warm yellow and ochre.` |
| `floor.png` | 성 안 돌바닥 | `Castle courtyard paving: square light grey-beige stone slabs of slightly different shades, thin dark grout lines, a little worn.` |
| `snow.png` | 눈밭 | `Fresh snow field: soft white snow with pale blue shading, tiny sparkles, gentle footprint-free surface.` |
| `wallTop.png` | 성벽 위 | `Top of a castle wall walkway: light grey flagstones in rows, clean and slightly worn.` |
| `wallFace.png` | 성벽 앞면 | `Front face of a castle wall: grey-violet stone bricks in staggered rows, light top edges and darker bottoms, a little moss in cracks.` |
| `bridge.png` | 다리 판자 | `Wooden bridge deck: vertical wooden planks side by side, warm brown wood grain, small dark nail dots, thin dark gaps between planks.` |

### 아스칼론 물건 묶음 (4장)

| 파일 이름 | 왼쪽부터 | 프롬프트 (위 문장 다음에) |
| --- | --- | --- |
| `trees.png` | 둥근 나무 · 둥근 나무 2 · 뾰족 나무 · 뾰족 나무 2 | `Four trees: 1) a round leafy oak with a full bushy crown and short brown trunk, 2) a slightly smaller round leafy tree in a deeper green, 3) a tall pine tree with three layered tiers, 4) a slightly shorter darker pine. All trees the same art style, trunks visible at the bottom.` |
| `rocks.png` | 큰 바위 · 작은 바위 · 풀숲 | `Three objects: 1) a large rounded grey-brown boulder with a little moss on top, 2) a small rounded stone, 3) a small round leafy green bush.` |
| `houses.png` | 빨간 지붕 집 · 파란 지붕 집 | `Two small cozy medieval village cottages seen from the front-top: 1) red tiled roof, cream plaster walls with wooden beams, a wooden front door in the middle, two small glowing windows; 2) the same size house with a blue tiled roof. Each house is wider than tall (about 3 wide by 2.5 tall).` |
| `places.png` | 던전 동굴 입구 · 표지판 | `Two objects: 1) a dungeon cave entrance carved into a small rocky hill with a stone arch frame, dark inside with a faint red glow, two standing torches on both sides, 2) a wooden signpost with a blank rectangular board.` |

## 비르디아 — 엘프가 사는 울창한 숲과 숲속 성 (`virdia`)

아주 큰 나무가 빽빽한 깊은 숲, 이끼와 빛줄기, 숲 한가운데 나무와 하나가 된 하얀 성(엘프풍).

**땅 결** (1:1)

| 파일 | 무엇 | 프롬프트 |
| --- | --- | --- |
| `forestFloor.png` | 숲 바닥 | `Deep forest floor: dark green moss, fallen leaves, small ferns and tiny mushrooms, soft dappled light.` |
| `moss.png` | 이끼 바위 땅 | `Mossy ground with half-buried smooth stones covered in bright green moss.` |
| `leafPath.png` | 낙엽 오솔길 | `Narrow forest path of packed earth covered with scattered golden and green leaves.` |
| `elfStone.png` | 성 안 흰 돌바닥 | `Elegant white stone paving with thin curving leaf-pattern engravings and pale green grout, slightly mossy.` |
| `spring.png` | 맑은 샘물 | `Crystal clear forest spring water, turquoise with light ripples and floating petals.` |

**물건 묶음** (3:2, 분홍 배경)

| 파일 | 왼쪽부터 | 프롬프트 |
| --- | --- | --- |
| `giantTrees.png` | 거대한 나무 ·  거대한 나무 2 · 뿌리 아치 | `Three objects: 1) an enormous ancient tree with a huge round canopy and thick twisting roots, 2) a tall slender tree with drooping glowing leaves, 3) a natural arch of giant roots forming a gateway.` |
| `elfCastle.png` | 숲속 성 · 나무 위 집 | `Two objects: 1) a graceful white elven castle grown together with a giant tree, curved towers with green leaf roofs, a large arched front door at the bottom center, 2) a small round treehouse with a leaf roof and a ladder.` |
| `forestProps.png` | 버섯 · 수풀 · 꽃 덤불 · 빛 랜턴 기둥 | `Four objects: 1) a cluster of large glowing blue mushrooms, 2) a round fern bush, 3) a flowering bush with white flowers, 4) a carved wooden post holding a small glowing green lantern.` |

- 코드 효과: 나뭇잎 흔들림, 떨어지는 잎과 반딧불, 빛줄기, 샘물 반짝임, 초록 색 보정

## 테라코어 — 기계 도시 (`terracore`)

톱니·파이프·철판·증기, 공장과 철길이 있는 산업 도시. 낮에도 증기와 주황 불빛.

**땅 결** (1:1)

| 파일 | 무엇 | 프롬프트 |
| --- | --- | --- |
| `metalFloor.png` | 철판 바닥 | `Riveted steel floor plates with diamond tread pattern, grey with slight rust stains.` |
| `cobbleOil.png` | 기름 묻은 돌길 | `Dark cobblestone street with oil stains and small metal scraps between stones.` |
| `rail.png` | 철길 | `Railway track seen from above: two steel rails running vertically on wooden sleepers and gravel.` |
| `grate.png` | 배수 격자 | `Iron drainage grates in a grid with faint steam and dark gaps beneath.` |
| `brickRed.png` | 붉은 벽돌 마당 | `Worn red brick courtyard paving with dark mortar lines.` |

**물건 묶음** (3:2, 분홍 배경)

| 파일 | 왼쪽부터 | 프롬프트 |
| --- | --- | --- |
| `factories.png` | 공장 · 굴뚝 탑 · 창고 | `Three objects: 1) a large brick-and-steel factory building with big gears on the wall, pipes, a large metal sliding door at the front bottom center, 2) a tall chimney tower, 3) a metal warehouse with a rolling shutter door.` |
| `machines.png` | 톱니 기계 · 크레인 · 증기 탱크 · 로봇 경비 | `Four objects: 1) a big gear machine with pistons, 2) a small yard crane, 3) a round steam tank with pressure gauges, 4) a small idle guard robot.` |
| `cityProps.png` | 가로등 · 파이프 · 상자 더미 · 열차 칸 | `Four objects: 1) a gas street lamp, 2) a bundle of copper pipes with valves, 3) a stack of wooden crates with metal straps, 4) a small cargo train car.` |

- 코드 효과: 증기 뿜기, 톱니 회전, 주황 불빛 깜빡임, 가로등 빛, 조금 낮은 채도·주황 색 보정

## 사막 — 헬리오스로 가는 땅 (`desert`)

나라가 아니라 지나가는 땅. 모래 언덕과 모래에 묻힌 유적, 드문 오아시스.

**땅 결** (1:1)

| 파일 | 무엇 | 프롬프트 |
| --- | --- | --- |
| `dune.png` | 모래 언덕결 | `Desert sand dunes with long soft wind ripples, warm golden sand.` |
| `cracked.png` | 갈라진 땅 | `Dry cracked earth, pale orange clay with deep polygon cracks.` |
| `gravel.png` | 자갈 사막 | `Desert gravel plain with small reddish pebbles and sand.` |
| `oasis.png` | 오아시스 물 | `Oasis water, clear turquoise with sandy shallow edges feel and gentle ripples.` |
| `buriedRoad.png` | 모래에 묻힌 돌길 | `Ancient sandstone road slabs half covered by drifting sand.` |

**물건 묶음** (3:2, 분홍 배경)

| 파일 | 왼쪽부터 | 프롬프트 |
| --- | --- | --- |
| `desertPlants.png` | 야자수 · 야자수 2 · 선인장 · 마른 덤불 | `Four objects: 1) a tall palm tree, 2) a shorter double palm tree, 3) a tall saguaro cactus, 4) a dry tumbleweed bush.` |
| `ruins.png` | 무너진 기둥 · 반쯤 묻힌 석상 · 짐승 뼈 · 천막 쉼터 | `Four objects: 1) a broken sandstone column, 2) a half-buried giant stone head statue, 3) a big beast skeleton ribcage, 4) a small striped desert tent shelter.` |

- 코드 효과: 모래바람 줄기, 아지랑이, 야자수 흔들림, 따뜻한 노란 색 보정

## 헬리오스 — 사막 너머 제국 도시 (평범한 기후) (`helios`)

풀밭·흙길은 아스칼론 것을 같이 씀. 금빛과 붉은 깃발의 화려한 제국, 그 아래 스며든 불길함.

**땅 결** (1:1)

| 파일 | 무엇 | 프롬프트 |
| --- | --- | --- |
| `marble.png` | 대리석 광장 | `White marble plaza tiles with thin gold inlay lines, polished.` |
| `redBrick.png` | 붉은 벽돌길 | `Imperial road of deep red bricks in a herringbone pattern.` |
| `goldStone.png` | 금빛 테 돌바닥 | `Large beige stone slabs bordered with gold-colored metal strips.` |

**물건 묶음** (3:2, 분홍 배경)

| 파일 | 왼쪽부터 | 프롬프트 |
| --- | --- | --- |
| `palace.png` | 황금 궁전 · 제국 집 · 높은 문 | `Three objects: 1) a grand golden palace with domes and red banners, a huge golden front door at the bottom center, 2) a fancy imperial townhouse with red roof and gold trim and a front door, 3) a tall ornate city gate.` |
| `imperialProps.png` | 분수 · 황제 석상 · 붉은 깃발 기둥 · 검은 의식 제단 | `Four objects: 1) an ornate golden fountain, 2) a stone statue of a crowned ruler, 3) a pole with a long red banner, 4) a small black stone altar with purple candles.` |

- 코드 효과: 깃발 흔들림, 분수 물, 밤이면 보랏빛 그늘(악이 스며든 느낌)

## 성국 — 거대한 대성당의 나라 (평범한 기후) (`seongguk`)

하얀 돌과 금, 스테인드글라스, 꺼지지 않는 성화. 누구나 떠올리는 '성스러운 나라'.

**땅 결** (1:1)

| 파일 | 무엇 | 프롬프트 |
| --- | --- | --- |
| `holyStone.png` | 흰 성당 돌바닥 | `Clean white limestone paving with soft gold cross-shaped inlays at intervals.` |
| `pilgrimRoad.png` | 순례길 | `A wide pale stone pilgrim road with worn edges and small white flowers between stones.` |
| `garden.png` | 성당 정원 잔디 | `Neatly trimmed bright garden lawn with tiny white daisies.` |

**물건 묶음** (3:2, 분홍 배경)

| 파일 | 왼쪽부터 | 프롬프트 |
| --- | --- | --- |
| `cathedral.png` | 대성당 · 종탑 · 수도원 | `Three objects: 1) an enormous white cathedral with tall spires, a big rose window and a large golden front door at the bottom center, 2) a tall bell tower, 3) a small monastery building with a front door.` |
| `holyProps.png` | 성화 화로 · 천사 석상 · 기도 촛대 · 흰 깃발 | `Four objects: 1) a large golden brazier with a bright sacred flame, 2) a white angel statue, 3) a tall candle stand with many candles, 4) a pole with a white banner and gold cross.` |

- 코드 효과: 성화 불꽃 흔들림, 빛기둥, 날아가는 흰 비둘기, 밝은 금빛 색 보정

## 새벽의 성흔 — 제국 술집 지하의 비밀 아지트 (나라가 아닌 집단) (`dawn`)

밖에서 보면 헬리오스 뒷골목의 평범한 술집. 안쪽 지하로 내려가면 무기고·훈련장·감옥이 있는 아지트. **거의 실내 지도**.

**땅 결** (1:1)

| 파일 | 무엇 | 프롬프트 |
| --- | --- | --- |
| `cellarStone.png` | 지하 돌바닥 | `Underground cellar floor of rough dark stone slabs, damp, with a few cracks.` |
| `tavernWood.png` | 술집 나무 바닥 | `Old tavern wooden floorboards, warm brown with beer stains and scuffs.` |

**물건 묶음** (3:2, 분홍 배경)

| 파일 | 왼쪽부터 | 프롬프트 |
| --- | --- | --- |
| `tavernOutside.png` | 술집 건물 · 지하 계단 입구 | `Two objects: 1) a modest two-story tavern building with a hanging blank sign board and a wooden front door, 2) a hidden stone stairway opening going down into darkness with a trapdoor.` |
| `hideoutProps.png` | 무기 걸이 · 훈련 허수아비 · 지도 탁자 · 철창 감방 | `Four objects: 1) a wall rack with swords, axes and guns, 2) a straw training dummy with a cross mark, 3) a big wooden table with a map and candles, 4) an iron-barred prison cell front with chains.` |
| `tavernProps.png` | 술통 · 바 카운터 · 둥근 탁자와 의자 · 벽난로 | `Four objects: 1) stacked beer barrels, 2) a short wooden bar counter, 3) a round table with two stools, 4) a stone fireplace with fire.` |

- 코드 효과: 벽난로·촛불 흔들림, 먼지, 지하는 어둡고 달빛 같은 은빛 포인트

## 실베르 — 침공이 일상인 혹독한 북부 (`silber`)

눈보라, 두꺼운 성벽과 부서진 망루, 곳곳의 싸움 흔적. 차갑고 어두운 푸른빛.

**땅 결** (1:1)

| 파일 | 무엇 | 프롬프트 |
| --- | --- | --- |
| `deepSnow.png` | 깊은 눈밭 | `Deep snow field with wind-swept drifts, pale blue shadows, a few dark rocks poking out.` |
| `ice.png` | 얼음 | `Thick cracked ice surface, cyan-blue with white crack lines and trapped bubbles.` |
| `frozenMud.png` | 얼어붙은 진흙 눈 | `Trampled frozen mud mixed with dirty snow and footprints.` |
| `snowStone.png` | 눈 덮인 돌바닥 | `Grey fortress stone paving partly covered by snow.` |
| `thickWall.png` | 두꺼운 성벽 앞면 | `Front face of a massive dark grey fortress wall of huge stone blocks with frost and claw scratches.` |

**물건 묶음** (3:2, 분홍 배경)

| 파일 | 왼쪽부터 | 프롬프트 |
| --- | --- | --- |
| `northTrees.png` | 눈 덮인 침엽수 · 침엽수 2 · 얼어 죽은 나무 | `Three objects: 1) a tall snow-covered pine, 2) a smaller snowy pine, 3) a dead frozen tree with icicles.` |
| `defense.png` | 부서진 망루 · 바리케이드 · 투석기 · 화로 | `Four objects: 1) a damaged wooden watchtower, 2) a spiked wooden barricade, 3) a small catapult, 4) an iron fire brazier with flames.` |
| `battleScars.png` | 마물 뼈 · 부러진 창 무더기 · 얼음 결정 · 막사 | `Four objects: 1) a huge monster skull and bones half in snow, 2) a pile of broken spears and shields, 3) a large jagged ice crystal, 4) a fur-covered army tent with an entrance flap.` |

- 코드 효과: 눈보라(세기 변화), 입김, 화로 불빛, 가끔 경보 붉은 깜빡임, 차가운 푸른 색 보정

## 탈라시아 — 거대한 물류 항구 도시 (`thalassia`)

부두와 창고가 끝없이 이어진 바다의 무역항. 배·크레인·화물이 가득하고 활기참.

**땅 결** (1:1)

| 파일 | 무엇 | 프롬프트 |
| --- | --- | --- |
| `dockPlank.png` | 부두 판자 | `Harbor dock wooden planks running horizontally, weathered grey-brown, with rope marks.` |
| `wetStone.png` | 젖은 돌 부두 | `Wet harbor stone pier blocks, dark grey with puddles and seaweed bits.` |
| `beach.png` | 해변 모래 | `Bright beach sand with shells and small pebbles.` |
| `sea.png` | 얕은 바다 | `Bright turquoise shallow sea water with sparkling ripples.` |
| `ocean.png` | 깊은 바다 | `Deep dark blue ocean water with slow waves.` |

**물건 묶음** (3:2, 분홍 배경)

| 파일 | 왼쪽부터 | 프롬프트 |
| --- | --- | --- |
| `ships.png` | 큰 범선 · 작은 배 · 해적선 | `Three objects: 1) a large three-mast merchant sailing ship seen from above at an angle, 2) a small rowing boat, 3) a dark pirate ship with black sails.` |
| `harbor.png` | 크레인 · 화물 상자 더미 · 창고 · 등대 | `Four objects: 1) a wooden harbor crane, 2) a big stack of cargo crates and barrels, 3) a long harbor warehouse with a large front door, 4) a striped lighthouse.` |
| `portProps.png` | 밧줄 말뚝 · 그물 · 닻 · 시장 노점 | `Four objects: 1) a mooring post with rope, 2) a fishing net on a rack, 3) a big iron anchor, 4) a fish market stall with a striped awning.` |

- 코드 효과: 파도 출렁임, 배 흔들림, 갈매기, 크레인 움직임, 밝은 바다 색 보정

## 해저 해안 도시 (`undersea`)

바닷속에 잠긴 도시. 공기 방울 돔 안의 집, 산호와 해초, 위에서 비치는 물결 빛.

**땅 결** (1:1)

| 파일 | 무엇 | 프롬프트 |
| --- | --- | --- |
| `seabed.png` | 해저 모래 | `Sea floor sand, pale blue-tinted with small shells and starfish.` |
| `coral.png` | 산호 바닥 | `Colorful coral reef ground, pink, orange and purple coral clusters, low and flat.` |
| `kelpBed.png` | 해초밭 | `Dense patch of short swaying kelp and seagrass seen from above.` |
| `pearlRoad.png` | 진주 돌길 | `Underwater road of smooth pale stones with pearly shine.` |
| `trench.png` | 깊은 해구 | `Very deep dark ocean trench water, nearly black blue.` |

**물건 묶음** (3:2, 분홍 배경)

| 파일 | 왼쪽부터 | 프롬프트 |
| --- | --- | --- |
| `seaHouses.png` | 조개 집 · 공기 방울 돔 · 해저 신전 | `Three objects: 1) a house made from a giant spiral shell with a round front door, 2) a glass bubble dome with a small house inside, 3) an ancient underwater temple with columns and a front door.` |
| `seaProps.png` | 큰 산호 · 해초(키 큼) · 큰 조개 · 가라앉은 상자 | `Four objects: 1) a big branching pink coral, 2) a tall kelp plant, 3) a giant open clam with a pearl, 4) a sunken treasure chest.` |

- 코드 효과: 물결 빛 무늬(위에서 비침), 올라가는 거품, 해초 흔들림, 물고기 떼, 푸른 색 보정

## 지옥 — 안쪽은 초록 불씨, 바깥은 붉은 불씨 (`hell`)

지옥불이 퍼진 땅. **불씨 색은 코드가 정함**(중심에 가까울수록 초록, 멀수록 붉음)이라 그림의 불은 붉은색으로만 통일.

**땅 결** (1:1)

| 파일 | 무엇 | 프롬프트 |
| --- | --- | --- |
| `basalt.png` | 그을린 현무암 | `Scorched black basalt ground with glowing red hairline cracks.` |
| `lava.png` | 용암 | `Molten lava surface, bright orange-red with dark cooling crust plates.` |
| `ash.png` | 재 덮인 땅 | `Ground covered with grey ash and small embers.` |
| `obsidian.png` | 흑요석 바닥 | `Polished black obsidian floor tiles with faint purple reflections.` |
| `bloodRock.png` | 갈라진 붉은 땅 | `Cracked dark red rock ground with deep fissures.` |

**물건 묶음** (3:2, 분홍 배경)

| 파일 | 왼쪽부터 | 프롬프트 |
| --- | --- | --- |
| `hellPillars.png` | 해골 기둥 · 뒤틀린 탑 · 악마의 문 | `Three objects: 1) a pillar made of stacked skulls, 2) a twisted black spiked tower, 3) a huge demonic stone gate with horns and a dark entrance at the bottom center.` |
| `hellProps.png` | 사슬 기둥 · 뼈 나무 · 불 구덩이 · 가시 바위 | `Four objects: 1) a stone post with hanging chains, 2) a dead tree made of bones, 3) a round fire pit with red flames, 4) a jagged spiky black rock.` |

- 코드 효과: 불씨 입자(중심 초록 → 바깥 붉음 섞기), 열기 아지랑이, 용암 흐름, 붉은 빛 맥동, 화면 붉은 색 보정

## 바람골 (가칭) — 바람이 시원한 옛 기와 도시 (`windtown`)

탁 트인 하늘, 기와지붕과 대나무, 바람개비와 깃발이 늘 날리는 시원한 도시. (이미 있는 게임을 따라 하지 않음)

**땅 결** (1:1)

| 파일 | 무엇 | 프롬프트 |
| --- | --- | --- |
| `tileRoad.png` | 기와 도시 돌길 | `Old town road of large flat grey stones with neat moss lines, clean and bright.` |
| `bambooGround.png` | 대나무숲 땅 | `Bamboo forest ground with fallen narrow bamboo leaves on light earth.` |
| `stream.png` | 맑은 개울 | `Clear shallow stream water over pebbles, light blue with sparkles.` |
| `yard.png` | 흙 마당 | `Swept light earth courtyard with a few pebbles.` |
| `petalPath.png` | 꽃잎 깔린 길 | `Stone path scattered with pink and white blossom petals.` |

**물건 묶음** (3:2, 분홍 배경)

| 파일 | 왼쪽부터 | 프롬프트 |
| --- | --- | --- |
| `hanokHouses.png` | 기와집 · 큰 기와집 · 정자 | `Three objects: 1) a traditional tiled-roof wooden house with paper sliding doors and a front door at the bottom center, 2) a larger manor house with a curved tiled roof and front gate, 3) an open pavilion on a stone base.` |
| `windProps.png` | 풍차 · 바람개비 · 깃발 장대 · 대나무 무리 | `Four objects: 1) a wooden windmill, 2) a large colorful pinwheel on a pole, 3) a tall pole with a long flowing cloth banner, 4) a cluster of tall bamboo.` |
| `townProps.png` | 돌담 · 장독대 · 연 · 꽃나무 | `Four objects: 1) a short stone wall segment, 2) a group of clay jars on a stone platform, 3) a kite on a string, 4) a blossoming tree.` |

- 코드 효과: 바람 줄기, 날리는 꽃잎·잎, 깃발·대나무·꽃나무 흔들림, 풍차·바람개비 회전, 맑고 높은 채도

## 현대 + 사이버펑크 도시 (`cyber`)

낮은 평범한 현대 도시, 안쪽으로 갈수록 네온과 홀로그램의 사이버펑크 거리. 늘 젖은 밤.

**땅 결** (1:1)

| 파일 | 무엇 | 프롬프트 |
| --- | --- | --- |
| `asphalt.png` | 아스팔트 | `Dark asphalt road with faded white lane markings, slightly wet.` |
| `sidewalk.png` | 보도블록 | `Grey concrete sidewalk tiles in a grid with small cracks.` |
| `neonTile.png` | 네온 줄 바닥 | `Dark metal floor tiles with thin glowing cyan and magenta light lines between them.` |
| `wetStreet.png` | 젖은 길 | `Wet black street reflecting pink and blue light puddles.` |
| `plaza.png` | 광장 타일 | `Modern light grey plaza tiles in a large square pattern.` |

**물건 묶음** (3:2, 분홍 배경)

| 파일 | 왼쪽부터 | 프롬프트 |
| --- | --- | --- |
| `buildings.png` | 빌딩 · 네온 빌딩 · 편의점 | `Three objects: 1) a tall modern office building seen from top-front with a glass entrance door at the bottom center, 2) a cyberpunk tower with blank neon panels (no letters) and an entrance, 3) a small corner store with a glass door.` |
| `streetProps.png` | 가로등 · 자판기 · 홀로그램 탑 · 차 | `Four objects: 1) a modern street lamp, 2) a glowing vending machine (no letters), 3) a pillar projecting a blank blue hologram, 4) a small futuristic car.` |
| `cyberProps.png` | 전선 기둥 · 환풍기 · 쓰레기통 · 네온 간판 | `Four objects: 1) a utility pole with tangled wires, 2) a rooftop air vent unit, 3) a metal trash bin, 4) a blank neon sign frame glowing pink (no letters).` |

- 코드 효과: 비, 네온 깜빡임, 빛 번짐(PixiJS 빛 층), 홀로그램 떨림, 젖은 바닥 반사, 밤 색 보정

## 건물 안 (실내) 재료 (`interior`) — 모든 나라 공통 + 나라 특색

건물 문으로 들어가면 나오는 작은 실내 지도용. 벽·바닥·가구만 있으면 나라마다 조합해서 씀.

**바닥·벽** (1:1)

| 파일 | 무엇 | 프롬프트 |
| --- | --- | --- |
| `woodFloor.png` | 나무 바닥 | `Indoor wooden floorboards, warm honey brown planks running horizontally, clean.` |
| `stoneFloor.png` | 돌 바닥 | `Indoor castle stone floor of smooth grey square tiles.` |
| `carpet.png` | 붉은 카펫 | `Red carpet with a gold border pattern, flat, seen from above.` |
| `metalFloorIn.png` | 실내 철판 | `Clean indoor steel floor panels with small rivets.` |
| `innerWall.png` | 실내 벽 앞면 | `Front face of an interior wall: cream plaster upper half and dark wooden wainscot lower half.` |
| `stoneWallIn.png` | 실내 돌벽 앞면 | `Front face of an interior castle wall of grey stone blocks with a wooden beam at the top.` |

**가구 묶음** (3:2, 분홍 배경)

| 파일 | 왼쪽부터 | 프롬프트 |
| --- | --- | --- |
| `homeFurniture.png` | 침대 · 탁자와 의자 · 책장 · 벽난로 | `Four objects: 1) a single wooden bed with a quilt, 2) a wooden table with two chairs, 3) a tall bookshelf full of books, 4) a stone fireplace with fire.` |
| `shopFurniture.png` | 계산대 · 진열장 · 상자 · 화분 | `Four objects: 1) a wooden shop counter, 2) a display shelf with potions and goods, 3) a stack of wooden crates, 4) a potted plant.` |
| `hallFurniture.png` | 왕좌 · 긴 탁자 · 갑옷 장식 · 기둥 | `Four objects: 1) a royal throne on a small platform, 2) a long banquet table, 3) a decorative suit of armor on a stand, 4) a stone pillar.` |
| `churchFurniture.png` | 제단 · 긴 의자 · 촛대 · 오르간 | `Four objects: 1) a white altar with a gold cross, 2) a wooden church pew, 3) a tall candle stand, 4) a small pipe organ.` |
| `doorMat.png` | 안쪽 문 · 계단(아래) · 계단(위) | `Three objects: 1) an interior wooden double door seen from inside, 2) a stone staircase going down, 3) a wooden staircase going up.` |

- 코드: 벽 위 가장자리·그림자·창으로 들어오는 빛·촛불·벽난로 흔들림

## 넣는 곳 (코드)

- 손질: `scripts/art/world_art.py` (`TEX` 땅 결 이름 · `SHEETS` 묶음마다 이름·크기)
- 게임: `world/worldTex` 그림 받기·반복 채우기 → `worldGround` 땅 결 · `worldBuild` 성벽·집 · `worldArt` 바위·풀숲·다리 · `worldTrees` 나무 · `worldPlaceArt` 동굴·표지판
- 깃발·꽃·울타리·그림자·물 반짝임·나비는 계속 코드 그림 (움직임 때문)
