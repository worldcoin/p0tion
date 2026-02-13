# Trusted Setup, Explained: Groth16 Basics, Then World ID 4.0 and p0tion

## Overview
- **Topic**: Groth16 "Phase 2" trusted setup ceremonies (MPC), what they produce, and how this looks in a real ceremony (World ID 4.0 run with p0tion tooling).
- **Hook**: How can a system require a secret key to be destroyed… and still be safe when no one can prove they destroyed it?
- **Target Audience**: Software engineers and crypto-curious builders; assumes basic familiarity with "public/private keys" and hashes, but no pairing math.
- **Estimated Length**: ~15-20 minutes
- **Key Insight**: A trusted setup can be made "trust-minimized" via an updatable MPC: if at least one participant contributes fresh randomness and destroys it, then no one can reconstruct the trapdoor ("toxic waste"), even if everyone else is compromised.

## Narrative Arc
We start with a fast, concrete Groth16 explainer (what a proof is, what is being verified, what "witness" means). Then we confront the uncomfortable premise: Groth16 needs per-circuit public parameters that come from secret randomness that must never be known again. Next comes the "aha": many participants can jointly generate these parameters, in a way that is publicly verifiable but privately irreversible. Finally, we switch into a real-world case study: the World ID 4.0 circuits and how p0tion coordinates contributions, transcripts, finalization, and auditability.

---

## Scene 1: Zero-Knowledge Proofs (Password Example)
**Duration**: ~75 seconds
**Purpose**: Explain statement/witness/proof with no crypto background, then plant the “some systems need setup” question and name the case study up front.

### Visual Elements
- A tiny opener card: `Case Study Later: World ID 4.0 + p0tion`.
- Two role tokens: `Prover` and `Verifier`.
- A big `Statement (public)` card: "I know a password that unlocks this box."
- A small `Password (secret)` tag near the prover that fades / tucks away.
- A `Proof` ticket that moves from prover to verifier.
- A green `ACCEPT` tag near the verifier.
- A 3-line definitions stack (short):
  - "Statement: what you claim"
  - "Witness: the secret"
  - "Proof: convinces without revealing"
- A final teaser card: "Some proof systems need a one-time setup."

### Content
1. **10-second teaser**: "World ID 4.0 uses Groth16 proofs, and p0tion is one of the toolchains used to run the trusted setup ceremony. We'll come back to that after the basics."
2. Show the statement in plain language (password example).
3. Show the password tag near the prover, then fade it back: "Verifier never sees the password."
4. Prover generates a proof ticket and sends it to the verifier.
5. Verifier checks and shows `ACCEPT`.
6. Show the three definitions (statement/witness/proof).
7. End with the teaser: "Some proof systems need a one-time setup."

### Narration Notes
- Don’t start with jargon. Use “password/lock” first, then optionally name Groth16 as “one popular type of ZK proof system”.
- Mention World ID + p0tion only briefly here (name drop + promise), then stay generic until the case-study pivot.

### Technical Notes
- Keep one idea per beat; avoid multiple simultaneous text blocks.
- Slow transitions so first-time viewers can read.

---

## Scene 2: Trusted Setup Outputs (Setup Params, Proving Key, Verifying Key)
**Duration**: ~75 seconds
**Purpose**: Define the artifacts without drowning in details.

### Visual Elements
- A big "Setup parameters (public)" box.
- Split into `Proving Key` and `Verifying Key` inside the box.
- Two short notes: "Used by the prover" and "Used by the verifier".

### Content
1. Introduce the setup parameters box: it is published to everyone.
2. Emphasize: proving key helps create proofs; verifying key helps check proofs.
3. Clarify scope (lightly): Groth16 needs this per circuit (Phase 2).

### Narration Notes
- Avoid equations; keep it about roles and artifacts.
- Set expectations: "We’ll soon see why Groth16 needs per-circuit setup."

### Technical Notes
- Use `VGroup` to keep the CRS/PK/VK objects as a single transformable unit in later scenes.

---

## Scene 3: The Toxic Waste (What Goes Wrong If Someone Keeps It)
**Duration**: ~100 seconds
**Purpose**: Explain the actual risk and a key misconception.

### Visual Elements
- A red "Setup secret" vial labeled `(must be destroyed)`.
- A split view:
  - "If destroyed" (safe)
  - "If kept" (danger)
