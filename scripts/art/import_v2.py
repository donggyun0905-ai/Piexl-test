# GPT 그림 3장 → 새 캐릭터 시트 v2 (python3 scripts/art/import_v2.py warden) → apps/client/public/sprites/{이름}.png
# 원본: scripts/art/src/{이름}-1.png (4×2: 위 서기 · 아래 공격) · -2.png (4×2: 위 걷기 왼발 · 아래 걷기 오른발) · -3.png (4×1: 맞음·쓰러짐·대시 오른쪽·대시 왼쪽)
# 각 줄의 칸 순서는 앞·뒤·왼·오. 이어진 덩어리마다 가운데가 놓인 칸으로 나눔 (자세가 살짝 겹쳐도 됨, 칸 자리를 따로 적지 않음)
# 결과: 128칸 4칸 × 5줄 (sprites.ts의 v2 · 1줄 서기 · 2줄 공격 · 3·4줄 걷기 · 5줄 맞음·쓰러짐·대시)
import os
import sys
from collections import deque

from PIL import Image

from import_sheet import CELL, FOOT, HERE, finish, shrink
from s2_common import SPRITES

DARK = 42
# 앞모습(서기) 키 = 116칸, 다른 자세도 같은 배율 (칸에 안 들어가면 그 자세만 더 줄임)
BODY = 116
# 원본 파일 → (가로 칸 수, 세로 칸 수, 시트에 놓을 줄)
FILES = [("1", 4, 2, [0, 1]), ("2", 4, 2, [2, 3]), ("3", 4, 1, [4])]
# 왼쪽 모습을 오른쪽 뒤집기로 (GPT 왼쪽 그림이 오른쪽을 봄)
FLIP_LEFT = {"warden", "mage", "drifter", "mystic", "engineer", "elementalist", "brawler"}
# 공격 줄 오른쪽·왼쪽에 쓸 원본 칸 (0~3, 끝에 f = 뒤집기): GPT가 칸 순서를 바꿔 그린 캐릭터만 (화면을 보고 정함)
ATTACK_LR = {
    "warden": ("2", "3"), "drifter": ("2", "3"), "engineer": ("2", "3"), "elementalist": ("2", "3"),
    "mystic": ("3f", "3"), "brawler": ("3f", "3"),
}


def pieces(img, cols, rows):
    """어두운 배경이 아닌 칸을 8방향으로 이은 덩어리 → 가운데가 놓인 칸(cols×rows)에 모음"""
    w, h = img.size
    px = img.load()
    seen = bytearray(w * h)
    cells = [[[] for _ in range(cols)] for _ in range(rows)]
    for y0 in range(h):
        for x0 in range(w):
            if seen[y0 * w + x0] or max(px[x0, y0][:3]) <= DARK: continue
            seen[y0 * w + x0] = 1
            q, pts = deque([(x0, y0)]), []
            while q:
                x, y = q.popleft()
                pts.append((x, y))
                for dx in (-1, 0, 1):
                    for dy in (-1, 0, 1):
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx] and max(px[nx, ny][:3]) > DARK:
                            seen[ny * w + nx] = 1
                            q.append((nx, ny))
            if len(pts) < 12: continue  # 먼지 같은 점
            cx = sum(p[0] for p in pts) / len(pts)
            cy = sum(p[1] for p in pts) / len(pts)
            cells[min(rows - 1, int(cy * rows / h))][min(cols - 1, int(cx * cols / w))].append((cx, cy, pts))
    out = []
    ch = h / rows
    for r, row in enumerate(cells):
        line = []
        for comps in row:
            # 칸 위쪽 끝에 붙은 작은 조각(윗줄 발끝이 넘어온 것)은 버림
            total = sum(len(c[2]) for c in comps)
            keep = [c for c in comps if len(c[2]) > total * 0.04 or min(q[1] for q in c[2]) > r * ch + ch * 0.12]
            pts = [q for c in keep for q in c[2]]
            x0, y0 = min(p[0] for p in pts), min(p[1] for p in pts)
            part = Image.new("RGBA", (max(p[0] for p in pts) - x0 + 1, max(p[1] for p in pts) - y0 + 1), (0, 0, 0, 0))
            pp = part.load()
            for x, y in pts: pp[x - x0, y - y0] = px[x, y][:3] + (255,)
            line.append(part)
        out.append(line)
    return out


def build(name):
    grid = {}
    for tag, cols, rows, at in FILES:
        img = Image.open(os.path.join(HERE, "src", f"{name}-{tag}.png")).convert("RGBA")
        for r, line in zip(at, pieces(img, cols, rows)):
            for c, part in enumerate(line): grid[r, c] = part
    # GPT가 '왼쪽' 칸도 오른쪽을 보게 그리는 일이 많음 → 서기·공격·걷기의 왼쪽은 오른쪽을 뒤집어 씀 (FLIP_LEFT에 없는 캐릭터는 그대로)
    raw = dict(grid)
    if name in FLIP_LEFT:
        for r in range(4): grid[r, 2] = grid[r, 3].transpose(Image.FLIP_LEFT_RIGHT)
    if name in ATTACK_LR:
        src = [raw[1, c] for c in range(4)]
        pick = lambda k: src[int(k[0])].transpose(Image.FLIP_LEFT_RIGHT) if k.endswith("f") else src[int(k[0])]
        grid[1, 3], grid[1, 2] = pick(ATTACK_LR[name][0]), pick(ATTACK_LR[name][1])
    base = BODY / grid[0, 0].height
    sheet = Image.new("RGBA", (CELL * 4, CELL * 5), (0, 0, 0, 0))
    for (r, c), p in grid.items():
        p = shrink(p, min(base, (CELL - 2) / p.width, (FOOT - 1) / p.height))
        sheet.alpha_composite(p, (c * CELL + (CELL - p.width) // 2, r * CELL + FOOT - p.height))
    finish(sheet).save(os.path.join(SPRITES, f"{name}.png"), optimize=True)
    print(name, "ok (v2 4×5)")


if __name__ == "__main__":
    build(sys.argv[1])
