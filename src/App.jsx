import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { motion, useScroll, useSpring } from 'framer-motion'
import AboutNav from './components/AboutNav'
import CinematicHero from './components/CinematicHero'
import CinematicStory from './components/CinematicStory'
import BookJourney from './components/BookJourney'
import MediaConversations from './components/MediaConversations'
import Author from './components/Author'
import AboutStats from './components/AboutStats'
import AboutFooter from './components/AboutFooter'

// ─────────────────────────────────────────────────────────────────────────────
// HERO / BOOK SCROLL FEEL — tune these after client testing without touching logic.
// They ONLY affect the storytelling section where the fixed book is visible; every
// section below the story keeps Lenis' default wheelMultiplier of 1 (untouched).
//
//   BOOK_SCROLL_MULTIPLIER   Lenis wheelMultiplier while the book is on screen.
//                            1 = default. Lower = less page travel per wheel/trackpad
//                            gesture (more controlled). Raise toward 1 for more travel.
//   BOOK_SCROLL_END_PROGRESS journey progress (0→1 across hero+story) at which normal
//                            sensitivity fully resumes. The book fades out at ≈0.263,
//                            so 0.28 leaves a small margin past the fade.
//   BOOK_SCROLL_RAMP         width of the progress band, ending at END_PROGRESS, over
//                            which the multiplier eases DAMPED→1 instead of stepping.
//                            Keeps the sensitivity change imperceptible. Set to 0 for a
//                            hard switch.
// ─────────────────────────────────────────────────────────────────────────────
const BOOK_SCROLL_MULTIPLIER = 0.75
const BOOK_SCROLL_END_PROGRESS = 0.28
const BOOK_SCROLL_RAMP = 0.04

