# 한정 캐릭터 빛의 사도 방향 시트 (python3 scripts/art/lux_sprite.py) → apps/client/public/sprites/lux.png · lux2 · lux3 · lux4
# 성장 단계마다 칸이 커지고(48 → 56 → 64 → 72, 발 여백 3) 세부가 늘어남: 1 귀걸이·빛나는 문신 · 2 머리 위 금빛 고리·옷 금테 · 3 둘레에 떠다니는 '+' 빛·머리끝 빛
# 아름다운 여자: 허리까지 오는 검은 긴 머리(안쪽은 흰 머리) · 검은 높은 깃 옷(가운데 좁은 트임) · 배 위로 삼각형 트임과 배 가운데 빛의 문신
# 헐렁한 검은 반바지(벨트·끈) · 맨발 · 빛의 검(주황 테두리·노란 속·흰 가운데)을 오른손에 듦 · 공격 줄은 검을 들어 올리며 '+' 빛
from s2_common import Cell, hx, save_sheet, shade

K = dict(
    hair=hx("#18141f"), hairM=hx("#2c2638"), hairL=hx("#4a4060"), white=hx("#eceaf4"), whiteD=hx("#b8b4c8"),
    skin=hx("#fbe3d2"), skinD=hx("#e8bba4"), blush=hx("#f0a0a0"), eye=hx("#3a3446"), eyeL=hx("#ffffff"), iris=hx("#8a86a0"),
    cloth=hx("#1c1824"), clothM=hx("#2e2838"), clothL=hx("#4a4258"), belt=hx("#3a3446"), silver=hx("#d8dce8"),
    gold=hx("#ffc84a"), goldD=hx("#c8902a"), orange=hx("#ff8a1a"), yellow=hx("#ffe060"), core=hx("#fffbe8"),
    outline=hx("#4e4262"), irisL=hx("#b4b0cc"), lash=hx("#141019"), mouth=hx("#d88a8a"),
)

# 성장 단계(조각 6개부터)는 2배 촘촘한 그림 (칸 112·128·144 = 게임에서 56·64·72 크기로 줄여 그려 더 섬세하게, sprites.ts hd: 2)
STAGES = [("lux", 48, 30, 1), ("lux2", 112, 70, 2), ("lux3", 128, 80, 2), ("lux4", 144, 90, 2)]


