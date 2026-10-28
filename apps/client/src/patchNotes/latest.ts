import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.170",
    date: "2026-10-28",
    items: {
      ko: [
        "패왕전 랭크전: 1대1 랭크·3대3 랭크 (점수 따로) · 빠른 매칭으로 모르는 사람과 대결 (사람이 모자라면 잠시 뒤 AI가 채움, 이때 점수 변화는 작게)",
        "티어: 흙 · 돌 · 청동 · 은 · 금 · 수정 (각 III → II → I, 100점마다) → 성좌 → 패왕(성좌 중 순위표 10위 안) · 티어마다 다른 로고",
        "패왕전 첫 화면에 내 티어 카드(점수 · 승패 · 승률 · 순위)와 순위표 · 끝나면 점수 변화와 새 티어 · 모두의 화면 결과가 같아야 점수에 반영, 중간에 나가면 패배",
      ],
      en: [
        "Champion Clash Ranked: 1v1 and 3v3 ranked (separate points) · quick matching against strangers (AI fills in after a short wait, with smaller point changes)",
        "Tiers: Clay · Stone · Bronze · Silver · Gold · Crystal (III → II → I, every 100 points) → Constellation → Overlord (top 10 of Constellation) · each tier has its own emblem",
        "Your tier cards (points, W/L, win rate, place) and leaderboards on the Champion Clash screen · point change and new tier after each game · counts only when everyone's screen agrees; leaving counts as a loss",
      ],
      ja: [
        "覇王戦ランク戦: 1対1ランク・3対3ランク（スコア別）· クイックマッチで知らない人と対戦（人数が足りなければ少し待ってAIが入り、その場合の変動は小さめ）",
        "ティア: 土 · 石 · 青銅 · 銀 · 金 · 水晶（各III → II → I、100点ごと）→ 星座 → 覇王（星座のうちランキング10位以内）· ティアごとに違うロゴ",
        "覇王戦の最初の画面に自分のティアカード（スコア・勝敗・勝率・順位）とランキング · 終了後にスコア変動と新ティア · 全員の画面の結果が一致したときだけ反映、途中退出は敗北",
      ],
    },
  },
  {
    version: "0.48.169",
    date: "2026-10-28",
    items: {
      ko: [
        "패왕전 버그 수정: 거인처럼 받는 피해가 줄어드는 캐릭터가 체력 0에 끝없이 가까워지기만 하고 죽지 않던 문제 (넘친 피해도 그대로 들어감)",
        "패왕전: 거인 '고철 수리' 회복이 맞을수록 끝없이 이어지지 않게 패왕전에서만 1/4로 · 베두인 AI가 던진 차크람을 주우러 감",
        "패왕전: 쓰러진 뒤 화면을 누르면 살아 있는 다른 사람(AI·친구)을 차례로 볼 수 있음 · 점수판(Tab)의 무기·패시브·사용 아이템에 마우스를 올리면(모바일은 누르면) 설명",
        "패왕전 한 방 막기: 한 번에 받는 피해는 (최대 체력 + 보호막)의 30%까지 · 오니 히든 무기(명계의 흑뢰봉·극한의 청전)는 패왕전에 나오지 않음 · 화면에 0으로 보이는 체력은 쓰러짐 · 정령사·오리·이드라·서기관 등 보호막 아이템이 시작 보호막을 깎아 버리던 문제 수정",
        "같이 하기 방: 판이 끝나면 방장이 '방으로 돌아가기'로 모두 같은 방 대기실로 · 게임 중에 들어온 사람은 관전하다가 다음 판부터 같이 함",
        "같이 하기 대기실: 캐릭터 고르기를 얼굴 그림 칸 목록으로 (이름 찾기·스크롤·고른 캐릭터 설명) · 참가자 옆에 캐릭터 얼굴과 이름",
      ],
      en: [
        "Champion Clash fix: characters with damage reduction (like the Titan) kept getting closer to 0 HP without ever dying (overkill damage now carries through)",
        "Champion Clash: the Titan's Scrap Repair healing is cut to 1/4 here so it can't loop forever while being hit · Bedouin AI now picks up its thrown chakram",
        "Champion Clash: after you fall, tap the screen to cycle through the other players (AI or friends) still fighting · hover (tap on mobile) weapons, passives and items on the scoreboard (Tab) for descriptions",
        "Champion Clash one-shot guard: damage taken at once is capped at 30% of (max HP + shield) · the Oni's hidden weapons (Netherworld Black Thunder, Azure Frost Lightning) don't appear here · HP that shows as 0 now counts as down · fixed shield items (Spiritist, Duck, Idra, Scribe, etc.) cutting down the starting shield",
        "Play together rooms: when a game ends the host can take everyone 'Back to room' · people who join mid-game watch, then play from the next game",
        "Play together lobby: character picking is now a grid of portraits (search by name, scrolling, description of your pick) · players show their character's face and name",
      ],
      ja: [
        "覇王戦の不具合修正: 巨人のように受けるダメージが減るキャラが体力0に限りなく近づくだけで倒れなかった問題（超過ダメージもそのまま入る）",
        "覇王戦: 巨人の「鉄くず修理」の回復が被弾で無限に続かないよう覇王戦のみ1/4に · ベドウィンAIが投げたチャクラムを拾いに行く",
        "覇王戦: 倒れた後に画面を押すと、生きている他の人（AI・友達）を順番に見られる · スコアボード（Tab）の武器・パッシブ・使用アイテムにマウスを乗せると（モバイルは押すと）説明",
        "覇王戦の一撃対策: 一度に受けるダメージは（最大体力＋シールド）の30%まで · 鬼の隠し武器（冥界の黒雷棒・極寒の青電）は覇王戦に出ない · 画面で0に見える体力は倒れる · 精霊使い・アヒル・イドラ・書記官などのシールドアイテムが開始シールドを削っていた問題を修正",
        "一緒に遊ぶ部屋: ゲームが終わるとホストが「部屋に戻る」で全員同じ部屋の待機室へ · ゲーム中に入った人は観戦し、次のゲームから参加",
        "一緒に遊ぶ待機室: キャラ選択を顔アイコンの一覧に（名前検索・スクロール・選んだキャラの説明）· 参加者の横にキャラの顔と名前",
      ],
    },
  },
  {
    version: "0.48.168",
    date: "2026-10-28",
    items: {
      ko: [
        "패왕전 버그 수정: 맞은 뒤 무적·대시 중인 캐릭터가 공격을 받으면 처치 판정(악의 사도 영혼 등)만 나오고 실제로는 죽지 않던 문제 (이제 무적일 때는 맞지 않음)",
        "패왕전 버그 수정: 폭탄처럼 몸을 바로 때리는 공격과 다른 공격이 같은 순간에 들어오면 다른 공격 피해가 통째로 사라지던 문제",
      ],
      en: [
        "Champion Clash fix: hitting a character who was invulnerable after a hit or dashing counted as a kill (Apostle souls, etc.) without actually killing them (invulnerable characters now can't be hit)",
        "Champion Clash fix: when a direct hit (like a bomb) and other attacks landed at the same moment, the other attacks' damage was lost",
      ],
      ja: [
        "覇王戦の不具合修正: 被弾後の無敵中・ダッシュ中のキャラを攻撃すると撃破判定（悪の使徒の魂など）だけ出て実際には倒れなかった問題（無敵中は当たらなくなりました）",
        "覇王戦の不具合修正: 爆弾のように体を直接打つ攻撃と他の攻撃が同時に当たると、他の攻撃のダメージが消えていた問題",
      ],
    },
  },
  {
    version: "0.48.167",
    date: "2026-10-28",
    items: {
      ko: [
        "잔영: 체력 45 고정 (체력 아이템을 먹어도 늘지 않음)",
        "잔영 그림자: 무적 대신 적 몸에 부딪혀 받는 피해만 막음 (원거리 공격은 맞음)",
        "방랑객 그림: 길게 뻗은 카타나로 새로 그림 (금빛 코등이·감은 손잡이·살짝 휜 칼날) · 공격할 때 치켜듦 → 비스듬히 벰 → 앞으로 그음 · 허리에 긴 칼집 (모든 스킨)",
      ],
      en: [
        "Remnant: HP fixed at 45 (HP items don't raise it)",
        "Remnant shadow: no longer invulnerable — it only blocks contact damage from enemies (ranged attacks still hit)",
        "Wanderer art: redrawn with a long katana (gold guard, wrapped grip, slightly curved blade) · attacks raise it → slash diagonally → cut forward · long scabbard at the hip (all skins)",
      ],
      ja: [
        "残影: 体力45固定（体力アイテムで増えない）",
        "残影の影: 無敵ではなく、敵の体に触れて受けるダメージだけを防ぐ（遠距離攻撃は当たる）",
        "放浪者の絵: 長く伸びた刀で描き直し（金の鍔・巻いた柄・少し反った刀身）· 攻撃時は振りかぶる → 斜めに斬る → 前へ斬り下ろす · 腰に長い鞘（すべてのスキン）",
      ],
    },
  },
];
