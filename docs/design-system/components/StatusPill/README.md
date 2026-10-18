# StatusPill

A word and icon that name the state of an order, payment, payout, listing, KYC check or ledger line.

Provide `status` (one of the keys in `Convie.STATUS`: paid, pending, shipped, failed, disputed, on-hold, refunded, awaiting-review, new-vendor and more). Override the label with children only to add specifics ("Shipped · DHL").

- Tone follows meaning: success for settled money, warning for waiting, info for movement, danger for failure, neutral for draft and cancelled.
- Never show a pill without its word; brand green and danger red are close in lightness.
