# Clawprint API - Quick Reference

**Base URL:** `http://localhost:3000/api`  
**Auth:** `Authorization: Bearer pk_xxx:sk_xxx`

---

## 🚀 Quick Start

```bash
# 1. Check connectivity
node scripts/check-api.js

# 2. Create a business
node scripts/create-business.js \
  --name "My Business LLC" \
  --sponsor sponsor@example.com

# 3. Check status
node scripts/check-status.js --business-id biz_xxx

# 4. Get financials
node scripts/get-financials.js --business-id biz_xxx --period month
```

---

## 📋 Endpoints (11 total)

### System (1)
- `GET /health` - Health check (no auth required)

### Agents (1)
- `POST /agents` - Register agent, get API key

### Sponsors (2)
- `POST /sponsors` - Get/create sponsor
- `GET /sponsors?email=xxx` - Get sponsor by email

### Businesses (7)
- `POST /businesses` - Create business
- `GET /businesses` - List all businesses
- `GET /businesses/:id` - Get business details
- `GET /businesses/:id/status` - Formation status
- `GET /businesses/:id/financials?period=xxx` - Financial summary
- `PATCH /businesses/:id` - Update business
- `DELETE /businesses/:id` - Dissolve business

---

## 💻 Common Commands

### Create Business
```bash
curl -X POST http://localhost:3000/api/businesses \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "legal_name": "Acme LLC",
    "sponsor_email": "sponsor@example.com",
    "type": "llc"
  }'
```

### Check Status
```bash
curl http://localhost:3000/api/businesses/biz_xxx/status \
  -H "Authorization: Bearer $API_KEY"
```

### Get Financials
```bash
curl "http://localhost:3000/api/businesses/biz_xxx/financials?period=month" \
  -H "Authorization: Bearer $API_KEY"
```

---

## 📊 Status Values

### Business Status
- `pending` - Awaiting formation
- `forming` - Formation in progress
- `active` - Fully operational
- `suspended` - Temporarily suspended
- `dissolved` - Permanently dissolved

### LLC Status
- `pending` - Not yet filed
- `filed` - Filed with state
- `rejected` - Filing rejected

### EIN Status
- `pending` - Not yet assigned
- `assigned` - EIN assigned
- `failed` - Application failed

### Bank Account Status
- `pending` - Not yet opened
- `active` - Account active
- `rejected` - Application rejected
- `closed` - Account closed

---

## 🔑 API Client (Node.js)

```javascript
const api = require('./lib/api-client');

// Health check
await api.health();

// Register agent
await api.agents.register('agent@example.com', 'My Agent');

// Create sponsor
await api.sponsors.getOrCreate({ email: 'sponsor@example.com' });

// Create business
const business = await api.businesses.create({
  legal_name: 'Test LLC',
  sponsor_email: 'sponsor@example.com',
});

// Get status
const status = await api.businesses.getStatus(business.business_id);

// Get financials
const financials = await api.businesses.getFinancials(
  business.business_id,
  'month' // week | month | year | all
);

// Update business
await api.businesses.update(business.business_id, {
  purpose: 'Updated purpose',
});

// Dissolve business
await api.businesses.dissolve(business.business_id);
```

---

## 🧪 Testing

```bash
# Run all integration tests
node scripts/test-api.js

# Run with cleanup
node scripts/test-api.js --cleanup

# Check API connectivity
node scripts/check-api.js
```

---

## ⚠️ Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad request (validation error)
- `401` - Unauthorized (missing/invalid API key)
- `404` - Not found
- `409` - Conflict (duplicate)
- `500` - Internal server error
- `503` - Service unavailable

---

## 🔧 Environment Setup

Create `.env`:
```bash
CLAWPRINT_API_URL=http://localhost:3000/api
CLAWPRINT_API_KEY=pk_xxx:sk_xxx
```

Get API key:
```bash
curl -X POST http://localhost:3000/api/agents \
  -H "Content-Type: application/json" \
  -d '{"email":"agent@example.com"}'
```

---

## 📚 Full Documentation

- **API Reference:** `references/api-reference.md`
- **Setup Guide:** `API-SETUP.md`
- **Database Schema:** `references/schema.md`
- **Skill Documentation:** `SKILL.md`

---

**Version:** 1.0.0  
**Last Updated:** February 26, 2026
