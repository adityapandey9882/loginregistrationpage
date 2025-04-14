"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { uploadFile } from '@/lib/supabase/storage-utils'

export function FileUploadCard({ userId, onUploadComplete }: { 
  userId: string;
  onUploadComplete: () => void;
}) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const handleUpload = async () => {
    if (!file) return

    try {
      setUploading(true)
      await uploadFile(file, userId)
      toast({
        title: "Success",
        description: "File uploaded successfully"
      })
      setFile(null)
      onUploadComplete()
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
    <Card>
      <CardHeader>
        <CardTitle>Upload File</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
        />
        <Button 
          onClick={handleUpload} 
          disabled={!file || uploading}
          className="w-full"
        >
          {uploading ? (
            "Uploading..."
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}