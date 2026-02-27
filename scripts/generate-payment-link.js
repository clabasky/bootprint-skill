#!/usr/bin/env node

/**
 * Generate Payment Link CLI
 * Create a Stripe payment link for an invoice
 */

const api = require('../lib/api-client');

async function generatePaymentLink() {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    
    let invoiceId = null;

    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--invoice-id' && args[i + 1]) {
        invoiceId = args[++i];
      }
    }

    // Validate required arguments
    if (!invoiceId) {
      console.error('❌ Error: --invoice-id is required');
      console.error('Usage: node generate-payment-link.js --invoice-id <id>');
      console.error('');
      console.error('Example:');
      console.error('  node generate-payment-link.js --invoice-id inv_abc123');
      process.exit(1);
    }

    // Get invoice first to show details
    console.log('🔄 Fetching invoice...');
    const invoice = await api.invoices.get(invoiceId);

    console.log('✅ Invoice found:\n');
    console.log(`📄 Invoice: ${invoice.invoice_number}`);
    console.log(`👤 Customer: ${invoice.customer_name || invoice.customer_email}`);
    console.log(`💰 Amount: ${invoice.currency} ${invoice.total_amount.toFixed(2)}`);
    console.log('');

    // Check if payment link already exists
    if (invoice.stripe_payment_link) {
      console.log('✨ Payment link already exists for this invoice:');
      console.log(`🔗 ${invoice.stripe_payment_link}`);
      console.log('');
      console.log('📋 Link Details:');
      console.log(`   Status: Payment link already active`);
      console.log(`   Share this URL with the customer to collect payment`);
      console.log('');
      return;
    }

    // Generate new payment link
    console.log('🔄 Generating Stripe payment link...');
    const paymentLink = await api.invoices.generatePaymentLink(invoiceId);

    console.log('✅ Payment link generated successfully!\n');
    console.log('🔗 Payment Link:');
    console.log(`   ${paymentLink.payment_link_url}`);
    console.log('');
    console.log('📋 Link Details:');
    console.log(`   Stripe Invoice ID: ${paymentLink.stripe_invoice_id}`);
    console.log(`   Expires: ${new Date(paymentLink.expires_at).toLocaleDateString()}`);
    console.log('');
    console.log('💡 Share this link with your customer:');
    console.log(`   👉 ${paymentLink.payment_link_url}`);
    console.log('');
    console.log('📊 Next steps:');
    console.log('   1. Send the link to your customer via email or message');
    console.log('   2. Customer clicks the link and pays via Stripe');
    console.log('   3. Payment is automatically recorded in the invoice');
    console.log(`   4. Check status: node check-invoice-status.js --invoice-id ${invoiceId}`);
    console.log('');

  } catch (error) {
    console.error('❌ Error generating payment link:');
    if (error.response) {
      console.error(`   Status: ${error.statusCode}`);
      const err = error.response.error || error.message;
      console.error(`   Message: ${err}`);
      if (error.statusCode === 409) {
        console.error('');
        console.error('   💡 A payment link may already exist for this invoice.');
        console.error('      Try retrieving it instead: node get-payment-link.js --invoice-id <id>');
      }
    } else {
      console.error(`   ${error.message}`);
    }
    process.exit(1);
  }
}

generatePaymentLink();
