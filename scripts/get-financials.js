#!/usr/bin/env node

/**
 * Get financial summary for a business
 * 
 * Usage:
 *   node get-financials.js --business-id biz_abc123 [--period month|quarter|year|all]
 * 
 * Returns:
 *   {
 *     "business_id": "biz_abc123",
 *     "period": "month",
 *     "revenue": 5000.00,
 *     "expenses": 150.00,
 *     "net": 4850.00,
 *     "balance": 4850.00,
 *     "transactions": [...]
 *   }
 */


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
  console.error('  node get-financials.js --business-id biz_abc123 [--period month|quarter|year|all]');
  process.exit(1);
}

async function getFinancials() {
  const businessId = config['business-id'];
  const period = config.period || 'all';
  
  
  console.log(`Getting financials for business: ${businessId}`);
  console.log(`Period: ${period}\n`);
  
  // TODO: Implement actual financials logic
  // 2. Filter by period
  // 3. Calculate revenue (payments received)
  // 4. Calculate expenses (Clawprint fees, Stripe fees, etc.)
  // 5. Calculate net income
  // 6. Get current bank balance from Unit.co
  // 7. Return summary + transaction list
  
  // Placeholder response
  const response = {
    business_id: businessId,
    period: period,
    period_start: '2026-02-01',
    period_end: '2026-02-19',
    summary: {
      revenue: 5000.00,
      expenses: {
        stripe_fees: 145.00,
        clawprint_fees: 12.50,
        registered_agent: 10.00,
        bookkeeping: 29.00,
        total: 196.50
      },
      net_income: 4803.50,
      current_balance: 4803.50
    },
    transactions: [
      {
        id: 'txn_001',
        date: '2026-02-18',
        type: 'income',
        description: 'Invoice payment - Client A',
        amount: 2000.00,
        status: 'completed'
      },
      {
        id: 'txn_002',
        date: '2026-02-17',
        type: 'income',
        description: 'Invoice payment - Client B',
        amount: 3000.00,
        status: 'completed'
      },
      {
        id: 'txn_003',
        date: '2026-02-15',
        type: 'expense',
        description: 'Stripe processing fees',
        amount: -145.00,
        status: 'completed'
      },
      {
        id: 'txn_004',
        date: '2026-02-15',
        type: 'expense',
        description: 'Clawprint platform fee (0.25%)',
        amount: -12.50,
        status: 'completed'
      },
      {
        id: 'txn_005',
        date: '2026-02-01',
        type: 'expense',
        description: 'Monthly fees (registered agent + bookkeeping)',
        amount: -39.00,
        status: 'completed'
      }
    ]
  };
  
  console.log('📊 Financial Summary');
  console.log('─'.repeat(50));
  console.log(`Period: ${response.period_start} to ${response.period_end}`);
  console.log(`\n💰 Revenue: $${response.summary.revenue.toFixed(2)}`);
  console.log(`\n💸 Expenses:`);
  console.log(`   Stripe fees: $${response.summary.expenses.stripe_fees.toFixed(2)}`);
  console.log(`   Clawprint fees: $${response.summary.expenses.clawprint_fees.toFixed(2)}`);
  console.log(`   Registered agent: $${response.summary.expenses.registered_agent.toFixed(2)}`);
  console.log(`   Bookkeeping: $${response.summary.expenses.bookkeeping.toFixed(2)}`);
  console.log(`   ─────────────────`);
  console.log(`   Total: $${response.summary.expenses.total.toFixed(2)}`);
  console.log(`\n📈 Net Income: $${response.summary.net_income.toFixed(2)}`);
  console.log(`\n🏦 Current Balance: $${response.summary.current_balance.toFixed(2)}`);
  console.log('─'.repeat(50));
  console.log(`\nRecent Transactions: ${response.transactions.length}`);
  
  console.log('\n' + JSON.stringify(response, null, 2));
  
  return response;
}

// Run
getFinancials()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Error getting financials:', err.message);
    process.exit(1);
  });
