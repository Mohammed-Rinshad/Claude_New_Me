import { motion } from 'framer-motion'

const links = [
  { label: 'About the Book', href: '#why' },
  { label: 'The Author', href: '#author' },
]

export default function Header() {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-0 inset-x-0 z-40"
    >
      <div className="max-w-edge mx-auto px-5 sm:px-8 lg:px-12 h-[84px] flex items-center justify-between">
        {/* left: round logo badge + nav */}
        <div className="flex items-center gap-7">
          <a href="#top" className="flex items-center gap-3 group">
            <span className="relative grid place-items-center w-12 h-12 rounded-full bg-forest text-paper shadow-md transition-transform group-hover:scale-105">
              <svg viewBox="0 0 32 32" className="w-6 h-6">
                <path d="M16 7c4 3 7 5 7 9a7 7 0 0 1-14 0c0-4 3-6 7-9z" fill="#f9f8f3" />
                <path d="M16 11v11M16 15l3-2M16 18l-3-2" stroke="#1f5c2e" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </span>
            <span className="hidden sm:flex items-baseline gap-1 leading-none">
              <span className="font-body lowercase font-bold text-base tracking-tight text-ink">the new me</span>
              <span className="font-display text-ink text-base">2.0</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-ink/75 hover:text-forest transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        {/* right: download / get */}
        <a
          href="#get"
          className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-ink/80 hover:text-forest transition-colors flex items-center gap-2"
        >
          Download <span aria-hidden className="text-forest">↓</span>
        </a>
      </div>
    </motion.header>
  )
}
