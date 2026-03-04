# Bloque Debit Card Setup

## Prerequisites

- MongoDB admin access (the `encointer-backend` user needs `readWrite` on `bloque-credentials`)
- `BLOQUE_API_KEY` env variable set on the backend (single key for the `encointer` origin, shared across all users)
- The user's SS58 address (must match their accounting dashboard login)

## Step-by-step: onboard a new user

### 1. Choose an alias

The alias is an arbitrary unique string per user. It becomes part of their Bloque DID: `did:bloque:encointer:<alias>`. Use something memorable (e.g. a username).

### 2. Insert credentials into MongoDB

```bash
mongosh "mongodb://<user>:<pass>@bezzera.encointer.org:27417/?tls=true&authSource=admin" --eval '
  db.getSiblingDB("bloque-credentials").credentials.insertOne({
    address: "<SS58_ADDRESS>",
    alias: "<ALIAS>"
  })
'
```

### 3. Connect and get an access token

```bash
TOKEN=$(curl -s -X POST https://api.bloque.app/api/origins/encointer/connect \
  -H "Content-Type: application/json" \
  -d '{
    "assertion_result": {
      "challengeType": "API_KEY",
      "value": { "api_key": "'$BLOQUE_API_KEY'", "alias": "<ALIAS>" }
    },
    "extra_context": {}
  }' | python3 -c "import sys,json; print(json.load(sys.stdin)['result']['access_token'])")
```

(Uses the same `BLOQUE_API_KEY` env variable as the backend.)
```

### 4. Create a virtual account (pocket)

```bash
curl -s -X POST https://api.bloque.app/api/mediums/virtual \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "holder_urn": "did:bloque:encointer:<ALIAS>",
    "input": {},
    "metadata": { "source": "curl", "name": "<ALIAS>-pocket" }
  }' | python3 -m json.tool
```

Note the `ledger_account_id` from the response (appears after a few seconds).

### 5. Wait for the virtual account to become active

Poll until `status` is `active` (~10-15 seconds):

```bash
curl -s "https://api.bloque.app/api/accounts/<VIRTUAL_URN>" \
  -H "Authorization: Bearer $TOKEN" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print('status:', d['account']['status'], 'ledger:', d['account'].get('ledger_account_id'))"
```

### 6. Create a card linked to the pocket

Use the `ledger_account_id` from step 5:

```bash
curl -s -X POST https://api.bloque.app/api/mediums/card \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "holder_urn": "did:bloque:encointer:<ALIAS>",
    "ledger_account_id": "<LEDGER_ACCOUNT_ID>",
    "input": { "create": { "card_type": "VIRTUAL" } },
    "metadata": { "source": "curl", "name": "<ALIAS>-card" }
  }' | python3 -m json.tool
```

The card is immediately `ACTIVE`. The response includes `card_last_four`, `card_url_details` (PCI-compliant page to view full card number/CVV), and the card URN.

### 7. Verify

```bash
curl -s "https://api.bloque.app/api/accounts?holder_urn=did:bloque:encointer:<ALIAS>" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```

The user can now log into the accounting dashboard and see their accounts under the "Card Transactions" tab.

### deposit

get deposit Address from the frontend. deposits must be made on Kreivo
Kreivo isn't supported by any familiar tooling (js-apps, nova, subwallet). We need to XCM directly to the deposit address:

send 0.1 directl to deposit address (replace beneficiary!)
https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fasset-hub-kusama.ibp.network#/extrinsics/decode/0x1f0d05010100a52305040100000700e8764817010501000105040d010000010100a1ab922215c42de7b837f37858d977d50945ed884a30215b93e2996a18b8fe8f00

send 1.0 USDC.p and 0.1KSM to deposit address
https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fasset-hub-kusama.ibp.network#/extrinsics/decode/0x1f0d05010100a52305080204090200a10f043205e5140002093d000100000700e8764817010501000105040d010000010100a1ab922215c42de7b837f37858d977d50945ed884a30215b93e2996a18b8fe8f00


