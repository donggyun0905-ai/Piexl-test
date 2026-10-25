import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.47.2",
    date: "2026-10-21",
    items: {
      ko: ["천사장이 부르던 성기사가 3층부터 던전에도 나옵니다. 다가오며 이따금 플레이어 자리에 하늘에서 빛기둥을 하나씩 떨굽니다 (천사장이 부른 성기사도 같음)"],
      en: ["The Paladins the Archangel summons now also appear in the dungeon from floor 3. They close in and now and then drop a single pillar of light from the sky onto you (summoned ones too)"],
      ja: ["天使長が呼ぶ聖騎士が3階からダンジョンにも出ます。近づきながら時々プレイヤーの位置に空から光の柱を1本ずつ落とします（天使長が呼んだ聖騎士も同じ）"],
    },
  },
  {
    version: "0.47.1",
    date: "2026-10-21",
    items: {
      ko: [
        "패시브·사용 아이템 효과 수치와 상점 가격도 관리자 페이지에서 조정할 수 있게 되었습니다. 아이템 설명의 숫자도 바뀐 수치를 따라갑니다",
      ],
      en: [
        "Passive and usable item effects and shop prices can now also be tuned on the admin page. Numbers in item descriptions follow the current values",
      ],
      ja: [
        "パッシブ・使用アイテムの効果の数値とショップの価格も、管理ページから調整できるようになりました。アイテム説明の数字も今の数値に合わせて変わります",
      ],
    },
  },
  {
    version: "0.47.0",
    date: "2026-10-21",
    items: {
      ko: [
        "캐릭터·무기·적·보스 수치를 업데이트 없이 서버에서 조정할 수 있게 되었습니다. 게임을 열 때와 판이 끝날 때 새 수치를 받아 다음 판부터 적용합니다 (서버에 닿지 않으면 마지막으로 받은 수치)",
        "배틀은 방에 있는 모두가 같은 수치로 하고, 일일 도전·레이드·아레나 기록은 그 판을 한 수치로 확인합니다",
      ],
      en: [
        "Character, weapon, enemy and boss numbers can now be tuned on the server without an update. New numbers are fetched when you open the game and after each run, and apply from your next run (if the server can't be reached, the last numbers received are used)",
        "In battle everyone in the room plays with the same numbers, and daily challenge, raid and arena records are checked with the numbers that run was played with",
      ],
      ja: [
        "キャラクター・武器・敵・ボスの数値を、アップデートなしでサーバーから調整できるようになりました。ゲームを開いたときとプレイ終了時に新しい数値を受け取り、次のプレイから反映します（サーバーにつながらないときは最後に受け取った数値）",
        "バトルでは部屋の全員が同じ数値で遊び、デイリーチャレンジ・レイド・アリーナの記録はそのプレイの数値で確認します",
      ],
    },
  },
  {
    version: "0.46.2",
    date: "2026-10-21",
    items: {
      ko: ["태초의 빛과 어둠: 상자 벽이 방 가운데(보스를 잡으면 생기는 계단 자리)를 막아 다음으로 갈 수 없던 문제를 고쳤습니다"],
      en: ["Primeval Light & Dark: fixed box walls blocking the room center where the stairs appear after the fight"],
      ja: ["太初の光と闇：箱の壁が部屋の中央（倒した後に階段が出る場所）をふさいで先に進めない問題を修正しました"],
    },
  },
  {
    version: "0.46.1",
    date: "2026-10-21",
    items: {
      ko: [
        "기계공학자 기본 무기 레이저 발사기 피해 조정 (초당 39 → 32): 다른 전용 무기가 각자 잘하는 상황에서 더 세게",
        "기계공학자 전용 아이템이 모든 무기와 어울리게: 고출력 렌즈는 레이저가 아닌 무기의 공격 범위 +15%, 빔 스플리터는 레이저가 아닌 무기도 가까운 적에게 보조 레이저(40%), 굴절 프리즘은 범위 공격 무기(커터·자기장·해머·지뢰·위성 포) 피해 +15%",
      ],
      en: [
        "Engineer's starting Beam Emitter adjusted (39 → 32 damage per second) so the other weapons shine in their own situations",
        "Engineer items now fit every weapon: High-Power Lens gives non-laser weapons +15% attack area, Beam Splitter makes non-laser weapons fire a support laser at the nearest enemy (40%), Refraction Prism gives area weapons (Cutter, Magnetic Field, Hammer, Mines, Orbital Cannon) +15% damage",
      ],
      ja: [
        "エンジニアの初期武器レーザー発振器のダメージを調整（毎秒39 → 32）：他の専用武器がそれぞれ得意な場面でより強く",
        "エンジニア専用アイテムがすべての武器に合うように：高出力レンズはレーザー以外の武器の攻撃範囲+15%、ビームスプリッターはレーザー以外の武器でも近くの敵へ補助レーザー（40%）、屈折プリズムは範囲攻撃の武器（カッター·磁場·ハンマー·地雷·衛星砲）のダメージ+15%",
      ],
    },
  },
  {
    version: "0.46.0",
    date: "2026-10-21",
    items: {
      ko: [
        "새 모드 레이드 아레나 (혼자 하기): 모든 보스와 차례로 싸워 Lv15까지. 레벨마다 보상 방에서 체력이 다 차고, 무기는 마음껏 · 패시브는 3개 중 1개 · 아이템은 3개 중 2개를 고릅니다",
        "Lv1~4 1단계 보스: 1마리 → 2마리 동시 → 3마리 동시 → 승급전(모든 보스를 차례로, 사이 보상 없이 체력 이어짐) · Lv5~8 2단계 · Lv9~12 3단계 · Lv13~15 최종 보스 셋을 골라서 하나씩",
        "일일 도전 화면에 레이드 아레나 순위표 (깬 레벨이 높은 순, 같으면 빠른 시간 순, 전체 기간)",
      ],
      en: [
        "New mode Raid Arena (Solo): fight every boss in turn up to Lv15. Each level starts in a reward room that fully heals you, where you pick any weapon, 1 of 3 passives and 2 of 3 items",
        "Lv1–4 tier-1 bosses: one → two at once → three at once → promotion match (every boss in a row, no rewards between, health carries over) · Lv5–8 tier 2 · Lv9–12 tier 3 · Lv13–15 pick the three final bosses one by one",
        "Raid Arena leaderboard on the Daily Challenge screen (highest level cleared, then fastest time, all-time)",
      ],
      ja: [
        "新モード レイドアリーナ（ソロ）：すべてのボスと順に戦いLv15まで。レベルごとに報酬部屋で体力が全快し、武器は自由 · パッシブは3つから1つ · アイテムは3つから2つ選びます",
        "Lv1～4 第1段階ボス：1体 → 2体同時 → 3体同時 → 昇格戦（すべてのボスを順に、間の報酬なし・体力は引き継ぎ） · Lv5～8 第2段階 · Lv9～12 第3段階 · Lv13～15 最終ボス3体を選んで1体ずつ",
        "デイリーチャレンジ画面にレイドアリーナのランキング（クリアしたレベルが高い順、同じなら速い順、全期間）",
      ],
    },
  },
];
