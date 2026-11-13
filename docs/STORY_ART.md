# 스토리 장면 일러스트 (GPT 프롬프트)

> 2026-11-13 작성. 장면 화면은 `story/SceneView` (위 그림 + 아래 대사), 컷 나누기는 `story/sceneCuts.ts`
> **만드는 사람: 사용자 (GPT)** → 받은 원본 PNG를 `art/스토리/{장}/` 에 올리면 Claude가 `public/story/{장}-{컷}.webp`로 바꿔 넣음
> 그림이 없는 컷은 게임이 임시 그림(배경 + 말하는 캐릭터)으로 보여 줌 → 한 장씩 채워도 됨

## 쓰는 법

1. GPT 새 대화 처음에 아래 **[규칙]**을 한 번 붙여 넣음
2. 컷마다 그 컷에 나오는 캐릭터의 지금 그림(`art/캐릭터/{이름}/…-1.png`)을 같이 올리고 프롬프트 한 줄을 보냄 (한 번에 한 컷)
3. **다운로드한 원본 PNG**를 `art/스토리/1장/1.png`처럼 컷 번호로 올림
4. 1장 8컷으로 화풍을 먼저 맞춘 뒤 2~9장 목록을 이어서 씀

### [규칙] — 대화 처음에 한 번

```
지금부터 픽셀 아트 게임의 스토리 장면 일러스트를 한 장씩 만들 거야. 매번 아래 규칙을 지켜 줘.

[크기·구도]
- 가로로 긴 1536×1024 한 장. 게임에서는 가로 16:9로 위아래가 조금 잘려 보이니, 중요한 인물·사건은 가운데 세로 80% 안에.
- 영화의 한 장면처럼: 배경과 인물이 함께 있는 넓은 장면. 얼굴 확대·설명 칸·말풍선·글자·제목·서명·테두리 없음.

[화풍]
- 고해상도 픽셀 아트 일러스트 (도트가 보이는 그림, 도트 1칸 = 4×4픽셀 정도). 블러·번짐·사진 질감 없음.
- 진하고 선명한 색, 빛과 그림자가 분명한 극적인 조명. 같은 화가가 그린 연작처럼 모든 컷이 같은 화풍.
- 함께 올린 캐릭터 그림이 있으면 그 캐릭터의 머리색·옷·무기·성별을 그대로 지킴 (작은 게임 그림을 크게 다시 그린 느낌).
- 다른 게임·애니메이션·작품의 캐릭터나 장면을 따라 하지 않음.
```

## 1장 「오해」 (8컷, `art/스토리/1장/`)

