import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.50.45",
    date: "2026-11-09",
    items: {
      ko: [
        "시즌 3 라스트 보스 셋째 '아스모데우스의 화신체' (6층 클리어 뒤 도전 · 연습장): 체력 줄이 ×100 (한 줄 깎을 때마다 색이 바뀌고 ×99, ×98…), 체력 합 9600",
        "100~76줄 욕망의 화신: 보라 불꽃 베기(지나간 자리에 지나갈 수 없는 불꽃 담) · 벽에 두 번 튕기는 마창 · 따라오다 터지는 욕망의 구슬(불꽃 담을 지움) · 깜빡인 순서대로 날아오는 다섯 구슬 · 매혹의 눈(그 순간 보스 쪽으로 움직이면 끌려감) · 1.5초 전 내 자리를 따라오는 잔상 · 두 빛의 바닥(보스 불꽃과 같은 색 칸만 안전)",
        "75~51줄 검은 해의 화신: 3초 빨아들이고 내려찍기 · 블랙홀을 놓고 터뜨려 범위 + 탄막 · 단 하나의 빈자리(방 전체 공격, 아주 작은 빈자리만 안전) · 굶주린 미니 블랙홀(공격을 먹고 먹은 만큼 되돌려 난사 → 공격을 멈추세요) · 위·왼쪽·오른쪽 벽 5구역에서 떨어지는 보라 레이저",
        "50~0줄 강철 군주의 화신: 붉은 베기 2연 · 내 자리에서 퍼지는 붉은 고리 · 하늘 결정 창(꽂히면 잠깐 벽) · 강철의 몸(앞에서 맞는 피해 -90%, 등 뒤로 돌아야) · 톱니 날 고리 · 30줄·15줄 화신의 기억(두 빛의 바닥 + 레이저)",
        "변신할 때마다 궁극기 (시즌 3에서 이 보스만): 75줄 검은 해의 탄생(큰 블랙홀 · 나선 탄 · 보라 파동 3번) · 50줄 군주의 강림(결정 창 격자 · 조여 드는 톱니 고리에 맞춰 대시) · 10줄 욕망의 끝 뒤 지쳐 받는 피해 1.5배",
      ],
      en: [
        "Season 3's third final boss 'Avatar of Asmodeus' (challenge after clearing floor 6 · practice): 100 health bars (each bar you break changes color, ×99, ×98…), 9600 health in total",
        "Bars 100–76, Avatar of Desire: violet flame slash (leaves an impassable flame wall) · a lance that bounces off walls twice · a following orb of desire that bursts (and clears flame walls) · five orbs that fly in the order they blinked · Charming Eyes (moving toward the boss at that moment draws you in) · an afterimage that follows where you were 1.5s ago · two-tone floor (only tiles matching the boss's flame are safe)",
        "Bars 75–51, Avatar of the Black Sun: 3s of suction then a slam · black holes that burst into an area hit plus a bullet ring · the single safe spot (the whole room is hit except one tiny spot) · hungry mini black holes (they eat your attacks and fire back as much → stop attacking) · violet lasers from five zones on the top, left and right walls",
        "Bars 50–0, Avatar of the Iron Lord: double red slash · a red ring spreading from your spot · crystal spears from the sky (briefly become walls) · Iron Body (-90% damage from the front; get behind it) · a ring of saw blades · at 30 and 15 bars, Memories of the Avatar (two-tone floor + lasers)",
        "An ultimate at every transformation (only this Season 3 boss): bar 75 Birth of the Black Sun (huge black hole, spiral shots, three violet waves) · bar 50 Descent of the Lord (crystal spear grid, dash as the saw ring closes) · bar 10 End of Desire, then exhausted and takes 1.5x damage",
      ],
      ja: [
        "シーズン3三体目のラストボス「アスモデウスの化身」（6階クリア後に挑戦 · 練習場）：体力ゲージ×100（1本削るごとに色が変わり×99、×98…）、体力合計9600",
        "100～76本 欲望の化身：紫炎の斬撃（通れない炎の壁が残る） · 壁で2回跳ね返る魔槍 · 追いかけて弾ける欲望の玉（炎の壁を消す） · 点滅した順に飛んでくる五つの玉 · 魅了の眼（その瞬間ボスへ向かって動いていると引き寄せられる） · 1.5秒前の自分の位置を追う残像 · 二色の床（ボスの炎と同じ色のマスだけ安全）",
        "75～51本 黒い太陽の化身：3秒吸い込んで叩きつけ · ブラックホールを置いて弾けさせ範囲＋弾幕 · 唯一の安全地帯（部屋全体攻撃、ごく小さな空きだけ安全） · 飢えたミニブラックホール（攻撃を食べ、食べた分を撃ち返す → 攻撃をやめて） · 上・左・右の壁5区画から落ちる紫のレーザー",
        "50～0本 鋼鉄君主の化身：赤い斬撃2連 · 自分の位置から広がる赤い輪 · 天からの結晶の槍（刺さると少しの間壁になる） · 鋼鉄の体（正面からのダメージ-90%、背後へ回る） · 鋸刃の輪 · 30本・15本で化身の記憶（二色の床＋レーザー）",
        "変身のたびに必殺技（シーズン3でこのボスだけ）：75本 黒い太陽の誕生（巨大ブラックホール・螺旋弾・紫の波動3回） · 50本 君主の降臨（結晶の槍の格子・締まる鋸刃の輪に合わせてダッシュ） · 10本 欲望の終わりの後、疲れて被ダメージ1.5倍",
      ],
    },
  },
];
