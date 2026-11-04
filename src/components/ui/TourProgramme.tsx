'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ChevronDown, MapPin } from 'lucide-react'
import LazyVideo from '@/components/LazyVideo'

interface StoryDay {
  dayNumber: number
  title: string
  location: string
  stage?: string | null
  activities: { activity: string; id?: string }[]
  media?: { url?: string; mimeType?: string } | null
}

interface Stage {
  label: string
  days: StoryDay[]
}

/** A title typed as "Samedi 21 novembre 2026 :" should not end on a dangling colon. */
const cleanTitle = (title: string) => title.replace(/\s*:\s*$/, '')
const dayLabel = (n: number) => `Jour ${String(n).padStart(2, '0')}`

const rangeOf = (days: StoryDay[]) => {
  const first = days[0].dayNumber
  const last = days[days.length - 1].dayNumber
  return first === last ? `Jour ${first}` : `Jours ${first}–${last}`
}

/** Days next to each other with the same "Étape" form a stage. No stage typed in the admin: groups of 4 days. */
function groupDays(days: StoryDay[]): Stage[] {
  if (!days.some((d) => d.stage?.trim())) {
    const stages: Stage[] = []
    for (let i = 0; i < days.length; i += 4) {
      const chunk = days.slice(i, i + 4)
      stages.push({ label: rangeOf(chunk), days: chunk })
    }
    return stages
  }
  const stages: Stage[] = []
  for (const day of days) {
    const label = day.stage?.trim() || stages[stages.length - 1]?.label || rangeOf([day])
    const last = stages[stages.length - 1]
    if (last?.label === label) last.days.push(day)
    else stages.push({ label, days: [day] })
  }
  return stages
}

function DayMedia({ day, sizes }: { day: StoryDay; sizes: string }) {
  const url = typeof day.media === 'object' && day.media?.url ? day.media.url : null
  if (!url) return null
  if (day.media?.mimeType?.startsWith('video')) {
    return <LazyVideo src={url} className="absolute inset-0 h-full w-full object-cover" />
  }
  return <Image src={url} alt={cleanTitle(day.title)} fill sizes={sizes} className="object-cover" />
}

function Activities({ day }: { day: StoryDay }) {
  return (
    <ul className="space-y-2">
      {day.activities.map((act, i) => (
        <li key={act.id || i} className="flex items-start gap-3 text-[15px] leading-snug text-slate-700 dark:text-white/80">
          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-blue" aria-hidden="true" />
          {act.activity}
        </li>
      ))}
    </ul>
  )
}

/* ─── Phones and tablets: swipe through the whole trip, one card per day (native scroll-snap). Stages jump and follow. ─── */
function MobileJourney({ days }: { days: StoryDay[] }) {
  const reduce = useReducedMotion()
  const stages = useMemo(() => groupDays(days), [days])
  const [active, setActive] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const pillRowRef = useRef<HTMLDivElement>(null)
  const pillRefs = useRef<(HTMLButtonElement | null)[]>([])
  const cardRefs = useRef<(HTMLElement | null)[]>([])

  const stageStarts = useMemo(() => {
    let start = 0
    return stages.map((s) => {
      const at = start
      start += s.days.length
      return at
    })
  }, [stages])
  const activeStage = stageStarts.reduce((found, start, i) => (active >= start ? i : found), 0)

  const onScroll = () => {
    const track = trackRef.current
    if (!track) return
    // The last cards cannot reach the left edge: at the very end, the last day is the current one
    if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 2) {
      setActive(days.length - 1)
      return
    }
    const nearest = cardRefs.current.reduce(
      (best, card, i) => {
        const distance = Math.abs((card?.offsetLeft ?? 0) - 16 - track.scrollLeft)
        return distance < best.distance ? { i, distance } : best
      },
      { i: 0, distance: Infinity },
    )
    setActive(nearest.i)
  }

  const goToStage = (i: number) => {
    const card = cardRefs.current[stageStarts[i]]
    if (card) trackRef.current?.scrollTo({ left: card.offsetLeft - 16, behavior: reduce ? 'auto' : 'smooth' })
  }

  // The current stage stays visible in its row (scrolls the row, not the page)
  useEffect(() => {
    const pill = pillRefs.current[activeStage]
    const row = pillRowRef.current
    if (!pill || !row || row.scrollWidth <= row.clientWidth) return
    row.scrollTo({ left: pill.offsetLeft - 16, behavior: reduce ? 'auto' : 'smooth' })
  }, [activeStage, reduce])

  return (
    <div>
      <div ref={pillRowRef} className="hide-scrollbar relative flex gap-2 overflow-x-auto px-4 pb-1">
        {stages.map((s, i) => {
          const isActive = i === activeStage
          return (
            <button
              key={s.label + i}
              ref={(el) => {
                pillRefs.current[i] = el
              }}
              type="button"
              aria-current={isActive ? 'step' : undefined}
              onClick={() => goToStage(i)}
              className={`min-h-11 shrink-0 whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition-colors duration-200 active:scale-[0.97] ${
                isActive
                  ? 'border-brand-blue bg-brand-blue text-white'
                  : 'border-slate-200 bg-white/70 text-slate-800 dark:border-white/10 dark:bg-white/5 dark:text-white/80'
              }`}
            >
              {s.label}
            </button>
          )
        })}
      </div>

      <div
        ref={trackRef}
        onScroll={onScroll}
        role="group"
        aria-label="Programme jour par jour"
        className="hide-scrollbar relative mt-4 flex snap-x snap-mandatory scroll-pl-4 items-stretch gap-3 overflow-x-auto overscroll-x-contain px-4 pb-2"
      >
        {days.map((day, i) => (
          <article
            key={day.dayNumber}
            ref={(el) => {
              cardRefs.current[i] = el
            }}
            className="flex w-[84%] max-w-[360px] shrink-0 snap-start snap-always flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5"
          >
            <div className="relative h-[min(76vw,34svh)] max-h-[320px] shrink-0 bg-slate-200 dark:bg-white/5 [&_img]:object-[center_18%]">
              <DayMedia day={day} sizes="(max-width: 480px) 84vw, 360px" />
            </div>
            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-blue">{dayLabel(day.dayNumber)}</p>
              <h3 className="mt-1 font-heading text-lg font-semibold leading-snug text-slate-900 dark:text-white">{cleanTitle(day.title)}</h3>
              <p className="mt-1.5 flex items-start gap-1.5 text-[13px] font-medium text-slate-500 dark:text-white/60">
                <MapPin className="mt-px h-3.5 w-3.5 shrink-0 text-brand-blue" strokeWidth={2} aria-hidden="true" />
                {day.location}
              </p>
              <div className="mt-3">
                <Activities day={day} />
              </div>
            </div>
          </article>
        ))}
        <span aria-hidden="true" className="w-1 shrink-0" />
      </div>

      <div className="mt-3 flex items-center gap-3 px-4">
        <div aria-hidden="true" className="h-1 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
          <div
            className="h-full origin-left rounded-full bg-brand-blue transition-transform duration-200 ease-out"
            style={{ transform: `scaleX(${(active + 1) / days.length})` }}
          />
        </div>
        <span className="shrink-0 text-xs font-medium tabular-nums text-slate-500 dark:text-white/60">
          Jour {days[active].dayNumber} sur {days[days.length - 1].dayNumber}
        </span>
      </div>
    </div>
  )
}

