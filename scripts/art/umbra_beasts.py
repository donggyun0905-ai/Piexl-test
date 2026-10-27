# 시즌 2 라스트 보스 검은 잔영과 거대한 짐승 셋 (데스웜 · 거대 전갈 · 거대 매) 몬스터 그림
# 규격(docs/ART.md): enemies/{종류}.png, 움직임 칸 2장을 가로로, 오른쪽을 봄. 아주 크게 (데스웜 96 · 전갈 104 · 매 120 · 검은 잔영 56)
import os
from PIL import Image
from s2_common import Cell, hx

OUT = os.path.join(os.path.dirname(__file__), "../../apps/client/public/sprites/enemies")
EDGE = hx("#1a0e08")

def poly(c, pts, col):
    """다각형 채우기"""
    ys = [p[1] for p in pts]
    for y in range(int(min(ys)), int(max(ys)) + 1):
        xs = []
        for i in range(len(pts)):
            (x0, y0), (x1, y1) = pts[i], pts[(i + 1) % len(pts)]
            if (y0 <= y + 0.5 < y1) or (y1 <= y + 0.5 < y0):
                xs.append(x0 + (y + 0.5 - y0) * (x1 - x0) / (y1 - y0))
        xs.sort()
        for a, b in zip(xs[::2], xs[1::2]):
            for x in range(int(round(a)), int(round(b)) + 1): c.px(x, y, col)

def thick(c, x0, y0, x1, y1, w, col):
    n = int(max(abs(x1 - x0), abs(y1 - y0), 1))
    for i in range(n + 1):
        t = i / n
        c.oval(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, w, w, col)

def save(name, frames, size):
    img = Image.new("RGBA", (size * len(frames), size), (0, 0, 0, 0))
    for k, f in enumerate(frames):
        for (x, y), col in f.p.items(): img.putpixel((k * size + x, y), col)
    img.save(os.path.join(OUT, f"{name}.png"), optimize=True)
    print(name, "ok")

# ── 데스웜: 땅에서 솟은 거대한 몸통과 이빨이 둘러싼 둥근 입 ──
def worm(f):
    S = 96
    c = Cell(S)
    body, dark, light, belly = hx("#b07a46"), hx("#6e4424"), hx("#d8a868"), hx("#e0b880")
    # 몸통 (아래로 갈수록 굵어짐) · 마디
    for y in range(38, 95):
        w = 17 + (y - 38) * 0.12
        sway = (1 if f else -1) * (y - 38) * 0.03
        for x in range(int(48 + sway - w), int(48 + sway + w) + 1):
            col = light if x < 48 + sway - w * 0.55 else dark if x > 48 + sway + w * 0.6 else body
            if abs(x - (48 + sway)) < w * 0.25: col = belly
            c.px(x, y, col)
        if (y - 40) % 8 == 0:
            for x in range(int(48 + sway - w), int(48 + sway + w) + 1): c.px(x, y, dark)
            for x in range(int(48 + sway - w + 2), int(48 + sway + w) - 1): c.px(x, y + 1, light)
    # 머리 둘레 가시
    for i in range(14):
        import math
        a = math.pi * 2 * i / 14 + (0.12 if f else 0)
        x0, y0 = 48 + math.cos(a) * 28, 30 + math.sin(a) * 22
        x1, y1 = 48 + math.cos(a) * 35, 30 + math.sin(a) * 28
        thick(c, x0, y0, x1, y1, 1.2, dark)
    c.oval(48, 30, 31, 25, dark)
    c.oval(47, 29, 29, 23, body)
    c.oval(44, 25, 20, 14, light)
    c.oval(48, 30, 25, 19, body)
    # 입 (안쪽은 붉고 깊음) · 이빨 두 겹
    mr = 20 if f else 18
    c.oval(48, 31, mr, mr * 0.75, hx("#5a1218"))
    c.oval(48, 32, mr - 6, (mr - 6) * 0.72, hx("#2a0608"))
    c.oval(48, 33, 6, 4, hx("#0a0000"))
    import math
    for ring, n, ln in ((mr, 16, 6), (mr - 7, 10, 4)):
        for i in range(n):
            a = math.pi * 2 * (i + (0.5 if ring != mr else 0)) / n
            bx, by = 48 + math.cos(a) * ring, 31 + math.sin(a) * ring * 0.75
            tx, ty = 48 + math.cos(a) * (ring - ln), 31 + math.sin(a) * (ring - ln) * 0.75
            c.line(bx, by, tx, ty, hx("#f2e6c4"))
            c.px(bx, by, hx("#c8b48a"))
    # 바닥 모래 더미
    for i in range(9):
        c.oval(48 + (i - 4) * 9, 92, 7, 4, hx("#c89a5a") if i % 2 else hx("#a87a40"))
    c.outline(EDGE)
    return c

