import type { AlgorithmStep, AlgorithmModule } from "../core";

export interface Person {
  id: string;
  name: string;
  preferences: string[];
}

export interface GSInput {
  men: Person[];
  women: Person[];
}

export interface GSState {
  freeMen: string[];
  engagements: Record<string, string>; // womanId -> manId
  proposals: Record<string, number>; // manId -> next index in preferences
  lastAction?: {
    type: "propose" | "accept" | "reject" | "dump" | "finish";
    man?: string;
    woman?: string;
    oldMan?: string;
  };
}

const meta = {
  id: "stable-matching",
  title: "Gale-Shapley Stable Matching",
  source: "kt" as const,
  reference: "K&T §1.1",
  pseudocode: [
    "Initialize all m ∈ M and w ∈ W to free",
    "while ∃ free man m who still has a woman w to propose to:",
    "    w = highest-ranked woman in m's preference list to whom m has not yet proposed",
    "    if w is free then",
    "        (m, w) become engaged",
    "    else if w prefers m to her current partner m' then",
    "        (m, w) become engaged",
    "        m' becomes free",
    "    else",
    "        w rejects m",
    "Return the set of engaged pairs",
  ],
};

function* run(
  input: GSInput,
): Generator<AlgorithmStep<GSState>, void, undefined> {
  const { men, women } = input;
  const menMap = new Map(men.map((m) => [m.id, m]));
  const womenRanks: Record<string, Record<string, number>> = {};

  for (const w of women) {
    womenRanks[w.id] = {};
    w.preferences.forEach((manId, index) => {
      womenRanks[w.id][manId] = index;
    });
  }

  let stepIndex = 0;
  const state: GSState = {
    freeMen: men.map((m) => m.id),
    engagements: {},
    proposals: {},
  };

  for (const m of men) {
    state.proposals[m.id] = 0;
  }

  yield {
    stepIndex: stepIndex++,
    activeLine: 1,
    state: structuredClone(state),
    variables: { freeMen: state.freeMen.slice() },
    invariants: [],
    ktSection: "design",
  };

  while (state.freeMen.length > 0) {
    const mId = state.freeMen[0];
    const man = menMap.get(mId)!;

    if (state.proposals[mId] >= man.preferences.length) {
      state.freeMen.shift();
      continue;
    }

    yield {
      stepIndex: stepIndex++,
      activeLine: 2,
      state: structuredClone(state),
      variables: { m: mId },
      invariants: [],
      ktSection: "design",
    };

    const wId = man.preferences[state.proposals[mId]];
    state.proposals[mId]++;
    state.lastAction = { type: "propose", man: mId, woman: wId };

    yield {
      stepIndex: stepIndex++,
      activeLine: 3,
      state: structuredClone(state),
      variables: { m: mId, w: wId },
      invariants: [],
      ktSection: "design",
    };

    if (!state.engagements[wId]) {
      state.engagements[wId] = mId;
      state.freeMen.shift();
      state.lastAction = { type: "accept", man: mId, woman: wId };

      yield {
        stepIndex: stepIndex++,
        activeLine: 4,
        state: structuredClone(state),
        variables: { m: mId, w: wId },
        invariants: [],
        ktSection: "design",
      };
      yield {
        stepIndex: stepIndex++,
        activeLine: 5,
        state: structuredClone(state),
        variables: { m: mId, w: wId },
        invariants: [],
        ktSection: "design",
      };
    } else {
      const mPrimeId = state.engagements[wId];

      yield {
        stepIndex: stepIndex++,
        activeLine: 6,
        state: structuredClone(state),
        variables: { m: mId, w: wId, "m'": mPrimeId },
        invariants: [],
        ktSection: "design",
      };

      const rankNew = womenRanks[wId][mId];
      const rankOld = womenRanks[wId][mPrimeId];

      if (rankNew < rankOld) {
        state.engagements[wId] = mId;
        state.freeMen.shift();
        state.freeMen.push(mPrimeId);
        state.lastAction = {
          type: "dump",
          man: mId,
          woman: wId,
          oldMan: mPrimeId,
        };

        yield {
          stepIndex: stepIndex++,
          activeLine: 7,
          state: structuredClone(state),
          variables: { m: mId, w: wId, "m'": mPrimeId },
          invariants: [],
          ktSection: "design",
        };
        yield {
          stepIndex: stepIndex++,
          activeLine: 8,
          state: structuredClone(state),
          variables: { m: mId, w: wId, "m'": mPrimeId },
          invariants: [],
          ktSection: "design",
        };
      } else {
        state.lastAction = { type: "reject", man: mId, woman: wId };

        yield {
          stepIndex: stepIndex++,
          activeLine: 9,
          state: structuredClone(state),
          variables: { m: mId, w: wId, "m'": mPrimeId },
          invariants: [],
          ktSection: "design",
        };
        yield {
          stepIndex: stepIndex++,
          activeLine: 10,
          state: structuredClone(state),
          variables: { m: mId, w: wId, "m'": mPrimeId },
          invariants: [],
          ktSection: "design",
        };
      }
    }
  }

  state.lastAction = { type: "finish" };
  yield {
    stepIndex: stepIndex++,
    activeLine: 11,
    state: structuredClone(state),
    variables: {},
    invariants: [],
    ktSection: "design",
  };
}

function defaultInput(): GSInput {
  return {
    men: [
      { id: "m1", name: "Albert", preferences: ["w1", "w2", "w3"] },
      { id: "m2", name: "Bradley", preferences: ["w2", "w1", "w3"] },
      { id: "m3", name: "Charles", preferences: ["w1", "w2", "w3"] },
    ],
    women: [
      { id: "w1", name: "Diane", preferences: ["m2", "m3", "m1"] },
      { id: "w2", name: "Erica", preferences: ["m1", "m2", "m3"] },
      { id: "w3", name: "Fiona", preferences: ["m1", "m2", "m3"] },
    ],
  };
}

export const galeShapleyModule: AlgorithmModule<GSInput, GSState> = {
  meta,
  run,
  defaultInput,
};
