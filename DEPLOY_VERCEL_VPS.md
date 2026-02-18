# MeshForge Deploy Guide (Vercel FE + VPS BE)

Panduan ini dibuat khusus untuk setup kamu:
- Frontend: Vercel
- Backend API + Indexer: VPS
- Domain API: `api.meshforge.tech`
- PostgreSQL: sudah ada di VPS
- Redis: belum ada
- PM2: sudah ada

---

## 0) Arsitektur Akhir

- `meshforge.tech` (atau domain Vercel) → Frontend Next.js (Vercel)
- `api.meshforge.tech` → Next.js API routes di VPS (PM2 + Nginx)
- PostgreSQL di VPS → dipakai API + indexer
- Redis di VPS → dipakai komponen backend yang butuh cache/queue

---

## 1) Siapkan DNS

Di DNS provider, buat record:

1. `A` record
   - Host: `api`
   - Value: `IP_VPS_KAMU`
   - TTL: default

2. Untuk frontend Vercel:
   - Tambahkan domain utama di Vercel project (`meshforge.tech`)
   - Ikuti instruksi Vercel untuk record `A/CNAME`

Cek propagasi:

```bash
dig +short api.meshforge.tech
```

---

## 2) Install Redis di VPS

Ubuntu/Debian:

```bash
sudo apt update
sudo apt install -y redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server
sudo systemctl status redis-server
redis-cli ping
```

Harus balas `PONG`.

---

## 3) Deploy kode ke VPS

Direkomendasikan folder:

```bash
sudo mkdir -p /var/www/meshforge-next
sudo chown -R $USER:$USER /var/www/meshforge-next
cd /var/www/meshforge-next
git clone <repo-kamu> .
```

Install deps + build:

```bash
npm install --legacy-peer-deps
npm run build
```

---

## 4) Set environment di VPS (`.env`)

Buat/isi `.env` di `/var/www/meshforge-next/.env`:

```dotenv
NODE_ENV=production

# API host
NEXT_PUBLIC_API_BASE_URL=https://api.meshforge.tech

# CORS (WAJIB isi domain FE Vercel kamu)
CORS_ALLOWED_ORIGINS=https://meshforge.tech,https://www.meshforge.tech,https://<project>.vercel.app

# Database
DATABASE_URL=postgresql://postgres:postgre@localhost:5432/meshforge?schema=public

# Redis
REDIS_URL=redis://127.0.0.1:6379

# Chain / contracts
CELO_RPC_URL=https://forno.celo-sepolia.celo-testnet.org
INTENT_MESH_ADDRESS=0x7Bd4CBd578a612b6901101aFeBD855FBfa81Ab1b
AGENT_REGISTRY_ADDRESS=0x32a6F7e395248e9924Cee3CcBaf8dde08Cd13b05

# Frontend-exposed addresses
NEXT_PUBLIC_INTENT_MESH_ADDRESS=0x7Bd4CBd578a612b6901101aFeBD855FBfa81Ab1b
NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS=0x32a6F7e395248e9924Cee3CcBaf8dde08Cd13b05
NEXT_PUBLIC_AGENT_FACTORY_ADDRESS=0xB7c78ceCB25a1c40b3fa3382bAf3F34c9b5bdD66
NEXT_PUBLIC_MESH_VAULT_ADDRESS=0xBE2bcf983b84c030b0C851989aDF351816fA21D2

# WalletConnect / thirdweb client
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=b24cd7ca0797f41ffb73796f43f1fbd7
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=b24cd7ca0797f41ffb73796f43f1fbd7

# x402 server
THIRDWEB_SECRET_KEY=sk_xxx_backend_secret
THIRDWEB_SERVER_WALLET=0x096AE49136b0A8d402d03F288D64170ea0d09E2c
THIRDWEB_X402_ENDPOINT=
THIRDWEB_X402_API_KEY=sk_xxx_backend_secret
REQUIRE_X402=true

# relayer
RELAYER_PRIVATE_KEY=0x<64hex>
```

> Gunakan **Secret Key** `sk_...` dari Thirdweb Dashboard untuk backend. Jangan pakai client ID sebagai secret.

---

## 5) Prisma di VPS

