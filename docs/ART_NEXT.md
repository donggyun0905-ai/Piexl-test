# 다음에 만들 그림 전체 (2026-11-15)

> 세계 지도 한 장 · 지도 바닥·꽃 · 꽃의 나라 · 사람 · 나라 집 · 바닥 · 코드 그림 대체 · 거리 소품 · 로비(아지트) 테마 9벌 + 공용
> 각 줄의 **붙여 넣을 프롬프트** = 위 "앞 문장" + 표의 프롬프트 + "공통 끝 문장" (아래에 묶음별로 다 이어 붙여 둠)
> 배경: 보통 **마젠타 #FF00FF** · 분홍·보라 물건이 있는 묶음은 **초록 #00FF00** (표에 🟩 표시) — 배경 지울 때 물건 색이 같이 지워지지 않게
> 화풍 참고 그림: 아스칼론 `grass.png`·`trees.png`를 같이 붙이기 (로비는 지금 로비 스크린샷 한 장도 같이)

---

## 0. 공통 문장 (모든 묶음에 쓰임)

### A. 땅 결 앞 문장 (1:1)
```
Seamless tileable ground texture, viewed straight from above (flat, no perspective, no horizon),
the pattern fills the whole square image edge to edge, evenly spread, no single big focal object,
no cast shadows from outside objects, no border or vignette. Square 1:1.
```

### B. 물건 묶음 앞 문장 (3:2, 마젠타)
```
Game sprite sheet on a solid flat pure magenta background (#FF00FF), no gradient, no ground, no cast shadows on the background.
The objects stand in ONE horizontal row from left to right, with wide empty magenta gaps between them;
each object is complete, not touching another object or the image edge. Viewed from a top-down 3/4 RPG angle. Landscape 3:2.
```

### B🟩. 물건 묶음 앞 문장 (3:2, 초록 — 분홍·보라 물건용)
```
Game sprite sheet on a solid flat pure green background (#00FF00), no gradient, no ground, no cast shadows on the background.
The objects stand in ONE horizontal row from left to right, with wide empty green gaps between them;
each object is complete, not touching another object or the image edge. Viewed from a top-down 3/4 RPG angle. Landscape 3:2.
```

### C. 사람 앞 문장 (1:1)
```
Single chibi pixel art character, 2-head-tall cute proportions with a big head, standing still and facing the viewer (front view),
full body centered, feet at the bottom, bold dark outline, transparent background (or solid flat magenta #FF00FF),
same style and size as cute chibi anime pixel RPG party members. Square 1:1, 128x128 pixel canvas.
```

### D. 공통 끝 문장 (모든 그림 맨 끝)
```
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

---

## 1. 세계 지도 한 장 — `art/지도/world/worldMap.png` (3:2, 예 1536×1024 · 앞·끝 문장 없이 이것만)

```
A top-down fantasy world map in cute detailed pixel art style (16-bit RPG overworld), seen from above with slight 3/4 perspective on landmarks, deep blue ocean background, NO text, NO letters, NO labels, NO numbers anywhere on the image.
Wide 3:2 canvas. Each region must have a clearly readable shape and boundary (forest edge, mountains, river, coastline) so regions can be outlined later.

