#!/usr/bin/env node

/**
 * Create Invoice CLI
 * Generate an invoice for a Clawprint business
 */

const api = require('../lib/api-client');

async function createInvoice() {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    
    let businessId = null;
    let customerEmail = null;
    let customerName = null;
    let invoiceNumber = null;
    let dueDate = null;
    let lineItemsJson = null;

    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--business-id' && args[i + 1]) {
        businessId = args[++i];
      } else if (args[i] === '--customer-email' && args[i + 1]) {
        customerEmail = args[++i];
      } else if (args[i] === '--customer-name' && args[i + 1]) {
        customerName = args[++i];
      } else if (args[i] === '--invoice-number' && args[i + 1]) {
        invoiceNumber = args[++i];
      } else if (args[i] === '--due-date' && args[i + 1]) {
        dueDate = args[++i];
      } else if (args[i] === '--line-items' && args[i + 1]) {
        lineItemsJson = args[++i];
      }
    }

    // Validate required arguments
    if (!businessId) {
      console.error('❌ Error: --business-id is required');
      console.error('Usage: node create-invoice.js --business-id <id> --customer-email <email> --line-items <json>');
      console.error('');
      console.error('Example:');
      console.error('  node create-invoice.js \\');
      console.error('    --business-id biz_abc123 \\');
      console.error('    --customer-email client@example.com \\');
      console.error('    --customer-name "John Smith" \\');
      console.error('    --line-items \'[{"description":"Service","quantity":1,"unit_price":5000,"type":"service"}]\'');
      process.exit(1);
    }

    if (!customerEmail) {
      console.error('❌ Error: --customer-email is required');
      process.exit(1);
    }

    // Parse line items from JSON if provided
    let lineItems = [];
    if (lineItemsJson) {
      try {
        lineItems = JSON.parse(lineItemsJson);
      } catch (e) {
        console.error('❌ Error: Invalid JSON for --line-items');
        console.error('Must be valid JSON array of line items');
        process.exit(1);
      }
    }

    // Use example line items if none provided
    if (lineItems.length === 0) {
      lineItems = [
        {
          description: 'Consulting Services',
          quantity: 10,
          unit_price: 500,
          type: 'service',
          tax_rate: 10
        }
      ];
      console.log('📝 No line items provided, using example:');
      console.log(JSON.stringify(lineItems, null, 2));
      console.log('');
    }

    // Create invoice
    console.log('🔄 Creating invoice...');
    const invoice = await api.invoices.create({
      business_id: businessId,
      customer_email: customerEmail,
      customer_name: customerName || undefined,
      invoice_number: invoiceNumber || undefined,
      due_date: dueDate || undefined,
      line_items: lineItems,
    });

    console.log('✅ Invoice created successfully!\n');
    console.log(`📄 Invoice ID: ${invoice.invoice_id}`);
    console.log(`📝 Invoice Number: ${invoice.invoice_number}`);
    console.log(`👤 Customer: ${invoice.customer_name || invoice.customer_email}`);
    console.log(`💰 Total: ${invoice.currency} ${(invoice.total_amount).toFixed(2)}`);
    console.log(`   ├ Subtotal: ${invoice.currency} ${invoice.amount.toFixed(2)}`);
    console.log(`   └ Tax: ${invoice.currency} ${invoice.tax_amount.toFixed(2)}`);
    console.log(`📅 Due: ${new Date(invoice.due_date).toLocaleDateString()}`);
    console.log(`📊 Status: ${invoice.status}`);
    console.log('');

    // Show line items
    if (invoice.line_items && invoice.line_items.length > 0) {
      console.log('📋 Line Items:');
      invoice.line_items.forEach((item, i) => {
        const itemTotal = (item.quantity * item.unit_price).toFixed(2);
        const itemTax = item.tax_rate ? ((item.quantity * item.unit_price * item.tax_rate / 100).toFixed(2)) : '0.00';
        console.log(`  ${i + 1}. ${item.description}`);
        console.log(`     Qty: ${item.quantity} × $${item.unit_price.toFixed(2)} = $${itemTotal}`);
        if (item.tax_rate) {
          console.log(`     Tax: ${item.tax_rate}% = $${itemTax}`);
        }
      });
      console.log('');
    }

    // Next steps
    console.log('🚀 Next steps:');
    console.log(`  1. Generate payment link: node generate-payment-link.js --invoice-id ${invoice.invoice_id}`);
    console.log(`  2. Share link with customer to receive payment`);
    console.log(`  3. Track payment status: node check-invoice-status.js --invoice-id ${invoice.invoice_id}`);
    console.log('');

  } catch (error) {
    console.error('❌ Error creating invoice:');
    if (error.response) {
      console.error(`   Status: ${error.statusCode}`);
      console.error(`   Message: ${error.response.error || error.message}`);
    } else {
      console.error(`   ${error.message}`);
    }
    process.exit(1);
  }
}

createInvoice();
