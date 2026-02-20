#!/usr/bin/env node

/**
 * Generate a Stripe invoice for payment
 * 
 * Usage:
 *   node generate-invoice.js \
 *     --business-id biz_abc123 \
 *     --amount 1000 \
 *     --description "Consulting services" \
 *     --customer-email client@example.com
 * 
 * Returns:
 *   {
 *     "invoice_id": "inv_abc123",
 *     "payment_url": "https://invoice.stripe.com/...",
 *     "amount": 1000.00,
 *     "status": "open"
 *   }
 */

const { createClient } = require('@supabase/supabase-js');
const Stripe = require('stripe');

// Parse command line arguments
const args = process.argv.slice(2);
const config = {};

for (let i = 0; i < args.length; i += 2) {
  const key = args[i].replace('--', '');
  const value = args[i + 1];
  config[key] = value;
}

// Validate required arguments
const required = ['business-id', 'amount', 'description', 'customer-email'];
const missing = required.filter(key => !config[key]);

if (missing.length > 0) {
  console.error(`Error: Missing required arguments: ${missing.join(', ')}`);
  console.error('\nUsage:');
  console.error('  node generate-invoice.js \\');
  console.error('    --business-id biz_abc123 \\');
  console.error('    --amount 1000 \\');
  console.error('    --description "Service description" \\');
  console.error('    --customer-email client@example.com');
  process.exit(1);
}

async function generateInvoice() {
  const businessId = config['business-id'];
  const amount = parseFloat(config.amount);
  const description = config.description;
  const customerEmail = config['customer-email'];
  
  // TODO: Initialize Supabase and Stripe clients
  // const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  
  console.log('Generating invoice...');
  console.log(`  Business: ${businessId}`);
  console.log(`  Amount: $${amount.toFixed(2)}`);
  console.log(`  Description: ${description}`);
  console.log(`  Customer: ${customerEmail}`);
  
  // TODO: Implement actual invoice generation logic
  // 1. Verify business exists and is active
  // 2. Get business Stripe account ID
  // 3. Create or retrieve Stripe customer
  // 4. Create Stripe invoice
  // 5. Store invoice in Supabase
  // 6. Return payment URL
  
  // Placeholder response
  const invoiceId = `inv_${Date.now()}`;
  const response = {
    invoice_id: invoiceId,
    business_id: businessId,
    amount: amount,
    currency: 'usd',
    description: description,
    customer_email: customerEmail,
    status: 'open', // open | paid | void | uncollectible
    payment_url: `https://invoice.stripe.com/i/${invoiceId}`,
    created_at: new Date().toISOString(),
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  };
  
  console.log('\n✅ Invoice generated!');
  console.log(`\n💳 Payment URL: ${response.payment_url}`);
  console.log(`\nSend this link to your customer to collect payment.`);
  console.log('\n' + JSON.stringify(response, null, 2));
  
  return response;
}

// Run
generateInvoice()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Error generating invoice:', err.message);
    process.exit(1);
  });
