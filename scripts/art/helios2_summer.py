# 시즌 2 헬리오스 한정 스킨 '여름 파도' 옷 꾸밈 (helios2_skins에서 씀): 기본 그림 위에 여름옷을 덧그림
# 학살자: 진홍 프릴 비키니 + 허리에 묶은 붉은 비치 스카프 · 머리에 붉은 히비스커스 (모자 없음, 대낫 그대로)
# 사멸: 보랏빛 비키니(비취 매듭) + 옆으로 늘어진 연보라 파레오 · 올림머리 은침 그대로 (모자 없음)
# 역병의사: 새부리 가면 그대로 · 밀짚 챙 모자 · 꽃무늬 알로하 셔츠 + 수영 반바지
# 묵인: 갑옷을 벗은 인명 구조원 (붉은 수영 바지·목에 건 호루라기·쇠 가면 그대로)
# 이터: 상어 잠옷 수영복 (등지느러미 모자 · 흰 배 · 이빨은 원래 상어 이빨처럼)
from s2_common import hx
from virdia_summer import _restore, _top, _bottom

OUT = "#1e9ad8"

def flower(c, g, a, b, dy=2):
    """머리 옆 꽃 한 송이 (모자 아님)"""
    v, x0, y0, w = g["view"], g["hx"], g["hy"], g["hw"]
    fx = x0 + w - 1 if v != "back" else x0
    for dx, ddy in ((0, -1), (-1, 0), (1, 0), (0, 1)): c.px(fx + dx, y0 + dy + ddy, a)
    c.px(fx, y0 + dy, b)