// Multiplier for a given journey progress: flat DAMPED through the book zone, a short
// linear ease back to 1 across the ramp band, then flat 1 for the rest of the page.
const bookWheelMultiplier = (v) => {
  const rampStart = BOOK_SCROLL_END_PROGRESS - BOOK_SCROLL_RAMP
  if (v <= rampStart) return BOOK_SCROLL_MULTIPLIER
  if (v >= BOOK_SCROLL_END_PROGRESS) return 1
  const t = (v - rampStart) / BOOK_SCROLL_RAMP // 0→1 across the ramp band
  return BOOK_SCROLL_MULTIPLIER + (1 - BOOK_SCROLL_MULTIPLIER) * t
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO / BOOK MOBILE TOUCH FEEL — mobile-only, and scoped to the SAME hero/book zone
// as the wheel damping (boundary = BOOK_SCROLL_END_PROGRESS). Native touch scrolling
// is kept everywhere on the page EXCEPT that zone, where Lenis touch smoothing is
// switched on at runtime so a hard flick can't fling through the tall, scroll-scrubbed
// narrative. The switch is driven by `journey` progress and only ever flips while the
// finger is UP (lenis.isTouching gate), so a gesture never changes mode mid-swipe. It
// is disabled entirely under prefers-reduced-motion. Direct finger tracking stays 1:1
// (touchMultiplier is left at Lenis' default of 1) — only the post-release flick
// momentum is tamed.
//
//   BOOK_TOUCH_SYNC     master switch. false = native touch everywhere (original
//                       behaviour, nothing changes). true = smooth touch in the zone.
//   BOOK_TOUCH_INERTIA  Lenis `touchInertiaExponent` while smoothing is active. Lenis'
//                       default is 1.7; lower = shorter flick throw (more controlled).
//   BOOK_TOUCH_LERP     Lenis `syncTouchLerp` — smoothing of the post-release glide.
//                       Lenis' default is 0.075; higher = snappier settle (less floaty).
// ─────────────────────────────────────────────────────────────────────────────
const BOOK_TOUCH_SYNC = true
const BOOK_TOUCH_INERTIA = 1.4
const BOOK_TOUCH_LERP = 0.1

export default function App() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  // One continuous progress value across the hero + story. The single book reads
  // this raw (no spring — Lenis already smooths native scroll) so it travels from
  // the hero into the story with no seam, jump, or dead zone.
  const journeyRef = useRef(null)
  const lenisRef = useRef(null)
  const { scrollYProgress: journey } = useScroll({
    target: journeyRef,
    offset: ['start start', 'end end'],
  })

  useEffect(() => {
    // syncTouch starts FALSE so the whole page uses native touch by default; it is
    // toggled true only inside the book zone (see the effect below). touchMultiplier
    // stays 1 (finger tracking 1:1). syncTouchLerp / touchInertiaExponent are only
    // consumed by Lenis while syncTouch is active, so setting them here safely tunes
    // ONLY the in-zone touch feel and never affects wheel or native scrolling.
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1,
      syncTouchLerp: BOOK_TOUCH_LERP,
      touchInertiaExponent: BOOK_TOUCH_INERTIA,
    })
    lenisRef.current = lenis
    let id
    const raf = (time) => {
      lenis.raf(time)
      id = requestAnimationFrame(raf)
    }
    id = requestAnimationFrame(raf)

    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a) return
      const href = a.getAttribute('href')
      if (href.length < 2) return
      const el = document.querySelector(href)
      if (el) {
        e.preventDefault()
        lenis.scrollTo(el, { offset: 0 })
      }
    }
    document.addEventListener('click', onClick)

    return () => {
      cancelAnimationFrame(id)
      document.removeEventListener('click', onClick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  // Scroll feel — ONLY for the hero/book storytelling section. That region is very
  // tall, so with the default wheelMultiplier a single wheel/trackpad gesture flung
  // the page too far and the story felt jumpy/over-sensitive. While the book is on
  // screen we damp the per-gesture travel, then ease back to the default so every
  // section below the story scrolls exactly as before (see the tuning constants at
  // the top of this file). Lenis reads wheelMultiplier live from its VirtualScroll on
  // each wheel event, so this switches instantly and never needs the instance to be
  // recreated. Trackpad and mouse wheel both flow through the same handler, so both
  // desktop inputs are covered.
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    // DESKTOP (unchanged): damp wheel/trackpad travel inside the book zone.
    const setWheelMultiplier = (m) => {
      const lenis = lenisRef.current
      if (!lenis) return
      if (lenis.virtualScroll?.options) lenis.virtualScroll.options.wheelMultiplier = m
      if (lenis.options) lenis.options.wheelMultiplier = m
    }

    // MOBILE: enable Lenis touch smoothing ONLY inside the book zone. Two safety rails:
    //  • Never switch while a finger is down (lenis.isTouching) — a swipe can't change
    //    mode under the user's finger; the pending state applies on the next update
    //    once the gesture ends. Toggling only between gestures is jump-free because
    //    Lenis keeps its internal scroll synced to the real scroll while native/idle.
    //  • Respect prefers-reduced-motion and the BOOK_TOUCH_SYNC master switch: when
    //    either opts out, syncTouch stays false → native touch everywhere.
    // Outside the zone syncTouch is false, so every lower section keeps native mobile
    // scrolling exactly as before.
    const setTouchSync = (v) => {
      const lenis = lenisRef.current
      if (!lenis || !lenis.options) return
      if (lenis.isTouching) return // don't flip mode during an active gesture
      const wantSync =
        BOOK_TOUCH_SYNC && !reduceMotion.matches && v < BOOK_SCROLL_END_PROGRESS
      if (lenis.options.syncTouch !== wantSync) lenis.options.syncTouch = wantSync
    }

    const apply = (v) => {
      setWheelMultiplier(bookWheelMultiplier(v))
      setTouchSync(v)
    }

    apply(journey.get())
    const unsub = journey.on('change', apply)
    // Re-evaluate if the user's reduced-motion preference changes at runtime.
    const onReduceMotionChange = () => apply(journey.get())
    reduceMotion.addEventListener?.('change', onReduceMotionChange)

    return () => {
      unsub()
      reduceMotion.removeEventListener?.('change', onReduceMotionChange)
    }
  }, [journey])

  return (
    <div className="grain relative">
      {/* cinematic scroll-progress bar */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-forest origin-left z-[60]"
      />
      <AboutNav />
      {/* the single persistent storytelling book — direct child of the
          untransformed root so position:fixed stays viewport-relative */}
      <BookJourney p={journey} />
      <main>
        {/* hero + story share one scroll context that drives the book */}
        <div ref={journeyRef}>
          <CinematicHero />
          <CinematicStory />
        </div>
        <MediaConversations />
        <Author />
        <AboutStats />
      </main>
      <AboutFooter />
    </div>
  )
}
