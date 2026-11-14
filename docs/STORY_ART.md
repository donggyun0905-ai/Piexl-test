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
6. `The Apostle of Heaven is EXACTLY the girl in the Apostle reference image: same face, same very long wavy silver-white hair, same red eyes, same hooded veil with a big flower ornament and ribbons, same ornate cross staff with dangling red gems. The ONLY change: recolor her outfit, hood and ribbons from black and red to pure white and gold. Not blonde, not a boy, not a different person. Scene: a battered prison hall after a long fight. Lunatic kneels, exhausted and wounded, gripping her rapier. The purple-skinned horned demon raises its hand to finish her, but a wall of golden barrier light slams down between them. Beyond the barrier stands the Apostle of Heaven in her white and gold hooded robe, holding her cross staff, calm and serious. Holy golden light against purple darkness.`
7. `The Apostle of Heaven is EXACTLY the girl in the Apostle reference image: same face, same very long wavy silver-white hair, same red eyes, same hooded veil with a big flower ornament and ribbons, same ornate cross staff with dangling red gems. The ONLY change: recolor her outfit, hood and ribbons from black and red to pure white and gold. Not blonde, not a boy, not a different person. Scene: the Brawler (wild red hair, red headband, short martial arts outfit, bandaged fists) blocks the demon's purple-clawed hand with her bare fist, wincing in pain, while carrying the wounded Lunatic (long lavender-silver ponytail, crescent moon ornament, white and navy armored dress; not hooded, not in black) over her shoulder into a tunnel. The purple-skinned horned demon ignores them and stares with a slow, interested smile at the Apostle of Heaven behind the golden barrier.`
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
6. `The Apostle of Heaven is EXACTLY the girl in the Apostle reference image: same face, same very long wavy silver-white hair, same red eyes, same hooded veil with a big flower ornament and ribbons, same ornate cross staff with dangling red gems. The ONLY change: recolor her outfit, hood and ribbons from black and red to pure white and gold. Not blonde, not a boy, not a different person. Scene: a battered prison hall after a long fight. Lunatic kneels, exhausted and wounded, gripping her rapier. The purple-skinned horned demon raises its hand to finish her, but a wall of golden barrier light slams down between them. Beyond the barrier stands the Apostle of Heaven in her white and gold hooded robe, holding her cross staff, calm and serious. Holy golden light against purple darkness.`
7. `The Apostle of Heaven is EXACTLY the girl in the Apostle reference image: same face, same very long wavy silver-white hair, same red eyes, same hooded veil with a big flower ornament and ribbons, same ornate cross staff with dangling red gems. The ONLY change: recolor her outfit, hood and ribbons from black and red to pure white and gold. Not blonde, not a boy, not a different person. Scene: the Brawler (wild red hair, red headband, short martial arts outfit, bandaged fists) blocks the demon's purple-clawed hand with her bare fist, wincing in pain, while carrying the wounded Lunatic (long lavender-silver ponytail, crescent moon ornament, white and navy armored dress; not hooded, not in black) over her shoulder into a tunnel. The purple-skinned horned demon ignores them and stares with a slow, interested smile at the Apostle of Heaven behind the golden barrier.`
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
6. `The Apostle of Heaven is EXACTLY the girl in the Apostle reference image: same face, same very long wavy silver-white hair, same red eyes, same hooded veil with a big flower ornament and ribbons, same ornate cross staff with dangling red gems. The ONLY change: recolor her outfit, hood and ribbons from black and red to pure white and gold. Not blonde, not a boy, not a different person. Scene: a battered prison hall after a long fight. Lunatic kneels, exhausted and wounded, gripping her rapier. The purple-skinned horned demon raises its hand to finish her, but a wall of golden barrier light slams down between them. Beyond the barrier stands the Apostle of Heaven in her white and gold hooded robe, holding her cross staff, calm and serious. Holy golden light against purple darkness.`
7. `The Apostle of Heaven is EXACTLY the girl in the Apostle reference image: same face, same very long wavy silver-white hair, same red eyes, same hooded veil with a big flower ornament and ribbons, same ornate cross staff with dangling red gems. The ONLY change: recolor her outfit, hood and ribbons from black and red to pure white and gold. Not blonde, not a boy, not a different person. Scene: the Brawler (wild red hair, red headband, short martial arts outfit, bandaged fists) blocks the demon's purple-clawed hand with her bare fist, wincing in pain, while carrying the wounded Lunatic (long lavender-silver ponytail, crescent moon ornament, white and navy armored dress; not hooded, not in black) over her shoulder into a tunnel. The purple-skinned horned demon ignores them and stares with a slow, interested smile at the Apostle of Heaven behind the golden barrier.`
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
6. `The Apostle of Heaven is EXACTLY the girl in the Apostle reference image: same face, same very long wavy silver-white hair, same red eyes, same hooded veil with a big flower ornament and ribbons, same ornate cross staff with dangling red gems. The ONLY change: recolor her outfit, hood and ribbons from black and red to pure white and gold. Not blonde, not a boy, not a different person. Scene: a battered prison hall after a long fight. Lunatic kneels, exhausted and wounded, gripping her rapier. The purple-skinned horned demon raises its hand to finish her, but a wall of golden barrier light slams down between them. Beyond the barrier stands the Apostle of Heaven in her white and gold hooded robe, holding her cross staff, calm and serious. Holy golden light against purple darkness.`
7. `The Apostle of Heaven is EXACTLY the girl in the Apostle reference image: same face, same very long wavy silver-white hair, same red eyes, same hooded veil with a big flower ornament and ribbons, same ornate cross staff with dangling red gems. The ONLY change: recolor her outfit, hood and ribbons from black and red to pure white and gold. Not blonde, not a boy, not a different person. Scene: the Brawler (wild red hair, red headband, short martial arts outfit, bandaged fists) blocks the demon's purple-clawed hand with her bare fist, wincing in pain, while carrying the wounded Lunatic (long lavender-silver ponytail, crescent moon ornament, white and navy armored dress; not hooded, not in black) over her shoulder into a tunnel. The purple-skinned horned demon ignores them and stares with a slow, interested smile at the Apostle of Heaven behind the golden barrier.`
8. `Scene: the forest arena just after a huge impact: a massive crater with dust billowing everywhere, trees bent outward. In the center stands the Demigod with arms crossed and a wild grin: a muscular giant man with long flowing white hair, golden horns, bare chest with red war paint markings, red belt with a gold buckle, black baggy pants. At the crater's edge the Wanderer draws his katana angrily, the General grips his spear, and the Novice, wide-eyed, points and warns that he is an ancient god. Explosive, awe-struck mood.`
9. `Scene: the royal box of the arena. The Demigod (long white hair, golden horns, muscular bare chest with red markings) has leapt up and stands before the three kings. The King of Terracore (grey beard, bronze gear crown) holds out a scrap of black cloth whose edge burns with a faint, unquenchable black flame. The Demigod stares down at it with a suddenly serious face; the Kings of Ascalon and Virdia look at Terracore's king in shock. The crowd below frozen. Tense, grave mood.`
10. `Scene: sunrise over the arena and forest. For the first time, the banners of Ascalon (crimson), Virdia (green) and Terracore (bronze) are bound together under one new alliance flag raised high. The Demigod stands at the front with arms crossed, the three kings behind him, and the gathered champions of all three nations below look up at the flag. Hopeful, solemn, epic mood.`

