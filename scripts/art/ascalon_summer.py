# 시즌 2 아스칼론 한정 스킨 '여름 파도' 옷 꾸밈 (ascalon_skins에서 씀): 기본 그림 위에 여름옷을 덧그림
# 잊혀진 자: 드레스를 벗은 맨살 + 흰·금 비키니(하늘빛 보석) · 허리에 두른 비치는 하늘빛 사롱(금 테) · 금 머리띠 그대로 · 머리 옆 하얀 꽃
# 잔영: 두건·입가리개를 벗어 은회색 머리와 얼굴이 보임 · 앞을 푼 검은 셔츠 + 보라 수영 반바지(흰 줄) · 목에 건 하늘빛 수건 · 머리 옆 보라 꽃
# 방랑객: 삿갓은 그대로(여름 햇빛 가리개) · 앞을 푼 하늘빛 꽃무늬 하오리 + 가운데 맨살 · 붉은 허리띠 그대로 · 하늘빛 수영 반바지(흰 줄) · 카타나는 대나무 칼
# 추적자: 망토·사냥복을 벗은 맨살 + 산호빛 비키니(하늘빛 매듭) · 하늘빛 보드 반바지 · 저격총은 노랑·하늘빛 물총 · 머리 옆 히비스커스
from s2_common import hx
from virdia_summer import _restore, _top, _bottom
from helios2_summer import flower

OUT = "#1e9ad8"

def tracker(c, layer, g, before):
    k = g["k"]
    v, tx, ty, tw, cx, hip = g["view"], g["tx"], g["ty"], g["tw"], g["cx"], g["hip"]
    coral, sky = hx("#ff6a6a"), hx("#5ad0ff")
    if layer == "body":
        # 망토·탄띠 → 맨살 (물총은 그대로) · 비키니 · 허리 끈
        _restore(c, before, lambda x, y, col: col not in (k["cloak"], k["cloakD"], k["belt"], k["ammo"]))
        _top(c, g, coral, sky)
        if v == "front": c.px(cx - 1, hip - 3, k["skinD"])
    if layer == "legs":
        # 장화 끈 지움 · 하늘빛 보드 반바지 (흰 줄)
        _restore(c, before, lambda x, y, col: col != k["belt"])
        _bottom(c, g, sky, hx("#ffffff"), 3)
        if v in ("front", "back"): c.px(tx, hip + 1, hx("#ffffff")); c.px(tx + tw - 1, hip + 1, hx("#ffffff"))
    if layer == "hat":
        flower(c, g, hx("#ff5a8a"), hx("#ffd040"), 2)

def forgotten(c, layer, g, before):
    k = g["k"]
    v, tx, ty, tw, cx, hip = g["view"], g["tx"], g["ty"], g["tw"], g["cx"], g["hip"]
    white, gold, sky, sheer = hx("#ffffff"), hx("#f2c040"), hx("#5ad0ff"), hx("#b8ecff")
    if layer == "body":
        # 드레스 윗옷 → 맨살 · 흰 비키니(금 매듭) · 배꼽 위 하늘빛 보석 끈
        _restore(c, before, lambda x, y, col: col not in (k["dress"], k["dressD"], k["gem"]) and not (col == k["gold"] and y > ty + 2))
        _top(c, g, white, gold)
        if v == "front": c.px(cx - 1, hip - 2, sky)
    if layer == "legs":
        # 드레스 자락 → 맨다리 · 비키니 아래 · 비치는 하늘빛 사롱 (한쪽이 트임, 끝단 금)
        _restore(c, before, lambda x, y, col: col not in (k["dress"], k["dressD"], k["gold"]))
        _bottom(c, g, white, gold)
        if v in ("front", "back"):
            for i in range(5):
                c.rect(tx - 1, hip + 2 + i, tw - 2, 1, sheer if i % 2 else sky)
            c.rect(tx - 1, hip + 7, tw - 2, 1, gold)
        else:
            for i in range(5): c.rect(cx - 3, hip + 2 + i, 5, 1, sheer if i % 2 else sky)
    if layer == "hat":
        flower(c, g, hx("#ffffff"), hx("#ffd040"), 4)

