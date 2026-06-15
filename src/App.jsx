import { useEffect } from 'react'
import Lenis from 'lenis'
import { motion, useScroll, useSpring } from 'framer-motion'
import AboutNav from './components/AboutNav'
import CinematicHero from './components/CinematicHero'
import CinematicStory from './components/CinematicStory'
import AboutStats from './components/AboutStats'
import AboutFooter from './components/AboutFooter'

export default function App() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

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
      <main>
        <CinematicHero />
        <CinematicStory />
        <AboutStats />
      </main>
      <AboutFooter />
    </div>
  )
}
