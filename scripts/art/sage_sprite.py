# 시즌 2 마지막 라스트 보스 제천대성 몬스터 그림: 원숭이 반신 (황금빛 털 · 하트 모양 얼굴 · 금테(긴고아) · 머리 위 깃털 둘 · 금빛 비늘 갑옷 · 붉은 망토 · 긴 꼬리)
# 여의봉: 붉은 쇠 봉에 빛 줄 · 가운데 금 문양 띠 · 양 끝 세 줄 금테 마개 · 근두운: 금빛 도는 흰 구름
# 규격(docs/ART.md): enemies/sage.png, 96칸 5장 가로 (0·1 근두운 위 · 2 근두운 위 휘두르기 · 3 땅 위 · 4 땅 위 휘두르기), 오른쪽을 봄 · sage_cloud.png 96칸 2장
import os
from PIL import Image
from s2_common import Cell, hx

OUT = os.path.join(os.path.dirname(__file__), "../../apps/client/public/sprites/enemies")
S = 96
EDGE = hx("#1a0c06")
FUR, FUR_S, FUR_D, FUR_L = hx("#c8862e"), hx("#9a5e1c"), hx("#6a3a10"), hx("#f0b860")
FACE, FACE_S, FACE_L = hx("#f2d2b0"), hx("#d0a882"), hx("#fff0e0")
GOLD, GOLD_L, GOLD_D = hx("#e8c040"), hx("#fff0a0"), hx("#a07818")
RED, RED_D, RED_L = hx("#c8222c"), hx("#7a1018"), hx("#f04a4a")
PLUME, PLUME_L = hx("#e05a20"), hx("#ffb040")
CLOUD, CLOUD_S, CLOUD_L = hx("#fff4d8"), hx("#e8c878"), hx("#ffffff")
IRON, IRON_D, IRON_L = hx("#9a1a20"), hx("#4a080c"), hx("#e0505a")

def poly(c, pts, col):
    ys = [p[1] for p in pts]
    for y in range(int(min(ys)), int(max(ys)) + 1):
        xs = []
        for i in range(len(pts)):
            (x0, y0), (x1, y1) = pts[i], pts[(i + 1) % len(pts)]
            if (y0 <= y + 0.5 < y1) or (y1 <= y + 0.5 < y0): xs.append(x0 + (y + 0.5 - y0) * (x1 - x0) / (y1 - y0))
        xs.sort()
        for a, b in zip(xs[::2], xs[1::2]):
            for x in range(int(round(a)), int(round(b)) + 1): c.px(x, y, col)

def thick(c, x0, y0, x1, y1, w, col):
    n = int(max(abs(x1 - x0), abs(y1 - y0), 1))
    for i in range(n + 1):
        t = i / n
        c.oval(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, w, w, col)

def furry(c, x0, y0, x1, y1, w):
    """털 난 팔·다리 한 마디: 바탕 + 그늘 + 빛 + 삐죽한 털"""
    thick(c, x0, y0, x1, y1, w, FUR)
    thick(c, x0 + 0.8, y0 + 0.8, x1 + 0.8, y1 + 0.8, w * 0.5, FUR_S)
    thick(c, x0 - 0.6, y0 - 0.6, x1 - 0.6, y1 - 0.6, w * 0.25, FUR_L)
    c.px((x0 + x1) / 2 - w, (y0 + y1) / 2, FUR_D)

def staff(c, x0, y0, x1, y1):
    """여의봉: 붉은 쇠 봉(빛 줄) · 가운데 금 문양 띠 · 양 끝 세 줄 금테 마개"""
    n = max(abs(x1 - x0), abs(y1 - y0), 1)
    ux, uy = (x1 - x0) / n, (y1 - y0) / n
    thick(c, x0, y0, x1, y1, 2.1, IRON)
    c.line(x0 + uy, y0 - ux, x1 + uy, y1 - ux, IRON_L)
    c.line(x0 - uy * 1.2, y0 + ux * 1.2, x1 - uy * 1.2, y1 + ux * 1.2, IRON_D)
    def at(t): return x0 + (x1 - x0) * t, y0 + (y1 - y0) * t
    # 양 끝 금테 마개 (끝으로 갈수록 굵게, 줄 셋)
    for side in (0, 1):
        for i in range(9):
            t = (i / n) if side == 0 else 1 - i / n
            x, y = at(t)
            r = 3 if i < 3 else 2.6
            c.oval(x, y, r, r, GOLD_D if i in (3, 6) else GOLD)
            if i in (1, 4, 7): c.px(x - uy, y + ux * -1, GOLD_L)
        ex, ey = at(0 if side == 0 else 1)
        c.oval(ex, ey, 1.4, 1.4, GOLD_L)
    # 가운데 금 문양 띠 (점 무늬)
    for i in range(-3, 4):
        x, y = at(0.5 + i / n)
        c.oval(x, y, 2.4, 2.4, GOLD)
        if i % 2 == 0: c.px(x, y, RED)
        else: c.px(x, y, GOLD_L)
    for t in (0.5 - 5 / n, 0.5 + 5 / n):
        x, y = at(t)
        c.oval(x, y, 2.4, 2.4, GOLD_D)

