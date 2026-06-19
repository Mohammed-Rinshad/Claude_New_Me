import Reveal, { RevealWords } from './Reveal'

export default function WhyNow() {
  return (
    <section id="why" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="pointer-events-none absolute -top-20 right-0 w-[45vw] h-[45vw] max-w-[700px] max-h-[700px] rounded-full bg-sage/25 blur-[120px]" />

      <div className="max-w-edge mx-auto px-5 sm:px-8 lg:px-12 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center relative">
        <div>
          <Reveal>
            <span className="eyebrow">Why it matters now</span>
          </Reveal>

          <h2 className="display text-ink text-[14vw] sm:text-[10vw] lg:text-[6.2vw] xl:text-[100px] mt-5 mb-7">
            <RevealWords text="Decline is now" />
            <br />
            <span className="text-forest">
              <RevealWords text="optional." delay={0.18} />
            </span>
          </h2>

          <Reveal delay={0.1} className="max-w-xl">
            <p className="text-lg sm:text-xl leading-relaxed text-ink/80">
              We spend years building careers and, in the process, forget to invest in our
              healthspan with the same seriousness.{' '}
              <span className="text-ink font-semibold">The New Me</span> exists to change that imbalance.
            </p>
          </Reveal>

          <Reveal delay={0.16} className="max-w-xl mt-5">
            <p className="text-base sm:text-lg leading-relaxed text-ink/65">
              Through fitness, plant-based nutrition, and mindful living, it offers a way to live
              cleaner, stronger, and longer — without dependency on medication. This is not a
              wellness trend. It is a way of life you return to.
            </p>
          </Reveal>

          <Reveal delay={0.22} className="max-w-xl mt-8">
            <p className="font-display text-2xl sm:text-3xl uppercase leading-tight text-ink">
              You will not find shortcuts here.{' '}
              <span className="text-forest">
                And that is exactly how it will lead you to transformation you can sustain.
              </span>
            </p>
          </Reveal>

          <Reveal delay={0.28} className="mt-9 flex flex-wrap items-center gap-4">
            <a href="#get" className="btn-solid">
              Get your copy <span aria-hidden>→</span>
            </a>
            <span className="font-sign text-forest text-3xl">by Gagan Dhawan</span>
          </Reveal>
        </div>

        {/* book cover */}
        <div className="flex justify-center">
          <img
            src="/book.webp"
            alt="The New Me 2.0 — Reverse Aging, by Gagan Dhawan"
            className="w-[260px] sm:w-[330px] lg:w-[400px] drop-shadow-[0_45px_60px_rgba(31,92,46,0.28)] animate-floaty"
          />
        </div>
      </div>
    </section>
  )
}
