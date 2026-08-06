import { useEffect, useState } from 'react'
import { X, Trash2 } from 'lucide-react'
import { STAGES, PLATFORMS } from '../lib/stages'
import { useProfiles } from '../hooks/useProfiles'

const emptyForm = {
  title: '',
  description: '',
  platform: PLATFORMS[0],
  shoot_date: '',
  upload_date: '',
  stage: 'draft',
  assigned_to: '',
}

export default function ContentItemModal({ open, onClose, onSave, onDelete, item }) {
  const profiles = useProfiles()
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (item) {
      setForm({
        title: item.title || '',
        description: item.description || '',
        platform: item.platform || PLATFORMS[0],
        shoot_date: item.shoot_date || '',
        upload_date: item.upload_date || '',
        stage: item.stage || 'draft',
        assigned_to: item.assigned_to || '',
      })
    } else {
      setForm(emptyForm)
    }
  }, [item, open])

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form, assigned_to: form.assigned_to || null }
      await onSave(payload, item?.id)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-950/40 backdrop-blur-sm px-4">
      <div className="card w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-brand-900">
            {item ? 'Edit content' : 'New content'}
          </h2>
          <button onClick={onClose} className="text-brand-400 hover:text-brand-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-brand-700 mb-1">Title</label>
            <input
              required
              className="input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Diwali offer reel"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-700 mb-1">
              What's the content?
            </label>
            <textarea
              className="input"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief, caption ideas, notes…"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-brand-700 mb-1">Platform</label>
              <select
                className="input"
                value={form.platform}
                onChange={(e) => setForm({ ...form, platform: e.target.value })}
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-700 mb-1">Stage</label>
              <select
                className="input"
                value={form.stage}
                onChange={(e) => setForm({ ...form, stage: e.target.value })}
              >
                {STAGES.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-brand-700 mb-1">Shoot date</label>
              <input
                type="date"
                className="input"
                value={form.shoot_date}
                onChange={(e) => setForm({ ...form, shoot_date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-700 mb-1">Upload date</label>
              <input
                type="date"
                className="input"
                value={form.upload_date}
                onChange={(e) => setForm({ ...form, upload_date: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-700 mb-1">Assigned to</label>
            <select
              className="input"
              value={form.assigned_to}
              onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
            >
              <option value="">Unassigned</option>
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.display_name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between pt-2">
            {item ? (
              <button
                type="button"
                onClick={async () => {
                  await onDelete(item.id)
                  onClose()
                }}
                className="flex items-center gap-1.5 text-sm font-medium text-rose-600 hover:text-rose-700"
              >
                <Trash2 size={15} /> Delete
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Saving…' : item ? 'Save changes' : 'Add content'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