def slayer(c, layer, g, before):
    k = g["k"]
    v, tx, ty, tw, cx, hip = g["view"], g["tx"], g["ty"], g["tw"], g["cx"], g["hip"]
    red, dark, frill = hx("#e8203a"), hx("#7a0a1e"), hx("#ffffff")
    if layer == "body":
        # 코르셋 → 맨살 (palette top = skin) · 진홍 비키니 · 컵 아래 흰 프릴 · 가운데 검붉은 리본
        _restore(c, before, lambda x, y, col: col not in (k["trim"], k["lace"]))
        _top(c, g, red, dark)
        if v == "front":
            c.px(tx + 1, ty + 3, frill); c.px(tx + 3, ty + 3, frill); c.px(tx + tw - 4, ty + 3, frill); c.px(tx + tw - 2, ty + 3, frill)
            c.px(cx, hip - 3, k["skinD"])
    if layer == "legs":
        # 치마·부츠 → 맨다리 · 비키니 아래 · 허리 옆으로 묶어 늘어뜨린 붉은 비치 스카프
        _restore(c, before, lambda x, y, col: col not in (k["skirt"], k["trim"], k["lace"]))
        _bottom(c, g, red, dark)
        if v in ("front", "back"):
            sx = tx + tw - 1 if v == "front" else tx
            for i in range(5): c.px(sx + (i // 2) * (1 if v == "front" else -1), hip + 1 + i, hx("#ff6a7a") if i % 2 else red)
        else:
            for i in range(4): c.px(cx - 3 - i // 2, hip + 1 + i, red)
    if layer == "hat":
        flower(c, g, hx("#ff2a4a"), hx("#ffe060"), 3)

def samyeol(c, layer, g, before):
    k = g["k"]
    v, tx, ty, tw, cx, hip = g["view"], g["tx"], g["ty"], g["tw"], g["cx"], g["hip"]
    pur, jade, sheer = hx("#9a4ad8"), hx("#3ad87a"), hx("#c8a8f0")
    if layer == "body":
        # 비단 윗옷 → 맨살 (palette dress = skin) · 보랏빛 비키니 + 비취 매듭 · 금빛 단추·띠 지움
        _restore(c, before, lambda x, y, col: col not in (k["jade"], k["gold"], k["dressL"]))
        _top(c, g, pur, jade)
        if v == "front": c.px(cx, hip - 3, k["skinD"])
    if layer == "legs":
        # 긴 치마 → 맨다리 · 비키니 아래 · 한쪽으로 늘어진 연보라 파레오(비치는 천)
        _restore(c, before, lambda x, y, col: col not in (k["jade"], k["dress"], k["skinD"]))
        _bottom(c, g, pur, jade)
        if v in ("front", "back"):
            side = -1 if v == "front" else 1
            for i in range(7):
                x = (tx if side < 0 else tx + tw - 1) + side * (i // 3)
                c.px(x, hip + 1 + i, sheer if i % 2 else pur)
                if i > 1: c.px(x - side, hip + 1 + i, sheer)
        else:
            for i in range(6): c.px(cx - 3, hip + 1 + i, sheer if i % 2 else pur)
    if layer == "hat":
        # 은침 옆에 작은 보랏빛 난초
        flower(c, g, hx("#c87aff"), hx("#ffffff"), 1)

def plague(c, layer, g, before):
    k = g["k"]
    v, tx, ty, tw, cx, hip = g["view"], g["tx"], g["ty"], g["tw"], g["cx"], g["hip"]
    if layer == "legs":
        # 긴 코트 자락 → 수영 반바지 (허리 아래 3줄만, 그 아래는 맨다리)
        for (x, y), col in list(c.p.items()):
            if before.get((x, y)) == col: continue
            if y < hip + 3: c.p[(x, y)] = hx("#2a8ac8") if (x + y) % 4 else hx("#ffd040")
            elif (x, y) in before: c.p[(x, y)] = before[(x, y)]
            else: del c.p[(x, y)]
    if layer == "body":
        # 꽃무늬 알로하 셔츠 (앞을 풀어 가운데 맨살)
        for (x, y), col in list(c.p.items()):
            if y < ty or y > hip: continue
            if col in (k["coat"], k["coatL"], k["top"]): c.p[(x, y)] = hx("#ff6a4a") if (x * 3 + y) % 5 == 0 else hx("#3ac8b8")
        if v == "front": c.rect(cx, ty + 2, 1, hip - ty - 2, k["skin"])

def mukin(c, layer, g, before):
    k = g["k"]
    v, tx, ty, tw, cx = g["view"], g["tx"], g["ty"], g["tw"], g["cx"]
    if layer == "body" and v == "front":
        # 갑옷 벗은 가슴 (palette plate = skin) · 복근 그늘 · 목에 건 노란 호루라기
        for y in (ty + 6, ty + 9):
            c.px(cx - 2, y, k["skinD"]); c.px(cx + 1, y, k["skinD"])
        c.line(tx + 2, ty, cx, ty + 4, hx("#e83a3a")); c.line(tx + tw - 3, ty, cx, ty + 4, hx("#e83a3a"))
        c.rect(cx - 1, ty + 4, 2, 2, hx("#ffd040"))

def eater(c, layer, g, before):
    k = g["k"]
    v, hx0, hy, hw, tx, ty, tw, cx, hip = g["view"], g["hx"], g["hy"], g["hw"], g["tx"], g["ty"], g["tw"], g["cx"], g["hip"]
    belly = hx("#e8f0f8")
    if layer == "body" and v == "front":
        # 상어 배: 흰 배 + 아가미 줄
        c.rect(cx - 2, ty + 2, 4, hip - ty - 2, belly)
        for y in (ty + 2, ty + 4): c.px(tx, y, hx("#1e4a7a")); c.px(tx + tw - 1, y, hx("#1e4a7a"))
    if layer == "hat":
        # 등지느러미 모자 (머리 위 세모)
        fx = cx if v != "side" else hx0 + 2
        for i in range(4): c.rect(fx - (3 - i) // 2 - (1 if v == "side" else 0), hy - 1 - i, max(1, 4 - i), 1, hx("#3a6aa8"))
        c.px(fx, hy - 4, hx("#8ac8f0"))

SUMMER = dict(slayer=slayer, samyeol=samyeol, plague=plague, mukin=mukin, eater=eater)

def _p(**kw):
    return {k: hx(v) for k, v in kw.items()}

SKIN_S = dict(skin="#f6e4dc", skinD="#d0b0aa")
SUMMER_COLORS = {
    "slayer": _p(outline=OUT, top="#f6e4dc", legs="#f6e4dc", legsD="#d0b0aa", shoe="#e8c0a8"),
    "samyeol": _p(outline=OUT, dress="#f4e2d8", dressL="#f4e2d8", top="#f4e2d8", shoe="#e8c8b8"),
    "plague": _p(outline=OUT, hair="#f0d890", hairD="#c8a050", hairL="#fff0b0", brim="#b88a40", belt="#ff6a8a", legs="#e8dcc0", legsD="#b8a888", shoe="#c8a070", arm="#e8dcc0"),
    "mukin": _p(outline=OUT, plate="#c8906a", plateL="#e0aa84", plateD="#9a6a4a", rivet="#c8906a", cloth="#e83a3a", clothD="#a81e26", legs="#c8906a", legsD="#9a6a4a", shoe="#e8c070"),
    "eater": _p(outline=OUT, top="#3a6aa8", arm="#3a6aa8", legs="#3a6aa8", legsD="#2a4a7a", hair="#3a6aa8", hairD="#2a4a7a", hairL="#6a9ad8", skin="#3a6aa8", skinD="#2a4a7a", wisp="#8ac8f0"),
}
