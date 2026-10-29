import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
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
