# 히든 캐릭터 몰락한 왕 방향 시트 (python3 scripts/art/fallen_king_sprite.py) → apps/client/public/sprites/fallenKing.png
# 96칸 (발 여백 3) · 거인: 가시가 돋은 겹겹의 검은 판금 갑옷(은빛 테) · 가시 왕관 · 그늘진 얼굴에 빛나는 푸른 눈 · 머리 위로 타오르는 푸른 불꽃
# 갑옷 마디마디(어깨·가슴 틈·팔꿈치·무릎) 사이로 푸른 불꽃이 일렁임 · 등 뒤로 찢어진 검은 망토
# 거대한 츠바이핸더: 검은 날 + 붉게 빛나는 날 끝·가운데 홈·금 간 룬 줄 · 가시 날밑·가시 폼멜 · 날 둘레 붉은 불길
# 걸을 때는 어깨에 걸침 (칼날이 머리 뒤로 크게 삐죽) · 공격 줄: 앞 3칸 = 들어 올림 → 내려침 → 땅에 내리꽂음(붉은 빛) · 옆 1칸 = 앞으로 벰
import math

from s2_common import Cell, hx, save_sheet, shade

S = 96
FOOT = S - 3
CX = 48

K = dict(
    # 갑옷: 검정 판금 · 은빛 테 · 아주 어두운 틈
    A=hx("#1c1c28"), a=hx("#0c0c14"), M=hx("#34364a"), L=hx("#8a90a8"), W=hx("#d8dcec"),
    # 망토 (보랏빛 검정)
    C=hx("#1a1424"), c=hx("#0e0a16"), D=hx("#2a2038"),
    # 푸른 불꽃 · 눈
    B=hx("#1a5aff"), b=hx("#3ab8ff"), F=hx("#a8ecff"), E=hx("#e8fbff"),
    # 붉은 칼날 빛
    R=hx("#ff2a3a"), r=hx("#c80a1e"), P=hx("#ff9a8a"), X=hx("#3a060c"), x=hx("#1a0206"),
    outline=hx("#04040a"),
)


def spike(c, x, y, dx, dy, n, col, tip=None):
    """가시 (끝으로 갈수록 가늘어짐, 밑동 2칸)"""
    for i in range(n):
        w = 1 if i > n // 2 else 2
        for j in range(w):
            c.px(x + dx * i + (j if dy else 0), y + dy * i + (0 if dy else j), col)
    if tip: c.px(x + dx * (n - 1), y + dy * (n - 1), tip)


def flame(c, x, y, h, tick, hot=False, w=3):
    """일렁이는 불꽃 (아래 넓고 위로 갈래, tick마다 흔들림) · hot = 붉은 불"""
    col = (K["X"], K["r"], K["R"], K["P"]) if hot else (K["B"], K["b"], K["F"], K["E"])
    for i in range(h):
        k = i / max(h - 1, 1)
        half = max(0, round(w * (1 - k) * 0.9))
        sway = round(math.sin((i + tick * 2.1) * 0.9) * (1 + k))
        for dx in range(-half, half + 1):
            core = abs(dx) <= half * 0.4
            shade_i = 3 if core and k < 0.4 else 2 if core else 1 if k < 0.7 else 0
            c.px(x + dx + sway, y - i, col[shade_i])
    c.px(x + round(math.sin(tick * 1.7) * 2), y - h - 1 - tick % 2, col[1])


