# 시즌 2 캐릭터 그림 공용 도구: 칸(Cell) · 색 · 사람 몸(앞·뒤·옆·공격) · 시트 저장
# 시트 규격(docs/ART.md): 32×32 칸, 발 여백 2, 4줄(앞 걷기 · 뒤 걷기 · 오른쪽 걷기 · 공격) × 4칸. 공격 줄은 1~3칸 앞, 4칸 옆
import os
from PIL import Image

SPRITES = os.path.join(os.path.dirname(__file__), "../../apps/client/public/sprites")
C = 32

def hx(s):
    s = s.lstrip("#")
    return (int(s[0:2], 16), int(s[2:4], 16), int(s[4:6], 16), 255)

class Cell:
    def __init__(self, size=C): self.p = {}; self.size = size
    def px(self, x, y, c):
        x, y = int(round(x)), int(round(y))
        if c is not None and 0 <= x < self.size and 0 <= y < self.size: self.p[(x, y)] = c
    def rect(self, x, y, w, h, c):
        for j in range(int(h)):
            for i in range(int(w)): self.px(x + i, y + j, c)
    def oval(self, cx, cy, rx, ry, c):
        for y in range(int(cy - ry) - 1, int(cy + ry) + 2):
            for x in range(int(cx - rx) - 1, int(cx + rx) + 2):
                if ((x - cx) / max(rx, 0.5)) ** 2 + ((y - cy) / max(ry, 0.5)) ** 2 <= 1.0: self.px(x, y, c)
    def line(self, x0, y0, x1, y1, c):
        n = max(abs(x1 - x0), abs(y1 - y0), 1)
        for i in range(int(n) + 1): self.px(x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n, c)
    def outline(self, color):
        add = {}
        for (x, y) in list(self.p):
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                q = (x + dx, y + dy)
                if q not in self.p and 0 <= q[0] < self.size and 0 <= q[1] < self.size: add[q] = color
        self.p.update(add)
    def flipped(self):
        """좌우 뒤집은 새 칸"""
        n = Cell(self.size)
        for (x, y), c in self.p.items(): n.p[(self.size - 1 - x, y)] = c
        return n

def save_sheet(name, frame, rows=4, cols=4, size=C):
    """frame(row, col) → Cell 로 시트를 만들어 sprites/{name}.png 에 저장"""
    img = Image.new("RGBA", (size * cols, size * rows), (0, 0, 0, 0))
    for r in range(rows):
        for col in range(cols):
            for (x, y), c in frame(r, col).p.items(): img.putpixel((col * size + x, r * size + y), c)
    path = os.path.join(SPRITES, f"{name}.png")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, optimize=True)
    print(name, "ok")

# ── 사람 몸 ──
# body: dict(top=머리 위 y, head=(w,h), torso=(w,h), leg=다리 길이, ...) · k: 색 · deco(c, view, frame, geo): 머리카락·옷 꾸밈
FOOT = 29
BLUSH = (240, 150, 150, 255)

def shade(c):
    """시즌 1처럼 입체감과 채도: 오른쪽·아래 가장자리는 어둡게, 왼쪽·위 가장자리는 밝게, 색은 조금 더 진하게"""
    import colorsys
    out = {}
    for (x, y), col in c.p.items():
        r, g, b = (v / 255 for v in col[:3])
        h, s, v = colorsys.rgb_to_hsv(r, g, b)
        s = min(1.0, s * 1.18)
        if (x + 1, y) not in c.p or (x, y + 1) not in c.p: v *= 0.8
        elif (x - 1, y) not in c.p or (x, y - 1) not in c.p: v = min(1.0, v * 1.1)
        r, g, b = colorsys.hsv_to_rgb(h, s, v)
        out[(x, y)] = (round(r * 255), round(g * 255), round(b * 255), col[3])
    c.p = out

