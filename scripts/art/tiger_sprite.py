# 야수 덮치기 호랑이 (python3 scripts/art/tiger_sprite.py) → apps/client/public/sprites/beast_tiger.png
# 오른쪽을 보는 옆모습 56×34 칸 5장: 걷기 4장 + 덮치기(몸을 길게 뻗어 뛰어듦) 1장. 게임은 바라보는 쪽으로 뒤집어 그림 (render/beastTiger)
# 생김새: 근육이 불룩한 어깨 · 등은 짙고 배는 밝은 주황 털 · 굵은 검은 줄무늬 · 흰 뺨 털 · 빛나는 노란 눈 · 줄무늬 꼬리
import math
import os
from PIL import Image

OUT = os.path.join(os.path.dirname(__file__), "../../apps/client/public/sprites/beast_tiger.png")
W, H = 56, 34

def hx(s):
    s = s.lstrip("#")
    return (int(s[0:2], 16), int(s[2:4], 16), int(s[4:6], 16), 255)

DARK, FUR, LIGHT, BELLY = hx("#b85a14"), hx("#ec8a2a"), hx("#ffb45a"), hx("#fff0d8")
STRIPE, OUTLINE, EYE, PUPIL, NOSE = hx("#1e120a"), hx("#140a06"), hx("#e8ff5a"), hx("#140a06"), hx("#d86a7a")

class Cell:
    def __init__(self): self.p = {}
    def px(self, x, y, c):
        if 0 <= x < W and 0 <= y < H: self.p[(int(x), int(y))] = c
    def ellipse(self, cx, cy, rx, ry, shade=True):
        """털 덩어리: 위쪽은 짙게, 아래쪽은 밝게"""
        for y in range(int(cy - ry) - 1, int(cy + ry) + 2):
            for x in range(int(cx - rx) - 1, int(cx + rx) + 2):
                if ((x + 0.5 - cx) / rx) ** 2 + ((y + 0.5 - cy) / ry) ** 2 <= 1:
                    t = (y + 0.5 - (cy - ry)) / (2 * ry)
                    self.px(x, y, (DARK if t < 0.28 else FUR if t < 0.7 else LIGHT) if shade else FUR)
    def leg(self, x, top, bottom, lean=0):
        """다리: 위는 굵은 근육(4) → 아래는 3, 아래로 갈수록 lean만큼 기울고 흰 발 · 다리에도 줄무늬"""
        n = bottom - top
        for i in range(n + 1):
            xx = x + round(lean * i / max(1, n))
            wide = 4 if i < n * 0.45 else 3
            for d in range(wide): self.px(xx + d, top + i, DARK if d == 0 else LIGHT if d == wide - 1 else FUR)
            if i in (2, 5): self.px(xx + 1, top + i, STRIPE); self.px(xx + 2, top + i, STRIPE)
        for d in range(-1, 4): self.px(x + lean + d, bottom + 1, BELLY)
    def outline(self):
        add = {}
        for (x, y) in list(self.p):
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                q = (x + dx, y + dy)
                if q not in self.p and 0 <= q[0] < W and 0 <= q[1] < H: add[q] = OUTLINE
        self.p.update(add)

