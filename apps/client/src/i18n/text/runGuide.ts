// 화면 글자: 처음 하는 사람 안내 (game/RunGuide: 지금 할 일 한 줄 · 처음 만난 방 카드 · 새 방이 열리기까지)
type L = { ko: string; en: string; ja: string };
const l = (ko: string, en: string, ja: string): L => ({ ko, en, ja });

export const RUN_GUIDE_TEXT = {
  goalClear: l("방 안의 적을 모두 처치하세요", "Defeat every enemy in the room", "部屋の敵をすべて倒そう"),
  goalBoss: l("보스를 쓰러뜨리세요", "Defeat the boss", "ボスを倒そう"),
  goalStairs: l("계단으로 내려가 다음 층으로", "Take the stairs to the next floor", "階段で次の階へ"),
  goalExit: l("문으로 가서 다음 방을 고르세요 (문 아래 그림 = 다음 방)", "Walk to a door to pick the next room (icon under a door = next room)", "扉へ行って次の部屋を選ぼう（扉の下の絵 = 次の部屋）"),
  goalShop: l("필요한 것을 사거나(F) 그냥 문으로", "Buy what you need (F) or just head for a door", "必要な物を買う（F）か、そのまま扉へ"),
  goalTreasure: l("보물을 줍고 문으로", "Grab the treasure, then head for a door", "宝を拾って扉へ"),
  goalGolden: l("선물 중 하나를 고르세요", "Pick one of the gifts", "贈り物を1つ選ぼう"),
  goalRest: l("쉬어 가는 방 · 준비되면 문으로", "A resting room · head for a door when ready", "休憩の部屋 · 準備ができたら扉へ"),
  goalSpecial: l("특별한 방: 안내 카드를 읽고 F로 해 보거나, 그냥 문으로 나가도 돼요", "Special room: read the card and try it with F, or simply leave by a door", "特別な部屋：案内カードを読んでFで試すか、そのまま扉から出てもOK"),
  newRoom: l("새로운 방!", "New room!", "新しい部屋！"),
  newRoomMore: l("자세히 (O)", "Details (O)", "詳しく (O)"),
  newRoomClose: l("알겠어요", "Got it", "わかった"),
  introNext: l("판을 끝낼 때마다 새로운 방이 열려요 · 다음: {room} ({n}판 뒤)", "A new room unlocks each time you finish a run · next: {room} (in {n} runs)", "1回遊び終えるたびに新しい部屋が開くよ · 次: {room}（あと{n}回）"),
  introSecret: l("비밀의 방·차원의 순례자", "Secret rooms & the Pilgrim", "秘密の部屋・次元の巡礼者"),
  roleAtk: l("공격", "Attack", "攻撃"),
  roleDef: l("방어", "Defense", "防御"),
  roleMove: l("이동", "Move", "移動"),
  roleSpecial: l("특수", "Special", "特殊"),
  roleUtil: l("보조", "Utility", "補助"),
  csDiff: l("난이도", "Difficulty", "難易度"),
  csRecommend: l("추천", "Easy pick", "おすすめ"),
  simpleView: l("간단한 화면 (다른 효과 흐리게)", "Simple view (dim other effects)", "シンプル画面（他のエフェクトを薄く）"),
  glowFx: l("빛 효과 (처치 폭발·불티·탄 빛)", "Glow effects (kill bursts, sparks, shot trails)", "光のエフェクト（撃破の爆発・火花・弾の光）"),
  showGoal: l("지금 할 일 안내", "Show current goal", "今やることを表示"),
};
