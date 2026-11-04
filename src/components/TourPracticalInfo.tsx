import { CalendarDays, Gauge, Languages, MapPin, Sun, Users, Wallet, type LucideIcon } from 'lucide-react'

export type PracticalItem = {
  key: 'departure' | 'group' | 'difficulty' | 'seasons' | 'languages' | 'deposit' | 'dates'
  label: string
  value: string
}

export const PRACTICAL_ICONS: Record<PracticalItem['key'], LucideIcon> = {
  departure: MapPin,
  group: Users,
  difficulty: Gauge,
  seasons: Sun,
  languages: Languages,
  deposit: Wallet,
  dates: CalendarDays,
}

/**
 * Desktop block beside "À propos". Every row comes from a field in the admin and disappears when that
 * field is empty. Duration, dates and price are not repeated here: they are already in the hero.
 */
export default function TourPracticalInfo({
  title,
  status,
  statusClass,
  items,
}: {
  title: string
  status: string
  statusClass: string
  items: PracticalItem[]
}) {
  return (
    <aside className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-heading text-lg font-medium text-slate-900 dark:text-white">{title}</h2>
        <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusClass}`}>{status}</span>
      </div>
      {items.length > 0 ? (
        <dl className="mt-4 divide-y divide-slate-200 border-t border-slate-200 dark:divide-white/10 dark:border-white/10">
          {items.map(({ key, label, value }) => {
            const Icon = PRACTICAL_ICONS[key]
            return (
              <div key={key} className="flex items-start justify-between gap-6 py-3 text-sm">
                <dt className="flex shrink-0 items-center gap-2 text-slate-500 dark:text-white/50">
                  <Icon className="h-4 w-4 text-brand-blue" strokeWidth={2} aria-hidden="true" />
                  {label}
                </dt>
                <dd className="text-right font-medium text-slate-900 dark:text-white">{value}</dd>
              </div>
            )
          })}
        </dl>
      ) : null}
    </aside>
  )
}