## 6장 「황혼의 종언」 (12컷, `art/스토리/6장/`)

151문단이라 12컷. 참고 그림: 5장 사람들(`art/캐릭터/…-1.png`) + 잊혀진 자 `잊혀진 자/forgotten-1.png` · 제천대성 `public/sprites/enemies/sage.png` · 검신 `swordgod.png` · 파멸의 용 `art/최종보스/멸망의 용/boss-dragon.png` · 갓이터 `godeater.png` · 태초 `plight.png`·`pdark.png` · 색욕의 대악마(검은 인영) `asmodeus.png` (얼굴은 어둠에 가림)

| 컷 | 문단 | 참고 그림 | 장면 |
| --- | --- | --- | --- |
| 1 | 1~11 | 괴력난신·추적자·이드라·아티팩터 + 5장 컷 10 | 연합 본진에 모인 세 나라 정예, 떨어져 선 로브 쓴 사람 |
| 2 | 12~18 | 괴력난신·펑크 | 모래에 반쯤 묻힌 고대 왕국 세레스티아, 바닥에 주먹을 쏟아붓는 괴력난신 |
| 3 | 19~36 | 괴력난신·제천대성 | 구멍에서 솟구친 거대한 봉, 괴력난신과 제천대성의 싸움, 물러나 지켜보는 정예 |
| 4 | 37~45 | 제천대성·잊혀진 자 | 로브가 벗겨지며 드러난 빛을 머금은 공주 에스텔 |
| 5 | 46~48 | 제천대성·잊혀진 자 | 부서진 성문 안, 빛나는 성물 '원초의 진금'을 건네받는 에스텔 |
| 6 | 49~70 | 갓이터·태초·파멸의 용·검은 인영·제천대성·괴력난신 | 모래 언덕 너머 일행을 에워싼 그림자들, 손을 든 검은 인영 |
| 7 | 71~86 | 방랑객·추적자·영사·잔영·잊혀진 자·갓이터 | 아스칼론 대 갓이터, 손짓 하나로 대검의 마법을 멈춘 잊혀진 자 |
| 8 | 87~102 | 변희·이드라·플라이·태초·검신 | 비르디아 대 태초, 몰려드는 몬스터, 플라이를 노리는 검신 |
| 9 | 103~114 | 장로·렌·정령사·이드라·태초 | 진법의 문에서 뛰어나온 렌·정령사, 부서진 태초의 허상, 하늘의 진짜 태초 |
| 10 | 115~135 | 펑크·라이더·붐버·아티팩터·파멸의 용 | 테라코어 대 파멸의 용, 거대한 방패로 브레스를 막는 펑크, 폭격 |
| 11 | 136~145 | 괴력난신·제천대성·오토마타·파멸의 용 | 연옥 같은 브레스, 로더 빛 속에 사라지는 정예들, 앞을 막는 거대한 봉 |
| 12 | 146~151 | 제천대성·검은 인영 | 모래 위 홀로 남은 제천대성, 황혼 속 사라져 가는 땅 |

### 6장 컷별 장면 (영어, [공통] 뒤에 붙임)

