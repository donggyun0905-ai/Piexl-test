# 시즌 스킨 그림 (일러스트 + 스프라이트 시트 프롬프트)

> 2026-11-15 작성. **만드는 사람: 사용자** (일러스트는 Higgsfield Nano Banana Pro, 시트는 원본 시트를 참고로 같은 도구) → 받은 PNG를 아래 이름으로 올리면 Claude가 게임에 넣음
> 대상: 고를 수 있는 91명 (숨은·한정 캐릭터 빼고) · 순서는 캐릭터 선택 창 '전체' 순서

| 시즌 | 컨셉 | 캐릭터 |
| --- | --- | --- |
| 1 | 풍류가 (백호·호랑이) | 파수꾼 ~ 오니 (21명) |
| 2 | 여름 수영복 | 이드라 ~ 방랑객 (21명) |
| 3 | 사이버펑크 | 영사 ~ 라파엘 (21명) |
| 4 | 크리스마스 | 블래스트 ~ 아수라 (21명) |
| 5 | 메이드·바니 | 느아르 ~ 블랑 (7명) |

## 쓰는 법

- **일러스트** (16:9 · 2k): 참고 그림 1번 = `art/선택일러스트/{이름}.png`, 2번 = 원본 시트. 프롬프트 = **[공통 일러스트]** + 그 시즌의 **[시즌 일러스트]** + 캐릭터 줄
  - 이번에는 흰 상징 배경이 아니라 **스킨에 맞는 배경(장면)을 깔아 줌**
- **스프라이트 시트** (원본 시트와 같은 비율): 참고 그림 = 원본 시트 하나. 프롬프트 = **[공통 시트]** + **[시즌 시트]** + 캐릭터 줄
- 올릴 곳: `art/스킨/S{시즌}/{이름}-일러.png` · `art/스킨/S{시즌}/{이름}-시트.png` (예: `art/스킨/S1/파수꾼-일러.png`)
- 캐릭터 줄의 영어 문장 하나를 일러스트·시트 둘 다에 그대로 씀
- 게임에 넣기 (Claude): `scripts/art/season_skins.py`의 `IDS`에 이름 → id 추가 후 `cd scripts/art && python3 season_skins.py` → 시트는 `skins/{id}_{테마}.png`(4×5, 칸 규칙은 기본 캐릭터 것), 일러스트는 `charArt/skin/` · 그리기 표 `game/spriteSheets.ts`의 `V2_SKINS`에도 추가 · 시즌 1 = 테마 `tiger`(범 풍류) · 2026-11-15 시즌 1 첫 8명(파수꾼~의사) 넣음 · 2026-11-16 시즌 1(오니는 일러스트만)·시즌 2(이터 빼고) 전부, 시즌 3 10명(영사~매드퀸) 넣음 · 시즌 2 = 테마 `summer`(여름 파도), 시즌 3 = `cyber`(네온 펄스), 시즌 4 = `noel`(성탄 눈꽃, 없앤 상점 테마 `xmas`와 겹치지 않게), 시즌 5 = `maid`(벨벳 티타임) (시즌 3~5는 그림이 올라온 캐릭터만 생김) · 2026-11-16 시즌 3 나머지 11명·시즌 4 21명·시즌 5 7명 넣음 (전부 들어감, 남은 것: 시즌 1 오니 시트·시즌 2 이터) · 변신 모습은 `FORMS`(풋내기10·15·20 · 버려진 자들2·3 · 학살자_분노 · 오토마타_인형 · 이클립스_밤)

### [공통 일러스트]

```
Reference images: the FIRST image is this exact character's finished illustration (keep the same face, hair color and hairstyle, eye color, gender, skin tone, body type and adult proportions, signature weapon and accessories); the SECOND image is the character's original game sprite sheet (use only to confirm colors and details). Draw this SAME character wearing a new seasonal costume skin described below. The costume replaces the usual outfit, but keeps the character's own color palette and signature items so they are instantly recognizable. Draw the character ONCE (one single figure, unless the line says several). Body: real human look, NOT chibi, NOT super-deformed, small head, about 7 to 7.5 heads tall, long legs (children, animals and creatures keep their natural size). Confident, elegant, dynamic full-body pose that fits the costume. Style: beautiful high-detail pixel art illustration for a game skin showcase, visible crisp pixels, clean dark pixel outlines, rich saturated colors, rim lighting, no blur, no painterly smudge, no photo texture. Background: a full detailed SCENE matching the skin theme (see 'Background' below), with depth, slightly softer and less saturated than the character so the character clearly stands out. Composition: 16:9, the WHOLE character from head to feet (including weapon, wings and tail) is visible and centered, about 75-80% of the image height. Full-bleed, no black bars, no border, no frame, no text, no letters, no logo, no watermark, no signature, no UI. Original design; do not imitate any other game, anime or artist.
```

### [공통 시트]

```
Reference image: this character's ORIGINAL game sprite sheet. Make the EXACT same sprite sheet again: same canvas size and aspect ratio, same grid layout, same number of frames, same directions, poses, animation order and spacing, same chibi proportions, same pixel scale, same outline style and the same plain background color. Change ONLY the outfit and accessories to the seasonal costume described below; keep the face, hair, colors, body shape and the weapon's size and silhouette, so the frames still line up with the original animation. Every frame must wear the same costume consistently. Crisp pixel art, no blur, no anti-aliasing smear, no text, no labels, no frame numbers, no watermark.
```

---

## 시즌 1 — 풍류가 (백호·호랑이)

### [시즌 일러스트]

