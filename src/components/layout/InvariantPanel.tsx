/**
 * InvariantPanel — Dynamic checklist for CLRS loop invariants.
 *
 * Renders the three phases (Initialization, Maintenance, Termination)
 * with live satisfied/pending state driven by InvariantContext.
 */

import { useInvariants } from "./InvariantContext";
import type { InvariantPhase } from "@/algorithms/core";

const PHASE_LABELS: Record<InvariantPhase, string> = {
  initialization: "Initialization",
  maintenance: "Maintenance",
  termination: "Termination",
};

const PHASE_ORDER: InvariantPhase[] = [
  "initialization",
  "maintenance",
  "termination",
];

export default function InvariantPanel() {
  const { invariants } = useInvariants();

  if (invariants.length === 0) {
    return null;
  }

  const byPhase = new Map(invariants.map((inv) => [inv.phase, inv]));

  return (
    <aside className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
        Loop Invariant
      </h3>
      <ul className="space-y-2">
        {PHASE_ORDER.map((phase) => {
          const inv = byPhase.get(phase);
          if (!inv) return null;
          return (
            <li key={phase} className="flex items-start gap-2">
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  inv.satisfied
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {inv.satisfied ? "✓" : "○"}
              </span>
              <div>
                <p className="text-sm font-medium">{PHASE_LABELS[phase]}</p>
                <p className="text-xs text-gray-500">{inv.description}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
