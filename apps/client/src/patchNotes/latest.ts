import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.121",
    date: "2026-10-26",
    items: {
      ko: ["오토마타: 유도 미사일 한 발 피해 30% → 20%"],
      en: ["Automata: homing missile damage per shot 30% → 20%"],
      ja: ["オートマタ：誘導ミサイル1発のダメージ30% → 20%"],
    },
  },
  {
    version: "0.48.120",
    date: "2026-10-26",
    items: {
      ko: ["오토마타: '자매 부르기'가 자매 인형 무기의 셋에 더해져 넷이 됨 (전에는 셋 그대로) · 유도 미사일 한 발 피해 45% → 30%"],
      en: ["Automata: 'Call the Sisters' now adds to the Sister Dolls weapon's three for four dolls (it used to stay at three) · homing missile damage per shot 45% → 30%"],
      ja: ["オートマタ：「姉妹呼び」が姉妹人形の武器の3体に加わり4体に（以前は3体のまま）· 誘導ミサイル1発のダメージ45% → 30%"],
    },
  },
  {
    version: "0.48.119",
    date: "2026-10-26",
    items: {
      ko: ["오토마타: 자매 인형(무기·아이템으로 부른 분신 모두)이 쏠 때 35% 확률로 자기 자리에서 유도 미사일 · 인형이 방 밖에서 공격하던 문제 고침 · 인형마다 옷과 레이저 색을 다르게 (분홍·연두·보라·금빛)"],
      en: ["Automata: Sister Dolls (from weapons or items) now have a 35% chance to launch homing missiles from where they stand when they fire · fixed dolls attacking from outside the room · each doll has its own outfit and laser color (pink, green, purple, gold)"],
      ja: ["オートマタ：姉妹人形（武器・アイテムで呼んだ分身すべて）が撃つ時35%でその場から誘導ミサイル · 人形が部屋の外から攻撃していた問題を修正 · 人形ごとに服とレーザーの色を変更（ピンク・黄緑・紫・金）"],
    },
  },
  {
    version: "0.48.118",
    date: "2026-10-26",
    items: {
      ko: [
        "테라코어 다섯 명(오토마타·라이더·붐버·아티팩터·펑크)의 스킨 9테마 추가 (수영복·크리스마스·할로윈·교복·설날·일본·중국·미국·성별 바꾸기, 라이더는 오토바이 색도 테마에 맞춤)",
        "테라코어 다섯 명에게 여름 한정 스킨 '여름 파도' 추가: 펑크는 네온 분홍 비키니와 비치는 하늘빛 사롱, 오토마타는 하늘빛 프릴 수영복, 라이더는 알로하 셔츠와 흰 오토바이, 붐버는 민소매와 수박 무늬 폭탄 띠, 아티팩터는 문신이 드러난 수영복",
        "캐릭터 선택창의 테라코어 다섯 명 이름 옆 (미완성) 표시를 뺌",
      ],
      en: [
        "Added 9 themed skins for the five Terracore characters (Automata, Rider, Bomber, Artifacter, Punk): swimsuit, Christmas, Halloween, school, New Year, Japan, China, USA and gender swap (the Rider's bike also matches each theme)",
        "Added the limited 'Summer Wave' skin for the five Terracore characters: Punk in a neon-pink bikini with a sheer sky-blue sarong, Automata in a frilly sky-blue swimsuit, Rider in an aloha shirt on a white bike, Bomber in a tank top with a watermelon bomb belt, Artifacter in swim trunks showing his tattoos",
        "Removed the (WIP) tag next to the five Terracore characters in character select",
      ],
      ja: [
        "テラコア5人（オートマタ・ライダー・ボマー・アーティファクター・パンク）のスキン9テーマを追加（水着・クリスマス・ハロウィン・制服・お正月・日本・中国・アメリカ・性別チェンジ、ライダーはバイクの色もテーマに合わせる）",
        "テラコア5人に夏の限定スキン「夏の波」を追加：パンクはネオンピンクのビキニと透ける空色のサロン、オートマタは空色のフリル水着、ライダーはアロハシャツと白いバイク、ボマーはタンクトップとスイカ柄の爆弾ベルト、アーティファクターはタトゥーが見える水着",
        "キャラクター選択画面のテラコア5人の名前横の（未完成）表示を削除",
      ],
    },
  },
  {
    version: "0.48.117",
    date: "2026-10-26",
    items: {
      ko: ["능력치 창의 이동 속도가 지금 실제 빠르기로 계속 바뀌어 보임 (라이더 공격 빠르기·암살 단검, 펑크 신경 가속 등이 붙으면 '1.8 (+20%)'처럼)"],
      en: ["Move speed in the stats panel now shows your live speed (e.g. '1.8 (+20%)' with the Rider's attack speed-up or dagger, the Punk's Neural Accel, and so on)"],
      ja: ["能力値画面の移動速度が今の実際の速さで常に変わって表示（ライダーの攻撃加速・暗殺ダガー、パンクの神経加速などが付くと「1.8（+20%）」のように）"],
    },
  },
  {
    version: "0.48.116",
    date: "2026-10-26",
    items: {
      ko: ["오토마타: 기본 미사일이 50% 확률로 등 뒤에서 유도 미사일 7~11발 (작은 미사일 2발 대신) · '미사일 포드'를 빼고 '리펄서 소드'를 넣음 · '전탄 발사'(늘 미사일 12발 넘게)를 되돌림"],
      en: ["Automata: her base missiles now launch 7–11 homing missiles at a 50% chance (instead of 2 small ones) · 'Missile Pod' is replaced by 'Repulser Sword' · 'Full Arsenal' (always 12+ missiles) is back"],
      ja: ["オートマタ：基本ミサイルが50%で背中から誘導ミサイル7〜11発（小さなミサイル2発の代わり）· 「ミサイルポッド」を外し「リパルサーソード」を追加 · 「全弾発射」（常にミサイル12発以上）を元に戻す"],
    },
  },
  {
    version: "0.48.115",
    date: "2026-10-26",
    items: {
      ko: [
        "학살자 등 전용 아이템만 나오는 캐릭터가 전용 아이템을 모두 모으면 7층 상점 등에 들어갈 때 게임이 멈추던 문제 고침 (다 모으면 공용 아이템이 나옴)",
        "오토마타: 쏠 때마다 50% 확률로 등 뒤에서 작은 유도 미사일 · 모든 미사일이 멀리 있는 적도 늘 쫓아감 · 자매 인형이 저마다 다른 적을 찾아 돌아다니며 사냥 · 쌍둥이 레이저 → '붉은 레이저'(치명타 5→10→15→20% 되풀이) · 전탄 발사 → '리펄서 소드'(양손 대검 두 번 베기)",
        "라이더: 공격할 때마다 게이지가 차고 이동 속도가 쌓여 빨라짐 · 기계 망치를 실제로 휘둘러 내리찍는 효과 · 암살 단검은 훨씬 빠르고 대시하면 목 베기 공격 · 화염 배기는 푸른 불과 불꽃 스택 x1~x5 · 톱날 휠·전기 랜스 효과 다듬음 · 체인 범위 · 니트로 거리 늘림",
        "붐버: 끈끈이는 적 몸에 붙어 4.5초 뒤 터지고 많이 붙을수록 크게 · 지뢰는 적이 없어도 박아 두는 유도 지뢰(눈을 뜨고 달려가 터짐) · 로켓은 늘 쫓아가고 25% 확률로 작은 미사일 · 불꽃놀이 크고 화려하게 · 네이팜은 넓은 불바다와 불꽃 스택 · 폭발에 휘말리면 자신도 피해 20",
        "아티팩터: 제작 연출을 마법진·톱니·떠오르는 빛으로 다시 만듦",
        "펑크: 기본 이동 속도 빨라짐 · 신경 가속 중 무적, 공격 속도 2.6배·이동 속도 1.7배, 적의 움직임·공격·탄이 훨씬 느려짐 · 효과 다듬음",
      ],
      en: [
        "Fixed a freeze when characters that only get their own items (such as Slayer) had collected all of them and entered a floor-7 shop (common items now appear once they are all collected)",
        "Automata: each shot has a 50% chance of small homing missiles from her back · every missile now always chases foes, even far away · Sister Dolls roam off to hunt different foes · Twin Laser → 'Crimson Laser' (crit 5→10→15→20%, repeating) · Full Arsenal → 'Repulser Sword' (two greatsword slashes)",
        "Rider: each attack fills the gauge and stacks move speed · the Mech Hammer now visibly swings and slams · the Assassin's Dagger is much faster and dashing slashes throats · Flame Exhaust breathes blue fire with flame stacks x1–x5 · polished Saw Wheel and Shock Lance effects · wider Chain, longer Nitro",
        "Bomber: sticky bombs cling to foes and blow 4.5s later, bigger the more stick · mines become homing mines planted even with no foes (they wake, run and explode) · rockets always home in with a 25% chance of mini missiles · bigger, flashier fireworks · napalm spreads wide with flame stacks · you take 20 damage if caught in your own blast",
        "Artifacter: crafting now shows a circuit circle, meshing gears and a rising light",
        "Punk: faster base move speed · invulnerable during Neural Accel, with 2.6× attack speed and 1.7× move speed while foes' movement, attacks and shots slow far more · polished effects",
      ],
      ja: [
        "スレイヤーなど専用アイテムだけが出るキャラが専用アイテムを全部集めると7階の商店などに入る時にゲームが止まる問題を修正（全部集めると共通アイテムが出る）",
        "オートマタ：撃つたび50%で背中から小さな誘導ミサイル · すべてのミサイルが遠くの敵も常に追う · 姉妹人形がそれぞれ別の敵を探して狩る · ツインレーザー → 「紅のレーザー」（会心5→10→15→20%繰り返し）· 全弾発射 → 「リパルサーソード」（両手大剣で2連斬り）",
        "ライダー：攻撃するたびにゲージが溜まり移動速度が上がる · 機械ハンマーを実際に振り下ろす効果 · 暗殺ダガーはずっと速くダッシュで喉斬り攻撃 · 火炎排気は青い炎と炎スタックx1〜x5 · ノコギリホイール・電撃ランスの効果を改善 · チェーンの範囲・ニトロの距離を拡大",
        "ボマー：粘着爆弾は敵の体にくっつき4.5秒後に爆発、多く付くほど大きく · 地雷は敵がいなくても埋める誘導地雷（目を開けて走り寄り爆発）· ロケットは常に追尾し25%で小型ミサイル · 花火を大きく華やかに · ナパームは広い火の海と炎スタック · 爆発に巻き込まれると自分も20ダメージ",
        "アーティファクター：製作演出を魔法陣・歯車・浮かぶ光で作り直し",
        "パンク：基本移動速度アップ · 神経加速中は無敵、攻撃速度2.6倍・移動速度1.7倍、敵の動き・攻撃・弾がずっと遅く · 効果を改善",
      ],
    },
  },
];
