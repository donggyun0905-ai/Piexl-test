import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.48.215",
    date: "2026-10-28",
    items: {
      ko: ["첫 접속이 빨라짐: 상점·스토리·타워 디펜스·이벤트·배틀·협동·패치 노트 등은 들어갈 때 받음 (처음 받는 양 약 25% 줄어듦) · 웹앱 저장본은 새 버전이 켜질 때 예전 것을 지워 휴대폰 저장 공간이 쌓이지 않음"],
      en: ["Faster first load: the shop, story, tower defense, events, battle, co-op, patch notes and more now load when you open them (about 25% less to download at first) · the web app now clears old cached files when a new version starts, so they no longer pile up on your phone"],
      ja: ["初回の読み込みが速く: ショップ・ストーリー・タワーディフェンス・イベント・バトル・協力・パッチノートなどは開いたときに読み込み (最初のダウンロード量が約25%減) · Webアプリの保存データは新しいバージョンの起動時に古いものを消すので、スマホの容量がたまらない"],
    },
  },
  {
    version: "0.48.214",
    date: "2026-10-28",
    items: {
      ko: [
        "효과 새로 그리기 8 (시즌 1 보스·일반 몬스터): 강철 거구·검은 기사·활잡이부터 천사장까지 보스마다 그 색의 칼날·찌르기·검기·탄 터짐 · 쏜 보스마다 다른 탄 (달궈진 쇳조각·벌레 알·노려보는 눈동자 구슬 등)",
        "일반 몬스터: 침 뱉는 적은 입에 산성 빛이 모이고 산성 침을 뱉음 · 박격포는 하늘에서 포탄이 떨어지고 터지면 불 충격파와 연기 · 돌진하는 적은 바닥에 차오르는 화살표 길 · 가디언 방패 휘두르기 · 보스가 곧 공격하면 몸 둘레로 조여 드는 빛 고리",
      ],
      en: [
        "Effects redraw 8 (season 1 bosses and regular monsters): from Iron Hulk, Black Knight and Sly Archer up to the Archangel, each boss's blades, thrusts, sword waves and shot bursts use its own colors · each boss fires its own shots (red-hot iron shards, insect eggs, staring eyeball orbs and more)",
        "Regular monsters: Spitters gather acid light in their mouths and spit acid · Mortar shells fall from the sky and burst into fiery shockwaves and smoke · chargers fill an arrow lane on the floor · Guardian shield swings · bosses about to attack get a tightening ring of light",
      ],
      ja: [
        "エフェクト描き直し8 (シーズン1のボス・通常モンスター): 鋼鉄の巨体・黒騎士・弓使いから大天使まで、ボスごとにその色の斬撃・突き・剣気・弾の爆発 · 撃ったボスごとに違う弾 (焼けた鉄片・虫の卵・睨む目玉の玉など)",
        "通常モンスター: 唾吐きは口に酸の光が集まり酸を吐く · 迫撃砲は空から砲弾が落ち、炸裂すると炎の衝撃波と煙 · 突進する敵は床に満ちる矢印の道 · ガーディアンの盾振り · ボスが攻撃する直前は体の周りに締まる光の輪",
      ],
    },
  },
  {
    version: "0.48.213",
    date: "2026-10-28",
    items: {
      ko: ["효과 새로 그리기 7 (시즌 2 층 보스): 늪의 두꺼비 왕 분홍 혀가 뻗었다 감김·진흙 철퍽 튐·반들반들한 진흙 덩이 · 불도롱뇽 땅이 갈라지며 솟는 용암 분출·검게 굳은 용암 덩이 · 번개 해파리 갈라지는 번개 줄·둘레로 뻗는 전기 촉수 · 유령선 선장 대포 포격 줄(포탄과 화약 연기)·쇠사슬 닻·밀물 파도 벽·푸른 유령빛 해적 칼 · 위험 표시가 보스마다 진흙·불·전기·바다 색"],
      en: ["Effects redraw 7 (season 2 floor bosses): Bog Toad King's pink tongue that lashes out and reels back, splattering mud, glossy mud balls · Magma Salamander's lava eruptions bursting from cracked ground, crusted lava globs · Storm Jellyfish's forking lightning lines and electric tentacles · Ghost Ship Captain's cannon barrages (cannonball and gun smoke), chained anchor, tidal wave wall, ghostly blue cutlass · warning zones colored mud, fire, electric or sea per boss"],
      ja: ["エフェクト描き直し7 (シーズン2の階層ボス): 沼のガマ王のピンクの舌が伸びて戻る・泥のはね・つやつやの泥の塊 · 溶岩サラマンダーの地割れから噴き出す溶岩・黒く固まった溶岩の塊 · 雷クラゲの枝分かれする雷・周りに伸びる電気の触手 · 幽霊船の船長の砲撃列(砲弾と硝煙)・鎖の錨・満ち潮の波の壁・青い幽霊光のカトラス · 危険表示がボスごとに泥・炎・電気・海の色"],
    },
  },
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
];
