import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const ease = [0.16, 1, 0.3, 1]

export default function CinematicHero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  // NOTE: the book itself now lives in <BookJourney/> (one single persistent book
  // that travels hero → story). This section keeps only the ghost word + signature.
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -160])
  // Hold the hero composition (ghost word + signature + cue) FULLY visible for the
  // bulk of the section, then fade it out over the final stretch so it reaches zero
  // exactly at the section end — which is precisely where Scene A begins. Previously
  // it was gone by 60% of the hero, leaving a long empty tail (~56vh) where only the
  // floating book was visible before Scene A arrived — dead, information-free
  // scrolling. Holding to 80% and fading [0.8 → 1] keeps meaningful content on screen
  // right up to the story boundary and hands straight off to Scene A's first beat
  // (which fades in from story progress 0), so the handoff is a continuous crossfade
  // with no blank stretch.
  const wordOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0])

  return (
    <section id="top" ref={ref} className="relative h-[140vh]">
      <div className="sticky top-0 h-[100lvh] overflow-hidden flex items-center justify-center bg-paper">
        {/* huge ghost word */}
        <motion.h1
          style={{ y: titleY, opacity: wordOpacity }}
          className="absolute inset-x-0 top-[14vh] text-center font-fat uppercase text-sage/40 leading-none
                     text-[30vw] sm:text-[26vw] lg:text-[24vw] tracking-tight select-none pointer-events-none"
        >
          About
        </motion.h1>

        {/* the book is rendered once in <BookJourney/>; it sits centered here */}

        {/* signature + cue */}
        <motion.div
          style={{ opacity: wordOpacity }}
          className="absolute bottom-[10vh] inset-x-0 text-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6, ease }}
          >
            <span className="font-sign text-ink/85 text-5xl sm:text-6xl">Gagan Dhawan</span>
            <motion.p
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="mt-6 font-body text-xs uppercase tracking-[0.25em] text-ink/45"
            >
              Scroll to begin the story ↓
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
