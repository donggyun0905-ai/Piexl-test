# 서기관(히든, 아카식 레코드) 방향 시트를 코드로 그림 (python3 scripts/art/scribe_sprites.py) → apps/client/public/sprites/scribe.png
# 시트: 32×32 칸(발 여백 2), 4줄(앞 걷기 · 뒤 걷기 · 오른쪽 걷기 · 공격) × 4칸. 규격은 docs/ART.md
# 생김새: 긴 은발 · 금테 외눈 안경 · 보랏빛 검은 긴 로브(금빛 테두리·별 무늬) · 왼손 옆에 떠 있는 두꺼운 책 · 오른손 깃펜
import os
from PIL import Image

OUT = os.path.join(os.path.dirname(__file__), "../../apps/client/public/sprites/scribe.png")
C = 32

def hx(s):
    s = s.lstrip("#")
    return (int(s[0:2], 16), int(s[2:4], 16), int(s[4:6], 16), 255)

K = dict(
    skin=hx("#f2d8c0"), skinD=hx("#d0b098"), hair=hx("#e8e4f4"), hairD=hx("#b8b0d0"), eye=hx("#4a3a8a"),
    robe=hx("#2a2040"), robeL=hx("#4a3a6a"), robeD=hx("#18122a"), trim=hx("#ffd040"), star=hx("#c8b8ff"),
    book=hx("#6a3a1a"), bookL=hx("#8a5a2a"), page=hx("#f2e6cc"), quill=hx("#ffffff"), quillD=hx("#c8c0e0"),
    glass=hx("#ffe88a"), shoe=hx("#14101c"), glow=hx("#b89aff"), outline=hx("#140e1e"),
)

class Cell:
    def __init__(self): self.p = {}
    def px(self, x, y, c):
        if 0 <= x < C and 0 <= y < C: self.p[(int(x), int(y))] = c
    def rect(self, x, y, w, h, c):
        for j in range(h):
            for i in range(w): self.px(x + i, y + j, c)
    def outline(self, color):
        add = {}
        for (x, y) in list(self.p):
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                q = (x + dx, y + dy)
                if q not in self.p and 0 <= q[0] < C and 0 <= q[1] < C: add[q] = color
        self.p.update(add)

def book(c, x, y, open_=False):
    """떠 있는 두꺼운 책 (open이면 펼쳐져 빛남)"""
    if open_:
        c.rect(x - 1, y, 9, 5, K["page"]); c.rect(x + 3, y, 1, 5, K["bookL"])
        for yy in (y + 1, y + 3): c.rect(x, yy, 2, 1, K["robe"]); c.rect(x + 5, yy, 2, 1, K["robe"])
        c.px(x + 3, y - 2, K["glow"]); c.px(x + 1, y - 1, K["glow"]); c.px(x + 6, y - 1, K["glow"])
    else:
        c.rect(x, y, 6, 7, K["book"]); c.rect(x + 1, y + 1, 4, 5, K["bookL"]); c.rect(x + 5, y + 1, 1, 6, K["page"])
        c.px(x + 2, y + 3, K["trim"]); c.px(x + 3, y + 3, K["trim"])

def quill(c, x, y, dx=1, dy=-1, n=6):
    """깃펜: (x, y) 손에서 (dx, dy) 쪽으로"""
    for i in range(n):
        c.px(x + dx * i, y + dy * i, K["quill"])
        if i > 1: c.px(x + dx * i + (1 if dy else 0), y + dy * i + (0 if dy else 1), K["quillD"])
    c.px(x - dx, y - dy, K["robe"])