| 컷 | 문단 | 참고 그림 | 프롬프트 |
| --- | --- | --- | --- |
| 1 | 1~4 | — | 안개 낀 새벽 숲, 바위 그늘에 몸을 웅크리고 잠든 은빛 비늘의 어린 용(날개가 아직 작음). 앞쪽 나무 뒤에서 낡은 옷의 가난한 사냥꾼이 떨리는 손으로 활시위를 당기고 있음. 조용하고 불길한 분위기 |
| 2 | 5~7 | — | 밤, 거대한 어미 용이 하늘을 가르며 중세 성채 도시 아스칼론을 습격함. 무너지는 성벽, 불길에 휩싸인 거리, 주황 불빛과 검은 연기. 용은 분노한 표정, 날개를 크게 펼침 |
| 3 | 8~13 | 떠돌이·파수꾼·마법사 | 좁은 의료소, 침상 셋. 얼굴과 몸에 붕대를 감은 어린 소년 셋(떠돌이·파수꾼·마법사의 어린 시절)이 나란히 앉아 같은 천장을 올려다보며 주먹을 쥐고 맹세함. 창으로 들어오는 차가운 달빛 |
| 4 | 14~19 | 야수·원소술사 | 깊은 숲, 몬스터 무리에게 둘러싸여 웅크린 작은 새끼 용. 그 앞을 막아선 비르디아의 야수(짐승의 힘)와 원소술사(바람과 불을 다룸)가 싸움. 위쪽 나무 사이로 거대한 어미 용의 그림자가 드리움 |
| 5 | 20~22 | 떠돌이·파수꾼·마법사 | 폭풍이 몰아치는 산꼭대기. 어른이 된 떠돌이(쇠뇌)·파수꾼(검과 방패)·마법사(불꽃 마법)가 상처 입은 거대한 용을 몰아붙임. 화살과 칼날과 불꽃이 용의 비늘에 박힘. 번개와 소용돌이치는 구름 |
| 6 | 23~29 | 떠돌이·파수꾼·마법사·야수·원소술사·음양사 | 비르디아 숲의 치유소 앞. 왼쪽에 아스칼론 셋(분노한 표정, 무기를 듦), 오른쪽에 비르디아 셋(놀라고 화난 표정), 사이에 칼에 베여 쓰러지는 음양사. 뒤쪽 치유소 안에 누워 있는 용. 두 무리가 갈라서는 긴장감 |
| 7 | 30~34 | — | 밤, 치유소 뒤편 어둠. 얼굴이 보이지 않는 그림자 속 인물이 쓰러진 용의 입에 검은 약병을 기울임. 그 뒤 컷: 용의 비늘이 검붉게 타오르고 눈에서 붉은 빛, 멀리 두 왕국의 숲과 성이 불타기 시작함 (한 장에 두 순간을 앞뒤로) |
| 8 | 35~41 | — | 불타고 남은 숲 위로 동트는 새벽. 잠시 이성을 되찾은 지친 어미 용이 새끼 용의 이마에 빛나는 마법 문양을 새기고, 발치에 빛나는 '세계수의 씨앗'을 내려놓음. 슬프고 따뜻한 작별 분위기 |

- 문단 번호는 1장 본문의 순서 (게임 화면 아래 '몇 / 41'과 같음)
- 컷을 더 나누거나 합치고 싶으면 말씀해 주시면 `sceneCuts.ts`를 같이 고침

## Higgsfield로 만들 때 (2026-11-13~, 1장 8컷 완성)

- Claude 채팅·Cowork의 Higgsfield에서 **Nano Banana Pro · 16:9 · 2k** (Claude Code에서는 무제한 생성이 막혀 크레딧이 듦)
- 참고 그림 1번 = **1장 컷 3 그림**(`art/스토리/1장/3.png`, 화풍 기준) + 그 컷에 나오는 캐릭터 그림 (`art/캐릭터/{이름}/…-1.png`)
- 프롬프트 = 아래 [공통] + 컷별 장면. 위아래 검은 띠가 생기면 Claude가 잘라서 넣음

### [공통] — 모든 컷 앞에

```
Use the first reference image ONLY as the art style guide: match its exact style — cute chibi-leaning anime pixel art, large expressive eyes, clean bold pixel outlines, soft rounded shapes, rich saturated colors, same pixel density and shading. Do not copy its scene or characters. Other reference images are character designs: keep each character's hair color, outfit, colors, weapon and gender. Full-bleed 16:9 image, no black bars, no letterboxing, no border, no text, no letters, no captions, no signature. Keep the important subjects inside the central 80% vertically. Original design.
```

## 2장 「슬며시 차오르는 악」 (8컷, `art/스토리/2장/`)

| 컷 | 문단 | 참고 그림 | 장면 |
| --- | --- | --- | --- |
| 1 | 1~3 | 거너·시간술사·기계공학자 | 아스칼론 옛 장수들의 회의장, 테라코어 세 사람이 헬리오스의 악을 경고 |
| 2 | 4~7 | 장수·풋내기 | 아스칼론 성문, 헬리오스로 떠나는 장수들과 가방 멘 풋내기 |
| 3 | 8~11 | 악의 사도 | 헬리오스 황금빛 연회장, 말 없는 왕, 웃으며 술을 따르는 흰 옷의 사도 |
| 4 | 12~17 | 장수·풋내기·악의 사도 + 갓이터(`public/sprites/enemies/godeater.png`) | 달빛 공터, 떠 있는 두 대검과 갓이터, 쓰러진 두 장수, 뒤에서 웃는 사도 |
| 5 | 18~28 | 거너·기계공학자·시간술사·장수·풋내기 | 총소리와 함께 나타난 테라코어 셋(포탑·드론), 풋내기를 밀어 보내는 장수 |
| 6 | 29~40 | 풋내기·격투가 | 달아나던 풋내기 앞의 격투가, 먼저 날린 주먹, 하늘을 뒤덮은 드론·포탑 |
| 7 | 41~48 | 시간술사·거너·장수·풋내기·격투가 | 아스트랄 로드를 끌어내는 시간술사, 수류탄 폭발, 풋내기를 안고 달리는 장수, 모래로 흩어지는 환영 |
| 8 | 49~50 | 풋내기·장수 | 새벽 국경 언덕, 평온한 제국의 하늘을 돌아보는 풋내기 |

