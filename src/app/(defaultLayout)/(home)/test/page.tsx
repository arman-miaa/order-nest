export default function TestPage() {
  return (
    <div className="space-y-6 pb-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-950">Prototype gallery</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
          Dummy showcase cards for future UI work. These can later be swapped with live restaurant widgets or product data.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          "Live floor",
          "Order control",
          "Menu manager",
          "Alert center",
          "Table selection",
          "Kitchen queue",
        ].map((item, index) => (
          <article key={item} className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white shadow-lg">
            <p className="text-xs uppercase tracking-[0.25em] text-white/50">Panel {index + 1}</p>
            <h2 className="mt-3 text-xl font-semibold">{item}</h2>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Placeholder screen content that mirrors the app style and can later receive API-driven data.
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