# ── 거대 전갈: 위에서 본 모습, 오른쪽을 봄. 등 위로 말아 올린 꼬리 · 큰 집게 두 개 ──
def scorpion(f):
    S = 104
    c = Cell(S)
    shell, dark, light, sting = hx("#7a3626"), hx("#4a1c14"), hx("#b85a3a"), hx("#e8c050")
    # 다리 (양쪽 넷)
    for i in range(4):
        x = 44 + i * 9
        k = (2 if (i + f) % 2 else -2)
        for side in (-1, 1):
            thick(c, x, 52 + side * 10, x - 6 + k, 52 + side * 26, 1.3, dark)
            thick(c, x - 6 + k, 52 + side * 26, x - 12 + k, 52 + side * 36, 1.0, dark)
    # 집게 팔 · 집게
    op = 5 if f else 2
    for side in (-1, 1):
        thick(c, 66, 52 + side * 9, 80, 52 + side * 20, 3.2, shell)
        thick(c, 80, 52 + side * 20, 88, 52 + side * 24, 3.2, shell)
        c.oval(90, 52 + side * 25, 8, 6, shell)
        c.oval(89, 52 + side * 24, 5, 3, light)
        poly(c, [(94, 52 + side * (22 - op)), (103, 52 + side * (16 - op)), (98, 52 + side * (23 - op))], dark)
        poly(c, [(95, 52 + side * 28), (103, 52 + side * 26), (97, 52 + side * 31)], shell)
    # 몸통 (머리가슴 · 배 마디)
    c.oval(64, 52, 14, 12, shell)
    for i, (x, r) in enumerate(((50, 13), (40, 12), (31, 11), (23, 9))):
        c.oval(x, 52, r * 0.7, r, dark if i % 2 else shell)
        c.oval(x - 1, 49, r * 0.4, r * 0.5, light)
    c.oval(62, 48, 8, 5, light)
    c.px(75, 49, hx("#ffe040")); c.px(75, 55, hx("#ffe040")); c.px(76, 49, hx("#ffe040")); c.px(76, 55, hx("#ffe040"))
    # 꼬리: 뒤로 뻗었다가 등 위로 말려 앞을 겨눔
    path = [(18, 52), (10, 48), (6, 40), (8, 31), (15, 24), (25, 20), (36, 19), (47, 21)]
    for i, (x, y) in enumerate(path):
        r = 6.5 - i * 0.45
        c.oval(x, y + (1 if f and i > 3 else 0), r, r, shell if i % 2 == 0 else dark)
        c.oval(x - 1, y - 1, r * 0.45, r * 0.45, light)
    sy = 22 + (1 if f else 0)
    poly(c, [(50, sy - 5), (57, sy - 2), (61, sy + 4), (56, sy + 2), (51, sy + 4)], sting)
    c.line(52, sy - 3, 58, sy + 1, hx("#fff0a0"))
    c.px(60, sy + 3, hx("#9aff60")); c.px(59, sy + 3, hx("#9aff60"))
    c.outline(EDGE)
    return c

# ── 거대 매: 위에서 본 모습, 날개를 활짝 편 채 오른쪽을 봄 ──
def roc(f):
    S = 120
    c = Cell(S)
    brown, dark, light, tip = hx("#7a5030"), hx("#4a2c18"), hx("#b08048"), hx("#2e1c10")
    # 꽁지깃 (부채)
    poly(c, [(40, 60), (14, 44), (10, 60), (14, 76)], dark)
    for i in range(5): c.line(40, 60, 12, 46 + i * 7, brown)
    # 날개 (위·아래). f=1이면 조금 접힘
    reach = 6 if f else 2
    for side in (-1, 1):
        root = [(50, 60 + side * 6), (72, 60 + side * 6)]
        tipy = 60 + side * (56 - reach)
        wing = [root[0], (38, 60 + side * 30), (30, tipy), (46, tipy - side * 4), (60, 60 + side * 44), (76, 60 + side * 22), root[1]]
        poly(c, wing, brown)
        poly(c, [(36, 60 + side * 36), (30, tipy), (46, tipy - side * 4), (52, 60 + side * 40)], tip)
        # 깃 줄 (날개 안에만)
        for i in range(6):
            x = 34 + i * 7
            n = Cell(S)
            n.line(x + 6, 60 + side * 12, x, 60 + side * (40 + (i % 2) * 6 - reach), dark)
            for q, col in n.p.items():
                if q in c.p: c.p[q] = col
        poly(c, [(54, 60 + side * 8), (70, 60 + side * 8), (64, 60 + side * 20)], light)
    # 몸통 · 머리 · 부리
    c.oval(60, 60, 22, 10, brown)
    c.oval(58, 57, 14, 4, light)
    c.oval(86, 60, 9, 8, hx("#ece4d2"))
    c.oval(84, 58, 5, 3, hx("#ffffff"))
    poly(c, [(93, 56), (102, 60), (96, 64), (93, 63)], hx("#f0b830"))
    c.px(101, 61, hx("#a06010")); c.px(100, 62, hx("#a06010"))
    c.px(89, 56, hx("#ff3a1a")); c.px(89, 64, hx("#ff3a1a"))
    c.outline(EDGE)
    return c

# ── 검은 잔영: 두건 쓴 그림자, 붉은 눈, 아래는 연기처럼 흩어짐 ──
def umbra(f):
    S = 56
    c = Cell(S)
    ink, mid, rim = hx("#120c1a"), hx("#241a34"), hx("#4a3a6a")
    poly(c, [(28, 6), (40, 14), (44, 30), (42, 46), (14, 46), (12, 30), (16, 14)], ink)
    c.oval(28, 16, 10, 10, mid)
    c.oval(28, 18, 7, 7, hx("#000000"))
    for x in (24, 32):
        c.px(x, 18, hx("#ff3040")); c.px(x + 1, 18, hx("#ff3040")); c.px(x, 17, hx("#ff8090"))
    for i in range(6):
        x = 14 + i * 5 + (2 if (i + f) % 2 else 0)
        thick(c, x, 44, x + (1 if f else -1) * 2, 52 - (i % 3), 1.4, ink)
    c.line(16, 14, 12, 30, rim); c.line(40, 14, 44, 30, rim)
    for i in range(3):
        c.px(28 + (i - 1) * 6, 30 + i * 3, rim)
    c.outline(hx("#05030a"))
    return c

save("sandworm", [worm(0), worm(1)], 96)
save("scorpion", [scorpion(0), scorpion(1)], 104)
save("roc", [roc(0), roc(1)], 120)
save("umbra", [umbra(0), umbra(1)], 56)
