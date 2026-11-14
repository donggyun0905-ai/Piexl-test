# 캐릭터 선택 일러스트 (Higgsfield 프롬프트)

> 2026-11-13 작성. 캐릭터 선택 창에서 카드를 누르면 뜨는 **고르는 창(`select/CharPickDialog`) 위쪽의 큰 그림**용
> **만드는 사람: 사용자 (Higgsfield)** → 받은 원본 PNG를 `art/선택일러스트/{캐릭터 이름}.png`로 올리면 Claude가 게임에 넣음 (넣는 코드는 그림이 모이면 따로)
> 대상: 선택 창에 나오는 100명 (숨은·한정 캐릭터 포함, 보스·NPC 제외) · 순서는 선택 창 진영 탭 순서

## 정한 것

- **16:9 가로 · 2k** (스토리 그림과 같은 크기)
- **상징 배경 앞에 머리부터 발끝까지 전신이 다 보이는 인물, 가운데** (그림 높이의 75~80%, 무기·날개·꼬리까지 잘리지 않게). 획득 연출·스킨 보기에도 그대로 쓸 수 있게
- 화풍: **고급 픽셀아트, 실제 비율**(꼬마 체형 아님, 7등신 정도). 게임 그림(꼬마 체형)의 색·옷·무기·성별은 그대로 지키고 몸 비율만 키움
- **배경은 풍경이 아니라 상징 무늬** (2026-11-15 사용자 결정): 밝은 흰 바탕 위에 그 캐릭터를 나타내는 무늬(아치 창·금빛 고리·리본·상징 소품·깃털·별 조각 등)가 인물 뒤로 반투명하게 겹쳐 떠 있는 키아트 구성. 캐릭터별 '배경' 줄의 장소·소재를 이 무늬로 바꿔 씀
- **몸은 사람 비율** (SD·꼬마 체형 금지, 머리 작게·7~7.5등신·긴 다리, 어린이·동물·괴물은 제 크기)
- 기준 그림: `art/선택일러스트/파수꾼.png` (2026-11-15 확정)

## 쓰는 법 (Higgsfield)

1. Claude 채팅·Cowork의 Higgsfield에서 **Nano Banana Pro · 16:9 · 2k** (Claude Code에서는 무제한 생성이 막혀 크레딧이 듦)
2. 참고 그림 1번 = 그 캐릭터의 **원본 그림** (아래 각 캐릭터의 '참고 그림', 모두 `art/캐릭터/` 안)
3. 참고 그림 마지막 = **화풍 기준 그림 `art/선택일러스트/파수꾼.png`** (2026-11-15 확정, 몸 비율·화풍·상징 배경 구성의 기준. 파수꾼의 캐릭터·무늬 자체는 따라 하지 않음)
   - **100명을 한 번에 만들려면 `docs/CHAR_ART_BATCH.md`의 글을 통째로 붙여 넣기** (참고 그림은 Higgsfield에 미리 올려 둠)
4. 프롬프트 = 아래 **[공통]** + 캐릭터별 영어 프롬프트
5. 위아래 검은 띠가 생기면 Claude가 잘라서 넣음

### [공통] — 모든 캐릭터 앞에

```
Reference images: the character design sheet(s) come first; the LAST reference image is a finished illustration of a different knight character: use it ONLY as the guide for art style, adult body proportions and the kind of symbolic backdrop layout, and do NOT copy its character, colors or motifs. Use the character design sheet (small chibi game art) to keep this character's hair color and style, eye color, outfit, colors, accessories, weapon and gender exactly, but do NOT copy the chibi proportions. The sheet shows the same character several times in different directions and poses; draw that character only ONCE (one single figure, unless the prompt asks for several characters), and ignore the sheet's plain black or bright green background. Body: a real human look, NOT super-deformed, NOT chibi: small head, about 7 to 7.5 heads tall, long legs, realistic torso and limbs, attractive detailed face with normal-size eyes (children, animals and creatures keep their natural size and shape). Confident, elegant dynamic full-body pose. Style: beautiful high-detail pixel art illustration for a game character select screen, visible crisp pixels, clean dark pixel outlines, rich saturated colors, rim lighting, no blur, no painterly smudge, no photo texture. Background: NO realistic landscape or scenery. A bright, airy, mostly white / very pale background with a layered decorative symbolic backdrop floating behind the character like key-art: large thin golden or colored circular rings and arcs, a frame or arch shape related to the character's place, long flowing ribbons in the character's colors, pale translucent silhouettes of objects that symbolize the character (from the "Background" line below, turned into floating motifs), small sparkles and light fragments. The motifs are semi-transparent, softer and paler than the character, in the character's own color palette, with plenty of white space, so the character clearly stands out. Arrange the motifs in a fresh layout unique to this character (different placement, direction and shapes of rings, ribbons and frames than the style guide image); do not reuse the style guide's ribbon path or window position. Composition: 16:9, the WHOLE character from head to feet (including weapon, wings and tail) is visible and centered, filling about 75-80% of the image height, nothing important cut off. Full-bleed image, no black bars, no letterboxing, no border, no frame, no text, no letters, no logo, no watermark, no signature, no UI. Original design; do not imitate any other game, anime or artist.
```

## 진영별 배경 느낌

| 진영 | 배경 느낌 |
| --- | --- |
| 아스칼론 | 오래된 성채 왕국, 성벽·성문·깃발, 용에게 입은 흉터 |
| 테라코어 | 기계와 기술의 도시, 톱니·증기·네온·공장 |
| 비르디아 | 세계수가 있는 깊은 숲, 자연과 수인·엘프 |
| 헬리오스 | 악마의 힘을 탐하는 사막 제국, 황금 궁전과 어두운 의식 |
| 탈라시아 | 끝없는 바다와 해안, 배·파도·폭풍 |
| 성국 | 꺼지지 않는 성화를 지키는 대성당, 빛과 금빛 |
| 새벽의 성흔 | 악마가 기어 나오는 밤의 고딕 도시, 달빛 |
| 실베르 | 강대한 몬스터가 사는 눈 덮인 북부 |
| 아슈바르 | 색이 생기기 전의 공허, 각자 자기 색으로 물든 세계 |
| 아카식 레코드 | 세계의 흐름을 적는 끝없는 서고·별하늘 |
| 이방인 | 차원의 틈, 스러진 왕국 |
| 서고의 감시자 | 떨어진 신의 사도, 빛과 어둠 |

---

## 아스칼론

### 파수꾼 (warden)
- 참고 그림: `파수꾼/warden-1.png`
- 생김새: 은빛 판금 갑옷의 젊은 기사(남), 붉은 깃털 투구, 파란 망토와 금 장식, 넓게 베는 큰 칼
- 컨셉: 어린 시절 용에게 다친 뒤 왕국을 지키겠다고 맹세한 기사. 맞받아치는 반격의 검
- 배경: 아침 햇살이 비치는 아스칼론 성벽 위, 펄럭이는 왕국 깃발
```
A young male knight in polished silver plate armor with gold trim, a helmet with a tall red plume, a long blue cape, holding a broad greatsword planted before him. Background: the battlements of an old castle kingdom at sunrise, banners waving, a vast walled city below. Heroic, noble mood, warm golden light.
```

### 마법사 (mage)
- 참고 그림: `마법사/mage-1.png`
- 생김새: 허리까지 물결치는 금발 소녀, 파란 눈, 머리의 흰 꽃, 흰 로브에 파란 천·금 테, 머리 뒤 금빛 고리, 별 모양 수정이 달린 금 지팡이
- 컨셉: 용에게 다친 세 아이 중 하나, 불꽃처럼 터지는 마법탄
- 배경: 아스칼론 마법 탑 꼭대기의 별이 보이는 서재, 떠다니는 마법진
```
A girl mage with waist-length wavy golden hair, blue eyes, a white flower in her hair, a golden halo ring behind her head, white robes with deep blue cloth and gold trim, raising a golden staff topped with a glowing blue star crystal. Background: the top of a castle mage tower at twilight, bookshelves and glowing magic circles, stars through tall arched windows. Bright blue arcane light.
```

### 떠돌이 (drifter)
- 참고 그림: `떠돌이/drifter-1.png`
- 생김새: 헝클어진 밤색 머리(남), 청록 눈, 바람에 날리는 청록 목도리, 열린 가죽 재킷, 허리 주머니, 부츠, 쇠뇌
- 컨셉: 바람처럼 떠도는 쇠뇌 사수, 용에게 다친 세 아이 중 하나
- 배경: 바람 부는 언덕길, 멀리 보이는 아스칼론 성
```
A young male wanderer with messy chestnut hair and teal eyes, a long teal scarf blowing in the wind, an open brown leather jacket, belt pouches and boots, holding a loaded crossbow at the ready. Background: a windy grassy hill road with tall grass bending, a distant castle city on the horizon, clouds racing. Free, adventurous mood.
```

### 장수 (general)
- 참고 그림: `장수/general-1.png`
- 생김새: 붉은 술이 달린 투구, 검붉은 비늘 갑옷의 장군(남), 붉은 망토, 긴 창
- 컨셉: 아스칼론 옛 장수, 끊기지 않는 창 콤보
- 배경: 불타는 노을 아래 전장, 꽂힌 깃발들
```
A veteran male general in dark crimson and bronze lamellar armor, a helmet with a long red tassel plume, a torn red cape, holding a long spear with a red tassel. Background: a battlefield under a burning sunset, broken banners stuck in the ground, smoke drifting. Fierce, commanding mood, red-orange light.
```