def star(c, cx, cy, a):
    """'+' 빛: 주황 테두리 · 노란 속 · 흰 가운데 (팔 길이 a)"""
    for i in range(-a, a + 1):
        w = 1 if abs(i) <= max(1, a // 3) else 0
        for j in range(-w, w + 1):
            col = K["orange"] if abs(i) >= a or abs(j) == w and w else K["yellow"]
            c.px(cx + i, cy + j, col); c.px(cx + j, cy + i, col)
    c.px(cx, cy, K["core"])


def blade(c, x0, y0, x1, y1, w=1):
    """빛의 검: (x0,y0) 손잡이 → (x1,y1) 칼끝 · 가운데 흰 줄 · 노란 날 · 주황 테두리 · 금 날밑"""
    n = max(abs(x1 - x0), abs(y1 - y0), 1)
    for i in range(int(n) + 1):
        t = i / n
        x, y = x0 + (x1 - x0) * t, y0 + (y1 - y0) * t
        c.px(x - 1, y, K["orange"]); c.px(x + 1, y, K["orange"])
        if w > 1: c.px(x - 2, y, K["orange"]); c.px(x + 2, y, K["orange"]); c.px(x - 1, y, K["yellow"]); c.px(x + 1, y, K["yellow"])
        c.px(x, y, K["core"] if t > 0.15 else K["yellow"])
    # 날밑 (손잡이 쪽 가로) · 손잡이
    hx0, hy0 = x0 + (x1 - x0) * 0.12, y0 + (y1 - y0) * 0.12
    for d in range(-2 - w, 3 + w): c.px(hx0 + d, hy0, K["gold"])
    c.px(x0 - (x1 - x0) * 0.06, y0 - (y1 - y0) * 0.06, K["goldD"])


def hair_back(c, cx, top, bottom, half, view, sway):
    """뒤로 흘러내리는 긴 머리: 검정 바깥 · 아래 끝과 안쪽은 흰 머리 · 갈래진 끝"""
    for y in range(top, bottom + 1):
        k = (y - top) / max(1, bottom - top)
        w = half * (0.85 + 0.25 * min(1, k * 2)) - max(0, k - 0.75) * half * 1.2
        s = round(sway * k)
        c.rect(cx - w + s, y, w * 2, 1, K["hair"])
        # 안쪽 흰 머리: 아래로 갈수록 바깥 결 사이로 보임
        if k > 0.45:
            c.px(cx - w + 2 + s, y, K["white"]); c.px(cx + w - 3 + s, y, K["white"])
            if k > 0.7: c.px(cx - w + 3 + s, y, K["whiteD"]); c.px(cx + w - 4 + s, y, K["whiteD"])
    # 갈래진 끝 (흰 끝 섞임)
    for i, x in enumerate(range(int(cx - half + 1), int(cx + half), 2)):
        for j in range(1 + i % 3): c.px(x + sway, bottom + 1 + j, K["white"] if (i + j) % 3 == 0 else K["hair"])
    # 결 (가는 짙은·밝은 줄)
    for x in range(int(cx - half + 3), int(cx + half - 2), 3):
        for y in range(top + 2, bottom - 1, 2): c.px(x + round(sway * (y - top) / max(1, bottom - top)), y, K["hairM"])


def head(c, cx, top, hs, view, stage):
    """머리 (hs = 머리 크기): 얼굴은 아래쪽 · 앞머리 · 옆 머리(안쪽 흰 머리) · 눈 (입 없음)"""
    r = hs / 2
    cy = top + r
    if view == "back":
        c.oval(cx, cy, r, r, K["hair"]); c.oval(cx - r * 0.3, cy - r * 0.4, r * 0.35, r * 0.25, K["hairL"])
        return
    face_x = cx + (r * 0.25 if view == "side" else 0)
    c.oval(cx, cy, r * 0.92, r, K["hair"])
    # 얼굴: 아래 절반 · 짧고 둥근 턱 (볼 아래에서 부드럽게 둥글게 모임)
    fw = r * (0.58 if view == "side" else 0.7)
    y0, y1 = cy - r * 0.25, cy + r * 0.86
    for y in range(int(y0), int(y1) + 1):
        t = max(0.0, ((y - y0) / (y1 - y0) - 0.5) / 0.5)
        w = fw * (1 - 0.5 * (1 - (1 - min(1.0, t) ** 2) ** 0.5))
        c.rect(face_x - w, y, w * 2, 1, K["skin"])
    c.px(face_x - fw + 1, cy + r * 0.38, K["blush"]); c.px(face_x + fw - 2, cy + r * 0.38, K["blush"])
    # 눈 자리 (크기에 맞춰 커짐)
    ey = round(cy + r * 0.1)
    ew = max(2, round(hs * 0.17))
    eh = max(2, round(hs * 0.13))
    # 앞머리: 눈 바로 위까지 뾰족뾰족 내려온 검은 머리 (가운데 살짝 갈라짐)
    for x in range(int(face_x - fw - 1), int(face_x + fw + 2)):
        tip = (x * 5 + 1) % 4
        bottom = ey - 2 - (0 if tip else 1) - (1 if abs(x - face_x) < 1 else 0)
        c.rect(x, cy - r * 0.6, 1, bottom - (cy - r * 0.6) + 1, K["hair"])
    if view == "front":
        for side in (-1, 1):
            x = cx + side * (r * 0.86)
            c.rect(x - (1 if side > 0 else 0), cy - r * 0.3, 2, r * 1.25, K["hair"])
            c.rect(x - side * 1 - (1 if side > 0 else 0), cy + r * 0.15, 1, r * 0.75, K["white"])
    else:
        c.rect(cx - r * 0.95, cy - r * 0.3, r * 0.9, r * 1.6, K["hair"])
        c.rect(cx - r * 0.3, cy + r * 0.1, 1, r * 1.1, K["white"])
        # 옆모습: 코끝·턱선
        c.px(round(face_x + fw), ey + eh, K["skin"])
    # 머리 윤기 (흰빛 띠)
    for i in range(-int(r * 0.5), int(r * 0.5)):
        c.px(cx + i, round(cy - r * 0.62 + abs(i) * 0.25), K["hairL"])
    if hs >= 30:
        hd_face(c, cx, cy, r, face_x, fw, ey, view)
    else:
        # 눈: 위 속눈썹(바깥 끝이 올라감) · 회보랏빛 눈동자(위는 짙게) · 흰 빛 · 아래 밝은 빛
        eyes = (face_x - fw * 0.44, face_x + fw * 0.44) if view == "front" else (face_x + fw * 0.42,)
        for i, ex in enumerate(eyes):
            ex = round(ex) - ew // 2
            out = -1 if (view == "front" and i == 0) else 1
            c.rect(ex - 1, ey - 1, ew + 2, 1, K["eye"])
            c.px(ex + (ew + 1 if out > 0 else -2), ey - 2, K["eye"])
            c.rect(ex, ey, ew, eh, K["iris"])
            c.rect(ex, ey, ew, max(1, eh // 2), K["eye"])
            c.px(ex + (1 if out > 0 else ew - 2), ey, K["eyeL"])
            if ew >= 3: c.px(ex + (ew - 1 if out > 0 else 0), ey + eh - 1, K["whiteD"])
    # 귀걸이 (단계 1부터): 금 마름모가 늘어짐
    if stage >= 1 and view == "front":
        for side in (-1, 1):
            x = round(face_x + side * (fw + 1))
            c.px(x, ey + 2, K["goldD"]); c.px(x, ey + 3, K["gold"]); c.px(x - 1, ey + 4, K["gold"]); c.px(x + 1, ey + 4, K["gold"]); c.px(x, ey + 5, K["yellow"])


def hd_face(c, cx, cy, r, face_x, fw, ey, view):
    """2배 촘촘한 얼굴 (성장 그림): 큰 눈(두꺼운 위 속눈썹·눈동자 색 층·빛 두 점) · 볼 홍조 · 작은 코·입 · 얼굴 옆을 가리는 옆머리"""
    ew, eh = round(r * 0.42), round(r * 0.4)
    front = view == "front"
    eyes = (face_x - fw * 0.5, face_x + fw * 0.5) if front else (face_x + fw * 0.45,)
    for i, ex in enumerate(eyes):
        out = -1 if (front and i == 0) else 1
        x0 = round(ex) - ew // 2
        y0 = ey - eh // 4 + 1
        c.rect(x0, y0, ew, eh, K["iris"])
        c.rect(x0, y0 + eh - 2, ew, 2, K["irisL"])
        c.rect(x0, y0, ew, max(2, eh // 4), K["eye"])
        c.rect(x0 + ew // 2 - 1, y0 + eh // 3, 2, eh // 3, K["eye"])
        # 위 속눈썹 (두껍게, 바깥 끝이 올라가며 삐침) · 아래 속눈썹 옅게
        c.rect(x0 - 1, y0 - 1, ew + 2, 2, K["lash"])
        tip = x0 + ew + 1 if out > 0 else x0 - 2
        c.px(tip, y0 - 1, K["lash"]); c.px(tip + out, y0 - 2, K["lash"])
        c.rect(x0 + 1, y0 + eh, ew - 2, 1, K["skinD"])
        # 빛: 위 바깥 큰 점 · 아래 안쪽 작은 점
        hx0 = x0 + 1 if out > 0 else x0 + ew - 3
        c.rect(hx0, y0 + 2, 2, 2, K["eyeL"])
        c.px(x0 + (ew - 2 if out > 0 else 1), y0 + eh - 2, K["eyeL"])
        # 볼 홍조
        c.rect(round(ex) - 2 + out, y0 + eh + 2, 4, 1, K["blush"])
    nx = round(face_x + (0 if front else fw * 0.9))
    c.px(nx, ey + round(r * 0.32), K["skinD"])
    c.rect(nx - (1 if front else 2), ey + round(r * 0.55), 2, 1, K["mouth"])
    if front:
        # 옆머리가 얼굴 양옆을 덮어 갸름해 보이게 (안쪽에 흰 머리 한 줄)
        for side in (-1, 1):
            x = round(face_x + side * (fw - 1)) - (2 if side > 0 else 0)
            for y in range(int(cy - r * 0.35), int(cy + r * 1.05)):
                k = (y - (cy - r * 0.35)) / (r * 1.4)
                w = 3 if k < 0.75 else 2
                c.rect(x + (0 if side < 0 else 3 - w), y, w, 1, K["hair"])
            c.rect(x + (2 if side < 0 else 0), cy + r * 0.2, 1, r * 0.7, K["white"])


def frame_for(size, H, stage, hd=1):
    FOOT = size - 3 * hd
    CX = size // 2

    def frame(row, col):
        c = Cell(size)
        view = "front" if row == 0 or (row == 3 and col < 3) else "back" if row == 1 else "side"
        cast = row == 3
        step = 0 if cast else col
        bob = 1 if step in (1, 3) else 0
        top = FOOT - H + bob
        hs = round(H * 0.48)
        neck = top + hs
        hip = top + round(H * 0.66)
        waist = top + round(H * 0.56)
        sway = (0, 1, 0, -1)[col]
        cx = CX - (1 if view == "side" else 0)
        # 단계 2부터 머리 위 금빛 고리 (뒤에 그려 머리에 가려지는 부분)
        if stage >= 2:
            c.oval(cx, top - 2, hs * 0.42, 1.2, K["gold"]); c.oval(cx, top - 2, hs * 0.42 - 2, 0.4, None)
        # 뒤로 흘러내린 긴 머리
        if view == "front":
            hair_back(c, cx, top + hs // 2, hip + 1, hs * 0.5, view, sway)
        elif view == "side":
            hair_back(c, cx - hs * 0.35, top + hs // 2, hip + 1, hs * 0.38, view, -1 - abs(sway))
        # 다리 (맨다리 · 맨발)
        lw = max(2, round(H * 0.075))
        if view in ("front", "back"):
            lift = (0, 1, 0, -1)[step]
            for i, lx in enumerate((cx - lw - 1, cx + 1)):
                up = max(0, lift) if i == 0 else max(0, -lift)
                c.rect(lx, hip, lw, FOOT - hip - up + 1, K["skin"]); c.rect(lx + lw - 1, hip, 1, FOOT - hip - up + 1, K["skinD"])
                c.rect(lx - (1 if i == 0 else 0), FOOT - up, lw + 1, 1, K["skinD"])
        else:
            stride = (0, 2, 0, -2)[step]
            for i, sx in enumerate((cx - 1 + stride, cx - stride)):
                c.rect(sx, hip, lw, FOOT - hip + 1, K["skin"] if i == 0 else K["skinD"]); c.rect(sx + 1, FOOT, lw, 1, K["skinD"])
        # 헐렁한 검은 반바지 (벨트 · 은 버클 · 늘어진 끈)
        sw = round(H * (0.4 if view != "side" else 0.26))
        c.rect(cx - sw // 2, waist + 2, sw, hip - waist + 2, K["cloth"])
        c.rect(cx - sw // 2, hip + 3, sw, 1, K["clothL"])
        for x in range(cx - sw // 2 + 2, cx + sw // 2 - 1, 3): c.rect(x, waist + 4, 1, hip - waist - 1, K["clothM"])
        c.rect(cx - sw // 2, waist + 2, sw, 1, K["belt"])
        if view != "back": c.rect(cx - 1, waist + 2, 2, 1, K["silver"])
        c.rect(cx - sw // 2 + 1, waist + 3, 1, round(H * 0.18), K["belt"]); c.px(cx - sw // 2 + 1, waist + 3 + round(H * 0.18), K["silver"])
        if stage >= 2: c.rect(cx - sw // 2, hip + 3, sw, 1, K["goldD"])
        # 몸통: 검은 높은 깃 옷 · 가운데 좁은 트임 · 배 위 삼각 트임 + 빛의 문신 (앞)
        tw = round(H * (0.32 if view != "side" else 0.2))
        c.rect(cx - tw // 2, neck, tw, waist - neck + 2, K["cloth"])
        c.rect(cx - tw // 2 + 1, neck, 1, waist - neck, K["clothL"])
        c.rect(cx - 2, neck - 1, 4, 2, K["cloth"])
        if view == "front":
            c.rect(cx, neck + 1, 1, round((waist - neck) * 0.45), K["skin"])
            tri_top = neck + round((waist - neck) * 0.55)
            for y in range(tri_top, waist + 2):
                w = (y - tri_top) * 0.7
                c.rect(cx - w, y, w * 2 + 1, 1, K["skin"])
            ty = waist
            glow = stage >= 1
            c.px(cx, ty, K["yellow"] if glow else K["gold"])
            if glow or H >= 35:
                for d in (1,): c.px(cx - d, ty, K["gold"]); c.px(cx + d, ty, K["gold"]); c.px(cx, ty - d, K["gold"]); c.px(cx, ty + d, K["gold"])
            if stage >= 2: c.px(cx, ty, K["core"])
            if stage >= 2: c.rect(cx - 2, neck - 1, 4, 1, K["goldD"])
        # 팔 (맨팔) · 오른손에 빛의 검
        aw = max(2, round(H * 0.06))
        al = round(H * 0.24)
        if view == "front":
            c.rect(cx - tw // 2 - aw, neck + 1, aw, al, K["skin"]); c.rect(cx - tw // 2 - aw, neck + 1, aw, 2, K["cloth"])
            if cast:
                # 검을 높이 들어 올림 · 칼끝에 '+' 빛 (칸마다 커짐)
                c.rect(cx + tw // 2, neck - al // 2, aw, al // 2 + 2, K["skin"])
                tipx, tipy = cx + tw // 2 + 2, max(2, top - 4 - col)
                blade(c, cx + tw // 2 + 1, neck - al // 2, tipx, tipy, 2 if stage >= 2 else 1)
                star(c, tipx, tipy, 2 + col + stage)
            else:
                c.rect(cx + tw // 2, neck + 1, aw, al, K["skin"]); c.rect(cx + tw // 2, neck + 1, aw, 2, K["cloth"])
                hxp, hyp = cx + tw // 2 + aw // 2, neck + al
                blade(c, hxp, hyp - 1, hxp + round(H * 0.28), FOOT - 2 - (col % 2), 2 if stage >= 2 else 1)
            head(c, cx, top, hs, view, stage)
            # 맨팔이 옆 머리 위로 보이게 다시 (어깨는 검은 옷)
            c.rect(cx - tw // 2 - aw, neck + 2, aw, al - 1, K["skin"]); c.rect(cx - tw // 2 - aw, neck + 1, aw, 1, K["cloth"])
            if not cast: c.rect(cx + tw // 2, neck + 2, aw, al - 1, K["skin"]); c.rect(cx + tw // 2, neck + 1, aw, 1, K["cloth"])
        elif view == "back":
            for sx in (cx - tw // 2 - aw, cx + tw // 2): c.rect(sx, neck + 1, aw, al, K["skin"])
            head(c, cx, top, hs, view, stage)
            # 뒷모습: 머리가 등을 덮음 (안쪽 흰 머리가 끝에 보임)
            hair_back(c, cx, top + hs // 2, hip + 1, hs * 0.52, view, sway)
            blade(c, cx + tw // 2 + aw // 2, neck + al - 1, cx + tw // 2 + round(H * 0.28), FOOT - 2, 1)
        else:
            if cast:
                c.rect(cx, neck + 2, round(H * 0.28), aw, K["skin"])
                tipx = min(size - 3, cx + round(H * 0.7))
                blade(c, cx + round(H * 0.28), neck + 3, tipx, neck - 1, 2 if stage >= 2 else 1)
                star(c, tipx, neck - 1, 2 + stage)
            else:
                c.rect(cx - 1 + sway, neck + 1, aw, al, K["skin"])
                blade(c, cx + sway, neck + al, cx + round(H * 0.32), FOOT - 3, 1)
            head(c, cx, top, hs, view, stage)
        shade(c)
        c.outline(K["outline"])
        # 단계 3: 둘레에 떠다니는 '+' 빛 (윤곽 밖에 덧그림)
        if stage >= 3:
            for i, (dx, dy) in enumerate(((-0.42, 0.25), (0.45, 0.1), (-0.3, -0.05))):
                star(c, round(CX + dx * H), round(top + H * (dy + 0.3) + ((col + i) % 2)), 2 + (i + col) % 2)
        if stage >= 1 and view != "back":
            c.px(cx + sway, top + hs + 1, K["yellow"])
        return c

    return frame


def main():
    for stage, (name, size, H, hd) in enumerate(STAGES):
        save_sheet(name, frame_for(size, H, stage, hd), size=size)


if __name__ == "__main__":
    main()
