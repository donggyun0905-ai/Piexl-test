# 지금 만들 그림 — 완성 프롬프트 (2026-11-15)

> 화면을 직접 띄워 확인하고 고른 **88장**. 아래 코드 칸을 **통째로 복사**해서 그림 도구에 넣으면 됨 (앞·끝 문장까지 다 붙어 있음)
> 순서 = 추천 순서 (위에서부터). 다 만든 것은 채팅에 올리면 Claude가 넣음 · 빼거나 미룬 것은 `docs/ART_NEXT.md`·`docs/ART_NEXT2.md`에 표시
> 화풍 참고 그림: 아스칼론 `grass.png`·`trees.png` 같이 붙이기 (로비는 지금 로비 스크린샷도)


## 1. 세계 지도

### 1. `art/지도/world/worldMap.png` (3:2 (예 1536×1024))
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


## 2. 로비 (메인 화면 배경 · 기본 오락실 + 게임기 + 펫)

### 2. `art/로비/arcade/floor.png` (1:1)
```
Seamless tileable ground texture, viewed straight from above (flat, no perspective, no horizon),
the pattern fills the whole square image edge to edge, evenly spread, no single big focal object,
no cast shadows from outside objects, no border or vignette. Square 1:1.
Arcade lounge carpet of deep purple with small neon pink and cyan geometric shapes, soft and dark.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 3. `art/로비/arcade/wall.png` (3:1)
```
Seamless horizontally tileable interior wall strip for a small cozy game room, seen straight from the front,
the wall face fills the image edge to edge, a slightly lighter top ledge along the top edge, no floor, no furniture,
no cast shadows, no border. Wide 3:1.
Dark violet arcade wall with glowing pink and cyan neon tube stripes and small star shapes.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 4. `art/로비/arcade/props.png` (3:2 · 초록 배경)
```
Game sprite sheet on a solid flat pure green background (#00FF00), no gradient, no ground, no cast shadows on the background.
The objects stand in ONE horizontal row from left to right, with wide empty green gaps between them;
each object is complete, not touching another object or the image edge. Viewed from a top-down 3/4 RPG angle. Landscape 3:2.
Five objects: 1) a round tiled indoor fountain with a small water spout, 2) a soft purple two-seat sofa, 3) a potted leafy plant, 4) a drink vending machine with a glowing front, 5) a small round neon-lit side table.
Each object is small and simple enough to read clearly at 24 pixels tall in-game, chunky shapes, few details.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 5. `art/로비/common/machines1.png` (3:2 · 초록 배경)
```
Game sprite sheet on a solid flat pure green background (#00FF00), no gradient, no ground, no cast shadows on the background.
The objects stand in ONE horizontal row from left to right, with wide empty green gaps between them;
each object is complete, not touching another object or the image edge. Viewed from a top-down 3/4 RPG angle. Landscape 3:2.
Five objects: small upright arcade game cabinets, all the same shape and size, each with a glowing screen and a simple picture on the top panel (no text): 1) green cabinet with a playing card, 2) orange cabinet with colored square tiles, 3) pink cabinet with a red apple, 4) purple cabinet with stacked falling blocks, 5) violet cabinet with a jester hat.
Each object is small and simple enough to read clearly at 24 pixels tall in-game, chunky shapes, few details.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 6. `art/로비/common/machines2.png` (3:2)
```
Game sprite sheet on a solid flat pure magenta background (#FF00FF), no gradient, no ground, no cast shadows on the background.
The objects stand in ONE horizontal row from left to right, with wide empty magenta gaps between them;
each object is complete, not touching another object or the image edge. Viewed from a top-down 3/4 RPG angle. Landscape 3:2.
Four objects: 1) a golden slot machine with a pull lever and three cherry reels, 2) a white dice table cabinet with two big dice on top, 3) an orange card cabinet with an up arrow and down arrow, 4) a cute pet shop stall with a pink awning, a small doghouse and pet food bags.
Each object is small and simple enough to read clearly at 24 pixels tall in-game, chunky shapes, few details.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 7. `art/로비/common/pets1.png` (3:2 · 초록 배경)
```
Game sprite sheet on a solid flat pure green background (#00FF00), no gradient, no ground, no cast shadows on the background.
The objects stand in ONE horizontal row from left to right, with wide empty green gaps between them;
each object is complete, not touching another object or the image edge. Viewed from a top-down 3/4 RPG angle. Landscape 3:2.
Four tiny cute chibi pets, each seen from the side facing right, standing, round and simple: 1) an orange tabby kitten, 2) a small cream puppy with floppy ears, 3) a bouncy blue jelly slime with shiny highlight and dot eyes, 4) a baby dragon with small wings, mint scales and a cream belly.
Each object is small and simple enough to read clearly at 24 pixels tall in-game, chunky shapes, few details.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 8. `art/로비/common/pets2.png` (3:2 · 초록 배경)
```
Game sprite sheet on a solid flat pure green background (#00FF00), no gradient, no ground, no cast shadows on the background.
The objects stand in ONE horizontal row from left to right, with wide empty green gaps between them;
each object is complete, not touching another object or the image edge. Viewed from a top-down 3/4 RPG angle. Landscape 3:2.
Four tiny cute chibi pets, each seen from the side facing right, standing, round and simple: 1) a white bunny with long ears, 2) a fluffy yellow chick, 3) a baby phoenix with red-orange flame feathers and a golden tail, 4) a small green turtle with a rounded shell.
Each object is small and simple enough to read clearly at 24 pixels tall in-game, chunky shapes, few details.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```