### 풋내기 (novice)
- 참고 그림: `풋내기/novice-1.png`
- 생김새: 밤색 머리의 평범한 소년 모험가, 낡은 천옷과 붕대, 붉은 목도리 천, 맨손
- 컨셉: 무엇이든 배우며 자라는 풋내기, 장수를 따르는 아이
- 배경: 아스칼론 성문 앞 길, 커다란 가방과 새벽
```
A teenage boy adventurer with tousled brown hair, worn patched cloth clothes, bandaged hands and a ragged red scarf, standing with fists raised and a determined grin. Background: the road in front of a huge castle gate at dawn, a travel bag on the ground, the first light breaking over the walls. Hopeful, fresh mood.
```

### 추적자 (tracker)
- 참고 그림: `추적자/tracker-1.png`
- 생김새: 높이 묶은 밤색 포니테일, 초록 눈, 국방색 두건 망토, 짙은 사냥복과 가죽 탄띠, 긴 저격총(붉은 조준경 빛)(여)
- 컨셉: 조용히 노리는 여자 저격수
- 배경: 안개 낀 숲속 절벽 위 저격 자리
```
A female sniper with a high chestnut ponytail and green eyes, an olive hooded cloak, dark hunting clothes and leather ammo belts, holding a long sniper rifle with a glowing red scope. Background: a misty forest cliff at dawn, pine trees fading into fog, a ruined watchtower far away. Quiet, tense mood.
```

### 잊혀진 자 (forgotten)
- 참고 그림: `잊혀진 자/forgotten-1.png`
- 생김새: 허리까지 흘러내리는 백금빛 긴 머리, 금빛 눈, 금 월계 머리띠와 하늘빛 보석, 흰 여신 드레스(금 테)(여)
- 컨셉: 옛 신의 마지막 후손인 반신, 빛으로 싸우는 공주 에스텔
- 배경: 모래에 반쯤 묻힌 고대 왕국의 무너진 신전, 빛기둥
```
A demigod princess with very long flowing platinum-white hair, golden eyes, a golden laurel circlet with a sky-blue jewel, a white goddess gown with gold trim, glowing orbs of light floating at her fingertips. Background: a ruined ancient temple half-buried in desert sand, broken golden pillars, a beam of holy light falling from above. Divine, serene mood.
```

### 잔영 (remnant)
- 참고 그림: `잔영/remnant-1.png`
- 생김새: 눈만 보이는 검은 두건과 입가리개, 보라로 빛나는 눈, 은회색 앞머리, 해진 검은 망토, 보라 목도리, 양손 단검(남)
- 컨셉: 그림자 속을 움직이는 암살자
- 배경: 달빛 비치는 성 지붕 위, 짙은 그림자
```
A male assassin in a black hood and face mask showing only glowing purple eyes, silver-gray bangs, a tattered black cloak and a purple scarf, holding two daggers in reverse grip. Background: castle rooftops at night under a pale moon, deep shadows and purple mist curling around him. Silent, dangerous mood.
```

### 방랑객 (wanderer)
- 참고 그림: `방랑객/wanderer-1.png`
- 생김새: 넓은 삿갓, 묶어 올린 검은 머리, 해진 쪽빛 겉옷과 흰 속옷, 붉은 허리띠, 긴 카타나, 짚신(남)
- 컨셉: 카타나 한 자루로 떠도는 무사
- 배경: 바람에 꽃잎이 흩날리는 옛 산길
```
A lone male swordsman with a wide straw hat, tied-up black hair, a frayed indigo outer robe over white clothes, a red sash and straw sandals, hand on the hilt of a long katana ready to draw. Background: an old mountain path with wind blowing petals and leaves, a weathered stone lantern, distant misty peaks. Calm but deadly mood.
```

### 영사 (silk)
- 참고 그림: `영사/silk-1.png`
- 생김새: 허리까지 물결치는 와인빛 긴 머리, 분홍 눈, 검은 드레스(분홍 테), 금 장식, 손끝의 은실
- 컨셉: 보이지 않는 실을 다루는 매혹적인 여자
- 배경: 촛불이 켜진 화려한 성 무도회장, 은실이 걸린 샹들리에
```
An alluring woman with waist-length wavy wine-red hair, pink eyes, an elegant black dress with pink trim and gold ornaments, thin shining silver threads stretched from her fingertips. Background: a candlelit castle ballroom, crystal chandeliers, silver threads glinting in the air like a web. Seductive, mysterious mood.
```

### 풍류사 (pungryu)
- 참고 그림: `풍류사/구름을 탄 화공 소년 스프라이트 시트.png`
- 생김새: 젊은 의적 선비(남), 검은 갓(붉은 구슬 갓끈), 뒤로 묶은 검은 머리, 비취색 도포와 넓은 소매, 자줏빛 허리띠, 커다란 붓, 발밑 연보랏빛 구름
- 컨셉: 구름을 타고 다니는 의적 선비
- 배경: 달밤의 기와지붕 마을 위 하늘, 먹으로 그린 듯한 산
```
A young male scholar-outlaw with a black wide-brim traditional horsehair hat with red bead strings, black hair tied back, a jade-green robe with wide sleeves and a purple sash, holding a giant calligraphy brush with a golden handle, floating on a small lavender cloud. Background: night sky over a village of tiled roofs, misty ink-wash style mountains, a full moon. Playful, confident mood. No letters or calligraphy text.
```

### 레오 (leo)
- 참고 그림: `레오/leo-1.png`
- 생김새: 금빛 갈기의 사자(영물), 이마의 파란 보석, 흰·남색·금 갑옷 장식, 뇌전
- 컨셉: 이마에 보석이 박힌 뇌전의 사자
- 배경: 번개 치는 폭풍 속 성벽 위
```
A majestic sacred lion with a huge golden mane, a blue jewel in its forehead, white, navy and gold armor plates on its body, crackling golden lightning around its claws, standing proudly on all fours, full body visible. Background: castle walls on a stormy night, lightning splitting dark clouds. Powerful, regal mood.
```

## 테라코어

### 거너 (gunner)
- 참고 그림: `거너/gunner-1.png`
- 생김새: 검은 중절모(붉은 띠), 검붉은 코트, 하얀 얼굴, 붉은 눈, 쌍권총
- 컨셉: 체력은 약하지만 치명타를 터뜨리는 총잡이
- 배경: 비 내리는 기계 도시 뒷골목, 네온과 증기
```
A slim gunslinger with a black fedora with a red band, a pale face and red eyes, a long dark crimson coat with ragged edges, dual revolvers held crossed. Background: a rainy back alley of a machine city, steam pipes, neon reflections in puddles. Cool, deadly mood.
```

### 기계공학자 (engineer)
- 참고 그림: `기계공학자/engineer-1.png`
- 생김새: 주황 고글, 밤색 머리(남), 작업복과 공구 벨트, 주황 천, 팔에 찬 레이저 장치
- 컨셉: 레이저로 녹이고 포탑·드론을 만드는 공학자
- 배경: 톱니와 기계가 가득한 작업장, 날아다니는 드론
```
A young male engineer with messy brown hair and orange goggles, work clothes with a tool belt and an orange cloth, a mechanical laser device on his arm glowing orange. Background: a workshop full of gears, turrets and drones, sparks flying, warm lamps. Inventive, energetic mood.
```

### 의사 (doctor)
- 참고 그림: `의사/doctor-1.png`
- 생김새: 짧은 검은 머리, 흰 간호 모자(붉은 십자), 흰 가운에 붉은 십자, 왕진 가방, 주사기·약병, 치료 빛
- 컨셉: 치료의 빛과 주사기로 싸우는 의사
- 배경: 테라코어의 깨끗한 의료실, 유리 약병이 빛나는 선반
```
A female doctor with short black hair, a white nurse cap with a red cross, a white coat with red crosses, a medical bag and a big syringe, golden healing light sparkling around her hand. Background: a bright high-tech infirmary with glowing glass vials on shelves and machines. Kind but fearless mood.
```

### 시간술사 (chronomancer)
- 참고 그림: `시간술사/chronomancer-1.png`
- 생김새: 은백색 머리, 금 시계 장식, 남색·금 로브, 모래시계
- 컨셉: 시간을 다루는 마도사, 아스트랄 로드를 끌어냄
- 배경: 거대한 시계탑 안, 떠 있는 톱니와 금빛 시계 문양
```
A male chronomancer with silver-white hair, a golden clockwork ornament in his hair, navy and gold robes, holding a small glowing hourglass, a golden clock-face magic circle behind him. Background: inside a giant clock tower, huge floating gears, frozen sand grains hanging in the air. Mystical, timeless mood.
```

### 거인 (titan)
- 참고 그림: `거인/titan-1.png`
- 생김새: 키 큰 근육질 남자, 오른팔이 거대한 기계팔(강철·관절·증기관), 가죽 조끼, 붉은 허리 천
- 컨셉: 느리지만 단단한 탱커
- 배경: 증기 뿜는 거대한 공장, 용광로 불빛
```
A huge muscular man with wild brown hair and beard, a giant steel mechanical right arm with pistons and steam pipes, a leather vest and red waist cloth, the mechanical fist raised. Background: an enormous steam factory with furnaces glowing orange, chains and cranes. Mighty, unshakable mood.
```

### 오토마타 (automata)
- 참고 그림: `오토마타/automata-1.png`
- 생김새: 은백색 단발 여자 기계 인형, 하늘빛 눈, 톱니 머리 장식, 관절 이음매, 하늘빛 회로, 흰·남색 기계 드레스
- 컨셉: 처음으로 자아를 가진 기계 인형
- 배경: 조용한 인형 작업실, 창밖 기계 도시의 밤
```
A female automaton doll with short silver-white hair, glowing sky-blue eyes, a gear-shaped headpiece, porcelain skin with visible joint seams, sky-blue circuits glowing on her body, a white and navy mechanical dress, fingertips glowing blue. Background: a quiet doll workshop at night, unfinished dolls on shelves, a machine city lit up outside the window. Gentle, wondering mood.
```

