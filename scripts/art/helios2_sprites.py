# 시즌 2 헬리오스 캐릭터 방향 시트 (python3 scripts/art/helios2_sprites.py) → apps/client/public/sprites/{plague,slayer,eater,mukin,samyeol}.png
# 그림체는 s2_common.person (시즌 1 그림체: 얼굴 아래 4줄·입 없음·보랏빛 테두리, docs/ART.md)
# 역병의사(남): 챙 넓은 검은 모자 · 하얀 새부리 가면(초록 유리 눈) · 검은 가죽 긴 코트 · 허리의 향로
# 이터: 온몸이 검고 붉은 눈 · 얼굴 아래와 몸 군데군데 새하얀 늑대 이빨 · 발밑 그림자 자락
# 묵인(남, 48칸 큰 몸): 판금 가슴·큰 어깨 갑옷·굵은 팔다리 · 붉은 허리 천 · 입을 가린 쇠 가면
# 사멸(여, 사천 당가): 올림머리에 꽂은 은침 · 몸에 붙는 보랏빛 비단 옷(높은 깃·옆트임·비취색 단) · 공격 때 손끝에 펼친 독침
# 학살자(여): 핏빛이 도는 검붉은 긴 머리 · 창백한 얼굴에 튄 피 · 붉은 눈과 섬뜩한 웃음(이 캐릭터만 입을 그림) · 어깨가 드러난 검은 코르셋 · 48칸 시트에 든 거대한 대낫
from s2_common import hx, person, save_sheet

PLAGUE = dict(
    skin=hx("#e8dcc0"), skinD=hx("#b8a888"), eye=hx("#2a4a1a"), eyeL=hx("#9aff6a"), outline=hx("#4e4262"), blush=None,
    top=hx("#2a2430"), arm=hx("#2a2430"), legs=hx("#1e1a24"), legsD=hx("#141018"), shoe=hx("#3a2a1a"),
    hair=hx("#1e1a24"), hairD=hx("#141018"), hairL=hx("#3a3446"),
    brim=hx("#2e2838"), coat=hx("#2a2430"), coatL=hx("#3e3648"), belt=hx("#6a4a2a"), brass=hx("#c8a040"), beak=hx("#f0e8d8"), beakD=hx("#c8b898"), smoke=hx("#9aa86a"),
)

