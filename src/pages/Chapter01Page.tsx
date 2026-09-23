import { useState, useEffect } from "react";
import { TriLayout } from "../components/layout";
import { PseudocodeViewer } from "../components/code";
import { PlaybackControls } from "../components/controls";
import { BipartiteMatchingView, CrossoverPlot } from "../components/visual";
import { galeShapleyModule } from "../algorithms/kt/ch01_stable_matching";
import type { AlgorithmStep } from "../algorithms/core";
import type { GSState } from "../algorithms/kt/ch01_stable_matching";

export default function Chapter01Page() {
  const [steps, setSteps] = useState<AlgorithmStep<GSState>[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Generate steps on mount
  useEffect(() => {
    const input = galeShapleyModule.defaultInput();
    const generator = galeShapleyModule.run(input);
    const newSteps: AlgorithmStep<GSState>[] = [];
    
    let result = generator.next();
    while (!result.done) {
      newSteps.push(result.value);
      result = generator.next();
    }
    
    setSteps(newSteps);
    setCurrentStepIndex(0);
  }, []);

  // Playback logic
  useEffect(() => {
    let timer: number;
    if (isPlaying && currentStepIndex < steps.length - 1) {
      timer = window.setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
      }, 1000); // 1 second per step
    } else if (currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length]);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const input = galeShapleyModule.defaultInput();

  const handlePlay        = () => setIsPlaying(true);
  const handlePause       = () => setIsPlaying(false);
  const handleStepForward = () => { setIsPlaying(false); if (currentStepIndex < steps.length - 1) setCurrentStepIndex(currentStepIndex + 1); };
  const handleStepBack    = () => { setIsPlaying(false); if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1); };
  const handleReset       = () => { setIsPlaying(false); setCurrentStepIndex(0); };

  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const problemContent = (
    <div className="prose max-w-none">
      <h2 className="text-2xl font-bold text-slate-900">The Stable Matching Problem</h2>
      <p className="text-slate-600">
        Given a set of <em>n</em> men and <em>n</em> women, where each person has ranked all members of the opposite gender in order of preference, find a stable matching.
      </p>
      <div className="bg-primary-50 border-l-4 border-primary-500 p-4 my-4 rounded-r-lg">
        <h4 className="font-bold mt-0 text-primary-800">Definition of a Stable Match</h4>
        <p className="mb-0 text-primary-700">
          A matching is <strong>stable</strong> if there are no two people of opposite genders who would both rather have each other than their current partners. If such a pair exists, they form an <em>instability</em>.
        </p>
      </div>
      
      <h3 className="text-xl font-bold mt-8 text-slate-900">CLRS Asymptotic Context</h3>
      <p className="text-slate-600">Before designing algorithms, we must understand how to measure their efficiency. Exercise 1.2-2 from CLRS introduces the crossover point between two algorithms.</p>
      <CrossoverPlot />
    </div>
  );

  const designContent = (
    <div className="flex flex-col gap-6">
      {/* Algorithm execution card */}
      <div className="glass-card p-5">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-800 m-0">Gale-Shapley Algorithm Execution</h3>
            <p className="text-xs text-slate-400 mt-0.5">Step through the algorithm one action at a time</p>
          </div>
          <PlaybackControls
            isPlaying={isPlaying}
            canStepBack={currentStepIndex > 0}
            canStepForward={currentStepIndex < steps.length - 1}
            currentStep={currentStepIndex}
            totalSteps={steps.length}
            onPlay={handlePlay}
            onPause={handlePause}
            onStepForward={handleStepForward}
            onStepBack={handleStepBack}
            onReset={handleReset}
          />
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-3">Algorithm State</h4>
          <BipartiteMatchingView input={input} state={currentStep.state} />
        </div>
        
        <div>
          <h4 className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-3">Pseudocode (CLRS Theme)</h4>
          <PseudocodeViewer
            lines={galeShapleyModule.meta.pseudocode}
            activeLine={currentStep.activeLine}
          />
        </div>
      </div>
    </div>
  );

  const analysisContent = (
    <div className="prose max-w-none">
      <h2 className="text-2xl font-bold text-slate-900">Analyzing the Algorithm</h2>
      <p className="text-slate-600">The Gale-Shapley algorithm guarantees that:</p>
      <ol className="text-slate-700">
        <li><strong>Termination:</strong> It will always terminate. (In at most <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-sm">n²</span> proposals).</li>
        <li><strong>Perfect Matching:</strong> Everyone gets matched.</li>
        <li><strong>Stability:</strong> There are no unstable pairs in the final matching.</li>
      </ol>
      <p className="text-slate-600">
        Interestingly, the algorithm is <em>man-optimal</em> (or proposer-optimal). Every man gets the best valid partner he could possibly have in any stable matching, while women get their worst valid partner.
      </p>
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg mt-6">
        <h4 className="font-bold mt-0 text-amber-800">Time Complexity</h4>
        <p className="mb-0 text-amber-700">
          The algorithm runs in <span className="font-mono">O(n²)</span> time — each man proposes to each woman at most once, giving at most n² proposals total.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Sticky page header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="mx-auto max-w-6xl px-6 py-3 flex items-center gap-3">
          <a href="#/" className="text-slate-400 hover:text-primary-600 transition-colors text-sm font-medium">
            ← All Chapters
          </a>
          <span className="text-slate-300">/</span>
          <span className="text-sm font-semibold text-slate-700">Chapter 1: Stable Matching &amp; Asymptotics</span>
          <span className="ml-auto text-xs text-slate-400 hidden sm:block">Kleinberg &amp; Tardos §1.1 / CLRS §1.2</span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <TriLayout
          problem={problemContent}
          design={designContent}
          analysis={analysisContent}
          activeTab={currentStep.ktSection as any}
        />
      </main>
    </div>
  );
}