1. `Scene: the courtyard of the new alliance headquarters, banners of Ascalon (crimson), Virdia (green) and Terracore (bronze) side by side. The Demigod (muscular giant, long white hair, golden horns, bare chest with red markings) shouts orders. Before him stand the elites: the Tracker, the Wanderer, Silk and the Remnant of Ascalon; Idra, Byeonhui, Fly, the Elder, Ren and the Spiritist of Virdia; Artifacter, Punk, Automata, Rider and Bomber of Terracore. A little apart stands a silent figure in a deep hooded robe. Determined, gathering-before-the-journey mood.`
2. `Scene: a vast desert where the ruins of an ancient kingdom, Celestia, lie half buried in sand: broken white towers, colossal statues, a sunken throne hall. The Demigod pounds the sandy floor with a storm of fists, sand exploding upward in waves, a deep hole opening. Punk and the other elites shield their eyes from the blast at a distance. Epic, adventurous mood.`
3. `Scene: from the hole in the sand a giant red-and-gold staff shoots out like a pillar. Out leaps the Great Sage, an original monkey warrior in golden armor and a red cape riding a small golden cloud, wielding a long red staff with golden ends. He and the Demigod clash in mid-air with grinning faces, shockwaves blasting sand in rings, while the elites watch from far away, stunned. Wild, joyful battle mood.`
4. `Scene: in the ruined throne hall, the hooded figure's robe falls away, revealing Estelle, the Forgotten One: a gentle young woman with very long wavy silver-white hair, golden eyes, a golden laurel circlet with a blue gem, white and gold ancient princess dress, her face glowing with soft light. The Great Sage (monkey warrior, golden armor, red cape, red staff) stares at her in shock; the Demigod raises his eyebrows. Moving, revelatory mood.`
5. `Scene: the Great Sage smashes open a massive ancient sealed gate with his staff. Inside, on an altar, floats a radiant sacred relic, the Primordial True Gold Core, a glowing golden crystal heart with orbiting runes. Estelle (silver-white hair, golden laurel circlet, white and gold dress) receives it in her hands, bowing in gratitude. Golden light fills the dusty hall. Sacred, hopeful mood.`
6. `The Apostle of Heaven is EXACTLY the girl in the Apostle reference image: same face, same very long wavy silver-white hair, same red eyes, same hooded veil with a big flower ornament and ribbons, same ornate cross staff with dangling red gems. The ONLY change: recolor her outfit, hood and ribbons from black and red to pure white and gold. Not blonde, not a boy, not a different person. Scene: a battered prison hall after a long fight. Lunatic kneels, exhausted and wounded, gripping her rapier. The purple-skinned horned demon raises its hand to finish her, but a wall of golden barrier light slams down between them. Beyond the barrier stands the Apostle of Heaven in her white and gold hooded robe, holding her cross staff, calm and serious. Holy golden light against purple darkness.`
7. `The Apostle of Heaven is EXACTLY the girl in the Apostle reference image: same face, same very long wavy silver-white hair, same red eyes, same hooded veil with a big flower ornament and ribbons, same ornate cross staff with dangling red gems. The ONLY change: recolor her outfit, hood and ribbons from black and red to pure white and gold. Not blonde, not a boy, not a different person. Scene: the Brawler (wild red hair, red headband, short martial arts outfit, bandaged fists) blocks the demon's purple-clawed hand with her bare fist, wincing in pain, while carrying the wounded Lunatic (long lavender-silver ponytail, crescent moon ornament, white and navy armored dress; not hooded, not in black) over her shoulder into a tunnel. The purple-skinned horned demon ignores them and stares with a slow, interested smile at the Apostle of Heaven behind the golden barrier.`
8. `Scene: Virdia's battle against the Primeval Light and Darkness in a sea of swarming monsters. Byeonhui shifts between a wolf, a bear and an eagle tearing through monsters; Idra draws a giant bow of living wood shooting a huge arrow of nature magic; the Primeval's white and black beams erase it. Fly (blue hair, translucent wings) dives at the Primeval's back but is blocked by the Sword God (a tall white-robed swordsman with a blue sash and many floating blades). Chaotic, desperate mood.`
9. `Scene: the Elder (white hair and beard, green robe, staff) opens glowing circular magic formation gates on both sides of the Primeval; Ren (green hooded robe, floating boulders) and the Spiritist (long navy hair, small spirits) leap out and strike with a huge earth spike and spirit blasts. The struck Primeval shatters like glass, revealing it was only an illusion; high above in the sky the real sun and moon orbs gather a gigantic compressed sphere of white and black energy. Idra looks up in horror. Shocking, dramatic mood.`
10. `Scene: Terracore's battle against the Dragon of Ruin. The crimson dragon breathes a massive fiery breath; Punk (pink and blue hair, punk outfit) holds up a giant glowing pulse shield blocking it head on. Rider (black hair, goggles) blasts under the dragon's belly on his blue motorcycle with a huge impact, Bomber (spiky red hair, goggles, orange scarf) rains down a carpet of explosive bombs as the dragon takes off, and Artifacter (silver hair, glowing gauntlets) shouts directions. Explosive, heroic action mood.`
11. `Scene: the Dragon of Ruin opens its jaws and an unbearable white-hot light gathers, forming a purgatory of flame across the sky. The Great Sage plants his staff, now grown to colossal size, as a wall in front of the elites, shattering every attack. Behind it, the elites and the Demigod activate glowing teleport loaders that Automata (silver hair, white and blue mechanical dress) secretly placed, disappearing one by one in pillars of blue light. Desperate, heroic escape mood.`
12. `Scene: twilight over the desert. The Great Sage stands alone on the sand with his staff on his shoulder, grinning defiantly at the dark shadowy figure with faint purple flame before him. Behind them the ancient ruins of Celestia are crumbling and sinking into the earth amid tremors and dust, under a blood-orange setting sun. Lonely, heroic, tragic mood.`

## 덤: 아직 예전 도트인 보스 그림 (스토리 그림 만들 때 같이)

