'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { pdfjsLib } from '@/lib/pdf-worker';
import mammoth from 'mammoth';
import { useParams } from 'next/navigation';

export default function PreviewPage() {
  const [text, setText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  const params = useParams();
  const filePath = decodeURIComponent(params.filePath as string);
  const fileType = filePath.split('.').pop()?.toLowerCase() || '';

  useEffect(() => {
    async function fetchAndParseDocument() {
      try {
        setLoading(true);
        const { data, error } = await supabase.storage
          .from('files')
          .download(filePath);

        if (error) throw error;

        const buffer = await data.arrayBuffer();

        if (fileType === 'pdf') {
          const pdf = await pdfjsLib.getDocument(new Uint8Array(buffer)).promise;
          let fullText = '';
          
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items
              .map((item: any) => item.str)
              .join(' ');
            fullText += pageText + '\n';
          }
          setText(fullText);
        } else if (fileType === 'docx') {
          const result = await mammoth.extractRawText({ arrayBuffer: buffer });
          setText(result.value);
        }
      } catch (err) {
        console.error(err);
        setError('Error loading document');
      } finally {
        setLoading(false);
      }
    }

    fetchAndParseDocument();
  }, [filePath, fileType, supabase.storage]);

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-500">{error}</h1>
        <Link href="/dashboard">
          <Button className="mt-4">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Document Preview</h1>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
      
      {loading ? (
        <div className="text-center">Loading document...</div>
      ) : (
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
      )}
    </div>
  );
}