#!/usr/bin/env node

/**
 * Get financial summary for a business
 * 
 * Usage:
 *   node get-financials.js --business-id biz_abc123 [--period week|month|year|all]
 * 
 * Returns:
 *   Financial summary with balance, revenue, expenses, and recent transactions
 */

const api = require('../lib/api-client');

// Parse command line arguments
const args = process.argv.slice(2);
const config = {};

for (let i = 0; i < args.length; i += 2) {
  const key = args[i].replace('--', '');
  const value = args[i + 1];
  config[key] = value;
}

// Validate required arguments
if (!config['business-id']) {
  console.error('Error: Missing required argument: --business-id');
  console.error('\nUsage:');
  console.error('  node get-financials.js --business-id biz_abc123 [--period week|month|year|all]');
  console.error('\nPeriod options:');
  console.error('  week  - Last 7 days');
  console.error('  month - Last 30 days');
  console.error('  year  - Last 365 days');
  console.error('  all   - All time (default)');
  process.exit(1);
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

async function getFinancials() {
  const businessId = config['business-id'];
  const period = config['period'] || 'all';
  
  try {
    console.log(`Fetching financials for business: ${businessId}`);
    console.log(`Period: ${period}\n`);
    
    // Get financial summary from API
    const financials = await api.businesses.getFinancials(businessId, period);
    
    console.log('💰 Financial Summary');
    console.log('═'.repeat(70));
    console.log(`\n🏢 Business: ${financials.legal_name}`);
    console.log(`   ID: ${financials.business_id}`);
    console.log(`   Period: ${financials.period}`);
    
    console.log(`\n💵 Account Balance`);
    console.log(`   Current:   ${formatCurrency(financials.balance.current)}`);
    console.log(`   Available: ${formatCurrency(financials.balance.available)}`);
    console.log(`   Pending:   ${formatCurrency(financials.balance.pending)}`);
    
    console.log(`\n📈 Revenue`);
    console.log(`   Total:        ${formatCurrency(financials.revenue.total)}`);
    console.log(`   Transactions: ${financials.revenue.count}`);
    
    console.log(`\n📉 Expenses`);
    console.log(`   Total:        ${formatCurrency(financials.expenses.total)}`);
    console.log(`   Transactions: ${financials.expenses.count}`);
    
    console.log(`\n💎 Net Income`);
    const netColor = financials.net_income >= 0 ? '✅' : '❌';
    console.log(`   ${netColor} ${formatCurrency(financials.net_income)}`);
    
    if (financials.transactions.length > 0) {
      console.log(`\n📋 Recent Transactions (${financials.transactions.length})`);
      console.log('─'.repeat(70));
      
      financials.transactions.slice(0, 10).forEach((tx, i) => {
        const sign = tx.type === 'credit' ? '+' : '-';
        const emoji = tx.type === 'credit' ? '💵' : '💸';
        console.log(`${emoji} ${formatDate(tx.date)} | ${sign}${formatCurrency(tx.amount)} | ${tx.description || 'No description'}`);
      });
      
      if (financials.transactions.length > 10) {
        console.log(`   ... and ${financials.transactions.length - 10} more`);
      }
    } else {
      console.log(`\n📋 No transactions yet for this period`);
    }
    
    console.log('\n' + '═'.repeat(70));
    
    console.log('\n📄 Full JSON Response:');
    console.log(JSON.stringify(financials, null, 2));
    
    return financials;
  } catch (error) {
    console.error('\n❌ Error fetching financials:', error.message);
    if (error.statusCode === 404) {
      console.error('Business not found. Check the business ID and try again.');
    } else if (error.statusCode === 400) {
      console.error('Invalid period. Must be one of: week, month, year, all');
    } else if (error.response) {
      console.error('Details:', error.response);
    }
    throw error;
  }
}

// Run
getFinancials()
  .then(() => process.exit(0))
  .catch(err => {
    process.exit(1);
  });
