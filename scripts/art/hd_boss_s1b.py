# 고해상도 시즌 1 보스 2 (코드 그림, 2배 · 4칸: 걷기 2 · 공격 준비 · 공격) (python3 scripts/art/hd_boss_s1b.py)
# 하드플랜트(plant, 88칸): 겹겹 붉은 꽃잎 · 가운데 이빨 가득한 아가리와 붉은 목젖 · 가시 줄기 · 잎 · 덩굴 · 준비 = 꽃잎을 오므림 · 공격 = 아가리를 크게 벌리고 침
# 얍삽한 활잡이(archer, 72칸): 초록 두건 망토 · 두건 속 빛나는 초록 눈 · 활과 화살통 · 준비 = 시위를 당김 · 공격 = 쏜 뒤 화살 빛
# 켄타우로스(centaur, 124칸): 뿔 투구와 판금 상체 · 갈색 말 몸에 붉은 마갑 · 긴 창 · 준비 = 앞발을 들고 창을 뒤로 · 공격 = 돌진하며 찌름
import math

from hd_common import Cell, hx, mix, outline, poly, save_enemy, sh_oval, sh_rect, thick_line, tones

P = dict(petal=hx("#c81e3a"), petalL=hx("#ff5a6a"), petalD=hx("#7a0c20"), mouth=hx("#3a0610"), tooth=hx("#f8f0e0"), tongue=hx("#ff8a8a"),
         stem=hx("#3a8a3a"), stemD=hx("#1e5a24"), leaf=hx("#5ab84a"), drool=hx("#b8f08a"))


def plant(f):
    S = 88
    c = Cell(S)
    cx, cy = 44, 34
    sway = (-2, 2, 0, 3)[f]
    # 줄기 · 가시 · 잎 · 땅 덩굴
    for y in range(cy + 14, 86):
        t = (y - cy - 14) / 40
        x = cx + sway * (1 - t)
        for k in range(-3, 4): c.px(x + k, y, P["stemD"] if k >= 2 else P["stem"])
        if y % 7 == 0: c.px(x - 4, y, P["stemD"]); c.px(x + 4, y - 1, P["stemD"])
    for sd in (-1, 1):
        poly(c, [(cx, 66), (cx + sd * 22, 56 + (f % 2) * 2), (cx + sd * 26, 62), (cx + sd * 8, 72)], P["leaf"])
        thick_line(c, cx + sd * 4, 66, cx + sd * 22, 59, 1, P["stem"])
    for sd in (-1, 1):
        for i in range(22): c.px(cx + sd * (6 + i * 1.6), 84 - abs(math.sin(i * 0.5 + f)) * 3, P["stemD"])
    # 꽃잎 (오므리면 작게)
    rr = 30 if f != 2 else 22
    for i in range(10):
        a = i * math.pi / 5 + 0.2
        px_, py_ = cx + sway + math.cos(a) * rr * 0.7, cy + math.sin(a) * rr * 0.6
        sh_oval(c, px_, py_, 11, 9, P["petal"])
    sh_oval(c, cx + sway, cy, 20, 17, P["petalD"])
    # 아가리
    oh = 4 if f == 2 else 10 if f != 3 else 15
    for y in range(int(cy - oh), int(cy + oh) + 1):
        for x in range(cx - 15, cx + 16):
            if ((x - cx) / 15) ** 2 + ((y - cy) / max(1, oh)) ** 2 <= 1: c.px(x + sway, y, P["mouth"])
    for i in range(8):
        x = cx - 13 + i * 4 + sway
        for j in range(4): c.px(x + (1 if j < 2 else 0), cy - oh + j, P["tooth"]); c.px(x, cy + oh - j, P["tooth"])
    if oh > 5:
        sh_oval(c, cx + sway, cy + oh * 0.4, 6, 3, P["tongue"])
        sh_oval(c, cx + sway, cy - 1, 2, 3, P["petalL"])
    outline(c)
    if f == 3:
        for i in range(5): c.px(cx - 6 + i * 3 + sway, cy + oh + 2 + i % 2 * 3, P["drool"]); c.px(cx - 6 + i * 3 + sway, cy + oh + 3 + i % 2 * 3, P["drool"])
    return c


