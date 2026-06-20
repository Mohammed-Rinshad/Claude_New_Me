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

export default function App() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  // One continuous progress value across the hero + story. The single book reads
  // this raw (no spring — Lenis already smooths native scroll) so it travels from
  // the hero into the story with no seam, jump, or dead zone.
  const journeyRef = useRef(null)
  const { scrollYProgress: journey } = useScroll({
    target: journeyRef,
    offset: ['start start', 'end end'],
  })

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true })
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
    }
  }, [])

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