LEFT-CENTER: the "old continent", a large rounded landmass with green plains, forests and mountains, thin blue rivers. Regions on it:
- Top center: a snowy ice field with a blue-white fortress castle and snowy pine trees (northern fortress nation).
- Directly above the snow region, at the very top edge: a small dark volcanic rift land with red lava cracks, black obsidian rocks and a glowing red-green demonic portal gate, connected to the snow fortress by a narrow frozen pass.
- Upper left: a classic medieval kingdom castle with blue roofs and red flags, on plains with a river flowing west into the sea.
- Upper middle: an industrial machine city with brick factories, chimneys with smoke, gears and a small railway.
- Upper right: a huge ancient tree towering over a deep, dense dark-green forest, a river flowing east.
- Center-left: a wide golden desert with dunes, cacti and rock mesas; half-buried sandstone ruins of an ancient city sunk in the sand on its west side.
- Lower left: a white-stone holy city with a giant cathedral with tall spires and a golden flame on top.
- Bottom center: a grand imperial city with white walls, golden domes and blue flags, a river flowing south into the sea, a small harbor on the south coast.
- Between the desert and the imperial city: plain rolling hills, small forests and rocky mountains (no special buildings).
- East side: a long narrow peninsula reaching far out into the ocean, separated from the mainland by a high mountain range and deep forest, with only a thin coastal road along it. At its far tip: a bright harbor trade city with white walls, red-orange roofs, a lighthouse, long wooden piers and several sailing ships.

RIGHT SIDE: a second continent shaped like a crescent moon, curving around the east side of the old continent, a little less than half of a ring, separated by a wide ocean. Its land is pale grey-violet with misty edges. Along the crescent from top to bottom, five spots:
1) top: a futuristic neon cyberpunk city with tall towers glowing pink and cyan,
2) a misty empty land covered in soft fog (undiscovered),
3) a misty empty land covered in soft fog (undiscovered),
4) an old East-Asian-style town with grey tiled roofs, bamboo groves, pinwheels and a windmill on a hill,
5) bottom: a misty empty land covered in soft fog (undiscovered).

OCEAN: in the middle of the big ocean, to the right of the imperial city and below the harbor peninsula: a glowing underwater city visible through clear turquoise water, with coral, shell-shaped houses and air-bubble domes, a soft light ring on the water surface above it.
A faint dotted sea route line from the harbor city across the ocean to the crescent continent.

