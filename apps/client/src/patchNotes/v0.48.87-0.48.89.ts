import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.48.89",
    date: "2026-10-25",
    items: {
      ko: [
        "메인 메뉴에 '스토리' 추가 (시즌 1 · 캐릭터별 서사): 다섯 진영(아스칼론 · 테라코어 · 헬리오스 · 비르디아 · 아카식 레코드)과 소속 캐릭터, 최종 보스 셋, 아카식 레코드 1장 「오해」 · 2장 「슬며시 차오르는 악」 · 3장 「버려진 자들」을 책처럼 넘기며 읽기",
      ],
      en: [
        "Added 'Story' to the main menu (Season 1 · Character Tales): the five factions (Ascalon · Terracore · Helios · Virdia · Akashic Records) and their characters, the three final bosses, and Akashic Records Chapter 1 'Misunderstanding', Chapter 2 'The Slowly Rising Evil' and Chapter 3 'The Abandoned', read page by page like a book",
      ],
      ja: [
        "メインメニューに「ストーリー」を追加（シーズン1 · キャラクター別の物語）：五つの陣営（アスカロン · テラコア · ヘリオス · ヴィルディア · アカシックレコード）と所属キャラ、最終ボス3体、アカシックレコード第1章「誤解」· 第2章「忍び寄る悪」· 第3章「捨てられた者たち」を本のようにめくって読める",
      ],
    },
  },
  {
    version: "0.48.88",
    date: "2026-10-25",
    items: {
      ko: [
        "새 캐릭터 '오니': 무기가 본체인 도깨비. 느리고 아주 센 방망이(공격력 36) + 무기마다 확률 추가 공격(속성 피해) · 받는 피해 +30% · 도전과제 '한 판에 돈 300'으로 열림",
        "오니 신인족: 25번 휘두르면(캐릭터 왼쪽 게이지) 30초 동안 공격력 +45% · 최대 체력 +50% · 추가 공격 100%",
        "오니: 공격력 아이템은 최대 체력으로, 공격 속도는 체력 재생력(기본 3, 5초마다)으로, 사거리는 추가 공격 범위로 바뀜",
        "오니 방망이 10개: 명뢰봉 · 빙각금봉 · 홍련신주 · 금봉 · 야마타의 그림자 · 창세의 기둥 · 풍신소환 · 류신금봉 · 명계의 흑뢰봉(체력 444 이상 + 한 번 되살아남) · 극한의 청전(재생력 20 이상 + 한 번 되살아남)",
        "오니 그림: 사람 피부에 뿔이 난 도깨비 수인 · 웃통 벗은 호전적인 근육질(흉터·붕대·범 가죽 허리띠)",
        "오니 그림: 사람 피부에 뿔이 난 도깨비 수인 · 갸름한 얼굴 · 웃통 벗은 호전적인 근육질(흉터·붕대·범 가죽 허리띠) · 한정 스킨은 오니만 적호(붉은 범)",
        "버려진 자들 한정 스킨은 백호 대신 흑호 (검은 범 가죽 · 금빛 줄무늬 · 금빛 눈)",
        "오니 전용 아이템 18개: 명뢰봉·빙각금봉·홍련신주·야마타의 그림자·풍신소환·류신금봉을 들었을 때 무기마다 셋씩 나오고, 행운이 높을수록 잘 나옴",
      ],
      en: [
        "New character 'Oni': a goblin whose weapon is its true self. Slow, crushing club swings (36 damage) + a weapon-specific chance of elemental extra attacks · +30% damage taken · unlocked by earning 300 gold in one run",
        "Oni Shinin form: 25 swings (gauge left of the character) grant 30s of +45% damage, +50% max HP and 100% extra attacks",
        "Oni: damage items become max HP, attack speed becomes HP regen (3 per 5s base), range widens extra attacks",
        "10 Oni clubs: Thunder Cudgel · Frostfang Club · Crimson Lotus Pillar · Golden Club · Shadow of Eight Heads · Pillar of Genesis · Wind God's Call · Dragon Tide Club · Netherworld Black Thunder (444+ HP after reviving once) · Azure Frost Lightning (20+ regen after reviving once)",
        "Oni art: a human-skinned goblin with horns · a battle-hungry, shirtless, muscular build (scars, wraps, tiger-pelt sash)",
        "Oni art: a human-skinned goblin with horns · a slim face · a battle-hungry, shirtless, muscular build (scars, wraps, tiger-pelt sash) · the Oni's limited skin is a Red Tiger",
        "The Abandoned's limited skin is now a Black Tiger instead of the White Tiger (black pelt, golden stripes and eyes)",
        "18 Oni items: three for each of Thunder Cudgel, Frostfang, Crimson Lotus, Eight Heads, Wind God and Dragon Tide, only while holding that club, more likely with high luck",
      ],
      ja: [
        "新キャラ「鬼」：武器こそが本体の鬼。遅くとても強い金棒（攻撃力36）＋武器ごとの確率追加攻撃（属性ダメージ）· 受けるダメージ+30% · 実績「1回で300G」で解放",
        "鬼の神人族：25回振ると（キャラ左のゲージ）30秒間 攻撃力+45%・最大体力+50%・追加攻撃100%",
        "鬼：攻撃力アイテムは最大体力に、攻撃速度は体力再生（基本3、5秒ごと）に、射程は追加攻撃の範囲に変わる",
        "鬼の金棒10本：鳴雷棒・氷角金棒・紅蓮神柱・金棒・八岐の影・創世の柱・風神召喚・龍神金棒・冥界の黒雷棒（体力444以上＋一度復活）・極寒の青電（再生力20以上＋一度復活）",
        "鬼の絵：人の肌に角が生えた鬼の獣人 · 上半身裸の好戦的な筋肉質（傷・包帯・虎皮の腰帯）",
        "鬼の絵：人の肌に角が生えた鬼の獣人 · 細い顔 · 上半身裸の好戦的な筋肉質（傷・包帯・虎皮の腰帯）· 鬼の限定スキンは赤虎",
        "捨てられた者たちの限定スキンは白虎の代わりに黒虎（黒い虎皮・金の縞・金の目）",
        "鬼専用アイテム18個：鳴雷棒・氷角金棒・紅蓮神柱・八岐の影・風神召喚・龍神金棒を持っているときに武器ごとに3つ、幸運が高いほど出やすい",
      ],
    },
  },
  {
    version: "0.48.87",
    date: "2026-10-25",
    items: {
      ko: [
        "버려진 자들 새 그림: 작고 갸름한 얼굴 · 검은 옷 · 왼눈은 금빛(빛), 오른눈은 보랏빛(어둠)인 몸 · 무기만 아이 색(초록 방패 · 빨강 총 · 파랑 검)",
        "버려진 자들 테마 스킨 10종 다시: 수영복은 튜브·물안경으로 귀엽게, 핼러윈은 흡혈귀·마녀·호박, 학교는 학생복·세일러복, 설날은 색동 소매·복건, 백호는 사나운 가죽·발톱 장갑·줄무늬",
        "거인: 거인족의 굵은 소뿔 (모든 스킨), 백호 스킨은 사나운 머리 가죽과 줄무늬로",
      ],
      en: [
        "New art for The Abandoned: small, slim faces · black outfits · bodies of light and dark (a golden left eye, a violet right eye) · only the weapons carry each kid's color (green shield · red gun · blue sword)",
        "All 10 Abandoned theme skins redone: cute swimwear with floats and goggles, Halloween vampire · witch · pumpkin, school uniforms and a sailor suit, New Year rainbow sleeves, and a fierce White Tiger pelt with claw gloves and stripes",
        "Titan: thick bull horns of the giant folk (every skin), and the White Tiger skin gets a fierce pelt and stripes",
      ],
      ja: [
        "捨てられた者たちの新しい絵：小さく細い顔 · 黒い服 · 左目は金色（光）、右目は紫（闇）の体 · 武器だけ子どもの色（緑の盾 · 赤の銃 · 青の剣）",
        "捨てられた者たちのテーマスキン10種を作り直し：水着は浮き輪とゴーグルで可愛く、ハロウィンは吸血鬼・魔女・かぼちゃ、学校は学生服・セーラー服、正月は色とりどりの袖、白虎は猛々しい毛皮・爪の手袋・縞模様",
        "巨人：巨人族の太い牛の角（全スキン）、白虎スキンは猛々しい毛皮と縞模様に",
      ],
    },
  },
];
