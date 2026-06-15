import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const ease = [0.16, 1, 0.3, 1]

export default function CinematicHero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  const bookY = useTransform(scrollYProgress, [0, 1], [0, -260])
  const bookScale = useTransform(scrollYProgress, [0, 1], [1, 1.35])
  const bookRot = useTransform(scrollYProgress, [0, 1], [-3, 6])
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -160])
  const wordOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section id="top" ref={ref} className="relative h-[140vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden flex items-center justify-center bg-paper">
        {/* huge ghost word */}
        <motion.h1
          style={{ y: titleY, opacity: wordOpacity }}
          className="absolute inset-x-0 top-[14vh] text-center font-fat uppercase text-sage/40 leading-none
                     text-[30vw] sm:text-[26vw] lg:text-[24vw] tracking-tight select-none pointer-events-none"
        >
          About
        </motion.h1>

        {/* book travels up + scales as you enter the story */}
        <motion.img
          src="/book.webp"
          alt="The New Me 2.0 — Reverse Aging, by Gagan Dhawan"
          style={{ y: bookY, scale: bookScale, rotate: bookRot }}
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease }}
          className="relative z-10 w-[58vw] max-w-[330px] lg:max-w-[380px] drop-shadow-[0_45px_70px_rgba(31,92,46,0.4)]"
        />

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
