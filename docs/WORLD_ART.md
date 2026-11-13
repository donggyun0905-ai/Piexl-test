# 세계 지도 그림 (B안: 땅 결·물건 그림)

> 작성 2026-11-14 (한국 시간) · 상태: 코드 준비 끝, 그림 기다리는 중

지금 세계 지도는 코드로 그린 그림(A안)입니다. 아래 그림을 만들어 올리면 **올린 것만** 그 그림으로 바뀌고, 나머지는 그대로 코드 그림입니다 (하나씩 넣어도 됨).

## 하는 순서

1. 아래 프롬프트로 그림을 만든다 (그림 도구 아무거나, **원본 PNG 다운로드** · 화면 캡처 말고)
2. 채팅에 올리면 Claude가 `art/지도/땅/{이름}.png`, `art/지도/물건/{묶음}.png`에 넣고 `python3 scripts/art/world_art.py` 실행
   - 땅 결: 256×256으로 줄이고 이어 붙여도 이음매 없게 손질 → `public/world/tex/`
   - 물건: 배경을 지우고 왼쪽부터 하나씩 잘라 크기 맞춤 → `public/world/obj/`
   - `public/world/art.json` 목록을 새로 씀 (게임은 목록에 있는 그림만 받음)
3. 게임 화면 스크린샷을 보여 드림 → 마음에 들면 올리기, 아니면 다시 생성

크기 기준: 그림 1픽셀 = 지도 1/4픽셀 (캐릭터 그림과 같은 선명도) · 한 칸 = 64픽셀.

## 모든 그림에 붙이는 공통 문장 (영어 그대로 끝에 붙이기)

```
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
```

## 1. 땅 결 (정사각형 1:1, 한 장씩 · 11장)

모든 땅 결 프롬프트 앞에 붙이기:

```
Seamless tileable ground texture, viewed straight from above (flat, no perspective, no horizon),
the pattern fills the whole square image edge to edge, evenly spread, no single big focal object,
no cast shadows from outside objects, no border or vignette. Square 1:1.
```

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

## 2. 물건 묶음 (가로 3:2, 한 장에 여러 개 · 4장)

모든 물건 프롬프트 앞에 붙이기 (배경을 지우고 자르려면 중요):

```
Game sprite sheet on a solid flat pure magenta background (#FF00FF), no gradient, no ground, no cast shadows on the background.
The objects stand in ONE horizontal row from left to right, with wide empty magenta gaps between them;
each object is complete, not touching another object or the image edge. Viewed from a top-down 3/4 RPG angle. Landscape 3:2.
```

| 파일 이름 | 왼쪽부터 | 프롬프트 (위 문장 다음에) |
| --- | --- | --- |
| `trees.png` | 둥근 나무 · 둥근 나무 2 · 뾰족 나무 · 뾰족 나무 2 | `Four trees: 1) a round leafy oak with a full bushy crown and short brown trunk, 2) a slightly smaller round leafy tree in a deeper green, 3) a tall pine tree with three layered tiers, 4) a slightly shorter darker pine. All trees the same art style, trunks visible at the bottom.` |
| `rocks.png` | 큰 바위 · 작은 바위 · 풀숲 | `Three objects: 1) a large rounded grey-brown boulder with a little moss on top, 2) a small rounded stone, 3) a small round leafy green bush.` |
| `houses.png` | 빨간 지붕 집 · 파란 지붕 집 | `Two small cozy medieval village cottages seen from the front-top: 1) red tiled roof, cream plaster walls with wooden beams, a wooden front door in the middle, two small glowing windows; 2) the same size house with a blue tiled roof. Each house is wider than tall (about 3 wide by 2.5 tall).` |
| `places.png` | 던전 동굴 입구 · 표지판 | `Two objects: 1) a dungeon cave entrance carved into a small rocky hill with a stone arch frame, dark inside with a faint red glow, two standing torches on both sides, 2) a wooden signpost with a blank rectangular board.` |

## 넣는 곳 (코드)

- 손질: `scripts/art/world_art.py` (`TEX` 땅 결 이름 · `SHEETS` 묶음마다 이름·크기)
- 게임: `world/worldTex` 그림 받기·반복 채우기 → `worldGround` 땅 결 · `worldBuild` 성벽·집 · `worldArt` 바위·풀숲·다리 · `worldTrees` 나무 · `worldPlaceArt` 동굴·표지판
- 깃발·꽃·울타리·그림자·물 반짝임·나비는 계속 코드 그림 (움직임 때문)
