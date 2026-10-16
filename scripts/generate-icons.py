#!/usr/bin/env python3
"""Rasterise the homework mark (pink tile, gold star) for Capacitor icons and splash."""
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets"
PINK = (255, 107, 157, 255)
GOLD = (255, 179, 0, 255)
CREAM = (255, 247, 230, 255)
WHITE = (255, 255, 255, 255)


def star_points(cx, cy, outer, inner, points=5):
    pts = []
    for i in range(points * 2):
        ang = -math.pi / 2 + i * math.pi / points
        radius = outer if i % 2 == 0 else inner
        pts.append((cx + radius * math.cos(ang), cy + radius * math.sin(ang)))
    return pts


def draw_star(draw, cx, cy, outer, fill=GOLD, outline=WHITE, width=0):
    pts = star_points(cx, cy, outer, outer * 0.42)
    draw.polygon(pts, fill=fill, outline=outline)
    if width:
        draw.line(pts + [pts[0]], fill=outline, width=width)


def icon_only(size=1024):
    image = Image.new("RGBA", (size, size), PINK)
    draw = ImageDraw.Draw(image)
    draw_star(draw, size / 2, size / 2 + size * 0.02, size * 0.34, width=max(4, size // 80))
    return image


def icon_foreground(size=1024):
    image = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    # Stay inside the adaptive-icon safe circle.
    draw_star(draw, size / 2, size / 2 + size * 0.02, size * 0.24, width=max(4, size // 90))
    return image


def icon_background(size=1024):
    return Image.new("RGBA", (size, size), PINK)


def font(size):
    for path in (
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    ):
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def splash(size=2732):
    image = Image.new("RGBA", (size, size), CREAM)
    tile = 980
    icon = icon_only(tile)
    # Soft rounded tile so the splash matches icon.svg's rounded square.
    mask = Image.new("L", (tile, tile), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, tile - 1, tile - 1), radius=int(tile * 0.22), fill=255)
    rounded = Image.new("RGBA", (tile, tile), (0, 0, 0, 0))
    rounded.paste(icon, (0, 0))
    rounded.putalpha(mask)
    x = (size - tile) // 2
    y = (size - tile) // 2 - 180
    image.alpha_composite(rounded, (x, y))
    draw = ImageDraw.Draw(image)
    text = "Keeva's Homework"
    face = font(150)
    box = draw.textbbox((0, 0), text, font=face)
    tw = box[2] - box[0]
    draw.text(((size - tw) / 2, y + tile + 80), text, fill=PINK, font=face)
    return image


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    icon_only().save(OUT / "icon-only.png")
    icon_foreground().save(OUT / "icon-foreground.png")
    icon_background().save(OUT / "icon-background.png")
    splash().save(OUT / "splash.png")
    splash().save(OUT / "splash-dark.png")
    print("Wrote icon and splash sources in assets/")


if __name__ == "__main__":
    main()
