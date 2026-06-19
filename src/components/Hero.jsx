import { motion } from 'framer-motion'

// === Swap this for your artwork ===
// Drop your full-bleed illustration into /public (e.g. hero.jpg or hero.png)
// and point HERO_BG at it. Until then it uses the placeholder scene.
const HERO_BG = '/hero-placeholder.svg'

const ease = [0.16, 1, 0.3, 1]

export default function Hero() {
  return (
    <section
      id="top"
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden flex items-center justify-center"
    >
      {/* full-bleed illustration */}
      <motion.img
        src={HERO_BG}
        alt=""
        aria-hidden
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease }}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* legibility wash — soft, keeps the art visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-paper/40 via-paper/10 to-paper/30 pointer-events-none" />

      {/* centered hero content */}
      <div className="relative z-10 px-5 text-center max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease }}
          className="eyebrow !text-forest mb-5"
        >
          The guidebook for the new you
        </motion.p>

        <h1 className="font-fat uppercase text-ink leading-[0.86] tracking-tight">
          <motion.span
            className="block text-[15vw] sm:text-[12vw] lg:text-[8.5vw] xl:text-[140px]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease }}
          >
            The New Me
          </motion.span>
          <motion.span
            className="block text-[15vw] sm:text-[12vw] lg:text-[8.5vw] xl:text-[140px] text-forest"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.68, ease }}
          >
            2.0
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease }}
          className="mt-6 mx-auto max-w-xl font-body text-base sm:text-lg text-ink/80 leading-relaxed"
        >
          Reverse aging through fitness, plant-based nutrition, and mindful living —
          a lived manual for living cleaner, stronger, and longer.
        </motion.p>

        {/* handwritten signature */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.15, ease }}
          className="mt-5"
        >
          <span className="font-sign text-forest text-5xl sm:text-6xl leading-none">Gagan Dhawan</span>
        </motion.div>

        {/* yellow circular CTA — echoes the site's circular button */}
        <motion.a
          href="#get"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 1.35, ease }}
          className="group mt-10 inline-grid place-items-center w-20 h-20 rounded-full bg-yellow text-ink shadow-[0_14px_30px_rgba(0,0,0,0.18)] hover:scale-105 transition-transform"
          aria-label="Get the book"
        >
          <span className="font-body text-[10px] font-bold uppercase tracking-[0.12em] text-center leading-tight">
            Get<br />the book
          </span>
        </motion.a>
      </div>

      {/* corner labels — mirror the site's framing */}
      <div className="absolute bottom-6 left-5 sm:left-8 lg:left-12 z-10 font-body text-[11px] uppercase tracking-[0.15em] text-ink/50">
        Reverse Aging · 2024
      </div>
      <motion.a
        href="#why"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-6 right-5 sm:right-8 lg:right-12 z-10 font-body text-[11px] uppercase tracking-[0.15em] text-ink/60 hover:text-forest flex items-center gap-2"
      >
        Scroll to explore <span aria-hidden>↓</span>
      </motion.a>
    </section>
  )
}
