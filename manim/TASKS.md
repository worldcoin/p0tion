# Long Task: Trusted Setup Video (ManimCE)

Goal: produce a polished, beginner-friendly (~18 min) ManimCE video from `/Users/dcbuilder/Code/world/p0tion/scenes.md`, with improved visual language, slower transitions, and complete implementations for Scenes 1–11.

## Current Status (Updated 2026-02-11)
- Completed today:
  - Reworked Scene 1 to remove overlaps and simplify beginner framing.
  - Slowed global pacing constants for longer transitions.
  - Refactored Scene 4 flow to eliminate `P1/P2` label collisions.
  - Refined Scene 8 layout to avoid step-panel crowding and noisy text draw.
  - Simplified heavy text writes in Scenes 2/8/10 using cleaner fade-ins.
  - Rendered all scenes end-to-end at low quality and performed frame audits.
- Open issues:
  - Some mid-transition audit frames still look partially faded (expected during fade-in), but no hard overlaps remain in the updated scenes.

## Quality Bar
- Beginner-first: no unexplained jargon (if we say "trapdoor" or "soundness", define it on-screen immediately).
- Visual clarity: one main idea per beat; minimal simultaneous on-screen elements.
- Consistent design system: typography, spacing, stroke widths, and a small set of reusable components.
- Smooth pacing: longer transitions + more breathing room between concepts.
- Renderable end-to-end: `manim render -a` produces all scenes without manual edits.

## Environment
- Use Python 3.12 venv at `manim/.venv` (already created).
- Install deps: `cd manim && uv pip install -r requirements.txt`
- Render: `cd manim && . .venv/bin/activate && manim render -ql trusted_setup_video.py Scene01_Groth16Basics`

## Resume Tomorrow (Priority Order)
- [ ] Re-audit all scenes at `-qm` quality, not only `-ql`.
- [ ] Tighten Scene 7 visual storytelling (currently accurate but still dense for beginners).
- [ ] Add a simple recurring motif icon set (claim/secret/proof/setup) across Scenes 1–6 for continuity.
- [ ] Add brief narration placeholders as comments per beat in `trusted_setup_video.py`.
- [ ] Produce stitched preview (Scenes 1–3, then 4–8, then 9–11) for review.

## Work Items (Do In Order)

### 1) Redesign System (Must-Have)
- [x] Replace placeholder visuals with a cohesive look (thin strokes, subtle fills, better typography).
- [x] Add a shared background layer (subtle grid/vignette) that stays constant between scenes.
- [x] Centralize style tokens (colors, fonts, stroke widths, padding) in one place.
- [x] Create reusable UI components: title + subtitle layout helper.
- [x] Create reusable UI components: callout boxes (definition cards, warnings, takeaway banners).
- [ ] Create reusable UI components: simple icons (lock/key/box/gear) built from primitives or SVG.
- [x] Create reusable UI components: transcript block component (hash in/out) with consistent sizing.
- [ ] Add a scene-level transition helper: `transition_in()` + `transition_out()` with longer default run times.

### 2) Beginner Rewrite (Narrative + On-Screen Text)
- [ ] Update the animation beats to match a “zero preconception” audience:
  - [x] Scene 1 should explain “proof / statement / witness” without mentioning trapdoors yet.
  - [x] Scene 2 introduces “setup parameters / CRS” with everyday language.
  - [ ] Scene 3 introduces “toxic waste” and “forgery risk” (define “forgery” visually).
- [ ] Add on-screen definitions (short, 6–10 words) whenever introducing a term.
- [ ] Remove any “implied knowledge” phrasing (e.g., avoid “soundness” unless defined).

### 3) Implement Scenes (Polish + Complete)

Scene 1 (Groth16 basics)
- [x] Rebuild with fewer elements, slower pacing, clean composition.
- [x] Include 10s World ID + p0tion mention, then return to generic.

Scene 2 (CRS / PK / VK)
- [ ] CRS as “public configuration”.
- [ ] PK/VK roles clearly separated (visual legend).

Scene 3 (Toxic waste)
- [ ] Safe vs compromised split-screen with strong, readable contrast.
- [ ] Explicitly say: not about privacy leaks; about forging proofs.

Scene 4 (Updatable MPC)
- [x] Make transformations elegant: same object morphs; no clutter.
- [x] Visual emphasis: “one honest contribution is enough”.

Scene 5 (Transcript chain)
- [ ] Make hash-chain readable (short prefixes, consistent alignment).
- [ ] Show “anyone can verify” as an observer role checking blocks.

Scene 6 (Phase 1 vs Phase 2)
- [ ] Clear pipeline diagram; reuse the same diagram later as anchor.

Scene 7 (World ID 4.0 pivot)
- [ ] Show the 5 OPRF circuit cards + artifacts (`R1CS`, `WASM`).
- [ ] Show “repro anchor”: commit + compiler + sha256.

Scene 8 (p0tion workflow)
- [ ] Animate “participant token” moving through steps.
- [x] Show queue per circuit without overwhelming detail.
- [x] Keep CLI overlay minimal and stylish (monospace box).

Scene 9 (Finalization)
- [ ] Beacon -> final artifacts shelf with satisfying finalize stamp.
- [ ] Mention beacon hash as audit anchor (one line).

Scene 10 (Audit checklist)
- [ ] Checklist animation should be calm and readable (not “spammy”).

Scene 11 (Alternatives + outro)
- [ ] Keep neutral; end with a clean 3-bullet takeaway.

### 4) Timing + Transitions (Global)
- [x] Lengthen all transitions (default in/out >= 1.2s).
- [x] Add small pauses after key “aha” lines (0.4–0.8s).
- [x] Ensure no fast “blink” text; minimum on-screen time for reading.

### 5) Rendering + Review Artifacts
- [x] Generate representative audit PNGs for each scene into `manim/media/images/audit/...`.
- [x] Generate low-quality MP4 previews for Scenes 1–3 for early feedback.
- [x] Iterate on spacing/typography based on previews.

## Definition of Done
- All 11 scenes render cleanly in `-qm` without manual intervention.
- Visual system is consistent across scenes.
- Narrative is understandable to a viewer with no prior ZK knowledge.
- Transitions feel intentionally paced (no abrupt cuts).
