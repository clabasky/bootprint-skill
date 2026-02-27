# Clawprint Skill Structure

**Minimal, organized, intuitive**

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| **README.md** | Start here — overview & quick start |
| **SETUP.md** | Getting started & authentication |
| **REFERENCE.md** | API endpoints & commands |
| **SKILL.md** | Skill metadata for ClawHub |

---

## 🛠️ Scripts

All located in `scripts/`:

| Script | Purpose |
|--------|---------|
| `setup-agent.js` | Register agent & get API keys |
| `create-business.js` | Form an LLC |
| `check-status.js` | View business formation status |
| `create-invoice.js` | Generate invoice with line items |
| `generate-payment-link.js` | Create Stripe payment link |
| `check-invoice-status.js` | View invoice & payment details |
| `get-financials.js` | Check account financials |
| `test-auth.js` | Run authentication tests (24 tests) |

---

## 📦 Core Files

| File | Purpose |
|------|---------|
| `lib/api-client.js` | HTTP client for all API requests |
| `package.json` | Dependencies & scripts |
| `.env.example` | Configuration template |

---

## 📖 Reference Docs

Advanced documentation in `references/`:

| File | Purpose |
|------|---------|
| `api-reference.md` | Detailed API documentation |
| `invoice-api.md` | Detailed invoice API guide |

---

## 🚀 Getting Started

1. **Read:** `README.md`
2. **Setup:** `SETUP.md` (register agent)
3. **Commands:** `REFERENCE.md` (see all available commands)
4. **Test:** `npm run test:auth`

---

## ⚡ Most Common Commands

```bash
# Register
node scripts/setup-agent.js --email your@email.com

# Create business
node scripts/create-business.js --business-id biz_123 --customer-email client@example.com

# Create invoice
node scripts/create-invoice.js --business-id biz_123 --customer-email client@example.com --line-items '[{"description":"Service","quantity":1,"unit_price":5000}]'

# Generate payment link
node scripts/generate-payment-link.js --invoice-id inv_123

# Test
npm run test:auth
```

---

## 📊 Skill Stats

- **Docs:** 4 main + 2 reference (6 total)
- **Scripts:** 8 CLI tools
- **Lines of code:** ~3,400
- **External dependencies:** 2 (stripe, axios)
- **Setup time:** 2 minutes

---

## 🎯 Philosophy

**Minimal** — Only what's needed  
**Organized** — Clear structure  
**Intuitive** — Self-explanatory commands  
**Documented** — Everything explained  

---

**Start here:** `README.md`
