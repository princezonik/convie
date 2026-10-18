# DataTable

A plain table for orders, products, payouts, ledger entries and queues.

Provide `columns` (`{key,label,align,mono,render}`) and `rows` (objects; `_selected` and `_flag` highlight a row), optional `footer`.

- Right-align and use tabular figures for money; use `mono` for references.
- Every row with money shows its currency.
