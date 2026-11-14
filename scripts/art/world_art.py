"""세계 지도 그림(B안, docs/WORLD_ART.md) 손질 → 게임에 넣기
- 땅 결: art/지도/ascalon/땅/{이름}.png (예전 자리 art/지도/땅/도 읽음) → public/world/tex/{이름}.png (256×256 = 지도 4칸, 이어 붙여도 이음매 없게, 색 48개)
- 물건 묶음: art/지도/ascalon/물건/{묶음}.png (마젠타 배경 위 한 줄로 여러 개) → 배경 지우고 왼쪽부터 하나씩 잘라
  public/world/obj/{이름}.png (크기 = 지도 크기 × 4, 아래 가운데가 발)
- 다 하면 public/world/art.json 목록을 새로 씀 (게임은 목록에 있는 그림만 받음, 없는 것은 코드 그림)
실행: python3 scripts/art/world_art.py   (있는 원본만 손질) · 이름을 주면 그것만: python3 scripts/art/world_art.py marble redBrick
"""
from pathlib import Path
import json
import sys
import numpy as np
from PIL import Image, ImageEnhance

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "art" / "지도"
PUB = ROOT / "apps/client/public/world"
def src_of(kind, name):
    """나라 폴더(art/지도/ascalon/땅) 먼저, 그다음 다른 나라 폴더, 없으면 예전 자리(art/지도/땅)"""
    others = sorted(p / kind for p in SRC.iterdir() if p.is_dir() and p.name not in ("ascalon", kind))
    for d in (SRC / "ascalon" / kind, *others, SRC / kind):
        if (d / f"{name}.png").exists():
            return d / f"{name}.png"
    return SRC / "ascalon" / kind / f"{name}.png"


TEX = ["grass", "path", "sand", "water", "deep", "field", "floor", "snow", "wallTop", "wallFace", "bridge", "marble", "redBrick", "goldStone", "metalFloor", "forestFloor"]
TEX_PX = 256
# 캐릭터 그림과 어울리게 색 맞춤 (채도·밝기 배율): 땅은 배경이라 더 차분하게
TONE_TEX = (0.62, 0.92)
TONE_OBJ = (0.9, 1.0)


def tone(img, sat_bri):
    """채도·밝기를 줄여 캐릭터보다 덜 튀게 (투명은 그대로)"""
    a = img.getchannel("A") if img.mode == "RGBA" else None
    rgb = ImageEnhance.Brightness(ImageEnhance.Color(img.convert("RGB")).enhance(sat_bri[0])).enhance(sat_bri[1])
    if a is not None:
        rgb.putalpha(a)
    return rgb
# 묶음 → (이름, 기준, 픽셀) 왼쪽부터 · 기준 h = 높이, w = 폭 (그림 픽셀, 지도 1픽셀 = 4)
SHEETS = {
    "trees": [("tree_oak", "h", 152), ("tree_oak2", "h", 140), ("tree_pine", "h", 160), ("tree_pine2", "h", 148)],
    "rocks": [("rock_big", "w", 68), ("rock_small", "w", 48), ("bush", "w", 52)],
    "houses": [("house_red", "w", 192), ("house_blue", "w", 192)],
    "places": [("cave", "w", 176), ("sign", "h", 72)],
    # 큰 건물은 게임에서 건물 덩어리 폭에 맞춰 늘림 (여기 크기는 해상도)
    # 이름이 None인 것은 아직 지도에 쓸 곳이 없어 만들지 않음 (게임이 받지 않게)
    "palace": [("palace", "w", 1024), ("villa_helios", "w", 320), (None, "h", 256)],
    "giantTrees": [("giant_tree", "w", 704), (None, "h", 480), (None, "w", 320)],
    "elfCastle": [(None, "w", 1024), ("treehouse", "w", 192)],
    "factories": [("factory", "w", 448), (None, "h", 320), (None, "w", 320)],
}


def quantize(img, colors):
    """RGBA → 색 줄이기 (투명은 그대로)"""
    a = img.getchannel("A").point(lambda v: 255 if v >= 128 else 0)
    q = img.convert("RGB").quantize(colors=colors, method=Image.Quantize.MEDIANCUT).convert("RGB")
    q.putalpha(a)
    return q