```
Skin theme: Korean traditional 'pungryu' elegance with a WHITE TIGER theme: refined hanbok-inspired clothing (jeogori, durumagi coats, dangui, wide sleeves, silk sashes, norigae tassels, gat hats where fitting), white tiger fur trims and black-and-white or orange tiger-stripe patterns, peony and pine motifs, ink-wash elegance.
Background: A moonlit traditional Korean pavilion by a lotus pond in a pine mountain valley, soft ink-wash mist, a huge full moon, the faint silhouette of a white tiger in the clouds, paper lanterns, falling peony petals.
```

### [시즌 시트]

```
Skin theme: Korean traditional 'pungryu' elegance with a WHITE TIGER theme: refined hanbok-inspired clothing (jeogori, durumagi coats, dangui, wide sleeves, silk sashes, norigae tassels, gat hats where fitting), white tiger fur trims and black-and-white or orange tiger-stripe patterns, peony and pine motifs, ink-wash elegance.
```

#### 1-1. 파수꾼 (warden) — 백호 장군 갑옷
- 일러스트 참고: `art/선택일러스트/파수꾼.png` · 시트 참고: `art/캐릭터/` 안 `파수꾼/warden-1.png`
```
Skin: White-and-silver lamellar armor with black tiger-stripe trims under a long blue durumagi coat, a black gat-style helmet with a red plume, a white tiger pelt over one shoulder, the greatsword reshaped as a Korean ceremonial blade with a tiger-head guard.
```

#### 1-2. 떠돌이 (drifter) — 떠도는 풍류 시인
- 일러스트 참고: `art/선택일러스트/떠돌이.png` · 시트 참고: `art/캐릭터/` 안 `떠돌이/drifter-1.png`
```
Skin: A teal durumagi coat with tiger-stripe hems, a wide black gat hat, the teal scarf as a long silk sash, the crossbow decorated with a white tiger-tail tassel, a gourd bottle at the waist.
```

#### 1-3. 마법사 (mage) — 궁중 마법 여인
- 일러스트 참고: `art/선택일러스트/마법사.png` · 시트 참고: `art/캐릭터/` 안 `마법사/mage-1.png`
```
Skin: A flowing white and blue dangui hanbok with gold embroidery and a long skirt, a golden binyeo hairpin with white flowers, a tiger-stripe norigae, the star staff topped with a small white tiger head.
```

#### 1-4. 음양사 (mystic) — 큰 무녀
- 일러스트 참고: `art/선택일러스트/음양사.png` · 시트 참고: `art/캐릭터/` 안 `음양사/mystic-1.png`
```
Skin: A white jeogori with a vivid red skirt patterned with black tiger stripes, a crown of paper flowers, small bells, white tiger talisman charms floating around her.
```

#### 1-5. 기계공학자 (engineer) — 조선 발명가
- 일러스트 참고: `art/선택일러스트/기계공학자.png` · 시트 참고: `art/캐릭터/` 안 `기계공학자/engineer-1.png`
```
Skin: A brown hanbok work jacket with rolled sleeves, orange goggles with brass rims, a tiger-stripe tool belt, the laser arm device rebuilt in wood and brass.
```

#### 1-6. 원소술사 (elementalist) — 사계절 술사
- 일러스트 참고: `art/선택일러스트/원소술사.png` · 시트 참고: `art/캐릭터/` 안 `원소술사/elementalist-1.png`
```
Skin: Layered pastel hanbok in four season colors with tiger-stripe trims; the four element orbs hang as glowing norigae beads and orbit her.
```

#### 1-7. 격투가 (brawler) — 택견 무예가
- 일러스트 참고: `art/선택일러스트/격투가.png` · 시트 참고: `art/캐릭터/` 안 `격투가/brawler-1.png`
```
Skin: White baji pants and a short white tiger fur vest, a red sash, tiger-stripe headband and wrist wraps, bare bandaged fists.
```

#### 1-8. 의사 (doctor) — 어의녀
- 일러스트 참고: `art/선택일러스트/의사.png` · 시트 참고: `art/캐릭터/` 안 `의사/doctor-1.png`
```
Skin: A pale green and white uinyeo hanbok with a red knot ornament shaped like a cross, a medicine pouch embroidered with a tiger, acupuncture needles and herb bottles.
```

#### 1-9. 야수 (beast) — 백호 수인
- 일러스트 참고: `art/선택일러스트/야수.png` · 시트 참고: `art/캐릭터/` 안 `야수/beast-1.png`
```
Skin: Her cat ears and tail turn white with black stripes, a short white hanbok jacket with orange ribbons, tiger-paw gloves, a small white tiger cub companion.
```

#### 1-10. 거너 (gunner) — 착호갑사 사냥꾼
- 일러스트 참고: `art/선택일러스트/거너.png` · 시트 참고: `art/캐릭터/` 안 `거너/gunner-1.png`
```
Skin: A black gat with a red band, a dark red cheollik coat, a tiger pelt across the shoulders, twin matchlock pistols.
```

#### 1-11. 닌자 (ninja) — 밤의 자객
- 일러스트 참고: `art/선택일러스트/닌자.png` · 시트 참고: `art/캐릭터/` 안 `닌자/ninja-1.png`
```
Skin: Black and red Joseon-style night garb, a white tiger mask pushed to the side of the head, the long red headband, tiger-claw shuriken.
```

#### 1-12. 시간술사 (chronomancer) — 관상감 천문관
- 일러스트 참고: `art/선택일러스트/시간술사.png` · 시트 참고: `art/캐릭터/` 안 `시간술사/chronomancer-1.png`
```
Skin: A navy and gold official hanbok robe with a cloud collar and a tiger badge on the chest, the hourglass turned into a brass armillary-sphere ornament.
```

