import json
import os
import re
import sys
import uuid
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_ENV = Path(r"F:\MyTraeProjects\tools\.env")
API_BASE = "https://api.gumroad.com/v2"
SLUG = "fmrrxr"
PDF_PATH = ROOT / "output" / "pdf" / "The-Echo-Box-Family-Emergency-Binder-Kit.pdf"


PRODUCT_NAME = "The Echo Box - Family Emergency Binder Full Kit"
PRICE_DOLLARS = 9.99
TAGS = [
    "family emergency binder",
    "caregiver checklist",
    "aging parents",
    "printable planner",
]

DESCRIPTION = """
<h2>The family emergency file you hope you never need.</h2>
<p><strong>The Echo Box</strong> is a printable emergency binder for the people who would have to handle everything if something happened.</p>
<p>Mom fell. Dad is in the ER. Nobody knows the meds, passwords, doctor, insurance, bills, wishes, or who to call. This binder gives your family one calm place to start.</p>

<h3>What you get</h3>
<ul>
  <li>Printable Family Emergency Binder PDF</li>
  <li>Emergency contacts pages</li>
  <li>Doctors and medications tracker</li>
  <li>Insurance and medical details page</li>
  <li>Bills, subscriptions, and account location tracker</li>
  <li>Important document location checklist</li>
  <li>Pet care and home instruction pages</li>
  <li>Care preference notes, written in plain language</li>
  <li>Final family note page</li>
  <li>Talk to your parent tonight conversation script</li>
  <li>6-month update checklist</li>
</ul>

<h3>Who it is for</h3>
<ul>
  <li>Adult children helping aging parents get organized</li>
  <li>Spouses who do not want one person to carry all the household knowledge</li>
  <li>Caregivers who need emergency information in one place</li>
  <li>Anyone who wants their family to have a simple plan before a crisis</li>
</ul>

<h3>Important note</h3>
<p>This is an organization and communication tool. It is not legal, medical, financial, tax, or estate planning advice. It does not replace a will, power of attorney, advance directive, insurance policy, or professional advice.</p>
"""


def load_token(env_path: Path = DEFAULT_ENV) -> str:
    if os.environ.get("GUMROAD_TOKEN"):
        return os.environ["GUMROAD_TOKEN"].strip()

    text = env_path.read_text(encoding="utf-8", errors="ignore")
    match = re.search(r"GUMROAD_TOKEN\s*=\s*([^\r\n]+)", text)
    if not match:
        raise RuntimeError(f"GUMROAD_TOKEN not found in {env_path}")
    return match.group(1).strip().strip('"').strip("'")


def read_json(req: Request, timeout=120):
    try:
        with urlopen(req, timeout=timeout) as response:
            raw = response.read().decode("utf-8")
    except HTTPError as exc:
        raw = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(raw) from exc
    data = json.loads(raw)
    if not data.get("success"):
        raise RuntimeError(json.dumps(data, ensure_ascii=False, indent=2))
    return data


def form_request(method: str, path: str, fields: dict, timeout=120):
    body = urlencode(fields).encode("utf-8")
    req = Request(
        f"{API_BASE}{path}",
        data=body,
        method=method,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    return read_json(req, timeout=timeout)


def multipart_request(method: str, path: str, fields: dict, file_field: str, file_path: Path):
    boundary = f"----EchoBox{uuid.uuid4().hex}"
    chunks = []
    for name, value in fields.items():
        chunks.append(f"--{boundary}\r\n".encode("utf-8"))
        chunks.append(f'Content-Disposition: form-data; name="{name}"\r\n\r\n'.encode("utf-8"))
        chunks.append(str(value).encode("utf-8"))
        chunks.append(b"\r\n")

    chunks.append(f"--{boundary}\r\n".encode("utf-8"))
    chunks.append(
        (
            f'Content-Disposition: form-data; name="{file_field}"; filename="{file_path.name}"\r\n'
            "Content-Type: application/pdf\r\n\r\n"
        ).encode("utf-8")
    )
    chunks.append(file_path.read_bytes())
    chunks.append(b"\r\n")
    chunks.append(f"--{boundary}--\r\n".encode("utf-8"))

    req = Request(
        f"{API_BASE}{path}",
        data=b"".join(chunks),
        method=method,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
    )
    return read_json(req, timeout=120)


def list_products(token: str):
    query = urlencode({"access_token": token})
    req = Request(f"{API_BASE}/products?{query}", method="GET")
    data = read_json(req, timeout=30)
    return data.get("products", [])


def find_product(products):
    for product in products:
        if product.get("custom_permalink") == SLUG:
            return product
        if SLUG in str(product.get("short_url", "")):
            return product
    return None


def product_payload(token: str):
    return {
        "access_token": token,
        "name": PRODUCT_NAME,
        "price": int(PRICE_DOLLARS * 100),
        "description": DESCRIPTION,
        "custom_permalink": SLUG,
        "require_shipping": "false",
        "tags": json.dumps(TAGS),
    }


def main():
    if not PDF_PATH.exists():
        raise RuntimeError(f"Missing PDF: {PDF_PATH}")

    token = load_token()
    products = list_products(token)
    existing = find_product(products)

    if existing:
        product_id = existing["id"]
        data = multipart_request(
            "PUT",
            f"/products/{product_id}",
            product_payload(token),
            "file",
            PDF_PATH,
        )
        action = "updated"
    else:
        data = multipart_request("POST", "/products", product_payload(token), "file", PDF_PATH)
        product_id = data["product"]["id"]
        action = "created"

    product = data.get("product", {})

    if not product.get("published"):
        publish_data = form_request(
            "PUT",
            f"/products/{product_id}/enable",
            {"access_token": token},
            timeout=30,
        )
        product = publish_data.get("product", product)

    print(
        json.dumps(
            {
                "action": action,
                "id": product_id,
                "name": product.get("name", PRODUCT_NAME),
                "price_cents": product.get("price", int(PRICE_DOLLARS * 100)),
                "published": product.get("published", True),
                "url": product.get("short_url") or f"https://samzhu168.gumroad.com/l/{SLUG}",
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        sys.exit(1)
