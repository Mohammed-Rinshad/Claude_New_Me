import { useEffect, useRef, useState } from 'react'
import {
  animate,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from 'framer-motion'

// ─────────────────────────────────────────────────────────────────────────────
// THE CONVERSATION CONTINUES — a single pinned stage where three portrait (9:16)
// "conversation" cards advance one-at-a-time, driven entirely by scroll. One card
// is centered and focal at a time; the others sit dimmed/off to the side and glide
// through the centre as you scroll (Conversation One → Two → Three). No grid, no
// carousel, no arrows/dots. View counts count up from 0 each time a card lands.
//
// Layout is a flex COLUMN inside the sticky stage: the header occupies its own
// natural band at the top, the card deck takes the remaining height below it —
// so the title/subtitle can never collide with the thumbnails.
//
// Motion notes (premium/stable):
//  • No animated CSS `filter: blur()` — live-rasterised blur is the #1 source of
//    scroll flicker on desktop. Depth is conveyed with scale + opacity + a dim
//    overlay instead, all GPU-composited.
//  • Every animated layer is promoted to its own GPU layer (transform-gpu +
//    willChange) so shadows/text rasterise once and only composite while moving.
//  • The scroll source is passed through an overdamped spring (no overshoot) so the
//    Lenis/useScroll cadence mismatch can't show as jitter.
//  • Only the CENTRED card shows its meta text (title/label/views) — side cards stay
//    visible as thumbnails but their text is hidden, so two title blocks never overlap.
//  • View counts count up once and hold; they never reset or restart while scrubbing.
// ─────────────────────────────────────────────────────────────────────────────

const conversations = [
  {
    n: 'One',
    platform: 'Instagram · Reel',
    title: 'Behind the scenes of The New Me 2.0', // placeholder — swap for final title
    views: 2100000,
    href: 'https://www.instagram.com/reel/DZCStoIg99E/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    img: '/media/conversation-1.jpg',
  },
  {
    n: 'Two',
    platform: 'Podcast · Interview',
    title: 'The reverse-aging conversation', // placeholder — swap for final title
    views: 1900000,
    href: 'https://www.instagram.com/reel/DZIeE_lAJvd/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    img: '/media/conversation-2.jpg',
  },
  {
    n: 'Three',
    platform: 'Television · Feature',
    title: 'Small steps, lasting change', // placeholder — swap for final title
    views: 1700000,
    href: 'https://www.instagram.com/reel/DZFyYOwAiZy/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    img: '/media/conversation-3.jpg',
  },
]

// Count-up that runs 0 → `to` exactly ONCE, the first time its card lands, then HOLDS
// forever — it never resets to 0 when the card leaves focus and never restarts while
// scrubbing (same "once" philosophy as AboutStats.jsx's CountUp). Two stability
// guarantees beyond that:
//  • It is driven by a framer MotionValue via animate() and rendered through a
//    <motion.span>, so the digits update WITHOUT a React re-render every frame.
//  • Once started, the animation is not bound to `active` for cancellation, so a
//    mid-count active toggle (scrub) can't freeze it on a partial value.
// `Views` sits on its own line so the growing number can never reflow/shift it.
function ViewCount({ to, active, duration = 1.6 }) {
  const mv = useMotionValue(0)
  const display = useTransform(mv, (v) => Math.round(v).toLocaleString())
  const doneRef = useRef(false)

  // Animate 0 → `to` the first time the card is active, then HOLD forever.
  // Gate on *completion* (doneRef, set in onComplete) — NOT merely "started". That
  // distinction is what makes this survive React.StrictMode's dev mount→unmount→
  // mount: StrictMode's cleanup stops the first run before it finishes, but since
  // doneRef is still false the re-mounted effect restarts it and it completes. (A
  // "started" guard left the initial active card — card 1 — frozen at 0 in dev.)
  // A mid-count scrub re-runs from the CURRENT value, never from 0, so the number
  // never resets or visibly restarts. Cleanup stops the animation only on a real
  // unmount or a genuine active→inactive flip.
  useEffect(() => {
    if (!active || doneRef.current) return
    const controls = animate(mv, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onComplete: () => {
        doneRef.current = true
      },
    })
    return () => controls.stop()
  }, [active, to, duration, mv])

  return (
    <>
      <motion.span className="tabular-nums block">{display}</motion.span>
      <span className="block text-paper/55">Views</span>
    </>
  )
}

