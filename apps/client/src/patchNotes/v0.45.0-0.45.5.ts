import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.45.5",
    date: "2026-10-21",
    items: {
      ko: [
        "갓이터 패링: 날아오는 창 중 빨간 창 하나만 진짜이고, 나머지 보라 창은 가짜입니다 (맞아도 아무 일 없음). 진짜 창은 더 빠르고 가짜들과 닿는 때가 달라서, 가짜에 눌러 버리면 진짜를 놓칩니다",
        "갓이터 체력 2배",
      ],
      en: [
        "God Eater's parry trial: only the single red spear is real; the purple spears are fakes that do nothing. The real one is faster and lands at a different moment, so parrying a fake makes you miss the real one",
        "God Eater's health doubled",
      ],
      ja: [
        "ゴッドイーターのパリィ：飛んでくる槍のうち赤い1本だけが本物で、紫の槍は偽物です（当たっても何も起きない）。本物はより速く、偽物と届くタイミングが違うので、偽物に押すと本物を逃します",
        "ゴッドイーターの体力2倍",
      ],
    },
  },
  {
    version: "0.45.4",
    date: "2026-10-21",
    items: {
      ko: ["갓이터 패링: 받아 넘겼는데도 같은 묶음에서 조금 늦게 닿은 창에 맞던 문제를 고쳤습니다 (막은 순간 자세가 잠깐 이어짐)"],
      en: ["God Eater's parry trial: fixed taking damage from a spear of the same volley arriving a moment later right after a successful parry (the stance now holds briefly after a parry)"],
      ja: ["ゴッドイーターのパリィ：受け流したのに同じ束の少し遅れて届いた槍に当たる問題を修正しました（防いだ瞬間に構えが少し続く）"],
    },
  },
  {
    version: "0.45.3",
    date: "2026-10-21",
    items: {
      ko: [
        "라스트 보스 층 시작 방에 여신상이 생기고, 그 앞에 여신의 축복이 놓입니다 (대시 대기 시간 50% 감소 · 이동 속도 +0.3 · 쓰러질 때 한 번 체력 50%로 되살아남)",
        "멸망의 용: 체력 3배 · 염옥의 화염 가루 피해 2",
        "갓이터 패링: 창이 더 빨라지고, 곳곳에서 여러 개(3 → 5 → 7개)가 같은 순간에 닿아 한 번의 패링으로 한꺼번에 막습니다",
        "태초의 빛과 어둠: 혼자 남은 쪽은 체력이 2배로 늘어납니다",
      ],
      en: [
        "A goddess statue now stands in the final floor's first room, with the Goddess's Blessing before it (dash cooldown -50% · move speed +0.3 · once, revive with 50% health)",
        "Dragon of Ruin: triple health · Inferno fire dust deals 2 damage",
        "God Eater's parry trial: faster spears, and several (3 → 5 → 7) arrive at the same moment from all around so one parry blocks them all",
        "Primeval Light & Dark: the survivor's health is doubled",
      ],
      ja: [
        "ラストボス階の最初の部屋に女神像が現れ、その前に女神の祝福が置かれます（ダッシュのクールダウン50%短縮 · 移動速度+0.3 · 倒れる時に1度だけ体力50%で復活）",
        "滅びの竜：体力3倍 · 炎獄の火の粉のダメージ2",
        "ゴッドイーターのパリィ：槍がより速くなり、四方から複数（3 → 5 → 7本）が同時に届くので、1回のパリィでまとめて防ぎます",
        "太初の光と闇：単独で残った方の体力が2倍になります",
      ],
    },
  },
  {
    version: "0.45.2",
    date: "2026-10-21",
    items: {
      ko: [
        "용 염옥·갓이터 패링 궁극기 동안은 맞은 뒤 깜빡이는 무적이 없습니다 · 염옥 분화구는 대시 중이어도 맞음 · 화염 가루는 한 픽셀 크기로, 더 느리게",
        "갓이터 패링: 사방 쇠사슬에 묶여 움직일 수 없고 패링만 할 수 있습니다 · 창이 더 빨라짐 · 받아 넘기면 \"띠링!\" 소리",
      ],
      en: [
        "No post-hit invulnerability (blinking) during the Dragon's Inferno and God Eater's parry trial · Inferno craters hit even mid-dash · fire dust is now a single pixel and drifts slower",
        "God Eater's parry trial: you are bound by chains on all four sides and can only parry · faster spears · a bright \"ding!\" on a successful parry",
      ],
      ja: [
        "竜の炎獄·ゴッドイーターのパリィの奥義中は、被弾後の点滅無敵がありません · 炎獄の火口はダッシュ中でも当たる · 火の粉は1ピクセルの大きさで、より遅く",
        "ゴッドイーターのパリィ：四方の鎖に縛られて動けず、パリィしかできません · 槍がより速く · 受け流すと「チリン！」と音が鳴る",
      ],
    },
  },
  {
    version: "0.45.1",
    date: "2026-10-21",
    items: {
      ko: [
        "갓이터 궁극기가 탄막에서 패링으로 바뀌었습니다: 어두운 작은 방에서 대시 키가 패링 키가 되고, 빨간 예고선 뒤 아주 빠르게 날아오는 창을 닿기 직전에 눌러 받아 넘겨야 합니다 (받아 넘기면 바로 다시 누를 수 있음)",
        "갓이터의 대검: 체력 2배 · 받아 넘기기 40% · 찌르기·회전 돌진·연속 베기 중에는 맞지 않음",
        "멸망의 용 염옥: 궁극기 동안은 자기 패턴을 멈추고, 방 전체에 화염 가루가 벚꽃처럼 느리게 가득 떠돕니다 (닿으면 피해)",
      ],
      en: [
        "God Eater's ultimate is now a parry trial: in the dark tiny room your dash key becomes a parry key, and you must parry lightning-fast spears right before they hit, after a red warning line (a successful parry lets you parry again immediately)",
        "God Eater's greatswords: double health · 40% parry · invulnerable while lunging, spinning or slashing",
        "Dragon of Ruin, Inferno: it stops its other patterns during the ultimate, and fire dust drifts slowly all over the room like cherry blossoms (it hurts)",
      ],
      ja: [
        "ゴッドイーターの奥義が弾幕からパリィに変わりました：暗い小部屋でダッシュキーがパリィキーになり、赤い予告線の後とても速く飛んでくる槍を当たる直前に押して受け流します（受け流すとすぐまた押せる）",
        "ゴッドイーターの大剣：体力2倍 · 受け流し40% · 突き·回転突進·連続斬りの間は攻撃を受けない",
        "滅びの竜 炎獄：奥義中は自分のパターンを止め、部屋全体に火の粉が桜のようにゆっくり漂います（触れるとダメージ）",
      ],
    },
  },
  {
    version: "0.45.0",
    date: "2026-10-21",
    items: {
      ko: [
        "레이드 명예의 전당: 일일 도전 화면의 🏆 버튼. 라스트 보스(용·갓이터·태초의 빛과 어둠)를 보스방에 들어가서 잡기까지 걸린 시간으로 보스마다 10위까지 (1위는 왕관과 함께 크게)",
        "혼자 하기에서 라스트 보스를 잡으면 결과 창에 레이드 시간과 명예의 전당 순위가 나옵니다 (서버가 판 전체를 다시 돌려 확인)",
        "명예의 전당 전용 음악",
      ],
      en: [
        "Raid Hall of Fame: the 🏆 button on the Daily Challenge screen. The top 10 per final boss (Dragon, God Eater, Primeval Light & Dark), ranked by time from entering the boss room to the kill (the champion gets a crown)",
        "Beat a final boss in Solo and the results show your raid time and Hall of Fame rank (the server replays the whole run to verify)",
        "A dedicated Hall of Fame theme",
      ],
      ja: [
        "レイド殿堂：デイリーチャレンジ画面の🏆ボタン。ラストボス（竜·ゴッドイーター·太初の光と闇）をボス部屋に入ってから倒すまでの時間で、ボスごとに10位まで（1位は王冠付きで大きく）",
        "ソロでラストボスを倒すと、結果画面にレイドタイムと殿堂の順位が出ます（サーバーがプレイ全体を再現して確認）",
        "殿堂専用の音楽",
      ],
    },
  },
];
