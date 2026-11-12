// 티어표 이유: 실베르 빙설·아수라·혼령·백인장·아리아 (한·영·일, dawn.ts가 커서 나눔)
import type { CharacterId } from "@pixel-rogue/shared";

type Reasons = Partial<Record<CharacterId, string>>;

export const TIER_KO_SILBER: Reasons = {
  chessRaven: "실베르의 체스 왕국 창기사. 킹 내려찍기와 퀸 빛기둥을 번갈아 쓰며 체크 → 체크메이트로 한 적을 크게 깎음. 처음엔 평범하지만 확률 기물 공격 8종이 모이면 폰·나이트·비숍·룩·퀸·킹이 방을 휩쓸고, 숫자 키 스킬 넷(체스판·체크메이트·캐슬링·그랜드 체크메이트)이 열릴수록 강해짐 (새 캐릭터, 평가 전)",
  aria: "실베르의 지휘자 소녀. 음표는 느리게 둥실거리며 방 끝까지 가서 적을 뚫지만 한 발은 약함. 서로 다른 음표 8개가 모일 때마다 8색으로 크게 터지고, 피아노·하프·호른·클라리넷이 다 놓이면 악보 완성으로 10초 동안 방 전체가 폭죽으로 덮임. 악기가 갖춰지기 전까지는 버티기 힘듦.",
  baekinjang: "실베르의 기계 날개 기사. 쌍검 기본 공격은 평범하지만 미니 창 드론 5기가 늘 알아서 적을 찔러 처음부터 안정적. 콤보 패시브 셋이 모이면 난무·회전참·돌진베기가 이어지고, 확률 원거리 기술과 숫자 키 스킬 넷(표식·감옥·팔연참·궁극기)이 열릴수록 방 전체를 쓸어 담음 (새 캐릭터, 아직 순위 없음)",
  honryeong: "실베르의 곰방대 연기로 싸우는 여인. 공격할수록 방에 연기 구름이 깔려 그 안에서 은신하면 적이 정확히 겨누지 못해 잘 버팀. 처음엔 연기용 하나뿐이라 약하지만 혼령 늑대·범·부엉이·분신이 쌓이고 혼령사냥을 먹으면 은신한 채 소환수로 사냥함. 혼-룡은 방 전체를 60번 때림.",
  asura: "실베르의 귀신 주먹 싸움꾼. 맨손 하나로 앞을 넓게 치지만 처음엔 피해가 약함. 분쇄·악귀로 한 대가 여러 번 터지고 연발·파동·육비 난무가 쌓인 뒤, 필살기 아수라 각성으로 바닥 연속 강타와 4타 기절이 이어지면 방 하나를 통째로 두들김 (새 캐릭터, 아직 평가 전)",
  bingseol: "실베르의 얼음을 다루는 해군 소녀. 몸 둘레 얼음 영역이 가까이 온 적을 늘 느리게 해 버티기 쉽고 무기 10개로 베기·찌르기·던지기를 고를 수 있지만, 처음엔 피해가 약함. 얼음가루가 유도·급속 얼음으로 모이고 빙설무장 활·창이 쌓인 뒤 궁극기 빙설창이 맵 끝까지 적마다 60연타를 넣으면 방 하나를 통째로 얼림 (새 캐릭터, 아직 판이 적음)",
};