### 2장 컷별 장면 (영어, [공통] 뒤에 붙임)

1. `Scene: the grand council hall of the old generals of Ascalon, a stone hall with red banners, a long table and stern elderly generals in armor. Three strangers from the machine nation Terracore stand before them: the Gunner (dark red and black coat, wide-brimmed black hat, rifle), the Chronomancer (silver-white hair, navy and white robe with golden clock ornaments) and the Engineer (messy brown hair, orange and dark mechanical outfit, gadgets). The Gunner speaks gravely; the Chronomancer looks worried. Doubtful faces on the generals. Serious, uneasy mood.`
2. `Scene: the great gate of the castle city of Ascalon in morning light. Three armored generals mount up to travel to the Helios Empire. Among them the General (dark crimson armor, helmet with a tall red plume, spear) turns to his young apprentice, the Novice (light brown hair, simple beige clothes, bandaged fists), who hurriedly carries a huge travel bag and salutes nervously. Lighthearted departure mood with a hint of unease.`
3. `Scene: a dazzling golden banquet hall in the desert empire of Helios, sandstone pillars, gold ornaments, endless tables of food. Three Ascalon generals in armor and the young Novice are treated as honored heroes. On a high throne sits a quiet, expressionless king with empty eyes like a puppet. A smiling apostle in white and red ornate robes with long white hair (the Apostle of Malice) pours wine into their cups. Warm on the surface, subtly sinister mood.`
4. `Scene: a moonlit clearing at deep night. A towering dark figure stands in the center: the Godeater, a giant shadowy being in a tattered dark purple cloak with a golden crown, glowing red eyes and a red gem on its chest. Two enormous greatswords float by themselves beside it. At its feet two Ascalon generals lie fallen, defeated (no gore). Behind it the white-robed Apostle smiles coldly. In the foreground the General (crimson armor, red plume) and the Novice freeze in terror, unable to move. Overwhelming, terrifying mood.`
5. `Scene: the same moonlit clearing. With a gunshot cutting the night sky, the three from Terracore burst in: the Gunner firing his rifle, the Engineer deploying laser turrets and a swarm of drones, the Chronomancer with a glowing clock-magic circle. The General (crimson armor, red plume) pushes the young Novice away toward safety with a firm hand, telling him to run. The giant crowned Godeater and its floating greatswords loom in the background. Desperate, heroic mood.`
6. `Scene: night, a rocky path outside the city. The fleeing Novice (light brown hair, beige clothes, bandaged fists) is blocked by the Brawler of Helios (spiky red hair, red fighter outfit, cocky grin). Gritting his teeth, the Novice throws the first punch, grazing the Brawler's cheek; the Brawler looks surprised and amused. Above them the sky is filled with drones and laser turrets flying in, explosions lighting the clouds. Tense, brave mood.`
7. `Scene: chaos in the moonlit clearing, the Godeater overwhelming the battle as broken turrets burn. The Chronomancer forces out a glowing astral rod with blood at the corner of his mouth. The Gunner's grenade explodes, pushing back the Godeater and the Apostle. The General (crimson armor, red plume) sprints away carrying the Novice under his arm. Behind them the red-haired Brawler grabs the Novice's leg, but it is an illusion dissolving into golden sand. Explosive, dramatic escape mood.`
8. `Scene: dawn on a grassy border hill. The Novice (light brown hair, beige clothes, bandaged fists) looks back over his shoulder at the distant golden city of Helios, whose sky looks perfectly peaceful as if nothing happened. The wounded General (crimson armor, red plume) stands beside him. Soft pink and gold morning light, wind in the grass. Quiet, bittersweet, foreboding mood.`

