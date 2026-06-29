from pathlib import Path
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "output" / "pinterest-aging-parents"
OUT_DIR.mkdir(parents=True, exist_ok=True)

W, H = 1000, 1500

COLORS = {
    "ink": "#172026",
    "muted": "#54636a",
    "paper": "#f7f4ee",
    "card": "#fffdf8",
    "teal": "#246b63",
    "teal_dark": "#174a45",
    "red": "#a6423a",
    "gold": "#b98236",
    "blue": "#2f5873",
    "line": "#d7d0c3",
}

FONT_SERIF = Path("C:/Windows/Fonts/georgiab.ttf")
FONT_SERIF_REG = Path("C:/Windows/Fonts/georgia.ttf")
FONT_SANS = Path("C:/Windows/Fonts/arial.ttf")
FONT_SANS_BOLD = Path("C:/Windows/Fonts/arialbd.ttf")


PINS = [
    {
        "slug": "01-er-tonight",
        "eyebrow": "THE ECHO BOX",
        "title": "If Mom Went\nto the ER Tonight",
        "subcopy": "Would you know her meds, doctors, insurance, and who to call first?",
        "footer": "Printable emergency binder for aging parents",
        "motif": "folder",
    },
    {
        "slug": "02-medication-list",
        "eyebrow": "AGING PARENTS",
        "title": "The Medication List\nYour Family Needs",
        "subcopy": "Current meds. Doses. Allergies. Pharmacy. Doctor.",
        "footer": "Start with the free checklist",
        "motif": "checklist",
    },
    {
        "slug": "03-ask-parent",
        "eyebrow": "TONIGHT'S SCRIPT",
        "title": "Ask Your Parent\nThis Tonight",
        "subcopy": '"If you had to go to the hospital, what should I know first?"',
        "footer": "A calmer way to start the conversation",
        "motif": "conversation",
    },
    {
        "slug": "04-important-papers",
        "eyebrow": "FAMILY DOCUMENTS",
        "title": "Where Are the\nImportant Papers?",
        "subcopy": "Insurance. IDs. Will. POA. Keys. Safe. Bills.",
        "footer": "One place for the details family needs fast",
        "motif": "tabs",
    },
    {
        "slug": "05-caregiver-binder",
        "eyebrow": "CAREGIVER ORGANIZATION",
        "title": "Caregiver Binder\nfor Aging Parents",
        "subcopy": "One place for doctors, meds, bills, pets, and home notes.",
        "footer": "Printable checklist + full binder option",
        "motif": "binder",
    },
    {
        "slug": "06-spare-key",
        "eyebrow": "HOME DETAILS",
        "title": "Who Has\nthe Spare Key?",
        "subcopy": "Emergencies are not the time to search group chats.",
        "footer": "Keys, alarms, pets, shutoffs, and neighbors",
        "motif": "key",
    },
    {
        "slug": "07-first-hour",
        "eyebrow": "FIRST HOUR CHECKLIST",
        "title": "The First Hour\nEmergency Checklist",
        "subcopy": "Who to call. What meds. Which doctor. Where documents are.",
        "footer": "Use the checklist before anyone has to guess",
        "motif": "clipboard",
    },
    {
        "slug": "08-bills-crisis",
        "eyebrow": "BILLS & SUBSCRIPTIONS",
        "title": "Bills Do Not Pause\nfor a Crisis",
        "subcopy": "Mortgage. Utilities. Phone. Care costs. Subscriptions.",
        "footer": "Write down what cannot be missed",
        "motif": "bills",
    },
    {
        "slug": "09-pet-care",
        "eyebrow": "HOME & PETS",
        "title": "If Your Parent\nIs Hospitalized",
        "subcopy": "Who feeds the pet?",
        "footer": "Food, vet, routine, meds, backup caregiver",
        "motif": "pet",
    },
    {
        "slug": "10-printable-app",
        "eyebrow": "PRINTABLE PDF",
        "title": "Why Printable\nBeats Another App",
        "subcopy": "No login. No battery. No guessing.",
        "footer": "Keep the file with papers, keys, and cards",
        "motif": "phone",
    },
]


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size)


