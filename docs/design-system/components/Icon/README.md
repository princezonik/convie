# Icon

Outline icons on a 24px grid with a 1.75px stroke and round caps, drawn in `currentColor`.

Provide `name` (see `Convie.iconNames`), optional `size="sm"` (16px) and `label` when the icon stands alone and carries meaning. Server-rendered markup can use `<i data-icon="cart"></i>` placeholders and call `Convie.hydrateIcons()`.

- Do pair icons with a label in navigation and status.
- Don't use icons as decoration or recolor them outside the status tokens.
- This set was drawn for the system; replace it if a brand icon library is chosen.
