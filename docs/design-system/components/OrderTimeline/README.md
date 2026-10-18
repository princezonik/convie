# OrderTimeline

The lifecycle of an order or sub-order, oldest at top. Provide `events` (`{title,meta,state,icon}`, state = done | current | todo).

- Paid appears only after the payment service has verified the charge.
- Use it on buyer order detail, vendor order detail and admin lookup.
