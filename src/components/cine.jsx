import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'

// A pinned scene: a tall section with a viewport-height sticky stage.
// Passes scroll progress (0→1 across the section) to its render-prop children.
export function Scene({ id, vh = 250, className = '', stageClass = '', children }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  return (
    <section id={id} ref={ref} style={{ height: `${vh}vh` }} className={`relative ${className}`}>
      <div className={`sticky top-0 h-[100svh] w-full overflow-hidden ${stageClass}`}>
        {children(scrollYProgress)}
      </div>
    </section>
  )
}

// A centered "beat" of content that fades + rises in, holds, then fades + rises out.
// `at` = [inStart, inEnd, outStart, outEnd] in scene-progress space (0→1).
export function Beat({ p, at, y = 70, className = '', children }) {
  const opacity = useTransform(p, at, [0, 1, 1, 0])
  const ty = useTransform(p, at, [y, 0, 0, -y])
  return (
    <motion.div
      style={{ opacity, y: ty }}
      className={`absolute inset-0 flex flex-col items-center justify-center text-center px-6 ${className}`}
    >
      {children}
    </motion.div>
  )
}

// A number that scrubs between two values as you scroll through `range`.
export function ScrubNumber({ p, range, from, to, className = '' }) {
  const v = useTransform(p, range, [from, to])
  const [n, setN] = useState(from)
  useMotionValueEvent(v, 'change', (x) => setN(Math.round(x)))
  return <span className={className}>{n.toLocaleString()}</span>
}

// Convenience: a motion value mapped through a progress window.
export const useWindow = (p, at, out) => useTransform(p, at, out)

// Remap a slice [a,b] of global progress to a local 0→1 (clamped outside).
export const useLocal = (p, a, b) => useTransform(p, [a, b], [0, 1], { clamp: true })

// A full-screen background layer whose opacity is driven by a progress window.
export function BgLayer({ p, at, className }) {
  const opacity = useTransform(p, at, at.length === 4 ? [0, 1, 1, 0] : [0, 1])
  return <motion.div style={{ opacity }} className={`absolute inset-0 ${className}`} />
}
