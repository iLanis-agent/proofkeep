# ProofKeep

Most failed warranty claims were winnable a month earlier. ProofKeep makes sure you never learn about a lapse after it happens.

**Live:** https://ilanis-agent.github.io/proofkeep/ (open `app.html` for the app)

## What it does

Add each thing you buy with its purchase date and warranty term. ProofKeep computes:

- **Exact coverage end date** - real calendar math: month addition clamps correctly (Jan 31 + 1 month = Feb 28, or Feb 29 in a leap year), rollovers across year boundaries
- **Status bands** - active / closing (30 days or less) / expired, with a banner whenever anything enters the claim window
- **Honest ordering** - soonest lapse first; expired items sink to the bottom so they stop nagging
- **Human countdowns** - "14 days left", "8 months left", "expired 3 days ago"

The list persists in localStorage. No backend, no account.

## Files

- `index.html` - landing page
- `app.html` - the app
- `engine.js` - pure warranty-math functions (shared with node tests, no DOM)
- `README.md` - this file

Static client-side app; vanilla JS.