## 3장 「버려진 자들」 (10컷, `art/스토리/3장/`)

글이 124문단으로 길어 10컷. 참고 그림: 제이드 `버려진 자들/abandoned-1.png` · 레이븐 `abandoned2-1.png` · 카인 `abandoned3-1.png` (지금 그림은 힘을 얻은 뒤 모습 → 컷 1~7은 같은 머리·눈색의 누더기 차림 아이로), 태초의 빛과 어둠 `public/sprites/enemies/plight.png`·`pdark.png`

| 컷 | 문단 | 참고 그림 | 장면 |
| --- | --- | --- | --- |
| 1 | 1~9 | 버려진 자들 셋 | 테라코어 뒷골목, 패거리에게 당하고 웅크린 세 아이, 제국으로 가자는 카인 |
| 2 | 10~21 | 버려진 자들·닌자 | 검은 천을 두른 여자(닌자)가 제국패를 보이며 빵과 물을 건넴 |
| 3 | 22~27 | 버려진 자들·닌자 | 바렌트 사막을 걷는 닌자와 아이들, 멀리 모래언덕 위 투명한 그림자 |
| 4 | 28~45 | 닌자·의사·거인·버려진 자들 | 주사기를 던지는 의사, 기계팔로 내려치는 거인, 아이들을 안고 뛰어오른 닌자 |
| 5 | 46~59 | 베두인·소환술사·오니·거인·닌자 | 거대한 회전체를 기계팔로 막는 거인, 베두인 등장, 소환수와 함께 선 소환술사, 달려드는 오니 |
| 6 | 60~72 | 버려진 자들·닌자·의사 | 사막 신전으로 달려가는 아이들, 떠오르는 몸을 감싸는 빛과 어둠, 씨익 웃는 닌자 |
| 7 | 73~81 | 거인·오니·베두인 | 피해 축적기를 푼 거인이 던진 빛나는 바위, 방망이로 막다 튕겨 나가는 오니, 무너지는 신전 |
| 8 | 82~97 | 닌자·버려진 자들·태초 | 신전 바닥에서 드러난 빛과 어둠의 구체, 현현한 태초, 혼돈의 기운에 휩싸인 아이들 |
| 9 | 98~118 | 소환술사·의사·거인·음양사·이무기·야수·원소술사·태초 | 풀피리 소리에 하늘에 열린 세계수 통로, 쏟아져 나오는 비르디아 전력 |
| 10 | 119~124 | 소환술사·음양사·의사·거인 | 잿빛 바람 속 흉악들, 후퇴하는 테라코어·비르디아, 흉터 난 세계수 위로 밝아 오는 새벽 |

### 3장 컷별 장면 (영어, [공통] 뒤에 붙임)