#### 1-13. 소환술사 (summoner) — 산신 무녀
- 일러스트 참고: `art/선택일러스트/소환술사.png` · 시트 참고: `art/캐릭터/` 안 `소환술사/summoner-1.png`
```
Skin: A green hanbok with vine embroidery and white tiger stripes on the sleeves, the horn ornaments, a summoned white tiger spirit made of green light.
```

#### 1-14. 풋내기 (novice) — 시골 소년
- 일러스트 참고: `art/선택일러스트/풋내기.png` · 시트 참고: `art/캐릭터/` 안 `풋내기/novice-1.png`
```
Skin: A simple white hanbok with straw sandals and a red sash, a toy white tiger mask on his head, a wooden practice stick.
```

#### 1-15. 베두인 (bedouin) — 비단길 무희
- 일러스트 참고: `art/선택일러스트/베두인.png` · 시트 참고: `art/캐릭터/` 안 `베두인/bedouin-1.png`
```
Skin: A red jeogori with long flowing sleeves and a deep navy skirt with gold tiger stripes, the red head scarf, the golden chakram decorated with silk tassels.
```

#### 1-16. 장수 (general) — 조선 대장군
- 일러스트 참고: `art/선택일러스트/장수.png` · 시트 참고: `art/캐릭터/` 안 `장수/general-1.png`
```
Skin: Black and red studded dujeonggap armor, a helmet with a red tassel, a white tiger pelt cape, a long woldo glaive.
```

#### 1-17. 이무기 (imugi) — 용궁 공주
- 일러스트 참고: `art/선택일러스트/이무기.png` · 시트 참고: `art/캐릭터/` 안 `이무기/imugi-1.png`
```
Skin: A dark teal dangui hanbok with scale-pattern gold embroidery, the golden horn hairpiece, the dragon spear with a white tiger tassel.
```

#### 1-18. 악의 사도 (apostle) — 어둠의 사찰 사제
- 일러스트 참고: `art/선택일러스트/악의 사도.png` · 시트 참고: `art/캐릭터/` 안 `악의 사도/apostle-1.png`
```
Skin: A black and crimson monk-style hanbok robe, prayer beads, a white tiger skull ornament, the inverted cross staff with a tiger-claw tip.
```

#### 1-19. 버려진 자들 (abandoned) — 세 아이의 한복
- 일러스트 참고: `art/선택일러스트/버려진 자들.png` · 시트 참고: `art/캐릭터/` 안 `버려진 자들/abandoned-1.png` · `abandoned2-1.png` · `abandoned3-1.png` (세 장 다 올림)
```
Skin: The three children (draw all three together) in matching black and white hanbok: one with gold light trims, one with purple dark trims, one in between, small tiger masks on their heads.
```

#### 1-20. 거인 (titan) — 장사
- 일러스트 참고: `art/선택일러스트/거인.png` · 시트 참고: `art/캐릭터/` 안 `거인/titan-1.png`
```
Skin: A sleeveless white hanbok vest, red sash and tiger-stripe baji pants; the giant mechanical arm rebuilt in bronze and dark wood with tiger engravings.
```

#### 1-21. 오니 (oni) — 호랑이 도깨비
- 일러스트 참고: `art/선택일러스트/오니.png` · 시트 참고: `art/캐릭터/` 안 `오니/oni-1.png`
```
Skin: Tiger-stripe pants and a tiger pelt, a half-open red jeogori, the spiked club as a traditional dokkaebi club wrapped in tiger fur.
```

---

## 시즌 2 — 여름 수영복

### [시즌 일러스트]

```
Skin theme: SUMMER SWIMWEAR at the beach: stylish swimsuits, bikinis for adult women, swim trunks and open shirts for men, rash guards, pareos, sun hats, sunglasses, floats and beach props, in the character's own colors. Keep it tasteful and game-appropriate: no nudity, no sexualized pose. Characters who look young wear modest swimwear (one-piece with a skirt, rash guard, shorts).
Background: A bright tropical beach on a sunny afternoon: turquoise sea with sparkling waves, white sand, palm trees, a striped beach umbrella and a deck chair, drifting clouds, a few seagulls.
```

### [시즌 시트]

```
Skin theme: SUMMER SWIMWEAR at the beach: stylish swimsuits, bikinis for adult women, swim trunks and open shirts for men, rash guards, pareos, sun hats, sunglasses, floats and beach props, in the character's own colors. Keep it tasteful and game-appropriate: no nudity, no sexualized pose. Characters who look young wear modest swimwear (one-piece with a skirt, rash guard, shorts).
```

#### 2-1. 이드라 (idra) — 세계수 꼬마 물놀이
- 일러스트 참고: `art/선택일러스트/이드라.png` · 시트 참고: `art/캐릭터/` 안 `이드라/idra-1.png`
```
Skin: A modest children's one-piece swimsuit with a leaf-pattern ruffle skirt, a flower-shaped swim ring, a big straw sun hat with a white flower, a toy wooden bucket; still barefoot with the vine anklets.
```

#### 2-2. 변희 (byeonhui) — 야생 서퍼
- 일러스트 참고: `art/선택일러스트/변희.png` · 시트 참고: `art/캐릭터/` 안 `변희/byeonhui-1.png`
```
Skin: A sporty bikini top with tribal beast patterns and board shorts, feather beads in her hair, the beast-tooth necklace, a surfboard carved like a beast jaw.
```

#### 2-3. 플라이 (fly) — 잠자리 수영 선수
- 일러스트 참고: `art/선택일러스트/플라이.png` · 시트 참고: `art/캐릭터/` 안 `플라이/fly-1.png`
```
Skin: A black and sky-blue racing swimsuit with shorts, swim goggles on the head, dragonfly wings sparkling with water droplets.
```

