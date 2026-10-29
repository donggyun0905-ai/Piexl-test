# 월드 워 리그 우승 한정 스킨 '승리' (python3 scripts/art/victory_skins.py) → apps/client/public/sprites/skins/{캐릭터}_victory.png
# 모든 캐릭터의 기본 그림 위에 '승리의 제복'을 덧그림: 남색 제복(살은 그대로) · 금빛 견장·단추 · 가슴 훈장 둘 · 붉은 허리띠
# 붉은 망토 (뒷모습은 등 전체, 앞·옆모습은 몸 옆·뒤로 펄럭임) · 테두리는 테마 색(금빛, 범 풍류·여름 파도처럼 한정 스킨만)
# 시트는 기본 그림과 같은 칸 배치 (4×4: 앞 · 뒤 · 옆 걷기 · 옆 공격, 옆은 오른쪽을 봄). 버려진 자들 P2·P3, 베두인 던진 뒤 그림도 같이
import os
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), "../../apps/client/public/sprites")
SKINS = os.path.join(ROOT, "skins")

def hx(s):
    s = s.lstrip("#")
    return (int(s[0:2], 16), int(s[2:4], 16), int(s[4:6], 16), 255)

NAVY = [hx("#18203e"), hx("#26346a"), hx("#3a5294"), hx("#6a84c0")]
CAPE = [hx("#5a0c10"), hx("#9a1a20"), hx("#cc3030"), hx("#ee5a4a")]
GOLD, GOLD_D, GOLD_L = hx("#e8b030"), hx("#9a6a12"), hx("#fff0a0")
RIBBON_R, RIBBON_W = hx("#d83a3a"), hx("#f4f4f8")
BELT = hx("#7a1414")
EDGE = hx("#a8761a")

def luma(c):
    return 0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2]

def is_skin(c):
    r, g, b = c[:3]
    return r > 150 and r >= g >= b and r - b > 40 and g > 90

def tone(pal, c):
    """밝기에 따라 팔레트 4단계 중 하나"""
    l = luma(c)
    return pal[0 if l < 60 else 1 if l < 120 else 2 if l < 185 else 3]

def frame(src, view):
    W, H = src.size
    px = src.load()
    mask = {(x, y) for y in range(H) for x in range(W) if px[x, y][3] > 0}
    if not mask:
        return src
    out = src.copy()
    o = out.load()
    edge = {(x, y) for (x, y) in mask if any((x + dx, y + dy) not in mask for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))}
    ys = [y for _, y in mask]
    miny, maxy = min(ys), max(ys)
    h = maxy - miny + 1
    y0 = miny + round(h * 0.42)
    y1 = miny + round(h * 0.74)
    inner = mask - edge
    band = [(x, y) for (x, y) in inner if y0 <= y <= y1 and not is_skin(px[x, y])]
    cols = [x for x, _ in band] or [W // 2]
    cx = round(sum(cols) / len(cols))
    # 남색 제복 (뒷모습은 망토가 덮음)
    for (x, y) in band:
        o[x, y] = tone(CAPE if view == "back" else NAVY, px[x, y])
    def row(y):
        xs = [x for (x, yy) in inner if yy == y]
        return (min(xs), max(xs)) if xs else None
    sh = row(y0)
    if sh and view != "side":
        # 견장: 어깨 끝 금빛 두 칸 + 아래 술
        l, r = sh
        for x in (l, l + 1, r - 1, r):
            o[x, y0] = GOLD
        for x in (l, r):
            if (x, y0 + 1) in inner:
                o[x, y0 + 1] = GOLD_D
    elif sh:
        o[sh[0] + (sh[1] - sh[0]) // 2, y0] = GOLD
    if view == "front" and sh:
        # 어깨띠: 왼쪽 어깨 → 오른쪽 허리 (맨살 위에도, 붉은 띠 + 금 테)
        l, r = sh
        for y in range(y0, y1):
            x = l + round((y - y0) * (r - l) / max(1, y1 - y0))
            for d, col in ((0, RIBBON_R), (1, GOLD_D)):
                if (x + d, y) in inner:
                    o[x + d, y] = col
    if view == "front":
        # 금 단추 · 가슴 훈장 둘 (붉은·흰 띠 + 금 메달)
        for k in (1, 3, 5):
            if (cx, y0 + k) in inner and y0 + k < y1:
                o[cx, y0 + k] = GOLD_L
        for dx, rib in ((-3, RIBBON_R), (-2, RIBBON_W)):
            if (cx + dx, y0 + 2) in inner and (cx + dx, y0 + 3) in inner:
                o[cx + dx, y0 + 2] = rib
                o[cx + dx, y0 + 3] = GOLD
    if view != "back":
        # 붉은 허리띠 + 금 버클
        for (x, y) in inner:
            if y == y1 and not is_skin(px[x, y]):
                o[x, y] = BELT
        if (cx, y1) in inner:
            o[cx, y1] = GOLD
    else:
        # 등 망토: 주름(세 칸마다 짙게)
        for (x, y) in inner:
            if y0 <= y <= maxy - 2 and not is_skin(px[x, y]):
                o[x, y] = CAPE[0 if (x - cx) % 3 == 0 else 1 if y > y1 else 2]
    # 몸 밖으로 펄럭이는 망토
    added = set()
    for y in range(y0 + 1, maxy - 1):
        xs = [x for (x, yy) in mask if yy == y]
        if not xs:
            continue
        l, r = min(xs), max(xs)
        k = 1 + (y - y0) * 2 // max(1, maxy - y0)
        sides = [(l, -1)] if view == "side" else [(l, -1), (r, 1)]
        if view == "side":
            k += 1
        for x0, d in sides:
            for n in range(1, k + (1 if view == "back" else 0)):
                p = (x0 + d * n, y)
                if 0 <= p[0] < W and p not in mask:
                    o[p] = CAPE[2 if n == 1 else 1]
                    added.add(p)
    # 테두리: 원래 테두리와 망토 둘레를 금빛으로
    shape = mask | added
    for (x, y) in edge:
        if luma(px[x, y]) < 110:
            o[x, y] = EDGE
    for (x, y) in list(added):
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            q = (x + dx, y + dy)
            if 0 <= q[0] < W and 0 <= q[1] < H and q not in shape:
                o[q] = EDGE
    return out

VIEWS = ["front", "back", "side", "side"]

def sheet(src_path, dst_path):
    im = Image.open(src_path).convert("RGBA")
    fw, fh = im.width // 4, im.height // 4
    out = Image.new("RGBA", im.size, (0, 0, 0, 0))
    for r in range(4):
        for c in range(4):
            box = (c * fw, r * fh, (c + 1) * fw, (r + 1) * fh)
            out.paste(frame(im.crop(box), VIEWS[r]), box[:2])
    out.save(dst_path)

def main():
    chars = sorted({f.split("_")[0] for f in os.listdir(SKINS) if f.endswith(("_tiger.png", "_summer.png"))})
    for c in chars:
        sheet(os.path.join(ROOT, f"{c}.png"), os.path.join(SKINS, f"{c}_victory.png"))
    sheet(os.path.join(ROOT, "abandoned2.png"), os.path.join(SKINS, "abandoned_victory_p2.png"))
    sheet(os.path.join(ROOT, "abandoned3.png"), os.path.join(SKINS, "abandoned_victory_p3.png"))
    sheet(os.path.join(SKINS, "bedouin_bare.png"), os.path.join(SKINS, "bedouin_victory_bare.png"))
    print(len(chars), "characters")

if __name__ == "__main__":
    main()
