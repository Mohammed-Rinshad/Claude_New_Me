import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

function CountUp({ to, duration = 1.4, format = (n) => n.toLocaleString() }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    let raf, start
    const step = (t) => {
      if (!start) start = t
      const p = Math.min((t - start) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(eased * to))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, duration])
  return <span ref={ref}>{format(val)}</span>
}

const stats = [
  { node: <CountUp to={2017} format={(n) => String(n)} />, label: 'the year my markers reversed' },
  { node: '0', label: 'prescriptions needed' },
  { node: '4', label: 'pillars: food · movement · sleep · mindset' },
  { node: '1', label: 'lived manual, written from the fire' },
]

export default function AboutStats() {
  return (
    <section id="get" className="relative bg-paper2 overflow-hidden py-24 lg:py-32">
      {/* faint line-art background */}
      <img
        src="/lineart-placeholder.svg"
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover opacity-[0.13] pointer-events-none"
      />

      <div className="relative z-10 max-w-edge mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-14">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <div className="font-fat text-ink leading-none text-[20vw] sm:text-[13vw] lg:text-[6.5vw] xl:text-[110px]">
                {s.node}
              </div>
              <p className="mt-3 font-body font-semibold text-ink/75 text-sm sm:text-base max-w-[14rem] mx-auto leading-snug">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* center CTA with book thumb */}
        <div className="mt-20 flex justify-center">
          <a
            href="#"
            className="group inline-flex items-center gap-3 bg-ink text-paper font-display font-700 uppercase tracking-[0.04em] text-lg px-8 py-4 rounded-full hover:bg-forest transition-colors"
          >
            <img src="/book.webp" alt="" className="w-7 drop-shadow" />
            Get your copy
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
