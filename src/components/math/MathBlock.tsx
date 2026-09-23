/**
 * MathBlock — KaTeX rendering wrapper for inline and display math.
 */

import katex from "katex";

interface MathBlockProps {
  /** LaTeX expression string. */
  tex: string;
  /** Render as display (block) math. Default: false (inline). */
  display?: boolean;
  /** Additional CSS class names. */
  className?: string;
}

export default function MathBlock({
  tex,
  display = false,
  className = "",
}: MathBlockProps) {
  const html = katex.renderToString(tex, {
    displayMode: display,
    throwOnError: false,
  });

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
