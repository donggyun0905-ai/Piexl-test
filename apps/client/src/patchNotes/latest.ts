import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.259",
    date: "2026-10-30",
    items: {
      ko: ["새 분류 '이방인' (세계의 틀을 벗어난 자들): 차원의 순례자 · 몰락한 왕 (스토리 진영·캐릭터 선택창 탭)", "새 분류 '서고의 감시자' (뽑기로 만나는 한정 캐릭터): 캐릭터 선택창 탭·스토리 진영 (곧 등장)"],
      en: ["New group 'Outsiders' (those beyond the world's frame): the Dimensional Pilgrim and the Fallen King (story factions and a character-select tab)", "New group 'Archive Wardens' (limited characters from the gacha): character-select tab and story faction (coming soon)"],
      ja: ["新しい分類「異邦人」（世界の枠を外れた者たち）: 次元の巡礼者 · 堕ちた王（ストーリーの陣営・キャラ選択タブ）", "新しい分類「書庫の監視者」（ガチャで出会える限定キャラ）: キャラ選択タブ・ストーリーの陣営（近日登場）"],
    },
  },
  {
    version: "0.48.258",
    date: "2026-10-30",
    items: {
      ko: [
        "전쟁의 서막: 위·아래 길 맨 앞에 포탑 하나씩 더 (같은 간격으로 길마다 셋)",
        "귀환(R): 위로 치솟는 하늘색 빛기둥 효과 · 움직이면 끊김",
        "핑: T = 마우스 자리에 핑 (큰 보스 둘레면 '○○를 잡겠습니다! 모여 주세요!', 상대 포탑·캐릭터 둘레면 '여기를 공격하자!', 그 밖에는 '여기로 모여!') · Alt+T = 위험 핑 · 같은 편 화면에 표시와 알림",
        "전쟁의 서막 AI: 파멸의 용·갓이터는 우리 편이 충분히 셀 때만 정글·가운데가 '잡겠습니다' 핑을 찍고, 모두 보스 밖에서 모였다가 함께 잡음 · 사람이 찍은 핑도 따라감",
        "전쟁의 서막 AI: 10분 전에는 병사를 잡아 돈을 모으는 데 집중 · 상대 캐릭터는 맞았거나 가까이(근접은 사거리, 원거리는 사거리의 절반) 왔을 때만 침",
        "버려진 자들: 교대 무적은 조합대로 맞게 눌렀을 때만 짧게 (0.23초) · 패왕전에서 순서를 틀리면 무적 없이 잠깐 교대가 잠김 (대시를 꾹 눌러 계속 무적으로 버티지 못하게)",
        "월드 워 리그: 사람이 없는 다른 팀 경기를 관전할 때 한 캐릭터만 초록 체력 줄로 보이던 문제",
        "월드 워 리그: 16팀 대회 (16강 → 8강 → 4강 → 결승) · 왼쪽 8팀·오른쪽 8팀이 따로 올라가 결승 · 토너먼트 대진표 화면 · 팀 마크 16종 + 우리 팀 마크 · 위에 내 다음 경기 칸",
        "월드 워 리그 우승 화면: 화면 전체에 빛살·불꽃·색종이와 '우승을 축하드립니다!'",
      ],
      en: [
        "Prelude to War: one more turret at the front of the top and bottom lanes (three per lane, evenly spaced)",
        "Recall (R): a sky-blue pillar of light rises up · moving cancels it",
        "Pings: T pings at the cursor (near a big boss: 'Taking down the ○○! Gather up!', near an enemy turret or hero: 'Attack here!', otherwise 'Gather here!') · Alt+T = danger ping · shown and announced to your team",
        "Prelude to War AI: the jungler or mid only pings the Dragon of Ruin / God Eater when the team is strong enough, then everyone gathers outside its reach and fights it together · AI also follows players' pings",
        "Prelude to War AI: before 10 minutes they focus on farming minions for gold · they only fight enemy heroes when hit or when the hero comes close (melee: attack range, ranged: half the range)",
        "The Abandoned: tag invulnerability only on a correct tag and shorter (0.23s) · in Paewang a wrong tag gives no invulnerability and briefly locks tagging (no more holding dash to stay invulnerable)",
        "World War League: watching a match without players no longer shows one character with a green (player) HP bar",
        "World War League: 16 teams (round of 16 → quarterfinals → semifinals → final) · the left and right halves each send one team to the final · tournament bracket screen · 16 team crests + your team's crest · a 'next match' panel on top",
        "World War League champion screen: rays, fireworks and confetti fill the screen with 'Congratulations, Champions!'",
      ],
      ja: [
        "戦争の序幕: 上・下の道のいちばん前にタレットを1つずつ追加（同じ間隔で道ごとに3つ）",
        "帰還（R）: 上へ立ちのぼる空色の光の柱 · 動くと中断",
        "ピン: T = マウスの位置にピン（大ボスの近くなら「○○を倒します！集まって！」、相手のタレット・キャラの近くなら「ここを攻撃しよう！」、それ以外は「ここに集まれ！」）· Alt+T = 危険ピン · 味方の画面に表示と通知",
        "戦争の序幕AI: 破滅の竜・ゴッドイーターは味方が十分に強いときだけジャングル・ミッドが「倒します」ピンを打ち、全員ボスの外で集まってから一緒に倒す · プレイヤーのピンにも従う",
        "戦争の序幕AI: 10分前は兵士を倒してお金を集めることに集中 · 相手キャラには攻撃されたか近く（近接は射程、遠距離は射程の半分）に来たときだけ攻撃",
        "見捨てられた子たち: 交代の無敵は組み合わせ通りに押したときだけ短く（0.23秒）· 覇王戦で順番を間違えると無敵なしで少しの間交代がロック（ダッシュ長押しで無敵を続けられない）",
        "ワールドウォーリーグ: プレイヤーのいない他チームの試合を観戦するとき、1キャラだけ緑の体力バーになる問題を修正",
        "ワールドウォーリーグ: 16チームの大会（ベスト16 → 準々決勝 → 準決勝 → 決勝）· 左右8チームずつ勝ち上がって決勝 · トーナメント表の画面 · チームマーク16種 + 自チームのマーク · 上に次の試合の枠",
        "ワールドウォーリーグ優勝画面: 画面いっぱいに光・花火・紙吹雪と「優勝おめでとうございます！」",
      ],
    },
  },
  {
    version: "0.48.257",
    date: "2026-10-30",
    items: {
      ko: [
        "로그: 캐릭터 설명 창의 연습장에서 '능력치' 버튼을 눌러도 창이 닫히거나 게임이 멈춘 채로 남지 않음",
        "로그: 맵 크기는 그대로, 오른쪽 칸의 미니맵(노선도)을 크게",
        "로그: 장비 줄 맨 왼쪽 P 칸 · 마우스를 올리면 캐릭터 기본 능력 설명",
        "로그: 파수꾼 분노(체력이 낮을수록 공격력)가 능력치 창 공격력에 바로 보임",
        "기간토마키아 배낭 창: 금고 + 9칸을 같은 크기 5×2 칸으로 (이름이 밀리지 않게)",
        "기간토마키아 AI: 벽에 막히면 비켜 가거나 돌아감 · 배낭이 가득 차면 상자 앞에 서 있지 않고 돌아다님 · 할 일이 없으면 먼 상자를 찾아감 (다섯에 하나는 버팀)",
        "기간토마키아: 이어하기 없앰 (판 중간에 나가면 끝, 금고 물건만 받음) · 쓰러진 사람의 배낭은 그 자리에 떨어져 누구나 주울 수 있음",
        "기간토마키아 뿔 거인: 흰 뿔은 그대로 · 푸른 뿔은 묵인 모습 · 붉은 뿔은 거인 모습으로 빛깔·뿔·기운을 꾸밈 · 머리 위에 별과 권장 레벨 (내 레벨이 넘으면 초록, 조금 모자라면 노랑, 많이 모자라면 빨강)",
        "뿔 거인 기술 (때려서 화가 났을 때): 흰 뿔 돌 던지기(떨어질 자리 그림자) · 푸른 뿔 돌진(준비 화살) · 붉은 뿔 레이저(조준선)와 내려찍기(넓은 원)",
      ],
      en: [
        "Dungeon: pressing 'Stats' in the guide window's practice room no longer closes the window or leaves the game paused",
        "Dungeon: the map keeps its size; the minimap (route map) in the right column is now larger",
        "Dungeon: a P slot at the far left of the loadout bar · hover to see the character's base ability",
        "Dungeon: the Warden's Rage (more attack at lower HP) now shows live in the stats panel",
        "Gigantomachia backpack: vault + 9 slots as an even 5×2 grid (names no longer shift)",
        "Gigantomachia AI: steers around or backs off walls · with a full backpack it no longer stands at chests and roams instead · idle bots head for distant chests (one in five camps)",
        "Gigantomachia: resume removed (leaving mid-match ends it; only vault goods are kept) · a fallen player's backpack drops on the spot for anyone to loot",
        "Horned giants: white stays as is · blue looks like Mukin · red looks like the Titan, each with tinted bodies, horns and auras · stars and a recommended level above them (green if you're above it, yellow if close, red if far below)",
        "Giant skills (once angered): white throws rocks (shadow where it lands) · blue charges (warning arrow) · red fires a laser (aim line) and slams the ground (wide circle)",
      ],
      ja: [
        "ローグ: キャラ説明の窓の練習場で「能力値」ボタンを押しても窓が閉じたり、ゲームが止まったままにならない",
        "ローグ: マップの大きさはそのまま、右側のミニマップ（ルート図）を大きく",
        "ローグ: 装備欄のいちばん左にP枠 · マウスを乗せるとキャラの基本能力の説明",
        "ローグ: 番人の怒り（体力が低いほど攻撃力）が能力値の攻撃力にすぐ反映",
        "ギガントマキアのバッグ: 金庫 + 9枠を同じ大きさの5×2に（名前がずれない）",
        "ギガントマキアのAI: 壁に詰まると避けるか回り込む · バッグがいっぱいなら宝箱の前に立ち止まらず歩き回る · することがないと遠くの宝箱へ（5人に1人は待ち伏せ）",
        "ギガントマキア: 続きからを廃止（途中で出るとそこで終了、金庫の品だけ受け取る）· 倒れた人のバッグはその場に落ち、誰でも拾える",
        "角の巨人: 白はそのまま · 青はムキンの姿 · 赤は巨人の姿で、色・角・オーラを装飾 · 頭上に星と推奨レベル（自分のレベルが上なら緑、少し足りないと黄、大きく足りないと赤）",
        "巨人の技（怒ったとき）: 白は岩投げ（落下地点に影）· 青は突進（予告の矢印）· 赤はレーザー（照準線）と叩きつけ（広い円）",
      ],
    },
  },
];
