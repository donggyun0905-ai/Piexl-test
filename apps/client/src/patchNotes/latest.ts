import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.285",
    date: "2026-10-31",
    items: {
      ko: ["좌우가 반대로 나오던 그림 고침: 변희 서기·걷기·공격 · 곰 대시"],
      en: ["Fixed mirrored poses: Byeonhui standing, walking and attack · bear dash"],
      ja: ["左右が逆になっていた絵を修正: ビョンヒの立ち・歩き・攻撃 · 熊のダッシュ"],
    },
  },
  {
    version: "0.48.284",
    date: "2026-10-31",
    items: {
      ko: ["새 캐릭터 그림: 변희 · 변희 동물 늑대·곰 · 앞·뒤·왼·오 모습과 공격·걷기·맞음·쓰러짐·대시 자세"],
      en: ["New art: Byeonhui · her wolf and bear forms · front/back/left/right with attack, walk, flinch, downed and dash poses"],
      ja: ["新しいキャラ絵: ビョンヒ · 動物の狼・熊 · 前・後ろ・左・右と攻撃・歩き・ひるみ・ダウン・ダッシュのポーズ"],
    },
  },
  {
    version: "0.48.283",
    date: "2026-10-31",
    items: {
      ko: ["새 캐릭터 그림: 거인 · 오니(각성 모습 포함) · 이드라 · 변희 동물 4종(뱀·독수리·멧돼지·전갈) · 앞·뒤·왼·오 모습과 공격·걷기·맞음·쓰러짐·대시 자세"],
      en: ["New art: Titan · Oni (including the awakened form) · Idra · 4 of Byeonhui's animals (snake, eagle, boar, scorpion) · front/back/left/right with attack, walk, flinch, downed and dash poses"],
      ja: ["新しいキャラ絵: 巨人 · 鬼（覚醒した姿も）· イドラ · ビョンヒの動物4種（蛇・鷲・猪・蠍）· 前・後ろ・左・右と攻撃・歩き・ひるみ・ダウン・ダッシュのポーズ"],
    },
  },
  {
    version: "0.48.282",
    date: "2026-10-31",
    items: {
      ko: ["야수가 변신하는 호랑이를 새 그림 '불꽃 백호'로: 앞·뒤·왼·오 모습, 걷기, 할퀴기 공격, 덮치기(대시) 자세"],
      en: ["The Beastkin's tiger form is now the new 'Flame White Tiger' art: front/back/left/right, walking, claw attack and pounce (dash) poses"],
      ja: ["獣人が変身する虎を新しい絵「炎の白虎」に: 前・後ろ・左・右、歩き、引っかき攻撃、飛びかかり（ダッシュ）のポーズ"],
    },
  },
  {
    version: "0.48.281",
    date: "2026-10-31",
    items: {
      ko: ["풋내기 레벨별 옷을 새 그림으로: 5레벨 기본 옷 · 10레벨 가죽 · 15레벨 쇠사슬 (20레벨 판금은 준비 중)"],
      en: ["Novice level outfits in the new art: Lv 5 basic clothes · Lv 10 leather · Lv 15 chainmail (Lv 20 plate coming soon)"],
      ja: ["見習いのレベル別の服を新しい絵に: Lv5 基本の服 · Lv10 革 · Lv15 鎖帷子（Lv20 プレートは準備中）"],
    },
  },
  {
    version: "0.48.280",
    date: "2026-10-31",
    items: {
      ko: ["베두인이 차크람을 던지면 예전 그림으로 바뀌던 문제 고침 (새 그림 그대로)"],
      en: ["Fixed the Bedouin switching back to the old art after throwing the chakram (keeps the new art)"],
      ja: ["ベドウィンがチャクラムを投げると古い絵に戻る問題を修正（新しい絵のまま）"],
    },
  },
  {
    version: "0.48.279",
    date: "2026-10-31",
    items: {
      ko: ["좌우가 반대로 나오던 그림 고침: 소환술사 공격 · 풋내기 공격 · 버려진 자들(검 소년) 서기·걷기"],
      en: ["Fixed mirrored poses: Summoner attack · Novice attack · The Abandoned (sword boy) standing and walking"],
      ja: ["左右が逆になっていた絵を修正: 召喚術師の攻撃 · 見習いの攻撃 · 捨てられた者たち（剣の少年）の立ち・歩き"],
    },
  },
  {
    version: "0.48.278",
    date: "2026-10-31",
    items: {
      ko: ["새 캐릭터 그림 6명 추가: 풋내기·베두인·장수·이무기·악의 사도·버려진 자들(세 아이 모두) · 앞·뒤·왼·오 모습과 방향별 공격, 걷기, 맞음·쓰러짐·대시 자세"],
      en: ["New art for 6 more characters: Novice, Bedouin, General, Imugi, Apostle of Malice, The Abandoned (all three kids) · front/back/left/right poses with directional attacks, walking, flinch, downed and dash poses"],
      ja: ["新しいキャラ絵を6人追加: 見習い・ベドウィン・武将・イムギ・悪の使徒・捨てられた者たち（3人とも）· 前・後ろ・左・右の姿と向きごとの攻撃、歩き、ひるみ・ダウン・ダッシュのポーズ"],
    },
  },
  {
    version: "0.48.277",
    date: "2026-10-31",
    items: {
      ko: ["새 캐릭터 그림 6명 추가: 거너·닌자·소환술사·시간술사·야수·의사 · 앞·뒤·왼·오 모습과 방향별 공격, 걷기, 맞음·쓰러짐·대시 자세"],
      en: ["New art for 6 more characters: Gunner, Ninja, Summoner, Chronomancer, Beastkin, Doctor · front/back/left/right poses with directional attacks, walking, flinch, downed and dash poses"],
      ja: ["新しいキャラ絵を6人追加: ガンナー・忍者・召喚術師・時間術師・獣人・医者 · 前・後ろ・左・右の姿と向きごとの攻撃、歩き、ひるみ・ダウン・ダッシュのポーズ"],
    },
  },
  {
    version: "0.48.276",
    date: "2026-10-31",
    items: {
      ko: ["새 그림 캐릭터의 왼쪽·오른쪽 공격 자세가 반대로 나오던 문제 고침 (파수꾼·떠돌이·음양사·기계공학자·원소술사·격투가) · 기계공학자가 레이저를 쏠 때 공격 자세 · 그림 칸 위에 붙어 나오던 작은 조각 지움"],
      en: ["Fixed left/right attack poses being swapped on the new art (Warden, Drifter, Talisman Master, Engineer, Elementalist, Brawler) · Engineer now shows its attack pose while firing the laser · removed stray fragments at the top of some frames"],
      ja: ["新しい絵のキャラの左右の攻撃ポーズが逆になる問題を修正（番人・流れ者・陰陽師・機械工学者・元素術師・格闘家）· 機械工学者がレーザーを撃つ間は攻撃ポーズ · 一部のコマ上部に出ていた小さなかけらを削除"],
    },
  },
  {
    version: "0.48.275",
    date: "2026-10-31",
    items: {
      ko: ["캐릭터 선택창·설명 창·스킨 미리보기의 캐릭터 그림을 화면 해상도로 또렷하게 그림 (새 그림이 흐릿하던 문제)"],
      en: ["Character art in the selection screen, info window and skin previews is now drawn at screen resolution (new art no longer looks blurry)"],
      ja: ["キャラクター選択画面・説明ウィンドウ・スキンプレビューのキャラ絵を画面解像度でくっきり描画（新しい絵がぼやける問題）"],
    },
  },
  {
    version: "0.48.274",
    date: "2026-10-31",
    items: {
      ko: ["새 캐릭터 그림 7명: 파수꾼·마법사·떠돌이·음양사·기계공학자·원소술사·격투가 · 앞·뒤·왼·오 모습과 방향마다 공격 자세, 다리를 움직이는 걷기, 맞을 때 움찔·대시 때 돌진 자세·협동에서 쓰러진 모습"],
      en: ["New art for 7 characters: Warden, Mage, Drifter, Talisman Master, Engineer, Elementalist, Brawler · front/back/left/right poses with an attack pose for each direction, walking with moving legs, a flinch when hit, a lunge while dashing and a downed pose in co-op"],
      ja: ["7人のキャラクターを新しい絵に: 番人・魔法使い・流れ者・陰陽師・機械工学者・元素術師・格闘家 · 前・後ろ・左・右の姿と向きごとの攻撃ポーズ、足を動かす歩き、被弾時のひるみ・ダッシュ時の突進ポーズ・協力プレイで倒れた姿"],
    },
  },
  {
    version: "0.48.273",
    date: "2026-10-31",
    items: {
      ko: ["파수꾼 그림을 진한 색·굵은 테두리 그림으로 바꿈: 은빛 판금 갑옷, 붉은 깃털 투구, 푸른 망토 · 어두운 바닥에서도 또렷하게 보임"],
      en: ["Warden art swapped to a bolder version with rich colors and thick outlines: silver plate armor, red-plumed helmet, blue cape · stands out clearly on dark floors"],
      ja: ["番人の絵を濃い色・太い縁取りの絵に変更: 銀のプレートアーマー、赤い羽根の兜、青いマント · 暗い床でもはっきり見える"],
    },
  },
  {
    version: "0.48.272",
    date: "2026-10-31",
    items: {
      ko: ["파수꾼 그림을 4배(128칸) 새 그림으로: 흰·금빛 판금 갑옷, 붉은 깃털 머리 장식, 푸른 망토, 큰 칼 · 마법사와 같은 화풍"],
      en: ["Warden redrawn with new 4× (128-px) art: white-and-gold plate armor, red plume crest, blue cape, greatsword · same art style as the Mage"],
      ja: ["番人を4倍（128マス）の新しい絵に: 白と金のプレートアーマー、赤い羽根飾り、青いマント、大剣 · 魔法使いと同じ画風"],
    },
  },
];
