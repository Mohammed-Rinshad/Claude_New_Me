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
//   NARRATIVE_SCROLL_MULTIPLIER  Lenis wheelMultiplier from 2017 through Media.
//   NARRATIVE_TOUCH_MULTIPLIER   Lenis touch travel multiplier in the same zone.
//   NARRATIVE_RAMP_*_VIEWPORTS   Viewport-based easing bands at the zone edges.
// ─────────────────────────────────────────────────────────────────────────────
const BOOK_SCROLL_MULTIPLIER = 0.75
const NARRATIVE_STORY_START_PROGRESS = 0.2 // CinematicStory scene B: 2017
const NARRATIVE_SCROLL_MULTIPLIER = 0.6
const NARRATIVE_RAMP_IN_VIEWPORTS = 0.4
const NARRATIVE_RAMP_OUT_VIEWPORTS = 0.8
const NARRATIVE_TOUCH_MULTIPLIER = 0.72
const NARRATIVE_TOUCH_INERTIA = 1.25
const NARRATIVE_TOUCH_LERP = 0.12

const clamp = (v, min, max) => Math.max(min, Math.min(max, v))
const mix = (from, to, t) => from + (to - from) * clamp(t, 0, 1)

// Keep the book/hero feel at 0.75, then use a more controlled profile only from
// 2017 through the end of Media. Ramp out before Author so lower sections are native.
const narrativeWheelMultiplier = (y, metrics) => {
  if (!metrics || y < metrics.start) return BOOK_SCROLL_MULTIPLIER
  if (y < metrics.start + metrics.rampIn) {
    return mix(
      BOOK_SCROLL_MULTIPLIER,
      NARRATIVE_SCROLL_MULTIPLIER,
      (y - metrics.start) / metrics.rampIn
    )
  }
  if (y < metrics.end - metrics.rampOut) return NARRATIVE_SCROLL_MULTIPLIER
  if (y < metrics.end) {
    return mix(
      NARRATIVE_SCROLL_MULTIPLIER,
      1,
      (y - (metrics.end - metrics.rampOut)) / metrics.rampOut
    )
  }
  return 1
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO / STORY MOBILE TOUCH FEEL — mobile-only, and scoped to the controlled story zone
// as the wheel damping. Native touch scrolling
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
  const { scrollY, scrollYProgress } = useScroll()
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
    let metrics = null

    const readMetrics = () => {
      const story = document.getElementById('about')
      const author = document.getElementById('author')
      if (!story || !author) return null

      const storyScrollable = Math.max(1, story.offsetHeight - window.innerHeight)
      const start = story.offsetTop + storyScrollable * NARRATIVE_STORY_START_PROGRESS
      const end = author.offsetTop
      const rampIn = window.innerHeight * NARRATIVE_RAMP_IN_VIEWPORTS
      const rampOut = Math.min(
        window.innerHeight * NARRATIVE_RAMP_OUT_VIEWPORTS,
        Math.max(1, (end - start) * 0.25)
      )

      return { start, end, rampIn, rampOut }
    }

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
    const setTouchProfile = (y) => {
      const lenis = lenisRef.current
      if (!lenis || !lenis.options) return
      if (lenis.isTouching) return // don't flip mode during an active gesture
      const inNarrative = metrics && y >= metrics.start && y < metrics.end
      const wantSync =
        BOOK_TOUCH_SYNC && !reduceMotion.matches && (!metrics || y < metrics.end)
      if (lenis.options.syncTouch !== wantSync) lenis.options.syncTouch = wantSync

      const touchMultiplier = inNarrative ? NARRATIVE_TOUCH_MULTIPLIER : 1
      if (lenis.virtualScroll?.options) {
        lenis.virtualScroll.options.touchMultiplier = touchMultiplier
      }
      lenis.options.touchMultiplier = touchMultiplier
      lenis.options.touchInertiaExponent = inNarrative
        ? NARRATIVE_TOUCH_INERTIA
        : BOOK_TOUCH_INERTIA
      lenis.options.syncTouchLerp = inNarrative ? NARRATIVE_TOUCH_LERP : BOOK_TOUCH_LERP
    }

    const apply = (y) => {
      setWheelMultiplier(narrativeWheelMultiplier(y, metrics))
      setTouchProfile(y)
    }

    const updateMetrics = () => {
      metrics = readMetrics()
      apply(window.scrollY)
    }

    updateMetrics()
    const resizeId = requestAnimationFrame(updateMetrics)
    window.addEventListener('resize', updateMetrics)
    const unsub = scrollY.on('change', apply)
    // Re-evaluate if the user's reduced-motion preference changes at runtime.
    const onReduceMotionChange = () => apply(window.scrollY)
    reduceMotion.addEventListener?.('change', onReduceMotionChange)

    return () => {
      cancelAnimationFrame(resizeId)
      window.removeEventListener('resize', updateMetrics)
      unsub()
      reduceMotion.removeEventListener?.('change', onReduceMotionChange)
    }
  }, [scrollY])

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
