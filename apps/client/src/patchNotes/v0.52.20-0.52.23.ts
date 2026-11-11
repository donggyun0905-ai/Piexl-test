import type { PatchNote } from "./types";

// 지난 패치 노트 0.52.20~0.52.23 (latest.ts에서 옮김)
export const NOTES: PatchNote[] = [
  {
    version: "0.52.23",
    date: "2026-11-11",
    items: {
      ko: [
        "빙설 빙설무장-창: 머리 위 창 사이를 넓게 벌리고, 한꺼번에가 아니라 한 개씩 연발로 날아감 (0.1초 간격)",
        "빙설 얼음가루(속): 쉬는 시간 3초 → 1.5초 · 얼음가루(강): 5초 → 3초",
        "빙설 빙격: 빙산처럼 크기 3배 (반지름 22 → 66) · 몸에 겹치지 않게 조금 더 앞에서 솟음 (40 → 70)",
      ],
      en: [
        "Bingseol Frost Arms: Spears: the spears above your head are spread wider apart and fire one at a time in a volley instead of all at once (every 0.1s)",
        "Bingseol Ice Dust: Swift cooldown 3s → 1.5s · Ice Dust: Strong 5s → 3s",
        "Bingseol Ice Strike: three times bigger, like an iceberg (radius 22 → 66) · rises a bit farther ahead so it doesn't cover you (40 → 70)",
      ],
      ja: [
        "氷雪・氷雪武装・槍：頭上の槍の間隔を広げ、まとめてではなく1本ずつ連発で飛ぶ（0.1秒間隔）",
        "氷雪・氷の粉（速）：休む時間3秒→1.5秒・氷の粉（強）：5秒→3秒",
        "氷雪・氷撃：氷山のように大きさ3倍（半径22→66）・体に重ならないよう少し前でそびえる（40→70）",
      ],
    },
  },
  {
    version: "0.52.22",
    date: "2026-11-11",
    items: {
      ko: ["래빗 슈퍼 럭키: 초거대 망치 60연타 피해 숫자가 합쳐지지 않고 한 대마다 따로 떠오름"],
      en: ["Rabbit Super Lucky: the colossal hammer's 60-hit combo now shows a separate damage number for every hit"],
      ja: ["ラビット・スーパーラッキー：超巨大ハンマーの60連打のダメージ数字が一発ごとに表示される"],
    },
  },
  {
    version: "0.52.21",
    date: "2026-11-11",
    items: {
      ko: ["빙설 궁극기 빙설창: 60연타 피해 숫자가 합쳐지지 않고 한 대마다 따로 떠오름 · 적마다 멈추는 슬로우 모션을 0.5초 → 1초로 (한 틱에 한 번씩 60번)"],
      en: ["Bingseol Frostsnow Lance: its 60-hit combo now shows a separate damage number for every hit instead of merging them · slow-motion stop at each foe lengthened from 0.5s to 1s (one hit per tick, 60 hits)"],
      ja: ["氷雪・奥義氷雪槍：60連打のダメージ数字がまとめられず一発ごとに表示される・敵ごとに止まるスローモーションを0.5秒→1秒に（1ティックに1回ずつ60回）"],
    },
  },
  {
    version: "0.52.20",
    date: "2026-11-11",
    items: {
      ko: [
        "새 캐릭터 빙설 (실베르): 얼음을 다루는 자유분방한 해군 소녀 · 늘 몸 둘레에 눈 내리는 얼음 영역(가까이 온 적은 움직임·공격이 느려짐) · 무기 10개 모두 얼음 칼날 (얼음칼·얼음 낫·서리 단검·빙하 대검·고드름 창·빙인 투척·눈꽃 부채·서리 채찍·빙륜·눈보라 지팡이, 무기마다 베기·찌르기·던지기 모양이 다름)",
        "빙설 전용 패시브 10: 궁극기-빙설창(공격마다 3% · 3초 기를 모아 마우스 쪽으로 · 적마다 슬로우 모션 60연타 · 맵 끝까지 관통) · 빙설무장-활(좌우에 큰 얼음 활, 2개까지) · 빙설무장-창(머리 위 얼음 창 4~7개가 차례로 생겨 발사) · 얼음가루(공격마다 3~5개, 닿으면 고정 피해 2, 30개까지) · 얼음가루(속)(5개가 모여 유도 얼음) · 얼음가루(강)(10개가 모여 관통 급속 얼음) · 빙격(앞에 얼음 빙각, 구속) · 영역강화(눈 결정 벽 5개·방어력 +10·적 탄 막음) · 눈보라 확장 · 쇄빙",
        "빙설 그림 시트·효과 그림(art/캐릭터/빙설)·아이콘·효과음·글자(한·영·일)·업적·스토리·티어·패왕전 스킬",
      ],
      en: [
        "New character Bingseol (Silber): a free-spirited navy girl of ice · a snowy frost field always surrounds her (nearby foes move and attack more slowly) · all 10 weapons are ice blades (Ice Blade, Ice Scythe, Frost Dagger, Glacier Greatsword, Icicle Pike, Ice Edge Throw, Snowflake Fan, Frost Whip, Ice Wheel, Blizzard Staff, each with its own slash, thrust or throw)",
        "Bingseol's 10 exclusive passives: Ultimate Frostsnow Lance (3% per attack · charges 3s, flies toward your mouse · 60 slow-motion hits on every foe · pierces to the map edge) · Frost Arms: Bow (giant ice bows at your sides, up to 2) · Frost Arms: Spears (4-7 ice spears form above you one by one, then launch) · Ice Dust (3-5 per attack, 2 fixed damage on touch, up to 30) · Ice Dust: Swift (5 gather into homing ice) · Ice Dust: Strong (10 gather into piercing rapid ice) · Ice Strike (ice spike ahead, binds) · Field Fortify (5 snow-crystal walls, +10 defense, block shots) · Spreading Blizzard · Icebreaker",
        "Bingseol sprite sheet, effect art, icons, sound effects, text (KO/EN/JA), achievement, story, tier and Paewang skills",
      ],
      ja: [
        "新キャラ氷雪（シルベル）：氷を操る自由奔放な海軍少女・いつも体の周りに雪の降る氷の領域（近づいた敵は動きと攻撃が遅くなる）・武器10個はすべて氷の刃（氷の剣・氷の鎌・霜の短剣・氷河の大剣・つららの槍・氷刃投げ・雪花の扇・霜の鞭・氷輪・吹雪の杖、武器ごとに斬る・突く・投げる形が違う）",
        "氷雪の専用パッシブ10：奥義・氷雪槍（攻撃ごとに3%・3秒力をためマウスの方向へ・敵ごとにスローモーション60連打・マップの端まで貫通）・氷雪武装・弓（左右に大きな氷の弓、2個まで）・氷雪武装・槍（頭上に氷の槍4～7本が順に現れて発射）・氷の粉（攻撃ごとに3～5個、触れると固定ダメージ2、30個まで）・氷の粉（速）（5個が集まって誘導氷）・氷の粉（強）（10個が集まって貫通する急速氷）・氷撃（前に氷の棘、拘束）・領域強化（雪の結晶の壁5個・防御力+10・敵の弾を防ぐ）・吹雪拡張・砕氷",
        "氷雪のスプライトシート・エフェクト絵・アイコン・効果音・文字（日・英・韓）・実績・ストーリー・ティア・覇王戦スキル",
      ],
    },
  },
];
