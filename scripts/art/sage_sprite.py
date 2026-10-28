# 시즌 2 마지막 라스트 보스 제천대성 몬스터 그림: 괴력난신과 같은 몸(같은 종족) + 금테 머리띠 · 붉은 망토 · 금빛 어깨 갑옷 · 긴 꼬리 · 여의봉 · 근두운
# 규격(docs/ART.md): enemies/sage.png, 96칸 5장 가로 (0·1 근두운 위 · 2 근두운 위 휘두르기 · 3 땅 위 · 4 땅 위 휘두르기), 오른쪽을 봄
import os
from PIL import Image
from s2_common import Cell, hx
from demigod_sprite import body, poly, thick, EDGE, GOLD, GOLD_L, GOLD_D, RED, RED_D, HAIR, HAIR_S

OUT = os.path.join(os.path.dirname(__file__), "../../apps/client/public/sprites/enemies")
S = 96
CAPE, CAPE_D = hx("#c0222c"), hx("#7a1018")
FUR, FUR_S = hx("#f4ead0"), hx("#c8b48a")
CLOUD, CLOUD_S, CLOUD_L = hx("#fff4d8"), hx("#e8c878"), hx("#ffffff")
POLE, POLE_D = hx("#b81c22"), hx("#6a0c12")

def back(c, f):
    # 붉은 망토 (등 뒤로 날림) · 긴 꼬리 (허리에서 뒤로 말려 올라감)
    sway = 1 if f == 1 else 0
    poly(c, [(22, 22), (30, 22), (26, 40), (14, 50 + sway), (8, 46), (14, 34)], CAPE)
    c.line(20, 26, 11, 46, CAPE_D); c.line(24, 28, 16, 48, CAPE_D)
    pts = [(25, 42), (17, 46), (10, 44), (5, 38), (5, 30), (9, 25)]
    for i in range(len(pts) - 1):
        thick(c, pts[i][0], pts[i][1] + sway, pts[i + 1][0], pts[i + 1][1] + sway, 2.2 - i * 0.15, FUR)
    thick(c, 9, 25 + sway, 12, 22 + sway, 1.6, FUR_S)

def deco(c, f):
    # 금테 머리띠 · 금빛 어깨 갑옷
    c.line(30, 8, 41, 8, GOLD); c.line(30, 9, 41, 9, GOLD_D); c.px(35, 8, GOLD_L)
    for x in (22, 44):
        c.oval(x, 23, 4, 3, GOLD); c.oval(x - 1, 22, 2, 1.5, GOLD_L); c.line(x - 4, 25, x + 4, 25, GOLD_D)

def staff(c, x0, y0, x1, y1):
    """여의봉: 붉은 봉에 양 끝 금테"""
    thick(c, x0, y0, x1, y1, 1.6, POLE)
    c.line(x0 + 0.8, y0 + 0.8, x1 + 0.8, y1 + 0.8, POLE_D)
    n = max(abs(x1 - x0), abs(y1 - y0))
    for k in (0, 1):
        for i in range(7):
            t = (i / n) if k == 0 else 1 - i / n
            c.oval(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, 2, 2, GOLD if i < 5 else GOLD_D)
    c.px(x0, y0, GOLD_L); c.px(x1, y1, GOLD_L)

def cloud(c, f, y):
    """근두운: 금빛 도는 흰 구름 (소용돌이 셋 · 꼬리 구름)"""
    k = 1 if f == 1 else 0
    for cx, cy, r in ((48, y, 16), (32, y + 3, 12), (64, y + 3, 12), (22, y + 6, 8), (74, y + 5, 9), (12 - k, y + 9, 6)):
        c.oval(cx, cy, r, r * 0.55, CLOUD)
    for cx, cy, r in ((48, y + 4, 13), (32, y + 6, 9), (64, y + 6, 9)):
        c.oval(cx, cy, r, r * 0.3, CLOUD_S)
    for cx in (40, 56, 30, 66):
        c.line(cx - 3, y - 2 + k, cx + 2, y - 4 + k, CLOUD_L)
    for i in range(3):
        c.line(10 - i * 3 - k, y + 9 + i, 18 - i * 2, y + 8 + i, CLOUD_S)

def frame(k):
    c = Cell(S)
    mounted = k < 3
    swing = k in (2, 4)
    oy = 4 if mounted else 30
    b = body(2 if swing else (k % 2 if mounted else 0), deco, back)
    if mounted: cloud(c, k, 72)
    for (x, y), col in b.p.items(): c.px(x + 16, y + oy, col)
    if mounted: cloud_front = Cell(S); cloud(cloud_front, k, 74)
    # 여의봉: 평소에는 비스듬히 세워 들고, 휘두를 때는 앞으로 길게
    if swing: staff(c, 20, oy + 27, 95, oy + 27)
    else: staff(c, 66, oy + 2, 52, oy + 64)
    if mounted:
        # 다리 아래를 덮는 구름 앞자락
        for (x, y), col in cloud_front.p.items():
            if y >= 74: c.px(x, y, col)
    c.outline(EDGE)
    return c

img = Image.new("RGBA", (S * 5, S), (0, 0, 0, 0))
for k in range(5):
    for (x, y), col in frame(k).p.items(): img.putpixel((k * S + x, y), col)
img.save(os.path.join(OUT, "sage.png"), optimize=True)
print("sage ok")

# 내려선 뒤 따로 떠다니는 근두운 (enemies/sage_cloud.png, 96칸 2장)
img = Image.new("RGBA", (S * 2, S), (0, 0, 0, 0))
for k in range(2):
    c = Cell(S)
    cloud(c, k, 46)
    c.outline(EDGE)
    for (x, y), col in c.p.items(): img.putpixel((k * S + x, y), col)
img.save(os.path.join(OUT, "sage_cloud.png"), optimize=True)
print("sage_cloud ok")
