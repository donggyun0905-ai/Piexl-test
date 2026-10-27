# 시즌 2 아스칼론 한정 스킨 '여름 파도' 옷 꾸밈 (ascalon_skins에서 씀): 기본 그림 위에 여름옷을 덧그림
# 잊혀진 자: 드레스를 벗은 맨살 + 흰·금 비키니(하늘빛 보석) · 허리에 두른 비치는 하늘빛 사롱(금 테) · 금 머리띠 그대로 · 머리 옆 하얀 꽃
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

SUMMER = dict(tracker=tracker, forgotten=forgotten)

def _p(**kw):
    return {k: hx(v) for k, v in kw.items()}

SUMMER_COLORS = {
    "forgotten": _p(outline=OUT, legs="#fbe8dc", legsD="#e0c0b0", shoe="#f2c040"),
    "tracker": _p(outline=OUT, top="#f2d6c2", arm="#f2d6c2", legs="#f2d6c2", legsD="#d0ac96", shoe="#ffd040", gun="#3ac8e8", stock="#ffd040", scope="#ff6a8a"),
}
