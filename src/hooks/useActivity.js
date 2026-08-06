import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useActivity(limit = 15) {
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchActivity = useCallback(async () => {
    const { data } = await supabase
      .from('activity_log')
      .select('*, actor:actor_id(display_name), content_item:content_item_id(title)')
      .order('created_at', { ascending: false })
      .limit(limit)
    setActivity(data || [])
    setLoading(false)
  }, [limit])

  useEffect(() => {
    fetchActivity()
    const channel = supabase
      .channel('activity_log_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_log' }, () => {
        fetchActivity()
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [fetchActivity])

  return { activity, loading }
}
