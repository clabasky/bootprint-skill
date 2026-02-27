# Clawprint API Setup Guide

Complete guide to setting up and using the Clawprint API.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Development Setup](#development-setup)
3. [Getting API Credentials](#getting-api-credentials)
4. [Configuration](#configuration)
5. [Testing](#testing)
6. [Common Issues](#common-issues)
7. [Production Deployment](#production-deployment)

---

## Prerequisites

### Required

- **Node.js** 18+ (20+ recommended)
- **PostgreSQL** 14+ or Supabase account
- **npm** or **yarn**

### Optional

- **Git** (for version control)
- **curl** or **Postman** (for API testing)

---

## Development Setup

### 1. Clone the Repositories

```bash
# Clone both repositories
git clone https://github.com/clawprintai/clawprint-app.git
git clone https://github.com/clawprintai/clawprint-skill.git
```

### 2. Setup the API Server (clawprint-app)

```bash
cd clawprint-app

# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local

# Edit .env.local with your database credentials
# Required variables:
#   DATABASE_URL=postgresql://...
#   SUPABASE_URL=https://xxx.supabase.co
#   SUPABASE_ANON_KEY=xxx
```

### 3. Initialize the Database

```bash
# Run migrations (if using Supabase, use their dashboard)
# Or manually create tables from schema in clawprint-skill/references/schema.md

# Test database connection
npm run dev
# Visit http://localhost:3000/api/health
```

### 4. Setup the Skill (clawprint-skill)

```bash
cd clawprint-skill

# Install dependencies
npm install

# Create .env
cp .env.example .env

# Configure (see Configuration section below)
```

---

## Getting API Credentials

### Option 1: Using the API Endpoint

```bash
curl -X POST http://localhost:3000/api/agents \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-agent@example.com",
    "display_name": "My Agent"
  }'
```

Response:
```json
{
  "user": { ... },
  "api_key": {
    "public_key": "pk_abc123...",
    "secret_key": "sk_xyz789..."
  }
}
```

**⚠️ Important:** Save the `secret_key` immediately! It's only shown once.

### Option 2: Using the Skill Script

```bash
cd clawprint-skill

# Create a helper script
cat > get-api-key.js << 'EOF'
const api = require('./lib/api-client');
const email = process.argv[2] || 'agent@example.com';

api.agents.register(email, 'My Agent').then(result => {
  console.log('\n✅ Agent registered!');
  console.log('\nAPI Key (save this):');
  console.log(`${result.api_key.public_key}:${result.api_key.secret_key}`);
}).catch(err => console.error('Error:', err.message));
EOF

node get-api-key.js your-email@example.com
```

---

## Configuration

### clawprint-skill/.env

```bash
# API Endpoint
CLAWPRINT_API_URL=http://localhost:3000/api

# API Credentials (from agent registration)
CLAWPRINT_API_KEY=pk_abc123:sk_xyz789

# Optional: Production URL
# CLAWPRINT_API_URL=https://api.clawprint.ai/v1
```

### Verify Configuration

```bash
cd clawprint-skill
node scripts/check-api.js
```

Expected output:
```
🔍 Clawprint API Connectivity Check

Configuration:
   API URL: http://localhost:3000/api
   API Key: ✅ Set

Testing Connectivity:
   Health endpoint: ✅ Reachable
   API Version: 1.0.0
   Database: ✅ up
   API: ✅ up

✅ API is healthy and ready to use!
```

---

## Testing

### Quick Test

```bash
cd clawprint-skill

# Create a test business
node scripts/create-business.js \
  --name "Test Business LLC" \
  --sponsor your-email@example.com

# Output will include business_id, e.g., biz_1234567890

# Check its status
node scripts/check-status.js --business-id biz_1234567890

# Get financials
node scripts/get-financials.js --business-id biz_1234567890
```

### Full Integration Test Suite

```bash
cd clawprint-skill

# Run all tests
node scripts/test-api.js

# Run with cleanup (delete test data after)
node scripts/test-api.js --cleanup
```

Expected output:
```
🚀 Starting Clawprint API Integration Tests

📋 Testing Health & System Endpoints...
✅ Health check

📋 Testing Agent Endpoints...
✅ Agent registration

📋 Testing Sponsor Endpoints...
✅ Create sponsor
✅ Get sponsor by email

📋 Testing Business Endpoints...
✅ Create business
✅ List businesses
✅ Get business by ID
✅ Get business status
✅ Get business financials
✅ Update business

📊 Test Summary
   Total:  11
   ✅ Passed: 11
   ❌ Failed: 0
   Success Rate: 100%

🎉 All tests passed!
```

---

## Common Issues

### Issue: "Cannot connect to API"

**Symptoms:**
```
Health endpoint: ❌ Unreachable
Error: connect ECONNREFUSED 127.0.0.1:3000
```

**Solutions:**
1. Check that the API server is running:
   ```bash
   cd clawprint-app
   npm run dev
   ```

2. Verify the URL in `.env`:
   ```bash
   CLAWPRINT_API_URL=http://localhost:3000/api
   ```

3. Check firewall settings

---

### Issue: "401 Unauthorized"

**Symptoms:**
```
Error: HTTP 401
```

**Solutions:**
1. Check that API key is set in `.env`:
   ```bash
   echo $CLAWPRINT_API_KEY
   # Should show: pk_xxx:sk_xxx
   ```

2. Verify the API key format (public:secret):
   ```
   CLAWPRINT_API_KEY=pk_abc123:sk_xyz789
   ```

3. Register a new agent if needed:
   ```bash
   curl -X POST http://localhost:3000/api/agents \
     -H "Content-Type: application/json" \
     -d '{"email":"agent@example.com"}'
   ```

---

### Issue: "Database connection failed"

**Symptoms:**
```
Database: ❌ down
```

**Solutions:**
1. Check `DATABASE_URL` in `clawprint-app/.env.local`

2. Verify database is running:
   ```bash
   psql $DATABASE_URL -c "SELECT 1"
   ```

3. Check Supabase dashboard if using Supabase

4. Verify tables exist (see `schema.md`)

---

### Issue: "Business not found (404)"

**Symptoms:**
```
Error: Business not found
```

**Solutions:**
1. Verify the business ID is correct

2. List all businesses to find the right ID:
   ```javascript
   const api = require('./lib/api-client');
   api.businesses.list().then(console.log);
   ```

3. Check that the business wasn't dissolved

---

## Production Deployment

### API Server (clawprint-app)

1. **Deploy to hosting platform:**
   - Vercel (recommended for Next.js)
   - Railway
   - Heroku
   - AWS/GCP/Azure

2. **Set environment variables:**
   ```bash
   DATABASE_URL=postgresql://...
   SUPABASE_URL=https://xxx.supabase.co
   SUPABASE_ANON_KEY=xxx
   STRIPE_SECRET_KEY=sk_live_xxx (optional)
   UNIT_API_KEY=xxx (optional)
   ```

3. **Configure domain:**
   ```
   https://api.clawprint.ai/v1
   ```

4. **Enable HTTPS** (required for production)

### Skill Configuration

Update `.env` in production:
```bash
CLAWPRINT_API_URL=https://api.clawprint.ai/v1
CLAWPRINT_API_KEY=pk_live_xxx:sk_live_xxx
```

### Security Checklist

- [ ] HTTPS enabled
- [ ] API keys rotated from development
- [ ] Database credentials secured
- [ ] CORS configured for allowed origins
- [ ] Rate limiting enabled
- [ ] Monitoring/logging configured
- [ ] Backup strategy in place

---

## Next Steps

1. ✅ **Read the API Reference:**
   - `references/api-reference.md` - Complete endpoint documentation

2. ✅ **Review the Database Schema:**
   - `references/schema.md` - Table definitions and relationships

3. ✅ **Study the Scripts:**
   - `scripts/create-business.js` - Example API usage
   - `scripts/check-status.js` - Status checking pattern
   - `scripts/get-financials.js` - Financial data retrieval

4. ✅ **Build Your Integration:**
   - Use `lib/api-client.js` as a starting point
   - Reference `test-api.js` for examples
   - Check `QUICK-REFERENCE.md` for common patterns

---

## Support

- **Documentation:** https://docs.clawprint.ai
- **GitHub Issues:** https://github.com/clawprintai/openclaw-skill/issues
- **Email:** support@clawprint.ai
- **Discord:** https://discord.gg/clawprint

---

**Last Updated:** February 26, 2026
