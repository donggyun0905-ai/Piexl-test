import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.48.159",
    date: "2026-10-28",
    items: {
      ko: [
        "검은 잔영 더 어렵게: 데스웜·거대 전갈·거대 매가 1.5배 크기 (공격 범위도 같이) · 보스방이 사막 맵 (연습장도)",
        "데스웜 필살기: 독액 2배 · 독 웅덩이는 대시 중에도 걸림 · 몬스터 떼가 3배이고 잡기 어려운 것만 (땅 골렘 · 딱정벌레 · 방패 가디언 · 성기사)",
        "거대 매 필살기: # 선이 훨씬 굵어져 피할 칸이 작은 네모뿐 · 더 빨리 터져 대시를 섞어 다음 칸으로 들어가야 함 · 대시 무적으로 피하지 못함",
        "거대 전갈 필살기: 검은 독액 2배 · 대시 무적으로 피하지 못함",
      ],
      en: [
        "Black Remnant is harder: the Death Worm, Colossal Scorpion and Colossal Hawk are 1.5× bigger (attack ranges too) · the boss room is now a desert (Practice too)",
        "Death Worm ultimate: twice the venom · poison pools affect you even mid-dash · the horde is 3× larger and only tough foes (earth golems · beetles · shield guardians · paladins)",
        "Colossal Hawk ultimate: much thicker # lines leave only small safe squares · they strike faster, so you must dash into the next square · dash invincibility no longer dodges them",
        "Colossal Scorpion ultimate: twice the black venom · dash invincibility no longer dodges it",
      ],
      ja: [
        "黒き残影がより難しく: デスワーム · 巨大サソリ · 巨大な鷹が1.5倍の大きさ（攻撃範囲も）· ボス部屋が砂漠マップに（練習場も）",
        "デスワームの必殺技: 毒液2倍 · 毒の水たまりはダッシュ中でもかかる · 魔物の群れが3倍で倒しにくいものだけ（土ゴーレム · カブトムシ · 盾のガーディアン · 聖騎士）",
        "巨大な鷹の必殺技: # の線がずっと太くなり安全地帯は小さな四角だけ · 早く炸裂するのでダッシュを混ぜて次の四角へ · ダッシュ無敵では避けられない",
        "巨大サソリの必殺技: 黒い毒液2倍 · ダッシュ無敵では避けられない",
      ],
    },
  },
  {
    version: "0.48.158",
    date: "2026-10-28",
    items: {
      ko: [
        "데스웜 공격이 바뀜: 솟아오른 뒤 아주 긴 몸이 끝까지 빠져나오며 공중으로 날아 다른 땅에 머리부터 박힘 (떨어질 자리에 표시 · 공중의 몸에 닿아도 피해 · 머리가 나와 있는 동안만 맞음)",
        "짐승 셋 필살기 (체력 10% 아래 한 번, 끝날 때까지 무적) — 데스웜: 맵 가운데에 머리만 내밀고 둘레에 끌어당기는 모래지옥 · 입에서 몬스터 떼(땅 골렘 · 슬라임)와 독액(바닥에 떨어지면 독 웅덩이) · 몬스터를 다 잡아야 끝",
        "거대 매: 맵 전체에 아주 굵은 # 선이 뜨고 매가 빠르게 가로지름 → 바로 앞 선이 없던 자리에 다음 # · 10번 뒤 떨어져 3초 경직",
        "거대 전갈: 그 자리에 버티고 꼬리에서 30초 동안 느린 검은 독액(탄막) · 맞으면 죽음 상태이상 (독보다 세고 3겹까지 쌓이며 쓰러질 수 있음)",
      ],
      en: [
        "New Death Worm attack: after bursting up, its very long body pulls all the way out and flies through the air to dive head-first into other ground (marker where it lands · touching the airborne body hurts · only the head can be hit while it is out)",
        "Ultimates for the three beasts (once below 10% health, invincible until done) — Death Worm: only its head pokes out in the middle with a pulling sand pit around it · spews a horde (earth golems · slimes) and venom that leaves poison pools · ends only when the horde is gone",
        "Colossal Hawk: huge # lines across the whole map and the hawk streaks along them → the next # lands where the last one had no lines · after 10 it falls dazed for 3s",
        "Colossal Scorpion: holds its ground and sprays slow black venom from its tail for 30s (bullet hell) · a hit inflicts Doom (stronger than poison, stacks up to 3, can kill)",
      ],
      ja: [
        "デスワームの攻撃を変更: 飛び出した後、とても長い体が最後まで抜け出して空を飛び、別の地面に頭から潜る（着地点に表示 · 空中の体に触れてもダメージ · 頭が出ている間だけ攻撃が当たる）",
        "獣三体の必殺技（体力10%以下で一度、終わるまで無敵）— デスワーム: マップ中央に頭だけ出し、周りに引き寄せる流砂 · 口から魔物の群れ（土ゴーレム · スライム）と毒液（床に落ちると毒の水たまり）· 群れを全部倒すまで終わらない",
        "巨大な鷹: マップ全体にとても太い # の線が出て鷹が素早く横切る → 直前に線がなかった場所に次の # · 10回の後に落ちて3秒硬直",
        "巨大サソリ: その場で踏ん張り、尾から30秒間ゆっくりした黒い毒液（弾幕）· 当たると「死」状態異常（毒より強く3重まで重なり、倒れることもある）",
      ],
    },
  },
  {
    version: "0.48.157",
    date: "2026-10-28",
    items: {
      ko: [
        "검은 잔영: 거대한 짐승 셋(데스웜 · 거대 전갈 · 거대 매)이 한꺼번에 나와 1대3 · 하나 쓰러질 때마다 한마디 · 체력 막대는 짐승마다 같은 길이로 떨어진 막대 셋",
        "거대 전갈이 탱커로: 체력 2000 → 3000 + 흰 보호막(최대 체력의 50%, 체력보다 먼저 깎임) · 데스웜 땅속·거대 매 하늘에 있는 시간을 조금 늘림",
      ],
      en: [
        "Black Remnant: all three colossal beasts (Death Worm · Colossal Scorpion · Colossal Hawk) now appear at once, 1 vs 3 · it speaks each time one falls · three separate health bars of equal length, one per beast",
        "The Colossal Scorpion is now the tank: health 2000 → 3000 plus a white barrier (50% of max health, drained before health) · the Death Worm stays underground and the Hawk in the sky a little longer",
      ],
      ja: [
        "黒き残影: 巨大な獣三体（デスワーム · 巨大サソリ · 巨大な鷹）が同時に現れて1対3 · 一体倒れるごとに一言 · 体力バーは獣ごとに同じ長さで離れた3本",
        "巨大サソリがタンク役に: 体力2000 → 3000 + 白いバリア（最大体力の50%、体力より先に削れる）· デスワームの地中・鷹の空にいる時間を少し延長",
      ],
    },
  },
  {
    version: "0.48.156",
    date: "2026-10-28",
    items: {
      ko: [
        "시즌 2 라스트 보스 '검은 잔영' 미리 공개 (6층 클리어 뒤 도전 · 연습장): 위에서 지켜보며 거대한 짐승 셋을 차례로 부르고, 하나 잡을 때마다 \"호오...\" \"제법이군...\" \"지켜볼 가치가 있어..\" 뒤 사라짐 · 체력 막대 한 줄을 세 칸으로",
        "데스웜: 땅속에서는 예고 없이 다가와 갑자기 표시가 뜨고 솟아오름(사방으로 바위) · 솟는 1초 · 위에서 2초(이때 때리기) · 순식간에 들어감",
        "거대 전갈: 움직이는 표시로 모래 밑을 기어다니다 꼬리 찌르기(맞으면 독) · 앞으로만 밀고 오는 3초 돌진(부딪히면 집게에 3초 붙잡혀 못 움직이고 피해) → 옆으로 피한 뒤 지쳐 있을 때 때리기",
        "거대 매: 늘 하늘에 있어 보이지 않음 · 갑자기 뜨는 내려찍기(피하면 3초 경직, 맞으면 바로 하늘로) · 차례로 뜨는 세 줄 활강 뒤 어지러워 떨어져 3초 경직",
      ],
      en: [
        "Season 2 final boss preview, the Black Remnant (challenge after clearing floor 6 · Practice): it watches from above and calls three colossal beasts in turn; after each one falls it says \"Hoh...\", \"Not bad...\", \"Worth watching..\" and then vanishes · one health bar split into three",
        "Death Worm: moves underground with no warning, then a marker suddenly appears and it bursts up (rocks in all directions) · 1s to rise · 2s up top (strike now) · dives back in an instant",
        "Colossal Scorpion: crawls under the sand with a moving marker · tail sting (poisons) · a 3s straight-line charge it cannot turn (a hit pins you in its claws for 3s) → sidestep and strike while it is worn out",
        "Colossal Hawk: always unseen in the sky · sudden dive (dodge it and it is dazed for 3s, get hit and it flies right back up) · three swoop lines in a row, then it falls dazed for 3s",
      ],
      ja: [
        "シーズン2ラストボス「黒き残影」先行公開（6階クリア後の挑戦 · 練習場）: 上から見届けつつ巨大な獣を三体順に呼び、一体倒すごとに「ほう…」「なかなかやるな…」「見届ける価値がある..」と言い残して消える · 体力バー1本を3区切りに",
        "デスワーム: 地中では予告なく近づき、突然表示が出て飛び出す（全方向に岩）· 出るのに1秒 · 地上に2秒（ここで攻撃）· 一瞬で潜る",
        "巨大サソリ: 動く表示とともに砂の下を這う · 尾の突き（当たると毒）· 向きを変えられない3秒の直進突進（ぶつかるとハサミに3秒捕まり動けずダメージ）→ 横に避けて疲れている間に攻撃",
        "巨大な鷹: いつも空にいて見えない · 突然の急降下（避けると3秒硬直、当たるとすぐ空へ）· 順に出る三本の滑空の後、目を回して落ち3秒硬直",
      ],
    },
  },
];
