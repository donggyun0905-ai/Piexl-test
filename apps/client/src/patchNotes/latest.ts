import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.55.2",
    date: "2026-11-15",
    items: {
      ko: ["세계 지도(시험 중) 편의 기능: H 조작키 안내 창 · 왼쪽 아래 미니맵 (내 자리·퀘스트 목적지·사냥터·필드 보스·최종보스 입구·만진 순간 이동석, 누르면 지도) · G 퀘스트 목적지까지 자동으로 걷기 (이동 키를 누르면 멈춤) · Shift를 누르고 있으면 달리기 (대시는 우클릭·K) · 화면 아래 체력·대시 줄 · 쓰러지면 남은 시간을 보여 주고 가장 가까운 만진 순간 이동석에서 일어남 · 장소 이름표 늘 보기 (설정) · 글 창은 아무 데나 누르거나 Space·Enter·F로 넘김 · 지도 창에 만진 순간 이동석 바로 가기 목록 (다른 지역 돌도) · 나무·몬스터 처치 알림 · 마우스 휠로 확대·축소 (설정에서도) · 몬스터에 마우스를 올리면 이름·권장 투력"],
      en: ["World Map (testing) quality of life: H opens a controls guide · Minimap in the bottom left (you, quest goal, hunting grounds, field bosses, final boss gates and waystones you touched; click to open the map) · G walks you to the quest goal (a move key stops it) · Hold Shift to run (dash is right click / K) · HP and dash bars at the bottom of the screen · When you fall, a countdown shows and you rise at the nearest waystone you touched · Option to always show place names · Text windows close on any click or Space / Enter / F · Shortcut list of touched waystones in the map window (other regions too) · Pop-ups for wood and defeated monsters · Mouse wheel zoom (also in settings) · Hover a monster to see its name and recommended power"],
      ja: ["世界地図（テスト中）便利機能：Hで操作キーの案内・左下にミニマップ（自分・クエストの目的地・狩り場・フィールドボス・最終ボスの入口・触れた転移石、押すと地図）・Gでクエストの目的地まで自動で歩く（移動キーで止まる）・Shiftを押している間は走る（ダッシュは右クリック・K）・画面下に体力・ダッシュのバー・倒れると残り時間を表示し、近くの触れた転移石で起き上がる・場所の名札を常に表示（設定）・文章の画面はどこを押しても、Space・Enter・Fでも進む・地図の画面に触れた転移石のショートカット一覧（ほかの地域の石も）・木材とモンスター撃破のお知らせ・マウスホイールで拡大・縮小（設定でも）・モンスターにマウスを乗せると名前と推奨戦力"],
    },
  },
  {
    version: "0.55.1",
    date: "2026-11-15",
    items: {
      ko: ["세계 지도(시험 중) 조작: 좌클릭 공격 · 우클릭 대시 (마우스 쪽으로, J·Shift도 그대로) · 사냥터가 없는 필드에서도 공격·대시 · 베기 그림을 더 크고 잘 보이게 · Esc로 설정 창 (소리·화면 등, 계속하기·메인으로) · 최종보스 입구 자리: 검은 잔영은 새벽의 성흔 아지트로, 제천대성은 대사막 세레스티아로 · 대화·창이 떠 멈췄을 때 발소리가 계속 나던 문제 고침"],
      en: ["World Map (testing) controls: left click to attack, right click to dash (toward the mouse; J and Shift still work) · Attack and dash also work in fields without hunting grounds · Bigger, clearer slash effect · Esc opens settings (sound, screen and more; Resume / Menu) · Final boss gates moved: Black Remnant to the Dawn's Stigmata hideout, Great Sage to Celestia in the Great Desert · Fixed footsteps that kept playing while a dialog or window was open"],
      ja: ["世界地図（テスト中）操作：左クリックで攻撃・右クリックでダッシュ（マウスの方へ、J・Shiftもそのまま）・狩り場のないフィールドでも攻撃・ダッシュ・斬撃の絵を大きく見やすく・Escで設定画面（音・画面など、再開・メインへ）・最終ボスの入口：黒き残影は暁の聖痕のアジトへ、斉天大聖は大砂漠のセレスティアへ・会話や画面が開いて止まったときに足音が鳴り続けていた問題を修正"],
    },
  },
  {
    version: "0.55.0",
    date: "2026-11-15",
    items: {
      ko: ["세계 지도(시험 중) 사냥터 24곳 (몬스터 종류마다 한 곳, 나라마다 둘) · 나라마다 던전 보스가 지키는 필드 보스 12곳 (5분 뒤 다시 나타남) · 뒤쪽 나라일수록 권장 투력과 몬스터가 강해짐 · 최종보스 입구 9곳 (스토리 자리: 아스칼론 파멸의 용 · 사막 신전 옆 태초의 빛과 어둠 · 사막 검은 잔영 · 헬리오스 갓이터 · 테라코어 괴력난신 · 성국 제천대성 · 해저 도시 레비아탄 · 지옥 켈베로스·아스모데우스의 화신체): F → 지도의 영웅과 낀 장신구로 7층 보스방에 바로 · 기록·순위에는 안 남고 잡으면 로비 칩 3,000과 1~2성 장신구 1~2개 · 퀘스트 종류: 메인 · 서브(사냥터·필드 보스·최종보스마다, 받으면 칩) · 긴급(하루 3개: 사냥 또는 나무 베기) · 나무 앞에서 F로 나무 베기 (3번 치면 1개, 잠시 그루터기) · 기록서에 메인·서브·긴급 탭 · Tab 창에 최종보스 입구 · 지도를 나갈 때 나던 오류 고침"],
      en: ["World Map (testing): 24 hunting grounds (one per monster type, two per country) · 12 field bosses guarded by dungeon bosses (return after 5 minutes) · Recommended power and monster strength rise in later countries · 9 final boss gates at story locations (Dragon of Ruin in Ascalon, Primeval Light and Dark by the desert temple, Black Remnant in the desert, God Eater in Helios, Demigod of Wild Might in Terracore, Great Sage in Seongguk, Leviathan in the undersea city, Cerberus and the Avatar of Asmodeus in Hell): press F to go straight into the floor 7 boss chamber with your map hero and equipped trinkets · No records or rankings; a win gives 3,000 lobby chips and 1-2 trinkets (1-2 stars) · Quest types: Main · Side (one per hunting ground, field boss and final boss; claim chips) · Urgent (3 per day: hunting or tree chopping) · Press F in front of a tree to chop it (3 hits for 1 wood; leaves a stump for a while) · Main / Side / Urgent tabs in the Book of Records · Final boss gates in the Tab window · Fixed an error when leaving the map"],
      ja: ["世界地図（テスト中）狩り場24か所（モンスターの種類ごとに1か所、国ごとに2つ）・ダンジョンのボスが守るフィールドボス12か所（5分後に再出現）・奥の国ほど推奨戦力とモンスターが強くなる・最終ボスの入口9か所（物語の場所：アスカロンに滅亡の竜・砂漠の神殿の横に太初の光と闇・砂漠に黒き残影・ヘリオスにゴッドイーター・テラコアに怪力乱神・聖国に斉天大聖・海底都市にリヴァイアサン・地獄にケルベロスとアスモデウスの化身）：Fで地図の英雄と装着中の装身具のまま7階のボス部屋へ・記録や順位には残らず、倒すとロビーチップ3,000と1〜2つ星の装身具1〜2個・クエストの種類：メイン・サブ（狩り場・フィールドボス・最終ボスごと、受け取るとチップ）・緊急（1日3つ：狩りか木こり）・木の前でFで木を切る（3回で1本、しばらく切り株）・記録書にメイン・サブ・緊急タブ・Tab画面に最終ボスの入口・地図を出るときのエラーを修正"],
    },
  },
  {
    version: "0.54.1",
    date: "2026-11-15",
    items: {
      ko: ["세계 지도(시험 중) 첫 장비: 처음 한 번 1성 장신구 6개(반지 3·목걸이·귀걸이·브로치, 추가 능력치 공격%·방어·체력)를 장비 상자에 넣고 바로 끼워 줌 · 화면 디자인: 버튼·창을 픽셀 RPG 테두리로 (어두운 바깥선·밝은 안쪽선·위 밝음·아래 그늘 · 창은 금빛 안쪽선과 모서리 점·그림자 · 입력칸은 들어간 모양 · 누르면 살짝 눌림)"],
      en: ["World Map (testing) starter gear: once, six 1-star trinkets (3 rings, necklace, earring, brooch, with Attack%, Defense and HP lines) go into the gear chest and are equipped for you · Screen design: buttons and windows get pixel RPG frames (dark outer line, light inner line, bevel highlights and shade · windows with a golden inner line, corner studs and shadow · inset input fields · buttons press down when clicked)"],
      ja: ["世界地図（テスト中）最初の装備：一度だけ1つ星の装身具6つ（指輪3・首飾り・耳飾り・ブローチ、追加能力は攻撃%・防御・体力）を装備の箱に入れてすぐ装着・画面デザイン：ボタンと窓をピクセルRPG風の枠に（暗い外線・明るい内線・上の光と下の影・窓は金色の内線と角の飾り・影・入力欄はへこんだ形・押すと少し沈む）"],
    },
  },
  {
    version: "0.54.0",
    date: "2026-11-15",
    items: {
      ko: ["세계 지도(시험 중) 사냥터: 아스칼론 '슬라임 풀밭' · 대사막 '오크 부락' · 실베르 '해골 전장'에 몬스터가 모여 있음 (잡으면 15~30초 뒤 다시 나타남) · 지도에서 J 휘두르기 · Shift 대시 · 낀 레이드 장신구 능력치(공격·체력·방어·공격 속도·치명타·흡혈 등)가 그대로 들어감 · 쓰러지면 잠시 뒤 그 나라 처음 자리에서 일어남 · 사냥 퀘스트 3개가 메인 퀘스트 사이에 들어감 (이미 끝낸 퀘스트·연 모드는 그대로) · Tab 창에 사냥터와 권장 투력"],
      en: ["World Map (testing) hunting grounds: monsters gather at Ascalon's 'Slime Meadow', the Great Desert's 'Orc Camp' and Silber's 'Field of Bones' (they return 15-30 seconds after being defeated) · J to swing and Shift to dash on the map · Your equipped raid accessory stats (attack, HP, defense, attack speed, crits, lifesteal and more) apply as-is · If you fall, you get back up at the country's starting point after a moment · Three hunting quests now sit between the main quests (quests you've finished and modes you've opened stay as they are) · Hunting grounds and recommended power in the Tab window"],
      ja: ["世界地図（テスト中）狩り場：アスカロン『スライムの草原』・大砂漠『オークの集落』・シルベール『骸骨の戦場』にモンスターが集まる（倒すと15〜30秒後に再出現）・地図でJ 攻撃・Shift ダッシュ・装備中のレイドアクセサリーの能力（攻撃・体力・防御・攻撃速度・会心・吸血など）がそのまま適用・倒れると少しして、その国の最初の場所で起き上がる・狩りクエスト3つがメインクエストの間に追加（終えたクエストや開いたモードはそのまま）・Tab画面に狩り場と推奨戦力"],
    },
  },
];
