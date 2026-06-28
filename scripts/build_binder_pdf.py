from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf" / "The-Echo-Box-Family-Emergency-Binder-Kit.pdf"


def styles():
    base = getSampleStyleSheet()
    return {
        "cover_title": ParagraphStyle(
            "cover_title",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=30,
            leading=34,
            textColor=colors.HexColor("#1b2a2f"),
            spaceAfter=18,
        ),
        "h1": ParagraphStyle(
            "h1",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=18,
            leading=22,
            textColor=colors.HexColor("#1b2a2f"),
            spaceBefore=10,
            spaceAfter=8,
        ),
        "h2": ParagraphStyle(
            "h2",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=12,
            leading=15,
            textColor=colors.HexColor("#31515a"),
            spaceBefore=8,
            spaceAfter=5,
        ),
        "body": ParagraphStyle(
            "body",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9.5,
            leading=13,
            textColor=colors.HexColor("#263238"),
            spaceAfter=6,
        ),
        "small": ParagraphStyle(
            "small",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=8,
            leading=10,
            textColor=colors.HexColor("#5b6a70"),
        ),
        "note": ParagraphStyle(
            "note",
            parent=base["BodyText"],
            fontName="Helvetica-Oblique",
            fontSize=8.5,
            leading=11,
            textColor=colors.HexColor("#5b4a25"),
            backColor=colors.HexColor("#fff7dc"),
            borderColor=colors.HexColor("#e3c86d"),
            borderWidth=0.5,
            borderPadding=6,
            spaceBefore=8,
            spaceAfter=8,
        ),
    }


def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#6c7a80"))
    canvas.drawString(0.65 * inch, 0.45 * inch, "The Echo Box - Family Emergency Binder")
    canvas.drawRightString(7.85 * inch, 0.45 * inch, f"Page {doc.page}")
    canvas.restoreState()


def box_table(rows, col_widths=None, row_height=0.34 * inch):
    if col_widths is None:
        col_widths = [2.1 * inch, 4.9 * inch]
    data = [[Paragraph(f"<b>{label}</b>", S["body"]), value] for label, value in rows]
    table = Table(data, colWidths=col_widths, rowHeights=[row_height] * len(data))
    table.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 0.45, colors.HexColor("#b9c7cc")),
                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#edf4f6")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    return table


def blanks(labels):
    return [(label, "") for label in labels]


def checkbox_table(items):
    rows = [["", Paragraph("<b>Item</b>", S["body"]), Paragraph("<b>Notes</b>", S["body"])]]
    rows.extend([["[  ]", Paragraph(item, S["body"]), ""] for item in items])
    table = Table(rows, colWidths=[0.45 * inch, 3.0 * inch, 3.45 * inch], rowHeights=0.32 * inch)
    table.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 0.45, colors.HexColor("#b9c7cc")),
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#edf4f6")),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("ALIGN", (0, 0), (0, -1), "CENTER"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    return table


def para(text, style="body"):
    return Paragraph(text, S[style])


def heading(text):
    return Paragraph(text, S["h1"])


def section(text):
    return Paragraph(text, S["h2"])


S = styles()


