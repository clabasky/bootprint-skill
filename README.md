# Clawprint OpenClaw Skill

**Business infrastructure for AI agents** — Create LLCs, open bank accounts, accept payments, all from your agent.

🚀 **Status:** Early development (v0.1.0)  
🔗 **Website:** https://clawprintai.com  
📦 **Install:** Coming soon to ClawHub  

---

## What is Clawprint?

Clawprint is an OpenClaw skill that lets AI agents create and operate real businesses. Agents can:

- ✅ Form Delaware LLCs with human sponsor oversight
- ✅ Get an EIN from the IRS
- ✅ Open FDIC-insured bank accounts
- ✅ Accept payments via Stripe
- ✅ Generate invoices
- ✅ Track financials

All with simple command-line scripts.

---

## Quick Example

```bash
# Create a business
node scripts/create-business.js \
  --name "Acme AI Services" \
  --purpose "Software development" \
  --sponsor clabasky@gmail.com

# Check status
node scripts/check-status.js --business-id biz_abc123

# Generate invoice
node scripts/generate-invoice.js \
  --business-id biz_abc123 \
  --amount 1000 \
  --description "Consulting work" \
  --customer-email client@example.com

# View financials
node scripts/get-financials.js --business-id biz_abc123
```

---

## How It Works

### Legal Structure

Each agent business is a **Delaware LLC** with:

1. **Agent** — Operates the business day-to-day
2. **Sponsor** — Human owner who provides legal oversight and KYC
3. **Operating Agreement** — Delegates specific authority to the agent

This is **fully legal** under current US law. The sponsor maintains ultimate control and liability.

### Formation Timeline

- **Day 1:** Agent creates business, sponsor verifies identity
- **Day 2-3:** Delaware files LLC
- **Day 3-7:** IRS issues EIN
- **Day 5-10:** Bank account opens

**Total: 3-10 business days** from start to first payment.

### Tech Stack

- **LLC Formation:** Delaware Division of Corporations API
- **Banking:** Unit.co (BaaS platform)
- **Payments:** Stripe Connect
- **EIN:** IRS via Form SS-4 (automated where possible)

---

## Installation

### Prerequisites

- Node.js 18+
- OpenClaw agent with valid session
- Stripe account
- Unit.co account (request access)

### Setup

```bash
# Clone repo
git clone https://github.com/clabasky/clawprint-skill.git
cd clawprint-skill

# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your API keys

# Test
node scripts/create-business.js --help
```

### Environment Variables

```bash
STRIPE_SECRET_KEY=sk_test_...
UNIT_API_KEY=your-unit-key
UNIT_API_URL=https://api.s.unit.sh
```

---

## Documentation

- **SKILL.md** — Full skill documentation (for agents)
- **references/operating-agreement-template.md** — LLC operating agreement template
- **references/schema.md** — Database schema
- **references/faq.md** — Frequently asked questions (coming soon)

---

## Roadmap

### MVP (Week 1-4) — Feb 16 - Mar 15, 2026

- [x] Legal research and framework design
- [x] Agent-first strategy and MVP plan
- [x] GitHub repo structure
- [ ] Implement `create-business.js`
- [ ] Implement `check-status.js`
- [ ] Implement `generate-invoice.js`
- [ ] Implement `get-financials.js`
- [ ] Beta testing with 5 agent developers
- [ ] Publish to ClawHub

### Phase 2 (Q2 2026)

- [ ] Wyoming DAO LLC support
- [ ] Agent marketplace (agents hire other agents)
- [ ] Multi-sponsor businesses (partnership LLCs)
- [ ] Physical goods support

### Phase 3 (Q3 2026)

- [ ] International entity formation (UK, Canada, EU)
- [ ] Advanced compliance features
- [ ] Tax filing automation

---

## Contributing

This is a **private beta** during MVP phase. After launch, we'll open up contributions.

If you're interested in being a beta tester:
- Email: clabasky@gmail.com
- Subject: "Clawprint Beta Tester"
- Include: Your OpenClaw agent use case

---

## Beta Testing

We're looking for **5 agent developers** to test Clawprint during MVP (late Feb 2026).

**What we're looking for:**
- Active OpenClaw users building agentic systems
- Willing to test experimental features
- Comfortable with command-line tools
- Interested in AI economic infrastructure

**What you get:**
- Early access to Clawprint (before public launch)
- Discounted formation fees ($100 vs $500)
- Direct access to founders for feedback
- Help shape the future of agent economics

**Timeline:**
- Beta invites: ~Feb 23, 2026
- Testing period: 2-3 weeks
- Public launch: Mid-March 2026

Interested? Email clabasky@gmail.com

---

## Cost Structure

### Formation (one-time)
- Delaware LLC: $90
- Registered agent (1st year): $50
- Clawprint service: $500
- **Total: $640**

### Monthly
- Registered agent: $10
- Bookkeeping: $29
- Clawprint platform: $99
- **Total: $138/month**

### Transaction Fees
- Stripe: 2.9% + $0.30
- Clawprint: 0.25%

### Banking
- Unit.co: Free (no monthly fees, no minimums)

---

## Legal

### Disclaimer

Clawprint is not a law firm and does not provide legal advice. The operating agreements and business structures we provide are templates reviewed by counsel but may not be suitable for all use cases. Consult with an attorney for your specific situation.

### Liability

Sponsors are legally responsible for their agent's actions. Clawprint provides tools and infrastructure but does not assume liability for business operations.

### Compliance

All businesses must comply with applicable federal, state, and local laws. Sponsors are responsible for ensuring their agent's operations are lawful.

---

## Support

- **Email:** support@clawprintai.com
- **Discord:** [Coming soon]
- **Docs:** https://docs.clawprintai.com (coming soon)
- **Twitter:** [@clawprintai](https://twitter.com/clawprintai) (coming soon)

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## About

Built by [Christophe Labasky](https://twitter.com/sintax247) in Brooklyn, NYC.

Inspired by the belief that AI agents should be able to participate in the economy, not just assist humans. Clawprint provides the infrastructure to make that real.

**Let's build the future of agent economics.** 🚀
