"""던전 바닥·벽 그림(docs/ART_NOW.md 27~82) → 게임에 넣기
- art/던전/{테마}/floor.png (이어 붙는 정사각형) → public/dungeon/{테마}-floor.webp 512×512 (방 8×8칸에 그림 하나)
- art/던전/{테마}/wall.png (가로로 이어지는 3:1) → public/dungeon/{테마}-wall.webp 192×64 (벽 3칸×1칸)
- 캐릭터·몬스터가 잘 보이게 바닥은 어둡고 차분하게 (평균 밝기를 맞춤) · 목록은 apps/client/src/game/render/dungeonTexList.ts
- 물건 묶음(ART_NOW 83~88: 기둥·구덩이 · 샘·상자·깔개·여신상 · 출구·계단·발판 · 단련 기구 · 대장간 · 광야 아이템)
  → public/dungeon/obj/{이름}.png (배경 지우고 왼쪽부터 잘라, 높이 OBJ_PX) · 목록 apps/client/src/game/render/dungeonObjList.ts
실행: python3 scripts/art/dungeon_art.py
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
import sys
sys.path.insert(0, str(Path(__file__).parent))
from world_art import components, cut_background, quantize, save_png  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "art" / "던전"
OUT = ROOT / "apps/client/public/dungeon"
LIST = ROOT / "apps/client/src/game/render/dungeonTexList.ts"
# (채도 배율, 맞출 평균 밝기 0~1, 대비 배율)
FLOOR_TONE = (0.75, 0.24, 0.8)
WALL_TONE = (0.8, 0.32, 1.0)


def tone(im, sat, target, contrast):
    im = ImageEnhance.Contrast(ImageEnhance.Color(im).enhance(sat)).enhance(contrast)
    a = np.asarray(im).astype(np.float32) / 255
    lum = (a @ np.array([0.299, 0.587, 0.114], np.float32)).mean()
    a = np.clip(a * (target / max(lum, 1e-3)), 0, 1)
    return Image.fromarray((a * 255).astype(np.uint8))


def flatten(im):
    """넓은 밝기 차이(한쪽만 어두움 등)를 없애 이어 붙여도 칸이 보이지 않게"""
    a = np.asarray(im).astype(np.float32)
    blur = np.asarray(im.filter(ImageFilter.GaussianBlur(im.width / 6))).astype(np.float32)
    return Image.fromarray(np.clip(a / np.maximum(blur, 1) * blur.mean(axis=(0, 1)), 0, 255).astype(np.uint8))


def seamless(im, vertical=True):
    """반 칸 밀린 그림과 섞어 가장자리 이음매를 없앰 (가운데는 원본, 가장자리는 밀린 그림)"""
    a = np.asarray(im).astype(np.float32)
    h, w = a.shape[:2]
    rolled = np.roll(a, (h // 2 if vertical else 0, w // 2), axis=(0, 1))
    wx = 1 - np.abs(np.linspace(-1, 1, w))
    wy = 1 - np.abs(np.linspace(-1, 1, h)) if vertical else np.ones(h)
    m = np.clip(np.minimum.outer(wy, wx) * 3, 0, 1)[..., None]
    return Image.fromarray((a * m + rolled * (1 - m)).astype(np.uint8))


OUT.mkdir(parents=True, exist_ok=True)
keys = []
for d in sorted(p for p in SRC.iterdir() if p.is_dir()):
    f, w = d / "floor.png", d / "wall.png"
    if not (f.exists() and w.exists()):
        continue
    tone(seamless(flatten(Image.open(f).convert("RGB").resize((512, 512), Image.LANCZOS))), *FLOOR_TONE).save(OUT / f"{d.name}-floor.webp", "WEBP", quality=90, method=6)
    tone(seamless(Image.open(w).convert("RGB").resize((192, 64), Image.LANCZOS), vertical=False), *WALL_TONE).save(OUT / f"{d.name}-wall.webp", "WEBP", quality=90, method=6)
    keys.append(d.name)
LIST.write_text("// 바닥·벽 그림이 있는 던전 테마 (scripts/art/dungeon_art.py가 만듦, 손으로 고치지 않음)\nexport const DUNGEON_TEX: ReadonlySet<string> = new Set([\n"
                + "".join(f'  "{k}",\n' for k in keys) + "]);\n", encoding="utf8")
print(len(keys), "테마")


# 물건 묶음 → 왼쪽부터 이름 (None = 안 씀) · 높이 128픽셀로 줄여 둠 (게임에서 크기 정함)
OBJ_PX = 128
OBJ_SHEETS = {
    "던전/base/props": ["pillar", "pit", "innerWall"],
    "던전/common/roomFeatures": ["spring", "chestClosed", "chestOpen", "shopRug", "goddess"],
    "던전/common/roomDoors": ["exitArch", "exitGlow", "stairsDown", None, "entryMat"],
    "던전/common/gymGear": ["gymBag", "gymLat", "gymBench"],
    "던전/common/forgeRoom": ["furnace", "toolRack", "anvil", "swordRack"],
    "광야/swarmItems": ["swCrate", "swGem", "swMeat", "swMagnet", "swBomb", "swGold", "swChest"],
}


# 초록 배경이 물건 가장자리에 남은 묶음: 진한 초록 픽셀을 더 지움
GREEN_FRINGE = {"던전/common/roomFeatures"}


def cut_sheet(sheet, names):
    img = cut_background(Image.open(ROOT / "art" / f"{sheet}.png"))
    if sheet in GREEN_FRINGE:
        a = np.array(img)
        r_, g_, b_ = (a[..., i].astype(int) for i in range(3))
        g = ((g_ - np.maximum(r_, b_)) > 60) | ((g_ > 150) & (g_ > r_ + 25) & (b_ < 110))
        a[g, 3] = 0
        img = Image.fromarray(a, "RGBA")
    comps = components(np.asarray(img.getchannel("A")))
    big = max(c[4] for c in comps)
    main = sorted([c for c in comps if c[4] >= big * 0.05], key=lambda c: (c[0] + c[2]) / 2)
    for c in comps:
        if c[4] >= big * 0.05:
            continue
        k = min(main, key=lambda b: abs((b[0] + b[2]) / 2 - (c[0] + c[2]) / 2))
        gap = max(k[0] - c[2], c[0] - k[2], k[1] - c[3], c[1] - k[3])
        if c[4] < big * 0.01 and gap > 24:
            continue
        k[0], k[1], k[2], k[3] = min(k[0], c[0]), min(k[1], c[1]), max(k[2], c[2]), max(k[3], c[3])
    if len(main) != len(names):
        print(f"  ! {sheet}: {len(main)}개 (기대 {len(names)})", file=sys.stderr)
    done = []
    for name, b in zip(names, main):
        if name is None:
            continue
        part = img.crop(tuple(b[:4]))
        part = quantize(part.resize((max(1, round(part.width * OBJ_PX / part.height)), OBJ_PX), Image.LANCZOS), 64)
        bb = part.getbbox()
        save_png(part.crop(bb) if bb else part, OUT / "obj" / f"{name}.png")
        done.append(name)
    return done


(OUT / "obj").mkdir(exist_ok=True)
objs = [n for sheet, names in OBJ_SHEETS.items() for n in cut_sheet(sheet, names)]
(LIST.parent / "dungeonObjList.ts").write_text("// 던전·광야 물건 그림 이름 (scripts/art/dungeon_art.py가 만듦, 손으로 고치지 않음)\nexport const DUNGEON_OBJ: ReadonlySet<string> = new Set([\n"
                                              + "".join(f'  "{n}",\n' for n in sorted(objs)) + "]);\n", encoding="utf8")
print(len(objs), "물건")