1. `Scene: a dirty back alley of the machine nation Terracore at dusk, rusty pipes, steam vents and distant glowing factory towers above. Three ragged orphan children in patched, torn clothes huddle against a wall after being beaten by a street gang: Jade (messy black hair with a white streak, one amber and one purple eye, holding a scrap-metal shield), Raven (long silver-white hair, red eyes) and Cain (black hair with white streaks, amber and violet eyes, clenched fist). Cain stands up, shouting that they should go to the Empire. Bruises (no blood), stolen bread crumbs. Sad but determined mood.`
2. `Scene: the same Terracore back alley. A mysterious woman wrapped entirely in black cloth like a living shadow, red eyes, black face mask, red headband ribbons fluttering (the Ninja), crouches before the three ragged orphans and holds up a golden imperial token. With a playful smile in her eyes she hands them a big basket of bread and a water flask. The starving children stare, half afraid, half hopeful. Warm light on the bread, cold shadows around her. Sweet but ominous mood.`
3. `Scene: the vast Barent desert under a blazing sky, endless golden dunes. The black-clad Ninja walks ahead, the three ragged orphans follow carrying bread and water, looking up at her as she asks if they want revenge. Far behind on a dune, a faint transparent shimmering silhouette (invisible pursuers) watches them. Heat haze, long shadows. Quiet, uneasy mood.`
4. `Scene: a desert ambush. The Doctor of Terracore (feminine-looking young man with dark bob hair, red eyes, white coat with red crosses, medicine bottles) throws a fan of glinting syringes. The Titan (muscular man with spiky brown hair and stubble, brown vest, a giant steel mechanical arm) smashes the sand with his huge mechanical fist, sending up a massive sand explosion, his shimmering cloaking field fading. The Ninja leaps high into the air holding the three shocked orphans in her arms. Explosive, chaotic action mood.`
5. `Scene: the desert battle grows. A giant golden spinning ring-blade screams through the air; the Titan blocks it with his mechanical arm, sparks flying. The Bedouin of Helios (tanned woman, long brown hair with ornaments, red tattered scarf, navy skirt) catches her golden chakram ring with a smirk. Beside them the Summoner (long green hair, green eyes, dark green ragged coat with vines and a whip) stands with summoned desert beasts, and the Oni (huge red-skinned horned brute with a spiked wooden club, prayer beads) charges in laughing. The Ninja shields the children. Wild, crowded battle mood.`
6. `Scene: an ancient sandstone temple half buried in the desert, carved sun and moon symbols on its gate. The three ragged orphans run hand in hand into the temple, Cain pulling the others. Inside, their bodies begin to float in the air, wrapped by swirling black darkness and golden light. In the foreground the black-clad Ninja grins; behind, the Doctor reaches out shouting no. Mystical, dreadful mood.`
7. `Scene: the Titan (giant steel mechanical arm glowing with stored energy) hurls a huge boulder charged with blazing orange energy at the temple. The Oni leaps up and blocks it with his spiked club but is blasted away. The boulder crashes into the temple; stone pillars collapse and the floating children and wisps of light and dark spirit energy are thrown out of the blast. The Bedouin screams in the dust. Massive impact, debris, dramatic mood.`
8. `Scene: inside the broken temple, two glowing spheres rise from the cracked floor: a radiant golden sun orb with a calm face and a pitch-black moon orb with a dark aura, the Primeval Light and Darkness, awakening as a huge shockwave knocks everyone down. The Ninja kneels before them in reverence. Behind her the three orphans now stand surrounded by violent chaotic red-black and white energy, eyes glowing, gaining terrible power. Awe-inspiring, ominous mood.`
9. `Scene: the desert at night, the Primeval sun and moon orbs hovering over the ruined temple. The Summoner blows a grass whistle; the sky tears open into a glowing green tunnel of World Tree magic with giant roots and leaves. From it pour the forces of Virdia: the Mystic (long black hair, red and white shrine maiden robes, paper talismans), the Imugi (long dark hair, teal scaled armor, spear), the Beast (orange wild hair, fur and claws, a small tiger cat) and the Elementalist (long blue hair, blue robes, orbs of fire, water, earth and wind). The Doctor and the Titan, wounded, look up in surprise. Epic, hopeful-yet-dangerous mood.`
10. `Scene: dawn over a wasteland of ash. Monstrous primeval horrors loom in grey wind: a giant sword-stained war god, a floating void eye, a skeletal Death with a scythe and a dark archangel. The Mystic orders a retreat; archers' arrows and glowing spirits hold the line while the Summoner, the Doctor and the Titan fall back with wounded soldiers. In the distance the great World Tree bears a burning scar. Pale gold dawn breaking through the ash clouds. Grim, tragic, epic mood.`

## 4장 「뒷면」 (8컷, `art/스토리/4장/`)

참고 그림: 악의 사도 `악의 사도/apostle-1.png` · 역병의사 `역병의사/plague-1.png` · 학살자 `학살자/slayer-1.png` · 사멸 `사멸/samyeol-1.png` · 이터 `이터/eater-1.png` · 장수 `장수/general-1.png` · 풋내기 `풋내기/novice-1.png` · 갓이터 `public/sprites/enemies/godeater.png`

