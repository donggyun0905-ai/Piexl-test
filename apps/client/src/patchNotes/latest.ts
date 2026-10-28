import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.212",
    date: "2026-10-28",
    items: {
      ko: [
        "효과 새로 그리기 6 (특수 보스): 태초의 빛 네 방향 빛기둥·태초의 어둠 보랏빛 거대한 손·불타는 원형 파동·다크 오라 어둠의 벽 · 제천대성 여의봉 꽂힘 충격파·부딪힘 섬광·돌리기 빛 초승달·맵 휘두르기 빛·번개 탄 · 괴력난신 붉은 주먹 파동·원기옥에 빨려 드는 빛·기 주먹 꼬리 · 데스웜 모래지옥·독 웅덩이 빛·독액 · 거대 매 바람 빛줄기 · 전갈 검은 독액 · 빛·어둠 화살·갓이터 창·낫 붉은 잔상·화염 가루 · 멸망의 용 염옥 불덩이·분화구 불기둥 · 패링 빛 고리",
        "의사: 모든 선에 빛 테두리 · 구급 키트 폭발 섬광 · 붕대 채찍 끝 빛 · 회복 + 빛 · 구급차 충돌 불똥",
      ],
      en: [
        "Effects redraw 6 (special bosses): Primeval Light four-way light pillars, Primeval Dark giant violet hands, burning ring waves, Dark Aura walls · Great Sage staff-plunge shockwaves, impact flashes, spinning light crescents, map-wide sweep light, lightning shots · Demigod red fist waves, light drawn into the Spirit Bomb, ki-fist trails · Death Worm sand pit, glowing poison pools and spit · Giant Hawk wind trails · Scorpion black venom · light and dark arrows, Godeater spears, scythe's red afterimage, fire embers · Doom Dragon hellfire orb and crater flame pillars · parry light ring",
        "Doctor: glowing edges on every line · first-aid kit burst flash · bandage whip tip glow · healing plus glow · ambulance crash sparks",
      ],
      ja: [
        "エフェクト描き直し6 (特殊ボス): 太初の光の四方向の光柱・太初の闇の紫の巨大な手・燃える円形の波動・ダークオーラの闇の壁 · 斉天大聖の如意棒の突き刺し衝撃波・衝突の閃光・回転の光の三日月・マップ薙ぎ払いの光・雷弾 · 怪力乱神の赤い拳の波動・元気玉に吸い込まれる光・気の拳の尾 · デスワームの砂地獄・毒の水たまりの光・毒液 · 巨大な鷹の風の光線 · サソリの黒い毒液 · 光・闇の矢・ゴッドイーターの槍・大鎌の赤い残像・火の粉 · 滅亡の竜の炎獄の火球・噴火口の火柱 · パリィの光の輪",
        "医者: すべての線に光の縁 · 救急キット爆発の閃光 · 包帯の鞭の先の光 · 回復+の光 · 救急車衝突の火花",
      ],
    },
  },
  {
    version: "0.48.211",
    date: "2026-10-28",
    items: {
      ko: ["효과 새로 그리기 5: 오토마타·라이더·붐버·아티팩터·펑크·추적자·잊혀진 자·잔영·방랑객·영사·광부·운명의 여행자·제우스의 선·고리·호·번개에 겹치면 밝아지는 빛 테두리 · 별지기 별빛·혜성 꼬리·별자리 터짐 · 오리 음파·큰 꽥 충격파·황금알 빛 · 서기관 글자 빛 · 이드라 모습 바꾸기 빛"],
      en: ["Effects redraw 5: glowing additive edges on the lines, rings, arcs and bolts of Automata, Rider, Bomber, Artifacter, Punk, Tracker, Forgotten, Remnant, Wanderer, Silk, Miner, Voyager and Zeus · Star Keeper starlight, comet tails, constellation bursts · Duck sound waves, big-quack shockwave, golden egg glow · Scribe glyph glow · Idra form-change light"],
      ja: ["エフェクト描き直し5: オートマタ・ライダー・ボマー・アーティファクター・パンク・追跡者・忘れられた者・残影・放浪者・影糸・鉱夫・運命の旅人・ゼウスの線・輪・弧・雷に重なると明るくなる光の縁 · 星守りの星の光・彗星の尾・星座の爆発 · アヒルの音波・大きなガァの衝撃波・金の卵の光 · 書記官の文字の光 · イドラの姿替えの光"],
    },
  },
  {
    version: "0.48.210",
    date: "2026-10-28",
    items: {
      ko: ["효과 새로 그리기 4: 렌 용머리 무는 섬광·거대 바위 낙하 흙빛 충격파·토목 기둥 충돌 섬광 · 정령사 빛줄기·대정령 시전·내리찍기 충격파·주문 빛·화살 빛 · 역병의사 쥐 터짐·흑사병 고리·떠오르는 해골·역병 연기·저주의 손아귀 · 학살자 핏빛 날 빛·핏방울 빛 · 이터 그림자 베기 보랏빛·그림자 조각 빛 · 묵인 금빛 방벽 · 사멸 독침 꼬리·독가스 피어남·사방 침 빛살"],
      en: ["Effects redraw 4: Ren dragon-bite flash, earthen shockwave from falling boulders, colliding-pillar flash · Spiritist light beams, great-spirit casts, slam shockwaves, chant and arrow glow · Plague Doctor rat bursts, plague rings, rising skull, plague smoke, cursed grip · Slayer crimson blade glow and blood drops · Eater violet shadow slashes and glowing shards · Mukin golden barrier · Samyeol needle trails, blooming poison gas, radial needle rays"],
      ja: ["エフェクト描き直し4: レンの竜頭の噛みつき閃光・巨岩落下の土の衝撃波・土木柱衝突の閃光 · 精霊師の光線・大精霊の詠唱・叩きつけ衝撃波・呪文と矢の光 · ペスト医師のネズミ破裂・黒死病の輪・浮かぶ髑髏・疫病の煙・呪いの握り · 殺戮者の血の刃の光・血の雫 · イーターの紫の影斬り・影の欠片 · ムクインの金の防壁 · 四滅の毒針の尾・毒ガス・全方位の針の光"],
    },
  },
  {
    version: "0.48.209",
    date: "2026-10-28",
    items: {
      ko: ["효과 새로 그리기 3: 버려진 자들 빛 테두리 그림자 자국·초록 충격파 찍기·방패 밀침 파도·총구 섬광·교대 빛 기둥 · 거인 패링 금빛 섬광·내려침 땅 충격파와 먼지 · 오니 방망이 바람·번개 빛·서리·어둠·빛 기둥·해일·영령·신인족 각성 · 변희 습격 빛줄기·각성 빛·불사조 열기 · 플라이 하늘빛 X자 · 곰 할퀴기 충격 · 장로 불기둥·벽 부딪힘·떨어지는 검·바위 주먹"],
      en: ["Effects redraw 3: Abandoned glowing shadow trails, green shockwave slams, shield-shove waves, muzzle flashes, tag light pillars · Titan golden parry flash, ground-slam shockwaves and dust · Oni club gusts, lightning glow, frost, darkness, light pillars, tides, spirits, divine awakening · Byeonhui raid light beams, awakening light, phoenix heat · Fly sky-blue X rakes · bear swipe impact · Elder fire pillars, colliding walls, falling swords, rock fists"],
      ja: ["エフェクト描き直し3: 捨てられた子たちの光る影の跡・緑の衝撃波・盾押しの波・銃口の閃光・交代の光の柱 · 巨人のパリィの金の閃光・叩きつけの地面の衝撃波と砂埃 · 鬼の棍棒の風・雷の光・霜・闇・光の柱・津波・英霊・神人族覚醒 · 変姫の襲撃の光線・覚醒の光・不死鳥の熱 · フライの空色のX · 熊の引っかきの衝撃 · 長老の火柱・壁の衝突・落ちる剣・岩の拳"],
    },
  },
  {
    version: "0.48.208",
    date: "2026-10-28",
    items: {
      ko: ["효과 새로 그리기 2: 베두인 환영 차크람 잔상·모래 회전 베기 빛 칼날 · 장수 청룡 검기 두 겹 초승달·창 그림자·빛 창날 찌르기·필살기 충격파 · 이무기 비늘 파편·용 기운 폭발·하늘 조각·늑대 이빨 · 악의 사도 붉은 기운 십자가·검은 불길·색욕 광선·금화·중력·잠·영혼·푸른 불길 · 야수 발톱 자국·호랑이 발톱 빛·털실·캣닢"],
      en: ["Effects redraw 2: Bedouin phantom chakram trails and light blades on the sand spin · General jade crescent waves, spear shadows, light-blade thrusts, ultimate shockwaves · Imugi scale shards, dragon-aura bursts, falling sky shards, wolf fangs · Apostle crimson crosses, black flames, lust beams, coins, gravity, sleep, souls, blue fire · Beastkin claw marks, tiger claw glow, yarn, catnip"],
      ja: ["エフェクト描き直し2: ベドウィンの幻のチャクラムの残像・砂の回転斬りの光の刃 · 将軍の青龍の二重三日月・槍の影・光の穂先の突き・必殺技の衝撃波 · イムギの鱗の破片・竜の気の爆発・空の欠片・狼の牙 · 悪の使徒の赤い気の十字架・黒い炎・色欲の光線・金貨・重力・眠り・魂・青い炎 · 獣人の爪痕・虎の爪の光・毛糸・キャットニップ"],
    },
  },
  {
    version: "0.48.207",
    date: "2026-10-28",
    items: {
      ko: [
        "효과 새로 그리기 1: 거너 예광탄·수류탄(도는 몸·그림자·조여 드는 조준)·유령 총 · 닌자 보랏빛 칼빛·연막·그림자 가시·수리검 잔상 · 시간술사 시계판 잔상·시계 조준·시간탄 잔상·되감기 원반·톱니 · 마법사 번개·혜성·얼음 결정·공허·폭발 · 소환술사 불덩이·도는 뼈·포자·요정 빛·가죽 채찍 · 음양사 부적 빛",
        "도트 편집으로 넣어 두었던 공용 휘두르기·맞음·마법 폭발·기본 탄 그림을 빼고 새 빛 효과로 바꿈",
      ],
      en: [
        "Effects redraw 1: Gunner tracers, grenades (spinning, shadowed, tightening target) and ghost gun · Ninja violet blade light, smoke, shadow spikes, shuriken afterimages · Chronomancer clock-face echoes, clock reticle, time-shot afterimages, rewind disc, gears · Mage lightning, comets, ice crystals, void, blasts · Summoner fireballs, spinning bones, spores, fairy light, leather whip · Talisman Master charm glow",
        "The pixel-editor images for the shared swing, hit, magic blast and default shots were removed in favor of the new light effects",
      ],
      ja: [
        "エフェクト描き直し1: ガンナーの曳光弾・手榴弾(回転・影・絞られる照準)・幽霊銃 · 忍者の紫の刃光・煙幕・影の棘・手裏剣の残像 · 時間術師の時計盤の残像・時計照準・時間弾の残像・巻き戻し円盤・歯車 · 魔法使いの雷・彗星・氷の結晶・虚空・爆発 · 召喚術師の火の玉・回る骨・胞子・妖精の光・革の鞭 · 陰陽師の札の光",
        "ドット編集で入れていた共通の振り・ヒット・魔法爆発・基本弾の絵を外し、新しい光のエフェクトに",
      ],
    },
  },
  {
    version: "0.48.206",
    date: "2026-10-28",
    items: {
      ko: ["효과 다듬기 5: 캐릭터와 적 발밑에 그림자 · 가만히 서 있으면 숨 쉬듯 살짝 오르내림 · 맞은 적이 순간 살짝 부풀었다 돌아옴"],
      en: ["Effects polish 5: shadows under characters and enemies · characters gently breathe while standing still · enemies swell slightly for an instant when hit"],
      ja: ["エフェクト調整5: キャラと敵の足元に影 · 立ち止まると呼吸するように少し上下 · 当たった敵が一瞬少し膨らんで戻る"],
    },
  },
];
