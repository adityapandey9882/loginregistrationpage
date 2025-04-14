import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export async function uploadFile(file: File, userId: string) {
  const supabase = createClientComponentClient()
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}-${Math.random()}.${fileExt}`

  // Upload file to Supabase storage
  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(`${userId}/${fileName}`, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) throw error
  return data
}

export async function getFiles(userId: string) {
  const supabase = createClientComponentClient()
  
  // List files from the specific user's folder
  const { data, error } = await supabase.storage
    .from('uploads')
    .list(userId, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' }
    })

  if (error) throw error
  return data
}