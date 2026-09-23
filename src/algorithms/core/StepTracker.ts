/**
 * StepTracker — Core interface for frame-by-frame algorithm state emission.
 *
 * Every algorithm module (CLRS or K&T) must implement a generator function
 * that yields `AlgorithmStep` objects. The visualizer consumes these steps
 * to drive animations, pseudocode highlighting, and invariant tracking.
 *
 * ARCHITECTURAL RULE — 1-Origin Display Offset:
 * All indices stored in `AlgorithmStep.variables` use 0-based TypeScript
 * indexing internally. The UI layer adds +1 when rendering to match CLRS
 * textbook notation (A[1…n]).
 */

// ---------------------------------------------------------------------------
// Invariant Tracking (CLRS Loop-Invariant Methodology)
// ---------------------------------------------------------------------------

/** The three phases of a CLRS loop invariant proof. */
export type InvariantPhase = "initialization" | "maintenance" | "termination";

/** Status of a single invariant phase at the current step. */
export interface InvariantStatus {
  phase: InvariantPhase;
  /** Whether this phase has been satisfied at the current step. */
  satisfied: boolean;
  /** Human-readable explanation shown in the UI checklist. */
  description: string;
}

// ---------------------------------------------------------------------------
// Algorithm Step
// ---------------------------------------------------------------------------

/**
 * A single frame of algorithm execution.
 *
 * The visualizer iterates over these to animate the algorithm forward or
 * backward. Each step is a complete snapshot — no deltas.
 */
export interface AlgorithmStep<TState = Record<string, unknown>> {
  /** Monotonically increasing step index (0-based). */
  stepIndex: number;

  /**
   * The active line number in the pseudocode listing (1-based to match
   * the rendered pseudocode).
   */
  activeLine: number;

  /** Complete snapshot of algorithm-specific state (e.g. array, pointers). */
  state: TState;

  /**
   * Named variables to display in the variable inspector panel.
   * Keys are variable names; values can be primitives or small arrays.
   *
   * INDEX CONVENTION: array indices stored here are 0-based.
   * The UI must render them as `index + 1`.
   */
  variables: Record<string, unknown>;

  /** Current invariant statuses (may be empty for K&T-style algorithms). */
  invariants: InvariantStatus[];

  /** Optional narrative text describing what this step is doing. */
  description?: string;

  /**
   * K&T section this step belongs to.
   * Used to auto-switch the Tri-Layout tab during playback.
   */
  ktSection?: "problem" | "design" | "analysis";
}

// ---------------------------------------------------------------------------
// Algorithm Module Interface
// ---------------------------------------------------------------------------

/** Metadata that every algorithm module must export. */
export interface AlgorithmMeta {
  /** Unique slug used in routing, e.g. "insertion-sort". */
  id: string;
  /** Display title, e.g. "Insertion Sort". */
  title: string;
  /** Source textbook. */
  source: "clrs" | "kt";
  /** Chapter/section reference, e.g. "CLRS 4e §2.1". */
  reference: string;
  /** Lines of pseudocode to render in the CLRS tan block. */
  pseudocode: string[];
}

/**
 * The contract every algorithm module must satisfy.
 *
 * `TInput` is the type of the input the algorithm accepts (e.g. number[]).
 * `TState` is the per-step state snapshot type.
 */
export interface AlgorithmModule<
  TInput = unknown,
  TState = Record<string, unknown>,
> {
  meta: AlgorithmMeta;

  /**
   * A generator that yields every visual step of the algorithm.
   * The visualizer calls `.next()` on Play / Step-Forward and caches
   * previous steps for Step-Back.
   */
  run(input: TInput): Generator<AlgorithmStep<TState>, void, undefined>;

  /** Produce a default/demo input for the landing preview. */
  defaultInput(): TInput;
}
