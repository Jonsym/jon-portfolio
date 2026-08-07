/**
 * The cat drawing itself — shared by the hero mascot and the site logo so the
 * two can never drift apart. Single-weight linework in the style of a marker
 * sketch, drawn in `currentColor`; shapes are filled with `fill` (normally the
 * page colour) so they occlude each other instead of showing every line
 * through.
 *
 * The eyes are NOT part of this group: both consumers draw them on top so the
 * hero can track the cursor with the pupils without re-running its filter, and
 * so the logo can keep them crisp. Use the exported eye geometry to place them.
 */

export const VIEW_BOX = "0 0 600 620";

export const EYE_L = { cx: 203, cy: 202 };
export const EYE_R = { cx: 361, cy: 202 };
export const EYE_RX = 50;
export const EYE_RY = 18;
export const PUPIL_R = 16;

/** Everything except the eyes: body, tail, book, paws, nose, whiskers. */
export function CatLines({ fill }: { fill: string }) {
  return (
    <>
      {/* tail — a long loop tucked behind the body */}
      <path
        fill={fill}
        d="M190 492 C112 484 46 506 42 536 C38 566 98 586 170 578 C108 576 62 562 62 540 C62 516 124 502 190 492 Z"
      />

      {/* head + body, one blob with two ears */}
      <path
        fill={fill}
        d="M128 58 L194 138 L340 140 L392 70
           C460 118 520 200 532 300
           C544 400 512 502 424 540
           C340 576 232 570 166 522
           C92 468 60 388 64 300
           C68 210 96 122 128 58 Z"
      />

      {/* nose */}
      <circle cx="280" cy="206" r="6" fill="currentColor" />
      <path d="M283 212 L295 231" strokeWidth="6" />
      <path d="M289 228 L302 235" strokeWidth="10" />

      {/* whiskers, fanning up out of the book */}
      <g strokeWidth="5">
        <path d="M352 296 C306 260 254 242 214 236" />
        <path d="M352 296 C318 252 288 232 262 222" />
        <path d="M352 296 C336 250 328 230 320 216" />
        <path d="M352 296 C356 250 362 230 370 218" />
        <path d="M352 296 C374 254 400 238 420 228" />
        <path d="M352 296 C384 262 420 244 448 238" />
      </g>

      {/* open book */}
      <path fill={fill} d="M190 266 L190 424 C238 424 300 440 344 470 L344 314 C300 284 238 266 190 266 Z" />
      <path fill={fill} d="M480 252 L480 410 C432 410 380 432 344 470 L344 314 C380 276 432 252 480 252 Z" />
      <path d="M344 314 L344 470" />
      <path d="M362 306 L362 462" />

      {/* left arm + paw */}
      <path fill={fill} d="M96 300 C146 314 198 332 230 356 C246 368 240 392 217 395 C182 398 132 362 96 332 Z" />
      <g strokeWidth="5">
        <path d="M228 376 L250 371" />
        <path d="M232 388 L254 389" />
        <path d="M228 399 L246 407" />
      </g>

      {/* right arm + paw, hooked over the far page */}
      <path fill={fill} d="M504 240 C500 298 488 342 468 368 C450 391 414 384 412 358 C410 328 442 272 466 234 Z" />
      <g strokeWidth="5">
        <path d="M408 344 L387 337" />
        <path d="M406 358 L384 358" />
        <path d="M412 371 L394 380" />
      </g>

      {/* front foot poking out at the bottom */}
      <path fill={fill} d="M286 546 C330 578 396 588 436 568 C456 558 452 534 430 532 C388 528 328 530 286 546 Z" />
      <g strokeWidth="5">
        <path d="M400 578 L402 596" />
        <path d="M420 576 L428 592" />
        <path d="M438 566 L452 578" />
      </g>
    </>
  );
}