def tiger(frame):
    c = Cell()
    pounce = frame == 4
    walk = (0, 1, 0, -1)[frame] if not pounce else 0
    bob = 1 if frame in (1, 3) else 0
    by = 17 + bob
    # 꼬리: 엉덩이에서 뒤로 뻗었다가 끝이 위로 휨 (줄무늬)
    for i in range(16):
        t = i / 15
        tx = 7 - i * 0.45
        ty = by - 3 - math.sin(t * math.pi * 0.95) * 9 + (3 if pounce else 0) * t
        for d in (0, 1, 2) if i < 10 else (0, 1): c.px(tx + (1 if d == 2 else 0), ty + d, STRIPE if i % 3 == 2 or i > 13 else FUR)
    # 다리 (뒤쪽 다리 먼저): 걸으면 앞뒤가 엇갈림, 덮치기는 앞다리를 앞으로 · 뒷다리를 뒤로 쭉
    if pounce:
        c.leg(8, by + 3, by + 10, -6); c.leg(13, by + 4, by + 10, -5)
        c.leg(35, by + 1, by + 6, 7); c.leg(39, by + 2, by + 7, 8)
    else:
        c.leg(9, by + 3, by + 13, -walk * 2); c.leg(15, by + 4, by + 13, walk * 2)
        c.leg(31, by + 3, by + 13, walk * 2); c.leg(37, by + 4, by + 13, -walk * 2)
    # 몸통: 엉덩이 · 허리 · 불룩한 어깨 (덮치기는 길게 늘어남)
    stretch = 4 if pounce else 0
    c.ellipse(13, by, 8, 7)
    c.ellipse(23 + stretch / 2, by + 1, 11 + stretch, 6.5)
    c.ellipse(33 + stretch, by - 2, 8, 8.5)
    # 배 털 (밝게)
    for x in range(12, 36 + stretch):
        c.px(x, by + 6 + (1 if 16 < x < 30 else 0), BELLY)
    # 머리: 어깨보다 앞·아래로 내민 사나운 머리 · 짧은 귀 · 아래로 처진 흰 뺨 털 · 긴 주둥이 · 큰 턱
    hx0, hy = 43 + stretch, by - 4 + (1 if pounce else 0)
    c.ellipse(hx0, hy, 6.5, 6)
    c.ellipse(hx0 + 5, hy + 2, 4, 3.2)
    for ex in (hx0 - 4, hx0 - 1):
        c.px(ex, hy - 6, DARK); c.px(ex + 1, hy - 6, FUR); c.px(ex + 1, hy - 7, DARK); c.px(ex + 1, hy - 5, BELLY)
    # 뺨 털 (아래로 삐죽)
    for x in range(hx0 - 5, hx0 + 3):
        c.px(x, hy + 4, BELLY); c.px(x, hy + 5, BELLY if x % 2 else LIGHT)
    for x in (hx0 - 5, hx0 - 3, hx0 - 1): c.px(x, hy + 6, BELLY)
    # 주둥이 · 코 · 수염 점
    for x in range(hx0 + 3, hx0 + 10):
        for y in range(hy + 1, hy + 5): c.px(x, y, BELLY)
    c.px(hx0 + 9, hy, NOSE); c.px(hx0 + 10, hy, NOSE); c.px(hx0 + 9, hy + 1, NOSE)
    for x, y in ((hx0 + 5, hy + 2), (hx0 + 7, hy + 2), (hx0 + 6, hy + 3)): c.px(x, y, DARK)
    # 입 (덮치기는 크게 벌리고 송곳니 둘)
    if pounce:
        for x in range(hx0 + 3, hx0 + 10):
            c.px(x, hy + 4, hx("#6a1418")); c.px(x, hy + 5, hx("#a8283a"))
        c.px(hx0 + 4, hy + 4, BELLY); c.px(hx0 + 8, hy + 4, BELLY); c.px(hx0 + 4, hy + 5, BELLY)
    else:
        for x in range(hx0 + 4, hx0 + 9): c.px(x, hy + 4, STRIPE)
        c.px(hx0 + 8, hy + 5, BELLY)
    # 눈: 빛나는 노란 눈 (두 칸) + 안쪽으로 내려간 굵은 눈썹
    c.px(hx0 + 2, hy - 1, EYE); c.px(hx0 + 3, hy - 1, EYE); c.px(hx0 + 3, hy - 1, PUPIL)
    for x, y in ((hx0, hy - 3), (hx0 + 1, hy - 3), (hx0 + 2, hy - 2), (hx0 + 3, hy - 2), (hx0 + 4, hy - 2)): c.px(x, y, STRIPE)
    # 머리 줄무늬 (이마 · 뺨)
    for sx, sy in ((hx0 - 2, hy - 4), (hx0, hy - 4), (hx0 - 1, hy - 3), (hx0 - 4, hy - 1), (hx0 - 4, hy), (hx0 - 3, hy + 2)):
        c.px(sx, sy, STRIPE)
    # 몸 줄무늬: 등에서 아래로 굵게 내려오는 띠 (가운데가 길고 휨)
    for i, sx in enumerate(range(8, 39 + stretch, 4)):
        top = by - 8 if 27 <= sx <= 37 + stretch else by - 6
        n = 6 + (i % 2) * 2
        for j in range(n):
            bend = round(math.sin(j / n * math.pi) * (1.5 if i % 2 else -1.5))
            c.px(sx + bend, top + j, STRIPE)
            if j < n - 2: c.px(sx + bend + 1, top + j, STRIPE)
    c.outline()
    return c

def main():
    img = Image.new("RGBA", (W * 5, H), (0, 0, 0, 0))
    for f in range(5):
        for (x, y), col in tiger(f).p.items(): img.putpixel((f * W + x, y), col)
    img.save(OUT, optimize=True)
    print("tiger ok")

if __name__ == "__main__":
    main()
