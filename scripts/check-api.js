#!/usr/bin/env node

/**
 * Check Clawprint API connectivity and configuration
 * 
 * Usage:
 *   node check-api.js
 */

const api = require('../lib/api-client');

async function checkAPI() {
  console.log('🔍 Clawprint API Connectivity Check\n');
  console.log('═'.repeat(60));
  
  // Check environment
  console.log('\n📋 Configuration:');
  console.log(`   API URL: ${api.getClient().baseUrl || 'Not set'}`);
  console.log(`   API Key: ${api.getClient().apiKey ? '✅ Set' : '❌ Not set'}`);
  
  if (!api.getClient().apiKey) {
    console.log('\n⚠️  Warning: API key not configured');
    console.log('   Set CLAWPRINT_API_KEY environment variable or add to .env file');
  }
  
  // Check health endpoint
  console.log('\n📋 Testing Connectivity:');
  try {
    const health = await api.health();
    console.log('   Health endpoint: ✅ Reachable');
    console.log(`   API Version: ${health.version}`);
    console.log(`   Database: ${health.services.database === 'up' ? '✅' : '❌'} ${health.services.database}`);
    console.log(`   API: ${health.services.api === 'up' ? '✅' : '❌'} ${health.services.api}`);
    
    if (health.status === 'healthy') {
      console.log('\n✅ API is healthy and ready to use!');
      console.log('\n💡 Try creating a business:');
      console.log('   node scripts/create-business.js --name "Test" --sponsor you@example.com');
    } else {
      console.log('\n⚠️  API is reachable but some services are degraded');
    }
  } catch (error) {
    console.log('   Health endpoint: ❌ Unreachable');
    console.error(`   Error: ${error.message}`);
    console.log('\n❌ Cannot connect to API');
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check that the API server is running (npm run dev in clawprint-app)');
    console.log('   2. Verify CLAWPRINT_API_URL is correct (default: http://localhost:3000/api)');
    console.log('   3. Check firewall/network settings');
    console.log('   4. Review API server logs for errors');
    process.exit(1);
  }
  
  console.log('\n' + '═'.repeat(60));
}

checkAPI().catch(error => {
  console.error('\n❌ Check failed:', error.message);
  process.exit(1);
});
