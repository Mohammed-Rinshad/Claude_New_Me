import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Reveal, { RevealWords } from './Reveal'

export default function FinalCTA() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [60, -60])
  const rot = useTransform(scrollYProgress, [0, 1], [6, -4])

  return (
    <section id="get" ref={ref} className="py-24 lg:py-36 bg-forest text-paper relative overflow-hidden">
      <div className="max-w-edge mx-auto px-5 sm:px-8 lg:px-12 grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center relative">
        <div>
          <Reveal>
            <span className="eyebrow !text-sage">Begin the return</span>
          </Reveal>
          <h2 className="display text-paper text-[14vw] sm:text-[10vw] lg:text-[6vw] xl:text-[104px] mt-4 mb-8">
            <RevealWords text="Get your copy today." />
          </h2>
          <Reveal delay={0.1} className="max-w-xl">
            <p className="text-xl text-paper/80 leading-relaxed mb-10">
              The guidebook for the new you. Start the transformation you can actually sustain —
              one pillar, one day, one better choice at a time.
            </p>
          </Reveal>
          <Reveal delay={0.18} className="flex flex-wrap gap-4">
            <a
              href="#"
              className="btn bg-paper text-forest px-8 py-4 rounded-full hover:gap-3 hover:bg-yellow hover:text-ink"
            >
              Order the book <span aria-hidden>→</span>
            </a>
            <a
              href="#"
              className="btn border border-paper/40 text-paper px-8 py-4 rounded-full hover:gap-3 hover:border-paper"
            >
              Download a preview
            </a>
          </Reveal>
        </div>

        <motion.div style={{ y, rotate: rot }} className="justify-self-center">
          <img
            src="/book.webp"
            alt="The New Me 2.0 — Reverse Aging"
            className="w-[230px] sm:w-[300px] drop-shadow-[0_40px_55px_rgba(0,0,0,0.35)]"
          />
        </motion.div>
      </div>
    </section>
  )
}
