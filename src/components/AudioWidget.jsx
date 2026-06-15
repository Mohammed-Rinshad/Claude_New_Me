import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const TOTAL = 240 // 4:00 in seconds — mirrors the source player

function fmt(s) {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function AudioWidget() {
  const [playing, setPlaying] = useState(false)
  const [t, setT] = useState(0)
  const raf = useRef()

  useEffect(() => {
    if (!playing) return
    let last = performance.now()
    const tick = (now) => {
      const dt = (now - last) / 1000
      last = now
      setT((prev) => {
        const next = prev + dt
        if (next >= TOTAL) {
          setPlaying(false)
          return 0
        }
        return next
      })
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [playing])

  const pct = (t / TOTAL) * 100

  return (
    <div className="bg-paper2/80 backdrop-blur border border-ink/10 rounded-2xl p-4 shadow-[0_18px_40px_rgba(34,35,36,0.08)]">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'Pause intro' : 'Play intro'}
          className="shrink-0 w-11 h-11 rounded-full bg-forest text-paper grid place-items-center hover:bg-forest2 transition-colors"
        >
          {playing ? (
            <span className="block w-3 h-3 border-x-[4px] border-paper" />
          ) : (
            <span className="block w-0 h-0 border-y-[7px] border-y-transparent border-l-[11px] border-l-paper ml-1" />
          )}
        </button>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-body text-xs font-semibold uppercase tracking-eyebrow text-ink/70">
              Listen to the intro
            </span>
            <span className="font-body text-xs tabular-nums text-ink/50">
              {fmt(t)} / {fmt(TOTAL)}
            </span>
          </div>

          {/* animated waveform / progress */}
          <div className="flex items-center gap-[3px] h-7">
            {Array.from({ length: 38 }).map((_, i) => {
              const active = (i / 38) * 100 <= pct
              return (
                <motion.span
                  key={i}
                  className={`flex-1 rounded-full ${active ? 'bg-forest' : 'bg-ink/15'}`}
                  animate={
                    playing && active
                      ? { height: ['35%', `${40 + ((i * 53) % 60)}%`, '35%'] }
                      : { height: `${30 + ((i * 37) % 55)}%` }
                  }
                  transition={{ duration: 0.5 + (i % 5) * 0.12, repeat: playing ? Infinity : 0, ease: 'easeInOut' }}
                  style={{ height: '40%' }}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
