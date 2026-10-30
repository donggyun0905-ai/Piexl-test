# 고해상도 시범: 마법사 '별빛 마법사' (python3 scripts/art/hd_mage.py) → apps/client/public/sprites/mage.png (64칸, 게임에서는 32칸으로 줄여 그림)
# 손으로 찍은 몸 틀(hd_doll) 위에 덧칠: 라벤더 그늘의 은빛 긴 머리 · 금 이마띠와 하늘빛 보석 · 초승달 핀 · 남색 로브(금 테·별 무늬·금 허리띠)
# 흰 어깨 망토 · 흰 높은 깃과 보석 브로치 · 검은 스타킹·남색 구두 · 수정 지팡이 · 공격 줄은 지팡이를 들어 별빛을 모음
from hd_common import mix, outline, save, tones
from hd_doll import CX, Cell, bangs, clump_hair, face, face_side, hair_cap, hx, legs

K = dict(
    skin=hx("#fce6d6"), iris=hx("#7a68e8"),
    hair=hx("#d8d0f2"), hairL=hx("#f8f6ff"), hairD=hx("#a59ad6"), hairX=hx("#7d72b4"),
    robe=hx("#2c3478"), trim=hx("#f2c84a"), cape=hx("#f4f4fb"), gem=hx("#7ae8ff"), staff=hx("#8a6038"),
    legs=hx("#2a2448"), shoe=hx("#262c64"), star=hx("#fff6c0"),
)
TIPS = [(20, 3, 17), (23, 3, 18), (26, 3, 16), (29, 3, 15), (32, 2, 15), (34, 3, 16), (37, 3, 18), (40, 3, 17)]


def back_hair(c, y0, y1, x0, x1, sway, v=0):
    """등 뒤 긴 머리: 결 줄 · 끝은 갈라져 뾰족 · v: 아래 끝을 V자로 (뒷모습)"""
    l, b, d, x_ = K["hairL"], K["hair"], K["hairD"], K["hairX"]
    mid = (x0 + x1) / 2
    for y in range(y0, y1 + 1):
        k = (y - y0) / (y1 - y0)
        s = round(sway * k)
        for x in range(x0, x1 + 1):
            if y > y1 - 2 and (x - x0) % 4 in (0, 3): continue
            if v and y > y1 - v + abs(x - mid) * 0.0 and abs(x - mid) > (y1 - y) * (x1 - x0) / (2 * v): continue
            col = x_ if x in (x0, x1) else d if (x - x0) % 5 == 0 or x >= x1 - 2 else l if (x - x0) % 5 == 2 and k < 0.25 else b
            c.px(x + s, y, col)


def side_locks(c, y0, y1):
    """얼굴 양옆을 감싸 어깨 아래로 내려오는 옆머리 (얼굴선이 갸름해 보이게)"""
    l, b, d = K["hairL"], K["hair"], K["hairD"]
    for side, x0 in ((-1, 20), (1, 40)):
        for y in range(y0, y1 + 1):
            w = 4 if y < y1 - 6 else 3 if y < y1 - 2 else 2
            for i in range(w):
                x = x0 + i + (4 - w if side < 0 else 0)
                c.px(x, y, l if i == 1 and y < y0 + 6 else d if (i == w - 1) == (side > 0) else b)


def robe(c, dy, sway):
    """로브: 몸통 → 금 허리띠 → 아래로 퍼지는 치마 · 가운데 금 줄 · 별 무늬 · 금 단"""
    l, b, d = tones(K["robe"], 0.18)
    tl, tb, td = tones(K["trim"])
    for y in range(33 + dy, 55):
        # 좁은 어깨 → 살짝 들어간 허리(금 허리띠) → 아래로 퍼지는 치마
        yy = y - 33 - dy
        h = 6.5 - min(yy, 8) * 0.12 if yy <= 9 else 5.5 + (yy - 9) / 13 * 6.5
        s = round(sway * max(0, (yy - 11) / 11))
        for x in range(int(CX - h) + s, int(CX + h) + s):
            u = (x - (CX - h) - s) / (2 * h)
            c.px(x, y, (tb if y == 53 else td) if y >= 53 else l if u < 0.12 else d if u > 0.8 else b)
        if y < 53: c.px(CX - 1 + s, y, tb); c.px(CX + s, y, td)
    for x in range(CX - 6, CX + 6): c.px(x, 41 + dy, tb); c.px(x, 42 + dy, td if x % 3 else tl)
    for dx, yy in ((-5, 46), (4, 49), (-3, 51), (6, 45)): c.px(CX + dx, yy + dy, K["star"])