### 라이더 (rider)
- 참고 그림: `라이더/rider-1.png`
- 생김새: 진한 파랑 스포츠 오토바이에 탄 남자, 뾰족한 검은 머리, 이마의 고글, 검은 가죽 재킷에 파랑 줄
- 컨셉: 오토바이를 탄 폭주족
- 배경: 밤의 고가 도로, 네온 불빛이 흐르는 기계 도시
```
A male biker with spiky black hair and goggles on his forehead, a black leather jacket with blue stripes, sitting on a deep blue sports motorcycle, the whole bike visible. Background: an elevated highway at night in a machine city, blue neon light streaks and speed lines. Wild, fast mood.
```

### 붐버 (bomber)
- 참고 그림: `붐버/bomber-1.png`
- 생김새: 헝클어진 붉은 머리(남), 이마의 주황 고글, 주황 목도리, 국방색 작업복에 폭탄 띠, 불붙은 폭탄
- 컨셉: '폭발은 예술이다'
- 배경: 폭발 불꽃이 터지는 채석장
```
A young man with spiky red hair, orange goggles on his forehead, an orange scarf, olive work clothes with a bomb belt, tossing a lit round bomb with a big grin. Background: a rock quarry with explosions blooming like fireworks behind him, flying debris. Reckless, joyful mood.
```

### 아티팩터 (artifacter)
- 참고 그림: `아티팩터/artifacter-1.png`
- 생김새: 짧은 흰 머리(남), 파란 눈, 소매 없는 긴 흰 조끼, 맨팔 가득 푸른빛 문신, 리펄스 총
- 컨셉: 두 팔에 푸른빛 문신이 가득한 제작자
- 배경: 푸른 회로가 흐르는 연구소, 떠 있는 유물
```
A young man with short messy white hair and blue eyes, a long sleeveless white coat, both bare arms covered in glowing blue tattoos, aiming a sleek repulse pistol. Background: a laboratory with glowing blue circuit lines on the walls and ancient artifacts floating in containment fields. Cool, precise mood.
```

### 펑크 (punk)
- 참고 그림: `펑크/punk-1.png`
- 생김새: 한쪽으로 쓸어 넘긴 분홍 머리(끝은 하늘빛), 분홍 눈, 짧은 검은 재킷, 크롬 팔, 반바지와 부츠(여), 손끝 네온 칼날
- 컨셉: 네온 머리와 크롬 팔의 매혹적인 여자
- 배경: 네온 간판이 가득한 밤거리
```
A woman with side-swept pink hair fading to sky blue at the tips, pink eyes, a cropped black jacket, a chrome cybernetic arm, shorts and boots, glowing neon pink blades extending from her fingertips. Background: a night street full of glowing neon signs without readable text, rain mist and pink-blue light. Edgy, confident mood.
```

### 수집가 (collector)
- 참고 그림: `수집가/푸른 머리 무기 수집가 스프라이트 시트.png`
- 생김새: 푸른 머리(남), 파란 눈, 남색·금 코트와 흰 망토, 등에 잔뜩 짊어진 무기 묶음, 금빛 검기
- 컨셉: 등에 무기를 잔뜩 짊어진 무기 수집가
- 배경: 무기가 벽 가득 걸린 창고
```
A young man with fluffy blue hair and blue eyes, a navy and gold coat with a white cape, a huge bundle of many swords, axes and spears strapped on his back, swinging a sword that leaves a golden arc. Background: a vast armory with weapons covering every wall, warm lantern light. Cheerful, proud mood.
```

### 오닉스 (onyx)
- 참고 그림: `오닉스/onyx-1.png`
- 생김새: 청동·금빛 광석 몸의 영물, 가운데 보랏빛 핵, 몸에 박힌 일곱 색 보석, 등 뒤 광륜
- 컨셉: 몸에 일곱 보석이 박힌 광석 영물
- 배경: 보석이 빛나는 거대한 지하 광맥 동굴
```
A sacred mineral creature with a bronze and gold rock body, a glowing purple core in its chest, seven colored jewels embedded around its body, a golden halo-ring of ore behind it, floating slightly above the ground, full body visible. Background: a huge underground cavern with glowing gem veins in many colors. Ancient, heavy mood.
```

## 비르디아

### 야수 (beast)
- 참고 그림: `야수/beast-1.png`
- 생김새: 주황 고양이 수인 소녀(고양이 귀·꼬리), 풍성한 주황 머리, 털 달린 옷, 날카로운 손톱, 곁의 작은 고양이
- 컨셉: 고양이 펫과 함께 싸우는 수인, 새끼 용을 지킨 아이
- 배경: 햇빛이 새어 드는 깊은 숲
```
A cat-girl beastfolk with fluffy orange hair, orange cat ears and tail, fur-trimmed clothes, sharp claws ready, a small orange kitten companion at her feet. Background: a deep green forest with sunbeams through the leaves, mossy roots. Lively, wild mood.
```

### 소환술사 (summoner)
- 참고 그림: `소환술사/summoner-1.png`
- 생김새: 물결치는 초록 머리 소녀, 굽은 뿔 머리 장식, 흰 꽃, 해진 초록 로브, 덩굴 채찍
- 컨셉: 채찍과 소환수로 싸우는 비르디아 소환술사
- 배경: 거대한 나무뿌리 사이, 빛나는 소환진
```
A girl summoner with wavy green hair, curved dark horn ornaments, small white flowers, a ragged green robe, cracking a long thorny vine whip. Background: between giant tree roots in an ancient forest, a glowing green summoning circle, the shadow of a beast behind her. Mysterious, natural mood.
```

### 원소술사 (elementalist)
- 참고 그림: `원소술사/elementalist-1.png`
- 생김새: 청록 긴 머리 소녀, 파란 로브, 몸 둘레를 도는 불·물·바람·땅 원소 구슬
- 컨셉: 바람과 불을 다루며 새끼 용을 지킨 원소술사
- 배경: 숲속 호숫가, 바람에 날리는 잎
```
A girl elementalist with long teal hair, a blue robe with gold accents, four elemental orbs of fire, water, wind and earth orbiting around her. Background: a forest lakeside, leaves swirling in the wind, sparkles on the water. Bright, magical mood.
```

### 음양사 (mystic)
- 참고 그림: `음양사/mystic-1.png`
- 생김새: 검은 긴 생머리 소녀, 흰 꽃과 붉은 리본, 흰 저고리에 붉은 치마 무녀 옷, 부적 다발
- 컨셉: 부적을 던지는 음양사, 두 왕국 사이에서 칼에 베인 아이
- 배경: 숲속 오래된 사당, 흩날리는 부적과 붉은 끈
```
A shrine-maiden girl with long straight black hair, a white flower and red ribbons in her hair, a white top and red skirt shrine outfit, a fan of paper talismans in her hand. Background: an old shrine in the forest at dusk, red ropes, paper talismans floating in the air. Calm, spiritual mood. Talismans have no readable letters.
```

### 이무기 (imugi)
- 참고 그림: `이무기/imugi-1.png`
- 생김새: 금빛 뿔 장식을 쓴 검은 긴 머리 소녀, 청록 비늘 무늬의 어두운 옷, 용창
- 컨셉: 용이 되기 전의 이무기, 창 콤보
- 배경: 폭포가 떨어지는 깊은 계곡, 물안개
```
A girl with long black hair and a golden horn crown, dark robes with teal scale patterns and flowing ribbons, holding a long dragon spear. Background: a deep valley with a tall waterfall, mist rising, the faint shape of a serpent in the water. Proud, rising mood.
```

### 이드라 (idra)
- 참고 그림: `이드라/idra-1.png`
- 생김새: 세계수의 아이(작은 소녀), 잎사귀 머리에 꽃, 연둣빛 잎 원피스, 맨발에 덩굴 발찌, 나무 대궁
- 컨셉: 세계수의 아이
- 배경: 거대한 세계수 아래, 빛나는 꽃가루
```
A small girl, child of the World Tree, with leaf-green hair and a big white flower, a light green dress made of leaves, barefoot with vine anklets, drawing a wooden bow with a glowing green arrow. Background: beneath an enormous World Tree, glowing pollen floating in golden light. Innocent, sacred mood.
```

### 변희 (byeonhui)
- 참고 그림: `변희/byeonhui-1.png`
- 생김새: 헝클어진 긴 적갈색 머리와 깃털, 짐승 이빨 목걸이, 짧은 윗옷·짧은 바지, 맨발, 몸의 짐승 무늬
- 컨셉: 만물의 소녀, 짐승처럼 덮침
- 배경: 거친 바위 언덕의 야생 초원, 노을
```
A wild girl with long messy reddish-brown hair decorated with feathers, a beast-tooth necklace, a short top and shorts, barefoot, tribal beast markings on her skin, crouched ready to pounce with claw-like hands. Background: wild grassland with rough rocks at sunset. Feral, free mood.
```

### 플라이 (fly)
- 참고 그림: `플라이/fly-1.png`
- 생김새: 하늘빛 짧은 머리, 등에 투명한 잠자리 날개 넷, 몸에 붙는 검은 옷, 발톱 장갑
- 컨셉: 잠자리 날개의 아주 빠른 전사
- 배경: 숲 위 하늘, 바람 줄기
```
A slim fighter with short sky-blue hair, four transparent dragonfly wings spread wide on the back, a tight black bodysuit, clawed gauntlets, hovering just above the ground. Background: the sky above the forest canopy, wind streaks and light clouds. Swift, light mood.
```

