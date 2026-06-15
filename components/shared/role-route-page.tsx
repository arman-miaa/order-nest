type RoleRoutePageProps = {
  role: "manager" | "staff" | "kitchen";
  title: string;
  description?: string;
};

type Mode =
  | "dashboard"
  | "table"
  | "order"
  | "menu"
  | "alerts"
  | "queue"
  | "station"
  | "profile"
  | "settings"
  | "generic";

const roleTheme = {
  manager: {
    accent: "from-[#5a1020] via-[#8b2638] to-[#c2415f]",
    border: "border-[#7f2436]/30",
    glow: "shadow-[0_0_0_1px_rgba(127,36,54,0.18),0_24px_80px_rgba(15,23,42,0.16)]",
  },
  staff: {
    accent: "from-[#0f4c81] via-[#1e6fb7] to-[#4a9ff0]",
    border: "border-[#1e6fb7]/30",
    glow: "shadow-[0_0_0_1px_rgba(30,111,183,0.18),0_24px_80px_rgba(15,23,42,0.16)]",
  },
  kitchen: {
    accent: "from-[#8f3a12] via-[#d97706] to-[#f59e0b]",
    border: "border-[#d97706]/30",
    glow: "shadow-[0_0_0_1px_rgba(217,119,6,0.18),0_24px_80px_rgba(15,23,42,0.16)]",
  },
};

function getMode(title: string): Mode {
  const value = title.toLowerCase();

  if (value.includes("dashboard")) return "dashboard";
  if (value.includes("table")) return "table";
  if (value.includes("order") || value.includes("serve")) return "order";
  if (value.includes("menu") || value.includes("item")) return "menu";
  if (value.includes("alert")) return "alerts";
  if (value.includes("queue") || value.includes("kitchen")) return "queue";
  if (value.includes("station")) return "station";
  if (value.includes("profile")) return "profile";
  if (value.includes("setting")) return "settings";

  return "generic";
}

function getStats(role: RoleRoutePageProps["role"], mode: Mode) {
  const base = {
    manager: { one: "24", two: "08", three: "05" },
    staff: { one: "12", two: "17", three: "04" },
    kitchen: { one: "18", two: "06", three: "09" },
  }[role];

  if (mode === "table") {
    return [
      { label: "Available", value: "14", note: "ready to seat" },
      { label: "Occupied", value: "08", note: "active guests" },
      { label: "Dirty", value: "03", note: "needs clearing" },
    ];
  }

  if (mode === "order" || mode === "queue") {
    return [
      { label: "Queued", value: base.one, note: "awaiting prep" },
      { label: "Cooking", value: base.two, note: "in progress" },
      { label: "Ready", value: base.three, note: "waiting on serve" },
    ];
  }

  if (mode === "menu") {
    return [
      { label: "Items", value: "128", note: "catalogued" },
      { label: "86 Items", value: "06", note: "blocked now" },
      { label: "Categories", value: "11", note: "menu sections" },
    ];
  }

  if (mode === "alerts") {
    return [
      { label: "Critical", value: "02", note: "red alerts" },
      { label: "Delayed", value: "07", note: "watch closely" },
      { label: "Open", value: "11", note: "action needed" },
    ];
  }

  if (mode === "station") {
    return [
      { label: "Grill", value: "09", note: "tickets" },
      { label: "Fry", value: "05", note: "tickets" },
      { label: "Prep", value: "04", note: "tickets" },
    ];
  }

  if (mode === "profile") {
    return [
      { label: "Shift", value: "8h", note: "today" },
      { label: "Role", value: role, note: "access" },
      { label: "Status", value: "Online", note: "synced" },
    ];
  }

  if (mode === "settings") {
    return [
      { label: "Sync", value: "Live", note: "server-first" },
      { label: "Offline", value: "On", note: "fallback enabled" },
      { label: "Rules", value: "Locked", note: "state guarded" },
    ];
  }

  return [
    { label: "Live", value: base.one, note: "active" },
    { label: "Next", value: base.two, note: "up next" },
    { label: "Watch", value: base.three, note: "priority" },
  ];
}

