# 고해상도 캐릭터의 테마 스킨 자동 생성 (python3 scripts/art/hd_skins.py mage) → apps/client/public/sprites/skins/{캐릭터}_{테마}.png
# 새 캐릭터 그림(128칸 4×4 시트)에서: 흰 옷 → 테마 색 A · 푸른 천 → 테마 색 B (밝기는 그대로) · 머리 위 테마 소품(코드로 그림)
# 머리 자리(HEAD)는 캐릭터마다 시트를 보고 정함 · 테마 9 + 승리(금빛 테두리·월계관) · 한정 스킨(범 풍류·여름)은 따로 그림
import colorsys
import os
import sys

from PIL import Image, ImageDraw

from s2_common import SPRITES, hx

C = 128
# 캐릭터마다 줄(앞·뒤·옆·공격)별 머리: (가운데 x, 머리 위 y, 머리 너비) · 공격 줄 4번째 칸은 옆과 같음
HEAD = {
    "mage": {0: (65, 24, 36), 1: (62, 22, 36), 2: (69, 24, 34), 3: (67, 26, 30), "side_cast": (69, 24, 34)},
}
THEMES = {
    "xmas": dict(a="#d8283a", b="#2a8a4a", hat="santa"),
    "halloween": dict(a="#5a2a7a", b="#f08a20", hat="witch"),
    "school": dict(a="#2a3466", b="#c8283a", hat="cap"),
    "swim": dict(a="#3ac8e8", b="#f8f8ff", hat="flower"),
    "usa": dict(a="#2a4a9a", b="#d02a3a", hat="cowboy"),
    "china": dict(a="#c8202e", b="#f2c040", hat="buns"),
    "japan": dict(a="#f4a0c0", b="#d03050", hat="kanzashi"),
    "newyear": dict(a="#f090b0", b="#3a5ac8", hat="ribbon"),
    "swap": dict(a="#3a4a3a", b="#1e2228", hat=None, hair="#c8ccd8"),
    "victory": dict(a="#232a5a", b="#f2c040", hat="laurel", glow=True),
}


def hls(c):
    return colorsys.rgb_to_hls(*(v / 255 for v in c[:3]))


def tint(col, target, l):
    """밝기 l을 지킨 채 target 색으로"""
    th, tl, ts = hls(hx(target))
    nl = max(0.06, min(0.95, tl * (0.55 + 0.6 * l)))
    r, g, b = colorsys.hls_to_rgb(th, nl, ts)
    return (round(r * 255), round(g * 255), round(b * 255), col[3])


def recolor(cell, t, head_y):
    """옷만 바꿈: 칸마다 흰 옷 · 푸른 천 · 그 밖을 먼저 나누고, 둘레 5×5에서 많은 쪽으로 다듬어(얼룩 없이) 그 덩어리만 색을 바꿈
    swap은 머리카락도 은빛으로"""
    px = cell.load()
    kind = {}
    for y in range(C):
        for x in range(C):
            col = px[x, y]
            if col[3] == 0: continue
            h, l, s = hls(col)
            if y <= head_y + 26: kind[(x, y)] = 0
            elif s < 0.22 and l > 0.62: kind[(x, y)] = 1
            elif 0.55 < h < 0.95 and l > 0.25 and s > 0.08: kind[(x, y)] = 2
            else: kind[(x, y)] = 0
    smooth = {}
    for (x, y), k in kind.items():
        votes = [0, 0, 0]
        for dy in range(-2, 3):
            for dx in range(-2, 3):
                v = kind.get((x + dx, y + dy))
                if v is not None: votes[v] += 1
        best = max(range(3), key=lambda i: votes[i])
        smooth[(x, y)] = best if votes[best] >= 10 else k
    for (x, y), k in smooth.items():
        col = px[x, y]
        h, l, s = hls(col)
        if k == 1: px[x, y] = tint(col, t["a"], l)
        elif k == 2: px[x, y] = tint(col, t["b"], l)
        elif t.get("hair") and 0.075 < h < 0.17 and s > 0.3 and l > 0.35: px[x, y] = tint(col, t["hair"], l)