### 장로 (elder)
- 참고 그림: `장로/elder-1.png`
- 생김새: 흰 수염과 묶은 흰 머리의 나이 든 장로(남), 녹색 도포, 옥구슬 나무 지팡이, 바닥의 네모 진법 문양
- 컨셉: 진법의 장로, 비르디아 왕에게 사념을 보냄
- 배경: 세계수 숲 속 돌 제단, 초록빛 진법
```
An old male elder with a long white beard and white hair in a topknot, green traditional robes, a wooden staff with jade beads, a glowing green square magic formation on the ground around him. Background: a stone altar deep in a sacred forest, green light rising. Wise, calm mood.
```

### 렌 (ren)
- 참고 그림: `렌/ren-1.png`
- 생김새: 두건 달린 녹색 로브의 소녀, 긴 밤색 머리, 맨손, 둘레에 떠 있는 돌
- 컨셉: 토목의 소녀, 땅에서 바위를 일으킴
- 배경: 무너진 돌다리가 있는 협곡
```
A girl in a hooded green robe with long brown hair, empty hands raised, rocks and stone shards floating around her as the ground cracks and rises. Background: a canyon with a ruined stone bridge, dust in the light. Earthy, steady mood.
```

### 정령사 (spiritist)
- 참고 그림: `정령사/spiritist-1.png`
- 생김새: 남색 긴 생머리 소녀, 하얀 세일러 교복, 곁의 작은 빛 정령 셋
- 컨셉: 교복을 입은 학생 정령사
- 배경: 숲속 마법 학교의 정원, 반딧불
```
A student spiritist girl with long straight dark navy hair, a white sailor school uniform, three small glowing spirits (gold, blue, purple) floating around her, casting a magic missile. Background: the garden of a magic school in the forest at night, fireflies and glowing lanterns. Bright, youthful mood.
```

### 펜리르 (fenrir)
- 참고 그림: `펜리르/보석 장검을 문 백색 늑대 보행 세트.png`
- 생김새: 흰·연보랏빛 털의 거대한 늙은 늑대, 파란 보석 금빛 광배, 입에 문 거대한 대검(파란 날)
- 컨셉: 지난 비르디아 왕의 늙은 백랑, 왕의 대검을 물고 다시 전쟁에 나섬
- 배경: 눈 덮인 왕의 무덤 언덕, 달밤
```
A giant old white wolf with long white and pale lavender fur, a golden halo crown with blue jewels behind its head, carrying a huge greatsword with a blue blade in its mouth, standing on all fours, full body visible. Background: a snowy hill with an old king's grave and a broken banner, a full moon. Loyal, solemn mood.
```

## 헬리오스

### 악의 사도 (apostle)
- 참고 그림: `악의 사도/apostle-1.png`
- 생김새: 은발에 붉은 눈, 검은·붉은 성직자 두건과 옷, 십자 장식과 꽃, 뒤집힌 십자 지팡이
- 컨셉: 웃으며 악을 퍼뜨리는 헬리오스의 사도
- 배경: 촛불이 흔들리는 어두운 의식의 방, 떨어지는 십자가
```
An apostle with long silver hair and red eyes, a black and crimson clergy hood and robes with cross ornaments and a white flower, holding a staff with an inverted cross, smiling. Background: a dark ritual chamber with trembling candles, giant inverted crosses falling from the sky behind. Sinister, elegant mood.
```

### 베두인 (bedouin)
- 참고 그림: `베두인/bedouin-1.png`
- 생김새: 붉은 두건 스카프, 어두운 긴 머리, 남색 치마, 몸만큼 큰 금빛 차크람(여)
- 컨셉: 몸만 한 차크람 하나로 싸우는 사막 전사
- 배경: 끝없는 사막 모래언덕, 뜨거운 태양
```
A female desert warrior with a red hooded scarf, long dark hair, gold jewelry, a navy skirt, holding a huge golden chakram as big as her body. Background: endless desert dunes under a blazing sun, heat haze, a distant golden palace. Proud, fierce mood.
```

### 격투가 (brawler)
- 참고 그림: `격투가/brawler-1.png`
- 생김새: 붉은 머리띠를 맨 풍성한 붉은 머리 소녀, 짧은 무도복, 붕대 감은 주먹
- 컨셉: 맞힐수록 이어지는 콤보, 먼저 주먹을 날리는 성격
- 배경: 헬리오스 투기장, 환호하는 관중
```
A girl fighter with wild red hair and a red headband, a short martial arts outfit, bandaged fists, in a fighting stance throwing a punch. Background: an imperial arena with roaring crowds in the stands, dust and torchlight. Hot-blooded, energetic mood.
```

### 닌자 (ninja)
- 참고 그림: `닌자/ninja-1.png`
- 생김새: 헝클어진 검은 머리, 길게 날리는 붉은 머리띠, 붉은 눈, 검은 닌자복과 입가리개, 수리검(여)
- 컨셉: 검은 천을 두른 제국의 닌자, 버려진 아이들을 거둠
- 배경: 달빛 아래 사막 신전 지붕
```
A female ninja with messy black hair, a long red headband trailing in the wind, red eyes, a black ninja outfit with a face mask, holding shurikens between her fingers. Background: the roof of a desert temple under the moonlight, sand blowing. Swift, secretive mood.
```

### 버려진 자들 (abandoned)
- 참고 그림: `버려진 자들/abandoned-1.png` · `abandoned2-1.png` · `abandoned3-1.png` (세 장 다 올림)
- 생김새: 함께 자란 세 아이. 검은 옷에 빛(금빛 눈·흰 줄)과 어둠(보랏빛 눈·보라 줄)이 섞인 몸. P1 초록 큰 방패 소년(검은 머리), P2 붉은 총 소녀(흰 긴 머리에 붉은 줄), P3 파란 검 소년
- 컨셉: 버려진 세 아이, 사막 신전에서 빛과 어둠을 받음
- 배경: 사막 신전 바닥에서 떠오르는 빛과 어둠의 구체
```
The three reference sheets are three different children; draw all three together in one picture. Three children who grew up together, standing side by side, all in black clothes with bodies marked by both light (golden eyes, white streaks) and darkness (purple eyes, purple streaks): in front a boy with black hair holding a large green shield, on the left a girl with long white hair streaked red holding a red gun, on the right a boy holding a blue sword. All three full bodies visible. Background: the floor of an ancient desert temple, a sphere of light and darkness rising behind them. Fateful, determined mood.
```

### 오니 (oni)
- 참고 그림: `오니/oni-1.png`
- 생김새: 사람 피부의 도깨비(남), 붉은 뿔 둘, 뒤로 묶은 거친 머리, 흉터, 송곳니 웃음, 웃통 벗은 근육질, 범 가죽 허리띠, 가시 박힌 커다란 방망이
- 컨셉: 방망이가 본체인 도깨비, 느리고 아주 센 휘두르기
- 배경: 무너진 신전 기둥 사이, 붉은 노을
```
A muscular male oni with human skin, two red horns, rough black hair tied back, scars, a fanged grin, shirtless, a tiger-skin waist wrap, resting a huge spiked club on his shoulder. Background: between collapsing temple pillars at a red sunset, dust and rubble. Brutal, cheerful mood.
```

### 역병의사 (plague)
- 참고 그림: `역병의사/plague-1.png`
- 생김새: 챙 넓은 검은 모자, 하얀 새부리 가면(초록 유리 눈), 검은 가죽 긴 코트, 허리의 향로, 초록 독 연기(남)
- 컨셉: 독 연기를 퍼뜨리는 사도의 부하
- 배경: 초록 안개 낀 버려진 골목
```
A plague doctor with a wide-brimmed black hat, a white bird-beak mask with green glass eyes, a long black leather coat with crosses, a swinging censer at his waist releasing green toxic smoke. Background: an abandoned alley filled with green fog, dim lanterns. Eerie, unsettling mood.
```

### 학살자 (slayer)
- 참고 그림: `학살자/slayer-1.png`
- 생김새: 핏빛 도는 검붉은 긴 머리 여자, 붉은 장미, 창백한 얼굴, 붉은 눈과 섬뜩한 웃음, 검은 고딕 드레스, 거대한 대낫
- 컨셉: 콧노래를 부르며 달려 나가는 학살자
- 배경: 붉은 달 아래 장미가 핀 폐허
```
A pale woman with long black hair streaked blood-red, a red rose in her hair, red eyes and an eerie smile, a black gothic corset dress, holding a giant scythe with a blood-red trail. Background: ruins covered in red roses under a blood-red moon. Beautiful, terrifying mood.
```

### 이터 (eater)
- 참고 그림: `이터/eater-1.png`
- 생김새: 온몸이 검은 그림자 괴물, 붉은 눈, 몸 군데군데 새하얀 이빨, 발밑 그림자 자락
- 컨셉: 사슬에 묶였던 괴물, 잠깐 사람의 눈빛
- 배경: 끊어진 쇠사슬이 흩어진 지하 감옥
```
A monstrous shadow creature made of black smoke-like darkness, glowing red eyes, rows of white wolf-like fangs on its face and body, shadow tendrils trailing at its feet, a huge gaping maw. Background: an underground prison with broken chains scattered around, faint red light. Hungry, tragic mood.
```

### 묵인 (mukin)
- 참고 그림: `묵인/mukin-1.png`
- 생김새: 큰 몸의 무사(남), 헝클어진 긴 흰 머리, 어두운 판금 갑옷과 큰 어깨 갑옷, 붉은 허리 천, 입을 가린 쇠 가면, 대검
- 컨셉: 말이 없는 거대한 무사
- 배경: 잿빛 바람이 부는 황무지
```
A huge silent warrior with long wild white hair, heavy dark plate armor with massive pauldrons, a tattered red waist cloth, an iron mask covering his mouth, a giant greatsword in hand. Background: a gray wasteland with ash blowing in the wind. Heavy, ominous mood.
```