def head(c, x, y, view):
    """x,y = 머리 왼쪽 위 (9×8). 긴 은발이 어깨 아래로 · 금테 외눈 안경"""
    h, hd = K["hair"], K["hairD"]
    if view == "back":
        c.rect(x, y, 9, 8, h); c.rect(x - 1, y + 2, 11, 9, h); c.rect(x + 1, y + 9, 7, 3, hd); c.px(x + 4, y + 1, hd)
        return
    if view == "front":
        c.rect(x + 1, y + 2, 7, 6, K["skin"]); c.rect(x + 2, y + 8, 5, 1, K["skinD"])
        c.rect(x, y, 9, 2, h); c.rect(x - 1, y + 1, 2, 10, h); c.rect(x + 8, y + 1, 2, 10, h); c.px(x + 4, y + 2, h); c.px(x + 2, y + 2, hd)
        c.px(x + 3, y + 5, K["eye"]); c.px(x + 6, y + 5, K["eye"])
        c.px(x + 5, y + 4, K["glass"]); c.px(x + 7, y + 4, K["glass"]); c.px(x + 6, y + 6, K["glass"]); c.px(x + 7, y + 6, K["glass"])
        c.rect(x + 4, y + 7, 2, 1, K["skinD"])
    else:
        c.rect(x + 2, y + 2, 7, 6, K["skin"]); c.px(x + 9, y + 5, K["skin"]); c.rect(x + 3, y + 8, 4, 1, K["skinD"])
        c.rect(x, y, 8, 2, h); c.rect(x - 1, y + 1, 4, 11, h); c.px(x + 1, y + 11, hd); c.px(x + 2, y + 3, hd)
        c.px(x + 7, y + 5, K["eye"]); c.px(x + 6, y + 4, K["glass"]); c.px(x + 8, y + 4, K["glass"]); c.px(x + 8, y + 6, K["glass"])

def robe(c, by, view, frame):
    """긴 로브: 어깨 → 발목까지 넓어짐 · 가운데 금빛 테두리 · 별 무늬 · 걸으면 밑단이 흔들림"""
    sway = (0, 1, 0, -1)[frame]
    if view in ("front", "back"):
        for i in range(15):
            w = 10 + i // 2
            x0 = 16 - w // 2 + (sway if i > 10 else 0)
            c.rect(x0, by + i, w, 1, K["robe"])
            c.px(x0, by + i, K["robeD"]); c.px(x0 + w - 1, by + i, K["robeD"])
        if view == "front":
            for i in range(15): c.px(16 + (sway if i > 10 else 0), by + i, K["trim"])
            c.rect(12, by, 9, 1, K["trim"])
            for sx, sy in ((13, by + 6), (19, by + 9), (12, by + 12)): c.px(sx, sy, K["star"])
        else:
            c.px(15, by + 4, K["robeL"]); c.px(17, by + 8, K["robeL"]); c.px(14, by + 11, K["star"])
        c.rect(12 + sway, by + 15, 3, 1, K["shoe"]); c.rect(18 - sway, by + 15, 3, 1, K["shoe"])
    else:
        stride = (0, 1, 0, -1)[frame]
        for i in range(15):
            w = 7 + i // 3
            x0 = 13 - (i // 4) + (stride if i > 10 else 0)
            c.rect(x0, by + i, w, 1, K["robe"]); c.px(x0 + w - 1, by + i, K["robeL"])
        c.px(18, by + 2, K["trim"]); c.px(18, by + 5, K["trim"]); c.px(14, by + 9, K["star"])
        c.rect(13 + stride, by + 15, 3, 1, K["shoe"]); c.rect(17 - stride, by + 15, 3, 1, K["shoe"])

def frame(row, col):
    c = Cell()
    bob = 1 if col in (1, 3) else 0
    if row == 0 or (row == 3 and col < 3):
        cast = row == 3
        b = 0 if cast else bob
        by = 13 + b
        book(c, 3, by + 2 - b, open_=cast)
        robe(c, by, "front", 0 if cast else col)
        c.rect(9, by + 1, 2, 6, K["robeL"]); c.rect(21, by + 1, 2, 6, K["robeL"]); c.px(22, by + 7, K["skin"])
        head(c, 12, 4 + b, "front")
        quill(c, 23, by + 7, 1, -1, 7 if cast else 5)
    elif row == 1:
        by = 13 + bob
        robe(c, by, "back", col)
        head(c, 12, 4 + bob, "back")
        book(c, 22, by + 2)
    else:
        cast = row == 3
        b = 0 if cast else bob
        by = 13 + b
        robe(c, by, "side", 0 if cast else col)
        head(c, 12, 4 + b, "side")
        c.rect(16, by + 2, 2, 5, K["robeL"])
        quill(c, 18, by + 6, 1, 0 if cast else -1, 7 if cast else 5)
        if cast: book(c, 22, by - 2, open_=True)
    c.outline(K["outline"])
    return c

def main():
    img = Image.new("RGBA", (C * 4, C * 4), (0, 0, 0, 0))
    for row in range(4):
        for col in range(4):
            for (x, y), col_ in frame(row, col).p.items(): img.putpixel((col * C + x, row * C + y), col_)
    img.save(OUT, optimize=True)
    print("scribe ok")

if __name__ == "__main__":
    main()
