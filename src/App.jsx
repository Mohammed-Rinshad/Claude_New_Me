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
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true })
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
    const setWheelMultiplier = (m) => {
      const lenis = lenisRef.current
      if (!lenis) return
      if (lenis.virtualScroll?.options) lenis.virtualScroll.options.wheelMultiplier = m
      if (lenis.options) lenis.options.wheelMultiplier = m
    }
    const apply = (v) => setWheelMultiplier(bookWheelMultiplier(v))
    apply(journey.get())
    return journey.on('change', apply)
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