| 컷 | 문단 | 참고 그림 | 장면 |
| --- | --- | --- | --- |
| 1 | 1~5 | 악의 사도 | 빛 없는 의식의 방, 무릎 꿇은 사도, 한꺼번에 흔들리는 촛불, 정체 모를 목소리 |
| 2 | 6~14 | 악의 사도·역병의사·학살자·사멸 | 명을 내리는 사도 앞의 세 사람, 콧노래 부르며 달려 나가는 학살자 |
| 3 | 15~23 | 장수·풋내기·사멸·악의 사도 | 응접실 연회, 웃으며 잔을 드는 장수, 사멸에게 귓속말하는 사도 |
| 4 | 24~29 | 이터·악의 사도 | 쇠사슬에 묶여 몸부림치는 이터, 천장에서 내려앉는 황금 깃털 |
| 5 | 30~39 | 이터·악의 사도·장수 + 갓이터 | 이터를 찢고 일어선 거대한 검은 잔영(갓이터), 연기 속 대검에 꽂힌 두 장군 |
| 6 | 40~48 | 악의 사도·이터 | 새벽 빈 공터, 잔해 아래 꿈틀거리는 이터, 잠깐 사람의 눈빛 |
| 7 | 49~52 | 사멸·역병의사·학살자·악의 사도 | 돌아온 사멸·역병의사, 피투성이로 웃는 학살자, 만족한 사도 |
| 8 | 53~60 | — | 아카식 레코드의 어딘가, 얼굴이 보이지 않는 세 관찰자가 떨어지는 검은 불꽃을 내려다봄 |

### 4장 컷별 장면 (영어, [공통] 뒤에 붙임)

1. `Scene: a lightless ritual chamber deep inside the desert empire of Helios, black stone walls carved with forbidden runes, a circle of tall candles. The Apostle of Malice (long silver-white hair, red eyes, white and red ornate nun-like robes with crosses, holding a red cross staff) kneels in worship before an empty dark altar. A shapeless, distorted presence like glitching black static fills the air above the altar, and every candle flame bends at once toward it. Dark, sacred, eerie mood.`
2. `Scene: a grand corridor of the Helios palace outside the ritual chamber, golden sandstone pillars in deep shadow. The Apostle of Malice gives orders to three servants: the Plague Doctor (bird-beak mask with green glass eyes, wide black hat, tattered black coat, swinging censer leaking green smoke), the Slayer (long dark hair with red streaks, black gothic dress, red rose, huge scythe, wild grin) and Samyeol (black hair in an elegant updo, purple eyes, purple dress, green-tipped poison claw needles). The Slayer is already running off cheerfully, humming. Cold, conspiratorial mood.`
3. `Scene: a lavish golden reception room in Helios at night, cushions, lanterns and wine. The General of Ascalon (dark crimson armor, helmet with a tall red plume) laughs loudly, raising his cup with two other armored generals; the young Novice (light brown hair, simple beige clothes, bandaged fists) sits awkwardly at the end. Samyeol in her purple dress smiles politely as hostess, while behind her the Apostle of Malice leans in to whisper secretly into her ear. Warm on the surface, hidden menace underneath.`
4. `Scene: the ritual chamber at midnight. The Eater, a hulking black shadow beast with claws, bone-white spikes and glowing red eyes, is bound by heavy iron chains to the floor, thrashing and screaming. The Apostle of Malice watches with a satisfied smile. From a crack in the closed ceiling a single radiant golden feather, divine and out of place, drifts slowly down into the dark, lighting the room. Ominous, holy-yet-horrifying mood.`
5. `Scene: an explosion of black smoke as a colossal dark figure rises, tearing out of the Eater's body: the Godeater, a towering shadow with a tattered dark purple cloak, a golden crown, glowing red eyes and a red gem on its chest. The Apostle of Malice laughs with arms spread wide. Through the thick smoke two Ascalon generals in armor who rushed in are struck by enormous greatswords appearing in a flash of light (no gore, dramatic silhouettes). Terrifying, climactic mood.`
6. `Scene: grey dawn over an empty, ruined clearing littered with broken stone and scorched ground. The Apostle of Malice looks around with a disappointed frown, then notices movement under the rubble: the Eater, a battered black shadow creature, crawls out, and for one moment a faint, sorrowful human gaze flickers in its eyes before turning red again. Quiet, tragic, chilling mood.`
7. `Scene: morning light in the ruined clearing. Samyeol and the Plague Doctor return calmly through drifting green smoke, and behind them the Slayer, battered and covered in dust and red stains (no gore), laughs wildly with her scythe on her shoulder, thrilled by the fight. The Apostle of Malice greets them with a pleased smile, the recovered Eater crouching at his feet. Villainous, triumphant mood.`
8. `Scene: somewhere inside the Akashic Record, an endless cosmic library of floating glowing books, star maps and golden threads of fate. Three mysterious watchers seen only as tall cloaked silhouettes with their faces hidden in shadow stand on a floating platform, looking down through a window of light at a falling black flame. Mystical, solemn, ominous mood.`

