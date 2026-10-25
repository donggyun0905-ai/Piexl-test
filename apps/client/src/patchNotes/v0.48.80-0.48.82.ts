import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.48.82",
    date: "2026-10-24",
    items: {
      ko: [
        "새 캐릭터 '버려진 자들': 길거리에서 함께 자란 세 아이 P1(방패·초록·남) · P2(총·빨강·여) · P3(검·파랑·남). 대시 버튼이 탭(다음 아이로 교대, 0.5초 무적 + 짧은 대시)",
        "버려진 자들: 아이마다 자기 콤보 순서를 기억하고(기본 P1 3 · P2 5 · P3 3), 무기의 조합대로 치고 탭하면 단계 끝에 나와 있던 P3 곁으로 P1·P2가 나와 특수기. 조합은 3단계가 끊김 없이 이어지고 왼쪽 위에 표로 보임 (틀리면 그 단계 특수기만 안 나감)",
        "버려진 자들 전용 무기 10개(무기마다 세 아이의 기술·조합 순서·특수기가 바뀜)와 아이템 10개 · 공격 속도는 아이템으로 오르지 않음",
        "새 캐릭터 '거인': 기계팔을 단 탱커 (체력 170, 받는 피해 -15%, 느림). 무기마다 아주 느린 범위 공격 또는 빠르지만 아주 약한 연타 · 맞은 피해가 기계팔 에너지로 쌓여 다 차면 무기마다 다른 강타",
        "거인 전용 무기 10개·아이템 10개 (장갑판·축전지·과부하·반격 코일 등)",
      ],
      en: [
        "New character 'The Abandoned': three kids who grew up on the streets, P1 (shield, green, boy) · P2 (gun, red, girl) · P3 (sword, blue, boy). The dash button is Tag (swap to the next kid, 0.5s invulnerable + a short dash)",
        "The Abandoned: each kid remembers their own combo (P1 3 · P2 5 · P3 3 by default). Follow the weapon's chain of hits and tags, and at the end of each stage P1 and P2 jump in beside P3 for a special. The three-stage chain loops seamlessly and is shown at the top left (a mistake only cancels that stage's special)",
        "10 Abandoned weapons (each changes the kids' moves, chain and specials) and 10 items · attack speed never increases from items",
        "New character 'Titan': a tank with a mech arm (170 HP, -15% damage taken, slow). Each weapon either strikes very slowly in an area or jabs fast but very weakly · damage taken charges the arm, and when full the next attack is a weapon-specific Smash",
        "10 Titan weapons and 10 items (armor plating, capacitor, overdrive, counter coil and more)",
      ],
      ja: [
        "新キャラ「捨てられた者たち」：路上で一緒に育った三人、P1（盾・緑・男）· P2（銃・赤・女）· P3（剣・青・男）。ダッシュボタンがタッチ（次の子に交代、0.5秒無敵＋短いダッシュ）",
        "捨てられた者たち：それぞれ自分のコンボ順を覚えていて（基本P1 3 · P2 5 · P3 3）、武器の組み合わせ通りに攻撃とタッチを繋ぐと、段階の最後に出ているP3のそばにP1・P2が現れて特殊技。3段階の組み合わせは途切れず繋がり、左上に表で表示（間違えるとその段階の特殊技だけ出ない）",
        "捨てられた者たち専用武器10個（武器ごとに三人の技・組み合わせ順・特殊技が変わる）とアイテム10個 · 攻撃速度はアイテムで上がらない",
        "新キャラ「巨人」：機械腕を持つタンク（体力170、受けるダメージ-15%、遅い）。武器ごとにとても遅い範囲攻撃か、速いがとても弱い連打 · 受けたダメージが機械腕のエネルギーに溜まり、満タンで武器ごとに違う強打",
        "巨人専用武器10個・アイテム10個（装甲板・蓄電池・過負荷・反撃コイルなど）",
      ],
    },
  },
  {
    version: "0.48.81",
    date: "2026-10-24",
    items: {
      ko: ["야수 덮치기: 덮칠 때 생기던 보호막 20을 없앰. 호랑이 변신의 추가 체력 50은 먼저 깎이고, 남은 채로 변신이 끝나면 체력이 가득 참 (다 깎이고 원래 체력까지 깎였으면 깎인 그대로)"],
      en: ["Beastkin Pounce: removed the 20 shield gained when pouncing. The tiger form's 50 extra HP is lost first; if any is left when the form ends, your HP is fully restored (if it ran out and your own HP was hit, that damage stays)"],
      ja: ["獣人の飛びかかり：飛びかかる時のシールド20を削除。虎変身の追加体力50が先に減り、残ったまま変身が終わると体力が全回復（使い切って元の体力まで減った場合はそのまま）"],
    },
  },
  {
    version: "0.48.80",
    date: "2026-10-24",
    items: {
      ko: [
        "메인 메뉴에 '이벤트' 추가. 앞으로 새로 나오는 놀이는 여기에 들어갑니다",
        "첫 이벤트 '광야의 새벽': 넓은 광야에서 시간이 갈수록 몰려오는 적을 15분 버티기 (5분·10분 보스, 15분 최종 보스를 잡으면 클리어). 공격은 저절로, 캐릭터는 지금 캐릭터 그대로",
        "적이 남긴 보석으로 레벨 업 → 무기·패시브 3개 중 하나 고르기. 무기 4칸(모두 같이 공격)·패시브 6칸, 같은 것을 고르면 레벨 +1 (최대 5)",
        "들판의 상자를 부수면 고기·자석·폭탄·돈, 가끔 나오는 황금 상자와 보스는 직업 패시브·공용 패시브를 줌",
        "조합: 최대 레벨 무기 + 짝 패시브(레벨 업 카드에 표시)를 갖고 황금 상자를 열면 각성 (피해·공격 속도·사거리 크게 + 금빛 탄 + 각성 파동)",
        "기록(가장 오래 버틴 시간·레벨)은 이 기기에 저장",
      ],
      en: [
        "Added 'Events' to the main menu. New modes from now on go here",
        "First event 'Dawn of the Wilds': hold out 15 minutes against ever-growing waves in the vast wilds (bosses at 5 and 10 min, beat the final boss at 15 to clear). Attacks are automatic, with the characters you know",
        "Gems from enemies level you up → pick 1 of 3 weapons or passives. 4 weapon slots (all attack together) and 6 passive slots; picking one you have raises its level (max 5)",
        "Break crates on the field for meat, magnets, bombs and gold; the occasional gold chest and bosses give class and common passives",
        "Combos: open a gold chest with a max-level weapon and its paired passive (shown on the level-up card) to awaken it (much more damage, attack speed and range + golden shots + an awakening pulse)",
        "Records (longest time survived, level) are saved on this device",
      ],
      ja: [
        "メインメニューに「イベント」を追加。これから新しく出る遊びはここに入ります",
        "最初のイベント「荒野の夜明け」：広い荒野で時間とともに押し寄せる敵に15分耐える（5分・10分にボス、15分の最終ボスを倒せばクリア）。攻撃は自動、キャラクターは今のキャラそのまま",
        "敵が落とす宝石でレベルアップ → 武器・パッシブ3つから1つ選ぶ。武器4枠（全部一緒に攻撃）・パッシブ6枠、同じものを選ぶとレベル+1（最大5）",
        "野原の箱を壊すと肉・磁石・爆弾・お金、ときどき出る金の箱とボスは職業パッシブ・共通パッシブをくれる",
        "組み合わせ：最大レベルの武器＋対のパッシブ（レベルアップのカードに表示）を持って金の箱を開けると覚醒（ダメージ・攻撃速度・射程が大きく上がり、金色の弾＋覚醒の波動）",
        "記録（一番長く耐えた時間・レベル）はこの端末に保存",
      ],
    },
  },
];
