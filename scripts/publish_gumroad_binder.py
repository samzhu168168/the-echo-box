import json
import os
import re
import sys
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_ENV = Path(r"F:\MyTraeProjects\tools\.env")
API_BASE = "https://api.gumroad.com/v2"
SLUG = "echo-box-family-emergency-binder"
PDF_RAW_URL = "https://raw.githubusercontent.com/samzhu168168/the-echo-box/main/output/pdf/The-Echo-Box-Family-Emergency-Binder-Kit.pdf"

PRODUCT_NAME = "The Echo Box - Family Emergency Binder Full Kit"
PRICE_CENTS = 999

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


def api(method: str, path: str, token: str, fields: dict | None = None, timeout=120):
    query = urlencode({"access_token": token})
    url = f"{API_BASE}{path}?{query}"
    body = urlencode(fields or {}).encode("utf-8") if fields is not None else None
    req = Request(
        url,
        data=body,
        method=method,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    return read_json(req, timeout=timeout)


def list_products(token: str):
    return api("GET", "/products", token, None, timeout=30).get("products", [])


def find_product(products):
    for product in products:
        if product.get("custom_permalink") == SLUG:
            return product
        if SLUG in str(product.get("short_url", "")):
            return product
    return None


def payload():
    return {
        "name": PRODUCT_NAME,
        "price": PRICE_CENTS,
        "description": DESCRIPTION,
        "custom_permalink": SLUG,
        "require_shipping": "false",
    }


def main():
    token = load_token()
    existing = find_product(list_products(token))

    if existing:
        product_id = existing["id"]
        data = api("PUT", f"/products/{product_id}", token, payload())
        action = "updated"
    else:
        data = api("POST", "/products", token, payload())
        product_id = data["product"]["id"]
        action = "created"

    product = data.get("product", {})
    if not product.get("published"):
        product = api("PUT", f"/products/{product_id}/enable", token).get("product", product)

    print(
        json.dumps(
            {
                "action": action,
                "id": product_id,
                "name": product.get("name", PRODUCT_NAME),
                "price_cents": product.get("price", PRICE_CENTS),
                "published": product.get("published"),
                "url": product.get("short_url") or f"https://samzhu168.gumroad.com/l/{SLUG}",
                "files_attached": product.get("files", []),
                "pdf_raw_url_for_manual_attachment": PDF_RAW_URL,
                "note": "Gumroad's current API rejects legacy file uploads. Attach the PDF in Gumroad UI or implement the files/presign flow.",
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