#### 2-4. 장로 (elder) — 바캉스 장로
- 일러스트 참고: `art/선택일러스트/장로.png` · 시트 참고: `art/캐릭터/` 안 `장로/elder-1.png`
```
Skin: A loose green flower-pattern beach shirt, swim trunks and sandals, sunglasses, the white beard, a jade-bead fishing rod instead of the staff.
```

#### 2-5. 렌 (ren) — 바닷돌 소녀
- 일러스트 참고: `art/선택일러스트/렌.png` · 시트 참고: `art/캐릭터/` 안 `렌/ren-1.png`
```
Skin: A green hooded rash guard and shorts, smooth beach pebbles and a small sandcastle floating around her.
```

#### 2-6. 정령사 (spiritist) — 세일러 수영복
- 일러스트 참고: `art/선택일러스트/정령사.png` · 시트 참고: `art/캐릭터/` 안 `정령사/spiritist-1.png`
```
Skin: A modest navy one-piece swimsuit with a white sailor collar and a short skirt, the three little spirits wearing tiny swim rings.
```

#### 2-7. 역병의사 (plague) — 스노클 역병의사
- 일러스트 참고: `art/선택일러스트/역병의사.png` · 시트 참고: `art/캐릭터/` 안 `역병의사/plague-1.png`
```
Skin: The beak mask turned into a snorkel mask with green lenses, a black wetsuit under a long open beach coat, a smoking barbecue-grill censer.
```

#### 2-8. 학살자 (slayer) — 고딕 비치
- 일러스트 참고: `art/선택일러스트/학살자.png` · 시트 참고: `art/캐릭터/` 안 `학살자/slayer-1.png`
```
Skin: A black and crimson gothic bikini with lace and a red rose, a sheer black pareo, a black lace parasol; the giant scythe styled like a beach umbrella pole.
```

#### 2-9. 이터 (eater) — 튜브 낀 그림자
- 일러스트 참고: `art/선택일러스트/이터.png` · 시트 참고: `art/캐릭터/` 안 `이터/eater-1.png`
```
Skin: The shadow monster wearing a red-and-white striped swim ring and star-shaped sunglasses, splashing water, still showing its white fangs in a goofy grin.
```

#### 2-10. 묵인 (mukin) — 수박 깨는 무사
- 일러스트 참고: `art/선택일러스트/묵인.png` · 시트 참고: `art/캐릭터/` 안 `묵인/mukin-1.png`
```
Skin: Dark swim trunks with the red waist cloth, an open short-sleeve shirt, the iron mask, a wooden greatsword for splitting a watermelon.
```

#### 2-11. 사멸 (samyeol) — 보랏빛 리조트
- 일러스트 참고: `art/선택일러스트/사멸.png` · 시트 참고: `art/캐릭터/` 안 `사멸/samyeol-1.png`
```
Skin: A purple halter bikini with jade trims and a high mandarin-collar neck strap, a silk sarong tied at the hip, silver needle hair sticks, a tropical drink with tiny paper umbrellas.
```

#### 2-12. 오토마타 (automata) — 방수 기계 인형
- 일러스트 참고: `art/선택일러스트/오토마타.png` · 시트 참고: `art/캐릭터/` 안 `오토마타/automata-1.png`
```
Skin: A white and navy mechanical one-piece swimsuit with gear ornaments, a sky-blue swim cap with gear ears, glowing waterproof joint seals.
```

#### 2-13. 라이더 (rider) — 제트스키
- 일러스트 참고: `art/선택일러스트/라이더.png` · 시트 참고: `art/캐릭터/` 안 `라이더/rider-1.png`
```
Skin: Board shorts and an open blue racing jacket, goggles on the forehead, riding a blue jet ski that splashes through the waves.
```

#### 2-14. 붐버 (bomber) — 물풍선 폭탄마
- 일러스트 참고: `art/선택일러스트/붐버.png` · 시트 참고: `art/캐릭터/` 안 `붐버/bomber-1.png`
```
Skin: Orange swim trunks, an open khaki shirt, a belt of water balloons, holding a lit firework rocket.
```

#### 2-15. 아티팩터 (artifacter) — 물총 아티팩터
- 일러스트 참고: `art/선택일러스트/아티팩터.png` · 시트 참고: `art/캐릭터/` 안 `아티팩터/artifacter-1.png`
```
Skin: White swim trunks and an open white sleeveless hoodie, glowing blue tattoos, a large blue water pistol.
```

#### 2-16. 펑크 (punk) — 네온 비치
- 일러스트 참고: `art/선택일러스트/펑크.png` · 시트 참고: `art/캐릭터/` 안 `펑크/punk-1.png`
```
Skin: A neon pink and black sporty bikini with a cropped open jacket and short shorts, the chrome arm, a neon water blade.
```

#### 2-17. 수집가 (collector) — 해변 장비 수집가
- 일러스트 참고: `art/선택일러스트/수집가.png` · 시트 참고: `art/캐릭터/` 안 `수집가/푸른 머리 무기 수집가 스프라이트 시트.png`
```
Skin: Blue swim trunks and a white beach cape, a huge bundle of beach gear on his back (umbrella, surfboard, fishing rods, shovels) carried like his weapons.
```

#### 2-18. 추적자 (tracker) — 워터건 저격수
- 일러스트 참고: `art/선택일러스트/추적자.png` · 시트 참고: `art/캐릭터/` 안 `추적자/tracker-1.png`
```
Skin: A khaki sporty bikini with a hooded beach poncho and cargo board shorts, the sniper rifle as a long water gun with a scope.
```

#### 2-19. 잊혀진 자 (forgotten) — 여신의 수영복
- 일러스트 참고: `art/선택일러스트/잊혀진 자.png` · 시트 참고: `art/캐릭터/` 안 `잊혀진 자/forgotten-1.png`
```
Skin: A white and gold goddess bikini with gold laurel straps and gold rings, a sheer flowing white pareo, the golden laurel crown.
```

