#!/usr/bin/env node

/**
 * Create a new agent-operated business (Delaware LLC)
 * 
 * Usage:
 *   node create-business.js \
 *     --name "Acme AI Services" \
 *     --purpose "Software development and consulting" \
 *     --sponsor christophe@example.com \
 *     --agent-id <openclaw-session-id>
 * 
 * Returns:
 *   {
 *     "business_id": "biz_abc123",
 *     "status": "forming",
 *     "sponsor_verification_sent": true,
 *     "estimated_completion": "2026-02-25"
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
const required = ['name', 'sponsor'];
const missing = required.filter(key => !config[key]);

if (missing.length > 0) {
  console.error(`Error: Missing required arguments: ${missing.join(', ')}`);
  console.error('\nUsage:');
  console.error('  node create-business.js \\');
  console.error('    --name "Business Name" \\');
  console.error('    --sponsor sponsor@example.com \\');
  console.error('    [--purpose "Business purpose"] \\');
  console.error('    [--type llc|c_corp|s_corp] \\');
  console.error('    [--agent-id <openclaw-session-id>]');
  process.exit(1);
}

async function createBusiness() {
  try {
    console.log('Creating business via Clawprint API...');
    console.log(`  Name: ${config.name}`);
    console.log(`  Sponsor: ${config.sponsor}`);
    if (config.purpose) console.log(`  Purpose: ${config.purpose}`);
    if (config.type) console.log(`  Type: ${config.type}`);
    
    // First, ensure sponsor exists
    console.log('\n📝 Setting up sponsor...');
    const sponsor = await api.sponsors.getOrCreate({
      email: config.sponsor,
    });
    console.log(`✅ Sponsor ready: ${sponsor.email}`);

    // Create the business
    console.log('\n🏢 Creating business entity...');
    const business = await api.businesses.create({
      legal_name: config.name,
      purpose: config.purpose || 'General business operations',
      sponsor_email: config.sponsor,
      type: config.type || 'llc',
      formation_state: 'delaware',
    });

    console.log('✅ Business created successfully!');
    
    // Calculate estimated completion
    const estimatedCompletion = new Date();
    estimatedCompletion.setDate(estimatedCompletion.getDate() + 7);
    
    const response = {
      business_id: business.business_id,
      legal_name: business.legal_name,
      status: business.status,
      type: business.type,
      formation_state: business.formation_state,
      sponsor_email: business.sponsor_email,
      created_at: business.created_at,
      estimated_completion: estimatedCompletion.toISOString().split('T')[0],
      next_steps: [
        'Sponsor must complete identity verification',
        'Delaware will process LLC formation (1-3 business days)',
        'IRS will issue EIN (3-5 business days)',
        'Bank account will be opened (2-5 business days)',
      ],
    };
    
    console.log('\n📊 Business Details:');
    console.log('─'.repeat(50));
    console.log(JSON.stringify(response, null, 2));
    console.log('─'.repeat(50));
    console.log(`\n💡 Next: Check status with: node check-status.js --business-id ${business.business_id}`);
    
    return response;
  } catch (error) {
    console.error('\n❌ Error creating business:', error.message);
    if (error.response) {
      console.error('Details:', error.response);
    }
    throw error;
  }
}

// Run
createBusiness()
  .then(() => process.exit(0))
  .catch(err => {
    process.exit(1);
  });