function getPreview(role: RoleRoutePageProps["role"], mode: Mode, title: string) {
  if (mode === "table") {
    return [
      { name: "Table 01", detail: "2 guests", state: "Occupied" },
      { name: "Table 04", detail: "4 guests", state: "Dirty" },
      { name: "Table 07", detail: "Reserved", state: "Available" },
      { name: "Table 12", detail: "VIP", state: "Occupied" },
    ];
  }

  if (mode === "menu") {
    return [
      { name: "Classic Burger", detail: "8 min prep", state: "86 safe" },
      { name: "Chicken Alfredo", detail: "12 min prep", state: "Active" },
      { name: "Lemon Soda", detail: "1 min prep", state: "Ready" },
      { name: "Cheese Fries", detail: "6 min prep", state: "Seasonal" },
    ];
  }

  if (mode === "alerts") {
    return [
      { name: "Delayed Order #1842", detail: "table 08", state: "Red" },
      { name: "Item 86: Salmon", detail: "blocked by manager", state: "Action" },
      { name: "Kitchen Sync", detail: "2s ago", state: "Healthy" },
      { name: "VIP Table 02", detail: "priority bumped", state: "Notice" },
    ];
  }

  if (mode === "station" || mode === "queue") {
    return [
      { name: "Order #2041", detail: "prep time 8 min", state: "Grill" },
      { name: "Order #2042", detail: "prep time 11 min", state: "Fry" },
      { name: "Order #2043", detail: "prep time 4 min", state: "Prep" },
      { name: "Order #2044", detail: "overdue 3 min", state: "Hot" },
    ];
  }

  if (mode === "profile") {
    return [
      { name: "Amina Rahman", detail: "shift lead", state: "Verified" },
      { name: "Device", detail: "tablet connected", state: "Online" },
      { name: "Permissions", detail: "service + clearing", state: "Granted" },
      { name: "Last sync", detail: "14 seconds ago", state: "Good" },
    ];
  }

  if (mode === "settings") {
    return [
      { name: "WebSocket sync", detail: "live updates", state: "Enabled" },
      { name: "Polling fallback", detail: "when disconnected", state: "Enabled" },
      { name: "Duplicate guard", detail: "idempotent submit", state: "Locked" },
      { name: "State rollback", detail: "served lock", state: "Disabled" },
    ];
  }

  if (mode === "order" || mode === "dashboard" || mode === "generic") {
    return [
      { name: "Order #2410", detail: "table 03", state: "Cooking" },
      { name: "Order #2411", detail: "table 07", state: "Ready" },
      { name: "Order #2412", detail: "table 12", state: "VIP" },
      { name: "Order #2413", detail: "table 05", state: "Queued" },
    ];
  }

  return [
    { name: `${role} live card`, detail: title, state: "Ready" },
    { name: "Dummy item A", detail: "placeholder data", state: "Alpha" },
    { name: "Dummy item B", detail: "placeholder data", state: "Beta" },
    { name: "Dummy item C", detail: "placeholder data", state: "Gamma" },
  ];
}

export function RoleRoutePage({ role, title, description }: RoleRoutePageProps) {
  const mode = getMode(title);
  const theme = roleTheme[role];
  const stats = getStats(role, mode);
  const preview = getPreview(role, mode, title);

  return (
    <div className="space-y-6 pb-10">
      <section className={`overflow-hidden rounded-3xl border bg-slate-950 text-white ${theme.border} ${theme.glow}`}>
        <div className={`bg-linear-to-r ${theme.accent} p-px`}>
          <div className="relative overflow-hidden rounded-[23px] bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_28%),linear-gradient(180deg,#0f172a_0%,#111827_100%)] p-6 md:p-8">
            <div className="absolute inset-0 opacity-25 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-size-[52px_52px]" />
            <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                  {role} workspace
                </p>
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
                  {title}
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-white/70 md:text-base">
                  {description ?? "Dummy content is in place here and can be replaced with API data later."}
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  {[role, mode, "dummy data", "api-ready"].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white/80"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/8 p-5 backdrop-blur">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/60">
                  Live snapshot
                </p>
                <div className="mt-4 grid gap-3 text-sm text-white/80">
                  <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                    Server controlled state, no manual sort, no rollback after served.
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                    WebSocket first, polling fallback, and duplicate-safe submissions.
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                    Dummy data only, ready to swap with API response later.
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-6 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/7 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">{stat.label}</p>
                  <div className="mt-2 flex items-end justify-between gap-3">
                    <span className="text-3xl font-semibold text-white">{stat.value}</span>
                    <span className="text-xs text-white/55">{stat.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">{title} board</h2>
              <p className="mt-1 text-sm text-slate-600">
                Visual dummy data for the current route.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              preview
            </span>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {preview.map((item) => (
              <div key={item.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold text-slate-950">{item.name}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm">
                    {item.state}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">What this page will connect to</h2>
          <div className="mt-5 space-y-3">
            {[
              "REST CRUD endpoints for initial load and edits",
              "WebSocket event stream for live sync",
              "Server-owned state for all status updates",
              "Offline queue on staff devices and reconnect sync",
            ].map((line) => (
              <div key={line} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                {line}
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-sm text-slate-300">
            {mode === "order"
              ? "Dummy order rows are ready for item-level status, prep time, and due time."
              : mode === "table"
                ? "Dummy table tiles are ready for occupied, dirty, blocked, and available states."
                : mode === "menu"
                  ? "Dummy menu rows can later wire to 86 updates, pricing, and category edits."
                  : mode === "alerts"
                    ? "Dummy alert cards can later connect to delayed orders and out-of-stock notifications."
                    : mode === "queue"
                      ? "Dummy queue cards can later be driven by urgency-based sorting."
                      : "Dummy content is structured to be replaced by API-driven data later."}
          </div>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">Workflow</h2>
          <div className="mt-5 space-y-3">
            {[
              "1. Render dummy data with the current route theme.",
              "2. Replace each block with API response later.",
              "3. Keep server as the single source of truth.",
            ].map((line) => (
              <div key={line} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                {line}
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">Implementation notes</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              "No manual kitchen drag sorting",
              "Duplicate fire should be ignored",
              "Served items must stay locked",
              "Manager sees urgent alerts in red",
            ].map((line) => (
              <div key={line} className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-700">
                {line}
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}