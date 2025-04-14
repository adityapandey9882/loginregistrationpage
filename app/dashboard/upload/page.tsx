"use client"

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { FileUploadCard } from '@/components/upload/file-upload-card'
import { FileList } from '@/components/upload/file-list'

export default function UploadPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id || null)
    }
    getUser()
  }, [supabase])

  if (!userId) return <div>Loading...</div>

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">File Management</h1>
        <FileUploadCard 
          userId={userId} 
          onUploadComplete={() => {
            // This will trigger a file list refresh
            const event = new Event('fileUploaded')
            window.dispatchEvent(event)
          }} 
        />
        <FileList userId={userId} />
      </div>
    </div>
  )
}