> ✅ 2026-11-14 21종 모두 새 그림으로 바꿈 (0.52.101, 원본 `scripts/art/src/boss-{영문}.png` · 제천대성은 `import_sage.py` · 검은 짐승은 `dark_beasts.py` · 데스웜 공중 온몸 `boss-sandworm_jump.png`). 아래는 다시 만들 때 쓰는 문장
> (처음 확인 2026-11-14: 아래 보스는 아직 처음의 작은 코드 도트 그림 (새 그림이 들어간 보스: 무리 여왕·멸망의 용·쌍둥이·지옥문 수문장·달을 삼키는 자·켈베로스·레비아탄·아스모데우스 등))
> 결과 PNG는 `scripts/art/src/boss-{영문 이름}.png`로 올리면 Claude가 `import_boss.py`로 게임에 넣음 (2×2 네 모습 → 게임 시트)

**첫 메시지에 같이 붙일 보스 규칙** (화풍 기준 = 무리 여왕 `scripts/art/src/boss-brood.png` 첨부, 정사각형 1:1 · 2k):

```
Boss sprite sheet rules (for "Boss:" requests): square 1:1 image, pure black background (#000000), no floor shadow, no text, no grid lines, no border. A 2x2 grid of the SAME boss in 4 poses, all facing right: top-left = walk 1, top-right = walk 2 (other foot), bottom-left = attack wind-up, bottom-right = attack. Each pose fills most of its quarter but never crosses into another quarter (wings, tails, weapons and attack effects included). Same size, same face, colors and gear in all 4; feet on the same line (floating bosses: body centers at the same height). Match the first reference image's pixel art style: bold dark outlines, saturated colors, clear shading, crisp square pixels, no blur. Big readable color shapes for a dark game floor. Majestic and menacing; female bosses beautiful but not revealing. Original design.
```

컷과 섞지 않게 보스는 한 장씩 따로: `Boss: {영어 문장}` 으로 보냄. 지금 게임 그림(`apps/client/public/sprites/enemies/{영문}.png`)을 같이 올리면 모양을 이어 받음

| 영문 파일 | 보스 | 보낼 문장 |
| --- | --- | --- |
| knight | 검은 기사 | `Boss: Black Knight — horned helmet with glowing red eye slit, black plate armor, red cape, huge greatsword. Wind-up = sword raised overhead · attack = downward slash.` |
| archer | 얍삽한 활잡이 | `Boss: Sly Archer — green hooded cloak, glowing green eyes inside the hood, big bow and quiver. Wind-up = drawing the bowstring · attack = arrow released.` |
| siren | 세이렌 | `Boss: Siren — mermaid with long pink hair and a sky-blue tail, floating music notes. Wind-up = gathering a song · attack = shooting music notes.` |
| centaur | 켄타우로스 | `Boss: Centaur — bull-horned helmet and plate-armored upper body, brown horse body with red barding, long lance. Wind-up = rearing with lance pulled back · attack = charging thrust.` |
| plant | 하드플랜트 | `Boss: Hard Plant — layered crimson petals, a mouth full of teeth in the center, thorny stem and leaves. Wind-up = petals closing · attack = mouth opened wide.` |
| reaper | 데스 | `Boss: Death — goddess of death with silver hair and a pale face, black and purple dress, huge scythe. Wind-up = scythe pulled back · attack = full spinning slash.` |
| swordgod | 검신 | `Boss: Sword God — white-haired goddess of blades, white and gold armored dress with a blue sash, many swords floating behind her. Wind-up = swords glowing · attack = sword waves flying.` |
| archangel | 천사장 | `Boss: Archangel — six-winged angel, white robes with gold ornaments, golden halo, spear of light. Wind-up = gathering light · attack = pillar of light.` (이어서 `Boss: Archangel's Tower — white and gold pillar tower, one normal and one glowing version side by side.`) |
| godeater | 갓이터 | `Boss: Godeater — towering shadow king in a tattered dark purple cloak, golden crown, glowing red eyes, red gem on the chest, clawed hands. Wind-up = both arms spread · attack = smashing down.` (이어서 `Boss: Ruin Blade — a giant crimson greatsword, 4 poses floating and spinning` · `Boss: Chaos Blade — a giant violet greatsword, 4 poses floating and spinning`) |
| plight | 태초의 빛 | `Boss: Primeval Light — a radiant white and gold sun-like being with a calm face and rays of light, 4 poses pulsing and flaring.` |
| pdark | 태초의 어둠 | `Boss: Primeval Darkness — a black sphere wrapped in violet tentacle-like aura with glowing purple eyes, 4 poses pulsing and lashing.` |
| toad | 늪의 두꺼비 왕 | `Boss: Swamp Toad King — giant green toad wearing a golden crown. Wind-up = crouching low · attack = leaping slam.` |
| salamander | 불도롱뇽 | `Boss: Fire Salamander — burning orange salamander with lava patterns on its back. Wind-up = flames rising · attack = fiery charge.` |
| jelly | 번개 해파리 | `Boss: Thunder Jellyfish — huge sky-blue jellyfish with electric tentacles. Wind-up = sparks gathering · attack = lightning burst.` |
| captain | 유령선 선장 | `Boss: Ghost Ship Captain — wide captain hat, teal ghostly skin, long navy coat, cutlass and anchor. Wind-up = anchor swung back · attack = anchor thrown.` |
| umbra | 검은 잔영 | `Boss: Black Remnant — a black wraith with red eyes and a flowing shadow body, 4 poses drifting and lunging.` |
| sandworm | 데스웜 | `Boss: Death Worm — giant sand worm with a round mouth full of teeth. Wind-up = rising out of the sand · attack = lunging bite.` (이어서 검은 모습: `Boss: Death Worm, dark corrupted version, black body with red glow`) |
| scorpion | 거대 전갈 | `Boss: Giant Scorpion — huge scorpion with red armored shell and a venom stinger tail. Wind-up = tail raised · attack = sting.` (이어서 검은 모습) |
| roc | 거대 매 | `Boss: Giant Hawk — huge hawk with brown feathers. Wind-up = wings spread · attack = diving claw strike.` (이어서 검은 모습) |
| demigod | 괴력난신 | `Boss: Demigod of Wild Might — tall muscular demigod man, long white hair, golden horns, bandaged bare fists, red war markings on the bare chest, red belt, black baggy pants. Wind-up = raising both hands gathering power · attack = straight punch.` |
| sage | 제천대성 | `Boss: Great Sage — original golden-furred monkey demigod, golden circlet with two tall feathers, golden scale armor, red cape, long red staff with gold ends, riding a small golden cloud. Wind-up = staff raised · attack = staff swing.` (이어서 `Boss: the golden cloud alone, 4 poses drifting`) |

