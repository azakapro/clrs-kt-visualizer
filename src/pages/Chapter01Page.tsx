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

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => {
    setIsPlaying(false);
    if (currentStepIndex < steps.length - 1) setCurrentStepIndex(currentStepIndex + 1);
  };
  const handleStepBack = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1);
  };
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const problemContent = (
    <div className="prose max-w-none">
      <h2 className="text-2xl font-bold">The Stable Matching Problem</h2>
      <p>
        Given a set of <em>n</em> men and <em>n</em> women, where each person has ranked all members of the opposite gender in order of preference, find a stable matching.
      </p>
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
        <h4 className="font-bold mt-0">Definition of a Stable Match</h4>
        <p className="mb-0">
          A matching is <strong>stable</strong> if there are no two people of opposite genders who would both rather have each other than their current partners. If such a pair exists, they form an <em>instability</em>.
        </p>
      </div>
      
      <h3 className="text-xl font-bold mt-8">CLRS Asymptotic Context</h3>
      <p>Before designing algorithms, we must understand how to measure their efficiency. Exercise 1.2-2 from CLRS introduces the crossover point between two algorithms.</p>
      <CrossoverPlot />
    </div>
  );

  const designContent = (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold m-0">Gale-Shapley Algorithm Execution</h3>
        <PlaybackControls 
          isPlaying={isPlaying}
          canStepBack={currentStepIndex > 0}
          canStepForward={currentStepIndex < steps.length - 1}
          onPlay={handlePlay}
          onPause={handlePause}
          onStepForward={handleStepForward}
          onStepBack={handleStepBack}
          onReset={handleReset}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h4 className="font-bold mb-4 text-gray-700">Algorithm State</h4>
          <BipartiteMatchingView input={input} state={currentStep.state} />
        </div>
        
        <div>
          <h4 className="font-bold mb-4 text-gray-700">Pseudocode (CLRS Theme)</h4>
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
      <h2 className="text-2xl font-bold">Analyzing the Algorithm</h2>
      <p>The Gale-Shapley algorithm guarantees that:</p>
      <ol>
        <li><strong>Termination:</strong> It will always terminate. (In at most <span className="font-mono">n²</span> proposals).</li>
        <li><strong>Perfect Matching:</strong> Everyone gets married.</li>
        <li><strong>Stability:</strong> There are no unstable pairs in the final matching.</li>
      </ol>
      <p>
        Interestingly, the algorithm is <em>man-optimal</em> (or proposer-optimal). Every man gets the best valid partner he could possibly have in any stable matching, while women get their worst valid partner.
      </p>
    </div>
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Chapter 1: Stable Matching & Asymptotics</h1>
        <p className="text-gray-500">Kleinberg & Tardos §1.1 / CLRS §1.2</p>
      </header>

      <TriLayout 
        problem={problemContent}
        design={designContent}
        analysis={analysisContent}
        activeTab={currentStep.ktSection as any}
      />
    </main>
  );
}
