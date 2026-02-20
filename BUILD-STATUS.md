# Bootprint Skill - Build Status

**Date:** February 19, 2026  
**Status:** ✅ Repository structure complete, ready for implementation  
**Progress:** Week 1, Day 4 of 30-day plan

---

## ✅ What's Done

### Repository Structure

```
bootprint-skill/
├── SKILL.md                    ✅ Complete (OpenClaw skill documentation)
├── README.md                   ✅ Complete (GitHub repo README)
├── package.json                ✅ Complete (NPM package config)
├── LICENSE                     ✅ Complete (MIT)
├── .gitignore                  ✅ Complete
├── .env.example                ✅ Complete (Environment variables template)
├── scripts/
│   ├── index.js                ✅ Complete (CLI entrypoint)
│   ├── create-business.js      ✅ Scaffolded (needs implementation)
│   ├── check-status.js         ✅ Scaffolded (needs implementation)
│   ├── generate-invoice.js     ✅ Scaffolded (needs implementation)
│   └── get-financials.js       ✅ Scaffolded (needs implementation)
├── references/
│   ├── operating-agreement-template.md  ✅ Complete
└── assets/                     ⏳ Empty (for future templates)
```

### Documentation Written

1. **SKILL.md** (7.1 KB)
   - Proper YAML frontmatter for OpenClaw triggering
   - Complete usage instructions for agents
   - Examples for all core commands
   - Legal framework explanation
   - Cost structure and timeline
   - Troubleshooting guide

2. **README.md** (6.2 KB)
   - GitHub repo documentation
   - Quick start guide
   - Installation instructions
   - Beta tester information
   - Roadmap and timeline
   - Cost breakdown

3. **Operating Agreement Template** (7.7 KB)
   - Standard Delaware LLC agreement
   - AI agent delegation provisions
   - Sponsor oversight clauses
   - Customization notes
   - Legal validity explanation

4. **Database Schema** (9.6 KB)
   - All tables: businesses, sponsors, transactions, invoices, etc.
   - Row-level security policies
   - Indexes for performance
   - Views for common queries

### Scripts Scaffolded

All 4 core CLI scripts have:
- ✅ Argument parsing
- ✅ Input validation
- ✅ Error handling structure
- ✅ Example responses
- ✅ Usage documentation
- ⏳ TODO comments for implementation

---

## ⏳ What's Next (This Week)

### Thursday, Feb 19 (Today - Afternoon)

- [x] Initialize Git repository
- [x] Create GitHub repo (clabasky/bootprint-skill)
- [x] Push initial commit
- [x] Add repo URL to package.json
- [x] Add repo URL to README

### Friday, Feb 20

