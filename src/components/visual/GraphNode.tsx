/**
 * GraphNode — Placeholder for D3-powered graph/tree node visualization.
 *
 * This component will use D3 force-directed or tree layouts to render
 * graph structures (e.g., network flow, BFS/DFS trees).
 * Full implementation comes with the first graph algorithm module.
 */

interface GraphNodeProps {
  id: string;
  label: string;
  x: number;
  y: number;
  isActive?: boolean;
}

export default function GraphNode({
  id: _id,
  label,
  x,
  y,
  isActive = false,
}: GraphNodeProps) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle
        r={20}
        fill={isActive ? "#3b82f6" : "#e5e7eb"}
        stroke="#9ca3af"
        strokeWidth={1.5}
      />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-medium"
        fill={isActive ? "#ffffff" : "#1f2937"}
      >
        {label}
      </text>
    </g>
  );
}
