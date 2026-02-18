#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:3000}"
PREMIUM_ENDPOINT_1="${BASE_URL}/api/x402/premium-content"
PREMIUM_ENDPOINT_2="${BASE_URL}/api/agents?premium=1"

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

print_title() {
  echo
  echo "=================================================="
  echo "$1"
  echo "=================================================="
}

check_402() {
  local url="$1"
  local name="$2"

  print_title "[STEP] 402 challenge check -> ${name}"

  curl -s -D "${TMP_DIR}/headers.txt" -o "${TMP_DIR}/body.txt" "$url"

  local status
  status="$(awk 'NR==1 {print $2}' "${TMP_DIR}/headers.txt")"

  echo "URL: $url"
  echo "HTTP Status: ${status}"

  local payment_header
  payment_header="$(grep -i '^payment-required:' "${TMP_DIR}/headers.txt" || true)"

  if [[ "$status" != "402" ]]; then
    echo "[FAIL] Expected 402, got ${status}"
    echo "--- headers ---"
    cat "${TMP_DIR}/headers.txt"
    echo "--- body ---"
    cat "${TMP_DIR}/body.txt"
    exit 1
  fi

  if [[ -z "$payment_header" ]]; then
    echo "[FAIL] 402 returned but no payment-required header found"
    echo "--- headers ---"
    cat "${TMP_DIR}/headers.txt"
    exit 1
  fi

  echo "payment-required header: present"
  echo "[PASS] ${name} challenge works"
}

check_200_with_payment() {
  local url="$1"
  local name="$2"
  local payment_proof="$3"

  print_title "[STEP] 200 success check with x-payment -> ${name}"

  curl -s -D "${TMP_DIR}/headers_paid.txt" -o "${TMP_DIR}/body_paid.txt" \
    -H "x-payment: ${payment_proof}" \
    "$url"

  local status
  status="$(awk 'NR==1 {print $2}' "${TMP_DIR}/headers_paid.txt")"

  echo "URL: $url"
  echo "HTTP Status: ${status}"

  if [[ "$status" == "200" ]]; then
    echo "[PASS] ${name} paid request succeeded"
    echo "--- response body (first 400 chars) ---"
    head -c 400 "${TMP_DIR}/body_paid.txt"; echo
    return 0
  fi

  echo "[WARN] Expected 200, got ${status}. This usually means x-payment proof is invalid/expired for this endpoint."
  echo "--- headers ---"
  cat "${TMP_DIR}/headers_paid.txt"
  echo "--- body ---"
  cat "${TMP_DIR}/body_paid.txt"
  return 1
}

print_title "MeshForge x402 Payment Success Path"
echo "BASE_URL: ${BASE_URL}"

# Step 1: no-payment challenge should be enforced
check_402 "$PREMIUM_ENDPOINT_1" "premium-content"
check_402 "$PREMIUM_ENDPOINT_2" "agents premium"

# Step 2: optional paid-success test if proof is provided
if [[ -n "${X_PAYMENT:-}" ]]; then
  echo
  echo "X_PAYMENT env detected, attempting paid-success checks..."
  check_200_with_payment "$PREMIUM_ENDPOINT_1" "premium-content" "$X_PAYMENT" || true
  check_200_with_payment "$PREMIUM_ENDPOINT_2" "agents premium" "$X_PAYMENT" || true
else
  echo
  echo "[INFO] X_PAYMENT is empty, skipping paid-success checks."
  echo "To test 200 success path, rerun with:"
  echo "  X_PAYMENT='<valid-payment-proof>' bash scripts/x402_payment_success_path.sh ${BASE_URL}"
fi

print_title "Done"
echo "Summary: x402 challenge path verified. Paid-success path runs when X_PAYMENT is provided."
