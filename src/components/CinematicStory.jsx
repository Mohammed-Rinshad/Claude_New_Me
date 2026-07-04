import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Beat, ScrubNumber, BgLayer, useLocal } from './cine'

// One tall spacer drives ONE sticky stage. Every scene cross-fades on the same
// global progress (0→1), so the content is always pinned — no empty gaps.
//
// EVEN FRAME PACING ───────────────────────────────────────────────────────────
// The section has 15 story frames total. Previously each scene got a hand-picked
// progress window and packed a different number of beats into it, so a frame's
// scroll cost = window ÷ beats varied ~1.6× (some transitions took ~2 swipes, some
// ~1.5). Now every scene's window is sized in PROPORTION to its frame count and the
// beats inside it are spaced evenly (see `frameAt`), so ONE frame == 1/15 of the
// section EVERYWHERE. Result: every story frame requires the same amount of
// scrolling, and one normal swipe advances ≈ one frame. Still fully scrub-based —
// small gestures still move proportionally; nothing is snapped or page-locked.
const SCENES = { A: 3, B: 3, C: 2, D: 2, E: 2, F: 3 } // frames per scene (Σ = 15)

// Even beat timing inside a scene. The scene's local 0→1 is split into `k` equal
// slots (one per frame); frame `i` fades in, holds, then fades out within its slot
// with a fixed crossfade `FADE` (as a fraction of a slot), so each frame occupies
// exactly the same slice of scroll. First frame fades in from the scene start; last
// frame holds to the scene end (its bg cross-fades to the next scene). Returns Beat's
// at = [inStart, inEnd, outStart, outEnd] in scene-local space.
const FADE = 0.22
const frameAt = (i, k) => {
  const slot = 1 / k
  const s = i * slot
  const e = (i + 1) * slot
  const f = FADE * slot
  return [i === 0 ? 0 : s - f, s + f, i === k - 1 ? 1 : e - f, i === k - 1 ? 1 : e + f]
}

