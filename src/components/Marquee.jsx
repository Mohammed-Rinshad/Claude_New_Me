const items = [
  'Fitness',
  'Plant-Based Nutrition',
  'Mindful Living',
  'Restorative Sleep',
  'Resilient Mindset',
  'Longevity',
  'No Medication',
  'Healthspan',
]

export default function Marquee() {
  const row = [...items, ...items]
  return (
    <section
      aria-hidden
      className="py-6 sm:py-8 border-y border-ink/10 bg-paper2 overflow-hidden select-none"
    >
      <div className="flex w-max animate-marquee">
        {row.map((it, i) => (
          <span key={i} className="flex items-center">
            <span className="font-display uppercase text-3xl sm:text-5xl text-ink/85 px-6 sm:px-9">
              {it}
            </span>
            <span className="text-forest text-2xl sm:text-3xl">✦</span>
          </span>
        ))}
      </div>
    </section>
  )
}