- 스토리에 나오는 보스(갓이터·태초·괴력난신·제천대성·검신·천사장·데스)부터 하면 스토리 그림과 모습이 같아짐
- 장면 그림을 만들 때, 먼저 만든 새 보스 그림을 참고 그림으로 올리면 장면 속 모습도 맞춰짐

## 7장 「시작」 (8컷, `art/스토리/7장/`)

72문단이라 8컷. 시대는 과거(악의 사도가 아직 '천의 사도'였던 때). 참고 그림: 새벽의 성흔(`art/캐릭터/{블루플레임·헬피스트·인시전·크루세이더·블래스트·루나틱}/`, 걷기 시트) · 격투가 `격투가/brawler-1.png` · 천의 사도 = 악의 사도 `악의 사도/apostle-1.png`(**여자아이 · 얼굴·은발·꽃 두건·십자가 지팡이는 그대로, 옷 색만 흰·금**) · 아스모데우스의 화신체 `art/최종보스/아스모데우스의 화신체/보랏빛 화염의 악마 마법사 5연속 컷.png`(보라 피부·뿔)

| 컷 | 문단 | 참고 그림 | 장면 |
| --- | --- | --- | --- |
| 1 | 1~8 | 아스모데우스 | 빛 없는 지하 감옥, 쇠사슬에 묶여 매달린 악마, 철창 밖 사냥꾼들의 그림자 |
| 2 | 9~21 | 블루 플레임·헬피스트·아스모데우스 | 가장 깊은 감방을 지키는 두 사람, 푸른 불꽃에 비친 보랏빛 기운, 터지는 굉음 |
| 3 | 22~32 | 인시전·크루세이더·블래스트·블루 플레임·헬피스트 | 끊어진 사슬과 무너진 벽, 쓰러진 두 사람에게 달려온 세 사냥꾼 |
| 4 | 33~38 | 인시전·아스모데우스 | 등 뒤에서 심장을 노린 보랏빛 건틀릿을 쌍도끼로 쳐 내는 인시전 |
| 5 | 39~49 | 루나틱·아스모데우스·크루세이더·블래스트·인시전 | 달빛 궤적으로 내리꽂힌 레이피어, 옷자락을 벗어 던진 화신체, 퇴각하는 대원들 |
| 6 | 50~59 | 루나틱·아스모데우스·악의 사도(흰 옷) | 지친 루나틱 앞을 가른 황금 결계, 흰 사제복의 천의 사도 |
| 7 | 60~65 | 격투가·루나틱·아스모데우스·악의 사도(흰 옷) | 맨주먹으로 화신체의 손을 받아 낸 격투가가 루나틱을 메고 달아남, 사도를 바라보는 화신체 |
| 8 | 66~72 | 악의 사도(흰 옷) | 입가로 스며드는 보랏빛 오라, 심장을 움켜쥐고 무릎 꿇은 사도, 달려오는 병사들 |

### 7장 컷별 장면 (영어, [공통] 뒤에 붙임)