/* ─── Long programmes: one stage at a time, so 14 days never become a very long page ─── */
function StageProgramme({ days, labels }: { days: StoryDay[]; labels: { previous: string; next: string } }) {
  const reduce = useReducedMotion()
  const stages = useMemo(() => groupDays(days), [days])
  const [stageIndex, setStageIndex] = useState(0)
  const [openIndex, setOpenIndex] = useState(0)
  const navRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const stage = stages[Math.min(stageIndex, stages.length - 1)]
  const openDay = stage.days[Math.min(openIndex, stage.days.length - 1)]
  const previous = stages[stageIndex - 1]
  const next = stages[stageIndex + 1]

  const goToStage = (index: number, scroll = false) => {
    setStageIndex(index)
    setOpenIndex(0)
    if (scroll) navRef.current?.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' })
  }

  // Keep the chosen stage visible in the row of stages (scrolls the row, not the page)
  useEffect(() => {
    const tab = tabRefs.current[stageIndex]
    const row = navRef.current
    if (!tab || !row || row.scrollWidth <= row.clientWidth) return
    row.scrollTo({ left: tab.offsetLeft - 16, behavior: reduce ? 'auto' : 'smooth' })
  }, [stageIndex, reduce])

  const quick = reduce ? { duration: 0 } : { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const }

  return (
    <div className="mx-auto max-w-6xl">
      <div
        ref={navRef}
        role="tablist"
        aria-label="Étapes du voyage"
        className="hide-scrollbar relative flex scroll-mt-24 gap-2 overflow-x-auto px-4 pb-1 lg:justify-center lg:px-6"
      >
        {stages.map((s, i) => {
          const active = i === stageIndex
          return (
            <button
              key={s.label + i}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => goToStage(i)}
              className={`relative min-h-11 shrink-0 rounded-full border px-4 py-2 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/60 active:scale-[0.97] ${
                active
                  ? 'border-transparent text-white'
                  : 'border-slate-200 bg-white/70 text-slate-800 hover:border-brand-blue/40 dark:border-white/10 dark:bg-white/5 dark:text-white/80'
              }`}
            >
              {active ? (
                <motion.span
                  layoutId="ccv-active-stage"
                  aria-hidden="true"
                  transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-brand-blue"
                />
              ) : null}
              <span className="relative block whitespace-nowrap text-sm font-semibold leading-tight">{s.label}</span>
              <span className={`relative block whitespace-nowrap text-[11px] leading-tight ${active ? 'text-white/85' : 'text-slate-500 dark:text-white/50'}`}>
                {rangeOf(s.days)}
              </span>
            </button>
          )
        })}
      </div>

      <div role="tabpanel" aria-label={stage.label} className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-10 px-4 lg:mt-10 lg:min-h-[600px] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:px-6">
        {/* Desktop: the photo of the open day. Text sits beside it, never on top of the words in the photos. */}
        <div className="relative hidden aspect-[5/7] overflow-hidden rounded-3xl bg-slate-200 shadow-[0_24px_50px_-28px_rgba(11,19,43,0.4)] dark:bg-white/5 lg:block">
          <AnimatePresence initial={false}>
            <motion.div
              key={openDay.dayNumber}
              className="absolute inset-0"
              initial={reduce ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.35 }}
            >
              <DayMedia day={openDay} sizes="480px" />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="min-w-0">
          <ol className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-white/10 dark:border-white/10">
            {stage.days.map((day, i) => {
              const open = day.dayNumber === openDay.dayNumber
              return (
                <li key={day.dayNumber}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() => setOpenIndex(i)}
                      className="flex min-h-14 w-full items-center gap-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/60"
                    >
                      <span className="w-14 shrink-0 text-xs font-semibold uppercase tracking-wider text-brand-blue">{dayLabel(day.dayNumber)}</span>
                      <span className={`min-w-0 flex-1 font-heading text-base leading-snug lg:text-lg ${open ? 'font-semibold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-white/75'}`}>
                        {cleanTitle(day.title)}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {open ? (
                      <motion.div
                        key="content"
                        initial={reduce ? false : { height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={quick}
                        className="overflow-hidden"
                      >
                        <div className="pb-5 pl-[72px]">
                          <p className="mb-3 flex items-start gap-2 text-sm font-medium text-slate-500 dark:text-white/60">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" strokeWidth={2} aria-hidden="true" />
                            {day.location}
                          </p>
                          <Activities day={day} />
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </li>
              )
            })}
          </ol>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            {previous ? (
              <button
                type="button"
                onClick={() => goToStage(stageIndex - 1, true)}
                className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-slate-600 active:scale-[0.97] dark:text-white/70"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                {labels.previous}
              </button>
            ) : (
              <span />
            )}
            {next ? (
              <button
                type="button"
                onClick={() => goToStage(stageIndex + 1, true)}
                className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-blue active:scale-[0.97]"
              >
                {labels.next} : {next.label}
                <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Short programmes, everything visible: photo above the day on phones, side by side and alternating on desktop ─── */
function DayRows({ days }: { days: StoryDay[] }) {
  const reduce = useReducedMotion()

  return (
    <ol className="mx-auto flex max-w-6xl flex-col gap-12 px-4 lg:gap-20 lg:px-6">
      {days.map((day, i) => {
        const flipped = i % 2 === 1
        return (
          <motion.li
            key={day.dayNumber}
            initial={reduce ? false : { opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`grid grid-cols-[minmax(0,1fr)] items-center gap-5 lg:gap-14 ${flipped ? 'lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]' : 'lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]'}`}
          >
            <div className={`relative aspect-[4/3] overflow-hidden rounded-3xl bg-slate-200 shadow-[0_24px_50px_-28px_rgba(11,19,43,0.4)] dark:bg-white/5 lg:aspect-[4/5] ${flipped ? 'lg:order-2' : ''}`}>
              <DayMedia day={day} sizes="(max-width: 1024px) 92vw, 460px" />
            </div>

            <div className={flipped ? 'lg:order-1' : ''}>
              <span className="text-sm font-semibold uppercase tracking-wider text-brand-blue">{dayLabel(day.dayNumber)}</span>
              <h3 className="mt-2 font-heading text-2xl font-medium leading-tight tracking-tight text-slate-900 dark:text-white lg:text-3xl">
                {cleanTitle(day.title)}
              </h3>
              <p className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-white/60">
                <MapPin className="h-4 w-4 shrink-0 text-brand-blue" strokeWidth={2} aria-hidden="true" />
                {day.location}
              </p>
              <ul className={`mt-4 gap-x-8 lg:mt-6 ${day.activities.length > 8 ? 'lg:columns-2' : ''}`}>
                {day.activities.map((act, actIdx) => (
                  <li key={act.id || actIdx} className="flex break-inside-avoid items-start gap-3 py-1.5 text-[15px] leading-snug text-slate-700 dark:text-white/80">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-blue" aria-hidden="true" />
                    {act.activity}
                  </li>
                ))}
              </ul>
            </div>
          </motion.li>
        )
      })}
    </ol>
  )
}

/** Up to 5 days: everything visible. Longer: swipe the trip on phones, one stage at a time on desktop. */
export default function TourProgramme({
  itinerary,
  labels,
}: {
  itinerary: StoryDay[]
  labels: { previous: string; next: string }
}) {
  const days = useMemo(() => [...(itinerary || [])].sort((a, b) => a.dayNumber - b.dayNumber), [itinerary])
  if (days.length === 0) return null
  if (days.length <= 5) return <DayRows days={days} />
  return (
    <>
      <div className="lg:hidden">
        <MobileJourney days={days} />
      </div>
      <div className="hidden lg:block">
        <StageProgramme days={days} labels={labels} />
      </div>
    </>
  )
}