def build_story():
    story = []

    story.append(Paragraph("The Echo Box", S["cover_title"]))
    story.append(Paragraph("Family Emergency Binder Full Kit", S["h1"]))
    story.append(
        para(
            "The one file your family opens when something happens. Fill this out once, print it, and put it where your spouse, adult child, caregiver, or trusted contact can find it."
        )
    )
    story.append(Spacer(1, 0.25 * inch))
    story.append(
        para(
            "<b>Use this for:</b> emergency contacts, doctors and medications, insurance, bills, subscriptions, pets, home instructions, document locations, care preferences, and a personal note."
        )
    )
    story.append(Spacer(1, 0.2 * inch))
    story.append(
        para(
            "Important: this binder is an organization and communication tool. It is not legal, medical, financial, tax, or estate planning advice. It does not replace a will, power of attorney, advance directive, insurance policy, or professional advice.",
            "note",
        )
    )
    story.append(PageBreak())

    story.append(heading("Quick Start"))
    story.append(
        para(
            "Do not try to make this perfect. A half-complete binder your family can find is better than a perfect binder nobody knows exists."
        )
    )
    story.append(
        checkbox_table(
            [
                "Print one copy of this binder.",
                "Fill out the first two pages today.",
                "Put it in a folder labeled Family Emergency Binder.",
                "Tell one trusted person where it is.",
                "Set a calendar reminder to review it every 6 months.",
            ]
        )
    )
    story.append(Spacer(1, 0.15 * inch))
    story.append(section("Where this binder is kept"))
    story.append(box_table(blanks(["Location", "Backup location", "Who knows about it", "Last updated"])))
    story.append(PageBreak())

    story.append(heading("Emergency Contacts"))
    story.append(para("List the people your family should call first. Include at least one person who lives nearby."))
    for i in range(1, 5):
        story.append(section(f"Contact {i}"))
        story.append(
            box_table(
                blanks(["Name", "Relationship", "Phone", "Email", "Address", "When to call this person"]),
                row_height=0.28 * inch,
            )
        )
    story.append(PageBreak())

    story.append(heading("Doctors And Medications"))
    story.append(section("Primary care and key doctors"))
    for i in range(1, 5):
        story.append(
            box_table(
                blanks([f"Doctor {i}", "Specialty", "Phone", "Office / portal", "Notes"]),
                row_height=0.26 * inch,
            )
        )
        story.append(Spacer(1, 0.08 * inch))
    story.append(section("Medication list"))
    meds = [["Medication", "Dose", "When", "Prescriber", "Notes"]]
    meds.extend([["", "", "", "", ""] for _ in range(10)])
    table = Table(meds, colWidths=[1.45 * inch, 0.9 * inch, 0.9 * inch, 1.35 * inch, 2.3 * inch], rowHeights=0.3 * inch)
    table.setStyle(TableStyle([("GRID", (0, 0), (-1, -1), 0.45, colors.HexColor("#b9c7cc")), ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#edf4f6"))]))
    story.append(table)
    story.append(PageBreak())

    story.append(heading("Insurance And Medical Details"))
    story.append(
        box_table(
            blanks(
                [
                    "Health insurance company",
                    "Member ID / group number",
                    "Pharmacy",
                    "Preferred hospital",
                    "Allergies",
                    "Important diagnoses",
                    "Medical devices",
                    "Where insurance cards are kept",
                ]
            )
        )
    )
    story.append(section("Care preferences"))
    story.append(
        para(
            "Use plain language here. For legally binding care instructions, talk to a qualified professional about advance directives or medical power of attorney."
        )
    )
    story.append(box_table(blanks(["Who should be involved", "What matters most to me", "Religious or cultural preferences", "Other notes"]), row_height=0.55 * inch))
    story.append(PageBreak())

    story.append(heading("Bills, Subscriptions, And Accounts"))
    story.append(para("Do not write passwords here if the binder will be widely accessible. Write where the password manager or sealed password record can be found."))
    bills = [["Company / bill", "Due date", "Amount", "How paid", "Login or where to find it"]]
    bills.extend([["", "", "", "", ""] for _ in range(14)])
    table = Table(bills, colWidths=[1.5 * inch, 0.85 * inch, 0.85 * inch, 1.1 * inch, 2.6 * inch], rowHeights=0.3 * inch)
    table.setStyle(TableStyle([("GRID", (0, 0), (-1, -1), 0.45, colors.HexColor("#b9c7cc")), ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#edf4f6"))]))
    story.append(table)
    story.append(PageBreak())

    story.append(heading("Important Documents"))
    story.append(
        checkbox_table(
            [
                "Driver license / ID",
                "Birth certificate",
                "Marriage certificate",
                "Social Security card",
                "Passport",
                "Will or estate documents",
                "Power of attorney",
                "Advance directive",
                "Life insurance policy",
                "Home deed / lease",
                "Car title / loan documents",
                "Tax records",
            ]
        )
    )
    story.append(Spacer(1, 0.15 * inch))
    story.append(box_table(blanks(["Safe / lockbox location", "Attorney contact", "Financial advisor contact", "Tax preparer contact"]), row_height=0.38 * inch))
    story.append(PageBreak())

    story.append(heading("Home, Pets, And Daily Life"))
    story.append(box_table(blanks(["Alarm / entry instructions", "Landlord / HOA / building contact", "Utilities", "Vehicles", "Mail / packages", "Plants / home care"]), row_height=0.38 * inch))
    story.append(section("Pet care"))
    story.append(box_table(blanks(["Pet names", "Veterinarian", "Food / medication", "Daily routine", "Emergency caregiver"]), row_height=0.45 * inch))
    story.append(PageBreak())

    story.append(heading("What I Want My Family To Know"))
    story.append(
        para(
            "This page is optional. Keep it practical, honest, and kind. You can write a few lines now and replace it later."
        )
    )
    story.append(box_table(blanks(["If something happens, please know", "People I want contacted", "Things I do not want you to worry about", "A message I want you to keep"]), row_height=1.0 * inch))
    story.append(PageBreak())

    story.append(heading("Talk To Your Parent Tonight Script"))
    story.append(para("Use this if you are helping a parent, spouse, or older relative start the binder without making it feel scary."))
    story.append(
        para(
            "<b>Open gently:</b> I am not trying to take over anything. I just realized that if there were an emergency, I would not know who to call or where anything is."
        )
    )
    story.append(
        para(
            "<b>Make it practical:</b> Can we write down the basics together? Doctors, medications, insurance, bills, and where important papers are. It would help me handle things calmly if anything ever happened."
        )
    )
    story.append(
        para(
            "<b>Lower the pressure:</b> We do not need to finish today. If we fill out the first page, that is already a win."
        )
    )
    story.append(section("Questions to ask"))
    story.append(
        checkbox_table(
            [
                "Who should I call first in an emergency?",
                "Who are your main doctors?",
                "What medications do you take every day?",
                "Where are your insurance cards?",
                "What bills must be paid every month?",
                "Where are important documents kept?",
                "Who takes care of pets or the house if you are away?",
                "Is there anything you want us to know, but never found the right moment to say?",
            ]
        )
    )
    story.append(PageBreak())

    story.append(heading("Update Checklist"))
    story.append(para("Review this binder every 6 months, after a move, after a new diagnosis, after a new insurance plan, or after a major family change."))
    story.append(
        checkbox_table(
            [
                "Contacts still current",
                "Doctors and medications updated",
                "Insurance information current",
                "Bills and subscriptions current",
                "Document locations still accurate",
                "Pet and home instructions current",
                "Trusted person still knows where binder is",
                "Old printed copies removed or replaced",
            ]
        )
    )
    story.append(Spacer(1, 0.15 * inch))
    story.append(box_table(blanks(["Reviewed by", "Review date", "Next review date", "Notes"]), row_height=0.42 * inch))

    return story


def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc = BaseDocTemplate(
        str(OUT),
        pagesize=letter,
        rightMargin=0.65 * inch,
        leftMargin=0.65 * inch,
        topMargin=0.65 * inch,
        bottomMargin=0.7 * inch,
        title="The Echo Box - Family Emergency Binder Full Kit",
        author="The Echo Box",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="normal")
    doc.addPageTemplates([PageTemplate(id="binder", frames=[frame], onPage=footer)])
    doc.build(build_story())
    print(OUT)


if __name__ == "__main__":
    main()