1. `Scene: a lightless underground prison deep beneath the edge of an empire. A demon hangs from the ceiling, bound tightly in heavy iron chains: purple skin, curved horns, head lowered, a faint purple glow leaking from it. Beyond the iron bars, the long shadows of demon hunters holding weapons and a cold silver light from their crescent-moon stigmata marks. Damp stone, dripping water, oppressive dark mood.`
2. `Scene: the deepest cell of the hunters' prison. Two guards stand before the chained demon: Blue Flame (messy dark navy hair, blindfold, black and blue robes, blue flames flickering around him) and Hellfist (messy silver hair, red eyes, open black coat, his bandaged left arm hidden behind his back, a demonic red arm under the bandage). In Blue Flame's blue fire the chained demon glows a strange purple. Suddenly the back wall bursts with a loud explosion of dust and purple light; both turn in shock.`
3. `Scene: a ruined prison corridor: broken chains on the floor, a collapsed wall, dust in the air. Blue Flame and Hellfist lie wounded and bloody on the ground. Three hunters rush in from the corridor: Incision (wild cream-white hair with red ribbons, black fur-collared armor, red cape, twin axes), Crusader (giant armored knight with a spiked crown helmet, white fur, red cape, a huge cross as a weapon) and Blast (long white ponytail streaked red, orange goggles, red and black coat, shotgun). Shocked, urgent mood.`
4. `Scene: in the dark corridor, a hand in a purple gauntlet appears silently behind Incision, aiming at her heart. Incision (wild cream-white hair with red ribbons, red eyes, black armor, twin axes) spins and knocks it away with her axes in a burst of sparks, her face tense, realizing she is outmatched. Behind the gauntlet, only the shadowy shape of the demon with purple eyes. Violent, dangerous mood.`
5. `Scene: from above, Lunatic (long lavender-silver hair in a ponytail, crescent moon hair ornament, white and navy armored dress) dives down with a white rapier, leaving a moonlight-like silver trail, piercing through the purple gauntlet. The demon's avatar throws off its cloak, revealing purple skin, horns and a grinning face. In the background Crusader carries the two wounded on his back while Blast and Incision guard the retreat into a tunnel. Dramatic, heroic mood.`
6. `The Apostle of Heaven is EXACTLY the girl in the Apostle reference image: same face, same very long wavy silver-white hair, same red eyes, same hooded veil with a big flower ornament and ribbons, same ornate cross staff with dangling red gems. The ONLY change: recolor her outfit, hood and ribbons from black and red to pure white and gold. Not blonde, not a boy, not a different person. Scene: a battered prison hall after a long fight. Lunatic kneels, exhausted and wounded, gripping her rapier. The purple-skinned horned demon raises its hand to finish her, but a wall of golden barrier light slams down between them. Beyond the barrier stands the Apostle of Heaven in her white and gold hooded robe, holding her cross staff, calm and serious. Holy golden light against purple darkness.`
7. `The Apostle of Heaven is EXACTLY the girl in the Apostle reference image: same face, same very long wavy silver-white hair, same red eyes, same hooded veil with a big flower ornament and ribbons, same ornate cross staff with dangling red gems. The ONLY change: recolor her outfit, hood and ribbons from black and red to pure white and gold. Not blonde, not a boy, not a different person. Scene: the Brawler (wild red hair, red headband, short martial arts outfit, bandaged fists) blocks the demon's purple-clawed hand with her bare fist, wincing in pain, while carrying the wounded Lunatic (long lavender-silver ponytail, crescent moon ornament, white and navy armored dress; not hooded, not in black) over her shoulder into a tunnel. The purple-skinned horned demon ignores them and stares with a slow, interested smile at the Apostle of Heaven behind the golden barrier.`
8. `The Apostle of Heaven is EXACTLY the girl in the Apostle reference image: same face, same very long wavy silver-white hair, same red eyes, same hooded veil with a big flower ornament and ribbons, same ornate cross staff with dangling red gems. The ONLY change: recolor her outfit, hood and ribbons from black and red to pure white and gold. Not blonde, not a boy, not a different person. Scene: the Apostle of Heaven clutches her chest and falls to her knees, her cross staff dropped beside her, as a thin thread of purple aura slips into her mouth; her red eyes widen in fear. The golden barrier is fading and the demon has already vanished, leaving only purple sparks. From the corridor, imperial soldiers with torches run toward her shouting. A faint dark shadow spreads from her feet, foreshadowing her fall. Ominous, tragic mood.`

## 8장 「심연」 (7컷, `art/스토리/8장/`)

54문단이라 7컷. 참고 그림: 성국(`art/캐릭터/{유리엘·세레나·가브리엘·미카엘라·베아트리스·이안}/`, 걷기 시트) · 루나틱·네일러(걷기 시트) · 이클립스 낮 `이클립스/eclipse-1.png`(크림빛 머리 소녀) · 밤 `이클립스/eclipseNight-1.png`(**흰 머리 사내·금 월계·보라 눈·검보라 옷·초승달 도끼, 뒤 검은 해 속 그녀의 얼굴**) · 학살자 `학살자/slayer-1.png` · 악의 사도 `악의 사도/apostle-1.png`(이제 검은·붉은 옷)
※ 7장 컷 6·7에서 천의 사도가 금발 여자로 나옴 → 이번 장 악의 사도는 **은발·붉은 눈**이 되게 참고 그림을 꼭 붙임

| 컷 | 문단 | 참고 그림 | 장면 |
| --- | --- | --- | --- |
| 1 | 1~13 | 유리엘·루나틱·네일러 | 성국 성화의 대성당, 타오르는 성화 앞에서 말다툼하는 유리엘과 루나틱, 팔짱 낀 네일러 |
| 2 | 14~19 | 베아트리스·이안·루나틱·유리엘 | 문을 벌컥 열고 들어온 베아트리스, 한숨 쉬는 이안, 명단을 건네는 루나틱 |
| 3 | 20~25 | 유리엘·세레나·가브리엘·미카엘라·이클립스(낮) | 헬리오스 지하 통로 출구에 홀로 선 이클립스, 무기를 드는 네 사람 |
| 4 | 26~31 | 이클립스(밤)·가브리엘·세레나·미카엘라·유리엘 | 보랏빛 거대한 밤의 주인의 도끼를 방패로 받아 내는 가브리엘, 사슬 비수와 날아드는 무기들 |
| 5 | 32~38 | 유리엘·이클립스(낮) | 유리엘의 수정구 빛으로 성흔이 새겨져 잠시 제정신이 돌아와 괴로워하는 이클립스 |
| 6 | 39~48 | 학살자·이클립스(밤)·유리엘·가브리엘 | 통로 천장을 갈라 뛰어든 학살자가 대낫으로 열기의 검격을 막음, 유리엘 품에 떨어지는 성수병 |
| 7 | 49~54 | 악의 사도 | 제국 광장을 내려다보는 악의 사도, 광장 아래 천천히 열리는 심연의 통로 |

### 8장 컷별 장면 (영어, [공통] 뒤에 붙임)

