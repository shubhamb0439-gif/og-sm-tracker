import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, CalendarClock, CheckCircle2, Activity, ArrowRight } from 'lucide-react'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import { useContentItems } from '../hooks/useContentItems'
import { useActivity } from '../hooks/useActivity'
import { STAGES, stageMeta } from '../lib/stages'
import { format, formatDistanceToNow, isWithinInterval, addDays, parseISO, isThisMonth } from 'date-fns'

const actionCopy = {
  created: 'added',
  stage_changed: 'moved a card',
  commented: 'commented on',
}

export default function Dashboard() {
  const { items, loading } = useContentItems()
  const { activity } = useActivity(10)

  const upcoming = useMemo(() => {
    const now = new Date()
    const inSevenDays = addDays(now, 7)
    return items
      .filter((i) => i.upload_date)
      .filter((i) => {
        const d = parseISO(i.upload_date)
        return isWithinInterval(d, { start: addDays(now, -1), end: inSevenDays })
      })
      .sort((a, b) => a.upload_date.localeCompare(b.upload_date))
      .slice(0, 6)
  }, [items])

  const stageCounts = useMemo(() => {
    return STAGES.map((s) => ({ ...s, count: items.filter((i) => i.stage === s.key).length }))
  }, [items])

  const postedThisMonth = items.filter((i) => i.posted_at && isThisMonth(new Date(i.posted_at))).length
  const totalPlanned = items.length
  const inReview = items.filter((i) => i.stage === 'under_review' || i.stage === 'revisions').length

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-900">Dashboard</h1>
        <p className="text-sm text-brand-500 mt-1">Here's what's happening across the team.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total content planned" value={totalPlanned} icon={ClipboardList} accent="bg-brand-700" />
        <StatCard label="Due in the next 7 days" value={upcoming.length} icon={CalendarClock} accent="bg-amber-500" />
        <StatCard label="In review / revisions" value={inReview} icon={Activity} accent="bg-rose-500" />
        <StatCard label="Posted this month" value={postedThisMonth} icon={CheckCircle2} accent="bg-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-brand-900">Upcoming shoots & uploads</h2>
              <Link to="/planner" className="text-xs font-semibold text-brand-700 flex items-center gap-1 hover:underline">
                View planner <ArrowRight size={13} />
              </Link>
            </div>
            <div className="space-y-2.5">
              {upcoming.map((item) => {
                const meta = stageMeta(item.stage)
                return (
                  <div key={item.id} className="flex items-center justify-between rounded-xl px-3 py-2.5 bg-brand-50/60">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-brand-900 truncate">{item.title}</p>
                      <p className="text-xs text-brand-500">
                        {item.platform || 'No platform'} · Uploads {format(parseISO(item.upload_date), 'EEE, MMM d')}
                      </p>
                    </div>
                    <span className={`badge shrink-0 ${meta.badge}`}>{meta.label}</span>
                  </div>
                )
              })}
              {!loading && upcoming.length === 0 && (
                <p className="text-sm text-brand-400 italic">Nothing due in the next 7 days.</p>
              )}
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-brand-900">Pipeline snapshot</h2>
              <Link to="/pipeline" className="text-xs font-semibold text-brand-700 flex items-center gap-1 hover:underline">
                Open pipeline <ArrowRight size={13} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {stageCounts.map((s) => (
                <div key={s.key} className="rounded-xl bg-brand-50/60 p-3 text-center">
                  <p className="text-2xl font-bold text-brand-900">{s.count}</p>
                  <p className="text-[11px] text-brand-500 mt-1 flex items-center justify-center gap-1">
                    <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} /> {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-bold text-brand-900 mb-4">Recent activity</h2>
          <div className="space-y-4">
            {activity.map((a) => (
              <div key={a.id} className="flex gap-2.5">
                <div className="h-2 w-2 rounded-full bg-brand-400 mt-1.5 shrink-0" />
                <div className="text-sm">
                  <p className="text-brand-800">
                    <span className="font-semibold">{a.actor?.display_name || 'Someone'}</span>{' '}
                    {actionCopy[a.action] || a.action}{' '}
                    <span className="font-medium">{a.content_item?.title}</span>
                  </p>
                  <p className="text-xs text-brand-400">
                    {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
            {activity.length === 0 && (
              <p className="text-sm text-brand-400 italic">No activity yet.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
