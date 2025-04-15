'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getDocument } from 'pdfjs-dist';
import '../lib/pdf-worker';

interface DocumentPreviewProps {
  fileData: ArrayBuffer;
  fileType: string;
}

export function DocumentPreview({ fileData, fileType }: DocumentPreviewProps) {
  const [text, setText] = useState('');

  useEffect(() => {
    async function parseDocument() {
      try {
        if (fileType === 'pdf') {
          const loadingTask = getDocument({ data: new Uint8Array(fileData) });
          const pdf = await loadingTask.promise;
          let fullText = '';
          
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item: any) => item.str)
              .join(' ');
            fullText += pageText + '\n';
          }
          
          setText(fullText);
        } else if (fileType === 'docx') {
          const mammoth = await import('mammoth');
          const result = await mammoth.extractRawText({ arrayBuffer: fileData });
          setText(result.value);
        }
      } catch (error) {
        console.error('Error parsing document:', error);
        setText('Error parsing document');
      }
    }

    parseDocument();
  }, [fileData, fileType]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="bg-gray-50 p-4 rounded-lg max-h-[70vh] overflow-y-auto">
        <pre className="whitespace-pre-wrap">{text}</pre>
      </div>
      <Button 
        onClick={() => navigator.clipboard.writeText(text)}
        className="mt-4"
      >
        Copy Text
      </Button>
    </div>
  );
}