/**
 * PseudocodeViewer — CLRS-style tan-background pseudocode display.
 *
 * Architectural Rule #2: Procedural pseudocode renders on a light tan
 * background (bg-clrs-tan / #f5f1e8) matching the CLRS textbook.
 */

import { AnimatePresence, motion } from "framer-motion";

interface PseudocodeViewerProps {
  /** Array of pseudocode lines (each string is one line). */
  lines: string[];
  /** 1-based line number currently being executed (highlighted). */
  activeLine?: number;
}

export default function PseudocodeViewer({
  lines,
  activeLine,
}: PseudocodeViewerProps) {
  return (
    <div className="clrs-pseudocode relative">
      <AnimatePresence>
        {activeLine !== undefined && (
          <motion.div
            key={activeLine}
            layoutId="active-line-highlight"
            className="clrs-line-active absolute inset-x-1 pointer-events-none"
            style={{ top: `calc(${(activeLine - 1)} * 1.75rem + 1.25rem)`, height: "1.75rem" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {lines.map((line, i) => {
        const lineNumber = i + 1;
        const isActive = lineNumber === activeLine;
        return (
          <div
            key={lineNumber}
            className={`relative flex items-center leading-7 ${isActive ? "font-semibold" : ""}`}
          >
            <span className="clrs-line-number shrink-0">{lineNumber}</span>
            <span className="whitespace-pre">{line}</span>
          </div>
        );
      })}
    </div>
  );
}