export default function CinematicStory() {
  const ref = useRef(null)
  const { scrollYProgress: g } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  // Scene windows sized proportional to frame count (cumulative k/15), so each of the
  // 15 frames spans an identical 1/15 of global progress.
  //   A 3 → 0.0000–0.2000 · B 3 → 0.2000–0.4000 · C 2 → 0.4000–0.5333
  //   D 2 → 0.5333–0.6667 · E 2 → 0.6667–0.8000 · F 3 → 0.8000–1.0000
  const A = useLocal(g, 0.0, 0.2) // imbalance  (cream)
  const B = useLocal(g, 0.2, 0.4) // crisis     (dark)
  const C = useLocal(g, 0.4, 0.5333) // choice   (dark)
  const D = useLocal(g, 0.5333, 0.6667) // pillars (forest)
  const E = useLocal(g, 0.6667, 0.8) // reversal  (yellow)
  const F = useLocal(g, 0.8, 1.0) // manual      (cream)

  // sub-progress motion values that must be created at top level (hooks). Ranges are
  // placed inside their frame's local hold window so they read the same as before.
  const ringO = useTransform(B, [0.26, 0.5], [0, 0.5])
  const revScale = useTransform(E, [0.05, 0.3], [0.8, 1])

  // choice words — staggered reveals inside Scene C's second frame (local hold ≈ 0.61→1)
  const words = [
    { w: 'Inquiry.', at: [0.64, 0.72] },
    { w: 'Discipline.', at: [0.74, 0.82] },
    { w: 'Consistency.', at: [0.84, 0.92] },
  ]
  const wO = words.map((x) => useTransform(C, x.at, [0, 1]))
  const wX = words.map((x) => useTransform(C, x.at, [-60, 0]))

  // pillars — staggered reveals inside Scene D's second frame (local hold ≈ 0.61→1)
  const pillars = [
    { n: '01', t: 'Plant-based food', at: [0.63, 0.72] },
    { n: '02', t: 'Disciplined movement', at: [0.7, 0.79] },
    { n: '03', t: 'Restorative sleep', at: [0.77, 0.86] },
    { n: '04', t: 'Resilient mindset', at: [0.84, 0.93] },
  ]
  const pO = pillars.map((x) => useTransform(D, [x.at[0], x.at[1]], [0, 1]))
  const pY = pillars.map((x) => useTransform(D, x.at, [60, 0]))

  return (
    <section id="about" ref={ref} style={{ height: '1100vh' }} className="relative">
      <div className="sticky top-0 h-[100lvh] w-full overflow-hidden bg-paper">
        {/* ── mood backgrounds (cross-fade) — boundaries follow the new scene windows ── */}
        <div className="absolute inset-0 bg-paper" />
        <BgLayer p={g} at={[0.185, 0.215, 0.52, 0.55]} className="bg-ink" />
        <BgLayer p={g} at={[0.52, 0.55, 0.655, 0.685]} className="bg-forest" />
        <BgLayer p={g} at={[0.655, 0.685, 0.785, 0.815]} className="bg-yellow" />
        <BgLayer p={g} at={[0.785, 0.815, 1, 1]} className="bg-paper" />

        {/* ════════ A · THE IMBALANCE ════════ */}
        {/* The single book (BookJourney) travels to the LEFT and HOLDS there while the
            text changes (beats 1 → 2), then glides to CENTER for beat 3. Text sits on
            the RIGHT half on desktop for the first two beats, and stacks below the book
            on mobile. During the beat 1 → 2 swap the book is stationary; only the text
            cross-fades. */}
        <Beat
          p={A}
          at={frameAt(0, SCENES.A)}
          className="text-ink pt-[52vh] lg:pt-0 lg:pl-[52vw] lg:pr-[6vw] lg:items-end lg:text-right"
        >
          <span className="eyebrow mb-6">Intro to the book</span>
          <h2 className="font-fat uppercase leading-[0.9] text-[12vw] sm:text-[8vw] lg:text-[5.4vw] max-w-5xl lg:max-w-[40vw]">
            We spend years building careers.
          </h2>
        </Beat>
        <Beat
          p={A}
          at={frameAt(1, SCENES.A)}
          className="text-ink pt-[52vh] lg:pt-0 lg:pl-[52vw] lg:pr-[6vw] lg:items-end lg:text-right"
        >
          <h2 className="font-display font-700 uppercase leading-[0.95] text-[10vw] sm:text-[6.5vw] lg:text-[4.6vw] max-w-4xl lg:max-w-[40vw]">
            And forget to invest in our health
            <br />
            with the same seriousness.
          </h2>
        </Beat>
        {/* book stays centred & focal; text anchored below — mobile sits higher to
            tighten the gap, desktop stays low so the smaller book clears it */}
        <Beat p={A} at={frameAt(2, SCENES.A)} className="text-ink !justify-end pb-[16vh] lg:pb-[8vh]">
          <p className="font-display uppercase text-3xl sm:text-5xl leading-tight max-w-3xl">
            <span className="text-forest">The New Me</span> exists to change that imbalance.
          </p>
        </Beat>

        {/* ════════ B · 2017, THE CRISIS ════════ */}
        <motion.div
          style={{ opacity: ringO }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full bg-red-700/30 blur-[140px]"
        />
        <Beat p={B} at={frameAt(0, SCENES.B)} className="text-paper">
          <span className="font-fat text-sage text-[26vw] sm:text-[18vw] lg:text-[15vw] leading-none">2017</span>
        </Beat>
        <Beat p={B} at={frameAt(1, SCENES.B)} className="text-paper">
          <p className="font-body text-paper/60 uppercase tracking-[0.2em] text-xs mb-6">The reports came back</p>
          <h2 className="font-display font-700 uppercase leading-[0.95] text-[10vw] sm:text-[6.5vw] lg:text-[5vw] max-w-4xl">
            Dangerously high
            <br />
            <span className="text-red-400">cholesterol &amp; sugar markers.</span>
          </h2>
          <div className="mt-10 font-fat text-paper text-7xl sm:text-8xl tabular-nums">
            <ScrubNumber p={B} range={[0.42, 0.58]} from={172} to={291} />
            <span className="text-paper/40 text-3xl align-top ml-2">mg/dL</span>
          </div>
        </Beat>
        <Beat p={B} at={frameAt(2, SCENES.B)} className="text-paper">
          <h2 className="font-display font-700 uppercase leading-[0.95] text-[11vw] sm:text-[7vw] lg:text-[5.5vw] max-w-4xl">
            Numbers that demand
            <br />
            <span className="text-red-400">lifelong medication.</span>
          </h2>
        </Beat>

        {/* ════════ C · THE CHOICE ════════ */}
        <Beat p={C} at={frameAt(0, SCENES.C)} className="text-paper">
          <h2 className="font-display font-700 uppercase leading-[0.95] text-[10vw] sm:text-[6.5vw] lg:text-[5vw] max-w-4xl">
            I refused to resign myself
            <br />
            to prescriptions.
          </h2>
        </Beat>
        <Beat p={C} at={frameAt(1, SCENES.C)} className="text-paper">
          <p className="font-body uppercase tracking-[0.2em] text-xs text-paper/50 mb-8">Instead, I chose</p>
          <div className="flex flex-col gap-2 sm:gap-4">
            {words.map((x, i) => (
              <motion.span
                key={x.w}
                style={{ opacity: wO[i], x: wX[i] }}
                className="font-fat uppercase leading-none text-[13vw] sm:text-[9vw] lg:text-[7vw] text-yellow"
              >
                {x.w}
              </motion.span>
            ))}
          </div>
        </Beat>

        {/* ════════ D · THE REBUILD / PILLARS ════════ */}
        <Beat p={D} at={frameAt(0, SCENES.D)} className="text-paper">
          <h2 className="font-fat uppercase leading-[0.9] text-[12vw] sm:text-[8vw] lg:text-[6vw]">
            So I rebuilt myself.
          </h2>
        </Beat>
        <motion.div
          style={{ opacity: useTransform(D, [0.39, 0.61, 0.9, 1], [0, 1, 1, 0]) }}
          className="absolute inset-0 flex items-center justify-center px-6"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10 max-w-6xl w-full">
            {pillars.map((x, i) => (
              <motion.div key={x.n} style={{ opacity: pO[i], y: pY[i] }} className="text-left border-t-2 border-paper/30 pt-5">
                <div className="font-fat text-yellow text-5xl lg:text-6xl leading-none">{x.n}</div>
                <div className="font-display font-700 uppercase text-xl lg:text-2xl mt-3 leading-tight text-paper">{x.t}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ════════ E · THE REVERSAL ════════ */}
        <Beat p={E} at={frameAt(0, SCENES.E)} className="text-ink">
          <p className="font-body uppercase tracking-[0.25em] text-sm text-ink/60 mb-6">And then —</p>
          <motion.h2 style={{ scale: revScale }} className="font-fat uppercase leading-[0.85] text-[15vw] sm:text-[11vw] lg:text-[9vw]">
            My markers
            <br />
            reversed.
          </motion.h2>
        </Beat>
        <Beat p={E} at={frameAt(1, SCENES.E)} className="text-ink">
          <h2 className="font-display font-700 uppercase leading-[0.95] text-[11vw] sm:text-[7vw] lg:text-[5.5vw] max-w-4xl">
            I did not need any
            <br />
            medicine, after all.
          </h2>
        </Beat>

        {/* ════════ F · THE MANUAL + QUOTE ════════ */}
        <Beat p={F} at={frameAt(0, SCENES.F)} className="text-ink">
          <h2 className="font-display font-700 uppercase leading-[0.95] text-[10vw] sm:text-[6.5vw] lg:text-[5vw] max-w-4xl">
            This is not advice
            <br />
            from the sidelines.
          </h2>
        </Beat>
        <Beat p={F} at={frameAt(1, SCENES.F)} className="text-ink">
          <h2 className="font-fat uppercase leading-[0.9] text-[12vw] sm:text-[8vw] lg:text-[6vw] max-w-5xl">
            It is a lived manual —
            <br />
            <span className="text-forest">written from the fire.</span>
          </h2>
        </Beat>
        <Beat p={F} at={frameAt(2, SCENES.F)} className="text-ink">
          {/* book intentionally omitted here — there is only ONE book, and its
              journey already ended at Scene A. This beat is the closing quote. */}
          <figure className="max-w-2xl text-center">
            <blockquote className="font-display uppercase text-3xl sm:text-4xl lg:text-5xl leading-[1.02]">
              “The best time to start was yesterday. The next best time is now.”
            </blockquote>
            <figcaption className="mt-5 font-sign text-forest text-4xl">Gagan Dhawan</figcaption>
          </figure>
        </Beat>
      </div>
    </section>
  )
}
