# Clawprint Skill Authentication Setup

**Quick Start:** Register your agent and start using the API in minutes

---

## Step 1: Register Your Agent

Run the setup script to register your OpenClaw agent and get API credentials:

```bash
cd clawprint-skill
node scripts/setup-agent.js --email your-email@example.com --name "My Agent"
```

**Output:**
```
🔐 Clawprint Agent Setup

📡 Registering agent with Clawprint API...
   API: http://localhost:3000/api
   Email: your-email@example.com
   Name: My Agent

✅ Agent registered successfully!

📋 API Credentials:
   Public Key: pk_abc123xyz...
   Secret Key: sk_def456uvw...

💾 Credentials saved to: .env
   CLAWPRINT_API_KEY=pk_abc123xyz...:sk_def456uvw...
   CLAWPRINT_API_URL=http://localhost:3000/api

⚠️  Keep your secret key safe!
   Do not commit .env to version control.
   Do not share your secret key.

🚀 You can now use the Clawprint API client:
   const api = require('./lib/api-client');
```

---

## Step 2: Verify Setup

Check that `.env` was created with your credentials:

```bash
cat .env
```

Should show:
```
CLAWPRINT_API_URL=http://localhost:3000/api
CLAWPRINT_API_KEY=pk_xxx:sk_xxx
```

✅ You're ready to use the API!

---

## Step 3: Use the API

### Via CLI Scripts

All scripts automatically load credentials from `.env`:

```bash
# Create a business
node scripts/create-business.js \
  --business-id biz_abc123 \
  --customer-email client@example.com \
  --customer-name "John Smith"

# Create an invoice
node scripts/create-invoice.js \
  --business-id biz_abc123 \
  --customer-email invoice@example.com \
  --line-items '[{"description":"Service","quantity":1,"unit_price":5000}]'

# Generate payment link
node scripts/generate-payment-link.js --invoice-id inv_xyz789

# Check invoice status
node scripts/check-invoice-status.js --invoice-id inv_xyz789
```

### Via JavaScript

```javascript
const api = require('./lib/api-client');

// Credentials automatically loaded from .env
const business = await api.businesses.create({
  legal_name: 'My Business LLC',
  sponsor_email: 'sponsor@example.com'
});

console.log(`Created: ${business.business_id}`);
```

### Via cURL

```bash
# Get API key from .env
API_KEY=$(grep CLAWPRINT_API_KEY .env | cut -d'=' -f2)

# Make authenticated request
curl http://localhost:3000/api/businesses \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json"
```

---

## Security: Protect Your .env

### ✅ DO:

1. **Keep .env out of version control**
   ```bash
   # Already in .gitignore
   echo ".env" >> .gitignore
   ```

2. **Restrict file permissions**
   ```bash
   chmod 600 .env
   ```

3. **Never share your secret key**
   - Don't email it
   - Don't paste it in chat
   - Don't commit it to git

4. **Store safely in production**
   - Use environment variables
   - Use AWS Secrets Manager
   - Use Vault or similar

### ❌ DON'T:

- Commit `.env` to version control
- Share credentials via email
- Log your secret key
- Hardcode credentials in source
- Use same key across environments

---

## Troubleshooting

### "API key not found"

**Problem:** The API key is invalid or not registered

**Solution:**
1. Check `.env` exists: `cat .env`
2. Verify API is running: `curl http://localhost:3000/api/health`
3. Re-register: `node scripts/setup-agent.js --email your-email@example.com`

### "Missing Authorization header"

**Problem:** .env is not being loaded

**Solution:**
```bash
# Check .env is in correct location
ls -la .env

# Check env var is loaded
node -e "require('dotenv').config(); console.log(process.env.CLAWPRINT_API_KEY)"
```

### "Request timeout"

**Problem:** API server is not responding

**Solution:**
1. Check API is running: `cd clawprint-app && npm run dev`
2. Check API URL in .env: `cat .env | grep API_URL`
3. Verify network connectivity: `curl http://localhost:3000/api/health`

### Forgot Secret Key

