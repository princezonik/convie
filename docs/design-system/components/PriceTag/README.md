# PriceTag

A buyer-facing price: the charged amount in the buyer's currency, with the vendor's base amount and quoted rate beneath when the currencies differ.

Provide `minor`, `currency`, and for converted prices `baseMinor`, `baseCurrency`, `rate`. `size="lg"` on product detail.

- The converted price includes the FX spread (1.5% default). Say so on product detail and in checkout, not on every card.
- Same-currency prices show one line only.