def hat(d, kind, cx, top, w):
    """머리 위 소품 (128칸 기준)"""
    k = w / 36
    def P(pts, fill, outline="#2a1a24"): d.polygon([(cx + x * k, top + y * k) for x, y in pts], fill=fill, outline=outline)
    def E(x0, y0, x1, y1, fill, outline="#2a1a24"): d.ellipse([cx + x0 * k, top + y0 * k, cx + x1 * k, top + y1 * k], fill=fill, outline=outline)
    if kind == "santa":
        P([(-17, 4), (17, 4), (10, -12), (2, -20), (14, -22), (22, -14), (12, -6)], "#d8283a")
        P([(-19, 2), (19, 2), (19, 9), (-19, 9)], "#f8f6f0")
        E(18, -24, 26, -16, "#f8f6f0")
    elif kind == "witch":
        E(-30, -2, 30, 10, "#241a30")
        P([(-14, 4), (14, 4), (8, -18), (16, -32), (2, -20)], "#2e2240")
        P([(-14, 0), (14, 0), (13, 4), (-13, 4)], "#f08a20")
    elif kind == "cap":
        P([(-24, -6), (0, -16), (24, -6), (0, 4)], "#1e2234")
        P([(-12, 0), (12, 0), (12, 8), (-12, 8)], "#262a40")
        d.line([(cx + 20 * k, top - 6 * k), (cx + 22 * k, top + 10 * k)], fill="#f2c040", width=max(1, round(2 * k)))
        E(19, 9, 25, 15, "#f2c040")
    elif kind == "cowboy":
        P([(-30, 6), (-24, 0), (24, 0), (30, 6), (18, 9), (-18, 9)], "#8a5a30")
        P([(-14, 2), (-12, -14), (0, -10), (12, -14), (14, 2)], "#9a6a3a")
        P([(-14, -2), (14, -2), (14, 2), (-14, 2)], "#3a2418")
    elif kind == "buns":
        for sx in (-1, 1):
            E(sx * 18 - 7, -4, sx * 18 + 7, 10, "#e8c070")
            E(sx * 18 - 3, -2, sx * 18 + 3, 4, "#c8202e", None)
            d.line([(cx + sx * 22 * k, top + 8 * k), (cx + sx * 24 * k, top + 22 * k)], fill="#c8202e", width=max(1, round(2 * k)))
    elif kind == "kanzashi":
        for i, (fx, fy) in enumerate(((-16, 4), (-21, 9), (-12, 10))):
            E(fx - 5, fy - 5, fx + 5, fy + 5, "#f8a8c8" if i != 1 else "#ffffff")
            E(fx - 2, fy - 2, fx + 2, fy + 2, "#f2c040", None)
        d.line([(cx - 18 * k, top + 14 * k), (cx - 18 * k, top + 26 * k)], fill="#d03050", width=max(1, round(2 * k)))
    elif kind == "ribbon":
        P([(10, 2), (24, -6), (22, 10)], "#d02a3a")
        P([(10, 2), (2, -8), (4, 10)], "#d02a3a")
        E(6, -2, 14, 6, "#f2c040")
    elif kind == "flower":
        for i in range(5):
            import math
            a = i * 1.2566
            E(-16 + math.cos(a) * 5 - 4, 6 + math.sin(a) * 5 - 4, -16 + math.cos(a) * 5 + 4, 6 + math.sin(a) * 5 + 4, "#ff5a7a")
        E(-19, 3, -13, 9, "#ffe060", None)
    elif kind == "laurel":
        for sx in (-1, 1):
            for i in range(5):
                x = sx * (6 + i * 3.5)
                E(x - 3, 2 - i * 0.5 - 2, x + 3, 2 - i * 0.5 + 2, "#f2c040", "#a07010")


def glow_edge(img):
    """승리: 몸 둘레 금빛 테두리 두 칸"""
    a = img.getchannel("A")
    px = img.load()
    ap = a.load()
    w, h = img.size
    add = []
    for y in range(h):
        for x in range(w):
            if ap[x, y]: continue
            near = any(0 <= x + dx < w and 0 <= y + dy < h and ap[x + dx, y + dy] and (x + dx) // C == x // C for dx in (-2, -1, 0, 1, 2) for dy in (-2, -1, 0, 1, 2))
            if near: add.append((x, y))
    for x, y in add: px[x, y] = (242, 192, 64, 200)


def build(char):
    base = Image.open(os.path.join(SPRITES, f"{char}.png")).convert("RGBA")
    heads = HEAD[char]
    for name, t in THEMES.items():
        out = Image.new("RGBA", base.size, (0, 0, 0, 0))
        for r in range(4):
            for c in range(4):
                cx, top, w = heads["side_cast"] if (r == 3 and c == 3) else heads[r]
                if r < 3 and c in (1, 3): top -= 2  # 걷기 칸은 몸이 2칸 올라감 (import_sheet)
                cell = base.crop((c * C, r * C, c * C + C, r * C + C))
                recolor(cell, t, top)
                if t.get("hat"):
                    d = ImageDraw.Draw(cell)
                    hat(d, t["hat"], cx, top, w)
                out.alpha_composite(cell, (c * C, r * C))
        if t.get("glow"): glow_edge(out)
        out.save(os.path.join(SPRITES, "skins", f"{char}_{name}.png"), optimize=True)
        print(char, name, "ok")


if __name__ == "__main__":
    build(sys.argv[1] if len(sys.argv) > 1 else "mage")
