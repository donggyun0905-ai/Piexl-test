/** 패시브 꼬리표 (빌드 세트 효과·보상 편향용). 패시브 하나에 꼬리표 하나.
 *  2026-11-04 꼬리표 정하기 표에서 사람이 검수한 값. 원소 9 + 성격 6 = 15종 */

/** 꼬리표 차례 (원소 9 · 성격 6) */
export const ITEM_TAGS = ["fire", "ice", "bolt", "poison", "light", "dark", "death", "earth", "water", "sharp", "tough", "wind", "luck", "summon", "blood"] as const;
export type ItemTag = (typeof ITEM_TAGS)[number];

/** 원소 꼬리표 (나머지는 성격) */
export const ELEMENT_TAGS: readonly ItemTag[] = ITEM_TAGS.slice(0, 9);

/** 꼬리표마다 패시브 id (빈칸으로 나눔) */
const MEMBERS: Record<ItemTag, string> = {
  // 불 36
  fire:
    "bzDraw bzFletch bzSplit bzEmber bzPrison bzImplode bzPillar bzTwin bzBlaze bzLinger bzSoul bzGreat wideBlast igniteTip heatBuildup armorMelt sunWarrior scorchBlade warCry unbreakable overdriveCircuit " +
    "counterCoil oniHellBrand oniRedLotus oniBloodFlame phoenixFlare phoenixSun phoenixRebirth adFocus " +
    "adWarhead rdTank rdBurn bmPowder bmBurn afWide afPhoenix fgPulse fgAfter pgCampfire fkPlate fkPyre " +
    "fkLines fkRequiem clSunSword clKatana clSunStaff clRedAxe ifritClaw ecFlare ecCorona mqWarhead mqBarrage hkDoubleTap hkPowder ocFrenzy ocSpray btEmber btCore btScorch btFlare btBrand btNoon btUndying mcPowder mcWide mcFuse mcResonance blBuckshot blDragon blGore blChain jkFlame jkFirework sdFlame ppDollHood rbFever byFlame",
  // 얼음 19
  ice:
    "coolingSystem overloadBurst timeSlow warpField oniFrostMail oniPermafrost oniSpiritEcho spiderNest " +
    "spiderBrood afDouble afSingularity skMore skTangle skHaste skShield clIceSword clIceBow clIceSpear " +
    "blizzardLance jkFrost sdFrost ppDollCat byFrost bsUlt bsBow bsLance bsDust bsHoming bsRapid bsSpike bsStorm bsShatter",
  // 번개 31
  bolt:
    "beamSplitter refractPrism electronic shadowChain spinMaster mirageDouble ascension thunderCry " +
    "bigCapacitor gyroStabilizer oniThunderCloud oniJudgment oniChainBolt flyKeen flyFrenzy elSage " +
    "elMaster adCore adSoul bmShrapnel bmArtist afPush afOverdrive cyCharge cyOverclock zsConductor " +
    "zsOverload zsWrath zsStep pgBadge pgJournal leMane leSky leChain leStorm leRoar oxPrism tkPearl mqOverclock wvJelly rfThunder ppChain rbBell byGreatWhite",
  // 독 17
  poison:
    "venomStar footnote shorthand idLongWhip idBramble snakeVenom snakeSpit scorpTail spiderFang plRust " +
    "plContagion smVenom smMist smCloud smSilk smTang smBloom snVenom snQuiver snNumb ppWeb",
  // 빛 65
  light:
    "crVerdict crHalo crSense crRain crGrave crEndless lnSense lnEndless lnFullMoon lnSlashBig lnSlashPow lnMoonRain lnCrescent bzSense bzEndless sbFocus sbEndless sbLunar hfLong hfBurst sxMoon sxCrescent sxHalo sxRemain nlMoon nlBlind nlFocus regenCharm goldPouch goddessBlessing starShower manaDrain jadeOrb lifeSiphon beautiful flashy ration " +
    "elite catNap purr woundSuture firstAid checkup prescription quickEcho eternity accumulate oasis " +
    "dragonBlood dragonEye brightStar longNight wideSky extraStar stardust zodiac parchment revision " +
    "scrapRepair chargeKnuckle idDew idGaiaGrace idFourSeasons idWorldHeart elExpand elTea rdShock " +
    "rdRepair afTattoo afInfinity fgMemory fgPillar fgMany fgShine fgCross fgHeal vyKeepFate vyQuiver " +
    "vyBlessing vyHomeward pgStarDust pgKeyring lxShard lxHalo lxGrace lxMore lxWide lxTattoo clHolySword " +
    "clStarTome dryadOrb aphroditeMirror puBook fnHalo fnStar ecDawn tkBell tkLighthouse lvSalt lvBlowhole mqPrism btVerdict btWitness btGrace btMercy iaQuill iaAbsolute iaVerse iaCall gbLight gbImmortal gbFaith gbVow snEther snMuse snNight rfHalo rfWrath rfPrayer rfLance yrPyre yrBloom yrHeaven yrOrb yrThorn yrPrayer mcPrayer mcArsenal blMoonlight blFull blHalo blLunar blSilver blRemain sdLotus sdGate sdStar ppDollPrincess rbCarrot rbMoon rbStar byCall",
  // 어둠 42
  dark:
    "lnMarkFast lnTwinMark lnExecute bzCage bzSeal bzInner sbEngrave sbStorm sbRapid sbPure hfHold hfFeed hfMaw hfGrow hfSpread sxBind sxFear sxSpool nlCurse nlChain ambush volleyCharm strongman intimidate sharpClaws hunterInstinct shadowMark twinShadow moonlight " +
    "assassin desertMirage desertKing soulFeast longCurse inkWell preface oniEightHeads oniAbyssDrink " +
    "oniShadowSpread snakeCoil batSwarm elLinger elStaff plMask plBloodlet eaHunger eaShade mkRegen " +
    "mkPotion cyOptics cyEcho rmStep rmVanish rmHaste rmShroud clVoidSword clVoidStaff clClaw devilBlood " +
    "devilSpots devilScream devilCross puInk ecUmbra ecHorizon hkJolly btSin btGrudge btTotality iaChain iaSilence iaShadow iaLaw gbPull gbOrbit snMirage snPerfume rfFocus yrInquest mcVoid mcBlink jkSplit sdVortex sdGhost sdMoon ppDollSpiral ppBlack rbGhost byWraith byTrinity byHaunt byPossess",
  // 죽음 44
  death:
    "executioner lastStand yinForce deathSeal focusCoil overclock heatHaze whirlRing armorPierce " +
    "martialSoul soulMagnet bloodPact soulBurst malice censor forbiddenBook wolfHowl bearRage flyRecharge " +
    "flyHunt renPrisonDmg renCrushStun plGland plBurrow plBlackDeath plReaper slBerserk slCrimson slHound " +
    "slLastBreath eaDevour eaFeast smReaper smKiss trSilencer trHeadshot rmExecute rmFrenzy fkHarvest " +
    "fkCross fkMajesty clScythe devilMask devilReaper ecTotality btExecutor iaSeal iaReaper iaEcho gbCrush snFatal snBloom rfHunt rfBrand yrStigma ppCorpse ppBow rbHomerun byFeast byDrain byReaper",
  // 대지 37
  earth:
    "crHeavy crLong crAfter crPillar crRamSlam crRamWall whetstone dashSlash earthshaker perfectCircle steadfast surgery antibody sandstorm sandVeil redHare " +
    "warBanner hydraulicJoint aftershock bearQuake boarTusk boarStampede boarMud eleMammoth renSoil " +
    "renQuake renBindLong renEarth renBigger renCollapse mkMomentum mkShock mkTrample mkIron rdDouble " +
    "rdRam bmEcho bmFinale mnMole mnExpert clVineStaff clStoneHammer clCrescent fnRift ecMoonAxe gbQuake gbStun gbAfter gbWeight sdMeteor ppDollHat rbQuake rbTriple rbStomp rbAfter rbCrack",
  // 물 3
  water:
    "oniGreatWave oniSprayChain oniDragonPalace tkBarnacle tkWhale tkTrident lvCrest lvSpiral lvBreaker lvCurrent lvSpray lvCall lvCalf lvBaleen lvPod lvKingWhale lvDeep lvSong tlDeep tlSchool tlJaws tlBreach tlRip mqFreedom hkChain hkFreedom ocUndertow ocEcho ocFin wvSpear wvGoddess wvWhale wvBubble wvClock wvCloud wvLotus wvFlood wvBalloon wvPearl wvHands wvFountain wvSkip wvSiren wvOctopus wvEye wvEbb wvTrail wvTsunami mrRipple mrCascade mrSky mrReturn mrBreath sdScroll",
  // 날카로움 90
  sharp:
    "icHeavy icWide icSwift icThrow icLeapBig icLeapPow icRampage lnSwift lnPierce lnFlurry lnWave lnEye lnDeep lnDashPow bzWide bzKnock bzWing sbQuick sbHollow sbPierce sbTriple sbBarrel sbSeek sbAgile hfKnuckle hfDouble hfCrush hfNail hfAim hfFar hfEcho sxEdge sxWide sxSnap sxTwin sxTaut sxWeave nlIron nlBarb nlSpread nlDeep nlSledge nlWide nlDrive nlEcho longGrip backQuiver steadyBreath spinCleave waveSlash echoBolt piercingBolt mach knockout focusFire " +
    "allIn bigStar longEcho precision longWhip command duneRush farThrow spearMastery momentum dragonRage " +
    "dragonLance fallenGrail sinWeight thickNib sealStamp alleyBond tagStrike idSap idRoots idTwinStab " +
    "idBloomSwap wolfFang wolfPack eagleEye scorpPincer batEcho eleTrunk flyLonger flyDragonEye renOak " +
    "renThorn renHeavy renBurstPrison spGreatPower spMissile plHive plSmog slMadness slGrin eaMaw eaFang " +
    "smMore smPierce afFocus cyBoost cyBerserk trScope trHollow trBipod trCharge rmBackstab rmEcho wdHone " +
    "wdCalm wdSheath wdGauge skEdge skRend vyString vyLaurel zsKing zsSkyEye zsGiant pgLens fkCrest " +
    "fkReach lxReach lxQuick lxPierce lxJudge clEyeTome clBlueSpear clBlueAxe relicRed relicGold " +
    "relicPrism relicGreen sylphQuiver gnomeHammer puDog leFang lePride leKing oxPolish oxCrown oxResonance fnFang fnMoon ecSunspot tlFin mqTwin mrHorn iaVital iaNeedle iaSteel iaClause gbForge gbAegis gbGrav snEdge snBarb snThorn snLash snChain rfScope rfPierce rfHead rfSpotter rfShard yrHeavy yrNoMercy yrVerdict yrWrist yrChain mcSword mcLance mcJavelin mcHeavy mcShrapnel blSlug blChoke blShred blSpread jkEdge jkAce sdSword ppDollJester ppLong rbMega byHorn byWide byTwin byWhirl byGreat byGreatWolf",
  // 단단함 79
  tough:
    "crBrace crPenance crThorn crGiant crRamWide sbSplash hfIron hfQuake sxLong sxGiant sxFull nlStun nlBind nlFuse sturdyHeart furySeal secondWind ricochet splitHead counterGuard bulwarkStance arcaneShield " +
    "tempestBreath barrier domain highLens energyRecycle balance ironBody nineLives wildRoar healthCare " +
    "robust smokeVeil oldPact bondShield hiddenPower ironWall scaleArmor scaleGuard blackMass apostate " +
    "featherShield eldestShield streetScars armorPlate titanHull idSprout idAcorn idThornShield " +
    "idAncientWall bearHide scorpShell eleHerd elBeard elWard renStone renGuardPlus renWall renReflect " +
    "spRibbon spShield mkPlate mkBulk mkSpikes mkMeditate adWide adShield rdSlip rdGear bmMore bmSuit " +
    "afShield afGolem cyLeech cySkin trMark trCamo fgEcho fgBless mnHelmet mnMuscle mnCanary mnChain " +
    "zsNectar zsRetort pgPack pgSouvenir pgPostcard pgTent relicSilver relicWhite ironSkin puDisguise leArmor oxBulwark oxShard fnHowl fnVeteran ecCrown tkCoral lvShell lvFlag tlFreedom mqFlagship hkWreck hkRum ocFoam wvArmor wvMist mrScale mrParry btVow btSilver btBreaker iaLedger iaKnot gbPlate gbThorns gbIron gbBulwark gbTitan rfSteady yrBulwark yrSanct yrGuard yrVigil yrGrace yrTouch yrBaptism mcHoard blRecoil jkGuard sdChain sdThorn ppDollRibbon rbHeavy rbFluff byGuard bsWall",
  // 바람 77
  wind:
    "crQuick crRamPow crRamGain icRushPow icDouble icLeapOften icKeep lnLunge lnAfterimage lnChain nlQuick nlRain lightGloves windBoots featherTip hunterEye dashCloak heavyPlate returnFletch chaseSteps chainBurst " +
    "overcharge mindEye yangForce cleanFreak bigger zone speedIsPower discipline rapidFire agility " +
    "overtreat doctorGown shadowRush silentStep haste clockwork mirageStep nomadSpirit cloudRide duckWalk " +
    "lastMag backAlleyRun oniTyphoonEye oniGale oniTwinWind idBreeze idPetal idSplitArrow idRootArrow " +
    "eagleStorm eagleDive flyWings flyAfterburn elMore elDouble renRootPulse renMoss eaAbyss eaFrenzy " +
    "rdTurbo rdDrift bmWide bmFuse afCrafter afSurge cyReflex cyCloak rmSwift wdWind wdRonin wdFocus " +
    "wdBlink skFast skAgile vySandglass vySeaLegs zsCloud pgBoots pgSnack pgShortcut pgWorldLeaf fkGrip " +
    "lxSwift clWhiteBow clPistol relicBlue fallenWings quickDraw puShrink puCloud puFlute lePounce oxWings oxLanding oxQuick oxTrail fnGale ecTwilight tkSail tkGull lvSurf lvAnchorless lvAmber tlChain mqBroadside hkSwing ocSurf ocSeaWind wvSurf wvSpout wvWings wvSpiral mrSurf mrCourse btSwift iaSpool iaWeave iaSnare gbBash snSpin snWing snReach snTempo rfTail rfFeather rfEye rfRain rfReach mcTempo mcStorm blPump blFlare jkRecall jkAccel sdCrane sdWings sdSakura sdButterfly sdComet ppDollDancer ppClone rbEars rbHop byStep",
  // 행운 53
  luck:
    "cloverCharm resolve prajna luckyDeflect gunMaster scrapGun doubleEcho echoBurst soulHarvest " +
    "twinSummon scarabCharm reboundRing longBreath lingering starfall starWard eclipse armillary " +
    "goldenFeather bigQuack quickSwap threeAsOne idClover idBreaker flyEvade flyGust renAmber renRegrow " +
    "eaGluttony eaEcho adSalvo adEcho afLucky afBlueprint trRicochet trDrum mnLamp mnVein mnGold " +
    "mnJackpot vyTwinDice vyLoadedDie pgClover pgRummage pgDoubleBag pgEcho pgStamp pgLuckyCoin clGoldBow " +
    "clGoldFist clGoldSpear godShard goldTooth puThief puBanner fnWisdom tkCompass lvWhite hkPlunder snGrace rfTwin mcDouble mcEcho jkDraw jkDouble jkSleeve jkSeven jkFullHouse sdClock ppSpool rbLucky rbClover",
  // 소환 28
  summon:
    "genesis pet supportFire extraCat packLeader fishTreat horde lash empower sacrifice returnWind " +
    "quickCatch extraDuckling loudQuack duckFamily breadSnack echoQuack braveDuckling spBond spLonger " +
    "spFury spAwaken spFarewell spHarmony adCall adFourth petFlute falseHero puClone mqRig mqSquadron hkGrapnel ocBreath ocLiberty wvButterfly wvMirror wvSchool wvRope sdDragon ppGolem ppCrown ppDance rbSeal byWisp",
  // 피 27
  blood:
    "icSense icEndless icDrink icBurst icCarnage icTrail icVortex icIron icQuake sbBurst sbFlask sbBless sbBelt sbPurify hfRend hfBlood hfFrenzy hfLeech sxRust sxHead sxHarvest sxChain nlBleed nlRelent seekerFeather huntFrenzy lifeLeech rage drunkenFist bloodDemon bleed bloodBlade loyalty rustyEdge " +
    "grewTogether batDrain slPact slThirst slNumb slMassacre rmBlood wdDeep wdRain skFrenzy skBlood " +
    "clBloodSword clChainCleaver clBloodBow clCrossbow clRedSpear clBloodHammer fnHunt tlBlood tlFeast btOath mcFrenzy mcMadness blBlood blHunter blNight jkHeart ppStitch",
};

const TAG_OF = new Map<string, ItemTag>();
for (const tag of ITEM_TAGS) for (const id of MEMBERS[tag].split(" ")) TAG_OF.set(id, tag);

/** 패시브의 꼬리표 (없으면 undefined) */
export function passiveTag(id: string): ItemTag | undefined {
  return TAG_OF.get(id);
}

/** 꼬리표가 붙은 패시브 id 전체 (테스트·도감용) */
export function taggedPassiveIds(): string[] {
  return [...TAG_OF.keys()];
}
