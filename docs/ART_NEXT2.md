# 다음에 만들 그림 2 — 게임 안 (2026-11-15)

> `docs/ART_NEXT.md` 다음 차례. 지금 게임 안에서 **코드로 그린 것**을 그림으로 바꾸는 목록
> 붙여 넣을 프롬프트 = `ART_NEXT.md` 0장 앞 문장(A 땅 결 · B 물건 · B🟩 초록 배경 · E 벽 띠) + 표 프롬프트 + D 공통 끝 문장
> 🟩 = 배경을 초록 #00FF00로 (분홍·보라·마젠타 색 물건)
> 이미 그림인 것(캐릭터·스킨·보스·몬스터·선택 일러스트·새 방 소품·레이드 장신구)은 뺌 · 계속 움직이는 것(진흙·용암·물 지형, 공격 효과·예고)과 SVG로 이미 선명한 것(훈장·트럼프 카드)은 코드로 둠

---

## 1. 던전 방 바닥·벽·장애물 ★★★ — `art/던전/{테마}/`

매 판 화면 대부분을 차지함. 테마마다 3장: `floor.png`(A, 1:1) · `wall.png`(E, 3:1 — 방 테두리 벽 앞면) · `props.png`(B)
`props.png`는 모든 테마가 같은 순서: `Three objects: 1) a square stone pillar seen from a top-down 3/4 view, 2) a square pit hole in the floor seen from above with dark depth inside and a crumbling rim, 3) a short straight inner wall block one tile wide.` 앞에 테마 재질 한 줄(아래 표 '재질')을 붙임.

### 던전 벽 앞 문장 (E 대신 이것)
```
Seamless horizontally tileable dungeon room wall strip, seen straight from the front, the wall face fills the image edge to edge,
a lighter top edge along the top, no floor, no doors, no torches, no cast shadows, no border. Wide 3:1.
```