## 5장 「원군」 (10컷, `art/스토리/5장/`)

참고 그림(`art/캐릭터/…-1.png`): 장로 `장로` · 추적자 `추적자` · 방랑객 `방랑객` · 영사 `영사` · 잔영 `잔영` · 장수 `장수` · 풋내기 `풋내기` · 비르디아 `이드라`·`변희`·`플라이`·`렌`·`정령사` · 테라코어 `오토마타`·`라이더`·`붐버`·`아티팩터`·`펑크` · 괴력난신 `public/sprites/enemies/demigod.png`
세 왕은 게임 그림이 없음 → 아래 생김새 문장으로 그리고, 처음 나온 컷 1 그림을 뒤 컷(9·10)에 참고 그림으로 같이 올려 얼굴을 맞춤

| 컷 | 문단 | 참고 그림 | 장면 |
| --- | --- | --- | --- |
| 1 | 1~10 | — | 거대한 왕홀의 둥근 탁자, 세 나라 왕, 패왕전을 앞당기자는 테라코어 왕 |
| 2 | 11~20 | 장로 + 컷 1 | 망설이는 비르디아 왕의 머릿속으로 흘러드는 장로의 사념 |
| 3 | 21~23 | 장로 + 컷 1 | 상처 입은 세계수 아래, 정예를 불러 모으라는 비르디아 왕 |
| 4 | 24~29 | — | 테라코어 거리, 패왕전을 외치는 시민들 사이를 지나가는 로브 쓴 사람 |
| 5 | 30~43 | 장수·추적자·방랑객·영사·잔영·풋내기 | 아스칼론 대기실, 투닥이는 장수와 방랑객, 벽에 기댄 로브 쓴 사람 |
| 6 | 44~52 | 장수·풋내기 | 패왕전 개막, 거대한 화면의 룰렛 '사냥', 환호하는 관중석 |
| 7 | 53~67 | 비르디아 다섯·테라코어 다섯 (많으면 나눠서 대표만) | 우거진 숲 곳곳에 내려서는 세 진영 정예 |
| 8 | 68~78 | 괴력난신·방랑객·장수·풋내기 | 숲 한가운데 떨어진 거대한 구덩이, 팔짱 낀 괴력난신 |
| 9 | 79~93 | 괴력난신 + 컷 1 | 귀빈석 앞 괴력난신, 테라코어 왕이 내민 검은 불꽃이 일렁이는 천 조각 |
| 10 | 94~97 | 괴력난신 + 컷 1 | 세 나라가 처음으로 같은 깃발 아래 모인 연합 |

### 5장 컷별 장면 (영어, [공통] 뒤에 붙임)