def plume(c, ox, oy, sway):
    """머리 위 깃털 둘: 뒤로 크게 휘어짐"""
    for k, (dx, dy) in enumerate(((0, 0), (3, 1))):
        pts = [(28 + dx, 8), (24 + dx, 2 + dy), (16 + dx, -2 + dy + sway), (6 + dx, 0 + dy + sway), (0 + dx, 6 + dy + sway)]
        for i in range(len(pts) - 1):
            (a, b), (x, y) = pts[i], pts[i + 1]
            thick(c, ox + a, oy + b, ox + x, oy + y, 0.9, PLUME if (i + k) % 2 == 0 else PLUME_L)
        c.px(ox + pts[-1][0], oy + pts[-1][1], GOLD_L)

def monkey(c, ox, oy, f, swing, mounted):
    sway = 1 if f == 1 else 0
    # 꼬리 (허리에서 뒤로, 위로 말림 · 끝은 밝은 털)
    tail = [(16, 44), (8, 46), (2, 40), (1, 31), (5, 24), (11, 22)]
    for i in range(len(tail) - 1):
        (a, b), (x, y) = tail[i], tail[i + 1]
        thick(c, ox + a, oy + b + sway, ox + x, oy + y + sway, 2.3 - i * 0.2, FUR if i < 4 else FUR_L)
    c.line(ox + 15, oy + 46 + sway, ox + 3, oy + 41 + sway, FUR_S)
    # 붉은 망토 (등 뒤로 날림)
    poly(c, [(ox + 17, oy + 23), (ox + 25, oy + 23), (ox + 20, oy + 40), (ox + 9, oy + 50 + sway), (ox + 5, oy + 45), (ox + 11, oy + 32)], RED)
    c.line(ox + 15, oy + 27, ox + 8, oy + 46 + sway, RED_D); c.line(ox + 19, oy + 29, ox + 12, oy + 48 + sway, RED_D)
    c.line(ox + 18, oy + 24, ox + 12, oy + 33, RED_L)
    # 다리 (구름 위에서는 웅크림) · 금빛 장화
    if mounted:
        furry(c, ox + 22, oy + 44, ox + 18, oy + 52, 3); furry(c, ox + 18, oy + 52, ox + 21, oy + 58, 2.6)
        furry(c, ox + 30, oy + 44, ox + 35, oy + 51, 3); furry(c, ox + 35, oy + 51, ox + 33, oy + 58, 2.6)
        boots = [(21, 59), (33, 59)]
    else:
        st = 2 if f == 4 else 0
        furry(c, ox + 22, oy + 44, ox + 18 - st, oy + 54, 3); furry(c, ox + 18 - st, oy + 54, ox + 17 - st, oy + 60, 2.6)
        furry(c, ox + 30, oy + 44, ox + 34 + st, oy + 54, 3); furry(c, ox + 34 + st, oy + 54, ox + 36 + st, oy + 60, 2.6)
        boots = [(17 - st, 61), (36 + st, 61)]
    for bx, by in boots:
        poly(c, [(ox + bx - 3, oy + by - 3), (ox + bx + 3, oy + by - 3), (ox + bx + 5, oy + by + 1), (ox + bx - 3, oy + by + 1)], GOLD)
        c.line(ox + bx - 3, oy + by - 3, ox + bx + 3, oy + by - 3, GOLD_L)
        c.line(ox + bx - 3, oy + by + 1, ox + bx + 5, oy + by + 1, GOLD_D)
    # 전투 치마 (붉은 천 · 금 테두리) · 허리띠
    poly(c, [(ox + 18, oy + 40), (ox + 35, oy + 40), (ox + 38, oy + 49), (ox + 15, oy + 49)], RED)
    for x in (21, 26, 31): c.line(ox + x, oy + 41, ox + x - 1, oy + 48, RED_D)
    c.line(ox + 15, oy + 49, ox + 38, oy + 49, GOLD)
    c.rect(ox + 18, oy + 38, 18, 3, GOLD); c.line(ox + 18, oy + 38, ox + 35, oy + 38, GOLD_L)
    c.oval(ox + 27, oy + 39, 2, 2, RED); c.px(ox + 26, oy + 38, RED_L)
    # 몸통: 털 + 금빛 비늘 갑옷
    poly(c, [(ox + 17, oy + 23), (ox + 36, oy + 23), (ox + 35, oy + 33), (ox + 33, oy + 38), (ox + 19, oy + 38), (ox + 18, oy + 32)], FUR)
    poly(c, [(ox + 20, oy + 25), (ox + 34, oy + 25), (ox + 33, oy + 36), (ox + 21, oy + 36)], GOLD)
    for y in range(26, 36, 2):
        for x in range(21 + (y // 2) % 2, 33, 3): c.px(ox + x, oy + y, GOLD_D)
    c.line(ox + 20, oy + 25, ox + 34, oy + 25, GOLD_L)
    c.line(ox + 27, oy + 25, ox + 27, oy + 36, GOLD_D)
    # 어깨 털 뭉치 · 금 어깨 갑옷
    for x in (18, 35):
        c.oval(ox + x, oy + 24, 4, 3, FUR_L); c.oval(ox + x, oy + 25, 3.2, 2, GOLD); c.line(ox + x - 3, oy + 27, ox + x + 3, oy + 27, GOLD_D)
    # 뒤쪽 팔 (봉을 받침)
    furry(c, ox + 19, oy + 27, ox + 17, oy + 35, 2.6)
    c.rect(ox + 15, oy + 34, 5, 3, GOLD)
    c.oval(ox + 18, oy + 38, 2.4, 2.2, FACE)
    # 머리: 털 + 큰 귀 + 하트 모양 얼굴
    c.oval(ox + 28, oy + 15, 9, 9, FUR)
    c.oval(ox + 26, oy + 12, 6, 4, FUR_L)
    c.oval(ox + 20, oy + 16, 3.4, 4, FUR); c.oval(ox + 20, oy + 16, 2, 2.6, FACE_S)
    poly(c, [(ox + 26, oy + 12), (ox + 31, oy + 11), (ox + 34, oy + 12), (ox + 38, oy + 15), (ox + 37, oy + 20), (ox + 33, oy + 24), (ox + 29, oy + 22), (ox + 26, oy + 18)], FACE)
    poly(c, [(ox + 33, oy + 18), (ox + 37, oy + 18), (ox + 36, oy + 21), (ox + 33, oy + 23)], FACE_S)
    c.px(ox + 29, oy + 14, FACE_L); c.px(ox + 30, oy + 13, FACE_L)
    # 눈썹 뼈 · 금빛 눈(붉은 눈동자) · 코 · 입과 송곳니
    c.line(ox + 30, oy + 13, ox + 37, oy + 13, FUR_D)
    c.rect(ox + 33, oy + 14, 3, 2, GOLD); c.px(ox + 34, oy + 14, RED); c.px(ox + 34, oy + 15, RED_D)
    c.px(ox + 37, oy + 17, FUR_D); c.px(ox + 38, oy + 17, FUR_D)
    c.line(ox + 33, oy + 21, ox + 37, oy + 20, RED_D)
    c.px(ox + 36, oy + 21, FACE_L)
    # 금테 (긴고아) · 붉은 보석
    c.line(ox + 21, oy + 10, ox + 35, oy + 9, GOLD); c.line(ox + 21, oy + 11, ox + 35, oy + 10, GOLD_D)
    c.px(ox + 23, oy + 9, GOLD_L); c.oval(ox + 31, oy + 9, 1.4, 1.4, RED); c.px(ox + 31, oy + 8, RED_L)
    plume(c, ox, oy, sway)
    # 앞쪽 팔 · 여의봉
    if swing:
        furry(c, ox + 35, oy + 27, ox + 42, oy + 30, 2.8); furry(c, ox + 42, oy + 30, ox + 48, oy + 30, 2.4)
        c.rect(ox + 44, oy + 28, 4, 5, GOLD)
        staff(c, ox + 4, oy + 30, min(95, ox + 92), oy + 30)
        c.oval(ox + 49, oy + 30, 2.6, 2.6, FACE); c.px(ox + 49, oy + 28, FACE_S)
    else:
        furry(c, ox + 35, oy + 27, ox + 39, oy + 33, 2.8); furry(c, ox + 39, oy + 33, ox + 42, oy + 36, 2.4)
        c.rect(ox + 38, oy + 32, 4, 4, GOLD)
        staff(c, ox + 52, oy - 2, ox + 32, oy + 78)
        c.oval(ox + 43, oy + 36, 2.6, 2.6, FACE)

def cloud(c, f, y):
    """근두운: 금빛 도는 흰 구름 (소용돌이 · 꼬리 구름)"""
    k = 1 if f == 1 else 0
    for cx, cy, r in ((48, y, 17), (31, y + 3, 12), (65, y + 3, 13), (20, y + 6, 8), (77, y + 5, 9), (10 - k, y + 9, 6)):
        c.oval(cx, cy, r, r * 0.55, CLOUD)
    for cx, cy, r in ((48, y + 4, 14), (31, y + 6, 9), (65, y + 6, 10)):
        c.oval(cx, cy, r, r * 0.3, CLOUD_S)
    for cx in (40, 56, 28, 68):
        c.line(cx - 3, y - 3 + k, cx + 2, y - 5 + k, CLOUD_L)
        c.px(cx + 3, y - 3 + k, CLOUD_S)
    for i in range(3):
        c.line(8 - i * 3 - k, y + 9 + i, 18 - i * 2, y + 8 + i, CLOUD_S)

def frame(k):
    c = Cell(S)
    mounted = k < 3
    swing = k in (2, 4)
    ox, oy = 22, (8 if mounted else 30)
    if mounted: cloud(c, k, 74)
    monkey(c, ox, oy, k, swing, mounted)
    if mounted:
        # 웅크린 발을 덮는 구름 앞자락
        front = Cell(S)
        cloud(front, k, 76)
        for (x, y), col in front.p.items():
            if y >= 72: c.px(x, y, col)
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
