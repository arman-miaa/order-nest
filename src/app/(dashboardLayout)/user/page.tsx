export default function UserPage() {
  return (
    <div className="space-y-6 pb-10">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Customer preview
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              User portal shell
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Dummy customer-facing content lives here for now. Later this can become a live menu, order history, or support view.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-950 p-5 text-white shadow-lg">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/60">
              Preview cards
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ["Active order", "#2041"],
                ["Support", "Open"],
                ["Visit time", "Today"],
                ["Rewards", "42 pts"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/8 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/50">{label}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          "Menu browsing",
          "Delivery tracking",
          "Saved addresses",
        ].map((item) => (
          <article key={item} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">{item}</h2>
            <p className="mt-2 text-sm text-slate-600">
              Placeholder content for the customer experience can be connected later.
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
