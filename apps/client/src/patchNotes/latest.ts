import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
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
