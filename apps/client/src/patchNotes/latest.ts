import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.254",
    date: "2026-10-30",
    items: {
      ko: [
        "로그 화면: 맵 좌우에 칸을 두고 맵은 그 사이를 꽉 채움 · 왼쪽 칸은 능력치 · '캐릭터 설명' 버튼 · 버프 창 (켜진 버프와 대기 시간·남은 초)",
        "캐릭터 설명 큰 창 (버튼 또는 I): 게임이 멈추고 왼쪽에 설명·모든 무기·전용 아이템(누르면 들어 봄), 오른쪽에 직접 움직이는 작은 연습장 · Esc·I로 닫음",
        "아티팩터 제작대·추적자 튜닝소 창: Esc로도 닫힘",
        "기간토마키아: 폭탄 피해 45",
      ],
      en: [
        "Dungeon screen: side columns next to the map, which now fills the space between · left column: stats, a 'Character guide' button and a buff panel (active buffs and cooldowns with seconds left)",
        "Character guide window (button or I): pauses the game; the left shows the guide, every weapon and exclusive item (click to try), the right is a small practice room you control · close with Esc or I",
        "Artifacter's workbench and Tracker's tuning shop windows now also close with Esc",
        "Gigantomachia: bombs deal 45 damage",
      ],
      ja: [
        "ローグ画面: マップの左右に欄を置き、マップはその間いっぱいに · 左欄は能力値・「キャラクター説明」ボタン・バフ欄（発動中のバフと待機時間・残り秒）",
        "キャラクター説明の大きなウィンドウ（ボタンかI）: ゲームが止まり、左に説明・全武器・専用アイテム（押すと装備）、右に自分で動かす小さな練習場 · Esc・Iで閉じる",
        "アーティファクターの作業台・追跡者のチューニング所ウィンドウ: Escでも閉じる",
        "ギガントマキア: 爆弾ダメージ45",
      ],
    },
  },
  {
    version: "0.48.253",
    date: "2026-10-30",
    items: {
      ko: [
        "쟁탈전: 병사가 쓰러지면 막타를 못 친 근처 같은 편도 병사 돈의 40%를 받음 (한 줄 길이라 여럿이 같이 성장)",
        "전쟁의 서막 큰 보스: 파멸의 용은 10분, 갓이터는 15분부터 나옴 · 파멸의 용 = 잡은 편 모두 공격력·공격 속도 영구 상승 (쓰러져도 남음, 4번까지 쌓임) · 갓이터 = 살아 있는 사람에게 2분 30초 공격력·받는 피해 감소·재생 (쓰러지면 끝) · 잡으면 화면 위 알림, 강화·나오기까지 남은 시간 표시",
        "전쟁의 서막 정글: 몬스터 자리 8 → 14 (위·아래 안개에도) · 자리마다 담을 둘러 꾸밈 (네 방향 입구) · 정글 몬스터는 조금 약하게, 경험치·돈은 더",
        "전쟁의 서막 AI: 편마다 위 1·가운데 1·아래 2·정글 1로 나뉘어 병사를 잡으며 상대와 싸움 (병사 없이 상대 포탑 밑엔 안 들어감) · 가운데는 가끔 다른 길·정글을 도우러 감 · 정글은 몬스터를 돌며 크고, 다 잡으면 돕거나 장보기 · 체력이 낮거나 돈이 쌓이면 상대 없는 곳에서 귀환 · 10분 뒤엔 함께 싸우며 포탑 부수기, 큰 보스도 노림",
      ],
      en: [
        "Divine Contest: when a minion dies, nearby allies who didn't land the last hit also get 40% of its gold (one lane, so the team grows together)",
        "Prelude to War bosses: the Dragon of Ruin appears at 10 minutes and the God Eater at 15 · Dragon = permanent damage & attack speed for the whole team (kept on death, stacks up to 4) · God Eater = 2:30 of damage, damage reduction and regen for everyone alive (lost on death) · a banner announces the kill, and your buffs and spawn timers are shown",
        "Prelude to War jungle: camps go from 8 to 14 (also in the top and bottom fog) · each camp is walled in with four entrances · jungle monsters are a little weaker but give more XP and gold",
        "Prelude to War AI: each team splits top 1 · mid 1 · bot 2 · jungle 1, farming minions and fighting rivals (no tower diving without minions) · mid sometimes roams to help another lane or the jungle · the jungler clears camps, then helps or goes shopping · bots recall somewhere safe when low or carrying lots of gold · after 10 minutes they group up to fight and push towers, and go for the big bosses",
      ],
      ja: [
        "争奪戦: 兵士が倒れると、ラストヒットしなかった近くの味方も兵士のお金の40%をもらう（一本道なのでみんなで成長）",
        "戦争の序幕の大ボス: 破滅の竜は10分、ゴッドイーターは15分から出現 · 破滅の竜 = 倒したチーム全員の攻撃力・攻撃速度が永続アップ（倒れても残る、4回まで累積）· ゴッドイーター = 生きている人に2分30秒、攻撃力・被ダメ減少・再生（倒れると終了）· 倒すと画面上に通知、強化・出現までの残り時間を表示",
        "戦争の序幕のジャングル: モンスターの場所 8 → 14（上・下の霧にも）· 場所ごとに壁で囲んで装飾（四方に入口）· ジャングルモンスターは少し弱く、経験値・お金は多めに",
        "戦争の序幕のAI: チームごとに上1・中央1・下2・ジャングル1に分かれ、兵士を倒しながら相手と戦う（兵士なしで相手の砲塔の下には入らない）· 中央は時々ほかのレーン・ジャングルを助けに行く · ジャングルはモンスターを回って成長し、狩り終えたら助けるか買い物 · 体力が低い・お金がたまったら相手のいない所で帰還 · 10分後は一緒に戦って砲塔を壊し、大ボスも狙う",
      ],
    },
  },
  {
    version: "0.48.252",
    date: "2026-10-30",
    items: {
      ko: ["Tab 점수판 장비에 마우스를 올리면 창이 흔들리고 스크롤이 생겼다 없어지던 문제 (설명 창이 점수판 안에 붙어 크기를 바꿈)", "쟁탈전 가운데 점령지: 처음 점령만 상대 포탑 둘을 부숴야 하고, 그 뒤로는 서로 계속 빼앗을 수 있음 · 주인 편만 서 있으면 상대가 쌓던 점령도가 줄어듦 · AI도 빼앗기면 먼저 되찾으러 감", "상점에서 아래쪽 전설 장비를 누르면 재료 창이 맨 위에 떠서 스크롤을 올려야 보이던 문제 → 보고 있는 화면 가운데에"],
      en: ["Hovering gear on the Tab scoreboard made it shake and its scrollbar flicker (the tooltip was attached inside the board); fixed", "Divine Contest center: only the first capture needs both enemy towers down — after that it can be stolen back and forth · if only the owner stands in it, the other team's progress drains · AI rushes to retake it when lost", "In the shop, clicking legendary gear further down opened its recipe window at the very top; it now appears in the middle of the screen you're looking at"],
      ja: ["Tabスコアボードの装備にマウスを乗せるとウィンドウが揺れ、スクロールバーが出たり消えたりした問題（説明がボード内に付いて大きさが変わっていた）", "争奪戦の中央: 最初の占領だけ相手の砲塔2つを壊す必要があり、その後は何度でも奪い合える · 持ち主チームだけが立っていると相手の占領度が減る · AIも奪われたら先に奪い返しに行く", "ショップで下の方の伝説装備を押すと素材ウィンドウが一番上に出てスクロールを戻す必要があった問題 → 見ている画面の中央に"],
    },
  },
  {
    version: "0.48.251",
    date: "2026-10-30",
    items: {
      ko: ["패왕전 1대1·토너먼트 경기장 1.5배로 넓게 (모양은 그대로)", "패왕전 모든 대결에서 화면 줄이기(0.75배로 시작, 0.6배까지)·끌어 보기", "집 상점 추천 장비: 역할군마다 후보 여섯 중 아직 안 가진 셋을 보여 줌 (산 장비·금기된 아티팩트를 이미 가졌으면 다른 아티팩트는 빠짐)"],
      en: ["Champion Clash 1v1 and Tournament arenas are 1.5× larger (same layouts)", "Every Champion Clash mode now has the zoomed-out view (starts at 0.75×, down to 0.6×) and view dragging", "Home shop recommendations: three gear you don't own yet, picked from six per role (gear you bought — and other forbidden artifacts once you have one — drop out)"],
      ja: ["覇王戦1対1・トーナメントの闘技場を1.5倍に（形はそのまま）", "覇王戦の全対戦で画面縮小（0.75倍で開始、0.6倍まで）・画面ドラッグ", "拠点ショップのおすすめ装備: 役割ごとの候補6つから、まだ持っていない3つを表示（買った装備・禁じられたアーティファクトを持っていれば他のアーティファクトは除外）"],
    },
  },
  {
    version: "0.48.250",
    date: "2026-10-30",
    items: {
      ko: ["점령전도 화면 줄이기(0.75배로 시작, 0.6배까지)·끌어 보기 · 패왕전 결과 창을 가로로 넓혀 점수판이 옆으로 스크롤되지 않게"],
      en: ["Capture also gets the zoomed-out view (starts at 0.75×, down to 0.6×) and view dragging · the Champion Clash result window is wider so the scoreboard no longer scrolls sideways"],
      ja: ["占領戦も画面縮小（0.75倍で開始、0.6倍まで）・画面ドラッグ · 覇王戦の結果ウィンドウを横に広げ、スコアボードが横スクロールしないように"],
    },
  },
];
