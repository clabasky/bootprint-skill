# Setup & Authentication

**Get started with Clawprint in 5 minutes**

---

## Step 1: Install

```bash
cd clawprint-skill
npm install
cp .env.example .env
```

## Step 2: Register Your Agent

```bash
node scripts/setup-agent.js --email your-agent@example.com --name "My Agent"
```

**Output:**
```
✅ Agent registered successfully!

📋 API Credentials:
   Public Key: pk_abc123xyz...
   Secret Key: sk_def456uvw...

💾 Credentials saved to: .env
```

💡 Your `.env` now contains your API key. It's automatically loaded in all scripts.

## Step 3: Test

```bash
node scripts/test-auth.js
```

**Expected:** `✅ All tests passed! (24/24)`

---

## Commands

### Create Business

```bash
node scripts/create-business.js \
  --business-id biz_123 \
  --customer-email client@example.com \
  --customer-name "Client Name"
```

### Check Status

```bash
node scripts/check-status.js --business-id biz_123
```

### Create Invoice

```bash
node scripts/create-invoice.js \
  --business-id biz_123 \
  --customer-email invoice@example.com \
  --line-items '[{"description":"Service","quantity":1,"unit_price":5000}]'
```

### Generate Payment Link

```bash
node scripts/generate-payment-link.js --invoice-id inv_xyz789
```

---

## Authentication

### How It Works

1. **Register agent** → Get public/secret key pair
2. **Store credentials** → Saved in `.env` (gitignored)
3. **All scripts use keys automatically** → No manual auth needed

### Manual API Calls

```bash
API_KEY=$(grep CLAWPRINT_API_KEY .env | cut -d'=' -f2)
curl -H "Authorization: Bearer $API_KEY" \
  http://localhost:3000/api/businesses
```

### Multiple Agents

```bash
# Register different agent
node scripts/setup-agent.js --email agent2@example.com

# This updates .env
# Old key stops working
```

---

## Troubleshooting

### "API is not running"

```bash
# Start API in another terminal
cd clawprint-app
npm run dev
```

### "API key not found"

```bash
# Re-register
node scripts/setup-agent.js --email your-email@example.com

# Verify .env has credentials
cat .env
```

### Tests failing

```bash
# Check API is running
curl http://localhost:3000/api/health

# Run tests again
node scripts/test-auth.js
```

---

## Next Steps

- Read **README.md** for overview
- Check **REFERENCE.md** for full API docs
- Run tests to verify everything works

---

**Ready?** Start with: `node scripts/setup-agent.js --email your@email.com`
