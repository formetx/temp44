
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface DownloadProgressProps {
  progress: number;
}

const DownloadProgress: React.FC<DownloadProgressProps> = ({ progress }) => {
  return (
    <div className="space-y-2 w-full">
      <Progress value={progress} className="h-2" />
      <p className="text-xs text-muted-foreground">{progress}% téléchargé</p>
    </div>
  );
};

export default DownloadProgress;
