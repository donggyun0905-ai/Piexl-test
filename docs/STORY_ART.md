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

## 3~9장

🔸 2장처럼 장마다 컷 목록·프롬프트를 이어서 씀 (그 전에는 장 하나에 임시 배경 하나)
