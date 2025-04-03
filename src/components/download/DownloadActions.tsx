
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface DownloadActionsProps {
  onDownload: () => void;
  onDirectDownload: () => void;
  isDownloading: boolean;
}

const DownloadActions: React.FC<DownloadActionsProps> = ({ 
  onDownload, 
  onDirectDownload, 
  isDownloading 
}) => {
  return (
    <div className="space-y-2 w-full">
      <Button 
        onClick={onDownload} 
        className="france-inter-bg hover:bg-blue-700 w-full" 
        disabled={isDownloading}
      >
        <Download className="h-4 w-4 mr-2" />
        {isDownloading ? "Préparation..." : "Télécharger"}
      </Button>
      <button 
        onClick={onDirectDownload}
        className="text-xs text-muted-foreground underline hover:text-blue-600 w-full text-center"
      >
        Télécharger directement depuis la source
      </button>
    </div>
  );
};

export default DownloadActions;
