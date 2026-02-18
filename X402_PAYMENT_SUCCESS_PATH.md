# x402 Payment Success Path Checklist (One-Run)

Use this when you want to validate Thirdweb x402 flow end-to-end quickly.

## Script

Run:

```bash
bash scripts/x402_payment_success_path.sh http://localhost:3000
```

Or for production API:

```bash
bash scripts/x402_payment_success_path.sh https://api.meshforge.tech
```

## What this verifies

1. **Challenge path (no payment):**
   - `GET /api/x402/premium-content` => `402 Payment Required`
   - `GET /api/agents?premium=1` => `402 Payment Required`
   - `payment-required` header exists.

2. **Success path (with payment proof):**
   - Set a valid `x-payment` proof and rerun:

```bash
X_PAYMENT='<valid-payment-proof>' bash scripts/x402_payment_success_path.sh http://localhost:3000
```

   - Expected: HTTP `200` on paid requests.

---

## Request / Response examples

## A) No payment (expected challenge)

Request:

```bash
curl -i http://localhost:3000/api/x402/premium-content
```

Expected response headers:

```http
HTTP/1.1 402 Payment Required
payment-required: <base64-encoded-challenge>
```

Body (v2 style):

```json
{}
```

## B) With payment proof (expected success)

Request:

```bash
curl -i -H "x-payment: <valid-proof>" http://localhost:3000/api/x402/premium-content
```

Expected response:

```http
HTTP/1.1 200 OK
```

Body:

```json
{
  "data": "MeshForge premium coordination feed",
  "network": "celoSepolia",
  "price": "$0.01",
  "payment": "settled"
}
```

---

## Common failure reasons

- `402` even with `x-payment`:
  - proof expired
  - proof is for different URL/method
  - wallet/network mismatch
- `500 x402 is not configured on server`:
  - set `THIRDWEB_SECRET_KEY`
  - set `THIRDWEB_SERVER_WALLET`
- Reown origin errors in frontend:
  - allowlist `http://localhost:3000` in cloud.reown.com for your WalletConnect project

---

## Minimal env required (server)

```dotenv
THIRDWEB_SECRET_KEY=sk_...
THIRDWEB_SERVER_WALLET=0x...
REQUIRE_X402=true
```

Optional aliases (already supported):

```dotenv
THIRDWEB_X402_API_KEY=...
THIRDWEB_X402_ENDPOINT=...
X402_API_KEY=...
X402_ENDPOINT=...
```
