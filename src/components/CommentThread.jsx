import { useCallback, useEffect, useState } from 'react'
import { Send } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { formatDistanceToNow } from 'date-fns'

export default function CommentThread({ contentItemId }) {
  const { user } = useAuth()
  const [comments, setComments] = useState([])
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)

  const fetchComments = useCallback(async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, author:author_id(display_name)')
      .eq('content_item_id', contentItemId)
      .order('created_at', { ascending: true })
    setComments(data || [])
  }, [contentItemId])

  useEffect(() => {
    fetchComments()
    const channel = supabase
      .channel(`comments_${contentItemId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'comments', filter: `content_item_id=eq.${contentItemId}` },
        fetchComments
      )
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [contentItemId, fetchComments])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!body.trim()) return
    setSending(true)
    await supabase
      .from('comments')
      .insert([{ content_item_id: contentItemId, author_id: user.id, body: body.trim() }])
    setBody('')
    setSending(false)
  }

  return (
    <div className="flex flex-col">
      <div className="space-y-3 max-h-56 overflow-y-auto pr-1 mb-3">
        {comments.length === 0 && (
          <p className="text-sm text-brand-400 italic">No review notes yet.</p>
        )}
        {comments.map((c) => (
          <div key={c.id} className="flex gap-2">
            <div className="h-7 w-7 shrink-0 rounded-full bg-brand-100 text-brand-700 text-[11px] font-bold flex items-center justify-center">
              {(c.author?.display_name || '?').slice(0, 2).toUpperCase()}
            </div>
            <div className="bg-brand-50 rounded-xl rounded-tl-none px-3 py-2 text-sm flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-semibold text-brand-800 text-xs">
                  {c.author?.display_name || 'Someone'}
                </span>
                <span className="text-[10px] text-brand-400 shrink-0">
                  {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
                </span>
              </div>
              <p className="text-brand-800 mt-0.5">{c.body}</p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          className="input"
          placeholder="Add a review comment…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button type="submit" disabled={sending} className="btn-primary px-3">
          <Send size={16} />
        </button>
      </form>
    </div>
  )
}
