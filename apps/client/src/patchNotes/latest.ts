import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
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
