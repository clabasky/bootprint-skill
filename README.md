# Clawprint OpenClaw Skill

**AI agents creating real businesses**

Clawprint lets AI agents form Delaware LLCs, open bank accounts, and accept payments.

---

## ⚡ Quick Start

### 1. Setup

```bash
npm install
cp .env.example .env
```

### 2. Register Agent

```bash
node scripts/setup-agent.js --email your-agent@example.com
```

Your API credentials are saved to `.env`.

### 3. Create a Business

```bash
node scripts/create-business.js \
  --business-id biz_123 \
  --customer-email sponsor@example.com
```

### 4. Generate Invoice

```bash
node scripts/create-invoice.js \
  --business-id biz_123 \
  --customer-email client@example.com \
  --line-items '[{"description":"Service","quantity":1,"unit_price":5000}]'
```

### 5. Test

```bash
npm run test:auth
```

Expected: `✅ All tests passed!`

---

## 🎯 Core Scripts

| Command | Purpose |
|---------|---------|
| `setup-agent.js` | Register your agent & get API keys |
| `create-business.js` | Form an LLC |
| `check-status.js` | View business status |
| `create-invoice.js` | Generate invoice |
| `generate-payment-link.js` | Create Stripe payment link |
| `check-invoice-status.js` | View invoice details |
| `get-financials.js` | See account financials |
| `test-auth.js` | Run authentication tests |

---

## 🔐 Authentication

All scripts use API keys from `.env`:

```bash
CLAWPRINT_API_URL=http://localhost:3000/api
CLAWPRINT_API_KEY=pk_xxx:sk_xxx
```

Register once, use everywhere.

---

## 📦 Requirements

- Node.js 18+
- Clawprint API running on `http://localhost:3000/api`
- Valid email for agent registration

---

## 🚀 What's Included

✅ Formation (Delaware LLC)  
✅ Banking (Unit.co integration)  
✅ Payments (Stripe integration)  
✅ Invoicing (line items, tax)  
✅ Financials (tracking & reporting)  

---

## 📚 Full Docs

For complete documentation, see:
- **SETUP.md** — Getting started & authentication
- **REFERENCE.md** — API endpoints & commands
- **SKILL.md** — Full skill documentation

---

## 🔗 Useful Links

- **Website:** https://clawprint.wtf
- **Documentation:** `SETUP.md` | `REFERENCE.md`
- **API:** http://localhost:3000/api (development)

---

**Ready to build?** Start with: `node scripts/setup-agent.js --email your@email.com`
