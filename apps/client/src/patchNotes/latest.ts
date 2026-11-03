import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.370",
    date: "2026-11-03",
    items: {
      ko: [
        "캐릭터 해금 조건을 캐릭터마다 새로 정함 (처음엔 파수꾼·떠돌이·마법사): 음양사 첫 보스 · 야수 30마리 · 기계공학자 상점 4번 · 의사 4층 · 풋내기 첫 클리어 · 격투가 시련 1000점 · 장수 엘리트 방 50번 · 묵인 방어력 20 · 거너 서든데스 클리어 · 거인 체력 200 · 추적자 타워 디펜스 ★5 맵 클리어 · 원소술사 영웅의 길 클리어 · 이무기 멸망의 용 처치 · 방랑객 공격 속도 1.5 · 소환술사 스켈레톤 궁병 300마리 · 정령사 큐피트의 정령 얻기 · 오토마타 로비 펫 3마리 · 역병의사 의사로 영웅의 길 · 이터 악의 사도로 영웅의 길 · 베두인 광야의 새벽 클리어 · 라이더 이동 속도 1.7 · 닌자 레이드 아레나 클리어 · 학살자 패왕전 대난투 우승 · 잔영 1대1 10연승 · 악의 사도 무한 모드 20층 · 사멸 베놈 1000마리 · 버려진 자들 데스매치 우승 · 펑크 칩 200,000 · 오니 100판 · 붐버 폭탄 100번 · 이드라 쉼터 100번 · 잊혀진 자 제단 1000번 · 변희 한 판 보스 셋 무피격 · 영사 점령전 10번 우승 · 시간술사 상점 안 쓰고 클리어 · 플라이 7분 클리어 · 장로 함정 1000번 · 렌 보스 50마리 · 아티팩터 칩 300,000 · 수집가 악마의 방 패시브 6가지",
        "캐릭터 고르기 창에 잠긴 캐릭터의 조건·진행도 (예: 0 / 300) · 칩으로 여는 캐릭터는 '칩으로 열기' 버튼",
      ],
      en: [
        "Every character now has its own unlock condition (Warden, Drifter and Mage are open from the start) — e.g. Brawler: 1000 Trial points · General: enter 50 elite rooms · Titan: 200 max HP · Summoner: 300 Skeleton Archers · Remnant: 10 duel wins in a row · Punk: 200,000 chips · Artifacter: 300,000 chips · Collector: all 6 Devil's Room passives (see each character for details)",
        "Locked characters show their condition and progress (e.g. 0 / 300) in the character window · chip-unlock characters get an 'Unlock for chips' button",
      ],
      ja: [
        "キャラ解放条件をキャラごとに新しく設定（最初は番人・流れ者・魔法使い）— 例：格闘家 試練1000点 · 武将 エリート部屋50回 · 巨人 体力200 · 召喚術師 スケルトン弓兵300体 · 残影 1対1で10連勝 · パンク チップ200,000 · アーティファクター チップ300,000 · コレクター 悪魔の部屋のパッシブ6種（詳しくは各キャラで）",
        "キャラ選択ウィンドウで、ロック中のキャラの条件と進行度（例：0 / 300）を表示 · チップで解放するキャラには「チップで解放」ボタン",
      ],
    },
  },
  {
    version: "0.48.369",
    date: "2026-11-03",
    items: {
      ko: [
        "타격감: 맞은 적이 뒤로 미끄러지듯 밀림 (치명타는 더 멀리 · 정예는 절반 · 보스는 안 밀림) · 연타 공격(소환수·닌자·빔·회전체·연속 콤보 등)과 짧은 간격으로 또 맞으면 밀지 않음",
        "처치 연출: 쓰러질 때 하얗게 번쩍이고 불똥·조각이 사방으로 튐",
        "피해 숫자: 다시 기본으로 켬 · 화면을 덜 가리게 (떠 있는 시간 짧게, 적마다 최근 3개만, 최신이 아닌 숫자는 반투명) · 최신 숫자가 맨 위에 또렷이",
        "층마다 지나는 방이 2칸 줄어듦 (1층 5칸 → 4층부터 8칸)",
        "엘리트 방(주황)은 2라운드: 첫 무리를 다 잡으면 잠깐 뒤 두 번째 무리 (조금 적게)",
        "후반 강화: 4층부터 층마다 몬스터·보스 체력 +15% · 주는 피해 +10% (6층에서 +45%·+30%)",
        "제단·경매장 증강 기술의 피해를 낮춤 (55%)",
      ],
      en: [
        "Hit feel: struck enemies slide back (farther on crits · half for elites · bosses don't budge) · rapid multi-hit attacks (summons, Ninja, beams, orbits, combos…) and hits landing in quick succession don't push",
        "Kill effect: a white flash with sparks and debris flying out",
        "Damage numbers are on by default again · they cover less of the screen (shorter, only the last 3 per enemy, older ones faded) · the newest number stays crisp on top",
        "Two fewer rooms per floor (5 on floor 1 → 8 from floor 4)",
        "Elite rooms (orange) now have 2 rounds: clear the first pack and a second, slightly smaller pack arrives shortly",
        "Late game is tougher: from floor 4, each floor adds +15% HP and +10% damage to monsters and bosses (+45% / +30% on floor 6)",
        "Altar and auction augment skills deal less damage (55%)",
      ],
      ja: [
        "打撃感：当たった敵が後ろへ滑るように押される（クリティカルはより遠く · 精鋭は半分 · ボスは押されない）· 連打攻撃（召喚獣・忍者・ビーム・回転体・連続コンボなど）や短い間隔で続けて当たった時は押さない",
        "撃破演出：倒れる時に白く光り、火花と破片が四方に飛ぶ",
        "ダメージ数字：再び標準でオン · 画面を隠しにくく（表示時間を短く、敵ごとに最新3つまで、最新以外は半透明）· 最新の数字が一番上にくっきり",
        "階ごとに通る部屋が2つ減少（1階5つ → 4階から8つ）",
        "エリート部屋（オレンジ）は2ラウンド：最初の群れを全滅させると少しして2つ目の群れ（少し少なめ）",
        "後半強化：4階から階ごとにモンスター・ボスの体力+15%・与ダメージ+10%（6階で+45%・+30%）",
        "祭壇・オークションの増強スキルのダメージを低下（55%）",
      ],
    },
  },
  {
    version: "0.48.368",
    date: "2026-11-03",
    items: {
      ko: [
        "무작위 캐릭터: 숨은 캐릭터는 묶음 전체 2% (걸리면 숨은 캐릭터 중 하나를 같은 확률로)",
        "캐릭터 해금 다시 나눔: 첫 클리어 한 판이면 5명쯤 (음양사·야수·기계공학자·의사·풋내기) · 나머지는 그 캐릭터로 클리어하면 어울리는 다음 캐릭터가 열림 (파수꾼 → 격투가 → 장수 → 묵인 …) · 특별한 클리어 (닌자: 한 판 보스 셋 무피격 · 시간술사: 상점 안 쓰고 · 악의 사도: 체력 10 이하 · 플라이: 10분 안) · 누적 (판 수·승리·처치·보스·돈)",
        "차원의 순례자: 걸을 때 가방·몸 크기가 왔다 갔다 하던 것 고침 (걸어도 서 있는 그림으로 살짝만 흔들림)",
        "늪의 두꺼비 왕: 기술 사이에 조금 더 쉼 (공격이 덜 잦음)",
      ],
      en: [
        "Random character: hidden characters now share a single 2% chance (then one of them is picked evenly)",
        "Character unlocks reworked: a first clear opens about five (Talisman Master, Beastkin, Engineer, Doctor, Novice) · clearing with a character opens a fitting next one (Warden → Brawler → General → Mukin …) · special clears (Ninja: 3 flawless bosses in a run · Chronomancer: no shop · Apostle of Malice: 10 HP or less · Fly: under 10 min) · long-term totals (runs, wins, kills, bosses, gold)",
        "Dimensional Pilgrim: her bag and body no longer change size while walking (uses the standing art with a gentle bob)",
        "Bog Toad King: rests a little longer between moves (attacks less often)",
      ],
      ja: [
        "ランダムキャラ：隠しキャラはまとめて2%（当たれば隠しキャラの中から均等に1人）",
        "キャラ解放を再調整：初クリア1回で5人ほど（陰陽師・獣人・エンジニア・医者・見習い）· 残りはそのキャラでクリアすると相性のいい次のキャラが開く（番人 → 格闘家 → 武将 → 黙忍 …）· 特別なクリア（忍者：1回でボス3体ノーダメージ · 時間術師：ショップを使わず · 悪の使徒：体力10以下 · フライ：10分以内）· 累計（回数・勝利・撃破・ボス・お金）",
        "次元の巡礼者：歩くたびにバッグと体の大きさが変わっていたのを修正（歩いても立ち絵で少しだけ揺れる）",
        "沼のガマ王：技の間に少し長く休む（攻撃の頻度が下がる）",
      ],
    },
  },
  {
    version: "0.48.367",
    date: "2026-11-03",
    items: {
      ko: ["관리자 페이지: 다른 서버(시험 서버·라이브)의 지금 수치를 그대로 가져오는 버튼 (가져온 뒤 확인하고 저장)"],
      en: ["Admin page: a button to copy the current values from another server (test or live), then review and save"],
      ja: ["管理者ページ：別のサーバー（テスト・ライブ）の今の数値をそのまま取り込むボタン（取り込んだ後に確認して保存）"],
    },
  },
];