### 사멸 (samyeol)
- 참고 그림: `사멸/samyeol-1.png`
- 생김새: 올림머리에 은침을 꽂은 여자, 보랏빛 비단 옷(높은 깃·비취색 단), 손끝에 펼친 독침
- 컨셉: 사천 당가의 암기술사
- 배경: 대나무 숲의 밤, 보랏빛 안개
```
A female hidden-weapon assassin with black hair in an elegant updo pierced with silver needles, a tight purple silk dress with a high collar and jade-green trim, poison needles fanned between her fingers. Background: a bamboo forest at night with purple mist. Cold, graceful mood.
```

### 이클립스 (eclipse)
- 참고 그림: `이클립스/eclipse-1.png` · `eclipseNight-1.png`
- 생김새: 크림빛 긴 머리 소녀, 금빛 태양 왕관과 꽃, 흰·금 드레스, 태양 지팡이 / 등 뒤 태양 원반 속 남자(밤의 주인)
- 컨셉: 헬리오스의 태양인 그녀와, 그 뒷면 일식의 밤의 주인인 그
- 배경: 황금 궁전 위 하늘, 개기일식
```
The reference shows the girl with a man's face inside the sun disc behind her: the man is not a separate person standing, only a giant face in the eclipsed sun. A girl with long cream-white hair, a golden sun crown with flowers, a white and gold dress, holding a sun scepter. Behind her looms a huge eclipsed sun with a glowing corona, and within the dark disc the faint face of a young man, the lord of the night. Background: the sky above a golden imperial palace during a total solar eclipse, half the scene in daylight gold and half in night. Radiant yet ominous mood.
```

## 탈라시아

### 토르켄 (thorken)
- 참고 그림: `토르켄/청록 머리 전사의 8방향 스프라이트 시트.png`
- 생김새: 크게 부푼 청록 머리, 깃털 머리띠, 그을린 피부, 청동빛 갑옷, 어깨의 거대한 금빛 닻, 사슬로 이은 철구공(남)
- 컨셉: 자유의 바다를 누비는 뱃사람, 닻과 철구공
- 배경: 폭풍 치는 바다 위 배 갑판
```
A sailor with a huge mane of teal hair, a feathered headband, tanned skin, bronze armor pieces, a giant golden anchor on his shoulder and a heavy iron ball on a chain. Background: the deck of a ship on a stormy sea, waves crashing, lightning on the horizon. Bold, free mood.
```

### 리바이어 (levia)
- 참고 그림: `리바이어/물결 왕관의 아이스 발키리 워크사이클.png`
- 생김새: 긴 연하늘빛 머리, 물결 모양 금 왕관, 흰·파랑 발키리 옷, 삼지창
- 컨셉: 고래와 함께 자유로운 바다를 누비는 창술사
- 배경: 맑은 바다 위, 뛰어오르는 거대한 고래
```
A spear maiden with long pale-blue hair, a golden crown shaped like waves, a white and blue valkyrie outfit, holding a trident spear. Background: a clear open sea, a giant whale leaping out of the water behind her, sparkling spray. Free, majestic mood.
```

### 테일 (tail)
- 참고 그림: `테일/상어 소녀 걷기 애니메이션 스프라이트 시트.png`
- 생김새: 남색 머리에 하늘빛 줄, 상어 이빨 웃음, 상어 입 무늬 후드, 상어 꼬리, 운동화
- 컨셉: 물을 자유롭게 다루는 상어 수인
- 배경: 물보라 치는 바위 해안
```
A shark-girl beastfolk with dark navy hair streaked cyan, a sharp-toothed grin, a navy hoodie with a shark-mouth print, a big shark tail, sneakers, swirling water around her hands. Background: a rocky coast with waves splashing, bright sea spray. Playful, mischievous mood.
```

### 매드퀸 (madQueen)
- 참고 그림: `매드퀸/은빛 해군 제독 걷기 스프라이트 시트.png`
- 생김새: 긴 은발, 청록 눈, 흰 제독 모자(금 닻), 흰·금 제독 코트 아래 검은 옷, 네 색 에너지 대포
- 컨셉: 해방의 바다를 다스리는 은빛 제독
- 배경: 함대가 늘어선 항구, 깃발
```
A silver-haired female admiral with long silver hair and teal eyes, a white admiral cap with a gold anchor, a white and gold admiral coat over black clothes, a large futuristic energy cannon at her side. Background: a harbor with a fleet of warships, flags flying, golden evening light. Commanding, wild mood.
```

### 훅 (hook)
- 참고 그림: `훅/hook-1.png`
- 생김새: 금발, 파란 눈, 흰 깃털과 금 별이 달린 남색 해적 모자, 흰·남색·금 해적 코트, 커다란 초승달 갈고리
- 컨셉: 자유의 바다를 누비는 해적
- 배경: 보물이 쌓인 해적선 선장실과 바다
```
A pirate with blond hair and blue eyes, a navy tricorn hat with a white plume and a gold star, a white, navy and gold pirate coat, wielding a large crescent hook blade. Background: the deck of a pirate ship at sunset, treasure chests and ropes, the open sea. Daring, cheerful mood.
```

### 오르카 (orca)
- 참고 그림: `오르카/ChatGPT 이미지 2026년 11월 6일 오전 12_24_53.png`
- 생김새: 풍성한 금발(남), 파란 눈, 웃통 벗은 몸, 흰 바지와 금빛 허리띠, 푸른 물이 감긴 주먹
- 컨셉: 바다의 자유를 주먹에 담은 격투가
- 배경: 파도가 부서지는 모래사장
```
A young male fighter with fluffy blond hair and blue eyes, shirtless, white pants with a golden sash, both fists wrapped in glowing blue water, in a fighting stance. Background: a beach with big waves breaking, sunlight on the water. Strong, free mood.
```

### 웨이브 (wave)
- 참고 그림: `웨이브/ChatGPT 이미지 2026년 11월 6일 오전 02_30_46.png`
- 생김새: 크림빛 긴 포니테일, 파란 눈, 머리 위 고글, 흰 후드 재킷과 검은 수영복, 노랑·파랑 서핑보드
- 컨셉: 물을 상상만으로 빚는 서핑 소녀
- 배경: 거대한 파도 터널
```
A surfer girl with a long cream-white ponytail, blue eyes, goggles on her head, a white hooded jacket over a black swimsuit, holding a yellow and blue surfboard, water shaped by her imagination splashing around. Background: a huge curling wave with sunlight shining through it. Sunny, carefree mood.
```

### 미류 (miryu)
- 참고 그림: `미류/팔방향 보행 중인 은빛 머리 전사 소녀 spritesheet.png`
- 생김새: 긴 흰 머리(끝은 청록), 청록 용뿔, 금빛 눈, 청록·흰 옷, 붉은 술 달린 긴 파란 검
- 컨셉: 물의 흐름 그 자체로 싸우는 해룡 수인 검사
- 배경: 바닷속 신전, 흐르는 물줄기
```
A sea-dragon beastfolk swordswoman with long white hair fading to teal at the tips, teal dragon antlers, golden eyes, a teal and white robe dress, holding a long blue katana with a red tassel, water flowing around her like ribbons. Background: an underwater temple with light rays and flowing currents. Graceful, flowing mood.
```

## 성국

### 베아트리스 (beatrice)
- 참고 그림: `베아트리스/베아트리스 성기사 워킹 스프라이트 시트.png`
- 생김새: 땋은 왕관 머리의 물결치는 금발, 가시 금빛 광배, 흰·금 갑옷, 붉은 망토(금 십자), 거대한 대검
- 컨셉: '심판의 불꽃', 한 번의 참격으로 성벽을 가르는 성국 최고 전력
- 배경: 성화가 타오르는 대성당 앞 광장
```
A holy knight woman with long wavy golden hair braided into a crown, a spiked golden halo, white and gold armor, a red cape with a gold cross, holding a massive greatsword wreathed in holy fire. Background: the plaza in front of a grand cathedral, a giant sacred flame burning in a brazier. Majestic, unstoppable mood.
```

### 이안 (ian)
- 참고 그림: `이안/백색 황금 마도사의 보행 스프라이트 시트.png`
- 생김새: 긴 은발의 나이 든 남자, 안경, 흰·금 로브(남색 안감), 보랏빛 등불, 빛나는 실
- 컨셉: '침묵의 서기관', 적의 규칙을 기록해 속박하는 인과율 조작형 암살자
- 배경: 대성당 지하 기록실, 끝없는 두루마리
```
An old male scribe with long silver hair and glasses, white and gold robes with navy lining, a purple lantern in one hand, glowing threads of light weaving from his fingers. Background: an archive beneath a cathedral, endless shelves of scrolls, candlelight. Silent, calculating mood.
```

### 가브리엘 (gabriel)
- 참고 그림: `가브리엘/성스러운 수호자의 행진 팔레트.png`
- 생김새: 금발(남), 가시 금빛 광배, 금빛 판금 갑옷, 털 달린 파란 망토, 십자 문양 방패, 망치
- 컨셉: '철옹의 방패', 빛의 갑옷을 두른 절대 수호자
- 배경: 대성당 정문 앞, 갈라지는 땅
```
A male holy guardian with blond hair, a spiked golden halo, heavy golden plate armor, a fur-trimmed blue cape, a large tower shield with a cross emblem and a war hammer, the ground cracking under his feet. Background: the great gate of a cathedral, light pouring from inside. Unbreakable, steadfast mood.
```

