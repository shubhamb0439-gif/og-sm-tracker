import { supabase } from './supabaseClient'

const BUCKET = 'content-media'
const MAX_SIZE_MB = 100

export function mediaKind(file) {
  if (file.type.startsWith('video/')) return 'video'
  if (file.type.startsWith('image/')) return 'image'
  return null
}

export async function uploadMedia(file, userId) {
  const kind = mediaKind(file)
  if (!kind) throw new Error('Only image or video files are supported.')
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`File is too large — max ${MAX_SIZE_MB}MB.`)
  }

  const ext = file.name.split('.').pop()
  const path = `${userId}/${crypto.randomUUID()}.${ext}`
  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file)
  if (uploadError) throw uploadError

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return { media_url: data.publicUrl, media_path: path, media_type: kind }
}

export async function deleteMedia(path) {
  if (!path) return
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) console.error('Failed to delete old media file:', error.message)
}
