# 고해상도 시범: 마법사 '별빛 마법사' (python3 scripts/art/hd_mage.py) → apps/client/public/sprites/mage.png (64칸, 게임에서는 32칸으로 줄여 그림)
# 은빛 긴 머리(라벤더 그늘·결) · 금 이마띠와 하늘빛 보석 · 초승달 머리핀 · 큰 보랏빛 눈 · 남색 로브(금 테·별 무늬·금 허리띠)
# 흰 어깨 망토 · 흰 높은 깃과 보석 브로치 · 검은 스타킹·남색 구두 · 수정 지팡이(금 발톱에 물린 하늘빛 수정) · 공격 줄은 지팡이를 들어 빛을 모음
from hd_common import CX, FOOT, S, Cell, bangs, eye, face_front, hx, mix, outline, save, sh_oval, sh_poly, sh_rect, tones

K = dict(
    skin=hx("#f8e0cc"), hair=hx("#d4cdf0"), iris=hx("#6a58d8"), mouth=hx("#e08878"), blush=hx("#f4a4a8"),
    robe=hx("#2c3478"), trim=hx("#f2c84a"), cape=hx("#f2f2fa"), gem=hx("#7ae8ff"), staff=hx("#8a6038"),
    legs=hx("#2a2448"), shoe=hx("#262c64"), star=hx("#fff6c0"),
)


def back_hair(c, x, top, bottom, half, sway, full=False):
    """허리까지 오는 긴 머리 (결 줄 · 끝이 갈라짐)"""
    l, b, d = tones(K["hair"])
    for y in range(top, bottom + 1):
        k = (y - top) / max(1, bottom - top)
        w = half * (1 + 0.12 * min(1, k * 2)) - max(0, k - 0.8) * half * 1.5
        s = round(sway * k)
        for xx in range(int(x - w + s), int(x + w + s) + 1):
            t = (xx - (x - w + s)) / max(1, 2 * w)
            col = d if (t < 0.12 or t > 0.85) and not full else b
            if (xx - int(x)) % 4 == 0 and y > top + 3: col = d
            if (xx - int(x)) % 4 == 2 and y < top + 10 + k * 8: col = l
            c.px(xx, y, col)
    for i, xx in enumerate(range(int(x - half + 1), int(x + half), 3)):
        c.px(xx + sway, bottom + 1 + i % 2, d)


