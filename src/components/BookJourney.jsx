import { useEffect, useRef, useState } from 'react'
import { motion, useTransform, useSpring } from 'framer-motion'

const ease = [0.16, 1, 0.3, 1]
const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

// ─────────────────────────────────────────────────────────────────────────────
// THE single storytelling book. Rendered once, position:fixed, and driven by ONE
// continuous progress value `p` (0→1) that spans the hero + story wrapper. There
// is no second book anywhere — it travels through Scene A and then fades out.
//
// Journey (in wrapper-progress space — tune the constants visually in dev):
//   0   → H     HERO: identical to the original hero book (centered, rises, scales)
//   H   → B1    travels down-LEFT  (Scene A · "We spend years building careers")
//   B1  → B2    stays LEFT, fully anchored — only the text changes (Scene A · "And forget to invest…")
//   B2  → B3    travels from LEFT to CENTER, grows to focus (Scene A · "…change that imbalance")
//   B3  → HOLD  pinned centered while the beat is active
//   HOLD→ OUT   fades fully out — never appears in Scenes B–F or later sections
// ─────────────────────────────────────────────────────────────────────────────

// progress stops
const H = 0.105 // hero end / story start (≈ 140vh / (1440vh − 100svh))
const B1 = 0.15 // book settled LEFT  (beat 1 hold)
const B2 = 0.2 // book stays LEFT (beat 2 hold — only the text changes)
const B3 = 0.235 // book CENTER       (beat 3 in)
// HOLD/OUT are timed to Scene A's final beat ("…change that imbalance"), which is
// fully established by story-g≈0.148 and holds until Scene A ends at g≈0.20. The book
// stays pinned centred with that line through its whole moment (HOLD→g≈0.185), then
// fades across g≈0.185→0.213 — exactly the window in which the dark Scene B background
// cross-fades in (CinematicStory's ink BgLayer, at=[0.185,0.215,…]). So the book, its
// closing line, and the scene change all leave in lockstep as one cinematic
// composition, instead of the book vanishing ~40vh early (old OUT=0.263 → g≈0.16).
// Only the hold/fade timing changes here — movement, scale, rotation and centring are
// untouched (the last three position stops are already identical/centred).
const HOLD = 0.285 // pinned centre through the closing beat's full moment (g≈0.185)
const OUT = 0.31 // fades out in lockstep with the dark Scene B background (g≈0.213)

const STOPS = [0, H, B1, B2, B3, HOLD, OUT]

export default function BookJourney({ p }) {
  const imgRef = useRef(null)
  const [vw, setVw] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1280))
  const [vh, setVh] = useState(() => (typeof window !== 'undefined' ? window.innerHeight : 800))
  const [desktop, setDesktop] = useState(
    () => (typeof window !== 'undefined' ? window.matchMedia('(min-width:1024px)').matches : true)
  )

  useEffect(() => {
    const onResize = () => {
      setVw(window.innerWidth)
      setVh(window.innerHeight)
      setDesktop(window.matchMedia('(min-width:1024px)').matches)
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Movement is a single anchored arc: Center → Left (hold) → Center. No left↔right
  // bounce. Scale is kept in a tight band so the book never reads as "flying toward
  // you" — it stays at a consistent depth and simply travels through the story.
  // Desktop: book settles on the LEFT half and HOLDS there (B1==B2) while the text
  //          swaps on the right, then glides to centre for the final beat.
  // Mobile : book stays near top-centre (text stacks below) and only nudges ±24px.
  const xOut = desktop
    ? [0, 0, -0.27 * vw, -0.27 * vw, 0, 0, 0]
    : [0, 0, -24, 24, 0, 0, 0]

  // Y stays close to centre (small, smooth drift) — no big up-then-down jolt.
  // Final "imbalance" beat (last 3 stops): desktop lifts the book a touch to open
  // space for the text below; mobile brings it near centre to tighten the gap.
  const yOut = desktop
    ? [0, 0, 0.04 * vh, 0.04 * vh, -0.1 * vh, -0.1 * vh, -0.1 * vh]
    : [-0.08 * vh, -0.1 * vh, -0.14 * vh, -0.14 * vh, -0.04 * vh, -0.04 * vh, -0.04 * vh]

  // Near-constant scale (no hero zoom-forward). Desktop is kept a little smaller so
  // the book sits comfortably in the composition; the final "imbalance" beat (last 3
  // stops) shrinks further so it never overlaps the text. Mobile is left untouched.
  const scaleOut = desktop
    ? [1, 1, 0.94, 0.94, 0.82, 0.82, 0.82]
    : [1, 1, 1.02, 1.02, 1.12, 1.12, 1.12]

  // very gentle rotation only — no dramatic tilt. Desktop holds rotation flat across
  // B1→B2 (-1.5 → -1.5) so the book is perfectly stationary while the text swaps.
  // Mobile keeps its original subtle S-rotation (unchanged).
  const rotOut = desktop
    ? [-2, 1, -1.5, -1.5, 0, 0, 0]
    : [-2, 1, -1.5, 1.5, 0, 0, 0]

  const x = useTransform(p, STOPS, xOut)
  const y = useTransform(p, STOPS, yOut)
  const scale = useTransform(p, STOPS, scaleOut)
  const rotate = useTransform(p, STOPS, rotOut)
  // 1 through the whole journey, then fade out after the centred hold
  const opacity = useTransform(p, [0, HOLD, OUT], [1, 1, 0], { clamp: true })

  // ── subtle, heavy hover tilt (desktop / fine-pointer only) ──
  const tiltX = useSpring(0, { stiffness: 60, damping: 18, mass: 0.6 })
  const tiltY = useSpring(0, { stiffness: 60, damping: 18, mass: 0.6 })

  useEffect(() => {
    if (!desktop) return
    let raf = 0
    const onMove = (e) => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const el = imgRef.current
        if (!el) return
        const r = el.getBoundingClientRect()
        if (r.width === 0) return
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2)
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2)
        const near = Math.abs(dx) < 1.6 && Math.abs(dy) < 1.6
        // very subtle: max ±4° — a heavy, premium product feel
        tiltY.set(near ? clamp(dx, -1, 1) * 4 : 0)
        tiltX.set(near ? clamp(dy, -1, 1) * -4 : 0)
      })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [desktop, tiltX, tiltY])

  return (
    // full-screen, never blocks clicks/scroll; sits above story mood layers, below nav
    <div className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none">
      <motion.div style={{ x, y, scale, rotate, opacity }} className="relative">
        <motion.img
          ref={imgRef}
          src="/book.webp"
          alt="The New Me 2.0 — Reverse Aging, by Gagan Dhawan"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease }}
          style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 800 }}
          className="w-[66vw] max-w-[380px] lg:max-w-[480px] drop-shadow-[0_45px_70px_rgba(31,92,46,0.4)]"
        />
      </motion.div>
    </div>
  )
}
