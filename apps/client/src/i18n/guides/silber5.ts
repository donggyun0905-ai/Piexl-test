// 캐릭터 설명: 실베르 (백인장) · 한·영·일 (수치는 weaponsBaekinjang·itemsBaekinjang과 맞춤) — silber4.ts가 커서 나눔
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_SILBER5: Guide = {
  baekinjang: [
    "실베르 · 백인장 '기계 날개와 미니 창 드론을 부리는 쌍검의 기사' · 체력 100 · 공격력 9 · 이동 1.25 · 행운 1 · 처음엔 약하지만 패시브를 먹을수록 강해짐 (진영 특징: 전용 패시브 하나마다 능력치가 더 오름)",
    "무기 1 (혈월 쌍검): 누르면 앞을 붉은 초승달 검격 둘로 X자로 벰 (검격 하나 공격력의 55% · 2번 맞음 · 사거리 증가만큼 넓어짐)",
    "기본 패시브: 미니 창 드론 5기가 늘 붉은 레이저를 남기며 가까운 적을 쫓아가 찌르고(한 번 12%), 곧게 지나갔다가 돌아와 다시 찌름 · 적이 없으면 몸 곁에 떠 있음",
    "콤보 (전용 패시브): 기본 공격 → 적색 난무(2타) → 선혈 회전참(둘레 4타) → 섬광 돌진베기(길게 돌진·크게 1타·돌진 중 무적) · 이어서 눌러야 다음 기술 · 없는 기술은 건너뜀",
    "확률 원거리 기술 (전용 패시브, 공격마다): 붉은 날개 폭우 12%(앞 부채꼴 15타) · 추적 침격 15%(한 적에게 15타) · 관통 나선창 10%(곧은 줄 강한 1타) · 기계익 충격파 10%(둘레 넓게 1타)",
    "스킬 개방 (전용 패시브, 숫자 키 1~4): 1 적안 표식(받는 피해 +10%·치명타로 맞을 확률 +15%) · 2 혈철 감옥(가두고 계속 벰, 보스는 큰 피해와 출혈) · 3 사신의 팔연참(8번 베고 별 폭발·죽음 상태이상, 보스는 절반) · 4 종언의 붉은 날개(궁극기: 드론 180기가 180번 찌르고 살아남은 적에게 쌓인 피해를 한 번 더)",
    "보조 9 (전용 패시브): 편대 증설(드론 8기) · 과열 드릴(드론 20%·더 자주) · 혈흔(드론에 찔리면 출혈 3초) · 표적 공유(표식 붙은 적을 드론 전부가 노림·2배) · 연환(콤보를 끝내면 5초 공격 속도 +30%) · 잔월(기본 검격이 날아가 60% 한 번 더) · 날개 과부하(확률 기술 +5%p) · 사신의 계약(표식·출혈·죽음 걸린 적 처치 시 체력 2·스킬 대기 -1초) · 강철 날개(받는 피해 -12%·돌진베기 뒤 0.5초 무적)",
  ],
};

export const GUIDE_EN_SILBER5: Guide = {
  baekinjang: [
    "Silber · Baekinjang, the twin-blade knight with mech wings and mini lance drones · HP 100 · damage 9 · move 1.25 · luck 1 · weak at first but stronger with every passive (faction trait: each exclusive passive raises stats further)",
    "Weapon 1 (Blood Moon Twin Blades): press to carve an X ahead with two red crescent slashes (55% of damage each · hits twice · wider with range)",
    "Base passive: five mini lance drones always chase nearby foes trailing red lasers, stab (12% each), fly straight past and return to stab again · they hover beside you when no foe is near",
    "Combo (exclusive passives): basic attack → Crimson Flurry (2 hits) → Bloodspin Slash (4 hits around you) → Flash Rush Slash (long rush · one heavy hit · invulnerable while rushing) · keep pressing to chain · steps you lack are skipped",
    "Chance-based ranged skills (exclusive passives, per attack): Red Wing Downpour 12% (15 hits in a cone) · Seeker Needles 15% (15 hits on one foe) · Piercing Spiral Lance 10% (one heavy piercing hit) · Mech Wing Shockwave 10% (one wide hit around you)",
    "Skill unlocks (exclusive passives, number keys 1-4): 1 Red Eye Mark (+10% damage taken · +15% chance to be crit) · 2 Blood Iron Prison (hold and keep cutting; bosses take heavy damage and bleed instead) · 3 Reaper's Eightfold Slash (8 slashes, star burst, Death · halved on bosses) · 4 Red Wings of the End (ultimate: 180 drones stab 180 times, then survivors take all that damage once more)",
    "9 boosts (exclusive passives): Expanded Squadron (8 drones) · Overheated Drills (20% · faster) · Bloodstain (drone stabs bleed for 3s) · Shared Target (all drones hunt the marked foe · 2x) · Unbroken Chain (+30% attack speed for 5s after finishing the combo) · Waning Moon (the basic slash flies on for 60% more) · Wing Overload (+5%p to chance skills) · Reaper's Pact (killing a marked, bleeding or Death-struck foe heals 2 and cuts skill cooldowns by 1s) · Steel Wings (-12% damage taken · 0.5s extra invulnerability after the rush)",
  ],
};

export const GUIDE_JA_SILBER5: Guide = {
  baekinjang: [
    "シルベル・百人長「機械の翼とミニ槍ドローンを操る双剣の騎士」・体力100・攻撃力9・移動1.25・幸運1・最初は弱いがパッシブを取るほど強くなる（陣営の特徴：専用パッシブ1つごとに能力値がさらに上がる）",
    "武器1（血月の双剣）：押すと前を赤い三日月の斬撃2つでX字に斬る（斬撃1つ攻撃力の55%・2回当たる・射程増加の分だけ広がる）",
    "基本パッシブ：ミニ槍ドローン5機が常に赤いレーザーを残して近くの敵を追い、刺して（1回12%）まっすぐ通り過ぎ、戻ってまた刺す・敵がいなければ体のそばに浮かぶ",
    "コンボ（専用パッシブ）：通常攻撃→赤色乱舞（2打）→鮮血回転斬（周囲4打）→閃光突進斬り（長く突進・大きく1打・突進中は無敵）・続けて押すと次の技・持っていない技は飛ばす",
    "確率発動の遠距離技（専用パッシブ、攻撃ごと）：赤い翼の豪雨12%（前方扇形15打）・追跡針撃15%（1体に15打）・貫通螺旋槍10%（直線に強い1打）・機械翼衝撃波10%（周囲に広く1打）",
    "スキル解放（専用パッシブ、数字キー1〜4）：1 赤眼の刻印（被ダメージ+10%・会心を受ける確率+15%）・2 血鉄の牢獄（閉じ込めて斬り続ける、ボスは大ダメージと出血）・3 死神の八連斬（8回斬って星の爆発・死の状態異常、ボスは半分）・4 終焉の赤い翼（究極技：ドローン180機が180回刺し、生き残った敵に蓄積ダメージをもう一度）",
    "補助9（専用パッシブ）：編隊増設（ドローン8機）・過熱ドリル（20%・より頻繁）・血痕（ドローンに刺されると出血3秒）・標的共有（刻印の敵を全機が狙う・2倍）・連環（コンボを決めると5秒攻撃速度+30%）・残月（通常の斬撃が飛んで60%をもう一度）・翼の過負荷（確率技+5%p）・死神の契約（刻印・出血・死の敵を倒すと体力2・スキル待機-1秒）・鋼鉄の翼（被ダメージ-12%・突進斬り後0.5秒無敵）",
  ],
};
