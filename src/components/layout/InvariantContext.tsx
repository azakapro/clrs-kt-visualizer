/**
 * InvariantContext — Global state for the CLRS loop-invariant checklist.
 *
 * Architectural Rule #4: The UI features a dynamic checklist panel
 * tracking "Initialization", "Maintenance", and "Termination" states
 * as the algorithm visually steps forward.
 */

import { createContext, useContext, useState, type ReactNode } from "react";
import type { InvariantStatus } from "@/algorithms/core";

interface InvariantContextValue {
  /** Current invariant statuses for the active algorithm step. */
  invariants: InvariantStatus[];
  /** Called by the playback engine when stepping to a new AlgorithmStep. */
  setInvariants: (next: InvariantStatus[]) => void;
}

const InvariantContext = createContext<InvariantContextValue | null>(null);

export function InvariantProvider({ children }: { children: ReactNode }) {
  const [invariants, setInvariants] = useState<InvariantStatus[]>([]);
  return (
    <InvariantContext.Provider value={{ invariants, setInvariants }}>
      {children}
    </InvariantContext.Provider>
  );
}

export function useInvariants(): InvariantContextValue {
  const ctx = useContext(InvariantContext);
  if (!ctx) {
    throw new Error("useInvariants must be used within <InvariantProvider>");
  }
  return ctx;
}
