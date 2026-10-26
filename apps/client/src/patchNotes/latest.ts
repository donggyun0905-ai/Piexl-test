import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
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
