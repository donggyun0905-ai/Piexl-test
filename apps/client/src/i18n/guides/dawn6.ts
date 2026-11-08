// 캐릭터 설명: 새벽의 성흔 (루나틱) · 한·영·일 (수치는 weaponsLunatic·itemsLunatic·weaponsDawn과 맞춤, dawn5가 커서 나눔)
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_DAWN6: Guide = {
  lunatic: [
    "새벽의 성흔 · 루나틱 '월광의 검사' (집단의 리더) · 달빛처럼 차갑고 아름다운 궤적을 그리며 악마의 급소만을 정밀하고 신속하게 찌르는 고결한 검사 · 체력 115 · 공격력 15 · 방어력 2 · 이동 1.4 · 행운 3 · 스킬 없음(성흔 게이지)",
    "찌르기 (누르고 있으면): 새하얀 레이피어로 매우 빠르게 찌름 85% (길이 52, 사거리 증가 따름) · 찌를 때마다 앞으로 약간 돌진 (적에게 닿기 전에 멈춤)",
    "약점 공격: 달빛이 없어도 30% (달빛 스택 확률에 더함) · 받은 피해의 50% 더 (흰 숫자)",
    "대시 찌르기: 대시하는 동안 지나가는 길의 적을 한 번씩 찌름 130%",
    "월광 표적 (패시브): 2.5초마다 적 하나 머리 위에 은빛 조준점 (4초) · 그 적에게 약점 공격이 터지면 확정 치명타 + 빠른 달빛 베기 (반지름 30, 220% 확정 치명타 · 달빛 2스택) · 약점이 아닌 그냥 공격으로 맞히면 조준점이 사라지고 다음 조준점을 기다림",
    "성흔 차는 양: 맞힐 때 1 · 처치 3 · 달빛 베기 4 (최대 100)",
    "만월 각성 (6초): 둘레 달빛 폭발 180% · 잠깐 무적 · 공격 속도 ×1.35 · 모든 적이 표적 (같은 적은 0.33초마다 달빛 베기) · 모든 공격에 달빛",
    "무기 1: 월광의 세검 · 무기 대신 아이템이 나옴",
    "전용 아이템 20 (★ 새 공격 방식): 세검 5 (섬광 같은 손목 · 긴 칼날 · ★삼연 찌르기 · ★월광 검기 · 달려드는 발) · 약점 5 (꿰뚫는 눈 · 급소 찌르기 · 사냥꾼의 조준 · 쌍둥이 달 · 처형의 달) · 달빛 베기 5 (만개한 달 · 차가운 달빛 · ★이어지는 달빛 · 보름달의 낙인 · ★초승달 비) · 대시·각성 5 (돌격 세검 · ★잔상 찌르기 · 리더의 성흔 · 지지 않는 달 · ★초승달 회전 베기)",
  ],
};

export const GUIDE_EN_DAWN6: Guide = {
  lunatic: [
    "Stigma of Dawn · Lunatic 'The Moonlight Swordswoman' (the group's leader) · a noble swordswoman who draws cold, beautiful moonlit arcs and pierces only a demon's vitals with precision and speed · HP 115 · Damage 15 · Defense 2 · Move 1.4 · Luck 3 · no skills (Stigma gauge)",
    "Thrust (hold): very fast pure-white rapier thrusts 85% (length 52, scales with range) · each thrust lunges slightly forward (stops before touching a foe)",
    "Weak point: 30% even without Moonlight (added to the Moonlight stack chance) · +50% of the damage (white number)",
    "Dash thrust: while dashing, stabs each foe along the path once 130%",
    "Moonlight Mark (passive): every 2.5s a silver crosshair appears above one foe (4s) · a weak point on it is a guaranteed crit plus a swift Moonlight Slash (radius 30, 220% guaranteed crit · 2 Moonlight stacks) · hitting it with a normal (non-weak) attack makes the crosshair vanish until the next one",
    "Stigma gain: 1 per hit · 3 per kill · 4 per Moonlight Slash (max 100)",
    "Full Moon Awakening (6s): moonlight burst around you 180% · brief invulnerability · ×1.35 attack speed · every foe is marked (Moonlight Slash at most every 0.33s per foe) · every attack applies Moonlight",
    "1 weapon: Moonlight Rapier · items drop instead of weapons",
    "20 exclusive items (★ new attack): Rapier 5 (Flash Wrist · Long Blade · ★Triple Thrust · ★Moonlight Wave · Lunging Step) · Weak point 5 (Piercing Eye · Vital Strike · Hunter's Aim · Twin Moons · Executioner's Moon) · Moonlight Slash 5 (Blooming Moon · Cold Moonlight · ★Chained Moonlight · Full Moon Brand · ★Crescent Rain) · Dash & awakening 5 (Charging Rapier · ★Afterimage Thrust · Leader's Stigma · Unsetting Moon · ★Crescent Spin)",
  ],
};

export const GUIDE_JA_DAWN6: Guide = {
  lunatic: [
    "夜明けの聖痕 · ルナティック『月光の剣士』（集団のリーダー）· 月光のように冷たく美しい軌跡を描き、悪魔の急所だけを精密かつ迅速に突く高潔な剣士 · 体力115 · 攻撃力15 · 防御力2 · 移動1.4 · 運3 · スキルなし（聖痕ゲージ）",
    "突き（押し続ける）：真っ白なレイピアでとても速く突く85%（長さ52、射程増加に従う）· 突くたびに少し前へ踏み込む（敵に触れる前に止まる）",
    "弱点攻撃：月光がなくても30%（月光スタックの確率に加算）· 受けたダメージの50%追加（白い数字）",
    "ダッシュ突き：ダッシュ中、通り道の敵を一度ずつ突く130%",
    "月光の標的（パッシブ）：2.5秒ごとに敵一体の頭上に銀の照準（4秒）· その敵に弱点攻撃が出ると確定クリティカル + 素早い月光斬り（半径30、220%確定クリティカル・月光2スタック）· 弱点でない普通の攻撃で当てると照準が消え、次の照準を待つ",
    "聖痕のたまる量：命中1 · 撃破3 · 月光斬り4（最大100）",
    "満月覚醒（6秒）：周囲に月光の爆発180% · 少しの間無敵 · 攻撃速度×1.35 · 全ての敵が標的（同じ敵には0.33秒ごとに月光斬り）· 全ての攻撃に月光",
    "武器1：月光の細剣 · 武器の代わりにアイテムが出る",
    "専用アイテム20（★新しい攻撃）：細剣5（閃光の手首・長い刃・★三連突き・★月光の剣気・踏み込む足）· 弱点5（見抜く目・急所突き・狩人の照準・双子の月・処刑の月）· 月光斬り5（満開の月・冷たい月光・★連なる月光・満月の烙印・★三日月の雨）· ダッシュ・覚醒5（突撃の細剣・★残像突き・指導者の聖痕・沈まぬ月・★三日月回転斬り）",
  ],
};