| 테마 (보스) | `floor.png` | `wall.png` | `props` 재질 |
| --- | --- | --- | --- |
| `base` 기본 | `Plain dungeon floor of worn grey stone tiles with thin dark grout.` | `Grey dungeon stone brick wall.` | `Material: plain grey dungeon stone.` |
| `hulk` 강철 거구 | `Furnace factory floor of riveted dark iron plates with tiny glowing embers.` | `Dark iron plate wall with rivets and a hot orange seam.` | `Material: riveted dark iron.` |
| `knight` 검은 기사 | `Castle hall floor of cracked grey flagstones with small torn red banner scraps.` | `Dark castle stone wall with a faded red banner stripe.` | `Material: dark castle stone.` |
| `archer` 얍삽한 활잡이 | `Forest floor of short grass and scattered fallen leaves on dark earth.` | `Wall of dense tree trunks and bushes.` | `Material: mossy wood and tree stumps.` |
| `brood` 무리 여왕 | `Red sticky nest floor with small pale eggs and slime patches.` | `Organic red nest wall with ribbed tissue.` | `Material: red organic nest matter.` |
| `siren` 세이렌 | `Underwater sand floor with ripples and tiny bubbles.` | `Blue coral reef wall.` | `Material: blue coral rock (the pit is deep water).` |
| `centaur` 켄타우로스 | `Open grassland floor with dirt patches.` | `Low earthen bank wall with grass on top.` | `Material: earth and grass.` |
| `plant` 하드플랜트 | `Jungle floor with creeping vines and small flowers.` | `Thick jungle vine wall.` | `Material: vine-wrapped wood.` |
| `seer` 공허의 눈 | `Void floor of dark violet stone with tiny star sparkles.` | `Dark void wall with faint star specks.` | `Material: dark violet void stone.` |
| `reaper` 데스 | `Graveyard floor of cracked dark stone with small bones.` | `Old graveyard stone wall with cracks.` | `Material: cracked grave stone.` |
| `swordgod` 검신 | `Dojo floor of polished wooden planks with a few cherry petals.` | `Dojo wall of wooden posts and paper panels.` | `Material: polished dark wood.` |
| `archangel` 천사장 | `Temple floor of white marble with gold inlay and small feathers.` | `White marble temple wall with gold trim.` | `Material: white marble with gold.` |
| `toad` 늪의 두꺼비 왕 | `Swamp floor of muddy green ground with lily leaves and drops.` | `Swamp bank wall of mud and reeds.` | `Material: swamp mud and roots (the pit is murky water).` |
| `salamander` 불도롱뇽 | `Volcanic cave floor of dark rock with glowing cracks and embers.` | `Volcanic rock wall with red glow in cracks.` | `Material: volcanic rock.` |
| `jelly` 번개 해파리 | `Coral reef shore floor of pale sand, shells and water drops.` | `Pastel coral wall.` | `Material: pastel coral.` |
| `gatekeeper` 지옥문 수문장 | `Black stone floor with red glowing fissures and embers.` | `Black hell stone wall with red cracks.` | `Material: black hell stone.` |
| `twinlu` 피로 이어진 쌍둥이 | `Red theater floor with blood drops and broken mirror glints.` | `Red velvet theater wall with gold trim.` | `Material: red lacquered wood and mirror shards.` |
| `mooneater` 달을 삼키는 자 | `Dark night floor with faint pale moonlight patterns.` | `Dark stone wall with crescent moon carvings.` | `Material: dark moon-carved stone.` |
| `cerberus` 켈베로스 | `Hellfire floor of dark red basalt with glowing cracks.` | `Basalt wall with burning cracks.` | `Material: dark red basalt.` |
| `leviathan` 레비아탄 | `Deep sea floor of blue stone with drops and shell glints.` | `Deep blue sea rock wall.` | `Material: deep blue sea rock.` |
| `asmodeus` 아스모데우스의 화신체 | `Purple demon palace floor of black-violet stone with violet star specks and red cracks.` | `Black-violet palace wall with gold trim.` | `Material: black-violet palace stone.` |
| `captain` 유령선 선장 | `Rotting ship deck floor of dark planks with small bones.` | `Ship hull wall of dark wet planks.` | `Material: rotten ship wood.` |
| `dragon` 멸망의 용 | `Lava cave floor of dark rock with glowing embers and cracks.` | `Scorched rock wall with lava glow.` | `Material: scorched rock (the pit glows like lava).` |
| `godeater` 갓이터 | `Obsidian hell floor of glossy black-crimson stone.` | `Obsidian wall with crimson glow.` | `Material: glossy obsidian.` |
| `plight` 태초의 빛과 어둠 | `Floor split into pale light stone and deep shadow stone.` | `Wall half pale light and half dark shadow.` | `Material: pale light stone.` |
| `umbra` 검은 잔영 | `Desert ruin floor of sand with small bones.` | `Sandstone ruin wall.` | `Material: sandstone.` |
| `demigod` 괴력난신 | `Mountain path floor of rough rock with moss and gold specks.` | `Rocky mountain cliff wall.` | `Material: mossy mountain rock.` |
| `sage` 제천대성 | `Golden temple floor above the clouds with petals and feathers.` | `Golden cloud temple wall.` | `Material: gold-trimmed cloud temple stone.` |
| `heaven` 천상의 방 | `Pure white marble floor with gold stars and white feathers.` | `Pale lavender marble wall with gold trim.` | `Material: white marble.` |
| `trial` 시련의 방 | `Deep crimson floor with red cracks and embers.` | `Blood-red stone wall.` | `Material: crimson stone.` |
| `devil` 악마의 방 | `Pitch black floor with blood-red cracks.` | `Black wall with crimson veins.` | `Material: black stone with red veins.` |
| `gamble` 도박꾼의 방 | `Dark wooden casino floorboards.` | `Green felt wall with gold trim.` | `Material: dark wood with gold.` |
| `auction` 경매장 | `Dark crimson carpet floor.` | `Gold-trimmed crimson wall.` | `Material: crimson and gold.` |
| `forge` 대장간 | `Soot-stained stone floor with sparks.` | `Dark red brick forge wall.` | `Material: sooty brick.` |

(제단의 방 8성좌는 바닥 색을 코드가 성좌마다 섞으므로 `base`를 씀)

---

## 2. 방 바닥에 놓이는 것 ★★★ — `art/던전/common/` (B)

| 파일 | 프롬프트 |
| --- | --- |
| `roomDoors.png` | `Five objects: 1) a dungeon exit doorway arch in a stone wall with a dark opening, 2) the same arch with glowing blue light inside, 3) a stone staircase going down into darkness, 4) a stone staircase going up with light at the top, 5) an entrance floor mat of worn stone with a small arrow carving.` |
| `roomFeatures.png` 🟩 | `Five objects: 1) a small healing spring fountain of stone with glowing pink water, 2) a wooden treasure chest with gold bands (closed), 3) the same chest open with gold light, 4) a merchant's round woven floor rug with goods placed on it, 5) a white marble goddess statue with folded hands.` |
| `gymGear.png` | `Three objects: 1) a hanging leather punching bag on a chain from a metal stand, 2) a lat pulldown machine with a tall frame, top pulley, bar and weight stack, 3) a bench press with a barbell holding weight plates.` |
| `forgeRoom.png` | `Four objects: 1) a stone forge furnace with a chimney and roaring fire, 2) a wall rack of blacksmith tools (hammers, tongs), 3) a heavy iron anvil on a stump, 4) a rack of finished swords.` |
| `heavenRoom.png` | `Three objects: 1) a floating white and gold gift altar with a glowing box on top, 2) a heavenly shop counter of white marble with gold trim and floating goods, 3) a white marble pillar with a gold top and soft halo.` |
| `raidReward.png` | `Two objects: 1) a huge ornate golden treasure chest with red gems (closed), 2) a tall pillar of golden light on a small rune circle.` |
| `foeProps.png` 🟩 | `Three objects: 1) a small wooden siege fort with a flag and spikes, 2) a cage-like water prison bubble of blue chains, 3) a glowing pale moon shard crystal.` |

