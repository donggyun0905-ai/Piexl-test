import type { Lang } from "../index";

// 화면 글자: 세계 지도 새벽의 성흔 아지트 (world/places/dawnHideout · 헬리오스 술집 지하 계단)
export const WORLD_DAWN_TEXT = {
  wpDawnStairs: { ko: "지하 계단", en: "Cellar stairs", ja: "地下への階段" },
  wpDawnStairsText: { ko: "술집 구석의 낡은 지하 계단. 굳게 잠겨 있다. (스토리 7장에서 열림)", en: "Old cellar stairs in the corner of the tavern. Firmly locked. (Opens in Chapter 7)", ja: "酒場の隅の古い地下階段。固く閉ざされている。（ストーリー第7章で解放）" },
  wpDawnHideout: { ko: "새벽의 성흔 아지트", en: "Stigmata of Dawn Hideout", ja: "夜明けの聖痕のアジト" },
  wnDawnBlast: { ko: "무기는 많을수록 좋아. 악마는 기다려 주지 않거든.", en: "The more weapons, the better. Demons don't wait.", ja: "武器は多いほどいい。悪魔は待ってくれないからな。" },
  wnDawnNailer: { ko: "못 한 상자면 하룻밤 사냥은 거뜬해.", en: "One box of nails is enough for a night's hunt.", ja: "釘ひと箱あれば一晩の狩りは余裕だ。" },
  wnDawnCrusader: { ko: "위 술집은 그저 간판일 뿐. 진짜 새벽의 성흔은 여기 있다.", en: "The tavern upstairs is just a front. The real Stigmata of Dawn is down here.", ja: "上の酒場はただの看板。本当の夜明けの聖痕はここにある。" },
  wnDawnLunatic: { ko: "달빛이 차면 성흔이 뜨거워져. 오늘 밤이 기대돼.", en: "When the moonlight is full, the stigma burns. I can't wait for tonight.", ja: "月光が満ちると聖痕が熱くなる。今夜が楽しみだ。" },
  wnDawnHellfist: { ko: "허수아비로는 성에 안 차. 지옥 놈들로 연습하고 싶다.", en: "Dummies don't cut it. I want to practice on the things from Hell.", ja: "かかしじゃ物足りない。地獄の奴らで練習したい。" },
  wnDawnScissors: { ko: "싹둑. 오늘도 하나도 안 빗나갔어.", en: "Snip. Not a single miss today.", ja: "チョキン。今日も一度も外さなかった。" },
  wnDawnIncision: { ko: "감옥의 악마들은 아직 쓸모가 있어. 말을 잘 듣게 만들면.", en: "The demons in the cells are still useful. Once they learn to talk.", ja: "牢の悪魔たちはまだ使える。素直に話すようにすればな。" },
  wnDawnSilverBullet: { ko: "은탄은 비싸. 한 발도 허투루 쏘지 마.", en: "Silver bullets are expensive. Don't waste a single shot.", ja: "銀の弾は高い。一発も無駄にするな。" },
  wnDawnBlueFlame: { ko: "과녁은 안 보여도 돼. 불꽃이 길을 알려 주니까.", en: "I don't need to see the target. The flame shows me the way.", ja: "的は見えなくていい。炎が道を教えてくれる。" },
} satisfies Record<string, Record<Lang, string>>;
