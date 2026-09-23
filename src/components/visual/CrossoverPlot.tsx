import { useState, useMemo } from "react";
import { MathBlock } from "../math";

export default function CrossoverPlot() {
  const [n, setN] = useState<number>(30);

  // Insertion sort runs in 8n^2
  const insertionSortSteps = 8 * n * n;
  
  // Merge sort runs in 64n lg n
  // Math.log2 provides base 2 logarithm
  const mergeSortSteps = 64 * n * Math.log2(n);

  const isInsertionBetter = insertionSortSteps < mergeSortSteps;

  // Let's generate points for the graph up to maxN = 50
  const maxN = 50;
  const dataPoints = useMemo(() => {
    const points = [];
    for (let i = 2; i <= maxN; i++) {
      points.push({
        n: i,
        insertion: 8 * i * i,
        merge: 64 * i * Math.log2(i),
      });
    }
    return points;
  }, [maxN]);

  // Very simple SVG plotting
  const width = 600;
  const height = 300;
  const padding = 40;
  
  const maxY = Math.max(
    8 * maxN * maxN,
    64 * maxN * Math.log2(maxN)
  );

  const getX = (val: number) => padding + ((val - 2) / (maxN - 2)) * (width - padding * 2);
  const getY = (val: number) => height - padding - (val / maxY) * (height - padding * 2);

  const insertionPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.n)} ${getY(p.insertion)}`).join(" ");
  const mergePath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.n)} ${getY(p.merge)}`).join(" ");

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div className="text-center max-w-2xl">
        <h3 className="text-xl font-bold mb-4">CLRS Exercise 1.2-2</h3>
        <p className="text-gray-600 mb-4">
          Suppose we are comparing implementations of insertion sort and merge sort on the same machine.
          For inputs of size <MathBlock tex="n" />, insertion sort runs in <MathBlock tex="8n^2" /> steps, while merge sort runs in <MathBlock tex="64n \lg n" /> steps.
          For which values of <MathBlock tex="n" /> does insertion sort beat merge sort?
        </p>
      </div>

      {/* SVG Plot */}
      <div className="relative border border-gray-200 rounded-xl bg-white shadow-sm p-4">
        <svg width={width} height={height} className="overflow-visible">
          {/* Axes */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#ccc" />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#ccc" />
          
          <text x={width - padding + 10} y={height - padding + 4} fontSize="12" fill="#666">n</text>
          <text x={padding} y={padding - 10} fontSize="12" fill="#666" textAnchor="middle">steps</text>

          {/* Lines */}
          <path d={insertionPath} fill="none" stroke="#ef4444" strokeWidth="3" />
          <path d={mergePath} fill="none" stroke="#3b82f6" strokeWidth="3" />

          {/* Current N Marker */}
          <line 
            x1={getX(n)} 
            y1={padding} 
            x2={getX(n)} 
            y2={height - padding} 
            stroke="#9ca3af" 
            strokeDasharray="4,4" 
          />
          <circle cx={getX(n)} cy={getY(insertionSortSteps)} r="5" fill="#ef4444" />
          <circle cx={getX(n)} cy={getY(mergeSortSteps)} r="5" fill="#3b82f6" />
        </svg>

        {/* Legend */}
        <div className="absolute top-8 left-16 flex flex-col gap-2 bg-white/90 p-2 rounded border border-gray-100 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-red-500 rounded"></div>
            <span>Insertion (<MathBlock tex="8n^2" />)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-blue-500 rounded"></div>
            <span>Merge (<MathBlock tex="64n \lg n" />)</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="w-full max-w-md flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-700">Input size (<MathBlock tex="n" />): {n}</span>
          <span className={`font-bold ${isInsertionBetter ? "text-red-600" : "text-blue-600"}`}>
            {isInsertionBetter ? "Insertion Sort is faster" : "Merge Sort is faster"}
          </span>
        </div>
        <input 
          type="range" 
          min="2" 
          max={maxN} 
          value={n} 
          onChange={(e) => setN(parseInt(e.target.value))}
          className="w-full accent-blue-600"
        />
        
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-center">
            <div className="text-sm text-red-600 font-medium mb-1">Insertion Sort Steps</div>
            <div className="text-xl font-bold text-red-700">{Math.round(insertionSortSteps).toLocaleString()}</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-center">
            <div className="text-sm text-blue-600 font-medium mb-1">Merge Sort Steps</div>
            <div className="text-xl font-bold text-blue-700">{Math.round(mergeSortSteps).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