def plague_deco(c, layer, g):
    k = g["k"]
    v, hx0, hy, hw, hh = g["view"], g["hx"], g["hy"], g["hw"], g["hh"]
    tx, ty, tw, th, cx = g["tx"], g["ty"], g["tw"], g["th"], g["cx"]
    fy = hy + hh - 4
    if layer == "legs":
        # 발목까지 내려오는 긴 코트 자락
        hip = g["hip"]
        for i, y in enumerate(range(hip - 1, 27)):
            w = tw + i // 3
            c.rect(cx - w // 2, y, w, 1, k["coat"])
            if v == "front": c.px(cx, y, k["coatL"])
    if layer == "body":
        # 코트 깃 · 허리띠와 놋쇠 향로
        if v in ("front", "back"):
            c.rect(tx - 1, ty, tw + 2, 2, k["coatL"]); c.rect(tx, g["hip"] - 2, tw, 1, k["belt"])
            if v == "front": c.px(tx + tw - 1, g["hip"] - 1, k["brass"]); c.px(tx + tw - 1, g["hip"], k["brass"]); c.px(tx + tw, g["hip"] + 1, k["smoke"])
        else:
            c.rect(cx - 3, ty, 6, 2, k["coatL"]); c.rect(cx - 3, g["hip"] - 2, 6, 1, k["belt"])
    if layer == "hair":
        # 새부리 가면: 얼굴 칸을 가면 색으로, 초록 유리 눈, 앞(옆모습은 오른쪽)으로 튀어나온 부리
        if v == "front":
            c.rect(hx0 + 1, fy, hw - 2, 4, k["beak"])
            for ex in (hx0 + 2, hx0 + hw - 4):
                c.rect(ex, fy, 2, 2, k["eye"]); c.px(ex, fy, k["eyeL"])
            # 아래로 길게 늘어진 부리 (가슴까지)
            bx = hx0 + hw // 2 - 1
            c.rect(bx, fy + 2, 2, 4, k["beakD"]); c.px(bx, fy + 2, k["beak"]); c.px(bx + 1, fy + 3, k["beak"]); c.px(bx, fy + 6, k["beakD"])
        elif v == "side":
            sx = hx0 + hw - 4
            c.rect(sx, fy, 4, 4, k["beak"]); c.rect(sx + 1, fy, 2, 2, k["eye"]); c.px(sx + 1, fy, k["eyeL"])
            c.rect(hx0 + hw, fy + 2, 3, 2, k["beak"]); c.px(hx0 + hw + 3, fy + 3, k["beakD"])
        # 챙 넓은 검은 모자
        c.rect(hx0, hy - 3, hw, 4, k["hair"]); c.rect(hx0, hy - 1, hw, 1, k["belt"])
    if layer == "hat":
        # 챙 넓은 모자 (다듬기에서 깎이지 않게 머리카락과 다른 색)
        c.rect(hx0 - 2, hy + 1, hw + 4, 1, k["brim"])

SLAYER = dict(
    skin=hx("#f6e4dc"), skinD=hx("#d0b0aa"), eye=hx("#5a0010"), eyeL=hx("#ff2a3a"), outline=hx("#4e4262"), blush=hx("#e85a6a"),
    top=hx("#1a0a10"), arm=hx("#f6e4dc"), legs=hx("#1a0e14"), legsD=hx("#120a0e"), shoe=hx("#0e060a"),
    hair=hx("#a01828"), hairD=hx("#5a0a16"), hairL=hx("#e8505e"),
    blood=hx("#d81e2e"), bloodD=hx("#7a0a14"), grin=hx("#ffffff"), lace=hx("#c81e2a"), skirt=hx("#2a0a12"), trim=hx("#d81e2e"),
    steel=hx("#c8ccd8"), steelL=hx("#f4f6ff"), steelD=hx("#8a90a0"), haft=hx("#2a1414"), haftL=hx("#4a2424"), mouth=hx("#3a0612"),
)

def slayer_deco(c, layer, g):
    k = g["k"]
    v, hx0, hy, hw, hh = g["view"], g["hx"], g["hy"], g["hw"], g["hh"]
    tx, ty, tw, th, cx, hip = g["tx"], g["ty"], g["tw"], g["th"], g["cx"], g["hip"]
    fy = hy + hh - 4
    if layer == "back_hair":
        # 허리까지 흘러내린 핏빛 머리
        if v != "back": c.rect(hx0 - 1, hy + 3, hw + 2, hh + 8, k["hairD"])
    if layer == "legs":
        # 짧은 검은 치마(핏빛 단·옆트임) · 허벅지 위 맨살 · 검은 허벅지 부츠
        if v in ("front", "back"):
            for i in range(3): c.rect(tx - 1 - i // 2, hip + i, tw + 2 + i, 1, k["skirt"])
            c.rect(tx - 2, hip + 3, tw + 4, 1, k["trim"])
            if v == "front": c.px(cx + 2, hip + 1, k["skin"]); c.px(cx + 2, hip + 2, k["skin"])
            for lx in (cx - tw // 2 + 1, cx + tw // 2 - 3):
                c.rect(lx, hip + 4, 2, 2, k["skin"]); c.rect(lx, hip + 6, 2, 1, k["lace"])
        else:
            for i in range(3): c.rect(cx - 4, hip + i, 8, 1, k["skirt"])
            c.rect(cx - 4, hip + 3, 8, 1, k["trim"]); c.rect(cx - 2, hip + 4, 4, 2, k["skin"]); c.rect(cx - 2, hip + 6, 4, 1, k["lace"])
    if layer == "body":
        # 어깨가 드러난 검은 코르셋(핏빛 끈) · 붉은 초커 · 튄 피
        if v in ("front", "back"):
            # 목 아래는 검게 (턱이 넓어 보이지 않게, 맨살은 팔에만) · 가슴의 붉은 단
            c.rect(tx, ty, tw, th, k["top"]); c.rect(tx + 1, ty + 1, tw - 2, 1, k["trim"])
            for y in range(ty + 4, hip - 1, 2): c.px(cx - 1, y, k["lace"]); c.px(cx, y + 1, k["lace"])
        else:
            c.rect(cx - 3, ty, 6, th, k["top"])
            c.rect(cx - 3, ty + 2, 6, th - 2, k["top"]); c.rect(cx - 3, ty + 2, 6, 1, k["trim"]); c.px(cx, ty + 4, k["lace"])
    if layer == "hair":
        if v == "back":
            c.rect(hx0 - 1, hy, hw + 2, hh + 8, k["hair"]); c.rect(hx0, hy + hh + 6, hw, 2, k["hairD"])
            c.px(hx0 + 2, hy + hh + 2, k["hairL"]); c.px(hx0 + hw - 3, hy + hh + 4, k["hairL"])
        elif v == "front":
            # 양옆으로 흘러내린 머리 (얼굴은 가리지 않음)
            c.rect(hx0, hy, hw, 3, k["hair"]); c.rect(hx0 - 1, hy + 1, 2, hh + 6, k["hair"]); c.rect(hx0 + hw - 1, hy + 1, 2, hh + 6, k["hair"])
            # 섬뜩한 미소 (이 캐릭터만 입): 갸름한 턱 가운데 작게 · 입꼬리만 살짝 · 뺨에 튄 피 한 점
            mx = hx0 + hw // 2
            c.px(mx - 1, fy + 3, k["grin"]); c.px(mx, fy + 3, k["grin"])
        else:
            c.rect(hx0, hy, hw, 3, k["hair"]); c.rect(hx0 - 1, hy + 1, 4, hh + 8, k["hair"])
            c.px(hx0 + hw - 3, fy + 3, k["grin"])
    if layer == "hat":
        scythe(c, g)

def scythe(c, g):
    """그림 안의 거대한 대낫 (48칸): 자루와 날이 같은 길이 · 날은 머리 위를 가로질러 뻗어 크게 휨 · 공격 칸에선 앞으로 기울여 듦"""
    k = g["k"]
    v, hy, cx, ty, tx, tw = g["view"], g["hy"], g["cx"], g["ty"], g["tx"], g["tw"]
    haft = k["haft"]
    top = hy - (14 if k.get("rage") else 9)
    hxp = tx + tw + 3 if v == "front" or (v == "side" and g["cast"]) else tx - 4 if v == "back" else cx - 7
    lean = 4 if g["cast"] else 0
    L = 42 - top
    # 긴 자루 (발목 위부터 머리 위까지, 공격 칸은 앞으로 기울임) · 손잡이 피 묻은 띠
    c.line(hxp, 42, hxp - lean, top, haft); c.line(hxp + 1, 42, hxp + 1 - lean, top, k["haftL"])
    c.rect(hxp, ty + 4, 2, 2, k["blood"])
    # 날: 자루 끝에서 머리 위를 가로질러 자루만큼 뻗음 (앞·옆모습은 왼쪽, 뒷모습은 오른쪽)
    d = 1 if v == "back" or (v == "side" and not g["cast"]) else -1
    blade(c, hxp - lean, top, False, L, d, k)

def blade(c, x0, y0, up, L, d, k):
    """대낫 날: (x0,y0)에서 d쪽으로 길이 L, 두껍게 시작해 가늘어지며 끝이 아래로 크게 휨 · 등은 은빛, 날 끝은 핏빛
    날 가운데에 이빨 드러낸 입 하나 · 피의 학살 모습(k["rage"])이면 날의 절반을 피가 덮음"""
    rage = k.get("rage")
    for i in range(L + 1):
        t = i / L
        w = max(1, round(8 * (1 - t) + 1))
        bend = round(L * 0.42 * t ** 3)
        for j in range(w):
            col = k["steelL"] if j == 0 else k["blood"] if j == w - 1 and w > 2 else k["steelD"] if j >= w - 3 else k["steel"]
            # 피의 학살: 날 아래쪽 절반이 피로 젖고, 군데군데 핏방울이 등까지 번짐
            if rage and j >= w // 2 and j > 0: col = k["bloodD"] if (i + j) % 3 == 0 else k["blood"]
            if rage and j == 1 and i % 4 == 1: col = k["blood"]
            c.px(x0 + d * i, y0 + bend + j - 2, col)
    # 피의 학살: 날에 찢어진 웃음 (입꼬리가 크게 올라간 초승달 입 · 위아래 이빨 · 찢어진 입가)
    if rage:
        my = y0 + 1
        for i in range(3, 17):
            dx = i - 10
            dip = round(2.6 - dx * dx * 0.08)
            h = 3 if abs(dx) <= 4 else 2 if abs(dx) <= 6 else 1
            for r in range(-1, h + 1): c.px(x0 + d * i, my + dip + r - 1, k["mouth"])
            # 위 이빨(뾰족하게 아래로) · 아래 이빨(엇갈려 위로)
            if h > 1 and i % 3: c.px(x0 + d * i, my + dip - 1, k["grin"])
            if h > 2 and i % 3 == 1: c.px(x0 + d * i, my + dip + 1, k["grin"])
        # 찢어진 입가: 양 끝이 위로 길게 찢겨 올라감
        for e, a in ((3, -1), (16, 1)):
            for n in range(1, 3): c.px(x0 + d * (e + a * n), my - n - 1, k["bloodD"])
    tip = (x0 + d * L, y0 + round(L * 0.42) - 2)
    c.px(tip[0], tip[1] + 1, k["blood"]); c.px(tip[0], tip[1] + 2, k["bloodD"])
    if rage:
        for dy in (3, 4, 6): c.px(tip[0] - d, tip[1] + dy, k["blood"])

EATER = dict(
    skin=hx("#2a2232"), skinD=hx("#1a1420"), eye=hx("#ff2030"), eyeL=hx("#ff6a6a"), outline=hx("#4e4262"), blush=None,
    top=hx("#1e1824"), arm=hx("#1e1824"), legs=hx("#16121c"), legsD=hx("#0e0a12"), shoe=hx("#0e0a12"),
    hair=hx("#120e18"), hairD=hx("#0a0810"), hairL=hx("#2e2638"),
    tooth=hx("#f4f0f8"), gum=hx("#8a1424"), wisp=hx("#3a2a4a"),
)

def eater_deco(c, layer, g):
    k = g["k"]
    v, hx0, hy, hw, hh = g["view"], g["hx"], g["hy"], g["hw"], g["hh"]
    tx, ty, tw, th, cx = g["tx"], g["ty"], g["tw"], g["th"], g["cx"]
    fy = hy + hh - 4
    if layer == "legs":
        # 발밑에서 꿈틀대는 그림자 자락
        for i, x in enumerate(range(cx - 6, cx + 7, 3)):
            c.px(x + (g["step"] + i) % 2, 27 + i % 2, k["wisp"]); c.px(x, 28, k["hairD"])
    if layer == "body":
        # 몸 군데군데 늑대 이빨 (어깨 · 가슴 · 옆구리)
        if v in ("front", "back"):
            for x0, y0 in ((tx - 2, ty), (tx + tw - 1, ty + 1), (tx + 2, ty + 4)):
                for i in range(3): c.px(x0 + i, y0 + (i % 2), k["tooth"])
                c.px(x0 + 1, y0 + 2, k["gum"])
        else:
            for i in range(3): c.px(cx - 2 + i, ty + 2 + (i % 2), k["tooth"])
    if layer == "hair":
        if v == "front":
            # 얼굴 아래 줄에 새하얀 이빨이 가득 (이 캐릭터만)
            for x in range(hx0 + 1, hx0 + hw - 1):
                c.px(x, fy + 3, k["tooth"] if (x - hx0) % 2 else k["gum"])
            c.px(hx0 + 2, fy + 2, k["tooth"]); c.px(hx0 + hw - 3, fy + 2, k["tooth"])
        elif v == "side":
            sx = hx0 + hw - 4
            c.px(sx + 1, fy + 3, k["tooth"]); c.px(sx + 3, fy + 3, k["tooth"]); c.px(sx + 2, fy + 3, k["gum"])
        # 귀처럼 솟은 그림자 뿔 둘
        c.px(hx0, hy - 1, k["hair"]); c.px(hx0 + 1, hy - 2, k["hair"]); c.px(hx0 + hw - 1, hy - 1, k["hair"]); c.px(hx0 + hw - 2, hy - 2, k["hair"])

MUKIN = dict(
    skin=hx("#c8906a"), skinD=hx("#9a6a4a"), eye=hx("#2a1a14"), outline=hx("#4e4262"), blush=None, smallEye=True,
    top=hx("#5a5e6a"), arm=hx("#c8906a"), legs=hx("#3a3440"), legsD=hx("#2a2430"), shoe=hx("#2a2026"),
    hair=hx("#2a2026"), hairD=hx("#1a1418"), hairL=hx("#4a3e44"),
    plate=hx("#7a808e"), plateL=hx("#a8aebc"), plateD=hx("#464a56"), cloth=hx("#8a1a24"), clothD=hx("#5a0e16"), mask=hx("#6a6e7a"), rivet=hx("#d8b060"),
)

def mukin_deco(c, layer, g):
    k = g["k"]
    v, hx0, hy, hw, hh = g["view"], g["hx"], g["hy"], g["hw"], g["hh"]
    tx, ty, tw, th, cx, hip = g["tx"], g["ty"], g["tw"], g["th"], g["cx"], g["hip"]
    fy = hy + hh - 4
    foot = 45
    if layer == "legs":
        # 굵은 다리 · 무릎 갑옷 · 허리에 늘어진 붉은 천
        if v in ("front", "back"):
            lift = (0, 1, 0, -1)[g["step"]] if not g["cast"] else 0
            for lx, up in ((cx - tw // 2 + 1, max(0, lift)), (cx + tw // 2 - 6, max(0, -lift))):
                c.rect(lx, hip, 5, foot - hip - up, k["legs"]); c.rect(lx, hip + 5 - up, 5, 3, k["plateD"]); c.px(lx + 2, hip + 6 - up, k["plateL"])
                c.rect(lx - 1, foot - 2 - up, 7, 2, k["shoe"])
            c.rect(cx - 3, hip - 1, 6, 9, k["cloth"]); c.rect(cx - 3, hip + 7, 6, 1, k["clothD"])
        else:
            sw = (0, 3, 0, -3)[g["step"]] if not g["cast"] else 0
            for x0, col in ((cx - 3 - sw, k["legsD"]), (cx - 2 + sw, k["legs"])):
                c.rect(x0, hip, 5, foot - hip, col); c.rect(x0, hip + 5, 5, 3, k["plateD"]); c.rect(x0, foot - 2, 7, 2, k["shoe"])
            c.rect(cx - 1, hip - 1, 4, 8, k["cloth"])
    if layer == "body":
        # 두꺼운 판금 가슴 · 큰 어깨 갑옷 · 굵은 맨팔
        if v in ("front", "back"):
            c.rect(tx, ty, tw, th, k["plate"]); c.rect(tx + 1, ty + 1, tw - 2, 1, k["plateL"]); c.rect(tx, ty + th - 3, tw, 3, k["plateD"])
            c.rect(tx, ty + th - 4, tw, 1, k["cloth"])
            if v == "front":
                for x in (tx + 2, tx + tw - 3): c.px(x, ty + 3, k["rivet"])
                c.rect(cx - 1, ty + 4, 2, 5, k["plateD"])
            sw = (0, 1, 0, -1)[g["step"]] if not g["cast"] else 0
            for ax, d in ((tx - 5, sw), (tx + tw + 1, -sw)):
                if g["cast"] and v == "front" and ax > cx:
                    c.rect(ax, ty + 3, 9, 4, k["arm"]); c.rect(ax + 9, ty + 2, 3, 6, k["plateD"])  # 앞으로 내지른 주먹
                    continue
                c.rect(ax, ty + 3 + d, 4, th - 1, k["arm"]); c.rect(ax, ty + th + d, 4, 3, k["plateD"])
            for ax in (tx - 6, tx + tw - 2):
                c.rect(ax, ty - 1, 8, 4, k["plate"]); c.rect(ax + 1, ty - 1, 6, 1, k["plateL"]); c.px(ax + 3, ty + 1, k["rivet"])
        else:
            c.rect(cx - 7, ty, 15, th, k["plate"]); c.rect(cx - 7, ty + th - 4, 15, 1, k["cloth"]); c.rect(cx - 7, ty + th - 3, 15, 3, k["plateD"])
            c.rect(cx - 6, ty - 1, 11, 6, k["plate"]); c.rect(cx - 5, ty - 1, 9, 1, k["plateL"]); c.px(cx - 1, ty + 2, k["rivet"])
            if g["cast"]:
                c.rect(cx, ty + 4, 12, 4, k["arm"]); c.rect(cx + 12, ty + 3, 3, 6, k["plateD"])
            else:
                sw = (0, 2, 0, -2)[g["step"]]
                c.rect(cx - 2 + sw, ty + 4, 4, th - 2, k["arm"]); c.rect(cx - 2 + sw, ty + th + 1, 4, 3, k["plateD"])
    if layer == "hair":
        # 입을 가린 쇠 가면 (말이 없는 자) · 짧게 깎은 머리 · 이마의 흉터
        if v == "front":
            c.rect(hx0 + 1, fy + 2, hw - 2, 2, k["mask"]); c.rect(hx0 + 2, fy + 3, hw - 4, 1, k["plateD"])
            c.px(hx0 + 3, fy + 2, k["rivet"]); c.px(hx0 + hw - 4, fy + 2, k["rivet"])
            c.px(hx0 + hw - 4, fy - 1, k["skinD"])
        elif v == "side":
            sx = hx0 + hw - 4
            c.rect(sx, fy + 2, 4, 2, k["mask"]); c.px(sx + 1, fy + 2, k["rivet"])

SAMYEOL = dict(
    skin=hx("#f4e2d8"), skinD=hx("#d0b4a8"), eye=hx("#4a1a5a"), eyeL=hx("#a86ad8"), outline=hx("#4e4262"), blush=hx("#e88a9a"),
    top=hx("#3a1448"), arm=hx("#f4e2d8"), legs=hx("#f4e2d8"), legsD=hx("#d0b4a8"), shoe=hx("#2a0e34"),
    hair=hx("#1a1424"), hairD=hx("#0e0a16"), hairL=hx("#3e3254"),
    dress=hx("#3a1448"), dressL=hx("#5a2a6a"), jade=hx("#3ad87a"), gold=hx("#e8c060"), pin=hx("#d8dce8"), gasL=hx("#8aff9a"),
)

def samyeol_deco(c, layer, g):
    k = g["k"]
    v, hx0, hy, hw, hh = g["view"], g["hx"], g["hy"], g["hw"], g["hh"]
    tx, ty, tw, th, cx, hip = g["tx"], g["ty"], g["tw"], g["th"], g["cx"], g["hip"]
    fy = hy + hh - 4
    if layer == "back_hair":
        # 뒤로 길게 늘어뜨린 머리
        if v != "back": c.rect(hx0, hy + 3, hw, hh + 4, k["hairD"])
    if layer == "legs":
        # 발목까지 오는 몸에 붙는 긴 치마 · 옆트임 사이로 다리 · 비취색 단
        if v in ("front", "back"):
            for i, y in enumerate(range(hip - 1, 27)):
                w = tw - 1 + i // 4
                c.rect(cx - w // 2, y, w, 1, k["dress"])
            c.rect(cx - (tw + 3) // 2, 26, tw + 3, 1, k["jade"])
            if v == "front":
                c.line(cx + 2, hip + 2, cx + 2, 26, k["legs"]); c.line(cx + 1, hip + 3, cx + 1, 26, k["skinD"])
        else:
            for y in range(hip - 1, 27): c.rect(cx - 3, y, 6, 1, k["dress"])
            c.rect(cx - 3, 26, 6, 1, k["jade"]); c.line(cx + 2, hip + 3, cx + 2, 25, k["legs"])
    if layer == "body":
        # 몸에 붙는 비단 윗옷 · 높은 깃 · 금빛 매듭 단추 · 허리 비취 띠
        if v in ("front", "back"):
            c.rect(tx, ty, tw, th, k["dress"]); c.rect(tx + 1, ty, tw - 2, 1, k["dressL"])
            c.rect(tx, hip - 2, tw, 1, k["jade"])
            if v == "front":
                c.px(cx, ty + 1, k["gold"]); c.px(cx + 1, ty + 2, k["gold"]); c.px(cx + 2, ty + 3, k["gold"])
                c.px(tx + 1, ty + 3, k["dressL"]); c.px(tx + tw - 2, ty + 3, k["dressL"])
        else:
            c.rect(cx - 3, ty, 6, th, k["dress"]); c.rect(cx - 3, hip - 2, 6, 1, k["jade"]); c.px(cx + 2, ty + 1, k["gold"])
        if g["cast"]:
            # 손끝에 부채처럼 펼친 독침
            x0 = tx + tw + 5 if v == "front" else cx + 8
            for d in (-2, 0, 2): c.line(x0, ty + 2, x0 + 3, ty + 2 + d, k["pin"])
            c.px(x0 + 3, ty, k["gasL"]); c.px(x0 + 3, ty + 4, k["gasL"])
    if layer == "hair":
        # 올림머리(쪽머리) · 머리에 꽂은 은침 둘 · 비취 장식
        if v == "front":
            c.rect(hx0, hy, hw, 3, k["hair"]); c.rect(hx0, hy + 1, 1, hh - 3, k["hair"]); c.rect(hx0 + hw - 1, hy + 1, 1, hh - 3, k["hair"])
            c.rect(hx0 + 2, hy - 3, hw - 4, 3, k["hair"])
        elif v == "back":
            c.rect(hx0 + 2, hy - 3, hw - 4, 3, k["hair"]); c.rect(hx0, hy, hw, hh, k["hair"])
        else:
            c.rect(hx0, hy, hw, 3, k["hair"]); c.rect(hx0, hy + 1, 4, hh, k["hair"]); c.rect(hx0, hy - 3, 5, 3, k["hair"])
        bx = hx0 + 2 if v != "side" else hx0
        c.line(bx - 2, hy - 4, bx + 3, hy - 1, k["pin"]); c.line(bx + hw - 5, hy - 5, bx + hw - 1, hy - 2, k["pin"])
        c.px(bx + 1, hy - 2, k["jade"]); c.px(bx + 2, hy - 2, k["gold"])

# 피의 학살 모습: 피에 젖은 몸 · 광기 어린 붉은 눈 · 더 크게 찢어진 웃음 · 공중으로 붕 뜬 머리카락 (그래도 예쁜 얼굴)
SLAYER_RAGE = dict(SLAYER, rage=True, eye=hx("#ff1030"), eyeL=hx("#ffe0e8"), hair=hx("#c8142a"), hairL=hx("#ff6070"), hairD=hx("#6a0818"), blush=hx("#ff4a5a"), tipH=hx("#c9152b"), tipL=hx("#ff6171"), tipD=hx("#6b0919"))

def slayer_rage_deco(c, layer, g):
    k = g["k"]
    v, hx0, hy, hw, hh = g["view"], g["hx"], g["hy"], g["hw"], g["hh"]
    tx, ty, tw, th, cx, hip = g["tx"], g["ty"], g["tw"], g["th"], g["cx"], g["hip"]
    fy = hy + hh - 4
    if layer == "back_hair":
        # 머리카락이 중력 없이 둥실 떠오름: 어깨 아래로 치마처럼 넓게 퍼지고 끝은 물결치며 바깥으로 말려 올라감
        # (몸 뒤에만 그려서 대낫과 떨어져 보이게)
        sway = g["step"] % 2
        top, n = hy + 2, hh + 2
        for j in range(n):
            t = j / (n - 1)
            half = hw // 2 + 1 + round(4 * t ** 1.2)
            for x in range(cx - half, cx + half):
                edge = x in (cx - half, cx + half - 1)
                strand = (x - cx) % 4 == 1 and t > 0.3
                c.px(x, top + j, k["hairD"] if edge else k["hairL"] if strand else k["hair"])
        # 머리끝: 다발 여섯 개가 바깥으로 갈수록 높이 떠올라 물결치며 위로 말림
        base = top + n
        for side in (-1, 1):
            for m, (out, rise, ln) in enumerate(((0, -1, 3), (1, 2, 5), (2, 5, 6))):
                x0 = cx + side * (hw // 2 + out) - (1 if side > 0 else 0)
                y0 = base - rise - (sway if m == 1 else 0)
                for i in range(ln):
                    x = x0 + side * i
                    y = y0 - (i * i) // 7
                    # 다듬기(soften)에 깎이지 않게 머리끝은 따로 색 이름을 씀
                    c.px(x, y, k["tipH"]); c.px(x, y - 1, k["tipH"] if i < ln - 1 else k["tipL"])
                    if i == 0: c.px(x, y + 1, k["tipD"])
        return
    if layer == "hat":
        # 정수리 위로 짧게 뻗친 두 가닥
        c.px(hx0 + 3, hy - 1, k["hair"]); c.px(hx0 + 2, hy - 2, k["hairL"])
        c.px(hx0 + hw - 4, hy - 1, k["hair"]); c.px(hx0 + hw - 3, hy - 2, k["hairL"])
    slayer_deco(c, layer, g)

GEO = {
    "plague": dict(head=(10, 9), torso=(9, 8), leg=8),
    "slayer": dict(head=(10, 9), torso=(8, 7), leg=8, size=48),
    "eater": dict(head=(10, 9), torso=(9, 7), leg=8),
    "mukin": dict(head=(12, 11), torso=(18, 14), leg=13, size=48),
    "samyeol": dict(head=(10, 9), torso=(8, 7), leg=8),
}

def main():
    save_sheet("plague", lambda r, col: person(PLAGUE, r, col, GEO["plague"], plague_deco))
    save_sheet("slayer", lambda r, col: person(SLAYER, r, col, GEO["slayer"], slayer_deco), size=48)
    save_sheet("skins/slayer_rage", lambda r, col: person(SLAYER_RAGE, r, col, GEO["slayer"], slayer_rage_deco), size=48)
    save_sheet("eater", lambda r, col: person(EATER, r, col, GEO["eater"], eater_deco))
    save_sheet("mukin", lambda r, col: person(MUKIN, r, col, GEO["mukin"], mukin_deco), size=48)
    save_sheet("samyeol", lambda r, col: person(SAMYEOL, r, col, GEO["samyeol"], samyeol_deco))

if __name__ == "__main__":
    main()
