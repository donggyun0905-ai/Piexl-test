import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.12.0",
    date: "2026-10-16",
    items: {
      ko: [
        "새 캐릭터 '마법사' 추가: 느린 마법탄이 맞은 자리에서 터져 주변 적에게도 절반 피해를 줍니다. 체력은 낮고 행운이 조금 있습니다",
        "마법사 무기 추가: 시작 무기 '불씨 지팡이', 전용 무기 '폭풍 지팡이' (더 크게 터지지만 느림)",
        "혼자 하기·일일 도전·배틀 모두 마법사를 고를 수 있습니다",
      ],
      en: [
        "New character: Mage. Slow magic bolts burst where they hit, dealing half damage to nearby enemies too. Low health, a little luck",
        "New Mage weapons: starting Ember Staff and exclusive Storm Staff (bigger blast, slower)",
        "The Mage can be chosen in solo, daily challenge and battle",
      ],
      ja: [
        "新キャラクター「魔法使い」を追加：遅い魔法弾が当たった場所で弾け、周りの敵にも半分のダメージ。体力は低く、運が少しあります",
        "魔法使いの武器を追加：初期武器「火種の杖」、専用武器「嵐の杖」（大きく弾けるが遅い）",
        "ソロ・デイリーチャレンジ・バトルのどれでも魔法使いを選べます",
      ],
    },
  },
  {
    version: "0.11.0",
    date: "2026-10-16",
    items: {
      ko: [
        "회원가입·로그인을 없앴습니다. 가입 없이 기기마다 자동으로 구분하고, 일일 도전도 바로 참여할 수 있습니다",
        "기기 연동 추가: 쓰던 기기에서 6자리 코드를 띄우고 새 기기에서 입력하면 닉네임·업적·일일 기록을 같이 씁니다 (코드는 5분, 한 번만)",
        "닉네임이 서버에도 저장되어 연동한 기기끼리 같이 바뀝니다. 타이틀의 '닉네임 · 기기 연동'에서 바꿀 수 있습니다",
        "예전에 가입한 계정 정보는 지워졌습니다",
      ],
      en: [
        "Removed sign-up and log-in. Each device is identified automatically, and anyone can join the daily challenge right away",
        "Added device linking: show a 6-digit code on the device you've been using and enter it on the new one to share your nickname, achievements and daily records (codes last 5 minutes and work once)",
        "Your nickname is now also saved on the server and shared by linked devices. Change it under \"Nickname · Link devices\" on the title screen",
        "Old sign-up account data has been deleted",
      ],
      ja: [
        "会員登録・ログインをなくしました。登録なしで端末ごとに自動で区別し、デイリーチャレンジにもすぐ参加できます",
        "端末連携を追加：使っていた端末で6桁のコードを表示し、新しい端末で入力するとニックネーム・実績・デイリー記録を共有します（コードは5分間・1回のみ）",
        "ニックネームがサーバーにも保存され、連携した端末どうしで共有されます。タイトルの「ニックネーム・端末連携」で変更できます",
        "以前に登録したアカウント情報は削除されました",
      ],
    },
  },
  {
    version: "0.10.0",
    date: "2026-10-15",
    items: {
      ko: [
        "소리·음악 추가: 공격·맞음·처치·돈·구매·계단·보스 등 효과음과 반복 음악 (보스방에서는 빨라짐)",
        "설정 추가 (타이틀·일시정지 창): 효과음·음악 크기, 진동(모바일), 화면 흔들림",
        "맞으면 화면이 살짝 흔들리고 휴대폰이 짧게 진동",
      ],
      en: [
        "Added sound and music: effects for attacks, hits, kills, coins, purchases, stairs, bosses and more, plus looping music (faster in boss rooms)",
        "Added Settings (title and pause screens): sound effect and music volume, vibration (mobile), screen shake",
        "Taking damage now shakes the screen slightly and briefly vibrates your phone",
      ],
      ja: [
        "サウンド・音楽を追加：攻撃・被弾・撃破・コイン・購入・階段・ボスなどの効果音とループ音楽（ボス部屋ではテンポアップ）",
        "設定を追加（タイトル・ポーズ画面）：効果音・音楽の音量、振動（モバイル）、画面の揺れ",
        "ダメージを受けると画面が少し揺れ、スマホが短く振動",
      ],
    },
  },
  {
    version: "0.9.0",
    date: "2026-10-15",
    items: {
      ko: [
        "배틀 열림: 최대 10명이 같은 시드로 각자 플레이하는 레이스. 15분 제한, 점수로 순위 (같은 점수면 먼저 끝낸 사람이 위). 일시정지 없음, 해금 미적용",
        "빠른 매칭(두 명이 모이면 20초 뒤 자동 시작) · 방 만들기(방 코드로 친구 초대, 방장이 시작) · 코드로 들어가기",
        "서로의 화면은 보지 않고 체력·층·방·점수만 주고받음",
        "먼저 끝난 사람(쓰러짐·클리어)은 모든 층 지도에서 각자 위치·체력·남은 시간을 보고, 끝난 사람끼리 채팅 (금칙어 가림)",
        "연결이 끊겨도 1분 안에 돌아오면 이어서, 아니면 기권패",
      ],
      en: [
        "Battle is open: a race for up to 10 players on the same seed, each in their own game. 15-minute limit, ranked by score (ties go to whoever finished first). No pause, no unlocks",
        "Quick match (starts 20 s after a second player joins) · Create room (invite friends with a room code; the host starts) · Join by code",
        "You don't see each other's screens; only HP, floor, room and score are shared",
        "Once you finish (fall or clear), watch everyone's position, HP and the time left on every floor's map, and chat with other finished players (banned words masked)",
        "If you disconnect, come back within a minute to keep playing; otherwise it counts as a forfeit",
      ],
      ja: [
        "バトル開始: 最大10人が同じシードでそれぞれプレイするレース。制限15分、スコアで順位 (同点は先に終えた人が上)。一時停止なし、解放なし",
        "クイックマッチ(2人そろうと20秒後に自動開始)・部屋を作る(部屋コードで友達を招待、ホストが開始)・コードで参加",
        "お互いの画面は見えず、体力・階・部屋・スコアだけをやり取り",
        "先に終わった人(力尽きた・クリア)は全階のマップで全員の位置・体力・残り時間を見て、終わった人同士でチャット (禁止語は伏せ字)",
        "接続が切れても1分以内に戻れば続行、戻らなければ棄権負け",
      ],
    },
  },
  {
    version: "0.8.0",
    date: "2026-10-15",
    items: {
      ko: [
        "일일 도전 열림: 하루 한 시드(오전 9시에 바뀜), 모두 같은 조건(해금 미적용), 캐릭터는 자유. 도전은 몇 번이든, 최고 기록만 순위표(상위 30명)에 올라감. 같은 점수면 먼저 낸 사람이 위",
        "계정(선택): 아이디 + 비밀번호로 가입·로그인. 가입할 때 복구 코드를 한 번 보여 줌 (비밀번호를 잊으면 이 코드로 새로 정함). 일일 도전은 가입해야 참여 가능",
        "가입하면 업적·해금이 서버에도 저장되어 다른 기기에서 불러옴",
        "닉네임: 계정 화면에서 바꿈. 이 기기에만 저장되고 순위표에 함께 올라감. 금칙어는 Player로 바뀜",
        "기록 검사: 모든 기록은 진행 기록으로, 30위 안에 드는 기록은 판 전체를 서버가 다시 돌려 확인",
        "수동 조준 방향 정밀도를 기록에 맞게 조정 (손맛은 같음)",
      ],
      en: [
        "Daily Challenge is open: one seed a day (changes at 9:00 KST), same conditions for everyone (no unlocks), any character. Play as often as you like; only your best goes on the top-30 leaderboard. Ties go to whoever submitted first",
        "Accounts (optional): sign up and log in with an ID and password. A recovery code is shown once at sign-up (use it to set a new password if you forget yours). You need an account to join the daily challenge",
        "With an account, achievements and unlocks are saved on the server and load on other devices",
        "Nickname: change it on the account screen. Kept on this device and shown on the leaderboard. Banned words turn it into Player",
        "Record checks: every record is checked against its progress log, and records that make the top 30 are fully replayed on the server",
        "Manual aiming precision adjusted for recording (feels the same)",
      ],
      ja: [
        "デイリーチャレンジ開始: 1日1シード(午前9時に更新)、全員同じ条件(解放なし)、キャラクターは自由。何回でも挑戦でき、ベストだけがランキング(上位30人)に載る。同点は先に送った人が上",
        "アカウント(任意): IDとパスワードで登録・ログイン。登録時に復旧コードを一度だけ表示 (パスワードを忘れたらこのコードで再設定)。デイリーは登録が必要",
        "登録すると実績・解放がサーバーにも保存され、他の端末でも使える",
        "ニックネーム: アカウント画面で変更。この端末にだけ保存され、ランキングに一緒に載る。禁止語はPlayerに変わる",
        "記録チェック: すべての記録を進行記録で確認し、上位30位に入る記録はサーバーがプレイ全体を再計算して確認",
        "手動照準の精度を記録向けに調整 (操作感は同じ)",
      ],
    },
  },
];