A = dict(cloak=hx("#2a6a3a"), cloakD=hx("#163e22"), cloakL=hx("#4a9a5a"), hood=hx("#0a140c"), eye=hx("#7aff6a"),
         bow=hx("#8a5a2a"), string=hx("#e8e0c8"), arrow=hx("#d8d0b8"), tip=hx("#6ae8c8"), boot=hx("#3a2a1a"), quiver=hx("#7a3a1a"))


def archer(f):
    S = 72
    c = Cell(S)
    cx = 32
    bob = 1 if f == 1 else 0
    # 화살통 (등 뒤)
    sh_rect(c, cx - 14, 26 + bob, 6, 20, A["quiver"])
    for i in range(3): c.px(cx - 13 + i * 2, 23 + bob, A["arrow"]); c.px(cx - 13 + i * 2, 24 + bob, A["petal"] if False else hx("#c83a3a"))
    # 다리 · 장화
    st = (2, -2, 0, 0)[f]
    for i, dx in enumerate((-5, 2)):
        s = st if i == 0 else -st
        sh_rect(c, cx + dx + s, 52, 5, 14, A["cloakD"])
        sh_rect(c, cx + dx - 1 + s, 64, 7, 5, A["boot"])
    # 망토 몸 (아래로 퍼지고 끝이 들쭉날쭉)
    rows = []
    for y in range(18 + bob, 58):
        t = (y - 18) / 40
        rows.append((y, cx - 8 - t * 9, cx + 8 + t * 8))
    for y, a, b in rows:
        for x in range(int(a), int(b) + 1):
            if y > 54 and (x % 5) in (0, 1): continue
            u = (x - a) / max(1, b - a)
            c.px(x, y, A["cloakL"] if u < 0.15 else A["cloakD"] if u > 0.78 else A["cloak"])
    # 두건: 뾰족한 끝 · 어두운 얼굴 · 빛나는 눈
    poly(c, [(cx - 11, 26 + bob), (cx - 9, 10 + bob), (cx - 2, 2 + bob), (cx + 6, 6 + bob), (cx + 11, 18 + bob), (cx + 10, 28 + bob)], A["cloak"])
    sh_oval(c, cx + 1, 19 + bob, 7, 7, A["hood"])
    for ex in (cx - 2, cx + 4):
        c.px(ex, 19 + bob, A["eye"]); c.px(ex + 1, 19 + bob, A["eye"]); c.px(ex, 18 + bob, mix(A["eye"], hx("#ffffff"), 0.5))
    # 활 · 팔
    draw = 6 if f == 2 else 0
    bx = cx + 18
    for i in range(41):
        t = i / 40
        y = 14 + t * 40
        x = bx + math.sin(t * math.pi) * 6
        c.px(x, y, A["bow"]); c.px(x + 1, y, A["bow"])
    sx = bx - draw
    thick_line(c, bx, 14, sx, 34, 1, A["string"]); thick_line(c, sx, 34, bx, 54, 1, A["string"])
    thick_line(c, cx + 6, 30 + bob, bx + 4, 34, 3, A["cloak"])
    thick_line(c, cx + 2, 32 + bob, sx, 34, 3, A["cloakD"])
    if f in (0, 1, 2):
        thick_line(c, sx, 34, bx + 14, 34, 1, A["arrow"]); c.px(bx + 15, 34, A["tip"]); c.px(bx + 15, 33, A["tip"])
    outline(c)
    if f == 3:
        for i in range(14): c.px(bx + 8 + i * 2, 34, mix(A["tip"], hx("#ffffff"), i / 14)); c.px(bx + 8 + i * 2, 33 + (i % 2) * 2, A["tip"])
    return c


C_ = dict(horse=hx("#7a4a2a"), horseD=hx("#4a2a18"), horseL=hx("#a8703a"), mane=hx("#2a1a10"), armor=hx("#8a90a8"), armorD=hx("#4a5068"),
          capa=hx("#a01828"), gold=hx("#e8b040"), lance=hx("#c8ccd8"), skin=hx("#e8b898"), hoof=hx("#1e1410"))


