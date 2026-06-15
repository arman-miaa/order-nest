type RoleKey = "manager" | "staff" | "kitchen";

type RestaurantOsOverviewProps = {
  role?: RoleKey;
};

const roleContent: Record<
  RoleKey,
  {
    eyebrow: string;
    title: string;
    description: string;
    focus: string[];
  }
> = {
  manager: {
    eyebrow: "Manager Dashboard",
    title: "Live floor control, menu ops, and real-time alerts",
    description:
      "Monitor the restaurant from a laptop with live table status, active orders, menu controls, priority overrides, and incident alerts.",
    focus: [
      "Floor map and table states",
      "86 item control and menu management",
      "VIP priority handling",
      "Delayed order alerts",
    ],
  },
  staff: {
    eyebrow: "Staff Tablet",
    title: "Table selection, order building, and service tracking",
    description:
      "Take orders table by table, fire them instantly to the kitchen, watch live status updates, and close the loop with served and cleared states.",
    focus: [
      "Select table and build order",
      "Add items with modifiers",
      "Fire order and monitor status",
      "Serve and clear table",
    ],
  },
  kitchen: {
    eyebrow: "Kitchen Wall Screen",
    title: "Auto-sorted queue with one-tap cooking controls",
    description:
      "See every incoming order in priority order, start items in progress, mark them ready, and keep the line moving with large readable cards.",
    focus: [
      "Urgency-based auto sorting",
      "Station filtering",
      "Cooking and ready states",
      "Overdue highlighting",
    ],
  },
};

const systemSteps = [
  "Staff selects a table, adds items and modifiers, then fires the order.",
  "Kitchen receives the order instantly with prep time, timestamps, and due time.",
  "System sorts the queue by urgency so overdue items rise to the top.",
  "Chef moves an item to In Progress, then marks it Ready when done.",
  "Staff receives the update, serves the item, and closes the order flow.",
  "Staff clears the table and the system resets it to available.",
];

const screenBreakdown = [
  {
    role: "Staff Tablet",
    items: ["Floor table view", "Order builder", "Active orders tracker"],
  },
  {
    role: "Kitchen Screen",
    items: ["Auto-sorted queue", "Station filter", "One-tap cooking states"],
  },
  {
    role: "Manager Dashboard",
    items: ["Live table map", "Active orders list", "Alerts and menu management"],
  },
];

const systemRules = [
  "Server is the single source of truth for all order states.",
  "Kitchen never drags orders; sorting stays automatic.",
  "Duplicate fire requests are ignored to keep orders idempotent.",
  "Once served, an order cannot roll back to a previous state.",
];

const edgeCases = [
  "Duplicate fire: ignore repeated order submissions.",
  "Offline staff device: queue locally and sync when online.",
  "Kitchen crash: reload full state from the server on restart.",
  "86 item: block selection and notify manager instantly.",
  "Delayed orders: highlight red on manager screen.",
];

const realtimeEvents = [
  "order_created",
  "order_updated",
  "order_status_changed",
  "item_ready",
  "table_updated",
  "item_86_updated",
];

const priorityColors = [
  { label: "Green", meaning: "Safe", detail: "Not urgent" },
  { label: "Yellow", meaning: "Warning", detail: "Near due" },
  { label: "Red", meaning: "Critical", detail: "Overdue" },
];

export function RestaurantOsOverview({ role = "manager" }: RestaurantOsOverviewProps) {
  const current = roleContent[role];

  return (
    <div className="space-y-6 pb-10">
      <section className="relative overflow-hidden rounded-3xl border border-[#eadfdd] bg-[linear-gradient(135deg,#fff7f4_0%,#ffffff_42%,#f4f8ff_100%)] p-6 shadow-sm md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,0,20,0.10),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(30,64,175,0.08),transparent_28%)]" />
        <div className="relative grid gap-8 md:grid-cols-[1.3fr_0.9fr] md:items-end">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7c4a3a]">
              OrderNest Restaurant OS
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              A real-time restaurant system for manager, staff, and kitchen.
            </h1>
            <p className="max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
              {current.description}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              {current.focus.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#decfcb] bg-white/80 px-4 py-2 text-sm font-medium text-slate-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-lg backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              {current.eyebrow}
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">
              {current.title}
            </h2>
            <div className="mt-5 grid gap-3 text-sm text-slate-600">
              <div className="rounded-xl bg-slate-50 p-4">
                Instant updates, less than one second delay, across every screen.
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                WebSocket-first architecture with REST CRUD and polling fallback.
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                Server-controlled order state, duplicate-safe submissions, locked completion.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {screenBreakdown.map((screen) => (
          <article
            key={screen.role}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-slate-950">{screen.role}</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {screen.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#7b1e2b]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">Core Order Flow</h2>
          <p className="mt-2 text-sm text-slate-600">
            STAFF → KITCHEN → READY → SERVED → TABLE CLEARED
          </p>
          <ol className="mt-5 space-y-4">
            {systemSteps.map((step, index) => (
              <li key={step} className="flex gap-4 rounded-xl bg-slate-50 p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#3b0014] text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <p className="text-sm leading-6 text-slate-700">{step}</p>
              </li>
            ))}
          </ol>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">Realtime Architecture</h2>
          <p className="mt-2 text-sm text-slate-600">
            Live screens sync through events, with the server owning all state changes.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {realtimeEvents.map((event) => (
              <div key={event} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700">
                {event}
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl bg-[#f7f1ef] p-4 text-sm text-slate-700">
            WebSockets preferred. If disconnected, the UI can fall back to polling until the live connection is restored.
          </div>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">Prep Time & Priority</h2>
          <p className="mt-2 text-sm text-slate-600">
            Each item keeps a base prep time. Due time and urgency are computed server-side.
          </p>
          <div className="mt-5 space-y-3">
            <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
              due_time = created_time + prep_time
            </div>
            <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
              urgency = current_time - due_time
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {priorityColors.map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-950">{item.label}</p>
                <p className="mt-1 text-sm text-slate-600">{item.meaning}</p>
                <p className="text-sm text-slate-500">{item.detail}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">System Rules</h2>
          <ul className="mt-5 space-y-3">
            {systemRules.map((rule) => (
              <li key={rule} className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                {rule}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">Edge Cases</h2>
          <ul className="mt-5 space-y-3">
            {edgeCases.map((edge) => (
              <li key={edge} className="flex gap-3 rounded-xl border border-slate-200 p-4 text-sm text-slate-700">
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#3b0014]" />
                <span>{edge}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">Dev Questions To Confirm</h2>
          <div className="mt-5 space-y-3">
            {[
              "WebSockets or Firebase for real-time sync?",
              "Should the staff tablet work offline?",
              "Server-side only priority logic, or hybrid client logic?",
              "Any bump bar or kitchen keyboard support required?",
              "Cloud only or local restaurant server deployment?",
            ].map((item) => (
              <div key={item} className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}