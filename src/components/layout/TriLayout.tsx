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
  { key: "problem", label: "The Problem" },
  { key: "design", label: "Designing the Algorithm" },
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
      <nav className="flex border-b border-gray-200">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleSwitch(key)}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              active === key
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Active tab content */}
      <div className="p-6">{content[active]}</div>
    </div>
  );
}
