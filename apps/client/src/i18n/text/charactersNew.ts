import type { Lang } from "../index";

// 화면 글자: 버려진 자들·거인 이름·설명 (characters.ts가 커서 나눔)
export const CHARACTER_TEXT_NEW = {
  abandoned: { ko: "버려진 자들", en: "The Abandoned", ja: "捨てられた者たち" },
  abandonedDesc: {
    ko: "탭 콤보 · 함께 자란 세 아이 (P1 방패·초록 / P2 총·빨강 / P3 검·파랑). 나와 있지 않은 둘도 곁에서 싸움. 대시 버튼 = 탭(그 아이와 자리를 바꿔 교대, 0.5초 무적). 아이마다 콤보 순서를 기억하고, 무기의 조합대로 이으면 둘이 특수기 (틀리면 처음부터 · P1로 강제 교대) · 공격 속도가 오르지 않음",
    en: "Tag combo · Three kids who grew up together (P1 Shield·green / P2 Gun·red / P3 Sword·blue). The two off-field kids fight beside you. Dash button = Tag (swap places with that kid, 0.5s invulnerable). Each remembers their own combo; follow the weapon's chain and the other two unleash a special (a mistake restarts the chain and forces P1) · attack speed never increases",
    ja: "タッチコンボ · 一緒に育った三人（P1 盾・緑 / P2 銃・赤 / P3 剣・青）。出ていない二人もそばで戦う。ダッシュボタン＝タッチ（その子と位置を入れ替えて交代、0.5秒無敵）。それぞれ自分のコンボ順を覚え、武器の組み合わせ通りに繋ぐと二人が特殊技（間違えると最初から・P1に強制交代） · 攻撃速度は上がらない",
  },
  titan: { ko: "거인", en: "Titan", ja: "巨人" },
  titanDesc: {
    ko: "기계팔 · 체력이 아주 높고 느린 탱커. 무기마다 아주 느린 범위 공격 또는 빠르지만 아주 약한 연타 · 맞은 피해가 기계팔 에너지로 쌓여 다 차면 강력한 강타 · 대시 대신 패링(막은 피해가 그대로 에너지로) · 받는 피해 -15%",
    en: "Mech arm · A slow tank with huge HP. Each weapon either strikes very slowly in an area or jabs fast but very weakly · damage taken charges the mech arm for a mighty Smash · Parry instead of Dash (blocked damage becomes energy) · -15% damage taken",
    ja: "機械腕 · 体力がとても高く遅いタンク。武器ごとにとても遅い範囲攻撃か、速いがとても弱い連打 · 受けたダメージが機械腕のエネルギーに溜まり満タンで強打 · ダッシュの代わりにパリィ（防いだダメージがそのままエネルギーに） · 受けるダメージ-15%",
  },
  scribe: { ko: "서기관", en: "Scribe", ja: "書記官" },
  scribeDesc: {
    ko: "히든 캐릭터 · 아카식 레코드의 서기관. 깃펜으로 잉크 탄을 쏘아 맞은 적에게 기록을 새기고, 5번째 공격마다 무기의 글자(劍·爆·封·雷·氷·炎·再·星·滅)가 써지며 발동",
    en: "Hidden character · The Scribe of the Akashic Records. Fires ink shots that leave records on foes; every 5th attack writes the weapon's glyph (劍·爆·封·雷·氷·炎·再·星·滅) and unleashes it",
    ja: "隠しキャラ · アカシックレコードの書記官。羽根ペンで墨の弾を撃ち当てた敵に記録を刻み、5回目の攻撃ごとに武器の文字（劍·爆·封·雷·氷·炎·再·星·滅）が書かれて発動",
  },
  oni: { ko: "오니", en: "Oni", ja: "鬼" },
  oniDesc: {
    ko: "방망이 · 무기가 본체인 도깨비. 느리고 아주 센 휘두르기(공격력 36) + 무기마다 확률 추가 공격 · 25번 휘두르면 30초 신인족(공격력 +45%·최대 체력 +50%·추가 공격 100%) · 공격력 아이템은 최대 체력으로, 공격 속도는 체력 재생력으로, 사거리는 추가 공격 범위로 · 받는 피해 +30% · ??? : 최대 체력 400, 부활 1회 뒤 얻을 수 있는 명계의 무기 · ??? : 재생력 60, 부활 1회 뒤 얻을 수 있는 청전의 무기",
    en: "Club · An oni whose weapon is its true self. Slow, crushing swings (36 damage) + a weapon-specific chance of extra attacks · 25 swings grant 30s of Shinin form (+45% damage, +50% max HP, 100% extra attacks) · damage items become max HP, attack speed becomes regen, range widens extra attacks · +30% damage taken · ??? : a netherworld weapon unlocked with 400 max HP after reviving once · ??? : an azure weapon unlocked with 60 regen after reviving once",
    ja: "金棒 · 武器こそが本体の鬼。遅くとても強い一振り（攻撃力36）＋武器ごとの確率追加攻撃 · 25回振ると30秒神人族（攻撃力+45%・最大体力+50%・追加攻撃100%）· 攻撃力アイテムは最大体力に、攻撃速度は体力再生に、射程は追加攻撃の範囲に · 受けるダメージ+30% · ??? : 最大体力400、1回復活した後に手に入る冥界の武器 · ??? : 再生力60、1回復活した後に手に入る青電の武器",
  },
} satisfies Record<string, Record<Lang, string>>;