- Two proof tickets that look identical, with a small "fake" tag on the dangerous side.

### Content
1. Show the toxic waste vial being produced as a byproduct of setup.
2. Show two universes:
   - **Safe**: vial is destroyed; only valid statements can pass.
   - **Compromised**: attacker keeps it and forges proofs for false statements.
3. Address misconception:
   - It does not reveal your secret.
   - It enables fake proofs that still verify.

### Narration Notes
- Use a clear analogy: "It’s like having a master key that can open the verifier’s lock."
- Emphasize irreversibility: forged proofs are designed to look normal.

### Technical Notes
- Color code: red for toxic waste, green for verified passage, gray for "indistinguishable proof objects".
- Use `Indicate`/`Wiggle` on the toxic waste vial at key moments.

---

## Scene 4: The Aha Moment (Updatable Setup With Many Contributors)
**Duration**: ~140 seconds
**Purpose**: Deliver the core intuition: "one honest participant is enough."

### Visual Elements
- A single "parameter shard" object: a point-like marker labeled `G` (think: an elliptic curve point, but don’t say that yet).
- A sequence of contributors `C1, C2, C3, ...` each with a private dice roll `r_i`.
- A transformation arrow: `G -> r_i * G` (rendered as "scramble" rather than algebra).
- A "shredder" icon to represent destroying `r_i`.

### Content
1. Start with a public seed parameter `G`.
2. Contributor 1 secretly picks `r1`, transforms `G` into `G1`, then destroys `r1`.
3. Contributor 2 repeats: `G1 -> G2`, destroys `r2`.
4. Zoom out: final parameter contains all contributions, but nobody knows the combined secret unless everyone colludes and keeps their randomness.
5. Highlight the security condition with a big on-screen sentence:
   - "If at least one contributor destroys their secret, the toxic waste cannot be reconstructed."

### Narration Notes
- Keep the algebra minimal. A single line is enough:
  - "The final secret is effectively the product of all the private randomness."
- Make the "one honest party" idea feel surprising but inevitable.

### Technical Notes
- Use `Transform` (not replace) so the parameter object visibly "evolves" through contributors.
- Use `ValueTracker` to animate a "scramble level" indicator that increases each contribution.

---

## Scene 5: "Publicly Verifiable, Privately Irreversible"
**Duration**: ~90 seconds
**Purpose**: Explain how we can verify each step without learning secrets.

### Visual Elements
- A "Transcript Chain": blocks connected with arrows: `T0 -> T1 -> T2 -> ...`.
- Each block shows two hashes: `input hash`, `output hash`.
- A "Consistency Check" scale icon (like a balance) to represent verification.

### Content
1. Show that each contribution publishes a transcript entry:
   - what it started from (hash),
   - what it produced (hash),
   - a proof it was computed correctly.
2. The crowd can verify:
   - the chain links correctly,
   - the proofs check out.
3. Stress that verification is about correctness, not about recovering the secret.

### Narration Notes
- "Think of it like verifying a shuffle: you can check the shuffle was valid without knowing the shuffler’s private randomness."

### Technical Notes
- Use `Code`/`Text` objects to show hashes as short hex prefixes (e.g., `a3f9...`).
- Use `LaggedStart` to build the chain rhythmically.

---

## Scene 6: Phase 1 vs Phase 2 (Where Groth16 Fits)
**Duration**: ~90 seconds
**Purpose**: Place "Phase 2 trusted setup" in the larger pipeline.

### Visual Elements
- A pipeline diagram:
  - `Phase 1 (Powers of Tau, universal)` -> `.ptau`
  - `Circuit (R1CS/constraints)` -> `Phase 2 (circuit-specific)` -> `.zkey`
- A "Blueprint" sheet labeled `circuit.r1cs`.
- A stack of "circuits" to show multiple circuits require multiple Phase 2 ceremonies.

### Content
1. Explain Phase 1 at a high level: produces reusable universal material.
2. Explain Phase 2: binds parameters to a specific circuit.
3. Mention contrast (briefly): some systems only need universal setup (or none), but Groth16 needs per-circuit Phase 2.

### Narration Notes
- Avoid getting into proving systems taxonomy too early; keep it 1-2 sentences.

### Technical Notes
- Use `Arrow` + `SurroundingRectangle` highlights to step through the pipeline.
- Keep this diagram on-screen and reuse it in later scenes (transform-based continuity).

---

