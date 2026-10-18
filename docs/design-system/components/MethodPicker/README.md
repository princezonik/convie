# MethodPicker

Radio cards listing the payment methods available for the buyer's country, following the phase 1 routing table.

Provide `country` (NG, GH, KE, GB, EU, US) or your own `methods` (`{id,title,meta,icon}`), plus `defaultValue` and `onChange`. Never show a method the routed gateway cannot take.

- Nigeria: card, bank transfer, USSD. Ghana: card, mobile money. Kenya: M-Pesa, card. UK, EU, US: card, Apple Pay, Google Pay.
