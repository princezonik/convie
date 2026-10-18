# SideNav

The console navigation for vendor, admin and finance roles. Items come from the role's token claims; never show an item the role cannot open.

Props: `role`, `items` (`{value,label,icon,count}` or `{section}`), `current`, `account` (`{initials,name,meta}`).
