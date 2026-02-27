#!/usr/bin/env node

/**
 * Check status of a business formation
 * 
 * Usage:
 *   node check-status.js --business-id biz_abc123
 * 
 * Returns:
 *   {
 *     "business_id": "biz_abc123",
 *     "name": "Acme AI Services",
 *     "status": "active",
 *     "llc": {
 *       "status": "filed",
 *       "file_number": "1234567",
 *       "filed_date": "2026-02-18"
 *     },
 *     "ein": {
 *       "status": "assigned",
 *       "number": "XX-XXXXXXX"
 *     },
 *     "bank_account": {
 *       "status": "active",
 *       "routing": "123456789",
 *       "account": "****1234",
 *       "balance": 5000.00
 *     }
 *   }
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
  console.error('  node check-status.js --business-id biz_abc123');
  process.exit(1);
}

const STATUS_EMOJI = {
  pending: '⏳',
  forming: '🔨',
  active: '✅',
  suspended: '⚠️',
  dissolved: '❌',
  filed: '✅',
  rejected: '❌',
  assigned: '✅',
  failed: '❌',
  closed: '🔒',
};

function getStatusEmoji(status) {
  return STATUS_EMOJI[status] || '❓';
}

async function checkStatus() {
  const businessId = config['business-id'];
  
  try {
    console.log(`Fetching status for business: ${businessId}\n`);
    
    // Get detailed status from API
    const status = await api.businesses.getStatus(businessId);
    
    console.log('📊 Business Formation Status');
    console.log('═'.repeat(60));
    console.log(`\n🏢 Business: ${status.legal_name}`);
    console.log(`   ID: ${status.business_id}`);
    console.log(`   Overall Status: ${getStatusEmoji(status.status)} ${status.status.toUpperCase()}`);
    console.log(`   Created: ${new Date(status.created_at).toLocaleDateString()}`);
    
    console.log(`\n📄 LLC Formation (${status.llc.state})`);
    console.log(`   Status: ${getStatusEmoji(status.llc.status)} ${status.llc.status}`);
    if (status.llc.file_number) {
      console.log(`   File #: ${status.llc.file_number}`);
      console.log(`   Filed: ${new Date(status.llc.filed_date).toLocaleDateString()}`);
    }
    
    console.log(`\n🏦 EIN (Employer ID Number)`);
    console.log(`   Status: ${getStatusEmoji(status.ein.status)} ${status.ein.status}`);
    if (status.ein.number) {
      console.log(`   Number: ${status.ein.number}`);
      console.log(`   Assigned: ${new Date(status.ein.assigned_date).toLocaleDateString()}`);
    }
    
    console.log(`\n💰 Bank Account`);
    console.log(`   Status: ${getStatusEmoji(status.bank_account.status)} ${status.bank_account.status}`);
    if (status.bank_account.provider) {
      console.log(`   Provider: ${status.bank_account.provider}`);
      console.log(`   Routing: ${status.bank_account.routing}`);
      console.log(`   Account: ****${status.bank_account.account_last4}`);
      console.log(`   Opened: ${new Date(status.bank_account.opened_date).toLocaleDateString()}`);
    }
    
    console.log(`\n👤 Sponsor`);
    console.log(`   Email: ${status.sponsor.email}`);
    console.log(`   Verified: ${status.sponsor.verified ? '✅ Yes' : '⏳ Pending'}`);
    if (status.sponsor.verified_at) {
      console.log(`   Verified: ${new Date(status.sponsor.verified_at).toLocaleDateString()}`);
    }
    
    console.log('\n' + '═'.repeat(60));
    
    // Show next steps based on status
    if (status.status === 'pending' || status.status === 'forming') {
      console.log('\n📋 Next Steps:');
      if (!status.sponsor.verified) {
        console.log('  • Sponsor needs to complete identity verification');
      }
      if (status.llc.status === 'pending') {
        console.log('  • Waiting for Delaware LLC formation (1-3 business days)');
      }
      if (status.ein.status === 'pending') {
        console.log('  • Waiting for IRS EIN assignment (3-5 business days)');
      }
      if (status.bank_account.status === 'pending') {
        console.log('  • Waiting for bank account setup (2-5 business days)');
      }
    } else if (status.status === 'active') {
      console.log('\n✅ Business is fully active and ready to operate!');
      console.log(`   Check financials: node get-financials.js --business-id ${businessId}`);
    }
    
    console.log('\n📄 Full JSON Response:');
    console.log(JSON.stringify(status, null, 2));
    
    return status;
  } catch (error) {
    console.error('\n❌ Error checking status:', error.message);
    if (error.statusCode === 404) {
      console.error('Business not found. Check the business ID and try again.');
    } else if (error.response) {
      console.error('Details:', error.response);
    }
    throw error;
  }
}

// Run
checkStatus()
  .then(() => process.exit(0))
  .catch(err => {
    process.exit(1);
  });
