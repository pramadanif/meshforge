# Thirdweb x402 Payments Integration Guide

Step-by-step guide untuk mengintegrasikan x402 gasless micropayments ke dalam MeshForge protocol.

---

## 🎯 Overview

x402 adalah protokol payment layer yang memungkinkan:
- **Gasless transactions** — user tidak perlu bayar gas fee
- **Micropayments** — support payment sekecil $0.01
- **Multi-chain** — support 170+ chains including Celo
- **API monetization** — payment gate untuk API endpoints

Dalam konteks MeshForge, x402 digunakan untuk:
1. **Intent broadcast payments** — agent bayar micropayment saat broadcast intent
2. **Escrow settlement** — conditional payment release setelah execution proof
3. **API access control** — payment gate untuk premium agent capabilities

---

## 📋 Prerequisites

Sebelum mulai, pastikan Anda punya:
- [ ] Akun Thirdweb (sign up di [thirdweb.com](https://thirdweb.com))
- [ ] Project sudah di-setup di Thirdweb dashboard
- [ ] Wallet dengan Celo Sepolia testnet tokens untuk deploy

---

## Step 1: Setup Thirdweb Dashboard

### 1.1 Login ke Thirdweb Dashboard

1. Buka [thirdweb.com/dashboard](https://thirdweb.com/dashboard)
2. Login dengan wallet Anda (MetaMask / WalletConnect)
3. Klik **"Create Project"** atau pilih existing project

### 1.2 Dapatkan Secret Key

1. Di dashboard, navigasi ke **"Settings"** (sidebar kiri)
2. Klik tab **"API Keys"**
3. Klik **"Create API Key"**
4. Pilih permission scope:
   - ✅ **Backend / Server** (required untuk x402)
   - ✅ **Read & Write access**
5. Simpan **Secret Key** yang muncul (format: `sk_...`)

⚠️ **PENTING:** Secret key hanya muncul sekali, simpan dengan aman!

### 1.3 Dapatkan Client ID (Public)

1. Di halaman yang sama, lihat section **"Client ID"**
2. Copy **Client ID** (format: `<hash-string>`)
3. Client ID ini **public** dan boleh dipakai di frontend

---

## Step 2: Setup Server Wallet untuk x402 Facilitator

### 2.1 Buat/Import Server Wallet

**Opsi A: Buat Wallet Baru**

1. Di Thirdweb dashboard, navigasi ke **"Wallets"** (sidebar)
2. Klik **"Create Wallet"**
3. Pilih **"Smart Wallet"** atau **"EOA"**
4. Simpan private key dengan aman

**Opsi B: Import Existing Wallet**

1. Gunakan wallet yang sudah Anda punya
2. Pastikan wallet ini punya balance Celo Sepolia untuk gas

### 2.2 Dapatkan Server Wallet Address

1. Copy **wallet address** (format: `0x...`)
2. Address ini akan digunakan sebagai `serverWalletAddress` di kode

### 2.3 Fund Server Wallet (Testnet)

1. Buka [Celo Sepolia Faucet](https://faucet.celo.org/sepolia)
2. Paste server wallet address
3. Request testnet CELO
4. Tunggu beberapa detik, verify balance di [explorer](https://sepolia.celoscan.io/)

---

## Step 3: Configure x402 Relay Endpoint

### 3.1 Setup x402 Facilitator Service

1. Di Thirdweb dashboard, navigasi ke **"x402"** (atau "Payments")
2. Klik **"Enable x402 Payments"**
3. Konfigurasi:
   - **Network:** Celo Sepolia Testnet
   - **Server Wallet:** Paste wallet address dari Step 2.2
   - **Facilitator Mode:** Auto-relay
4. Save configuration

### 3.2 Dapatkan x402 Endpoint

Thirdweb akan generate endpoint otomatis:
```
https://pay.thirdweb.com/v1/<your-project-id>/relay
```

Atau custom endpoint jika self-hosted:
```
https://your-domain.com/x402-relay
```

Copy endpoint ini untuk Step 4.

---

## Step 4: Update Environment Variables

Edit file `.env` di root project:

```bash
# Thirdweb Credentials
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=b24cd7ca0797f41ffb73796f43f1fbd7  # Existing
THIRDWEB_API_KEY=8T9b9-YKggsnkJLGgMSHsLm1BXNpQtFWV6bzWQ_ubQ6U6mGGOndp1TGLS2HMTMBa6FXzmb2KXwjA2cAOyZuKTw  # Existing

# x402 Configuration (ADD THESE)
THIRDWEB_SECRET_KEY=sk_PASTE_YOUR_SECRET_KEY_HERE  # Dari Step 1.2
THIRDWEB_SERVER_WALLET=0xPASTE_YOUR_SERVER_WALLET_ADDRESS_HERE  # Dari Step 2.2
THIRDWEB_X402_ENDPOINT=https://pay.thirdweb.com/v1/YOUR_PROJECT_ID/relay  # Dari Step 3.2
THIRDWEB_X402_API_KEY=PASTE_YOUR_SECRET_KEY_HERE  # Same as THIRDWEB_SECRET_KEY

# Enable x402 Mode
REQUIRE_X402=true  # Change dari false ke true
```

Restart dev server setelah update:
```bash
npm run dev
```

---

## Step 5: Integrate x402 di Relayer (Backend)

### 5.1 Install Thirdweb SDK (jika belum)

```bash
npm install thirdweb
```

### 5.2 Update `src/lib/relayer.ts`

Tambahkan x402 facilitator setup di bagian atas file:

```typescript
import { createThirdwebClient } from "thirdweb";
import { facilitator, settlePayment } from "thirdweb/x402";
import { celoSepolia } from "thirdweb/chains";

// Create Thirdweb client for x402
const thirdwebClient = createThirdwebClient({ 
  secretKey: process.env.THIRDWEB_SECRET_KEY!
});

// Create x402 facilitator
const thirdwebX402Facilitator = facilitator({
  client: thirdwebClient,
  serverWalletAddress: process.env.THIRDWEB_SERVER_WALLET as `0x${string}`,
});
```

### 5.3 Update `submitMetaTransaction` Function

Ganti existing x402 mock dengan real implementation:

```typescript
async function submitMetaTransaction(txData: any) {
  // Check x402 requirement
  if (process.env.REQUIRE_X402 === 'true') {
    try {
      // Attempt x402 gasless relay
      const result = await settlePayment({
        resourceUrl: `${process.env.THIRDWEB_X402_ENDPOINT}/submit`,
        method: "POST",
        paymentData: txData.paymentProof, // From agent's payment signature
        network: celoSepolia,
        price: "$0.01", // Micropayment per transaction
        facilitator: thirdwebX402Facilitator,
        body: JSON.stringify(txData),
      });

      if (result.status === 200) {
        console.log('✅ x402 payment settled, transaction submitted');
        return result.responseBody;
      } else {
        throw new Error(`x402 settlement failed: ${result.status}`);
      }
    } catch (error) {
      console.error('❌ x402 relay failed, falling back to direct wallet:', error);
      // Fallback to direct wallet client execution
      return executeWithWalletClient(txData);
    }
  } else {
    // Direct wallet execution (no x402)
    return executeWithWalletClient(txData);
  }
}

// Fallback execution dengan wallet client
async function executeWithWalletClient(txData: any) {
  const account = privateKeyToAccount(process.env.RELAYER_PRIVATE_KEY as `0x${string}`);
  const walletClient = createWalletClient({
    account,
    chain: celoSepolia,
    transport: http(),
  });

  const hash = await walletClient.sendTransaction({
    to: txData.to,
    data: txData.data,
    value: txData.value,
  });

  return { transactionHash: hash };
}
```

---

## Step 6: Integrate x402 di API Routes (Frontend)

### 6.1 Update API Route untuk Payment Gating

Contoh: `src/app/api/agents/route.ts`

```typescript
import { createThirdwebClient } from "thirdweb";
import { facilitator, settlePayment } from "thirdweb/x402";
import { celoSepolia } from "thirdweb/chains";

const thirdwebClient = createThirdwebClient({ 
  secretKey: process.env.THIRDWEB_SECRET_KEY!
});

const thirdwebX402Facilitator = facilitator({
  client: thirdwebClient,
  serverWalletAddress: process.env.THIRDWEB_SERVER_WALLET as `0x${string}`,
});

export async function GET(request: Request) {
  // Check if endpoint requires payment
  const isPremiumEndpoint = request.url.includes('/premium');

  if (isPremiumEndpoint) {
    // Process x402 payment
    const result = await settlePayment({
      resourceUrl: new URL(request.url).href,
      method: "GET",
      paymentData: request.headers.get("x-payment"),
      network: celoSepolia,
      price: "$0.001", // $0.001 per API call
      facilitator: thirdwebX402Facilitator,
    });

    if (result.status !== 200) {
      return Response.json(result.responseBody, {
        status: result.status,
        headers: result.responseHeaders,
      });
    }
  }

  // Continue dengan logic normal
  const agents = await prisma.executionLog.findMany({
    // ... existing query
  });

  return Response.json({ agents });
}
```

---

## Step 7: Frontend Integration (Agent Payment)

### 7.1 Install x402 Client SDK

```bash
npm install thirdweb
```

### 7.2 Update `src/hooks/useMeshForge.ts`

Tambahkan payment utility:

```typescript
import { createThirdwebClient, getContract } from "thirdweb";
import { preparePayment } from "thirdweb/x402";

const thirdwebClient = createThirdwebClient({ 
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!
});

export function useMeshForge() {
  // ... existing hooks

  const broadcastIntentWithPayment = async (intentData: any) => {
    // Prepare x402 payment proof
    const payment = await preparePayment({
      client: thirdwebClient,
      wallet: walletClient, // From wagmi useWalletClient()
      resourceUrl: `${window.location.origin}/api/intents`,
      method: "POST",
      price: "$0.01",
      network: celoSepolia,
    });

    // Attach payment to request
    const response = await fetch('/api/intents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Payment': payment.proofData, // x402 payment proof
      },
      body: JSON.stringify(intentData),
    });

    return response.json();
  };

  return { broadcastIntentWithPayment };
}
```

---

## Step 8: Testing x402 Integration

### 8.1 Test Relayer dengan x402

```bash
# Start relayer with x402 enabled
REQUIRE_X402=true npm run relayer -- lockEscrow 0
```

Expected output:
```
✅ x402 payment settled, transaction submitted
Transaction hash: 0x...
```

### 8.2 Test API Payment Gating

```bash
# Without payment header (should fail)
curl http://localhost:3000/api/agents/premium

# With x402 payment header
curl -H "X-Payment: <payment-proof>" http://localhost:3000/api/agents/premium
```

### 8.3 Monitor x402 Transactions

1. Buka Thirdweb dashboard
2. Navigasi ke **"x402"** → **"Transactions"**
3. Lihat real-time payment settlements
4. Verify transaction hashes di Celo Sepolia explorer

---

## Step 9: Production Checklist

Sebelum deploy ke production:

- [ ] ✅ THIRDWEB_SECRET_KEY disimpan di environment variables (JANGAN commit ke git!)
- [ ] ✅ Server wallet di-fund dengan cukup CELO untuk gas
- [ ] ✅ x402 endpoint tested dan verified di dashboard
- [ ] ✅ API payment gating tested dengan real wallet
- [ ] ✅ Relayer fallback mechanism tested (kalau x402 down)
- [ ] ✅ Error handling untuk x402 failures implemented
- [ ] ✅ Monitoring setup untuk track x402 transaction success rate
- [ ] ✅ Rate limiting untuk prevent abuse

---

## Step 10: Migration ke Celo Mainnet

Ketika ready untuk production:

### 10.1 Update Network Configuration

```typescript
// Change dari celoSepolia ke celo mainnet
import { celo } from "thirdweb/chains";

const thirdwebX402Facilitator = facilitator({
  client: thirdwebClient,
  serverWalletAddress: process.env.THIRDWEB_SERVER_WALLET_MAINNET as `0x${string}`,
});

// Update di settlePayment
const result = await settlePayment({
  // ...
  network: celo, // Changed from celoSepolia
  // ...
});
```

### 10.2 Fund Server Wallet (Mainnet)

1. Transfer CELO ke server wallet address
2. Verify balance sufficient untuk operational load
3. Setup auto-refill monitoring

### 10.3 Update Thirdweb Dashboard

1. Create new project untuk mainnet deployment
2. Generate new API keys (production keys)
3. Update x402 facilitator dengan mainnet network

---

## 🎉 Completion

Setelah complete semua steps:

✅ **Agent dapat broadcast intents dengan micropayment**  
✅ **API endpoints payment-gated untuk premium features**  
✅ **Gasless transactions via x402 relay**  
✅ **Fallback ke direct wallet jika x402 unavailable**  
✅ **Real-time monitoring di Thirdweb dashboard**

---

## 🔧 Troubleshooting

### Error: "Invalid secret key"
- **Cause:** THIRDWEB_SECRET_KEY tidak diset atau salah
- **Fix:** Verify secret key di dashboard, pastikan start dengan `sk_`

### Error: "Server wallet insufficient balance"
- **Cause:** Server wallet tidak punya cukup CELO untuk gas
- **Fix:** Fund wallet via faucet (testnet) atau transfer (mainnet)

### Error: "x402 endpoint not found"
- **Cause:** THIRDWEB_X402_ENDPOINT tidak configured
- **Fix:** Verify endpoint di dashboard, test dengan curl

### Error: "Payment proof verification failed"
- **Cause:** Frontend mengirim invalid payment signature
- **Fix:** Verify `preparePayment()` dipanggil dengan correct wallet client

---

## 📚 Resources

- [Thirdweb x402 Docs](https://portal.thirdweb.com/x402)
- [Thirdweb Dashboard](https://thirdweb.com/dashboard)
- [Celo Sepolia Explorer](https://sepolia.celoscan.io/)
- [MeshForge SDK Guide](./SDK_NPM_PUBLISH_GUIDE.md)

---

**Last Updated:** February 17, 2026  
**Status:** Production-ready integration guide  
**Chain:** Celo Sepolia (testnet) → Celo (mainnet migration path)
