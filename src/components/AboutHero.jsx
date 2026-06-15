import { motion } from 'framer-motion'

const ease = [0.16, 1, 0.3, 1]

export default function AboutHero() {
  return (
    <section id="top" className="relative bg-sage overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20">
      {/* giant ABOUT word */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease }}
        className="font-fat uppercase text-paper/90 leading-none text-center select-none
                   text-[28vw] sm:text-[24vw] lg:text-[22vw] tracking-tight"
      >
        About
      </motion.h1>

      {/* book cover overlapping the word */}
      <motion.div
        initial={{ opacity: 0, y: 50, rotate: -6 }}
        animate={{ opacity: 1, y: 0, rotate: -3 }}
        transition={{ duration: 1.1, delay: 0.2, ease }}
        className="relative -mt-[18vw] sm:-mt-[15vw] lg:-mt-[13vw] flex justify-center"
      >
        <img
          src="/book.webp"
          alt="The New Me 2.0 — Reverse Aging, by Gagan Dhawan"
          className="w-[55vw] max-w-[330px] lg:max-w-[380px] drop-shadow-[0_40px_60px_rgba(31,92,46,0.35)]"
        />
      </motion.div>

      {/* handwritten signature */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6, ease }}
        className="text-center mt-6"
      >
        <span className="font-sign text-ink/85 text-5xl sm:text-6xl leading-none">Gagan Dhawan</span>
      </motion.div>
    </section>
  )
}
