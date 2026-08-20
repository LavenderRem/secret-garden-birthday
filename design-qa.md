# Design QA — Secret Garden Birthday

## Comparison targets

- Desktop source: `public/assets/secret-garden-desktop.png` (`1487 x 1058`).
- Desktop implementation: `birthday-desktop-entry.png` (`1440 x 900`).
- Desktop side-by-side: `birthday-desktop-comparison.png`; source normalized to the `1440 x 900` implementation viewport.
- Mobile source: `public/assets/secret-garden-mobile.png` (`853 x 1844`).
- Mobile implementation: `birthday-mobile-entry.png`; CSS viewport measured `390 x 845` with a `390 x 844` browser capture.
- Mobile side-by-side: `birthday-mobile-comparison.png`; the browser panel's letterboxed page region was cropped and normalized to `390 x 844` before comparison.
- State: entry screen for visual comparison; seed, petal, and final-letter states were verified separately in the browser.

## Visual findings

- The generated desktop and mobile source artwork remains the dominant visual surface; text and controls are overlaid in the same pearl, blush, lavender, and warm-gold language.
- Desktop hierarchy is intentionally compact: the title remains two lines at `1440 x 900`, the CTA stays left of the hero flower, and the decorative cake/photo composition remains unobstructed.
- Mobile uses its own vertical art direction rather than cropping the desktop composition. The headline, CTA, flower, and photo trail remain legible within one viewport.
- The final birthday letter is centered and fully visible without internal scrolling at both tested viewports.
- No actionable P0, P1, or P2 visual findings remain.
- [P3] The in-app browser screenshot backend letterboxes emulated mobile captures. DOM bounds confirm `html`, `body`, `#root`, `.garden-stage`, and the background image all fill the CSS viewport; this is capture framing, not page whitespace.

## Interaction and accessibility evidence

- Browser-tested desktop journey: wake garden → focus the seed and press Enter → collect petals 1, 2, and 3 → open the birthday letter.
- Browser-tested mobile journey: wake garden → use the touch-friendly **轻触种下愿望** fallback → collect all three petals → open the birthday letter.
- Desktop layout metrics: viewport and document are both `1440 x 900`; final letter `620 x 531`, with `scrollHeight === clientHeight`.
- Mobile layout metrics: viewport and document are both `390 x 845`; final letter about `359 x 433`, with `scrollHeight === clientHeight`.
- The browser console contained only Vite/React development messages; there were no warning or error entries from the app.
- Pointer drag handlers are covered by regression checks and now complete successfully in the browser. Native HTML drag is intentionally disabled so the browser cannot leave the source seed visible behind a separate drag ghost.
- Focus-visible outlines and `prefers-reduced-motion` handling are present.

## Comparison history

1. Initial desktop capture exposed a three-line headline that competed with the hero artwork.
2. The content width and responsive type scale were tightened; the recapture holds the headline to two lines.
3. The initial pointer-drop implementation depended on asynchronously updated React state. A synchronous ref was added so pointer moves read the active drag state immediately.
4. Native HTML drag later produced a duplicate drag ghost while leaving the source seed in place. The native layer was removed; the single Pointer Events seed now moves to the flower and disappears when planted.
5. Desktop and mobile side-by-side comparisons were re-inspected after the fixes; no further blocking mismatch was found.

## Verification checklist

- [x] Fixed `100dvh` stage with no page scroll.
- [x] Dedicated mobile artwork via `<picture>`.
- [x] Three-stage birthday ritual with restart.
- [x] Keyboard and touch-friendly alternatives.
- [x] Desktop and mobile browser flow checks.
- [x] Full automated test suite and production build.
- [x] Sites packaging verification.

## Final result

final result: passed