---

## 3. 아이템 아이콘 — ⏸ 보류 (2026-11-15 사용자와 정함: 1,066개라 비용·시간이 커서 나중에) · `art/아이콘/{묶음}.png` (지금 16×16 코드 그림)

무기 438 · 패시브 612 · 사용 아이템 16 = 1,066개. **한 장에 5×5 = 25개** (약 43장). 아이템 이름이 많아 프롬프트는 시작할 때 Claude가 게임 자료에서 **캐릭터별로 자동으로 뽑아** `docs/ART_ICONS.md`로 만듦 (아이템 영어 이름 + 짧은 모양 설명).

### 아이콘 앞 문장
```
Game item icon sheet: a 5x5 grid of 25 separate square icons on a solid flat pure magenta background (#FF00FF),
each icon centered in its own equal square cell with empty magenta margin, no frames, no labels, no numbers.
Each icon is one clear object (weapon, charm, potion, etc.), bold readable silhouette, chunky pixel art that still reads at 32x32 pixels.
Square 1:1. Icons in reading order (left to right, top to bottom):
```
+ 1)~25) 아이템 목록 + D 공통 끝 문장

---

## 4. 캐릭터 소환물·도구 ★★ — `art/소환물/{파일}` (B · 하나씩 잘라 씀, 움직임은 코드)

| 파일 | 캐릭터 | 프롬프트 |
| --- | --- | --- |
| `summoner1.png` | 소환술사 | `Five small chibi summoned creatures, each facing right: 1) a skeleton warrior with a rusty sword, 2) a small red imp with tiny wings, 3) a stone golem, 4) a skeleton archer with a bow, 5) a living flame spirit.` |
| `summoner2.png` 🟩 | 소환술사 | `Five small chibi summoned creatures, each facing right: 1) a walking mushroom with a spotted cap, 2) a grey wolf, 3) a tiny glowing fairy with wings, 4) a purple bat, 5) a baby fire drake.` |
| `beastPets.png` | 야수 | `Four objects: 1) a small orange cat, 2) a young lion, 3) a shadowy black cat with glowing eyes, 4) a ball of yarn.` |
| `gunnerKit.png` | 거너 | `Four objects: 1) a small hovering combat drone with one gun, 2) a round grenade, 3) a spare magazine clip, 4) a ghostly floating pistol with blue glow.` |
| `medicKit.png` 🟩 | 의사 | `Five objects: 1) a big syringe, 2) a pill capsule, 3) a gas canister, 4) a first aid kit box, 5) a tiny cute ambulance.` |
| `elementOrbs.png` 🟩 | 원소술사 | `Five objects: 1) a fire orb, 2) a water orb, 3) a lightning orb, 4) a small floating crystal sword, 5) a small golden star.` |
| `pwSummons.png` | 패왕전 소환 | `Six objects: 1) a small automatic turret on a tripod, 2) a small hovering drone, 3) a small cat companion, 4) a small skeleton, 5) a baby dragon, 6) a puppet doll.` |

---

## 5. 광야의 새벽 ★★ — `art/광야/` (B)

| 파일 | 프롬프트 |
| --- | --- |
| `swarmItems.png` 🟩 | `Seven objects: 1) a wooden supply crate, 2) a small glowing blue experience gem, 3) a roasted meat on the bone, 4) a red-blue horseshoe magnet, 5) a round black bomb with a lit fuse, 6) a gold coin, 7) a golden treasure chest.` |
| `swarmMap.png` | `Three objects: 1) a stone missile defense tower with a launcher on top, 2) a small scared child villager waving for help, 3) a wooden barricade.` |
| `swarmGround.png` (A) | `Dry wild plains ground of trampled grass and dusty earth patches.` |

---

## 6. 타워 디펜스 맵 ★ — `art/타워/{테마}/` (테마 8: meadow 초원 · desert 사막 · frost 설원 · swamp 늪 · volcano 화산 · crystal 수정 동굴 · sky 하늘 · abyss 심연)

