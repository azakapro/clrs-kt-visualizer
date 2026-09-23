import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section */}
      <div className="relative overflow-hidden border-b border-slate-200/80 bg-white/50">
        {/* Subtle radial glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 70% at 50% -10%, rgb(99 102 241 / 0.12), transparent)",
          }}
        />

        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center">
          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3.5 py-1.5 text-xs font-semibold text-primary-700">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse" />
            CS610 — Algorithm Design Techniques
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            CLRS <span className="text-primary-500">×</span> K&amp;T
            <br />
            <span className="text-slate-500">Visualizer</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-500 leading-relaxed">
            Interactive algorithm visualizations for{" "}
            <strong className="font-semibold text-slate-700">New Uzbekistan University</strong>.
            Step through algorithms, see them animate, understand them deeply.
          </p>
        </div>
      </div>

      {/* Chapter grid */}
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
        <div className="mb-6 flex items-center gap-3">
          <h2 className="text-lg font-semibold text-slate-800">Chapters</h2>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          <li>
            <Link
              to="/ch01"
              className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-card-lg"
            >
              {/* Chapter tag */}
              <div className="flex items-center justify-between">
                <span className="inline-block rounded-lg bg-primary-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary-600">
                  Chapter 1
                </span>
                <svg
                  className="h-4 w-4 text-slate-300 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-primary-700 transition-colors">
                  Stable Matching &amp; Asymptotics
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  K&amp;T §1.1 / CLRS §1.2 — Gale-Shapley algorithm with step-by-step visualization
                </p>
              </div>

              {/* Topics */}
              <div className="flex flex-wrap gap-1.5 mt-1">
                {["Gale-Shapley", "Stable Matching", "O(n²)", "Asymptotics"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          </li>

          {/* Coming-soon placeholder */}
          <li
            aria-disabled
            className="flex flex-col gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-6 opacity-60 select-none"
          >
            <div className="flex items-center justify-between">
              <span className="inline-block rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                Chapter 2
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-400">Coming Soon</h3>
              <p className="mt-1 text-sm text-slate-400">Graph algorithms — BFS, DFS &amp; more</p>
            </div>
          </li>
        </ul>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 px-6 py-5 text-center text-xs text-slate-400">
        CLRS × K&amp;T Visualizer · CS610 · New Uzbekistan University
      </footer>
    </div>
  );
}

