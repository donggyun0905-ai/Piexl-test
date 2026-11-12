import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.52.54",
    date: "2026-11-12",
    items: {
      ko: ["모든 캐릭터: 피해 숫자가 뜨는 타격마다 타격음이 남 — 같은 적을 연달아 때릴 때·상태이상(독·출혈 등)·몇몇 기술처럼 소리가 빠지던 타격도 이제 타다다닥 소리가 남"],
      en: ["All characters: every hit that shows a damage number now plays a hit sound — rapid hits on the same foe, status damage (poison, bleed, etc.) and some skills used to be silent"],
      ja: ["全キャラ：ダメージ数字が出る打撃ごとに打撃音が鳴るように — 同じ敵への連続攻撃・状態異常（毒・出血など）・一部の技で鳴らなかった打撃もタタタッと鳴る"],
    },
  },
  {
    version: "0.52.53",
    date: "2026-11-12",
    items: {
      ko: ["느아르: 칠흑 횡베기 이펙트가 바라보는 쪽으로 제대로 나옴 (위아래·좌우가 뒤집혀 있던 것) · 피해 숫자가 뜨는 한 대마다 타다다닥 타격음 · 차원 절멸 범위·이펙트 크기를 줄임"],
      en: ["Noir: Jet-Black Sweep now faces the right way (it was flipped up/down and left/right) · a rapid hit sound for every hit that shows a damage number · Dimension Annihilation's range and effect are smaller"],
      ja: ["ノワール：漆黒横斬りのエフェクトが向いている方向に正しく出るように（上下・左右が逆だった）・ダメージ数字が出る一撃ごとにタタタッと打撃音・次元絶滅の範囲とエフェクトを小さく"],
    },
  },
  {
    version: "0.52.52",
    date: "2026-11-12",
    items: {
      ko: [
        "새 진영 아슈바르(검정): 태초의 색채 악마 7원색 군단 · 캐릭터 선택창에 검은 탭",
        "새 캐릭터 느아르 (로비 칩 45만 개로 열기): 공허의 검 하나 · 패시브 없음 · 적을 쓰러뜨리면 흑이 차고 가득 차면 레벨업(공격력+1·체력+10·방어력+1·재생력+1)과 강화 한 번",
        "느아르 강화: 기본공격·추가공격 4단계(2단계 75% · 3단계 50% · 4단계 20%) · 스킬 4개 강화판(50%) · 승격 하위→중위(50%)→고위(25%)→대악마(10%, 기본·추가 3단계 이상) · 실패하면 다음 확률 +5%, 성공하면 처음 확률로 · 계급마다 등 뒤 마크가 바뀜",
        "느아르 공격: 칠흑 횡베기·무형의 난무·공허의 회전참·절대 단절 · 추가 공격(확률) 심연의 손아귀·공간 압축·마력 소멸·공허 포식 · 스킬(1~4키) 흑영 돌진·공허의 낙인·결계 붕괴·흑월 강림 → 강화판 시초의 공허·차원 절멸·무한 심연·태초의 종언",
        "느아르 제약: 일반 방에서는 아이템·패시브를 얻을 수 없음(비밀방·히든 상점·시련의 방은 됨) · 대장장이·성좌의 방·쉼터 회복 못 씀 · 대신 재생력이 2.5배 빨리 참 · 레이드 단련 포인트는 패시브 30개 몫만",
      ],
      en: [
        "New faction Ashvar (Black): the Primordial Chromatic Demon Legion of Seven Colors · a black tab in character select",
        "New character Noir (unlock with 450,000 lobby chips): one Void Blade · no passives · kills fill the Black gauge; when full, level up (+1 damage · +10 HP · +1 defense · +1 regen) and get one upgrade roll",
        "Noir upgrades: Basic and Extra attacks have 4 stages (stage 2 75% · stage 3 50% · stage 4 20%) · 4 skills each have an empowered form (50%) · promotion Lesser → Middle (50%) → Greater (25%) → Archdemon (10%, needs Basic & Extra stage 3+) · each failure adds +5% to the next try, success resets it · the mark behind Noir changes with rank",
        "Noir attacks: Jet-Black Sweep · Formless Frenzy · Void Spin Slash · Absolute Severance · extra attacks (by chance) Abyssal Grasp · Space Compression · Mana Annihilation · Void Devour · skills (keys 1–4) Shadow Rush · Void Brand · Barrier Collapse · Black Moon Descent → empowered Primordial Void · Dimension Annihilation · Infinite Abyss · End of the Beginning",
        "Noir restriction: no items or passives from normal rooms (secret rooms, the hidden shop and trial rooms are fine) · no blacksmith, constellation room or rest healing · in return, regeneration is 2.5× faster · raid training points only cover 30 passives",
      ],
      ja: [
        "新陣営アシュヴァル（黒）：太初の色彩悪魔七原色軍団・キャラ選択に黒いタブ",
        "新キャラ ノワール（ロビーチップ45万枚で解放）：虚無の剣ひとつ・パッシブなし・敵を倒すと黒が溜まり、満タンでレベルアップ（攻撃力+1・体力+10・防御力+1・再生力+1）と強化1回",
        "ノワールの強化：基本攻撃・追加攻撃は4段階（2段階75%・3段階50%・4段階20%）・スキル4つに強化版（50%）・昇格 下位→中位（50%）→高位（25%）→大悪魔（10%、基本・追加3段階以上）・失敗すると次の確率+5%、成功すると元の確率に・位階ごとに背中の紋章が変わる",
        "ノワールの攻撃：漆黒横斬り・無形の乱舞・虚無の回転斬・絶対断絶・追加攻撃（確率）深淵の掌握・空間圧縮・魔力消滅・虚無捕食・スキル（1〜4キー）黒影突進・虚無の烙印・結界崩壊・黒月降臨 → 強化版 始原の虚無・次元絶滅・無限深淵・太初の終焉",
        "ノワールの制約：通常の部屋ではアイテム・パッシブを得られない（秘密の部屋・隠しショップ・試練の部屋はOK）・鍛冶屋・星座の部屋・休憩所の回復は使えない・代わりに再生力が2.5倍早く溜まる・レイドの鍛錬ポイントはパッシブ30個分のみ",
      ],
    },
  },
  {
    version: "0.52.51",
    date: "2026-11-12",
    items: {
      ko: ["캐릭터 선택창·스토리 진영 색 변경: 아스칼론 진한 주황 · 테라코어 진한 갈색 · 탈라시아 파랑 · 실베르 하늘색 · 이방인 탭도 아카식 레코드처럼 테두리가 은은하게 빛남"],
      en: ["Faction colors changed in character select and story: Ascalon deep orange · Terracore deep brown · Thalassia blue · Silber sky blue · the Outsider tab now glows softly like Akashic Records"],
      ja: ["キャラ選択・ストーリーの陣営カラー変更：アスカロン 濃いオレンジ · テラコア 濃い茶色 · タラシア 青 · シルバー 空色 · 異邦人タブもアカシックレコードのように縁がほのかに光る"],
    },
  },
];