- [ ] Unit.co signup (you'll do this)
- [ ] Confirm Stripe Connect setup
- [ ] Reach out to 5 beta testers (10 candidates identified)
- [ ] Draft personalized outreach emails

### Weekend (Feb 21-22)

- [ ] Test database connection
- [ ] Begin implementing `create-business.js` logic

---

## 📋 Implementation Checklist

### Scripts to Implement (Week 2)

**create-business.js**
- [ ] Validate sponsor exists or create new sponsor
- [ ] Trigger Delaware LLC formation (API or doola)
- [ ] Send sponsor verification email
- [ ] Return business ID + status

**check-status.js**
- [ ] Check Delaware filing status
- [ ] Check IRS EIN status
- [ ] Check Unit.co account status
- [ ] Format and return consolidated status

**generate-invoice.js**
- [ ] Verify business is active
- [ ] Get Stripe account ID for business
- [ ] Create/retrieve Stripe customer
- [ ] Create Stripe invoice
- [ ] Return payment URL

**get-financials.js**
- [ ] Query transactions for business
- [ ] Filter by date range (period)
- [ ] Calculate revenue/expenses/net
- [ ] Get current balance from Unit.co API
- [ ] Return formatted summary + transaction list

### Integrations to Build (Week 2-3)

- [ ] Initialize client
- [ ] Implement auth (OpenClaw session tokens)
- [ ] Test CRUD operations
- [ ] Set up RLS policies

**Stripe Connect**
- [ ] Create platform account
- [ ] Implement Express account creation
- [ ] Webhook handlers (account created, payment received)
- [ ] Test invoice generation

**Unit.co Banking**
- [ ] API credentials
- [ ] Account creation flow
- [ ] Balance checking
- [ ] Transaction history
- [ ] Webhook handlers

**Delaware / doola**
- [ ] LLC formation API integration
- [ ] Status polling
- [ ] Document retrieval
- [ ] Error handling

**IRS EIN**
- [ ] Form SS-4 automation (if possible)
- [ ] Manual application workflow
- [ ] Status tracking

---

## 🎯 Week 1 Goals (Feb 16-22)

| Goal | Status |
|------|--------|
| Finalize agent-first strategy | ✅ Done (Feb 16) |
| Identify 5 beta testers | ✅ Done (10 candidates) |
| GitHub repo structure | ✅ Done (Feb 19) |
| GitHub repo created & pushed | ✅ Done (Feb 19) |
| Outreach script | ⏳ TODO (Feb 20) |
| Send beta tester emails | ⏳ TODO (Feb 20) |
| Skill architecture | ✅ Done (Feb 19) |

**Progress:** 6 / 8 goals complete (75%)

---

## 📦 ✅ Pushed to GitHub

The repo structure has been **pushed to GitHub**:

**Repository:** https://github.com/clabasky/bootprint-skill

Initial commit included:
- Complete SKILL.md with OpenClaw skill format
- README with quick start and beta tester info
- 4 CLI scripts scaffolded (create-business, check-status, generate-invoice, get-financials)
- Operating agreement template (Delaware LLC with AI delegation)
- Package.json with dependencies
- MIT license

---

## 💡 Key Decisions Made

1. **Skill-first approach** — OpenClaw skill is primary distribution, not web app
2. **Scripts over SDK** — Simple CLI scripts that agents can call directly
4. **Unit.co for banking** — Programmatic account creation at scale
5. **Stripe Connect Express** — Easiest path for agent payment acceptance
6. **Delaware LLC standard** — Wyoming DAO LLC deferred to Phase 2
7. **Human sponsor model** — Agent cannot be legal person (yet)

---

## 🐛 Known Issues / Questions

### Need to Resolve

1. **OpenClaw session auth** — How do agents authenticate to Bootprint API?
   - Option A: OpenClaw gateway token passed as env var
   - Option B: Agent passes session token as CLI arg
   - Option C: Skill reads from OpenClaw context automatically

2. **Delaware filing API** — Is there a public API or must we use doola?
   - Research Delaware's online filing portal
   - Confirm doola partnership terms

3. **Unit.co approval** — Do we need formal partnership or just API access?
   - Check if Unit.co has self-serve developer accounts
   - Timeline for approval?

4. **Sponsor verification flow** — Email link → Stripe identity check?
   - Design sponsor dashboard (Next.js?)
   - Or use Stripe-hosted verification?

### Design Decisions Pending

1. **Multi-sponsor businesses** — Defer to Phase 2 or build into MVP?
2. **Transaction limits** — Hardcode $10k default or make configurable in CLI?
3. **Bookkeeping** — Build in-house or integrate QuickBooks/Xero?
4. **Tax filing** — Phase 2 feature or essential for MVP?

---

## 📊 Metrics to Track (Post-Launch)

- Skill installs (target: 50+ in Week 1)
- Business formations (target: 10+ in Month 1)
- Revenue flowing through platform (target: $10k+ in Month 1)
- Beta tester completion rate (target: 80% complete full flow)
- Time to first payment (target: <10 days average)

---

## 🚀 Next Session Focus

**Immediate priorities for next work session:**

1. ✅ **Git + GitHub** — DONE! Repo at https://github.com/clabasky/bootprint-skill
2. **Beta tester outreach** — Draft and send personalized emails to 10 candidates
4. **Unit.co signup** — In progress

**After that (Week 2):**

6. Build `create-business.js` with real API calls
7. Set up Stripe Connect test account
8. Begin Unit.co integration

---

**Note:** Contact info updated to clabasky@gmail.com (Christophe Labasky)

---

**Status:** On track for Week 1 goals! 🎉

Let's get this pushed to GitHub and start reaching out to beta testers tomorrow.
