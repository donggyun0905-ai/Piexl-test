# 시즌 2 한정 스킨 '여름 파도' 옷 꾸밈 (virdia_skins에서 씀): 기본 그림 위에 여름옷을 덧그림
# 변희: 산호빛 비키니·히비스커스 · 플라이: 검정·물빛 스포츠 수영복·선글라스(날개 그대로) · 렌: 두건 대신 머리를 풀고 흰 비치 가운 + 초록 비키니
# 장로: 웃통 벗은 할아버지 + 꽃무늬 수영 반바지·선글라스 · 이드라(아이): 여름 원피스 + 튜브 · 정령사(학생): 세일러 깃 래시가드 + 수영 치마
from s2_common import hx

def _restore(c, before, keep):
    """keep(x, y, col)이 False인 새 픽셀을 그리기 전으로 되돌림"""
    for (x, y), col in list(c.p.items()):
        if before.get((x, y)) == col or keep(x, y, col): continue
        if (x, y) in before: c.p[(x, y)] = before[(x, y)]
        else: del c.p[(x, y)]

def _top(c, g, cup, tie):
    """비키니 윗옷: 컵 둘 + 가운데 매듭 + 어깨끈 (옆·뒤는 띠)"""
    v, tx, ty, tw, cx = g["view"], g["tx"], g["ty"], g["tw"], g["cx"]
    if v == "front":
        c.rect(tx + 1, ty + 1, 3, 2, cup); c.rect(tx + tw - 4, ty + 1, 3, 2, cup)
        c.px(cx, ty + 1, tie); c.px(tx + 1, ty, cup); c.px(tx + tw - 2, ty, cup)
    elif v == "back":
        c.rect(tx, ty + 1, tw, 1, cup); c.px(cx, ty + 1, tie); c.px(tx + 1, ty, cup); c.px(tx + tw - 2, ty, cup)
    else:
        c.rect(cx - 1, ty + 1, 3, 2, cup); c.px(cx - 2, ty + 1, tie)

def _bottom(c, g, col, tie, rows=2):
    v, tx, tw, cx, hip = g["view"], g["tx"], g["tw"], g["cx"], g["hip"]
    if v in ("front", "back"):
        c.rect(tx, hip, tw, rows, col); c.px(tx - 1, hip, tie); c.px(tx + tw, hip, tie)
    else:
        c.rect(cx - 3, hip, 6, rows, col); c.px(cx - 4, hip, tie)

def byeonhui(c, layer, g, before):
    k = g["k"]
    skin = k["skin"]
    if layer == "body":
        # 짧은 윗옷 → 맨살 위 산호빛 비키니 · 짐승 이빨 목걸이는 그대로
        _restore(c, before, lambda x, y, col: col not in (k["crop"], k["cropD"]))
        _top(c, g, hx("#ff6a7a"), hx("#ffd040"))
        if g["view"] == "front": c.px(g["cx"], g["ty"] + 3, k["fang"])
    if layer == "legs":
        _restore(c, before, lambda x, y, col: col != k["shorts"])
        _bottom(c, g, hx("#ff6a7a"), hx("#ffd040"))
    if layer == "hat":
        # 히비스커스 한 송이 · 발목 조개 발찌
        v, x0, y0, w = g["view"], g["hx"], g["hy"], g["hw"]
        fx = x0 + w - 1 if v != "back" else x0
        for dx, dy in ((0, -1), (-1, 0), (1, 0), (0, 1)): c.px(fx + dx, y0 + 2 + dy, hx("#ff4a6a"))
        c.px(fx, y0 + 2, hx("#ffd040"))

def fly(c, layer, g, before):
    k = g["k"]
    if layer == "body":
        _restore(c, before, lambda x, y, col: col not in (k["crop"], k["cropL"]))
        v, tx, ty, tw, cx = g["view"], g["tx"], g["ty"], g["tw"], g["cx"]
        # 운동복 같은 수영 윗옷 (가슴만) + 물빛 줄
        if v in ("front", "back"): c.rect(tx, ty + 1, tw, 3, k["crop"]); c.rect(tx, ty + 3, tw, 1, hx("#3ad8e8")); c.px(tx + 1, ty, k["crop"]); c.px(tx + tw - 2, ty, k["crop"])
        else: c.rect(cx - 2, ty + 1, 4, 3, k["crop"]); c.rect(cx - 2, ty + 3, 4, 1, hx("#3ad8e8"))
    if layer == "legs":
        # 레깅스 → 맨다리(색은 virdia_skins) + 짧은 수영 바지 (물빛 옆줄)
        v, tx, tw, cx, hip = g["view"], g["tx"], g["tw"], g["cx"], g["hip"]
        if v in ("front", "back"):
            c.rect(tx, hip, tw, 3, k["crop"]); c.px(tx, hip + 1, hx("#3ad8e8")); c.px(tx + tw - 1, hip + 1, hx("#3ad8e8"))
        else:
            c.rect(cx - 3, hip, 6, 3, k["crop"]); c.px(cx - 3, hip + 1, hx("#3ad8e8"))
    if layer == "hat":
        # 머리 위에 올린 선글라스
        v, x0, y0, w = g["view"], g["hx"], g["hy"], g["hw"]
        if v == "front":
            for gx in (x0 + 1, x0 + w - 4): c.rect(gx, y0, 3, 2, hx("#1a1a24")); c.px(gx, y0, hx("#6ae8ff"))
            c.rect(x0 + 4, y0, 1, 1, hx("#1a1a24"))
        elif v == "side": c.rect(x0 + w - 3, y0, 3, 2, hx("#1a1a24"))