### 세레나 (serena)
- 참고 그림: `세레나/백금빛 천사 전사의 걷기 스프라이트 시트.png`
- 생김새: 물결치는 백금빛 긴 머리, 흰 백합과 금빛 태양 광배, 금·흰 무희 옷, 강철 가시 채찍
- 컨셉: '환혹의 무희', 춤추듯 가시 채찍을 휘두르는 전술가
- 배경: 성국 궁전의 달빛 테라스
```
A dancer with long wavy platinum hair, a white lily and a golden sun halo, a gold and white dancer outfit with flowing cloth, twirling steel thorn whips around her in a dance pose. Background: a moonlit palace terrace with white columns, glowing light thorns in the air. Enchanting, dangerous mood.
```

### 라파엘 (rafael)
- 참고 그림: `라파엘/은빛 궁수 마법사의 걷기 사이클 스프라이트 시트.png`
- 생김새: 금 십자가 수놓인 흰 두건, 연한 은발, 금빛 광배, 흰·금 로브, 파란 보석 조준경이 달린 거대한 흰 복합 대궁
- 컨셉: '폭풍의 사수', 초장거리 저격수
- 배경: 구름 위 대성당 첨탑
```
A hooded archer in a white hood embroidered with a gold cross, pale silver hair, a golden halo, white and gold robes, drawing a giant white compound bow with a glowing blue aether scope. Background: the top of a cathedral spire above the clouds, storm winds swirling. Focused, distant mood.
```

### 유리엘 (yuriel)
- 참고 그림: `유리엘/성녀 수호자의 8방향 보행 스프라이트.png`
- 생김새: 긴 금발, 금 십자 흰 베일, 금빛 광배, 흰·파랑 성복, 성수 수정구, 사슬 철퇴
- 컨셉: '단죄의 성녀', 치유와 결계, 이단자에게는 철퇴
- 배경: 스테인드글라스가 빛나는 성당 안
```
A saint with long golden hair, a white veil with a gold cross, a golden halo, white and blue holy robes, a crystal orb of holy water in one hand and a spiked flail on a chain in the other, a faint barrier of light around her. Background: inside a cathedral with glowing stained-glass windows (abstract patterns, no figures). Merciful yet stern mood.
```

### 미카엘라 (michaela)
- 참고 그림: `미카엘라/성스러운 여사제 걷기 스프라이트 시트.png`
- 생김새: 백합을 꽂은 물결치는 백금빛 긴 머리, 금빛 광배, 금·흰 성복, 몸 둘레에 떠 있는 작은 창과 검 무리
- 컨셉: '공허의 인도자', 무한의 무기 보관소로 폭격하는 전투광
- 배경: 하늘의 성국 위, 떠 있는 무기들
```
A holy battle-maniac woman with long wavy platinum hair and a white lily, a golden halo, gold and white holy robes, dozens of small spears and swords floating around her in a ring. Background: the sky above a holy city, more weapons hovering in formation, rays of light. Fervent, overwhelming mood.
```

## 새벽의 성흔

### 블래스트 (blast)
- 참고 그림: `블래스트/블래스트 악마 사냥꾼 보행 스프라이트 시트.png`
- 생김새: 높이 묶은 흰 긴 머리(붉은 줄), 주황 고글, 붉은 눈, 흰 십자 무늬의 붉은·검은 코트, 산탄총
- 컨셉: '폭멸의 탄환', 근접한 악마를 날려 버리는 화력 담당
- 배경: 불타는 밤거리, 터지는 폭발
```
A demon hunter with long white hair in a high ponytail streaked red, orange goggles, red eyes, a red and black coat with white cross patterns, holding a heavy shotgun. Background: a gothic city street at night with explosions and flames, moonlight above. Fiery, reckless mood.
```

### 네일러 (nailer)
- 참고 그림: `네일러/고딕 성기사 처형자의 걷기 애니메이션 스프라이트 시트.png`
- 생김새: 긴 은발, 눈을 가린 붕대(붉은 자국), 가시 왕관 광배, 붉은 리본의 어두운 회색 옷, 거대한 못과 붉은 십자 망치
- 컨셉: '못 박는 심판관', 악마의 영혼을 대지에 고정하는 사냥꾼
- 배경: 거대한 못이 박힌 묘지
```
A hunter with long silver hair, eyes covered by a bandage with a red mark, a halo of thorns, dark gray robes with red ribbons, carrying a giant iron nail and a heavy hammer marked with a red cross. Background: a moonlit graveyard with enormous nails driven into the ground. Grotesque, solemn mood.
```

### 시저스 (scissors)
- 참고 그림: `시저스/고딕 쌍가위 전사의 걷기 스프라이트 시트.png`
- 생김새: 연보랏빛 긴 머리, 붉은 눈, 가시와 붉은 장미의 검은 두건, 검은·붉은 고딕 옷, 거대한 가위
- 컨셉: '단죄의 가위', 운명의 실까지 자르는 도살자
- 배경: 끊어진 붉은 실이 흩날리는 고딕 성당 안
```
A hunter with long lavender hair and red eyes, a black hood with spikes and a red rose, a black and red gothic dress, holding a giant pair of scissors with crimson blades. Background: inside a gothic church at night, severed red threads drifting in the air. Cold, merciless mood.
```

### 헬피스트 (hellfist)
- 참고 그림: `헬피스트/hellfist-1.png`
- 생김새: 헝클어진 은발, 붉은 눈, 열린 검은 코트와 맨가슴, 십자 목걸이, 붉은 악마 팔
- 컨셉: '적혈의 주먹', 악마의 팔을 이식한 사냥꾼
- 배경: 부서진 돌바닥, 붉은 달
```
A male hunter with messy silver hair and red eyes, an open black coat over a bare chest, a cross necklace, both arms transplanted demonic red armored arms with claws glowing crimson. Background: a shattered stone plaza under a red moon. Savage, defiant mood.
```

### 실버불렛 (silverBullet)
- 참고 그림: `실버불릿/은빛 사냥꾼 걷기 애니메이션 시트.png`
- 생김새: 긴 은빛 땋은 머리, 연보라 눈, 금 십자와 흰 깃털의 챙 넓은 검은 모자, 검·금 사냥꾼 코트, 은빛 권총
- 컨셉: '은빛 집행자', 은탄과 성수 폭탄의 정통파 엘리트
- 배경: 안개 낀 고딕 다리 위, 보름달
```
An elite hunter with a long silver braid and lavender eyes, a wide-brimmed black hat with a gold cross and a white feather, a black and gold hunter coat, twin silver pistols. Background: a foggy gothic bridge under a full moon, holy water vials glowing on the belt. Stylish, composed mood.
```

### 블루 플레임 (blueFlame)
- 참고 그림: `블루플레임/눈가리개 마도사의 불꽃 행진 픽셀 스프라이트.png`
- 생김새: 헝클어진 남흑색 머리, 눈가리개, 검은·파란 로브, 푸른 불꽃, 푸른 불꽃의 활
- 컨셉: '청염의 맹인', 악마의 기운을 푸른 불꽃으로 감지
- 배경: 푸른 불길이 오르는 밤의 폐성당
```
A blind magic warrior with messy dark navy hair and a blindfold, black and blue robes, blue flames flickering around him, drawing a bow made of blue fire. Background: a ruined cathedral at night with blue flames rising. Quiet, intense mood.
```

### 루나틱 (lunatic)
- 참고 그림: `루나틱/은빛 달빛 검객 걷기 스프라이트 시트.png`
- 생김새: 연보랏빛 은발 긴 포니테일, 초승달 머리 장식, 흰·남색 갑옷 드레스(달 문양), 레이피어
- 컨셉: '월광의 검사', 새벽의 성흔 리더
- 배경: 거대한 보름달 앞 고딕 첨탑
```
A noble swordswoman, leader of the demon hunters, with long lavender-silver hair in a ponytail and a crescent moon hair ornament, a white and navy armored dress with moon patterns, a slender rapier held forward. Background: gothic spires before a giant full moon, silver moonlight. Elegant, cold mood.
```

### 인시전 (incision)
- 참고 그림: `인시전/쌍도끼를 든 백발 전사 워킹 스프라이트.png`
- 생김새: 붉은 리본의 헝클어진 크림빛 머리, 붉은 눈, 털 깃의 검은 갑옷, 붉은 망토, 쌍도끼
- 컨셉: '쌍도끼의 도살자', 광전사
- 배경: 핏빛 안개 속 전장
```
A berserker with wild cream-white hair tied with red ribbons, red eyes, black armor with a fur collar, a red cape with a white emblem, twin battle axes. Background: a battlefield shrouded in blood-red mist under the moon. Frenzied, savage mood.
```

### 크루세이더 (crusader)
- 참고 그림: `크루세이더/성십자가의 거인 걷기 사이클 스프라이트 시트.png`
- 생김새: 압도적인 덩치의 기사, 가시 왕관 투구, 은·금 판금 갑옷, 흰 털, 붉은 망토, 거대한 십자가 둔기
- 컨셉: '성십자가의 거인', 탱커
- 배경: 무너진 성벽 앞, 갈라진 대지
```
A giant armored knight with a helmet crowned with spikes, silver and gold plate armor, white fur over the shoulders, a red cape, carrying an enormous cross as a blunt weapon. Background: a broken city wall at night, the ground split from his blow. Overwhelming, holy mood.
```

## 실베르

### 조커 (joker)
- 참고 그림: `조커/네온 사이버펑크 조커 스프라이트 시트.png`
- 생김새: X 눈의 네온 보라 헬멧 가면, 보라·연두 무늬 재킷, 스페이드 카드
- 컨셉: '튕기는 카드 투척자'
- 배경: 눈 내리는 북부 도시의 네온 카지노 앞
```
A masked card thrower with a neon purple helmet-mask showing glowing X-shaped eyes, a black jacket with purple and lime patterns, spade cards fanned in one hand and flying around. Background: a snowy northern city at night in front of a neon-lit casino (no readable text). Playful, chaotic mood.
```

