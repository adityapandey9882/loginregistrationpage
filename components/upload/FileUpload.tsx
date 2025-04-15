"use client"

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useToast } from "@/components/ui/use-toast"
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { DownloadButton } from './DownloadButton';

interface FileUploadProps {
  onUpload: (file: File) => void;
  acceptedFileTypes?: string[];
  maxSize?: number;
  disabled?: boolean;
  isUploading?: boolean;
  progress?: number;  // Add progress prop
}

export function FileUpload({ 
  onUpload, 
  acceptedFileTypes = ['.pdf', '.docx', '.txt'],
  maxSize = 10, 
  disabled = false,
  isUploading = false,
  progress = 0
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();  // Add this line

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          title: "Error",
          description: `File size must be less than ${maxSize}MB`,
          variant: "destructive"
        });
        return;
      }
      setSelectedFile(file);
      onUpload(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept={acceptedFileTypes.join(',')}
        className="hidden"
        disabled={disabled || isUploading}
      />
      <Button 
        onClick={handleClick}
        disabled={disabled || isUploading}
        variant="outline"
        className="w-full max-w-xs"
      >
        {isUploading ? 'Uploading...' : 'Choose File'}
      </Button>

      {selectedFile && (
        <div className="text-sm text-gray-600">
          Selected: {selectedFile.name}
        </div>
      )}

      {isUploading && (
        <div className="w-full max-w-xs">
          <div className="bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-center text-sm text-gray-600 mt-1">
            {progress}%
          </div>
        </div>
      )}

      <p className="text-sm text-gray-500">
        Accepted files: {acceptedFileTypes.join(', ')} (Max {maxSize}MB)
      </p>
    </div>
  );
}

// Add these imports at the top
import { pdfjsLib } from '@/lib/pdf-worker';
import mammoth from 'mammoth';

export default function FileUploadContainer() {
  // Add these new state variables
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFilePath, setUploadedFilePath] = useState<string | null>(null);
  const supabase = createClientComponentClient();
  const { toast } = useToast();
  const router = useRouter();  // Add router here

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      setProgress(0);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');

      const fileName = `${user.id}/${Date.now()}_${file.name}`;

      const { error, data } = await supabase.storage
            .from('files')
            .upload(fileName, file, {
              upsert: false,
              cacheControl: '3600',
            });
      
      if (error) throw error;
      
      // Simulate upload progress since direct progress tracking isn't available
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      setUploadedFilePath(fileName);
      toast({
        title: "Success",
        description: "File uploaded successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  // Remove handleDownload and handlePreview functions as they're now in separate components

  const handleConvertClick = async (filePath: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.storage
        .from('files')
        .download(filePath);
  
      if (error) throw error;
  
      const buffer = await data.arrayBuffer();
      const fileType = filePath.split('.').pop()?.toLowerCase();
  
      let extractedText = '';
  
      if (fileType === 'pdf') {
        // Wait for PDF.js to be ready
        await new Promise(resolve => setTimeout(resolve, 1000));
        const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
        const numPages = pdf.numPages;
        const textPromises = [];
  
        for (let i = 1; i <= numPages; i++) {
          textPromises.push(
            pdf.getPage(i).then(page => 
              page.getTextContent().then(content => 
                content.items.map((item: any) => item.str).join(' ')
              )
            )
          );
        }
  
        const pageTexts = await Promise.all(textPromises);
        extractedText = pageTexts.join('\n\n');
      } else if (fileType === 'docx') {
        const result = await mammoth.extractRawText({ arrayBuffer: buffer });
        extractedText = result.value;
      }
  
      if (!extractedText) {
        throw new Error('No text could be extracted');
      }
  
      setText(extractedText);
      router.push(`/dashboard/preview/${encodeURIComponent(filePath)}`);
    } catch (err) {
      console.error('Conversion error:', err);
      toast({
        title: "Error",
        description: "Failed to convert document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Upload a file</h2>
      <FileUpload 
        onUpload={handleUpload} 
        isUploading={uploading}
        progress={progress}
        acceptedFileTypes={['.pdf', '.docx']}
        maxSize={10}
      />

      {uploadedFilePath && (
        <div className="mt-4 flex gap-4">
          <DownloadButton filePath={uploadedFilePath} />
          <Button 
            onClick={() => router.push(`/dashboard/convert/${encodeURIComponent(uploadedFilePath)}`)}
            variant="secondary"
          >
            Convert to Text
          </Button>
        </div>
      )}
    </div>
  );
}