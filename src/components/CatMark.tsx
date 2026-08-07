import { CatLines, EYE_L, EYE_R, EYE_RX, EYE_RY, PUPIL_R, VIEW_BOX } from "./CatArt";

/**
 * Brand mark — the exact drawing used for the hero mascot (see `HeroMascot`),
 * held still: no boil, no blink, no cursor tracking.
 *
 * Strokes are `currentColor`, so the mark takes the text colour of whatever it
 * sits in. Fills knock shapes out against the page colour, so the mark expects
 * a `--background`-coloured surface behind it.
 *
 * Note the drawing is detailed for its size — below roughly 64px the book and
 * whiskers stop resolving. Give it room where you can.
 */

const BG = "var(--background, #0a0a0a)";

export default function CatMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox={VIEW_BOX} aria-hidden="true" focusable="false" className={className}>
      <g fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
        <CatLines fill={BG} />

        {/* eyes, glancing right */}
        <ellipse cx={EYE_L.cx} cy={EYE_L.cy} rx={EYE_RX} ry={EYE_RY} fill={BG} />
        <ellipse cx={EYE_R.cx} cy={EYE_R.cy} rx={EYE_RX} ry={EYE_RY} fill={BG} />
        <g stroke="none" fill="currentColor">
          <circle cx={EYE_L.cx + 26} cy={EYE_L.cy} r={PUPIL_R} />
          <circle cx={EYE_R.cx + 26} cy={EYE_R.cy} r={PUPIL_R} />
        </g>
      </g>
    </svg>
  );
}