1. `Scene: inside the grand Cathedral of the Sacred Flame in the Holy Kingdom, a huge golden flame burning in a brazier at the altar, tall white pillars and stained glass with abstract patterns. Yuriel (long golden hair, white veil with a gold cross, golden halo, white and blue holy robes, crystal orb) argues earnestly with Lunatic (long lavender-silver ponytail, crescent moon ornament, white and navy armored dress, rapier at her hip), who looks away coldly. Nailer (long silver hair, eyes bandaged, halo of thorns, dark gray robes, giant nail and hammer) leans on a pillar with arms crossed. Tense, quiet mood.`
2. `Scene: the cathedral doors burst open. Beatrice (long wavy golden hair braided into a crown, spiked golden halo, white and gold armor, red cape, greatsword on her shoulder) strides in shouting with a grin, while Ian (old man, long silver hair, glasses, white and gold robes, purple lantern) sighs behind her. Lunatic hands a folded list to Yuriel, who takes it with determination. Golden light from the sacred flame. Lively but serious mood.`
3. `Scene: the dark exit of a hidden underground tunnel beneath the closed gates of an imperial city. Four holy warriors arrive: Yuriel (golden hair, white veil, crystal orb, chain flail), Serena (long wavy platinum hair, golden sun halo with a white lily, gold and white dancer outfit, steel thorn whips), Gabriel (blond man, spiked golden halo, golden armor, blue cape, tower shield and hammer) and Michaela (long wavy platinum hair, golden halo, floating ring of small spears and swords). At the tunnel exit stands Eclipse alone (girl with long cream-white hair, golden sun crown, white and gold dress, sun scepter with a crescent blade), silent, her eyes empty. The four raise their weapons. Uneasy mood.`
4. `Scene: in the narrow tunnel, Eclipse has transformed into the lord of the night: a tall white-haired man with a gold laurel, glowing purple eyes, black, purple and gold robes, swinging a huge crescent axe, behind him a black eclipsed sun with a woman's face in it and a purple corona. Gabriel leaps forward and blocks the axe with his tower shield, sparks flying. Serena's chain daggers and a storm of Michaela's floating spears and swords fly at him, while Yuriel stands behind. Violent, purple and gold light.`
5. `Scene: Yuriel raises her glowing crystal orb; holy light burns a shining stigma mark onto Eclipse's body. Eclipse, back in her girl form (long cream-white hair, golden sun crown, white and gold dress), clutches her head in pain, tears in her eyes, struggling to speak, purple corruption crawling over her. The other three holy warriors watch, weapons ready. Sorrowful, desperate mood.`
6. `Scene: the tunnel ceiling is split open from above as the Slayer (pale woman with long black hair streaked blood-red, red rose in her hair, red eyes, black gothic corset dress) drops in and blocks a wave of burning sword slashes from the purple night lord with her giant scythe. She tosses a small glowing glass vial of holy water, which falls into Yuriel's arms. Gabriel's shield is cracked; the holy warriors turn to flee down the tunnel. Chaotic, fiery mood with red and purple light.`
7. `Scene: high above a vast imperial plaza at dusk, the Apostle of Evil (long silver hair, red eyes, black and crimson clergy hood and robes with crosses, inverted cross staff) looks down with a cold smile. Below, the plaza is full of people with empty purple-glowing eyes. In the center of the plaza the stone floor slowly cracks open into a deep glowing abyss passage leading downward, purple light rising. Ominous, foreboding mood.`

## 9장 「교류」 (12컷, `art/스토리/9장/`)

ch9a+ch9b 합쳐 102문단이라 12컷. 참고 그림: 탈라시아(`art/캐릭터/{미류·매드퀸·훅·리바이어·웨이브·테일·토르켄}/`, 걷기 시트) · 실버불렛 `실버불릿/은빛 사냥꾼 걷기 애니메이션 시트.png` · 장수·의사·떠돌이·아티팩터·이드라 (`…-1.png`) · 영물 레오 `레오/leo-1.png` · 오닉스 `오닉스/onyx-1.png` · 펜리르 `펜리르/보석 장검을 문 백색 늑대 보행 세트.png` · 풍류사 `풍류사/구름을 탄 화공 소년 스프라이트 시트.png` · 수집가 `수집가/푸른 머리 무기 수집가 스프라이트 시트.png` · 괴력난신 `public/sprites/enemies/demigod.png` · 아스모데우스 `art/최종보스/아스모데우스의 화신체/보랏빛 화염의 악마 마법사 5연속 컷.png` · 악의 사도 `악의 사도/apostle-1.png`

| 컷 | 문단 | 참고 그림 | 장면 |
| --- | --- | --- | --- |
| 1 | 1~17 | 미류·매드퀸·훅·리바이어·웨이브·테일 | 탈라시아 항구 회의장, 투닥이는 매드퀸과 훅, 상석의 미류 |
| 2 | 18~26 | 미류·테일 + 토르켄 | 손을 아무도 안 들고 웃는 사람들, 문밖에서 우당탕 달아나는 토르켄 |
| 3 | 27~32 | 훅·웨이브·토르켄·리바이어 | 제국 쪽 길, 벽처럼 몰려든 몬스터 떼를 뚫는 넷 |
| 4 | 33~40 | 실버불렛·웨이브 등 넷 | 은빛 탄환으로 몬스터 떼를 꿰뚫고 권총을 돌리며 걸어 나온 실버불렛 |
| 5 | 41~50 | 토르켄·장수·실버불렛 등 | 산 중턱 연합국 진지 문 앞, 창을 겨누는 장수와 손을 든 토르켄 |
| 6 | 51~57 | 의사·토르켄·웨이브 등 | 막사 안 네 나라 회의, 지도를 펼친 탁자 |
| 7 | 58~64 | 레오·풍류사·떠돌이·의사 | 천둥과 함께 막사에 고개를 들이민 뇌전의 사자와 구름 탄 풍류사 |
| 8 | 65~71 | 오닉스·수집가·아티팩터·괴력난신·이드라 | 일곱 빛기둥과 함께 내려앉은 광석 영물, 들어서는 괴력난신이 이드라를 가리킴 |
| 9 | 72~77 | 괴력난신·이드라 | 비르디아 변두리 무덤가, 비석을 번쩍 든 괴력난신, 땅이 갈라져 열린 통로 |
| 10 | 78~90 | 펜리르·이드라·괴력난신 | 거대한 동굴, 대검을 문 늙은 백랑과 겁먹은 채 마주한 이드라 |
| 11 | 91~95 | 펜리르·실버불렛·떠돌이 + 탈라시아 넷 | 며칠 뒤 연합국 '교류의 장', 한쪽에 엎드린 백랑, 함께 어울리는 네 나라와 성흔 |
| 12 | 96~102 | 아스모데우스·악의 사도·괴력난신 | 먼 어둠 속 화신체 앞에 고개 숙인 사도 / 연합국에서 조용히 주먹을 쥔 괴력난신 |

