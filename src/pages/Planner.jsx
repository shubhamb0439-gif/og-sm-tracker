import { useMemo, useState } from 'react'
import { Plus, Camera, Upload, Pencil } from 'lucide-react'
import Layout from '../components/Layout'
import { useContentItems } from '../hooks/useContentItems'
import { useAuth } from '../context/AuthContext'
import ContentItemModal from '../components/ContentItemModal'
import { stageMeta } from '../lib/stages'
import { format, isPast, isToday, parseISO } from 'date-fns'

export default function Planner() {
  const { user } = useAuth()
  const { items, addItem, updateItem, deleteItem } = useContentItems()
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [sortBy, setSortBy] = useState('upload_date')

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => {
      const av = a[sortBy] || '9999-12-31'
      const bv = b[sortBy] || '9999-12-31'
      return av.localeCompare(bv)
    })
  }, [items, sortBy])

  const handleSave = async (payload, id) => {
    if (id) await updateItem(id, payload)
    else await addItem(payload, user.id)
  }

  const openEdit = (item) => {
    setEditItem(item)
    setModalOpen(true)
  }

  const openNew = () => {
    setEditItem(null)
    setModalOpen(true)
  }

  const dateBadge = (dateStr) => {
    if (!dateStr) return 'text-brand-400'
    const d = parseISO(dateStr)
    if (isToday(d)) return 'text-amber-600 font-semibold'
    if (isPast(d)) return 'text-rose-500 font-semibold'
    return 'text-brand-700'
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-900">Content Planner</h1>
          <p className="text-sm text-brand-500 mt-1">Plan what's being shot and when it goes live.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="input w-auto text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="upload_date">Sort by upload date</option>
            <option value="shoot_date">Sort by shoot date</option>
          </select>
          <button onClick={openNew} className="btn-primary flex items-center gap-1.5">
            <Plus size={16} /> Add content
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-brand-400 border-b border-brand-100">
                <th className="px-4 py-3 font-semibold">Content</th>
                <th className="px-4 py-3 font-semibold">Platform</th>
                <th className="px-4 py-3 font-semibold">
                  <span className="inline-flex items-center gap-1.5">
                    <Camera size={13} /> Shoot date
                  </span>
                </th>
                <th className="px-4 py-3 font-semibold">
                  <span className="inline-flex items-center gap-1.5">
                    <Upload size={13} /> Upload date
                  </span>
                </th>
                <th className="px-4 py-3 font-semibold">Stage</th>
                <th className="px-4 py-3 font-semibold">Assigned to</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((item) => {
                const meta = stageMeta(item.stage)
                return (
                  <tr key={item.id} className="border-b border-brand-50 last:border-0 hover:bg-brand-50/50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-brand-900">{item.title}</p>
                      {item.description && (
                        <p className="text-xs text-brand-400 line-clamp-1 max-w-xs">{item.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-brand-600">{item.platform || '—'}</td>
                    <td className={`px-4 py-3 ${dateBadge(item.shoot_date)}`}>
                      {item.shoot_date ? format(parseISO(item.shoot_date), 'MMM d, yyyy') : '—'}
                    </td>
                    <td className={`px-4 py-3 ${dateBadge(item.upload_date)}`}>
                      {item.upload_date ? format(parseISO(item.upload_date), 'MMM d, yyyy') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${meta.badge}`}>{meta.label}</span>
                    </td>
                    <td className="px-4 py-3 text-brand-600">
                      {item.assigned_to_profile?.display_name || '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openEdit(item)}
                        className="text-brand-400 hover:text-brand-700"
                      >
                        <Pencil size={15} />
                      </button>
                    </td>
                  </tr>
                )
              })}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-brand-400">
                    No content planned yet. Click "Add content" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ContentItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        onDelete={deleteItem}
        item={editItem}
      />
    </Layout>
  )
}
