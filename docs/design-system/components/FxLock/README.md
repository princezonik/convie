# FxLock

The 15-minute rate lock shown from the moment checkout starts. It counts down and, at zero, switches to a re-quote notice.

Props: `rate` (display string), `seconds` (remaining; default 900), `onRequote`.

- Show it above the order summary on checkout and on the payment step.
- Never hide the total change after a re-quote; show old and new.