## 3. 성 안 큰길·테두리·화분

### 9. `art/지도/ascalon/땅/avenue.png` (1:1)
```
Seamless tileable ground texture, viewed straight from above (flat, no perspective, no horizon),
the pattern fills the whole square image edge to edge, evenly spread, no single big focal object,
no cast shadows from outside objects, no border or vignette. Square 1:1.
Main town avenue of warm sandy-beige rectangular paving bricks in a herringbone pattern, clearly lighter and warmer than grey cobblestones, clean.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 10. `art/지도/common/땅/curb.png` (1:1)
```
Seamless tileable ground texture, viewed straight from above (flat, no perspective, no horizon),
the pattern fills the whole square image edge to edge, evenly spread, no single big focal object,
no cast shadows from outside objects, no border or vignette. Square 1:1.
A straight road curb edge strip: a single row of long light stone curb blocks with a thin dark gap, seen from above, repeating evenly across the whole image.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 11. `art/지도/common/물건/flowerPots.png` (3:2 · 초록 배경)
```
Game sprite sheet on a solid flat pure green background (#00FF00), no gradient, no ground, no cast shadows on the background.
The objects stand in ONE horizontal row from left to right, with wide empty green gaps between them;
each object is complete, not touching another object or the image edge. Viewed from a top-down 3/4 RPG angle. Landscape 3:2.
Four objects: 1) a stone planter box full of red and yellow flowers, 2) a round clay pot with violet flowers, 3) a hanging flower basket on a short iron bracket, 4) a wooden window flower box with pink and white flowers.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```


## 4. 사람