### 쉐도잉 (shadowing)
- 참고 그림: `쉐도잉/마법 붓을 든 정령 소녀 스프라이트 시트.png`
- 생김새: 연보랏빛 단발, 금빛 눈, 남색 베레모와 금 장식, 남색 망토, 마법 붓, 푸른 영혼 손
- 컨셉: '그림을 그리는 정령 소녀'
- 배경: 눈 덮인 숲, 붓으로 그린 학과 구름이 살아남
```
A spirit girl with short lilac hair and golden eyes, a navy beret with gold ornaments, a navy cape, holding a large magic paintbrush, translucent blue spirit hands painting in the air. Background: a snowy forest where painted cranes and clouds come alive from her brush strokes. Dreamy, artistic mood.
```

### 인형술사 (puppeteer)
- 참고 그림: `인형술사/인형술사 소녀 걷기 사이클 spritesheet.png`
- 생김새: 긴 검은 머리 소녀, 흰 드레스, 붉은 실, 위에 떠 있는 거대한 인형 손, 매달린 작은 인형들
- 컨셉: '붉은 실로 인형을 부리는 소녀'
- 배경: 눈 내리는 낡은 인형 극장
```
A girl with long black hair and a pale white dress, red strings flowing from her fingers, giant puppet hands floating above her holding the strings, small dolls dangling around her. Background: an old puppet theater in the snowy north, a dim stage with velvet curtains. Creepy, lonely mood.
```

### 래빗 (rabbit)
- 참고 그림: `래빗/망치 든 치비 소녀 걷기 스프라이트 시트.png`
- 생김새: 연분홍 쌍 상투 머리와 연두 리본, 보라 눈, 분홍·보라 프릴 옷, 곰 얼굴이 달린 거대한 분홍 망치
- 컨셉: '망치를 든 유령 소녀'
- 배경: 눈 덮인 유령의 놀이터
```
A ghost girl with pale pink hair in twin buns with lime ribbons, purple eyes, a pink and purple frilly dress, swinging a giant pink hammer with a cute bear face on it. Background: a snowy haunted playground at night, faint ghost lights. Cute, spooky mood.
```

### 백령 (baekryeong)
- 참고 그림: `백령/8프레임 치비 전사 워킹 스프라이트 시트.png`
- 생김새: 흰색에서 파랑으로 물드는 긴 포니테일, 파란 오니 뿔, 금빛 눈, 흰·파랑 무사 옷, 등 뒤 대태도
- 컨셉: '영혼과 대태도를 다루는 오니 소녀'
- 배경: 푸른 영혼불이 떠다니는 눈 덮인 신사
```
An oni girl with a long ponytail fading from white to blue, two blue oni horns, golden eyes, a white and blue samurai outfit, drawing a huge odachi longsword, blue spirit flames floating around. Background: a snow-covered shrine at night with floating blue soul lights. Fierce, ethereal mood.
```

### 빙설 (bingseol)
- 참고 그림: `빙설/빙결 해군 소녀 걷기 애니메이션 스프라이트 시트.png`
- 생김새: 연보랏빛 은발 긴 머리, 닻과 눈꽃이 달린 남색 해군 모자, 흰·남색 해군 코트, 얼음창
- 컨셉: '얼음을 다루는 자유분방한 해군 소녀'
- 배경: 얼어붙은 북쪽 바다, 빙산과 군함
```
A navy girl with long lavender-silver hair, a navy sailor cap with an anchor and a snowflake, a white and navy naval coat, holding a spear of ice. Background: a frozen northern sea with icebergs and a warship locked in ice. Free-spirited, frosty mood.
```

### 아수라 (asura)
- 참고 그림: `아수라/정교한 기계 팔을 지닌 빙설의 군주 spritesheet.png`
- 생김새: 풍성한 금발, 파란 눈, 털 깃의 남색·금 귀족 코트, 등에서 뻗은 여섯 개의 짙은 파랑 귀신 주먹
- 컨셉: '귀신의 주먹 6개와 자기 주먹으로 싸우는 싸움꾼'
- 배경: 눈보라 치는 북부 성채 앞
```
A fighter with fluffy blond hair and blue eyes, a navy and gold noble coat with a fur collar, six large dark-blue spectral clawed arms spreading from his back, fists raised. Background: a northern fortress in a blizzard. Overwhelming, proud mood.
```

### 혼령 (honryeong)
- 참고 그림: `혼령/보랏빛 기모노 여인의 걷기 스프라이트.png`
- 생김새: 금 꽃비녀를 꽂은 연보랏빛 은발 올림머리, 털 목도리, 보랏빛 기모노, 긴 곰방대와 연보랏빛 연기
- 컨셉: '곰방대 연기로 싸우는 여인', 연기 늑대·용
- 배경: 눈 내리는 밤의 기와 거리, 연기 짐승
```
A woman with lilac-silver hair in an updo with gold flower hairpins, a fur stole, a purple kimono, holding a long smoking pipe, lavender smoke forming a wolf and a dragon around her. Background: a snowy night street with tiled roofs and lanterns. Languid, mysterious mood.
```

### 백인장 (baekinjang)
- 참고 그림: `백인장/사이버 랜서 걷기 동작 스프라이트 시트.png`
- 생김새: 긴 은백 머리, 붉은 눈, 칼날 달린 붉은·은빛 기계 잠자리 날개, 쌍검, 작은 창 드론
- 컨셉: '기계 날개와 미니 창 드론을 부리는 쌍검의 기사'
- 배경: 눈 덮인 산맥 위 하늘
```
A knight with long silver-white hair and red eyes, mechanical dragonfly wings of red and silver blades on her back, twin swords, small red spear-shaped drones circling her. Background: the sky above snowy mountain ranges. Sharp, relentless mood.
```

### 아리아 (aria)
- 참고 그림: `아리아/황금 지휘자의 8방향 걷기 스프라이트.png`
- 생김새: 긴 은발, 금빛 눈, 깃털과 높은음자리표가 달린 흰 모자, 흰·금 코트, 지휘봉, 악기를 든 금빛 영혼 팔
- 컨셉: '영혼 팔이 맨 큰 악기와 노래로 싸우는 지휘자 소녀'
- 배경: 눈 내리는 북부 오페라 극장 무대
```
A conductor girl with long silver hair and golden eyes, a white hat with a feather and a treble clef ornament, a white and gold coat, raising a baton, golden ghostly arms around her playing a violin, a harp and a horn. Background: the stage of a grand northern opera house with snow falling through a broken dome, golden musical light. Uplifting, grand mood.
```

### 레이븐 (chessRaven)
- 참고 그림: `레이븐/은빛 왕관의 창기사 걷기 스프라이트.png`
- 생김새: 긴 은발, 금빛 눈, 체스 왕관 머리 장식, 흑백 갑옷 드레스, 창
- 컨셉: '흑백 체스 왕국의 창기사'
- 배경: 거대한 체스판 위, 흑백 말들
```
A lance knight girl with long silver hair and golden eyes, a chess-crown headpiece, a black and white armored dress, holding a long lance. Background: a giant snowy chessboard battlefield with huge black and white chess pieces. Dignified, strategic mood.
```

### 기어스 (gears)
- 참고 그림: `기어스/실버 기사 메이드의 4방향 걷기 스프라이트.png`
- 생김새: 긴 은발, 파란 눈, 파란 리본의 메이드 머리띠, 은빛 갑옷 메이드 드레스, 파란 별 문양의 둥근 은방패 둘
- 컨셉: '은빛 쌍방패 기사 메이드'
- 배경: 눈 덮인 성의 대리석 복도
```
A knight maid with long silver hair and blue eyes, a maid headdress with blue ribbons, a silver armored maid dress, two round silver shields with blue star emblems, one on each arm. Background: a marble corridor of a snowy northern castle, a blue hexagon barrier glowing. Loyal, steadfast mood.
```

## 아슈바르

### 느아르 (noir)
- 참고 그림: `느아르/네온 그린 배경의 다크 슬래시 스프라이트 시트.png` (초록 배경)
- 생김새: 검은 머리, 붉은 눈, 검은 긴 코트와 높은 깃, 공허의 손톱(검은 기운)
- 컨셉: 태초의 색채 악마 7원색 군단의 검정, 빛과 색을 삼키는 공허
- 배경: 모든 색이 빨려 들어가는 검은 공허
```
The reference sheet has a bright green chroma-key background: ignore it completely, no green in the image. A demon with black hair and red eyes, a long black coat with a high collar, black void energy forming huge claws around his hand. Background: a black void where all color and light is being swallowed, fragments of a colorful world dissolving into darkness. Absolute, chilling mood.
```

### 루주 (rouge)
- 참고 그림: `루주/붉은 머리 검객의 픽셀 스프라이트 시트.png` (초록 배경)
- 생김새: 허리까지 오는 진홍 머리, 파란 눈, 검은 가죽 옷, 장미 쌍검
- 컨셉: 7원색의 빨강, 피와 장미로 물든 광란
- 배경: 붉은 장미가 가득한 핏빛 정원
```
The reference sheet has a bright green chroma-key background: ignore it completely, no green in the image. A demon swordswoman with very long crimson hair and blue eyes, black leather armor, twin rose-themed swords trailing red petals. Background: a blood-red garden overflowing with red roses and thorns under a crimson sky. Frenzied, beautiful mood.
```