Bright, cheerful colors, clean pixel outlines, consistent lighting from the top-left, no characters, no UI frame, no compass, no legend, no text.
```

---

## 2. 지도 큰길·길 테두리·꽃 (성 안 길이 안 보이는 문제) — 땅 결은 A + 프롬프트 + D · 물건은 B + 프롬프트 + D

| 파일 | 종류 | 프롬프트 |
| --- | --- | --- |
| `ascalon/땅/avenue.png` | 땅 | `Main town avenue of warm sandy-beige rectangular paving bricks in a herringbone pattern, clearly lighter and warmer than grey cobblestones, clean.` |
| `common/땅/curb.png` | 땅 | `A straight road curb edge strip: a single row of long light stone curb blocks with a thin dark gap, seen from above, repeating evenly across the whole image.` |
| `thalassia/땅/harborAvenue.png` | 땅 | `Harbor main street of pale cream limestone slabs with thin blue-grey grout, bright and sunny.` |
| `seongguk/땅/holyAvenue.png` | 땅 | `Sacred avenue of white marble slabs with thin gold inlay lines along the edges.` |
| `virdia/땅/rootPath.png` | 땅 | `Forest town path of mossy flat stepping stones set in soft green moss.` |
| `ascalon/땅/townStone.png` | 땅 | `Medieval town square paving of warm grey rounded cobblestones of mixed sizes, neat mortar lines, a few lighter worn stones, clean.` |
| `helios/땅/sandPaving.png` | 땅 | `Sun-baked sandstone paving of large pale golden rectangular slabs laid in a running bond, thin warm grout, faint wear, clean and bright.` |
| `thalassia/땅/harborCobble.png` | 땅 | `Harbor town cobblestones: rounded blue-grey stones with a slightly wet sheen, sandy grout, tiny shell bits between stones.` |
| `silber/땅/frostFlag.png` | 땅 | `Fortress courtyard flagstones of dark grey square slabs with frost in the cracks and small patches of trampled snow, cold and clean.` |
| `ascalon/땅/flowerBed.png` | 땅 | `A dense flower garden bed seen from above: mixed small red, yellow, white and violet flowers among green leaves, evenly spread, soft and bright.` |
| `common/물건/flowerPots.png` 🟩 | 물건 | `Four objects: 1) a stone planter box full of red and yellow flowers, 2) a round clay pot with violet flowers, 3) a hanging flower basket on a short iron bracket, 4) a wooden window flower box with pink and white flowers.` |

---

## 3. 꽃의 나라 (가칭 `blossom`, 서양풍 분홍 동화 마을)

| 파일 | 종류 | 프롬프트 |
| --- | --- | --- |
| `blossom/땅/blossomGrass.png` | 땅 | `Soft spring meadow grass with many tiny fallen pink cherry blossom petals scattered evenly.` |
| `blossom/땅/petalRoad.png` | 땅 | `Light pink-beige stone paving with fallen cherry petals gathered in the joints, bright and gentle.` |
| `blossom/땅/pinkBrick.png` | 땅 | `Main avenue of rose-pink and cream bricks in a running bond, clean and cheerful.` |
| `blossom/땅/petalPond.png` | 땅 | `Calm pale blue pond water with floating pink cherry petals and soft ripples.` |
| `blossom/물건/sakuraTrees.png` 🟩 | 물건 | `Four trees: 1) a large cherry blossom tree with a full fluffy pink crown and dark curved trunk, 2) a small young cherry tree, 3) a deep-pink double-blossom cherry tree, 4) a cherry tree with fresh green leaves and few petals.` |
| `blossom/물건/pinkHouses.png` 🟩 | 물건 | `Three objects: 1) a cozy cottage with pink plaster walls, a rose-red tiled roof and a front door at the bottom center, flower boxes under windows, 2) the same cottage in white walls with a pale pink roof, 3) a small flower shop with a striped pink awning and buckets of flowers by the door at the bottom center.` |
| `blossom/물건/flowerPalace.png` 🟩 | 물건 | `One object: a graceful pale pink and white palace with rounded towers, rose-gold roof tips, climbing flower vines, a grand door at the bottom center.` |
| `blossom/물건/blossomProps.png` 🟩 | 물건 | `Four objects: 1) a white arch covered in pink flowers, 2) a round fountain with a flower-shaped basin, 3) a white bench under petals, 4) a wooden cart full of flower bouquets.` |

---

## 4. 사람 (NPC) — C + 프롬프트 + D · `art/지도/npc/{파일}`

| 파일 | 프롬프트 |
| --- | --- |
| `puppetKing.png` | `A puppet emperor: a pale, lifeless young king with hollow glassy eyes and a fixed thin smile, slumped but upright as if held by strings; an oversized golden sun crown slightly crooked, heavy crimson and gold imperial robe too big for his body, ornate gold collar and rings; faint thin silver strings rise from his wrists, shoulders and head up out of the frame; small cracks like porcelain on his cheek; holds a golden scepter loosely. Eerie but cute, not gory.` |
| `guardHelios.png` | `An imperial palace guard: polished gold and white plate armor with a red sash, tall plumed sun-crest helmet covering the eyes, holding a long halberd upright, red cape.` |
| `guardAscalon.png` | `A royal knight guard: steel plate armor with a blue tabard showing a simple white lion shape, open-face helmet, holding a spear and a round shield, short blue cape.` |
| `guardSilber.png` | `A northern fortress soldier: thick fur-lined grey armor, fur hood over a steel helmet, frosty breath, holding a long spear, wool scarf, sturdy boots dusted with snow.` |
| `merchant.png` | `A friendly market merchant: round cheerful face, brown apron over a cream shirt, rolled sleeves, headscarf, holding a small scale in one hand.` |
| `sailor.png` | `A harbor sailor: striped blue-white shirt, rolled trousers, knit cap, coil of rope over one shoulder, tanned face with a grin.` |
| `flowerGuard.png` | `A flower kingdom guard: white and pale pink armor, a petal-shaped helmet plume, holding a slim spear tied with a pink ribbon.` (배경 초록 #00FF00 로 바꿔 쓰기) |

---

## 5. 나라마다 집 — B + 프롬프트 + D

| 파일 | 프롬프트 |
| --- | --- |
| `silber/물건/houses.png` | `Two objects: 1) a small sturdy northern stone cottage with thick grey stone walls, a steep dark slate roof covered in a thick layer of snow, icicles on the eaves, a heavy wooden front door at the bottom center, one small warm-lit window, 2) the same cottage with a dark brown timber roof under snow and a stone chimney.` |
| `thalassia/물건/houses.png` | `Two objects: 1) a cheerful harbor townhouse with whitewashed walls, a bright blue tiled roof, blue wooden shutters, a rope and small anchor plaque by the front door at the bottom center, 2) the same house with a terracotta orange roof and green shutters.` |
| `terracore/물건/houses.png` | `Two objects: 1) a compact industrial worker house of soot-stained red brick with a riveted iron roof, a small copper pipe and vent on the side, a metal-framed front door at the bottom center, 2) the same house with grey brick walls and a corrugated steel roof.` |
| `desert/물건/houses.png` | `Two objects: 1) a small desert adobe house with rounded sand-colored mud walls, a flat roof with a wooden beam edge, a cloth-covered doorway at the bottom center, 2) the same house with a small dome on top and blue painted door frame.` |

---

## 6. 코드로 대충 그린 것 → 그림 — B + 프롬프트 + D · `art/지도/common/물건/`

| 파일 | 프롬프트 |
| --- | --- |
| `warpStones.png` | `Two objects: 1) a magical teleport waystone: a waist-high pillar of smooth pale stone on a round carved base, a floating glowing blue crystal hovering above it, thin blue rune lines on the pillar, 2) the same waystone dormant: the crystal resting dark and grey on top, runes unlit.` |
| `shopSigns.png` | `Six objects: small hanging wooden shop signboards on short iron brackets, each painted with one simple symbol: 1) a sword, 2) a shield, 3) a red potion bottle, 4) a coin pouch, 5) a smith hammer, 6) a bed with a moon. Same size and wood style.` |
| `towerMemory.png` 🟩 | `One object: a tall slender ancient stone tower of pale blue-grey stone, spiraling carved bands, a glowing violet window near the top, a grand arched door at the bottom center, floating rune stones circling the upper part.` |
| `colosseumGate.png` | `One object: a massive arena entrance gate: a tall stone arch with heavy iron portcullis half raised, crossed swords emblem above, two flaming braziers on pillars at the sides.` |
| `fences.png` | `Three objects: 1) a short wooden picket fence segment, 2) a low stacked stone fence segment, 3) a black wrought-iron fence segment with spear tips. Each segment exactly as wide as it is tall times two, straight, seen from the front.` |

---

## 7. 거리 소품 — B + 프롬프트 + D

| 파일 | 프롬프트 |
| --- | --- |
| `common/물건/market.png` 🟩 | `Four objects: market stalls with striped cloth awnings on wooden frames: 1) a fruit stall with apples, grapes and melons in baskets, red-white awning, 2) a fabric stall with folded colorful cloth rolls, purple-white awning, 3) a weapon stall with swords and shields on a rack, green-white awning, 4) a bakery stall with bread loaves and pies, yellow-white awning.` |
| `common/물건/townProps.png` | `Four objects: 1) a round stone well with a small wooden roof and a bucket on a rope, 2) a wooden park bench with iron legs, 3) a wooden hand cart loaded with sacks and crates, 4) a wooden notice board with pinned paper notes (blank papers, no writing).` |
| `ascalon/물건/knightStatue.png` | `Two objects: 1) a heroic bronze knight statue raising a sword on a tall stone pedestal, 2) a round stone fountain with a lion head spouting water into a basin.` |
| `helios/물건/empireProps.png` | `Four objects: 1) a gilded lamp post with a sun-shaped lantern, 2) a large terracotta planter with a small palm, 3) a gold-trimmed imperial carriage without horses, 4) a low marble bench with gold feet.` |
| `silber/물건/fortProps.png` | `Four objects: 1) a stacked firewood pile with snow on top, 2) a supply sled with crates under a tarp, 3) an alarm bell hanging from a wooden frame, 4) an archery target on a stand with arrows stuck in it.` |
| `thalassia/물건/harborProps.png` | `Four objects: 1) a coil of thick rope, 2) a wicker basket full of silver fish, 3) a wooden mooring post with a white seagull standing on top, 4) a folded pile of canvas sail cloth.` |
| `terracore/물건/streetProps.png` | `Four objects: 1) a floor steam vent grate with a pipe stub, 2) a dented oil drum with a hazard stripe, 3) a workbench with tools and a vise, 4) a large standing gear-shaped street sign without text.` |
| `dawn/물건/hideoutMore.png` | `Three objects: 1) a shooting range target board on a wooden stand with bullet holes, 2) a simple wooden cot bed with a grey wool blanket, 3) a narrow stone stairway going up with a wooden railing.` |

---

## 8. 로비 (아지트) — `art/로비/{테마}/{파일}` · 칸 16픽셀 방이라 물건은 **작고 단순하게**

### 로비 앞 문장 (바닥 1:1 = A 그대로 · 벽 띠 = 아래 E · 물건 = B / B🟩)

#### E. 로비 벽 띠 앞 문장 (3:1)
```
Seamless horizontally tileable interior wall strip for a small cozy game room, seen straight from the front,
the wall face fills the image edge to edge, a slightly lighter top ledge along the top edge, no floor, no furniture,
no cast shadows, no border. Wide 3:1.
```
#### 로비 물건 끝에 더하는 한 줄 (D 앞에)
```
Each object is small and simple enough to read clearly at 24 pixels tall in-game, chunky shapes, few details.
```

### 테마 9벌 (테마마다 3장: 바닥 `floor.png` · 벽 `wall.png` · 물건 `props.png`)

| 테마 | `floor.png` (A) | `wall.png` (E) | `props.png` (B, 왼쪽부터) |
| --- | --- | --- | --- |
| `arcade` 오락실 (기본) | `Arcade lounge carpet of deep purple with small neon pink and cyan geometric shapes, soft and dark.` | `Dark violet arcade wall with glowing pink and cyan neon tube stripes and small star shapes.` | 🟩 `Five objects: 1) a round tiled indoor fountain with a small water spout, 2) a soft purple two-seat sofa, 3) a potted leafy plant, 4) a drink vending machine with a glowing front, 5) a small round neon-lit side table.` |
| `swim` 해변 | `Warm golden beach sand with soft ripples and a few tiny shells.` | `Bright sky-blue wall painted with white wave lines and a sun, beach-house style.` | `Seven objects: 1) a palm tree in a pot, 2) a striped beach deck chair, 3) a small red crab, 4) a pink spiral seashell, 5) a folded striped beach towel, 6) a colorful beach ball, 7) a striped beach umbrella.` (7개) |
| `xmas` 크리스마스 | `Warm wooden floor dusted with soft white snow patches.` | `Dark green wall with red ribbons, small wreaths and warm string lights.` | `Five objects: 1) a decorated Christmas tree with a gold star, 2) a wooden bench with a red cushion, 3) a pile of wrapped gift boxes, 4) a large red-white candy cane, 5) a cute snowman with a scarf.` |
| `halloween` 할로윈 | `Dark purple wooden floorboards with faint green glow cracks.` | `Dark purple wall with cobwebs in the corners and small orange bats.` | 🟩 `Five objects: 1) a bubbling witch cauldron with green glow, 2) a dark wooden bench, 3) a carved jack-o'-lantern pumpkin, 4) a cluster of dripping candles, 5) a cartoon tombstone with a crack.` |
| `school` 학교 | `Polished light oak classroom floorboards.` | `Cream classroom wall with a dark green chalkboard band and a wooden rail (blank chalkboard, no writing).` | `Five objects: 1) a wooden school desk with a chair, 2) a long wooden bench, 3) a desk globe, 4) a stack of colorful books, 5) a potted plant.` |
| `newyear` 새해 (한국풍) | `Warm yellow-brown traditional heated floor paper with faint square seams.` | `Traditional paper sliding wall with thin wooden lattice and a dark wood top beam.` | `Five objects: 1) a traditional stick-throwing board game mat with four wooden sticks, 2) a low wooden bench, 3) a silk lucky pouch with tassel, 4) a rectangular paper kite with a hole in the middle, 5) a low wooden table with rice cakes.` |
| `japan` 일본풍 | `Woven green straw floor mats with dark cloth borders, neat grid.` | `White paper sliding doors in a wooden lattice frame with a dark wood top beam and a small red accent.` | 🟩 `Five objects: 1) a small cherry blossom tree, 2) a low wooden bench, 3) a stone lantern, 4) a bonsai pine in a shallow pot, 5) a small red shrine gate.` |
| `china` 중국풍 | `Rich red lacquered floor with thin gold square pattern.` | `Red wall with golden cloud swirl pattern and a dark red top beam.` | `Five objects: 1) a coiled golden dragon statue, 2) a carved dark wood bench, 3) a round red paper lantern with gold tassel, 4) a small blue-white porcelain vase, 5) a tall blue-white porcelain floor vase.` |
| `usa` 미국풍 | `Black and white checkered diner floor tiles.` | `Navy blue wall with red and white stripes and small white star shapes.` | `Four objects: 1) a glowing retro jukebox, 2) a red diner booth seat, 3) a flag on a short pole with red-white stripes and a blue corner with stars, 4) a giant cartoon burger sign prop.` |

