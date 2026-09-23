/**
 * ArrayBlock — Animated array cell visualizer.
 *
 * Renders individual array elements as blocks with Framer Motion transitions.
 *
 * ARCHITECTURAL RULE #3 — 1-Origin Display Offset:
 * The `index` prop is 0-based (matching the TypeScript array). The rendered
 * label shows `index + 1` to match CLRS notation (A[1…n]).
 */

import { motion } from "framer-motion";

interface ArrayBlockProps {
  /** 0-based index in the underlying array. */
  index: number;
  /** The value to display inside the cell. */
  value: number | string;
  /** Whether this cell is currently being compared / accessed. */
  isActive?: boolean;
  /** Whether this cell is in its final sorted position. */
  isSorted?: boolean;
}

export default function ArrayBlock({
  index,
  value,
  isActive = false,
  isSorted = false,
}: ArrayBlockProps) {
  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`flex flex-col items-center ${isActive ? "z-10" : ""}`}
    >
      {/* Cell */}
      <motion.div
        animate={{
          backgroundColor: isActive
            ? "#3b82f6"
            : isSorted
              ? "#22c55e"
              : "#e5e7eb",
          color: isActive || isSorted ? "#ffffff" : "#1f2937",
        }}
        transition={{ duration: 0.25 }}
        className="flex h-12 w-12 items-center justify-center rounded-md text-base font-semibold shadow-sm"
      >
        {value}
      </motion.div>
      {/* 1-origin index label */}
      <span className="mt-1 text-xs text-gray-400">{index + 1}</span>
    </motion.div>
  );
}
