import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.49.40",
    date: "2026-11-05",
    items: {
      ko: [
        "토르켄: 사거리가 늘면 사슬도 길어짐 · 철구공이 적을 따라가지 않고 늘 사슬 끝까지 크게 휘둘러짐 · 나와 철구공 사이 사슬에 닿은 적도 피해 · 철구공이 벽·기둥에 부딪히면 멈춤 · 철구공이 나가 있을 때 대시하면 철구공이 나에게 날아오며 지나는 적을 때림",
        "리바이어: 4단 콤보로 바뀜 (1타 휘두르기 → 2타 찌르기(고래는 꼬리로 앞을 크게 휩쓸기) → 3타 회전 + 고래 대돌격 → 0.5초 만에 4타 돌진) · 공격 때 창 그림이 따로 나오지 않음 · 고래를 멋진 큰 고래로 다시 그림 · 물살(물보라 창끝·바다의 삼지창)이 일렁이는 물줄기로",
        "테일: 꼬리 공격이 밑동이 굵은 진짜 꼬리처럼 · 휘두를 때 겹겹의 물결과 튀는 물살 · 내려치기·낙하에 왕관 물보라 · 돌진·씹기·변신 효과 다듬음",
        "단련의 방: '+' 버튼 가운데 정렬 · 패시브에 마우스를 올리면 설명 · 미니게임이 끝난 뒤 누르던 키 때문에 강화 창이 꺼지던 문제 고침",
        "히든 상점(차원의 순례자) 말풍선이 머리 바로 위에 오게 고침",
      ],
      en: [
        "Thorken: the chain grows with range · the ball no longer homes in and always swings out to the chain's full length · the chain between you and the ball now damages foes too · the ball stops when it hits walls or pillars · dashing while the ball is out reels it back, hitting foes along the way",
        "Levia: now a 4-hit combo (1st sweep → 2nd thrust (the whale sweeps wide with its tail) → 3rd spin + whale charge → 4th lunge just 0.5s later) · no separate spear drawing on attacks · the whale is redrawn as a grand whale · water jets (Spray Spearhead, Sea Trident) now look like rippling streams",
        "Tail: tail attacks look like a real tail, thick at the base · layered waves and flying spray on swings · crown splashes on slams and dives · dash, chomp and transform effects polished",
        "Training Room: '+' buttons centered · hover a passive to see its description · fixed the upgrade window closing from keys still being pressed after a minigame",
        "Hidden shop (Dimensional Pilgrim): the speech bubble now sits right above her head",
      ],
      ja: [
        "トルケン：射程が伸びると鎖も長くなる · 鉄球が敵を追わず常に鎖の端まで大きく振り回される · 自分と鉄球の間の鎖に触れた敵にもダメージ · 鉄球が壁・柱に当たると止まる · 鉄球が出ている時にダッシュすると鉄球が戻りながら途中の敵を叩く",
        "リヴァイア：4段コンボに変更（1段目 薙ぎ → 2段目 突き（クジラは尾で前を大きく薙ぐ）→ 3段目 回転＋クジラ大突撃 → 0.5秒で4段目 突進）· 攻撃時に槍の絵が別に出ない · クジラを迫力ある大きなクジラに描き直し · 水流（水しぶきの穂先・海の三叉槍）が揺らめく水の流れに",
        "テイル：尾の攻撃が根元の太い本物の尾のように · 振るたびに重なる波と飛び散る水 · 叩きつけ・落下に王冠のしぶき · 突進・噛みつき・変身のエフェクトを調整",
        "鍛錬の部屋：「+」ボタンを中央揃え · パッシブにマウスを乗せると説明 · ミニゲーム後に押していたキーで強化ウィンドウが閉じる問題を修正",
        "隠しショップ（次元の巡礼者）の吹き出しが頭のすぐ上に来るよう修正",
      ],
    },
  },
  {
    version: "0.49.39",
    date: "2026-11-05",
    items: {
      ko: ["이클립스 불줄기·도끼 궤적·공허의 날 번짐을 빛 효과로 옮김: 날을 따라 빛이 번져 더 밝고 폰에서 가벼워짐 (빛 효과를 끄면 예전 모습)"],
      en: ["Eclipse's fire streaks, axe trails and void blades now glow through the glow layer along the blade: brighter and lighter on phones (unchanged with glow off)"],
      ja: ["イクリプスの炎の筋・斧の軌跡・虚空の刃のにじみを光のエフェクトへ移行：刃に沿って光が広がり、より明るくスマホで軽く（光のエフェクトをオフにすると従来どおり）"],
    },
  },
  {
    version: "0.49.38",
    date: "2026-11-05",
    items: {
      ko: [
        "캐릭터 큰 기술 38가지에 빛 (거인 내려찍기·렌 낙석·토르켄 천둥·리바이어 지진·오닉스 공명·펜리르 착지·이클립스 내려찍기·제우스 창 등)",
        "용암·리바이어 고래·테일 상어의 번짐을 빛 효과로 옮김: 빛 효과를 켜면 더 밝고 폰에서 가벼워짐 (끄면 예전 모습 그대로)",
        "계속 켜져 있는 빛(로비 조명·게임기 화면·등불)이 느린 기기에서도 흐려지지 않게 맞춤",
      ],
      en: [
        "Glow on 38 big character moves (Titan slam, Ren rockfall, Thorken thunder, Levia quake, Onyx resonance, Fenrir landing, Eclipse slam, Zeus spear and more)",
        "Lava, Levia's whales and Tail's sharks now use the glow layer for their halo: brighter and lighter on phones with glow on (unchanged with glow off)",
        "Steady lights (lobby lighting, arcade screens, lantern) no longer fade on slower devices",
      ],
      ja: [
        "キャラクターの大技38種に光（巨人の叩きつけ・レンの落石・トルケンの雷・リヴァイアの地震・オニキスの共鳴・フェンリルの着地・イクリプスの叩きつけ・ゼウスの槍など）",
        "溶岩・リヴァイアのクジラ・テイルのサメのにじみを光のエフェクトに移行：オンだとより明るく、スマホで軽く（オフなら従来どおり）",
        "常に灯る光（ロビーの照明・ゲーム機の画面・灯り）が遅い端末でも薄くならないよう調整",
      ],
    },
  },
  {
    version: "0.49.37",
    date: "2026-11-05",
    items: {
      ko: [
        "빛 효과 넓힘: 한정 스킨·이벤트 상점 효과(타격·대기·걸음)의 섬광·빛 베기·K.O 도장·기둥이 진짜 빛으로 · 각성·필살기는 꼬리표 색 빛기둥과 고리, 보스 궁극기는 붉은 기가 모여듦",
        "게임 안 빛 더하기: 회복하면 초록 빛이 오름 · 보호막 고리 · 돈 반짝 · 바닥 무기·패시브가 은은하게 빛나고 주우면 반짝 · 용암 불티 · 어두운 장면에서 내 둘레 작은 등불 · 패왕전은 내 편 탄 하늘색·상대 탄 붉게, 보스 탄은 더 크게",
        "게임 밖 빛: 타워 디펜스(처치·탄·큰 공격) · 로비와 메인 화면 뒤(무대 조명·미러볼·게임기 화면·전시장 금빛) · 뽑기(한정은 무지개 빛기둥과 번쩍임) · 명예의 전당 우승자 카드 금가루",
        "빛이 아래 화면에 더해지게 바꿔 더 밝고 선명해짐 (설정 '빛 효과'로 끄기)",
      ],
      en: [
        "Glow expanded: limited skins and event shop effects (hit, idle, walk) now truly glow on flashes, light slashes, K.O stamps and pillars · awakenings and finishers burst with light pillars and rings in their tag's color, boss ultimates draw in red energy",
        "More in-game glow: green light rises when healing · shield ring · gold glints · floor weapons and passives softly glow and sparkle when picked up · lava embers · a small lantern light around you in dark scenes · in Paewang your team's shots are sky-blue and foes' red, boss shots larger",
        "Glow outside battles: tower defense (kills, shots, big attacks) · lobby and the main screen backdrop (stage lights, mirror ball, arcade screens, golden exhibits) · gacha (limited pulls get a rainbow pillar and flash) · Hall of Fame champion card gold dust",
        "Glow now adds onto the screen below, so it looks brighter and clearer (turn off with the 'Glow effects' setting)",
      ],
      ja: [
        "光のエフェクトを拡大：限定スキン・イベントショップ効果（ヒット・待機・歩き）の閃光・光の斬撃・K.O印・光柱が本物の光に · 覚醒・必殺技はタグの色の光柱と輪、ボスの奥義は赤い気が集まる",
        "ゲーム内の光を追加：回復すると緑の光が昇る · シールドの輪 · お金のきらめき · 床の武器・パッシブがほのかに光り、拾うときらめく · 溶岩の火の粉 · 暗い場面では自分の周りに小さな灯り · 覇王戦は味方の弾が空色・相手の弾が赤、ボスの弾は大きく",
        "ゲーム外の光：タワーディフェンス（撃破・弾・大技）· ロビーとメイン画面の背景（舞台照明・ミラーボール・ゲーム機の画面・展示室の金色）· ガチャ（限定は虹の光柱と閃光）· 殿堂のチャンピオンカードに金の粉",
        "光が下の画面に加算されるようになり、より明るく鮮やかに（設定「光のエフェクト」でオフ）",
      ],
    },
  },
  {
    version: "0.49.36",
    date: "2026-11-05",
    items: {
      ko: ["빛 효과 시험 (WebGL): 적을 쓰러뜨리면 빛 폭발·충격파 고리·불티, 보스를 쓰러뜨리면 화면이 번쩍이는 큰 빛 · 맞힐 때 불티·치명타 별빛 · 내 탄은 하늘색, 적 탄은 붉은 빛 꼬리 · 큰 공격에 빛 · 내가 맞으면 화면 가장자리가 붉게 (설정 '빛 효과'로 끄기)"],
      en: ["Glow effects test (WebGL): defeated foes burst into light with a shockwave ring and sparks, bosses go out in a huge screen-flashing blast · sparks on hits, star flashes on crits · sky-blue trails on your shots, red trails on enemy shots · big attacks glow · the screen edges flash red when you are hit (turn off with the 'Glow effects' setting)"],
      ja: ["光のエフェクト試験（WebGL）：敵を倒すと光の爆発・衝撃波の輪・火花、ボスを倒すと画面が光る大きな爆発 · 当てると火花・クリティカルで星の光 · 自分の弾は空色、敵の弾は赤い光の尾 · 大技が光る · 被弾すると画面の端が赤く（設定「光のエフェクト」でオフ）"],
    },
  },
];
