# 고해상도 시즌 1 보스 (코드 그림, 2배 · 4칸: 걷기 2 · 공격 준비 · 공격) (python3 scripts/art/hd_boss_s1a.py)
# 공허의 눈(seer, 80칸): 보랏빛 거대한 눈알 · 황금 홍채에 세로 동공 · 아래로 늘어진 촉수 · 둘레를 도는 보랏빛 구슬 · 준비 = 눈을 가늘게 뜨고 빛을 모음 · 공격 = 눈을 부릅뜨고 빛살
# 검은 기사(knight, 84칸): 뿔 달린 검은 투구와 붉은 눈 틈 · 겹겹 판금 · 붉은 망토 · 큰 검 · 준비 = 검을 머리 위로 · 공격 = 내려 베며 궤적
import math

from hd_common import Cell, hx, mix, outline, poly, save_enemy, sh_oval, sh_rect, thick_line, tones

V = dict(eye=hx("#3a1a5a"), eyeD=hx("#1e0c34"), lid=hx("#5a2a8a"), white=hx("#f0e8ff"), iris=hx("#ffb020"), irisL=hx("#ffe27a"),
         pupil=hx("#120818"), tent=hx("#4a2070"), orb=hx("#a060ff"), orbL=hx("#e8c8ff"))


def seer(f):
    S = 80
    c = Cell(S)
    cx, cy = 40, 32 + (1 if f == 1 else 0)
    # 촉수 (아래로 늘어지고 흔들림)
    for i in range(7):
        x0 = cx - 15 + i * 5
        sway = math.sin(f * 1.6 + i) * 3
        for j in range(26):
            t = j / 25
            x = x0 + sway * t + (i - 3) * t * 4
            w = 3 if t < 0.5 else 2 if t < 0.85 else 1
            for k in range(w): c.px(x + k, cy + 14 + j, mix(V["tent"], V["eyeD"], 0.5) if k == w - 1 else V["tent"])
        c.px(x0 + sway + (i - 3) * 4, cy + 40, V["orb"])
    # 눈알: 짙은 보라 껍질 · 흰자 · 홍채 · 동공
    sh_oval(c, cx, cy, 22, 20, V["lid"])
    open_ = 0.45 if f == 2 else 1.0
    wy = 14 * open_
    for y in range(int(cy - wy), int(cy + wy) + 1):
        for x in range(cx - 18, cx + 19):
            if ((x - cx) / 18) ** 2 + ((y - cy) / max(1, wy)) ** 2 <= 1:
                c.px(x, y, V["white"] if ((x - cx) / 18) ** 2 + ((y - cy) / max(1, wy)) ** 2 < 0.8 else mix(V["white"], V["lid"], 0.5))
    ir = 10 if f != 3 else 12
    for y in range(int(cy - min(ir, wy)), int(cy + min(ir, wy)) + 1):
        for x in range(cx - ir, cx + ir + 1):
            d = math.hypot(x - cx, y - cy) / ir
            if d <= 1: c.px(x, y, V["irisL"] if d < 0.45 else V["iris"] if d < 0.85 else mix(V["iris"], hx("#803000"), 0.6))
    pw = 2 if f != 3 else 4
    for y in range(int(cy - min(8, wy)), int(cy + min(8, wy)) + 1):
        for x in range(cx - pw // 2, cx + (pw + 1) // 2): c.px(x, y, V["pupil"])
    c.px(cx - 5, cy - 5, hx("#ffffff")); c.px(cx - 4, cy - 5, hx("#ffffff")); c.px(cx - 5, cy - 4, hx("#ffffff"))
    # 핏줄
    for a in (0.3, 2.6, 3.6, 5.6):
        for r in range(13, 17): c.px(cx + math.cos(a) * r * 1.1, cy + math.sin(a) * r * 0.75, mix(V["white"], hx("#c04060"), 0.5))
    outline(c)
    # 도는 구슬 (테두리 없이 빛) · 준비 때는 가까이 모이고 공격 때는 빛살
    rr = 30 if f != 2 else 24
    for i in range(6):
        a = i * math.pi / 3 + f * 0.5
        ox, oy = cx + math.cos(a) * rr, cy + math.sin(a) * rr * 0.6
        sh_oval(c, ox, oy, 2.5, 2.5, V["orb"])
        c.px(ox - 1, oy - 1, V["orbL"])
    if f == 3:
        for i in range(12):
            a = i * math.pi / 6
            for r in range(24, 34, 2): c.px(cx + math.cos(a) * r, cy + math.sin(a) * r * 0.8, V["irisL"] if r < 30 else V["orbL"])
    return c


K = dict(steel=hx("#3a3a48"), dark=hx("#1a1a24"), edge=hx("#7a7a90"), red=hx("#c01828"), redL=hx("#ff4a50"), cape=hx("#8a1020"),
         blade=hx("#c8ccd8"), bladeL=hx("#f4f6ff"), gold=hx("#d8a030"), skinless=hx("#0c0c12"))


def knight(f):
    S = 84
    c = Cell(S)
    cx = 40
    bob = 1 if f == 1 else 0
    low = 3 if f == 3 else 0
    # 망토 (뒤)
    poly(c, [(cx - 12, 30 + low), (cx + 10, 30 + low), (cx + 16 + (2 if f == 1 else 0), 72), (cx - 18, 72)], K["cape"])
    for y in range(40, 72, 6): thick_line(c, cx - 8, y, cx - 10, y + 5, 1, mix(K["cape"], hx("#000000"), 0.4))
    # 다리 (걷기)
    st = (3, -3, 0, 4)[f]
    for i, dx in enumerate((-6, 4)):
        s = st if i == 0 else -st
        sh_rect(c, cx + dx + s // 2, 54 + low + bob, 7, 22 - low - bob, K["steel"])
        sh_rect(c, cx + dx - 1 + s // 2, 74, 9, 5, K["dark"])
        c.rect(cx + dx + s // 2, 62 + low, 7, 2, K["edge"])
    # 몸통 판금 · 허리띠 · 가슴 붉은 문장
    sh_rect(c, cx - 11, 30 + low + bob, 22, 26, K["steel"], 2)
    for y in (37, 44): c.rect(cx - 10, y + low + bob, 20, 1, K["dark"])
    sh_rect(c, cx - 12, 52 + low + bob, 24, 4, K["dark"])
    c.rect(cx - 2, 53 + low + bob, 4, 2, K["gold"])
    poly(c, [(cx - 4, 33 + low), (cx + 4, 33 + low), (cx, 41 + low)], K["red"])
    # 어깨 갑옷 (가시)
    for sd in (-1, 1):
        sh_oval(c, cx + sd * 13, 32 + low + bob, 7, 6, K["steel"])
        thick_line(c, cx + sd * 15, 27 + low, cx + sd * 19, 21 + low, 2, K["edge"])
    # 투구: 뿔 둘 · 붉은 눈 틈
    hy = 20 + low + bob
    sh_oval(c, cx, hy, 9, 10, K["steel"])
    for sd in (-1, 1):
        for i in range(10): c.px(cx + sd * (6 + i * 0.8), hy - 6 - i * 1.4, K["dark"]); c.px(cx + sd * (7 + i * 0.8), hy - 6 - i * 1.4, K["edge"])
    c.rect(cx - 6, hy, 12, 3, K["skinless"])
    for x in range(cx - 5, cx + 6): c.px(x, hy + 1, K["redL"] if abs(x - cx) > 1 else K["red"])
    # 팔 · 검
    if f == 2:
        thick_line(c, cx + 10, 34 + low, cx + 6, 14, 4, K["steel"])
        thick_line(c, cx + 4, 12, cx - 22, 0, 4, K["blade"]); thick_line(c, cx + 4, 11, cx - 22, -1, 1, K["bladeL"])
        thick_line(c, cx + 4, 8, cx + 8, 16, 2, K["gold"])
    elif f == 3:
        thick_line(c, cx + 10, 34 + low, cx + 18, 46, 4, K["steel"])
        thick_line(c, cx + 18, 46, cx + 42, 70, 4, K["blade"]); thick_line(c, cx + 18, 45, cx + 42, 69, 1, K["bladeL"])
        thick_line(c, cx + 14, 50, cx + 22, 42, 2, K["gold"])
    else:
        thick_line(c, cx + 11, 34 + low + bob, cx + 15, 50, 4, K["steel"])
        thick_line(c, cx + 16, 52, cx + 30, 18 + bob, 4, K["blade"]); thick_line(c, cx + 16, 51, cx + 30, 17 + bob, 1, K["bladeL"])
        thick_line(c, cx + 12, 50, cx + 20, 54, 2, K["gold"])
    thick_line(c, cx - 11, 34 + low + bob, cx - 14, 50, 4, K["steel"])
    outline(c)
    if f == 3:
        # 내려 벤 궤적 (흰 반달)
        for i in range(30):
            a = -1.2 + i * 0.08
            for r in (34, 36): c.px(cx + 8 + math.cos(a) * r, 40 + math.sin(a) * r, mix(K["bladeL"], K["redL"], i / 40))
    if f == 2:
        for i in range(5): c.px(cx - 20 + i * 5, 2 + (i % 2) * 3, K["redL"])
    return c


if __name__ == "__main__":
    save_enemy("seer", seer, 80)
    save_enemy("knight", knight, 84)
