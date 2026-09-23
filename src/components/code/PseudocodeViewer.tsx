/**
 * PseudocodeViewer — CLRS-style tan-background pseudocode display.
 *
 * Architectural Rule #2: Procedural pseudocode renders on a light tan
 * background (bg-clrs-tan / #f4f1ea) matching the CLRS textbook.
 */

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
    <div className="clrs-pseudocode">
      {lines.map((line, i) => {
        const lineNumber = i + 1;
        const isActive = lineNumber === activeLine;
        return (
          <div
            key={lineNumber}
            className={`flex ${isActive ? "clrs-line-active" : ""}`}
          >
            <span className="clrs-line-number">{lineNumber}</span>
            <span className="whitespace-pre">{line}</span>
          </div>
        );
      })}
    </div>
  );
}
