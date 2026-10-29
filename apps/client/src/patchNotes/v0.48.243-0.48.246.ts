import type { PatchNote } from "./types";

export const NOTES: PatchNote[] = [
  {
    version: "0.48.246",
    date: "2026-10-30",
    items: {
      ko: [
        "고침: 패왕전에서 영사 출혈 스택이 상한 없이 쌓여 게이지가 넘치던 문제 (가득 차면 그대로 · 다시 태어나면 처음부터) · 새 대결에서 AI가 벽 너머 상대와 싸우느라 점령을 안 하던 문제 (벽 너머는 못 보고, 점령전에서는 싸우면서 구역으로 감)",
        "점수판(Tab): 성장 대결에서 모두의 레벨 · 번 돈 · 산 장비(상대 편도, 마우스를 올리면 능력치) · 증강 고르기를 카드 셋으로 (증강마다 픽셀 그림 12종)",
        "집 상점: 맨 위 역할군별 추천 장비 셋(왜 좋은지 설명) · 전설 장비를 누르면 재료 창 (재료 하나씩 사기 · 한 번에 완성) · 쓰러져 기다리는 동안에도 삼 · Esc로 상점만 닫힘 · 글자·그림 크게 · 영어로 보이던 히든 장비 이름 한글로",
        "쟁탈전·전쟁의 서막(·기간토마키아)은 경기장 고르기 없이 바로 밴픽 · 병사가 캐릭터에게 주는 피해 크게 줄이고(×0.35) 포탑에는 더 세게(×2) · 포탑이 맞아도 밀리지 않음",
        "진영 꾸밈: 우리 쪽(왼쪽 아래) 현대 무기 진영 = 강철 판 바닥·격벽·경고 줄무늬·쌍열 포신 포탑 · 상대 쪽(오른쪽 위) 대정령의 세계수 진영 = 풀밭·꽃·뿌리·숲 벽·세계수 포탑 (빛줄기로 쏨)",
      ],
      en: [
        "Fixed: Silk's bleed stacks in Champion Clash grew without a cap and overflowed the gauge (now it stays full and resets on respawn) · AI in the new modes fought enemies through walls instead of capturing (they can't see through walls now, and in Capture they keep walking to the zone while fighting)",
        "Scoreboard (Tab): in growth modes, everyone's level, gold earned and gear (enemies too, hover for stats) · augment picks are now three cards with 12 pixel-art icons",
        "Home Shop: three role-based recommendations at the top with reasons · tap a legendary to open its parts window (buy parts one by one or complete at once) · shop while waiting to respawn · Esc closes just the shop · bigger text and icons · hidden gear names no longer show in English",
        "Divine Contest and Prelude to War (and Gigantomachia) skip the arena picker · minions deal much less damage to fighters (×0.35) and more to towers (×2) · towers no longer get pushed around",
        "Faction looks: our side (bottom-left) is a modern-arms base with steel floors, bulkheads, hazard stripes and twin-barrel turrets · the enemy side (top-right) is the Great Spirits' World Tree with grass, flowers, roots, forest walls and world-tree turrets that fire beams",
      ],
      ja: [
        "修正: 覇王戦で影師の出血スタックが上限なく積もりゲージがあふれていた問題（満タンで止まり、復活でリセット）· 新しい対決でAIが壁越しの相手と戦って占領しなかった問題（壁の向こうは見えず、占領戦では戦いながら区域へ向かう）",
        "スコアボード(Tab): 成長対決で全員のレベル・稼いだお金・買った装備（相手チームも、マウスを乗せると能力値）· 強化選択を3枚のカードに（強化ごとのピクセル絵12種）",
        "拠点ショップ: 一番上に役割別おすすめ装備3つ（理由つき）· 伝説装備を押すと素材ウィンドウ（素材を1つずつ購入・まとめて完成）· 倒れて復活を待つ間も購入可 · Escでショップだけ閉じる · 文字・絵を大きく · 英語で出ていたヒドゥン装備名を日本語に",
        "争奪戦・戦争の序幕（・ギガントマキア）は闘技場選択なしですぐバンピック · 兵士がキャラに与えるダメージを大きく減らし(×0.35)、砲塔にはより強く(×2) · 砲塔が攻撃されても押されない",
        "陣営の装い: 味方側（左下）は現代兵器の陣営 = 鋼板の床・隔壁・警告ストライプ・二連砲身の砲塔 · 相手側（右上）は大精霊の世界樹の陣営 = 草原・花・根・森の壁・世界樹の砲塔（光線で撃つ）",
      ],
    },
  },
  {
    version: "0.48.245",
    date: "2026-10-30",
    items: {
      ko: [
        "월드 워 리그 우승 보상에 모든 캐릭터 '승리' 한정 스킨 추가: 남색 제복 · 금빛 견장·단추 · 가슴 훈장 둘 · 붉은 어깨띠·허리띠 · 붉은 망토(뒷모습은 등 전체, 앞·옆은 펄럭임) · 금빛 테두리 (버려진 자들 P2·P3, 베두인 던진 뒤 그림까지)",
        "'승리' 스킨을 입으면: 금빛 훈장 별 타격 · 승리의 별 대기 · 금빛 별 걸음 · 훈장 숫자 효과가 모두 켜지고 전용 행진곡(작은북 행진 + 나팔 가락)이 흐름 · 상점 스킨 탭에 '리그 우승 보상'으로 잠겨 있다가 우승하면 열림",
      ],
      en: [
        "World War League champions now also get the limited 'Victory' skin for every character: navy uniform · gold epaulettes and buttons · two chest medals · red sash and belt · red cape (full back view, fluttering from the front and side) · gold outline (including The Abandoned P2/P3 and Bedouin's thrown pose)",
        "Wearing a 'Victory' skin turns on golden medal-star hits, rising victory stars, golden star steps and medal numbers, and plays its own march (snare drum + trumpet melody) · locked in the shop's Skins tab as a league champion reward until you win",
      ],
      ja: [
        "ワールドウォーリーグ優勝報酬に全キャラの「勝利」限定スキンを追加: 紺の制服 · 金の肩章・ボタン · 胸の勲章2つ · 赤い肩帯・ベルト · 赤いマント（後ろ姿は背中全体、前・横はなびく）· 金の縁取り（捨てられた者たちP2・P3、ベドウィンの投げた後の絵まで）",
        "「勝利」スキンを着ると: 金の勲章の星の打撃 · 勝利の星の待機 · 金の星の歩み · 勲章数字のエフェクトがすべてオンになり、専用の行進曲（スネアの行進 + ラッパの旋律）が流れる · ショップのスキンタブに「リーグ優勝報酬」としてロックされ、優勝すると解放",
      ],
    },
  },
  {
    version: "0.48.244",
    date: "2026-10-30",
    items: {
      ko: [
        "패왕전 새 대결 '기간토마키아': 나 + AI 29명이 거인들의 땅(라스트 보스 방의 가로·세로 8배)에서 살아남기 · 서버 없이 이 기기에서만 계산 · 밴픽(밴 하나씩·내 캐릭터) → 준비방 → 대결, 밴한 캐릭터는 AI에서 빠짐",
        "성장: 뿔 거인(붉은 뿔 3·푸른 뿔 5·흰 뿔 9, 어려울수록 좋은 장비를 많이)·도깨비(계속 다시 나옴)·상자 150개(돈·조합 장비·사용 아이템·드물게 상점 물건) · 레벨 18 · 재료 + 돈으로 전설 장비 제작 (3초 가만히) · 자기장이 2분 30초마다 좁아짐 · 마지막 1명 승리 (칩 50,000)",
        "배낭 10칸 (그중 한 칸은 금고: 죽어도 안 잃고 판이 끝나도 가져감) · 죽으면 배낭을 떨굼 · 9분·17분에 임시 출구가 생기고 나가면 배낭을 모두 가져감 · 상점 물건: 만능 티켓·이벤트 재화·로비 돈·한정 스킨권·한정 추가 효과권 · 나갔다가 이어하기 (이 기기에 저장) · 큰 경기장은 보이는 칸만 그려 가볍게",
      ],
      en: [
        "New Champion Clash battle 'Gigantomachia': you + 29 AI survive on the Land of Giants (8x the last-boss room in each direction) · computed only on this device, no server · draft (one ban each and your pick) → prep room → battle; banned characters are left out of the AI",
        "Growth: horned giants (3 red, 5 blue, 9 white — tougher ones drop more and better gear), respawning goblins and 150 chests (gold, crafting parts, consumables, rarely shop goods) · level up to 18 · craft legendary gear from parts + gold (hold still 3s) · the storm shrinks every 2:30 · last one standing wins (50,000 chips)",
        "10-slot backpack (one slot is a vault: never lost on death and kept after the match) · you drop your backpack when you fall · temporary exits open at 9 and 17 minutes — escape to keep everything · shop goods: All-Purpose Ticket, Event Currency, Lobby Money, Limited Skin Voucher, Limited Effect Voucher · leave and resume later (saved on this device) · big arenas now only draw the visible tiles",
      ],
      ja: [
        "覇王戦の新しい対決「ギガントマキア」: 自分 + AI 29人が巨人たちの地（ラストボス部屋の縦横8倍）で生き残る · サーバーなしでこの端末だけで計算 · バンピック（バン1つずつ・自分のキャラ）→ 準備部屋 → 対決、バンしたキャラはAIから外れる",
        "成長: 角の巨人（赤い角3・青い角5・白い角9、強いほど良い装備を多く）・鬼（何度も再出現）・宝箱150個（お金・組み合わせ装備・使用アイテム・まれにショップの品）· レベル18 · 素材 + お金で伝説装備を製作（3秒じっと）· 磁場が2分30秒ごとに狭まる · 最後の1人が勝利（チップ50,000）",
        "バッグ10枠（うち1枠は金庫: 倒れても失わず試合後も持ち帰る）· 倒れるとバッグを落とす · 9分・17分に臨時出口が現れ、出るとバッグをすべて持ち帰る · ショップの品: 万能チケット・イベント通貨・ロビーのお金・限定スキン券・限定追加エフェクト券 · 中断して続きから（この端末に保存）· 大きな闘技場は見えるマスだけ描いて軽く",
      ],
    },
  },
  {
    version: "0.48.243",
    date: "2026-10-30",
    items: {
      ko: [
        "패왕전 '월드 워 리그' (8팀 대회: 8강 → 4강 → 결승): 판마다 대결 유형을 고름 (5대5·토너먼트·전쟁의 서막·점령전), 두 팀 선택이 다르면 둘 중 무작위 · 다른 대결처럼 밴픽 → 준비방 → 대결",
        "내 경기를 이기면 다른 팀 경기를 관전(AI끼리 진짜 대결)하거나 결과만 보고, 올라온 팀과 다음 경기 · 라운드마다 칩 6,000 · 12,000 · 우승 30,000",
        "우승 보상: '승리' 한정 효과 세트 (금빛 훈장 별 타격 · 승리의 별 대기 · 금빛 별 걸음 · 훈장 숫자) — 상점 이벤트 탭에서 장착, 살 수는 없음 · 모든 캐릭터 '승리' 한정 스킨은 따로 준비 중",
      ],
      en: [
        "Champion Clash 'World War League' (8 teams: quarterfinals → semifinals → final): pick a battle each match (5v5, Tournament, Prelude to War, Capture); if the two picks differ, one is chosen at random · draft → prep room → battle like every other mode",
        "Win your match, then watch the other matches (real AI-vs-AI battles) or just check the result, and face whoever advances · 6,000 / 12,000 chips per round won, 30,000 for the title",
        "Champion reward: the limited 'Victory' effect set (golden medal-star hits, rising victory stars, golden star steps, medal numbers) — equip it in the shop's Event tab, not for sale · limited 'Victory' skins for every character are being made separately",
      ],
      ja: [
        "覇王戦「ワールドウォーリーグ」（8チーム: 準々決勝 → 準決勝 → 決勝）: 試合ごとに対決の種類を選ぶ（5対5・トーナメント・戦争の序幕・占領戦）、両チームの選択が違えばどちらかを無作為 · 他の対決と同じくバンピック → 準備部屋 → 対決",
        "自分の試合に勝つと他チームの試合を観戦（AI同士の本物の対決）したり結果だけ見たりして、勝ち上がったチームと次の試合 · ラウンドごとにチップ 6,000 · 12,000 · 優勝 30,000",
        "優勝報酬: 「勝利」限定エフェクトセット（金色の勲章の星の打撃・勝利の星の待機・金色の星の歩み・勲章数字）— ショップのイベントタブで装着、購入不可 · 全キャラの「勝利」限定スキンは別途準備中",
      ],
    },
  },
];
