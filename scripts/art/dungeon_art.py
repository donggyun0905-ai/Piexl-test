"""던전 바닥·벽 그림(docs/ART_NOW.md 27~82) → 게임에 넣기
- art/던전/{테마}/floor.png (이어 붙는 정사각형) → public/dungeon/{테마}-floor.webp 512×512 (방 8×8칸에 그림 하나)
- art/던전/{테마}/wall.png (가로로 이어지는 3:1) → public/dungeon/{테마}-wall.webp 192×64 (벽 3칸×1칸)
- 캐릭터·몬스터가 잘 보이게 바닥은 어둡고 차분하게 (평균 밝기를 맞춤) · 목록은 apps/client/src/game/render/dungeonTexList.ts
실행: python3 scripts/art/dungeon_art.py
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

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