#### 2-20. 잔영 (remnant) — 그림자 래시가드
- 일러스트 참고: `art/선택일러스트/잔영.png` · 시트 참고: `art/캐릭터/` 안 `잔영/remnant-1.png`
```
Skin: Black swim trunks and a hooded black rash guard, the face mask and purple scarf, twin dagger-shaped popsicles.
```

#### 2-21. 방랑객 (wanderer) — 삿갓 바캉스
- 일러스트 참고: `art/선택일러스트/방랑객.png` · 시트 참고: `art/캐릭터/` 안 `방랑객/wanderer-1.png`
```
Skin: Navy swim trunks and an open indigo beach shirt, the wide straw hat, the red sash, a katana-shaped fishing rod.
```

---

## 시즌 3 — 사이버펑크

### [시즌 일러스트]

```
Skin theme: CYBERPUNK: sleek techwear and armored suits, chrome cybernetic parts, glowing neon LED lines in the character's colors, holographic versions of their halos, crowns and accessories, energy or plasma versions of their weapons.
Background: A rainy neon megacity at night: towering skyscrapers, glowing holographic signs with abstract symbols only (no readable text), flying cars, wet streets with colorful reflections, purple and cyan haze.
```

### [시즌 시트]

```
Skin theme: CYBERPUNK: sleek techwear and armored suits, chrome cybernetic parts, glowing neon LED lines in the character's colors, holographic versions of their halos, crowns and accessories, energy or plasma versions of their weapons.
```

#### 3-1. 영사 (silk) — 넷러너
- 일러스트 참고: `art/선택일러스트/영사.png` · 시트 참고: `art/캐릭터/` 안 `영사/silk-1.png`
```
Skin: A black glossy long coat with pink neon trims, a visor, glowing pink fiber-optic threads streaming from her fingertips.
```

#### 3-2. 풍류사 (pungryu) — 사이버 선비
- 일러스트 참고: `art/선택일러스트/풍류사.png` · 시트 참고: `art/캐릭터/` 안 `풍류사/구름을 탄 화공 소년 스프라이트 시트.png`
```
Skin: A black techwear durumagi coat with jade neon lines, a holographic gat with red bead strings, a hovering hologram brush.
```

#### 3-3. 레오 (leo) — 사이버 사자
- 일러스트 참고: `art/선택일러스트/레오.png` · 시트 참고: `art/캐릭터/` 안 `레오/leo-1.png`
```
Skin: Chrome armor plating with blue LED lines, the mane as glowing gold energy fibers, a lightning core gem on the forehead.
```

#### 3-4. 오닉스 (onyx) — 크리스털 로봇
- 일러스트 참고: `art/선택일러스트/오닉스.png` · 시트 참고: `art/캐릭터/` 안 `오닉스/onyx-1.png`
```
Skin: A bronze chrome body with a purple reactor core, seven LED gemstones, a holographic halo.
```

#### 3-5. 펜리르 (fenrir) — 사이버 늑대
- 일러스트 참고: `art/선택일러스트/펜리르.png` · 시트 참고: `art/캐릭터/` 안 `펜리르/보석 장검을 문 백색 늑대 보행 세트.png`
```
Skin: White fur with chrome armor plates and cyan LEDs, a laser greatsword in its mouth, a holographic halo.
```

#### 3-6. 이클립스 (eclipse) — 태양 기계 여왕
- 일러스트 참고: `art/선택일러스트/이클립스.png` · 시트 참고: `art/캐릭터/` 안 `이클립스/eclipse-1.png` · `eclipseNight-1.png`
```
Skin: A white and gold mecha dress, a holographic sun crown, a solar disk on the back with the night lord shown as a hologram inside.
```

#### 3-7. 토르켄 (thorken) — 전자기 닻 전사
- 일러스트 참고: `art/선택일러스트/토르켄.png` · 시트 참고: `art/캐릭터/` 안 `토르켄/청록 머리 전사의 8방향 스프라이트 시트.png`
```
Skin: The big teal hair, bronze cyber armor, a giant electromagnetic anchor on chains of light.
```

#### 3-8. 리바이어 (levia) — 얼음 사이버 발키리
- 일러스트 참고: `art/선택일러스트/리바이어.png` · 시트 참고: `art/캐릭터/` 안 `리바이어/물결 왕관의 아이스 발키리 워크사이클.png`
```
Skin: A white and blue armored suit with glowing wave lines, a holographic wave crown, a plasma trident.
```

#### 3-9. 테일 (tail) — 상어 후드 해커
- 일러스트 참고: `art/선택일러스트/테일.png` · 시트 참고: `art/캐릭터/` 안 `테일/상어 소녀 걷기 애니메이션 스프라이트 시트.png`
```
Skin: A navy techwear shark hoodie with LED teeth, a mechanical shark tail, neon sneakers, floating hacker screens.
```

#### 3-10. 매드퀸 (madQueen) — 사이버 제독
- 일러스트 참고: `art/선택일러스트/매드퀸.png` · 시트 참고: `art/캐릭터/` 안 `매드퀸/은빛 해군 제독 걷기 스프라이트 시트.png`
```
Skin: A white and gold military long coat with LED trims, a holographic admiral hat, the four-color energy cannons as floating drones.
```

#### 3-11. 훅 (hook) — 하늘 해적 선장
- 일러스트 참고: `art/선택일러스트/훅.png` · 시트 참고: `art/캐릭터/` 안 `훅/hook-1.png`
```
Skin: A navy tricorn hat with a holographic star, a chrome arm with a crescent energy-blade hook.
```

