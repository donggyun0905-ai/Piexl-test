// 방 설명 창(game/RoomGuide) 글: 방마다 나오는 곳 · 하는 일 · 확률 · 실패·그냥 나가면 (수치는 게임 계산 값에서 바로 가져옴, 관리자 페이지 값도 따라감)
// 시련·제단은 roomGuide2
import { AUCTION, DEVIL_IDS, DEVIL_PERKS, DEVIL_ROOM, GAMBLE, GOLDEN_PICKS, GYM_RULES, REST_HEAL, SECRET_KINDS, SECRET_WALL, type PracticeRoom } from "@pixel-rogue/shared";
import type { Lang, TextKey } from "./index";
import { itemName } from "./items";
import { pct, pick, roomGuide2, type L } from "./roomGuide2";

function guide(kind: PracticeRoom, lang: Lang): L[] {
  const share = pct(1 / SECRET_KINDS.length);
  switch (kind) {
    case "shop":
      return [
        ["나오는 곳: 층마다 하나 (지도 뒤쪽 절반 칸)", "Where: one per floor (back half of the map)", "出現: 各階に1つ (地図の後ろ半分)"],
        ["패시브·무기·사용 아이템·물약을 돈으로 삼 · 값은 층이 깊을수록 오르고 행운이 높으면 조금 싸짐", "Buy passives, weapons, items and potions · prices rise on deeper floors, luck lowers them a bit", "パッシブ・武器・使用アイテム・薬を買う · 深い階ほど高く、運が高いと少し安い"],
        ["새로고침(돈)으로 진열을 바꿈 · 휴지통에 무기를 버리면 돈 조금", "Reroll (gold) changes the shelf · trash a weapon for a little gold", "更新(お金)で品替え · ゴミ箱に武器を捨てると少しお金"],
        ["그냥 나가도 아무 일 없음", "Leaving does nothing", "そのまま出ても何もない"],
      ];
    case "heaven":
      return [
        ["나오는 곳: 7층(라스트 보스 층) 세 번째 방 — 악마와 거래하지 않았을 때만", "Where: 3rd room of floor 7 (last boss floor) — only if you made no devil deal", "出現: 7階(ラスボス階)の3番目の部屋 — 悪魔と取引していない時だけ"],
        ["상점과 같은 규칙의 천상의 상점", "A heavenly shop with the same rules as a shop", "ショップと同じルールの天上のショップ"],
        ["악마와 한 번이라도 거래했으면 7층은 시작 방 → 단순 상점 → 보스방", "After any devil deal, floor 7 is start → plain shop → boss", "悪魔と一度でも取引すると7階は開始 → 普通のショップ → ボス"],
      ];
    case "golden":
      return [
        ["나오는 곳: 7층 두 번째 방 (악마와 거래하지 않았을 때)", "Where: 2nd room of floor 7 (no devil deal)", "出現: 7階の2番目の部屋 (悪魔と取引していない時)"],
        [`아이템 9개가 공짜로 놓여 있고 그중 ${GOLDEN_PICKS}개만 가질 수 있음`, `9 free items, you may keep ${GOLDEN_PICKS}`, `無料のアイテム9個から${GOLDEN_PICKS}個だけ取れる`],
        [`${GOLDEN_PICKS}개를 다 고르면 나머지는 사라짐`, `Once you take ${GOLDEN_PICKS}, the rest vanish`, `${GOLDEN_PICKS}個取ると残りは消える`],
      ];
    case "treasure":
      return [
        ["나오는 곳: 층마다 하나 (지도 앞쪽 절반 칸)", "Where: one per floor (front half of the map)", "出現: 各階に1つ (地図の前半分)"],
        ["무기 하나 + 사용 아이템 하나가 공짜 (100%) · 금기 '빈 보물'이면 무기만", "One weapon + one item, free (100%) · only the weapon with the 'Empty Treasure' taboo", "武器1つ + 使用アイテム1つが無料 (100%) · 禁忌「空の宝」なら武器だけ"],
      ];
    case "gym":
      return [
        [`나오는 곳: ${GYM_RULES.FROM_FLOOR}층부터 층마다 하나`, `Where: one per floor from floor ${GYM_RULES.FROM_FLOOR}`, `出現: ${GYM_RULES.FROM_FLOOR}階から各階に1つ`],
        ["기구 셋(샌드백·랫풀다운·벤치 프레스) 중 하나만 골라 미니게임 (최대 1000점)", "Pick one of three machines for a minigame (max 1000 pts)", "器具3つから1つ選んでミニゲーム (最大1000点)"],
        [`${GYM_RULES.SCORE_PER_PT}점마다 강화 포인트 1 (최대 ${GYM_RULES.MAX_PTS}) · 항목마다 최대 ${GYM_RULES.MAX_LV}단계`, `1 upgrade point per ${GYM_RULES.SCORE_PER_PT} pts (max ${GYM_RULES.MAX_PTS}) · up to ${GYM_RULES.MAX_LV} levels per stat`, `${GYM_RULES.SCORE_PER_PT}点ごとに強化ポイント1 (最大${GYM_RULES.MAX_PTS}) · 項目ごとに最大${GYM_RULES.MAX_LV}段階`],
        ["점수가 낮아도 잃는 것 없음 · 남은 포인트는 언제든 다시 F로 씀 · 그냥 나가도 됨", "A low score costs nothing · spend leftover points any time with F · you may just leave", "点数が低くても失うものなし · 残りポイントはいつでもFで使う · そのまま出てもよい"],
      ];
    case "rest":
      return [
        ["나오는 곳: 보스 바로 앞 칸에 하나", "Where: the column right before the boss", "出現: ボスのすぐ前の列に1つ"],
        [`들어가면 최대 체력의 ${pct(REST_HEAL)}% 회복`, `Heals ${pct(REST_HEAL)}% of max HP on entry`, `入ると最大体力の${pct(REST_HEAL)}%回復`],
      ];
    case "crack":
      return [
        [`나오는 곳: 히든 상점(차원의 순례자)이 나오는 판에서, 일반 전투방에 처음 들어갈 때 ${pct(SECRET_WALL.chance)}%로 옆·아래 벽에 금 간 곳`, `Where: in runs with the hidden shop, ${pct(SECRET_WALL.chance)}% when first entering a normal battle room — a crack in a side/bottom wall`, `出現: 隠しショップが出る回で、普通の戦闘部屋に初めて入ると${pct(SECRET_WALL.chance)}%で横・下の壁にひび`],
        [`몸으로 부딪히면 무너지고 문이 열림 → 악마의 방·도박꾼의 방·암흑가 경매장 중 하나 (각 ${share}%)`, `Bump it to break it open → Devil's Room, Gambler's Room or Underworld Auction (${share}% each)`, `体当たりで崩れて扉が開く → 悪魔の部屋・ギャンブラーの部屋・闇街オークションのどれか (各${share}%)`],
        ["비밀의 방에서 나갈 때는 들어온 쪽(아래 가운데)의 빛나는 뒷문 → 원래 방으로 돌아감", "To leave a secret room, use the glowing back door where you came in (bottom center) → back to the original room", "秘密の部屋から出るときは入ってきた側(下の中央)の光る裏口 → 元の部屋に戻る"],
        ["시련의 방 1000점 보상 상자로도 골라 들어감 (히든 상점 포함) · 안 부수고 지나가도 아무 일 없음", "Also selectable from the 1000-pt trial chest (hidden shop too) · ignoring it does nothing", "試練の部屋1000点の報酬箱でも選んで入れる (隠しショップも) · 壊さず通っても何もない"],
      ];
    case "devil":
      return [
        [`비밀의 방 · 방 안이 암흑 · 사탄의 석상 앞에 거래 ${DEVIL_ROOM.offers}개 (악마 패시브 ${DEVIL_IDS.length}개 중 가진 것 빼고 무작위)`, `Secret room · pitch dark · ${DEVIL_ROOM.offers} deals before Satan's statue (random from ${DEVIL_IDS.length} devil passives you don't own)`, `秘密の部屋 · 暗闇 · サタン像の前に取引${DEVIL_ROOM.offers}つ (悪魔パッシブ${DEVIL_IDS.length}種から未所持をランダム)`],
        [`F로 거래 = 최대 체력을 바치고 그 패시브를 얻음 (100%, 여러 번 가능) · 바친 뒤 최대 체력이 ${DEVIL_ROOM.minHp} 미만이면 석상이 거절 · 거래 하나 할 때마다 남은 거래가 최대 체력 ${DEVIL_ROOM.more}씩 더 비싸짐`, `F to deal = pay max HP for the passive (100%, repeatable) · refused if max HP would drop below ${DEVIL_ROOM.minHp} · each deal makes the rest cost ${DEVIL_ROOM.more} more max HP`, `Fで取引 = 最大体力を捧げてパッシブ獲得 (100%、何度でも) · 捧げた後の最大体力が${DEVIL_ROOM.minHp}未満なら拒否 · 取引するたびに残りの取引が最大体力${DEVIL_ROOM.more}ずつ高くなる`],
        ...DEVIL_IDS.map((id): L => {
          const n = `${itemName("passive", id, lang)} −${DEVIL_PERKS[id].cost}`;
          return [`· ${n} 최대 체력`, `· ${n} max HP`, `· ${n} 最大体力`];
        }),
        ["한 번이라도 거래하면 7층이 시작 방 → 단순 상점(산 자리는 다시 안 채움) → 바로 라스트 보스 (여신의 선물·천상의 상점 없음)", "Any deal turns floor 7 into start → plain shop (bought slots stay empty) → last boss (no goddess gift / heavenly shop)", "一度でも取引すると7階は開始 → 普通のショップ(買った所は補充なし) → すぐラスボス (女神の贈り物・天上のショップなし)"],
        ["거래하지 않고 나가면 아무 일 없음", "Leaving without a deal does nothing", "取引せずに出れば何もない"],
      ];
    case "gamble":
      return [
        ["비밀의 방 · 방마다 한 판 · 도박꾼 앞 F → 시작", "Secret room · one game per room · F at the gambler to start", "秘密の部屋 · 部屋ごとに1回 · ギャンブラーの前でF → 開始"],
        [`당첨 상자를 잠깐 보여 준 뒤 덮고 ${GAMBLE.swaps}번 섞음 → 왼쪽·가운데·오른쪽 중 고름`, `Shows the prize cup, covers it and shuffles ${GAMBLE.swaps} times → pick left, middle or right`, `当たりを少し見せて伏せ、${GAMBLE.swaps}回混ぜる → 左・中・右から選ぶ`],
        ["눈으로 따라갈 수 없을 만큼 빨리 섞임 → 당첨 확률 33.3%", "Shuffled too fast to follow → 33.3% to win", "目で追えないほど速く混ざる → 当たり33.3%"],
        [`당첨: 패시브 ${GAMBLE.passives}개 + ${GAMBLE.gold}원 + 원하는 능력치 10% 상자 ${GAMBLE.picks}개`, `Win: ${GAMBLE.passives} passives + ${GAMBLE.gold} gold + ${GAMBLE.picks} chosen-stat +10% chests`, `当たり: パッシブ${GAMBLE.passives}個 + ${GAMBLE.gold}G + 好きな能力値10%箱${GAMBLE.picks}個`],
        [`꽝: 공격력·최대 체력·공격 속도·이동 속도·사거리 중 무작위 ${GAMBLE.lose}개가 ${pct(GAMBLE.down)}%씩 깎임`, `Miss: ${GAMBLE.lose} random stats (damage, max HP, attack speed, move speed, range) drop ${pct(GAMBLE.down)}% each`, `ハズレ: 攻撃力・最大体力・攻撃速度・移動速度・射程からランダム${GAMBLE.lose}つが${pct(GAMBLE.down)}%ずつ減る`],
        ["시작하지 않고 나가면 아무 일 없음", "Leaving without playing does nothing", "始めずに出れば何もない"],
      ];
    case "auction":
      return [
        [`비밀의 방 · 무대 위 상품 ${AUCTION.lots}개 (${AUCTION.hidden + 1}번째부터 ???) · 상품마다 ${pct(AUCTION.augChance)}% 증강 기술, 나머지는 패시브`, `Secret room · ${AUCTION.lots} lots on stage (??? from lot ${AUCTION.hidden + 1}) · each is an augment ${pct(AUCTION.augChance)}%, otherwise a passive`, `秘密の部屋 · 舞台に品物${AUCTION.lots}個 (${AUCTION.hidden + 1}番目から???) · 各${pct(AUCTION.augChance)}%で増強技、他はパッシブ`],
        ["상품에 마우스를 올리면 앉기 전에도 설명이 보임 · 맨 앞줄 가운데 내 자리에서 F로 앉으면 시작 (앉아야 입찰) · 다시 F(Esc)로 일어남", "Hover lots to read them before sitting · sit in your front-row seat with F to start (bid only while seated) · F (Esc) to stand", "品物にマウスを乗せると座る前でも説明 · 最前列中央の自分の席でFで座ると開始 (座って入札) · もう一度F(Esc)で立つ"],
        [`숨은 값어치 ${AUCTION.valueMin}~${AUCTION.valueMax}G × (1 + ${pct(AUCTION.perFloor)}% × (층−1)) · 시작가는 그 ${pct(AUCTION.start)}% · 한 번에 +${AUCTION.step}G`, `Hidden worth ${AUCTION.valueMin}–${AUCTION.valueMax}G × (1 + ${pct(AUCTION.perFloor)}% × (floor−1)) · opens at ${pct(AUCTION.start)}% of it · +${AUCTION.step}G per bid`, `隠れた価値 ${AUCTION.valueMin}~${AUCTION.valueMax}G × (1 + ${pct(AUCTION.perFloor)}% × (階−1)) · 開始価格はその${pct(AUCTION.start)}% · 1回+${AUCTION.step}G`],
        ["그림자 손님은 숨은 값어치를 넘겨 부르지 않음 → 그보다 한 번 더 부르면 반드시 낙찰", "Shadow guests never bid past the hidden worth → one bid above it always wins", "影の客は隠れた価値を超えて入札しない → それを一度上回れば必ず落札"],
        ["아무도 더 부르지 않으면 하나·둘·셋 → 낙찰 (내가 앞서면 돈을 내고 받음) · 포기하면 손님이 가져감", "If no one bids again: going, going, gone (you pay if you lead) · pass and a guest takes it", "誰も入札しなければ1・2・3 → 落札 (自分がリードなら払って受け取る) · 見送ると客が持っていく"],
        ["증강을 낙찰받으면 가진 패시브 하나에 붙임 (패시브가 없으면 무작위 패시브를 같이 받음) · 앉지 않고 나가도 아무 일 없음", "A won augment is grafted onto one of your passives (you get a random one if you have none) · leaving without sitting does nothing", "増強を落札したら持っているパッシブに付ける (なければランダムのパッシブも) · 座らずに出ても何もない"],
      ];
    default:
      return [];
  }
}

/** 방 설명 줄 (t: 시련 벌칙·성좌 이름 등 다른 화면 글자) */
export function roomGuide(kind: PracticeRoom, lang: Lang, t: (k: TextKey) => string): string[] {
  if (kind === "trial" || kind === "altar") return roomGuide2(kind, lang, t);
  return pick(lang, guide(kind, lang));
}
