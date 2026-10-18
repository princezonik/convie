/* @ds-bundle: {"format":4,"namespace":"Convie","components":[{"name":"Icon"},{"name":"Button"},{"name":"StatusPill"},{"name":"Money"},{"name":"PriceTag"},{"name":"Field"},{"name":"Select"},{"name":"OtpInput"},{"name":"MethodPicker"},{"name":"Alert"},{"name":"FxLock"},{"name":"StatTile"},{"name":"DataTable"},{"name":"Tabs"},{"name":"Stepper"},{"name":"OrderTimeline"},{"name":"ProductCard"},{"name":"VendorCartGroup"},{"name":"OrderSummary"},{"name":"TopNav"},{"name":"SideNav"},{"name":"EmptyState"}]} */
(function () {
  var React = window.React;
  var h = React.createElement;
  var useState = React.useState, useEffect = React.useEffect;

  function cx() {
    var out = [];
    for (var i = 0; i < arguments.length; i++) if (arguments[i]) out.push(arguments[i]);
    return out.join(" ");
  }

  /* ---------- Icons: 24px grid, 1.75 stroke, round caps ---------- */
  var ICONS = {
    cart: ["M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 8H6.2", "c9,20,1.5", "c17,20,1.5"],
    search: ["c11,11,7", "M16.5 16.5L21 21"],
    store: ["M4 9l1.5-5h13L20 9", "M4 9v11h16V9", "M4 9a2.67 2.67 0 0 0 5.33 0 2.67 2.67 0 0 0 5.34 0A2.67 2.67 0 0 0 20 9", "M10 20v-5h4v5"],
    package: ["M12 3l8 4.5v9L12 21l-8-4.5v-9z", "M4 7.5l8 4.5 8-4.5", "M12 12v9"],
    truck: ["M3 6h11v10H3z", "M14 10h4l3 3v3h-7", "c7,18,1.8", "c17,18,1.8"],
    wallet: ["M4 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a1 1 0 0 1-1-1V7z", "M4 7l11-3v3", "M16 13.5h.01"],
    shield: ["M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z", "M9 12l2 2 4-4"],
    check: ["M5 12.5l4.5 4.5L19 7.5"],
    alert: ["M12 4l9 16H3z", "M12 10v4", "M12 17h.01"],
    info: ["c12,12,9", "M12 11v5", "M12 8h.01"],
    clock: ["c12,12,9", "M12 7v5l3 2"],
    globe: ["c12,12,9", "M3 12h18", "M12 3c2.5 2.8 3.5 5.8 3.5 9s-1 6.2-3.5 9c-2.5-2.8-3.5-5.8-3.5-9s1-6.2 3.5-9z"],
    chevron: ["M9 6l6 6-6 6"],
    chevronDown: ["M6 9l6 6 6-6"],
    chevronLeft: ["M15 6l-6 6 6 6"],
    filter: ["M4 6h16", "M7 12h10", "M10 18h4"],
    user: ["c12,8,4", "M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"],
    file: ["M6 3h8l4 4v14H6z", "M14 3v4h4", "M9 13h6", "M9 17h6"],
    arrow: ["M5 12h14", "M13 6l6 6-6 6"],
    grid: ["M4 4h7v7H4z", "M13 4h7v7h-7z", "M4 13h7v7H4z", "M13 13h7v7h-7z"],
    x: ["M6 6l12 12", "M18 6L6 18"],
    plus: ["M12 5v14", "M5 12h14"],
    bank: ["M3 10l9-6 9 6", "M5 10v8", "M9.5 10v8", "M14.5 10v8", "M19 10v8", "M3 20h18"],
    phone: ["M7 3h10v18H7z", "M11 18h2"],
    scale: ["M12 4v16", "M7 20h10", "M5 8h14", "M5 8l-3 6a3 3 0 0 0 6 0z", "M19 8l-3 6a3 3 0 0 0 6 0z"],
    book: ["M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z", "M5 17a3 3 0 0 1 3-3h11"],
    refresh: ["M20 11a8 8 0 1 0-2.3 5.7", "M20 5v6h-6"],
    lock: ["M6 11h12v9H6z", "M8.5 11V8a3.5 3.5 0 0 1 7 0v3"],
    upload: ["M12 16V4", "M7 9l5-5 5 5", "M5 20h14"],
    download: ["M12 4v12", "M7 11l5 5 5-5", "M5 20h14"],
    chart: ["M4 20V11", "M10 20V5", "M16 20v-6", "M3 20h18"],
    tag: ["M3 12V4h8l10 10-8 8z", "M7.5 8.5h.01"],
    card: ["M3 6h18v12H3z", "M3 10h18", "M7 15h4"],
    pause: ["M8 5v14", "M16 5v14"],
    star: ["M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"],
    swap: ["M4 8h14", "M14 4l4 4-4 4", "M20 16H6", "M10 12l-4 4 4 4"],
    mail: ["M3 6h18v12H3z", "M3 7l9 6 9-6"],
    eye: ["M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z", "c12,12,3"]
  };

  function svgString(name, extraClass) {
    var parts = ICONS[name] || ICONS.info, inner = "";
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (p.charAt(0) === "c") { var a = p.slice(1).split(","); inner += '<circle cx="' + a[0] + '" cy="' + a[1] + '" r="' + a[2] + '"/>'; }
      else inner += '<path d="' + p + '"/>';
    }
    return '<svg class="cv-icon' + (extraClass ? " " + extraClass : "") + '" viewBox="0 0 24 24" aria-hidden="true">' + inner + "</svg>";
  }

  function Icon(props) {
    var parts = ICONS[props.name] || ICONS.info;
    var kids = parts.map(function (p, i) {
      if (p.charAt(0) === "c") { var a = p.slice(1).split(","); return h("circle", { key: i, cx: a[0], cy: a[1], r: a[2] }); }
      return h("path", { key: i, d: p });
    });
    return h("svg", { className: cx("cv-icon", props.size === "sm" && "cv-icon-sm", props.className), viewBox: "0 0 24 24", "aria-hidden": props.label ? undefined : "true", role: props.label ? "img" : undefined, "aria-label": props.label }, kids);
  }

  /* Replace <i data-icon="name"></i> placeholders in server-rendered markup. */
  function hydrateIcons(root) {
    var nodes = (root || document).querySelectorAll("i[data-icon]");
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var span = document.createElement("span");
      span.innerHTML = svgString(n.getAttribute("data-icon"), n.getAttribute("data-size") === "sm" ? "cv-icon-sm" : "");
      n.replaceWith(span.firstChild);
    }
  }

  /* ---------- Money ---------- */
  var LOCALE = { NGN: "en-NG", GHS: "en-GH", KES: "en-KE", ZAR: "en-ZA", GBP: "en-GB", EUR: "en-IE", USD: "en-US" };
  function formatMoney(minor, currency, opts) {
    opts = opts || {};
    var cur = currency || "NGN";
    var fmt = new Intl.NumberFormat(opts.locale || LOCALE[cur] || "en", { style: "currency", currency: cur, currencyDisplay: "narrowSymbol", minimumFractionDigits: opts.whole ? 0 : 2, maximumFractionDigits: opts.whole ? 0 : 2 });
    return fmt.format((minor || 0) / 100);
  }
  function Money(props) {
    return h("span", { className: cx("cv-money", props.className) }, formatMoney(props.minor, props.currency, { whole: props.whole, locale: props.locale }));
  }

  function PriceTag(props) {
    var base = props.baseMinor != null && props.baseCurrency && props.baseCurrency !== props.currency;
    return h("div", { className: cx("cv-price", props.size === "lg" && "cv-price-lg") },
      h("span", { className: "cv-price-main" }, formatMoney(props.minor, props.currency)),
      base ? h("span", { className: "cv-price-base" }, formatMoney(props.baseMinor, props.baseCurrency, { whole: true }) + " from vendor" + (props.rate ? " · rate " + props.rate : "")) : null
    );
  }

  /* ---------- Actions ---------- */
  function Button(props) {
    var variant = props.variant || "primary";
    var rest = Object.assign({}, props);
    delete rest.variant; delete rest.size; delete rest.icon; delete rest.iconRight; delete rest.loading; delete rest.block;
    rest.className = cx("cv-btn", "cv-btn-" + variant, props.size && "cv-btn-" + props.size, props.block && "cv-btn-block", props.className);
    if (props.loading) { rest.disabled = true; rest["aria-busy"] = "true"; }
    return h("button", rest,
      props.loading ? h("span", { className: "cv-spinner", "aria-hidden": "true" }) : (props.icon ? h(Icon, { name: props.icon }) : null),
      props.loading ? h("span", { style: { position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" } }, props.children) : props.children,
      props.iconRight && !props.loading ? h(Icon, { name: props.iconRight }) : null);
  }

  /* ---------- Status ---------- */
  var STATUS = {
    paid: ["success", "check", "Paid"], delivered: ["success", "check", "Delivered"], settled: ["success", "check", "Settled"], approved: ["success", "check", "Approved"], available: ["success", "wallet", "Available"], live: ["success", "check", "Live"], "paid-out": ["success", "check", "Paid out"], verified: ["success", "shield", "Verified"], matched: ["success", "check", "Matched"],
    pending: ["warning", "clock", "Pending"], "awaiting-review": ["warning", "clock", "Awaiting review"], "on-hold": ["warning", "pause", "On hold"], confirming: ["warning", "clock", "Confirming"], processing: ["warning", "clock", "Processing"], "awaiting-shipment": ["warning", "package", "To ship"],
    shipped: ["info", "truck", "Shipped"], "in-transit": ["info", "truck", "In transit"], scheduled: ["info", "clock", "Scheduled"], open: ["info", "scale", "Open"],
    failed: ["danger", "alert", "Failed"], declined: ["danger", "alert", "Declined"], disputed: ["danger", "scale", "Disputed"], rejected: ["danger", "x", "Rejected"], "break": ["danger", "alert", "Break"], refunded: ["neutral", "refresh", "Refunded"],
    draft: ["neutral", "file", "Draft"], cancelled: ["neutral", "x", "Cancelled"],
    "new-vendor": ["accent", "star", "New vendor"]
  };
  function StatusPill(props) {
    var s = STATUS[props.status] || ["neutral", "info", props.status];
    return h("span", { className: cx("cv-pill", "cv-pill-" + s[0]) }, props.noIcon ? null : h(Icon, { name: s[1] }), props.children || s[2]);
  }

  /* ---------- Forms ---------- */
  var uid = 0;
  function Field(props) {
    var idRef = React.useRef(null);
    if (!idRef.current) idRef.current = props.id || "cv-f-" + (++uid);
    var id = idRef.current;
    var inputProps = Object.assign({}, props.inputProps || {}, { id: id, className: cx("cv-input", props.size === "lg" && "cv-input-lg", props.error && "cv-input-invalid", props.multiline && "cv-textarea"), "aria-invalid": props.error ? "true" : undefined, "aria-describedby": (props.hint || props.error) ? id + "-d" : undefined, placeholder: props.placeholder, defaultValue: props.defaultValue, type: props.type });
    var control = h(props.multiline ? "textarea" : "input", inputProps);
    if (props.prefix) control = h("div", { className: "cv-input-group" }, h("span", { className: "cv-addon" }, props.prefix), control);
    return h("div", { className: cx("cv-field", props.className) },
      h("label", { className: "cv-label", htmlFor: id }, props.label),
      control,
      props.error ? h("span", { className: "cv-error-text", id: id + "-d" }, h(Icon, { name: "alert", size: "sm" }), props.error)
        : props.hint ? h("span", { className: "cv-hint", id: id + "-d" }, props.hint) : null);
  }

  function Select(props) {
    var idRef = React.useRef(null);
    if (!idRef.current) idRef.current = "cv-s-" + (++uid);
    return h("div", { className: cx("cv-field", props.className) },
      props.label ? h("label", { className: "cv-label", htmlFor: idRef.current }, props.label) : null,
      h("select", { id: idRef.current, className: "cv-select", defaultValue: props.defaultValue, onChange: props.onChange },
        (props.options || []).map(function (o) { var v = typeof o === "string" ? o : o.value; return h("option", { key: v, value: v }, typeof o === "string" ? o : o.label); })),
      props.hint ? h("span", { className: "cv-hint" }, props.hint) : null);
  }

  function OtpInput(props) {
    var n = props.length || 6, kids = [];
    for (var i = 0; i < n; i++) kids.push(h("input", { key: i, inputMode: "numeric", maxLength: 1, "aria-label": "Digit " + (i + 1), defaultValue: props.value ? props.value.charAt(i) : "" }));
    return h("div", { className: "cv-otp", role: "group", "aria-label": props.label || "Verification code" }, kids);
  }

  /* Payment methods per buyer country (routing table, PRD phase 1). */
  var METHODS = {
    NG: [{ id: "card", title: "Card", meta: "Visa, Mastercard, Verve", icon: "card" }, { id: "transfer", title: "Bank transfer", meta: "Pay into a one-time account number", icon: "bank" }, { id: "ussd", title: "USSD", meta: "Dial a code from your bank line", icon: "phone" }],
    GH: [{ id: "card", title: "Card", meta: "Visa, Mastercard", icon: "card" }, { id: "momo", title: "Mobile money", meta: "MTN, Telecel, AirtelTigo", icon: "phone" }],
    KE: [{ id: "mpesa", title: "M-Pesa", meta: "STK push to your phone", icon: "phone" }, { id: "card", title: "Card", meta: "Visa, Mastercard", icon: "card" }],
    GB: [{ id: "card", title: "Card", meta: "Visa, Mastercard, Amex", icon: "card" }, { id: "apple", title: "Apple Pay", meta: "", icon: "phone" }, { id: "google", title: "Google Pay", meta: "", icon: "phone" }]
  };
  METHODS.EU = METHODS.GB; METHODS.US = METHODS.GB;
  function MethodPicker(props) {
    var list = props.methods || METHODS[props.country || "NG"] || METHODS.NG;
    var st = useState(props.defaultValue || list[0].id), sel = st[0], setSel = st[1];
    return h("div", { className: "cv-stack", role: "radiogroup", "aria-label": "Payment method", style: { gap: 8 } },
      list.map(function (m) {
        var on = m.id === sel;
        return h("div", { key: m.id, className: cx("cv-option", on && "cv-option-on"), role: "radio", "aria-checked": on ? "true" : "false", tabIndex: 0, onClick: function () { setSel(m.id); if (props.onChange) props.onChange(m.id); } },
          h("span", { className: "cv-radio" }), h(Icon, { name: m.icon }),
          h("div", { className: "cv-option-body" }, h("div", { className: "cv-option-title" }, m.title), m.meta ? h("div", { className: "cv-option-meta" }, m.meta) : null));
      }));
  }

  /* ---------- Feedback ---------- */
  var ALERT_ICON = { info: "info", success: "check", warning: "alert", danger: "alert" };
  function Alert(props) {
    var tone = props.tone || "info";
    return h("div", { className: cx("cv-alert", "cv-alert-" + tone), role: tone === "danger" ? "alert" : "status" },
      h(Icon, { name: ALERT_ICON[tone] }),
      h("div", null, props.title ? h("div", { className: "cv-alert-title" }, props.title) : null, props.children));
  }

  function FxLock(props) {
    var st = useState(props.seconds != null ? props.seconds : 900), left = st[0], setLeft = st[1];
    useEffect(function () {
      if (left <= 0) return;
      var t = setTimeout(function () { setLeft(left - 1); }, 1000);
      return function () { clearTimeout(t); };
    }, [left]);
    var mm = Math.floor(left / 60), ss = left % 60;
    if (left <= 0) return h("div", { className: "cv-fxlock cv-fxlock-expired", role: "status" }, h(Icon, { name: "refresh" }), h("span", null, "Your rate expired. We re-quoted your basket at today's rate."), props.onRequote ? h("button", { className: "cv-btn cv-btn-secondary cv-btn-sm", style: { marginLeft: "auto" }, onClick: props.onRequote }, "Review new total") : null);
    return h("div", { className: "cv-fxlock", role: "timer", "aria-live": "off" },
      h(Icon, { name: "lock" }),
      h("span", null, "Price locked at ", h("b", null, props.rate || "1 GBP = 2,033.20 NGN"), ". Pay before it expires."),
      h("span", { className: "cv-fxlock-time" }, mm + ":" + (ss < 10 ? "0" : "") + ss));
  }

  function StatTile(props) {
    return h("div", { className: cx("cv-stat", props.tone && "cv-stat-" + props.tone) },
      h("div", { className: "cv-stat-label" }, props.icon ? h(Icon, { name: props.icon, size: "sm" }) : null, props.label),
      h("div", { className: "cv-stat-value" }, props.value),
      props.meta ? h("div", { className: "cv-stat-meta" }, props.delta ? h("span", { className: props.delta.charAt(0) === "-" ? "cv-delta-down" : "cv-delta-up" }, props.delta + " ") : null, props.meta) : null);
  }

  function EmptyState(props) {
    return h("div", { className: "cv-empty" },
      h("div", { className: "cv-empty-icon" }, h(Icon, { name: props.icon || "package" })),
      h("div", { className: "cv-h3" }, props.title),
      props.children ? h("div", { className: "cv-muted", style: { maxWidth: 360 } }, props.children) : null,
      props.action || null);
  }

  /* ---------- Data ---------- */
  function DataTable(props) {
    var cols = props.columns || [];
    return h("div", { className: "cv-card cv-card-flush" },
      h("table", { className: "cv-table" },
        h("thead", null, h("tr", null, cols.map(function (c) { return h("th", { key: c.key, className: c.align === "right" ? "cv-r" : undefined, scope: "col" }, c.label); }))),
        h("tbody", null, (props.rows || []).map(function (r, i) {
          return h("tr", { key: r.id || i, className: r._flag ? "cv-flag" : r._selected ? "cv-selected" : undefined },
            cols.map(function (c) { return h("td", { key: c.key, className: cx(c.align === "right" && "cv-r cv-num", c.mono && "cv-mono") }, c.render ? c.render(r) : r[c.key]); }));
        }))),
      props.footer ? h("div", { className: "cv-table-foot" }, props.footer) : null);
  }

  function Tabs(props) {
    var st = useState(props.defaultValue || (props.items[0] && props.items[0].value)), cur = st[0], setCur = st[1];
    return h("div", { className: "cv-tabs", role: "tablist" }, props.items.map(function (t) {
      var on = t.value === cur;
      return h("button", { key: t.value, role: "tab", "aria-selected": on ? "true" : "false", className: cx("cv-tab", on && "cv-tab-on"), onClick: function () { setCur(t.value); if (props.onChange) props.onChange(t.value); } },
        t.label, t.count != null ? h("span", { className: "cv-count" }, t.count) : null);
    }));
  }

  function Stepper(props) {
    var cur = props.current || 0, kids = [];
    props.steps.forEach(function (s, i) {
      if (i > 0) kids.push(h("li", { key: "sep" + i, className: "cv-step-sep", "aria-hidden": "true" }));
      var state = i < cur ? "done" : i === cur ? "current" : "todo";
      kids.push(h("li", { key: i, className: cx("cv-step", "cv-step-" + state), "aria-current": state === "current" ? "step" : undefined },
        h("span", { className: "cv-step-dot" }, state === "done" ? h(Icon, { name: "check", size: "sm" }) : i + 1), s));
    });
    return h("ol", { className: "cv-stepper" }, kids);
  }

  function OrderTimeline(props) {
    return h("ol", { className: "cv-timeline" }, props.events.map(function (e, i) {
      return h("li", { key: i, className: cx("cv-tl-item", e.state === "done" && "cv-tl-done", e.state === "current" && "cv-tl-current") },
        h("span", { className: "cv-tl-dot" }, h(Icon, { name: e.icon || (e.state === "done" ? "check" : "clock"), size: "sm" })),
        h("div", null, h("div", { className: "cv-tl-title" }, e.title), e.meta ? h("div", { className: "cv-tl-meta" }, e.meta) : null));
    }));
  }

  /* ---------- Commerce ---------- */
  function ProductCard(props) {
    return h("a", { className: "cv-product", href: props.href || "#" },
      h("div", { className: "cv-product-img" },
        props.image ? h("img", { src: props.image, alt: props.name, style: { width: "100%", height: "100%", objectFit: "cover" } }) : h("div", { className: "cv-art cv-art-" + (props.art || "a") }),
        props.badge ? h(StatusPill, { status: props.badge, noIcon: true }) : null),
      h("div", { className: "cv-product-name" }, props.name),
      h("div", { className: "cv-product-vendor" }, h(Icon, { name: "store", size: "sm" }), props.vendor, props.origin ? " · " + props.origin : ""),
      h(PriceTag, { minor: props.minor, currency: props.currency, baseMinor: props.baseMinor, baseCurrency: props.baseCurrency }),
      props.rating ? h("span", { className: "cv-rating" }, h("span", { className: "cv-stars", "aria-hidden": "true" }, "★"), props.rating, props.reviews ? " (" + props.reviews + ")" : "") : null);
  }

  function VendorCartGroup(props) {
    var v = props.vendor || {};
    return h("section", { className: "cv-vgroup", "aria-label": "Items from " + v.name },
      h("header", { className: "cv-vgroup-head" },
        h("span", { className: "cv-avatar" }, (v.name || "?").charAt(0)),
        h("div", { style: { flex: 1 } }, h("div", { className: "cv-h3" }, v.name), h("div", { className: "cv-small cv-muted" }, "Ships from " + v.origin + (v.eta ? " · " + v.eta : ""))),
        v.isNew ? h(StatusPill, { status: "new-vendor" }) : null),
      (props.items || []).map(function (it, i) {
        return h("div", { key: i, className: "cv-vgroup-line" },
          h("div", { className: "cv-thumb" }, h("div", { className: "cv-art cv-art-" + (it.art || "a") })),
          h("div", null, h("div", { style: { fontWeight: 600 } }, it.name), h("div", { className: "cv-small cv-muted" }, it.variant), it.lowStock ? h("div", { className: "cv-small", style: { color: "var(--warning)" } }, it.lowStock) : null),
          h("div", { className: "cv-qty" }, h("button", { "aria-label": "Decrease" }, "−"), h("span", null, it.qty), h("button", { "aria-label": "Increase" }, "+")),
          h(PriceTag, { minor: it.minor, currency: props.currency, baseMinor: it.baseMinor, baseCurrency: v.currency }));
      }),
      h("footer", { className: "cv-vgroup-foot" }, h("span", null, "Shipping · " + (props.shippingLabel || "Standard")), h("span", { className: "cv-num", style: { color: "var(--ink)", fontWeight: 600 } }, formatMoney(props.shippingMinor, props.currency))));
  }

  function OrderSummary(props) {
    var cur = props.currency;
    return h("div", { className: "cv-summary" },
      (props.lines || []).map(function (l, i) { return h("div", { key: i, className: "cv-summary-row" }, h("span", { className: l.muted ? "cv-muted" : undefined }, l.label), h("span", null, formatMoney(l.minor, cur))); }),
      h("div", { className: "cv-summary-row cv-summary-total" }, h("span", null, "Total"), h("span", null, formatMoney(props.totalMinor, cur))),
      props.note ? h("div", { className: "cv-small cv-muted" }, props.note) : null);
  }

  /* ---------- Shells ---------- */
  function TopNav(props) {
    return h("header", { className: "cv-topnav" },
      h("a", { className: "cv-wordmark", href: "#" }, "convie"),
      h("div", { className: "cv-search", role: "search" }, h(Icon, { name: "search", size: "sm" }), h("span", null, props.query || "Search products, vendors and categories")),
      h("div", { className: "cv-topnav-actions" },
        h("span", { className: "cv-locale" }, h(Icon, { name: "globe", size: "sm" }), (props.country || "UK") + " · " + (props.currency || "GBP")),
        h("button", { className: "cv-btn cv-btn-ghost" }, h(Icon, { name: "user" }), props.user || "Sign in"),
        h("button", { className: "cv-btn cv-btn-ghost cv-cart-btn", "aria-label": "Cart, " + (props.cartCount || 0) + " items" }, h(Icon, { name: "cart" }), props.cartCount ? h("span", { className: "cv-cart-count" }, props.cartCount) : null)));
  }

  function SideNav(props) {
    return h("nav", { className: "cv-sidenav", "aria-label": props.role + " navigation" },
      h("div", { className: "cv-wordmark" }, "convie", h("span", { className: "cv-sidenav-role" }, props.role)),
      (props.items || []).map(function (it, i) {
        if (it.section) return h("div", { key: i, className: "cv-navsection" }, it.section);
        return h("a", { key: i, href: "#", className: cx("cv-navitem", it.value === props.current && "cv-navitem-on"), "aria-current": it.value === props.current ? "page" : undefined },
          h(Icon, { name: it.icon }), it.label, it.count ? h("span", { className: "cv-count" }, it.count) : null);
      }),
      props.account ? h("div", { className: "cv-nav-foot" }, h("span", { className: "cv-avatar" }, props.account.initials), h("div", null, h("div", { style: { color: "var(--ink)", fontWeight: 600 } }, props.account.name), props.account.meta)) : null);
  }

  window.Convie = Object.assign(window.Convie || {}, {
    Icon: Icon, Button: Button, StatusPill: StatusPill, Money: Money, PriceTag: PriceTag, Field: Field, Select: Select, OtpInput: OtpInput, MethodPicker: MethodPicker,
    Alert: Alert, FxLock: FxLock, StatTile: StatTile, DataTable: DataTable, Tabs: Tabs, Stepper: Stepper, OrderTimeline: OrderTimeline, ProductCard: ProductCard,
    VendorCartGroup: VendorCartGroup, OrderSummary: OrderSummary, TopNav: TopNav, SideNav: SideNav, EmptyState: EmptyState,
    formatMoney: formatMoney, hydrateIcons: hydrateIcons, iconNames: Object.keys(ICONS), STATUS: STATUS, METHODS: METHODS
  });
})();