### 블뢰 (bleu)
- 참고 그림: `블뢰/블뢰 걷기.png` (초록 배경)
- 생김새: 물결치는 연보랏빛 흰 긴 머리, 뾰족한 귀, 얼음 수정 왕관과 검은 굽은 뿔, 어두운 갑옷과 파란 망토, 하얀 마도서
- 컨셉: 7원색의 파랑, 시간마저 얼리는 겨울
- 배경: 시간이 멈춘 얼음 궁전
```
The reference sheet has a bright green chroma-key background: ignore it completely, no green in the image. A demon with long wavy pale lavender-white hair, pointed ears, black curved horns with an ice crystal crown, dark armor and a blue cape, holding an open white grimoire glowing blue. Background: an ice palace where time has frozen, snowflakes hanging still in the air. Cold, eternal mood.
```

### 존 (jaune)
- 참고 그림: `존/존 걷기.png` (초록 배경)
- 생김새: 헝클어진 흰 머리, 금빛 눈, 뾰족한 귀, 번개 무늬의 흰·금 코트, 금빛 손아귀
- 컨셉: 7원색의 노랑, 하늘을 찢는 황금 번개
- 배경: 황금 번개가 쏟아지는 하늘
```
The reference sheet has a bright green chroma-key background: ignore it completely, no green in the image. A demon with messy white hair, golden eyes, pointed ears, a white and gold coat with lightning patterns, a golden gauntlet crackling with lightning. Background: a sky torn open by golden lightning bolts over dark clouds. Wild, electric mood.
```

### 마젠타 (magenta)
- 참고 그림: `마젠타/마젠타 걷기.png` (초록 배경)
- 생김새: 자줏빛에서 분홍으로 물드는 물결 긴 머리, 분홍 눈, 뾰족한 귀, 어깨 드러낸 흰 블라우스, 짧은 청바지, 부채
- 컨셉: 7원색의 자홍, 저주의 꽃으로 홀리는 욕망
- 배경: 자홍빛 저주의 꽃밭
```
The reference sheet has a bright green chroma-key background: ignore it completely, no green in the image. A demon girl with long wavy hair fading from plum to hot pink, pink eyes, pointed ears, an off-shoulder white blouse and short denim shorts, holding a folding fan. Background: a field of glowing magenta cursed flowers releasing sweet hazy pollen. Tempting, dangerous mood.
```

### 베르 (vert)
- 참고 그림: `베르/베르 걷기.png` (초록 배경)
- 생김새: 은백 머리, 초록 눈, 잎과 덩굴로 된 두건, 해진 짙은 초록 망토, 덩굴 쌍낫
- 컨셉: 7원색의 초록
- 배경: 덩굴에 삼켜진 폐허 숲
```
The reference sheet has a bright green chroma-key background: ignore it completely, no green in the image. A demon with silver-white hair and green eyes, a hood made of leaves and vines, a ragged dark green cloak, twin sickles made of thorny vines. Background: a ruined forest swallowed by enormous vines, green light through the overgrowth. Creeping, quiet mood.
```

### 블랑 (blanc)
- 참고 그림: `블랑/블랑 걷기.png` (초록 배경)
- 생김새: 아주 긴 흰 머리, 분홍 눈, 머리 위 선글라스, 검은 짧은 윗옷, 헐렁한 흰 옷, 순백의 부채
- 컨셉: 7원색의 하양
- 배경: 모든 것이 하얗게 바랜 빛의 세계
```
The reference sheet has a bright green chroma-key background: ignore it completely, no green in the image. A demon with extremely long white hair, pink eyes, sunglasses pushed up on her head, a black crop top under loose white clothes, holding a pure white fan. Background: a world bleached completely white by light, faint outlines of buildings fading away. Carefree, eerie mood.
```

## 아카식 레코드 (숨은 캐릭터)

### 서기관 (scribe)
- 참고 그림: `서기관/scribe-1.png`
- 생김새: 물결치는 긴 은발, 금 별 장식, 보랏빛 검은 로브(금 테·별 무늬), 떠 있는 두꺼운 책, 깃펜
- 컨셉: 아카식 레코드의 서기관
- 배경: 끝없는 서고와 별하늘
```
A scribe with long wavy silver hair and a gold star ornament, a purple-black robe with gold trim and star patterns, a thick book floating open beside them, writing in the air with a quill that leaves golden light ribbons. Background: endless floating bookshelves under a starry cosmic sky. Calm, all-seeing mood. No readable text.
```

### 오리 (duck)
- 참고 그림: `오리/duck-1.png`
- 생김새: 통통한 노란 오리, 흰 깃털이 달린 파란 모자, 파란 목도리, 주황 부리와 발, 뒤따르는 새끼 오리
- 컨셉: 아주 튼튼한 수수께끼의 오리
- 배경: 서고 한가운데 연못
```
A chubby yellow duck (not a human) wearing a small blue cap with a white feather and a blue scarf, orange beak and feet, a tiny duckling following behind, quacking proudly. Background: a little pond in the middle of a giant cosmic library. Cute, funny mood.
```

### 별지기 (stargazer)
- 참고 그림: `별지기/stargazer-1.png`
- 생김새: 물결치는 흰 긴 머리, 금빛 별 장식과 고리, 남색 별무늬 망토, 별 지팡이
- 컨셉: 공격한 자리에 별을 박는 별지기
- 배경: 별자리가 이어진 밤하늘 천문대
```
A girl with long wavy white hair, golden star ornaments and a golden ring halo, a navy cape with star patterns, holding a star-topped staff, planting glowing stars in the air. Background: an open-air observatory under a night sky full of connected constellations. Dreamy, starry mood.
```

### 에테르 광부 (miner)
- 참고 그림: `에테르 광부/miner-1.png`
- 생김새: 노란 안전모와 등, 밤색 머리, 붉은 작업복, 푸른 에테르 결정 곡괭이
- 컨셉: 곡괭이 하나로 세상 무엇이든 캐는 광부
- 배경: 푸른 에테르 결정이 가득한 광산
```
A miner with brown hair, a yellow hard hat with a lamp, a red work suit with pouches, swinging a giant pickaxe with a head of glowing blue aether crystal. Background: a deep mine glittering with blue aether crystals. Hardworking, cheerful mood.
```

### 운명의 여행자 (voyager)
- 참고 그림: `운명의 여행자/voyager-1.png`
- 생김새: 그을린 피부의 활잡이(남), 갈색 머리와 금 머리장식, 흰 천 옷과 금 장식, 운명의 활, 허리의 모래시계
- 컨셉: 신들의 바다를 떠도는 활잡이
- 배경: 신전 기둥이 떠 있는 신들의 바다
```
A male archer with tanned skin and brown hair, a gold headpiece, white cloth garments with gold ornaments, an hourglass at his waist, drawing a golden bow of fate. Background: the sea of the gods with floating temple pillars and a golden sunset. Adventurous, mythic mood.
```

### 제우스 (zeus)
- 참고 그림: `제우스/zeus-1.png`
- 생김새: 흰 머리와 흰 수염, 흰 토가와 금 장식, 금 월계관, 번개창
- 컨셉: 신들의 왕
- 배경: 구름 위 신전, 번개
```
The king of the gods, an old man with flowing white hair and beard, a white toga with gold ornaments, a golden laurel crown, raising a golden lightning spear. Background: a temple above the clouds with lightning striking around. Almighty, majestic mood.
```

## 이방인 (숨은 캐릭터)

### 차원의 순례자 (pilgrim)
- 참고 그림: `차원의 순례자/pilgrim-1.png`
- 생김새: 물결치는 분홍빛 긴 머리 소녀, 큰 파란 눈, 헐렁한 회녹색 후드 재킷, 흰 티, 남색 반바지, 몸보다 큰 천 배낭(차원 수정 열쇠고리)
- 컨셉: 차원을 다니며 무기·능력·물건을 모으는 수집가
- 배경: 여러 세계가 이어진 차원의 틈
```
A girl with long fluffy wavy pink hair and big blue eyes, a loose gray-green hooded jacket, a white shirt, navy shorts and sneakers, carrying a huge soft canvas backpack bigger than her body with dimension crystal keychains. Background: a dimensional rift where many different worlds are visible through floating portals. Curious, whimsical mood.
```

### 몰락한 왕 (fallenKing)
- 참고 그림: `몰락한 왕/fallenKing-1.png`
- 생김새: 가시 돋은 검은 판금 갑옷(은빛 테), 가시 왕관, 푸른 눈, 머리 위와 갑옷 틈의 푸른 불꽃, 찢어진 검은·보라 망토, 거대한 츠바이핸더(검은 날·붉은 빛 날 끝)
- 컨셉: 영혼 10,000개로 다시 일어난 옛 제국의 왕
- 배경: 무너진 옛 제국의 왕좌
```
A fallen king in spiked black plate armor with silver trim, a crown of thorns, glowing blue eyes in a shadowed face, blue flames rising from his head and armor gaps, a torn black and purple cape, holding a huge zweihander with a black blade and a red glowing edge. Background: the ruined throne hall of a fallen empire, blue soul flames drifting. Dreadful, majestic mood.
```

## 서고의 감시자 (한정)

### 빛의 사도 (lux)
- 참고 그림: `빛의 사도/lux-1.png`
- 생김새: 허리까지 오는 검은 긴 머리(안쪽 흰 머리), 검은 높은 깃 옷, 배 가운데 빛의 문신, 검은 반바지, 맨발, 빛의 검(주황·노랑·흰 빛)(여)
- 컨셉: 떨어진 신의 사도
- 배경: 무너진 하늘 신전, 떨어지는 빛
```
A fallen apostle of a god, a woman with waist-length black hair with white inner layers, a black high-collar outfit, a glowing tattoo of light on her stomach, black shorts, barefoot, holding a sword made of orange, yellow and white light. Background: a collapsed temple in the sky with shafts of light falling through the broken ceiling. Sacred, sorrowful mood.
```