## Scene 7: Case Study Pivot (World ID 4.0 Circuits and What’s Being Set Up)
**Duration**: ~80 seconds
**Purpose**: Transition from generic Groth16 to the concrete World ID 4.0 + p0tion example.

### Visual Elements
- A clean "World ID 4.0" title card with a subtitle: `Proof of Personhood (case study)`.
- A "Circuit stack" labeled `OPRF-service circuits` with 5 circuit cards:
  - `OPRFQueryProof`
  - `OPRFNullifierProof`
  - `OPRFKeyGenProof13`
  - `OPRFKeyGenProof25`
  - `OPRFKeyGenProof37`
- Two artifact icons per circuit card: `R1CS` + `WASM`.
- A "Repro Anchor" card: `source commit`, `circom version`, `sha256 hashes`.

### Content
1. Introduce World ID at a high level: a system that relies on ZK proofs for privacy-preserving verification (proof of personhood).
2. Explain that World ID 4.0 uses multiple Groth16 circuits (stack of circuit cards above), and each circuit needs its own Phase 2 parameters.
3. Show what the ceremony binds to:
   - circuit definition (`.r1cs` constraints),
   - proving runtime (`.wasm`),
   - and a Phase 1 `.ptau` input (from the prior scene’s pipeline).
4. Add one concrete auditability point: publishing exact sources + compiler versions + hashes makes the ceremony inputs reproducible.

### Narration Notes
- Keep this as "why this case study matters": multiple circuits, real production use, and a public process.
- Avoid deep World ID protocol internals; focus on "multiple circuits, big artifacts, public audit trail."

### Technical Notes
- Use the existing Phase1/Phase2 pipeline diagram and attach the World ID circuit stack onto the "Circuit" input.
- Use short, readable hash prefixes (`0443...`) rather than full lines of hex.

---

## Scene 8: The Ceremony Workflow in Practice (p0tion: Coordinator + Participants)
**Duration**: ~150 seconds
**Purpose**: Map the abstract ceremony into a concrete, operational workflow (queue, steps, artifacts, attestations).

### Visual Elements
- Roles row:
  - `Coordinator` (publishes setup, manages queue, finalizes)
  - `Participants` (download, contribute entropy, upload)
  - `Verifiers/Observers` (independently verify transcript and hashes)
- A "Queue per circuit" conveyor belt: `Circuit 1`, `Circuit 2`, ...
- A small CLI overlay (minimal) showing the idea of commands:
  - `world-id-trusted-setup-cli auth`
  - `world-id-trusted-setup-cli contribute`
  - `world-id-trusted-setup-cli coordinate setup | observe | finalize`
- Steps card that follows one participant:
  1. Authenticate / register
  2. Wait in queue
  3. Download latest artifacts
  4. Contribute entropy (local compute)
  5. Upload contribution
  6. Verify and attest

### Content
1. Show that contributions are sequential per circuit: one contributor at a time.
2. Show how the transcript grows with each contribution.
3. Show what "attestation" means: a public statement tying your identity to a contribution hash.
4. In one beat, connect to p0tion-style tooling: participants authenticate, contribute, and can publish attestations; coordinators set up and finalize.

### Narration Notes
- Keep it operational: "Most of the ceremony is logistics wrapped around a tiny math operation."
- Mention real-world constraints: timeouts, retries, bandwidth, large files.
- Name p0tion once as "the ceremony coordination toolchain" and keep the rest tool-agnostic (the workflow is the point).

### Technical Notes
- Use `Table`-like layout with `VGroup` and aligned `Text` objects.
- Use `AnimationGroup` to move a participant token through the step cards.

---

## Scene 9: Finalization (Beacon + Production Artifacts)
**Duration**: ~110 seconds
**Purpose**: Explain the last step (public beacon) and the concrete outputs apps use (vkey + verifier + final zkey).

### Visual Elements
- A "Beacon" object: a lighthouse emitting rays labeled `public randomness (delayed)`.
- A final "Artifacts" shelf:
  - `final.zkey` (final transcript)
  - `verification_key.json`
  - `verifier.sol` (or verifier contract)
- A stamp: `FINALIZED`.

### Content
1. Explain "public beacon" at an intuition level:
   - a public value chosen so it can’t be predicted ahead of time,
   - used to apply a final, publicly verifiable "scramble".
