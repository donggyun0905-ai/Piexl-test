// 빛 층이 크게 빛나게 할 게임 효과 이름 (sim/fxTypes의 EffectKind) — 새 캐릭터의 큰 기술은 여기에 이름만 더하면 빛남
// BIG_FX: 효과 색(tint) 빛 + 고리 + 불티 (glowWatch) · ULT_FX: 빛기둥 + 고리 여러 겹 + 화면 살짝 번쩍 (glowSkills)

/** 크게 빛나는 공격 효과 (공용 + 캐릭터별 큰 기술) */
export const BIG_FX = new Set<string>([
  "mrFlash", "mrWhirl", "mrBurst",
  "btCross", "btExec", "btFlare", "btSolar",
  "iaWhip", "iaWrit", "iaRebound",
  "gbSlam", "gbWell", "gbWall", "gbThorn",
  "snWhirlFx", "snCharmFx", "snBloomFx", "rfBlastFx", "rfGustFx", "yrPurgeFx", "yrLightFx", "yrSlamFx", "mcBlastFx", "mcBlinkFx", "mcPortalFx", "blShotFx", "blBurstFx", "nlSmashFx", "nlCurseFx", "nlPinFx", "sxCutFx", "sxExecFx", "hfSmashFx", "hfShatterFx", "hfClawFx", "mcBoltFx", "gbLightSwing", "gbSmite", "gbBurst",
  "wvBreach", "wvCrush", "wvClap", "wvRopeCrash", "wvArmorPop", "wvBalloonPop", "wvBloom", "wvSurfEnd",
  "blast", "burst", "meteor", "slam", "bolt", "pillar", "holy", "bmBoom", "afBlast", "hdMeteor", "titanSmash", "renCrush", "tagMeteor", "vyMeteor", "mnBoom", "elBang", "oPillar", "imBoom", "stBurst", "plBurst", "smBurst",
  "titanSlam", "renSlam", "renDrop", "slNova", "slBurst", "eaAbyss", "adLaunch", "rdSmash", "cyEmp", "gsCube", "fgNova", "fgPillar", "elPillar", "mnErupt", "mnShatter", "tkClap", "tkBolt", "tkGeyser", "lvQuake", "lvBreach", "lvBurst", "oxReson", "oxHalo", "fnLand", "ecSlam", "zsClap", "zsSpear", "leRoar", "puPillar", "vySun", "hdAether", "kgPillar", "lxCross", "srScythe", "chCollapse", "stComet", "oBolt", "pgBlast",
]);

/** 필살기·변신처럼 드물고 큰 기술 */
export const ULT_FX = new Set<string>(["btJudge", "btGrace", "iaLaw", "gbUlt", "snUltFx", "rfHeavenFx", "yrHolyFx", "mcUltFx", "blAwakeFx", "hfAwakeFx", "mrRelease", "mrFall", "legend", "fgAwaken", "imAwaken", "slGrand", "rmEclipse", "wdTempest", "zsDescend", "ecTotal", "kgForm", "awaken", "tagSpecial", "oGod", "mEvo"]);
