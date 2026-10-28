import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.196",
    date: "2026-10-28",
    items: {
      ko: [
        "패왕전 점수판(Tab)에 치유량(이 판에 받은 회복) 칸 추가",
        "랭크전 상대를 찾거나 대기실에서 기다리는 동안 미니 게임 8가지를 눌러서 바로 할 수 있음",
        "친구 방 패왕전: 밴픽이 끝나면 랭크전처럼 스킬 설명·작은 연습장 준비방이 저절로 뜨고, 방장은 거기서 대결 시작 (손님은 방장을 기다림, 뒤로 가면 대기실)",
      ],
      en: [
        "Added a Healed column (healing received this match) to the Champion Clash scoreboard (Tab)",
        "While searching for a Ranked match or waiting in its lobby, you can play any of 8 mini games",
        "Champion Clash friend rooms: after the draft, the skill list and small practice area open automatically like Ranked, and the host starts the match from there (guests wait for the host; going back returns to the lobby)",
      ],
      ja: [
        "覇王戦スコアボード (Tab) に回復量 (この試合で受けた回復) の列を追加",
        "ランク戦の相手探し中や待機部屋で待つ間、ミニゲーム8種をすぐに遊べる",
        "友だち部屋の覇王戦: バンピック後、ランク戦のようにスキル説明・小さな練習場の準備画面が自動で開き、部屋主がそこで対決開始 (ゲストは部屋主を待つ、戻ると待機部屋)",
      ],
    },
  },
  {
    version: "0.48.195",
    date: "2026-10-28",
    items: {
      ko: ["패왕전 3판 2선승: 한 판이 끝나면 바로 넘어가지 않고 마지막으로 쓰러진 장면을 3초 동안 그대로 보여 준 뒤(이번 판 승리/패배·받은 피해 정리) 다음 판 준비"],
      en: ["Champion Clash best of 3: when a round ends, the final moments stay on screen for 3 seconds (round result and damage recap) before the next round is set up"],
      ja: ["覇王戦3本中2本先取: ラウンドが終わってもすぐ切り替えず、最後に倒れた場面を3秒そのまま表示 (ラウンド勝敗・受けたダメージのまとめ) してから次のラウンドへ"],
    },
  },
  {
    version: "0.48.194",
    date: "2026-10-28",
    items: {
      ko: ["패왕전 쓰러졌을 때 정리에 받은 피해·준 피해·받은 회복 합 막대 추가 · 함정·용암·가시 피해도 '지형'으로 들어감 · 상대마다 준 피해 · '막대만' 버튼으로 막대만 보이게 바꾸고 기억함"],
      en: ["The Champion Clash knockout recap now shows bars for damage taken, damage dealt and healing received · trap, lava and spike damage appears as 'Terrain' · damage dealt to each opponent · the 'Bars only' button switches to a bars-only view and is remembered"],
      ja: ["覇王戦で倒れたときのまとめに受けたダメージ・与えたダメージ・受けた回復の合計バーを追加 · 罠・溶岩・トゲのダメージも「地形」として表示 · 相手ごとの与ダメージ · 「バーだけ」ボタンでバーだけの表示に切り替え・記憶"],
    },
  },
  {
    version: "0.48.193",
    date: "2026-10-28",
    items: {
      ko: ["패왕전 역할군 상성: 전사는 마법사·암살자에게 받는 피해 −30% · 원딜은 전사에게 주는 피해 +30% · 마법사는 암살자에게 +30% · 암살자는 원딜·마법사에게 +30% · 서포터는 회복량 +30% (바로 맞히는 피해만, 역할 이름에 마우스를 올리면 보임)"],
      en: ["Champion Clash role matchups: Warriors take 30% less damage from Mages and Assassins · Marksmen deal 30% more to Warriors · Mages deal 30% more to Assassins · Assassins deal 30% more to Marksmen and Mages · Supports heal 30% more (direct hits only; hover a role name to see it)"],
      ja: ["覇王戦の役割の相性: 戦士は魔法使い・暗殺者から受けるダメージ−30% · 射手は戦士に+30% · 魔法使いは暗殺者に+30% · 暗殺者は射手・魔法使いに+30% · サポーターは回復量+30% (直接ダメージのみ、役割名にマウスを乗せると表示)"],
    },
  },
  {
    version: "0.48.192",
    date: "2026-10-28",
    items: {
      ko: [
        "붐버 기본 공격은 마우스 위치 (자동 조준·유도 없음)",
        "플라이: 신기루(스킬 3)를 쓰면 다음 공격은 꼭 붉은 급습(피해 2배)",
        "연습장 경기장은 늘 장애물 없는 '연습 초원'",
        "패왕전 머리 위 정보: 회복 초록 +숫자 · 보호막 파랑 +숫자 · 내가 받은 피해 빨강 −숫자 · 기절·둔화·속박·침묵 · 공격력↑·피해 감소·속도↑·재생·은신 · 풋내기 버팀!",
        "이펙트 더 다듬음: 큰 빛이 하얗게 뭉개지지 않게 · 예고 원에 도는 점선·눈금, 줄 예고에 흐르는 화살 무늬 · 회오리는 가는 칼날과 잔상 · 그림자는 보랏빛 연기, 피는 핏방울, 기계는 빛나는 회로 불똥, 독은 거품, 잎은 날리는 잎사귀, 충격은 돌 조각, 야수는 휘어진 발톱 자국 · 장판 바닥은 더 맑게",
      ],
      en: [
        "Bomber basic attacks go where your mouse is (no auto-aim or homing)",
        "Fly: after Mirage (skill 3), the next attack is always a red swoop (double damage)",
        "The Training Ground always uses the obstacle-free Practice Meadow",
        "Champion Clash overhead info: heals in green +numbers · shields in blue +numbers · damage you take in red −numbers · Stunned, Slowed, Rooted, Silenced · Attack↑, Guard, Speed↑, Regen, Hidden · Novice Holding on!",
        "More effect polish: big glows no longer wash out to white · circle telegraphs get a spinning dashed ring and ticks, line telegraphs get flowing arrows · spins use thin blades with afterimages · shadow is violet smoke, blood is droplets, machines are glowing circuit sparks, poison is bubbles, leaves flutter, impacts throw rock chips, beasts leave curved claw marks · clearer ground fields",
      ],
      ja: [
        "ボマーの通常攻撃はマウスの位置 (自動照準・誘導なし)",
        "フライ: 蜃気楼(スキル3)を使うと次の攻撃は必ず赤い急襲(ダメージ2倍)",
        "練習場は常に障害物のない「練習の草原」",
        "覇王戦の頭上の情報: 回復 緑 +数字 · シールド 青 +数字 · 自分が受けたダメージ 赤 −数字 · 気絶・鈍化・拘束・沈黙 · 攻撃力↑・被ダメ減・速度↑・再生・隠密 · 見習い 踏ん張り!",
        "エフェクトをさらに調整: 大きな光が白く潰れないように · 円の予告に回る点線と目盛り、線の予告に流れる矢印 · 回転は細い刃と残像 · 影は紫の煙、血は血しぶき、機械は光る回路の火花、毒は泡、葉は舞う葉、衝撃は石の破片、獣は曲がった爪痕 · フィールドの床をより澄んだ色に",
      ],
    },
  },
  {
    version: "0.48.191",
    date: "2026-10-28",
    items: {
      ko: ["패왕전에서 쓰러지면 아래쪽에 받은 피해 정리: 때린 사람마다 합(막대)과 무엇으로 맞았는지(평타·스킬 이름·소환·지속 피해), 가장 아팠던 한 방 · 다시 나오거나 다음 판이 되면 지워짐"],
      en: ["When knocked out in Champion Clash, a damage recap appears at the bottom: total from each attacker (with a bar), what hit you (basic attack, skill names, summons, damage over time) and the biggest single hit · cleared when you return or the next round starts"],
      ja: ["覇王戦で倒れると下に受けたダメージのまとめ: 攻撃した人ごとの合計 (バー) と何で受けたか (通常攻撃・スキル名・召喚・継続ダメージ)、一番痛かった一撃 · 復帰か次のラウンドで消える"],
    },
  },
  {
    version: "0.48.191",
    date: "2026-10-28",
    items: {
      ko: ["패왕전 스킬 이펙트를 새로 다듬음: 겹치면 밝아지는 빛 · 흰 섬광과 두 겹 충격파 · 꼬리 달린 불똥 · 하늘에서 떨어지는 운석 · 끝이 가는 초승달 베기 · 흰 속이 빛나는 빛줄기 · 도는 바닥 문양(장판·회복·오라·소환) · 또렷한 예고(터지기 직전 깜빡임) · 불씨·별빛처럼 부드러운 캐릭터 느낌 · 그림이 조금 더 오래 남음"],
      en: ["Reworked Champion Clash skill effects: light that brightens where it overlaps · white flashes and double shockwaves · sparks with trails · meteors falling from the sky · tapered crescent slashes · beams with a glowing white core · rotating ground runes (fields, heals, auras, summons) · crisp telegraphs that blink right before they hit · softer character flavors like embers and starlight · effects linger a little longer"],
      ja: ["覇王戦スキルエフェクトを作り直し: 重なると明るくなる光 · 白い閃光と二重の衝撃波 · 尾を引く火花 · 空から落ちる隕石 · 先細りの三日月斬り · 白い芯が光るビーム · 回る地面の紋様(フィールド・回復・オーラ・召喚) · はっきりした予告(当たる直前に点滅) · 火の粉・星明かりのような柔らかいキャラの雰囲気 · エフェクトが少し長く残る"],
    },
  },
  {
    version: "0.48.190",
    date: "2026-10-28",
    items: {
      ko: [
        "좌클릭(공격)을 누른 채 우클릭하면 공격하면서 대시 · 게임 중 우클릭에 브라우저 메뉴(뒤로·새로고침)가 뜨지 않음",
        "패왕전 랭크전: 밴픽이 끝나면 혼자 하기처럼 스킬 설명과 오른쪽 작은 연습장이 있는 준비 화면을 보다가 저절로 시작 (약 15초)",
        "패왕전에서 쓰러져 관전할 때 내 스킨 대기 모션·효과가 보이던 문제 고침",
      ],
      en: [
        "Hold left click (attack) and right-click to dash while attacking · right-click no longer opens the browser menu in game",
        "Champion Clash Ranked: after the draft you get the same prep screen as solo (skill list and a small practice area on the right) before the match starts by itself (about 15s)",
        "Fixed your skin's idle animation and effects showing while spectating after being knocked out in Champion Clash",
      ],
      ja: [
        "左クリック (攻撃) を押したまま右クリックで攻撃しながらダッシュ · ゲーム中の右クリックでブラウザメニュー (戻る・再読み込み) が出ない",
        "覇王戦ランク戦: バンピック後、ソロと同じスキル説明と右の小さな練習場がある準備画面を経て自動で開始 (約15秒)",
        "覇王戦で倒れて観戦中に自分のスキンの待機モーション・効果が表示される問題を修正",
      ],
    },
  },
];
