"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { File } from "lucide-react"
import { getFiles } from '@/lib/supabase/storage-utils'

export function FileList({ userId }: { userId: string }) {
  const [files, setFiles] = useState<any[]>([])

  useEffect(() => {
    loadFiles()
  }, [userId])

  const loadFiles = async () => {
    try {
      const files = await getFiles(userId)
      setFiles(files || [])
    } catch (error) {
      console.error("Error loading files:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Files</CardTitle>
      </CardHeader>
      <CardContent>
        {files.length === 0 ? (
          <p className="text-center text-muted-foreground">No files uploaded yet</p>
        ) : (
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.name}
                className="flex items-center p-2 rounded-lg border"
              >
                <File className="h-4 w-4 mr-2" />
                <span>{file.name}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}