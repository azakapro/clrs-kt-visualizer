# CLRS × K&T Visualizer

> Interactive algorithm visualizations for **CS610 — Algorithm Design Techniques** at **New Uzbekistan University**.

## Overview

**clrs-kt-visualizer** is a web-based visual learning environment that animates algorithms and mathematical proofs from two foundational textbooks:

| Textbook | Abbreviation | Focus |
|---|---|---|
| *Introduction to Algorithms* (Cormen, Leiserson, Rivest, Stein — 4th Ed.) | **CLRS** | Pseudocode, loop invariants, asymptotic analysis |
| *Algorithm Design* (Kleinberg & Tardos) | **K&T** | Problem motivation → algorithm design → formal analysis |

### Dual-Textbook Methodology

This project bridges two complementary pedagogical approaches:

- **CLRS** provides the *procedural lens*: precise pseudocode, loop invariant proofs (Initialization → Maintenance → Termination), and line-by-line execution tracing.
- **K&T** provides the *structural lens*: every algorithm is motivated by a real-world problem, designed through intuition and strategy, then rigorously analyzed.

Every algorithm page in this visualizer combines both perspectives via the **K&T Tri-Layout** (three-tab structure: *The Problem*, *Designing the Algorithm*, *Analyzing the Algorithm*) with embedded **CLRS-style pseudocode** blocks and an **invariant tracker** checklist.

## Architectural Rules

1. **K&T Tri-Layout** — Every algorithm page defaults to a three-tab layout: "The Problem", "Designing the Algorithm", "Analyzing the Algorithm".
2. **CLRS Theme** — Pseudocode blocks render on a light tan background (`#f4f1ea`) matching the CLRS textbook style.
3. **1-Origin Display Offset** — TypeScript arrays are 0-indexed internally; the UI always renders indices with `+1` to match CLRS notation `A[1…n]`.
4. **Invariant Tracker** — A global state tracks loop invariant phases (Initialization, Maintenance, Termination) with a dynamic checklist panel.

## Tech Stack

- **Framework**: React 18 + TypeScript (Vite)
- **Visualization**: D3.js (graph/tree layouts) + Framer Motion (array/variable transitions)
- **Math Rendering**: KaTeX
- **Styling**: TailwindCSS
- **Deployment**: Vercel

## Project Structure

```
src/
├── algorithms/
│   ├── core/          # StepTracker interface and shared types
│   ├── clrs/          # Sorting, Data Structures, Graph basics
│   └── kt/            # Stable Matching, Greedy, Network Flow
├── components/
│   ├── layout/        # K&T Tri-Layout wrapper, InvariantPanel
│   ├── visual/        # D3/Framer nodes (ArrayBlock, GraphNode)
│   ├── controls/      # Play, Pause, Step-Forward, Step-Back
│   ├── code/          # CLRS-style pseudocode viewer
│   └── math/          # KaTeX rendering wrappers
├── pages/             # Route-level page components
├── styles/            # Global Tailwind configuration
└── data/              # Static demo inputs and datasets
```

## CS610 Syllabus Alignment

| Week | Topic | Textbook | Module |
|------|-------|----------|--------|
| 1–2 | Stable Matching | K&T Ch.1 | `kt/GaleShapley` |
| 3–4 | Sorting & Loop Invariants | CLRS Ch.2 | `clrs/InsertionSort` |
| 5–6 | Divide & Conquer | CLRS Ch.4, K&T Ch.5 | TBD |
| 7–8 | Greedy Algorithms | CLRS Ch.16, K&T Ch.4 | TBD |
| 9–10 | Dynamic Programming | CLRS Ch.14, K&T Ch.6 | TBD |
| 11–12 | Network Flow | K&T Ch.7 | TBD |
| 13–14 | Graph Algorithms | CLRS Ch.22–24 | TBD |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the visualizer.

## License

MIT