export const TIER_EN_SILBER: Reasons = {
  chessRaven: "Silber's lancer of the chess kingdom. She alternates the King's slam and the Queen's pillar, turning Check into Checkmate for big single-target damage. Plain at first, but once the eight chance-based piece attacks gather, pawns, knights, bishops, rooks, queens and kings sweep the room, and she grows stronger as the four number-key skills (Board, Checkmate, Castling, Grand Checkmate) unlock (new character, not yet rated)",
  aria: "Silber's young conductor. Her notes float slowly to the room's edge and pierce foes, but each one is weak. Whenever eight different notes gather they burst in eight colors, and once a piano, harp, horn and clarinet are all placed, Score Complete covers the whole room in fireworks for 10s. Hard going until the instruments are in place.",
  baekinjang: "Silber's mech-winged knight. The twin-blade basic attack is plain, but five mini lance drones keep stabbing foes on their own, so she is steady from the start. With all three combo passives the flurry, spin and rush chain together, and as the chance-based ranged skills and four number-key skills (mark, prison, eightfold slash, ultimate) unlock she sweeps whole rooms (new character, not ranked yet)",
  honryeong: "Silber's lady who fights with pipe smoke. Her attacks fill the room with smoke clouds; hiding inside them keeps foes from aiming precisely, so she survives well. She starts weak with only the smoke dragon, but spirit wolves, tiger, owls and shades pile up, and with Spirit Hunt she hunts through her summons while hidden. Spirit: Dragon hits the whole room 60 times.",
  asura: "Silber's spectral-fisted brawler. Bare hands punch a wide area ahead, but early damage is weak. Once Pulverize and Fiend make each hit burst many times and Flurry, Shockwave and Six-Arm Frenzy pile up, the Asura awakening chains ground pounding into a stunning fourth strike and pummels whole rooms (new character, not rated yet)",
  bingseol: "Silber's navy girl of ice. Her frost field always slows nearby foes, so she survives easily, and her 10 weapons let you pick slashes, thrusts or throws, but her early damage is low. Once ice dust fuses into homing and rapid ice, Frost Arms bows and spears pile up, and the Frostsnow Lance ultimate lands 60 hits on every foe to the edge of the map, she freezes whole rooms (new character, few runs so far)",
};

export const TIER_JA_SILBER: Reasons = {
  chessRaven: "シルベルのチェス王国の槍騎士。キングの叩きつけとクイーンの光の柱を交互に使い、チェック→チェックメイトで1体を大きく削る。最初は普通だが確率の駒攻撃8種がそろうとポーン・ナイト・ビショップ・ルーク・クイーン・キングが部屋を席巻し、数字キースキル4つ（盤・チェックメイト・キャスリング・グランドチェックメイト）が開くほど強くなる（新キャラ、評価前）",
  aria: "シルベルの指揮者の少女。音符はゆっくりふわふわと部屋の端まで進み敵を貫くが、一発は弱い。違う音符が8個集まるたびに8色で大きく弾け、ピアノ・ハープ・ホルン・クラリネットがそろうと楽譜完成で10秒間部屋全体が花火で覆われる。楽器がそろうまでは耐えるのが大変。",
  baekinjang: "シルベルの機械翼の騎士。双剣の通常攻撃は普通だが、ミニ槍ドローン5機が常に自動で敵を刺すので最初から安定。コンボのパッシブ3つが揃うと乱舞・回転斬・突進斬りが繋がり、確率発動の遠距離技と数字キースキル4つ（刻印・牢獄・八連斬・究極技）が解放されるほど部屋全体を一掃する（新キャラ、まだ順位なし）",
  honryeong: "シルベルのキセルの煙で戦う女性。攻撃するほど部屋に煙の雲が広がり、その中に隠れると敵が正確に狙えずよく耐える。最初は煙の龍だけで弱いが、魂霊の狼・虎・フクロウ・分身が重なり、魂霊狩りを取ると隠れたまま召喚獣で狩る。魂・龍は部屋全体を60回攻撃する。",
  asura: "シルベルの鬼神の拳の格闘家。素手ひとつで前を広く打つが、最初はダメージが弱い。粉砕・悪鬼で一撃が何度も弾け、連発・波動・六臂乱舞が重なったあと、必殺技・阿修羅覚醒で床の連続強打と4打の気絶が続けば部屋ごと叩きのめす（新キャラクター、まだ評価前）",
  bingseol: "シルベルの氷を操る海軍少女。体の周りの氷の領域が近づいた敵をいつも遅くするので耐えやすく、武器10個で斬る・突く・投げるを選べるが、最初はダメージが弱い。氷の粉が誘導氷・急速氷に集まり、氷雪武装の弓・槍が重なったあと、奥義・氷雪槍がマップの端まで敵ごとに60連打を入れると部屋ひとつを丸ごと凍らせる（新キャラ、まだプレイ数が少ない）",
};
