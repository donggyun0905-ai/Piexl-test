import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.49.36",
    date: "2026-11-05",
    items: {
      ko: ["빛 효과 시험 (WebGL): 적을 쓰러뜨리면 빛 폭발·충격파 고리·불티, 보스를 쓰러뜨리면 화면이 번쩍이는 큰 빛 · 맞힐 때 불티·치명타 별빛 · 내 탄은 하늘색, 적 탄은 붉은 빛 꼬리 · 큰 공격에 빛 · 내가 맞으면 화면 가장자리가 붉게 (설정 '빛 효과'로 끄기)"],
      en: ["Glow effects test (WebGL): defeated foes burst into light with a shockwave ring and sparks, bosses go out in a huge screen-flashing blast · sparks on hits, star flashes on crits · sky-blue trails on your shots, red trails on enemy shots · big attacks glow · the screen edges flash red when you are hit (turn off with the 'Glow effects' setting)"],
      ja: ["光のエフェクト試験（WebGL）：敵を倒すと光の爆発・衝撃波の輪・火花、ボスを倒すと画面が光る大きな爆発 · 当てると火花・クリティカルで星の光 · 自分の弾は空色、敵の弾は赤い光の尾 · 大技が光る · 被弾すると画面の端が赤く（設定「光のエフェクト」でオフ）"],
    },
  },
  {
    version: "0.49.35",
    date: "2026-11-05",
    items: {
      ko: [
        "탈라시아 새 캐릭터 테일: 물을 자유롭게 다루는 상어 수인 (체력 110 · 공격력 12 · 이동 1.4, 여는 조건: 공격 속도 1.6 달성)",
        "테일: 둘레에 영역 바다가 펼쳐지고, 바다 안의 적을 물 상어가 저절로 공격 · 확률로 바다 밑에서 솟아 삼키기 · 튀어나와 꿰뚫고 다시 잠수하는 돌진 · 높이 솟구쳐 내리꽂는 낙하",
        "테일: 누르면 꼬리 3연타 (위→아래 · 아래→위 · 내려치기 물기둥) · 한 방에 쓰러뜨릴 적이 있으면 물 상어로 변해 번개처럼 돌진해 씹어먹고 체력 회복",
        "테일: 무기는 바다 10 (밀물·귀상어·청상아리·백상아리·뇌우·빙해·대양·광란·소용돌이·메갈로돈) · 전용 아이템 10 · 맑은 물 상어·물보라·무지개 이펙트 · 상어 소리 · 그림 시트 · 패왕전 스킬 4",
      ],
      en: [
        "New Thalassia character Tail: a shark beastfolk who bends water freely (110 HP · 12 attack · 1.4 move; unlock: reach 1.6 attack speed)",
        "Tail: a sea domain spreads around Tail and water sharks attack foes inside it on their own · by chance they rise from below and gulp, leap out to pierce and dive back, or soar high and crash down",
        "Tail: pressing attack swings a 3-hit tail combo (down · up · a geyser slam) · if a foe can be finished in one bite, Tail turns into a water shark, darts in like lightning, devours it and heals",
        "Tail: weapons are 10 seas (Tide, Hammerhead, Mako, Great White, Thunderstorm, Ice Sea, Open Ocean, Frenzy, Whirlpool, Megalodon) · 10 exclusive items · clear water shark, splash and rainbow effects · shark sounds · sprite sheet · 4 Paewang skills",
      ],
      ja: [
        "タラシアの新キャラクター、テイル：水を自在に操るサメの獣人（体力110 · 攻撃力12 · 移動1.4、解放条件：攻撃速度1.6達成）",
        "テイル：周りに領域の海が広がり、海の中の敵を水のサメが自動で攻撃 · 確率で海の底から現れて丸呑み · 飛び出して貫き再び潜る突進 · 高く跳び上がって落ちる落下攻撃",
        "テイル：押すと尾の3連撃（上→下 · 下→上 · 水柱の叩きつけ）· 一撃で倒せる敵がいれば水のサメに変わり、稲妻のように突進して食らいつき体力回復",
        "テイル：武器は海10（満ち潮・シュモクザメ・アオザメ・ホホジロザメ・雷雨・氷海・大洋・狂乱・渦潮・メガロドン）· 専用アイテム10 · 澄んだ水のサメ・水しぶき・虹のエフェクト · サメの音 · スプライトシート · 覇王戦スキル4",
      ],
    },
  },
  {
    version: "0.49.34",
    date: "2026-11-05",
    items: {
      ko: ["탈라시아 이펙트 다듬기: 리바이어 고래가 은은한 바다빛·등에 일렁이는 햇빛 무늬·반짝임을 띠고, 창끝·충격파·고래 도약에 빛기둥·빛줄기·물보라 무지개 · 토르켄 철구공 빛 테두리·반짝임, 천둥 빛줄기, 닻이 지나간 길의 금빛 반짝임, 물기둥 무지개, 태풍 속 물빛 무늬"],
      en: ["Thalassia effects polished: Levia's whales now glow with sea light, shimmering sunlight ripples and sparkles, with light pillars, rays and spray rainbows on the spear tip, shockwave and whale breach · Thorken's iron ball gets a glowing rim and sparkle, thunder gets light rays, the anchor leaves golden glints, geysers show rainbows, and typhoons shimmer"],
      ja: ["タラシアのエフェクトを磨き上げ：リヴァイアのクジラが淡い海の光・背中に揺れる陽光の模様・きらめきをまとい、穂先・衝撃波・クジラの跳躍に光の柱・光の筋・しぶきの虹 · トルケンの鉄球に光の縁ときらめき、雷に光の筋、錨が通った跡に金色のきらめき、水柱に虹、台風の中に水の光模様"],
    },
  },
  {
    version: "0.49.33",
    date: "2026-11-05",
    items: {
      ko: [
        "탈라시아 새 캐릭터 리바이어: 고래와 함께 자유로운 바다를 누비는 창술사 (체력 105 · 공격력 12 · 이동 1.35, 여는 조건: 이동 속도 1.8 달성)",
        "리바이어: 바다의 창 3단 콤보 · 1타 앞 휘두르기 → 2타 한 바퀴 돌고 앞으로 커다란 고래 대돌격 → 3타 앞으로 돌진하고 부채꼴 충격파 · 타마다 확률로 고래가 같이 나와 날개로 넓게 쓸고 · 몸을 감아 한 바퀴 돌고 · 같이 돌진함 (안 나올수록 다음엔 잘 나옴)",
        "리바이어: 무기는 창에 박는 힘의 보석 10 (아쿠아마린·해류 사파이어·뇌명 토파즈·산호석·밀물 월장석·심해석·빙정·쌍둥이 진주·해풍석·리바이어던의 눈) · 전용 아이템 20 (창 10 · 고래 10) · 푸른 고래·물살·물보라 이펙트 · 고래 울음 · 그림 시트 · 패왕전 스킬 4",
      ],
      en: [
        "New Thalassia character Levia: a spear dancer roaming the free sea with the whales (105 HP · 12 attack · 1.35 move; unlock: reach 1.8 move speed)",
        "Levia: a 3-hit sea-spear combo · 1st a forward sweep → 2nd a full spin, then a giant whale charges forward → 3rd a lunge ending in a fan-shaped shockwave · each hit may bring a whale that sweeps wide with its fins, coils around you, or lunges beside you (more likely the longer it stays away)",
        "Levia: weapons are 10 power gems set in the spear (Aquamarine, Current Sapphire, Thunder Topaz, Coral Stone, Tide Moonstone, Abyss Stone, Ice Crystal, Twin Pearls, Sea Breeze Stone, Eye of the Leviathan) · 20 exclusive items (10 spear · 10 whale) · blue whale, water and splash effects · whale song · sprite sheet · 4 Paewang skills",
      ],
      ja: [
        "タラシアの新キャラクター、リヴァイア：クジラと共に自由な海を駆ける槍使い（体力105 · 攻撃力12 · 移動1.35、解放条件：移動速度1.8達成）",
        "リヴァイア：海の槍の3段コンボ · 1段目 前へ薙ぎ払い → 2段目 一回転して前へ巨大なクジラ大突撃 → 3段目 前へ突進して扇形の衝撃波 · 各段で確率でクジラが現れ、ヒレで広く薙ぎ・体を巻いて一回転し・一緒に突進する（出ないほど次は出やすい）",
        "リヴァイア：武器は槍にはめる力の宝石10（アクアマリン・海流のサファイア・雷鳴のトパーズ・珊瑚石・満ち潮のムーンストーン・深海石・氷晶・双子の真珠・海風石・リヴァイアサンの瞳）· 専用アイテム20（槍10 · クジラ10）· 青いクジラ・水流・水しぶきのエフェクト · クジラの歌 · スプライトシート · 覇王戦スキル4",
      ],
    },
  },
  {
    version: "0.49.32",
    date: "2026-11-05",
    items: {
      ko: ["캐릭터 선택창: 게임에서 크게 그리는 캐릭터(토르켄·이클립스·펜리르)의 그림이 칸보다 커서 잘리고 더 늘어나 흐리게 보이던 것 고침 · 이제 닻·광륜까지 다 보이고 다른 캐릭터와 같은 또렷함"],
      en: ["Character select: characters drawn larger in game (Thorken, Eclipse, Fenrir) no longer get cropped and over-stretched (blurry) in their cards · the anchor and halo now fit and look as crisp as everyone else"],
      ja: ["キャラクター選択：ゲームで大きく描くキャラクター（トルケン・エクリプス・フェンリル）の絵が枠より大きく切れて引き伸ばされ、ぼやけて見えていたのを修正 · 錨や光輪まで全部見え、他のキャラと同じくっきりさに"],
    },
  },
  {
    version: "0.49.31",
    date: "2026-11-05",
    items: {
      ko: ["토르켄: 닻을 휘두를 때마다 커다란 금빛 닻 모양이 몸 둘레로 부채꼴을 그리며 휙 돌아감 (잔상 셋 + 뒤따르는 물살)"],
      en: ["Thorken: every anchor swing now shows a big golden anchor sweeping around you in an arc (three afterimages + a trailing water wake)"],
      ja: ["トルケン：錨を振るたび、大きな金色の錨の形が体の周りを扇形にぶんと回る（残像3つ + 後を追う水流）"],
    },
  },
];
