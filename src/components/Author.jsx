import Reveal, { RevealWords } from './Reveal'

export default function Author() {
  return (
    <section id="author" className="py-24 lg:py-32 relative">
      <div className="max-w-edge mx-auto px-5 sm:px-8 lg:px-12 grid lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-16 items-start">
        {/* Portrait card — temporary author image; swap for final asset when ready */}
        <Reveal className="lg:sticky lg:top-28">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_30px_60px_rgba(31,92,46,0.25)] ring-1 ring-ink/10">
            <img
              src="/author-portrait.jpg"
              alt="Gagan Dhawan, author of The New Me 2.0"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent pt-16 pb-4">
              <span className="block text-center font-body text-paper/85 text-xs uppercase tracking-eyebrow">
                Gagan Dhawan · Author
              </span>
            </div>
          </div>
        </Reveal>

        {/* Copy */}
        <div>
          <Reveal>
            <span className="eyebrow">About the author</span>
          </Reveal>

          <h2 className="display text-ink text-[13vw] sm:text-[9vw] lg:text-[5.4vw] xl:text-[86px] mt-4 mb-6">
            <RevealWords text="Gagan Dhawan." />
          </h2>

          <Reveal delay={0.08} className="max-w-2xl">
            <p className="font-display uppercase text-2xl sm:text-3xl leading-tight text-forest">
              A leader who chose transformation over medication — and documented every step so
              others could follow.
            </p>
          </Reveal>

          <Reveal delay={0.14} className="max-w-2xl mt-8">
            <p className="text-lg leading-relaxed text-ink/75">
              Gagan Dhawan is a senior corporate leader, fitness practitioner, and author whose
              personal health crisis became the catalyst for a complete life overhaul. He rejected
              lifelong prescriptions and rebuilt himself through plant-based nutrition, disciplined
              movement, restorative sleep, and a resilient mindset.
            </p>
          </Reveal>

          <Reveal delay={0.2} className="max-w-2xl mt-7">
            <p className="text-xl font-semibold leading-relaxed text-ink">
              This is not advice from the sidelines. This is a lived manual — written by someone who
              walked through the fire and came back with a map.
            </p>
          </Reveal>

          {/* Pull quote */}
          <Reveal delay={0.26} className="mt-12 max-w-2xl">
            <figure className="border-l-2 border-forest pl-6">
              <blockquote className="font-display uppercase text-3xl sm:text-4xl leading-[1.05] text-ink">
                “The best time to start was yesterday. The next best time is now.”
              </blockquote>
              <figcaption className="mt-4 font-body italic text-ink/55">— Gagan Dhawan</figcaption>
            </figure>
          </Reveal>

          <Reveal delay={0.32} className="mt-10">
            <a href="#get" className="btn-solid">
              Get your copy <span aria-hidden>→</span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