2. The coordinator exports the production artifacts from the finalized transcript.
3. The verifier key and verifier contract are what apps use to verify proofs.
4. Optional (1 sentence): publish the beacon hash as a public anchor so observers can reproduce the finalization step.

### Narration Notes
- Keep it short and practical: "After this point, the ceremony is done. Nobody needs to be trusted anymore."

### Technical Notes
- Animate beacon rays with `ShowPassingFlash` or repeated `FadeIn/FadeOut` on `Line` segments.
- Use `ReplacementTransform` from "latest transcript" into "final transcript" rather than spawning a new file.

---

## Scene 10: What Should Viewers Actually Trust (Audit Checklist)
**Duration**: ~90 seconds
**Purpose**: Give a concrete audit checklist, tied to the case study but broadly applicable.

### Visual Elements
- A checklist with checkboxes:
  - "I can verify the transcript chain end-to-end"
  - "Circuit inputs are reproducible (source commit + compiler version + artifact hashes)"
  - "Contribution hashes match"
  - "Final beacon hash is published"
  - "Final artifacts are derived from the finalized transcript"
  - "At least one contributor plausibly used fresh entropy and destroyed it"
- A "Transparency board" showing links/hashes/attestations.

### Content
1. Stress: you are not trusting one person; you're trusting a public process plus at-least-one honest contributor.
2. Observers can independently run verification and compare hashes.
3. Reframe trust: "trust in a claim that at least one participant was honest", not "trust the coordinator forever."

### Narration Notes
- This is the "empower the viewer" moment. Slow down slightly.

### Technical Notes
- Use `Checkmark` objects that animate in sync with narration.
- Use `Circumscribe` on the "at least one honest participant" line.

---

## Scene 11: Alternatives and Tradeoffs (Why People Still Use Groth16)
**Duration**: ~80 seconds
**Purpose**: Context and closure; avoid leaving the viewer with "this is terrible".

### Visual Elements
- A 3-column comparison card:
  - `Groth16`: fast verification, small proofs, per-circuit setup
  - `Universal-setup SNARKs`: simpler ceremonies, different tradeoffs
  - `STARKs`: transparent setup, bigger proofs
- A final "takeaway" banner.

### Content
1. Explain why people accept ceremonies: performance and ecosystem maturity.
2. Mention that some applications prefer transparent setup systems; others accept ceremonies.
3. Close the loop: the ceremony is a one-time cost to remove toxic waste from the system.

### Narration Notes
- Keep it neutral; this is not a "pick a winner" segment.

### Technical Notes
- Use `FadeTransform` into a final "Summary" frame with 3 bullet takeaways.

---

## Transitions & Flow
- Keep a single recurring object: the "CRS box" that evolves over time.
- Reuse the transcript chain: Scene 5 introduces it, Scenes 8-10 reuse it.
- Scene endings should "resolve" visually:
  - Scene 4 ends with the bold "one honest contributor" line.
  - Scene 9 ends with artifacts neatly placed on the shelf.
  - Scene 11 ends with a clean comparison card and takeaway banner.

## Color Palette
- Primary: `#2DD4BF` (teal) - public/verified/progress
- Secondary: `#60A5FA` (blue) - neutral technical objects (CRS box, transcript chain)
- Accent: `#F59E0B` (amber) - secrets/entropy before destruction
- Danger: `#EF4444` (red) - toxic waste / compromised path
- Background: `#0B1020` (deep navy)
- Text: `#E5E7EB` (light gray)

## Mathematical Content
- Minimal group intuition:
  - A parameter can be "scrambled" by multiplying it by secret randomness.
  - Sequential contributions compose into one combined secret.
- Minimal notation to render (only if desired):
  - `P -> r * P`
  - `r_total = r1 * r2 * ... * rn`
  - "Powers of tau" intuition: `{tau^0, tau^1, tau^2, ...}` as a ladder of powers.

## Implementation Order
1. Build reusable visual primitives:
   - CRS box (PK/VK split)
   - Transcript chain blocks (hash in/out)
   - Participant tokens (coordinator, participant, observer)
   - Gate + proof tickets + stamp/mold
2. Implement Scenes 1-6 first (core conceptual arc).
3. Implement Scene 7 (World ID 4.0 pivot) reusing the Phase1/Phase2 pipeline diagram.
4. Implement Scenes 8-10 (p0tion workflow + finalization + audit checklist).
5. Implement Scene 11 (comparison + outro).
