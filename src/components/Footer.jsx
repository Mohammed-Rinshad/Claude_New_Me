export default function Footer() {
  return (
    <footer className="bg-paper text-ink py-14">
      <div className="max-w-edge mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 pb-10">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-body lowercase font-bold text-2xl tracking-tight text-forest leading-none">
                the new me
              </span>
              <span className="font-display text-forest2 text-2xl leading-none">2.0</span>
            </div>
            <p className="mt-3 text-ink/55 max-w-sm leading-relaxed">
              Reverse Aging — the guidebook for the new you. A lived manual by Gagan Dhawan.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {[
              ['Why Now', '#why'],
              ['The Author', '#author'],
              ['The Turning Point', '#turning'],
              ['Inside', '#inside'],
              ['Get the Book', '#get'],
            ].map(([label, href]) => (
              <a key={href} href={href} className="font-body text-sm text-ink/70 hover:text-forest transition-colors">
                {label}
              </a>
            ))}
          </nav>
        </div>
        <div className="rule" />
        <div className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-ink/45 text-sm">
          <span>© {new Date().getFullYear()} The New Me 2.0 · Gagan Dhawan. All rights reserved.</span>
          <span className="font-body italic">“The best time to start was yesterday. The next best time is now.”</span>
        </div>
      </div>
    </footer>
  )
}