1. `Scene: a vast royal hall with towering pillars, a huge round stone table in the center under a high dome. Three kings sit around it: the King of Terracore (older man, grey beard, bronze mechanical crown with gears, brown and bronze robe with brass ornaments), the King of Ascalon (stern middle-aged man, short dark red hair, golden crown, crimson and gold armor-robe, sword at his side) and the King of Virdia (slender man with long pale green hair, crown of living leaves and white flowers, flowing green and white robe). The King of Terracore leans forward, proposing something serious; the other two sit in cold, tense silence. Heavy political mood.`
2. `Scene: the same royal round table. Close on the King of Virdia (long pale green hair, leaf crown, green and white robe) frowning deep in thought, while a glowing green thread of telepathic light flows into his mind from a faint ghostly image of the Elder (long white hair and beard tied up, green robe, wooden staff with a green gem) appearing beside him like a vision. The other two kings blurred in the background. Quiet, mystical, decisive mood.`
3. `Scene: the Virdia kingdom under the giant World Tree at evening, its trunk bearing a huge dark burned scar. The King of Virdia (leaf crown, green and white robe) gives an order to the Elder (white hair and beard, green robe, staff), who bows. Glowing leaves drift down, roots and small spirit lights around. Somber, hopeful mood.`
4. `Scene: a bustling street of the machine nation Terracore, brass buildings, pipes, steam and glowing signs. A town crier waves a poster shouting about the King's Tournament, citizens gather and argue. Through the crowd walks a silent mysterious figure in a deep hooded robe, face hidden in shadow. Lively but mysterious mood.`
5. `Scene: the Ascalon waiting room at the tournament arena, wooden benches, weapons racks, banners. The General (long brown hair, crimson armor with a red hooded cape, spear) argues comically with the Wanderer (wide straw hat, navy kimono-like coat, red sash, katana). The Tracker (wavy brown hair, green hooded cloak, rifle) smiles calmly, Silk (long wavy crimson hair, elegant black and red dress, threads of magic) laughs, the Remnant (purple hood, silver hair, black mask, twin daggers) rolls his eyes, and the Novice (light brown hair, beige clothes, bandaged fists) tries to calm everyone. In the far left corner, a mysterious figure in a deep hooded robe leans silently against the wall. Comedic yet mysterious mood.`
6. `Scene: a giant open-air tournament arena packed with roaring crowds, banners of three nations. A huge floating screen shows a spinning roulette landing on a hunting symbol (a bow and a forest icon, no letters). An energetic referee shouts into a magic megaphone. In a box seat the General (crimson armor, red hooded cape) and the Novice look worried. Exciting, festive mood.`
7. `Scene: a dense, lush forest arena seen from above at the moment the contestants land. Virdia's elites: Idra (long leafy green hair with flowers, nature dress), Byeonhui (wild red hair, tribal outfit), Fly (blue hair, large translucent blue insect wings), Ren (green hooded robe, floating stones) and the Spiritist (long navy hair, white and navy robe, small spirits). Terracore's elites: Automata (silver hair, white and blue mechanical dress), Rider (black hair, goggles, blue motorcycle), Bomber (spiky red hair, goggles, orange scarf), Artifacter (silver hair, dark coat, glowing gauntlets) and Punk (pink and blue hair, punk outfit, claws). They drop into different clearings, ready to hunt. Dynamic, competitive mood.`
8. `Scene: the forest arena just after a huge impact: a massive crater with dust billowing everywhere, trees bent outward. In the center stands the Demigod with arms crossed and a wild grin: a muscular giant man with long flowing white hair, golden horns, bare chest with red war paint markings, red belt with a gold buckle, black baggy pants. At the crater's edge the Wanderer draws his katana angrily, the General grips his spear, and the Novice, wide-eyed, points and warns that he is an ancient god. Explosive, awe-struck mood.`
9. `Scene: the royal box of the arena. The Demigod (long white hair, golden horns, muscular bare chest with red markings) has leapt up and stands before the three kings. The King of Terracore (grey beard, bronze gear crown) holds out a scrap of black cloth whose edge burns with a faint, unquenchable black flame. The Demigod stares down at it with a suddenly serious face; the Kings of Ascalon and Virdia look at Terracore's king in shock. The crowd below frozen. Tense, grave mood.`
10. `Scene: sunrise over the arena and forest. For the first time, the banners of Ascalon (crimson), Virdia (green) and Terracore (bronze) are bound together under one new alliance flag raised high. The Demigod stands at the front with arms crossed, the three kings behind him, and the gathered champions of all three nations below look up at the flag. Hopeful, solemn, epic mood.`

## 6~9장

🔸 2장처럼 장마다 컷 목록·프롬프트를 이어서 씀 (그 전에는 장 하나에 임시 배경 하나)
