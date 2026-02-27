# API Reference

**Quick reference for all endpoints and operations**

---

## Business Operations

### Create Business

```bash
node scripts/create-business.js \
  --business-id biz_123 \
  --customer-email sponsor@example.com \
  --customer-name "Sponsor Name"
```

**Via API:**
```bash
curl -X POST http://localhost:3000/api/businesses \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "legal_name": "My Business LLC",
    "sponsor_email": "sponsor@example.com"
  }'
```

### Get Business

```bash
node scripts/check-status.js --business-id biz_123
```

**Via API:**
```bash
curl http://localhost:3000/api/businesses/biz_123 \
  -H "Authorization: Bearer $API_KEY"
```

### Get Financials

```bash
node scripts/get-financials.js --business-id biz_123 --period month
```

**Periods:** `week`, `month`, `year`, `all`

---

## Invoice Operations

### Create Invoice

```bash
node scripts/create-invoice.js \
  --business-id biz_123 \
  --customer-email client@example.com \
  --line-items '[
    {"description":"Service","quantity":1,"unit_price":5000,"tax_rate":10},
    {"description":"Fee","quantity":1,"unit_price":500}
  ]'
```

**Via API:**
```bash
curl -X POST http://localhost:3000/api/invoices \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "business_id": "biz_123",
    "customer_email": "client@example.com",
    "customer_name": "Client Name",
    "line_items": [
      {"description":"Service","quantity":1,"unit_price":5000}
    ]
  }'
```

### Generate Payment Link

```bash
node scripts/generate-payment-link.js --invoice-id inv_123
```

Returns shareable Stripe payment link.

### Check Invoice Status

```bash
node scripts/check-invoice-status.js --invoice-id inv_123
```

---

## Testing

### Test Authentication

```bash
npm run test:auth
```

Runs 24 comprehensive tests validating:
- Agent registration
- API key generation
- Bearer token validation
- Endpoint protection
- Full workflows

### Run All Tests

```bash
npm run test:all
```

---

## Environment Variables

```bash
# Required
CLAWPRINT_API_URL=http://localhost:3000/api
CLAWPRINT_API_KEY=pk_xxx:sk_xxx

# Optional (defaults shown)
CLAWPRINT_API_URL=http://localhost:3000/api
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success (GET, PATCH) |
| 201 | Created (POST) |
| 400 | Bad request (validation error) |
| 401 | Unauthorized (missing/invalid API key) |
| 404 | Not found |
| 409 | Conflict (duplicate email, etc.) |
| 500 | Server error |

---

## Error Response Format

```json
{
  "error": "Descriptive error message"
}
```

---

## Data Types

### Business Status
`pending` | `forming` | `active` | `suspended` | `dissolved`

### Invoice Status
`draft` | `sent` | `viewed` | `paid` | `overdue` | `cancelled` | `refunded`

### Line Item Type
`service` | `product` | `fee` | `other`

### Currency
`USD` | `EUR` | `GBP` | `CAD` | `AUD`

---

## Rate Limiting

Default: 100 requests/minute per API key

Response headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1708114800
```

---

## Tips

- All scripts use credentials from `.env` automatically
- Line items support custom tax rates
- Invoices accept multiple line items
- Payment links valid for 90 days
- Requests are logged for audit trail

---

## Full Documentation

- **SETUP.md** — Getting started
- **README.md** — Overview & features
- **SKILL.md** — Complete skill documentation

---

**API Base:** `http://localhost:3000/api` (development)

More endpoints and details in the backend API documentation.
