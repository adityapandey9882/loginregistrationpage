"use client"

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useToast } from "@/components/ui/use-toast"
import { FileUpload } from "@/components/ui/file-upload"

export default function FileUploadContainer() {
  const [uploading, setUploading] = useState(false)
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const handleUpload = async (file: File) => {
    try {
      setUploading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('Not authenticated')

      const fileName = `${user.id}/${Date.now()}_${file.name}`

      const { error } = await supabase.storage
        .from('files')
        .upload(fileName, file, {
          upsert: false
        })

      if (error) {
        throw error
      }

      toast({
        title: "Success",
        description: "File uploaded successfully"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Upload a file</h2>
      <FileUpload onUpload={handleUpload} isUploading={uploading} />
    </div>
  )
}