def plate(c, x, y, w, h, rim=True):
    """판금 한 장: 검정 · 위 은빛 테 · 아래 그늘 · 가운데 능선"""
    c.rect(x, y, w, h, K["A"])
    c.rect(x, y + h - 1, w, 1, K["a"])
    if rim:
        c.rect(x, y, w, 1, K["L"])
        c.px(x, y, K["W"])
    c.rect(x + w // 2, y + 1, 1, h - 2, K["M"])


def zwei(c, x0, y0, x1, y1, tick, glow=1.0):
    """츠바이핸더: (x0,y0) 폼멜 → (x1,y1) 칼끝. 가시 폼멜 · 긴 손잡이 · 가시 날밑 · 넓은 검은 날(붉은 날 끝·홈·금 간 룬) · 붉은 불길"""
    L = math.hypot(x1 - x0, y1 - y0)
    ux, uy = (x1 - x0) / L, (y1 - y0) / L
    nx, ny = -uy, ux
    at = lambda t, w: (x0 + ux * t + nx * w, y0 + uy * t + ny * w)
    # 가시 폼멜
    px, py = at(0, 0)
    c.oval(px, py, 2.2, 2.2, K["M"]); c.px(px, py, K["R"])
    for sx, sy in ((-ux, -uy), (nx, ny), (-nx, -ny)):
        for i in range(1, 4): c.px(px + sx * (2 + i), py + sy * (2 + i), K["L"] if i < 3 else K["W"])
    # 손잡이 (가죽 감김)
    for t in range(2, 16):
        for w in (-1, 0, 1):
            x, y = at(t, w)
            c.px(x, y, K["a"] if (t + w) % 3 == 0 else K["X"])
    # 가시 날밑 (넓고 양 끝이 칼끝 쪽으로 휜 가시)
    for w in range(-10, 11):
        for d in (16, 17):
            bend = (abs(w) - 6) * 0.8 if abs(w) > 6 else 0
            x, y = at(d + bend, w)
            c.px(x, y, K["M"] if d == 16 else K["A"])
    for side in (-1, 1):
        for i in range(4):
            x, y = at(19 + i, side * (10 + i * 0.3))
            c.px(x, y, K["L"] if i < 3 else K["W"])
    x, y = at(17, 0)
    c.oval(x, y, 1.5, 1.5, K["R"])
    # 날: 칸마다 칼 축에 투영해서 그림 (검은 몸 · 바깥 한 칸 붉게 빛나는 날 끝 · 가운데 홈 붉은 줄 · 금 간 밝은 룬)
    blade_end = int(L)
    half_at = lambda t: 2.5 if t < 24 else 4.6 if t < L - 10 else max(0.0, 4.6 * (L - t) / 10)
    xs = [x0, x1]
    ys = [y0, y1]
    for yy in range(int(min(ys)) - 6, int(max(ys)) + 7):
        for xx in range(int(min(xs)) - 6, int(max(xs)) + 7):
            dx, dy = xx - x0, yy - y0
            t = dx * ux + dy * uy
            w = dx * nx + dy * ny
            if t < 18 or t > L: continue
            half = half_at(t)
            d = abs(w)
            if d > half + 1.0: continue
            if d > half: col = K["r"]  # 바깥 붉은 빛
            elif d > half - 1.0: col = K["R"] if (int(t) % 7) else K["P"]
            elif d < 0.7 and t > 24 and t < L - 8: col = K["r"] if glow < 0.9 else (K["R"] if int(t) % 5 else K["P"])
            else:
                col = K["x"] if d > half * 0.5 else K["X"]
                # 금 간 붉은 룬 (비스듬한 짧은 금)
                if t < L - 10 and (int(t) + int(w * 1.5)) % 9 == 0: col = K["r"]
            c.px(xx, yy, col)
    # 리카소 가시
    for side in (-1, 1):
        x, y = at(22, side * 3.4)
        c.px(x, y, K["L"])
    # 날 둘레 붉은 불길 (흔들림)
    for i, t in enumerate(range(26, blade_end - 6, 9)):
        side = 1 if (i + tick) % 2 else -1
        x, y = at(t, side * 4.6)
        h = 3 + (i + tick) % 3
        for k in range(h):
            c.px(x + nx * side * k * 0.6, y - k, K["R"] if k < h - 1 else K["P"])


def cape(c, view, tick, top):
    """찢어진 검은 망토 (아래 끝이 들쭉날쭉한 갈래, 조금씩 흔들림)"""
    if view == "side":
        x0, x1 = CX - 22, CX - 2
    else:
        x0, x1 = CX - 27, CX + 27
    for x in range(x0, x1):
        k = (x - x0) / max(1, x1 - x0)
        tear = (7, 2, 11, 4, 0, 9, 3, 13, 5, 1, 8, 12)[(x * 7 // 5) % 12]
        sway = round(math.sin(x * 0.35 + tick * 1.3) * 1.5)
        bottom = FOOT - 2 - tear + sway
        for y in range(top, bottom):
            col = K["C"] if (x + y // 3) % 7 else K["D"]
            if y > bottom - 3 or k < 0.08 or k > 0.92: col = K["c"]
            c.px(x, y, col)


def body(c, view, step, cast, col, top):
    """다리 · 허리 · 몸통 · 어깨 · 팔 (가시·은빛 테·마디 사이 푸른 불꽃)"""
    lift = (0, 2, 0, -2)[step]
    # 다리 (넓적한 정강이 판 · 무릎 가시 · 쇠 장화)
    if view != "side":
        for i, lx in enumerate((CX - 13, CX + 3)):
            up = max(0, lift) if i == 0 else max(0, -lift)
            ly = top + 50
            plate(c, lx, ly, 10, FOOT - ly - 5 - up)
            plate(c, lx - 1, ly + 8, 12, 4)
            spike(c, lx + 5, ly + 8, 0, -1, 4, K["M"], K["L"])
            c.rect(lx - 2, FOOT - 6 - up, 14, 6, K["a"]); c.rect(lx - 2, FOOT - 6 - up, 14, 1, K["L"])
            spike(c, lx + (11 if i else -2), FOOT - 4 - up, 1 if i else -1, 0, 3, K["M"])
            flame(c, lx + 5, ly + 7, 4, col + i, w=2)
    else:
        stride = (0, 4, 0, -4)[step]
        for i, sx in enumerate((CX - 6 + stride, CX - 4 - stride)):
            ly = top + 50
            plate(c, sx, ly, 10, FOOT - ly - 5)
            spike(c, sx + 9, ly + 9, 1, 0, 4, K["M"], K["L"])
            c.rect(sx - 1, FOOT - 6, 15, 6, K["a"]); c.rect(sx - 1, FOOT - 6, 15, 1, K["L"])
            if i == 0: flame(c, sx + 6, ly + 8, 4, col, w=2)
    # 허리 겹 판(가시 끝) · 가운데 늘어진 천
    w = 34 if view != "side" else 20
    x0 = CX - w // 2
    for row in range(3):
        plate(c, x0 - row, top + 40 + row * 4, w + row * 2, 4)
    for x in range(x0 - 2, x0 + w + 2, 5): spike(c, x, top + 52, 0, 1, 3, K["M"])
    if view == "front":
        c.rect(CX - 4, top + 42, 8, 14, K["c"]); c.rect(CX - 4, top + 42, 8, 1, K["D"])
    # 몸통 (조각된 흉갑 · 은빛 능선 · 가슴 틈 푸른 불꽃)
    tw = 32 if view != "side" else 20
    tx = CX - tw // 2
    # 넓은 가슴에서 허리로 좁아지는 흉갑 (가장자리 은빛 톱니 테)
    for j in range(23):
        shrink = (j * 7) // 23 if view != "side" else (j * 2) // 23
        c.rect(tx + shrink, top + 18 + j, tw - shrink * 2, 1, K["A"])
        if view != "side" and j % 3 == 0:
            c.px(tx + shrink, top + 18 + j, K["L"]); c.px(tx + tw - shrink - 1, top + 18 + j, K["L"])
    if view == "front":
        for j in range(5):
            c.rect(tx + 3 + j, top + 20 + j * 4, tw - 6 - j * 2, 1, K["M"])
        c.line(CX, top + 19, CX, top + 39, K["L"])
        c.line(tx + 2, top + 21, CX - 2, top + 30, K["L"]); c.line(tx + tw - 3, top + 21, CX + 2, top + 30, K["L"])
        flame(c, CX - 7, top + 38, 5, col, w=2); flame(c, CX + 7, top + 38, 5, col + 1, w=2)
        c.px(CX, top + 29, K["b"]); c.px(CX, top + 30, K["F"])
    elif view == "back":
        for j in range(4): c.rect(tx + 2, top + 21 + j * 5, tw - 4, 1, K["M"])
    else:
        c.rect(tx + 2, top + 22, tw - 4, 1, K["M"]); c.line(tx + tw - 3, top + 20, tx + tw - 3, top + 38, K["L"])
        flame(c, tx + 6, top + 38, 5, col, w=2)
    # 어깨: 세 겹 큰 견갑 + 위·바깥으로 가시 · 사이로 푸른 불꽃이 솟음
    sides = (-1, 1) if view != "side" else (1,)
    for sx in sides:
        ex = CX + sx * 19 if view != "side" else CX + 1
        flame(c, ex + sx * 2, top + 13, 12, col + (sx > 0), w=4)
        flame(c, ex - sx * 6, top + 15, 8, col + 2, w=2)
        for tier in range(3):
            cx_, cy_ = ex + sx * tier * 3, top + 17 + tier * 5
            c.oval(cx_, cy_, 11 - tier * 2, 4.5, K["A"])
            c.oval(cx_, cy_ - 1.5, 10 - tier * 2, 1.2, K["M"])
            for k in range(-8 + tier * 2, 9 - tier * 2, 2): c.px(cx_ + k, cy_ + 3, K["L"] if k % 4 else K["W"])
            spike(c, cx_ + sx * (10 - tier * 2), cy_, sx, 1, 3, K["M"], K["L"])
        spike(c, ex - sx * 3, top + 13, 0, -1, 9, K["M"], K["W"])
        spike(c, ex + sx * 3, top + 13, sx, -1, 8, K["M"], K["W"])
        spike(c, ex + sx * 9, top + 15, sx, -1, 6, K["M"], K["L"])
        flame(c, ex + sx * 12, top + 28, 6, col + 1, w=2)
    # 팔·가시 건틀릿 (팔꿈치 틈 불꽃)
    if view == "front":
        for sx in (-1, 1):
            ax = CX + sx * 21 - 4
            if cast and sx > 0: continue
            plate(c, ax, top + 25, 8, 16)
            spike(c, ax + (8 if sx > 0 else -1), top + 31, sx, 0, 4, K["M"], K["L"])
            flame(c, ax + 4, top + 32, 4, col + sx, w=2)
            c.rect(ax - 1, top + 41, 10, 6, K["a"]); c.rect(ax - 1, top + 41, 10, 1, K["L"])
    elif view == "back":
        for sx in (-1, 1): plate(c, CX + sx * 21 - 4, top + 25, 8, 20)
    elif not cast:
        plate(c, CX + 1, top + 25, 8, 14); c.rect(CX, top + 38, 10, 6, K["a"])
        flame(c, CX + 5, top + 31, 4, col, w=2)


def head(c, view, col, hy):
    """가시 왕관 · 그늘진 투구 얼굴 · 빛나는 푸른 눈 · 머리 위 푸른 불꽃"""
    # 머리 위로 타오르는 큰 불꽃 (왕관 뒤)
    for i, dx in enumerate((-11, -7, 7, 11, 0)):
        flame(c, CX + dx, hy + (6 if abs(dx) > 9 else 3), (9, 12, 12, 9, 15)[i] + (i + col) % 3, col + i, w=3 if dx else 4)
    # 투구 (턱이 넓은 검은 판 · 볼 판 · 은빛 테)
    c.rect(CX - 8, hy + 2, 16, 15, K["A"])
    c.rect(CX - 9, hy + 6, 18, 8, K["A"])
    c.rect(CX - 8, hy + 16, 16, 2, K["M"])
    if view == "back":
        for j in range(3): c.rect(CX - 7, hy + 5 + j * 4, 14, 1, K["M"])
    else:
        fx = CX - 6 if view == "front" else CX - 1
        fw = 12 if view == "front" else 8
        c.rect(fx, hy + 6, fw, 9, K["a"])  # 그늘진 얼굴
        if view == "front":
            for ex in (CX - 4, CX + 2):
                c.rect(ex, hy + 9, 3, 2, K["b"]); c.px(ex + 1, hy + 9, K["E"])
                c.px(ex - 1, hy + 10, K["B"]); c.px(ex + 3, hy + 10, K["B"])
            c.line(CX, hy + 6, CX, hy + 15, K["M"])
            for x in range(CX - 5, CX + 6, 2): c.px(x, hy + 14, K["M"])
        else:
            c.rect(CX + 3, hy + 9, 3, 2, K["b"]); c.px(CX + 4, hy + 9, K["E"]); c.px(CX + 6, hy + 10, K["B"])
        c.rect(CX - 9, hy + 6, 18, 1, K["L"])
    # 가시 왕관 (뾰족 일곱 · 가운데가 가장 높음 · 은빛 끝)
    c.rect(CX - 10, hy + 2, 20, 3, K["M"]); c.rect(CX - 10, hy + 2, 20, 1, K["L"])
    for i, dx in enumerate((-9, -6, -3, 0, 3, 6, 9)):
        h = (6, 8, 11, 14, 11, 8, 6)[i]
        spike(c, CX + dx + (1 if dx < 0 else 0), hy + 1, 0, -1, h, K["A"], K["W"])
        c.line(CX + dx, hy + 1, CX + dx, hy + 2 - h + 2, K["M"])
        if dx == 0: c.px(CX, hy - 2, K["R"])


def frame(row, col):
    c = Cell(S)
    view = "front" if row == 0 or (row == 3 and col < 3) else "back" if row == 1 else "side"
    cast = row == 3
    step = 0 if cast else col
    dy = 1 if step in (1, 3) else 0
    top = 20 + dy
    cape(c, view if view != "back" else "front", col, top + 18)
    # 걸을 때: 어깨에 걸친 대검 (칼날이 머리 뒤 위로 크게)
    if not cast and view == "front":
        zwei(c, CX + 20, top + 46, CX - 42, top - 18, col)
    elif not cast and view == "side":
        zwei(c, CX + 12, top + 40, CX - 44, top - 14, col)
    body(c, view, step, cast, col, top)
    head(c, view, col, top - 2)
    if view == "back":
        # 뒤: 망토 위로 등에 멘 대검
        zwei(c, CX + 22, top + 52, CX - 40, top - 16, col)
    if cast and view == "front":
        # 들어 올림 → 내려침 → 땅에 내리꽂음 (손잡이를 두 손으로)
        hx_, hy_ = CX + 14, top + 30
        if col == 0:
            zwei(c, hx_ + 2, hy_ + 6, hx_ - 6, -2, col, 0.7)
        elif col == 1:
            zwei(c, hx_ - 4, hy_ - 4, hx_ + 40, FOOT - 22, col)
        else:
            zwei(c, hx_, top + 18, hx_, FOOT + 2, col)
            for i, gx in enumerate((-6, -2, 3, 7)): flame(c, hx_ + gx, FOOT - 1, 4 + i % 2 * 2, col + i, hot=True, w=2)
        c.rect(hx_ - 5, hy_ + (-6 if col == 2 else 0), 10, 6, K["a"]); c.rect(hx_ - 5, hy_ + (-6 if col == 2 else 0), 10, 1, K["L"])
    elif cast:
        # 옆: 두 손으로 앞으로 길게 벰
        plate(c, CX + 2, top + 26, 14, 6)
        zwei(c, CX + 6, top + 30, CX + 47, top + 38, col)
    shade(c)
    c.outline(K["outline"])
    return c


def main():
    save_sheet("fallenKing", frame, size=S)


if __name__ == "__main__":
    main()