def ren(c, layer, g, before):
    k = g["k"]
    if layer == "back_hair":
        # 두건 대신 등까지 풀어 내린 갈색 머리
        for (x, y), col in list(c.p.items()):
            if before.get((x, y)) != col and col == k["hood"]: c.p[(x, y)] = k["hairD"]
    if layer == "hair":
        for (x, y), col in list(c.p.items()):
            if before.get((x, y)) == col: continue
            if col in (k["hood"], k["robeL"]): c.p[(x, y)] = k["hair"]
            elif col == k["shade"]: c.p[(x, y)] = k["hairL"]
    if layer in ("legs", "body") and g["view"] == "front":
        # 앞이 트인 흰 비치 가운: 가운데로 맨살 + 초록 비키니
        cx, ty, hip = g["cx"], g["ty"], g["hip"]
        if layer == "legs":
            for y in range(hip, 28): c.rect(cx - 1, y, 3, 1, k["skin"] if y < hip + 4 else before.get((cx, y), k["skin"]))
            c.rect(cx - 2, hip, 5, 2, hx("#4ac86a"))
        else:
            c.rect(cx - 1, ty + 1, 3, hip - ty - 1, k["skin"])
            c.rect(cx - 2, ty + 1, 2, 2, hx("#4ac86a")); c.rect(cx + 1, ty + 1, 2, 2, hx("#4ac86a"))

def elder(c, layer, g, before):
    k = g["k"]
    if layer == "legs":
        # 도포 자락 → 꽃무늬 수영 반바지 (아래는 맨다리)
        hip = g["hip"]
        for (x, y), col in list(c.p.items()):
            if before.get((x, y)) == col: continue
            if y < hip + 3: c.p[(x, y)] = hx("#ffd040") if (x + y) % 3 == 0 else hx("#3a8aff")
            elif (x, y) in before: c.p[(x, y)] = before[(x, y)]
            else: del c.p[(x, y)]
    if layer == "body":
        # 웃통 벗음: 허리띠·가운데 줄 지우고 배 그늘·배꼽
        tx, ty, tw, cx, hip = g["tx"], g["ty"], g["tw"], g["cx"], g["hip"]
        for (x, y), col in list(c.p.items()):
            if col in (k["sash"], k["robeL"]) and before.get((x, y)) != col: c.p[(x, y)] = k["skin"]
        if g["view"] == "front":
            c.px(cx, hip - 3, k["skinD"]); c.px(tx + 2, ty + 3, k["skinD"]); c.px(tx + tw - 3, ty + 3, k["skinD"])
    if layer == "hat":
        v, x0, y0, w = g["view"], g["hx"], g["hy"], g["hw"]
        if v == "front":
            for gx in (x0 + 1, x0 + w - 4): c.rect(gx, y0 + g["hh"] // 2, 3, 1, hx("#1a1a24"))
        elif v == "side": c.rect(x0 + w - 3, y0 + g["hh"] // 2, 3, 1, hx("#1a1a24"))

def idra(c, layer, g, before):
    if layer == "body":
        # 허리의 분홍·흰 줄무늬 튜브
        v, tx, tw, cx, hip = g["view"], g["tx"], g["tw"], g["cx"], g["hip"]
        x0, w = (tx - 3, tw + 6) if v != "side" else (cx - 5, 10)
        for i in range(w):
            col = hx("#ff8ab0") if (i // 2) % 2 == 0 else hx("#ffffff")
            c.px(x0 + i, hip - 2, col); c.px(x0 + i, hip - 1, col)

def spiritist(c, layer, g, before):
    pass

SUMMER_EXTRA = dict(byeonhui=byeonhui, fly=fly, ren=ren, elder=elder, idra=idra, spiritist=spiritist)
