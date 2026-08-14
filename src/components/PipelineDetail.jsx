import { X, ArrowRight, Calendar, User as UserIcon, Trash2 } from 'lucide-react'
import { STAGES, stageMeta } from '../lib/stages'
import CommentThread from './CommentThread'
import { format } from 'date-fns'

export default function PipelineDetail({ item, onClose, onStageChange, onDelete }) {
  if (!item) return null
  const currentIndex = STAGES.findIndex((s) => s.key === item.stage)
  const next = STAGES[currentIndex + 1]
  const meta = stageMeta(item.stage)

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-brand-950/40 backdrop-blur-sm">
      <div className="h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        <div className="flex items-start justify-between px-5 py-4 border-b border-brand-100">
          <div>
            <span className={`badge ${meta.badge}`}>{meta.label}</span>
            <h2 className="text-lg font-bold text-brand-900 mt-2">{item.title}</h2>
            {item.platform && <p className="text-sm text-brand-500">{item.platform}</p>}
          </div>
          <button onClick={onClose} className="text-brand-400 hover:text-brand-700">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {item.media_url && (
            <div className="rounded-xl overflow-hidden border border-brand-100 bg-brand-50">
              {item.media_type === 'video' ? (
                <video src={item.media_url} controls className="w-full max-h-64 object-contain" />
              ) : (
                <img src={item.media_url} alt={item.title} className="w-full max-h-64 object-contain" />
              )}
            </div>
          )}

          {item.description && (
            <p className="text-sm text-brand-700 whitespace-pre-wrap">{item.description}</p>
          )}

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-brand-600">
              <Calendar size={15} />
              <span>Shoot: {item.shoot_date ? format(new Date(item.shoot_date), 'MMM d, yyyy') : '—'}</span>
            </div>
            <div className="flex items-center gap-2 text-brand-600">
              <Calendar size={15} />
              <span>Upload: {item.upload_date ? format(new Date(item.upload_date), 'MMM d, yyyy') : '—'}</span>
            </div>
            <div className="flex items-center gap-2 text-brand-600 col-span-2">
              <UserIcon size={15} />
              <span>
                Assigned to {item.assigned_to_profile?.display_name || 'nobody yet'} · Created by{' '}
                {item.created_by_profile?.display_name || 'a teammate'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {STAGES.map((s) => (
              <button
                key={s.key}
                onClick={() => onStageChange(item.id, s.key)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                  s.key === item.stage
                    ? 'bg-brand-800 text-white border-brand-800'
                    : 'border-brand-200 text-brand-700 hover:bg-brand-50'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {next && (
            <button
              onClick={() => onStageChange(item.id, next.key)}
              className="btn-secondary w-full flex items-center justify-center gap-2 text-sm"
            >
              Move to {next.label} <ArrowRight size={15} />
            </button>
          )}

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-brand-500 mb-2">
              Review comments
            </h3>
            <CommentThread contentItemId={item.id} />
          </div>
        </div>

        <div className="px-5 py-3 border-t border-brand-100">
          <button
            onClick={async () => {
              await onDelete(item.id)
              onClose()
            }}
            className="flex items-center gap-1.5 text-sm font-medium text-rose-600 hover:text-rose-700"
          >
            <Trash2 size={15} /> Delete this item
          </button>
        </div>
      </div>
    </div>
  )
}
