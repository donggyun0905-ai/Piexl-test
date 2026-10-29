import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.248",
    date: "2026-10-30",
    items: {
      ko: ["쟁탈전·전쟁의 서막·기간토마키아: 화면을 더 작게 줄여 넓게 보기 (PC 마우스 휠 · 모바일 오른쪽 두 손가락, 위아래가 지금보다 최대 1.7배 넓게 보임 · 버튼·창·미니맵 크기는 그대로)"],
      en: ["Divine Contest / Prelude to War / Gigantomachia: you can now zoom further out to see more (mouse wheel on PC · two-finger pinch on the right on mobile; up to 1.7× more of the field vertically · buttons, windows and the minimap keep their size)"],
      ja: ["争奪戦・戦争の序幕・ギガントマキア: 画面をさらに縮小して広く見られるように（PCはマウスホイール · モバイルは右側を2本指、上下が最大1.7倍広く見える · ボタン・ウィンドウ・ミニマップの大きさはそのまま）"],
    },
  },
  {
    version: "0.48.247",
    date: "2026-10-30",
    items: {
      ko: [
        "패왕전 고침: 다시 태어나기를 기다리는 동안에도 관전 (화면을 누르면 다른 사람) · 월드 워 리그 관전은 두 편 10명 모두 눌러 바꿔 보기 · 낭떠러지 섬에서 AI가 구멍 앞에 멈추던 문제 (옆·뒤로 비켜 감) · 변희: 상대 하나를 쓰러뜨려도 처치가 여러 번 세어져 금방 각성하던 문제 + 패왕전 각성 방어 절반",
        "AI 조준 보정: AI가 사람을 노릴 때는 자동 조준 대신 조준점이 늦게 따라가고 난이도만큼 흔들림 (움직이면 피할 수 있음, AI끼리는 그대로)",
        "쟁탈전·전쟁의 서막: 킬/데스/어시스트 · 장비 창(6칸) · Tab에 왼쪽 능력치 창 · 점수판 준 피해·받은 피해·받은 회복을 숫자 + 막대로 · 모두의 체력 줄 옆 레벨 네모 · 미니맵 (우리 편이 보고 있는 상대만 이름과 함께, 안개·수풀 은신은 안 보임)",
        "귀환(R): 5초 뒤 집으로, 맞으면 끊김 · 전쟁의 서막 포털: 집 앞 포털에서 F → 큰 지도에서 우리 체크포인트를 눌러 이동 · 포탑은 사거리 안에 상대 병사가 있을 때만, 기본 공격으로만 맞음 · 정글 몬스터는 움직이는 범위 안에 캐릭터가 있을 때만 맞고, 3초 동안 안 맞으면 체력이 참 (체력 줄 위 흰 막대) · 증강은 쟁탈전에서만",
        "기간토마키아: 밴픽 없이 캐릭터 고르기 · 상자를 열면 창에서 골라 가져감 (Shift+누르기로 바로 · 모두 가져가기 · Esc 닫기) · B: 배낭(금고 넣고 빼기·버리기) + 조합대 (만드는 3초 동안 불꽃 모션) · 상점이 열리던 문제 · 배낭이 가득일 때 1원씩 계속 뜨던 문제",
        "승리 한정 스킨: 강해질 때 금빛 기둥 + '승리의 기운!' + 팡파르 · 한정 스킨 만들 때 필요한 것 체크리스트 문서(docs/LIMITED_SKIN.md)",
      ],
      en: [
        "Champion Clash fixes: you can spectate while waiting to respawn (click to switch) · World War League spectating cycles through all 10 fighters on both teams · AI no longer freezes at the cliff edges on Cliff Island · Byeonhui: one kill was counted several times so she awakened almost instantly; fixed, and her awakened defense is halved in Champion Clash",
        "AI aim tuning: when aiming at a human, AI no longer auto-aims — their aim follows you with a delay and wobbles by difficulty (you can dodge by moving; AI vs AI is unchanged)",
        "Divine Contest / Prelude to War: kills/deaths/assists · a 6-slot gear bar · Tab shows your stats on the left · damage dealt, taken and healing on the scoreboard as numbers + bars · a level box next to everyone's HP bar · minimap (enemies appear with names only while an ally sees them; fog and bush stealth stay hidden)",
        "Recall (R): home after 5s, cancelled if hit · Prelude to War portal: press F at the portal by your base and pick a checkpoint on the big map · towers only take damage while enemy minions are in range, and only from basic attacks · jungle monsters only take damage while a fighter is within their roaming area, and heal after 3s without being hit (white bar above their HP) · augments appear only in Divine Contest",
        "Gigantomachia: pick a character without a draft · opening a chest shows a window to choose items (Shift+click to grab, take all, Esc to close) · B: backpack (vault in/out, drop) + craft table (a 3-second spark animation while crafting) · the shop could open; fixed · a full backpack kept showing +1 gold; fixed",
        "Victory skin: powering up now shows a golden pillar, 'Glory of Victory!' and a fanfare · added a checklist for making limited skins (docs/LIMITED_SKIN.md)",
      ],
      ja: [
        "覇王戦の修正: 復活待ちの間も観戦（押すと別の人）· ワールドウォーリーグの観戦は両チーム10人全員を押して切り替え · 断崖の島でAIが穴の前で止まっていた問題（横・後ろへよける）· 変姫: 相手1人を倒しても複数回数えられすぐ覚醒していた問題 + 覇王戦の覚醒防御を半分に",
        "AIの照準補正: AIが人を狙うときは自動照準ではなく照準点が遅れて追い、難易度に応じて揺れる（動けば避けられる、AI同士はそのまま）",
        "争奪戦・戦争の序幕: キル/デス/アシスト · 装備欄(6枠) · Tabで左に能力値 · スコアボードの与ダメ・被ダメ・回復を数字 + バーで · 全員の体力バーの横にレベルの四角 · ミニマップ（味方が見ている相手だけ名前つき、霧・茂みの潜伏は見えない）",
        "帰還(R): 5秒後に拠点へ、被弾で中断 · 戦争の序幕のポータル: 拠点前のポータルでF → 大きな地図で味方のチェックポイントを押して移動 · 砲塔は射程内に相手の兵士がいる時だけ、通常攻撃でのみダメージ · 野生モンスターは行動範囲にキャラがいる時だけダメージを受け、3秒被弾しないと回復（体力バーの上の白いバー）· 強化は争奪戦のみ",
        "ギガントマキア: バンピックなしでキャラ選択 · 宝箱を開けるとウィンドウから選んで持っていく（Shift+押しですぐ · すべて持っていく · Escで閉じる）· B: バッグ（金庫の出し入れ・捨てる）+ 合成台（作る3秒間は火花モーション）· ショップが開いていた問題 · バッグが満杯の時に1Gずつ出続けた問題",
        "勝利スキン: 強化時に金色の柱 +「勝利の気！」+ ファンファーレ · 限定スキン作成のチェックリスト文書(docs/LIMITED_SKIN.md)",
      ],
    },
  },
];
