import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileUpload } from '@/components/upload/FileUpload';
import { Toast } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';

interface ConversionResult {
  text: string;
  fileName: string;
}

export function DocumentConverter() {
  const [convertedText, setConvertedText] = useState<string>('');
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or DOCX file",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB in bytes
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive"
      });
      return;
    }
    
    setIsConverting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/convert-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Conversion failed');
      }

      const result: ConversionResult = await response.json();
      setConvertedText(result.text);
      toast({
        title: "Success",
        description: "Document converted successfully",
        variant: "default"
      });
    } catch (error) {
      console.error('Conversion failed:', error);
      toast({
        title: "Error",
        description: "Failed to convert document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConverting(false);
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(convertedText);
      toast({
        title: "Copied",
        description: "Text copied to clipboard",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy text",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Document to Text Converter</h2>
      <FileUpload 
        onUpload={handleFileUpload}
        acceptedFileTypes={['.pdf', '.docx']}
        maxSize={10}
        disabled={isConverting}
      />
      
      {isConverting && (
        <div className="mt-4 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
          <span>Converting document...</span>
        </div>
      )}
      
      {convertedText && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Converted Text:</h3>
          <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap">{convertedText}</pre>
          </div>
          <Button
            onClick={handleCopyText}
            className="mt-2"
            variant="secondary"
          >
            Copy Text
          </Button>
        </div>
      )}
    </Card>
  );
}