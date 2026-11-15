import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.55.6",
    date: "2026-11-16",
    items: {
      ko: ["세계 지도(시험 중) 지도 전투에 빛 효과(던전과 같은 빛나는 탄·폭발 빛)와 화면 흔들림(설정을 따름) · 휴대폰: 전투판 안에서 누른 곳으로 걷고 공격은 자동 (가까운 적)"],
      en: ["World Map (testing) field combat now has glow effects (the same glowing shots and blasts as the dungeon) and screen shake (follows your settings) · Phones: inside the battlefield, tap to walk there and attacks are automatic (nearest enemy)"],
      ja: ["世界地図（テスト中）フィールド戦闘に光のエフェクト（ダンジョンと同じ光る弾・爆発の光）と画面の揺れ（設定に従う）・スマホ：戦場の中では押した場所へ歩き、攻撃は自動（近くの敵）"],
    },
  },
  {
    version: "0.55.5",
    date: "2026-11-16",
    items: {
      ko: ["세계 지도(시험 중) 새 지도 전투를 모든 곳으로: 사냥터 24곳 · 들판 몬스터 무리 · 필드 보스 12곳 모두 몬스터가 쫓아오면 주변 지도가 전투판이 되고 던전과 같은 계산으로 싸움 · 판 안에 있는 몬스터는 무리가 달라도 함께 싸움 · 필드 보스는 던전 보스 행동·보스 체력 줄 그대로 · 싸우는 동안 위쪽 나라 이름은 숨김"],
      en: ["World Map (testing) the new field combat everywhere: at all 24 hunting grounds, roaming packs and all 12 field bosses, the map around you becomes the battlefield when monsters chase you, using the same rules as the dungeon · Every monster inside the battlefield joins in, even from other packs · Field bosses keep their dungeon boss moves and boss health bar · The country name at the top hides during battle"],
      ja: ["世界地図（テスト中）新しいフィールド戦闘をすべての場所に：狩り場24か所・フィールドの群れ・フィールドボス12体すべてで、モンスターに追われると周りの地図が戦場になりダンジョンと同じ計算で戦う・戦場の中のモンスターは群れが違っても一緒に戦う・フィールドボスはダンジョンのボスの動きとボスの体力バーのまま・戦闘中は上の国名を隠す"],
    },
  },
  {
    version: "0.55.4",
    date: "2026-11-16",
    items: {
      ko: ["세계 지도(시험 중) 들판에 몬스터 무리가 떠돎: 나라마다 그 나라 사냥터 몬스터가 2~5마리씩 무리 지어 들판 곳곳에 (마을·길·장소 둘레는 비움) · 그 나라 처음 자리에서 멀수록 강해짐 (최대 1.6배, 권장 투력도 같이) · 잡으면 40초 뒤 다시 나타남 · 잡은 수는 그 몬스터 사냥터 퀘스트로 셈 · 슬라임 무리는 새 지도 전투(던전과 같은 계산)로 싸움 · 수치는 관리자 페이지 '규칙 수치'에서 바꿀 수 있음"],
      en: ["World Map (testing) monster packs roam the fields: in each country, packs of 2-5 of that country's hunting-ground monsters wander the fields (towns, roads and places stay clear) · The farther from the country's starting point, the stronger they get (up to 1.6x, recommended power too) · They return 40 seconds after being defeated · Kills count toward that monster's hunting-ground quest · Slime packs use the new field combat (same as the dungeon)"],
      ja: ["世界地図（テスト中）フィールドをモンスターの群れがうろつく：国ごとにその国の狩り場のモンスターが2〜5匹ずつ群れでフィールドのあちこちに（町・道・施設の周りは空ける）・その国の最初の場所から遠いほど強くなる（最大1.6倍、推奨戦力も）・倒すと40秒後に再出現・倒した数はそのモンスターの狩り場クエストに数える・スライムの群れは新しいフィールド戦闘（ダンジョンと同じ計算）で戦う"],
    },
  },
  {
    version: "0.55.3",
    date: "2026-11-16",
    items: {
      ko: ["세계 지도(시험 중) 새 지도 전투 시험: 아스칼론 슬라임 사냥터에서는 몬스터가 쫓아오면 화면이 바뀌지 않고 내 주변 지도가 그대로 전투판이 됨 (빛 테두리) · 던전과 똑같이 무기·스킬(1~4)·대시·이펙트·피해 숫자·낀 장신구로 싸움 (좌클릭 꾹 공격 · 우클릭·K 대시) · 나무·벽은 막히고 물은 탄만 넘어감 · 다 잡으면 다시 걸어 다님 · 판 끝에서 1초 동안 밀면 도망 · 다른 사냥터는 아직 예전 방식"],
      en: ["World Map (testing) new field combat trial: at the Ascalon slime grounds, when monsters chase you the map around you becomes the battlefield without changing screens (glowing border) · Fight exactly like the dungeon with your weapon, skills (1-4), dash, effects, damage numbers and equipped trinkets (hold left click to attack · right click / K to dash) · Trees and walls block, water lets only shots through · Defeat them all to walk again · Push against the edge for 1 second to flee · Other hunting grounds still use the old style"],
      ja: ["世界地図（テスト中）新しいフィールド戦闘のテスト：アスカロンのスライム狩り場では、モンスターに追われると画面が切り替わらずに周りの地図がそのまま戦場になる（光る枠）・ダンジョンと同じく武器・スキル（1〜4）・ダッシュ・エフェクト・ダメージ数字・装着中の装身具で戦う（左クリック長押しで攻撃・右クリック・Kでダッシュ）・木や壁はふさがり、水は弾だけ通る・全部倒すとまた歩ける・端で1秒押し続けると逃げる・ほかの狩り場はまだ前の方式"],
    },
  },
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
];
