import Reveal from './Reveal'

// bold word with the source's yellow marker highlight
function Mark({ children }) {
  return (
    <span className="relative font-bold text-ink">
      <span className="relative z-10">{children}</span>
      <span className="absolute left-0 right-0 bottom-0.5 h-2/5 bg-yellow/70 -z-0" />
    </span>
  )
}

function Block({ eyebrow, headline, children, last }) {
  return (
    <section className={`max-w-edge mx-auto px-5 sm:px-8 lg:px-12 ${last ? 'pb-28' : ''}`}>
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-start">
        {/* sticky statement */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          {eyebrow && (
            <Reveal>
              <span className="eyebrow !text-ink/55 mb-4 block">{eyebrow}</span>
            </Reveal>
          )}
          <Reveal>
            <h2 className="font-display font-700 uppercase leading-[0.95] tracking-tight text-ink text-[10vw] sm:text-[7vw] lg:text-[3.4vw] xl:text-[58px]">
              {headline}
            </h2>
          </Reveal>
        </div>

        {/* scrolling prose */}
        <div className="space-y-6 lg:pt-2 text-lg sm:text-xl leading-relaxed text-ink/80 max-w-xl">
          {children}
        </div>
      </div>
    </section>
  )
}

export default function AboutStory() {
  return (
    <div className="py-20 lg:py-28 space-y-24 lg:space-y-40">
      <Block eyebrow="Intro to the book" headline="I chose transformation over medication.">
        <Reveal>
          <p>
            We spend years building careers and, in the process, forget to invest in our healthspan
            with the same seriousness. I know — because I did exactly that.
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <p>
            I'm a senior corporate leader, a fitness practitioner, and now an author. But for most of
            my life, my health was the one account I never funded.
          </p>
        </Reveal>
      </Block>

      <Block headline="When the numbers demanded change.">
        <Reveal>
          <p>
            In 2017, I found myself staring at medical reports that showed dangerously high levels of{' '}
            <Mark>cholesterol and sugar markers</Mark> — the kind of numbers that demand lifelong
            medication.
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <p>
            Instead of resigning myself to prescriptions, I chose <Mark>inquiry, discipline and
            consistency.</Mark> I rebuilt my health through plant-based nutrition, disciplined
            movement, restorative sleep, and a resilient mindset.
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="font-display uppercase text-2xl sm:text-3xl !leading-tight text-ink !text-ink">
            My markers reversed. I did not need any medicine, after all.
          </p>
        </Reveal>
      </Block>

      <Block headline="A lived manual — not advice from the sidelines." last>
        <Reveal>
          <p>
            Through fitness, plant-based nutrition, and mindful living, I found a way to live cleaner,
            stronger, and longer — without dependency on medication. This is not a wellness trend. It
            is a way of life you return to.
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <p>
            You will not find shortcuts here. And that is exactly how it will lead you to{' '}
            <Mark>transformation you can sustain.</Mark>
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <p>
            <span className="font-semibold text-ink">The New Me 2.0</span> was born from that turning
            point — a lived experience I wish to share with everyone.
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <figure className="border-l-2 border-forest pl-6 mt-4">
            <blockquote className="font-display uppercase text-2xl sm:text-3xl leading-[1.05] text-ink">
              “The best time to start was yesterday. The next best time is now.”
            </blockquote>
          </figure>
        </Reveal>
      </Block>
    </div>
  )
}
