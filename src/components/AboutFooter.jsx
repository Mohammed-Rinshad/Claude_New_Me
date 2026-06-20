export default function AboutFooter() {
  return (
    <footer className="bg-yellow text-ink">
      <div className="max-w-edge mx-auto px-5 sm:px-8 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="font-display font-700 uppercase tracking-[0.04em] text-sm">
          © {new Date().getFullYear()} Gagan Dhawan · The New Me 2.0
        </span>
        <a
          href="#"
          className="font-display font-700 uppercase tracking-[0.04em] text-sm hover:underline underline-offset-4"
        >
          Get your copy →
        </a>
      </div>
    </footer>
  )
}
