import Reveal, { RevealWords } from './Reveal'

export default function TurningPoint() {
  return (
    <section id="turning" className="py-24 lg:py-32 bg-ink text-paper relative overflow-hidden">
      <div className="pointer-events-none absolute -bottom-32 -left-20 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-forest/40 blur-[130px]" />

      <div className="max-w-edge mx-auto px-5 sm:px-8 lg:px-12 relative">
        <Reveal>
          <span className="eyebrow !text-sage">The turning point</span>
        </Reveal>

        <h2 className="display text-paper text-[12vw] sm:text-[8vw] lg:text-[5.2vw] xl:text-[84px] mt-4 mb-14 max-w-5xl">
          <RevealWords text="When the numbers demanded change." />
        </h2>

        <div className="grid lg:grid-cols-[0.4fr_1fr] gap-10 lg:gap-16 items-start">
          {/* the year as a monumental stat */}
          <Reveal className="lg:sticky lg:top-28">
            <div className="font-display text-[26vw] sm:text-[18vw] lg:text-[10vw] xl:text-[150px] leading-none text-forest2">
              2017
            </div>
            <p className="font-body uppercase tracking-eyebrow text-sage text-xs mt-2">
              The year everything changed
            </p>
          </Reveal>

          <div className="max-w-2xl space-y-7">
            <Reveal delay={0.06}>
              <p className="text-xl sm:text-2xl leading-relaxed text-paper/85">
                In 2017, Gagan Dhawan found himself staring at medical reports that showed
                dangerously high levels of cholesterol and sugar markers — the kind of numbers that
                demand <span className="text-sage">lifelong medication</span>.
              </p>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="text-lg leading-relaxed text-paper/70">
                Instead of resigning himself to prescriptions, he chose inquiry, discipline and
                consistency. He rebuilt his health through food, movement, sleep, and a transformed
                mindset. His markers reversed. He did not need any medicine, after all.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="rule !bg-paper/15 my-9" />
              <p className="font-display uppercase text-2xl sm:text-3xl leading-tight text-paper">
                The book, <span className="text-sage">The New Me</span>, was born from that turning
                point — a lived experience he wishes to share with everyone.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
