import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.48.69",
    date: "2026-10-23",
    items: {
      ko: [
        "방을 깨면 돈을 바로 얻음: 바닥에 동전을 두지 않고, 그 자리에서 동전이 튀어 오르며 +돈이 보임",
        "이무기 사룡: 계속 때리는 동안에도 1초마다 독 피해가 들어감 (예전엔 공격을 멈춰야 들어갔음)",
        "독 피해 숫자 옆 아이콘을 초록 물방울 두 개로",
      ],
      en: [
        "Clearing a room now gives its gold instantly: no coin on the floor, just coins popping up with +gold on the spot",
        "Imugi Venom Dragon: poison now ticks every second even while you keep attacking (before, it only ticked after you stopped)",
        "The poison damage number icon is now two green droplets",
      ],
      ja: [
        "部屋をクリアするとお金をすぐ獲得：床にコインを置かず、その場でコインが跳ねて+お金が表示",
        "イムギ蛇龍：攻撃し続けている間も1秒ごとに毒ダメージが入るように（以前は攻撃を止めないと入らなかった）",
        "毒ダメージの数字の横のアイコンを緑のしずく2つに",
      ],
    },
  },
  {
    version: "0.48.68",
    date: "2026-10-23",
    items: {
      ko: ["이무기 콤보 108의 용을 다시 용 그림 모양으로: 무기 빛깔 한 색의 반투명한 기로 크게 겹쳐 지나감 (네모 바탕 없음)"],
      en: ["Imugi combo-108 dragon uses the dragon's silhouette again: a large translucent sweep of energy in the weapon's color (no box backdrop)"],
      ja: ["イムギのコンボ108の龍を再び龍の絵の形に：武器の色一色の半透明な気で大きく重なって通り過ぎる（四角い背景なし）"],
    },
  },
  {
    version: "0.48.67",
    date: "2026-10-23",
    items: {
      ko: ["훈장을 캐릭터 선택창 맨 위 대신 각 캐릭터 카드 안 오른쪽 위 4칸에 달도록 바꿈 (그 캐릭터로 깬 보스의 훈장, 캐릭터마다 따로 바꾸기)"],
      en: ["Medals now sit in 4 slots at the top right of each character's card instead of the top of the screen (medals for bosses beaten with that character, changed per character)"],
      ja: ["勲章を画面の一番上ではなく、各キャラクターカードの右上4枠に付けるように変更（そのキャラで倒したボスの勲章、キャラごとに変更）"],
    },
  },
  {
    version: "0.48.66",
    date: "2026-10-23",
    items: {
      ko: ["시험 서버: 라스트 보스·레이드 아레나·일일 도전 기록이 '서버에 연결 안 됨'으로 순위표에 남지 않던 것을 고침 (서버가 판 전체를 다시 돌리는 확인이 계산 시간 한도를 넘었음 → 이 서버는 확인 없이 받음) · 서버 안에서 오류가 나면 연결 안 됨 대신 오류 이름이 보임"],
      en: ["Test server: fixed final boss, Raid Arena and daily records failing with 'cannot connect' and not reaching the boards (the server's full-run replay check exceeded its compute limit, so this server now accepts records without it) · server-side errors now show their name instead of 'cannot connect'"],
      ja: ["テストサーバー：ラストボス・レイドアリーナ・デイリーの記録が「サーバーに接続できない」でランキングに残らなかったのを修正（サーバーがラン全体をやり直して確認する処理が計算時間の上限を超えていた → このサーバーは確認なしで受け付け）· サーバー内でエラーが出ると接続できない代わりにエラー名を表示"],
    },
  },
  {
    version: "0.48.65",
    date: "2026-10-23",
    items: {
      ko: [
        "훈장: 라스트 보스(멸망의 용·갓이터·태초의 빛과 어둠)를 깨면 그 캐릭터의 토벌 훈장을 받습니다 (보스 × 캐릭터마다 하나, 다시 깨면 더 빠른 기록으로)",
        "캐릭터 선택창 위쪽 양옆에 훈장을 4개까지 달 수 있습니다. 훈장을 누르면 깬 판의 정보(보스 시간·날짜·한 판 요약)가 나오고, 아래 '바꾸기'로 다른 훈장으로 바꾸거나 뺄 수 있습니다",
      ],
      en: [
        "Medals: defeating a final boss (Dragon of Ruin, God Eater, Primeval Light & Dark) earns that character a slayer medal (one per boss × character; clearing again keeps the faster record)",
        "Wear up to 4 medals at the top of the character select screen. Tap a medal to see that run (boss time, date, run summary), and use 'Change' below it to swap or remove it",
      ],
      ja: [
        "勲章：ラストボス（滅びの竜・ゴッドイーター・太初の光と闇）を倒すと、そのキャラクターの討伐勲章をもらえます（ボス × キャラクターごとに1つ、再び倒すとより速い記録に）",
        "キャラクター選択画面の上の両側に勲章を4つまで付けられます。勲章を押すと倒した時の情報（ボスタイム・日付・まとめ）が出て、下の「変更」で別の勲章に替えたり外したりできます",
      ],
    },
  },
  {
    version: "0.48.64",
    date: "2026-10-23",
    items: {
      ko: [
        "이무기 보호막이 쌓이지 않게: 오라가 되면 20, 용이 되면 40으로 채움 (비늘 방패·토룡도 정한 값까지만, 다른 보호막 위에 더 얹지 않음)",
        "이무기 여의주 + 화룡점정: 번개 한 번의 피해가 6번으로 나뉘어 레이저처럼 와다다 들어감 (총 피해는 같음)",
        "악의 사도 장판을 크게 강화: 장판 효과가 2배 빠르게(0.25초마다) · 분노 화상 2.2배 · 나태 4번 쌓이면 잠, 공격력 400% · 탐식 부패 더 빠르고 12% · 질투 독 2배 · 탐욕 더 자주, 공격력 100% · 교만 1초마다 160%",
        "색욕에 물든 베드로 십자가: 적끼리 때리는 대신 장판 위 적이 아주 빠르게 피해 (공격력 6%, 혼자 있어도), 준 피해의 10% 회복",
        "사탄의 가면: 죽음 피해 최대 체력 5% + 공격력 10% → 공격력 60% · 들고 있으면 먹은 영혼 하나마다 공격력 +0.1 (다른 무기는 +0.01)",
        "아래 장비 줄의 무기 그림에 마우스를 올리면(모바일은 누르면) 무기 설명이 나옴",
      ],
      en: [
        "Imugi shields no longer stack: the aura fills your shield to 20 and dragon form to 40 (Scale Guard and Earth Dragon also only fill up to their cap, never on top of other shields)",
        "Imugi Dragon Pearl + The Dragon's Eye: each bolt now lands as 6 rapid laser-like hits (same total damage)",
        "Apostle of Malice fields greatly buffed: field effects tick twice as fast (every 0.25s) · Wrath burn x2.2 · Sloth sleeps after 4 stacks for 400% · Gluttony rots faster for 12% · Envy poison x2 · Greed more often for 100% · Pride every 1s for 160%",
        "Peter's Cross of Lust: instead of foes hitting each other, foes on the field take very rapid damage (6%, even when alone); heal 10% of it",
        "Satan's Mask: Death now deals 5% of max HP + 60% damage (was 10%) · while held, each soul eaten gives +0.1 damage (other weapons +0.01)",
        "Hover over (or tap on mobile) the weapon icon in the bottom gear bar to see its description",
      ],
      ja: [
        "イムギのシールドが重ならないように：オーラになると20、龍になると40まで満たす（鱗の盾・土龍も決まった値まで、他のシールドの上に重ねない）",
        "イムギ如意宝珠 + 画竜点睛：雷1回のダメージが6回に分かれ、レーザーのように連続で入る（総ダメージは同じ）",
        "悪の使徒の床を大きく強化：床の効果が2倍速く（0.25秒ごと）· 憤怒の火傷2.2倍 · 怠惰は4回溜まると眠り、攻撃力400% · 暴食の腐敗がより速く12% · 嫉妬の毒2倍 · 強欲はより頻繁に攻撃力100% · 傲慢は1秒ごとに160%",
        "色欲に染まったペテロ十字：敵同士で攻撃する代わりに、床の上の敵がとても速くダメージを受ける（攻撃力6%、1体でも）、その10%回復",
        "サタンの仮面：死のダメージ 最大体力5% + 攻撃力10% → 攻撃力60% · 持っていると食べた魂1つごとに攻撃力+0.1（他の武器は+0.01）",
        "下の装備欄の武器アイコンにマウスを乗せると（モバイルはタップ）武器の説明が出る",
      ],
    },
  },
  {
    version: "0.48.63",
    date: "2026-10-23",
    items: {
      ko: ["이무기 콤보 108의 용: 무기 빛깔 한 색의 반투명한 기(氣)로 된 긴 용이 꿈틀거리며 맵을 쓸고 지나감 (뿔·수염·빛나는 눈) · 용 둘레에 생기던 네모 바탕을 없앰"],
      en: ["Imugi combo-108 dragon: now a long, translucent dragon of energy in the weapon's color that writhes as it sweeps across the map (horns, whiskers, glowing eyes) · removed the box-shaped backdrop around it"],
      ja: ["イムギのコンボ108の龍：武器の色一色の半透明な気でできた長い龍が、うねりながらマップを掃いて通り過ぎる（角・ひげ・光る目）· 龍の周りに出ていた四角い背景をなくしました"],
    },
  },
  {
    version: "0.48.62",
    date: "2026-10-23",
    items: {
      ko: [
        "이무기 토룡: 보호막이 오라·용 보호막까지 합쳐 계속 쌓이며 공격력이 너무 커지던 것을 고침 · 토룡 보호막은 최대 10, 공격력 보너스도 토룡 보호막의 50%만 (단단한 몸으로 버티는 무기)",
        "이무기 여의주: 번개 피해 공격력 10% → 30%",
        "악의 사도: 영혼을 먹을 때마다 이번 판 내내 공격력 +0.01 · 왼쪽 위에 먹은 영혼 수와 오른 공격력 표시",
      ],
      en: [
        "Imugi Earth Dragon: fixed the shield stacking together with aura and dragon shields and inflating damage · the Earth Dragon shield now caps at 10 and only that shield adds 50% to damage (a sturdy, tanky weapon)",
        "Imugi Dragon Pearl: lightning damage 10% → 30%",
        "Apostle of Malice: each soul eaten adds +0.01 damage for the run · the number of souls eaten and the bonus are shown at the top left",
      ],
      ja: [
        "イムギ土龍：シールドがオーラ・龍のシールドと合わせてたまり続け、攻撃力が大きくなりすぎていたのを修正 · 土龍のシールドは最大10、攻撃力ボーナスも土龍シールドの50%のみ（硬い体で耐える武器）",
        "イムギ如意宝珠：雷のダメージ 攻撃力10% → 30%",
        "悪の使徒：魂を食べるたびにこのランの間ずっと攻撃力+0.01 · 左上に食べた魂の数と上がった攻撃力を表示",
      ],
    },
  },
  {
    version: "0.48.61",
    date: "2026-10-23",
    items: {
      ko: [
        "새 모드 협동: 최대 5명이 같은 방에서 함께 싸우며 층을 올라갑니다 (메인의 '협동' → 빠른 매칭 · 방 만들기 · 코드나 링크로 들어가기). 모든 직업을 고를 수 있고, 장치·회전체·소환수·펫 등은 사람마다 따로 움직입니다",
        "협동 규칙: 아이템과 돈은 각자 따로 (남의 아이템은 보이지 않음) · 출구와 계단은 모두 모여야 열림 · 쓰러진 친구는 전투가 끝난 뒤 옆에서 회복약을 쓰면 일으킴 · 사람이 많으면 적이 조금 더 많고 튼튼함 · 3~5명은 더 큰 방",
        "협동 편의: 위쪽 왼쪽 인원 표(체력·연결 지연) · 이름표 · 숫자 3~6 신호(여기!·도와줘!·가자!·잠깐!) · 결과 창에 사람마다 처치·받은 피해. 직접 연결이 막힌 곳에서는 중계 서버로 다시 연결합니다",
      ],
      en: [
        "New Co-op mode: up to 5 players fight side by side and climb together (Main menu → Co-op: quick match, create a room, or join with a code or link). Every class can be picked, and turrets, orbs, summons, pets and the like work separately for each player",
        "Co-op rules: items and gold are your own (you can't see others' items) · exits and stairs open only when everyone gathers · revive a downed friend by using a potion next to them once the fight is over · more players means a few more, tougher enemies · 3-5 players get bigger rooms",
        "Co-op extras: team panel at the top left (HP and latency) · name tags · signals on keys 3-6 (Here!, Help!, Let's go!, Wait!) · per-player kills and damage taken on the results screen. Networks that block direct connections retry through a relay server",
      ],
      ja: [
        "新モード協力プレイ：最大5人が同じ部屋で一緒に戦い、階を上ります（メインの「協力プレイ」→ クイックマッチ・部屋を作る・コードやリンクで参加）。すべての職業を選べ、装置・回転体・召喚獣・ペットなどは人ごとに別々に動きます",
        "協力プレイのルール：アイテムとお金は各自別々（他の人のアイテムは見えません）· 出口と階段は全員がそろうと開く · 倒れた仲間は戦闘が終わった後、そばで回復薬を使うと起こせる · 人数が多いと敵が少し多く丈夫に · 3〜5人はより大きな部屋",
        "協力プレイの便利機能：左上のメンバー表（体力・通信の遅れ）· 名札 · 数字キー3〜6の合図（ここ!・助けて!・行こう!・待って!）· 結果画面に人ごとの撃破・被ダメージ。直接つながらない場所では中継サーバー経由でつなぎ直します",
      ],
    },
  },
];
