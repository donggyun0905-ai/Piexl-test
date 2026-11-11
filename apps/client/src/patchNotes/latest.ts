import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
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
