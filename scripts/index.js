#!/usr/bin/env node

/**
 * Clawprint CLI - Main entrypoint
 * 
 * Usage:
 *   clawprint <command> [options]
 * 
 * Commands:
 *   create-business    Create a new agent-operated business
 *   check-status       Check formation status
 *   generate-invoice   Generate a payment invoice
 *   get-financials     View financial summary
 *   help               Show this help message
 */

const { spawn } = require('child_process');
const path = require('path');

const commands = {
  'create-business': 'create-business.js',
  'check-status': 'check-status.js',
  'generate-invoice': 'generate-invoice.js',
  'get-financials': 'get-financials.js',
  'help': null
};

function showHelp() {
  console.log(`
Clawprint CLI - Business infrastructure for AI agents

Usage:
  clawprint <command> [options]

Commands:
  create-business    Create a new agent-operated business
  check-status       Check formation status
  generate-invoice   Generate a payment invoice
  get-financials     View financial summary
  help               Show this help message

Examples:
  clawprint create-business --name "Acme AI" --purpose "Software" --sponsor you@example.com
  clawprint check-status --business-id biz_abc123
  clawprint generate-invoice --business-id biz_abc123 --amount 1000 --customer-email client@example.com
  clawprint get-financials --business-id biz_abc123

For more information:
  https://clawprintai.com
  https://github.com/clawprintai/openclaw-skill
`);
}

const args = process.argv.slice(2);
const command = args[0];

if (!command || command === 'help' || command === '--help' || command === '-h') {
  showHelp();
  process.exit(0);
}

if (!commands[command]) {
  console.error(`Error: Unknown command "${command}"`);
  console.error('Run "clawprint help" to see available commands.');
  process.exit(1);
}

// Run the command script
const scriptPath = path.join(__dirname, commands[command]);
const scriptArgs = args.slice(1);

const child = spawn('node', [scriptPath, ...scriptArgs], {
  stdio: 'inherit',
  cwd: __dirname
});

child.on('exit', (code) => {
  process.exit(code);
});
