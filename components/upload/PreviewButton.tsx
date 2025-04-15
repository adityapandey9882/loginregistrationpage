'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface PreviewButtonProps {
  filePath: string;
}

export function PreviewButton({ filePath }: PreviewButtonProps) {
  const router = useRouter();

  const handlePreview = () => {
    router.push(`/dashboard/preview/${encodeURIComponent(filePath)}`);
  };

  return (
    <Button onClick={handlePreview} variant="outline">
      Preview
    </Button>
  );
}