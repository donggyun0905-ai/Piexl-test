import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.49.55",
    date: "2026-11-06",
    items: {
      ko: ["캐릭터 선택창 나라 탭·아카이브 나라 색: 탈라시아는 하늘색, 성국은 흰색 (색이 없어 검게 보이던 것 고침)"],
      en: ["Nation colors in the character select tabs and the archive: Thalassia is sky blue, the Holy Kingdom is white (they showed as black before)"],
      ja: ["キャラクター選択の国タブ・アーカイブの国の色：タラシアは空色、聖国は白（色がなく黒く見えていたのを修正）"],
    },
  },
  {
    version: "0.49.54",
    date: "2026-11-06",
    items: {
      ko: [
        "베아트리스: 공격 모습의 왼쪽·오른쪽이 바뀌어 있던 것 바로잡음",
        "베아트리스 기본 공격: 1타(왼→오)·2타(오→왼)가 대각선 칼선이라 둘이 겹쳐 X자가 됨 · 3타는 그 X자 그대로 다시 베어 터뜨림 ('+' 모양 빼기)",
        "베아트리스: 악이 쌓인 적을 쓰러뜨리면 그 악이 붉은 넋이 되어 나에게 들어와 심판까지의 수에 쌓임 (처단하지 않아도)",
        "악의 마크: 적 머리 위에 뿔 달린 붉은 문장 + '×숫자' (7 이상이면 타오름) · 내 머리 위에도 모은 악 '×숫자'",
        "자애: 캐릭터 둘레에 동그란 성녀의 빛 영역(노랑·하양, 도는 빛 십자·피어오르는 빛 알갱이) · 곳곳에 깃털이 흩날림",
        "이펙트 다듬기: 가운데 굵고 끝이 가는 빛 칼선 · 불티 · X자 터짐 · 처단 X자 · 일식의 춤 일식 고리 잔상 · 낙인 불꽃 칼날 · 태양 검날 빛살 · 심판",
      ],
      en: [
        "Beatrice: fixed the attack sprites' left/right being swapped",
        "Beatrice basic attack: hit 1 (left→right) and hit 2 (right→left) are diagonal slashes that overlap into an X · hit 3 re-cuts that same X and bursts it (no more '+' shape)",
        "Beatrice: killing a foe with Evil sends that Evil to her as a red soul, counting toward Judgment (even without Execution)",
        "Evil mark: a horned crimson sigil + '×number' above foes (burns at 7+) · her collected Evil also shows '×number' above her head",
        "Mercy: a round field of saintly light (yellow · white, orbiting light crosses, rising motes) around her · feathers flutter all around",
        "Polished effects: light slashes thick in the middle and thin at the ends · embers · X burst · Execution X · Eclipse Dance eclipse-ring afterimages · flaming Brand blade · Solar Blade rays · Judgment",
      ],
      ja: [
        "ベアトリス：攻撃画像の左右が逆だったのを修正",
        "ベアトリスの通常攻撃：1撃目（左→右）・2撃目（右→左）が斜めの剣線で、重なってX字になる · 3撃目はそのX字をそのまま斬り直して破裂（「+」の形をなくした）",
        "ベアトリス：悪が溜まった敵を倒すと、その悪が赤い魂となって自分に入り、審判までの数に溜まる（処断しなくても）",
        "悪のマーク：敵の頭上に角のある赤い紋章 + 「×数字」（7以上で燃える）· 自分の頭上にも集めた悪「×数字」",
        "慈愛：キャラクターの周りに丸い聖女の光の領域（黄・白、回る光の十字・立ち昇る光の粒）· あちこちに羽根が舞う",
        "エフェクトを磨き直し：中央が太く先が細い光の剣線 · 火の粉 · X字の破裂 · 処断のX字 · 日食の舞の日食の輪の残像 · 烙印の炎の刃 · 太陽剣刃の光条 · 審判",
      ],
    },
  },
  {
    version: "0.49.53",
    date: "2026-11-06",
    items: {
      ko: [
        "새 나라 성국 · 새 캐릭터 베아트리스 '심판의 불꽃': 빛의 갑옷을 두른 성국의 최고 전력, 묵직한 브레이커 (체력 130 · 공격력 15 · 방어력 3 · 이동 1.3, 여는 조건: 최대 체력 220 달성)",
        "성국은 스킬형: 기본 공격 + 숫자 키 스킬 넷 (1·2·3·4, 설정에서 키 변경 · 모바일 스킬 버튼)",
        "쌍검 3연격: 왼→오 · 오→왼 베기로 X자 → 3타가 그 X자를 다시 X자로 베어 터뜨림",
        "악: 나를 때린 적에게 쌓임(최대 10, 하나마다 받는 피해 +4%) → 10이면 처단(X자 10개 난발) · 처단으로 지운 악 100개마다 심판(맵 전체를 가르는 거대한 X자 태양 검격) · 체력이 적을수록 재생력(최대 30)·화염 계수(최대 공격력의 200%)가 오름",
        "1 태양 검날(10초 공격 속도 +30% · 화염 · 화상 5겹, 붉은 태양빛) · 2 일식의 춤(돌진 + 다음 공격 쌍검 2연속) · 3 태양의 낙인(검기, 악 +2) · 4 자애(체력 1로 10초 동안 줄지 않고 화염 계수 400% · 끝나고 10초 회복 불가, 버프 창 '치유 감소')",
        "무기 1 (사멸·절멸의 쌍검) · 전용 아이템 20 · X자 칼빛·처단·심판·낙인 검기·자애 이펙트 · 적 머리 위 악 눈금 · 효과음 · 그림 시트 · 패왕전 스킬",
      ],
      en: [
        "New nation: the Holy Kingdom · New character Beatrice 'Flame of Judgment': the Holy Kingdom's greatest warrior in armor of light, a heavy breaker (HP 130 · ATK 15 · DEF 3 · Move 1.3, unlock: reach 220 max HP)",
        "Holy Kingdom characters are skill-based: a basic attack + four number-key skills (1·2·3·4, rebindable in Settings · skill buttons on mobile)",
        "Twin-blade 3-hit chain: left→right · right→left slashes form an X → the 3rd hit cuts that X again into an X and bursts it",
        "Evil: stacks on foes that hit her (up to 10, +4% damage taken each) → at 10, Execution (10 X-slashes) · every 100 purged Evil brings Judgment (a giant sun X slash across the map) · lower HP raises regeneration (up to 30) and fire coefficient (up to 200% ATK)",
        "1 Solar Blade (10s: +30% attack speed · fire · 5-stack Burn, sun-red light) · 2 Eclipse Dance (dash + next attack is a twin double slash) · 3 Solar Brand (sword wave, +2 Evil) · 4 Mercy (HP 1 that can't drop for 10s, 400% fire coefficient · then 10s of no healing, 'Healing cut' in the buff panel)",
        "1 weapon (Twin Blades of Demise & Annihilation) · 20 exclusive items · X-slash, Execution, Judgment, Brand wave and Mercy effects · Evil gauge above foes · sounds · sprite sheet · Paewang skills",
      ],
      ja: [
        "新しい国「聖国」· 新キャラクター ベアトリス「審判の炎」：光の鎧をまとう聖国の最高戦力、重いブレイカー（体力130 · 攻撃力15 · 防御力3 · 移動1.3、解放条件：最大体力220達成）",
        "聖国はスキル型：通常攻撃 + 数字キーのスキル4つ（1·2·3·4、設定でキー変更 · モバイルはスキルボタン）",
        "双剣の3連撃：左→右 · 右→左斬りでX字 → 3撃目がそのX字をもう一度X字に斬って破裂",
        "悪：自分を攻撃した敵に溜まる（最大10、1つごとに被ダメージ+4%）→ 10で処断（X字10個）· 処断で消した悪100個ごとに審判（マップ全体を断つ巨大なX字の太陽剣撃）· 体力が少ないほど再生力（最大30）・火炎係数（最大攻撃力の200%）が上がる",
        "1 太陽剣刃（10秒 攻撃速度+30% · 火炎 · 火傷5重、真紅の太陽光）· 2 日食の舞（突進 + 次の攻撃が双剣2連）· 3 太陽の烙印（剣気、悪+2）· 4 慈愛（体力1で10秒間減らず火炎係数400% · 終了後10秒回復不可、バフ欄「治癒減少」）",
        "武器1（死滅・絶滅の双剣）· 専用アイテム20 · X字の剣光・処断・審判・烙印の剣気・慈愛のエフェクト · 敵の頭上に悪のゲージ · 効果音 · スプライトシート · 覇王戦スキル",
      ],
    },
  },
  {
    version: "0.49.52",
    date: "2026-11-06",
    items: {
      ko: [
        "미류: 대시 그림의 왼쪽·오른쪽이 바뀌어 있던 것 바로잡음",
        "미류: 대태도 10자루 모두 무기 공격력 배율 +0.3 (청람 1.3 · 수월 1.25 · 격류 1.22 · 와류 1.3 · 명경 1.25 · 유엽 1.22 · 물마루 1.3 · 빙류 1.25 · 심연 1.6 · 무형 1.25) · 천류 해방 해룡 피해 180% → 230%",
        "미류 이펙트 다듬기: 휩쓸 때 칼빛과 칼끝에서 접선으로 튀는 물보라 · 해룡 일섬에 양옆으로 갈라지는 물벽 · 휘는 칼날에 떨어지는 물방울 · 해방 물기둥을 감아 오르는 물줄기 · 폭포 뒤 물안개 · 해룡 머리 깔끔하게",
        "미류: 물길의 흐르는 무늬는 길게 흐르는 물살 줄로, 흘려 모은 물방울은 몸 둘레 고리를 도는 테두리 있는 '물 구슬'로 바꿔 서로 쉽게 구분됨",
        "웨이브: 모은 물의 기술(전용 아이템) 5개마다 공격력 +5 · 방어력 +5 (15개면 +15) · 버프 창에 보임",
        "오르카: 해방 중 받는 피해 -15%",
        "토르켄: 기본 공격력 12 → 17",
      ],
      en: [
        "Miryu: fixed the dash sprites facing the wrong left/right direction",
        "Miryu: all 10 odachi get +0.3 weapon damage multiplier (Seiran 1.3 · Suigetsu 1.25 · Torrent 1.22 · Vortex 1.3 · Clear Mirror 1.25 · Willow Leaf 1.22 · Wave Crest 1.3 · Ice Stream 1.25 · Abyss 1.6 · Formless 1.25) · Heavenly Current sea dragon damage 180% → 230%",
        "Polished Miryu effects: a blade glint and tangential spray from the blade tip on sweeps · water walls parting on both sides of the Dragon Flash · drops falling from the bending edge · water spiraling up the release pillar · mist after the waterfall · a cleaner sea dragon head",
        "Miryu: the current's flowing pattern is now long streaks, while parried drops are outlined 'water pearls' orbiting a ring around the body, so they're easy to tell apart",
        "Wave: every 5 water skills (exclusive items) collected gives ATK +5 · DEF +5 (+15 at 15) · shown in the buff panel",
        "Orca: -15% damage taken during Liberation",
        "Thorken: base attack 12 → 17",
      ],
      ja: [
        "ミリュウ：ダッシュ画像の左右が逆だったのを修正",
        "ミリュウ：大太刀10本すべて武器攻撃力倍率+0.3（青嵐1.3 · 水月1.25 · 激流1.22 · 渦流1.3 · 明鏡1.25 · 柳葉1.22 · 波頭1.3 · 氷流1.25 · 深淵1.6 · 無形1.25）· 天流解放の海竜ダメージ180% → 230%",
        "ミリュウのエフェクトを磨き直し：薙ぎ払いの刃の光と刃先から接線に飛ぶ水しぶき · 海竜一閃で左右に割れる水の壁 · しなる刃から落ちる水滴 · 解放の水柱を巻き上がる水流 · 滝の後の水霧 · 海竜の頭をすっきり",
        "ミリュウ：水路の流れる模様は長く流れる水の筋に、受け流して集めた水滴は体の周りの輪を回る縁取りのある「水の珠」に変え、見分けやすく",
        "ウェーブ：集めた水の技（専用アイテム）5個ごとに攻撃力+5 · 防御力+5（15個なら+15）· バフ欄に表示",
        "オルカ：解放中の被ダメージ-15%",
        "トルケン：基本攻撃力12 → 17",
      ],
    },
  },
];