```bash
cd /var/www/meshforge-next
npm run prisma:generate
npm run prisma:push
```

---

## 6) Jalankan API + Indexer dengan PM2

File PM2 sudah disiapkan: `ecosystem.config.cjs`.

Jalankan:

```bash
cd /var/www/meshforge-next
pm2 start ecosystem.config.cjs
pm2 save
pm2 status
pm2 logs meshforge-api --lines 100
pm2 logs meshforge-indexer --lines 100
```

Relayer sekarang mode CLI (one-shot), jalankan manual saat dibutuhkan:

```bash
npm run relayer -- lockEscrow <intentId>
```

---

## 7) Setup Nginx untuk `api.meshforge.tech`

Install Nginx + certbot (jika belum):

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

Buat config:

```bash
sudo nano /etc/nginx/sites-available/api.meshforge.tech
```

Isi:

```nginx
server {
    server_name api.meshforge.tech;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/api.meshforge.tech /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Pasang SSL:

```bash
sudo certbot --nginx -d api.meshforge.tech
```

---

## 8) Konfigurasi Frontend di Vercel

Di Project Vercel → Settings → Environment Variables:

```dotenv
NEXT_PUBLIC_API_BASE_URL=https://api.meshforge.tech
NEXT_PUBLIC_INTENT_MESH_ADDRESS=0x7Bd4CBd578a612b6901101aFeBD855FBfa81Ab1b
NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS=0x32a6F7e395248e9924Cee3CcBaf8dde08Cd13b05
NEXT_PUBLIC_AGENT_FACTORY_ADDRESS=0xB7c78ceCB25a1c40b3fa3382bAf3F34c9b5bdD66
NEXT_PUBLIC_MESH_VAULT_ADDRESS=0xBE2bcf983b84c030b0C851989aDF351816fA21D2
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=b24cd7ca0797f41ffb73796f43f1fbd7
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=c96d0c5727fb48b82f4bb0fe07b94717
```

Redeploy Vercel setelah isi env.

### Jika build Vercel gagal karena peer dependency (`wagmi` vs `rainbowkit`)

Repo ini sudah menyertakan:

- `.npmrc` dengan `legacy-peer-deps=true`
- `vercel.json` dengan `installCommand: npm install --legacy-peer-deps`

Pastikan Vercel tidak override install command di UI. Jika kamu set manual di UI, gunakan:

```bash
npm install --legacy-peer-deps
```

---

## 9) Health Check end-to-end

Dari laptop lokal:

```bash
curl -i https://api.meshforge.tech/api/activity
curl -i https://api.meshforge.tech/api/agents
curl -i https://api.meshforge.tech/api/metrics
curl -i https://api.meshforge.tech/api/trust-graph
curl -i https://api.meshforge.tech/api/x402/premium-content
```

Expected:
- endpoint normal: `200`
- endpoint x402 premium: `402 Payment Required` jika tanpa header `x-payment`

---

## 10) Deploy update berikutnya

Setiap ada update kode:

```bash
cd /var/www/meshforge-next
git pull
npm install --legacy-peer-deps
npm run build
pm2 restart meshforge-api
pm2 restart meshforge-indexer
pm2 status
```

---

## 11) Publish SDK (`@meshforge/sdk`)

Scaffold SDK sudah tersedia di `packages/sdk`.

Build lokal:

```bash
cd /var/www/meshforge-next/packages/sdk
npm install
npm run build
```

Publish:

```bash
npm login
npm publish --access public
```

---

## 12) Checklist judging infra

- Technical Innovation:
  - x402 payment-gated endpoint live
  - Intent orchestration SDK + event lifecycle
- Developer Experience:
  - FE consume API via `NEXT_PUBLIC_API_BASE_URL`
  - SDK package siap publish (`packages/sdk`)
- Security & Trust Minimization:
  - server-side key separation (`THIRDWEB_SECRET_KEY`)
  - CORS allowlist via `CORS_ALLOWED_ORIGINS`
  - PM2 managed services + HTTPS on API domain
- Real-World Applicability:
  - FE production di Vercel
  - BE production di VPS domain dedicated
  - Postgres + Redis + indexer running
