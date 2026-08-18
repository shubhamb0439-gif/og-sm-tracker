export const STAGES = [
  { key: 'draft', label: 'Draft', dot: 'bg-slate-400', badge: 'bg-slate-100 text-slate-600' },
  { key: 'under_review', label: 'Under Review', dot: 'bg-amber-400', badge: 'bg-amber-100 text-amber-700' },
  { key: 'revisions', label: 'Revisions', dot: 'bg-rose-400', badge: 'bg-rose-100 text-rose-700' },
  { key: 'approved', label: 'Approved', dot: 'bg-sky-400', badge: 'bg-sky-100 text-sky-700' },
  { key: 'posted', label: 'Posted', dot: 'bg-emerald-400', badge: 'bg-emerald-100 text-emerald-700' },
]

export const stageLabel = (key) => STAGES.find((s) => s.key === key)?.label || key

export const stageMeta = (key) => STAGES.find((s) => s.key === key) || STAGES[0]

export const PLATFORMS = [
  'Instagram',
  'Facebook',
  'TikTok',
  'YouTube',
  'LinkedIn',
  'X / Twitter',
  'Pinterest',
  'Display TV',
  'Other',
]