def arms(c, dy, raise_):
    """종 모양 소매 · 손 · 흰 깃 · 보석 브로치"""
    l, b, d = tones(K["robe"], 0.18)
    sk = K["skin"]
    for side in (-1, 1):
        up = raise_ and side > 0
        top = 34 + dy - (8 if up else 0)
        for j in range(11):
            w = 3 + j // 4
            x0 = CX + (6 if side > 0 else -6 - w) + (j // 5) * side + (2 if up else 0)
            for x in range(x0, x0 + w): c.px(x, top + j, l if x == x0 and side < 0 else d if x == x0 + w - 1 else b)
        hy = top + (-2 if up else 11)
        hx0 = CX + (9 if side > 0 else -12) + (2 if up else 0)
        for x in range(hx0, hx0 + 3):
            for y in range(hy, hy + 3): c.px(x, y, mix(sk, hx("#e8b8a0"), 0.3) if y == hy + 2 else sk)
    cl, cb, cd = tones(K["cape"], 0.1, 0.82)
    for y in range(31 + dy, 34 + dy):
        for x in range(CX - 5, CX + 5): c.px(x, y, cd if x >= CX + 3 or y == 33 + dy else cb)
    gd = mix(K["gem"], hx("#2060a0"), 0.4)
    for x, y, col in ((CX - 1, 35, K["gem"]), (CX, 35, K["gem"]), (CX - 1, 36, gd), (CX, 36, gd)): c.px(x, y + dy, col)


def cape(c, dy):
    cl, cb, cd = tones(K["cape"], 0.1, 0.82)
    for y in range(33 + dy, 47 + dy):
        h = 9 + (y - 33 - dy) / 14 * 3
        for x in range(int(CX - h), int(CX + h)): c.px(x, y, cd if x > CX + h - 3 else cb)


def circlet(c, dy):
    """금 이마띠 · 가운데 하늘빛 보석 · 왼쪽 초승달 핀"""
    tl, tb, td = tones(K["trim"])
    for x in range(CX - 14, CX + 14):
        e = 1 if abs(x - CX + 0.5) > 10 else 0
        c.px(x, 10 + dy + e, tb); c.px(x, 11 + dy + e, td)
    for x, y in ((CX - 1, 9), (CX, 9), (CX - 2, 10), (CX + 1, 10), (CX - 1, 11), (CX, 11)): c.px(x, y + dy, K["gem"])
    c.px(CX - 1, 10 + dy, hx("#ffffff")); c.px(CX, 10 + dy, mix(K["gem"], hx("#ffffff"), 0.5))
    for x, y in ((CX - 12, 7), (CX - 13, 8), (CX - 13, 9), (CX - 12, 10)): c.px(x, y + dy, tl)


def staff(c, x, y0, y1):
    """수정 지팡이: 갈색 자루(마디) · 금 발톱 · 하늘빛 수정"""
    l, b, d = tones(K["staff"])
    for y in range(y0 + 8, y1 + 1):
        c.px(x, y, l); c.px(x + 1, y, d if y % 7 == 0 else b)
    tl, tb, td = tones(K["trim"])
    for dx, dy in ((-1, 7), (2, 7), (-2, 5), (3, 5), (-2, 6), (3, 6), (0, 8), (1, 8)): c.px(x + dx, y0 + dy, tb if dx <= 0 else td)
    cl, cb, cd = tones(K["gem"], 0.55)
    for j in range(8):
        w = j if j < 4 else 7 - j
        for i in range(-w // 2, w // 2 + 1):
            c.px(x + i + (0 if i < 0 else 1), y0 - 1 + j, cl if i < 0 and j < 4 else cd if i > 0 and j >= 4 else cb)
    c.px(x, y0 + 1, hx("#ffffff"))


def front(col, cast):
    c = Cell(64)
    step = 0 if cast else col
    dy = 1 if step in (1, 3) else 0
    sway = (0, 1, 0, -1)[col]
    back_hair(c, 16 + dy, 48 + dy, 18, 45, sway)
    cape(c, dy)
    legs(c, K, step, dy)
    robe(c, dy, sway)
    arms(c, dy, cast)
    face(c, K, dy)
    hair_cap(c, K, 6, dy)
    bangs(c, K, TIPS, 12, dy)
    side_locks(c, 13 + dy, 41 + dy)
    circlet(c, dy)
    if cast: staff(c, 45, 12 - col + dy, 38 + dy)
    else: staff(c, 15, 12 + dy, 60)
    outline(c)
    if cast:
        for dx, dy2 in ((-4, -2), (4, -1), (0, -5), (-3, 4), (5, 3))[: 3 + col]:
            c.px(46 + dx, 14 - col + dy2, K["star"])
    return c


def back(col):
    c = Cell(64)
    dy = 1 if col in (1, 3) else 0
    sway = (0, 1, 0, -1)[col]
    legs(c, K, col, dy)
    robe(c, dy, sway)
    arms(c, dy, False)
    cape(c, dy)
    hair_cap(c, K, 6, dy)
    # 아래층(길게) → 위층(어깨까지, 바깥으로 살짝 뻗침) · 머리 위 윤기 고리
    clump_hair(c, K, 20, 43, 14 + dy, [46, 49, 51, 50, 51, 49, 47], sway)
    clump_hair(c, K, 18, 45, 8 + dy, [30, 33, 31, 34, 32, 33, 30], sway, shine=12 + dy)
    tl, tb, td = tones(K["trim"])
    for x in range(19, 45): c.px(x, 11 + dy + (1 if abs(x - CX) > 10 else 0), tb)
    # 뒤통수 금빛 리본: 매듭 · 양쪽 고리 · 늘어진 꼬리 둘
    for x, y, col in ((31, 16, tl), (32, 16, tb), (31, 17, td), (32, 17, td), (28, 15, tb), (29, 15, tb), (29, 16, td), (30, 16, tb),
                      (34, 15, tb), (35, 15, tb), (33, 16, tb), (34, 16, td), (30, 18, tb), (30, 19, td), (29, 20, tb), (33, 18, tb), (33, 19, td), (34, 20, tb)):
        c.px(x, y + dy, col)
    staff(c, 46, 12 + dy, 60)
    outline(c)
    return c


def side(col, cast):
    """옆(오른쪽): 뒤로 흐르는 머리 · 옆얼굴 · 앞으로 든 지팡이"""
    c = Cell(64)
    step = 0 if cast else col
    dy = 1 if step in (1, 3) else 0
    sway = (0, 1, 0, -1)[col]
    if not cast: staff(c, CX - 3, 12 + dy, 60)
    clump_hair(c, K, 17, 33, 14 + dy, [44, 48, 50, 47], -1 - abs(sway))
    cape(c, dy)
    st = (0, 3, 0, -3)[step]
    for i, dx in enumerate((-st, st)):
        dark = mix(K["legs"], hx("#000000"), 0.35) if i == 0 else K["legs"]
        lift = 1 if (step == 1 and i == 1) or (step == 3 and i == 0) else 0
        for y in range(53 + dy, 58 - lift):
            for x in range(30 + dx + (1 if y > 55 else 0) * (1 if dx > 0 else 0), 33 + dx): c.px(x, y, dark)
        for y in range(58 - lift, 61 - lift):
            for x in range(30 + dx, 36 + dx): c.px(x, y, mix(K["shoe"], hx("#000000"), 0.3) if i == 0 else K["shoe"])
    robe(c, dy, -abs(sway))
    l, b, d = tones(K["robe"], 0.18)
    reach = cast
    swing = (0, 2, 0, -2)[step]
    for j in range(11):
        off = j if reach else round(swing * j / 10)
        for x in range(CX - 1, CX + 3 + j // 4): c.px(x + off, 34 + dy + j - (6 if reach else 0), d if x == CX + 2 + j // 4 else b)
    hx0, hy0 = (CX + 12, 30 + dy) if reach else (CX + swing, 45 + dy)
    for x in range(hx0, hx0 + 3):
        for y in range(hy0, hy0 + 3): c.px(x, y, K["skin"])
    hair_cap(c, K, 6, dy)
    # 옆모습: 이마 앞으로 튀어나온 머리는 잘라 이마선을 따라가게
    hcols = {K["hair"], K["hairL"], K["hairD"]}
    for (x, y), v in list(c.p.items()):
        if v in hcols and y >= 11 + dy and x > CX + 9 - max(0, 13 + dy - y): del c.p[(x, y)]
    face_side(c, K, dy)
    # 머리 뒤쪽(왼쪽 반)은 머리카락 · 앞머리는 이마 위
    hb, hd = K["hair"], K["hairD"]
    for y in range(12 + dy, 30 + dy):
        for x in range(CX - 15, CX - 1 - max(0, (y - 26 - dy))): c.px(x, y, hd if x < CX - 13 else hb)
    clump_hair(c, K, CX - 16, CX - 2, 8 + dy, [28, 31, 29], 0, shine=12 + dy)
    bangs(c, K, [(CX - 3, 3, 16), (CX, 3, 17), (CX + 3, 3, 16), (CX + 6, 2, 14)], 12, dy)
    # 귀 앞으로 내려오는 옆머리 한 갈래
    hl, hb_, hd_ = K["hairL"], K["hair"], K["hairD"]
    for y in range(15 + dy, 37 + dy):
        w = 3 if y < 33 + dy else 2
        for i in range(w): c.px(CX - 3 + i + (1 if y > 30 + dy else 0), y, hl if i == 0 and y < 20 + dy else hd_ if i == w - 1 else hb_)
    tl, tb, td = tones(K["trim"])
    for x in range(CX - 14, CX + 9): c.px(x, 10 + dy, tb); c.px(x, 11 + dy, td)
    c.px(CX + 7, 10 + dy, K["gem"]); c.px(CX + 7, 11 + dy, K["gem"])
    if cast: staff(c, CX + 14, 6 + dy, 36 + dy)
    outline(c)
    if cast:
        for dx, dy2 in ((-4, -2), (4, -1), (0, -5), (5, 3)): c.px(CX + 15 + dx, 8 + dy2, K["star"])
    return c


def frame(row, col):
    if row == 0: return front(col, False)
    if row == 1: return back(col)
    if row == 2: return side(col, False)
    return front(col, True) if col < 3 else side(0, True)


if __name__ == "__main__":
    save("mage", frame)
