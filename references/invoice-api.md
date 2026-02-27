# Invoice API Reference

**Complete invoice management API with Stripe payment link integration**

---

## Overview

The Invoice API enables full-lifecycle invoice management for Clawprint businesses, including creation, status tracking, and payment collection through Stripe payment links.

### Key Capabilities

- ✅ Create invoices with multiple line items
- ✅ Custom tax rates per line item
- ✅ Automatic invoice number generation
- ✅ Generate Stripe payment links for payment collection
- ✅ Track payment status and payment dates
- ✅ Filter and list invoices by status or date
- ✅ Support for multiple currencies (USD, EUR, GBP, CAD, AUD)

---

## Data Model

### Invoice

```typescript
{
  invoice_id: string;              // Unique invoice ID (inv_xxx)
  business_id: string;             // Associated business
  invoice_number: string;          // Human-readable number (e.g., INV-2024-001)
  customer_email: string;          // Customer email (required)
  customer_name?: string;          // Optional customer name
  status: InvoiceStatus;           // draft|sent|viewed|paid|overdue|cancelled|refunded
  amount: number;                  // Subtotal (before tax)
  tax_amount: number;              // Calculated tax
  total_amount: number;            // amount + tax_amount
  currency: CurrencyCode;          // USD|EUR|GBP|CAD|AUD
  issued_date: string;             // ISO 8601 date
  due_date: string;                // ISO 8601 date
  notes?: string;                  // Optional notes for customer
  payment_terms?: string;          // e.g., "Net 30", "Due on receipt"
  
  // Stripe Integration
  stripe_payment_link?: string;    // Shareable payment link
  stripe_invoice_id?: string;      // Stripe-generated invoice ID
  
  // Tracking
  paid_at?: string;                // When payment was received
  viewed_at?: string;              // When customer viewed invoice
  
  // Relations
  line_items?: InvoiceLineItem[];
  
  // Timestamps
  created_at: string;
  updated_at: string;
}
```

### InvoiceLineItem

```typescript
{
  line_item_id: string;            // Unique line item ID
  invoice_id: string;              // Parent invoice ID
  description: string;             // Service/product name
  quantity: number;                // How many units
  unit_price: number;              // Price per unit (in cents for USD)
  type: LineItemType;              // service|product|fee|other
  tax_rate?: number;               // Tax percentage (0-100)
  created_at: string;
}
```

### Status Values

```
draft    - Invoice created, not yet sent to customer
sent     - Invoice sent to customer
viewed   - Customer has viewed the invoice
paid     - Payment received
overdue  - Due date passed, payment not received
cancelled- Invoice was cancelled
refunded - Payment was refunded
```

---

## Endpoints

### 1. Create Invoice

**POST** `/api/invoices`

Create a new invoice with line items.

#### Request

```bash
curl -X POST http://localhost:3000/api/invoices \
  -H "Authorization: Bearer pk_xxx:sk_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "business_id": "biz_abc123",
    "customer_email": "client@example.com",
    "customer_name": "John Smith",
    "invoice_number": "INV-2024-001",
    "issued_date": "2024-02-15",
    "due_date": "2024-03-15",
    "currency": "USD",
    "notes": "Thank you for your business!",
    "payment_terms": "Net 30",
    "line_items": [
      {
        "description": "Website Development",
        "quantity": 1,
        "unit_price": 5000,
        "type": "service",
        "tax_rate": 10
      },
      {
        "description": "Hosting Setup",
        "quantity": 1,
        "unit_price": 500,
        "type": "fee",
        "tax_rate": 0
      }
    ]
  }'
```

#### Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `business_id` | string | Yes | Business ID from `/api/businesses` |
| `customer_email` | string | Yes | Customer email address |
| `customer_name` | string | No | Customer name |
| `invoice_number` | string | No | Custom invoice number (auto-generated if omitted) |
| `issued_date` | string | No | Issue date (ISO 8601, defaults to today) |
| `due_date` | string | No | Due date (ISO 8601, defaults to 30 days from issue) |
| `currency` | string | No | Currency code (defaults to USD) |
| `notes` | string | No | Notes for customer |
| `payment_terms` | string | No | Payment terms description |
| `line_items` | array | Yes | Array of line items (must have at least 1) |

#### Line Item Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `description` | string | Yes | Item description |
| `quantity` | number | Yes | Quantity (must be > 0) |
| `unit_price` | number | Yes | Price per unit |
| `type` | string | No | Type: service, product, fee, other |
| `tax_rate` | number | No | Tax percentage (0-100) |

#### Response (201 Created)