### 9장 컷별 장면 (영어, [공통] 뒤에 붙임)

1. `Scene: a grand council hall in a sea nation's harbor, big windows showing ships and blue sea, a round wooden table with nautical maps. Miryu (sea-dragon swordswoman, long white hair with teal tips, teal dragon antlers, teal and white robe) sits at the head, sighing. Mad Queen (silver-haired admiral, white admiral cap with gold anchor, white and gold coat) and Hook (blond pirate, navy tricorn hat with white plume, white-navy-gold coat) argue face to face across the table. Levia (long pale-blue hair, wave crown, trident), Wave (cream-white ponytail, goggles, white hoodie) and Tail (shark-girl, navy hair with cyan streak, shark hoodie and tail) watch, amused. Lively, comic mood.`
2. `Scene: the same harbor council hall. Everyone laughs warmly and nobody raises a hand; Miryu looks surprised and touched. Through the half-open door, Thorken (huge mane of teal hair, feathered headband, tanned skin, bronze armor, giant golden anchor) is caught eavesdropping and stumbles away in a clumsy crash, while Tail points at the door smirking. Warm, funny mood.`
3. `Scene: a rough road toward a dark empire under gloomy skies. A wall of monsters blocks the way. Hook slashes with his crescent hook blade, Thorken swings his anchor and chained iron ball, Levia thrusts her trident with sea water spiraling, Wave rides a surge of water on her surfboard. Action, smashing impact effects.`
4. `Scene: silver bullets pierce through the monster horde in bright streaks. Through the falling monsters walks Silver Bullet (long silver braid, lavender eyes, wide-brimmed black hat with gold cross and white feather, black and gold hunter coat), spinning twin silver pistols with a cocky smile. Wave and the sea crew turn in surprise. Cool, stylish mood.`
5. `Scene: a fortified alliance camp on a mountainside with wooden palisades and banners of three kingdoms (crimson, green, bronze). At the gate the General (dark crimson lamellar armor, red tassel helmet, long spear) points his spear warily; Thorken raises a hand with a friendly grin, with Hook, Wave, Levia and Silver Bullet behind him. Daylight, mountain view.`
6. `Scene: inside a large command tent, a map spread on a table. The Doctor (short black hair, white nurse cap with red cross, white coat) explains with a serious face to Thorken and the sea crew, while soldiers and elites of three kingdoms listen around. Lantern light, tense but hopeful mood.`
7. `Scene: thunder splits the sky outside the command tent. A giant sacred lion with a golden mane and a blue jewel in its forehead, blue lightning sparking from its mane, pokes its huge head into the tent. Beside it Pungryu (young scholar-outlaw, black wide-brim horsehair hat, jade-green robe, giant brush) floats on a small lavender cloud and waves cheerfully. The Drifter (chestnut hair, teal scarf, crossbow) jumps up in surprise. Dramatic yet funny mood.`
8. `Scene: pillars of seven-colored light shoot into the sky over the camp. A huge sacred mineral creature of bronze and gold ore with seven glowing jewels and a purple core lands, shaking the ground. The Collector (fluffy blue hair, navy and gold coat, bundle of weapons on his back) arrives with it, greeted by the Artifacter (white hair, glowing blue tattooed arms). The Demigod (muscular giant, long white hair, golden horns, bare chest with red markings) strides in and points at Idra (small girl with leaf-green hair and a flower, leaf dress), who points at herself in shock. Grand, lively mood.`
9. `Scene: a lonely nameless graveyard at the edge of a forest at dusk, old mossy tombstones. The Demigod lifts a huge old tombstone overhead with one hand, revealing a hidden button; the ground splits open into a dark stairway leading down. Idra hides behind him, scared. Eerie, mysterious mood.`
10. `Scene: a vast dark cave lit by faint glowing crystals. A giant old white wolf with long white and pale lavender fur and a golden halo crown with blue jewels stands growling, a huge blue greatsword held in its mouth. Small Idra stands before it trembling, looking up into its eyes, pushed forward by the Demigod behind her. Solemn, sad mood.`
11. `Scene: a few days later, the alliance camp at sunset, a festive gathering: sea crew, soldiers of three kingdoms and Silver Bullet eating and laughing around campfires. At the edge of the camp the old white wolf lies silently with its greatsword set down beside it. The Drifter and Silver Bullet clink cups. Warm, peaceful mood.`
12. `Scene: split composition. Left: a distant dark realm of purple fire, where the Avatar of Asmodeus (purple-skinned horned demon) sits on a throne and the Apostle of Evil kneels before him with head bowed. Right: at the alliance camp under the night sky, the Demigod stands alone and quietly clenches his fist, looking toward the far horizon. Ominous, foreboding mood.`

## 다음

🔸 1~9장 컷 목록·프롬프트 다 씀. 10장 이후가 생기면 같은 방식으로 이어서 씀