def seamless(img):
    """가운데로 반 칸 옮긴 그림과 섞어 가장자리 이음매를 없앰 (가장자리는 옮긴 그림, 가운데는 원래 그림)"""
    a = np.asarray(img, dtype=np.float32)
    n = a.shape[0]
    b = np.roll(a, (n // 2, n // 2), axis=(0, 1))
    d = np.minimum(np.arange(n), n - 1 - np.arange(n)) / (n * 0.25)
    w1 = np.clip(d, 0, 1)
    w = np.minimum(w1[:, None], w1[None, :])[..., None]
    return Image.fromarray((a * w + b * (1 - w)).astype(np.uint8))


def make_tex(name):
    src = src_of("땅", name)
    if not src.exists():
        return False
    img = Image.open(src).convert("RGB")
    s = min(img.size)
    img = img.crop(((img.width - s) // 2, (img.height - s) // 2, (img.width + s) // 2, (img.height + s) // 2))
    img = tone(seamless(img.resize((TEX_PX, TEX_PX), Image.Resampling.LANCZOS)), TONE_TEX)
    img = img.convert("RGBA")
    quantize(img, 48).save(PUB / "tex" / f"{name}.png", optimize=True)
    return True


def cut_background(img):
    """배경색(가장자리 색의 중간값)과 가까운 픽셀을 투명하게"""
    a = np.asarray(img.convert("RGB"), dtype=np.int32)
    edge = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]])
    bg = np.median(edge, axis=0)
    dist = np.sqrt(((a - bg) ** 2).sum(axis=2))
    # 배경(마젠타)과 가깝거나, 빨강·파랑이 초록보다 훨씬 큰 분홍 테두리 픽셀은 지움
    pink = (a[..., 0] - a[..., 1] > 70) & (a[..., 2] - a[..., 1] > 70)
    alpha = np.where((dist < 90) | pink, 0, 255).astype(np.uint8)
    out = np.dstack([a.astype(np.uint8), alpha])
    return Image.fromarray(out, "RGBA")


def components(alpha, step=4):
    """투명 아닌 덩어리들 (작게 줄여서 찾음) → [(x0, y0, x1, y1, 넓이)]"""
    m = alpha[::step, ::step] > 0
    h, w = m.shape
    seen = np.zeros_like(m)
    out = []
    for y in range(h):
        for x in range(w):
            if not m[y, x] or seen[y, x]:
                continue
            stack = [(y, x)]
            seen[y, x] = True
            x0 = x1 = x
            y0 = y1 = y
            n = 0
            while stack:
                cy, cx = stack.pop()
                n += 1
                x0, x1, y0, y1 = min(x0, cx), max(x1, cx), min(y0, cy), max(y1, cy)
                for ny, nx in ((cy + 1, cx), (cy - 1, cx), (cy, cx + 1), (cy, cx - 1)):
                    if 0 <= ny < h and 0 <= nx < w and m[ny, nx] and not seen[ny, nx]:
                        seen[ny, nx] = True
                        stack.append((ny, nx))
            out.append([x0 * step, y0 * step, (x1 + 1) * step, (y1 + 1) * step, n])
    return out


def make_sheet(sheet, items):
    src = src_of("물건", sheet)
    if not src.exists():
        return []
    img = cut_background(Image.open(src))
    comps = components(np.asarray(img.getchannel("A")))
    if not comps:
        return []
    big = max(c[4] for c in comps)
    main = sorted([c for c in comps if c[4] >= big * 0.08], key=lambda c: (c[0] + c[2]) / 2)
    # 작은 조각(잎·불꽃 등)은 가장 가까운 큰 덩어리에 붙임
    for c in comps:
        if c[4] >= big * 0.08:
            continue
        cx = (c[0] + c[2]) / 2
        k = min(main, key=lambda b: abs((b[0] + b[2]) / 2 - cx))
        k[0], k[1], k[2], k[3] = min(k[0], c[0]), min(k[1], c[1]), max(k[2], c[2]), max(k[3], c[3])
    if len(main) != len(items):
        print(f"  ! {sheet}: 물건 {len(main)}개를 찾음 (기대 {len(items)}개) — 왼쪽부터 앞의 것만 씀", file=sys.stderr)
    done = []
    for (name, axis, px), b in zip(items, main):
        if name is None:
            continue
        part = img.crop((b[0], b[1], b[2], b[3]))
        r = px / (part.height if axis == "h" else part.width)
        size = (max(1, round(part.width * r)), max(1, round(part.height * r)))
        part = quantize(tone(part.resize(size, Image.Resampling.LANCZOS), TONE_OBJ), 64)
        bb = part.getbbox()
        if bb:
            part = part.crop(bb)
        part.save(PUB / "obj" / f"{name}.png", optimize=True)
        done.append(name)
        print(f"  {name} {part.size}")
    return done


def manifest():
    tex = sorted(p.stem for p in (PUB / "tex").glob("*.png"))
    obj = sorted(p.stem for p in (PUB / "obj").glob("*.png"))
    (PUB / "art.json").write_text(json.dumps({"tex": tex, "obj": obj}, ensure_ascii=False) + "\n")
    print(f"art.json: 땅 결 {len(tex)} · 물건 {len(obj)}")


if __name__ == "__main__":
    (PUB / "tex").mkdir(parents=True, exist_ok=True)
    (PUB / "obj").mkdir(parents=True, exist_ok=True)
    only = set(sys.argv[1:])
    for t in TEX:
        if (not only or t in only) and make_tex(t):
            print(f"  땅 결 {t}")
    for s, items in SHEETS.items():
        if not only or s in only:
            make_sheet(s, items)
    manifest()