#### 3-12. 오르카 (orca) — 사이버 권투가
- 일러스트 참고: `art/선택일러스트/오르카.png` · 시트 참고: `art/캐릭터/` 안 `오르카/ChatGPT 이미지 2026년 11월 6일 오전 12_24_53.png`
```
Skin: Shirtless with chrome tattoo lines, white techwear pants, hydraulic gauntlets swirling with blue water plasma.
```

#### 3-13. 웨이브 (wave) — 호버보드 서퍼
- 일러스트 참고: `art/선택일러스트/웨이브.png` · 시트 참고: `art/캐릭터/` 안 `웨이브/ChatGPT 이미지 2026년 11월 6일 오전 02_30_46.png`
```
Skin: A white techwear hooded jacket over a black bodysuit, LED goggles, a yellow and blue hoverboard.
```

#### 3-14. 미류 (miryu) — 사이버 용검사
- 일러스트 참고: `art/선택일러스트/미류.png` · 시트 참고: `art/캐릭터/` 안 `미류/팔방향 보행 중인 은빛 머리 전사 소녀 spritesheet.png`
```
Skin: Teal holographic dragon horns, a white and teal armor suit, a blue plasma sword with a red LED tassel.
```

#### 3-15. 베아트리스 (beatrice) — 성기사 파워 아머
- 일러스트 참고: `art/선택일러스트/베아트리스.png` · 시트 참고: `art/캐릭터/` 안 `베아트리스/베아트리스 성기사 워킹 스프라이트 시트.png`
```
Skin: White-gold power armor, a holographic thorn halo, a red energy cape with a gold cross pattern, a huge energy shield.
```

#### 3-16. 이안 (ian) — 데이터 마도사
- 일러스트 참고: `art/선택일러스트/이안.png` · 시트 참고: `art/캐릭터/` 안 `이안/백색 황금 마도사의 보행 스프라이트 시트.png`
```
Skin: A white-gold coat with navy lining, smart glasses with a HUD, a violet lantern drone, glowing data threads.
```

#### 3-17. 가브리엘 (gabriel) — 수호 기사 메카
- 일러스트 참고: `art/선택일러스트/가브리엘.png` · 시트 참고: `art/캐릭터/` 안 `가브리엘/성스러운 수호자의 행진 팔레트.png`
```
Skin: Gold power armor, a blue fur-lined cape, a holographic cross shield, a hydraulic hammer.
```

#### 3-18. 세레나 (serena) — 네온 무희 천사
- 일러스트 참고: `art/선택일러스트/세레나.png` · 시트 참고: `art/캐릭터/` 안 `세레나/백금빛 천사 전사의 걷기 스프라이트 시트.png`
```
Skin: A white-gold dance suit with LED lines, a holographic lily and sun halo, a steel laser whip.
```

#### 3-19. 미카엘라 (michaela) — 사제 안드로이드
- 일러스트 참고: `art/선택일러스트/미카엘라.png` · 시트 참고: `art/캐릭터/` 안 `미카엘라/성스러운 여사제 걷기 스프라이트 시트.png`
```
Skin: A sleek gold and white robe-bodysuit, a lily hair ornament, a holographic halo, floating small spear drones.
```

#### 3-20. 유리엘 (yuriel) — 사이버 성녀
- 일러스트 참고: `art/선택일러스트/유리엘.png` · 시트 참고: `art/캐릭터/` 안 `유리엘/성녀 수호자의 8방향 보행 스프라이트.png`
```
Skin: A white veil with a light-up gold cross, a white and blue armored robe, a holographic holy-water orb, a chain flail with LED links.
```

#### 3-21. 라파엘 (rafael) — 사이버 궁수 사제
- 일러스트 참고: `art/선택일러스트/라파엘.png` · 시트 참고: `art/캐릭터/` 안 `라파엘/은빛 궁수 마법사의 걷기 사이클 스프라이트 시트.png`
```
Skin: A white hood with a gold LED cross, white-gold armored robe, a bow with a blue holographic scope.
```

---

## 시즌 4 — 크리스마스

### [시즌 일러스트]

```
Skin theme: CHRISTMAS: Santa outfits (red and white with fluffy fur trim), female Santa dresses, Rudolph reindeer looks (antlers, red nose), elves, nutcrackers, holly, bells, ribbons, gift boxes, candy canes, snowflakes, in harmony with the character's own colors.
Background: A snowy winter night in a cozy town square: a huge decorated Christmas tree with warm lights, falling snow, wreaths, piles of gift boxes, glowing windows, a starry sky.
```

### [시즌 시트]

```
Skin theme: CHRISTMAS: Santa outfits (red and white with fluffy fur trim), female Santa dresses, Rudolph reindeer looks (antlers, red nose), elves, nutcrackers, holly, bells, ribbons, gift boxes, candy canes, snowflakes, in harmony with the character's own colors.
```

#### 4-1. 블래스트 (blast) — 산타 사냥꾼
- 일러스트 참고: `art/선택일러스트/블래스트.png` · 시트 참고: `art/캐릭터/` 안 `블래스트/블래스트 악마 사냥꾼 보행 스프라이트 시트.png`
```
Skin: A red and white Santa coat with fur trim and the white cross, orange goggles, a Santa hat over the white ponytail, a shotgun striped like a candy cane.
```

#### 4-2. 네일러 (nailer) — 호랑가시 처형자
- 일러스트 참고: `art/선택일러스트/네일러.png` · 시트 참고: `art/캐릭터/` 안 `네일러/고딕 성기사 처형자의 걷기 애니메이션 스프라이트 시트.png`
```
Skin: A dark grey coat with red ribbons and white fur, the thorn crown made of holly and red berries, the eye bandage, a hammer wrapped in ribbon.
```

