#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parent.parent
BRAND_DIR = ROOT / "assets" / "brand"
FONT_DIR = ROOT / "assets" / "fonts"

SANS = FONT_DIR / "InstrumentSans-Regular.ttf"
SERIF = FONT_DIR / "InstrumentSerif-Regular.ttf"

BG = (11, 31, 51, 255)
BG_SOFT = (238, 245, 251, 255)
PRIMARY = (30, 100, 200, 255)
PRIMARY_DEEP = (17, 72, 144, 255)
ACCENT = (34, 184, 162, 255)
ACCENT_SOFT = (217, 245, 241, 255)
TEXT = (8, 23, 39, 255)
MUTED = (94, 124, 152, 255)
WHITE = (255, 255, 255, 255)


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size=size)


def draw_grid(draw: ImageDraw.ImageDraw, size: tuple[int, int], step: int, color: tuple[int, int, int, int]) -> None:
    width, height = size
    for x in range(0, width, step):
        draw.line((x, 0, x, height), fill=color, width=1)
    for y in range(0, height, step):
        draw.line((0, y, width, y), fill=color, width=1)


def draw_mark(base: Image.Image, with_background: bool) -> None:
    draw = ImageDraw.Draw(base)
    width, height = base.size

    if with_background:
        draw.rounded_rectangle((0, 0, width, height), radius=width // 5, fill=BG)
        draw.rounded_rectangle(
            (width * 0.08, height * 0.08, width * 0.92, height * 0.92),
            radius=width // 6,
            outline=(255, 255, 255, 40),
            width=max(2, width // 96),
        )
        draw_grid(draw, base.size, max(16, width // 10), (255, 255, 255, 14))

    route_box = (width * 0.18, height * 0.19, width * 0.82, height * 0.78)
    secondary_box = (width * 0.26, height * 0.27, width * 0.66, height * 0.67)
    draw.arc(route_box, start=205, end=350, fill=PRIMARY, width=max(6, width // 28))
    draw.arc(secondary_box, start=205, end=340, fill=ACCENT, width=max(4, width // 40))

    draw.line(
        (width * 0.26, height * 0.68, width * 0.68, height * 0.36),
        fill=WHITE if with_background else PRIMARY_DEEP,
        width=max(5, width // 34),
    )
    draw.ellipse(
        (width * 0.22, height * 0.63, width * 0.34, height * 0.75),
        fill=PRIMARY_DEEP if with_background else BG,
    )
    draw.ellipse(
        (width * 0.62, height * 0.31, width * 0.74, height * 0.43),
        fill=ACCENT,
    )
    draw.ellipse(
        (width * 0.60, height * 0.29, width * 0.76, height * 0.45),
        outline=ACCENT_SOFT if with_background else ACCENT,
        width=max(3, width // 72),
    )
    draw.line(
        (width * 0.46, height * 0.2, width * 0.46, height * 0.8),
        fill=(255, 255, 255, 34) if with_background else (11, 31, 51, 36),
        width=max(1, width // 120),
    )


def create_mark() -> None:
    image = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0))
    draw_mark(image, with_background=False)
    image.save(BRAND_DIR / "logo-mark.png")


def create_wordmark() -> None:
    image = Image.new("RGBA", (1480, 360), (0, 0, 0, 0))
    panel = Image.new("RGBA", (300, 300), (0, 0, 0, 0))
    draw_mark(panel, with_background=True)
    image.alpha_composite(panel, (0, 30))

    draw = ImageDraw.Draw(image)
    title_font = font(SERIF, 106)
    meta_font = font(SANS, 30)

    draw.text((342, 90), "Simulasi", font=title_font, fill=TEXT)
    draw.text((775, 90), "TKA", font=title_font, fill=PRIMARY_DEEP)
    draw.line((346, 208, 1160, 208), fill=(17, 72, 144, 70), width=3)
    draw.text((346, 228), "PANDUAN PILIHAN JENJANG DAN MAPEL", font=meta_font, fill=MUTED)
    image.save(BRAND_DIR / "logo-wordmark.png")


def create_favicon() -> None:
    image = Image.new("RGBA", (256, 256), BG)
    draw_mark(image, with_background=True)
    image.save(BRAND_DIR / "favicon.png")
    image.resize((180, 180), Image.Resampling.LANCZOS).save(BRAND_DIR / "apple-touch-icon.png")


def create_social_card() -> None:
    width, height = 1200, 630
    image = Image.new("RGBA", (width, height), BG_SOFT)
    draw = ImageDraw.Draw(image)

    draw.rounded_rectangle((30, 30, width - 30, height - 30), radius=36, fill=(255, 255, 255, 255))
    draw_grid(draw, (width, height), 44, (17, 72, 144, 12))
    draw.rounded_rectangle((58, 58, width - 58, height - 58), radius=28, outline=(17, 72, 144, 30), width=2)
    draw.arc((70, 80, 420, 430), start=204, end=352, fill=PRIMARY, width=16)
    draw.arc((150, 150, 360, 360), start=210, end=338, fill=ACCENT, width=10)
    draw.line((170, 360, 384, 190), fill=PRIMARY_DEEP, width=10)
    draw.ellipse((136, 326, 210, 400), fill=PRIMARY_DEEP)
    draw.ellipse((350, 154, 430, 234), fill=ACCENT)
    draw.ellipse((336, 140, 444, 248), outline=ACCENT_SOFT, width=6)

    title_font = font(SERIF, 80)
    subtitle_font = font(SANS, 28)
    label_font = font(SANS, 22)

    draw.text((520, 146), "Simulasi TKA", font=title_font, fill=TEXT)
    draw.text(
        (522, 274),
        "Pilih jenjang dan mata pelajaran sebelum membuka simulasi resmi.",
        font=subtitle_font,
        fill=MUTED,
    )
    draw.line((522, 335, 1024, 335), fill=(17, 72, 144, 48), width=3)
    draw.rounded_rectangle((522, 376, 868, 432), radius=28, fill=(34, 184, 162, 28))
    draw.text((548, 392), "PANDUAN INDEPENDEN", font=label_font, fill=PRIMARY_DEEP)
    draw.rounded_rectangle((884, 376, 1060, 432), radius=28, fill=(30, 100, 200, 28))
    draw.text((915, 392), "24 APR 2026", font=label_font, fill=PRIMARY_DEEP)
    image.save(BRAND_DIR / "social-card.png")


def main() -> None:
    BRAND_DIR.mkdir(parents=True, exist_ok=True)
    create_mark()
    create_wordmark()
    create_favicon()
    create_social_card()
    print(f"Brand assets generated in {BRAND_DIR}")


if __name__ == "__main__":
    main()
