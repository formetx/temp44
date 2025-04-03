
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, ExternalLink } from 'lucide-react';

interface DownloadErrorProps {
  onRetry: () => void;
  onDirectDownload: () => void;
}

const DownloadError: React.FC<DownloadErrorProps> = ({ 
  onRetry,
  onDirectDownload 
}) => {
  return (
    <div className="space-y-2 w-full">
      <Button variant="outline" className="bg-red-50 text-red-600 border-red-200 w-full" onClick={onRetry}>
        <AlertCircle className="h-4 w-4 mr-2" />
        Réessayer
      </Button>
      <Button variant="ghost" size="sm" className="w-full text-xs" onClick={onDirectDownload}>
        <ExternalLink className="h-3.5 w-3.5 mr-1" />
        Télécharger directement depuis la source
      </Button>
    </div>
  );
};

export default DownloadError;
