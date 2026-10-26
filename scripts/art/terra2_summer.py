# 시즌 2 테라코어 한정 스킨 '여름 파도' 옷 꾸밈 (terra2_skins에서 씀): 기본 그림 위에 여름옷을 덧그림
# 펑크: 네온 분홍 비키니(하늘빛 매듭·가슴 아래 네온 끈) + 허리에 두른 비치는 하늘빛 사롱 · 크롬 팔 그대로 · 머리에 네온 히비스커스 (모자 없음)
# 오토마타: 하늘빛 프릴 수영복 원피스 · 관절 이음매·회로 줄 그대로 · 머리 옆 하얀 조개 장식 (모자 없음)
# 라이더: 앞을 푼 파랑 알로하 셔츠 + 흰 바다빛 오토바이 · 이마에 올린 검은 선글라스
# 붐버: 흰 민소매 + 주황 수영 반바지 · 목에 두른 수건 · 수박 무늬 폭탄 띠
# 아티팩터: 조끼를 벗은 맨몸(문신이 더 잘 보임) + 남색 수영 반바지 · 목에 건 놋쇠 열쇠 목걸이
from s2_common import hx
from virdia_summer import _restore, _top, _bottom
from helios2_summer import flower

OUT = "#1e9ad8"

def punk(c, layer, g, before):
    k = g["k"]
    v, tx, ty, tw, cx, hip = g["view"], g["tx"], g["ty"], g["tw"], g["cx"], g["hip"]
    pink, cyan, sheer = hx("#ff3ac8"), hx("#4af0ff"), hx("#a8f4ff")
    if layer == "body":
        # 짧은 재킷 → 맨살 (크롬 팔은 그대로) · 네온 분홍 비키니 + 하늘빛 매듭 · 가슴 아래 네온 끈 · 배꼽 피어싱
        _restore(c, before, lambda x, y, col: col not in (k["jacket"], k["neon"]))
        if v == "front":
            # 작은 세모 컵 둘 (사이는 맨살) · 가운데 하늘빛 고리 · 목 뒤로 묶는 하늘빛 끈
            for x0 in (tx + 1, tx + tw - 4):
                c.rect(x0, ty + 1, 3, 1, pink); c.px(x0 + 1, ty + 2, pink); c.px(x0 + 1, ty, hx("#ff8ae0"))
            c.px(cx - 1, ty + 1, cyan); c.px(tx + 1, ty, cyan); c.px(tx + tw - 2, ty, cyan)
            c.px(cx - 1, hip - 3, k["skinD"]); c.px(cx - 1, hip - 2, cyan)
        else:
            _top(c, g, pink, cyan)
    if layer == "legs":
        # 반바지·부츠 → 맨다리 · 비키니 아래 · 한쪽 허리에 묶어 늘어뜨린 비치는 하늘빛 사롱 (끝단 분홍)
        _restore(c, before, lambda x, y, col: col not in (k["shorts"], k["neon"]))
        _bottom(c, g, pink, cyan)
        if v in ("front", "back"):
            side = 1 if v == "front" else -1
            for i in range(7):
                x = (tx + tw - 1 if side > 0 else tx) + side * (i // 3)
                c.px(x, hip + 1 + i, pink if i == 6 else (sheer if i % 2 else cyan))
                if 1 < i < 6: c.px(x - side, hip + 1 + i, sheer)
        else:
            for i in range(6): c.px(cx - 3, hip + 1 + i, sheer if i % 2 else cyan)
    if layer == "hat":
        # 쓸어 넘긴 머리 옆 네온 히비스커스
        flower(c, g, hx("#ff3ac8"), hx("#4af0ff"), 2)

def automata(c, layer, g, before):
    k = g["k"]
    v, tx, ty, tw, cx, hip = g["view"], g["tx"], g["ty"], g["tw"], g["cx"], g["hip"]
    sky, frill = hx("#5ad0ff"), hx("#ffffff")
    if layer == "body":
        # 흰 몸판 → 하늘빛 수영복 · 가슴의 흰 프릴 · 회로 줄은 그대로
        if v == "front":
            for x in range(tx, tx + tw, 2): c.px(x, ty, frill)
    if layer == "legs":
        # 기계 치마 → 짧은 프릴 치마 한 줄 (아래는 도자기 다리)
        _restore(c, before, lambda x, y, col: y <= hip + 1 and col in (k["dress"], k["glow"]))
        if v in ("front", "back"):
            c.rect(tx - 1, hip, tw + 2, 1, sky)
            for x in range(tx - 1, tx + tw + 1, 2): c.px(x, hip + 1, frill)
        else:
            c.rect(cx - 4, hip, 8, 1, sky); c.px(cx - 4, hip + 1, frill); c.px(cx + 2, hip + 1, frill)
    if layer == "hat":
        # 머리 옆 하얀 조개 장식
        flower(c, g, hx("#ffffff"), hx("#ffc8d8"), 3)

def rider(c, layer, g, before):
    k = g["k"]
    v, tx, ty, tw, th, cx = g["view"], g["tx"], g["ty"], g["tw"], g["th"], g["cx"]
    if layer == "body":
        # 앞을 푼 파랑 알로하 셔츠 (palette top = 파랑) · 흰 꽃무늬 · 가운데 맨살
        for (x, y), col in list(c.p.items()):
            if ty <= y < ty + th and col in (k["top"], k["stripe"], k["strap"]):
                c.p[(x, y)] = hx("#ffffff") if (x * 3 + y * 2) % 7 == 0 else (hx("#ffd040") if (x + y * 5) % 11 == 0 else k["top"])
        if v == "front": c.rect(cx - 1, ty + 1, 2, th - 2, k["skin"])

def bomber(c, layer, g, before):
    k = g["k"]
    v, tx, ty, tw, th, cx, hip = g["view"], g["tx"], g["ty"], g["tw"], g["th"], g["cx"], g["hip"]
    if layer == "body":
        # 작업복 → 흰 민소매 · 목에 두른 주황 수건 · 폭탄 띠는 수박 무늬(초록·빨강)
        for (x, y), col in list(c.p.items()):
            if before.get((x, y)) == col: continue
            if col == k["belt"] and y < hip - 2: c.p[(x, y)] = hx("#3aa84a") if (x + y) % 2 else hx("#e83a4a")
            elif col == k["bomb"]: c.p[(x, y)] = hx("#2a7a3a")
        if v in ("front", "back"): c.rect(tx - 2, ty + 1, 2, th - 2, k["skin"]); c.rect(tx + tw, ty + 1, 2, th - 2, k["skin"])
    if layer == "legs" and v in ("front", "back"):
        # 수영 반바지 줄무늬
        for x in range(tx, tx + tw, 2): c.px(x, hip + 1, hx("#ffffff"))

def artifacter(c, layer, g, before):
    k = g["k"]
    v, tx, ty, tw, th, cx, hip = g["view"], g["tx"], g["ty"], g["tw"], g["th"], g["cx"], g["hip"]
    if layer == "body":
        # 조끼를 벗은 맨몸 (palette top·coat = 살색) · 가슴의 문신 한 줄 · 목에 건 놋쇠 열쇠
        if v == "front":
            for y in range(ty + 2, hip - 2, 2): c.px(tx + 1, y, k["ink"]); c.px(tx + tw - 2, y, k["inkL"])
            c.line(tx + 2, ty, cx, ty + 3, k["brass"]); c.line(tx + tw - 3, ty, cx, ty + 3, k["brass"])
            c.rect(cx, ty + 3, 1, 3, k["brass"]); c.px(cx + 1, ty + 5, k["brass"])
    if layer == "legs":
        # 조끼 자락 지움 · 남색 수영 반바지 (흰 줄)
        _restore(c, before, lambda x, y, col: col != k["coat"])
        if v in ("front", "back"):
            c.rect(tx, hip, tw, 3, hx("#2a3a8a")); c.px(tx, hip + 1, hx("#ffffff")); c.px(tx + tw - 1, hip + 1, hx("#ffffff"))
        else:
            c.rect(cx - 3, hip, 6, 3, hx("#2a3a8a"))

SUMMER = dict(punk=punk, automata=automata, rider=rider, bomber=bomber, artifacter=artifacter)

def _p(**kw):
    return {k: hx(v) for k, v in kw.items()}

SUMMER_COLORS = {
    "punk": _p(outline=OUT, legs="#f2d4c4", legsD="#d0aa98", shoe="#ff8ad8"),
    "automata": _p(outline=OUT, top="#5ad0ff", dress="#ffffff", shoe="#5ad0ff"),
    "rider": _p(outline=OUT, top="#2a7ad8", arm="#2a7ad8", goggle="#141420", bike="#e8f4ff", bikeD="#8ac8e8", bikeL="#ffffff", lamp="#ffe080", legs="#2a7ad8", legsD="#1a5aa8"),
    "bomber": _p(outline=OUT, top="#f4f4f8", arm="#e8c0a0", scarf="#ff8a3a", legs="#ff8a3a", legsD="#c86a2a", shoe="#e8c0a0"),
    "artifacter": _p(outline=OUT, top="#e0b898", coat="#e0b898", legs="#e0b898", legsD="#b89070", shoe="#c8a070"),
}