```json
{
  "invoice_id": "inv_xyz789",
  "business_id": "biz_abc123",
  "invoice_number": "INV-2024-001",
  "customer_email": "client@example.com",
  "customer_name": "John Smith",
  "status": "draft",
  "amount": 5500,
  "tax_amount": 550,
  "total_amount": 6050,
  "currency": "USD",
  "issued_date": "2024-02-15T00:00:00Z",
  "due_date": "2024-03-15T00:00:00Z",
  "notes": "Thank you for your business!",
  "payment_terms": "Net 30",
  "line_items": [
    {
      "line_item_id": "li_001",
      "invoice_id": "inv_xyz789",
      "description": "Website Development",
      "quantity": 1,
      "unit_price": 5000,
      "type": "service",
      "tax_rate": 10,
      "created_at": "2024-02-15T10:00:00Z"
    },
    {
      "line_item_id": "li_002",
      "invoice_id": "inv_xyz789",
      "description": "Hosting Setup",
      "quantity": 1,
      "unit_price": 500,
      "type": "fee",
      "tax_rate": 0,
      "created_at": "2024-02-15T10:00:00Z"
    }
  ],
  "created_at": "2024-02-15T10:00:00Z",
  "updated_at": "2024-02-15T10:00:00Z"
}
```

#### Error Responses

```
400 Bad Request - Missing required fields or invalid data
401 Unauthorized - Missing/invalid authentication
500 Internal Server Error - Server error
```

---

### 2. List Invoices

**GET** `/api/invoices`

List invoices for a specific business.

#### Request

```bash
curl http://localhost:3000/api/invoices?business_id=biz_abc123&status=sent&limit=20 \
  -H "Authorization: Bearer pk_xxx:sk_xxx"
```

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `business_id` | string | Yes | Business ID to filter by |
| `status` | string | No | Filter by status (draft, sent, paid, etc.) |
| `limit` | number | No | Max results (1-100, default 50) |

#### Response (200 OK)

```json
{
  "invoices": [
    {
      "invoice_id": "inv_xyz789",
      "business_id": "biz_abc123",
      "invoice_number": "INV-2024-001",
      "customer_email": "client@example.com",
      "status": "sent",
      "amount": 5500,
      "tax_amount": 550,
      "total_amount": 6050,
      "currency": "USD",
      "issued_date": "2024-02-15T00:00:00Z",
      "due_date": "2024-03-15T00:00:00Z",
      "created_at": "2024-02-15T10:00:00Z",
      "updated_at": "2024-02-15T10:00:00Z"
    }
  ],
  "count": 1,
  "business_id": "biz_abc123",
  "filter": {
    "status": "sent",
    "limit": 20
  }
}
```

---

### 3. Get Invoice

**GET** `/api/invoices/:id`

Get a single invoice with all line items.

#### Request

```bash
curl http://localhost:3000/api/invoices/inv_xyz789 \
  -H "Authorization: Bearer pk_xxx:sk_xxx"
```

#### Response (200 OK)

```json
{
  "invoice_id": "inv_xyz789",
  "business_id": "biz_abc123",
  "invoice_number": "INV-2024-001",
  "customer_email": "client@example.com",
  "customer_name": "John Smith",
  "status": "sent",
  "amount": 5500,
  "tax_amount": 550,
  "total_amount": 6050,
  "currency": "USD",
  "issued_date": "2024-02-15T00:00:00Z",
  "due_date": "2024-03-15T00:00:00Z",
  "notes": "Thank you for your business!",
  "payment_terms": "Net 30",
  "stripe_payment_link": "https://buy.stripe.com/test_abc123",
  "stripe_invoice_id": "in_stripe_id_123",
  "line_items": [
    {
      "line_item_id": "li_001",
      "invoice_id": "inv_xyz789",
      "description": "Website Development",
      "quantity": 1,
      "unit_price": 5000,
      "type": "service",
      "tax_rate": 10,
      "created_at": "2024-02-15T10:00:00Z"
    }
  ],
  "created_at": "2024-02-15T10:00:00Z",
  "updated_at": "2024-02-15T10:00:00Z"
}
```

#### Error Responses

```
401 Unauthorized - Missing/invalid authentication
404 Not Found - Invoice not found
500 Internal Server Error - Server error
```

---

### 4. Update Invoice

**PATCH** `/api/invoices/:id`

Update invoice details (before payment).

#### Request

```bash
curl -X PATCH http://localhost:3000/api/invoices/inv_xyz789 \
  -H "Authorization: Bearer pk_xxx:sk_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_email": "newemail@example.com",
    "customer_name": "Jane Smith",
    "due_date": "2024-04-15",
    "notes": "Updated notes",
    "payment_terms": "Net 45"
  }'
```

#### Parameters

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Update status (draft, sent, paid, etc.) |
| `customer_email` | string | New customer email |
| `customer_name` | string | New customer name |
| `due_date` | string | New due date |
| `notes` | string | Updated notes |
| `payment_terms` | string | Updated payment terms |

#### Response (200 OK)

Returns updated invoice object.

---

### 5. Delete/Cancel Invoice

**DELETE** `/api/invoices/:id`

Cancel an invoice (soft delete - marks as cancelled).

#### Request

```bash
curl -X DELETE http://localhost:3000/api/invoices/inv_xyz789 \
  -H "Authorization: Bearer pk_xxx:sk_xxx"
```

#### Response (200 OK)

```json
{
  "message": "Invoice cancelled successfully",
  "invoice_id": "inv_xyz789"
}
```

---

### 6. Generate Stripe Payment Link

**POST** `/api/invoices/:id/payment-link`

Generate a shareable Stripe payment link for invoice payment.

#### Request