**Problem:** Cannot access credentials (they're only shown once)

**Solution:** Register a new agent
```bash
node scripts/setup-agent.js --email different-email@example.com
```

---

## Multiple Agents

To use multiple agent credentials:

### Option 1: Environment Variables

```bash
# .env
CLAWPRINT_API_KEY=pk_first:sk_first
```

```bash
# Override on command line
CLAWPRINT_API_KEY="pk_second:sk_second" node scripts/create-business.js ...
```

### Option 2: Separate .env Files

```bash
# Register multiple times
node scripts/setup-agent.js --email agent1@example.com  # Creates .env
node scripts/setup-agent.js --email agent2@example.com  # Updates .env

# Each time, copy the .env to a backup before registering again
cp .env .env.agent1
cp .env .env.agent2
```

### Option 3: Node.js API Client

```javascript
const { ClawprintAPIClient } = require('./lib/api-client');

const client1 = new ClawprintAPIClient({
  baseUrl: 'http://localhost:3000/api',
  apiKey: process.env.AGENT1_API_KEY
});

const client2 = new ClawprintAPIClient({
  baseUrl: 'http://localhost:3000/api',
  apiKey: process.env.AGENT2_API_KEY
});

const business1 = await client1.businesses.create({ ... });
const business2 = await client2.businesses.create({ ... });
```

---

## Key Rotation

When you need to rotate your API key:

1. **Register new agent**
   ```bash
   node scripts/setup-agent.js --email your-email+v2@example.com
   ```

2. **Update .env** with new credentials
   ```
   CLAWPRINT_API_KEY=pk_new:sk_new
   ```

3. **Test with new key**
   ```bash
   curl http://localhost:3000/api/businesses \
     -H "Authorization: Bearer $(grep CLAWPRINT_API_KEY .env | cut -d'=' -f2)"
   ```

4. **Old key stops working** immediately

---

## API Configuration

### Default Settings

```bash
# .env defaults
CLAWPRINT_API_URL=http://localhost:3000/api
CLAWPRINT_API_KEY=pk_xxx:sk_xxx
```

### Override Settings

```bash
# Via environment variables
export CLAWPRINT_API_URL=https://api.clawprint.ai/v1
export CLAWPRINT_API_KEY=your-api-key

# Via API client options
const api = new ClawprintAPIClient({
  baseUrl: 'https://api.clawprint.ai/v1',
  apiKey: 'pk_xxx:sk_xxx'
});
```

---

## Available Scripts

### Agent Setup
```bash
node scripts/setup-agent.js --email <email> [--name <name>]
```

### Business Management
```bash
node scripts/create-business.js --business-id <id> --customer-email <email>
node scripts/check-status.js --business-id <id>
node scripts/get-financials.js --business-id <id> [--period month]
```

### Invoice Management
```bash
node scripts/create-invoice.js --business-id <id> --customer-email <email> --line-items <json>
node scripts/generate-payment-link.js --invoice-id <id>
node scripts/check-invoice-status.js --invoice-id <id>
```

---

## Testing Your Setup

### Quick Test

```bash
# Check API connectivity
curl http://localhost:3000/api/health

# Test authentication
API_KEY=$(grep CLAWPRINT_API_KEY .env | cut -d'=' -f2)
curl http://localhost:3000/api/businesses \
  -H "Authorization: Bearer $API_KEY"

# Should return a list (possibly empty)
```

### Full Workflow Test

```bash
# 1. Create a business
node scripts/create-business.js \
  --business-id biz_test \
  --customer-email test@example.com

# 2. Create an invoice
node scripts/create-invoice.js \
  --business-id biz_test \
  --customer-email invoice@example.com \
  --line-items '[{"description":"Test","quantity":1,"unit_price":100}]'

# 3. Generate payment link
node scripts/generate-payment-link.js --invoice-id inv_test

# 4. Check status
node scripts/check-invoice-status.js --invoice-id inv_test
```

---

## Production Deployment

### Environment Setup

```bash
# Production .env (use secrets manager, not files)
export CLAWPRINT_API_URL="https://api.clawprint.ai/v1"
export CLAWPRINT_API_KEY="pk_prod_xxx:sk_prod_xxx"
```

### Using AWS Secrets Manager

```bash
# Store secret
aws secretsmanager create-secret --name clawprint-api-key \
  --secret-string '{"api_key":"pk_xxx:sk_xxx","api_url":"https://api.clawprint.ai/v1"}'

# Retrieve in code
const secret = await secretsManager.getSecretValue({
  SecretId: 'clawprint-api-key'
});
const config = JSON.parse(secret.SecretString);
```

### Using Docker

```dockerfile
FROM node:18

WORKDIR /app
COPY . .
RUN npm install

# API credentials from environment
ENV CLAWPRINT_API_URL=https://api.clawprint.ai/v1
ENV CLAWPRINT_API_KEY=<secret>

CMD ["node", "scripts/create-business.js"]
```

---

## Reference

- **Full API Docs:** `references/api-reference.md`
- **Invoice API:** `references/invoice-api.md`
- **Authentication Details:** `../clawprint-app/docs/AUTHENTICATION.md`
- **Setup Guide:** `API-SETUP.md`

---

**Last Updated:** February 27, 2026  
**Status:** Ready for Production