#### 4-3. 시저스 (scissors) — 고딕 요정
- 일러스트 참고: `art/선택일러스트/시저스.png` · 시트 참고: `art/캐릭터/` 안 `시저스/고딕 쌍가위 전사의 걷기 스프라이트 시트.png`
```
Skin: A black and red velvet dress with white fur, a hood with holly and red roses, the giant scissors cutting gift ribbon.
```

#### 4-4. 헬피스트 (hellfist) — 나쁜 산타
- 일러스트 참고: `art/선택일러스트/헬피스트.png` · 시트 참고: `art/캐릭터/` 안 `헬피스트/hellfist-1.png`
```
Skin: An open red Santa coat with black fur, the cross necklace with a bell, the demon arm carrying a big gift sack.
```

#### 4-5. 실버불렛 (silverBullet) — 겨울 사냥꾼
- 일러스트 참고: `art/선택일러스트/실버불렛.png` · 시트 참고: `art/캐릭터/` 안 `실버불릿/은빛 사냥꾼 걷기 애니메이션 시트.png`
```
Skin: A black and gold coat with white fur, the wide hat with a holly sprig and white feather, a silver gun decorated with bells.
```

#### 4-6. 블루 플레임 (blueFlame) — 푸른 촛불
- 일러스트 참고: `art/선택일러스트/블루 플레임.png` · 시트 참고: `art/캐릭터/` 안 `블루플레임/눈가리개 마도사의 불꽃 행진 픽셀 스프라이트.png`
```
Skin: A black and blue winter robe with snowflake embroidery, the blindfold tied with a ribbon, blue candle flames, a bow of blue fire shaped like a wreath.
```

#### 4-7. 루나틱 (lunatic) — 여자 산타
- 일러스트 참고: `art/선택일러스트/루나틱.png` · 시트 참고: `art/캐릭터/` 안 `루나틱/은빛 달빛 검객 걷기 스프라이트 시트.png`
```
Skin: A red and white Santa dress with a crescent moon brooch, a Santa hat, a short red cape, a rapier striped like a candy cane.
```

#### 4-8. 인시전 (incision) — 루돌프 전사
- 일러스트 참고: `art/선택일러스트/인시전.png` · 시트 참고: `art/캐릭터/` 안 `인시전/쌍도끼를 든 백발 전사 워킹 스프라이트.png`
```
Skin: Brown fur-collared armor, an antler headband and a glowing red nose ornament, red cape, twin axes with jingle bells.
```

#### 4-9. 크루세이더 (crusader) — 거인 산타 기사
- 일러스트 참고: `art/선택일러스트/크루세이더.png` · 시트 참고: `art/캐릭터/` 안 `크루세이더/성십자가의 거인 걷기 사이클 스프라이트 시트.png`
```
Skin: Silver-gold armor with a red and white fur cloak, a Santa-hat crest on the helmet, a huge gift sack over the shoulder.
```

#### 4-10. 조커 (joker) — 선물 상자 광대
- 일러스트 참고: `art/선택일러스트/조커.png` · 시트 참고: `art/캐릭터/` 안 `조커/네온 사이버펑크 조커 스프라이트 시트.png`
```
Skin: The neon helmet with X eyes wearing a Santa hat, a green and red patterned jacket, playing cards that are gift tags, a jack-in-the-box.
```

#### 4-11. 쉐도잉 (shadowing) — 눈 그리는 화가
- 일러스트 참고: `art/선택일러스트/쉐도잉.png` · 시트 참고: `art/캐릭터/` 안 `쉐도잉/마법 붓을 든 정령 소녀 스프라이트 시트.png`
```
Skin: A navy beret with a holly pin, a white fur cape, the magic brush painting snowflakes, blue spirit hands holding ornaments.
```

#### 4-12. 인형술사 (puppeteer) — 호두까기 인형사
- 일러스트 참고: `art/선택일러스트/인형술사.png` · 시트 참고: `art/캐릭터/` 안 `인형술사/인형술사 소녀 걷기 사이클 spritesheet.png`
```
Skin: A white winter dress with red ribbons, nutcracker soldier puppets on red strings, the giant puppet hand wearing a mitten.
```

#### 4-13. 래빗 (rabbit) — 눈토끼
- 일러스트 참고: `art/선택일러스트/래빗.png` · 시트 참고: `art/캐릭터/` 안 `래빗/망치 든 치비 소녀 걷기 스프라이트 시트.png`
```
Skin: A pink Santa dress with white fur, bunny-ear earmuffs, the giant pink hammer shaped like a gingerbread bear.
```

#### 4-14. 백령 (baekryeong) — 겨울 오니 무사
- 일러스트 참고: `art/선택일러스트/백령.png` · 시트 참고: `art/캐릭터/` 안 `백령/8프레임 치비 전사 워킹 스프라이트 시트.png`
```
Skin: A white and blue Santa-style samurai coat with fur, blue horns tied with holly, the big tachi with a red ribbon.
```

#### 4-15. 빙설 (bingseol) — 크리스마스 해군
- 일러스트 참고: `art/선택일러스트/빙설.png` · 시트 참고: `art/캐릭터/` 안 `빙설/빙결 해군 소녀 걷기 애니메이션 스프라이트 시트.png`
```
Skin: A navy and red winter naval coat with snowflake and anchor emblems, a Santa-style naval hat, an icicle-shaped ice spear.
```

#### 4-16. 혼령 (honryeong) — 겨울 기모노
- 일러스트 참고: `art/선택일러스트/혼령.png` · 시트 참고: `art/캐릭터/` 안 `혼령/보랏빛 기모노 여인의 걷기 스프라이트.png`
```
Skin: A deep red and white kimono with plum blossom and snowflake patterns, a fur stole, the long pipe puffing snowflake-shaped smoke.
```

