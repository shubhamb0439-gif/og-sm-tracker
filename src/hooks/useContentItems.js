import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { deleteMedia } from '../lib/media'

export function useContentItems() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchItems = useCallback(async () => {
    const { data, error } = await supabase
      .from('content_items')
      .select('*, created_by_profile:created_by(display_name), assigned_to_profile:assigned_to(display_name)')
      .order('updated_at', { ascending: false })
    if (error) {
      setError(error.message)
    } else {
      setItems(data)
      setError('')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchItems()
    const channel = supabase
      .channel('content_items_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'content_items' }, () => {
        fetchItems()
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [fetchItems])

  const addItem = async (payload, userId) => {
    const { error } = await supabase
      .from('content_items')
      .insert([{ ...payload, created_by: userId }])
    if (error) throw error
    await fetchItems()
  }

  const updateItem = async (id, payload) => {
    const { error } = await supabase.from('content_items').update(payload).eq('id', id)
    if (error) throw error
    await fetchItems()
  }

  const deleteItem = async (id) => {
    const target = items.find((i) => i.id === id)
    const { error } = await supabase.from('content_items').delete().eq('id', id)
    if (error) throw error
    if (target?.media_path) await deleteMedia(target.media_path)
    await fetchItems()
  }

  return { items, loading, error, addItem, updateItem, deleteItem, refresh: fetchItems }
}
