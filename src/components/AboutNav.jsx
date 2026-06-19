import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function AboutNav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const pill =
    'font-display font-700 uppercase tracking-[0.04em] text-sm sm:text-base px-5 sm:px-6 py-2.5 rounded-full bg-paper shadow-[0_6px_18px_rgba(34,35,36,0.08)] transition-all hover:-translate-y-0.5'

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-50"
    >
      <div className="max-w-edge mx-auto px-4 sm:px-6 lg:px-10 py-4 flex items-center justify-end">
        {/* visual-only button — no href, no handler, no navigation */}
        <button type="button" className={`${pill} flex items-center gap-2`}>
          {/* tiny book thumb appears on scroll, mirroring the source (UI icon) */}
          <motion.img
            src="/book.webp"
            alt=""
            initial={false}
            animate={{ width: scrolled ? 22 : 0, opacity: scrolled ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="h-auto object-contain"
          />
          Buy Now
        </button>
      </div>
    </motion.header>
  )
}
