# Money

Formats an integer amount in minor units (kobo, pesewa, cents) with its ISO 4217 currency, per the currency's home locale.

Provide `minor` (integer) and `currency`; optional `whole` drops the decimals for display-only prices, never for ledgers, statements or payouts. Also exported as `Convie.formatMoney(minor, currency, opts)`.

- Never pass floats or decimal strings.
- Always tabular figures; right-align in tables.