### 로비 공용 — `art/로비/common/`

| 파일 | 앞 문장 | 프롬프트 |
| --- | --- | --- |
| `machines1.png` 🟩 | B🟩 | `Five objects: small upright arcade game cabinets, all the same shape and size, each with a glowing screen and a simple picture on the top panel (no text): 1) green cabinet with a playing card, 2) orange cabinet with colored square tiles, 3) pink cabinet with a red apple, 4) purple cabinet with stacked falling blocks, 5) violet cabinet with a jester hat.` |
| `machines2.png` | B | `Four objects: 1) a golden slot machine with a pull lever and three cherry reels, 2) a white dice table cabinet with two big dice on top, 3) an orange card cabinet with an up arrow and down arrow, 4) a cute pet shop stall with a pink awning, a small doghouse and pet food bags.` |
| `hallFloor.png` | A | `Polished cream marble floor of large square slabs with a long royal red carpet runner pattern, elegant.` |
| `hallWall.png` | E | `Grand museum hall wall of pale stone with tall arched windows letting in soft light, purple banners and a thin gold band along the top.` |
| `hallProps.png` 🟩 | B🟩 | `Four objects: 1) a tall white stone pillar with gold trim, 2) an empty marble display pedestal, 3) a glass dome display case on a pedestal (empty inside), 4) a large open record book on a wooden lectern.` |

---

## 몇 장인지

| 묶음 | 장 |
| --- | --- |
| 세계 지도 | 1 |
| 큰길·테두리·꽃 | 11 |
| 꽃의 나라 | 8 |
| 사람 | 7 |
| 나라 집 | 4 |
| 코드 그림 대체 | 5 |
| 거리 소품 (아지트 추가 1 포함) | 8 |
| 로비 테마 9 × 3 | 27 |
| 로비 공용 | 5 |
| **합계** | **76** |

추천 순서: 세계 지도 → 로비 오락실(기본) 3장 + 게임기 2장 → 큰길·테두리·화분 → 나라 집 → 나머지
