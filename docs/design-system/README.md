Convie is a multivendor marketplace: independent vendors in Nigeria, Ghana and Kenya sell to buyers there and in the UK, EU and US. A buyer pays once, in their own currency, for a basket from many vendors; each vendor is paid out in theirs. The interface has one job above all others: **make money legible**. Every price says which currency it is in, every balance says whether it is pending or available, and every movement can be traced to a reference.

The system serves four surfaces that share one set of tokens and components:

| Surface | Who | Shell | Pages |
| --- | --- | --- | --- |
| Storefront | Buyers (NG, GH, KE, UK, EU, US) | `TopNav`, max width `content-max` | Home, Search, Product, Vendor store, Cart, Checkout, Payment status, Orders, Order detail, Dispute, Sign in, Verify |
| Vendor console | `vendor_owner`, `vendor_staff` | `SideNav` + top bar | Application, KYC/KYB, Dashboard, Products, Product editor, Orders, Payouts, Disputes |
| Admin console | `admin` | `SideNav` + top bar | Vendor approvals, Listing moderation, Order lookup, Dispute decision, Payout holds |
| Finance console | `finance` | `SideNav` + top bar | Ledger, Reconciliation, FX exposure, Payout runs |

## Content fundamentals

- Write in plain, short sentences. Address the reader as "you"; Convie speaks as "we" only in policy and protection copy ("We hold the payment until you confirm delivery").
- Sentence case everywhere: buttons, titles, tabs, table headers. Overlines in `caption` are the only uppercase.
- Lead with the number, then the explanation: "₦184,000 available. Paid out Friday 24 Oct."
- Name money states exactly and consistently: **pending**, **available**, **paid out**, **on hold**, **refunded**. Never "processing" for a balance.
- Always show the currency. Buyer-facing prices show the charged currency first and the vendor's base price second: "£48.20 · ₦98,000 at 2,033.20". Never round away kobo, pesewa or cents in a ledger, statement or payout.
- Countries and methods by name: "M-Pesa", "USSD", "Ghana Card", "KRA PIN", "BVN". No jargon a vendor would not use ("subaccount" stays internal; say "payout account").
- Errors say what happened and what to do: "Your card was declined by the issuer. Try another card or pay by bank transfer." Never "Something went wrong" alone.
- No emoji, no exclamation marks, no urgency tricks ("Only 2 left!" is fine as a fact, not in red caps).

## Visual foundations

**Color.** The palette is warm paper (`surface`), deep green-black ink (`ink`) and Convie Green (`brand`) for action and settled money. Saffron (`accent`) brings market warmth to promotions, the FX-lock banner and new-vendor flags; it is a fill only, with `on-accent` text. Status colors are semantic and never decorative:

| State | Text / icon | Ground |
| --- | --- | --- |
| Paid, delivered, settled, approved | `brand` | `brand-soft` |
| Pending, awaiting review, on hold | `warning` | `warning-soft` |
| Shipped, in transit, info | `info` | `info-soft` |
| Failed, declined, disputed, break | `danger` | `danger-soft` |
| Draft, cancelled | `ink-muted` | `surface-sunken` |

`brand` and `danger` are close in lightness, so a status always carries a word, and an icon where space allows. Never use hue alone.

**Type.** `Bricolage Grotesque` (`display` family) is used only for `display-xl` and `display-lg`: storefront heroes and onboarding step titles. Everything else is `Instrument Sans` (`sans`), already the Laravel app's face. Ledger IDs, gateway references, SKUs and request IDs are `IBM Plex Mono` (`mono`). All amounts use tabular figures (`font-variant-numeric: tabular-nums`); `amount-lg` for balances and KPIs, `amount` for prices and totals.

**Spacing and layout.** A 4px scale (`space-1` to `space-16`). Storefront content sits in a centered column of `content-max` with a `space-10` gutter (`space-4` on phones). Consoles use a `sidenav-width` side navigation, a `topbar-height` top bar and `space-8` between sections. Controls are `control-height` (40px); buyer checkout controls grow to 48px for touch.

**Shape.** `radius-md` for buttons and cards, `radius-sm` for inputs, `radius-lg` for product imagery and modals, `radius-pill` for status pills and currency chips. Cards are `surface-raised` with a `line` hairline and `shadow-1`; floating layers (menus, sticky checkout summary, modals) use `shadow-2`. No left-border accent cards and no gradients.

**Imagery.** Product photography on `surface-sunken` at `radius-lg`, 1:1 in grids and 4:5 on product detail. Placeholders are flat `surface-sunken` blocks, never stock illustrations.

**States.** Hover darkens a brand fill to `brand-hover`; ghost and secondary controls take `surface-sunken`. Focus is a 2px solid `focus` ring with 2px offset on every interactive element. Disabled controls drop to 48% opacity and keep their layout. Loading replaces a button's label with a spinner of the same width.

**Motion.** 120ms ease-out for hover and press, 200ms for menus and drawers. The FX-lock countdown ticks without animation. Respect `prefers-reduced-motion` by removing transitions.

## Money patterns

- Store and pass amounts as integer minor units with an ISO 4217 code; format only at the edge with `Money` (`Intl.NumberFormat` by locale).
- A buyer-facing price is a `PriceTag`: charged amount in the buyer's currency, with the vendor's base amount and rate on request.
- Once checkout starts, show the `FxLock` banner with the 15-minute countdown. When it expires, re-quote and say what changed.
- A cart is grouped by vendor (`VendorCartGroup`), each group with its own shipping line. The order summary lists subtotal, shipping per vendor, tax per destination and the total, in that order.
- Vendor balances are always shown as a pair: pending (`accent-soft` tile) and available (`brand-soft` tile), with the next payout date.
- A paid state is shown only after the payment service has verified it; the payment status page says "Confirming with your bank" until then.

## Iconography

Convie has no icon set yet. The bundle's `Icon` component draws a small set of 24px, 1.75px-stroke outline icons with round caps (cart, search, store, package, truck, wallet, shield, check, alert, clock, globe, chevron, filter, user, file, arrow). Icons inherit `currentColor`, sit 4 to 8px from their label, and are never decorative fillers. Flag: this set was drawn for the system and should be replaced if a brand icon library is chosen.

## Logo

No logo exists in the source material. Set the name as the word "convie" in `display` at 700, lowercase, in `ink` (or `on-brand` on a brand fill). Do not draw a mark until one is provided.

## Using the components

Components are React 18 in `components/bundle.js` as `window.Convie`; the matching class names (prefix `cv-`) live in `components/bundle.css`, so server-rendered Blade views can use the same markup without React. Pages under the Pages groups are full-screen compositions of those classes, at 1280px, showing every screen the PRD calls for.

## Files in this repository

`tokens.json` is the source of every value. Run `node docs/design-system/build.js` to regenerate `tokens.css` and the standalone previews in `site/`; open `site/index.html` to browse every component and page. The live, editable copy is the Convie design system artifact on claude.ai.
