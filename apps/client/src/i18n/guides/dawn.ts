// 캐릭터 설명: 새벽의 성흔 (블래스트) · 한·영·일 (수치는 weaponsBlast·itemsBlast·weaponsDawn과 맞춤)
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_DAWN: Guide = {
  blast: [
    "새벽의 성흔 · 블래스트 '폭멸의 탄환' · 근접한 악마들의 사지 형체를 알아볼 수 없게 날려 버리는 화끈한 화력 담당 · 체력 115 · 공격력 15 · 방어력 2 · 이동 1.35 · 행운 2",
    "새벽의 성흔 캐릭터는 스킬 대신 성흔(달빛의 힘) 게이지 (흰 게이지): 맞히면 차고 가득 차면 저절로 달빛 각성 · 끝나면 0부터",
    "산탄총 (누르고 있으면): 두 발 쏘고 펌프질 (둘째 발 뒤가 더 김) · 앞 부채꼴 130 안 모든 적에게 220% · 46 안 초근접은 그대로 + 크게 밀침, 멀수록 약해져 끝에서 35%",
    "폭멸: 초근접으로 처치한 적은 몸이 터져 둘레 42 안 적에게 60%",
    "성흔 차는 양: 맞힌 적마다 4 · 초근접 +3 · 처치 +6 (최대 100)",
    "달빛 각성 (6초): 둘레 90 달빛 폭발 150% · 잠깐 무적 · 피해 1.4배 · 거리 1.25배 · 부채꼴 넓게 · 공격 속도 1.3배 · 쏠 때마다 꿰뚫는 달빛 산탄 5발 (50%)",
    "무기 1: 폭멸의 산탄총 · 무기 대신 아이템이 나옴",
    "전용 아이템 20: 화력 5 (대형 벅샷 · 슬러그탄 · 조임 총열 · 용의 숨결탄 · 찢는 탄) · 폭멸 5 (폭멸의 화약 · 연쇄 폭멸 · 반동 강화 · 넓은 산탄 · 빠른 펌프) · 성흔 5 (달빛 탄피 · 보름달 · 사냥꾼의 표식 · 달무리 · 월광 산탄) · 사냥꾼 5 (피의 사냥 · 은탄 · 섬광탄 · 남은 달빛 · 끝없는 밤)",
  ],
};

export const GUIDE_EN_DAWN: Guide = {
  blast: [
    "Dawn Stigmata · Blast 'The Annihilating Round' · the fiery firepower who blows nearby demons apart beyond recognition · HP 115 · Damage 15 · Defense 2 · Move 1.35 · Luck 2",
    "Dawn Stigmata characters have a Stigma (power of moonlight) gauge instead of skills (a white gauge): it fills as you hit and, when full, you awaken in moonlight automatically · starts over from 0 afterwards",
    "Shotgun (hold): two blasts, then a pump (longer after the second) · 220% to every foe in a 130 cone ahead · full damage and big knockback within 46, weaker with distance down to 35% at the edge",
    "Annihilation: foes killed at point-blank burst apart, dealing 60% to foes within 42",
    "Stigma gain: 4 per foe hit · +3 at point-blank · +6 per kill (max 100)",
    "Moonlight Awakening (6s): 150% moonlight burst around you (90) · brief invulnerability · 1.4x damage · 1.25x range · wider cone · 1.3x attack speed · each shot also fires 5 piercing moon pellets (50%)",
    "Weapon 1: Annihilation Shotgun · items drop instead of weapons",
    "20 exclusive items: Firepower 5 (Heavy Buckshot · Slug Round · Choked Barrel · Dragon's Breath Round · Shredder Round) · Annihilation 5 (Annihilation Powder · Chain Annihilation · Heavy Recoil · Wide Spread · Quick Pump) · Stigma 5 (Moonlit Shell · Full Moon · Hunter's Mark · Moon Halo · Lunar Buckshot) · Hunter 5 (Blood Hunt · Silver Round · Flash Round · Lingering Moonlight · Endless Night)",
  ],
};

export const GUIDE_JA_DAWN: Guide = {
  blast: [
    "暁の聖痕・ブラスト「爆滅の弾丸」・近づいた悪魔の四肢を見分けがつかないほど吹き飛ばす豪快な火力担当・体力115・攻撃力15・防御力2・移動1.35・運2",
    "暁の聖痕のキャラクターはスキルの代わりに聖痕（月光の力）ゲージ（白いゲージ）：当てると満ち、満ちると自動で月光覚醒・終わると0から",
    "散弾銃（押し続ける）：2発撃ってポンプ（2発目の後が長い）・前方の扇130内の全ての敵に220%・46以内の至近距離はそのまま＋大きく押し出し、遠いほど弱まり端で35%",
    "爆滅：至近距離で倒した敵は体が弾けて周囲42内の敵に60%",
    "聖痕のたまる量：当てた敵ごとに4・至近距離+3・撃破+6（最大100）",
    "月光覚醒（6秒）：周囲90に月光爆発150%・短い無敵・ダメージ1.4倍・射程1.25倍・扇が広く・攻撃速度1.3倍・撃つたびに貫く月光散弾5発（50%）",
    "武器1：爆滅の散弾銃・武器の代わりにアイテムが出る",
    "専用アイテム20：火力5（大型バックショット・スラッグ弾・絞り銃身・竜の息吹弾・裂く弾）・爆滅5（爆滅の火薬・連鎖爆滅・反動強化・広い散弾・素早いポンプ）・聖痕5（月光の薬莢・満月・狩人の印・月暈・月光散弾）・狩人5（血の狩り・銀の弾・閃光弾・残る月光・終わらぬ夜）",
  ],
};