### 12. `art/지도/npc/puppetKing.png` (1:1)
```
Single chibi pixel art character, 2-head-tall cute proportions with a big head, standing still and facing the viewer (front view),
full body centered, feet at the bottom, bold dark outline, transparent background (or solid flat magenta #FF00FF),
same style and size as cute chibi anime pixel RPG party members. Square 1:1, 128x128 pixel canvas.
A puppet emperor: a pale, lifeless young king with hollow glassy eyes and a fixed thin smile, slumped but upright as if held by strings; an oversized golden sun crown slightly crooked, heavy crimson and gold imperial robe too big for his body, ornate gold collar and rings; faint thin silver strings rise from his wrists, shoulders and head up out of the frame; small cracks like porcelain on his cheek; holds a golden scepter loosely. Eerie but cute, not gory.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 13. `art/지도/npc/guardHelios.png` (1:1)
```
Single chibi pixel art character, 2-head-tall cute proportions with a big head, standing still and facing the viewer (front view),
full body centered, feet at the bottom, bold dark outline, transparent background (or solid flat magenta #FF00FF),
same style and size as cute chibi anime pixel RPG party members. Square 1:1, 128x128 pixel canvas.
An imperial palace guard: polished gold and white plate armor with a red sash, tall plumed sun-crest helmet covering the eyes, holding a long halberd upright, red cape.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 14. `art/지도/npc/guardAscalon.png` (1:1)
```
Single chibi pixel art character, 2-head-tall cute proportions with a big head, standing still and facing the viewer (front view),
full body centered, feet at the bottom, bold dark outline, transparent background (or solid flat magenta #FF00FF),
same style and size as cute chibi anime pixel RPG party members. Square 1:1, 128x128 pixel canvas.
A royal knight guard: steel plate armor with a blue tabard showing a simple white lion shape, open-face helmet, holding a spear and a round shield, short blue cape.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 15. `art/지도/npc/guardSilber.png` (1:1)
```
Single chibi pixel art character, 2-head-tall cute proportions with a big head, standing still and facing the viewer (front view),
full body centered, feet at the bottom, bold dark outline, transparent background (or solid flat magenta #FF00FF),
same style and size as cute chibi anime pixel RPG party members. Square 1:1, 128x128 pixel canvas.
A northern fortress soldier: thick fur-lined grey armor, fur hood over a steel helmet, frosty breath, holding a long spear, wool scarf, sturdy boots dusted with snow.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```


## 5. 나라 집

### 16. `art/지도/silber/물건/houses.png` (3:2)
```
Game sprite sheet on a solid flat pure magenta background (#FF00FF), no gradient, no ground, no cast shadows on the background.
The objects stand in ONE horizontal row from left to right, with wide empty magenta gaps between them;
each object is complete, not touching another object or the image edge. Viewed from a top-down 3/4 RPG angle. Landscape 3:2.
Two objects: 1) a small sturdy northern stone cottage with thick grey stone walls, a steep dark slate roof covered in a thick layer of snow, icicles on the eaves, a heavy wooden front door at the bottom center, one small warm-lit window, 2) the same cottage with a dark brown timber roof under snow and a stone chimney.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 17. `art/지도/thalassia/물건/houses.png` (3:2)
```
Game sprite sheet on a solid flat pure magenta background (#FF00FF), no gradient, no ground, no cast shadows on the background.
The objects stand in ONE horizontal row from left to right, with wide empty magenta gaps between them;
each object is complete, not touching another object or the image edge. Viewed from a top-down 3/4 RPG angle. Landscape 3:2.
Two objects: 1) a cheerful harbor townhouse with whitewashed walls, a bright blue tiled roof, blue wooden shutters, a rope and small anchor plaque by the front door at the bottom center, 2) the same house with a terracotta orange roof and green shutters.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 18. `art/지도/terracore/물건/houses.png` (3:2)
```
Game sprite sheet on a solid flat pure magenta background (#FF00FF), no gradient, no ground, no cast shadows on the background.
The objects stand in ONE horizontal row from left to right, with wide empty magenta gaps between them;
each object is complete, not touching another object or the image edge. Viewed from a top-down 3/4 RPG angle. Landscape 3:2.
Two objects: 1) a compact industrial worker house of soot-stained red brick with a riveted iron roof, a small copper pipe and vent on the side, a metal-framed front door at the bottom center, 2) the same house with grey brick walls and a corrugated steel roof.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```


## 6. 이동석·간판·기억의 탑

### 19. `art/지도/common/물건/warpStones.png` (3:2)
```
Game sprite sheet on a solid flat pure magenta background (#FF00FF), no gradient, no ground, no cast shadows on the background.
The objects stand in ONE horizontal row from left to right, with wide empty magenta gaps between them;
each object is complete, not touching another object or the image edge. Viewed from a top-down 3/4 RPG angle. Landscape 3:2.
Two objects: 1) a magical teleport waystone: a waist-high pillar of smooth pale stone on a round carved base, a floating glowing blue crystal hovering above it, thin blue rune lines on the pillar, 2) the same waystone dormant: the crystal resting dark and grey on top, runes unlit.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 20. `art/지도/common/물건/shopSigns.png` (3:2)
```
Game sprite sheet on a solid flat pure magenta background (#FF00FF), no gradient, no ground, no cast shadows on the background.
The objects stand in ONE horizontal row from left to right, with wide empty magenta gaps between them;
each object is complete, not touching another object or the image edge. Viewed from a top-down 3/4 RPG angle. Landscape 3:2.
Six objects: small hanging wooden shop signboards on short iron brackets, each painted with one simple symbol: 1) a sword, 2) a shield, 3) a red potion bottle, 4) a coin pouch, 5) a smith hammer, 6) a bed with a moon. Same size and wood style.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 21. `art/지도/common/물건/towerMemory.png` (3:2 · 초록 배경)
```
Game sprite sheet on a solid flat pure green background (#00FF00), no gradient, no ground, no cast shadows on the background.
The objects stand in ONE horizontal row from left to right, with wide empty green gaps between them;
each object is complete, not touching another object or the image edge. Viewed from a top-down 3/4 RPG angle. Landscape 3:2.
One object: a tall slender ancient stone tower of pale blue-grey stone, spiraling carved bands, a glowing violet window near the top, a grand arched door at the bottom center, floating rune stones circling the upper part.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```


## 7. 거리 소품

### 22. `art/지도/common/물건/market.png` (3:2 · 초록 배경)
```
Game sprite sheet on a solid flat pure green background (#00FF00), no gradient, no ground, no cast shadows on the background.
The objects stand in ONE horizontal row from left to right, with wide empty green gaps between them;
each object is complete, not touching another object or the image edge. Viewed from a top-down 3/4 RPG angle. Landscape 3:2.
Four objects: market stalls with striped cloth awnings on wooden frames: 1) a fruit stall with apples, grapes and melons in baskets, red-white awning, 2) a fabric stall with folded colorful cloth rolls, purple-white awning, 3) a weapon stall with swords and shields on a rack, green-white awning, 4) a bakery stall with bread loaves and pies, yellow-white awning.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 23. `art/지도/common/물건/townProps.png` (3:2)
```
Game sprite sheet on a solid flat pure magenta background (#FF00FF), no gradient, no ground, no cast shadows on the background.
The objects stand in ONE horizontal row from left to right, with wide empty magenta gaps between them;
each object is complete, not touching another object or the image edge. Viewed from a top-down 3/4 RPG angle. Landscape 3:2.
Four objects: 1) a round stone well with a small wooden roof and a bucket on a rope, 2) a wooden park bench with iron legs, 3) a wooden hand cart loaded with sacks and crates, 4) a wooden notice board with pinned paper notes (blank papers, no writing).
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 24. `art/지도/ascalon/물건/knightStatue.png` (3:2)
```
Game sprite sheet on a solid flat pure magenta background (#FF00FF), no gradient, no ground, no cast shadows on the background.
The objects stand in ONE horizontal row from left to right, with wide empty magenta gaps between them;
each object is complete, not touching another object or the image edge. Viewed from a top-down 3/4 RPG angle. Landscape 3:2.
Two objects: 1) a heroic bronze knight statue raising a sword on a tall stone pedestal, 2) a round stone fountain with a lion head spouting water into a basin.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 25. `art/지도/helios/물건/empireProps.png` (3:2)
```
Game sprite sheet on a solid flat pure magenta background (#FF00FF), no gradient, no ground, no cast shadows on the background.
The objects stand in ONE horizontal row from left to right, with wide empty magenta gaps between them;
each object is complete, not touching another object or the image edge. Viewed from a top-down 3/4 RPG angle. Landscape 3:2.
Four objects: 1) a gilded lamp post with a sun-shaped lantern, 2) a large terracotta planter with a small palm, 3) a gold-trimmed imperial carriage without horses, 4) a low marble bench with gold feet.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 26. `art/지도/silber/물건/fortProps.png` (3:2)
```
Game sprite sheet on a solid flat pure magenta background (#FF00FF), no gradient, no ground, no cast shadows on the background.
The objects stand in ONE horizontal row from left to right, with wide empty magenta gaps between them;
each object is complete, not touching another object or the image edge. Viewed from a top-down 3/4 RPG angle. Landscape 3:2.
Four objects: 1) a stacked firewood pile with snow on top, 2) a supply sled with crates under a tarp, 3) an alarm bell hanging from a wooden frame, 4) an archery target on a stand with arrows stuck in it.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```


## 8. 던전 바닥·벽 (기본 + 보스 27) · 기둥·구덩이·안쪽 벽

### 27. `art/던전/base/floor.png` (1:1)
```
Seamless tileable ground texture, viewed straight from above (flat, no perspective, no horizon),
the pattern fills the whole square image edge to edge, evenly spread, no single big focal object,
no cast shadows from outside objects, no border or vignette. Square 1:1.
Plain dungeon floor of worn grey stone tiles with thin dark grout.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 28. `art/던전/base/wall.png` (3:1)
```
Seamless horizontally tileable dungeon room wall strip, seen straight from the front, the wall face fills the image edge to edge,
a lighter top edge along the top, no floor, no doors, no torches, no cast shadows, no border. Wide 3:1.
Grey dungeon stone brick wall.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 29. `art/던전/hulk/floor.png` (1:1)
```
Seamless tileable ground texture, viewed straight from above (flat, no perspective, no horizon),
the pattern fills the whole square image edge to edge, evenly spread, no single big focal object,
no cast shadows from outside objects, no border or vignette. Square 1:1.
Furnace factory floor of riveted dark iron plates with tiny glowing embers.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 30. `art/던전/hulk/wall.png` (3:1)
```
Seamless horizontally tileable dungeon room wall strip, seen straight from the front, the wall face fills the image edge to edge,
a lighter top edge along the top, no floor, no doors, no torches, no cast shadows, no border. Wide 3:1.
Dark iron plate wall with rivets and a hot orange seam.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 31. `art/던전/knight/floor.png` (1:1)
```
Seamless tileable ground texture, viewed straight from above (flat, no perspective, no horizon),
the pattern fills the whole square image edge to edge, evenly spread, no single big focal object,
no cast shadows from outside objects, no border or vignette. Square 1:1.
Castle hall floor of cracked grey flagstones with small torn red banner scraps.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 32. `art/던전/knight/wall.png` (3:1)
```
Seamless horizontally tileable dungeon room wall strip, seen straight from the front, the wall face fills the image edge to edge,
a lighter top edge along the top, no floor, no doors, no torches, no cast shadows, no border. Wide 3:1.
Dark castle stone wall with a faded red banner stripe.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 33. `art/던전/archer/floor.png` (1:1)
```
Seamless tileable ground texture, viewed straight from above (flat, no perspective, no horizon),
the pattern fills the whole square image edge to edge, evenly spread, no single big focal object,
no cast shadows from outside objects, no border or vignette. Square 1:1.
Forest floor of short grass and scattered fallen leaves on dark earth.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 34. `art/던전/archer/wall.png` (3:1)
```
Seamless horizontally tileable dungeon room wall strip, seen straight from the front, the wall face fills the image edge to edge,
a lighter top edge along the top, no floor, no doors, no torches, no cast shadows, no border. Wide 3:1.
Wall of dense tree trunks and bushes.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 35. `art/던전/brood/floor.png` (1:1)
```
Seamless tileable ground texture, viewed straight from above (flat, no perspective, no horizon),
the pattern fills the whole square image edge to edge, evenly spread, no single big focal object,
no cast shadows from outside objects, no border or vignette. Square 1:1.
Red sticky nest floor with small pale eggs and slime patches.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 36. `art/던전/brood/wall.png` (3:1)
```
Seamless horizontally tileable dungeon room wall strip, seen straight from the front, the wall face fills the image edge to edge,
a lighter top edge along the top, no floor, no doors, no torches, no cast shadows, no border. Wide 3:1.
Organic red nest wall with ribbed tissue.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 37. `art/던전/siren/floor.png` (1:1)
```
Seamless tileable ground texture, viewed straight from above (flat, no perspective, no horizon),
the pattern fills the whole square image edge to edge, evenly spread, no single big focal object,
no cast shadows from outside objects, no border or vignette. Square 1:1.
Underwater sand floor with ripples and tiny bubbles.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 38. `art/던전/siren/wall.png` (3:1)
```
Seamless horizontally tileable dungeon room wall strip, seen straight from the front, the wall face fills the image edge to edge,
a lighter top edge along the top, no floor, no doors, no torches, no cast shadows, no border. Wide 3:1.
Blue coral reef wall.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 39. `art/던전/centaur/floor.png` (1:1)
```
Seamless tileable ground texture, viewed straight from above (flat, no perspective, no horizon),
the pattern fills the whole square image edge to edge, evenly spread, no single big focal object,
no cast shadows from outside objects, no border or vignette. Square 1:1.
Open grassland floor with dirt patches.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 40. `art/던전/centaur/wall.png` (3:1)
```
Seamless horizontally tileable dungeon room wall strip, seen straight from the front, the wall face fills the image edge to edge,
a lighter top edge along the top, no floor, no doors, no torches, no cast shadows, no border. Wide 3:1.
Low earthen bank wall with grass on top.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 41. `art/던전/plant/floor.png` (1:1)
```
Seamless tileable ground texture, viewed straight from above (flat, no perspective, no horizon),
the pattern fills the whole square image edge to edge, evenly spread, no single big focal object,
no cast shadows from outside objects, no border or vignette. Square 1:1.
Jungle floor with creeping vines and small flowers.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 42. `art/던전/plant/wall.png` (3:1)
```
Seamless horizontally tileable dungeon room wall strip, seen straight from the front, the wall face fills the image edge to edge,
a lighter top edge along the top, no floor, no doors, no torches, no cast shadows, no border. Wide 3:1.
Thick jungle vine wall.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 43. `art/던전/seer/floor.png` (1:1)
```
Seamless tileable ground texture, viewed straight from above (flat, no perspective, no horizon),
the pattern fills the whole square image edge to edge, evenly spread, no single big focal object,
no cast shadows from outside objects, no border or vignette. Square 1:1.
Void floor of dark violet stone with tiny star sparkles.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 44. `art/던전/seer/wall.png` (3:1)
```
Seamless horizontally tileable dungeon room wall strip, seen straight from the front, the wall face fills the image edge to edge,
a lighter top edge along the top, no floor, no doors, no torches, no cast shadows, no border. Wide 3:1.
Dark void wall with faint star specks.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 45. `art/던전/reaper/floor.png` (1:1)
```
Seamless tileable ground texture, viewed straight from above (flat, no perspective, no horizon),
the pattern fills the whole square image edge to edge, evenly spread, no single big focal object,
no cast shadows from outside objects, no border or vignette. Square 1:1.
Graveyard floor of cracked dark stone with small bones.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 46. `art/던전/reaper/wall.png` (3:1)
```
Seamless horizontally tileable dungeon room wall strip, seen straight from the front, the wall face fills the image edge to edge,
a lighter top edge along the top, no floor, no doors, no torches, no cast shadows, no border. Wide 3:1.
Old graveyard stone wall with cracks.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 47. `art/던전/swordgod/floor.png` (1:1)
```
Seamless tileable ground texture, viewed straight from above (flat, no perspective, no horizon),
the pattern fills the whole square image edge to edge, evenly spread, no single big focal object,
no cast shadows from outside objects, no border or vignette. Square 1:1.
Dojo floor of polished wooden planks with a few cherry petals.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 48. `art/던전/swordgod/wall.png` (3:1)
```
Seamless horizontally tileable dungeon room wall strip, seen straight from the front, the wall face fills the image edge to edge,
a lighter top edge along the top, no floor, no doors, no torches, no cast shadows, no border. Wide 3:1.
Dojo wall of wooden posts and paper panels.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 49. `art/던전/archangel/floor.png` (1:1)
```
Seamless tileable ground texture, viewed straight from above (flat, no perspective, no horizon),
the pattern fills the whole square image edge to edge, evenly spread, no single big focal object,
no cast shadows from outside objects, no border or vignette. Square 1:1.
Temple floor of white marble with gold inlay and small feathers.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 50. `art/던전/archangel/wall.png` (3:1)
```
Seamless horizontally tileable dungeon room wall strip, seen straight from the front, the wall face fills the image edge to edge,
a lighter top edge along the top, no floor, no doors, no torches, no cast shadows, no border. Wide 3:1.
White marble temple wall with gold trim.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 51. `art/던전/toad/floor.png` (1:1)
```
Seamless tileable ground texture, viewed straight from above (flat, no perspective, no horizon),
the pattern fills the whole square image edge to edge, evenly spread, no single big focal object,
no cast shadows from outside objects, no border or vignette. Square 1:1.
Swamp floor of muddy green ground with lily leaves and drops.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 52. `art/던전/toad/wall.png` (3:1)
```
Seamless horizontally tileable dungeon room wall strip, seen straight from the front, the wall face fills the image edge to edge,
a lighter top edge along the top, no floor, no doors, no torches, no cast shadows, no border. Wide 3:1.
Swamp bank wall of mud and reeds.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 53. `art/던전/salamander/floor.png` (1:1)
```
Seamless tileable ground texture, viewed straight from above (flat, no perspective, no horizon),
the pattern fills the whole square image edge to edge, evenly spread, no single big focal object,
no cast shadows from outside objects, no border or vignette. Square 1:1.
Volcanic cave floor of dark rock with glowing cracks and embers.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 54. `art/던전/salamander/wall.png` (3:1)
```
Seamless horizontally tileable dungeon room wall strip, seen straight from the front, the wall face fills the image edge to edge,
a lighter top edge along the top, no floor, no doors, no torches, no cast shadows, no border. Wide 3:1.
Volcanic rock wall with red glow in cracks.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 55. `art/던전/jelly/floor.png` (1:1)
```
Seamless tileable ground texture, viewed straight from above (flat, no perspective, no horizon),
the pattern fills the whole square image edge to edge, evenly spread, no single big focal object,
no cast shadows from outside objects, no border or vignette. Square 1:1.
Coral reef shore floor of pale sand, shells and water drops.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 56. `art/던전/jelly/wall.png` (3:1)
```
Seamless horizontally tileable dungeon room wall strip, seen straight from the front, the wall face fills the image edge to edge,
a lighter top edge along the top, no floor, no doors, no torches, no cast shadows, no border. Wide 3:1.
Pastel coral wall.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 57. `art/던전/gatekeeper/floor.png` (1:1)
```
Seamless tileable ground texture, viewed straight from above (flat, no perspective, no horizon),
the pattern fills the whole square image edge to edge, evenly spread, no single big focal object,
no cast shadows from outside objects, no border or vignette. Square 1:1.
Black stone floor with red glowing fissures and embers.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 58. `art/던전/gatekeeper/wall.png` (3:1)
```
Seamless horizontally tileable dungeon room wall strip, seen straight from the front, the wall face fills the image edge to edge,
a lighter top edge along the top, no floor, no doors, no torches, no cast shadows, no border. Wide 3:1.
Black hell stone wall with red cracks.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 59. `art/던전/twinlu/floor.png` (1:1)
```
Seamless tileable ground texture, viewed straight from above (flat, no perspective, no horizon),
the pattern fills the whole square image edge to edge, evenly spread, no single big focal object,
no cast shadows from outside objects, no border or vignette. Square 1:1.
Red theater floor with blood drops and broken mirror glints.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 60. `art/던전/twinlu/wall.png` (3:1)
```
Seamless horizontally tileable dungeon room wall strip, seen straight from the front, the wall face fills the image edge to edge,
a lighter top edge along the top, no floor, no doors, no torches, no cast shadows, no border. Wide 3:1.
Red velvet theater wall with gold trim.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 61. `art/던전/mooneater/floor.png` (1:1)
```
Seamless tileable ground texture, viewed straight from above (flat, no perspective, no horizon),
the pattern fills the whole square image edge to edge, evenly spread, no single big focal object,
no cast shadows from outside objects, no border or vignette. Square 1:1.
Dark night floor with faint pale moonlight patterns.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 62. `art/던전/mooneater/wall.png` (3:1)
```
Seamless horizontally tileable dungeon room wall strip, seen straight from the front, the wall face fills the image edge to edge,
a lighter top edge along the top, no floor, no doors, no torches, no cast shadows, no border. Wide 3:1.
Dark stone wall with crescent moon carvings.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 63. `art/던전/cerberus/floor.png` (1:1)
```
Seamless tileable ground texture, viewed straight from above (flat, no perspective, no horizon),
the pattern fills the whole square image edge to edge, evenly spread, no single big focal object,
no cast shadows from outside objects, no border or vignette. Square 1:1.
Hellfire floor of dark red basalt with glowing cracks.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 64. `art/던전/cerberus/wall.png` (3:1)
```
Seamless horizontally tileable dungeon room wall strip, seen straight from the front, the wall face fills the image edge to edge,
a lighter top edge along the top, no floor, no doors, no torches, no cast shadows, no border. Wide 3:1.
Basalt wall with burning cracks.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 65. `art/던전/leviathan/floor.png` (1:1)
```
Seamless tileable ground texture, viewed straight from above (flat, no perspective, no horizon),
the pattern fills the whole square image edge to edge, evenly spread, no single big focal object,
no cast shadows from outside objects, no border or vignette. Square 1:1.
Deep sea floor of blue stone with drops and shell glints.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 66. `art/던전/leviathan/wall.png` (3:1)
```
Seamless horizontally tileable dungeon room wall strip, seen straight from the front, the wall face fills the image edge to edge,
a lighter top edge along the top, no floor, no doors, no torches, no cast shadows, no border. Wide 3:1.
Deep blue sea rock wall.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 67. `art/던전/asmodeus/floor.png` (1:1)
```
Seamless tileable ground texture, viewed straight from above (flat, no perspective, no horizon),
the pattern fills the whole square image edge to edge, evenly spread, no single big focal object,
no cast shadows from outside objects, no border or vignette. Square 1:1.
Purple demon palace floor of black-violet stone with violet star specks and red cracks.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 68. `art/던전/asmodeus/wall.png` (3:1)
```
Seamless horizontally tileable dungeon room wall strip, seen straight from the front, the wall face fills the image edge to edge,
a lighter top edge along the top, no floor, no doors, no torches, no cast shadows, no border. Wide 3:1.
Black-violet palace wall with gold trim.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 69. `art/던전/captain/floor.png` (1:1)
```
Seamless tileable ground texture, viewed straight from above (flat, no perspective, no horizon),
the pattern fills the whole square image edge to edge, evenly spread, no single big focal object,
no cast shadows from outside objects, no border or vignette. Square 1:1.
Rotting ship deck floor of dark planks with small bones.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 70. `art/던전/captain/wall.png` (3:1)
```
Seamless horizontally tileable dungeon room wall strip, seen straight from the front, the wall face fills the image edge to edge,
a lighter top edge along the top, no floor, no doors, no torches, no cast shadows, no border. Wide 3:1.
Ship hull wall of dark wet planks.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 71. `art/던전/dragon/floor.png` (1:1)
```
Seamless tileable ground texture, viewed straight from above (flat, no perspective, no horizon),
the pattern fills the whole square image edge to edge, evenly spread, no single big focal object,
no cast shadows from outside objects, no border or vignette. Square 1:1.
Lava cave floor of dark rock with glowing embers and cracks.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 72. `art/던전/dragon/wall.png` (3:1)
```
Seamless horizontally tileable dungeon room wall strip, seen straight from the front, the wall face fills the image edge to edge,
a lighter top edge along the top, no floor, no doors, no torches, no cast shadows, no border. Wide 3:1.
Scorched rock wall with lava glow.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 73. `art/던전/godeater/floor.png` (1:1)
```
Seamless tileable ground texture, viewed straight from above (flat, no perspective, no horizon),
the pattern fills the whole square image edge to edge, evenly spread, no single big focal object,
no cast shadows from outside objects, no border or vignette. Square 1:1.
Obsidian hell floor of glossy black-crimson stone.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 74. `art/던전/godeater/wall.png` (3:1)
```
Seamless horizontally tileable dungeon room wall strip, seen straight from the front, the wall face fills the image edge to edge,
a lighter top edge along the top, no floor, no doors, no torches, no cast shadows, no border. Wide 3:1.
Obsidian wall with crimson glow.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 75. `art/던전/plight/floor.png` (1:1)
```
Seamless tileable ground texture, viewed straight from above (flat, no perspective, no horizon),
the pattern fills the whole square image edge to edge, evenly spread, no single big focal object,
no cast shadows from outside objects, no border or vignette. Square 1:1.
Floor split into pale light stone and deep shadow stone.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 76. `art/던전/plight/wall.png` (3:1)
```
Seamless horizontally tileable dungeon room wall strip, seen straight from the front, the wall face fills the image edge to edge,
a lighter top edge along the top, no floor, no doors, no torches, no cast shadows, no border. Wide 3:1.
Wall half pale light and half dark shadow.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 77. `art/던전/umbra/floor.png` (1:1)
```
Seamless tileable ground texture, viewed straight from above (flat, no perspective, no horizon),
the pattern fills the whole square image edge to edge, evenly spread, no single big focal object,
no cast shadows from outside objects, no border or vignette. Square 1:1.
Desert ruin floor of sand with small bones.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 78. `art/던전/umbra/wall.png` (3:1)
```
Seamless horizontally tileable dungeon room wall strip, seen straight from the front, the wall face fills the image edge to edge,
a lighter top edge along the top, no floor, no doors, no torches, no cast shadows, no border. Wide 3:1.
Sandstone ruin wall.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 79. `art/던전/demigod/floor.png` (1:1)
```
Seamless tileable ground texture, viewed straight from above (flat, no perspective, no horizon),
the pattern fills the whole square image edge to edge, evenly spread, no single big focal object,
no cast shadows from outside objects, no border or vignette. Square 1:1.
Mountain path floor of rough rock with moss and gold specks.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 80. `art/던전/demigod/wall.png` (3:1)
```
Seamless horizontally tileable dungeon room wall strip, seen straight from the front, the wall face fills the image edge to edge,
a lighter top edge along the top, no floor, no doors, no torches, no cast shadows, no border. Wide 3:1.
Rocky mountain cliff wall.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 81. `art/던전/sage/floor.png` (1:1)
```
Seamless tileable ground texture, viewed straight from above (flat, no perspective, no horizon),
the pattern fills the whole square image edge to edge, evenly spread, no single big focal object,
no cast shadows from outside objects, no border or vignette. Square 1:1.
Golden temple floor above the clouds with petals and feathers.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 82. `art/던전/sage/wall.png` (3:1)
```
Seamless horizontally tileable dungeon room wall strip, seen straight from the front, the wall face fills the image edge to edge,
a lighter top edge along the top, no floor, no doors, no torches, no cast shadows, no border. Wide 3:1.
Golden cloud temple wall.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 83. `art/던전/base/props.png` (3:2)
```
Game sprite sheet on a solid flat pure magenta background (#FF00FF), no gradient, no ground, no cast shadows on the background.
The objects stand in ONE horizontal row from left to right, with wide empty magenta gaps between them;
each object is complete, not touching another object or the image edge. Viewed from a top-down 3/4 RPG angle. Landscape 3:2.
Three objects: 1) a square stone pillar seen from a top-down 3/4 view, 2) a square pit hole in the floor seen from above with dark depth inside and a crumbling rim, 3) a short straight inner wall block one tile wide. Material: plain grey dungeon stone.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```


## 9. 쉼터·보물 상자·출구·단련 기구·대장간

### 84. `art/던전/common/roomFeatures.png` (3:2 · 초록 배경)
```
Game sprite sheet on a solid flat pure green background (#00FF00), no gradient, no ground, no cast shadows on the background.
The objects stand in ONE horizontal row from left to right, with wide empty green gaps between them;
each object is complete, not touching another object or the image edge. Viewed from a top-down 3/4 RPG angle. Landscape 3:2.
Five objects: 1) a small healing spring fountain of stone with glowing pink water, 2) a wooden treasure chest with gold bands (closed), 3) the same chest open with gold light, 4) a merchant's round woven floor rug with goods placed on it, 5) a white marble goddess statue with folded hands.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 85. `art/던전/common/roomDoors.png` (3:2)
```
Game sprite sheet on a solid flat pure magenta background (#FF00FF), no gradient, no ground, no cast shadows on the background.
The objects stand in ONE horizontal row from left to right, with wide empty magenta gaps between them;
each object is complete, not touching another object or the image edge. Viewed from a top-down 3/4 RPG angle. Landscape 3:2.
Five objects: 1) a dungeon exit doorway arch in a stone wall with a dark opening, 2) the same arch with glowing blue light inside, 3) a stone staircase going down into darkness, 4) a stone staircase going up with light at the top, 5) an entrance floor mat of worn stone with a small arrow carving.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 86. `art/던전/common/gymGear.png` (3:2)
```
Game sprite sheet on a solid flat pure magenta background (#FF00FF), no gradient, no ground, no cast shadows on the background.
The objects stand in ONE horizontal row from left to right, with wide empty magenta gaps between them;
each object is complete, not touching another object or the image edge. Viewed from a top-down 3/4 RPG angle. Landscape 3:2.
Three objects: 1) a hanging leather punching bag on a chain from a metal stand, 2) a lat pulldown machine with a tall frame, top pulley, bar and weight stack, 3) a bench press with a barbell holding weight plates.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```

### 87. `art/던전/common/forgeRoom.png` (3:2)
```
Game sprite sheet on a solid flat pure magenta background (#FF00FF), no gradient, no ground, no cast shadows on the background.
The objects stand in ONE horizontal row from left to right, with wide empty magenta gaps between them;
each object is complete, not touching another object or the image edge. Viewed from a top-down 3/4 RPG angle. Landscape 3:2.
Four objects: 1) a stone forge furnace with a chimney and roaring fire, 2) a wall rack of blacksmith tools (hammers, tongs), 3) a heavy iron anvil on a stump, 4) a rack of finished swords.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```


## 10. 광야의 새벽 아이템

### 88. `art/광야/swarmItems.png` (3:2 · 초록 배경)
```
Game sprite sheet on a solid flat pure green background (#00FF00), no gradient, no ground, no cast shadows on the background.
The objects stand in ONE horizontal row from left to right, with wide empty green gaps between them;
each object is complete, not touching another object or the image edge. Viewed from a top-down 3/4 RPG angle. Landscape 3:2.
Seven objects: 1) a wooden supply crate, 2) a small glowing blue experience gem, 3) a roasted meat on the bone, 4) a red-blue horseshoe magnet, 5) a round black bomb with a lit fuse, 6) a gold coin, 7) a golden treasure chest.
Style: high-quality 2D pixel art for a cozy fantasy RPG seen from a top-down 3/4 view, matching cute chibi anime pixel characters.
Crisp clean pixels (about 4-pixel-wide pixel blocks), soft top-left lighting, rich but gentle colors, dark outlines only on objects.
Original design, not resembling any existing game. No text, no letters, no UI, no watermark, no frame.
No cast shadows and no directional lighting baked in (lighting is added in-game).
```
