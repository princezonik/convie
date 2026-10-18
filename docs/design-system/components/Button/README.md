# Button

The one control for actions. Variants: `primary` (one per view, the next step in a flow), `secondary`, `ghost` (toolbars, nav), `danger` (refunds, rejections, payout holds), `accent` (promotional only).

Props: `variant`, `size` (`sm` | `lg`), `icon`, `iconRight`, `loading`, `block`, plus any button attribute. Children are the label, in sentence case, starting with a verb ("Pay £96.40", "Mark as shipped").

- Do put the amount in payment buttons.
- Don't place two primary buttons side by side; demote one to secondary.
- Use `size="lg"` and `block` on buyer checkout and mobile.
