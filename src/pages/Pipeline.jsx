import { useState } from 'react'
import { Plus, Calendar } from 'lucide-react'
import Layout from '../components/Layout'
import { STAGES } from '../lib/stages'
import { useContentItems } from '../hooks/useContentItems'
import { useAuth } from '../context/AuthContext'
import ContentItemModal from '../components/ContentItemModal'
import PipelineDetail from '../components/PipelineDetail'
import { format } from 'date-fns'

export default function Pipeline() {
  const { user } = useAuth()
  const { items, addItem, updateItem, deleteItem } = useContentItems()
  const [modalOpen, setModalOpen] = useState(false)
  const [activeItem, setActiveItem] = useState(null)
  const [dragOverStage, setDragOverStage] = useState(null)
  const [boardError, setBoardError] = useState('')

  const handleSave = async (payload, id) => {
    if (id) await updateItem(id, payload)
    else await addItem(payload, user.id)
  }

  const handleStageChange = async (id, stage) => {
    setBoardError('')
    try {
      await updateItem(id, { stage })
      setActiveItem((prev) => (prev && prev.id === id ? { ...prev, stage } : prev))
    } catch (err) {
      setBoardError(err.message || 'Could not update the stage. Please try again.')
    }
  }

  const handleDrop = (stage) => async (e) => {
    e.preventDefault()
    setDragOverStage(null)
    const id = e.dataTransfer.getData('text/plain')
    if (!id) return
    setBoardError('')
    try {
      await updateItem(id, { stage })
    } catch (err) {
      setBoardError(err.message || 'Could not move the card. Please try again.')
    }
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-900">Content Creation Pipeline</h1>
          <p className="text-sm text-brand-500 mt-1">
            Drag a card to move it through review, revisions, and posting.
          </p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-1.5">
          <Plus size={16} /> New content
        </button>
      </div>

      {boardError && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{boardError}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {STAGES.map((stage) => {
          const stageItems = items.filter((i) => i.stage === stage.key)
          return (
            <div
              key={stage.key}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOverStage(stage.key)
              }}
              onDragLeave={() => setDragOverStage((s) => (s === stage.key ? null : s))}
              onDrop={handleDrop(stage.key)}
              className={`rounded-2xl p-3 min-h-[60vh] transition-colors ${
                dragOverStage === stage.key ? 'bg-brand-100' : 'bg-brand-50/60'
              }`}
            >
              <div className="flex items-center gap-2 px-1 mb-3">
                <span className={`h-2 w-2 rounded-full ${stage.dot}`} />
                <h2 className="text-sm font-bold text-brand-800">{stage.label}</h2>
                <span className="text-xs text-brand-400 ml-auto">{stageItems.length}</span>
              </div>

              <div className="space-y-2.5">
                {stageItems.map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('text/plain', item.id)}
                    onClick={() => setActiveItem(item)}
                    className="card p-3 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-transform"
                  >
                    <p className="text-sm font-semibold text-brand-900 line-clamp-2">{item.title}</p>
                    {item.platform && (
                      <p className="text-[11px] text-brand-500 mt-1">{item.platform}</p>
                    )}
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center gap-1 text-[11px] text-brand-400">
                        <Calendar size={12} />
                        {item.upload_date ? format(new Date(item.upload_date), 'MMM d') : 'No date'}
                      </div>
                      {item.assigned_to_profile?.display_name && (
                        <span className="h-5 w-5 rounded-full bg-brand-700 text-white text-[9px] font-bold flex items-center justify-center">
                          {item.assigned_to_profile.display_name.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {stageItems.length === 0 && (
                  <p className="text-xs text-brand-300 italic px-1">No items</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <ContentItemModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} />
      {activeItem && (
        <PipelineDetail
          item={activeItem}
          onClose={() => setActiveItem(null)}
          onStageChange={handleStageChange}
          onDelete={deleteItem}
        />
      )}
    </Layout>
  )
}