def staff(c, x, y0, y1, glow=0):
    """수정 지팡이: 갈색 자루 · 금 발톱 · 하늘빛 수정 (glow: 공격 때 빛)"""
    l, b, d = tones(K["staff"])
    for y in range(y0 + 7, y1 + 1):
        c.px(x, y, l); c.px(x + 1, y, b)
        if y % 6 == 0: c.px(x, y, d); c.px(x + 1, y, d)
    gl, gb, gd = tones(K["trim"])
    c.rect(x - 1, y0 + 7, 4, 1, gb); c.px(x - 2, y0 + 5, gb); c.px(x + 3, y0 + 5, gd); c.px(x - 2, y0 + 6, gb); c.px(x + 3, y0 + 6, gd)
    cl, cb, cd = tones(K["gem"], 0.55)
    for j in range(8):
        w = j if j < 4 else 7 - j
        for i in range(-w // 2, w // 2 + 1):
            c.px(x + i + (0 if i < 0 else 1), y0 - 1 + j, cl if i < 0 and j < 4 else cd if i > 0 and j >= 4 else cb)
    c.px(x, y0 + 1, hx("#ffffff"))


def robe(c, top, bottom, x0, x1, spread, star_seed=0):
    """로브: 아래로 퍼짐 · 가운데 금 줄 · 별 무늬 · 금 단 · 금 허리띠"""
    rows = [(y, x0 - (y - top) * spread, x1 + (y - top) * spread) for y in range(top, bottom + 1)]
    sh_poly(c, rows, K["robe"])
    tl, tb, td = tones(K["trim"])
    mid = (x0 + x1) / 2
    for y in range(top + 2, bottom + 1):
        c.px(mid, y, tb); c.px(mid + 1, y, td)
    lo = rows[-1]
    for x in range(int(lo[1]), int(lo[2]) + 1): c.px(x, bottom, tb); c.px(x, bottom - 1, tl if x % 2 else tb)
    for x in range(int(x0) - 1, int(x1) + 2): c.px(x, top + 9, tb if x % 3 else tl)
    for i, (dx, dy) in enumerate(((3, 13), (-5, 15), (6, 5), (-4, 6))):
        if top + dy < bottom - 2: c.px(mid + dx + (star_seed + i) % 2, top + dy, K["star"])


def frame(row, col):
    c = Cell(S)
    view = "front" if row == 0 or (row == 3 and col < 3) else "back" if row == 1 else "side"
    cast = row == 3
    step = 0 if cast else col
    bob = 1 if step in (1, 3) else 0
    sway = (0, 1, 0, -1)[col]
    hy = 19 + bob
    ty = 31 + bob
    hip = 47
    if view == "front":
        back_hair(c, CX, hy - 4, 50 + bob, 12.5, sway)
        # 흰 어깨 망토 (뒤)
        sh_poly(c, [(y, 22 - (y - ty) * 0.3, 42 + (y - ty) * 0.3) for y in range(ty, ty + 16)], K["cape"])
    elif view == "back":
        sh_poly(c, [(y, 22 - (y - ty) * 0.3, 42 + (y - ty) * 0.3) for y in range(ty, ty + 18)], K["cape"])
    else:
        back_hair(c, CX - 5, hy - 4, 49 + bob, 9, -1 - abs(sway))
    # 다리 · 구두
    if view != "side":
        lift = (0, 1, 0, -1)[step]
        for i, lx in enumerate((27, 34)):
            up = max(0, lift) if i == 0 else max(0, -lift)
            sh_rect(c, lx, hip + bob, 4, FOOT - 2 - hip - up - bob, K["legs"])
            sh_rect(c, lx - (1 if i == 0 else 0), FOOT - 2 - up, 5, 3, K["shoe"])
    else:
        st = (0, 3, 0, -3)[step]
        for i, dx in enumerate((st, -st)):
            sh_rect(c, 30 + dx, hip + bob, 4, FOOT - 2 - hip - bob, mix(K["legs"], hx("#000000"), 0.25 * i))
            sh_rect(c, 30 + dx, FOOT - 2, 6, 3, K["shoe"])
    # 로브 · 팔
    if view == "side":
        robe(c, ty, 50 + bob, 27, 37, 0.22, col)
    else:
        robe(c, ty, 50 + bob, 25, 39, 0.3, col)
    sl, sb, sd = tones(K["skin"])
    if view == "front":
        raise_ = cast
        sh_rect(c, 21, ty + 1, 4, 11, K["robe"]); sh_oval(c, 22.5, ty + 13, 2, 2, K["skin"])
        if raise_:
            # 오른팔을 들어 지팡이를 앞으로
            sh_rect(c, 40, ty - 4, 4, 10, K["robe"]); sh_oval(c, 42, ty - 6, 2, 2, K["skin"])
        else:
            sh_rect(c, 40, ty + 1, 4, 11, K["robe"]); sh_oval(c, 41.5, ty + 13, 2, 2, K["skin"])
        # 흰 높은 깃 · 보석 브로치
        sh_rect(c, 27, ty - 1, 10, 3, K["cape"])
        sh_oval(c, 32, ty + 3, 1.6, 1.6, K["gem"])
    elif view == "back":
        sh_rect(c, 21, ty + 1, 4, 11, K["robe"]); sh_rect(c, 40, ty + 1, 4, 11, K["robe"])
    else:
        reach = cast and col == 3
        if reach: sh_rect(c, 34, ty + 2, 10, 4, K["robe"]); sh_oval(c, 45, ty + 3.5, 2, 2, K["skin"])
        else: sh_rect(c, 36, ty + 2, 4, 10, K["robe"]); sh_oval(c, 40, ty + 12, 2, 2, K["skin"])
    head(c, view, hy, sway)
    # 지팡이
    if view == "front":
        if cast: staff(c, 42, ty - 22 - col, ty - 4)
        else: staff(c, 19, 12 + bob, FOOT - 1)
    elif view == "back": staff(c, 44, 12 + bob, FOOT - 1)
    elif cast and col == 3: staff(c, 46, ty - 16, ty + 10)
    else: staff(c, 41, 16 + bob, FOOT - 1)
    outline(c)
    # 공격: 수정에 모이는 별빛 (테두리 없이)
    if cast:
        gx, gy = (43, ty - 21 - col) if view == "front" else (47, ty - 15)
        for i, (dx, dy) in enumerate(((-4, -2), (4, -1), (0, -5), (-3, 4), (5, 3))[: 3 + col]):
            c.px(gx + dx, gy + dy, K["star"]); c.px(gx + dx, gy + dy - 1, mix(K["star"], K["gem"], 0.5))
    return c


def head(c, view, hy, sway):
    """머리: 은빛 머리 · 얼굴 · 앞머리 · 이마띠 · 눈 · 옆머리"""
    hl, hb, hd = tones(K["hair"])
    if view == "back":
        sh_oval(c, CX, hy, 12.5, 12, K["hair"])
        back_hair(c, CX, hy + 2, 50, 13, sway, True)
        for x in range(CX - 8, CX + 9): c.px(x, hy - 7 + abs(x - CX) // 3, hl)
        c.rect(CX - 11, hy - 3, 23, 1, K["trim"])
        return
    side = view == "side"
    fx = CX + (3 if side else 0)
    sh_oval(c, CX, hy, 12.5, 12, K["hair"])
    if side:
        # 옆얼굴: 머리 앞쪽(오른쪽)에 갸름한 얼굴 · 뒤쪽은 머리카락이 덮음 · 코끝·턱선
        face_front(c, CX + 6, hy + 3, 6.5, 9, K["skin"])
        for (x, y), col in list(c.p.items()):
            if col == K["skin"] and x < CX + 1 and y < hy + 11: c.p[(x, y)] = hb
        c.px(CX + 13, hy + 5, K["skin"]); c.px(CX + 13, hy + 6, K["skin"])
        bangs(c, CX - 6, CX + 12, hy - 8, hy + 1, K["hair"], 1)
    else:
        face_front(c, fx, hy + 3, 9.5, 9, K["skin"])
        bangs(c, CX - 11, CX + 11, hy - 8, hy + 1, K["hair"], 1, CX)
    # 금 이마띠 · 가운데 보석 · 초승달 핀
    tl, tb, td = tones(K["trim"])
    for x in range(CX - 11, CX + 12): c.px(x, hy - 6 + (abs(x - CX) // 6), tb)
    if not side: sh_oval(c, CX, hy - 6, 1.6, 1.6, K["gem"])
    c.px(CX - 9, hy - 10, tb); c.px(CX - 10, hy - 9, tb); c.px(CX - 10, hy - 8, tl); c.px(CX - 9, hy - 7, td)
    # 눈 · 홍조 · 입
    ey = hy + 2
    if side:
        eye(c, CX + 7, ey, 4, 5, K["iris"], 1)
        c.rect(CX + 6, ey + 7, 3, 1, K["blush"]); c.px(CX + 11, ey + 9, K["mouth"])
    else:
        eye(c, CX - 7, ey, 5, 5, K["iris"], -1); eye(c, CX + 3, ey, 5, 5, K["iris"], 1)
        c.rect(CX - 8, ey + 7, 3, 1, K["blush"]); c.rect(CX + 6, ey + 7, 3, 1, K["blush"])
        c.rect(CX - 1, ey + 9, 2, 1, K["mouth"])
    # 옆머리 (얼굴 양옆을 감싸며 어깨 아래까지)
    for s in ((-1, 1) if not side else (-1,)):
        x0 = CX + s * 11 - (2 if s > 0 else 0) + (5 if side else 0)
        for y in range(hy - 2, hy + 18):
            w = 3 if y < hy + 14 else 2
            for i in range(w): c.px(x0 + i, y + (1 if i == 1 and y > hy + 12 else 0), hl if i == 0 and y < hy + 4 else hd if i == w - 1 else hb)


if __name__ == "__main__":
    save("mage", frame)
