#!/bin/bash

##########################################################################
# Clawprint Test Runner
# Runs all test suites and reports results
##########################################################################

set -e

echo "🧪 Clawprint Test Suite Runner"
echo "======================================================================"
echo ""

# Check if API is running
echo "🔍 Checking API health..."
if ! curl -s http://localhost:3000/api/health > /dev/null; then
  echo "❌ Error: Clawprint API is not running"
  echo ""
  echo "Start the API with:"
  echo "  cd clawprint-app"
  echo "  npm run dev"
  echo ""
  exit 1
fi
echo "✅ API is running"
echo ""

# Run authentication tests
echo "🔐 Running authentication tests..."
node scripts/test-auth.js

# If we get here, all tests passed
echo ""
echo "======================================================================"
echo "🎉 All test suites passed!"
echo "======================================================================"
echo ""
