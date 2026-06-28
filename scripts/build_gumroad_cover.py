from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(r"F:\MyTraeProjects\The Echo Box")
OUT = ROOT / "output" / "images" / "the-echo-box-gumroad-cover.png"
OUT.parent.mkdir(parents=True, exist_ok=True)

W, H = 1600, 900
img = Image.new("RGB", (W, H), "#f7f3ea")
d = ImageDraw.Draw(img)

# Soft background bands
for y in range(H):
    r = int(247 - y * 8 / H)
    g = int(243 - y * 4 / H)
    b = int(234 + y * 10 / H)
    d.line([(0, y), (W, y)], fill=(r, g, b))

# Accent blocks
teal = "#1f5f63"
dark = "#172b2f"
muted = "#547176"
amber = "#d4a64a"
cream = "#fffdf7"
line = "#cfd9d7"

# Large quiet panel
panel = Image.new("RGBA", (W, H), (0, 0, 0, 0))
pd = ImageDraw.Draw(panel)
pd.rounded_rectangle((78, 74, 1522, 826), radius=34, fill=(255, 253, 247, 238), outline=(209, 217, 215, 255), width=2)
img = Image.alpha_composite(img.convert("RGBA"), panel).convert("RGB")
d = ImageDraw.Draw(img)

# Fonts
font_dir = Path(r"C:\Windows\Fonts")
def font(name, size):
    path = font_dir / name
    if path.exists():
        return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()

bold = font("arialbd.ttf", 72)
semi = font("arialbd.ttf", 42)
body = font("arial.ttf", 32)
small = font("arial.ttf", 24)
mini_bold = font("arialbd.ttf", 22)

# Binder mockup shadow
shadow = Image.new("RGBA", (660, 610), (0, 0, 0, 0))
sd = ImageDraw.Draw(shadow)
sd.rounded_rectangle((65, 45, 570, 560), radius=28, fill=(0, 0, 0, 65))
shadow = shadow.filter(ImageFilter.GaussianBlur(20))
img.paste(shadow, (110, 150), shadow)
d = ImageDraw.Draw(img)

# Binder body
x0, y0, x1, y1 = 190, 175, 700, 695
d.rounded_rectangle((x0, y0, x1, y1), radius=26, fill="#ffffff", outline="#b8c8c6", width=3)
d.rectangle((x0, y0, x0+92, y1), fill=teal)
for yy in [285, 435, 585]:
    d.ellipse((x0+32, yy, x0+62, yy+30), fill="#f7f3ea", outline="#d8e1df", width=2)

# Binder title sticker
d.rounded_rectangle((330, 245, 645, 350), radius=18, fill="#eef6f5", outline="#d4e3e0", width=2)
d.text((360, 260), "Family", font=semi, fill=dark)
d.text((360, 305), "Emergency Binder", font=mini_bold, fill=teal)

# Checklist on binder
items = ["Contacts", "Medications", "Insurance", "Bills", "Documents", "Pets & Home"]
y = 410
for item in items:
    d.rounded_rectangle((335, y, 365, y+30), radius=5, outline=teal, width=3)
    d.line((342, y+16, 350, y+24, 361, y+8), fill=amber, width=4)
    d.text((383, y-2), item, font=small, fill=muted)
    y += 43

# Right side copy
d.text((790, 205), "The Echo Box", font=small, fill=teal)
d.text((790, 255), "Family Emergency", font=bold, fill=dark)
d.text((790, 330), "Binder Kit", font=bold, fill=dark)

d.rounded_rectangle((790, 430, 1260, 490), radius=18, fill="#edf6f4", outline="#d4e3e0", width=2)
d.text((820, 445), "Printable PDF + Checklist + Script", font=small, fill=teal)

copy = [
    "The one file your family opens",
    "when something happens.",
]
y = 540
for line_text in copy:
    d.text((790, y), line_text, font=body, fill=dark)
    y += 43

# Bottom bullets
bullets = ["Doctors & meds", "Insurance", "Bills", "Documents", "Home & pet care"]
x, y = 790, 670
for i, b in enumerate(bullets):
    bx = x + (i % 3) * 245
    by = y + (i // 3) * 46
    d.ellipse((bx, by+8, bx+12, by+20), fill=amber)
    d.text((bx+24, by), b, font=small, fill=muted)

# Price badge
d.rounded_rectangle((1310, 650, 1450, 728), radius=22, fill=teal)
d.text((1344, 666), "$9.99", font=semi, fill="#ffffff")

# Fine print
d.text((790, 780), "Organization tool. Not legal, medical, financial, or estate planning advice.", font=small, fill="#789096")

img.save(OUT, quality=95)
print(OUT)