def soften(c, k, g):
    """머리카락·두건 다듬기: 위쪽 각진 모서리를 깎아 둥글게 · 정수리에 윤기 줄"""
    cols = {k[x] for x in ("hair", "hairD", "hairL", "hood") if k.get(x)}
    hy, hh, x0, hw = g["hy"], g["hh"], g["hx"], g["hw"]
    for _ in range(2):
        cut = []
        for (x, y), col in c.p.items():
            if col not in cols or y > hy + hh // 2: continue
            up = (x, y - 1) in c.p
            if not up and ((x - 1, y) not in c.p or (x + 1, y) not in c.p): cut.append((x, y))
        for q in cut: del c.p[q]
    # 늘어진 머리끝: 아래 모서리를 깎아 가늘게 (두 번)
    for _ in range(2):
        cut = []
        for (x, y), col in c.p.items():
            if col not in cols or y <= hy + hh // 2: continue
            if (x, y + 1) not in c.p and ((x - 1, y) not in c.p or (x + 1, y) not in c.p): cut.append((x, y))
        for q in cut: del c.p[q]
    # 바깥쪽 가장자리는 짙게 (머리숱이 둥글어 보이게)
    dark = k.get("hairD")
    if dark:
        for (x, y), col in list(c.p.items()):
            if col == k.get("hair") and y > hy + 1 and ((x - 1, y) not in c.p or (x + 1, y) not in c.p): c.p[(x, y)] = dark
    # 윤기: 정수리 가까이 짧은 밝은 줄 (머리카락 위에만)
    light = k.get("hairL")
    if not light or g["view"] == "back" and k.get("hood"): return
    top = min((y for (x, y), col in c.p.items() if col in cols and x0 <= x < x0 + hw), default=None)
    if top is None: return
    for i, (dx, dy) in enumerate(((2, 2), (3, 1), (4, 1), (5, 1))):
        q = (x0 + dx, top + dy)
        if c.p.get(q) in cols and c.p.get(q) != k.get("hood"): c.p[q] = light

