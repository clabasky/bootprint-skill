#!/usr/bin/env node

/**
 * Check Invoice Status CLI
 * View detailed invoice information and payment status
 */

const api = require('../lib/api-client');

async function checkInvoiceStatus() {
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
      console.error('Usage: node check-invoice-status.js --invoice-id <id>');
      console.error('');
      console.error('Example:');
      console.error('  node check-invoice-status.js --invoice-id inv_abc123');
      process.exit(1);
    }

    // Get invoice
    console.log('🔄 Fetching invoice...');
    const invoice = await api.invoices.get(invoiceId);

    // Display invoice header
    console.log('\n' + '═'.repeat(60));
    console.log('📄 INVOICE');
    console.log('═'.repeat(60));
    console.log('');

    // Basic info
    console.log('📋 Invoice Details:');
    console.log(`   Invoice ID:      ${invoice.invoice_id}`);
    console.log(`   Invoice Number:  ${invoice.invoice_number}`);
    console.log(`   Business ID:     ${invoice.business_id}`);
    console.log('');

    // Customer info
    console.log('👤 Customer:');
    console.log(`   Name:     ${invoice.customer_name || '(Not provided)'}`);
    console.log(`   Email:    ${invoice.customer_email}`);
    console.log('');

    // Dates
    console.log('📅 Dates:');
    console.log(`   Issued:   ${new Date(invoice.issued_date).toLocaleDateString()}`);
    console.log(`   Due:      ${new Date(invoice.due_date).toLocaleDateString()}`);
    if (invoice.paid_at) {
      console.log(`   Paid:     ${new Date(invoice.paid_at).toLocaleDateString()}`);
    }
    if (invoice.viewed_at) {
      console.log(`   Viewed:   ${new Date(invoice.viewed_at).toLocaleDateString()}`);
    }
    console.log('');

    // Status
    const statusEmoji = {
      'draft': '📝',
      'sent': '📤',
      'viewed': '👀',
      'paid': '✅',
      'overdue': '⚠️',
      'cancelled': '❌',
      'refunded': '↩️'
    };
    
    const statusColor = {
      'draft': 'normal',
      'sent': 'normal',
      'viewed': 'normal',
      'paid': 'success',
      'overdue': 'warning',
      'cancelled': 'error',
      'refunded': 'warning'
    };

    console.log('📊 Status:');
    console.log(`   Status:   ${statusEmoji[invoice.status] || '❓'} ${invoice.status.toUpperCase()}`);
    console.log('');

    // Financial summary
    console.log('💰 Amount:');
    console.log(`   Subtotal: ${invoice.currency} ${invoice.amount.toFixed(2)}`);
    console.log(`   Tax:      ${invoice.currency} ${invoice.tax_amount.toFixed(2)}`);
    console.log(`   TOTAL:    ${invoice.currency} ${invoice.total_amount.toFixed(2)}`);
    console.log('');

    // Line items
    if (invoice.line_items && invoice.line_items.length > 0) {
      console.log('📦 Line Items:');
      invoice.line_items.forEach((item, i) => {
        const itemTotal = (item.quantity * item.unit_price).toFixed(2);
        const taxString = item.tax_rate ? ` + ${item.tax_rate}% tax` : '';
        console.log(`   ${i + 1}. ${item.description}`);
        console.log(`      ${item.quantity} × ${invoice.currency} ${item.unit_price.toFixed(2)} = ${invoice.currency} ${itemTotal}${taxString}`);
      });
      console.log('');
    }

    // Payment link
    if (invoice.stripe_payment_link) {
      console.log('💳 Payment Link:');
      console.log(`   URL:      ${invoice.stripe_payment_link}`);
      console.log(`   Stripe ID: ${invoice.stripe_invoice_id}`);
      console.log('');
    } else if (invoice.status !== 'paid' && invoice.status !== 'cancelled') {
      console.log('⚠️  No payment link generated yet.');
      console.log(`   Generate one: node generate-payment-link.js --invoice-id ${invoiceId}`);
      console.log('');
    }

    // Additional details
    if (invoice.notes) {
      console.log('📝 Notes:');
      console.log(`   ${invoice.notes}`);
      console.log('');
    }

    if (invoice.payment_terms) {
      console.log('📋 Payment Terms:');
      console.log(`   ${invoice.payment_terms}`);
      console.log('');
    }

    // Footer
    console.log('═'.repeat(60));
    console.log('');

    // Suggestions based on status
    if (invoice.status === 'draft') {
      console.log('💡 Next step: Generate payment link to send to customer');
      console.log(`   node generate-payment-link.js --invoice-id ${invoiceId}`);
    } else if (invoice.status === 'sent') {
      console.log('💡 Waiting for customer payment...');
    } else if (invoice.status === 'paid') {
      console.log('✅ Payment received! Thank you.');
    } else if (invoice.status === 'overdue') {
      console.log('⚠️  Invoice is overdue. Follow up with customer.');
    }
    console.log('');

  } catch (error) {
    console.error('❌ Error checking invoice status:');
    if (error.response) {
      console.error(`   Status: ${error.statusCode}`);
      console.error(`   Message: ${error.response.error || error.message}`);
      if (error.statusCode === 404) {
        console.error('');
        console.error('   Invoice not found. Check the invoice ID.');
      }
    } else {
      console.error(`   ${error.message}`);
    }
    process.exit(1);
  }
}

checkInvoiceStatus();
