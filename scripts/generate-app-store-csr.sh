#!/usr/bin/env bash
# Apple App Store / Developer portal — Certificate Signing Request (CSR).
#
# Upload the .certSigningRequest at https://developer.apple.com/account/resources/certificates
# when creating an "Apple Distribution" (or "iOS Distribution") certificate.
#
# Alternative (often smoother with Xcode): Keychain Access → Certificate Assistant →
# “Request a Certificate From a Certificate Authority…” — saves a CSR and keeps the
# private key in your login keychain for automatic pairing.
#
# Usage:
#   CN="Legal Name" EMAIL="you@domain.com" bash scripts/generate-app-store-csr.sh
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${ROOT}/ios/certificates"
mkdir -p "$OUT"

CN="${CN:-}"
EMAIL="${EMAIL:-}"

if [[ -z "$CN" || -z "$EMAIL" ]]; then
  echo "Missing CN or EMAIL." >&2
  echo "Example: CN=\"Jane Doe\" EMAIL=\"dev@company.com\" bash scripts/generate-app-store-csr.sh" >&2
  exit 1
fi

STAMP="$(date +%Y%m%d-%H%M%S)"
KEY="$OUT/appstore-${STAMP}.key"
CSR="$OUT/appstore-${STAMP}.certSigningRequest"

openssl req -new -newkey rsa:2048 -nodes \
  -keyout "$KEY" \
  -out "$CSR" \
  -subj "/emailAddress=${EMAIL}/CN=${CN}"

chmod 600 "$KEY"
echo "Private key (do not commit, back up securely): $KEY"
echo "Upload to Apple Developer → Certificates → + : $CSR"