def person(k, row, col, geo, deco):
    """한 칸: 앞·뒤·옆 걷기 + 공격 (row 3: col 0~2 앞에서 팔을 뻗음, col 3 옆에서 팔을 뻗음)"""
    size = geo.get("size", C)          # 큰 캐릭터는 48칸 (발 여백 3)
    FOOT = size - 3
    c = Cell(size)
    view = "front" if row == 0 or (row == 3 and col < 3) else "back" if row == 1 else "side"
    cast = row == 3
    step = 0 if cast else col
    bob = 1 if step in (1, 3) else 0
    hw, hh = geo["head"]
    tw, th = geo["torso"]
    leg = geo["leg"]
    hip = FOOT - leg            # 다리가 시작하는 y
    ty = hip - th               # 몸통 위
    hy = ty - hh + bob          # 머리 위 (목 한 줄은 몸통 첫 줄)
    ty += bob
    cx = size // 2
    g = dict(k=k, view=view, step=step, cast=cast, bob=bob, hy=hy, hx=cx - hw // 2, ty=ty, tx=cx - tw // 2, hip=hip + bob, cx=cx, hw=hw, hh=hh, tw=tw, th=th, leg=leg)
    deco(c, "back_hair", g)
    # 다리
    if view in ("front", "back"):
        lift = (0, 1, 0, -1)[step]
        for i, (lx, up) in enumerate(((cx - tw // 2 + 1, max(0, lift)), (cx + tw // 2 - 3, max(0, -lift)))):
            c.rect(lx, hip + bob, 2, leg - up - 1 - bob, k["legs"])
            c.rect(lx, FOOT - 1 - up, 2 + (1 if i else 0), 1, k["shoe"])
    else:
        stride = (0, 2, 0, -2)[step]
        c.rect(cx - 2 + stride, hip + bob, 2, leg - 1 - bob, k["legs"]); c.rect(cx - 2 + stride, FOOT - 1, 3, 1, k["shoe"])
        c.rect(cx - stride, hip + bob, 2, leg - 1 - bob, k["legsD"]); c.rect(cx - stride, FOOT - 1, 3, 1, k["shoe"])
    deco(c, "legs", g)
    # 몸통 · 팔
    if view in ("front", "back"):
        c.rect(cx - tw // 2, ty, tw, th, k["top"])
        swing = (0, 1, 0, -1)[step]
        c.rect(cx - tw // 2 - 2, ty + 1 + swing, 2, th - 1, k["arm"]); c.px(cx - tw // 2 - 2, ty + th + swing, k["skin"])
        if cast and view == "front":
            c.rect(cx + tw // 2, ty + 1, 5, 2, k["arm"]); c.px(cx + tw // 2 + 5, ty + 1, k["skin"]); c.px(cx + tw // 2 + 5, ty + 2, k["skin"])
        else:
            c.rect(cx + tw // 2, ty + 1 - swing, 2, th - 1, k["arm"]); c.px(cx + tw // 2 + 1, ty + th - swing, k["skin"])
    else:
        sw = (0, 2, 0, -2)[step]
        c.rect(cx - 3, ty, 6, th, k["top"])
        if cast:
            c.rect(cx, ty + 1, 7, 2, k["arm"]); c.px(cx + 7, ty + 1, k["skin"]); c.px(cx + 7, ty + 2, k["skin"])
        else:
            c.rect(cx - 1 + sw // 2, ty + 1, 2, th - 1, k["arm"]); c.px(cx - 1 + sw // 2, ty + th, k["skin"])
    deco(c, "body", g)
    # 머리 (시즌 1 그림체): 머리 위는 모두 머리카락, 얼굴은 아래 4줄뿐 — 눈 윗줄(흰 빛·눈동자) · 눈 아랫줄 · 볼 홍조 · 턱 그늘. 입은 없음
    hx0 = g["hx"]
    blush = k.get("blush", BLUSH)
    hair = k.get("hair", k["skin"])
    c.rect(hx0, hy, hw, hh, hair if view != "back" or "hair" in k else k["skinD"])
    fy = hy + hh - 4
    white = (244, 240, 255, 255)
    if view == "front":
        fx0, fw = hx0 + 1, hw - 2
        # 갸름한 턱: 맨 아래 턱 그늘은 양쪽 한 칸씩 좁히고 머리 아래 모서리는 비움 (긴 머리는 꾸밈에서 다시 덮음)
        c.rect(fx0, fy, fw, 3, k["skin"]); c.rect(fx0 + 1, fy + 3, fw - 2, 1, k["skinD"])
        for x in (hx0, fx0, fx0 + fw - 1, hx0 + hw - 1): c.p.pop((x, fy + 3), None)
        for ex in (fx0 + 1, fx0 + fw - 3):
            if k.get("smallEye"):
                c.px(ex + 1, fy + 1, k["eye"])
            else:
                c.px(ex, fy, white); c.px(ex + 1, fy, k["eye"])
                c.px(ex, fy + 1, k.get("eyeL", k["eye"])); c.px(ex + 1, fy + 1, k["eye"])
        if blush: c.px(fx0, fy + 2, blush); c.px(fx0 + fw - 1, fy + 2, blush)
    elif view == "side":
        sx = hx0 + hw - 4
        c.rect(sx, fy, 4, 3, k["skin"]); c.rect(sx, fy + 3, 2, 1, k["skinD"])
        for x in (sx + 2, sx + 3): c.p.pop((x, fy + 3), None)
        c.p.pop((sx + 3, fy + 2), None)
        if k.get("smallEye"): c.px(sx + 3, fy + 1, k["eye"])
        else:
            c.px(sx + 2, fy, white); c.px(sx + 2, fy + 1, k.get("eyeL", k["eye"])); c.px(sx + 3, fy + 1, k["eye"])
        if blush: c.px(sx + 1, fy + 2, blush)
    deco(c, "hair", g)
    deco(c, "hat", g)
    soften(c, k, g)
    shade(c)
    c.outline(k["outline"])
    return c
