#!/usr/bin/env node

/**
 * Clawprint API Integration Tests
 * Tests all API endpoints to ensure they work correctly
 * 
 * Usage:
 *   node test-api.js [--cleanup]
 * 
 * Options:
 *   --cleanup  Delete test data after running tests
 */

const api = require('../lib/api-client');

const CLEANUP = process.argv.includes('--cleanup');
const testData = {
  businessIds: [],
  sponsorEmails: [],
};

let passedTests = 0;
let failedTests = 0;

function logTest(name, passed, error = null) {
  if (passed) {
    console.log(`✅ ${name}`);
    passedTests++;
  } else {
    console.log(`❌ ${name}`);
    if (error) console.error(`   Error: ${error.message}`);
    failedTests++;
  }
}

async function runTests() {
  console.log('🚀 Starting Clawprint API Integration Tests\n');
  console.log('═'.repeat(60));
  
  // Test 1: Health check
  console.log('\n📋 Testing Health & System Endpoints...');
  try {
    const health = await api.health();
    logTest('Health check', health.status === 'healthy');
  } catch (error) {
    logTest('Health check', false, error);
  }

  // Test 2: Agent registration
  console.log('\n📋 Testing Agent Endpoints...');
  try {
    const email = `test-agent-${Date.now()}@clawprint.test`;
    const agent = await api.agents.register(email, 'Test Agent');
    logTest(
      'Agent registration',
      agent.user && agent.user.email === email && agent.api_key
    );
  } catch (error) {
    logTest('Agent registration', false, error);
  }

  // Test 3: Create sponsor
  console.log('\n📋 Testing Sponsor Endpoints...');
  const sponsorEmail = `test-sponsor-${Date.now()}@clawprint.test`;
  testData.sponsorEmails.push(sponsorEmail);
  
  try {
    const sponsor = await api.sponsors.getOrCreate({
      email: sponsorEmail,
      first_name: 'Test',
      last_name: 'Sponsor',
    });
    logTest('Create sponsor', sponsor.email === sponsorEmail);
  } catch (error) {
    logTest('Create sponsor', false, error);
  }

  // Test 4: Get sponsor by email
  try {
    const sponsor = await api.sponsors.getByEmail(sponsorEmail);
    logTest('Get sponsor by email', sponsor && sponsor.email === sponsorEmail);
  } catch (error) {
    logTest('Get sponsor by email', false, error);
  }

  // Test 5: Create business
  console.log('\n📋 Testing Business Endpoints...');
  let businessId;
  try {
    const business = await api.businesses.create({
      legal_name: `Test Business ${Date.now()}`,
      purpose: 'Integration testing',
      sponsor_email: sponsorEmail,
      type: 'llc',
      formation_state: 'delaware',
    });
    businessId = business.business_id;
    testData.businessIds.push(businessId);
    logTest('Create business', business.business_id && business.legal_name);
  } catch (error) {
    logTest('Create business', false, error);
  }

  // Test 6: List businesses
  try {
    const businesses = await api.businesses.list();
    logTest('List businesses', Array.isArray(businesses) && businesses.length > 0);
  } catch (error) {
    logTest('List businesses', false, error);
  }

  // Test 7: Get single business
  if (businessId) {
    try {
      const business = await api.businesses.get(businessId);
      logTest('Get business by ID', business.business_id === businessId);
    } catch (error) {
      logTest('Get business by ID', false, error);
    }

    // Test 8: Get business status
    try {
      const status = await api.businesses.getStatus(businessId);
      logTest(
        'Get business status',
        status.business_id === businessId &&
        status.llc && status.ein && status.bank_account
      );
    } catch (error) {
      logTest('Get business status', false, error);
    }

    // Test 9: Get business financials
    try {
      const financials = await api.businesses.getFinancials(businessId, 'all');
      logTest(
        'Get business financials',
        financials.business_id === businessId &&
        financials.balance && financials.revenue && financials.expenses
      );
    } catch (error) {
      logTest('Get business financials', false, error);
    }

    // Test 10: Update business
    try {
      const updated = await api.businesses.update(businessId, {
        purpose: 'Updated purpose for testing',
      });
      logTest('Update business', updated.purpose === 'Updated purpose for testing');
    } catch (error) {
      logTest('Update business', false, error);
    }

    // Test 11: Dissolve business
    if (CLEANUP) {
      try {
        await api.businesses.dissolve(businessId);
        logTest('Dissolve business', true);
      } catch (error) {
        logTest('Dissolve business', false, error);
      }
    }
  }

  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log('\n📊 Test Summary');
  console.log(`   Total:  ${passedTests + failedTests}`);
  console.log(`   ✅ Passed: ${passedTests}`);
  console.log(`   ❌ Failed: ${failedTests}`);
  console.log(`   Success Rate: ${Math.round((passedTests / (passedTests + failedTests)) * 100)}%`);
  
  if (CLEANUP && testData.businessIds.length > 0) {
    console.log('\n🧹 Cleanup: Test data has been marked for deletion');
  } else if (testData.businessIds.length > 0) {
    console.log('\n💡 Test data created:');
    console.log(`   Businesses: ${testData.businessIds.join(', ')}`);
    console.log(`   Sponsors: ${testData.sponsorEmails.join(', ')}`);
    console.log('\n   Run with --cleanup to delete test data');
  }

  console.log('\n' + '═'.repeat(60));
  
  if (failedTests > 0) {
    console.log('\n⚠️  Some tests failed. Check errors above.');
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed!');
    process.exit(0);
  }
}

// Run tests
runTests().catch(error => {
  console.error('\n❌ Test suite failed:', error.message);
  process.exit(1);
});