function Card({ c, i, activePos, vw, desktop, active }) {
  // Horizontal travel: upcoming cards wait to the right, passed cards exit left.
  const S1 = (desktop ? 0.52 : 0.95) * vw // one step away
  const S2 = (desktop ? 1.05 : 1.7) * vw // two steps away (fully off-screen)
  const peek = desktop ? 0.28 : 0 // side cards faintly visible on desktop only

  const stops = [i - 2, i - 1, i, i + 1, i + 2]

  const x = useTransform(activePos, stops, [S2, S1, 0, -S1, -S2], { clamp: true })
  const scale = useTransform(activePos, stops, [0.5, 0.72, 1, 0.72, 0.5], { clamp: true })
  const opacity = useTransform(activePos, stops, [0, peek, 1, peek, 0], { clamp: true })
  // NOTE: no `rotate`. A scroll-linked rotation on a text-bearing, shadowed card is a
  // desktop-only subpixel-shimmer source and an extra transform per frame for no real
  // premium gain — the glide reads cleaner with translate + scale + opacity alone.
  // Depth without blur: dim the side cards with a black overlay (composited, never
  // re-rasterised) instead of an animated CSS blur filter.
  const dim = useTransform(activePos, stops, [0.6, 0.32, 0, 0.32, 0.6], { clamp: true })
  const zIndex = useTransform(activePos, [i - 1, i, i + 1], [10, 30, 10], { clamp: true })

  // META VISIBILITY (root-cause C fix): the meta text is decoupled from the card's own
  // opacity. It is shown ONLY while this card is essentially centred (|activePos - i|
  // ≲ 0.2) and fully hidden by ±0.4 — so during a transition the outgoing card's text
  // has faded out before the incoming card's fades in. At the 0.5 midpoint BOTH are 0,
  // which guarantees the user never sees two title/label blocks at once. Side cards
  // remain visible as thumbnails (card opacity keeps `peek`); only their text hides.
  const metaO = useTransform(
    activePos,
    [i - 0.4, i - 0.2, i + 0.2, i + 0.4],
    [0, 1, 1, 0],
    { clamp: true }
  )

  return (
    <motion.a
      href={c.href}
      target="_blank"
      rel="noreferrer"
      aria-label={`${c.platform} — ${c.title}`}
      style={{
        x,
        scale,
        opacity,
        zIndex,
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden',
        pointerEvents: active ? 'auto' : 'none',
      }}
      className="transform-gpu absolute h-[clamp(320px,52svh,520px)] lg:h-[clamp(380px,56svh,600px)] aspect-[9/16] block"
    >
      {/* inner card — hover lift + thumbnail zoom (subtle, active card only) */}
      <div className="group relative h-full w-full transition-transform duration-500 ease-out hover:-translate-y-2">
        <div className="relative h-full w-full overflow-hidden rounded-[1.6rem] bg-ink/5 shadow-[0_45px_90px_-20px_rgba(31,92,46,0.45)] ring-1 ring-ink/10">
          <img
            src={c.img}
            alt={c.title}
            loading="lazy"
            draggable="false"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
          {/* dim overlay — drives depth for side cards (replaces animated blur) */}
          <motion.div
            aria-hidden
            style={{ opacity: dim }}
            className="pointer-events-none absolute inset-0 bg-ink"
          />
          {/* CINEMATIC SCRIM + meta. A single bottom-anchored gradient (Netflix/Apple
              style) replaces the old heavy solid block: it is fully opaque only at the
              very bottom — enough to keep the text crisp and to hide each photo's OWN
              burned-in caption (e.g. card 2's bright gold "back to normal") — then fades
              smoothly to transparent so most of the image stays visible.
              The scrim is ALWAYS on (masks captions even mid-transition); only the TEXT
              fades with `metaO`, so two title/label blocks are never readable at once. */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 px-5 sm:px-6 pb-6 pt-28 text-paper
                       bg-[linear-gradient(to_top,#000_0%,#000_46%,rgba(0,0,0,0.72)_72%,transparent_100%)]"
          >
            <motion.div style={{ opacity: metaO }}>
              <span className="font-body uppercase tracking-eyebrow text-[10px] sm:text-xs text-paper/65">
                {c.platform}
              </span>
              <h3 className="font-display font-700 uppercase leading-[1.05] text-lg sm:text-xl mt-1.5">
                {c.title}
              </h3>
              <div className="mt-3 font-fat text-2xl sm:text-3xl leading-none">
                <ViewCount to={c.views} active={active} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.a>
  )
}

export default function MediaConversations() {
  const ref = useRef(null)
  const { scrollYProgress: raw } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  // ROOT-CAUSE FIX for desktop jitter ─────────────────────────────────────────
  // Lenis advances the scroll in its own rAF and writes the real scroll position;
  // framer's useScroll re-samples it on scroll events. The two cadences don't line
  // up, so the raw progress arrives in uneven micro-steps — and on desktop all
  // three cards animate off that same value at once, so the unevenness shows as
  // jitter. Passing it through an OVERDAMPED spring (ζ≈2.3 → no overshoot) hands
  // every downstream transform one stable, evenly-paced source. No overshoot means
  // it also never bounces back across a card boundary to re-trigger a count-up.
  const g = useSpring(raw, { stiffness: 260, damping: 42, mass: 0.32, restDelta: 0.0005 })

  const [vw, setVw] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1280))
  const [desktop, setDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width:1024px)').matches : true
  )
  useEffect(() => {
    const onResize = () => {
      setVw(window.innerWidth)
      setDesktop(window.matchMedia('(min-width:1024px)').matches)
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // activePos: 0 → 1 → 2. Hold each card centred for a beat, then glide to the next.
  // Stops give a lead-in (title reveal), a dwell on each card, and a short tail.
  const activePos = useTransform(
    g,
    [0, 0.12, 0.3, 0.46, 0.64, 0.8, 1],
    [0, 0, 1, 1, 2, 2, 2],
    { clamp: true }
  )

  // header reveal + which card is the narrative "active" one
  const headerO = useTransform(g, [0, 0.08], [0, 1], { clamp: true })
  const [active, setActive] = useState(0)
  // Deadband / hysteresis: only commit `active` once a card is actually SETTLED near
  // centre (within 0.2 of an integer). Critically, we never re-decide it at the 0.5
  // crossover between two cards — that midpoint is where any residual scroll wobble
  // would otherwise flip active 0↔1↔0 and restart both count-ups. Result: each
  // count-up fires exactly once, when its card lands, then holds.
  useMotionValueEvent(activePos, 'change', (v) => {
    const nearest = Math.round(v)
    if (Math.abs(v - nearest) > 0.2) return
    setActive((prev) => (prev === nearest ? prev : nearest))
  })

  return (
    <section ref={ref} style={{ height: '520vh' }} className="relative bg-paper text-ink">
      <div className="sticky top-0 flex h-[100lvh] w-full flex-col overflow-hidden">
        {/* soft focus glow behind the centred card */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[640px] max-h-[640px] rounded-full bg-forest/10 blur-[120px]"
        />

        {/* header band — its own row at the top of the column, never overlaps the deck */}
        <motion.div
          style={{ opacity: headerO }}
          className="relative z-40 shrink-0 px-6 pt-[5.5svh] text-center pointer-events-none"
        >
          <span className="eyebrow text-forest">Conversation {conversations[active].n}</span>
          <h2 className="font-fat uppercase leading-[0.92] text-[8.5vw] sm:text-[6vw] lg:text-[3.8vw] mt-3">
            The conversation continues.
          </h2>
          <p className="mx-auto mt-3 max-w-xl font-body text-ink/65 text-sm sm:text-base leading-snug">
            The ideas behind The New Me 2.0 sparked conversations across platforms — reaching people
            through stories, interviews, and shared experiences.
          </p>
        </motion.div>

        {/* the deck — fills the remaining height below the header; one card centred */}
        <div className="relative min-h-0 flex-1">
          <div className="absolute inset-0 flex items-center justify-center px-6 pb-[3svh]">
            {conversations.map((c, i) => (
              <Card
                key={c.n}
                c={c}
                i={i}
                activePos={activePos}
                vw={vw}
                desktop={desktop}
                active={active === i}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
