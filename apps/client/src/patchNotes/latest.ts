import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.186",
    date: "2026-10-28",
    items: {
      ko: [
        "패왕전 수풀: 수풀에 숨으면 상대가 가까이 와야 보임 · AI가 멀리서 자동으로 맞히지 않고, 숨은 걸 알아도 정확한 자리는 몰라 마지막에 본 수풀 쪽으로 가서 때려 봄 (유도탄도 숨은 상대를 따라가지 않음)",
        "패왕전 연습장: 아무 캐릭터나 골라 허수아비 셋에게 스킬을 마음껏 · 허수아비는 가만히·움직이기·싸움 · 스킬 대기 없음 켜고 끄기 · 허수아비·캐릭터 바꾸기 · 쓰러져도 바로 다시 참",
      ],
      en: [
        "Champion Clash bushes: hiding in a bush keeps you unseen until a rival comes close · AI no longer auto-hits you from afar; it knows you went in but not exactly where, so it goes to the bush where it last saw you and attacks there (homing shots no longer follow hidden rivals)",
        "Champion Clash Training Ground: pick any character and try its skills on three dummies · dummies can stand, move or fight · toggle no cooldowns · swap dummies or your character · nobody stays down",
      ],
      ja: [
        "覇王戦の草むら: 草むらに隠れると相手が近づくまで見えない · AIが遠くから自動で当てなくなり、隠れたのは分かっても正確な位置は分からず、最後に見た草むらへ行って攻撃してみる (誘導弾も隠れた相手を追わない)",
        "覇王戦 練習場: 好きなキャラを選び、かかし3体にスキルを自由に · かかしは静止・移動・戦う · クールタイムなしの切り替え · かかし・キャラ変更 · 倒れてもすぐ全回復",
      ],
    },
  },
  {
    version: "0.48.185",
    date: "2026-10-28",
    items: {
      ko: ["패왕전 랭크전에도 밴픽: 상대가 정해지면 판 시작 전에 밴픽 (빈 자리는 AI가 고름) · 다 고르면 바로 시작 · 밴픽 중에는 모두 채팅 가능"],
      en: ["Ranked Champion Clash now has a draft too: once the match is found, teams draft before the battle (AI picks for empty seats) · it starts as soon as everyone has picked · everyone can chat during the draft"],
      ja: ["覇王戦ランク戦にもバンピック: 相手が決まると試合前にバンピック (空き席はAIが選ぶ) · 全員決まるとすぐ開始 · バンピック中は全員チャット可能"],
    },
  },
  {
    version: "0.48.184",
    date: "2026-10-28",
    items: {
      ko: ["패왕전 밴픽 화면을 크게: 왼쪽 우리 편 · 오른쪽 상대 편 · 가운데 큰 캐릭터 그림, 위쪽 전체·아스칼론·테라코어·헬리오스·비르디아 탭과 이름 찾기"],
      en: ["Bigger Champion Clash draft screen: our team on the left, enemies on the right, large character art in the middle with All / Ascalon / Terracore / Helios / Virdia tabs and name search"],
      ja: ["覇王戦バンピック画面を大きく: 左に味方 · 右に相手 · 中央に大きなキャラ絵、上に すべて・アスカロン・テラコア・ヘリオス・ヴィルディア タブと名前検索"],
    },
  },
  {
    version: "0.48.183",
    date: "2026-10-28",
    items: {
      ko: [
        "패왕전 밴픽: 편 대결(1대1·2대2·3대3·5대5·토너먼트)은 시작 전에 편마다 번갈아 캐릭터를 막고(밴, 3명 이상이면 2개씩) 지그재그 차례로 고름 (우리 1 → 상대 2 → 우리 2 …) · 같은 캐릭터는 한 판에 한 번만",
        "차례마다 20초 · 시간이 다하면 밴은 넘어가고 픽은 무작위 · 캐릭터를 누르면 상대가 고른 캐릭터까지 스킬을 볼 수 있음 · 우리 편 AI는 고르면 한마디",
        "혼자 하기와 친구 방 모두 밴픽 (친구 방은 방장이 '밴픽 시작', 편 첫 자리 사람이 밴, 빈 자리는 AI) · 랭크전은 지금처럼",
      ],
      en: [
        "Champion Clash draft: team battles (1v1, 2v2, 3v3, 5v5, Tournament) now start with teams taking turns banning characters (2 each with 3+ per team) and picking in a snake order (us 1 → them 2 → us 2 …) · each character only once per match",
        "20 seconds per turn · if time runs out a ban is skipped and a pick is random · tap any character, even an enemy pick, to see its skills · AI allies say a word when they pick",
        "Draft works both solo and in friend rooms (the host presses 'Start draft', the first player of each team bans, empty seats are AI) · ranked stays as before",
      ],
      ja: [
        "覇王戦バンピック: チーム対決(1対1・2対2・3対3・5対5・トーナメント)は開始前にチームが交互にキャラをバン(3人以上なら2つずつ)し、ジグザグ順でピック (味方1 → 相手2 → 味方2 …) · 同じキャラは1戦に1回だけ",
        "1手20秒 · 時間切れはバンなし、ピックはランダム · キャラを押すと相手が選んだキャラもスキルを確認できる · 味方AIは選ぶとひと言",
        "ソロでもフレンド部屋でもバンピック (部屋はホストが「バンピック開始」、チームの最初の人がバン、空き席はAI) · ランク戦は今まで通り",
      ],
    },
  },
  {
    version: "0.48.182",
    date: "2026-10-28",
    items: {
      ko: [
        "패왕전 캐릭터 42명 밸런스: AI끼리 1대1을 수천 판 돌려 승률이 모두 43~56% 안에 들도록 체력·공격력 보정을 다시 맞춤 (스킬 피해도 보정을 따라감)",
        "스킬 효과음: 터짐·운석·번개·화살비·빔·베기·돌진·순간이동·버프·회복·소환·장판마다 소리, 곧 터지는 예고는 짧은 삐",
        "궁극기를 쓰면 위쪽 가운데에 '누가 · 궁극기 이름!'이 뜨고 북과 금관 소리가 남 · 가까우면 화면이 흔들림",
      ],
      en: [
        "Champion Clash balance for all 42 characters: thousands of AI 1v1s were run and HP/attack tuning reset so every win rate falls between 43% and 56% (skill damage now follows the tuning too)",
        "Skill sounds: bursts, meteors, lightning, arrow rain, beams, slashes, dashes, blinks, buffs, heals, summons and fields each have their own sound, and incoming blasts give a short beep",
        "Casting an ultimate shows 'Who · Ultimate name!' at the top center with a drum and brass hit · the screen shakes if you are close",
      ],
      ja: [
        "覇王戦キャラクター42人のバランス: AI同士の1対1を数千戦回し、勝率がすべて43~56%に収まるよう体力・攻撃力の補正を調整 (スキルダメージも補正に従う)",
        "スキル効果音: 爆発・隕石・雷・矢の雨・ビーム・斬撃・突進・瞬間移動・バフ・回復・召喚・フィールドごとに音、もうすぐ爆発する予告は短いピッ",
        "奥義を使うと上中央に「誰 · 奥義名!」が表示され太鼓と金管の音 · 近いと画面が揺れる",
      ],
    },
  },
  {
    version: "0.48.181",
    date: "2026-10-28",
    items: {
      ko: [
        "패왕전 스킬 추가: 캐릭터 42명마다 평타 · 패시브(캐릭터 고유 능력) · 스킬 1~4 (4번은 궁극기)",
        "숫자 키 1~4를 누르면 조준 미리보기(범위·모양)가 뜨고 클릭하면 사용 · 설정에서 스킬마다 '바로 사용'과 키 바꾸기 · 모바일은 스킬 칸을 누르면 바라보는 쪽으로 바로 사용",
        "아래쪽 스킬 칸 넷: 남은 대기 시간 · 조준 중 빛남 · 침묵이면 잠김 · 올리면 설명",
        "스킬 효과: 기절(도는 별) · 둔화 · 속박 · 침묵 · 밀치기·끌어오기 · 지속 피해 · 버프 오라 · 소환(포탑·드론·고양이·해골·새끼 용·정령·인형)",
        "패왕전에서는 무기·패시브를 고르지 않음 (시작 무기로 싸우고, 사용 아이템은 경기장에서 주움) · 준비방은 스킬 보기로 바뀜",
        "AI도 스킬을 씀 · 스킬에 맞춰 받는 피해를 조정 (서로 피하지 않고 싸우면 약 10초 안에 끝남)",
      ],
      en: [
        "Champion Clash skills: every one of the 42 characters now has a basic attack, a passive (their own ability) and skills 1-4 (4 is the ultimate)",
        "Press 1-4 to show an aim preview (range and shape), then click to cast · Settings let you turn on quick cast per skill and rebind keys · On mobile, tapping a skill slot casts it toward where you face",
        "Four skill slots at the bottom: cooldown left · glow while aiming · locked when silenced · hover for details",
        "Skill effects: stun (spinning stars) · slow · root · silence · knockback and pull · damage over time · buff auras · summons (turret, drone, cat, skeleton, baby dragon, spirit, doll)",
        "No more weapon or passive picks in Champion Clash (fight with your starting weapon, pick up usable items in the arena) · the prep room now shows your skills",
        "AI uses skills too · damage taken retuned for skills (two players trading without dodging finish in about 10 seconds)",
      ],
      ja: [
        "覇王戦にスキル追加: キャラクター42人それぞれに通常攻撃 · パッシブ (固有能力) · スキル1~4 (4は奥義)",
        "数字キー1~4で照準プレビュー (範囲・形) が出てクリックで使用 · 設定でスキルごとの「すぐ使う」とキー変更 · モバイルはスキル枠をタップすると向いている方向へすぐ使用",
        "下のスキル枠4つ: 残りクールタイム · 照準中は光る · 沈黙中はロック · カーソルを合わせると説明",
        "スキル効果: 気絶 (回る星) · 鈍化 · 拘束 · 沈黙 · ノックバック・引き寄せ · 継続ダメージ · バフオーラ · 召喚 (砲台・ドローン・猫・骸骨・子竜・精霊・人形)",
        "覇王戦では武器・パッシブを選ばない (初期武器で戦い、使用アイテムは闘技場で拾う) · 準備部屋はスキル表示に",
        "AIもスキルを使う · スキルに合わせて受けるダメージを調整 (お互い避けずに戦うと約10秒で決着)",
      ],
    },
  },
];
