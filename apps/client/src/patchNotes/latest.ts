import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.49.16",
    date: "2026-11-04",
    items: {
      ko: [
        "새 캐릭터 펜리르 (비르디아 · 영물): 지난 비르디아 왕이 다스리던 늙은 백랑. 왕이 쓰던 거대한 대검을 입에 물고 다시 전쟁에 나섬 · 체력 45 · 공격력 16 · 이동 1.55 (아주 빠름) · 기본 회피 25%·예리함 25%",
        "선왕의 대검: 한 번 누르면 고정 5연 콤보가 저절로 이어짐 · 물어 베기 → 되베기 → 지면 검기(큰 검기가 바닥을 그으며 나아가 뚫음) → 난도(한 자리를 사방에서 빠르게 6번) → 천랑 낙인(뛰어오른 동안 무적, 내려찍으면 무적이 풀리고 사방 8갈래 검기)",
        "펜리르 전용 아이템 10 (늙은 늑대의 지혜 · 선왕의 광륜 · 벼린 송곳니 · 질풍 · 늑대의 울부짖음 · 천랑성 · 월광 난무 · 대지 가르기 · 노장의 투혼 · 사냥 본능) · 푸른 초승달 검기·수정 파편·갈라진 땅 이펙트 · 그림 시트",
        "펜리르 여는 조건: 비르디아 캐릭터를 모두 열고, 저마다 금기의 서 45점 이상으로 라스트 보스 클리어",
      ],
      en: [
        "New character Fenrir (Virdia · Spirit Beast): an old white wolf once ruled by the late king of Virdia, marching to war again with the king's giant blade in its jaws · 45 HP · 16 Attack · 1.55 move (very fast) · base 25% dodge and 25% Sharpness",
        "Blade of the Late King: one press runs a fixed 5-hit combo · Bite Slash → Return Slash → Ground Wave (a huge wave scrapes along the floor and pierces) → Frenzy Cut (6 fast slashes from every side on one spot) → Sirius Brand (invincible while leaping; the slam ends invincibility and sends sword waves 8 ways)",
        "10 Fenrir items (Old Wolf's Wisdom · Halo of the Late King · Honed Fangs · Gale · Wolf's Howl · Sirius · Moonlit Frenzy · Earth Splitter · Veteran's Spirit · Hunting Instinct) · blue crescent waves, crystal shards and cracked-ground effects · sprite sheet",
        "Fenrir unlock: unlock every Virdia character and clear a last boss with each at 45+ Taboo points",
      ],
      ja: [
        "新キャラ フェンリル（ヴィルディア · 霊獣）：先代ヴィルディア王に仕えた老いた白狼。王が使っていた巨大な大剣をくわえ再び戦に出る · 体力45 · 攻撃力16 · 移動1.55（とても速い）· 基本回避25%・鋭さ25%",
        "先王の大剣：一度押すと固定5連コンボが自動で続く · 噛み斬り → 返し斬り → 地面の剣気（大きな剣気が床をえぐりながら進み貫通）→ 乱刀（一か所を四方からすばやく6回）→ 天狼の烙印（跳び上がる間は無敵、叩きつけると無敵が解け四方8本の剣気）",
        "フェンリル専用アイテム10（老狼の知恵 · 先王の光輪 · 研ぎ澄まされた牙 · 疾風 · 狼の遠吠え · 天狼星 · 月光乱舞 · 大地割り · 老将の闘魂 · 狩りの本能）· 青い三日月の剣気・水晶の破片・割れた地面のエフェクト · スプライトシート",
        "フェンリルの解放条件：ヴィルディアのキャラをすべて解放し、それぞれ禁忌の書45点以上でラストボスをクリア",
      ],
    },
  },
  {
    version: "0.49.15",
    date: "2026-11-04",
    items: {
      ko: [
        "협동: 빌드 세트·버프 칸이 갱신되지 않아 비어 보이던 것을 고침 (세트 효과는 원래대로 적용) · 동료 체력 칸을 왼쪽 아래로 옮겨 능력치·빌드 칸을 가리지 않게",
        "협동: 쓰러진 동안 살아 있는 동료의 화면을 그대로 관전 (그 사람을 따라가는 화면·체력·장비·빌드 세트·능력치) · 누르면 다음 동료",
      ],
      en: [
        "Co-op: the build set and buff panels no longer stay empty (set effects were already applied) · the party health list moved to the lower left so it no longer covers the stats and build panels",
        "Co-op: while you are down you now watch a living teammate's screen (camera, health, loadout, build sets and stats) · tap for the next teammate",
      ],
      ja: [
        "協力：ビルドセット・バフ欄が更新されず空に見えていたのを修正（セット効果はもともと適用）· 仲間の体力欄を左下に移し、能力値・ビルド欄を隠さないように",
        "協力：倒れている間は生きている仲間の画面をそのまま観戦（その人を追う画面・体力・装備・ビルドセット・能力値）· 押すと次の仲間",
      ],
    },
  },
  {
    version: "0.49.14",
    date: "2026-11-04",
    items: {
      ko: [
        "레오 여는 조건: 아스칼론 캐릭터를 모두 열고, 저마다 금기의 서 45점 이상으로 라스트 보스 클리어 (캐릭터 선택창에 진행도)",
        "오닉스 여는 조건: 테라코어 캐릭터를 모두 열고, 저마다 금기의 서 45점 이상으로 라스트 보스 클리어 · 오닉스의 진영을 테라코어로 바로잡음",
      ],
      en: [
        "Leo unlock: unlock every Ascalon character and clear a last boss with each at 45+ Taboo points (progress shown on character select)",
        "Onyx unlock: unlock every Terracore character and clear a last boss with each at 45+ Taboo points · Onyx now correctly belongs to Terracore",
      ],
      ja: [
        "レオの解放条件：アスカロンのキャラをすべて解放し、それぞれ禁忌の書45点以上でラストボスをクリア（キャラ選択画面に進行度）",
        "オニキスの解放条件：テラコアのキャラをすべて解放し、それぞれ禁忌の書45点以上でラストボスをクリア · オニキスの陣営をテラコアに修正",
      ],
    },
  },
];
