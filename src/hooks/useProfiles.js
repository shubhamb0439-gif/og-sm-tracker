import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useProfiles() {
  const [profiles, setProfiles] = useState([])

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, display_name, email')
      .order('display_name')
      .then(({ data }) => setProfiles(data || []))
  }, [])

  return profiles
}
