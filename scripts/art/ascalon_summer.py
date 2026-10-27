# 시즌 2 아스칼론 한정 스킨 '여름 파도' 옷 꾸밈 (ascalon_skins에서 씀): 기본 그림 위에 여름옷을 덧그림
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

SUMMER = dict(tracker=tracker)

def _p(**kw):
    return {k: hx(v) for k, v in kw.items()}

SUMMER_COLORS = {
    "tracker": _p(outline=OUT, top="#f2d6c2", arm="#f2d6c2", legs="#f2d6c2", legsD="#d0ac96", shoe="#ffd040", gun="#3ac8e8", stock="#ffd040", scope="#ff6a8a"),
}