테마마다 2장: `ground.png`(A, 땅) · `decor.png`(B: 그 테마 꾸밈 넷 + 울타리 하나)

| 테마 | `ground.png` | `decor.png` |
| --- | --- | --- |
| meadow | `Green meadow grass with a few flowers.` | `Five objects: 1) a round leafy tree, 2) a bush, 3) a flower patch, 4) a small rock, 5) a short wooden fence segment.` |
| desert | `Pale desert sand with small ripples.` | `Five objects: 1) a tall cactus, 2) a small cactus, 3) a sandstone rock, 4) a bleached skull, 5) a short adobe wall segment.` |
| frost | `Snowy ground with icy patches.` | `Five objects: 1) a snow-covered pine tree, 2) a small snowy pine, 3) an ice crystal, 4) a snow pile, 5) a short icy log fence segment.` |
| swamp | `Muddy green swamp ground with puddles.` | `Five objects: 1) a cluster of reeds, 2) a dead swamp tree, 3) a lily pad pond, 4) a mossy stump, 5) a short rotten fence segment.` |
| volcano | `Dark volcanic ground with glowing cracks.` | `Five objects: 1) a small lava pool, 2) a jagged black rock, 3) a smoking vent, 4) a charred tree, 5) a short basalt wall segment.` |
| crystal | `Dark cave floor with tiny glowing crystal shards.` | `Five objects: 1) a large glowing blue crystal cluster, 2) a small pink crystal, 3) a cave rock, 4) a glowing mushroom, 5) a short crystal fence segment.` |
| sky | `Floating sky island grass with soft clouds at the edges.` | `Five objects: 1) a fluffy cloud, 2) a white marble pillar, 3) a small floating rock, 4) a golden lamp, 5) a short white railing segment.` |
| abyss | `Dark abyss stone with violet glowing runes.` | `Five objects: 1) a dark violet crystal spike, 2) a broken stone pillar, 3) a floating rune stone, 4) a shadow tentacle sprout, 5) a short dark iron fence segment.` |

---

## 7. 그 밖에 (있으면 좋음) ★

| 파일 | 지금 | 프롬프트 |
| --- | --- | --- |
| `hidden/trialStructs.png` | 숨은 시련 구조물 (코드) | `Three objects: 1) a high orc village wooden palisade wall segment with spikes, 2) a poison gas sprayer machine with green tanks, 3) a small pirate ship front.` |
| `raid/lucDecor.png` | 레이드 루시퍼 방 꾸밈 (코드) | `Four objects: 1) a black iron brazier with violet fire, 2) a torn dark banner on a pole, 3) a broken black obsidian pillar, 4) a ritual circle floor stone with glowing runes.` |
| `league/teamMarks1.png`·`teamMarks2.png` | 월드 워 리그 팀 마크 16 (8×8 코드 픽셀) | `Eight objects: round sports team emblems with simple animal symbols, no text: 1) a moonlit owl, 2) a thunder shark, 3) ...` (Claude가 팀 이름 16개를 영어로 채워 줌) |
| `aug/augCards.png` | 패왕전 증강 카드 그림 14 (16×16 코드) | Claude가 증강 이름 14개를 영어로 채워 줌 · 아이콘 앞 문장(5×5 대신 4×4) |
| `minigame/candyRune.png` 🟩 | 로비 미니게임 별사탕·룬 블록 (코드) | `Eight objects: 1-5) star-shaped candies in red, yellow, green, blue and purple, 6-8) square stone blocks carved with glowing runes in cyan, pink and gold.` |
| `minigame/slotIcons.png` 🟩 | 슬롯 릴 그림 (코드) | `Six objects: slot machine reel symbols: 1) a pair of cherries, 2) a lemon, 3) a bell, 4) a bar block (blank, no text), 5) a diamond, 6) a lucky seven shape made of gold (no digits, just a gold emblem).` |

---

## 몇 장인지

| 묶음 | 장 |
| --- | --- |
| 던전 방 (34 테마 × 3) | 102 |
| 방 바닥에 놓이는 것 | 7 |
| ~~아이템 아이콘~~ (보류) | 0 |
| 소환물·도구 | 7 |
| 광야의 새벽 | 3 |
| 타워 디펜스 (8 × 2) | 16 |
| 그 밖에 | 7 |
| **합계** | **약 142** |

추천 순서: 던전 `base` 3장으로 화풍 맞추기 → 자주 보는 시즌 1 보스 테마 → 방 바닥 물건 → 나머지
**넣는 코드**: 던전 바닥·벽·장애물, 아이콘, 광야·타워 디펜스는 지금 코드 그림을 그림으로 바꾸는 받는 코드가 필요함 (그림이 오는 순서대로 Claude가 만듦)