def remnant(c, layer, g, before):
    k = g["k"]
    v, tx, ty, tw, th, cx, hip = g["view"], g["tx"], g["ty"], g["tw"], g["th"], g["cx"], g["hip"]
    shirt, violet = hx("#2a2a3a"), hx("#7a4ae8")
    if layer == "hair":
        # 두건·입가리개 지움 → 원래 머리와 얼굴
        _restore(c, before, lambda x, y, col: col not in (k["hood"], k["hoodD"], k["scarfD"]))
    if layer == "body":
        # 망토·띠·단검 지움 · 앞을 푼 검은 셔츠 (가운데 맨살) · 목의 수건(palette scarf)
        _restore(c, before, lambda x, y, col: col not in (k["hood"], k["hoodD"], k["belt"], k["blade"]) or y < ty + 2)
        if v in ("front", "back"):
            c.rect(tx, ty + 2, 2, th - 2, shirt); c.rect(tx + tw - 2, ty + 2, 2, th - 2, shirt)
            c.rect(tx - 2, ty + 1, 2, 3, shirt); c.rect(tx + tw, ty + 1, 2, 3, shirt)
            if v == "back": c.rect(tx, ty + 2, tw, th - 2, shirt)
        else:
            c.rect(cx - 3, ty + 2, 3, th - 2, shirt)
    if layer == "legs":
        # 망토 자락 지움 · 보라 수영 반바지
        _restore(c, before, lambda x, y, col: col not in (k["hood"], k["hoodD"]))
        if v in ("front", "back"):
            c.rect(tx, hip, tw, 3, violet); c.px(tx, hip + 1, hx("#ffffff")); c.px(tx + tw - 1, hip + 1, hx("#ffffff"))
        else:
            c.rect(cx - 3, hip, 6, 3, violet)
    if layer == "hat":
        flower(c, g, hx("#b88aff"), hx("#ffffff"), 2)

def wanderer(c, layer, g, before):
    k = g["k"]
    v, tx, ty, tw, th, cx, hip = g["view"], g["tx"], g["ty"], g["tw"], g["th"], g["cx"], g["hip"]
    if layer == "body":
        # 겉옷에 흰·노랑 꽃무늬 · 가운데 맨살 (흰 속옷 대신)
        for (x, y), col in list(c.p.items()):
            if before.get((x, y)) == col: continue
            if col == k["coat"] and (x * 3 + y * 2) % 7 == 0: c.p[(x, y)] = hx("#ffffff")
            elif col == k["coat"] and (x + y * 5) % 11 == 0: c.p[(x, y)] = hx("#ffd040")
            elif col == k["top"]: c.p[(x, y)] = k["skin"]
        if v == "front": c.rect(cx - 1, ty + 1, 2, th - 3, k["skin"])
    if layer == "legs":
        # 하카마 → 하늘빛 수영 반바지 (흰 줄) · 맨다리
        _restore(c, before, lambda x, y, col: col not in (k["legs"], k["legsD"]))
        if v in ("front", "back"):
            c.rect(tx, hip, tw, 3, hx("#3ac8e8")); c.px(tx, hip + 1, hx("#ffffff")); c.px(tx + tw - 1, hip + 1, hx("#ffffff"))
        else:
            c.rect(cx - 3, hip, 6, 3, hx("#3ac8e8"))

def silk(c, layer, g, before):
    # 영사: 드레스를 벗은 맨살 + 검은·분홍 끈 비키니 · 허리에 묶은 비치는 분홍 사롱(금 테) · 은실 반지 그대로 · 머리 옆 분홍 꽃
    k = g["k"]
    v, tx, tw, cx, hip = g["view"], g["tx"], g["tw"], g["cx"], g["hip"]
    pink, black, sheer = hx("#ff4aa8"), hx("#2a1a2e"), hx("#ffc0e0")
    if layer == "body":
        _restore(c, before, lambda x, y, col: col not in (k["dress"], k["dressD"], k["trim"]))
        _top(c, g, black, pink)
    if layer == "legs":
        _restore(c, before, lambda x, y, col: col not in (k["dress"], k["dressD"], k["trim"]))
        _bottom(c, g, black, pink)
        if v in ("front", "back"):
            for i in range(5): c.rect(tx, hip + 2 + i, tw - 2, 1, sheer if i % 2 else pink)
            c.rect(tx, hip + 7, tw - 2, 1, hx("#ffd860"))
        else:
            for i in range(5): c.rect(cx - 3, hip + 2 + i, 5, 1, sheer if i % 2 else pink)
    if layer == "hat":
        flower(c, g, hx("#ff6ab8"), hx("#ffffff"), 2)

SUMMER = dict(tracker=tracker, forgotten=forgotten, remnant=remnant, wanderer=wanderer, silk=silk)

def _p(**kw):
    return {k: hx(v) for k, v in kw.items()}

SUMMER_COLORS = {
    "forgotten": _p(outline=OUT, legs="#fbe8dc", legsD="#e0c0b0", shoe="#f2c040"),
    "remnant": _p(outline=OUT, top="#e8cdb8", arm="#e8cdb8", legs="#e8cdb8", legsD="#c0a490", shoe="#2a2a3a", scarf="#5ad0ff"),
    "wanderer": _p(outline=OUT, coat="#3aa8e8", coatD="#1e7ab8", arm="#3aa8e8", legs="#e8c4a4", legsD="#c09878", sheath="#7ab84a", blade="#c8e890", shoe="#c8a870"),
    "silk": _p(outline=OUT, top="#f8e0d4", shoe="#ff4aa8"),
    "tracker": _p(outline=OUT, top="#f2d6c2", arm="#f2d6c2", legs="#f2d6c2", legsD="#d0ac96", shoe="#ffd040", gun="#3ac8e8", stock="#ffd040", scope="#ff6a8a"),
}
