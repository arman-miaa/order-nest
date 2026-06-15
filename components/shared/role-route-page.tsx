import React from "react";

export type StatItem = {
  label: string;
  value: string;
  note: string;
};

interface RoleRoutePageProps {
  role: "manager" | "staff" | "kitchen";
  title: string;
  description?: string;
  stats?: StatItem[];
  children?: React.ReactNode;
}

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

export function RoleRoutePage({ 
  role, 
  title, 
  description, 
  stats = [],
  children 
}: RoleRoutePageProps) {
  const theme = roleTheme[role];
  
  return (
    <div className="space-y-6 pb-10">
      <section className={`overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-500 ${theme.border} ${theme.glow}`}>
        <div className="relative overflow-hidden p-6 md:p-8 bg-[radial-gradient(circle_at_top_right,#f1f5f9,transparent_55%),radial-gradient(circle_at_bottom_left,#f8fafc,transparent_40%)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.04),transparent_50%),radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.04),transparent_50%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">
                {role} workspace
              </p>
              <h1 className={`max-w-3xl text-3xl font-bold tracking-tight md:text-4xl bg-linear-to-r bg-clip-text text-transparent ${theme.accent}`}>
                {title}
              </h1>
              <p className="max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
                {description ?? "Dummy content is in place here and can be replaced with API data later."}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {[role, "api-ready", "real-time"].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-slate-600 shadow-xs"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                Live snapshot
              </p>
              <div className="mt-4 grid gap-2.5 text-sm text-slate-700">
                <div className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-xs text-xs">
                  Server controlled state, no manual sort, no rollback after served.
                </div>
                <div className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-xs text-xs">
                  WebSocket first, polling fallback, and duplicate-safe submissions.
                </div>
                <div className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-xs text-xs">
                  Dummy data only, ready to swap with API response later.
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-6 grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
                <div className="mt-2 flex items-end justify-between gap-3">
                  <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
                  <span className="text-xs text-slate-500 pb-1">{stat.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">{title} board</h2>
            </div>
          </div>
          {children}
        </article>
      </section>
    </div>
  );
}