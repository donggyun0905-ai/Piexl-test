// 화면 글자: 숨은 시련 (4층부터 층마다 보통 방 하나에 몰래 · render/roomNotice 알림)
type L = { ko: string; en: string; ja: string };
const l = (ko: string, en: string, ja: string): L => ({ ko, en, ja });

export const HIDDEN_TRIAL_TEXT = {
  hiddenName_1: l("숨은 시련: 우거진 하이오크 부락", "Hidden Trial: Overgrown High Orc Village", "隠れた試練：生い茂るハイオークの集落"),
  hiddenName_2: l("숨은 시련: 어둠의 세계", "Hidden Trial: World of Darkness", "隠れた試練：闇の世界"),
  hiddenName_3: l("숨은 시련: 공성전", "Hidden Trial: Siege", "隠れた試練：攻城戦"),
  hiddenName_4: l("숨은 시련: 안개숲", "Hidden Trial: Misty Forest", "隠れた試練：霧の森"),
  hiddenName_5: l("숨은 시련: 죽음의 바다", "Hidden Trial: Sea of Death", "隠れた試練：死の海"),
  hiddenHint_1: l("더 세진 하이오크 3라운드 · 마지막은 정예", "3 rounds of stronger high orcs · elites last", "強化ハイオーク3ラウンド・最後は精鋭"),
  hiddenHint_2: l("사거리가 단검만큼 · 그림자 3라운드 · 가끔 어둠이 걷힘", "Range shrinks to a dagger's · 3 rounds of shadows · darkness lifts at times", "射程が短剣ほどに・影3ラウンド・時々闇が晴れる"),
  hiddenHint_3: l("아래 성벽 → 포격수, 위 성벽 → 궁병이 무너짐", "Lower wall fells the gunners, upper wall the archers", "下の城壁で砲撃手、上の城壁で弓兵が崩れる"),
  hiddenHint_4: l("독가스 살포기를 부수면 3초 뒤 안개가 걷힘", "Break the gas sprayers and the fog clears in 3s", "毒ガス散布機を壊すと3秒後に霧が晴れる"),
  hiddenHint_5: l("숨 10초 · 몬스터를 잡으면 생기는 비눗방울로 숨을 채우기", "10s of breath · refill in bubbles left by slain monsters", "息は10秒・倒した敵が残す泡で息を補給"),
  hiddenRound: l("라운드 {n}", "Round {n}", "ラウンド {n}"),
  hiddenLast_1: l("정예 하이오크 · 공격이 빠름", "Elite high orcs · faster attacks", "精鋭ハイオーク・攻撃が速い"),
  hiddenLast_2: l("그림자의 한 방이 아주 셈", "The shadows hit very hard", "影の一撃がとても強い"),
  hidden_wall1: l("아래 성벽 붕괴! 포격수가 무너짐", "Lower wall down! The gunners fall", "下の城壁崩壊！砲撃手が崩れる"),
  hidden_wall2: l("위 성벽 붕괴! 궁병이 무너짐", "Upper wall down! The archers fall", "上の城壁崩壊！弓兵が崩れる"),
  hidden_spray: l("살포기 파괴! 3초 뒤 안개가 걷힘", "Sprayers destroyed! Fog clears in 3s", "散布機破壊！3秒後に霧が晴れる"),
  hidden_gasOff: l("안개가 걷혔습니다", "The fog has lifted", "霧が晴れました"),
  hidden_ship: l("해적선 출현!", "A pirate ship appears!", "海賊船出現！"),
  hidden_shipDown: l("해적선 침몰! 선장이 내려옴", "Ship sunk! The captain comes down", "海賊船撃沈！船長が降りてくる"),
  hidden_clear: l("숨은 시련 돌파!", "Hidden trial cleared!", "隠れた試練突破！"),
  hiddenClearSub: l("패시브 셋 중 하나를 고르세요", "Choose one of three passives", "パッシブ3つから1つを選んでください"),
};