def wrap_text(draw: ImageDraw.ImageDraw, text: str, font_obj, max_width: int):
    lines = []
    for paragraph in text.split("\n"):
        words = paragraph.split()
        if not words:
            lines.append("")
            continue
        line = words[0]
        for word in words[1:]:
            test = f"{line} {word}"
            if draw.textbbox((0, 0), test, font=font_obj)[2] <= max_width:
                line = test
            else:
                lines.append(line)
                line = word
        lines.append(line)
    return lines


def rounded_rect(draw, xy, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def draw_background(draw):
    draw.rectangle((0, 0, W, H), fill=COLORS["paper"])
    for x in range(-200, W, 80):
        draw.line((x, 0, x + 360, H), fill="#eee8dd", width=2)
    draw.ellipse((-160, -120, 360, 380), fill="#e8eee9")
    draw.ellipse((720, 1200, 1180, 1660), fill="#e9dfd0")
    draw.rectangle((0, 0, W, 18), fill=COLORS["teal"])


def draw_motif(draw, kind, cx, cy):
    if kind in {"folder", "tabs"}:
        rounded_rect(draw, (cx - 190, cy - 95, cx + 190, cy + 130), 24, "#fffaf0", COLORS["line"], 3)
        draw.rectangle((cx - 160, cy - 125, cx + 30, cy - 85), fill=COLORS["gold"])
        for i, label in enumerate(["Meds", "Docs", "Bills"]):
            y = cy - 45 + i * 50
            draw.line((cx - 130, y, cx + 130, y), fill=COLORS["line"], width=4)
            draw.text((cx - 120, y + 10), label, font=font(FONT_SANS_BOLD, 22), fill=COLORS["muted"])
    elif kind in {"checklist", "clipboard", "binder"}:
        rounded_rect(draw, (cx - 160, cy - 150, cx + 160, cy + 155), 22, "#fffdf8", COLORS["line"], 3)
        draw.rectangle((cx - 55, cy - 175, cx + 55, cy - 130), fill=COLORS["teal"])
        for i in range(5):
            y = cy - 85 + i * 45
            draw.rectangle((cx - 115, y, cx - 92, y + 23), outline=COLORS["teal"], width=3)
            draw.line((cx - 75, y + 12, cx + 115, y + 12), fill=COLORS["line"], width=4)
    elif kind == "conversation":
        rounded_rect(draw, (cx - 190, cy - 100, cx + 190, cy + 70), 28, "#fffdf8", COLORS["line"], 3)
        draw.polygon([(cx - 40, cy + 70), (cx - 5, cy + 112), (cx + 18, cy + 70)], fill="#fffdf8", outline=COLORS["line"])
        draw.line((cx - 125, cy - 40, cx + 125, cy - 40), fill=COLORS["teal"], width=5)
        draw.line((cx - 125, cy + 5, cx + 80, cy + 5), fill=COLORS["line"], width=5)
    elif kind == "key":
        draw.ellipse((cx - 145, cy - 90, cx - 45, cy + 10), outline=COLORS["gold"], width=12)
        draw.line((cx - 45, cy - 40, cx + 155, cy - 40), fill=COLORS["gold"], width=16)
        draw.line((cx + 95, cy - 40, cx + 95, cy + 40), fill=COLORS["gold"], width=14)
        draw.line((cx + 140, cy - 40, cx + 140, cy + 20), fill=COLORS["gold"], width=14)
    elif kind == "bills":
        for i in range(3):
            offset = i * 28
            rounded_rect(draw, (cx - 170 + offset, cy - 115 + offset, cx + 145 + offset, cy + 65 + offset), 16, "#fffdf8", COLORS["line"], 3)
            draw.line((cx - 125 + offset, cy - 55 + offset, cx + 90 + offset, cy - 55 + offset), fill=COLORS["teal"], width=5)
            draw.line((cx - 125 + offset, cy - 10 + offset, cx + 55 + offset, cy - 10 + offset), fill=COLORS["line"], width=5)
    elif kind == "pet":
        draw.ellipse((cx - 110, cy - 55, cx + 110, cy + 115), fill="#fffdf8", outline=COLORS["line"], width=4)
        for dx, dy in [(-75, -105), (-25, -125), (35, -125), (85, -105)]:
            draw.ellipse((cx + dx - 24, cy + dy - 24, cx + dx + 24, cy + dy + 24), fill="#fffdf8", outline=COLORS["gold"], width=4)
        draw.text((cx - 56, cy + 2), "CARE", font=font(FONT_SANS_BOLD, 30), fill=COLORS["teal_dark"])
    elif kind == "phone":
        rounded_rect(draw, (cx - 185, cy - 145, cx - 20, cy + 150), 28, "#202a30", "#202a30", 3)
        rounded_rect(draw, (cx + 35, cy - 130, cx + 190, cy + 140), 18, "#fffdf8", COLORS["line"], 3)
        draw.text((cx - 158, cy - 2), "APP", font=font(FONT_SANS_BOLD, 28), fill="#fffdf8")
        draw.text((cx + 68, cy - 4), "PDF", font=font(FONT_SANS_BOLD, 32), fill=COLORS["teal_dark"])


def draw_pin(pin, index):
    img = Image.new("RGB", (W, H), COLORS["paper"])
    draw = ImageDraw.Draw(img)
    draw_background(draw)

    # Drop shadow and main card.
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    sdraw.rounded_rectangle((90, 120, 910, 1370), radius=38, fill=(23, 32, 38, 40))
    shadow = shadow.filter(ImageFilter.GaussianBlur(22))
    img = Image.alpha_composite(img.convert("RGBA"), shadow)
    draw = ImageDraw.Draw(img)
    rounded_rect(draw, (92, 105, 908, 1350), 38, COLORS["card"], COLORS["line"], 3)

    draw.text((145, 175), pin["eyebrow"], font=font(FONT_SANS_BOLD, 28), fill=COLORS["teal_dark"])
    draw.line((145, 220, 385, 220), fill=COLORS["gold"], width=5)

    title_font = font(FONT_SERIF, 66)
    title_lines = wrap_text(draw, pin["title"], title_font, 720)
    y = 300
    for line in title_lines:
        bbox = draw.textbbox((0, 0), line, font=title_font)
        draw.text(((W - (bbox[2] - bbox[0])) / 2, y), line, font=title_font, fill=COLORS["ink"])
        y += 82

    sub_font = font(FONT_SANS, 34)
    sub_lines = wrap_text(draw, pin["subcopy"], sub_font, 690)
    y += 32
    for line in sub_lines:
        bbox = draw.textbbox((0, 0), line, font=sub_font)
        draw.text(((W - (bbox[2] - bbox[0])) / 2, y), line, font=sub_font, fill=COLORS["muted"])
        y += 48

    draw_motif(draw, pin["motif"], W // 2, 930)

    rounded_rect(draw, (175, 1180, 825, 1265), 26, "#eef3f1", "#d5e1dd", 2)
    footer_font = font(FONT_SANS_BOLD, 26)
    footer_lines = wrap_text(draw, pin["footer"], footer_font, 580)
    fy = 1200
    for line in footer_lines[:2]:
        bbox = draw.textbbox((0, 0), line, font=footer_font)
        draw.text(((W - (bbox[2] - bbox[0])) / 2, fy), line, font=footer_font, fill=COLORS["teal_dark"])
        fy += 32

    draw.text((145, 1300), "my-echo-box.com", font=font(FONT_SANS_BOLD, 24), fill=COLORS["blue"])
    draw.text((760, 1300), f"{index:02d}/10", font=font(FONT_SANS_BOLD, 24), fill=COLORS["muted"])
    return img.convert("RGB")


def make_contact_sheet(paths):
    thumb_w, thumb_h = 240, 360
    cols = 5
    rows = math.ceil(len(paths) / cols)
    sheet = Image.new("RGB", (cols * thumb_w, rows * thumb_h), "#f7f4ee")
    for i, path in enumerate(paths):
        img = Image.open(path).resize((thumb_w, thumb_h), Image.Resampling.LANCZOS)
        sheet.paste(img, ((i % cols) * thumb_w, (i // cols) * thumb_h))
    out = OUT_DIR / "contact-sheet.jpg"
    sheet.save(out, quality=92)
    return out


def main():
    paths = []
    for i, pin in enumerate(PINS, start=1):
        img = draw_pin(pin, i)
        out = OUT_DIR / f"{pin['slug']}.png"
        img.save(out)
        paths.append(out)
    sheet = make_contact_sheet(paths)
    print(f"Generated {len(paths)} pins in {OUT_DIR}")
    print(f"Contact sheet: {sheet}")


if __name__ == "__main__":
    main()
