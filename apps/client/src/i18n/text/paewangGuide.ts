// 화면 글자: 패왕전 대결 방법 안내 (event/PwGuide)
export const PAEWANG_GUIDE_TEXT = {
  pwGuide: { ko: "대결 방법", en: "How to play", ja: "対決の遊び方" },
  pwGuideGoalH: { ko: "목표", en: "Goal", ja: "目標" },
  pwGuideGoal: {
    ko: "1대1·3대3·5대5: 상대 편을 모두 쓰러뜨리면 승리 · 토너먼트: 1대1로 차례로 붙어 상대 편 마지막 사람까지 이기기 · 대난투: 20명 중 끝까지 살아남기 · 데스매치: 처치할 때마다 다음 레벨, 21레벨에서 처치하면 승리 · 점령전: 점령 구역에 우리 편만 있으면 점령도가 올라 100%면 승리 (쓰러지면 집에서 다시, 노랑 버프 자리는 F 누르고 3초 가만히)",
    en: "1v1·3v3·5v5: defeat the whole enemy team · Tournament: win the 1v1 rounds until the last rival falls · Brawl: be the last of 20 standing · Deathmatch: each KO levels you up, a KO at Lv 21 wins · Capture: while only your team holds the zone your capture rises — 100% wins (respawn at home; at a yellow buff spot press F and hold still for 3s)",
    ja: "1対1・3対3・5対5: 相手チームを全員倒せば勝利 · トーナメント: 1対1で順に戦い、相手の最後の一人まで勝つ · 大乱闘: 20人の中で最後まで生き残る · デスマッチ: 倒すたびに次のレベル、レベル21で倒せば勝利 · 占領戦: 区域に味方だけがいると占領度が上がり100%で勝利（倒れると拠点で復活、黄色のバフ地点はFを押して3秒じっと）",
  },
  pwGuideKeysH: { ko: "조작", en: "Controls", ja: "操作" },
  pwGuideKeys: {
    ko: "WASD 이동 · 마우스로 조준하고 왼쪽 클릭으로 평타 (자동 공격 없음) · 1·2·3·4 스킬: 키를 누르면 범위가 보이고 왼쪽 클릭으로 시전, 오른쪽 클릭·Esc 취소 (설정에서 키 바꾸기·바로 사용) · 4번은 궁극기 · 오른쪽 클릭 대시 · Q·E 사용 아이템 · Tab 점수판 · G 공격 범위 표시 · 화면: 마우스 휠로 확대·축소, 휠 버튼을 누른 채 끌면 화면 옮기기 (휠 버튼 한 번 또는 '내 캐릭터로' 버튼으로 돌아옴), 모바일은 오른쪽 두 손가락으로 확대·축소·끌기 · 모바일은 왼쪽 조이스틱 이동, 오른쪽 조이스틱 조준·공격, 아래 스킬 칸을 누르면 바로 시전",
    en: "WASD to move · aim with the mouse, left-click for basic attacks (no auto attack) · skills 1·2·3·4: press the key to see the area, left-click to cast, right-click or Esc to cancel (rebind keys and quick cast in Settings) · 4 is the ultimate · right-click to dash · Q/E consumables · Tab scoreboard · G attack range · view: mouse wheel zooms, hold the wheel button and drag to move the view (click the wheel button or 'Back to me' to return), on mobile use two fingers on the right to zoom and drag · on mobile, left stick moves, right stick aims and attacks, and tapping a skill slot casts it",
    ja: "WASDで移動 · マウスで狙って左クリックで通常攻撃 (自動攻撃なし) · スキル1・2・3・4: キーを押すと範囲が見え、左クリックで発動、右クリック・Escで取消 (設定でキー変更・即時使用) · 4は奥義 · 右クリックでダッシュ · Q・Eで使用アイテム · Tabでスコアボード · Gで攻撃範囲 · 画面: マウスホイールで拡大・縮小、ホイールボタンを押したままドラッグで画面移動（ホイールボタン1回か「自分のキャラへ」ボタンで戻る）、モバイルは右側を2本指で拡大・縮小・ドラッグ · モバイルは左スティックで移動、右スティックで狙って攻撃、下のスキル枠を押すとすぐ発動",
  },
  pwGuideSeeH: { ko: "화면 보기", en: "Reading the screen", ja: "画面の見方" },
  pwGuideSee: {
    ko: "내 체력 줄은 초록 · 내 편은 파란 테두리, 상대는 빨간 테두리 · 내 몸 둘레의 빨간 화살표가 가장 가까운 적을 가리키고, 그 적에게 빨간 조준 표시 · 위쪽에 편마다 처치 수와 남은 사람, 내 처치·준 피해·받은 피해 · 시작하면 3초 동안 준비 (아무도 못 움직임)",
    en: "Your HP bar is green · allies have blue outlines, rivals red · the red arrow around you points to the nearest rival, who gets a red target mark · the top shows team KOs, who is left, and your KOs, damage dealt and taken · each match starts with a 3-second ready (no one can move)",
    ja: "自分の体力バーは緑 · 味方は青い輪郭、相手は赤い輪郭 · 自分の周りの赤い矢印が一番近い敵を指し、その敵に赤い照準 · 上にチームごとの撃破数と残り人数、自分の撃破・与ダメ・被ダメ · 開始時は3秒準備 (誰も動けない)",
  },
  pwGuideFieldH: { ko: "경기장", en: "The arena", ja: "闘技場" },
  pwGuideField: {
    ko: "바닥에 사용 아이템(회복약·폭탄·수호 부적·얼음 시계)과 강화 구슬이 떨어짐: 초록 회복 · 주황 공격 속도 · 하늘색 이동 속도 · 얼음 시계는 누른 곳으로 던져 범위 안 상대를 얼림 · 수풀에 숨으면 상대에게 보이지 않음 (아주 가까이 오면 보임) · 숲의 가시 함정 조심",
    en: "Consumables (potion, bomb, ward, frost clock) and power orbs drop on the floor: green heals · orange attack speed · sky blue move speed · the frost clock is thrown where you aim and freezes rivals in range · hide in bushes to vanish from rivals (unless they come very close) · watch out for spike traps in the forest",
    ja: "床に使用アイテム (回復薬・爆弾・守りの札・氷の時計) と強化オーブが落ちる: 緑は回復 · オレンジは攻撃速度 · 水色は移動速度 · 氷の時計は狙った所に投げて範囲内の相手を凍らせる · 茂みに隠れると相手から見えない (すぐ近くなら見える) · 森のトゲの罠に注意",
  },
  pwGuideTipH: { ko: "요령", en: "Tips", ja: "コツ" },
  pwGuideTip: {
    ko: "맞으면 무적 없이 계속 맞으니 멈춰 서서 맞지 말고 움직이며 피하기 · 대시로 탄을 넘기 · 편 대결은 같이 몰려 한 명씩 집중 공격 · 체력이 낮으면 수풀로 빠져 회복 구슬 찾기",
    en: "There is no invincibility after a hit, so keep moving instead of trading blows · dash through shots · in team battles, group up and focus one rival at a time · when low, slip into a bush and look for a healing orb",
    ja: "被弾後の無敵がないので、立ち止まらず動いて避ける · ダッシュで弾をくぐる · チーム戦はまとまって一人ずつ集中攻撃 · 体力が低いときは茂みに逃げて回復オーブを探す",
  },
};
