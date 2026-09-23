import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import type { GSInput, GSState } from "../../algorithms/kt/ch01_stable_matching";

interface BipartiteMatchingViewProps {
  input: GSInput;
  state: GSState;
}

interface NodeRect { x: number; y: number; w: number; h: number }

export default function BipartiteMatchingView({
  input,
  state,
}: BipartiteMatchingViewProps) {
  const { men, women } = input;
  const { engagements, lastAction, freeMen } = state;

  const containerRef = useRef<HTMLDivElement>(null);
  const menRefs    = useRef<Map<string, HTMLDivElement>>(new Map());
  const womenRefs  = useRef<Map<string, HTMLDivElement>>(new Map());
  const [rects, setRects] = useState<{ men: Map<string, NodeRect>; women: Map<string, NodeRect> }>({
    men: new Map(), women: new Map(),
  });

  const measureRects = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const box = container.getBoundingClientRect();
    const mR = new Map<string, NodeRect>();
    const wR = new Map<string, NodeRect>();
    menRefs.current.forEach((el, id) => {
      const r = el.getBoundingClientRect();
      mR.set(id, { x: r.right - box.left, y: r.top + r.height / 2 - box.top, w: r.width, h: r.height });
    });
    womenRefs.current.forEach((el, id) => {
      const r = el.getBoundingClientRect();
      wR.set(id, { x: r.left - box.left, y: r.top + r.height / 2 - box.top, w: r.width, h: r.height });
    });
    setRects({ men: mR, women: wR });
  }, []);

  useEffect(() => {
    measureRects();
    const ro = new ResizeObserver(measureRects);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [measureRects, men, women]);

  // Re-measure when state changes so lines track the (possibly re-laid-out) nodes
  useEffect(() => {
    requestAnimationFrame(measureRects);
  }, [state, measureRects]);

  const actionLabel = (() => {
    if (!lastAction || lastAction.type === "finish") return null;
    if (lastAction.type === "propose") return `${lastAction.man} proposes to ${lastAction.woman}`;
    if (lastAction.type === "accept")  return `${lastAction.woman} accepts ${lastAction.man}`;
    if (lastAction.type === "reject")  return `${lastAction.woman} rejects ${lastAction.man}`;
    if (lastAction.type === "dump")    return `${lastAction.woman} dumps ${lastAction.oldMan} for ${lastAction.man}`;
    return null;
  })();

  return (
    <div
      ref={containerRef}
      className="relative mx-auto flex w-full max-w-4xl justify-between rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-sm p-8 shadow-card-lg gap-4"
    >
      {/* SVG overlay — ref-measured lines */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        {women.map((w) => {
          const mId = engagements[w.id];
          if (!mId) return null;
          const mRect = rects.men.get(mId);
          const wRect = rects.women.get(w.id);
          if (!mRect || !wRect) return null;

          const isJustEngaged = lastAction?.type === "accept" && lastAction.man === mId && lastAction.woman === w.id;
          const isDumped      = lastAction?.type === "dump"   && lastAction.oldMan === mId && lastAction.woman === w.id;

          const color = isJustEngaged ? "#10b981" : "#6366f1";
          const opacity = isDumped ? 0 : 0.85;

          return (
            <motion.g
              key={`${mId}-${w.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity }}
              transition={{ duration: 0.4 }}
            >
              {/* Connection line */}
              <line
                x1={mRect.x}
                y1={mRect.y}
                x2={wRect.x}
                y2={wRect.y}
                stroke={color}
                strokeWidth={isJustEngaged ? 2 : 2.5}
                strokeDasharray={isJustEngaged ? "6,4" : "none"}
              />
              {/* Origin dot (man side) */}
              <circle cx={mRect.x} cy={mRect.y} r={4} fill={color} />
              {/* Destination dot (woman side) */}
              <circle cx={wRect.x} cy={wRect.y} r={4} fill={color} />
            </motion.g>
          );
        })}
      </svg>

      {/* ── Men Column ── */}
      <div className="flex flex-col gap-4 relative z-10 w-[38%]">
        <h3 className="text-center text-xs font-semibold tracking-widest uppercase text-slate-400 mb-1">
          Men (Proposers)
        </h3>
        {men.map((m) => {
          const isProposing = (lastAction?.type === "propose" || lastAction?.type === "reject") && lastAction.man === m.id;
          const isFree      = freeMen.includes(m.id);
          const isEngaged   = !isFree && !isProposing;

          return (
            <motion.div
              key={m.id}
              layout
              ref={(el) => { if (el) menRefs.current.set(m.id, el); else menRefs.current.delete(m.id); }}
              animate={isProposing ? { scale: [1, 1.03, 1] } : { scale: 1 }}
              transition={{ duration: 0.4, repeat: isProposing ? Infinity : 0, repeatType: "loop" }}
              className={[
                "flex h-[4.5rem] items-center justify-between rounded-xl border-2 px-4 transition-all duration-300",
                isProposing ? "border-proposing-400 bg-proposing-50 shadow-glow-amber"
                  : isEngaged ? "border-primary-400 bg-primary-50 shadow-glow-indigo"
                  : "border-slate-200 bg-slate-50",
              ].join(" ")}
            >
              <div>
                <div className="font-semibold text-slate-800">{m.name}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {m.preferences.join(" › ")}
                </div>
              </div>
              {isFree
                ? <span className="text-[10px] font-semibold tracking-wide uppercase text-slate-400">Free</span>
                : isProposing
                ? <span className="text-[10px] font-semibold tracking-wide uppercase text-proposing-600">→</span>
                : null
              }
            </motion.div>
          );
        })}
      </div>

      {/* ── Action Indicator (Center) ── */}
      <div className="flex w-[16%] flex-col items-center justify-center text-center z-10">
        <AnimatePresence mode="wait">
          {actionLabel && (
            <motion.div
              key={actionLabel}
              initial={{ opacity: 0, y: 8, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.92 }}
              transition={{ duration: 0.25 }}
              className="rounded-xl bg-slate-800 px-3 py-2.5 text-[11px] font-medium text-white shadow-lg leading-snug"
            >
              {actionLabel}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Women Column ── */}
      <div className="flex flex-col gap-4 relative z-10 w-[38%]">
        <h3 className="text-center text-xs font-semibold tracking-widest uppercase text-slate-400 mb-1">
          Women (Reviewers)
        </h3>
        {women.map((w) => {
          const isReceiving   = lastAction && lastAction.woman === w.id && lastAction.type !== "finish";
          const currentPartner = engagements[w.id];

          return (
            <motion.div
              key={w.id}
              layout
              ref={(el) => { if (el) womenRefs.current.set(w.id, el); else womenRefs.current.delete(w.id); }}
              className={[
                "flex h-[4.5rem] items-center justify-between rounded-xl border-2 px-4 transition-all duration-300",
                isReceiving && lastAction?.type === "reject"
                  ? "border-red-300 bg-red-50"
                  : isReceiving
                  ? "border-proposing-400 bg-proposing-50 shadow-glow-amber"
                  : currentPartner
                  ? "border-engaged-400 bg-engaged-50 shadow-glow-emerald"
                  : "border-slate-200 bg-slate-50",
              ].join(" ")}
            >
              <div>
                <div className="font-semibold text-slate-800">{w.name}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {w.preferences.join(" › ")}
                </div>
              </div>
              {currentPartner ? (
                <span className="text-[11px] font-semibold text-engaged-600 flex items-center gap-1">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  {currentPartner}
                </span>
              ) : (
                <span className="text-[10px] font-semibold tracking-wide uppercase text-slate-400">Free</span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}


