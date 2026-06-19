import Reveal, { RevealWords } from './Reveal'

const pillars = [
  {
    n: '01',
    title: 'Plant-Based Nutrition',
    body: 'Food as the first medicine. How a whole-food, plant-forward plate reversed markers that once demanded prescriptions — without hunger, fads, or deprivation.',
  },
  {
    n: '02',
    title: 'Disciplined Movement',
    body: 'Not punishment, but practice. A sustainable framework for strength, mobility, and stamina that compounds quietly across decades.',
  },
  {
    n: '03',
    title: 'Restorative Sleep',
    body: 'The recovery window most ambitious people sacrifice first. Why protecting it is the highest-leverage habit you own.',
  },
  {
    n: '04',
    title: 'Resilient Mindset',
    body: 'The inner architecture that holds the rest together — turning intention into consistency, and consistency into a life that lasts.',
  },
]

export default function Inside() {
  return (
    <section id="inside" className="py-24 lg:py-32">
      <div className="max-w-edge mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <div>
            <Reveal>
              <span className="eyebrow">What's inside</span>
            </Reveal>
            <h2 className="display text-ink text-[12vw] sm:text-[8vw] lg:text-[5vw] xl:text-[80px] mt-4 max-w-4xl">
              <RevealWords text="Four pillars. One sustainable life." />
            </h2>
          </div>
          <Reveal delay={0.1} className="max-w-sm">
            <p className="text-ink/65 leading-relaxed">
              The New Me 2.0 is not a list of rules. It is a connected system — each pillar
              reinforcing the next until decline stops being inevitable.
            </p>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 gap-px bg-ink/10 rounded-3xl overflow-hidden">
          {pillars.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.08}>
              <div className="group bg-paper p-8 lg:p-11 h-full hover:bg-paper2 transition-colors duration-500">
                <div className="flex items-start justify-between mb-6">
                  <span className="font-display text-forest text-5xl leading-none">{p.n}</span>
                  <span className="text-2xl text-sage group-hover:text-forest transition-colors group-hover:rotate-45 duration-500 inline-block">
                    ✦
                  </span>
                </div>
                <h3 className="font-display uppercase text-2xl sm:text-3xl text-ink mb-3">{p.title}</h3>
                <p className="text-ink/65 leading-relaxed">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
