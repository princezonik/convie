# VendorCartGroup

One vendor's items in the cart, with its own shipping line. The cart is always grouped by vendor because each becomes a sub-order.

Provide `vendor` (`{name,origin,eta,currency,isNew}`), `items` (`{name,variant,qty,minor,baseMinor,lowStock,art}`), `currency` (the buyer's), `shippingMinor`, `shippingLabel`.

- Stock is checked at add and at checkout; show a low-stock note under the item, not a modal.
