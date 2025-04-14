"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import { Cloud, File, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
// import { Progress } from "@/components/ui/progress"

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>
  isUploading?: boolean
}

export function FileUpload({ onUpload, isUploading }: FileUploadProps) {
  const [file, setFile] = React.useState<File | null>(null)

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
  })

  const handleUpload = async () => {
    if (file) {
      await onUpload(file)
      setFile(null)
    }
  }

  return (
    <div className="grid gap-4">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <Cloud className="h-10 w-10 text-gray-400" />
          {isDragActive ? (
            <p>Drop the file here</p>
          ) : (
            <p>Drag & drop a file here, or click to select</p>
          )}
        </div>
      </div>

      {file && (
        <div className="flex items-center gap-4">
          <File className="h-8 w-8" />
          <div className="flex-1">
            <p className="text-sm">{file.name}</p>
            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
          </div>
          <Button onClick={handleUpload} disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading
              </>
            ) : (
              'Upload'
            )}
          </Button>
        </div>
      )}
    </div>
  )
}