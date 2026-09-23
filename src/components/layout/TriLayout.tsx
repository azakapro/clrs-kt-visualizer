/**
 * TriLayout — The K&T Tri-Layout wrapper.
 *
 * Architectural Rule #1: Every algorithm page defaults to a three-tab
 * layout mapping to Kleinberg & Tardos:
 *   Tab 1: "The Problem"
 *   Tab 2: "Designing the Algorithm"
 *   Tab 3: "Analyzing the Algorithm"
 */

import { useState, type ReactNode } from "react";

const TABS = [
  { key: "problem",  label: "The Problem" },
  { key: "design",   label: "Designing the Algorithm" },
  { key: "analysis", label: "Analyzing the Algorithm" },
] as const;

export type TriLayoutTab = (typeof TABS)[number]["key"];

interface TriLayoutProps {
  /** Content for "The Problem" tab. */
  problem: ReactNode;
  /** Content for "Designing the Algorithm" tab. */
  design: ReactNode;
  /** Content for "Analyzing the Algorithm" tab. */
  analysis: ReactNode;
  /** Externally controlled active tab (for auto-switching during playback). */
  activeTab?: TriLayoutTab;
  /** Callback when the user manually switches tabs. */
  onTabChange?: (tab: TriLayoutTab) => void;
}

export default function TriLayout({
  problem,
  design,
  analysis,
  activeTab: controlledTab,
  onTabChange,
}: TriLayoutProps) {
  const [internalTab, setInternalTab] = useState<TriLayoutTab>("problem");
  const active = controlledTab ?? internalTab;

  const handleSwitch = (tab: TriLayoutTab) => {
    setInternalTab(tab);
    onTabChange?.(tab);
  };

  const content: Record<TriLayoutTab, ReactNode> = {
    problem,
    design,
    analysis,
  };

  return (
    <div className="flex flex-col">
      {/* Tab bar */}
      <nav className="flex items-end gap-1 border-b border-slate-200 px-1">
        {TABS.map(({ key, label }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => handleSwitch(key)}
              className={[
                "relative px-5 py-3 text-sm font-medium rounded-t-lg transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
                isActive
                  ? "text-primary-600 bg-white border border-b-0 border-slate-200 shadow-sm -mb-px"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/70",
              ].join(" ")}
            >
              {isActive && (
                <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary-500" />
              )}
              {label}
            </button>
          );
        })}
      </nav>

      {/* Active tab content */}
      <div className="p-6 pt-8">{content[active]}</div>
    </div>
  );
}