def centaur(f):
    S = 124
    c = Cell(S)
    rear = 8 if f == 2 else 0
    lunge = 6 if f == 3 else 0
    bx, by = 50 + lunge, 70
    # 꼬리
    for i in range(16): thick_line(c, bx - 30, by - 4, bx - 38 - i * 0.3, by + 6 + i, 2, C_["mane"])
    # 다리 넷 (달리기)
    ph = (0, 1, 0, 1)[f]
    for i, (lx, front) in enumerate(((bx - 22, 0), (bx - 14, 0), (bx + 16, 1), (bx + 24, 1))):
        k = (i + ph) % 2
        up = (rear if front else 0)
        x2 = lx + (4 if k else -4)
        thick_line(c, lx, by + 8 - up, x2, by + 32 - up * 1.5, 5, C_["horseD"] if i % 2 else C_["horse"])
        sh_rect(c, x2 - 3, by + 31 - up * 1.5, 7, 4, C_["hoof"])
    # 말 몸 · 마갑
    sh_oval(c, bx, by, 32, 14, C_["horse"])
    poly(c, [(bx - 26, by - 6), (bx + 20, by - 8), (bx + 22, by + 10), (bx - 24, by + 12)], C_["capa"])
    for x in range(bx - 24, bx + 21, 2): c.px(x, by + 10 + (x % 4 == 0), C_["gold"])
    for i in range(3): sh_oval(c, bx - 12 + i * 12, by + 2, 3, 3, C_["gold"])
    # 상체 (판금) · 투구 뿔 · 팔 · 창
    tx, ty = bx + 22, by - 24 - rear
    sh_rect(c, tx - 9, ty, 18, 22, C_["armor"], 2)
    for sd in (-1, 1): sh_oval(c, tx + sd * 10, ty + 3, 6, 5, C_["armor"])
    hy = ty - 9
    sh_oval(c, tx, hy, 8, 8, C_["armor"])
    c.rect(tx - 4, hy, 10, 3, C_["armorD"]); c.px(tx + 2, hy + 1, hx("#ff4040")); c.px(tx + 4, hy + 1, hx("#ff4040"))
    # 황소 뿔: 옆으로 굵게 뻗다가 위로 휨 (끝으로 갈수록 가늘게)
    for sd in (-1, 1):
        for i in range(16):
            t = i / 15
            x, y = tx + sd * (6 + t * 12), hy - 2 - t * t * 12
            w = 4 if t < 0.4 else 3 if t < 0.75 else 2
            for k in range(w): c.px(x, y + k - w // 2, C_["gold"] if k < w - 1 else mix(C_["gold"], hx("#805010"), 0.6))
    if f == 2: lx0, ly0, lx1, ly1 = tx - 30, ty - 10, tx + 20, ty + 10
    elif f == 3: lx0, ly0, lx1, ly1 = tx - 10, ty + 10, tx + 50, ty + 6
    else: lx0, ly0, lx1, ly1 = tx - 16, ty + 18, tx + 34, ty - 4
    thick_line(c, tx + 6, ty + 6, (lx0 + lx1) / 2 + 4, (ly0 + ly1) / 2, 4, C_["armorD"])
    thick_line(c, lx0, ly0, lx1, ly1, 3, C_["lance"])
    poly(c, [(lx1, ly1 - 4), (lx1 + 10 * (1 if lx1 > lx0 else -1), ly1 + (ly1 - ly0) * 0.2), (lx1, ly1 + 4)], C_["lance"])
    outline(c)
    if f == 3:
        for i in range(10): c.px(lx1 + 12 + i * 2, ly1 + (i % 3) - 1, mix(C_["lance"], hx("#ffffff"), 0.5))
    return c


if __name__ == "__main__":
    save_enemy("plant", plant, 88)
    save_enemy("archer", archer, 72)
    save_enemy("centaur", centaur, 124)
