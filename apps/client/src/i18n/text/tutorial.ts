import type { Lang } from "../index";

// 화면 글자: 튜토리얼
export const TUTORIAL_TEXT = {
  tutorial: { ko: "튜토리얼", en: "Tutorial", ja: "チュートリアル" },
  tutorialDesc: { ko: "이동·공격·대시·아이템 고르기를 짧게 배우기", en: "Learn moving, attacking, dashing and picking items", ja: "移動・攻撃・ダッシュ・アイテム選びを短く学ぶ" },
  tutorialRecommend: { ko: "처음이면 추천", en: "Recommended", ja: "初めてならおすすめ" },
  tutorialSkip: { ko: "이 단계 건너뛰기", en: "Skip step", ja: "このステップをスキップ" },
  tutorialQuit: { ko: "나가기", en: "Quit", ja: "終了" },
  tutorialFinish: { ko: "끝내기", en: "Finish", ja: "終了" },
  tutorialMove: {
    ko: "WASD 또는 방향키로 움직여 보세요. (모바일: 왼쪽 화면을 드래그)",
    en: "Move with WASD or the arrow keys. (Mobile: drag on the left side)",
    ja: "WASDまたは矢印キーで動いてみましょう。（モバイル：画面左をドラッグ）",
  },
  tutorialAttack: {
    ko: "공격은 자동입니다. 다가오는 적을 쓰러뜨려 보세요. 적에게 닿으면 피해를 입으니 움직이며 싸우세요.",
    en: "Attacks are automatic. Defeat the approaching enemy, and keep moving: touching enemies hurts.",
    ja: "攻撃は自動です。近づく敵を倒しましょう。敵に触れるとダメージなので動きながら戦います。",
  },
  tutorialDash: {
    ko: "우클릭으로 대시! 대시하는 동안에는 피해를 받지 않습니다. (모바일: 대시 버튼)",
    en: "Dash with right click! You take no damage while dashing. (Mobile: Dash button)",
    ja: "右クリックでダッシュ！ダッシュ中はダメージを受けません。（モバイル：ダッシュボタン）",
  },
  tutorialDodge: {
    ko: "포격수가 내 자리에 붉은 원을 남깁니다. 곧 터지니 원 밖으로 피하면서 포격수를 쓰러뜨리세요.",
    en: "The Mortar marks a red circle where you stand. It blows up soon, so step out of it and defeat the Mortar.",
    ja: "砲撃手が自分の場所に赤い円を残します。すぐ爆発するので円の外へ避けながら砲撃手を倒しましょう。",
  },
  tutorialWeapon: {
    ko: "바닥의 무기에 마우스를 올리면 지금 무기와 비교됩니다. 마음에 드는 무기 위에 서서 F를 눌러 바꾸세요.",
    en: "Hover a weapon on the floor to compare it with yours. Stand on the one you like and press F to swap.",
    ja: "床の武器にマウスを乗せると今の武器と比較できます。気に入った武器の上でFを押して交換しましょう。",
  },
  tutorialReward: {
    ko: "보스를 쓰러뜨리면 보상 세 개 중 하나를 고릅니다. 하나를 클릭해 고르세요. (모바일: 탭)",
    en: "After a boss you pick one of three rewards. Click one to choose. (Mobile: tap)",
    ja: "ボスを倒すと3つの報酬から1つ選べます。1つをクリックして選びましょう。（モバイル：タップ）",
  },
  tutorialItem: {
    ko: "체력이 줄었습니다. Q 키로 회복약을 써 보세요. 아래 아이템 칸을 눌러도 됩니다.",
    en: "Your health is low. Press Q to use the potion. You can also click the item slot below.",
    ja: "体力が減りました。Qキーで回復薬を使いましょう。下のアイテム枠を押してもOKです。",
  },
  tutorialItemTouch: { ko: "모바일은 오른쪽 아래 아이템 버튼을 누르세요.", en: "On mobile, tap the item button at the bottom right.", ja: "モバイルは右下のアイテムボタンを押します。" },
  tutorialMap: {
    ko: "위쪽 벽에 출구가 열렸습니다. 출구 아래 그림이 다음 방 종류입니다 (전투·강한 적·보물·상점·쉼터·보스). 하나를 골라 들어가 보세요. 지나온 방으로는 돌아갈 수 없고, 오른쪽 위 노선도에서 층 전체 길을 볼 수 있습니다.",
    en: "Exits opened on the top wall. The icon under each exit shows the next room (fight, elite, treasure, shop, spring, boss). Pick one and walk in. You can't go back, and the route map (top right) shows the whole floor.",
    ja: "上の壁に出口が開きました。出口の下の絵が次の部屋の種類です（戦闘・強敵・宝・店・泉・ボス）。1つ選んで入ってみましょう。通った部屋には戻れず、右上のルートマップで階全体の道が見られます。",
  },
  tutorialEnd: {
    ko: "끝! 층을 오르며 아이템을 모아 6층 보스를 쓰러뜨리면 클리어입니다.",
    en: "That's it! Climb the floors, collect items and defeat the floor 6 boss to clear.",
    ja: "以上です！階を登ってアイテムを集め、6階のボスを倒せばクリアです。",
  },
} satisfies Record<string, Record<Lang, string>>;
