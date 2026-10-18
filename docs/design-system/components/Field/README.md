# Field

A labelled text input with hint or error. The label is always visible; placeholders are examples, never labels.

Props: `label`, `hint`, `error`, `placeholder`, `defaultValue`, `type`, `prefix` (currency or country code), `multiline`, `size="lg"` for buyer checkout, `inputProps` for anything else.

- Errors say what to fix: "BVN must be 11 digits".
- Use `prefix` for currency on price inputs and dial code on phone inputs.