```bash
curl -X POST http://localhost:3000/api/invoices/inv_xyz789/payment-link \
  -H "Authorization: Bearer pk_xxx:sk_xxx"
```

#### Response (201 Created)

```json
{
  "payment_link_url": "https://buy.stripe.com/test_abc123xyz",
  "stripe_invoice_id": "in_stripe_invoice_id_123",
  "expires_at": "2024-05-15T10:00:00Z"
}
```

The customer can now click `payment_link_url` to pay the invoice. Stripe handles payment processing, and status updates are automatically reflected in the invoice.

#### Error Responses

```
401 Unauthorized - Missing/invalid authentication
404 Not Found - Invoice not found
409 Conflict - Payment link already exists for this invoice
500 Internal Server Error - Stripe API error or configuration issue
```

---

### 7. Get Payment Link

**GET** `/api/invoices/:id/payment-link`

Retrieve existing payment link for an invoice.

#### Request

```bash
curl http://localhost:3000/api/invoices/inv_xyz789/payment-link \
  -H "Authorization: Bearer pk_xxx:sk_xxx"
```

#### Response (200 OK)

```json
{
  "payment_link_url": "https://buy.stripe.com/test_abc123xyz",
  "stripe_invoice_id": "in_stripe_invoice_id_123",
  "expires_at": "2024-05-15T10:00:00Z"
}
```

---

## Invoice Workflow Example

### Step 1: Create Invoice

```javascript
const invoice = await api.invoices.create({
  business_id: 'biz_abc123',
  customer_email: 'client@example.com',
  customer_name: 'John Smith',
  line_items: [
    {
      description: 'Consulting Services',
      quantity: 10,
      unit_price: 500,
      type: 'service',
      tax_rate: 10
    }
  ]
});
// Status: draft
```

### Step 2: Generate Payment Link

```javascript
const paymentLink = await api.invoices.generatePaymentLink(invoice.invoice_id);
// Status: sent
// Send payment_link_url to customer
```

### Step 3: Customer Pays

Customer clicks link and pays via Stripe. Stripe webhook should update invoice status to `paid`.

### Step 4: Get Final Status

```javascript
const updatedInvoice = await api.invoices.get(invoice.invoice_id);
// Status: paid
// paid_at: "2024-02-16T15:30:00Z"
```

---

## Currency Support

Supported currencies:

| Code | Currency |
|------|----------|
| USD | US Dollar |
| EUR | Euro |
| GBP | British Pound |
| CAD | Canadian Dollar |
| AUD | Australian Dollar |

---

## Tax Calculation

Taxes are calculated per line item:

```
line_total = quantity × unit_price
line_tax = line_total × (tax_rate / 100)

invoice_tax_amount = sum of all line_tax
invoice_total = invoice_amount + invoice_tax_amount
```

Example:
```
Line 1: 1 × $5000 × 10% tax = $500 tax
Line 2: 1 × $500 × 0% tax = $0 tax
Total: $5500 + $500 = $6000
```

---

## Error Handling

### Common Errors

| Status | Error | Meaning |
|--------|-------|---------|
| 400 | Missing required fields | Check request body |
| 400 | Invalid email format | Ensure valid customer email |
| 400 | Line items required | Invoice must have at least 1 item |
| 400 | Invalid quantity | Quantity must be > 0 |
| 401 | Invalid authentication | Check API key format |
| 404 | Not found | Invoice/business doesn't exist |
| 409 | Conflict | Payment link already exists |
| 500 | Stripe integration error | Check Stripe configuration |

---

## Best Practices

### Invoice Numbering

- Use consistent numbering scheme (e.g., `INV-2024-001`)
- Include year/month for easy sorting
- Provide custom numbers or let system auto-generate

### Line Items

- Group related charges (e.g., all development work)
- Use clear, customer-friendly descriptions
- Set appropriate tax rates by jurisdiction

### Payment Collection

- Generate payment link immediately after creating invoice
- Send link to customer via email or preferred channel
- Stripe handles PCI compliance - never collect card data directly

### Status Management

- Invoices start in `draft` status
- Move to `sent` when shared with customer
- Stripe automatically updates to `paid` after payment
- Mark as `overdue` if due date passed without payment

---

## Rate Limiting

API calls are rate limited per API key:

- **Default:** 100 requests per minute
- **Bursts:** Up to 10 requests per second

Rate limit info is included in response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1708114800
```

---

## Webhooks

Stripe webhooks automatically update invoice status when payments are received:

- `payment_intent.succeeded` → Invoice status = `paid`
- `charge.refunded` → Invoice status = `refunded`
- `invoice.payment_failed` → Invoice status = `overdue`

---

## Testing

### Test Stripe Card Numbers

For testing payment links in Stripe test mode:

```
Success:           4242 4242 4242 4242
Decline:           4000 0000 0000 0002
Expired:           4000 0000 0000 0069
Authentication:    4000 0025 0000 3155
```

Use any future expiry date and CVC.

---

## Support

- **API Status:** https://status.clawprint.ai
- **Documentation:** https://docs.clawprint.ai
- **Email:** support@clawprint.ai
- **Discord:** https://discord.gg/clawprint