#### 4-17. 백인장 (baekinjang) — 순록 기계 기사
- 일러스트 참고: `art/선택일러스트/백인장.png` · 시트 참고: `art/캐릭터/` 안 `백인장/사이버 랜서 걷기 동작 스프라이트 시트.png`
```
Skin: Red and silver mechanical wings shaped like sleigh runners, twin swords with bells, small spear drones shaped like reindeer.
```

#### 4-18. 아리아 (aria) — 성가대 지휘자
- 일러스트 참고: `art/선택일러스트/아리아.png` · 시트 참고: `art/캐릭터/` 안 `아리아/황금 지휘자의 8방향 걷기 스프라이트.png`
```
Skin: A white and gold coat with red fur trim, the white hat with holly and a treble clef, golden spirit arms holding bells and horns.
```

#### 4-19. 레이븐 (chessRaven) — 크리스마스 체스 여왕
- 일러스트 참고: `art/선택일러스트/레이븐.png` · 시트 참고: `art/캐릭터/` 안 `레이븐/은빛 왕관의 창기사 걷기 스프라이트.png`
```
Skin: A black and white armored gown with red velvet and white fur, the chess crown with holly, a lance striped like a candy cane.
```

#### 4-20. 기어스 (gears) — 산타 메이드 기사
- 일러스트 참고: `art/선택일러스트/기어스.png` · 시트 참고: `art/캐릭터/` 안 `기어스/실버 기사 메이드의 4방향 걷기 스프라이트.png`
```
Skin: A silver armored maid dress with red ribbons and white fur, a Santa maid headband, the round shield decorated like a wreath.
```

#### 4-21. 아수라 (asura) — 겨울 군주
- 일러스트 참고: `art/선택일러스트/아수라.png` · 시트 참고: `art/캐릭터/` 안 `아수라/정교한 기계 팔을 지닌 빙설의 군주 spritesheet.png`
```
Skin: A navy and gold noble coat with red-and-white Santa fur, a Santa hat, the six ghost arms holding gifts and ornaments.
```

---

## 시즌 5 — 메이드·바니

### [시즌 일러스트]

```
Skin theme: MAID and BUNNY: classic elegant maid uniforms (long or knee-length dress, white apron, frilled headband, ribbons) or classic bunny outfits (bunny ears headband, tailcoat jacket or bunny suit with tights, bow tie, cuffs), stylish and tasteful, not revealing. Male characters get the matching butler / bunny-ear tuxedo version. Keep the character's own color and demon features.
Background: An elegant night mansion lounge: crystal chandeliers, velvet curtains, a grand staircase, polished checkered floor, warm golden light, a silver tea set and roses.
```

### [시즌 시트]

```
Skin theme: MAID and BUNNY: classic elegant maid uniforms (long or knee-length dress, white apron, frilled headband, ribbons) or classic bunny outfits (bunny ears headband, tailcoat jacket or bunny suit with tights, bow tie, cuffs), stylish and tasteful, not revealing. Male characters get the matching butler / bunny-ear tuxedo version. Keep the character's own color and demon features.
```

#### 5-1. 느아르 (noir) — 검은 메이드
- 일러스트 참고: `art/선택일러스트/느아르.png` · 시트 참고: `art/캐릭터/` 안 `느아르/네온 그린 배경의 다크 슬래시 스프라이트 시트.png` (초록 배경)
```
Skin: A black and white maid uniform with a high collar and red ribbons, a frilled headband, the void claws as black lace gloves with a dark aura.
```

#### 5-2. 루주 (rouge) — 진홍 바니
- 일러스트 참고: `art/선택일러스트/루주.png` · 시트 참고: `art/캐릭터/` 안 `루주/붉은 머리 검객의 픽셀 스프라이트 시트.png` (초록 배경)
```
Skin: A crimson and black bunny outfit with a tailcoat jacket, black tights, a bow tie and bunny ears, the twin rose swords.
```

#### 5-3. 블뢰 (bleu) — 얼음 메이드
- 일러스트 참고: `art/선택일러스트/블뢰.png` · 시트 참고: `art/캐릭터/` 안 `블뢰/블뢰 걷기.png` (초록 배경)
```
Skin: A navy and ice-blue long maid dress with a white apron, the ice crystal crown with a frilled headband, the white grimoire like a menu book.
```

#### 5-4. 존 (jaune) — 번개 바니
- 일러스트 참고: `art/선택일러스트/존.png` · 시트 참고: `art/캐릭터/` 안 `존/존 걷기.png` (초록 배경)
```
Skin: A white and gold bunny-ear tuxedo or bunny outfit with lightning trims, gold cuffs and bow tie, the golden grip glowing.
```

#### 5-5. 마젠타 (magenta) — 분홍 바니
- 일러스트 참고: `art/선택일러스트/마젠타.png` · 시트 참고: `art/캐릭터/` 안 `마젠타/마젠타 걷기.png` (초록 배경)
```
Skin: A magenta-to-pink bunny outfit with a short tailcoat, tights, a big ribbon and bunny ears, the folding fan.
```

#### 5-6. 베르 (vert) — 숲 메이드
- 일러스트 참고: `art/선택일러스트/베르.png` · 시트 참고: `art/캐릭터/` 안 `베르/베르 걷기.png` (초록 배경)
```
Skin: A deep green maid dress with a leaf-pattern apron and vine ribbons, a leafy headband, the twin vine sickles like garden shears.
```

#### 5-7. 블랑 (blanc) — 순백 바니
- 일러스트 참고: `art/선택일러스트/블랑.png` · 시트 참고: `art/캐릭터/` 안 `블랑/블랑 걷기.png` (초록 배경)
```
Skin: A pure white bunny outfit with a white tailcoat, white tights, sunglasses on the head, bunny ears, the pure white fan.
```
